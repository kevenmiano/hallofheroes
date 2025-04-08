// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_LoginAccountBtn from "./FUI_LoginAccountBtn";

export default class FUI_LoginWayGuest extends fgui.GComponent {
  public guestBtn: FUI_LoginAccountBtn;
  public split: fgui.GComponent;
  public accountBtn: FUI_LoginAccountBtn;
  public loginStateGuest: fgui.GGroup;
  public static URL: string = "ui://2ydb9fb2inojsmhihm";

  public static createInstance(): FUI_LoginWayGuest {
    return <FUI_LoginWayGuest>(
      fgui.UIPackage.createObject("Login", "LoginWayGuest")
    );
  }

  protected onConstruct(): void {
    this.guestBtn = <FUI_LoginAccountBtn>this.getChild("guestBtn");
    this.split = <fgui.GComponent>this.getChild("split");
    this.accountBtn = <FUI_LoginAccountBtn>this.getChild("accountBtn");
    this.loginStateGuest = <fgui.GGroup>this.getChild("loginStateGuest");
  }
}
