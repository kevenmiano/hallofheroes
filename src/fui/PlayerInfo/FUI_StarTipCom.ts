/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_StarTipCom extends fgui.GComponent {
  public bgMask: fgui.GImage;
  public txt_title: fgui.GTextField;
  public txt_star: fgui.GTextField;
  public comp: fgui.GGroup;
  public list: fgui.GList;

  // public group: fgui.GGroup;
  public static URL: string = "ui://i5djjunllbk9i3d";

  public static createInstance(): FUI_StarTipCom {
    return <FUI_StarTipCom>(
      fgui.UIPackage.createObject("PlayerInfo", "StarTipCom")
    );
  }

  protected onConstruct(): void {
    this.bgMask = <fgui.GImage>this.getChild("bgMask");
    this.txt_title = <fgui.GTextField>this.getChild("txt_title");
    this.txt_star = <fgui.GTextField>this.getChild("txt_star");
    this.comp = <fgui.GGroup>this.getChild("comp");
    this.list = <fgui.GList>this.getChild("list");
    this.group = <fgui.GGroup>this.getChild("group");
  }
}
