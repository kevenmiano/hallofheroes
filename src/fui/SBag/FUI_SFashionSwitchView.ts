/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SFashionSwitchView extends fgui.GComponent {
  public list: fgui.GList;
  public list_tab: fgui.GList;
  public static URL: string = "ui://6fvk31suqvnohick";

  public static createInstance(): FUI_SFashionSwitchView {
    return <FUI_SFashionSwitchView>(
      fgui.UIPackage.createObject("SBag", "SFashionSwitchView")
    );
  }

  protected onConstruct(): void {
    this.list = <fgui.GList>this.getChild("list");
    this.list_tab = <fgui.GList>this.getChild("list_tab");
  }
}
