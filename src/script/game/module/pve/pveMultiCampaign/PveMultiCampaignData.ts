/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-19 19:54:32
 * @LastEditTime: 2024-02-19 17:44:48
 * @LastEditors: jeremy.xu
 * @Description:
 */

import LangManager from "../../../../core/lang/LangManager";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { t_s_campaignData } from "../../../config/t_s_campaign";
import { CampaignMapDifficulty } from "../../../constant/CampaignMapDifficulty";
import { CampaignMapLand } from "../../../constant/CampaignMapLand";
import { CampaignMapStatus } from "../../../constant/CampaignMapStatus";
import { DistrictRewardInfo } from "../../../datas/DistrictRewardInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignTemplateManager } from "../../../manager/CampaignTemplateManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomManager } from "../../../manager/RoomManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import FrameDataBase from "../../../mvc/FrameDataBase";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
import { eSelectCampaignItemType } from "../pveCampaign/PveCampaignData";
import { CampaignAreaInfo } from "../pveCampaign/model/CampaignAreaInfo";
import { CampaignChapterInfo } from "../pveCampaign/model/CampaignChapterInfo";
import { CampaignLandInfo } from "../pveCampaign/model/CampaignLandInfo";
import { SelectCampaignItemData } from "../pveCampaign/model/SelectCampaignItemData";

export default class PveMultiCampaignData extends FrameDataBase {
  public static MayFallItemListDefLen = 3;
  public static NormalModeCnt = 2;
  public static LevelLimit = 38;
  public static ChapterLen = 4;
  public static AreaMaxLen = 8;
  public static EvaluateRes = [
    "Lab_D_L",
    "Lab_C_L",
    "Lab_B_L",
    "Lab_A_L",
    "Lab_S_L",
  ];
  public static YuanShuModeCnt = 3;
  public static YuanShuModeCnt2 = 2;
  public static get ChapterTitle() {
    return [
      LangManager.Instance.GetTranslation("selectcampaign.view.chapter01"),
      LangManager.Instance.GetTranslation("selectcampaign.view.chapter02"),
      LangManager.Instance.GetTranslation("selectcampaign.view.activity"),
      LangManager.Instance.GetTranslation("selectcampaign.view.weekCampaign"),
    ];
  }
  public static get KinTowerModeName() {
    return [
      LangManager.Instance.GetTranslation("kingtower.difficulty.simple"),
      LangManager.Instance.GetTranslation("kingtower.difficulty.common"),
      LangManager.Instance.GetTranslation("kingtower.difficulty.hard"),
      LangManager.Instance.GetTranslation("kingtower.difficulty.nightmare"),
    ];
  }
  public static get NormalModeName() {
    return [
      LangManager.Instance.GetTranslation("kingtower.difficulty.common"),
      LangManager.Instance.GetTranslation("kingtower.difficulty.nightmare"),
    ];
  }

  public static get YuanShuModeName() {
    return [
      LangManager.Instance.GetTranslation("kingtower.difficulty.common"),
      LangManager.Instance.GetTranslation("kingtower.difficulty.nightmare"),
      LangManager.Instance.GetTranslation("kingtower.difficulty.diyu"),
    ];
  }

  /**
   * 通过难度ID获取难度名称
   * @param id
   * @returns
   */
  public static getDifficultyById(id: string): string {
    let str: string = "";
    switch (id) {
      case "1":
        str = LangManager.Instance.GetTranslation(
          "kingtower.difficulty.simple",
        );
        break;
      case "2":
        str = LangManager.Instance.GetTranslation(
          "kingtower.difficulty.common",
        );
        break;
      case "3":
        str = LangManager.Instance.GetTranslation("kingtower.difficulty.hard");
        break;
      case "4":
        str = LangManager.Instance.GetTranslation(
          "kingtower.difficulty.nightmare",
        );
        break;
      case "5":
        str = LangManager.Instance.GetTranslation("kingtower.difficulty.diyu");
        break;
      default:
        break;
    }
    return str;
  }

  private _openCampaignDataDic: SimpleDictionary = new SimpleDictionary();
  public get openCampaignDataDic(): SimpleDictionary {
    return this._openCampaignDataDic;
  }

  public get roomInfo(): RoomInfo {
    return RoomManager.Instance.roomInfo;
  }
  /**
   *  设置当前选中的大陆的数据
   */
  private _selectedLand: CampaignLandInfo;
  public set selectedLand(value: CampaignLandInfo) {
    if (this._selectedLand == value) return;
    this._selectedLand = value;
  }
  public get selectedLand(): CampaignLandInfo {
    return CampaignTemplateManager.Instance.landDic[CampaignMapLand.None]; //this._selectedLand
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
  public maxChapter: CampaignChapterInfo;
  public bNovice = false;

  //新手时只开启第一个副本
  public onlyOpenOneItemInNovice() {
    this.bNovice = true;
    // for(let i = 1 ; i < _itemList.length ; i++){
    //     _itemList[i].isOpen = false;
    // }
  }

  public getTreeData(): any[] {
    // 主tab数据
    let firstData = [];
    // 子tab数据
    let secondData = [];

    /**默认有四个章节,tab顺序
     * 活动副本
     * 60以下副本
     * 60-80副本
     * 周副本
     */
    let chapterDic = this.selectedLand.chapterDic;
    for (let i = 0; i < 4; i++) {
      let chapterTitle: string = "";
      let chapterInfo: CampaignChapterInfo;
      switch (i) {
        case 0:
          chapterInfo = chapterDic[3];
          chapterTitle = PveMultiCampaignData.ChapterTitle[2];
          break;
        case 1:
          chapterInfo = chapterDic[1];
          chapterTitle = PveMultiCampaignData.ChapterTitle[0];
          break;
        case 2:
          chapterInfo = chapterDic[2];
          chapterTitle = PveMultiCampaignData.ChapterTitle[1];
          break;
        case 3:
          chapterInfo = chapterDic[4];
          chapterTitle = PveMultiCampaignData.ChapterTitle[3];
          break;
      }
      if (!chapterInfo) continue;
      let areaDataList = chapterInfo.areaDic.getList();
      let mainTabEnable = true;
      if (
        chapterTitle == PveMultiCampaignData.ChapterTitle[2] &&
        this.thane.grades < PveMultiCampaignData.LevelLimit
      ) {
        mainTabEnable = false;
      }
      firstData.push(
        new SelectCampaignItemData(
          eSelectCampaignItemType.FirstItem,
          chapterTitle,
          chapterInfo.chapterId,
          mainTabEnable,
        ),
      );

      areaDataList.sort((a: CampaignAreaInfo, b: CampaignAreaInfo) => {
        return a.areaId - b.areaId;
      });

      let temp = [];
      for (let i = 0; i < PveMultiCampaignData.AreaMaxLen; i++) {
        let areaData = areaDataList[i] as CampaignAreaInfo;
        if (!areaData) continue;

        let campaignData = areaData.getMapByDifficult(
          CampaignMapDifficulty.General,
        );
        this.addOpenCampaignData(campaignData);

        // let areaEnabled = !(campaignData.MinLevel > ArmyManager.Instance.thane.grades)
        let areaEnabled = true;
        let grayFilterFlag =
          campaignData.MinLevel > ArmyManager.Instance.thane.grades;
        //王者之塔 屏蔽item
        // if (_tabThreeBtn.enabled && !ConfigManager.areaData.KING_TOWER && areaData.areaId == CommonConstant.KINGTOWER_AREAID)
        temp.push(
          new SelectCampaignItemData(
            eSelectCampaignItemType.SecondItem,
            {
              icon: areaData.getAreaSmallIcon(),
              text: areaData.getItemTitle(),
            },
            areaData.areaId,
            areaEnabled,
            grayFilterFlag,
          ),
        );
      }
      secondData.push(
        new SelectCampaignItemData(eSelectCampaignItemType.SecondItem, temp),
      );
    }
    return [firstData, secondData];
  }

  public getDistrictRewardById(chapterId: number): any[] {
    //优化标记 数据量很大, 没看懂业务。
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

  private addOpenCampaignData(value: t_s_campaignData) {
    this._openCampaignDataDic.add(value.CampaignId, value);
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

  public get hellMap(): t_s_campaignData {
    if (!this.selectedArea) return null;
    return this.selectedArea.getMapByDifficult(CampaignMapDifficulty.Hell);
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

  public isHellOpen(): boolean {
    if (
      this.hellMap &&
      this.hellMap.state != CampaignMapStatus.NO_ACCEPT_CAMPAIGN
    )
      return true;
    return false;
  }

  private checkExist(type: number): boolean {
    if (!this.selectedArea) return false;
    if (!this.selectedArea.getMapByDifficult(type)) return false;
    return true;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }
}
