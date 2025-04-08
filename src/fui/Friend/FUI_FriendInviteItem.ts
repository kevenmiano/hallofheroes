/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FriendInviteItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public bg: fgui.GLoader;
  public loader_sex: fgui.GLoader;
  public txt_name: fgui.GTextField;
  public txt_lv: fgui.GTextField;
  public btn_agree: fgui.GButton;
  public btn_ignore: fgui.GButton;
  public static URL: string = "ui://kbt4qqcbyy2z12";

  public static createInstance(): FUI_FriendInviteItem {
    return <FUI_FriendInviteItem>(
      fgui.UIPackage.createObject("Friend", "FriendInviteItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.bg = <fgui.GLoader>this.getChild("bg");
    this.loader_sex = <fgui.GLoader>this.getChild("loader_sex");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
    this.txt_lv = <fgui.GTextField>this.getChild("txt_lv");
    this.btn_agree = <fgui.GButton>this.getChild("btn_agree");
    this.btn_ignore = <fgui.GButton>this.getChild("btn_ignore");
  }
}
