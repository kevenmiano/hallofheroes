import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import FeedBackItemData from "../../../datas/feedback/FeedBackItemData";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { BaseItem } from "../../../component/item/BaseItem";
import Utils from "../../../../core/utils/Utils";

export default class CumulativeRechargeItemInfoWnd extends BaseWindow {
  private _info: FeedBackItemData;
  private frame: fgui.GComponent;
  public titleTxt: fgui.GTextField;
  public itemList: fgui.GList;
  private _dataArray: Array<GoodsInfo>;
  public OnInitWind() {
    this.setCenter();
  }

  OnShowWind() {
    super.OnShowWind();
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "CumulativeRechargeItemInfoWnd.Title",
    );
    this._info = this.params.frameData;
    if (this._info) {
      this._dataArray = [];
      this.titleTxt.text = LangManager.Instance.GetTranslation(
        "CumulativeRechargeItemInfo.titleTxt",
        this._info.point,
      );
      Utils.setDrawCallOptimize(this.itemList);
      this.itemList.itemRenderer = Laya.Handler.create(
        this,
        this.renderBoxList,
        null,
        false,
      );
      for (let i = 0; i < 8; i++) {
        if (this._info.getGoodsIdByIndex(i) != 0) {
          var ginfo: GoodsInfo = new GoodsInfo();
          ginfo.templateId = this._info.getGoodsIdByIndex(i);
          ginfo.count = this._info.getGoodsCountByIndex(i);
          this._dataArray.push(ginfo);
        }
      }
      this.itemList.numItems = this._dataArray.length;
    }
  }

  renderBoxList(index: number, item: BaseItem) {
    if (!item || item.isDisposed) return;
    item.info = this._dataArray[index] as GoodsInfo;
  }

  OnHideWind() {
    super.OnHideWind();
    // this.itemList && this.itemList.itemRenderer.recover();
    Utils.clearGListHandle(this.itemList);
  }
}
