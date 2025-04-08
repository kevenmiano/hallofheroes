/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CommonTipItem extends fgui.GComponent {
  public imgMask: fgui.GGraph;
  public static URL: string = "ui://og5jeos3p2nrid6";

  public static createInstance(): FUI_CommonTipItem {
    return <FUI_CommonTipItem>(
      fgui.UIPackage.createObject("Base", "CommonTipItem")
    );
  }

  protected onConstruct(): void {
    this.imgMask = <fgui.GGraph>this.getChild("imgMask");
  }
}
