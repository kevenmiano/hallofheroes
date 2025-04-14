/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SignInDayBtn extends fgui.GButton {
  public state: fgui.Controller;
  public signed: fgui.Controller;
  public signEffect: fgui.Controller;
  public signed_2: fgui.GImage;
  public effect: fgui.GMovieClip;
  public static URL: string = "ui://vw2db6bov2103p";

  public static createInstance(): FUI_SignInDayBtn {
    return <FUI_SignInDayBtn>(
      fgui.UIPackage.createObject("Welfare", "SignInDayBtn")
    );
  }

  protected onConstruct(): void {
    this.state = this.getController("state");
    this.signed = this.getController("signed");
    this.signEffect = this.getController("signEffect");
    this.signed_2 = <fgui.GImage>this.getChild("signed");
    this.effect = <fgui.GMovieClip>this.getChild("effect");
  }
}
