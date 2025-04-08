/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AirGardenGameFivecardScoreItem extends fgui.GComponent {
  public bg: fgui.GImage;
  public imgShine: fgui.GImage;
  public _txtFivecardScoreName: fgui.GTextField;
  public _txtFivecardScoreValue: fgui.GTextField;
  public static URL: string = "ui://qvbm8hnzklu8gz";

  public static createInstance(): FUI_AirGardenGameFivecardScoreItem {
    return <FUI_AirGardenGameFivecardScoreItem>(
      fgui.UIPackage.createObject("Carnival", "AirGardenGameFivecardScoreItem")
    );
  }

  protected onConstruct(): void {
    this.bg = <fgui.GImage>this.getChild("bg");
    this.imgShine = <fgui.GImage>this.getChild("imgShine");
    this._txtFivecardScoreName = <fgui.GTextField>(
      this.getChild("_txtFivecardScoreName")
    );
    this._txtFivecardScoreValue = <fgui.GTextField>(
      this.getChild("_txtFivecardScoreValue")
    );
  }
}
