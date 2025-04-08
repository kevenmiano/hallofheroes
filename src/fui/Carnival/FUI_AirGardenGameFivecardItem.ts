/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AirGardenGameFivecardItem extends fgui.GComponent {
  public pokerValueColor: fgui.Controller;
  public pokerBg: fgui.GImage;
  public pokerColor: fgui.GLoader;
  public pokerValueNum: fgui.GTextField;
  public pokerFront: fgui.GGroup;
  public pokerBack: fgui.GImage;
  public pokerSel: fgui.GImage;
  public holdTxt: fgui.GTextField;
  public static URL: string = "ui://qvbm8hnzklu8h0";

  public static createInstance(): FUI_AirGardenGameFivecardItem {
    return <FUI_AirGardenGameFivecardItem>(
      fgui.UIPackage.createObject("Carnival", "AirGardenGameFivecardItem")
    );
  }

  protected onConstruct(): void {
    this.pokerValueColor = this.getController("pokerValueColor");
    this.pokerBg = <fgui.GImage>this.getChild("pokerBg");
    this.pokerColor = <fgui.GLoader>this.getChild("pokerColor");
    this.pokerValueNum = <fgui.GTextField>this.getChild("pokerValueNum");
    this.pokerFront = <fgui.GGroup>this.getChild("pokerFront");
    this.pokerBack = <fgui.GImage>this.getChild("pokerBack");
    this.pokerSel = <fgui.GImage>this.getChild("pokerSel");
    this.holdTxt = <fgui.GTextField>this.getChild("holdTxt");
  }
}
