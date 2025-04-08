/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_IconAvatarFrame from "./FUI_IconAvatarFrame";

export default class FUI_InviteItem extends fgui.GButton {
  public headIcon: FUI_IconAvatarFrame;
  public btnInvite: fgui.GButton;
  public imgLevelBg: fgui.GImage;
  public txtName: fgui.GTextField;
  public txtJob: fgui.GTextField;
  public txtLevel: fgui.GTextField;
  public testIcon: fgui.GLoader;
  public static URL: string = "ui://4x3i47txb0wd1";

  public static createInstance(): FUI_InviteItem {
    return <FUI_InviteItem>(
      fgui.UIPackage.createObject("BaseCommon", "InviteItem")
    );
  }

  protected onConstruct(): void {
    this.headIcon = <FUI_IconAvatarFrame>this.getChild("headIcon");
    this.btnInvite = <fgui.GButton>this.getChild("btnInvite");
    this.imgLevelBg = <fgui.GImage>this.getChild("imgLevelBg");
    this.txtName = <fgui.GTextField>this.getChild("txtName");
    this.txtJob = <fgui.GTextField>this.getChild("txtJob");
    this.txtLevel = <fgui.GTextField>this.getChild("txtLevel");
    this.testIcon = <fgui.GLoader>this.getChild("testIcon");
  }
}
