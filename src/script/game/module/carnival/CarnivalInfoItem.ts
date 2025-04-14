import FUI_CarnivalInfoItem from "../../../../fui/Carnival/FUI_CarnivalInfoItem";

export default class CarnivalInfoItem extends FUI_CarnivalInfoItem {
  protected onConstruct(): void {
    super.onConstruct();
  }

  public ensureSizeCorrect() {
    this.Group.ensureBoundsCorrect();
    this.Group.ensureSizeCorrect();
    super.ensureSizeCorrect();
  }
}
