/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FashionBounsGroup extends fgui.GComponent {
  public gb: fgui.GImage;
  public tb: fgui.GImage;
  public tr: fgui.GImage;
  public tl: fgui.GImage;
  public titleLab: fgui.GTextField;
  public attList: fgui.GList;
  public static URL: string = "ui://6fvk31suerwlehirj";

  public static createInstance(): FUI_FashionBounsGroup {
    return <FUI_FashionBounsGroup>(
      fgui.UIPackage.createObject("SBag", "FashionBounsGroup")
    );
  }

  protected onConstruct(): void {
    this.gb = <fgui.GImage>this.getChild("gb");
    this.tb = <fgui.GImage>this.getChild("tb");
    this.tr = <fgui.GImage>this.getChild("tr");
    this.tl = <fgui.GImage>this.getChild("tl");
    this.titleLab = <fgui.GTextField>this.getChild("titleLab");
    this.attList = <fgui.GList>this.getChild("attList");
  }
}
