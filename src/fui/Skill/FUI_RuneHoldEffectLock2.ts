/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneHoldEffectLock2 extends fgui.GButton {
  public cb: fgui.GImage;
  public skillIcon: fgui.GLoader;
  public profile: fgui.GLoader;
  public lockImg: fgui.GImage;
  public cn: fgui.GImage;
  public cns: fgui.GImage;
  public static URL: string = "ui://v98hah2olin8imv";

  public static createInstance(): FUI_RuneHoldEffectLock2 {
    return <FUI_RuneHoldEffectLock2>(
      fgui.UIPackage.createObject("Skill", "RuneHoldEffectLock2")
    );
  }

  protected onConstruct(): void {
    this.cb = <fgui.GImage>this.getChild("cb");
    this.skillIcon = <fgui.GLoader>this.getChild("skillIcon");
    this.profile = <fgui.GLoader>this.getChild("profile");
    this.lockImg = <fgui.GImage>this.getChild("lockImg");
    this.cn = <fgui.GImage>this.getChild("cn");
    this.cns = <fgui.GImage>this.getChild("cns");
  }
}
