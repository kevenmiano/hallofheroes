/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutyardOpenTimeItem extends fgui.GComponent {
  public descTxt: fgui.GTextField;
  public timeTxt: fgui.GTextField;
  public static URL: string = "ui://w1giibvbaciyf";

  public static createInstance(): FUI_OutyardOpenTimeItem {
    return <FUI_OutyardOpenTimeItem>(
      fgui.UIPackage.createObject("OutYard", "OutyardOpenTimeItem")
    );
  }

  protected onConstruct(): void {
    this.descTxt = <fgui.GTextField>this.getChild("descTxt");
    this.timeTxt = <fgui.GTextField>this.getChild("timeTxt");
  }
}
