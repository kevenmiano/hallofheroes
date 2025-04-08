/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ReinforceWavePane extends fgui.GComponent {
  public forceText: fgui.GTextField;
  public list: fgui.GList;
  public static URL: string = "ui://tybyzkwzhk1w149";

  public static createInstance(): FUI_ReinforceWavePane {
    return <FUI_ReinforceWavePane>(
      fgui.UIPackage.createObject("Battle", "ReinforceWavePane")
    );
  }

  protected onConstruct(): void {
    this.forceText = <fgui.GTextField>this.getChild("forceText");
    this.list = <fgui.GList>this.getChild("list");
  }
}
