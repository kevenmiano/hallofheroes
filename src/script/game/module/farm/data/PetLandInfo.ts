// @ts-nocheck
import ConfigMgr from "../../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { t_s_pettemplateData } from "../../../config/t_s_pettemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { FarmEvent } from "../../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import PetTemplate from "../../../datas/template/PetTemplate";
import { ArmyManager } from "../../../manager/ArmyManager";
import { PlayerManager } from "../../../manager/PlayerManager";

export default class PetLandInfo extends GameEventDispatcher {
    public userId: number = 0;
    public petId: number = 0;
    public name: string = "";
    private _quality: number = 1;

    public get quality(): number {
        return this._quality;
    }

    public set quality(value: number) {
        if (value < 1) return;
        this._quality = Math.floor(value);
    }

    private _petTemplateId: number = 0;

    public get petTemplateId(): number {
        return this._petTemplateId;
    }

    public set petTemplateId(value: number) {
        if (this._petTemplateId == value) return;
        this._petTemplateId = value;
        this.petTemplate = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_pettemplate, value)
    }

    public petTemplate: t_s_pettemplateData;
    public pos: number = 0;
    public beginTime: string;
    public endTime: string;
    /** 上次喂养的区间 */
    public lastFeedRegion: number = 0;

    public PetLandInfo() {

    }

    public commit() {
        this.dispatchEvent(FarmEvent.PET_LAND_UPDATE, this);
    }

    /**
     * 能否喂养 
     * @return 
     * 
     */
    public canFeed(): boolean {
        if (this.petId <= 0) return false;
        if (this.lastFeedRegion >= 5) return false;
        if (!this.beginTime || !this.endTime) return false;
        if (this.canGains()) return false;

        var curTime: number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
        var beginDate: Date = DateFormatter.parse(this.beginTime, "YYYY-MM-DD hh:mm:ss");
        var endDate: Date = DateFormatter.parse(this.endTime, "YYYY-MM-DD hh:mm:ss");
        var curDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;

        var regionSize: number = (endDate.getTime() - beginDate.getTime()) / 10;
        var curRegion: number = Math.floor((curDate.getTime() - beginDate.getTime()) / regionSize);
        return curRegion > this.lastFeedRegion;
    }

    /**
     * 能否收获 
     * @return 
     * 
     */
    public canGains(): boolean {
        if (this.petId <= 0) return false;
        if (!this.beginTime || !this.endTime) return false;

        var endDate: Date = DateFormatter.parse(this.endTime, "YYYY-MM-DD hh:mm:ss");
        var curDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        var s: string = DateFormatter.format(curDate, "YYYY-MM-DD hh:mm:ss");
        return curDate.getTime() >= endDate.getTime();
    }

    public get remainMatureMinutes(): number {
        return this.totalMatureMinutes - this.growMinutes;
    }

    public get growMinutes(): number {
        var beginDate: Date = DateFormatter.parse(this.beginTime, "YYYY-MM-DD hh:mm:ss");
        var curDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        var min: number = Math.floor((curDate.getTime() - beginDate.getTime()) / (1000 * 60));
        if (min < 0) min = 0;
        return min;
    }

    public get totalMatureMinutes(): number {
        var endDate: Date = DateFormatter.parse(this.endTime, "YYYY-MM-DD hh:mm:ss");
        var beginDate: Date = DateFormatter.parse(this.beginTime, "YYYY-MM-DD hh:mm:ss");
        var min: number = Math.ceil((endDate.getTime() - beginDate.getTime()) / (1000 * 60));
        return min;
    }

    /**
     * 剩余成熟时间（秒）
     */
    public get remainMatureTime(): number {
        let endDate: Date = DateFormatter.parse(this.endTime, "YYYY-MM-DD hh:mm:ss");
        let time: number = endDate.getTime() / 1000 - this.sysCurTimeBySecond;
        // Logger.xjy("[FarmLandInfo]remainMatureTime s:", time, this.matureTime.getTime() / 1000, this.sysCurTimeBySecond)
        return time > 0 ? time : 0;
    }

    private get sysCurTimeBySecond(): number {
        return PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
    }

    public get isSelfLand(): boolean {
        return this.userId == this.thane.userId;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

}