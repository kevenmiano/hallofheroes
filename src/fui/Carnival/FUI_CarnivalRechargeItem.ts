/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CarnivalRechargeItem extends fgui.GComponent {
  public typeCtrl: fgui.Controller;
  public txtCtrl: fgui.Controller;
  public Icon_IconBox65: fgui.GLoader;
  public Icon_Carnival: fgui.GLoader;
  public _luckGroup: fgui.GGroup;
  public _item: fgui.GButton;
  public _lightImg: fgui.GImage;
  public txt_super: fgui.GTextField;
  public static URL: string = "ui://qvbm8hnz9ht4gt";

  public static createInstance(): FUI_CarnivalRechargeItem {
    return <FUI_CarnivalRechargeItem>(
      fgui.UIPackage.createObject("Carnival", "CarnivalRechargeItem")
    );
  }

  protected onConstruct(): void {
    this.typeCtrl = this.getController("typeCtrl");
    this.txtCtrl = this.getController("txtCtrl");
    this.Icon_IconBox65 = <fgui.GLoader>this.getChild("Icon_IconBox65");
    this.Icon_Carnival = <fgui.GLoader>this.getChild("Icon_Carnival");
    this._luckGroup = <fgui.GGroup>this.getChild("_luckGroup");
    this._item = <fgui.GButton>this.getChild("_item");
    this._lightImg = <fgui.GImage>this.getChild("_lightImg");
    this.txt_super = <fgui.GTextField>this.getChild("txt_super");
  }
}
