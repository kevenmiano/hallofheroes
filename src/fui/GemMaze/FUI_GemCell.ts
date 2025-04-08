/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GemCell extends fgui.GComponent {
  public clickrect: fgui.GComponent;
  public static URL: string = "ui://iwrz1divgp0n5d";

  public static createInstance(): FUI_GemCell {
    return <FUI_GemCell>fgui.UIPackage.createObject("GemMaze", "GemCell");
  }

  protected onConstruct(): void {
    this.clickrect = <fgui.GComponent>this.getChild("clickrect");
  }
}
