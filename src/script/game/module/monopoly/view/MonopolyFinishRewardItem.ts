import FUI_MonopolyFinishRewardItem from "../../../../../fui/Monopoly/FUI_MonopolyFinishRewardItem";
import { IconFactory } from "../../../../core/utils/IconFactory";

//@ts-expect-error: External dependencies
import TempMsg = com.road.yishi.proto.campaign.TempMsg;

/**
 * 老虎机抽奖ITEM
 */
export default class MonopolyFinishRewardItem extends FUI_MonopolyFinishRewardItem {
  private _data: TempMsg;

  onConstruct() {
    super.onConstruct();
  }

  public setData(value: TempMsg): void {
    this._data = value;
    this.refresh();
  }

  public refresh(): void {
    if (this._data) {
      //_itemIconImages.setFrame(iconFrame);
      this.iconLoader.url = IconFactory.getGoodsIconByTID(
        this._data.templateId,
      );
      this.title.text = this._data.count.toString();
    }
  }
}
