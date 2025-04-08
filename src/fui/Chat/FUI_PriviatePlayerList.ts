/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PriviatePlayerList extends fgui.GComponent {
  public addBtn: fgui.GButton;
  public list: fgui.GList;
  public static URL: string = "ui://5w3rpk77viv5pf";

  public static createInstance(): FUI_PriviatePlayerList {
    return <FUI_PriviatePlayerList>(
      fgui.UIPackage.createObject("Chat", "PriviatePlayerList")
    );
  }

  protected onConstruct(): void {
    this.addBtn = <fgui.GButton>this.getChild("addBtn");
    this.list = <fgui.GList>this.getChild("list");
  }
}
