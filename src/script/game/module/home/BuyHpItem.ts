import FUI_BuyHpItem from "../../../../fui/Home/FUI_BuyHpItem";
import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import { BaseItem } from "../../component/item/BaseItem";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { ShopManager } from "../../manager/ShopManager";
import MazeModel from "../maze/MazeModel";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
export default class BuyHpItem extends FUI_BuyHpItem {
  private _vData: ShopGoodsInfo;
  declare public goodsIcon: BaseItem;

  onConstruct() {
    super.onConstruct();
    this.clear();
    this.addEvent();
  }

  public set vData(value: ShopGoodsInfo) {
    if (!value) this.clear();
    if (this._vData != value) {
      this._vData = value;
      this.refreshView();
    }
  }

  public get vData(): ShopGoodsInfo {
    return this._vData;
  }

  private clear() {
    this.goodsIcon.icon = "";
    this.goodsNameTxt.text = "";
    this.priceTxt.text = "";
    this.goldIcon.visible = false;
    this.pointIcon.visible = false;
    this.Btn_buy.enabled = false;
  }

  private refreshView() {
    this.Btn_buy.enabled = true;
    try {
      var goods: GoodsInfo = new GoodsInfo();
      goods.templateId = this._vData.ItemId;
      this.goodsIcon.info = goods;
      this.goodsNameTxt.text = goods.templateInfo.TemplateNameLang;
      if (this._vData.Gold != 0) {
        this.priceTxt.text = this._vData.Gold.toString();
        this.goldIcon.visible = true;
      } else if (this._vData.GiftToken != 0) {
        this.priceTxt.text = this._vData.GiftToken.toString();
        this.pointIcon.visible = true;
      }
      this.txt_own.text =
        LangManager.Instance.GetTranslation("BuyHpItem.txtOwn.text") +
        GoodsManager.Instance.getGoodsNumByTempId(this._vData.ItemId);
    } catch {}
  }

  private addEvent() {
    this.Btn_buy.onClick(this, this.confirmHandler.bind(this));
  }

  private removeEvent() {
    this.Btn_buy.offClick(this, this.confirmHandler.bind(this));
  }

  private confirmHandler() {
    if (this.payMoney(this._vData) < this._vData.price) {
      if (this._vData.PayType == ShopGoodsInfo.PAY_BY_POINT) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("Auction.ResultAlert11"),
        );
        // RechargeAlertMannager.Instance.show();
      } else if (this._vData.PayType == ShopGoodsInfo.PAY_BY_GOLD) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "star.view.MakeStarView.command02",
          ),
        );
      } else if (this._vData.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "shop.view.frame.BuyFrameI.CashGiftLack",
          ),
        );
        // RechargeAlertMannager.Instance.show();
      } else if (this._vData.PayType == ShopGoodsInfo.PAY_BY_MAZE)
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "shop.view.frame.BuyFrameI.MazeCoinLack",
          ),
        );
      else if (this._vData.PayType == ShopGoodsInfo.PAY_BY_HONOR)
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "shop.view.frame.BuyFrameI.MedalLack",
          ),
        );
      else if (this._vData.PayType == ShopGoodsInfo.PAY_BY_OFFER)
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "shop.view.frame.BuyFrameI.SociatyContribLack",
          ),
        );
      else if (this._vData.PayType == ShopGoodsInfo.PAY_BY_GLORY)
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ui.resourcebar.view.quickbuy.QuickBuyFrame.gloryTip",
          ),
        );
      if (this._vData.PayType == ShopGoodsInfo.PAY_BY_BACKPLAYER)
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "shop.view.frame.BuyFrameI.NotEnoughBackPlayer",
          ),
        );
      else
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "shop.view.frame.BuyFrameI.MoneyLack",
          ),
        );
      UIManager.Instance.HideWind(EmWindow.BuyHpWnd);
      return;
    }
    ShopManager.Instance.sendShopingBloo(this._vData.Id);
  }

  private payMoney(value: ShopGoodsInfo): number {
    if (value.PayType == ShopGoodsInfo.PAY_BY_POINT)
      return PlayerManager.Instance.currentPlayerModel.playerInfo.point;
    else if (value.PayType == ShopGoodsInfo.PAY_BY_GIFT)
      return (
        PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken +
        PlayerManager.Instance.currentPlayerModel.playerInfo.point
      );
    else if (value.PayType == ShopGoodsInfo.PAY_BY_GOLD)
      return ResourceManager.Instance.gold.count;
    else if (value.PayType == ShopGoodsInfo.PAY_BY_OFFER)
      return PlayerManager.Instance.currentPlayerModel.playerInfo
        .consortiaOffer;
    else if (value.PayType == ShopGoodsInfo.PAY_BY_HONOR)
      return GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.MEDAL_TEMPID,
      );
    else if (value.PayType == ShopGoodsInfo.PAY_BY_MAZE)
      return GoodsManager.Instance.getGoodsNumByTempId(
        MazeModel.SHOP_MAZE_COIN_TEMPID,
      );
    else if (value.PayType == ShopGoodsInfo.PAY_BY_GLORY)
      return PlayerManager.Instance.currentPlayerModel.playerInfo.gloryPoint;
    else if (value.PayType == ShopGoodsInfo.PAY_BY_BACKPLAYER)
      return GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.BACKPLAYER_TEMPID,
      );
    else return PlayerManager.Instance.currentPlayerModel.playerInfo.point;
  }

  public dispose() {
    this.removeEvent();
    this._vData = null;
    super.dispose();
  }
}
