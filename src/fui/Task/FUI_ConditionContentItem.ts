/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConditionContentItem extends fgui.GComponent {
  public ConditionContentTxt: fgui.GRichTextField;
  public static URL: string = "ui://m40vdx3kt5nzrv";

  public static createInstance(): FUI_ConditionContentItem {
    return <FUI_ConditionContentItem>(
      fgui.UIPackage.createObject("Task", "ConditionContentItem")
    );
  }

  protected onConstruct(): void {
    this.ConditionContentTxt = <fgui.GRichTextField>(
      this.getChild("ConditionContentTxt")
    );
  }
}
