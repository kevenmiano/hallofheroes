/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FightingDescribleItem extends fgui.GComponent {
  public state: fgui.Controller;
  public bg: fgui.GImage;
  public iconBg: fgui.GImage;
  public typeIcon: fgui.GLoader;
  public typeNameTxt: fgui.GTextField;
  public descTxt: fgui.GTextField;
  public operationBtn: fgui.GButton;
  public static URL: string = "ui://tny43dz1n4mhhuh";

  public static createInstance(): FUI_FightingDescribleItem {
    return <FUI_FightingDescribleItem>(
      fgui.UIPackage.createObject("Home", "FightingDescribleItem")
    );
  }

  protected onConstruct(): void {
    this.state = this.getController("state");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.iconBg = <fgui.GImage>this.getChild("iconBg");
    this.typeIcon = <fgui.GLoader>this.getChild("typeIcon");
    this.typeNameTxt = <fgui.GTextField>this.getChild("typeNameTxt");
    this.descTxt = <fgui.GTextField>this.getChild("descTxt");
    this.operationBtn = <fgui.GButton>this.getChild("operationBtn");
  }
}
