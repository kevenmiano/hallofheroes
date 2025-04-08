// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_scrollNotice from "./FUI_scrollNotice";

export default class FUI_HomeBugleNoticeWnd extends fgui.GComponent {
  public c1: fgui.Controller;
  public contentbg: fgui.GImage;
  public noticeIcon: fgui.GImage;
  public scrollMsg: FUI_scrollNotice;
  public static URL: string = "ui://tny43dz1uk3ppc";

  public static createInstance(): FUI_HomeBugleNoticeWnd {
    return <FUI_HomeBugleNoticeWnd>(
      fgui.UIPackage.createObject("Home", "HomeBugleNoticeWnd")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.contentbg = <fgui.GImage>this.getChild("contentbg");
    this.noticeIcon = <fgui.GImage>this.getChild("noticeIcon");
    this.scrollMsg = <FUI_scrollNotice>this.getChild("scrollMsg");
  }
}
