/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DragIconCom extends fgui.GComponent {
  public iconloader: fgui.GLoader;
  public _SIcon: fgui.GImage;
  public static URL: string = "ui://v98hah2oubspilh";

  public static createInstance(): FUI_DragIconCom {
    return <FUI_DragIconCom>fgui.UIPackage.createObject("Skill", "DragIconCom");
  }

  protected onConstruct(): void {
    this.iconloader = <fgui.GLoader>this.getChild("iconloader");
    this._SIcon = <fgui.GImage>this.getChild("_SIcon");
  }
}
