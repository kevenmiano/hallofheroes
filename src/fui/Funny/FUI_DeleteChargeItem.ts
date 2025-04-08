/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DeleteChargeItem extends fgui.GComponent {
  public rewardStatus: fgui.Controller;
  public rankCtr: fgui.Controller;
  public getRewardBtn: fgui.GButton;
  public dayValueTxt: fgui.GTextField;
  public backPrecentTxt1: fgui.GTextField;
  public backPrecentTxt2: fgui.GTextField;
  public backPrecentTxt3: fgui.GTextField;
  public backPrecentTxt4: fgui.GTextField;
  public chargeValueTxt: fgui.GTextField;
  public backValueTxt: fgui.GTextField;
  public dataGroup: fgui.GGroup;
  public static URL: string = "ui://lzu8jcp2h9d8icb";

  public static createInstance(): FUI_DeleteChargeItem {
    return <FUI_DeleteChargeItem>(
      fgui.UIPackage.createObject("Funny", "DeleteChargeItem")
    );
  }

  protected onConstruct(): void {
    this.rewardStatus = this.getController("rewardStatus");
    this.rankCtr = this.getController("rankCtr");
    this.getRewardBtn = <fgui.GButton>this.getChild("getRewardBtn");
    this.dayValueTxt = <fgui.GTextField>this.getChild("dayValueTxt");
    this.backPrecentTxt1 = <fgui.GTextField>this.getChild("backPrecentTxt1");
    this.backPrecentTxt2 = <fgui.GTextField>this.getChild("backPrecentTxt2");
    this.backPrecentTxt3 = <fgui.GTextField>this.getChild("backPrecentTxt3");
    this.backPrecentTxt4 = <fgui.GTextField>this.getChild("backPrecentTxt4");
    this.chargeValueTxt = <fgui.GTextField>this.getChild("chargeValueTxt");
    this.backValueTxt = <fgui.GTextField>this.getChild("backValueTxt");
    this.dataGroup = <fgui.GGroup>this.getChild("dataGroup");
  }
}
