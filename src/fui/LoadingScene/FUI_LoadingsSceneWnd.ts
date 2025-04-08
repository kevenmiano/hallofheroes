// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_loading_bar from "./FUI_loading_bar";

export default class FUI_LoadingsSceneWnd extends fgui.GComponent {
  public LogoActive: fgui.Controller;
  public isOversea: fgui.Controller;
  public img_dharma: fgui.GImage;
  public mc_horse: fgui.GMovieClip;
  public Logo: fgui.GLoader;
  public progressBar: FUI_loading_bar;
  public btnClose: fgui.GButton;
  public txt_netSpeed1: fgui.GTextField;
  public txt_netSpeed: fgui.GTextField;
  public txt_progress: fgui.GTextField;
  public gSpeedAndProg: fgui.GGroup;
  public static URL: string = "ui://r74un5q0gaumqa";

  public static createInstance(): FUI_LoadingsSceneWnd {
    return <FUI_LoadingsSceneWnd>(
      fgui.UIPackage.createObject("LoadingScene", "LoadingsSceneWnd")
    );
  }

  protected onConstruct(): void {
    this.LogoActive = this.getController("LogoActive");
    this.isOversea = this.getController("isOversea");
    this.img_dharma = <fgui.GImage>this.getChild("img_dharma");
    this.mc_horse = <fgui.GMovieClip>this.getChild("mc_horse");
    this.Logo = <fgui.GLoader>this.getChild("Logo");
    this.progressBar = <FUI_loading_bar>this.getChild("progressBar");
    this.btnClose = <fgui.GButton>this.getChild("btnClose");
    this.txt_netSpeed1 = <fgui.GTextField>this.getChild("txt_netSpeed1");
    this.txt_netSpeed = <fgui.GTextField>this.getChild("txt_netSpeed");
    this.txt_progress = <fgui.GTextField>this.getChild("txt_progress");
    this.gSpeedAndProg = <fgui.GGroup>this.getChild("gSpeedAndProg");
  }
}
