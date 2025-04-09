/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_listMsgItem extends fgui.GComponent {
  public msg: fgui.GRichTextField;
  public static URL: string = "ui://n1kaa5q9tjmky";

  public static createInstance(): FUI_listMsgItem {
    return <FUI_listMsgItem>(
      fgui.UIPackage.createObject("OutCityShop", "listMsgItem")
    );
  }

  protected onConstruct(): void {
    this.msg = <fgui.GRichTextField>this.getChild("msg");
  }
}
