/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DeleteFileLevelView extends fgui.GComponent {
  public txt_desc: fgui.GTextField;
  public txt_remainTime: fgui.GTextField;
  public list: fgui.GList;
  public btn_join: fgui.GButton;
  public btn_help: fgui.GButton;
  public static URL: string = "ui://lzu8jcp2ggc4mift";

  public static createInstance(): FUI_DeleteFileLevelView {
    return <FUI_DeleteFileLevelView>(
      fgui.UIPackage.createObject("Funny", "DeleteFileLevelView")
    );
  }

  protected onConstruct(): void {
    this.txt_desc = <fgui.GTextField>this.getChild("txt_desc");
    this.txt_remainTime = <fgui.GTextField>this.getChild("txt_remainTime");
    this.list = <fgui.GList>this.getChild("list");
    this.btn_join = <fgui.GButton>this.getChild("btn_join");
    this.btn_help = <fgui.GButton>this.getChild("btn_help");
  }
}
