/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_YTextInput extends fgui.GComponent {
  public isMobile: fgui.Controller;
  public txt_web: fgui.GTextInput;
  public txt_mobile: fgui.GRichTextField;
  public hit: fgui.GGraph;
  public static URL: string = "ui://nod69r7krsp1hict";

  public static createInstance(): FUI_YTextInput {
    return <FUI_YTextInput>(
      fgui.UIPackage.createObject("BaseInit", "YTextInput")
    );
  }

  protected onConstruct(): void {
    this.isMobile = this.getController("isMobile");
    this.txt_web = <fgui.GTextInput>this.getChild("txt_web");
    this.txt_mobile = <fgui.GRichTextField>this.getChild("txt_mobile");
    this.hit = <fgui.GGraph>this.getChild("hit");
  }
}
