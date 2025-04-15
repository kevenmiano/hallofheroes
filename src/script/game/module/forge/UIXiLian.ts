/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-08-15 12:13:32
 * @LastEditors: jeremy.xu
 * @Description:
 */

import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { PackageIn } from "../../../core/net/PackageIn";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { BagType } from "../../constant/BagDefine";
import { ConfigType } from "../../constant/ConfigDefine";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ConfigManager } from "../../manager/ConfigManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import ForgeCtrl from "./ForgeCtrl";
import ForgeData from "./ForgeData";
import { ForgeSocketOutManager } from "./ForgeSocketOutManager";
import ForgeRefreshItem from "./item/ForgeRefreshItem";

//@ts-expect-error: External dependencies

import SmithFreshRspMsg = com.road.yishi.proto.store.SmithFreshRspMsg;
//@ts-expect-error: External dependencies

import RefreshPropertyRepMsg = com.road.yishi.proto.store.RefreshPropertyRepMsg;
import { StoreIntensifyCell } from "../../component/item/StoreIntensifyCell";
import { BaseItem } from "../../component/item/BaseItem";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { SharedManager } from "../../manager/SharedManager";
import ItemID from "../../constant/ItemID";
import FUI_comTotalEvalue from "../../../../fui/Forge/FUI_comTotalEvalue";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import UIManager from "../../../core/ui/UIManager";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";

export default class UIXiLian extends BaseFguiCom {
  private itemTarget: StoreIntensifyCell;
  private itemMate1: BaseItem;
  private itemMate2: BaseItem;
  private attrList: fgui.GList;
  private txtCostMateDesc: fgui.GLabel;
  private txtLockCount: fgui.GLabel;
  private txtName: fgui.GLabel;
  private imgArrow: fgui.GImage;
  private btnReplace: fgui.GButton;
  private btnXiLian: fgui.GButton;
  private comCurTotalEvalute: FUI_comTotalEvalue;
  private comNextTotalEvalute: FUI_comTotalEvalue;

  private _useBindStone: boolean = true; // 优先使用绑定洗炼石
  private _useDiamondAutoBuy: boolean = true; // 使用钻石自动购买

  private _bindsPrompt: boolean = true;
  private _stoneOffsetDiamond: number = 0; //不足的总钻石  不足的洗炼石*单价
  private _stoneOffsetCount: number = 0; //不足的洗炼石数量
  private _stoneName: string = ""; //洗炼石名字
  private _stoneTempId: number = 0; //洗炼石tmpId
  private _curLockCount: number = 0; //有多少锁住的
  private _ownLockCount: number = 0; //拥有多少锁

  private _bindStoneMateCount: number = 0;
  private _nobindStoneMateCount: number = 0;
  private _needStoneMateCount: number = 0; //需要的洗炼石数目
  private _needDiamondCount: number = 0; //需要钻石数量 洗炼石+锁

  private _itemDic: SimpleDictionary = new SimpleDictionary();
  private tipItem: BaseTipItem;
  constructor(comp: fgui.GComponent) {
    super(comp);

    this.itemTarget.item.pos = 0;
    this._itemDic.add("0_0_" + BagType.Hide, this.itemTarget);
    this.btnXiLian.onClick(this, this.btnXiLianClick.bind(this));
    this.btnReplace.onClick(this, this.btnReplaceClick.bind(this));
    this.updateLockCount();
    this.resetView();
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_XILIAN_SUO);
  }

  refresh(tag: string, data: any) {
    switch (tag) {
      case "BagItemUpdate":
        this.__bagItemUpdateHandler(data);
        break;
      case "BagItemDelete":
        this.__bagItemDeleteHandler(data);
        break;
      case "RefreshRandomProperty":
        this.__onRefreshRandomProperty(data);
        break;
      case "RefreshItemProperty":
        this.__onRefreshItemProperty(data);
        break;
      case "BagMoveUpdate":
        this.__onBagMoveUpdate(data);
        break;
      case "RefreshItemLock":
        this.updateMaterial();
        break;
    }
  }

  refreshResources() {}

  private __onRefreshRandomProperty(pkg: PackageIn) {
    Logger.xjy("[UIXiLian]__onRefreshRandomProperty");
    let cnt = 0;
    let skillIds: number[] = [];
    let msg = pkg.readBody(SmithFreshRspMsg) as SmithFreshRspMsg;
    for (let i: number = 0; i < ForgeData.XLAttrNum; i++) {
      let item = this.attrList.getChildAt(i) as ForgeRefreshItem;
      item.randomNewSkill = msg.randomSkill[i];
      let temp: t_s_skilltemplateData =
        TempleteManager.Instance.getSkillTemplateInfoById(msg.randomSkill[i]);
      if (temp) {
        skillIds[i] = msg.randomSkill[i];
        cnt++;
      }
    }
    if (cnt > 0) {
      let info = this.itemTarget.info;
      this.btnXiLian.enabled = info != null;
      this.imgArrow.visible = info != null;
      if (info) {
        let num: number = info.getEquipBaseScore(skillIds);
        let additionScore: number = info.getEquipAdditionScore();
        let newScore = num + additionScore;
        let preScore = info.getEquipBaseScore() + info.getEquipAdditionScore();
        this.comNextTotalEvalute.cPromote_.selectedIndex =
          newScore - preScore > 0 ? 1 : 2;
        this.comNextTotalEvalute.visible = true;
        this.comNextTotalEvalute.title.text = newScore + "";
      }
    } else {
      this.comNextTotalEvalute.visible = false;
      this.comNextTotalEvalute.cPromote_.selectedIndex = 0;
    }
    this.updateMaterial();
  }

  private __onRefreshItemProperty(pkg: PackageIn) {
    let cnt = 0;
    let skillIds: number[] = [];
    let msg = pkg.readBody(RefreshPropertyRepMsg) as RefreshPropertyRepMsg;

    Logger.xjy("[UIXiLian]__onRefreshItemProperty", msg);
    if (msg.result == 1) {
      for (let i: number = 0; i < ForgeData.XLAttrNum; i++) {
        let item = this.attrList.getChildAt(i) as ForgeRefreshItem;
        item.randomNewSkill = msg.randomSkill[i];
        item.selected = msg.lockPos[i];
        let temp: t_s_skilltemplateData =
          TempleteManager.Instance.getSkillTemplateInfoById(msg.randomSkill[i]);
        if (temp) {
          skillIds[i] = msg.randomSkill[i];
          cnt++;
        }
      }
    }
    if (cnt > 0) {
      let info = this.itemTarget.info;
      this.btnXiLian.enabled = info != null;
      this.imgArrow.visible = info != null;
      if (info) {
        let num: number = info.getEquipBaseScore(skillIds);
        let additionScore: number = info.getEquipAdditionScore();
        let newScore = num + additionScore;
        let preScore = info.getEquipBaseScore() + info.getEquipAdditionScore();
        this.comNextTotalEvalute.cPromote_.selectedIndex =
          newScore - preScore > 0 ? 1 : 2;
        this.comNextTotalEvalute.visible = true;
        this.comNextTotalEvalute.title.text = newScore + "";
      }
    } else {
      this.comNextTotalEvalute.cPromote_.selectedIndex = 0;
      this.comNextTotalEvalute.visible = false;
    }

    this.showBtnReplace(msg.result == 1);
    this.updateMaterial();
  }

  private __onBagMoveUpdate(pkg: PackageIn) {
    Logger.xjy("[UIXiLian]__onBagMoveUpdate");
    this._ownLockCount = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.REFRESH_LOCK_PROP,
    );
    if (!this._ownLockCount) {
      this._ownLockCount = 0;
    }
    this.refreshMateLock();
  }

  private __bagItemUpdateHandler(info: GoodsInfo) {
    Logger.xjy("[UIXiLian]__bagItemUpdateHandler");
    let item: StoreIntensifyCell =
      this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
    if (item) {
      item.info = info;
      item.item.tipType = EmWindow.ForgeEquipTip;
      this.updateView(info);
      ForgeSocketOutManager.sendRefreshProperty(item.info.id);
    } else {
      this.refreshMateStone();
    }
    if (info && info.templateId == ItemID.REFRESH_LOCK_PROP) {
      this.updateLockCount();
    }
  }

  private __bagItemDeleteHandler(info: GoodsInfo) {
    Logger.xjy("[UIXiLian]__bagItemDeleteHandler");
    let item: StoreIntensifyCell =
      this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
    if (item) {
      this.showBtnReplace(false);
      item.info = null;
      this.updateView(info);
    }
    if (info && info.templateId == ItemID.REFRESH_LOCK_PROP) {
      this.updateLockCount();
    }
  }

  private updateLockCount() {
    this.txtLockCount.text =
      "x" + GoodsManager.Instance.getGoodsNumByTempId(ItemID.REFRESH_LOCK_PROP);
  }

  private updateView(value: GoodsInfo) {
    Logger.xjy("[UIXiLian]updateView");
    this.resetView();
    this.resetAttr();

    let info = this.itemTarget.info;
    this.btnXiLian.enabled = info != null;
    this.imgArrow.visible = info != null;
    if (info) {
      let num: number = info.getEquipBaseScore();
      let additionScore: number = info.getEquipAdditionScore();
      this.comCurTotalEvalute.visible = true;
      this.comCurTotalEvalute.title.text = num + additionScore + "";
    } else {
      this.comCurTotalEvalute.visible = false;
    }

    this.comNextTotalEvalute.visible = false;

    this.txtName.text = info ? info.templateInfo.TemplateNameLang : "";
    this.txtName.color = ForgeData.Colors[value.templateInfo.Profile - 1];

    this.updateMaterial();
  }

  private updateMaterial() {
    this.calLockCount();
    this.refreshMateStone();
    this.refreshMateLock();
    this.refreshMateNeedDiamond();
  }

  // 刷新洗炼石道具
  public refreshMateStone() {
    this._stoneOffsetDiamond = 0;
    this._bindStoneMateCount = 0;
    this._nobindStoneMateCount = 0;

    let goodsInfo: GoodsInfo = this.itemTarget.info;
    this._stoneOffsetCount = 0;
    if (!goodsInfo) {
      this.itemMate1.info = null;
      return;
    }

    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      goodsInfo.templateId,
    ) as t_s_itemtemplateData;
    let shopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(
      temp.Refresh,
    );
    if (temp.Refresh > 0) {
      let goodsAry = GoodsManager.Instance.getBagGoodsByTemplateId(
        temp.Refresh,
      );
      goodsAry.forEach((goods: GoodsInfo) => {
        if (goods.isBinds) this._bindStoneMateCount += goods.count;
        else this._nobindStoneMateCount += goods.count;
      });

      let needNum = ForgeData.mateMaterial(goodsInfo.templateId);
      let ownNum = this._useBindStone
        ? this._bindStoneMateCount + this._nobindStoneMateCount
        : this._nobindStoneMateCount;

      let goods: GoodsInfo = new GoodsInfo();
      goods.templateId = temp.Refresh;
      this.itemMate1.info = goods;
      this.itemMate1.text = ownNum + " / " + needNum;
      this._stoneOffsetCount = needNum - ownNum;
      if (ownNum < needNum && shopGoodsInfo) {
        this._stoneOffsetDiamond =
          shopGoodsInfo.GiftToken * this._stoneOffsetCount;
      }

      let stoneTemp = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_itemtemplate,
        temp.Refresh,
      ) as t_s_itemtemplateData;
      this._stoneName = stoneTemp ? stoneTemp.TemplateNameLang : "";
      this._stoneTempId = stoneTemp ? stoneTemp.TemplateId : 0;

      // this.itemMate1.txtTitle.color = (ownNum >= needNum) ? "#FFFFFF" : "FF0033"

      Logger.xjy(
        "bindStoneCnt=" + this._bindStoneMateCount,
        "noBindStoneCnt=" + this._nobindStoneMateCount,
        "needNum=" + needNum,
      );
      Logger.xjy(
        "_stoneOffsetDiamond=" + this._stoneOffsetDiamond,
        "GiftToken=",
        shopGoodsInfo ? shopGoodsInfo.GiftToken : 0,
      );
    } else {
      this.itemMate1.info = null;
    }
  }

  // 刷新洗炼锁道具
  private refreshMateLock() {
    if (this._curLockCount > 0) {
      let goods: GoodsInfo = new GoodsInfo();
      goods.templateId = ItemID.REFRESH_LOCK_PROP;
      this.itemMate2.info = goods;
      this.itemMate2.text = this._ownLockCount + " / " + this._curLockCount;
      // this.itemMate2.txtTitle.color = (this._ownLockCount >= this._curLockCount) ? "#FFFFFF" : "FF0033"
      // Logger.xjy(">>> Lock " )
      this.itemMate2.getChild("icon").visible = true;
    } else {
      // Logger.xjy(">>> unLock " )
      this.itemMate2.info = null;
      this.itemMate2.getChild("icon").visible = false; // ICON 消失不了 先处理
    }
  }

  // 刷新需要的钻石
  private refreshMateNeedDiamond() {
    this._needDiamondCount = 0;
    let tempLockCount =
      this._curLockCount <= this._ownLockCount
        ? 0
        : this._curLockCount - this._ownLockCount;
    if (this._useDiamondAutoBuy)
      this._needDiamondCount =
        this._stoneOffsetDiamond + tempLockCount * ForgeData.WASH_LOCK_PRICE;
    else this._needDiamondCount = tempLockCount * ForgeData.WASH_LOCK_PRICE;
    Logger.xjy(
      "this._ownLockCount=" + this._ownLockCount,
      "this._curLockCount=" + this._curLockCount,
      "this._stoneOffsetDiamond=" + this._stoneOffsetDiamond,
      "this._needDiamondCount=" + this._needDiamondCount,
    );
  }

  private getStoneOffsetDiamond() {
    return this._stoneOffsetDiamond;
  }

  private getLockOffsetDiamond() {
    return this._ownLockCount >= this._curLockCount
      ? 0
      : this._curLockCount - this._ownLockCount;
  }

  private calLockCount() {
    this._curLockCount = 0;
    for (let i: number = 0; i < ForgeData.XLAttrNum; i++) {
      let item = this.attrList.getChildAt(i) as ForgeRefreshItem;
      if (item.selected) {
        this._curLockCount++;
      }
    }
  }

  private getRandomSkillCount(): number {
    let randomSkillCount: number = 0;
    for (let i: number = 1; i < 6; i++) {
      if (this.itemTarget.info["randomSkill" + i] > 0) randomSkillCount++;
    }
    return randomSkillCount;
  }

  private btnXiLianClick() {
    if (this.itemTarget.info.isLock) {
      let str = LangManager.Instance.GetTranslation(
        "store.refresh.RefreshView.equipIsLock",
      );
      MessageTipManager.Instance.show(str);
      return;
    }

    // if (!this.itemTarget.info.isBinds && (this._bindStoneMateCount > 0 && this._useBindStone)) {
    //     let toPayPoint = this._needDiamondCount;
    //     let content: string = LangManager.Instance.GetTranslation("Store.IntensifyView.Tip");
    //     SimpleAlertHelper.Instance.Show(null, { toPayPoint: toPayPoint }, null, content, null, null, this.__btnXiLianClick.bind(this));
    // }
    // else {
    this.__btnXiLianClick(true, false);
    // }
  }

  private __btnXiLianClick(b: boolean, flag: boolean) {
    if (b) {
      //没有可洗炼的属性:  锁住的属性数目 大于 装备拥有的属性数目
      if (this._curLockCount >= this.getRandomSkillCount()) {
        let str: string = LangManager.Instance.GetTranslation(
          "store.view.refresh.RefreshView.command01",
        );
        MessageTipManager.Instance.show(str);
        return;
      }

      let offsetStone = this.getStoneOffsetDiamond();
      let offsetLockCnt = this.getLockOffsetDiamond();

      if (this._stoneOffsetCount > 0) {
        let info: ShopGoodsInfo =
          TempleteManager.Instance.getShopTempInfoByItemId(
            this._stoneTempId,
            ShopGoodsInfo.PROP_GOODS,
          );
        if (info) {
          FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, {
            info: info,
            count: this._stoneOffsetCount,
          });
        } else {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("public.lackProps"),
          );
        }
        return;
      }
      if (offsetLockCnt > 0 && this.showLockBuyAlert()) {
        let cfgValue = 10;
        let cfgItem =
          TempleteManager.Instance.getConfigInfoByConfigName(
            "RefreshLock_Price",
          );
        if (cfgItem) {
          cfgValue = Number(cfgItem.ConfigValue);
        }
        let content = LangManager.Instance.GetTranslation(
          "Forge.Refresh.RefreshLockLack",
          cfgValue,
        );
        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
          content: content,
          backFunction: (check1: boolean, check2: boolean) => {
            this.__btnXiLianClick2(true, check1, check2);
          },
          closeFunction: () => {},
        });
        return;
      }

      this.__btnXiLianClick2(
        true,
        SharedManager.Instance.storeLockBuy,
        SharedManager.Instance.storeLockBuyUseBind,
      );
    }
  }

  private showLockBuyAlert(): boolean {
    let preDate: Date = new Date(SharedManager.Instance.storeLockBuyCheckDate);
    let now: Date = new Date();
    let outdate: boolean = false;
    let check: boolean = SharedManager.Instance.storeLockBuy;
    if (
      !check ||
      (preDate.getMonth() <= preDate.getMonth() &&
        preDate.getDate() < now.getDate())
    )
      outdate = true;
    return outdate;
  }

  private __btnXiLianClick2(b: boolean, check: boolean, useBindPoint: boolean) {
    if (!b) return;

    SharedManager.Instance.storeLockBuy = check;
    SharedManager.Instance.storeLockBuyCheckDate = new Date();
    SharedManager.Instance.saveStoreLockBuyCheck();
    SharedManager.Instance.storeLockBuyUseBind = useBindPoint;
    SharedManager.Instance.saveStoreLockBuyUseBind();

    let bindingType = 0;
    if (this._useBindStone) {
      if (!this._bindsPrompt) bindingType = 1;
    } else {
      bindingType = 2;
    }
    // this._bindsPrompt = false;

    let lockStateArr = [];
    for (let i: number = 0; i < ForgeData.XLAttrNum; i++) {
      let item = this.attrList.getChildAt(i) as ForgeRefreshItem;
      lockStateArr.push(item.selected);
    }
    let useBindDiamond: boolean = useBindPoint;
    // if (lockStateArr.length > 0) {
    //     useBindDiamond = this.ctrl.useBind;
    // }

    Logger.xjy(
      "[UIXiLian]sendRefreshforRandom bindingType=" + bindingType,
      "useBindDiamond=",
      useBindDiamond,
      lockStateArr,
    );
    ForgeSocketOutManager.sendRefreshforRandom(
      lockStateArr,
      bindingType,
      useBindDiamond,
    );
  }

  private btnReplaceClick() {
    ForgeSocketOutManager.sendRefreshforReplace();
  }

  private showBtnReplace(visible: boolean) {
    this.btnReplace.visible = visible;
    this.btnXiLian.x = visible ? 63 : 172;
  }

  private openBuyFrame(id: number) {
    // CheckUIModuleUtil.instance.tryCall(UIModuleTypes.QUICKBUY,this.quickUIcallback,[id]);
  }

  private quickUIcallback(data: any[]) {
    // let refreshId:number = TempleteManager.instance.goodsTemplateCate.getTemplateByID(data[0]).Refresh;
    // let buyFrame:BuyFrameI = ComponentFactory.Instance.creatComponentByStylename("quickbuy.buyFrame");
    // let info:ShopGoodsInfo = TempleteManager.instance.getShopTempInfoByItemId(refreshId);
    // buyFrame.data(info, _mate.materialCount);
    // buyFrame.show();
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public get ctrl(): ForgeCtrl {
    let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Forge) as ForgeCtrl;
    return ctrl;
  }

  private resetAttr() {
    for (let i: number = 0; i < ForgeData.XLAttrNum; i++) {
      let item = this.attrList.getChildAt(i) as ForgeRefreshItem;
      item.randomSkill = this.itemTarget.info
        ? this.itemTarget.info["randomSkill" + (i + 1)]
        : -1;
      item.randomNewSkill = -1;
    }
  }

  public resetView() {
    Logger.xjy("[UIXiLian]resetView");

    this.txtName.text = "";
    this.imgArrow.visible = false;
    this.itemMate1.info = null;
    this.itemMate2.info = null;
    this.btnXiLian.enabled = false;
    this.comCurTotalEvalute.visible = false;
    this.comNextTotalEvalute.visible = false;
    this.showBtnReplace(false);
    for (let i: number = 0; i < ForgeData.XLAttrNum; i++) {
      let item = this.attrList.getChildAt(i) as ForgeRefreshItem;
      item.resetItem();
    }
  }

  public resetTarget() {
    this.itemTarget.info = null;
  }

  public dispose(d = true) {
    this.btnXiLian.offClick(this, this.btnXiLianClick.bind(this));
    this.btnReplace.offClick(this, this.btnReplaceClick.bind(this));
    super.dispose(d);
  }
}
