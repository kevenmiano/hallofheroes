/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BufferItem extends fgui.GComponent {
  public icon1: fgui.GLoader;
  public countTxt: fgui.GTextField;
  public timeTxt: fgui.GTextField;
  public static URL: string = "ui://tny43dz1h8a2htm";

  public static createInstance(): FUI_BufferItem {
    return <FUI_BufferItem>fgui.UIPackage.createObject("Home", "BufferItem");
  }

  protected onConstruct(): void {
    this.icon1 = <fgui.GLoader>this.getChild("icon1");
    this.countTxt = <fgui.GTextField>this.getChild("countTxt");
    this.timeTxt = <fgui.GTextField>this.getChild("timeTxt");
  }
}
