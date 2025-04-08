// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 受伤
 **/
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import ResMgr from "../../../core/res/ResMgr";
import { MovieClip } from "../../component/MovieClip";
import { ActionMovie } from "../../component/tools/ActionMovie";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { ActionLabesType, BloodType, FaceType, InheritIActionType, InheritRoleType, RoleType } from "../../constant/BattleDefine";
import { ConfigType } from "../../constant/ConfigDefine";
import { BattleNotic } from "../../constant/event/NotificationEvent";
import { ChatChannel } from "../../datas/ChatChannel";
import { TrailPropInfo } from "../../datas/TrailPropInfo";
import { IAction } from "../../interfaces/IAction";
import { ChatManager } from "../../manager/ChatManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PathManager } from "../../manager/PathManager";
import ChatData from "../../module/chat/data/ChatData";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { AttackData } from "../data/AttackData";
import { HeroRoleInfo } from "../data/objects/HeroRoleInfo";
import { ResourceModel } from "../data/ResourceModel";
import { RoleActionSimplifyData } from "../data/RoleActionSimplifyData";
import { BattleEffect } from "../skillsys/effect/BattleEffect";
import { DefenceEffect } from "../skillsys/effect/DefenceEffect";
import { BattleUtils } from "../utils/BattleUtils";
import { HeroRoleView } from "../view/roles/HeroRoleView";
import { DieAction } from "./DieAction";
import { GameBaseAction } from "./GameBaseAction";
import { MovePointAction } from "./MovePointAction";
import DropInfoMsg = com.road.yishi.proto.battle.DropInfoMsg;
export class DannyAction extends GameBaseAction {
    public inheritType: InheritIActionType = InheritIActionType.DannyAction

    private static PERCENTAGE_GRAVITY_TO_PIXEL: number = 0.3;

    private _frame: number = 0;
    private _time: number = 0;
    private _data: AttackData;
    private _distance: number = 0;
    private _backDust: MovieClip;
    private _over: boolean = false;
    private _flyUpPower: number = 0;
    private _currentPower: number = 0;
    private _restShakeCount: number = 0;
    private _currentShakeOff: number = 0;
    private _needPlayDieAction: boolean = false;

    private static gravity: number = 10;
    public static SHAKE_OFFSET: number = 2
    private face: number = 0;
    private toPoint: Laya.Point;
    private toPointZ: number = 0;
    private _endPoint: Laya.Point;
    private _flash: boolean;
    private _flashColor: number = 0;
    // private _oldColorTransForm:ColorTransform;
    private _playActBool: boolean;
    private _selfCause: boolean;
    private _isMoving: boolean;
    private _skillId: number = 0;


    constructor($role, $data: AttackData, $frame: number = 12, $checkDie: boolean = true, distance: number = 0, flyUpPower: number = 0,
        shakeCount: number = 4, flash: boolean = true, flashColor: number = 0x666666, playActBool: boolean = true,
        selfCause: boolean = false, skillId: number = -1) {
        super();
        this._data = $data;
        this._currentRole = $role;
        if ((this._currentRole.bloodA <= 0) && (this._data.bloodType != BloodType.REVIVE))
            return;
        if (!this._currentRole || !this._currentRole.actionManager)
            return;

        this._frame = $frame;
        this._distance = distance;

        let curAction = this._currentRole.actionManager.current
        if (curAction && curAction.inheritType == InheritIActionType.MovePointAction) {
            this._isMoving = true;
            this._distance = 0;
        }
        this._flyUpPower = flyUpPower;
        this._currentPower = flyUpPower;
        this._restShakeCount = shakeCount;
        this._currentShakeOff = DannyAction.SHAKE_OFFSET;
        this._time = 0;
        this._flash = flash;
        this._flashColor = flashColor;
        this._playActBool = playActBool;
        this._selfCause = selfCause;
        this._skillId = skillId;
        this.resolveIsPlayAct();
        this.playDenfence();
        this.initHurt();
        this.prepare();
        this._currentRole.addConcurrentAction(this);
    }


    /**
     * 计算伤害 
     * 
     */
    private initHurt() {
        if (this._flash) {
            if (this._data && this._data.damageValue > 0) {
                let roleView = this._currentRole.view;
                if (RoleActionSimplifyData.isSimplify(roleView && roleView.rolePartUrlPath)) {
                    roleView.setColorTransform(BattleModel.DANNY);
                }
            }
        }

        Logger.battle(`[DannyAction]${this._currentRole.roleName}(${this._currentRole.livingId})受到伤害${this._data.damageValue}`)
        
        if (this._playActBool) {
            this._currentRole.action(ActionLabesType.DANNY, ActionMovie.STOP);
        }

        let b: boolean = Boolean(this._data.extraData & 0x0001);

        let isDefaultSkill: boolean;
        let skillTempInfo: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, String(this._skillId));
        if (!skillTempInfo || skillTempInfo.UseWay == 3) {
            isDefaultSkill = true;
        }

        this._currentRole.totalBloodA -= this._data.hpMaxAdd;
        this._currentRole.updateBlood(-this._data.damageValue,
            -this._data.displayBlood,
            b,
            this._data.bloodType,
            this._selfCause,
            isDefaultSkill,
            this._data.parry);

        if (this._currentRole.realBloodA == 0 && this._data.damageValue != 0) {
            //此伤害杀死角色 需要播放死亡动作, 此处不能使用<=0 作为死亡的判断条件
            Logger.battle("[DannyAction]此伤害杀死角色 需要播放死亡动作, 此处不能使用<=0 作为死亡的判断条件")
            this._needPlayDieAction = true;
        }
        if (this._currentRole.side == 1)//是己方
        {
            BattleManager.Instance.batterModel.lock = true;
            BattleManager.Instance.batterModel.isStart = false;
        } else {
            BattleManager.Instance.batterModel.isStart = true;//开始记录连击;
        }

        if (this._data.damageValue != 0 &&
            (this._data.bloodType == BloodType.BLOOD_TYPE_SELF ||
                this._data.bloodType == BloodType.BLOOD_TYPE_ARMY)) {//如果是己方英雄或者部队的伤害, 则计算连击数
            // BattleManager.Instance.batterModel.batterCount += 1;
        }

        if (this._data.bloodType == BloodType.REVIVE) {//复活
            let target: HeroRoleInfo = BattleManager.Instance.battleModel.getRoleById(this._data.roleId) as HeroRoleInfo;
            target.isLiving = true;
            target.riveve = true;
            if (target.view) {
                if(target.type == RoleType.T_NPC_BOSS){
                    this.revierBoss(target);
                }
                else{
                    target.view.setRoleInfoViewVisible(true);
                    BattleManager.Instance.battleModel.isOver = false;
                    NotificationManager.Instance.sendNotification(BattleNotic.SKILL_ENABLE, true);
                }
            }
        }
        NotificationManager.Instance.sendNotification(BattleNotic.BUFFER_SKILL_ENABLE);
        BattleManager.Instance.batterModel.damageTotal += this._data.displayBlood;
    }

    /**
		 * 复活BOSS 双生BOSS 同生共死 
		 * @param role
		 * 
		 */		
		private  revierBoss(role:HeroRoleInfo) {
			role.isLiving = true;
			role.riveve = true;
			role.dying = false;
			if(role.view) {
				role.view.setRoleViewVisible(true);
				role.view.setRoleInfoViewVisible(true);
				if(role.map)
				{
					role.map.revierBoss(role.view);
				}
				else
				{
					BattleManager.Instance.battleMap.addRole(role.view);
				}
			}
			role.action(ActionLabesType.STAND, ActionMovie.REPEAT);
			//复活boss时给聊天框发送提示复活消息
			var chatData:ChatData = new ChatData();
			chatData.channel = ChatChannel.INFO;
			chatData.type = 1;
			chatData.msg = LangManager.Instance.GetTranslation("battle.actions.DannyAction.ChatDataMsg");
			chatData.commit();
			ChatManager.Instance.model.addChat(chatData);
			BattleManager.Instance.battleModel.isOver = false;
		}

    private resolveIsPlayAct() {
        if (this._playActBool) {
            if (this._currentRole.actionMovie.currentLabel != ActionLabesType.STAND) {
                this._playActBool = false;
            } else {
                if (!this._data || this._data.damageValue <= 0) {
                    this._playActBool = false;
                }
            }
        }
    }
    private playDenfence() {
        if (this._data && this._data.resistValue > 0 && (this._currentRole.actionMovie.currentLabel == ActionLabesType.STAND || this._currentRole.actionMovie.currentLabel == ActionLabesType.READY)) {
            let per = this._data.resistValue / (this._data.resistValue + this._data.damageValue);
            if (per > 0.3) {
                let index
                switch (this._data.resistType) {
                    case 12://火
                        index = 4
                        break;
                    case 13://水
                        index = 5
                        break;
                    case 14://电
                        index = 1
                        break;
                    case 15://风
                        index = 2
                        break;
                    case 16://暗
                        index = 0
                        break;
                    case 17://光
                        index = 3
                        break;
                }
                if (index && ResourceModel.Resist_Sheld_Names[index]) {
                    let effect: BattleEffect = new DefenceEffect(ResourceModel.Resist_Sheld_Names[1]);
                    if (!effect) return

                    let mc = effect.getDisplayObject()
                    mc.curCacheName = ResourceModel.Resist_Sheld_Prefix + ResourceModel.Resist_Sheld_Names[index] + "/"

                    let isLeft: boolean = this._currentRole.face == FaceType.LEFT_TEAM ? true : false;
                    if (isLeft) {
                        mc.scaleX = 1;
                        mc.x = 20;
                    } else {
                        mc.scaleX = -1;
                        mc.x = 100;
                    }
                    mc.y = 30;

                    let fullUrl = PathManager.solveResistSheldResPath(ResourceModel.Resist_Sheld_Names[index])
                    let resJson = ResMgr.Instance.getRes(fullUrl)
                    if (resJson && resJson.offset && resJson.offset.footX && resJson.offset.footY) {
                        mc.pos_leg = new Laya.Point(Math.floor(resJson.offset.footX), Math.floor(resJson.offset.footY))
                    }

                    this._currentRole.view.addEffect(effect);
                }
            }

        }
    }


    public prepare() {
        this.face = this._currentRole.face == FaceType.LEFT_TEAM ? -1 : 1;

        let roleInitPt: Laya.Point = BattleUtils.rolePointByPos(this._currentRole.pos, this._currentRole.face);
        let maxBack: number = 80;

        let toX: number = this._currentRole.point.x + this._distance * this.face;
        if (this._currentRole.face == FaceType.LEFT_TEAM) {
            if (toX < roleInitPt.x - maxBack) {
                toX = roleInitPt.x - maxBack
            }
        } else {
            if (toX > roleInitPt.x + maxBack) {
                toX = roleInitPt.x + maxBack
            }
        }

        this._endPoint = new Laya.Point(toX, this._currentRole.point.y);
        // addBuffers();
    }

    public update() {
        this._time++;
        if (this._time >= this._frame) {
            if (!this._over) {
                this.actionOver();
            }
            return;
        }
        // if (this._time == 10) {
        //     if (this._currentRole.view) {
        //         this._currentRole.view.setColorTransform(this._currentRole.attackMode);
        //     }
        // }
        if (!this.finished && !this._isMoving) {
            this.toPoint = new Laya.Point(this._currentRole.point.x + 0.5 * (this._endPoint.x - this._currentRole.point.x), this._currentRole.point.y);
            this.toPointZ = this._currentRole.pointZ + this._currentPower * DannyAction.PERCENTAGE_GRAVITY_TO_PIXEL;
            if (this.toPointZ <= 0) {
                this.toPointZ = 0;
            }
            else {
                this._currentPower -= DannyAction.gravity;
            }
            if (this._playActBool && this._restShakeCount > 0) {
                if (this._currentShakeOff < 0) {
                    this._restShakeCount--;
                }
                this.toPoint.x += this._currentShakeOff;
                this._currentShakeOff = -this._currentShakeOff;
            }

            if (this._playActBool) {
                this._currentRole.point = this.toPoint;
                this._currentRole.pointZ = this.toPointZ;
            }

            if (this._backDust) {
                this._backDust.x = this._currentRole.point.x;
                this._backDust.y = this._currentRole.point.y;
            }
        }
    }

    /**
     * 后退时的灰尘
     */
    private initBackDust() {
        //			if(this._distance==0) return;
        //			this._backDust = ClassUtils.CreatInstance('asset.battle.BackDust02Asset');//ComponentFactory.Instance.creatCustomObject('asset.battle.BackDust02Asset');
        //			_currentRole.map.effectContainer.addChild(this._backDust);
        //			this._backDust.x = _currentRole.point.x;
        //			this._backDust.y = _currentRole.point.y;
        //			if(_currentRole.face == FaceType.LEFT_TEAM)this._backDust.scaleX = -1;
    }
    private removeBackDust() {
        if (this._backDust) {
            if (this._backDust.parent) this._backDust.parent.removeChild(this._backDust);
        }
        this._backDust = null;
    }

    public synchronization() {
        this._time = 0;
        this.actionOver();
    }

    public replace(action: IAction): boolean {
        // return (action instanceof DannyAction);
        return (action.inheritType == InheritIActionType.DannyAction);
    }
    /**
     * 伤害动作执行完成, 
     * 如果执行完成以后角色死亡, 并且角色不是玩家英雄, 则执行死亡动作, 并播放死亡特效
     * 如果是玩家英雄, 则让玩家播放失败动画 
     * 如果该伤害包含掉落（试练技能）, 则执行掉落方法
     * 
     */
    protected actionOver() {
        this._over = true;
        if (this._playActBool && !this.isAttacking()) {
            this._currentRole.action(ActionLabesType.STAND, ActionMovie.REPEAT);
        }
        if (this._currentRole.view) {
            this._currentRole.view.setColorTransform(BattleModel.NORMAL);
        }
        // if(this._oldColorTransForm)
        // {
        //     if(this._currentRole.view){
        //         this._currentRole.view.setColorTransform(this._currentRole.attackMode);
        //     }
        // }

        let to_point: Laya.Point = BattleUtils.rolePointByPos(this._currentRole.pos, this._currentRole.face);

        if (this._needPlayDieAction || this._currentRole.bloodA <= 0) {//角色执行伤害动作以后死亡
            this.finished = true;
            this.playDie();
        }
        else {
            this.finished = true;
            if (this._distance != 0) {
                new MovePointAction(this._currentRole.livingId, to_point, 20, 0, false, false, true, false, null, null, false);
            } else if (!this._isMoving && this._playActBool) {
                this._currentRole.point = to_point;
                this._currentRole.point = to_point;
            }
        }
        this.playDrop();
        this.removeBackDust();
    }
    /**
     * 执行死亡动作 
     */
    private playDie() {
        Logger.battle(`[DannyAction]${this._currentRole.roleName}(${this._currentRole.livingId})受击后死亡`)
        if ((this._currentRole.inheritType == InheritRoleType.Hero) && (this._currentRole as HeroRoleInfo).type != 3) {
            if (this._currentRole.currentAction != ActionLabesType.FAILED) {
                let hero = <HeroRoleInfo>this._currentRole;
                let heroView = <HeroRoleView>hero.view;
                if (heroView.isPetBody) {
                    hero.updateAwaken(0);

                    // TODO
                    // this._mc = this.createMovie("pet.changeback");
                    this._mc = null
                    if (this._mc) {
                        // this._mc.addFrameScript(14, function () {
                        //     hero.isPetState = false;
                        // });
                        // this._mc.y = -100;
                        // let effectAct: MovieClipEffect = new MovieClipEffect(this._mc);
                        // effectAct.callBackComplete.addSingleListener(this.playHeroDie);
                        // heroView.effectContainer.addEffect(effectAct);
                    } else {
                        this.playHeroDie();
                    }
                } else {
                    this.playHeroDie();
                }
            }
        }
        else {
            if (this._currentRole.isLiving) {
                new DieAction(this._currentRole);
            }
        }
    }

    private _mc: MovieClip;

    private createMovie(link: string): MovieClip {
        return BattleManager.Instance.resourceModel.getEffectMC(link) as MovieClip;
    }

    private playHeroDie() {
        if (this._mc) {
            this._mc.stop();
            this._mc.addFrameScript(14, null);
            this._mc = null;
        }
        if (!(this._currentRole instanceof HeroRoleInfo)) return;
        let hero: HeroRoleInfo = <HeroRoleInfo>this._currentRole;

        if (this._currentRole.view) {
            this._currentRole.view.removeCollectionEffect();
        }
        hero.isPetState = false;
        this._currentRole.action(ActionLabesType.FAILED, ActionMovie.STOP);
        this._currentRole.setAttactDirection();
        this._currentRole.cleanBuffers();
        this._currentRole.isLiving = false;

        if (hero.petRoleInfo) {
            hero.petRoleInfo.action(ActionLabesType.STAND, ActionMovie.STOP);
        }
    }

    /**
     * 死亡掉落 
     * 
     */
    private playDrop() {
        if (this._data.dropList && this._data.dropList.length > 0)//死亡时掉落
        {
            Logger.battle("掉落长度:" + this._data.dropList.length);
            let self: HeroRoleInfo = BattleManager.Instance.battleModel.selfHero;
            this._data.dropList.forEach((info: DropInfoMsg) => {
                if (info.winnerIds && info.winnerIds.length > 0) {
                    info.winnerIds.forEach(id => {
                        if (self.livingId == id) {
                            Logger.battle("掉落数量:" + info.dropCount + "dropId " + info.dropId);
                            let data: TrailPropInfo = self.getTrialPropInfoById(info.dropId);
                            if (data) data.useCount += info.dropCount;
                        }
                    })
                }
            });
        }
    }

    /**
     * 是否正在执行动作 
     * @return 
     * 
     */
    private isAttacking(): boolean {
        if (this._currentRole && this._currentRole.actionMovie && this._currentRole.actionMovie.movie) {
            if (this._currentRole.actionMovie.movie.currentLabel &&
                this._currentRole.actionMovie.movie.currentLabel.toLowerCase().indexOf("attack") > -1) {
                return true;
            }
        }
        return false;
    }

    public cancel() {
    }
    public dispose() {
        if (this._currentRole.view) {
            this._currentRole.view.setColorTransform(BattleModel.NORMAL);
        }
        this.finished = true;
        this.removeBackDust();
        this._data = null;
    }
}
