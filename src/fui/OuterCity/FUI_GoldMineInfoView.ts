/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GoldMineInfoView extends fgui.GComponent {
  public c1: fgui.Controller;
  public c2: fgui.Controller;
  public tab: fgui.Controller;
  public goldNameTxt: fgui.GTextField;
  public titleNameTxt: fgui.GTextField;
  public noResDescTxt: fgui.GTextField;
  public leftCountTxt: fgui.GTextField;
  public emptyBtn: fgui.GButton;
  public occupyBtn: fgui.GButton;
  public list: fgui.GList;
  public descTxt: fgui.GTextField;
  public backBtn: fgui.GButton;
  public static URL: string = "ui://xcvl5694hgpcmiwq";

  public static createInstance(): FUI_GoldMineInfoView {
    return <FUI_GoldMineInfoView>(
      fgui.UIPackage.createObject("OuterCity", "GoldMineInfoView")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.c2 = this.getController("c2");
    this.tab = this.getController("tab");
    this.goldNameTxt = <fgui.GTextField>this.getChild("goldNameTxt");
    this.titleNameTxt = <fgui.GTextField>this.getChild("titleNameTxt");
    this.noResDescTxt = <fgui.GTextField>this.getChild("noResDescTxt");
    this.leftCountTxt = <fgui.GTextField>this.getChild("leftCountTxt");
    this.emptyBtn = <fgui.GButton>this.getChild("emptyBtn");
    this.occupyBtn = <fgui.GButton>this.getChild("occupyBtn");
    this.list = <fgui.GList>this.getChild("list");
    this.descTxt = <fgui.GTextField>this.getChild("descTxt");
    this.backBtn = <fgui.GButton>this.getChild("backBtn");
  }
}
