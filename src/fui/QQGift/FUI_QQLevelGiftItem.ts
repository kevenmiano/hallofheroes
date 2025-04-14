/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_QQLevelGiftItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public list: fgui.GList;
  public txtTitle: fgui.GTextField;
  public btn_receive: fgui.GButton;
  public btn_gray: fgui.GButton;
  public static URL: string = "ui://bvd290kryh33b";

  public static createInstance(): FUI_QQLevelGiftItem {
    return <FUI_QQLevelGiftItem>(
      fgui.UIPackage.createObject("QQGift", "QQLevelGiftItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.list = <fgui.GList>this.getChild("list");
    this.txtTitle = <fgui.GTextField>this.getChild("txtTitle");
    this.btn_receive = <fgui.GButton>this.getChild("btn_receive");
    this.btn_gray = <fgui.GButton>this.getChild("btn_gray");
  }
}
