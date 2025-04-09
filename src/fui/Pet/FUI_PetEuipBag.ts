/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetEuipBag extends fgui.GComponent {
  public resolveCtrl: fgui.Controller;
  public tbg: fgui.GImage;
  public equipBagList: fgui.GList;
  public btn_cancel: fgui.GButton;
  public btn_resolve: fgui.GButton;
  public btn_all: fgui.GButton;
  public txt_bag: fgui.GTextField;
  public btn_buy: fgui.GButton;
  public bagCountGroup: fgui.GGroup;
  public list_tab: fgui.GList;
  public static URL: string = "ui://t0l2fizvgoiuibb";

  public static createInstance(): FUI_PetEuipBag {
    return <FUI_PetEuipBag>fgui.UIPackage.createObject("Pet", "PetEuipBag");
  }

  protected onConstruct(): void {
    this.resolveCtrl = this.getController("resolveCtrl");
    this.tbg = <fgui.GImage>this.getChild("tbg");
    this.equipBagList = <fgui.GList>this.getChild("equipBagList");
    this.btn_cancel = <fgui.GButton>this.getChild("btn_cancel");
    this.btn_resolve = <fgui.GButton>this.getChild("btn_resolve");
    this.btn_all = <fgui.GButton>this.getChild("btn_all");
    this.txt_bag = <fgui.GTextField>this.getChild("txt_bag");
    this.btn_buy = <fgui.GButton>this.getChild("btn_buy");
    this.bagCountGroup = <fgui.GGroup>this.getChild("bagCountGroup");
    this.list_tab = <fgui.GList>this.getChild("list_tab");
  }
}
