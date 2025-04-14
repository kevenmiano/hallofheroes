import FUI_DiscountItem from "../../../../../../fui/Shop/FUI_DiscountItem";
import LangManager from "../../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import Utils from "../../../../../core/utils/Utils";
import { BaseItem } from "../../../../component/item/BaseItem";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import GoodsSonType from "../../../../constant/GoodsSonType";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";

/**
 * 折扣卷item
 */
export default class DiscountItem extends FUI_DiscountItem {
  public item: BaseItem;

  private _dataInfo: GoodsInfo = null;

  private _cost: number = 0;

  private _cellIndex: number = 0;

  public chooseTempleteId: number = 0;

  protected onConstruct(): void {
    super.onConstruct();
    Utils.setDrawCallOptimize(this);
  }

  public set cellIndex(value: number) {
    this._cellIndex = value;
  }

  public get cellIndex(): number {
    return this._cellIndex;
  }

  setItemData(data: GoodsInfo, cost: number = 0) {
    if (!data || !data.templateInfo) {
      this.clearInfo();
      return;
    }
    this._dataInfo = data;
    this._cost = cost;
    this.item.info = data;
    this.txt_name.text = data.templateInfo.TemplateNameLang;
    this.txt_name.color = GoodsSonType.getColorByProfile(
      data.templateInfo.Profile,
    );
    this.txt_des.text = data.templateInfo.DescriptionLang;
    if (data.validDate == 0) {
      this.txt_validDate.text = LangManager.Instance.GetTranslation(
        "shop.discount.validDate0",
      );
    } else {
      let timeStr: string;
      if (this._dataInfo.leftTime == -1) {
        timeStr = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTip.timeStr01",
        );
      } else if (this._dataInfo.leftTime < 0) {
        timeStr = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTip.timeStr02",
        );
      } else {
        timeStr = DateFormatter.getStopDateString(this._dataInfo.leftTime);
      }
      this.txt_validDate.text =
        LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTip.time.text",
        ) +
        ":" +
        timeStr;
    }

    this.setSelected(data.templateId == this.chooseTempleteId);
    this.enabled = this.checkUserAble();
  }

  private checkUserAble(): boolean {
    if (this._dataInfo && this._dataInfo.templateInfo) {
      let reqCost = this._dataInfo.templateInfo.Property2; //消费金额
      let leftTime = this._dataInfo.leftTime;
      if (this._cost >= reqCost && (leftTime == -1 || leftTime > 0)) {
        return true;
      }
    }
    return false;
  }

  public get selectTempleteId(): number {
    if (!this._dataInfo) return 0;
    return this._dataInfo.templateId;
  }

  public get selectTempleteData(): t_s_itemtemplateData {
    if (this._dataInfo) return this._dataInfo.templateInfo;
    return null;
  }

  public get dataInfo(): GoodsInfo {
    return this._dataInfo;
  }

  public isSelected(): boolean {
    return this.checkBtn.selected;
  }

  public setSelected(value: boolean) {
    this.checkBtn.selected = value;
  }

  private clearInfo() {
    this.txt_validDate.text = "";
    this.txt_des.text = "";
    this.txt_name.text = "";
    this.item.info = null;
  }

  dispose(): void {
    super.dispose();
  }
}
