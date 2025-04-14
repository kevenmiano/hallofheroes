//@ts-expect-error: External dependencies
import FUI_SetItem2 from "../../../../../fui/PersonalCenter/FUI_SetItem2";

export default class SetItem2 extends FUI_SetItem2 {
  rank: number = 0;

  onConstruct() {
    super.onConstruct();
  }
  setData(index) {
    this.rank = index;
  }
}
