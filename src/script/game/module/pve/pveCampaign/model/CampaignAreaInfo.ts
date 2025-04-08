/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-25 12:23:12
 * @LastEditTime: 2024-02-19 17:41:22
 * @LastEditors: jeremy.xu
 * @Description: 副本信息
 */

import LangManager from "../../../../../core/lang/LangManager";
import { SimpleDictionary } from "../../../../../core/utils/SimpleDictionary";
import { t_s_campaignData } from "../../../../config/t_s_campaign";
import { CampaignMapDifficulty } from "../../../../constant/CampaignMapDifficulty";
import { PathManager } from "../../../../manager/PathManager";


export class CampaignAreaInfo {
    public chapterId: number = 0;
    public areaId: number = 0;
    public areaName: string;
    public minLevel: number = 0;
    public maxLevel: number = 0;
    public posX: number = 0;
    public posY: number = 0;
    public viewContentLoaded: boolean;

    private _mapDic: SimpleDictionary = new SimpleDictionary();

    public getAreaImg(bItemIcon: boolean = false): string {
        let campaignData = this.getMapByDifficult(CampaignMapDifficulty.General)
        if (campaignData) {
            return PathManager.solveSelectCampaignPath(campaignData.DungeonId, bItemIcon ? campaignData.AreaId : undefined)
        }
        return ""
    }

    // pve中的获取Item图片
    public getAreaSmallIcon():string{
        return PathManager.mapInstanceSmallIconPath(this.getMapByDifficult(CampaignMapDifficulty.General).CampaignId)
    }

    public addMapTemplate(temp: t_s_campaignData) {
        this._mapDic.add(temp.CampaignId, temp);
    }

    public getMapById(campaignId: number): t_s_campaignData {
        return this._mapDic[campaignId] as t_s_campaignData;
    }

    public getMapByDifficult(dif: CampaignMapDifficulty): t_s_campaignData {
        for (let index = 0; index < this._mapDic.keys.length; index++) {
            const key = this._mapDic.keys[index];
            const temp = this._mapDic[key] as t_s_campaignData;
            if (temp.DifficutlyGrade == dif) return temp;
        }
        return null;
    }

    public getMayFallItemList(dif: CampaignMapDifficulty): number[] {
        for (let index = 0; index < this._mapDic.keys.length; index++) {
            const key = this._mapDic.keys[index];
            const temp = this._mapDic[key] as t_s_campaignData;
            if (temp.DifficutlyGrade == dif) {
                return temp.Item
            }
        }
        return [];
    }

    public getMapList(): any[] {
        return this._mapDic.getList().sort(function (a, b) {
            return a.CampaignId - b.CampaignId
        });
    }

    public getItemTitle(): string {
        if (this.maxLevel != this.minLevel) {
            return LangManager.Instance.GetTranslation("selectcampaign.view.itemTitle1", this.areaName, this.minLevel, this.maxLevel);
        } else {
            return LangManager.Instance.GetTranslation("selectcampaign.view.itemTitle2", this.areaName, this.maxLevel);
        }
    }

    public getRecommendLevel(): string {
        let str = LangManager.Instance.GetTranslation("selectcampaign.view.recommendedLevel") + this.minLevel
        if (this.maxLevel != this.minLevel) {
            str += "-" + this.maxLevel
        }
        return str
    }
}