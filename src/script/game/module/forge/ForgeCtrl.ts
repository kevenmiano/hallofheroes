/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-08-01 11:41:10
 * @LastEditors: jeremy.xu
 * @Description:
 */
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { BagType } from "../../constant/BagDefine";
import {
  BagEvent,
  ResourceEvent,
  StoreEvent,
} from "../../constant/event/NotificationEvent";
import GTabIndex from "../../constant/GTabIndex";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../manager/GoodsManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { SharedManager } from "../../manager/SharedManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { TempleteManager } from "../../manager/TempleteManager";
import FrameCtrlBase from "../../mvc/FrameCtrlBase";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import ForgeData from "./ForgeData";
import { ForgeSocketOutManager } from "./ForgeSocketOutManager";
import ItemID from "../../constant/ItemID";
import StoreRspMsg = com.road.yishi.proto.store.StoreRspMsg;

export default class ForgeCtrl extends FrameCtrlBase {
  public useBind: boolean = false;
  public clcikLockFirst: boolean = false;
  public mountViewEquipIsBinds: boolean = false;

  public data: ForgeData;

  show() {
    super.show();
    this.changeToIndex();
  }

  hide() {
    super.hide();
  }

  changeToIndex() {
    let frameData = this.frameData;
    if (frameData && frameData["tabIndex"]) {
      if (frameData["materialId"]) {
        switch (frameData["tabIndex"]) {
          case GTabIndex.Forge_HC_ZBJJ:
            this.data.defSEquipMetaId = frameData["materialId"];
            break;
          case GTabIndex.Forge_HC_ZB:
            this.data.defEquipMetaId = frameData["materialId"];
            break;
          default:
            this.data.defPropMetaId = frameData["materialId"];
            break;
        }
      }
      this.view.changeIndex(frameData["tabIndex"], false, false);
    } else {
      this.view.changeIndex(GTabIndex.Forge_QH, false, false);
    }
  }

  dispose() {
    this.useBind = false;
    this.clcikLockFirst = false;
    this.mountViewEquipIsBinds = false;
    super.dispose();
  }

  /**
   * 不同页面排序规则
   * @param index ForgeData.TabIndex
   */
  public refreshBagList(index: number = 0) {
    this.data.refreshBagData(index);
    this.view.refreshBagList(this.data.bagData);
  }

  /**
   * 刷新背包item的暗显
   * @param index
   */
  public refreshBagListDark(index: number = 0, equiped: boolean = false) {
    this.view.refreshBagListDark(index, equiped);
  }

  // override
  protected addEventListener() {
    super.addEventListener();
    ServerDataManager.listen(
      S2CProtocol.U_C_ITEM_COMPOSE,
      this,
      this.__onComposeResult,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_ITEM_STRENGTHEN,
      this,
      this.__onIntensifyResult,
    );
    // ServerDataManager.listen(S2CProtocol.U_C_RESOLVE, this, this.__onResolveResult);
    ServerDataManager.listen(
      S2CProtocol.U_C_REFRESHFORRANDOM,
      this,
      this.__onRefreshRandomProperty,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_ITEM_REFRESHPROPERTY,
      this,
      this.__onRefreshItemProperty,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_BAG_MOVE_UPDATE,
      this,
      this.__onBagMoveUpdate,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_MOULD_ITEM,
      this,
      this.__onRecvMouldItem,
    );

    this.data.addEventListener(
      StoreEvent.REFRESH_LOCK_CHANGE,
      this.__refreshItemLock,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdate,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.__bagItemDelete,
      this,
    );
    ResourceManager.Instance.gold.addEventListener(
      ResourceEvent.RESOURCE_UPDATE,
      this.onResourceUpdate,
      this,
    );
  }
  // override
  protected delEventListener() {
    super.delEventListener();
    ServerDataManager.cancel(
      S2CProtocol.U_C_ITEM_COMPOSE,
      this,
      this.__onComposeResult,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_ITEM_STRENGTHEN,
      this,
      this.__onIntensifyResult,
    );
    // ServerDataManager.cancel(S2CProtocol.U_C_RESOLVE, this, this.__onResolveResult);
    ServerDataManager.cancel(
      S2CProtocol.U_C_REFRESHFORRANDOM,
      this,
      this.__onRefreshRandomProperty,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_ITEM_REFRESHPROPERTY,
      this,
      this.__onRefreshItemProperty,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_BAG_MOVE_UPDATE,
      this,
      this.__onBagMoveUpdate,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_MOULD_ITEM,
      this,
      this.__onRecvMouldItem,
    );

    this.data.removeEventListener(
      StoreEvent.REFRESH_LOCK_CHANGE,
      this.__refreshItemLock,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdate,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_BAG,
      this.__bagItemDelete,
      this,
    );
    ResourceManager.Instance.gold.removeEventListener(
      ResourceEvent.RESOURCE_UPDATE,
      this.onResourceUpdate,
      this,
    );
    this.moveGoodsBack();
  }

  /**资源更新(金币等) */
  private onResourceUpdate() {
    this.view.refreshResources();
  }

  private __onComposeResult(pkg: PackageIn) {
    this.view.refresh(ForgeData.TabIndex.HC, "ComposeResult", null);
  }

  private __onIntensifyResult(pkg: PackageIn) {
    let msg = pkg.readBody(StoreRspMsg) as StoreRspMsg;
    Logger.log("[ForgeCtrl]__onIntensifyResult", msg);
    this.view.refresh(ForgeData.TabIndex.QH, "IntensifyResult", pkg);
  }

  private __onRecvMouldItem(pkg: PackageIn) {
    let msg = pkg.readBody(StoreRspMsg) as StoreRspMsg;
    Logger.log("[ForgeCtrl]__onRecvMouldItem", msg);
    this.view.refresh(ForgeData.TabIndex.SZ, "MouldResult", pkg);

    // var pkg : PackageIn = event.data as PackageIn;
    // var msg:StoreRspMsg = new StoreRspMsg();
    // msg = pkg.readBody(msg) as StoreRspMsg;
    // var str:String;
    // if(msg.strengResult)
    // {
    //     var info:GoodsInfo = GoodsManager.instance.getHideBagItemByPos(msg.pos);
    //     info.objectId	= msg.objectId;
    //     info.bagType	= msg.bagType;
    //     info.mouldGrade = msg.strengthenGrade;
    //     var item:StoreIntensifyCell = _itemDic[info.pos+"_"+info.objectId+"_"+info.bagType];
    //     if(item)
    //     {
    //         item.data = info;
    //     }
    //     str = LanguageMgr.GetTranslation("store.cast.CastView.MouldTips01");
    //     MessageTipManager.instance().show(str);
    // }
    // else
    // {
    //     str = LanguageMgr.GetTranslation("store.cast.CastView.MouldTips02", 5);
    //     MessageTipManager.instance().show(str);
    // }
    // refreshView();
  }

  // private __onResolveResult(pkg: PackageIn) {
  //     Logger.log("[ForgeCtrl]__onResolveResult", pkg)
  //     this.data.initComposeInfo()
  //     this.view.refresh(ForgeData.TabIndex.FJ, "ResolveResult", pkg)
  // }

  private __onRefreshRandomProperty(pkg: PackageIn) {
    this.view.refresh(ForgeData.TabIndex.XL, "RefreshRandomProperty", pkg);
  }

  private __onRefreshItemProperty(pkg: PackageIn) {
    this.view.refresh(ForgeData.TabIndex.XL, "RefreshItemProperty", pkg);
  }

  private __onBagMoveUpdate(pkg: PackageIn) {
    this.view.refresh(ForgeData.TabIndex.XL, "BagMoveUpdate", pkg);
  }

  private __refreshItemLock(index: number) {
    this.view.refresh(ForgeData.TabIndex.XL, "RefreshItemLock", index);
  }

  private __bagItemUpdate(infos: GoodsInfo[]) {
    for (let info of infos) this.view.refresh(undefined, "BagItemUpdate", info);
  }

  private __bagItemDelete(infos: GoodsInfo[]) {
    //优化标记
    for (let info of infos) {
      this.view.refresh(undefined, "BagItemDelete", info);
    }
  }

  /////////////////////////////////////////
  // public mountJewel(gInfo: GoodsInfo, target: StoreJewelCell) {
  //     if (this.checkType(gInfo, target.pos) == -1)
  //         return;
  //     if (target.data && target.data.templateInfo) {
  //         SimpleAlertHelper.Instance.data = [this.__mountJewel, gInfo, target];
  //         let content = LangManager.Instance.GetTranslation("store.StoreControler.content", target.data.templateInfo.Property3);
  //         SimpleAlertHelper.Instance.popAlerFrame(prompt, null, null, null);
  //     } else {
  //         this.sendItemMount(target.pos, gInfo.pos, gInfo.bagType);
  //     }
  // }

  // private __mountJewel(b: boolean, flag: boolean, gInfo: GoodsInfo, target: StoreJewelCell) {
  //     if (b) {
  //         if (target.data.templateInfo.Property3 > ResourceManager.Instance.gold.count) {
  //             MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("public.gold"));
  //             return;
  //         }
  //         AudioManager.Instance.playSound(SoundIds.JEWEL_MOUNT_SOUND)
  //         this.sendItemMount(target.pos, gInfo.pos, gInfo.bagType);
  //     }
  // }

  // private checkType(gInfo: GoodsInfo, pos: number): number {
  //     let item: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(0);
  //     if (item) {
  //         for (let i: number = 1; i < ForgeData.XQJewelNum + 1; i++) {
  //             if (item["join" + i] > 0) {
  //                 let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate ,Number(item["join" + i])) as t_s_itemtemplateData
  //                 if (gInfo.templateInfo.Property1 == temp.Property1) {
  //                     if (i != pos) {
  //                         let str: string = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command03");
  //                         MessageTipManager.Instance.show(str);
  //                         return -1;
  //                     } else {
  //                         return 1;//替换
  //                     }
  //                 }
  //             }
  //         }
  //     }
  //     return 0;
  // }

  private _toOpenPos: number;
  public openHole(pos: number) {
    this._toOpenPos = pos;
    let arr: any[] = GoodsManager.Instance.getGoodsByGoodsTId(ItemID.BORT_PROP);
    let hasProp: boolean = false;
    arr.forEach((gInfo: GoodsInfo) => {
      if (gInfo.bagType != BagType.Storage) {
        hasProp = true;
      }
    });
    if (hasProp) {
      let content: string = LangManager.Instance.GetTranslation(
        "store.StoreControler.content02",
      );
      SimpleAlertHelper.Instance.Show(
        null,
        null,
        null,
        content,
        null,
        null,
        this.confirmback.bind(this),
      );
    } else {
      let info: ShopGoodsInfo =
        TempleteManager.Instance.getShopTempInfoByItemId(ItemID.BORT_PROP);
      FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, {
        info: info,
        count: 1,
      });
    }
  }

  private confirmback(b: boolean, check: boolean) {
    if (b) {
      SocketSendManager.Instance.sendPunch(this._toOpenPos, true);
    }
  }

  /**
   * 将隐藏背包物品移回去
   */
  public moveGoodsBack() {
    let arr: any[] = GoodsManager.Instance.getGoodsByBagType(BagType.Hide);
    Logger.log("[ForgeCtrl]moveGoodsBack", arr);
    arr.forEach((goods: GoodsInfo) => {
      PlayerManager.Instance.moveBagToBag(
        goods.bagType,
        goods.objectId,
        goods.pos,
        BagType.Player,
        0,
        0,
        1,
      );
    });
  }

  ////////////////////请求//////////////////
  /**
   * 镶嵌
   * @param joinPos
   * @param gInfoPos
   * @param gInfoType
   */
  public sendItemMount(joinPos: number, gInfoPos: number, gInfoType: number) {
    // let info: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(0);
    // if (!info.isBinds) {
    //     let content: string = LangManager.Instance.GetTranslation("Store.IntensifyView.Tip");
    //     SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean, check: boolean) => {
    //         this.inlayConfirm(b, check, joinPos, gInfoPos, gInfoType);
    //     });
    // } else {
    this.inlayConfirm(true, false, joinPos, gInfoPos, gInfoType);
    // }
  }

  private inlayConfirm(
    b: boolean,
    check: boolean,
    joinPos: number,
    gInfoPos: number,
    gInfoType: number,
  ) {
    if (b) ForgeSocketOutManager.sendItemMount(joinPos, gInfoPos, gInfoType);
  }

  /**
   * 强化
   */
  public sendItemIntensify() {
    ForgeSocketOutManager.sendItemIntensify();
  }

  /**
   * 神铸
   *
   */
  public sendItemMould(payType: number): void {
    ForgeSocketOutManager.sendItemMould();
  }

  /**
   * 合成
   */
  public sendCompose(compAll: boolean, useBind: boolean) {
    // let preDate: Date = new Date(SharedManager.Instance.storeComposeCheckDate);
    // let now: Date = new Date();
    // let outdate: boolean = false;
    // let check: boolean = SharedManager.Instance.storeCompose;
    // if (!check || preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate())
    //     outdate = true;
    // if (outdate) {
    //     let content: string = LangManager.Instance.GetTranslation("Store.IntensifyView.Tip");
    //     let checkTxt: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
    //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { "checkRickText": checkTxt, "compAll": compAll }, null, content, null, null, this.__showComposeAlert.bind(this));
    //     return
    // }

    if (this.data.composeType == ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP) {
      let goodsInfo = this.data.getCurrentUpgradeEquipGoodsInfo();
      if (goodsInfo) {
        PlayerManager.Instance.currentPlayerModel.forgeHeChengIsOpen = true;
        ForgeSocketOutManager.sendUpdateEquip(
          this.data.selectedCompose.templateId,
          1,
          useBind,
          goodsInfo.mouldGrade > 0,
        );
      }
    } else {
      let composeCount = this.data.getComposeCount(compAll);
      PlayerManager.Instance.currentPlayerModel.forgeHeChengIsOpen = true;
      ForgeSocketOutManager.sendCompose(
        this.data.selectedCompose.template.Id,
        composeCount,
        this.data.composeAutoBuy,
        useBind,
      );
    }
  }

  private __showComposeAlert(b: boolean, check: boolean = false, data: any) {
    if (b) {
      SharedManager.Instance.storeCompose = check;
      SharedManager.Instance.storeComposeCheckDate = new Date();
      SharedManager.Instance.saveComposeTipCheck();
      let composeCount = data.compAll
        ? this.data.maxComposeCount
        : this.data.currentComposeCount;
      ForgeSocketOutManager.sendCompose(
        this.data.selectedCompose.template.Id,
        composeCount,
        this.data.composeAutoBuy,
        this.useBind,
      );
    }
  }
}
