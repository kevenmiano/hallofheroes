/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ComGolds extends fgui.GComponent {
  public A1: fgui.GImage;
  public A2: fgui.GImage;
  public tranGolds: fgui.Transition;
  public static URL: string = "ui://lzu8jcp2jb9sicr";

  public static createInstance(): FUI_ComGolds {
    return <FUI_ComGolds>fgui.UIPackage.createObject("Funny", "ComGolds");
  }

  protected onConstruct(): void {
    this.A1 = <fgui.GImage>this.getChild("A1");
    this.A2 = <fgui.GImage>this.getChild("A2");
    this.tranGolds = this.getTransition("tranGolds");
  }
}
