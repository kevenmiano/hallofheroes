/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MyGoldInfoItem extends fgui.GComponent {
  public bg: fgui.GImage;
  public giveUpBtn: fgui.GButton;
  public nameTxt: fgui.GTextField;
  public resouceTxt: fgui.GTextField;
  public static URL: string = "ui://xcvl5694fuyfmiww";

  public static createInstance(): FUI_MyGoldInfoItem {
    return <FUI_MyGoldInfoItem>(
      fgui.UIPackage.createObject("OuterCity", "MyGoldInfoItem")
    );
  }

  protected onConstruct(): void {
    this.bg = <fgui.GImage>this.getChild("bg");
    this.giveUpBtn = <fgui.GButton>this.getChild("giveUpBtn");
    this.nameTxt = <fgui.GTextField>this.getChild("nameTxt");
    this.resouceTxt = <fgui.GTextField>this.getChild("resouceTxt");
  }
}
