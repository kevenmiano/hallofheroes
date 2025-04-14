/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SignInCom extends fgui.GComponent {
  public list: fgui.GList;
  public img0: fgui.GImage;
  public img1: fgui.GImage;
  public img2: fgui.GImage;
  public t0: fgui.GTextField;
  public txt_resign_count: fgui.GRichTextField;
  public static URL: string = "ui://vw2db6boh67k9midp";

  public static createInstance(): FUI_SignInCom {
    return <FUI_SignInCom>fgui.UIPackage.createObject("Welfare", "SignInCom");
  }

  protected onConstruct(): void {
    this.list = <fgui.GList>this.getChild("list");
    this.img0 = <fgui.GImage>this.getChild("img0");
    this.img1 = <fgui.GImage>this.getChild("img1");
    this.img2 = <fgui.GImage>this.getChild("img2");
    this.t0 = <fgui.GTextField>this.getChild("t0");
    this.txt_resign_count = <fgui.GRichTextField>(
      this.getChild("txt_resign_count")
    );
  }
}
