/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MyGoldInfoView extends fgui.GComponent {
  public c1: fgui.Controller;
  public c2: fgui.Controller;
  public titleNameTxt: fgui.GTextField;
  public descTxt: fgui.GRichTextField;
  public list: fgui.GList;
  public countTxt: fgui.GTextField;
  public findBtn: fgui.GButton;
  public descTxt2: fgui.GRichTextField;
  public static URL: string = "ui://xcvl5694fuyfmiwv";

  public static createInstance(): FUI_MyGoldInfoView {
    return <FUI_MyGoldInfoView>(
      fgui.UIPackage.createObject("OuterCity", "MyGoldInfoView")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.c2 = this.getController("c2");
    this.titleNameTxt = <fgui.GTextField>this.getChild("titleNameTxt");
    this.descTxt = <fgui.GRichTextField>this.getChild("descTxt");
    this.list = <fgui.GList>this.getChild("list");
    this.countTxt = <fgui.GTextField>this.getChild("countTxt");
    this.findBtn = <fgui.GButton>this.getChild("findBtn");
    this.descTxt2 = <fgui.GRichTextField>this.getChild("descTxt2");
  }
}
