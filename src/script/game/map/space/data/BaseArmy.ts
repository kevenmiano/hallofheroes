import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import Dictionary from "../../../../core/utils/Dictionary";
import { ArmyPawn } from "../../../datas/ArmyPawn";
import { ArmyEvent, PhysicsEvent, RoleEvent } from "../../../constant/event/NotificationEvent";
import { t_s_mounttemplateData } from "../../../config/t_s_mounttemplate";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { ArmyPetInfo } from "../../../datas/ArmyPetInfo";
import Logger from "../../../../core/logger/Logger";
import ChatData from "../../../module/chat/data/ChatData";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";

export class BaseArmy extends GameEventDispatcher {

    public petInfo: ArmyPetInfo;

    public armyView: Laya.Sprite;

    private _viceHero: ThaneInfo;

    constructor() {
        super();
        this.armyPawns = new Dictionary();
        this.armyPawns[0] = new ArmyPawn();
        this.armyPawns[1] = new ArmyPawn();
        let thaneInfo = Laya.ClassUtils.getClass('ThaneInfo');
        this.baseHero = new thaneInfo();
        this.viceHero = new thaneInfo();
        this.petInfo = new ArmyPetInfo();
    }

    /**
     * 军队的主键
     */
    public get id(): number {
        return this._id;
    }

    /**
     * @private
     */
    public set id(value: number) {
        if (value == 0) {
            throw new Error("this.id=0");
            Logger.log("this.id=0");
        }
        this._id = value;
    }

    public dispose() {
        for (let key in this.armyPawns) {
            delete this.armyPawns[this.key];
        }
        this.armyPawns = null;
        this.baseHero = null;
    }

    ////////////////////////armyInfo/////////////////////////////////////
    private _id: number = 0;
    public userId: number = 0;
    public mapId: number = 0;
    public armyName: string;
    public nickName: string;
    /**
     * 部队类型 ArmyType
     */
    public type: number = 0;
    public curPosX: number = 0;
    public curPosY: number = 0;
    /**
     * 玩家部队在房间里面的状态 RoomPlayerState
     */
    public roomState: number = 0;
    public hp:number = 0;
    public maxHp:number = 0;
    /**
     * 部队当前状态 ArmyState
     */
    private _state: number = 0;
    public onVehicle:boolean = false;//是否在物资车上，默认false 不在
    public get state(): number {
        return this._state;
    }

    public set state(value: number) {
        this._state = value;
        this.dispatchEvent(ArmyEvent.UPDATE_STATE, this);

        if (this.userId == ArmyManager.Instance.thane.userId) {
            Logger.yyz("☎️战斗状态改变: ", value);
        }
    }


    ////////////////////////Instance/////////////////////////////////
    /**
     * 部队里面的士兵列表 ArmyPawn对象
     * 通过士兵在部队里面的位置作为键保存
     * 目前部队里面只有一个位置, 所以默认用第一个
     */
    public armyPawns: Dictionary;
    /**
     * 部队里面的英雄信息
     * 英雄等级在玩家领主等级上面的历史原因是之前一个领主可以有多个英雄, 后来改为只有一个英雄
     */
    public baseHero: ThaneInfo;

    public synchronizationAllPawn(ap: ArmyPawn) {
        for (let armyPawnsKey in this.armyPawns) {
            let armyPawn: ArmyPawn = this.armyPawns[armyPawnsKey];
            if (armyPawn.templateInfo && armyPawn.templateInfo.SonType == ap.templateInfo.SonType) {
                armyPawn.synchronization(ap);
                armyPawn.commit();
            }
        }
    }

    /************************ 士兵************************/
    /**
     * 通过位置取到部队里面的士兵
     * @param index
     * @return
     *
     */
    public getPawnByIndex(index: number): ArmyPawn {
        return this.armyPawns[index];
    }

    /**
     * 通过士兵的模板id取得部队里面的士兵
     * @param tempId
     * @return
     *
     */
    public gePawnByTempId(tempId: number): ArmyPawn {
        for (let i: number = 0; i < 2; i++) {
            let ap: ArmyPawn = this.armyPawns[i];
            if (ap.templateId == tempId && ap.ownPawns > 0) {
                return ap;
            }
        }
        return null;
    }

    /**
     * 取得部队里面的空余位置
     * @return
     *
     */
    public getEmputyPos(): number {
        for (let i: number = 0; i < 2; i++) {
            let ap: ArmyPawn = this.armyPawns[i];
            if (ap.ownPawns <= 0) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 获取当前部队里面可增加的的士兵所占的人口数
     * @return
     *
     */
    public getLeftPopulation(): number {
        let conat: number = this.baseHero.attackProrerty.totalConatArmy;

        for (let armyPawnsKey in this.armyPawns) {
            let ap: ArmyPawn = this.armyPawns[armyPawnsKey];
            if (ap.templateId > 0 && ap.ownPawns) {
                conat -= (ap.ownPawns * ap.templateInfo.NeedPopulation);
            }
        }
        return conat;
    }

    /**
     * 增加在已编制部队里面指定位置的士兵一定数量
     * @param index 士兵在部队里面的位置
     * @param count 要增加的数量
     *
     */
    public addArmyPawnCountByIndex(index: number, count: number) {
        let ap: ArmyPawn = this.armyPawns[index];
        ap.ownPawns += count;
        ap.commit();
        this.dispatchEvent(ArmyEvent.ARMY_INFO_CHANGE, this);
    }

    /**
     * 删除在已编制部队里面指定位置的士兵一定数量
     * @param index
     * @param count
     *
     */
    public removeArmyPawnCountByIndex(index: number, count: number) {
        let ap: ArmyPawn = this.armyPawns[index];
        ap.ownPawns -= count;
        ap.commit();
        this.dispatchEvent(ArmyEvent.ARMY_INFO_CHANGE, this);
    }

    /**
     *  更新指定位置的士兵
     * @param index 要更新的士兵位置
     * @param armyPawn 新的士兵
     * @param count 更新以后的数量
     *
     */
    public addNewPawnByIndex(index: number, armyPawn: ArmyPawn, count: number) {
        let ap: ArmyPawn = this.armyPawns[index];
        ap.synchronization(armyPawn);
        ap.ownPawns = count;
        ap.commit();
        this.dispatchEvent(ArmyEvent.ARMY_INFO_CHANGE, this);
    }

    public commit() {
        if (this.petInfo) {
            this.petInfo.commit();
        }
        this.dispatchEvent(ArmyEvent.ARMY_INFO_CHANGE, this);
    }

    /**
     * 计算已编制部队里面所有士兵的数量
     * @return
     *
     */
    public countAllArmyPawnNmber(): number {
        let count: number = 0;
        for (let armyPawnsKey in this.armyPawns) {
            let ap: ArmyPawn = this.armyPawns[armyPawnsKey];
            count += ap.ownPawns;
        }
        return count;
    }

    /**
     * 计算已编制部队里面所有士兵所占的人口数量
     * @return
     *
     */
    public countArmyPawnsAllPopulaition(): number {
        let count: number = 0;
        for (let armyPawnsKey in this.armyPawns) {
            let ap: ArmyPawn = this.armyPawns[armyPawnsKey];
            
            count += ap.ownPawns * ap.templateInfo.NeedPopulation;
        }
        return count;
    }

    /**
     *战斗力
     */
    public get combatPower(): number {
        return this.heroRace// + pawnRace + totalRace;
    }

    public get heroRace(): number {
        if (this.baseHero.id == 0) {
            return 0;
        }
        return this.baseHero.attackProrerty.totalAttribute + this.baseHero.attackProrerty.totalLive / 5 + this.baseHero.attackProrerty.totalConatArmy;
    }

    /**
     * 当部队在战斗或者副本里面, 有玩家说话的时候, 显示聊天泡泡用
     */
    private _chatData: ChatData;
    public get chatData(): ChatData {
        return this._chatData;
    }

    public set chatData(value: ChatData) {
        this._chatData = value;
        this.dispatchEvent(PhysicsEvent.CHAT_DATA, this._chatData);
    }

    /**
     * 战斗胜利以后获的多少黄金, 用于在副本里面播放获得动画
     * @param value
     *
     */
    public set battleGold(value: number) {
        this.dispatchEvent(RoleEvent.BATTLE_GOLD, value);
    }

    /**
     * 战斗胜利以后获的多少经验, 用于在副本里面播放获得动画
     * @param value
     *
     */
    public set battleGp(value: number) {
        this.dispatchEvent(RoleEvent.BATTLE_GP, value);
    }

    /**
     * 战斗胜利以后获的多少战魂, 用于在副本里面播放获得动画
     * @param value
     *
     */
    public set battleStrategy(value: number) {
        this.dispatchEvent(RoleEvent.BATTLE_STRATEGY, value);
    }

    private _mountTemplateId: number = -1;
    /**
     * 坐骑模板id
     */
    public get mountTemplateId(): number {
        return this._mountTemplateId;
    }

    /**
     * @private
     */
    public set mountTemplateId(value: number) {
        if (this._mountTemplateId != value) {
            this._mountTemplateId = value;
            if (this.baseHero) {
                this.baseHero.beginChanges();
                if (this.mountTemplate) {
                    this.baseHero.mountAvata = this.mountTemplate.AvatarPath;
                } else {
                    this.baseHero.mountAvata = "";
                }
                this.baseHero.commit();
            }
        }
    }

    /**  坐骑模板 */
    public get mountTemplate(): t_s_mounttemplateData {
        return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mounttemplate, this._mountTemplateId);
    }

    public mountGrade: number = 0;

    /**
     * 用于表示部队的唯一键
     * 部队所在服务器名称与部队id的结合, 主要是因为跨服战场
     * @return
     *
     */
    public get key(): string {
        let serverName: string = "";
        if (this.baseHero) {
            serverName = this.baseHero.serviceName;
        }
        return serverName + "_" + this.id;
    }

    /**
     * 副职业信息
     */
    public get viceHero(): ThaneInfo {
        return this._viceHero;
    }

    /**
     * @private
     */
    public set viceHero(value: ThaneInfo) {
        this._viceHero = value;
    }
}