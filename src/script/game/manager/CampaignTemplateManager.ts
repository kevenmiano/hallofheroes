/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-25 14:56:43
 * @LastEditTime: 2024-02-19 17:49:59
 * @LastEditors: jeremy.xu
 * @Description:
 */

import ConfigMgr from "../../core/config/ConfigMgr";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import { t_s_campaignData } from "../config/t_s_campaign";
import { CampaignMapLand } from "../constant/CampaignMapLand";
import { CampaignMapStatus } from "../constant/CampaignMapStatus";
import { CampaignAreaInfo } from "../module/pve/pveCampaign/model/CampaignAreaInfo";
import { CampaignChapterInfo } from "../module/pve/pveCampaign/model/CampaignChapterInfo";
import { CampaignLandInfo } from "../module/pve/pveCampaign/model/CampaignLandInfo";
import { CampaignRankManager } from "./CampaignRankManager";

export class CampaignTemplateManager {
  // 999策划约定屏蔽的副本
  public static ShieldDoundleID = 999;
  private static _instance: CampaignTemplateManager;
  public static get Instance(): CampaignTemplateManager {
    if (!CampaignTemplateManager._instance) {
      CampaignTemplateManager._instance = new CampaignTemplateManager();
    }
    return CampaignTemplateManager._instance;
  }

  private _landDic: SimpleDictionary = new SimpleDictionary();
  private _landList: any[] = [];

  /**
   * 初始化
   * @param t
   */
  preSetup(t?: any) {}

  public setup() {
    let campaignTemplateDic = ConfigMgr.Instance.campaignTemplateDic;
    let landInfo: CampaignLandInfo = null;
    let chapterInfo: CampaignChapterInfo = null;
    let temp: t_s_campaignData;
    for (const key in campaignTemplateDic) {
      if (Object.prototype.hasOwnProperty.call(campaignTemplateDic, key)) {
        temp = campaignTemplateDic[key] as t_s_campaignData;
        landInfo = this._landDic[temp.LandId] as CampaignLandInfo;
        if (!landInfo) {
          landInfo = new CampaignLandInfo();
          landInfo.landId = temp.LandId;
          this._landDic.add(landInfo.landId, landInfo);
        }
        if (temp.DungeonId != CampaignTemplateManager.ShieldDoundleID) {
          chapterInfo = landInfo.getChapterById(
            temp.DungeonId,
          ) as CampaignChapterInfo;
          this.addAreaToChapter(temp, chapterInfo, landInfo);
        }
      }
    }

    this._landDic.keys.forEach((key) => {
      landInfo = this._landDic[key];
      if (landInfo.landId != CampaignMapLand.None) {
        this._landList.push(landInfo);
      }
    });
  }

  private addAreaToChapter(
    temp: t_s_campaignData,
    chapterInfo: CampaignChapterInfo,
    landInfo: CampaignLandInfo,
  ) {
    if (!chapterInfo) {
      chapterInfo = new CampaignChapterInfo();
      chapterInfo.chapterId = temp.DungeonId;
      landInfo.addChapterInfo(chapterInfo);
    }
    let areaInfo: CampaignAreaInfo = chapterInfo.getAreaInfoById(temp.AreaId);
    this.addMapTempToArea(temp, areaInfo, chapterInfo);
  }

  private addMapTempToArea(
    temp: t_s_campaignData,
    areaInfo: CampaignAreaInfo,
    chapterInfo: CampaignChapterInfo,
  ) {
    if (!areaInfo) {
      areaInfo = new CampaignAreaInfo();
      areaInfo.areaId = temp.AreaId;
      areaInfo.areaName = temp.CampaignNameLang;
      areaInfo.minLevel = temp.MinLevel;
      areaInfo.maxLevel = temp.MaxLevel;
      areaInfo.posX = temp.PosX;
      areaInfo.posY = temp.PosY;
      areaInfo.chapterId = areaInfo.chapterId;
      chapterInfo.addAreaInfo(areaInfo);
    }
    if (!areaInfo.getMapById(temp.CampaignId)) areaInfo.addMapTemplate(temp);
  }
  public static cannelClearance: boolean;
  public checkCanChoose() {
    //
    let dic = ConfigMgr.Instance.campaignTemplateDic; //所有的副本
    let rankDic: SimpleDictionary = CampaignRankManager.Instance.rankDic;
    //优化标记 这里会对元数据进行修改。？？？？？？？
    for (const key in dic) {
      if (Object.prototype.hasOwnProperty.call(dic, key)) {
        const info: t_s_campaignData = dic[key];
        if (CampaignTemplateManager.cannelClearance) {
          info.state = CampaignMapStatus.OPEN_CAMPAIGN;
        } else {
          if (info.PreCampaignId == 0)
            info.state = CampaignMapStatus.OPEN_CAMPAIGN;
          if (rankDic[info.CampaignId]) {
            info.state = CampaignMapStatus.OVER_CAMPAIGN;
          } else if (rankDic[info.PreCampaignId]) {
            info.state = CampaignMapStatus.OPEN_CAMPAIGN;
          } else if (info.PreCampaignId != 0) {
            info.state = CampaignMapStatus.NO_ACCEPT_CAMPAIGN;
          }
        }
      }
    }
  }
  public get landDic(): SimpleDictionary {
    return this._landDic;
  }

  public get landList(): any[] {
    return this._landList;
  }

  /**
   * 获得多人副本列表
   * @return
   *
   */
  public getMutiCampaignList(): t_s_campaignData[] {
    let land: CampaignLandInfo = this._landDic[0];
    let list: t_s_campaignData[] = [];
    for (let key in land.chapterDic) {
      if (land.chapterDic.hasOwnProperty(key) && !key.startsWith("__")) {
        // 0新手副本、3活动副本
        if (
          key == CampaignTemplateManager.ShieldDoundleID.toString() ||
          key == "0" ||
          key == "3"
        )
          continue;
        let chapter: CampaignChapterInfo = land.chapterDic[key];
        if (!chapter) continue;
        let area: SimpleDictionary = chapter.areaDic;
        for (let index = 0; index < area.keys.length; index++) {
          let key = area.keys[index];
          let info: CampaignAreaInfo = area[key];
          let item = info.getMapList()[0];
          list.push(item);
        }
      }
    }
    list.sort(function (a, b) {
      return a.MinLevel - b.MinLevel;
    });
    return list;
  }

  /**
   * 获得活动副本列表
   * @return
   *
   */
  public getActiveCampaignList(): t_s_campaignData[] {
    let land: CampaignLandInfo = this._landDic[0];
    let list: t_s_campaignData[] = [];
    let chapter: CampaignChapterInfo = land.chapterDic["3"];
    if (!chapter) return [];

    let area: SimpleDictionary = chapter.areaDic;
    for (let index = 0; index < area.keys.length; index++) {
      let key = area.keys[index];
      let info: CampaignAreaInfo = area[key];
      let item = info.getMapList()[0];
      list.push(item);
    }
    list.sort(function (a, b) {
      return a.MinLevel - b.MinLevel;
    });
    return list;
  }

  /**
   * 获得周副本列表
   * @return
   *
   */
  public getWeeklyCampaignList(): t_s_campaignData[] {
    let land: CampaignLandInfo = this._landDic[0];
    let list: t_s_campaignData[] = [];
    let chapter: CampaignChapterInfo = land.chapterDic["4"];
    if (!chapter) return [];

    let area: SimpleDictionary = chapter.areaDic;
    for (let index = 0; index < area.keys.length; index++) {
      let key = area.keys[index];
      let info: CampaignAreaInfo = area[key];
      let item = info.getMapList()[0];
      list.push(item);
    }
    list.sort(function (a, b) {
      return a.MinLevel - b.MinLevel;
    });
    return list;
  }
}
