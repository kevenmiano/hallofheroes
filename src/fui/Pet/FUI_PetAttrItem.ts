/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetAttrItem extends fgui.GComponent {
  public title: fgui.GTextField;
  public txtCurValue: fgui.GTextField;
  public txtNextValue: fgui.GTextField;
  public static URL: string = "ui://t0l2fizvn9ly1i";

  public static createInstance(): FUI_PetAttrItem {
    return <FUI_PetAttrItem>fgui.UIPackage.createObject("Pet", "PetAttrItem");
  }

  protected onConstruct(): void {
    this.title = <fgui.GTextField>this.getChild("title");
    this.txtCurValue = <fgui.GTextField>this.getChild("txtCurValue");
    this.txtNextValue = <fgui.GTextField>this.getChild("txtNextValue");
  }
}
