/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ExchangeRandom extends fgui.GComponent {
  public list_shop: fgui.GList;
  public tipItem5: fgui.GButton;
  public tipItem4: fgui.GButton;
  public btn_refresh: fgui.GButton;
  public btn_freeRefresh: fgui.GButton;
  public txt_Mystery: fgui.GTextField;
  public txt_Point: fgui.GTextField;
  public txt_refreshTime: fgui.GTextField;
  public diamondTxt: fgui.GTextField;
  public giftTxt: fgui.GTextField;
  public diamondItem2: fgui.GButton;
  public giftItem: fgui.GButton;
  public txt_cost: fgui.GTextField;
  public diamondItem1: fgui.GButton;
  public moneyTxt1: fgui.GTextField;
  public static URL: string = "ui://n1kaa5q9pvdvw";

  public static createInstance(): FUI_ExchangeRandom {
    return <FUI_ExchangeRandom>(
      fgui.UIPackage.createObject("OutCityShop", "ExchangeRandom")
    );
  }

  protected onConstruct(): void {
    this.list_shop = <fgui.GList>this.getChild("list_shop");
    this.tipItem5 = <fgui.GButton>this.getChild("tipItem5");
    this.tipItem4 = <fgui.GButton>this.getChild("tipItem4");
    this.btn_refresh = <fgui.GButton>this.getChild("btn_refresh");
    this.btn_freeRefresh = <fgui.GButton>this.getChild("btn_freeRefresh");
    this.txt_Mystery = <fgui.GTextField>this.getChild("txt_Mystery");
    this.txt_Point = <fgui.GTextField>this.getChild("txt_Point");
    this.txt_refreshTime = <fgui.GTextField>this.getChild("txt_refreshTime");
    this.diamondTxt = <fgui.GTextField>this.getChild("diamondTxt");
    this.giftTxt = <fgui.GTextField>this.getChild("giftTxt");
    this.diamondItem2 = <fgui.GButton>this.getChild("diamondItem2");
    this.giftItem = <fgui.GButton>this.getChild("giftItem");
    this.txt_cost = <fgui.GTextField>this.getChild("txt_cost");
    this.diamondItem1 = <fgui.GButton>this.getChild("diamondItem1");
    this.moneyTxt1 = <fgui.GTextField>this.getChild("moneyTxt1");
  }
}
