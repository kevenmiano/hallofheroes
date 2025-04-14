/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_QuestionSubmit extends fgui.GComponent {
  public Btn_Buy: fgui.GButton;
  public static URL: string = "ui://hu55xxyzdhyfh";

  public static createInstance(): FUI_QuestionSubmit {
    return <FUI_QuestionSubmit>(
      fgui.UIPackage.createObject("QuestionNaire", "QuestionSubmit")
    );
  }

  protected onConstruct(): void {
    this.Btn_Buy = <fgui.GButton>this.getChild("Btn_Buy");
  }
}
