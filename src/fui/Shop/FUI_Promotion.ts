/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_Promotion extends fgui.GComponent {
  public effectShow: fgui.Controller;
  public titleIcon: fgui.GImage;
  public txt_describe: fgui.GRichTextField;
  public list: fgui.GList;
  public static URL: string = "ui://qcwdul6npvdv1m";

  public static createInstance(): FUI_Promotion {
    return <FUI_Promotion>fgui.UIPackage.createObject("Shop", "Promotion");
  }

  protected onConstruct(): void {
    this.effectShow = this.getController("effectShow");
    this.titleIcon = <fgui.GImage>this.getChild("titleIcon");
    this.txt_describe = <fgui.GRichTextField>this.getChild("txt_describe");
    this.list = <fgui.GList>this.getChild("list");
  }
}
