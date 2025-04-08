/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ResourceItem extends fgui.GComponent {
  public nameTxt: fgui.GTextField;
  public valueTxt: fgui.GTextField;
  public static URL: string = "ui://og5jeos3p77figd";

  public static createInstance(): FUI_ResourceItem {
    return <FUI_ResourceItem>(
      fgui.UIPackage.createObject("Base", "ResourceItem")
    );
  }

  protected onConstruct(): void {
    this.nameTxt = <fgui.GTextField>this.getChild("nameTxt");
    this.valueTxt = <fgui.GTextField>this.getChild("valueTxt");
  }
}
