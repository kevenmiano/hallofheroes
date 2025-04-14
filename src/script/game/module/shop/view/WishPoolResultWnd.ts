import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export default class WishPoolResultWnd extends BaseWindow {
  public goodsList: fgui.GList;
  public confirmBtn: fgui.GButton;
  public titleTxt: fgui.GTextField;
  private _goodsArray: Array<GoodsInfo> = [];
  private _type: number = 0; //1神器重铸返回 2 许愿池返回
  public OnInitWind() {
    super.OnInitWind();
    this._goodsArray = this.frameData.arr;
    this._type = this.frameData.type;
    this.setCenter();
    this.addEvent();
    this.goodsList.numItems = this._goodsArray.length;
    this.titleTxt.text = LangManager.Instance.GetTranslation(
      "WishPoolResultWnd.title" + this._type,
    );
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private addEvent() {
    this.goodsList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.confirmBtn.onClick(this, this._onConfirmHandler);
  }

  private offEvent() {
    // this.goodsList.itemRenderer.recover();
    Utils.clearGListHandle(this.goodsList);
    this.confirmBtn.offClick(this, this._onConfirmHandler);
  }

  private _onConfirmHandler() {
    this.OnBtnClose();
  }

  private renderListItem(index: number, item: BaseItem) {
    if (!item || item.isDisposed) return;
    item.info = this._goodsArray[index];
  }

  public OnHideWind() {
    super.OnHideWind();
    this.offEvent();
  }

  dispose(dispose?: boolean) {
    this.offEvent();
    super.dispose(dispose);
  }
}
