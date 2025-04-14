/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SJewelCom extends fgui.GComponent {
  public bar: fgui.GProgressBar;
  public btn_levelup: fgui.GButton;
  public txt_lv0: fgui.GTextField;
  public txt_lv1: fgui.GTextField;
  public txt_lv: fgui.GTextField;
  public nextLevelLab: fgui.GTextField;
  public txt_add: fgui.GTextField;
  public txt_input: fgui.GTextField;
  public btn_help: fgui.GButton;
  public tipItem: fgui.GButton;
  public fl: fgui.GImage;
  public maxTxt: fgui.GTextField;
  public fr: fgui.GImage;
  public maxTitle: fgui.GGroup;
  public static URL: string = "ui://6fvk31sudyl7ehick";

  public static createInstance(): FUI_SJewelCom {
    return <FUI_SJewelCom>fgui.UIPackage.createObject("SBag", "SJewelCom");
  }

  protected onConstruct(): void {
    this.bar = <fgui.GProgressBar>this.getChild("bar");
    this.btn_levelup = <fgui.GButton>this.getChild("btn_levelup");
    this.txt_lv0 = <fgui.GTextField>this.getChild("txt_lv0");
    this.txt_lv1 = <fgui.GTextField>this.getChild("txt_lv1");
    this.txt_lv = <fgui.GTextField>this.getChild("txt_lv");
    this.nextLevelLab = <fgui.GTextField>this.getChild("nextLevelLab");
    this.txt_add = <fgui.GTextField>this.getChild("txt_add");
    this.txt_input = <fgui.GTextField>this.getChild("txt_input");
    this.btn_help = <fgui.GButton>this.getChild("btn_help");
    this.tipItem = <fgui.GButton>this.getChild("tipItem");
    this.fl = <fgui.GImage>this.getChild("fl");
    this.maxTxt = <fgui.GTextField>this.getChild("maxTxt");
    this.fr = <fgui.GImage>this.getChild("fr");
    this.maxTitle = <fgui.GGroup>this.getChild("maxTitle");
  }
}
