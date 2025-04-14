/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemoteSkillView extends fgui.GComponent {
  public _title: fgui.GTextField;
  public _text1: fgui.GTextField;
  public _text2: fgui.GTextField;
  public _list: fgui.GList;
  public static URL: string = "ui://dq4xsyl3tllo5";

  public static createInstance(): FUI_RemoteSkillView {
    return <FUI_RemoteSkillView>(
      fgui.UIPackage.createObject("RemotePet", "RemoteSkillView")
    );
  }

  protected onConstruct(): void {
    this._title = <fgui.GTextField>this.getChild("_title");
    this._text1 = <fgui.GTextField>this.getChild("_text1");
    this._text2 = <fgui.GTextField>this.getChild("_text2");
    this._list = <fgui.GList>this.getChild("_list");
  }
}
