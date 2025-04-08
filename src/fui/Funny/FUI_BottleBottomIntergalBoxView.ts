/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BottleBottomIntergalBoxView extends fgui.GComponent {
  public canAward: fgui.Controller;
  public _light: fgui.GComponent;
  public _getBoxBtn: fgui.GButton;
  public txt_floor: fgui.GTextField;
  public g_receive: fgui.GGraph;
  public static URL: string = "ui://lzu8jcp2jb9sid1";

  public static createInstance(): FUI_BottleBottomIntergalBoxView {
    return <FUI_BottleBottomIntergalBoxView>(
      fgui.UIPackage.createObject("Funny", "BottleBottomIntergalBoxView")
    );
  }

  protected onConstruct(): void {
    this.canAward = this.getController("canAward");
    this._light = <fgui.GComponent>this.getChild("_light");
    this._getBoxBtn = <fgui.GButton>this.getChild("_getBoxBtn");
    this.txt_floor = <fgui.GTextField>this.getChild("txt_floor");
    this.g_receive = <fgui.GGraph>this.getChild("g_receive");
  }
}
