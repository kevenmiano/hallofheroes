/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AddFriendsItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public icon_head: fgui.GComponent;
  public txt_level: fgui.GTextField;
  public txt_name: fgui.GTextField;
  public txt_fight: fgui.GTextField;
  public bbtn_add: fgui.GButton;
  public bbtn_binggo: fgui.GButton;
  public static URL: string = "ui://kbt4qqcbsxtsx";

  public static createInstance(): FUI_AddFriendsItem {
    return <FUI_AddFriendsItem>(
      fgui.UIPackage.createObject("Friend", "AddFriendsItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.icon_head = <fgui.GComponent>this.getChild("icon_head");
    this.txt_level = <fgui.GTextField>this.getChild("txt_level");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
    this.txt_fight = <fgui.GTextField>this.getChild("txt_fight");
    this.bbtn_add = <fgui.GButton>this.getChild("bbtn_add");
    this.bbtn_binggo = <fgui.GButton>this.getChild("bbtn_binggo");
  }
}
