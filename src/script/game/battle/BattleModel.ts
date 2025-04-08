// @ts-nocheck
import ConfigMgr from "../../core/config/ConfigMgr";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { HurtUpMode } from "./mode/HurtUpMode";
import { ActionMovie } from "../component/tools/ActionMovie";
import { t_s_herotemplateData } from "../config/t_s_herotemplate";
import { ActionLabesType, BattleType, InheritRoleType, RoleType, SideType } from "../constant/BattleDefine";
import { ConfigType } from "../constant/ConfigDefine";
import { BattleEvent, BattleNotic } from "../constant/event/NotificationEvent";
import { NotificationManager } from "../manager/NotificationManager";
import { SocketSendManager } from "../manager/SocketSendManager";
import { CampaignMapModel } from "../mvc/model/CampaignMapModel";
import { BattleArmyInfo } from "./data/objects/BattleArmyInfo";
import { HeroRoleInfo } from "./data/objects/HeroRoleInfo";
import { PawnRoleInfo } from "./data/objects/PawnRoleInfo";
import { PetRoleInfo } from "./data/objects/PetRoleInfo";
import { SkillData } from "./data/SkillData";
import { SkillHandlerII } from "./handler/SkillHandlerII";
import { BloodHelper } from "./skillsys/helper/BloodHelper";
import Logger from "../../core/logger/Logger";
import { PlayerManager } from "../manager/PlayerManager";
import { BaseSkill } from "./skillsys/skills/BaseSkill";
import { CampaignManager } from '../manager/CampaignManager';
import StringHelper from "../../core/utils/StringHelper";
import { ArmyManager } from "../manager/ArmyManager";
import OpenGrades from "../constant/OpenGrades";
import ComponentSetting from "../utils/ComponentSetting";
import { BattleRecordReader } from "./record/BattleRecordReader";
import { WorldBossHelper } from "../utils/WorldBossHelper";

import IWithdrawInfo = com.road.yishi.proto.battle.IWithdrawInfo;
import NewbieModule from "../module/guide/NewbieModule";
import { PetData } from "../module/pet/data/PetData";
import Dictionary from "../../core/utils/Dictionary";

/**
 * @author yuanzhan.yu
 */
export class BattleModel extends GameEventDispatcher {
    // 觉醒者满值
    public static AWAKEN_FULL_VALUE: number = 3000;
    // 放大角色
    public static DEFAULT_SCALE: number = 1.0;
    // 觉醒放大倍数
    public static AWAKEN_SCALE: number = 1.5;

    // 撤退倒计时
    public static RetreatVoteCountDown = 20;

    // 进战斗之前的等级
    public static gradeBeforeBattle: number = 0;

    public static ZIndex_Bottom: number = 0;

    public skillUserInfoDic: Dictionary;//某个天赋和符文技能是某个英雄使用的
    public hasPropIngUsed: boolean = false;//是否有某一个符文正在使用当中
    /**
     * 战斗id
     */
    private _battleId: string = "";
    public get battleId(): string {
        return this._battleId;
    }

    public set battleId(value: string) {
        this._battleId = value;
    }

    /**
     * 是否是己方突击, 有可能是对方突击;
     */
    public isSelfCharge: boolean = true;
    /**
     * 自己的属于哪个side(不管属于哪个side, 自己永远在左边)攻防是1,守方是2;
     */
    public selfSide: number = 1;
    /**
     * 战斗中的所有参与者, 包括士兵的信息列表
     */
    private _roleList: Map<number, any> = new Map<number, any>();
    public get roleList(): Map<number, any> {
        return this._roleList;
    }

    /**
     * 己方战斗部队
     */
    public armyInfoLeft: BattleArmyInfo;
    /**
     * 地方战斗部队
     */
    public armyInfoRight: BattleArmyInfo;
    public mapId: number = 0;
    public mapResId: number = 0;
    public battleType: number = 0;
    private _started: boolean = false;
    public selfHero: HeroRoleInfo;
    public lookHero:HeroRoleInfo;
    public isNoCharge: boolean = false;//是否不存在突击和反击.如果为 true 时,则不显示突击和反击.
    public static NORMAL: number = 0;
    public static DEFENSE: number = 1;
    public static ATTACK: number = 2;
    public static DANNY: number = 3;
    public needUpdatePetLivingId: number = 0;
    public petTemplateId1: number = 0;
    public petTemplateId2: number = 0;
    public petTemplateId3: number = 0;
    /**
     * 觉醒UI是否初始化完成
     */
    public static battleAwakenUIInit: boolean = false;
    /**
     * 战斗公共UI是否加载完成（Battle,battlemap）
     */
    public static battleUILoaded: boolean = false;
    /**
     * 战斗时出现的资源是否加载完成（BattleDynamic）
     */
    public static battleDynamicLoaded: boolean = false;
    public static battleBgAniLoaded: boolean = false;

    public isOver: boolean = false;
    private _isMultiBattle: boolean = false;

    public skillIds: any[];
    public soldierTemplates: any[];

    /**
     * 自己英雄出手回合计数
     */
    private _actionCount: number = 0
    public attackModeStart: boolean = false;

    public reinforceWave: number = 0;						//增援总批数
    public currentReinforceWave: number = 0;			//当前增援批数
    public useWay: number = 0;//类型0-普通战斗,1-增援战斗
    public defaultSkillCount: number = 0;
    private _awakenRoles: any[];
    public battleCapity: number = 0;//用于区分多人本和单人本.1为单人,4为多人;
    public cooldownInfo: any[] = [];//技能冷却队列
    public static allowAutoFight: boolean = true;

    private _isMultiPlayer: boolean = false;//是否是多人战斗(多玩家)
    private _currentReadySkillId: number = -1;//当前正在准备释放的技能,值为-1时,表示没有使用技能.
    /**
     * 被boss控制的玩家的livingId, 为0表示没有人被控制,现用于泰拉神庙周副本
     */
    public bossControlLivingId: number = 0;
    public currentSelectedPet: PetData;
    public currentHero: HeroRoleInfo;
    public get currentReadySkillId(): number {
        return this._currentReadySkillId;
    }

    public set currentReadySkillId(value: number) {
        this._currentReadySkillId = value;
    }

    public attackOrders: string = "";

    /**
     * 自动战斗
     */
    private _autoFightFlag: number = 2;
    public static AUTO_FIGHT: number = 1;
    public static CANCEL_AUTO_FIGHT: number = 2

    /**
     * BOSS 免疫BUFF 
     */
    // 免疫减速
    public static ImmuneSlowType = 13
    // 免疫晕眩
    public static ImmuneFaintType = 19
    public static ImmuneSlow = "Immune_Slow"
    public static ImmuneFaint = "Immune_Faint"

    public withdrawInfoList: IWithdrawInfo[] = []
    public withdrawCountdown: number = 0

    constructor() {
        super()
        this.armyInfoLeft = new BattleArmyInfo();
        this.armyInfoRight = new BattleArmyInfo();
        this._roleList = new Map();

        this._awakenRoles = [];
        // this.cooldownInfo =  new Array();
    }


    //     public addAttackOrder(value:string)
    //     {
    //         this.attackOrders +="**********************************************************************/n";
    //         this.attackOrders += value;
    //     }

    // 暂时没用有问题
    public get started(): boolean {
        return this._started;
    }

    public set started(value: boolean) {
        this._started = value;
    }

    public initAfterRolesAdded() {
        let infos: any[] = this.getRoleBySide(SideType.ATTACK_TEAM);
        let roleInfo: any;
        for (let i: number = 0; i < infos.length; i++) {
            roleInfo = infos[i]
            if (roleInfo instanceof PawnRoleInfo) {
                this._isMultiBattle = false;
                break;
            }
            else if (i == infos.length - 1) {
                this._isMultiBattle = true;
                break;
            }
        }

        if (this.battleCapity > 1) {
            this._isMultiPlayer = true;
        }
        else {
            let count: number = 0;
            let hero: HeroRoleInfo
            this._roleList.forEach((item: any) => {
                if (item instanceof HeroRoleInfo) {
                    hero = <HeroRoleInfo>item;
                    if (hero.heroInfo.templateInfo.Job != 10) {
                        count++;
                    }
                }
            });

            if (count > 1) {
                this._isMultiPlayer = true;
            }
        }
    }

    public get attackSideHeroUserIds(): number[] {
        let infos: any[] = this.getRoleBySide(SideType.ATTACK_TEAM);
        let list: number[] = [];
        for (let i: number = 0; i < infos.length; i++) {
            let roleInfo = infos[i]
            if (roleInfo instanceof HeroRoleInfo) {
                list.push(roleInfo.userId)
            }
        }
        return list
    }

    public setAttackModelById(roleId: number, mode: number) {
        let roleInfo: any = this._roleList.get(roleId)
        let side: number = 0;
        let pawns: any[]
        if (roleInfo) {
            side = roleInfo.side;
            roleInfo.attackMode = mode
            pawns = this.getRoleBySide(side);
            pawns.forEach(member => {
                if (member instanceof PawnRoleInfo) {
                    member.attackMode = mode;
                }
            })
        }
    }

    public getAttackModeById(roleId: number): number {
        let roleInfo: any = this._roleList.get(roleId)
        if (roleInfo) {
            return roleInfo.attackMode;
        }
        return BattleModel.NORMAL;
    }

    public getRoleInfoByUserId(userId: number): HeroRoleInfo {
        let tmp = null
        //forEach优化
        // this._roleList.forEach(item => {
        //     if (item && item instanceof HeroRoleInfo && item.userId == userId) {
        //         tmp = item;
        //     }
        // });

        //forEach优化--
        for (let item of this._roleList.values()) {
            if (item && item instanceof HeroRoleInfo && item.userId == userId) {
                tmp = item;
                break;
            }
        }
        return tmp;
    }

    public getHeroRight(): HeroRoleInfo {
        for (const key in this.armyInfoRight.getHeros) {
            if (Object.prototype.hasOwnProperty.call(this.armyInfoRight.getHeros, key)) {
                const element = this.armyInfoRight.getHeros[key];
                return element;
            }
        }
        return null;
    }

    public getHeroLeft(): HeroRoleInfo {
        for (const key in this.armyInfoLeft.getHeros) {
            if (Object.prototype.hasOwnProperty.call(this.armyInfoLeft.getHeros, key)) {
                const element = this.armyInfoLeft.getHeros[key];
                return element;
            }
        }
        return null;
    }

    public setAutoFight(value: number) {
        if (this._autoFightFlag == value) {
            return;
        }

        this._autoFightFlag = value
        if (CampaignMapModel.inMazeFlag &&
            CampaignMapModel.isHangUp &&
            this._autoFightFlag != BattleModel.AUTO_FIGHT) {
            CampaignMapModel.isHangUp = false;
        }

        if (this.isOver) {
            SocketSendManager.Instance.sendAutoAttackBattleOver(this._autoFightFlag);
        } else {
            SocketSendManager.Instance.sendAutoAttack(this.battleId, this._autoFightFlag);
        }

        NotificationManager.Instance.sendNotification(BattleNotic.AUTO_FIGHT_CHANGED)
    }

    public initAutoFight(value: number) {
        this._autoFightFlag = value;
        if (!BattleModel.allowAutoFight) {
            this.setAutoFight(BattleModel.CANCEL_AUTO_FIGHT);
            return;
        }
        if (CampaignMapModel.inMazeFlag &&
            CampaignMapModel.isHangUp &&
            this._autoFightFlag != BattleModel.AUTO_FIGHT) {
            this.setAutoFight(BattleModel.AUTO_FIGHT);
        }
    }

    public getAutoFightFlag(): number {
        return this._autoFightFlag;
    }

    public get isAutoFight(): boolean {
        return this._autoFightFlag == BattleModel.AUTO_FIGHT ? true : false;
    }

    public getHeros(): any[] {
        let re_arr: any[] = [];
        for (const key in this.armyInfoLeft.getHeros) {
            if (Object.prototype.hasOwnProperty.call(this.armyInfoLeft.getHeros, key)) {
                let i = this.armyInfoLeft.getHeros[key];
                re_arr.push(i);
            }
        }
        for (const key in this.armyInfoRight.getHeros) {
            if (Object.prototype.hasOwnProperty.call(this.armyInfoRight.getHeros, key)) {
                let i = this.armyInfoRight.getHeros[key];
                re_arr.push(i);
            }
        }
        return re_arr;
    }

    /**
     * 获得BOSS的血条的数量.
     * @return
     */
    public static getBossHpStripNum(id: number): number {
        let num: number = 0;
        let heroTemp: t_s_herotemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_herotemplate, id.toString());
        if (heroTemp) {
            num = heroTemp.Captain
        }
        return num > 0 ? num : 1;
    }

    /**
     * 当角色死亡并且不是玩家英雄的时候, 从部队里面移除角色 
     * @param $role
     * 
     */
    public removeRole($role: any) {
        let role: any = this._roleList.get($role.livingId);
        if (role) {
            // if (role instanceof PetRoleInfo) {
            if (role.inheritType == InheritRoleType.Pet) {
                return;
            }
            this.armyInfoRight.removeRole($role);
            this._roleList.delete($role.livingId);
        }
    }

    /**
     * 根据角色的side值, 设置角色是在左边还是在右边
     * @param $role
     *
     */
    public addRole($role, needAdd: boolean = true) {
        Logger.battle("[BattleModel]addRole", $role.roleName, $role.livingId, $role)
        if(this.isAllPetPKBattle() && $role.livingId == 0 && $role.side == this.selfSide){
            this.lookHero = $role;
        }
        if ($role.livingId != 0) {
            this._roleList.set($role.livingId, $role)
        }

        if ($role.side == this.selfSide) {
            if ($role.inheritType == InheritRoleType.Pawn) {
                this.armyInfoLeft.addPawn($role as PawnRoleInfo);
            }
            else if ($role.inheritType == InheritRoleType.Hero) {
                if (($role).userId == PlayerManager.Instance.currentPlayerModel.userInfo.userId
                    && ($role).serverName == PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName) {
                    this.selfHero = $role;
                }

                //合区后userId与serverName会改变, 会导致回放出问题
                if (!this.selfHero && BattleRecordReader.inRecordMode && $role.side == SideType.DEFANCE_TEAM) {
                    $role.userId = PlayerManager.Instance.currentPlayerModel.userInfo.userId
                    $role.serverName = PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName
                    this.selfHero = $role;
                }
                if (needAdd) {
                    this.armyInfoLeft.addHero($role);
                }
            }
            else if ($role.inheritType == InheritRoleType.Pet) {
                this.armyInfoLeft.addPet(<PetRoleInfo>$role);
            }
        }
        else {
            if ($role.inheritType == InheritRoleType.Pawn) {
                this.armyInfoRight.addPawn(<PawnRoleInfo>$role);
            }
            else if ($role.inheritType == InheritRoleType.Hero) {
                if (needAdd) {
                    this.armyInfoRight.addHero(<HeroRoleInfo>$role);
                }
            }
            else if ($role.inheritType == InheritRoleType.Pet) {
                this.armyInfoRight.addPet(<PetRoleInfo>$role);
            }
        }
    }

    /**
     * 根据site取得对应的战斗部队
     * @param $site
     * @return
     *
     */
    public getArmyInfoBySite($site: number): BattleArmyInfo {
        if (this.armyInfoRight.site == $site) {
            return this.armyInfoRight;
        }
        return this.armyInfoLeft;
    }

    /**
     *  根据livingid取得角色信息, 如果角色不存在, 则从召唤列表取得
     * @param $id
     * @return
     *
     */
    public getRoleById($id: number) {
        let role = this._roleList.get($id);
        if (!role) {
            return this.getAwakenRole($id);
        }
        return role;
    }

    /**
     * 根据livingid取得召唤列表中的角色
     * @param id
     * @return
     *
     */
    public getAwakenRole(id: number): any {
        for (let index = 0; index < this._awakenRoles.length; index++) {
            const role = this._awakenRoles[index];
            if (role.livingId == id) {
                return role;
            }
        }
        return null;
    }

    /**
     * 保存召唤怪物列表
     * @param roles
     *
     */
    public cacheAwakenRoles(roles: any[]) {
        this._awakenRoles = this._awakenRoles.concat(roles);
    }

    /**
     *  根据id列表取得桔色信息
     * @param id_arr
     * @return 
     * 
     */
    public getRolesByIds(id_arr: any[]): any[] {
        let role_arr: any[] = new Array;
        for (const key in id_arr) {
            if (Object.prototype.hasOwnProperty.call(id_arr, key)) {
                let i: number = id_arr[key];
                let role: any = this._roleList.get(i);
                role && role_arr.push(role);
            }
        }
        return role_arr;
    }

    /**
     * 获取一方所有角色
     * @param side
     * @return
     *
     */
    public getRoleBySide(side: number): any[] {
        let re_arr = [];
        this._roleList.forEach((item, key) => {
            if (item.side == side) {
                re_arr.push(item);
            }
        })
        return re_arr;
    }

    /**
     * 取得该方中对应位置的角色 
     * @param pos
     * @param side
     * @return 
     * 
     */
    public getRoleByPos(pos: number, side: number): any {

        for (const key in this._roleList) {
            if (Object.prototype.hasOwnProperty.call(this._roleList, key)) {
                let item: any = this._roleList[key];
                if ((item.pos == pos) && (item.side == side))
                    return item;
            }
        }
        return null;
    }

    /**
     * 根据位置列表取得该方中对应的角色 
     * @param poses
     * @param side
     * @return 
     * 
     */
    public getRolesByPoses(poses: any[], side: number): any[] {
        let re_arr: any[] = [];
        for (const key in poses) {
            if (Object.prototype.hasOwnProperty.call(poses, key)) {
                let pos: number = poses[key];
                let role: any = this.getRoleByPos(pos, side);
                role && re_arr.push(role);
            }
        }
        return re_arr;
    }

    public dispose() {
        this.offAll()
        this._awakenRoles = null;
        this.withdrawInfoList = [];
        if (this._hurtUpMode) {
            this._hurtUpMode.dispose();
            this._hurtUpMode = null;
        }
        this._roleList.forEach(roleInfo => {
            if (roleInfo) {
                roleInfo.dispose();
            }
        });
    }

    /**
     * 该方部队里面是否所有动作都执行完了
     * @return
     *
     */
    public isAllSkillExecuted(): boolean {
        let tmp = true
        //forEach优化--
        for (let role of this._roleList.values()) {
            if (role.isLiving && role.actionManager && !role.actionManager.isOver) {
                if (role.actionMovie.currentLabel && role.actionMovie.currentLabel != ActionLabesType.VICTORY) {
                    Logger.battle("角色上还有动作未执行:" + role.actionMovie.currentLabel);
                    tmp = false;
                    break;
                }
            }
        }
        if (this.battleType == BattleType.PET_PK && !this.isRolesStatic()) {
            Logger.battle("不是所有角色都处于静止状态");
            tmp = false;
        }
        return tmp;
    }

    /**
     *  该方是否所有角色都处于静止状态, 该状态下才会播放场景对话
     * @return
     *
     */
    public isRolesStatic(): boolean {
        let roleStatic = true
        //forEach优化
        // this._roleList.forEach((role) => {
        //     if (role.isLiving && role.getSkillQueue() && !role.getSkillQueue().isOver) {
        //         roleStatic = false;
        //     }
        // });
        //forEach优化--
        for (let role of this._roleList.values()) {
            if (role.isLiving && role.getSkillQueue() && !role.getSkillQueue().isOver) {
                roleStatic = false;
                break
            }
        }
        return roleStatic;
    }

    /**
     * 播放胜利动作, 死亡角色也会播放
     * @param side
     */
    public playVictoryAction(side: number) {
        let skillData: SkillData
        let skillHandler: SkillHandlerII;
        this._roleList.forEach((role: any) => {
            // if(role instanceof HeroRoleInfo && role.side == side){
            if (role.inheritType == InheritRoleType.Hero && role.side == side) {
                skillData = new SkillData();
                skillData.liftTime = 0;
                skillData.fId = role.livingId
                skillData.sp = (role as HeroRoleInfo).sp;

                skillHandler = new SkillHandlerII(skillData);
                skillHandler.handler();
            }
        });
    }

    /**
     * 播放失败动作, 快速结束时输的一方直接死亡
     * @param side
     *
     */
    public playDefeatedAction(side: number) {
        let skillData: SkillData
        let skillHandler: SkillHandlerII;
        this._roleList.forEach(role => {
            if (role instanceof HeroRoleInfo && role.side == side) {
                if (role.isLiving) {
                    role.view.setBloodStripVisible(false, true);
                    role.action(ActionLabesType.FAILED, ActionMovie.STOP);
                }
            }
        });
    }

    /**
     * 是否该方部队角色全部死亡
     * @return
     *
     */
    public isAllDead(): boolean {
        let tmp = true
        //forEach优化
        // this._roleList.forEach(role => {
        //     if (role.isLiving == true) {
        //         tmp = false;
        //     }
        // });
        //forEach优化--
        for (let role of this._roleList.values()) {
            if (role.isLiving == true) {
                tmp = false;
                break;
            }

        }
        return tmp;
    }

    /**
     * 返回该方部队所有角色还未执行的动作列表
     * @return
     *
     */
    public getWaitSkillList(): any[] {
        let arr: any[] = []
        this._roleList.forEach(role => {
            arr = arr.concat(role.getSkillQueue().getActions());
        });
        return arr;
    }

    /**
     * 是否所有技能都放完, 即该方所有角色动作队列上都无动作可执行 
     * @return 
     * 
     */
    public isAllSkillStarted(): boolean {
        let arr: any[] = this.getUnstartSkills();
        if (arr.length > 0) {
            return false;
        }
        return true;
    }
    /**
     * 返回该方所有还在动作队列中未执行的动作列表 
     * @return 
     * 
     */
    public getUnstartSkills(): any[] {
        let arr: any[] = []
        let allArr: any[] = [];
        for (const key in this._roleList) {
            if (Object.prototype.hasOwnProperty.call(this._roleList, key)) {
                let role: any = this._roleList[key];
                allArr = allArr.concat(role.getSkillQueue().getActions());
                if (role.getSkillQueue().current && role.isLiving) {
                    allArr = allArr.concat(role.getSkillQueue().current);
                }
            }
        }
        for (const key in allArr) {
            if (Object.prototype.hasOwnProperty.call(allArr, key)) {
                let skill: BaseSkill = allArr[key];
                if (skill && !skill.started) {
                    arr.push(skill);
                }
            }

        }
        return arr;
    }

    /**
     * 回合数
     * @return
     *
     */
    public get actionCount(): number {
        return this._actionCount;
    }

    public set actionCount(value: number) {
        if (this._actionCount == value) {
            return;
        }
        this._actionCount = value;
        this.dispatchEvent(BattleEvent.ACTION_COUNT_CHANGE, value);
    }

    /**
     *  在多人战斗中返回自己部队的血量
     * @return
     *
     */
    public getMyArmyTotalHp(): number {
        if (this._isMultiBattle) {
            return this.selfHero.totalBloodB;
        }
        return this.armyInfoLeft.getPawnTotalHp();
    }

    /**
     * 在多人战斗中返回自己部队剩余血量
     * @return
     *
     */
    public getMyArmyLeftHp(): number {
        if (this._isMultiBattle) {
            return this.selfHero.bloodB;
        }
        return this.armyInfoLeft.getArmyLeftHp();
    }

    /**
     * 在多人战斗中返回 自己英雄剩余血量
     * @return
     *
     */
    public getMyHeroLeftHp(): number {
        return this.selfHero.bloodA;
    }

    /**
     * 是否是多人战斗, （不带兵）
     * @return
     *
     */
    public isMultiBattle(): boolean {
        return this._isMultiBattle;
    }

    /**
     * 更新世界boss血量
     * @param current
     * @param time
     *
     */
    public updateWorldBossBlood(current: number, time: number) {
        this.delayWorldBossBloodSync(current, time);
    }

    /**
     * 延迟同步世界boss血量
     * @param current
     * @param time
     *
     */
    private delayWorldBossBloodSync(current: number, time: number) {
        let boss: HeroRoleInfo
        boss = this.getWorldBoss();
        let reduce: number = 0;
        if (boss) {
            let cached: number = BloodHelper.worldBossBloodCached
            if (current < boss.bloodA - cached) {
                reduce = current - boss.bloodA + cached
                boss.updateBloodSecurity(reduce);
                BloodHelper.processWorldBossSyncBlood(time);
            }

            this.dispatchEvent(BattleEvent.REDUCE_WORLD_BOSS_BLOOD, reduce);
        }
    }

    /**
     * 取得战斗中的是世界boss信息
     * @return
     *
     */
    public getWorldBoss(): HeroRoleInfo {
        let boss: HeroRoleInfo
        if (this.battleType != BattleType.WORLD_BOSS_BATTLE) {
            return null;
        }
        let tmp = null;
        //forEach优化
        // this._roleList.forEach(item => {
        //     if (item.inheritType == InheritRoleType.Hero) {
        //         boss = <HeroRoleInfo>item;
        //         if (boss.type == RoleType.T_NPC_BOSS) {
        //             tmp = boss;
        //         }
        //     }
        // });
        //forEach优化--
        for (let item of this._roleList.values()) {
            if (item.inheritType == InheritRoleType.Hero) {
                boss = <HeroRoleInfo>item;
                if (boss.type == RoleType.T_NPC_BOSS) {
                    tmp = boss;
                    break;
                }
            }

        }
        return tmp;
    }

    public isMultiPlayer(): boolean {
        return this._isMultiPlayer;
    }

    /**
     * 英雄之门-多人副本
     * @returns 
     */
    public get isMulPve(): boolean {
        let campaignTemplate = CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.campaignTemplate;
        return campaignTemplate && campaignTemplate.Types == 0 && campaignTemplate.Capacity == 3;
    }

    public isBossBattle(): boolean {
        let tmp = false
        //forEach优化
        // this._roleList.forEach(item => {
        //     if (item.inheritType == InheritRoleType.Hero) {
        //         if ((item as HeroRoleInfo).type == RoleType.T_NPC_BOSS) {
        //             tmp = true;
        //         }
        //     }
        // });

        //forEach优化--
        for (let item of this._roleList.values()) {

            if (item.inheritType == InheritRoleType.Hero) {
                if ((item as HeroRoleInfo).type == RoleType.T_NPC_BOSS) {
                    tmp = true;
                    break;
                }
            }

        }
        return tmp;
    }

    public getHeroRoleByUserId(userId: number, serverName: string = ""): HeroRoleInfo {
        let tmp = null;
        if (StringHelper.isNullOrEmpty(serverName)) {
            //forEach优化
            // this._roleList.forEach(item => {
            //     if (item.inheritType == InheritRoleType.Hero) {
            //         if ((item as HeroRoleInfo).userId == userId) {
            //             tmp = item
            //         }
            //     }
            // });

            //forEach优化--
            for (let item of this._roleList.values()) {
                if (item.inheritType == InheritRoleType.Hero) {
                    if ((item as HeroRoleInfo).userId == userId) {
                        tmp = item;
                        break;
                    }
                }
            }
        }
        else {
            //forEach优化
            // this._roleList.forEach(item => {
            //     if (item.inheritType == InheritRoleType.Hero) {
            //         if ((item as HeroRoleInfo).userId == userId && (item as HeroRoleInfo).serverName == serverName) {
            //             tmp = item
            //         }
            //     }
            // });

            //forEach优化--
            for (let item of this._roleList.values()) {
                if (item.inheritType == InheritRoleType.Hero) {
                    if ((item as HeroRoleInfo).userId == userId && (item as HeroRoleInfo).serverName == serverName) {
                        tmp = item;
                        break;
                    }
                }
            }

        }
        return tmp;
    }


    public battleNoticeType:number = 0
    public battleDamageImprove:number = 0
    public updateBattleNotice(type:number, damageImprove:number = 0) {
        this.battleNoticeType = type
        this.battleDamageImprove = damageImprove
        this.dispatchEvent(BattleEvent.BATTLE_NOTICE);
    }

    private _hurtUpMode: HurtUpMode;
    public hurtUpStart(countDown: number, damageImprove: number = 0) {
        if (!this._hurtUpMode) {
            this._hurtUpMode = new HurtUpMode();
            this._hurtUpMode.battleType = this.battleType;
        }
        this._hurtUpMode.reset(countDown / 1000, damageImprove);
    }

    public getHurtMode(): HurtUpMode {
        if (!this._hurtUpMode) {
            this._hurtUpMode = new HurtUpMode();
        }
        return this._hurtUpMode;
    }

    /** 两阵营都是英雄（英灵也当做英雄） */
    public isPvP(): boolean {
        if (this.battleType == BattleType.TREASUREMAP_BATTLE) return false;
        if (this.battleType == BattleType.CONSORTIA_FAM_LORDS_BATTLE) return false;
        let tmp = false
        //forEach优化
        // this._roleList.forEach(roleInfo => {
        //     if (roleInfo instanceof HeroRoleInfo) {
        //         if (roleInfo.type != RoleType.T_NPC_BOSS && roleInfo.type != RoleType.T_WILD_LAND) {
        //             if (roleInfo.side != this.selfHero.side) {
        //                 tmp = true;
        //             }
        //         }
        //     }
        // });

        //forEach优化--
        for (let roleInfo of this._roleList.values()) {
            if (roleInfo instanceof HeroRoleInfo) {
                if (roleInfo.type != RoleType.T_NPC_BOSS && roleInfo.type != RoleType.T_WILD_LAND) {
                    if (roleInfo.side != this.selfHero.side) {
                        tmp = true;
                        break;
                    }
                }
            }
        }
        return tmp;
    }

    public isTrail(): boolean {
        return this.battleType == BattleType.TRIAL_TOWER_BATTLE;
    }
    /**
     * 判断是否进入王者之塔战斗 
    */
    public isKingTower(): boolean {
        return this.battleType == BattleType.KING_TOWER_BATTLE;
    }
    /**
     *试练之塔层数
     */
    private _trialLayer: number = 0;
    public set trialLayer(value: number) {

        if (this._trialLayer != value) {
            this._trialLayer = value;
            this.dispatchEvent(BattleEvent.TRAIL_LAYER_CHANGE, this._trialLayer);
        }
    }

    public get trialLayer(): number {
        return this._trialLayer;
    }

    public get isLockTalent(): boolean {
        let bTalentLock = false
        // let isLords = this.battleType == BattleType.WARLORDS || this.battleType == BattleType.WARLORDS_OVER
        if (ArmyManager.Instance.thane.grades < OpenGrades.TALENT || !ComponentSetting.GENIUS) {
            bTalentLock = true;
        }
        return bTalentLock
    }

    public get isShowShortCut() {
        let b: boolean
        switch (this.battleType) {
            //单人
            case BattleType.BATTLE_CHALLENGE:
            case BattleType.WORLD_BOSS_BATTLE:
            case BattleType.CAMPAIGN_BATTLE:
            case BattleType.CASTLE_BATTLE:
            case BattleType.TREASUREMAP_BATTLE:
            case BattleType.WORLD_MAP_NPC:
            // case BattleType.MINERAL_PK:
            case BattleType.PET__HUMAN_PK:
            // case BattleType.CROSS_WAR_FIELD_BATTLE:
            case BattleType.NPC_FOLLOW_BATTLE:
            case BattleType.WARLORDS:
            case BattleType.PET_PK:
            case BattleType.RES_WILDLAND_BATTLE:
            case BattleType.NPC_WILDLAND_BATTLE:
            case BattleType.TRE_WILDLAND_BATTLE:
            case BattleType.CASTLE_BATTLE:
            case BattleType.SINGLE_PASS:
            case BattleType.BATTLE_GUIDEBOOK:
            case BattleType.SECRECT_LAND:
            case BattleType.FAM_NPC_BATTLE:
            case BattleType.SPECIAL_BOSS_BATTLE:
            case BattleType.CONSORTIA_BOSS_BATTLE:
            case BattleType.CONSORTIA_BOSS_MONSTER_BATTLE:
            case BattleType.TREASURE_MINE_BATTLE:
            case BattleType.PET_CAMPAIGN:
            case BattleType.MONOPOLY_MIRROR_BATTLE:
            case BattleType.REMOTE_PET_BATLE:
            case BattleType.BATTLE_SECRET:
                b = false;
                break;
            default:
                b = true;
                break;
        }


        if (this.battleType == BattleType.GUILD_TOTEM_BATTLE && this.isBossBattle()) {
            b = false;
        }
        return b
    }

    /** 是否显示全局快捷语 */
    public get isShowGlobalShortCut() {
        let b = this.isPvP()
        return b
    }

    public get isShowAutoFight() {
        let b: boolean

        if (!NewbieModule.Instance.checkEnterCastle()) {
            return false;
        }

        switch (this.battleType) {
            // case BattleType.ROOM_BOSS_BATTLE:
            // case BattleType.MONOPOLY_MIRROR_BATTLE:
            //     b = false;
            //     break;
            default:
                b = true;
                break;
        }
        return b;
    }

    public get isEnableAutoFight() {
        if (!BattleModel.allowAutoFight) return false;

        let b: boolean
        switch (this.battleType) {
            // case BattleType.BATTLE_CHALLENGE:
            // case BattleType.WORLD_BOSS_BATTLE:
            // case BattleType.CAMPAIGN_BATTLE:
            // case BattleType.CASTLE_BATTLE:
            // case BattleType.TREASUREMAP_BATTLE:
            // case BattleType.WORLD_MAP_NPC:
            // case BattleType.MINERAL_PK:
            // case BattleType.PET__HUMAN_PK:
            // case BattleType.CROSS_WAR_FIELD_BATTLE:
            // case BattleType.NPC_FOLLOW_BATTLE:
            // case BattleType.WARLORDS:
            // case BattleType.PET_PK:
            // case BattleType.RES_WILDLAND_BATTLE:
            // case BattleType.NPC_WILDLAND_BATTLE:
            // case BattleType.TRE_WILDLAND_BATTLE:
            // case BattleType.CASTLE_BATTLE:
            // case BattleType.SINGLE_PASS:
            // case BattleType.BATTLE_GUIDEBOOK:
            // case BattleType.SECRECT_LAND:
            // case BattleType.FAM_NPC_BATTLE:
            // case BattleType.SPECIAL_BOSS_BATTLE:
            // case BattleType.CONSORTIA_BOSS_BATTLE:
            // case BattleType.CONSORTIA_BOSS_MONSTER_BATTLE:
            // case BattleType.TREASURE_MINE_BATTLE:
            // case BattleType.PET_CAMPAIGN:
            // case BattleType.MONOPOLY_MIRROR_BATTLE:
            //     b = false;
            //     break;
            default:
                b = true;
                break;
        }
        return b;
    }

    public get isEnableWithdraw() {
        let mapModel = CampaignManager.Instance.mapModel
        if (mapModel) {
            let mapId = mapModel.mapId
            if (WorldBossHelper.checkMineral(mapId) || WorldBossHelper.checkPvp(mapId)) {
                return false;
            }
        }

        let b: boolean = true
        switch (this.battleType) {
            case BattleType.HANGUP_PVP: //主城-切磋
            case BattleType.GUILD_WAR_BATTLE_PLAYER:
            case BattleType.BATTLE_MULTIPLAYER:
            case BattleType.WARLORDS: // 众神之战
            case BattleType.WARLORDS_OVER:
            case BattleType.BATTLE_MATCHING:
            case BattleType.OUT_CITY_PK:
            case BattleType.CASTLE_BATTLE:
            case BattleType.SPACEMAP_PET_PK:
            case BattleType.OUT_CITY_WAR_PK:
            case BattleType.OUT_CITY_WAR_PET_PK:
            case BattleType.OUT_CITY_WAR_PET_MONSTER_PK:
            case BattleType.OUT_CITY_VEHICLE:
                b = false;
                break;
            default:
                break;
        }
        return b;
    }

    public isControledByBoss(): boolean {
        return this.bossControlLivingId == this.selfHero.livingId;
    }

    public isRemotePetBattle(): boolean {
        return this.battleType == BattleType.REMOTE_PET_BATLE;
    }

    public isPetPKBattle(): boolean {
        return this.battleType == BattleType.PET_PK;
    }

    public isSpacePetPKBattle(): boolean {
        return this.battleType == BattleType.SPACEMAP_PET_PK;
    }

    public isOuterCityPetPKPetBattle(): boolean {
        return this.battleType == BattleType.OUT_CITY_WAR_PET_PK;
    }

    public isOuterCityPetPKNPCBattle(): boolean {
        return this.battleType == BattleType.OUT_CITY_WAR_PET_MONSTER_PK;
    }

    /**
     * 是否是英灵相关的战斗
     * 英灵竞技（英灵打英灵）
     * 英灵远征（英灵打NPC）
     * 天空之城英灵切磋（英灵打英灵）
     * 外城英灵PK（英灵打英灵）
     * *外城英灵战斗（英灵打NPC）
     */
    public isAllPetPKBattle(): boolean {
        if (this.battleType == BattleType.SPACEMAP_PET_PK ||
            this.battleType == BattleType.PET_PK ||
            this.battleType == BattleType.REMOTE_PET_BATLE ||
            this.battleType == BattleType.OUT_CITY_WAR_PET_PK ||
            this.battleType == BattleType.OUT_CITY_WAR_PET_MONSTER_PK) {
            return true;
        }
        return false;
    }

    public isSinglePetPKBattle(): boolean {
        if (this.battleType == BattleType.SPACEMAP_PET_PK ||
            this.battleType == BattleType.PET_PK ||
            this.battleType == BattleType.OUT_CITY_WAR_PET_PK) {
            return true;
        }
        return false;
    }

    /**
     * 【PVP优化】仅限双方都是3英灵的战斗有效（英灵竞技、城战的英灵战斗、英灵切磋）
     * 随时间增加，治疗及护盾实际效果降低，每45秒降低25%，最多100%
     */
    public isReduceEffect() {
        let b = false
        switch (this.battleType) {
            case BattleType.OUT_CITY_WAR_PET_PK:// 外城城战英灵PK（英灵打英灵）
            case BattleType.PET_PK:// 英灵竞技
            case BattleType.SPACEMAP_PET_PK:// 天空之城英灵PK
                b = true
            default:
                break;
        }
        return b
    }

    // 多人本房间共享血量boss
    public isRoomBoss(livingId: number): boolean {
        if (this.battleType != BattleType.ROOM_BOSS_BATTLE) return false;
        let bossInfo: HeroRoleInfo = this.armyInfoRight.boss;
        return bossInfo && livingId == bossInfo.livingId
    }

    public getBaseRoleInfoByPetTemplateId(petTemplateId): HeroRoleInfo {
        let hero: HeroRoleInfo;
        let armyInfoHeros = this.armyInfoLeft.getHeros;
        for (const key in armyInfoHeros) {
            let hRole: HeroRoleInfo = armyInfoHeros.get(key)
            if (hRole && hRole.petRoleInfo && hRole.petRoleInfo.template
                && hRole.petRoleInfo.template.TemplateId == petTemplateId) {
                hero = hRole;
            }
        }
        return hero
    }
}