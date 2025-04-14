/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LevelGiftItem1 extends fgui.GComponent {
  public c1: fgui.Controller;
  public txt_lv: fgui.GTextField;
  public list: fgui.GList;
  public txt_desc: fgui.GTextField;
  public btn_receive: fgui.GButton;
  public static URL: string = "ui://vw2db6bowvo23v";

  public static createInstance(): FUI_LevelGiftItem1 {
    return <FUI_LevelGiftItem1>(
      fgui.UIPackage.createObject("Welfare", "LevelGiftItem1")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.txt_lv = <fgui.GTextField>this.getChild("txt_lv");
    this.list = <fgui.GList>this.getChild("list");
    this.txt_desc = <fgui.GTextField>this.getChild("txt_desc");
    this.btn_receive = <fgui.GButton>this.getChild("btn_receive");
  }
}
