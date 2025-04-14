/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_scrollNotice from "./FUI_scrollNotice";

export default class FUI_SystemNoticeWnd extends fgui.GComponent {
  public contentbg: fgui.GImage;
  public noticeIcon: fgui.GImage;
  public scrollMsg: FUI_scrollNotice;
  public static URL: string = "ui://tny43dz1kunvhtx";

  public static createInstance(): FUI_SystemNoticeWnd {
    return <FUI_SystemNoticeWnd>(
      fgui.UIPackage.createObject("Home", "SystemNoticeWnd")
    );
  }

  protected onConstruct(): void {
    this.contentbg = <fgui.GImage>this.getChild("contentbg");
    this.noticeIcon = <fgui.GImage>this.getChild("noticeIcon");
    this.scrollMsg = <FUI_scrollNotice>this.getChild("scrollMsg");
  }
}
