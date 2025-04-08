/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CumulativeRechargeDayItem extends fgui.GButton {
  public selectValue: fgui.Controller;
  public tipsState: fgui.Controller;
  public state: fgui.Controller;
  public rewardState: fgui.Controller;
  public selectedState: fgui.Controller;
  public state0: fgui.GImage;
  public state1: fgui.GImage;
  public state2: fgui.GImage;
  public selectImg: fgui.GImage;
  public iconBox: fgui.GLoader;
  public daytext: fgui.GRichTextField;
  public countText: fgui.GRichTextField;
  public static URL: string = "ui://lzu8jcp2g2kn5y";

  public static createInstance(): FUI_CumulativeRechargeDayItem {
    return <FUI_CumulativeRechargeDayItem>(
      fgui.UIPackage.createObject("Funny", "CumulativeRechargeDayItem")
    );
  }

  protected onConstruct(): void {
    this.selectValue = this.getController("selectValue");
    this.tipsState = this.getController("tipsState");
    this.state = this.getController("state");
    this.rewardState = this.getController("rewardState");
    this.selectedState = this.getController("selectedState");
    this.state0 = <fgui.GImage>this.getChild("state0");
    this.state1 = <fgui.GImage>this.getChild("state1");
    this.state2 = <fgui.GImage>this.getChild("state2");
    this.selectImg = <fgui.GImage>this.getChild("selectImg");
    this.iconBox = <fgui.GLoader>this.getChild("iconBox");
    this.daytext = <fgui.GRichTextField>this.getChild("daytext");
    this.countText = <fgui.GRichTextField>this.getChild("countText");
  }
}
