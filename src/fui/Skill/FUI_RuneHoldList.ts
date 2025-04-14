/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneHoldList extends fgui.GComponent {
  public list: fgui.GList;
  public static URL: string = "ui://v98hah2olin8ims";

  public static createInstance(): FUI_RuneHoldList {
    return <FUI_RuneHoldList>(
      fgui.UIPackage.createObject("Skill", "RuneHoldList")
    );
  }

  protected onConstruct(): void {
    this.list = <fgui.GList>this.getChild("list");
  }
}
