/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_SFashionSwitchView from "./FUI_SFashionSwitchView";
import FUI_SFashionComposeView from "./FUI_SFashionComposeView";

export default class FUI_SFashionCom extends fgui.GComponent {
  public c1: fgui.Controller;
  public fashswitch_com: FUI_SFashionSwitchView;
  public fashcompose_com: FUI_SFashionComposeView;
  public tab: fgui.GList;
  public static URL: string = "ui://6fvk31suhd59ehid2";

  public static createInstance(): FUI_SFashionCom {
    return <FUI_SFashionCom>fgui.UIPackage.createObject("SBag", "SFashionCom");
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.fashswitch_com = <FUI_SFashionSwitchView>(
      this.getChild("fashswitch_com")
    );
    this.fashcompose_com = <FUI_SFashionComposeView>(
      this.getChild("fashcompose_com")
    );
    this.tab = <fgui.GList>this.getChild("tab");
  }
}
