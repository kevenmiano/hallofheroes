import FUI_RechargeLotteryInfoItem from "../../../../../fui/Funny/FUI_RechargeLotteryInfoItem";
//@ts-expect-error: External dependencies
import LotteryInfoMsg = com.road.yishi.proto.active.LotteryInfoMsg;
import LangManager from "../../../../core/lang/LangManager";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/6/2 11:07
 * @ver 1.0
 */
export class RechargeLotteryInfoItem extends FUI_RechargeLotteryInfoItem {
  private _info: LotteryInfoMsg;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  set info(value: LotteryInfoMsg) {
    this._info = value;
    if (value) {
      this.txt_price.text = LangManager.Instance.GetTranslation(
        "RoomList.pvp.colosseum.box.txt1",
        (value.chargeNum >> 0) / 100 + "/" + value.giveNum,
      );
      this.txt_times.text = value.curNum + "/" + value.maxNum;
    }
  }

  dispose() {
    this._info = null;
    super.dispose();
  }
}
