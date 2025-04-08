/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_HeroInfoView extends fgui.GComponent {
  public isVip: fgui.Controller;
  public appell: fgui.GLoader;
  public consortia: fgui.GRichTextField;
  public userName: fgui.GRichTextField;
  public vipIcon: fgui.GLoader;
  public static URL: string = "ui://4x3i47txs1u9i4d";

  public static createInstance(): FUI_HeroInfoView {
    return <FUI_HeroInfoView>(
      fgui.UIPackage.createObject("BaseCommon", "HeroInfoView")
    );
  }

  protected onConstruct(): void {
    this.isVip = this.getController("isVip");
    this.appell = <fgui.GLoader>this.getChild("appell");
    this.consortia = <fgui.GRichTextField>this.getChild("consortia");
    this.userName = <fgui.GRichTextField>this.getChild("userName");
    this.vipIcon = <fgui.GLoader>this.getChild("vipIcon");
  }
}
