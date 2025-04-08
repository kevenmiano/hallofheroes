// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LoginMethod extends fgui.GComponent {
  public list1: fgui.GList;
  public list2: fgui.GList;
  public group: fgui.GGroup;
  public static URL: string = "ui://2ydb9fb2inojsmhihj";

  public static createInstance(): FUI_LoginMethod {
    return <FUI_LoginMethod>fgui.UIPackage.createObject("Login", "LoginMethod");
  }

  protected onConstruct(): void {
    this.list1 = <fgui.GList>this.getChild("list1");
    this.list2 = <fgui.GList>this.getChild("list2");
    this.group = <fgui.GGroup>this.getChild("group");
  }
}
