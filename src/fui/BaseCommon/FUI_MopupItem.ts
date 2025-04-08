/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MopupItem extends fgui.GComponent {
  public txtStateDesc: fgui.GTextField;
  public title: fgui.GTextField;
  public gTitleBar: fgui.GGroup;
  public txtGetExp: fgui.GTextField;
  public list: fgui.GList;
  public group: fgui.GGroup;
  public static URL: string = "ui://4x3i47txqzu4rt";

  public static createInstance(): FUI_MopupItem {
    return <FUI_MopupItem>(
      fgui.UIPackage.createObject("BaseCommon", "MopupItem")
    );
  }

  protected onConstruct(): void {
    this.txtStateDesc = <fgui.GTextField>this.getChild("txtStateDesc");
    this.title = <fgui.GTextField>this.getChild("title");
    this.gTitleBar = <fgui.GGroup>this.getChild("gTitleBar");
    this.txtGetExp = <fgui.GTextField>this.getChild("txtGetExp");
    this.list = <fgui.GList>this.getChild("list");
    this.group = <fgui.GGroup>this.getChild("group");
  }
}
