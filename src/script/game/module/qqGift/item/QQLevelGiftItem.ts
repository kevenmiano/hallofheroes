import FUI_QQLevelGiftItem from "../../../../../fui/QQGift/FUI_QQLevelGiftItem";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_qqgradepackageData } from "../../../config/t_s_qqgradepackage";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import QQGiftManager from "../../../manager/QQGiftManager";
import QQGiftModel from "../QQGiftModel";

export class QQLevelGiftItem extends FUI_QQLevelGiftItem {
  private _info: t_s_qqgradepackageData;
  private goodsArr: GoodsInfo[];
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.c1 = this.getController("c1");
  }

  public set info(vInfo: t_s_qqgradepackageData) {
    if (!vInfo) {
      this.clear();
      this.removeEvent();
    } else {
      this._info = vInfo;
      this.addEvent();
      this.refreshView();
    }
  }

  private clear() {
    this.txtTitle.text = "";
    this.list.numItems = 0;
    this.c1.selectedIndex = 0;
  }

  private refreshView() {
    this.txtTitle.text = LangManager.Instance.GetTranslation(
      "QQ.Hall.Gift.levelTitle",
      this._info.Grade,
    );
    this.btn_receive.title = LangManager.Instance.GetTranslation(
      "GrowthFundItem.getTxt",
    );
    this.btn_gray.title = LangManager.Instance.GetTranslation(
      "GrowthFundItem.getTxt",
    );
    this.goodsArr = this._model.getRewards(this._info.Giftbag);
    this.list.numItems = this.goodsArr.length;
    this.c1.selectedIndex = this._model.getLevelItemState(this._info.Grade);
  }

  private addEvent() {
    this.btn_receive.onClick(this, this.receiveHandler);
    Utils.setDrawCallOptimize(this.list);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
  }

  private removeEvent() {
    this.btn_receive.offClick(this, this.receiveHandler);
    this.list.itemRenderer = null;
  }

  private renderListItem(index: number, item: BaseItem) {
    item.info = this.goodsArr[index];
  }

  private receiveHandler() {
    QQGiftManager.Instance.getGift(4, this._info.Grade);
  }

  private get _model(): QQGiftModel {
    return QQGiftManager.Instance.model;
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
