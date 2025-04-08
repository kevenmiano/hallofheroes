/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MessageLabel extends fgui.GComponent {
  public bg: fgui.GImage;
  public txt: fgui.GRichTextField;
  public static URL: string = "ui://nod69r7kqorgsmhig5";

  public static createInstance(): FUI_MessageLabel {
    return <FUI_MessageLabel>(
      fgui.UIPackage.createObject("BaseInit", "MessageLabel")
    );
  }

  protected onConstruct(): void {
    this.bg = <fgui.GImage>this.getChild("bg");
    this.txt = <fgui.GRichTextField>this.getChild("txt");
  }
}
