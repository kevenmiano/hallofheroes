/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BottleIntergalBoxView extends fgui.GComponent {
  public canAward: fgui.Controller;
  public icon_box: fgui.GLoader;
  public txt_floor: fgui.GTextField;
  public g_receive: fgui.GGraph;
  public static URL: string = "ui://lzu8jcp2jb9sid0";

  public static createInstance(): FUI_BottleIntergalBoxView {
    return <FUI_BottleIntergalBoxView>(
      fgui.UIPackage.createObject("Funny", "BottleIntergalBoxView")
    );
  }

  protected onConstruct(): void {
    this.canAward = this.getController("canAward");
    this.icon_box = <fgui.GLoader>this.getChild("icon_box");
    this.txt_floor = <fgui.GTextField>this.getChild("txt_floor");
    this.g_receive = <fgui.GGraph>this.getChild("g_receive");
  }
}
