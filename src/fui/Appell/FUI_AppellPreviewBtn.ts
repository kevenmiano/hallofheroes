/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AppellPreviewBtn extends fgui.GComponent {
  public Btn_Preview: fgui.GButton;
  public static URL: string = "ui://hr3infdvs1u9e";

  public static createInstance(): FUI_AppellPreviewBtn {
    return <FUI_AppellPreviewBtn>(
      fgui.UIPackage.createObject("Appell", "AppellPreviewBtn")
    );
  }

  protected onConstruct(): void {
    this.Btn_Preview = <fgui.GButton>this.getChild("Btn_Preview");
  }
}
