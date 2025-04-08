/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CumulativeRechargeItem extends fgui.GComponent {
  public boxbg: fgui.GImage;
  public boxIcon: fgui.GLoader;
  public confirmBtn: fgui.GButton;
  public descTitle1: fgui.GTextField;
  public diamondBtn1: fgui.GButton;
  public title1: fgui.GRichTextField;
  public titleGroup1: fgui.GGroup;
  public descTitle2: fgui.GTextField;
  public diamondBtn2: fgui.GButton;
  public title2: fgui.GRichTextField;
  public titleGroup2: fgui.GGroup;
  public static URL: string = "ui://lzu8jcp2hk1w5e";

  public static createInstance(): FUI_CumulativeRechargeItem {
    return <FUI_CumulativeRechargeItem>(
      fgui.UIPackage.createObject("Funny", "CumulativeRechargeItem")
    );
  }

  protected onConstruct(): void {
    this.boxbg = <fgui.GImage>this.getChild("boxbg");
    this.boxIcon = <fgui.GLoader>this.getChild("boxIcon");
    this.confirmBtn = <fgui.GButton>this.getChild("confirmBtn");
    this.descTitle1 = <fgui.GTextField>this.getChild("descTitle1");
    this.diamondBtn1 = <fgui.GButton>this.getChild("diamondBtn1");
    this.title1 = <fgui.GRichTextField>this.getChild("title1");
    this.titleGroup1 = <fgui.GGroup>this.getChild("titleGroup1");
    this.descTitle2 = <fgui.GTextField>this.getChild("descTitle2");
    this.diamondBtn2 = <fgui.GButton>this.getChild("diamondBtn2");
    this.title2 = <fgui.GRichTextField>this.getChild("title2");
    this.titleGroup2 = <fgui.GGroup>this.getChild("titleGroup2");
  }
}
