import FUI_CarnivalInfoItem from "../../../../fui/Carnival/FUI_CarnivalInfoItem";

export default class CarnivalInfoItem extends FUI_CarnivalInfoItem {
  protected onConstruct(): void {
    super.onConstruct();
  }

  public ensureSizeCorrect() {
    this.group.ensureBoundsCorrect();
    this.group.ensureSizeCorrect();
    super.ensureSizeCorrect();
  }
}
