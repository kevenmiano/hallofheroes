/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LuckyExchangeView extends fgui.GComponent {
  public banner: fgui.GImage;
  public exchangeInfoList: fgui.GList;
  public rareInfoList: fgui.GList;
  public progress: fgui.GProgressBar;
  public activityTimeDescTxt: fgui.GTextField;
  public activityTimeValueTxt: fgui.GTextField;
  public timeGroup: fgui.GGroup;
  public countDescTxt: fgui.GTextField;
  public countValueTxt: fgui.GTextField;
  public countGroup: fgui.GGroup;
  public rareTxt: fgui.GTextField;
  public exchangeTxt: fgui.GTextField;
  public exchangeValueTxt: fgui.GTextInput;
  public luckyTxt: fgui.GTextField;
  public luckyValueTxt: fgui.GTextField;
  public luckyDescTxt: fgui.GTextField;
  public exchangeBtn: fgui.GButton;
  public baseItem: fgui.GButton;
  public static URL: string = "ui://lzu8jcp27mu3iby";

  public static createInstance(): FUI_LuckyExchangeView {
    return <FUI_LuckyExchangeView>(
      fgui.UIPackage.createObject("Funny", "LuckyExchangeView")
    );
  }

  protected onConstruct(): void {
    this.banner = <fgui.GImage>this.getChild("banner");
    this.exchangeInfoList = <fgui.GList>this.getChild("exchangeInfoList");
    this.rareInfoList = <fgui.GList>this.getChild("rareInfoList");
    this.progress = <fgui.GProgressBar>this.getChild("progress");
    this.activityTimeDescTxt = <fgui.GTextField>(
      this.getChild("activityTimeDescTxt")
    );
    this.activityTimeValueTxt = <fgui.GTextField>(
      this.getChild("activityTimeValueTxt")
    );
    this.timeGroup = <fgui.GGroup>this.getChild("timeGroup");
    this.countDescTxt = <fgui.GTextField>this.getChild("countDescTxt");
    this.countValueTxt = <fgui.GTextField>this.getChild("countValueTxt");
    this.countGroup = <fgui.GGroup>this.getChild("countGroup");
    this.rareTxt = <fgui.GTextField>this.getChild("rareTxt");
    this.exchangeTxt = <fgui.GTextField>this.getChild("exchangeTxt");
    this.exchangeValueTxt = <fgui.GTextInput>this.getChild("exchangeValueTxt");
    this.luckyTxt = <fgui.GTextField>this.getChild("luckyTxt");
    this.luckyValueTxt = <fgui.GTextField>this.getChild("luckyValueTxt");
    this.luckyDescTxt = <fgui.GTextField>this.getChild("luckyDescTxt");
    this.exchangeBtn = <fgui.GButton>this.getChild("exchangeBtn");
    this.baseItem = <fgui.GButton>this.getChild("baseItem");
  }
}
