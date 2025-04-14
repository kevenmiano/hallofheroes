/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2024-02-19 17:41:06
 * @LastEditors: jeremy.xu
 * @Description:
 */

import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { t_s_campaignData } from "../../../config/t_s_campaign";
import { t_s_rewardcondictionData } from "../../../config/t_s_rewardcondiction";
import { CampaignMapDifficulty } from "../../../constant/CampaignMapDifficulty";
import { CampaignMapLand } from "../../../constant/CampaignMapLand";
import { CampaignMapStatus } from "../../../constant/CampaignMapStatus";
import ItemID from "../../../constant/ItemID";
import { DistrictRewardInfo } from "../../../datas/DistrictRewardInfo";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignTemplateManager } from "../../../manager/CampaignTemplateManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { TaskManage } from "../../../manager/TaskManage";
import { TempleteManager } from "../../../manager/TempleteManager";
import FrameDataBase from "../../../mvc/FrameDataBase";
import { TaskTemplate } from "../../task/TaskTemplate";
import { CampaignAreaInfo } from "./model/CampaignAreaInfo";
import { CampaignChapterInfo } from "./model/CampaignChapterInfo";
import { CampaignLandInfo } from "./model/CampaignLandInfo";
import { SelectCampaignItemData } from "./model/SelectCampaignItemData";

export enum eSelectCampaignItemType {
  FirstItem,
  SecondItem,
  RewardTipItem,
}

export default class PveCampaignData extends FrameDataBase {
  public static MayFallItemListDefLen = 3;
  public static EvaluateRes = [
    "Lab_D_L",
    "Lab_C_L",
    "Lab_B_L",
    "Lab_A_L",
    "Lab_S_L",
  ];
  public static CancelUseWearySupply = "CancelUseWearySupply";
  /**
   *  设置当前选中的大陆的数据
   */
  private _selectedLand: CampaignLandInfo;
  public set selectedLand(value: CampaignLandInfo) {
    if (this._selectedLand == value) return;
    this._selectedLand = value;
  }
  public get selectedLand(): CampaignLandInfo {
    return CampaignTemplateManager.Instance.landDic[CampaignMapLand.East]; //this._selectedLand
  }
  /**
   *  当前选中的章节的数据
   */
  public selectedChapter: CampaignChapterInfo;
  /**
   *  当前选中的副本的数据  多个难度
   */
  public selectedArea: CampaignAreaInfo;
  /**
   *  当前选中的副本的数据
   */
  public selectedCampaign: t_s_campaignData;

  public recentChapter: CampaignChapterInfo;
  /**
   * 任务追踪得到的副本模版
   */
  public taskCampaignTem: t_s_campaignData;
  public maxChapter: CampaignChapterInfo;

  public getTreeData(): any[] {
    let firstData = [];
    let secondData = [];
    let rewardTipData = [];

    this.getRecentCanSelectChapter();

    let cpDataList =
      this.selectedLand.chapterDic.getList() as CampaignChapterInfo[];
    cpDataList.sort(this.sortFunAsc);
    Logger.log("[SelectCampaignData]getTreeData", cpDataList);
    for (let index = 0; index < cpDataList.length; index++) {
      let cpData = cpDataList[index];
      let cpName = cpData.getChapterName();
      let cpEnabled = true;
      let grayFilterFlag1 = false;
      if (index >= this.getChapterOpenLen()) {
        grayFilterFlag1 = true;
      }

      if (cpData.canOpen(cpData.chapterId)) {
        firstData.push(
          new SelectCampaignItemData(
            eSelectCampaignItemType.FirstItem,
            cpName,
            cpData.chapterId,
            cpEnabled,
            grayFilterFlag1,
          ),
        );
      }

      let temp = [];
      let areaDataList = cpData.getMapList() as CampaignAreaInfo[];
      for (let i = 0; i < areaDataList.length; i++) {
        let areaData = areaDataList[i];
        let campaignData = areaData.getMapByDifficult(
          CampaignMapDifficulty.General,
        );
        let userLevel = ArmyManager.Instance.thane.grades;
        let levelLimit = campaignData.MinLevel;
        let areaEnabled = true;
        let grayFilterFlag2: boolean = false;
        if (
          campaignData.state == CampaignMapStatus.NO_ACCEPT_CAMPAIGN ||
          userLevel < levelLimit
        ) {
          grayFilterFlag2 = true;
        }
        let bTask = false;
        if (areaEnabled) {
          // 任务提示
          let mainTaskList: any[] = TaskManage.Instance.cate.mainTaskList;
          for (let index = 0; index < mainTaskList.length; index++) {
            const taskTemp: TaskTemplate = mainTaskList[index];
            for (let i = 0; i < taskTemp.conditionList.length; i++) {
              const conTemp: t_s_rewardcondictionData =
                taskTemp.conditionList[i];
              if (conTemp.Para3 == campaignData.CampaignId) {
                bTask = true;
                break;
              }
            }
          }
        }

        temp.push(
          new SelectCampaignItemData(
            eSelectCampaignItemType.SecondItem,
            {
              icon: areaData.getAreaImg(true),
              text: areaData.getItemTitle(),
              bTask: bTask,
            },
            areaData.areaId,
            areaEnabled,
            grayFilterFlag2,
          ),
        );
      }
      secondData.push(
        new SelectCampaignItemData(eSelectCampaignItemType.SecondItem, temp),
      );

      let rTitle =
        LangManager.Instance.GetTranslation(
          "selectcampaign.view.chapterReward",
        ) +
        cpData.getMaxOverAreaCount() +
        "/" +
        areaDataList.length;
      let rbComplete = cpData.isAllOpenArea();
      rewardTipData.push(
        new SelectCampaignItemData(
          eSelectCampaignItemType.RewardTipItem,
          { text: rTitle, bComplete: rbComplete },
          cpData.chapterId,
        ),
      );
    }
    return [firstData, secondData, rewardTipData];
  }

  public getRecentCanSelectChapter() {
    let cpDataList: any[] = this.selectedLand.chapterDic.getList();
    cpDataList.sort(this.sortFunDsc);
    let chapter: CampaignChapterInfo;
    let len: number = cpDataList.length;
    for (let i: number = len - 1; i >= 0; i--) {
      chapter = cpDataList[i];
      if (chapter.getMaxOpenArea()) {
        this.maxChapter = chapter;
      }
    }
    for (let j: number = 0; j < len; j++) {
      chapter = cpDataList[j];
      if (
        this.taskCampaignTem &&
        this.taskCampaignTem.DungeonId == chapter.chapterId
      ) {
        this.recentChapter = chapter;
        return;
      }
      if (!this.taskCampaignTem && chapter.getMaxOpenArea()) {
        this.recentChapter = chapter;
        return;
      }
    }
    this.recentChapter = cpDataList[
      cpDataList.length - 1
    ] as CampaignChapterInfo;
  }

  public getChapterOpenLen(): number {
    let openLen = 0;
    let chapterList =
      this.selectedLand.chapterDic.getList() as CampaignChapterInfo[];
    for (let i = 0; i < chapterList.length; i++) {
      let chapterId = chapterList[i].chapterId;
      if (chapterId > this.maxChapter.chapterId) continue;
      openLen++;
    }
    return openLen;
  }

  public getDistrictRewardById(chapterId: number) {
    //优化标记 这是一个很大的数据, 遍历非常耗时
    // let temp = ConfigMgr.Instance.getDicSync(ConfigType.t_s_dropitem) as t_s_dropitemData
    // let arr = []
    // for (const key in temp) {
    //     if (Object.prototype.hasOwnProperty.call(temp, key)) {
    //         const info = temp[key];
    //         let pre = String(info.DropId).substr(0, 2)
    //         let district = String(info.DropId).substr(2)
    //         if (pre == "12" && Number(district) == chapterId) {
    //             arr.push(new DistrictRewardInfo(Number(district), info.ItemId, info.Data));
    //         }
    //     }
    // }
    // return arr;

    //优化标记-- 对上面逻辑优化
    let arr: DistrictRewardInfo[] = [];
    let dropDatas = TempleteManager.Instance.getDropItemssByDropId(
      +("12" + chapterId),
    );
    for (let dropItem of dropDatas) {
      arr.push(
        new DistrictRewardInfo(chapterId, dropItem.ItemId, dropItem.Data),
      );
    }
    return arr;
  }

  /**
   * 章节通关奖励
   */
  public getChapterRewardDataList(): GoodsInfo[] {
    let itemlist: GoodsInfo[] = [];

    if (!this.selectedChapter) return itemlist;

    let list = this.getDistrictRewardById(this.selectedChapter.chapterId);

    if (!list || list.length == 0) return itemlist;

    list.forEach((temp: DistrictRewardInfo) => {
      let ginfo: GoodsInfo = new GoodsInfo();
      ginfo.templateId = temp.ItemId;
      ginfo.count = temp.Count;
      itemlist.push(ginfo);
    });

    return itemlist;
  }

  public hasWearyMedicine(): boolean {
    let num0: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.WEARY_MEDICINE0,
    );
    let num1: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.WEARY_MEDICINE1,
    );
    let num2: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.WEARY_MEDICINE2,
    );
    let num3: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.WEARY_MEDICINE3,
    );
    return num0 > 0 || num1 > 0 || num2 > 0 || num3 > 0;
  }

  //今日是否还能购买高级体力药水
  public todayCanBuyWearyMedicine(): boolean {
    let flag: boolean = false;
    let shopGoodsInfo: any = TempleteManager.Instance.getShopTempInfoByItemId(
      ItemID.WEARY_MEDICINE3,
    );
    let num: number = shopGoodsInfo.canOneCount;
    if (num > 0) {
      flag = true;
    }
    return flag;
  }

  private sortFunAsc(a: CampaignChapterInfo, b: CampaignChapterInfo): number {
    return a.chapterId - b.chapterId;
  }
  private sortFunDsc(a: CampaignChapterInfo, b: CampaignChapterInfo): number {
    return b.chapterId - a.chapterId;
  }

  public get normalMap(): t_s_campaignData {
    if (!this.selectedArea) return null;
    return this.selectedArea.getMapByDifficult(CampaignMapDifficulty.General);
  }

  public get heroMap(): t_s_campaignData {
    if (!this.selectedArea) return null;
    return this.selectedArea.getMapByDifficult(CampaignMapDifficulty.Hero);
  }
  public isNormalOpen(): boolean {
    if (
      this.normalMap &&
      this.normalMap.state != CampaignMapStatus.NO_ACCEPT_CAMPAIGN
    )
      return true;
    return false;
  }

  public isHeroOpen(): boolean {
    if (
      this.heroMap &&
      this.heroMap.state != CampaignMapStatus.NO_ACCEPT_CAMPAIGN
    )
      return true;
    return false;
  }
}
