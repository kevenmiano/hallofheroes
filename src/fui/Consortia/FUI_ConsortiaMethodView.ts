/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaMethodView extends fgui.GComponent {
  public functionList: fgui.GList;
  public methodList: fgui.GList;
  public desxTxt1: fgui.GTextField;
  public desxTxt2: fgui.GTextField;
  public static URL: string = "ui://8w3m5duwtib7idk";

  public static createInstance(): FUI_ConsortiaMethodView {
    return <FUI_ConsortiaMethodView>(
      fgui.UIPackage.createObject("Consortia", "ConsortiaMethodView")
    );
  }

  protected onConstruct(): void {
    this.functionList = <fgui.GList>this.getChild("functionList");
    this.methodList = <fgui.GList>this.getChild("methodList");
    this.desxTxt1 = <fgui.GTextField>this.getChild("desxTxt1");
    this.desxTxt2 = <fgui.GTextField>this.getChild("desxTxt2");
  }
}
