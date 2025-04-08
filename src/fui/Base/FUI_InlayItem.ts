/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_InlayItem extends fgui.GComponent {
  public ld_icon: fgui.GLoader;
  public txt: fgui.GRichTextField;
  public static URL: string = "ui://og5jeos3e0t0i42";

  public static createInstance(): FUI_InlayItem {
    return <FUI_InlayItem>fgui.UIPackage.createObject("Base", "InlayItem");
  }

  protected onConstruct(): void {
    this.ld_icon = <fgui.GLoader>this.getChild("ld_icon");
    this.txt = <fgui.GRichTextField>this.getChild("txt");
  }
}
