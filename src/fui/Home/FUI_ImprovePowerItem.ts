/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ImprovePowerItem extends fgui.GComponent {
  public bg: fgui.GImage;
  public typeIcon: fgui.GLoader;
  public nameTxt: fgui.GTextField;
  public upBtn: fgui.GButton;
  public static URL: string = "ui://tny43dz1gu8dmj2i";

  public static createInstance(): FUI_ImprovePowerItem {
    return <FUI_ImprovePowerItem>(
      fgui.UIPackage.createObject("Home", "ImprovePowerItem")
    );
  }

  protected onConstruct(): void {
    this.bg = <fgui.GImage>this.getChild("bg");
    this.typeIcon = <fgui.GLoader>this.getChild("typeIcon");
    this.nameTxt = <fgui.GTextField>this.getChild("nameTxt");
    this.upBtn = <fgui.GButton>this.getChild("upBtn");
  }
}
