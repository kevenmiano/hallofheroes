import FUI_RingTaskRewardItem from "../../../../fui/Dialog/FUI_RingTaskRewardItem";
import RingTaskRewardInfo from "./data/RingTaskRewardInfo";

export default class RingTaskRewardItem extends FUI_RingTaskRewardItem {
  public set info(value: RingTaskRewardInfo) {
    if (!value) {
      this.rewardCountTxt.text = "";
      this.c1.selectedIndex = 0;
    } else {
      this.rewardCountTxt.text = value.count.toString();
      this.c1.selectedIndex = value.index;
    }
  }
}
