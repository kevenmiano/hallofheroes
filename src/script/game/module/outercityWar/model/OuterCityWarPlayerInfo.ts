// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 15:04:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-09 11:38:14
 * @Description: 玩家(英雄、NPC)的个人信息
 * 建筑的驻防点结构与玩家信息结构 合并
 * 此数据驱动内城OuterCityWarBuildInfo的更新
 * Mark 如果驻防点结构信息变多，还是需要拆开
 */

import { t_s_pawntemplateData } from "../../../config/t_s_pawntemplate";
import { EmOuterCityWarHeroType, EmOuterCityWarPlayerState } from "../../../constant/OuterCityWarDefine";
import { BooleanType, CampType } from "../../../constant/Const";
import { OuterCityWarEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PetData } from "../../pet/data/PetData";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import LangManager from "../../../../core/lang/LangManager";
import { t_s_buildingtemplateData } from "../../../config/t_s_buildingtemplate";
import { OuterCityWarModel } from "./OuterCityWarModel";
import { OuterCityWarBuildBuffInfo } from "./OuterCityWarBuildBuffInfo";
import { JobType } from "../../../constant/JobType";

export class OuterCityWarPlayerInfo {
    /** 阵营 */
    camp: number = CampType.Neutrality;
    /** 玩家信息 */
    userId: number = 0;
    heroType: number = EmOuterCityWarHeroType.Hero;
    userName: string = "";
    userGrade: number = 0;
    job: number = 0;
    actionPoint: string = "";
    online: boolean = false;
    /** 玩家状态  */
    state = EmOuterCityWarPlayerState.FREE;
    /** 玩家英灵状态  */
    statePet = EmOuterCityWarPlayerState.FREE;
    /** 参与进攻(进攻方) 防守(防守方)状态  1不参加 2参加  */
    enterWar: number = BooleanType.FALSE;
    /** 英雄战力 */
    heroCapaity: number = 0;
    /** 上阵英灵 */
    petList: PetData[] = [];
    /** 在某建筑上满足条件可获得的buff */
    buffInfoList: OuterCityWarBuildBuffInfo[] = [];
    /** 上阵士兵 */
    private _pawnTempId: number = 0;
    set pawnTempId(v: number) {
        if (v < 0) {
            this._pawnTempId = 0;
            this.pawnTempInfo = null;
        } else {
            this._pawnTempId = v;
            this.pawnTempInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_pawntemplate, this._pawnTempId)
        }
    }
    get pawnTempId(): number {
        return this._pawnTempId
    }
    pawnTempInfo: t_s_pawntemplateData;


    /** 公会信息 */
    guildName: string = "";
    private _guildId: number = 0;
    set guildId(v: number) {
        this._guildId = v < 0 ? 0 : v;
    }
    get guildId(): number {
        return this._guildId
    }
    private _guildDutyId: number = 0;
    set guildDutyId(v: number) {
        this._guildDutyId = v < 0 ? 0 : v;
    }
    get guildDutyId(): number {
        return this._guildDutyId
    }


    /** 参战城堡 城堡节点 */
    _defenceCastleNodeId: number = 0
    set enterWarCastleNodeId(v: number) {
        this._defenceCastleNodeId = v < 0 ? 0 : v;
    }
    get enterWarCastleNodeId(): number {
        return this._defenceCastleNodeId
    }
    /** 驻防地 驻防点序号id 1，2，3，4，5 */
    private _orderId: number;
    set orderId(v: number) {
        this._orderId = v < 0 ? 0 : v;
    }
    get orderId(): number {
        return this._orderId
    }
    private _orderIdPet: number;
    set orderIdPet(v: number) {
        this._orderIdPet = v < 0 ? 0 : v;
    }
    get orderIdPet(): number {
        return this._orderIdPet
    }
    /** 驻防地 建筑sontype */
    private _defenseSite: number = 0;
    set defenseSite(v: number) {
        this._defenseSite = v < 0 ? 0 : v;
        let tempId = Number(this._defenseSite + OuterCityWarModel.TempKey);
        this.defenseSiteTemp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_buildingtemplate, tempId);
    }
    get defenseSite(): number {
        return this._defenseSite
    }
    private _defenseSitePet: number = 0;
    set defenseSitePet(v: number) {
        this._defenseSitePet = v < 0 ? 0 : v;
        let tempId = Number(this._defenseSitePet + OuterCityWarModel.TempKey);
        this.defenseSitePetTemp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_buildingtemplate, tempId);
    }
    get defenseSitePet(): number {
        return this._defenseSitePet
    }
    defenseSiteTemp: t_s_buildingtemplateData
    defenseSitePetTemp: t_s_buildingtemplateData
    public get defenseSiteName() {
        return this.defenseSiteTemp && this.defenseSiteTemp.BuildingNameLang
    }

    public get defenseSitePetName() {
        return this.defenseSitePetTemp && this.defenseSitePetTemp.BuildingNameLang
    }
    /** 守备力 */
    private _defenseForce: number = 0;
    set defenseForce(v: number) {
        this._defenseForce = v < 0 ? 0 : v;
    }
    get defenseForce(): number {
        return this._defenseForce
    }
    private _defenseForcePet: number = 0;
    set defenseForcePet(v: number) {
        this._defenseForcePet = v < 0 ? 0 : v;
    }
    get defenseForcePet(): number {
        return this._defenseForcePet
    }


    public getPawnName(): string {
        if (this.pawnTempInfo) {
            return this.pawnTempInfo.PawnNameLang + LangManager.Instance.GetTranslation("public.level2", this.pawnTempInfo.Level)
        }
        return ""
    }

    public getPawnLevelByMasterType(masterType: number) {
        let level = 0;
        if (this.pawnTempInfo) {
            if (this.pawnTempInfo.MasterType == masterType) {
                level = this.pawnTempInfo.Level
            }
        }
        return level
    }

    public getPetCapaityByType(petType: number): number {
        let capaity = 0;
        for (let index = 0; index < this.petList.length; index++) {
            const petData = this.petList[index];
            if (petData.template && petData.template.PetType == petType) {
                capaity = petData.fightPower;
                break;
            }
        }
        return capaity;
    }

    public getTotalPetCapaity(): number {
        let totalCapaity = 0;
        for (let index = 0; index < this.petList.length; index++) {
            const element = this.petList[index];
            totalCapaity += element.fightPower;
        }
        return totalCapaity;
    }

    /** 英雄+上阵英灵战力 */
    public get totalCapaity(): number {
        return this.heroCapaity + this.getTotalPetCapaity();
    }

    /** 排序 */
    public get onlineSortWeight(): number {
        return this.online ? 2 : 1;
    }

    /** 14战士  25弓手  36法师 */
    public get jobMasterType(): number {
        return JobType.getJobMasterType(this.job)
    }

    get key(): string {
        return this.userId + "_" + this.heroType
    }

    static getKey(userId: number, heroType: number): string {
        return userId + "_" + heroType
    }

    public commit() {
        NotificationManager.Instance.dispatchEvent(OuterCityWarEvent.PLAYER_INFO, this)
    }
}