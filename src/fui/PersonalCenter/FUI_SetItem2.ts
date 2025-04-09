/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SetItem2 extends fgui.GComponent {
  public c1: fgui.Controller;
  public bg: fgui.GImage;
  public txt_name: fgui.GRichTextField;
  public btn_add: fgui.GButton;
  public btn_del: fgui.GButton;
  public static URL: string = "ui://6watmcoixb4i2c";

  public static createInstance(): FUI_SetItem2 {
    return <FUI_SetItem2>(
      fgui.UIPackage.createObject("PersonalCenter", "SetItem2")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.txt_name = <fgui.GRichTextField>this.getChild("txt_name");
    this.btn_add = <fgui.GButton>this.getChild("btn_add");
    this.btn_del = <fgui.GButton>this.getChild("btn_del");
  }
}
