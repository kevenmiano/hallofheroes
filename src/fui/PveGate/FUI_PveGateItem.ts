/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PveGateItem extends fgui.GButton {
  public lockCtrl: fgui.Controller;
  public imgSelected: fgui.GImage;
  public crusadeImg: fgui.GImage;
  public itemIcon: fgui.GLoader;
  public leftg2: fgui.GImage;
  public leftg: fgui.GImage;
  public desc: fgui.GTextField;
  public rightg: fgui.GImage;
  public rightg2: fgui.GImage;
  public bottomGroup: fgui.GGroup;
  public lockedImg: fgui.GImage;
  public static URL: string = "ui://fd6olb1ve5yoc";

  public static createInstance(): FUI_PveGateItem {
    return <FUI_PveGateItem>(
      fgui.UIPackage.createObject("PveGate", "PveGateItem")
    );
  }

  protected onConstruct(): void {
    this.lockCtrl = this.getController("lockCtrl");
    this.imgSelected = <fgui.GImage>this.getChild("imgSelected");
    this.crusadeImg = <fgui.GImage>this.getChild("crusadeImg");
    this.itemIcon = <fgui.GLoader>this.getChild("itemIcon");
    this.leftg2 = <fgui.GImage>this.getChild("leftg2");
    this.leftg = <fgui.GImage>this.getChild("leftg");
    this.desc = <fgui.GTextField>this.getChild("desc");
    this.rightg = <fgui.GImage>this.getChild("rightg");
    this.rightg2 = <fgui.GImage>this.getChild("rightg2");
    this.bottomGroup = <fgui.GGroup>this.getChild("bottomGroup");
    this.lockedImg = <fgui.GImage>this.getChild("lockedImg");
  }
}
