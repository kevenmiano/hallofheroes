import FUI_MultiBoxSelectItem from "../../../../../../fui/Base/FUI_MultiBoxSelectItem";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../../../../component/FilterFrameText";
import { BaseItem } from "../../../../component/item/BaseItem";
import { NumericStepper } from "../../../../component/NumericStepper";
import { t_s_dropitemData } from "../../../../config/t_s_dropitem";
import { MultiBoxSelectEvent } from "../../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { NotificationManager } from "../../../../manager/NotificationManager";

/**
 * 多选宝箱渲染单元格
 */
export default class MulitBoxSelectItem extends FUI_MultiBoxSelectItem {
  public item: BaseItem;

  public stepper: NumericStepper;

  private _itemData: t_s_dropitemData;

  private _index: number = 0;
  private _currCount: number = 0;
  private _handler: Laya.Handler;
  private _countHandler: Laya.Handler;

  protected onConstruct(): void {
    super.onConstruct();
    this.onEvent();
  }

  private onEvent() {
    this.stepper.txt_num.on(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.stepper.txt_num.on(Laya.Event.BLUR, this, this.onBlurTarget);
  }

  private offEvent() {
    this.stepper.txt_num.off(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.stepper.txt_num.on(Laya.Event.BLUR, this, this.onBlurTarget);
  }

  /** */
  onFocusTarget() {
    NotificationManager.Instance.dispatchEvent(MultiBoxSelectEvent.FOCUS);
  }

  /** */
  onBlurTarget() {
    NotificationManager.Instance.dispatchEvent(MultiBoxSelectEvent.BLUR);
  }

  public setItemData(
    index: number,
    value: t_s_dropitemData,
    count: number = 1,
    countHandler: Laya.Handler = null,
  ) {
    this._index = index;
    this._itemData = value;
    this._countHandler = countHandler;
    let goodsInfo = new GoodsInfo();
    goodsInfo.templateId = value.ItemId;
    goodsInfo.count = value.Data;
    this.item.info = goodsInfo;
    this.txt_name.text = goodsInfo.templateInfo.TemplateNameLang;
    this.txt_name.color =
      FilterFrameText.Colors[eFilterFrameText.ItemQuality][
        goodsInfo.templateInfo.Profile - 1
      ];
    this._handler && this._handler.recover();
    this._handler = null;
    this._handler = Laya.Handler.create(
      this,
      this.stepperChangeHandler,
      null,
      false,
    );
    this.stepper.show(2, this._currCount, 0, 999, count, 1, this._handler);
  }

  public get index(): number {
    return this._index;
  }

  private stepperChangeHandler(value: number) {
    this._currCount = value;
    if (this._countHandler && this._itemData) {
      this._countHandler.runWith([this, this._itemData.Id, value]);
    }
  }

  public get itemData(): t_s_dropitemData {
    return this._itemData;
  }

  /**输入数量 */
  public get selectCount(): number {
    return this._currCount;
  }

  dispose(): void {}
}
