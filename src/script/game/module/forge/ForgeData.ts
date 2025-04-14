//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-05 21:31:47
 * @LastEditTime: 2024-04-17 10:40:50
 * @LastEditors: jeremy.xu
 * @Description: 铁匠铺数据
 */

import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../../component/FilterFrameText";
import { t_s_composeData } from "../../config/t_s_compose";
import { CommonConstant } from "../../constant/CommonConstant";
import { ConfigType } from "../../constant/ConfigDefine";
import GoodsSonType from "../../constant/GoodsSonType";
import { GoodsType } from "../../constant/GoodsType";
import GTabIndex from "../../constant/GTabIndex";
import ItemID from "../../constant/ItemID";
import OpenGrades from "../../constant/OpenGrades";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { ComposeGoodsInfo } from "../../datas/goods/ComposeGoodsInfo";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import GoodsProfile from "../../datas/goods/GoodsProfile";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { SharedManager } from "../../manager/SharedManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { BaseArmy } from "../../map/space/data/BaseArmy";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import FrameDataBase from "../../mvc/FrameDataBase";

export enum eForgeComposeTargetItemType {
  NORMAL_CELL = 1,
  SUIT_MENU_CELL,
  EPIC_MENU_CELL,
  SUIT_CELL,
  EPIC_CELL,
}

export enum eForgeComposeEquipGroup {
  HERALDRY_RELIC = 100, // 纹章和圣物
}

export default class ForgeData extends FrameDataBase {
  public static BagPageSize = 25;
  public static ZHMateNum = 8;
  public static FJEquipNum = 8;
  public static FJGotMateMaxNum = 6;
  public static FJGotMateMinNum = 3;
  public static XQJewelNum = 4;
  public static XLAttrNum = 5;

  public static TabIndex = {
    QH: Math.floor(GTabIndex.Forge_QH / 1000), // 强化
    XQ: Math.floor(GTabIndex.Forge_XQ / 1000), // 镶嵌
    HC: Math.floor(GTabIndex.Forge_HC / 1000), // 合成
    HC_ZB: Math.floor(GTabIndex.Forge_HC_ZB / 1000),
    HC_ZBSJ: Math.floor(GTabIndex.Forge_HC_ZBSJ / 1000),
    HC_ZBJJ: Math.floor(GTabIndex.Forge_HC_ZBJJ / 1000),
    HC_BS: Math.floor(GTabIndex.Forge_HC_BS / 1000),
    HC_SJ: Math.floor(GTabIndex.Forge_HC_SJ / 1000),
    HC_DJ: Math.floor(GTabIndex.Forge_HC_DJ / 1000),
    XL: Math.floor(GTabIndex.Forge_XL / 1000), // 洗练
    // FJ: Math.floor(GTabIndex.Forge_FJ / 1000), // 分解
    ZH: Math.floor(GTabIndex.Forge_ZH / 1000), // 转换
    SZ: Math.floor(GTabIndex.Forge_SZ / 1000), // 神铸
  };

  public static HelpIndex = {
    [ForgeData.TabIndex.QH]: 1,
    [ForgeData.TabIndex.XQ]: 2,
    [ForgeData.TabIndex.HC]: 3,
    [ForgeData.TabIndex.XL]: 4,
    // [ForgeData.TabIndex.FJ]: 5,
    [ForgeData.TabIndex.ZH]: 6,
    [ForgeData.TabIndex.SZ]: 7,
  };

  // 2180003        暗夜铁骑卡
  // 2180004        皇家铁骑卡
  // 2180005        疾风铁骑卡
  // 2180013        魔夜卡
  // 2180022        冰牙卡
  // 2180028        魔兽·影灵卡
  public static ComposeOne = [
    2180003, 2180004, 2180005, 2180013, 2180022, 2180028,
  ];

  public static checkComposeOneMountCard(mountCardTempId: number) {
    if (ForgeData.ComposeOne.indexOf(mountCardTempId) != -1) {
      return true;
    }
    return false;
  }

  public static Colors = FilterFrameText.Colors[eFilterFrameText.ItemQuality];

  public static getAddIcon(): string {
    return fgui.UIPackage.getItemURL(EmPackName.Base, "Icon_IconBox_Add");
  }
  public static getLockIcon(): string {
    return fgui.UIPackage.getItemURL(EmPackName.Base, "Icon_IconBox70_Lock2");
  }

  // 镶嵌
  public static SUCCESS_RATE: number = 100;
  public static RATE_STEP: number = 10;

  public static WASH_LOCK_PRICE: number = 10; // 洗炼锁价格
  public static JEWEL_LEVEL: number = 3;
  public static JEWEL_GRADE_LIMIT: number = 30; // 合成JEWEL_LEVEL级以上宝石, 水晶需要达到的角色等级

  // 合成  1: 装备  2: 道具   3:宝石   5: 装备进阶  6: 水晶   10: 装备升级
  public static COMPOSE_TYPE_EQUIP: number = 1;
  public static COMPOSE_TYPE_ADVANCE_EQUIP: number = 5;
  public static COMPOSE_TYPE_UPGRADE_EQUIP: number = 10;
  public static COMPOSE_TYPE_PROP: number = 2;
  public static COMPOSE_TYPE_GEM: number = 3;
  public static COMPOSE_TYPE_CRYSTAL: number = 6;

  public static MOULD_NEED_MATERIAL1: number = 2120100;
  public static MOULD_NEED_MATERIAL2: number = 2120101;
  // public static MOULD_NEED_MATERIAL_SENIOR1: number = 2120102;
  // public static MOULD_NEED_MATERIAL_SENIOR2: number = 2120103;
  // public static MOULD_NEED_MATERIAL_VICE1: number = 2120104;
  // public static MOULD_NEED_MATERIAL_VICE2: number = 2120105;
  // public static MOULD_NEED_MATERIAL_THREE1: number = 2120106;
  // public static MOULD_NEED_MATERIAL_THREE2: number = 2120107;
  public static MOULD_MAX_GRADE: number = 80;
  public static MOULD_MAX_RANK: number = 8;
  public static MOULD_MAX_RANK_SENIOR: number = 16;
  public static MOULD_MAX_RANK_THREE: number = 24;
  public static MOULE_NEED_TEMP_GRADE: number = 80; //神铸所需装备等级
  public static MOULD_MAX_GRADE_SENIOR: number = 160;
  public static MOULD_MAX_GRADE_THREE: number = 240;
  public static MOULD_MAX_BLESS: number = 100;
  public static MOULD_EXTENS_COST: number = 200;
  public static COMPOSE_SENIOR_EQUIP_NEED_MOULD_GRADE: number = 20; // 合成高级装备需要2阶10星

  public allTemList: ComposeGoodsInfo[] = [];
  public propertyTemList: ComposeGoodsInfo[] = [];
  public equipTemList: ComposeGoodsInfo[] = [];
  public advanceEquipList: ComposeGoodsInfo[] = [];
  public upgradeEquipList: ComposeGoodsInfo[] = [];
  public gemTemList: ComposeGoodsInfo[] = [];
  public crystalList: ComposeGoodsInfo[] = [];
  public goodsNumList: SimpleDictionary = new SimpleDictionary();

  private _selectedCompose: ComposeGoodsInfo;
  private _currentComposeCount: number = 1;
  public composeType: number = 0;
  public canCompose: boolean = false;
  public composeAutoBuy: boolean = false;

  public defPropMetaId: number = 0; //打开合成要合成的物品
  public defEquipMetaId: number = 0; //打开合成要合成的套装
  public defSEquipMetaId: number = 0; //打开合成要合成的进阶装备
  public defComposeGoodInfo: ComposeGoodsInfo; //默认选中的合成装备

  public composeSuitDic: SimpleDictionary = new SimpleDictionary(); //套装
  public composeListDic: SimpleDictionary = new SimpleDictionary(); //每个套装的所有装备
  public composeDataList: ComposeGoodsInfo[] = [];

  // 正在强化
  public isIntensifing: boolean;
  // 背包数据
  public bagData: GoodsInfo[] = [];

  protected show(): void {
    super.show();
    this.initComposeInfo();
  }

  protected hide(): void {
    super.hide();
  }

  /**
   * 不同页面排序规则
   * @param index ForgeData.TabIndex
   */
  public refreshBagData(index: number = 0) {
    this.bagData = [];
    let arr: any[] = [];
    let arr1: any[] = GoodsManager.Instance.getHeroEquipListById(
      this.thane.id,
    ).getList();
    arr1.sort(this.sortHeroEquip);
    let arr2: any[] = GoodsManager.Instance.getGeneralBagEquipList();
    arr2.sort(this.sortHeroEquip);
    let arr3: any[] = GoodsManager.Instance.getGeneralBagPropList();
    arr3.sort(this.sortByTpye);
    switch (index) {
      case ForgeData.TabIndex.QH:
      case ForgeData.TabIndex.XQ:
      case ForgeData.TabIndex.XL:
        arr = arr.concat(arr1).concat(arr3).concat(arr2);
        break;
      // case ForgeData.TabIndex.FJ:
      default:
        arr = arr.concat(arr1).concat(arr3).concat(arr2);
        break;
    }
    let gInfo: GoodsInfo;
    for (let i: number = 0; i < arr.length; i++) {
      gInfo = arr[i] as GoodsInfo;
      if (
        !GoodsManager.Instance.isGneralBagGoods(gInfo) &&
        !GoodsManager.Instance.isHeroGoods(
          this.uArmy.baseHero ? this.uArmy.baseHero.id : 0,
          gInfo,
        )
      )
        continue;
      if (this.filterGoods(gInfo)) this.bagData.push(gInfo);
    }
  }

  //////////////////////////////// 合成 //////////////////////////////////
  public get selectedCompose(): ComposeGoodsInfo {
    return this._selectedCompose;
  }

  public set selectedCompose(value: ComposeGoodsInfo) {
    this._selectedCompose = value;
  }

  public get currentComposeCount(): number {
    return this._currentComposeCount;
  }

  public set currentComposeCount(value: number) {
    value = value < 0 ? 0 : value;
    if (
      this._selectedCompose &&
      value == 0 &&
      (this._selectedCompose.canMakeCount > 0 || this._selectedCompose.template)
    )
      value = 1;
    this._currentComposeCount = value;
  }

  public get maxComposeCount() {
    return this.selectedCompose ? this.selectedCompose.canMakeCount : 0;
  }

  public getSuitName(itemType: number, groupId: number): string {
    if (groupId == eForgeComposeEquipGroup.HERALDRY_RELIC) {
      return LangManager.Instance.GetTranslation(
        "store.view.compose.ComposeCellButton.suitGroupS1",
      );
    }
    switch (itemType) {
      case eForgeComposeTargetItemType.SUIT_MENU_CELL:
        return LangManager.Instance.GetTranslation(
          "store.view.compose.ComposeCellButton.suitGroup",
          groupId,
        );
      case eForgeComposeTargetItemType.EPIC_MENU_CELL:
        return LangManager.Instance.GetTranslation(
          "store.view.compose.ComposeCellButton.suitEpicGroup",
          groupId,
        );
      default:
        return "";
    }
  }

  public getStrengthenGrade(gInfo: GoodsInfo): object {
    return gInfo.strengthenGrade > 0 ? "+" + gInfo.strengthenGrade : "";
  }

  public getTreeDataByType(type: number) {
    this.composeSuitDic.clear();
    this.composeListDic.clear();
    this.composeDataList = [];

    var playerJob =
      PlayerManager.Instance.currentPlayerModel.playerInfo.job % 3;
    if (playerJob == 0) playerJob = 3;
    let isReverse: boolean = false; //是否倒序
    if (
      type == ForgeData.COMPOSE_TYPE_EQUIP ||
      type == ForgeData.COMPOSE_TYPE_UPGRADE_EQUIP ||
      type == ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP
    ) {
      isReverse = true;
    }
    let slist = this.getComposeListByType(type);
    let openHERALDRY: boolean = false;
    if (isReverse) {
      for (let index = slist.length - 1; index >= 0; index--) {
        const cGoodInfo = slist[index];
        if (this.canCompose && cGoodInfo.canMakeCount <= 0) continue;
        if (
          cGoodInfo.template.NewMaterial.toString().substr(0, 3) ==
          CommonConstant.MOUNT_CARD
        ) {
          if (cGoodInfo.template.NeedMinLevel > this.thane.grades) continue;
        } else {
          if (cGoodInfo.template.NeedMinLevel > this.thane.grades + 10)
            continue;
        }
        let temp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          cGoodInfo.template.NewMaterial,
        );

        let jobStr = temp.Job.join("") as string;
        let idx = jobStr.indexOf(String(playerJob));
        let notFit = idx == -1 && jobStr != "0";
        if (notFit) continue;

        cGoodInfo.cellType =
          type == ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP
            ? eForgeComposeTargetItemType.EPIC_CELL
            : eForgeComposeTargetItemType.SUIT_CELL;
        let groupId = cGoodInfo.template.NeedMinLevel;
        if (
          temp.SonType == GoodsSonType.SONTYPE_HERALDRY ||
          temp.SonType == GoodsSonType.SONTYPE_RELIC
        ) {
          groupId = eForgeComposeEquipGroup.HERALDRY_RELIC;
          openHERALDRY = true;
        }

        let suitInfo = this.composeSuitDic[groupId];
        let list = this.composeListDic[groupId];
        if (!suitInfo) {
          suitInfo = new ComposeGoodsInfo();
          suitInfo.groupId = groupId;
          suitInfo.cellType =
            type == ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP
              ? eForgeComposeTargetItemType.EPIC_MENU_CELL
              : eForgeComposeTargetItemType.SUIT_MENU_CELL;
          this.composeSuitDic.add(groupId, suitInfo);
        }
        if (!list) {
          list = [];
          this.composeListDic.add(groupId, list);
        }
        list.push(cGoodInfo);
      }
    } else {
      for (let index = 0; index < slist.length; index++) {
        const cGoodInfo = slist[index];

        if (this.canCompose && cGoodInfo.canMakeCount <= 0) continue;

        if (
          cGoodInfo.template.NewMaterial.toString().substr(0, 3) ==
          CommonConstant.MOUNT_CARD
        ) {
          if (cGoodInfo.template.NeedMinLevel > this.thane.grades) continue;
        } else {
          if (cGoodInfo.template.NeedMinLevel > this.thane.grades + 10)
            continue;
        }
        let temp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          cGoodInfo.template.NewMaterial,
        );

        let jobStr = temp.Job.join("") as string;
        let idx = jobStr.indexOf(String(playerJob));
        let notFit = idx == -1 && jobStr != "0";
        if (notFit) continue;

        cGoodInfo.cellType = eForgeComposeTargetItemType.NORMAL_CELL;
        this.composeDataList.push(cGoodInfo);
      }
    }
    Logger.info(
      "[ForgeData]getTreeDataByType",
      type,
      this.composeSuitDic,
      this.composeListDic,
    );
    if (
      isReverse &&
      (type == ForgeData.COMPOSE_TYPE_EQUIP ||
        type == ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP) &&
      openHERALDRY
    ) {
      //纹章与圣物在最上，套装以等级倒序排列
      let arr = this.composeSuitDic.getList();
      let end = arr.splice(arr.length - 1);
      arr.unshift(end[0]);
      let arr1 = this.composeListDic.getList();
      let end1 = arr1.splice(arr1.length - 1);
      arr1.unshift(end1[0]);
    }
    this.refreshCanMakeCount();
  }

  private refreshCanMakeCount() {
    this.composeSuitDic.forEach((suitInfo: ComposeGoodsInfo) => {
      let count = 0;
      let sList = this.composeListDic[suitInfo.groupId];
      if (sList) {
        sList.forEach((info: ComposeGoodsInfo) => {
          count += info.canMakeCount;
        });
        suitInfo.canMakeCount = count;
      }
    });
  }

  public getComposeListByType(type: number): ComposeGoodsInfo[] {
    switch (type) {
      case ForgeData.COMPOSE_TYPE_EQUIP:
        return this.equipTemList;
      case ForgeData.COMPOSE_TYPE_PROP:
        return this.propertyTemList;
      case ForgeData.COMPOSE_TYPE_GEM:
        return this.gemTemList;
      case ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP:
        return this.advanceEquipList;
      case ForgeData.COMPOSE_TYPE_UPGRADE_EQUIP:
        return this.upgradeEquipList;
      case ForgeData.COMPOSE_TYPE_CRYSTAL:
        return this.crystalList;
    }
    return null;
  }

  public updateComposeGoodsCount() {
    this.calcGoodNumber();
    this.allTemList.forEach((info: ComposeGoodsInfo) => {
      info.ownCount1 = this.getNumByTempId(info.template.Material1);
      info.ownCount2 = this.getNumByTempId(info.template.Material2);
      info.ownCount3 = this.getNumByTempId(info.template.Material3);
      info.ownCount4 = this.getNumByTempId(info.template.Material4);
      info.canMakeCount = info.getCanMakeCount();
    });
    // Logger.info("[ForgeData]updateComposeGoodsCount", this.allTemList)
  }

  private calcGoodNumber() {
    this.goodsNumList.clear();
    let sDic: SimpleDictionary =
      GoodsManager.Instance.getHeroEquipBagAndPlayerBagList();
    sDic.forEach((item: GoodsInfo) => {
      if (this.goodsNumList[item.templateId]) {
        this.goodsNumList[item.templateId] =
          Number(this.goodsNumList[item.templateId]) + item.count;
      } else {
        this.goodsNumList[item.templateId] = item.count;
      }
    });

    // sDic.forEach((item: GoodsInfo) => {
    //     let num = this.goodsNumList[item.templateId]
    //     if (num && item && item.templateInfo) {
    //         Logger.info("calcGoodNumber", item.templateId, item.templateInfo.TemplateName, item.mouldGrade, num)
    //     }
    // })

    // Logger.info("[ForgeData]calcGoodNumber", this.goodsNumList)
  }

  private getNumByTempId(tempId: number): number {
    if (this.goodsNumList[tempId]) return Number(this.goodsNumList[tempId]);
    else return 0;
  }

  public initComposeInfo() {
    this.allTemList = [];
    this.equipTemList = [];
    this.gemTemList = [];
    this.crystalList = [];
    this.propertyTemList = [];
    this.advanceEquipList = [];
    this.upgradeEquipList = [];
    //优化标记 这个数据不小, 是否可以用 Types进行分类
    // let dic = ConfigMgr.Instance.getConfigMap(ConfigType.t_s_compose) as t_s_compose;
    // let item: t_s_composeData;
    // for (const key in dic) {
    //     if (Object.prototype.hasOwnProperty.call(dic, key)) {
    //         item = dic[key] as t_s_composeData;
    //         this.addComposeToTemp(item);
    //     }
    // }

    //优化标记-- 优化上面逻辑
    let composeListId =
      PlayerManager.Instance.currentPlayerModel.playerInfo.composeList;
    // Logger.info("[ForgeData]initComposeInfo", composeListId)
    let composeData: t_s_composeData;
    for (let composeId of composeListId) {
      composeData = TempleteManager.Instance.getComposeById(composeId);
      this.addComposeToTemp(composeData);
    }

    this.allTemList.sort(this.sortComposeList);
    this.equipTemList.sort(this.sortComposeList);
    this.gemTemList.sort(this.sortComposeList);
    this.crystalList.sort(this.sortComposeList);
    this.propertyTemList.sort(this.sortComposeList);
    this.advanceEquipList.sort(this.sortComposeList);
    this.upgradeEquipList.sort(this.sortComposeList);

    // Logger.info("升级装备", this.upgradeEquipList)
    this.updateComposeGoodsCount();
  }

  private sortComposeList(
    tem1: ComposeGoodsInfo,
    tem2: ComposeGoodsInfo,
  ): number {
    let id1: number = tem1.template.NewMaterial;
    let id2: number = tem2.template.NewMaterial;
    return id1 - id2;
  }

  private addComposeToTemp(item: t_s_composeData) {
    if (!item) return;

    if (item.NeedMinLevel > OpenGrades.MAX_GRADE) return;
    let info: ComposeGoodsInfo = new ComposeGoodsInfo();
    info.templateId = item.Id;
    if (item.Types == ForgeData.COMPOSE_TYPE_PROP) {
      this.propertyTemList.push(info);
    } else if (item.Types == ForgeData.COMPOSE_TYPE_EQUIP) {
      this.equipTemList.push(info);
    } else if (item.Types == ForgeData.COMPOSE_TYPE_GEM) {
      this.gemTemList.push(info);
    } else if (item.Types == ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP) {
      this.advanceEquipList.push(info);
    } else if (item.Types == ForgeData.COMPOSE_TYPE_UPGRADE_EQUIP) {
      this.upgradeEquipList.push(info);
    } else if (item.Types == ForgeData.COMPOSE_TYPE_CRYSTAL) {
      this.crystalList.push(info);
    }
    if (info) this.allTemList.push(info);
  }

  public getComposeInfoByTemId(
    type: number,
    goodInfo: GoodsInfo,
  ): ComposeGoodsInfo {
    if (!type || !goodInfo) return null;
    let list: ComposeGoodsInfo[];
    switch (type) {
      case ForgeData.COMPOSE_TYPE_PROP:
        list = this.propertyTemList;
        break;
      case ForgeData.COMPOSE_TYPE_EQUIP:
        list = this.equipTemList;
        break;
      case ForgeData.COMPOSE_TYPE_GEM:
        list = this.gemTemList;
        break;
      case ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP:
        list = this.advanceEquipList;
        break;
      case ForgeData.COMPOSE_TYPE_UPGRADE_EQUIP:
        list = this.upgradeEquipList;
        break;
      case ForgeData.COMPOSE_TYPE_CRYSTAL:
        list = this.crystalList;
        break;
    }
    if (list) {
      for (let index = 0; index < list.length; index++) {
        const info = list[index] as ComposeGoodsInfo;
        if (info.template.Material1 == goodInfo.templateId) return info;
      }
    }
    return null;
  }

  public getComposeTypeByTabIndex(index: number) {
    let type;
    switch (index) {
      case ForgeData.TabIndex.HC_ZB:
        type = ForgeData.COMPOSE_TYPE_EQUIP;
        break;
      case ForgeData.TabIndex.HC_ZBJJ:
        type = ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP;
        break;
      case ForgeData.TabIndex.HC_ZBSJ:
        type = ForgeData.COMPOSE_TYPE_UPGRADE_EQUIP;
        break;
      case ForgeData.TabIndex.HC_BS:
        type = ForgeData.COMPOSE_TYPE_GEM;
        break;
      case ForgeData.TabIndex.HC_SJ:
        type = ForgeData.COMPOSE_TYPE_CRYSTAL;
        break;
      case ForgeData.TabIndex.HC_DJ:
        type = ForgeData.COMPOSE_TYPE_PROP;
        break;
    }
    return type;
  }

  private checkOwn(item: t_s_composeData): boolean {
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    return (
      playerInfo.composeList && playerInfo.composeList.indexOf(item.Id) >= 0
    );
  }

  // public setComposeCount(reduce: boolean, promptly: boolean) {
  // if (this.selectedCompose) {
  //     if (reduce && this.currentComposeCount > 1)
  //         this.currentComposeCount--;
  //     else if (!reduce && this.currentComposeCount < this.selectedCompose.canMakeCount && !promptly) {
  //         this.currentComposeCount++;
  //     } else if (!reduce && promptly) {
  //         if (this.currentComposeCount < 9)
  //             this.currentComposeCount++;
  //     }
  // }
  // }

  public getComposeCount(compAll: boolean) {
    return compAll ? this.maxComposeCount : this.currentComposeCount;
  }

  /**
   * 获取当前进阶的装备
   */
  public getCurrentUpgradeEquipGoodsInfo(): GoodsInfo {
    let goodTempId: number;
    let goodsInfo: GoodsInfo;
    let arr: any[];
    if (this._selectedCompose) {
      goodTempId = this._selectedCompose.template.Material1;
      goodsInfo = GoodsManager.Instance.getGoodsByObjectIdAndGoodID(
        this.thane.id,
        goodTempId,
      );
      if (goodsInfo) {
        return goodsInfo;
      } else {
        arr = GoodsManager.Instance.getBagGoodsByTemplateId(goodTempId);
        if (arr.length > 0) goodsInfo = arr[0];
        return goodsInfo;
      }
    }
    return null;
  }

  /////////////////////////////////////////////////////////

  private get uArmy(): BaseArmy {
    return ArmyManager.Instance.army;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private filterGoods(gInfo: GoodsInfo): boolean {
    if (ForgeData.isFashion(gInfo)) return false;

    if (this.curTabIndex == ForgeData.TabIndex.QH) {
      if (gInfo.templateInfo.SonType == GoodsSonType.SONTYPE_INTENSIFY)
        return true;
      else if (gInfo.templateInfo.StrengthenMax > 0) return true;
    } else if (this.curTabIndex == ForgeData.TabIndex.XQ) {
      if (gInfo.templateInfo.SonType == GoodsSonType.ARTIFACT)
        //镶嵌页签，屏蔽sontype为120的物品
        return false;
      else if (gInfo.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT)
        return true;
      else if (gInfo.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT_PORP)
        return true;
      else if (
        gInfo.templateInfo.MasterType == GoodsType.EQUIP &&
        gInfo.templateInfo.SonType != GoodsSonType.SONTYPE_WING
      )
        return true;
    } else if (this.curTabIndex == ForgeData.TabIndex.HC) {
      return true;
    } else if (this.curTabIndex == ForgeData.TabIndex.XL) {
      if (gInfo.templateInfo.SonType == GoodsSonType.SONTYPE_REFRESH)
        return true;
      else if (
        gInfo.templateInfo.MasterType == GoodsType.EQUIP &&
        gInfo.templateInfo.Refresh != 0
      )
        return true;
      else if (gInfo.templateInfo.TemplateId == ItemID.REFRESH_LOCK_PROP)
        return true;
    }
    // else if (this.curTabIndex == ForgeData.TabIndex.FJ) {
    //     if (gInfo.templateInfo.SonType == GoodsSonType.SONTYPE_REFRESH)
    //         return true;
    //     else if (gInfo.templateInfo.MasterType == GoodsType.EQUIP && gInfo.templateInfo.Profile < GoodsProfile.Level6 && gInfo.templateInfo.Refresh != 0 && gInfo.objectId != this.thane.id)
    //         return true;
    // }
    else if (this.curTabIndex == ForgeData.TabIndex.ZH) {
      if (gInfo.templateInfo.TransformId > 0) return true;
    } else if (this.curTabIndex == ForgeData.TabIndex.SZ) {
      if (gInfo.templateId == ForgeData.MOULD_NEED_MATERIAL1) return true;
      else if (gInfo.templateId == ForgeData.MOULD_NEED_MATERIAL2) return true;
      // else if (gInfo.templateId == ForgeData.MOULD_NEED_MATERIAL_SENIOR1)
      //     return true;
      // else if (gInfo.templateId == ForgeData.MOULD_NEED_MATERIAL_SENIOR2)
      //     return true;
      // else if (gInfo.templateId == ForgeData.MOULD_NEED_MATERIAL_VICE1)
      //     return true;
      // else if (gInfo.templateId == ForgeData.MOULD_NEED_MATERIAL_VICE2)
      //     return true;
      else if (
        gInfo.templateInfo.StrengthenMax > 0 &&
        gInfo.templateInfo.Profile >= GoodsProfile.Level5 &&
        gInfo.templateInfo.NeedGrades >= 80
      )
        return true;
    }
    return false;
  }

  private sortHeroEquip(item1: GoodsInfo, item2: GoodsInfo): number {
    if (!item1.isBinds && item2.isBinds) {
      return -1;
    } else if (item1.isBinds && !item2.isBinds) {
      return 1;
    } else {
      if (item1.templateInfo.Profile > item2.templateInfo.Profile) {
        return -1;
      } else if (item1.templateInfo.Profile < item2.templateInfo.Profile) {
        return 1;
      } else {
        if (item1.templateInfo.NeedGrades > item2.templateInfo.NeedGrades) {
          return -1;
        } else if (
          item1.templateInfo.NeedGrades < item2.templateInfo.NeedGrades
        ) {
          return 1;
        } else {
          if (item1.strengthenGrade > item2.strengthenGrade) {
            return -1;
          } else if (item1.strengthenGrade < item2.strengthenGrade) {
            return 1;
          } else {
            return 0;
          }
        }
      }
    }
  }

  private sortByTpye(item1: GoodsInfo, item2: GoodsInfo): number {
    if (item1.isBinds == false && item2.isBinds == true) {
      return -1;
    } else if (
      (item1.isBinds == true && item2.isBinds == true) ||
      (item1.isBinds == false && item2.isBinds == false)
    ) {
      if (item1.templateInfo.MasterType > item2.templateInfo.MasterType) {
        return -1;
      } else if (
        item1.templateInfo.MasterType == item2.templateInfo.MasterType
      ) {
        if (item1.templateInfo.NeedGrades > item2.templateInfo.NeedGrades) {
          return -1;
        } else if (
          item1.templateInfo.NeedGrades == item2.templateInfo.NeedGrades
        ) {
          if (item1.templateInfo.TemplateId > item2.templateInfo.TemplateId) {
            return -1;
          } else if (
            item1.templateInfo.TemplateId == item2.templateInfo.TemplateId
          ) {
            if (item1.templateInfo.Profile > item2.templateInfo.Profile) {
              return -1;
            } else if (
              item1.templateInfo.Profile < item2.templateInfo.Profile
            ) {
              return 1;
            } else return 0;
          } else {
            return 1;
          }
        } else {
          return 1;
        }
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  }

  /**
   * 是否时装（根据GoodsInfo）
   */
  public static isFashion(info: GoodsInfo): boolean {
    if (!info || !info.templateInfo) return false;
    if (info.templateInfo.MasterType != GoodsType.EQUIP) return false;
    if (info.templateInfo.SonType == GoodsSonType.FASHION_CLOTHES) return true; //时装衣服
    if (info.templateInfo.SonType == GoodsSonType.FASHION_HEADDRESS)
      return true; //时装帽子
    if (info.templateInfo.SonType == GoodsSonType.FASHION_WEAPON) return true; //时装武器
    if (info.templateInfo.SonType == GoodsSonType.SONTYPE_WING) return true; //时装翅膀
    return false;
  }

  public static resolve(id: number): number {
    return 18;
    // let profile: number = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, id).Profile;
    // let num: number;
    // switch (profile) {
    //     case 1:
    //     case 2:
    //         num = 1;
    //         break;
    //     case 3:
    //         num = 4;
    //         break;
    //     case 4:
    //         num = 18;
    //         break;
    //     case 5:
    //         num = 18;
    //         break;
    //     case 6:
    //         num = 24;
    //         break;
    //     default:
    //         num = 100;
    //         break;
    // }
    // return num;
  }

  // 洗练统一18个
  public static mateMaterial(id: number): number {
    return 18;
  }

  public static getSuccessRate(gInfo1: GoodsInfo, gInfo2: GoodsInfo): number {
    let rate: number;
    if (gInfo1) {
      rate =
        ForgeData.SUCCESS_RATE - gInfo1.strengthenGrade * ForgeData.RATE_STEP;
      rate = rate > 100 ? 100 : rate < 10 ? 10 : rate;
    }
    if (gInfo2) rate += gInfo2.templateInfo.Property1;
    rate = rate > 100 ? 100 : rate;
    return rate;
  }

  public static checkCanIntensify(
    neededGold: number,
    gInfo1: GoodsInfo,
  ): boolean {
    let level1: number = gInfo1.strengthenGrade;
    let gold: number = ResourceManager.Instance.gold.count;
    let str: string = "";
    if (neededGold > gold) {
      str = LangManager.Instance.GetTranslation(
        "store.utils.StoreHelper.command01",
        neededGold - gold,
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (level1 >= gInfo1.templateInfo.StrengthenMax) {
      str = LangManager.Instance.GetTranslation(
        "store.utils.StoreHelper.command02",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    return true;
  }

  // public static isResolveEquip(info: GoodsInfo): number {
  //     let str: string
  //     if (ForgeData.currentTabIndex == ForgeData.TabIndex.FJ && info.templateInfo.MasterType == GoodsType.EQUIP) {
  //         if (info.isLock) {
  //             MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Forge.PleaseUnLock"));
  //             return -1;
  //         }
  //         if (info.existJewel()) {
  //             str = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command01");
  //             MessageTipManager.Instance.show(str);
  //             return -1;
  //         }
  //         for (let i: number = 0; i < ForgeData.FJEquipNum; i++) {
  //             let info: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(i);
  //             if (info == null) {
  //                 return i;
  //             }
  //         }
  //         str = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command02");
  //         MessageTipManager.Instance.show(str);
  //         return -1;

  //     } else if (ForgeData.currentTabIndex == ForgeData.TabIndex.FJ && info.templateInfo.MasterType != GoodsType.EQUIP) {
  //         str = LangManager.Instance.GetTranslation("cell.mediator.storebag.IntensifyBagCellDropMediator.command01");
  //         MessageTipManager.Instance.show(str);
  //         return -2;
  //     }
  //     return 0;
  // }

  public static checkEquipCanNotResolve(info: GoodsInfo): boolean {
    if (info.isLock) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("Forge.PleaseUnLock"),
      );
      return true;
    }
    if (info.existJewel()) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "cell.mediator.storebag.StoreBagCellClickMediator.command01",
        ),
      );
      return true;
    }
    return false;
  }

  public static showResolveAlert(): boolean {
    let preDate: Date = new Date(
      SharedManager.Instance.resolveStrengthenCheckDate,
    );
    let now: Date = new Date();
    let outdate: boolean = false;
    let check: boolean = SharedManager.Instance.resolveStrengthen;
    if (
      !check ||
      (preDate.getMonth() <= preDate.getMonth() &&
        preDate.getDate() < now.getDate())
    ) {
      outdate = true;
    }
    return outdate;
  }

  public get upgradeEquipOpen() {
    let upgradelist = this.getComposeListByType(
      ForgeData.COMPOSE_TYPE_UPGRADE_EQUIP,
    );
    let upgradeCount: number = 0;
    for (let index = 0; index < upgradelist.length; index++) {
      const cGoodInfo = upgradelist[index];
      if (cGoodInfo.template.NeedMinLevel > this.thane.grades + 10) continue;
      upgradeCount++;
    }
    return upgradeCount > 0;
  }

  public get advanceEquipOpen() {
    let advancelist = this.getComposeListByType(
      ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP,
    );
    let advanceCount: number = 0;
    for (let index = 0; index < advancelist.length; index++) {
      const cGoodInfo = advancelist[index];
      if (cGoodInfo.template.NeedMinLevel > this.thane.grades + 10) continue;
      advanceCount++;
    }
    return advanceCount > 0;
  }

  public get curTabIndex(): number {
    let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Forge);
    if (!ctrl.view) return 0;
    return ctrl.view.curTabIndex;
  }

  public static get currentTabIndex(): number {
    let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Forge);
    return ctrl.view.curTabIndex;
  }

  public static getMouldSuccessRate(gInfo: GoodsInfo): number {
    let rate: number;
    let targetStar: number;
    if (gInfo) {
      if (gInfo.mouldStar == 10) {
        targetStar = 1;
      } else {
        targetStar = gInfo.mouldStar + 1;
      }
      if (targetStar <= 5) {
        rate = 50 - 10 * (targetStar - 1);
      } else {
        rate = 5;
      }
    }
    rate = rate > 100 ? 100 : rate;
    return rate;
  }

  public dispose() {
    this.isIntensifing = false;
    this.canCompose = false;
    this.selectedCompose = null;
  }
}
