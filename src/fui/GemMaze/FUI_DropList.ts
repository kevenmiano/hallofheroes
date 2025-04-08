/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DropList extends fgui.GComponent {
  public click_rect: fgui.GGraph;
  public img_bg: fgui.GImage;
  public txt: fgui.GTextField;
  public list: fgui.GList;
  public static URL: string = "ui://iwrz1divkscu5i";

  public static createInstance(): FUI_DropList {
    return <FUI_DropList>fgui.UIPackage.createObject("GemMaze", "DropList");
  }

  protected onConstruct(): void {
    this.click_rect = <fgui.GGraph>this.getChild("click_rect");
    this.img_bg = <fgui.GImage>this.getChild("img_bg");
    this.txt = <fgui.GTextField>this.getChild("txt");
    this.list = <fgui.GList>this.getChild("list");
  }
}
