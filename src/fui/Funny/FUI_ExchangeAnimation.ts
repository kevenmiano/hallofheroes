/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ExchangeAnimation extends fgui.GComponent {
  public mc: fgui.GMovieClip;
  public static URL: string = "ui://lzu8jcp2vn7mmifk";

  public static createInstance(): FUI_ExchangeAnimation {
    return <FUI_ExchangeAnimation>(
      fgui.UIPackage.createObject("Funny", "ExchangeAnimation")
    );
  }

  protected onConstruct(): void {
    this.mc = <fgui.GMovieClip>this.getChild("mc");
  }
}
