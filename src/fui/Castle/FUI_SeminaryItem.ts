/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SeminaryItem extends fgui.GComponent {
  public isMax: fgui.Controller;
  public BG: fgui.GImage;
  public Img_new: fgui.GImage;
  public newIcon: fgui.GButton;
  public Btn_upgrade: fgui.GButton;
  public nameTxt: fgui.GTextField;
  public Leveltxt: fgui.GTextField;
  public reduceTxt: fgui.GTextField;
  public reduceTimeTxt: fgui.GTextField;
  public descTxt1: fgui.GTextField;
  public descTxt2: fgui.GTextField;
  public costTxt: fgui.GTextField;
  public tipItem: fgui.GButton;
  public costValueTxt: fgui.GTextField;
  public static URL: string = "ui://sm9fel4le280d";

  public static createInstance(): FUI_SeminaryItem {
    return <FUI_SeminaryItem>(
      fgui.UIPackage.createObject("Castle", "SeminaryItem")
    );
  }

  protected onConstruct(): void {
    this.isMax = this.getController("isMax");
    this.BG = <fgui.GImage>this.getChild("BG");
    this.Img_new = <fgui.GImage>this.getChild("Img_new");
    this.newIcon = <fgui.GButton>this.getChild("newIcon");
    this.Btn_upgrade = <fgui.GButton>this.getChild("Btn_upgrade");
    this.nameTxt = <fgui.GTextField>this.getChild("nameTxt");
    this.Leveltxt = <fgui.GTextField>this.getChild("Leveltxt");
    this.reduceTxt = <fgui.GTextField>this.getChild("reduceTxt");
    this.reduceTimeTxt = <fgui.GTextField>this.getChild("reduceTimeTxt");
    this.descTxt1 = <fgui.GTextField>this.getChild("descTxt1");
    this.descTxt2 = <fgui.GTextField>this.getChild("descTxt2");
    this.costTxt = <fgui.GTextField>this.getChild("costTxt");
    this.tipItem = <fgui.GButton>this.getChild("tipItem");
    this.costValueTxt = <fgui.GTextField>this.getChild("costValueTxt");
  }
}
