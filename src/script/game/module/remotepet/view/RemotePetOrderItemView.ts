//@ts-expect-error: External dependencies
import FUI_RemotePetOrderItemView from "../../../../../fui/RemotePet/FUI_RemotePetOrderItemView";
import { EmPackName } from "../../../constant/UIDefine";
import { RemotePetOrderInfo } from "../../../mvc/model/remotepet/RemotePetOrderInfo";
import FUIHelper from "../../../utils/FUIHelper";

export class RemotePetOrderItemView extends FUI_RemotePetOrderItemView {
  protected onConstruct(): void {
    super.onConstruct();
  }
  private _data: RemotePetOrderInfo;

  public get info() {
    return this._data;
  }

  public set info(v: RemotePetOrderInfo) {
    this._data = v;
    if (!this._data) return;

    this.setRankValue(this._data.order);
    this.txt_name.text = this._data.nickName;
    this.txt_pow.text = this._data.fight + "";
    this.txt_lv.text = this._data.index + "";
  }

  /**设置排行值 */
  private setRankValue(rank: number = 0) {
    if (rank > 0 && rank <= 3) {
      this.txt_rank.text = "";
      let iconUrl = this.getIconName(rank);
      this.rankIcon.url = FUIHelper.getItemURL(EmPackName.Base, iconUrl);
      this.rankIcon.visible = true;
    } else {
      this.txt_rank.text = rank.toString();
      this.rankIcon.visible = false;
    }
  }

  private getIconName(rank: number): string {
    let value = "";
    switch (rank) {
      case 1:
        value = "Icon_1st_S";
        break;
      case 2:
        value = "Icon_2nd_S";
        break;
      case 3:
        value = "Icon_3rd_S";
        break;

      default:
        break;
    }
    return value;
  }
}
