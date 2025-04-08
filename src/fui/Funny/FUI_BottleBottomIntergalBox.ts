/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BottleBottomIntergalBoxView from "./FUI_BottleBottomIntergalBoxView";

export default class FUI_BottleBottomIntergalBox extends fgui.GComponent {
  public state: fgui.Controller;
  public box: FUI_BottleBottomIntergalBoxView;
  public g_click: fgui.GGraph;
  public static URL: string = "ui://lzu8jcp2rabumifi";

  public static createInstance(): FUI_BottleBottomIntergalBox {
    return <FUI_BottleBottomIntergalBox>(
      fgui.UIPackage.createObject("Funny", "BottleBottomIntergalBox")
    );
  }

  protected onConstruct(): void {
    this.state = this.getController("state");
    this.box = <FUI_BottleBottomIntergalBoxView>this.getChild("box");
    this.g_click = <fgui.GGraph>this.getChild("g_click");
  }
}
