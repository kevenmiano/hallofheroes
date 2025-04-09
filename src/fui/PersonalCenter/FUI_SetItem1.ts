/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SetItem1 extends fgui.GComponent {
  public txt_name: fgui.GRichTextField;
  public btn_set: fgui.GButton;
  public static URL: string = "ui://6watmcoixb4i29";

  public static createInstance(): FUI_SetItem1 {
    return <FUI_SetItem1>(
      fgui.UIPackage.createObject("PersonalCenter", "SetItem1")
    );
  }

  protected onConstruct(): void {
    this.txt_name = <fgui.GRichTextField>this.getChild("txt_name");
    this.btn_set = <fgui.GButton>this.getChild("btn_set");
  }
}
