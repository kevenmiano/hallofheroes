/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaMemberItem extends fgui.GButton {
  public btnMore: fgui.GButton;
  public headicon: fgui.GComponent;
  public vipIcon: fgui.GImage;
  public txt_level: fgui.GTextField;
  public nameTxt: fgui.GTextField;
  public positionTxt: fgui.GTextField;
  public apTxt: fgui.GTextField;
  public offlineTimeTxt: fgui.GTextField;
  public jobLoader: fgui.GLoader;
  public static URL: string = "ui://8w3m5duwrtw61c";

  public static createInstance(): FUI_ConsortiaMemberItem {
    return <FUI_ConsortiaMemberItem>(
      fgui.UIPackage.createObject("Consortia", "ConsortiaMemberItem")
    );
  }

  protected onConstruct(): void {
    this.btnMore = <fgui.GButton>this.getChild("btnMore");
    this.headicon = <fgui.GComponent>this.getChild("headicon");
    this.vipIcon = <fgui.GImage>this.getChild("vipIcon");
    this.txt_level = <fgui.GTextField>this.getChild("txt_level");
    this.nameTxt = <fgui.GTextField>this.getChild("nameTxt");
    this.positionTxt = <fgui.GTextField>this.getChild("positionTxt");
    this.apTxt = <fgui.GTextField>this.getChild("apTxt");
    this.offlineTimeTxt = <fgui.GTextField>this.getChild("offlineTimeTxt");
    this.jobLoader = <fgui.GLoader>this.getChild("jobLoader");
  }
}
