/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-25 12:23:55
 * @LastEditTime: 2024-02-19 17:41:35
 * @LastEditors: jeremy.xu
 * @Description: 大陆信息
 */

import LangManager from "../../../../../core/lang/LangManager";
import { SimpleDictionary } from "../../../../../core/utils/SimpleDictionary";
import { CampaignMapLand } from "../../../../constant/CampaignMapLand";
import { CampaignChapterInfo } from "./CampaignChapterInfo";


export class CampaignLandInfo {
    public landId: number;
    private _chapterDic: SimpleDictionary = new SimpleDictionary();
    public get chapterDic(): SimpleDictionary {
        return this._chapterDic;
    }

    public addChapterInfo(value: CampaignChapterInfo) {
        this._chapterDic.add(value.chapterId, value);
    }

    /**
     * 通过区域Id找到该区域数据 
     * @param chapterId
     * @return 
     */
    public getChapterById(chapterId: number): CampaignChapterInfo {
        return this._chapterDic[chapterId] as CampaignChapterInfo;
    }

    public getLandName(): string {
        switch (this.landId) {
            case CampaignMapLand.East:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignLandInfo.Name01");
            case CampaignMapLand.West:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignLandInfo.Name02");
            case CampaignMapLand.North:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignLandInfo.Name03");
            case CampaignMapLand.South:
                return LangManager.Instance.GetTranslation("selectcampaign.data.CampaignLandInfo.Name04");
        }
        return "";
    }
}