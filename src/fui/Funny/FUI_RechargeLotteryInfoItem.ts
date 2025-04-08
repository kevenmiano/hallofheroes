/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RechargeLotteryInfoItem extends fgui.GComponent {
  public txt_price: fgui.GTextField;
  public txt_times: fgui.GTextField;
  public static URL: string = "ui://lzu8jcp2mwzamifp";

  public static createInstance(): FUI_RechargeLotteryInfoItem {
    return <FUI_RechargeLotteryInfoItem>(
      fgui.UIPackage.createObject("Funny", "RechargeLotteryInfoItem")
    );
  }

  protected onConstruct(): void {
    this.txt_price = <fgui.GTextField>this.getChild("txt_price");
    this.txt_times = <fgui.GTextField>this.getChild("txt_times");
  }
}
