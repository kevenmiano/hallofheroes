/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RewardMsgItem extends fgui.GLabel {
  public content: fgui.GRichTextField;
  public static URL: string = "ui://lzu8jcp2m90rid6";

  public static createInstance(): FUI_RewardMsgItem {
    return <FUI_RewardMsgItem>(
      fgui.UIPackage.createObject("Funny", "RewardMsgItem")
    );
  }

  protected onConstruct(): void {
    this.content = <fgui.GRichTextField>this.getChild("content");
  }
}
