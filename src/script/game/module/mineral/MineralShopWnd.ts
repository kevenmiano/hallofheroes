import BaseWindow from "../../../core/ui/Base/BaseWindow";
import LangManager from "../../../core/lang/LangManager";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { ShopControler } from "../shop/control/ShopControler";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { ShopManager } from "../../manager/ShopManager";
import MineralShopItem from "./MineralShopItem";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import Utils from "../../../core/utils/Utils";

/**
 * @author:pzlricky
 * @data: 2021-11-05 16:54
 * @description 紫晶商店
 */
export default class MineralShopWnd extends BaseWindow {
  public frame: fgui.GComponent;
  public list: fgui.GList;
  public txt_tips: fgui.GTextField;
  public txt_count: fgui.GTextField;
  private _goodsList: Array<ShopGoodsInfo>;

  public tipItem: BaseTipItem;
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.addEvent();
    let titleText = LangManager.Instance.GetTranslation(
      "view.subshop.MineralShopFrame.title",
    );
    this.frame.getChild("title").text = titleText;
    this.txt_tips.text = LangManager.Instance.GetTranslation(
      "view.subshop.MineralShopFrame.describe",
    );
    this.txt_tips.visible = false;
    this.txt_count.text = this.playerInfo.mineral + "";
    this.initData();
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_PET_ZIJIN);
  }

  private initData() {
    this._goodsList = this.goodsList;
    this._goodsList.sort(this.shopControl.mineralShopGoodsSort);
    this.list.numItems = this._goodsList.length;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get goodsList(): Array<any> {
    return this.shopControl.mineralShopGoods;
  }
  private get shopControl(): ShopControler {
    return FrameCtrlManager.Instance.getCtrl(
      EmWindow.MineralShopWnd,
    ) as ShopControler;
  }
  private addEvent() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this.__updateHandler,
      this,
    );
  }
  private removeEvent() {
    // this.list && this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    this.playerInfo.removeEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this.__updateHandler,
      this,
    );
  }

  private renderListItem(index: number, item: MineralShopItem) {
    item.info = this._goodsList[index];
  }

  protected __updateHandler(evt) {
    this.txt_count.text = this.playerInfo.mineral + "";
  }

  OnHideWind() {
    this.removeEvent();
    this._goodsList = [];
    this._goodsList = null;
    super.OnHideWind();
  }
}
