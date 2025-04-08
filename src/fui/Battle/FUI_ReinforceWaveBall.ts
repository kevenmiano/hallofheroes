/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ReinforceWaveBall extends fgui.GButton {
  public waveBg: fgui.GImage;
  public mc1: fgui.GMovieClip;
  public mc2: fgui.GMovieClip;
  public static URL: string = "ui://tybyzkwzhk1w14a";

  public static createInstance(): FUI_ReinforceWaveBall {
    return <FUI_ReinforceWaveBall>(
      fgui.UIPackage.createObject("Battle", "ReinforceWaveBall")
    );
  }

  protected onConstruct(): void {
    this.waveBg = <fgui.GImage>this.getChild("waveBg");
    this.mc1 = <fgui.GMovieClip>this.getChild("mc1");
    this.mc2 = <fgui.GMovieClip>this.getChild("mc2");
  }
}
