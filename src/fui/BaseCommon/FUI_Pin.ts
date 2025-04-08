/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_Pin extends fgui.GComponent {
  public wifiState: fgui.Controller;
  public wifiActive: fgui.Controller;
  public pinBox: fgui.GImage;
  public gameTime: fgui.GTextField;
  public wifi: fgui.GLoader;
  public static URL: string = "ui://4x3i47txhswdic0";

  public static createInstance(): FUI_Pin {
    return <FUI_Pin>fgui.UIPackage.createObject("BaseCommon", "Pin");
  }

  protected onConstruct(): void {
    this.wifiState = this.getController("wifiState");
    this.wifiActive = this.getController("wifiActive");
    this.pinBox = <fgui.GImage>this.getChild("pinBox");
    this.gameTime = <fgui.GTextField>this.getChild("gameTime");
    this.wifi = <fgui.GLoader>this.getChild("wifi");
  }
}
