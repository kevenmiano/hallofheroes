/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description  角色信息基类
 **/

import ConfigMgr from "../../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import Logger from "../../../../core/logger/Logger";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { MovieClip } from "../../../component/MovieClip";
import { ActionMovie } from "../../../component/tools/ActionMovie";
import { t_s_skillbuffertemplateData } from "../../../config/t_s_skillbuffertemplate";
import { ActionLabesType, BattleType, BloodType, FaceType, InheritIActionType, InheritRoleType, } from "../../../constant/BattleDefine";
import { ConfigType } from "../../../constant/ConfigDefine";
import { BattleNotic, RoleEvent } from "../../../constant/event/NotificationEvent";
import { IAction } from "../../../interfaces/IAction";
import { NotificationManager } from "../../../manager/NotificationManager";
import { BattleManager } from "../../BattleManager";
import { BattleActionQueue } from "../../queue/BattleActionQueue";
import { RoleSkillQueue } from "../../queue/RoleSkillQueue";
import { BattleUtils } from "../../utils/BattleUtils";
import { BaseRoleView } from "../../view/roles/BaseRoleView";
import { BloodUpdateVO } from "../BloodUpdateVO";
import { BufferDamageData } from "../BufferDamageData";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";

export class BaseRoleInfo extends GameEventDispatcher {
    public inheritType: InheritRoleType = InheritRoleType.Default

    public static POS_HEAD: number = 1;
    public static POS_BODY: number = 2;
    public static POS_LEG: number = 3;
    /**
     * 血量更新的cd值 的默认值
     */
    private static BLOOD_UPDATE_CD: number = 2
    /********************************************************************************/

    /**
     * 角色在当前战斗中的id, 每场战斗不一样。由战斗服务器动态创建
     */
    public livingId: number = 0;
    /**
     * 角色的默认动作
     */
    protected _defaultAction: string = "";
    /**
     * 角色是否被某个技能锁定, 
     * 当该值不为空时, 该角色被锁定, 不能做任何动作, 
     * 角色技能队列也不会分发技能给角色
     * 任何角色执行任何技能都至少会锁定一个及以上的对象
     */
    public affectedSkill: IAction;
    /**
     * 攻击形态 , 普通0  格挡1  攻击2
     * 不同攻击形态有不同的颜色显示, 并且攻击属性会有变化
     */
    private _attackMode: number = 0;

    public effectId: string = "";

    /**
     * 动作
     */
    private _action: string = "";
    /**
     * 坐标点
     */
    protected _point: Laya.Point = new Laya.Point();
    /**
     * 是否存活
     */
    private _isLiving: boolean = true;
    /**
     * 阵营
     */
    private _side: number = 0;
    /**
     * 是否显示
     */
    private _setVisible: boolean = false;
    private _pointZ: number = 0;
    /**
     * 水平翻转
     */
    private _scaleX: number = 1;

    /**
     * 当前英雄是否需要创建视图view
     * false需要显示  true为不显示
     */
    public needShow: boolean = false;
    /**
     * 是否显示残影
     */
    public showShadow: boolean = false;
    /**
     * 位置
     */
    public pos: number = 0;
    /**
     * 阵形
     */
    public lineUp: number = 0;
    /**
     * 朝向(此朝向为队伍固定的, 不能改, 如需动态改朝向, 访问direction属性)
     */
    private _face: number = 0;
    private _direction: string = "right";
    private _isLoadComplete: boolean = false;
    /**
     * 当前血量
     */
    private _currentBlood: number = 0;
    public canTakeDamage: boolean = true;
    /**
     * 服务器字段名
     */
    public battleServerName: string = "";
    protected _templateId: number = 0;
    /**
     * 单兵血量
     */
    private _baseBlood: number = 0;
    /**
     * 血量计算.该值反映了单兵血量条的真实值.
     */
    private _bloodCalculate: number = 0;
    /**
     *  是否已经死亡。执行了dieaction动作
     */
    public dying: boolean = false;

    private _specialPosHead: Laya.Point;
    private _specialPosBody: Laya.Point;
    private _specialPosLeg: Laya.Point;

    public coldDownTime: number = 0;
    public coldDownFrame: number = -1;

    private _restricted: boolean = false;//
    private _moving: boolean = false;

    public readyFlag: boolean = false;
    /**
     * 做排序用; 
     */
    public type: number = 0;

    private _bloodA: number = 0;

    /**
     * 角色自身血量.
     */
    public get bloodA(): number {
        return this._bloodA;
    }

    /**
     * @private
     */
    public set bloodA(value: number) {
        this._bloodA = value;
    }

    private _totalBloodA: number = 0;

    public get totalBloodA(): number {
        return this._totalBloodA;
    }

    public set totalBloodA(value: number) {
        this._totalBloodA = value;
    }

    public initBloodA: number = 0;
    /**
     * 角色所带的兵的血量(如果本身是兵,则该值为0)
     */
    public bloodB: number = 0;
    public totalBloodB: number = 0;
    public initBloodB: number = 0;
    public maxHp: number = 0;//士兵最大血量

    /**
     * 血量更新缓冲器.用于连续掉血情况下间隔显示每次掉血
     */
    private _bloodUpdateBuffer: Array<BloodUpdateVO>
    private _bloodUpdateCD: number = 0;


    public skillIds: Array<any>;
    public map: any;
    private _buffers: Array<BufferDamageData>
    private _cacheAction: Array<any>;
    protected _roleView: BaseRoleView;
    protected _actionMovie: ActionMovie;

    /**
     * 角色身上的动作序列, 角色按照该动作序列里面的动作信息执行动作脚本
     */
    public _actionManager: BattleActionQueue;
    /**
     * 并行动作序列.
     * 添加到该序列的动作,不受 _actionManager 中的动作序列的限制,可与之并行地执行.
     */
    private _concurrentActions: Array<IAction>;
    /**
     * 角色身上的技能队列, 该队列里面的action由技能系统分发, 
     * 角色执行时将技能分解为动作, 交给角色动作队列
     */
    private _skillQueue: RoleSkillQueue;


    public constructor() {
        super();
        this._actionMovie = new ActionMovie();
        this._actionManager = new BattleActionQueue();
        this._skillQueue = new RoleSkillQueue(this);

        this._concurrentActions = new Array<IAction>();
        this._buffers = new Array<BufferDamageData>();
        this._bloodUpdateBuffer = new Array<BloodUpdateVO>();


        this.defaultAction = ActionLabesType.STAND;
    }

    private _startload: boolean = false;

    public load() {
        if (this._roleView && !this._startload) {
            this._roleView.load();
            this._startload = true;
        }
    }

    public initView(roleview: BaseRoleView) {
        this._roleView = roleview
    }

    public get isOver(): boolean {
        return this._actionManager.isOver;
    }

    public get view(): BaseRoleView {
        return this.getRoleView();
    }

    public getRoleView(): BaseRoleView {
        return this._roleView;
    }

    /**
     * 和自己相同就放左边, 否则放右边
     * @return
     *
     */
    public get side(): number {
        return this._side;
    }

    public moveForward(point: Laya.Point) {
        if (this.scaleX > 0) {
            this.point = new Laya.Point(this.point.x + point.x, this.point.y + point.y);
            //this.point = this.point;
        }
        else {
            this.point = new Laya.Point(this.point.x - point.x, this.point.y + point.y);
            //this.point = this.point;
        }
    }

    public set side(value: number) {
        this._side = value;
    }

    public get templateId(): number {
        return this._templateId;
    }

    public set templateId(value: number) {
        this._templateId = value;
    }

    public get blood(): number {
        return this._currentBlood;
    }

    public get baseBlood(): number {
        return this._baseBlood;
    }

    public set baseBlood(value: number) {
        this._baseBlood = value;

    }

    public get totalBlood(): number {
        return this._totalBlood;
    }

    public set totalBlood(value: number) {
        this._totalBlood = value;
        this._bloodCalculate = this._totalBlood;
    }

    public get bloodCalculate(): number {
        return this._bloodCalculate;
    }

    private updateBloodCalculate(value: number) {
        this._bloodCalculate += value;
        if (this._bloodCalculate < 0) {
            this._bloodCalculate = 0
        }
        else if (this._bloodCalculate > this._totalBlood) {
            this._bloodCalculate = this._totalBlood
        }
    }

    private _totalBlood: number = 0;

    public updateBlood(value: number,
        displayValue: number,
        havoc: boolean = false,
        type: number = BloodType.BLOOD_TYPE_SELF,
        selfCauseVal: boolean = false,
        defaultSkill: boolean = false,
        parry: boolean = false) {
        let vo: BloodUpdateVO = new BloodUpdateVO();
        vo.blood = value;
        vo.displayBlood = displayValue;
        vo.havoc = havoc;
        vo.type = type;
        vo.selfCause = selfCauseVal;
        vo.defaultSkill = defaultSkill;
        vo.parry = parry;

        this._bloodUpdateBuffer.push(vo);

        if (this._bloodUpdateBuffer.length == 1) {
            if (this._bloodUpdateBuffer.length == 1) {
                this.realUpdateBlood(vo.blood, vo.displayBlood,
                    vo.havoc, vo.type, vo.selfCause, vo.defaultSkill, vo.parry);
                this._bloodUpdateCD = BaseRoleInfo.BLOOD_UPDATE_CD;
            }
        }
    }

    /**
     * 直接更新血量,而不进行其他操作.
     * 目前只针对世界BOSS使用.
     * @param value
     *
     */
    public updateBloodSecurity(value: number) {
        this.bloodA += value;
        this.dispatchEvent(RoleEvent.BLOOD_CHANGE_S, this);
    }

    private realUpdateBlood(value: number, displayValue: number,
        havoc: boolean = false,
        type: number = BloodType.BLOOD_TYPE_SELF,
        selfCauseVal: boolean = false,
        defaultSkill: boolean = false,
        parry: boolean = false) {

        if (type == BloodType.BLOOD_TYPE_SELF ||
            type == BloodType.BLOOD_MAXHP) {
            // BattleLogSystem.addBloodLogDataII(this, value);

            //【【例维】泰拉神庙第一个boss, 血量同步异常】https://www.tapd.cn/36229514/bugtrace/bugs/view?bug_id=1136229514001044007
            // mark by jeremy 同步多人本房间共享boss血量同步暂时以U_C_SYNC_ROOM_BOSS_HP = 0x1379为准
            if (BattleManager.Instance.battleModel.isRoomBoss(this.livingId)) {
                Logger.battle("[BaseRoleInfo]忽略  同步多人本房间共享boss血量同步")
            } else {
                this.bloodA += value;
                if (this.bloodA < 0) {
                    this.bloodA = 0;
                }
                this._currentBlood = this.bloodA;
            }
        }
        else if (type == BloodType.BLOOD_TYPE_ARMY) {
            // BattleLogSystem.addBloodLogDataII(this, value);
            this.bloodB += displayValue;
            if (this.bloodB < 0) {
                this.bloodB = 0;
            }
        }
        else if (type == BloodType.REVIVE) {
            // BattleLogSystem.addBloodLogDataII(this, value);
            this.bloodA += value;
            if (this.bloodA < 0) {
                this.bloodA = 0;
            }
            this._currentBlood = this.bloodA;
        }
        this.dispatchEvent(RoleEvent.BLOOD_CHANGE,
            {
                bloodType: type,
                blood: value, displayBlood: displayValue,
                havoc: havoc, selfCause: selfCauseVal,
                isDefault: defaultSkill, isParry: parry
            });
    }

    public get setVisible(): boolean {
        return this._setVisible;
    }

    public get scaleX(): number {
        return this._scaleX;
    }

    public set scaleX(value: number) {
        this._scaleX = value;
        this.dispatchEvent(RoleEvent.SCALE_X, value);
    }

    public get isLiving(): boolean {
        return this._isLiving;
    }

    private updateRestrictState() {
        let buffer: BufferDamageData;
        let tempInfo: t_s_skillbuffertemplateData;

        if (this._restricted) {
            for (let i: number = 0; i < this._buffers.length; i++) {
                buffer = this._buffers[i];
                tempInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, buffer.templateId);
                if (tempInfo.AttackType == 19) {
                    return;
                }
            }
            this._restricted = false;
            // if(BattleManager.Instance.battleModel.selfHero === this)
            if (BattleManager.Instance.battleModel.selfHero instanceof BaseRoleInfo) {
                NotificationManager.Instance.sendNotification(BattleNotic.RESTRICT_CHANGED)
            }
        }
    }

    public set isLiving(value: boolean) {
        this._isLiving = value;
        if (!this._isLiving) {
            if (this._actionMovie) {
                this.die();
            } else {
                Logger.warn("[BaseRoleView] _actionMovie 不存在", this.livingId)
            }
        }
        this.dispatchEvent(RoleEvent.IS_LIVING, value);
    }

    private _riveve: boolean = false;
    public set riveve(value: boolean) {
        this._riveve = value;
        if (this._riveve) {
            this.defaultAction = ActionLabesType.STAND;
            this.action(ActionLabesType.STAND, ActionMovie.REPEAT);
        }
    }

    /**
     *
     * @param dannyEffectData 可以是DannyEffectData类型。
     *
     */
    public showDannyEffect(dannyEffectData: Object) {
        this.dispatchEvent(RoleEvent.EFFECT_PLAY, dannyEffectData);
    }

    protected die() {
        this.dispatchEvent(RoleEvent.DIE, this);
    }

    public get point(): Laya.Point {
        if (!this._point) {
            let isLeft: boolean = this.face == FaceType.RIGHT_TEAM ? true : false;
            this._point = isLeft ? BattleUtils.getPosition(FaceType.LEFT_TEAM, this.pos) : BattleUtils.getPosition(FaceType.RIGHT_TEAM, this.pos)
        }
        return this._point;
    }

    public set point(value: Laya.Point) {
        this._point = new Laya.Point(value.x, value.y)
        this._point.x = Math.floor(this._point.x);
        this._point.y = Math.floor(this._point.y);

        this.dispatchEvent(RoleEvent.POINT_CHANGE, this._point);
    }

    public initPos(pt: Laya.Point) {
        this._point = new Laya.Point(pt.x, pt.y)
        this._roleView.initPos(this._point);
    }

    public get defaultAction(): string {
        return this._defaultAction;
    }

    public set defaultAction(value: string) {
        this._defaultAction = value;
        if (this._actionMovie) {
            this._action = value;
            this._actionMovie.defaultAction = value;
        }
    }

    public get actionMovie(): ActionMovie {
        return this._actionMovie;
    }

    public get actionMovieClip(): MovieClip {
        if (this._actionMovie) {
            return this._actionMovie.movie;
        }

        return null;
    }

    public set actionMovieClip(value: MovieClip) {
        this._actionMovie.movie = value
        this._actionMovie.name = this.roleName

        let pt: Laya.Point
        if (this._actionMovie.movie.hasOwnProperty("pos_head")) {
            if (this._actionMovie.movie.pos_head) {
                pt = new Laya.Point(this._actionMovie.movie.pos_head.x, this._actionMovie.movie.pos_head.y);
            }
            else {
                pt = new Laya.Point();
            }
            this._specialPosHead = new Laya.Point(pt.x, pt.y);
        }
        if (this._actionMovie.movie.hasOwnProperty("pos_body")) {
            if (this._actionMovie.movie.pos_body) {
                pt = new Laya.Point(this._actionMovie.movie.pos_body.x, this._actionMovie.movie.pos_body.y);
            }
            else {
                pt = new Laya.Point();
            }
            this._specialPosBody = new Laya.Point(pt.x, pt.y);
        }
        if (this._actionMovie.movie.hasOwnProperty("pos_leg")) {
            if (this._actionMovie.movie.pos_leg) {
                pt = new Laya.Point(this._actionMovie.movie.pos_leg.x, this._actionMovie.movie.pos_leg.y);
            }
            else {
                pt = new Laya.Point();
            }
            this._specialPosLeg = new Laya.Point(pt.x, pt.y);
        }
        if (this.isLiving) {
            this.action.apply(this, this._cacheAction ? this._cacheAction : [this._defaultAction]);
        } else {
            this.action(ActionLabesType.FAILED, ActionMovie.STOP);
        }
        if (BattleManager.Instance.battleModel.isNoCharge) {
            this.view.setRoleInfoViewVisible(true);
        }

        this.view.setColorTransform(this._attackMode);
    }

    /**
     * 播放动画 默认回到STAND,repeatType默认为wait_and_goto;
     * @param type
     * @param repeatType
     * @param nextType
     * @param waitFrame
     *
     */
    public currentAction: string = "";

    public action(type: string, repeatType: string = null, nextType: string = null, waitFrame: number = 5, isStop: boolean = false) {
        this.currentAction = type;
        let arg: Array<any> = [type, repeatType, nextType, waitFrame, isStop];
        if (!this._actionMovie || this._actionMovie.movie == null) {
            this._cacheAction = arg;
            return;//没加载完, 返回
        }
        this.dispatchEvent(RoleEvent.ACTION, arg);
    }

    public update() {
        if (this._actionManager) {
            this._actionManager.update();
        }
        if (this._skillQueue) {
            this._skillQueue.update();
        }

        this._concurrentActions.forEach(concurrentAct => {
            if (concurrentAct.finished) {
                this._concurrentActions.splice(this._concurrentActions.indexOf(concurrentAct), 1);
            }
            else {
                concurrentAct.update();
            }
        });

        if (this._bloodUpdateBuffer) {
            if (this._bloodUpdateCD == 0) {
                this._bloodUpdateBuffer.shift();
                if (this._bloodUpdateBuffer.length > 0) {
                    let vo: BloodUpdateVO = this._bloodUpdateBuffer[0];
                    this.realUpdateBlood(vo.blood, vo.displayBlood, vo.havoc, vo.type, vo.selfCause, vo.defaultSkill, vo.parry);
                    this._bloodUpdateCD = BaseRoleInfo.BLOOD_UPDATE_CD;
                }

            }
            else if (this._bloodUpdateCD > 0) {
                this._bloodUpdateCD--;
            }
        }
    }

    public addConcurrentAction(action: IAction) {
        this._concurrentActions && this._concurrentActions.push(action);
    }

    public addAction($action: IAction, immediately: boolean = false) {
        this._actionManager && this._actionManager.addAction($action, immediately);
    }

    public addSkill(action: IAction) {
        this._skillQueue && this._skillQueue.addAction(action, false);
    }

    public removeActionByType(type: string) {
        this._actionManager && this._actionManager.cancelActionByType(type);
    }

    public getSkillQueue(): BattleActionQueue {
        return this._skillQueue
    }

    public dispose() {
        if (this._actionManager) {
            this._actionManager.dispose();
            this._actionManager = null;
        }
        if (this._skillQueue) {
            this._skillQueue.dispose();
            this._skillQueue = null;
        }
        ObjectUtils.disposeObject(this._roleView);
        this._roleView = null;
        ObjectUtils.disposeObject(this._actionMovie);
        this._bloodUpdateBuffer = null;
        this.map = null;
    }

    public cleanActions() {
        if (this._actionManager) {
            this._actionManager.cleanActions();
        }
    }

    public get pointZ(): number {
        return this._pointZ;
    }

    public set pointZ(value: number) {
        this._pointZ = value;
        this.dispatchEvent(RoleEvent.POINT_CHANGE, value);
    }

    public get actionManager(): BattleActionQueue {
        return this._actionManager;
    }

    public get face(): number {
        return this._face;
    }

    public set face(value: number) {
        if (this._face == value) {
            return;
        }
        this._face = value;
        this.dispatchEvent(RoleEvent.FACE_CHANGE, value);
    }

    public get isLoadComplete(): boolean {
        return this._isLoadComplete;
    }

    public set isLoadComplete(value: boolean) {
        this._isLoadComplete = value;
    }

    public setAttactDirection() {
        if (this.face == FaceType.RIGHT_TEAM) {
            this.direction = "left";
        }
        else {
            this.direction = "right";
        }
    }

    /**
     * 根据标志值获得人物身上的特殊坐标点.
     * @param flag
     * @return
     *
     */
    public getSpecialPos(flag: number): Laya.Point {
        let pt: Laya.Point;
        switch (flag) {
            case BaseRoleInfo.POS_HEAD:
                pt = this._specialPosHead;
                break;
            case BaseRoleInfo.POS_BODY:
                pt = this._specialPosBody;
                break;
            case BaseRoleInfo.POS_LEG:
                pt = this._specialPosLeg;
                break;
            default:
                pt = this._specialPosBody;
                break;
        }
        if (pt) {
            return new Laya.Point(pt.x, pt.y);
        }
        return this.getDefaultPointByPos(flag);
    }

    public getDefaultPointByPos(flag: number): Laya.Point {
        let pt: Laya.Point;
        switch (flag) {
            case BaseRoleInfo.POS_HEAD:
                pt = new Laya.Point(0, -120);
                break;
            case BaseRoleInfo.POS_BODY:
                pt = new Laya.Point(0, -60);
                break;
            case BaseRoleInfo.POS_LEG:
                pt = new Laya.Point(0, 0);
                break;
            default:
                pt = new Laya.Point(0, -60);
                break;
        }
        return pt;
    }

    public addBuffer(buffer: BufferDamageData) {
        if (this._buffers.indexOf(buffer) >= 0) {
            return;
        }
        let findedMem: BufferDamageData;
        for (let i: number = 0; i < this._buffers.length; i++) {
            if (this._buffers[i].id == buffer.id) {
                findedMem = this._buffers[i];
                break;
            }
        }

        let tempInfo: t_s_skillbuffertemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, buffer.templateId);
        if (!tempInfo) {
            Logger.warn("[BaseRoleInfo]前后端buff信息不一致", buffer.templateId, buffer.getBufferName(), buffer)
            return
        }
        if (tempInfo.AttackType == 19) {
            if (!this._restricted) {
                this._restricted = true;
                // if(BattleManager.Instance.battleModel.selfHero == this)
                if (BattleManager.Instance.battleModel.selfHero instanceof BaseRoleInfo) {
                    NotificationManager.Instance.sendNotification(BattleNotic.RESTRICT_CHANGED)
                }
            }
        }

        if (!findedMem) {
            this._buffers.push(buffer);
        }
        else {
            this.copyBufferData(findedMem, buffer)
        }
        this.dispatchEvent(RoleEvent.SHOW_BUFFER, buffer);
    }

    public refreshBuffer(buffer: BufferDamageData) {
        let findedMem: BufferDamageData;
        for (let i: number = 0; i < this._buffers.length; i++) {
            if (this._buffers[i].id == buffer.id) {
                findedMem = this._buffers[i];
                break;
            }
        }
        if (findedMem) {
            this.copyBufferData(findedMem, buffer)
        }

        this.dispatchEvent(RoleEvent.REFRESH_BUFFER, this._buffers);
    }

    public removeBufferById(buffTempId: number, buffId?: number) {
        let buffer: BufferDamageData;
        for (let i: number = 0; i < this._buffers.length; i++) {
            buffer = this._buffers[i];
            let flag = buffId ? (buffer.id == buffId) : true
            if ((buffer.templateId == buffTempId) && flag) {
                this._buffers.splice(i, 1);
                this.updateRestrictState();
                this.dispatchEvent(RoleEvent.REFRESH_BUFFER, this._buffers);
                //护盾 移除的时候 需要重置 护盾数值
                if (buffer.AttackType == 34) {
                    this.dispatchEvent(RoleEvent.RESET_BLOOD_SHIELD, buffer);
                }
                break;
            }
        }
    }
    private S_BUFFER_IDS: Array<number> = [60999];
    /**
     * 清除身上的BUFFER.
     *
     */
    public cleanBuffers(isClear: boolean = true) {
        let buff: BufferDamageData;
        let buffs: Array<BufferDamageData> = [];
        while (this._buffers.length > 0) {
            let buffer: BufferDamageData = this._buffers[0];
            while (this._buffers.length > 0) {
                let buffer: BufferDamageData = this._buffers[0];
                // 双生BOSS狂暴BUFF特殊处理（在指定回合数之后才会出现, 死亡之后复活需要保留该BUFF）
                if (BattleManager.Instance.battleModel.battleType == BattleType.DOUBLE_BOSS_BATTLE &&
                    !isClear &&
                    this.S_BUFFER_IDS.indexOf(buffer.templateId) != -1) {
                    buff = buffer;
                }
                this.removeBufferById(buffer.templateId);
            }
            if (buff) {
                this._buffers.push(buff);
            }
            if (buffs.length > 0) {
                this._buffers = this._buffers.concat(buffs);
            }
        }
    }

    public refreshBufferTurn() {
        let buffers: Array<BufferDamageData> = this.getBuffers()
        let buffer: BufferDamageData;
        for (let i: number = 0; i < buffers.length; i++) {
            buffer = buffers[i];
        }
        this.dispatchEvent(RoleEvent.REFRESH_BUFFER_TURN, null);
        this.cleanOutTurnBuffer();
    }

    /**
     * 当受到伤害时,刷新身上的buffer的回合数(仅对按次数计算的buffer有效).
     * @param buffer
     *
     */
    public refreshBufferTurnForDanny(buffer: BufferDamageData) {
        let findedMem: BufferDamageData;
        for (let i: number = 0; i < this._buffers.length; i++) {
            if (this._buffers[i].id == buffer.id) {
                findedMem = this._buffers[i];
                break;
            }
        }
        if (findedMem) {
            this.dispatchEvent(RoleEvent.REFRESH_BUFFER_TURN, null);
            this.cleanOutTurnBuffer();
        }
    }

    private cleanOutTurnBuffer() {
        let buffers: Array<BufferDamageData> = this.getBuffers()
        let buffer: BufferDamageData;
        let roleView: BaseRoleView = BattleManager.Instance.battleMap.rolesDict[this.livingId] as BaseRoleView;

        if (roleView) {
            for (let i: number = 0; i < buffers.length; i++) {
                buffer = buffers[i];
                if (buffer.currentTurn <= 0 || buffer.countWay == 0) {
                    roleView.removeBuffer(buffer.templateId, buffer.id);
                    i--;
                }
            }
        }
    }

    public getBuffers(): Array<BufferDamageData> {
        return this._buffers;
    }

    /**
     * 没有ICON的buff不展示, 只显示增益减益buff
     * @param buffLeft 偶数位放buff
     */
    public getBuffersWithFiller(buffLeft: boolean = true, isConsortiaBoss: boolean = false): Array<BufferDamageData> {
        let temp: BufferDamageData[] = [];
        let buffs: BufferDamageData[] = [];
        let deBuffs: BufferDamageData[] = [];
        for (let index = 0; index < this._buffers.length; index++) {
            let buffer: BufferDamageData = this._buffers[index];
            if (buffer.currentTurn > 0 && buffer.Icon && (buffer.AttackData == 1 || buffer.AttackData == 2)) {
                if (buffer.AttackData == 1) {
                    buffs.push(buffer)
                } else if (buffer.AttackData == 2) {
                    deBuffs.push(buffer)
                }
            }
        }

        if (!buffLeft && isConsortiaBoss) {
            var str: string = ConsortiaManager.Instance.model.bossInfo.BufferIds;
            if (str) {
                var arr: Array<any> = str.split(",");
                let bufferTempInfo: t_s_skillbuffertemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, arr[0]) as t_s_skillbuffertemplateData;
                if (bufferTempInfo && bufferTempInfo.Icon && bufferTempInfo.Icon.length > 0) {
                    if (bufferTempInfo && bufferTempInfo.Icon) {
                        let bossBuffer: BufferDamageData = new BufferDamageData();
                        bossBuffer.templateId = bufferTempInfo.Id;
                        if (bossBuffer.AttackData == 1) {
                            buffs.push(bossBuffer)
                        } else if (bossBuffer.AttackData == 2) {
                            deBuffs.push(bossBuffer)
                        }
                    }
                }
            }
        }
        let len = Math.max(buffs.length, deBuffs.length) * 2
        for (let index = 0; index < len; index++) {
            let evenNum = (index % 2) == 0

            let evenArr = buffLeft ? buffs : deBuffs
            let oddArr = buffLeft ? deBuffs : buffs
            if (evenNum) {
                let buff = evenArr[index / 2]
                temp.push(buff ? buff : null)
            } else {
                let buff = oddArr[(index - 1) / 2]
                temp.push(buff ? buff : null)
            }
        }

        return temp;
    }

    public existUnenableSkillBuffer(id: number): boolean {
        for (let index = 0; index < this._buffers.length; index++) {
            const buffer = this._buffers[index];
            if (buffer.unAblesSillIds.indexOf(id) >= 0) {
                Logger.battle("玩家拥有遗忘技能的buff:" + buffer.buffName + "," + buffer.id + ", 遗忘技能:" + id);
                return true;
            }
        }
        return false;
    }

    private getBufferIds(): Array<number> {
        let ids: Array<number> = new Array<number>();
        for (let i: number = 0; i < this._buffers.length; i++) {
            ids.push(this._buffers[i].templateId);
        }
        return ids;
    }

    /**
     * 拷贝BUFFER数据 
     * @param curBuffer
     * @param targetBuffer
     * 
     */
    private copyBufferData(curBuffer: BufferDamageData, targetBuffer: BufferDamageData): void {
        curBuffer.processType = targetBuffer.processType;
        curBuffer.currentTurn = targetBuffer.currentTurn;
        curBuffer.countWay = targetBuffer.countWay;
        curBuffer.layerCount = targetBuffer.layerCount;
        curBuffer.level = targetBuffer.level;

        if (curBuffer.AttackType != 305) {
            curBuffer.damages = targetBuffer.damages;
            return;
        }

        //流血Buffer305， 为0的时候不更新。
        let d = 0;
        for (let dg of targetBuffer.damages) {
            d += dg.damageValue;
        }

        if (d > 0) {
            curBuffer.damages = targetBuffer.damages;
        }
    }

    /**
     * direction的值为left 或者 right;
     * @param value
     *
     */
    public set direction(value: string) {
        if (this._direction == value) {
            return;
        }
        this._direction = value;
        this.dispatchEvent(RoleEvent.DIRECTION_CHANGE, this._direction);
    }

    public get direction(): string {
        return this._direction;
    }

    public get waitBool(): boolean {
        return this.affectedSkill == null ? false : true;
    }

    public set attackMode(value: number) {
        if (this._attackMode == value) {
            return;
        }
        this._attackMode = value;
        if (this.view) {
            this.view.setColorTransform(this._attackMode);
        }
    }

    public get attackMode(): number {
        return this._attackMode
    }

    /**
     *是否是被限制行动的.
     */
    public get restricted(): boolean {
        return this._restricted;
    }

    public get moving(): boolean {
        return this._moving;
    }

    public set moving(value: boolean) {
        this._moving = value;
        if (value || this._roleView) {
            this._roleView.changeSkillItemUseCellParentToEffectCon()
        }
    }

    private isContainDannyAction(): boolean {
        // if(this._actionManager.current instanceof DannyAction){
        if (this._actionManager.current.inheritType == InheritIActionType.DannyAction) {
            return true;
            // }else if(this._actionManager.getActions().length > 0 && (this._actionManager.getActions()[0] instanceof DannyAction)){
        }
        else if (this._actionManager.getActions().length > 0 && (this._actionManager.getActions()[0].inheritType == InheritIActionType.DannyAction)) {
            return true;
        }
        return false;
    }

    public hideBody() {
        if (this._roleView) {
            this._roleView.visible = false
        }
    }

    public showBody() {
        if (this._roleView) {
            this._roleView.visible = true
        }
    }


    public getPermanentBuffers(): string {
        let permanentBuffers: Array<number> = [];
        for (let i: number = 0; i < this._buffers.length; i++) {
            if (this._buffers[i].isPermanent) {
                permanentBuffers.push(this._buffers[i].templateId);
            }
        }
        return permanentBuffers.join(",");
    }

    public hasBuffer(tid: number): boolean {
        for (let index = 0; index < this._buffers.length; index++) {
            let buffer = this._buffers[index]
            if (buffer.templateId == tid) {
                return true;
            }
        }
        return false;
    }

    public get roleName(): string {
        return "";
    }

    public get level(): number {
        return 0;
    }

    public get icon() {
        return "";
    }

    public clone(): BaseRoleInfo {
        return null;
    }
}