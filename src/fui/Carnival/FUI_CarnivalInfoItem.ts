/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CarnivalInfoItem extends fgui.GComponent {
  public type: fgui.Controller;
  public Ground: fgui.GImage;
  public txt_title: fgui.GRichTextField;
  public iconType: fgui.GLoader;
  public txt_value: fgui.GRichTextField;
  public Group: fgui.GGroup;
  public static URL: string = "ui://qvbm8hnzuuxigs";

  public static createInstance(): FUI_CarnivalInfoItem {
    return <FUI_CarnivalInfoItem>(
      fgui.UIPackage.createObject("Carnival", "CarnivalInfoItem")
    );
  }

  protected onConstruct(): void {
    this.type = this.getController("type");
    this.Ground = <fgui.GImage>this.getChild("Ground");
    this.txt_title = <fgui.GRichTextField>this.getChild("txt_title");
    this.iconType = <fgui.GLoader>this.getChild("iconType");
    this.txt_value = <fgui.GRichTextField>this.getChild("txt_value");
    this.Group = <fgui.GGroup>this.getChild("Group");
  }
}
