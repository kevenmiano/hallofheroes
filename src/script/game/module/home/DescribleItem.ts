//@ts-expect-error: External dependencies
import FUI_DescribleItem from "../../../../fui/Home/FUI_DescribleItem";

export default class DescribleItem extends FUI_DescribleItem {
  onConstruct() {
    super.onConstruct();
  }

  public setCondition(value: string) {
    this.describleTxt.text = value;
  }

  public setConditionProgress(value: string) {
    if (value) this.describleTxt.text += value;
  }

  public dispose() {
    super.dispose();
  }
}
