// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-25 12:23:41
 * @LastEditTime: 2024-02-19 17:41:29
 * @LastEditors: jeremy.xu
 * @Description: 区域信息
 */

import LangManager from "../../../../../core/lang/LangManager";
import { SimpleDictionary } from "../../../../../core/utils/SimpleDictionary";
import { t_s_campaignData } from "../../../../config/t_s_campaign";
import { CampaignMapDifficulty } from "../../../../constant/CampaignMapDifficulty";
import { CampaignMapStatus } from "../../../../constant/CampaignMapStatus";
import OpenGrades from "../../../../constant/OpenGrades";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { CampaignAreaInfo } from "./CampaignAreaInfo";


export class CampaignChapterInfo {
    public chapterId: number;
    private _areaDic: SimpleDictionary = new SimpleDictionary();
    public get areaDic(): SimpleDictionary {
        return this._areaDic;
    }

    public addAreaInfo(value: CampaignAreaInfo) {
        this._areaDic.add(value.areaId, value);
    }

    public getAreaInfoById(areaId: number): CampaignAreaInfo {
        return this._areaDic[areaId] as CampaignAreaInfo;
    }

    public getMaxOpenArea(): CampaignAreaInfo {
        if (!this.canOpen(this.chapterId)) return null;
        
        let temp: CampaignAreaInfo;
        let userLevel = ArmyManager.Instance.thane.grades;
        let list = this._areaDic.getList()
        list.forEach((info: CampaignAreaInfo) => {
            let campaignData = info.getMapByDifficult(CampaignMapDifficulty.General)
            let levelLimit = campaignData.MinLevel;
            if (campaignData.state != CampaignMapStatus.NO_ACCEPT_CAMPAIGN && userLevel >= levelLimit) {
                if (!temp) temp = info;
                if (temp.areaId <= info.areaId)
                    temp = info;
            }
        });
        return temp;
    }

    /**
     * 已经通关的数量
     */
    public getMaxOverAreaCount(): number {
        let count = 0;
        this._areaDic.getList().forEach((info: CampaignAreaInfo) => {
            let campaignData = info.getMapByDifficult(CampaignMapDifficulty.General)
            if (campaignData.state == CampaignMapStatus.OVER_CAMPAIGN) {
                count++
            }
        });
        return count;
    }

    public isAllOpenArea(): boolean {
        let result: boolean = true;
        this._areaDic.getList().forEach((info: CampaignAreaInfo) => {
            if (info.getMapByDifficult(CampaignMapDifficulty.General).state != CampaignMapStatus.OVER_CAMPAIGN)
                result = false;
        });
        return result;
    }

    public isAllLoaded(): boolean {
        let result: boolean = true;
        this._areaDic.getList().forEach((info: CampaignAreaInfo) => {
            if (!info.viewContentLoaded)
                result = false;
        });
        return result;
    }

    public getAreaByCampaignTem(temp: t_s_campaignData): CampaignAreaInfo {
        if (!temp) return null;
        if (temp.state == CampaignMapStatus.NO_ACCEPT_CAMPAIGN) {
            return this.getMaxSelectAewa();
        }

        for (let index = 0; index < this._areaDic.keys.length; index++) {
            const key = this._areaDic.keys[index];
            const info = this._areaDic[key] as CampaignAreaInfo
            if (info.areaId == temp.AreaId) {
                if (info.getMapByDifficult(CampaignMapDifficulty.General).MinLevel <= this.thane.grades) {
                    return info;
                } else {
                    return this.getMaxSelectAewa();
                }
            }
        }
        return null;
    }

    public getMaxSelectAewa(): CampaignAreaInfo {
        let temp: CampaignAreaInfo;
        let list = this._areaDic.getList()
        list.forEach((info: CampaignAreaInfo) => {
            if (info.getMapByDifficult(CampaignMapDifficulty.General).state != CampaignMapStatus.NO_ACCEPT_CAMPAIGN && info.getMapByDifficult(CampaignMapDifficulty.General).MinLevel <= this.thane.grades) {
                if (!temp) temp = info;
                if (temp.areaId <= info.areaId)
                    temp = info;
            }
        });
        return temp;
    }

    public getMapList(): any[] {
        return this._areaDic.getList().sort(function (a, b) {
            return a.CampaignId - b.CampaignId
        });
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public getChapterName(): string {
        switch (this.chapterId) {
            case 101:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignChapterInfo.chapterName01");
            case 102:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignChapterInfo.chapterName02");
            case 103:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignChapterInfo.chapterName03");
            case 104:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignChapterInfo.chapterName04");
            case 105:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignChapterInfo.chapterName05");
            case 106:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignChapterInfo.chapterName06");
            case 107:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignChapterInfo.chapterName07");
        }
        return "";
    }

    public getChapterLevel(): string {
        switch (this.chapterId) {
            case 101:
                return "1-20";
            case 102:
                return "20-30";
            case 103:
                return "30-40";
            case 104:
                return "40-50";
            case 105:
                return "50-60";
            case 106:
                return "60-70";
            case 107:
                return "70-80";
        }

        return ""
    }

    public canOpen(chapterId:number) {
        switch (chapterId) {
            case 101:
                return OpenGrades.MAX_GRADE >= 20;
            case 102:
                return OpenGrades.MAX_GRADE >= 30;;
            case 103:
                return OpenGrades.MAX_GRADE >= 40;;
            case 104:
                return OpenGrades.MAX_GRADE >= 50;;
            case 105:
                return OpenGrades.MAX_GRADE >= 60;;
            case 106:
                return OpenGrades.MAX_GRADE >= 70;;
            case 107:
                return OpenGrades.MAX_GRADE >= 80;;
        }
        return false
    }

    public getChapterTitle(): string {
        return this.getChapterName() + " ( " + this.getChapterLevel() + " )"
    }

}