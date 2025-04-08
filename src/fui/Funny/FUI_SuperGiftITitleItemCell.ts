// TODO FIX

/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_SuperGiftDiaComList from "./FUI_SuperGiftDiaComList";

export default class FUI_SuperGiftITitleItemCell extends fgui.GComponent {
  public buy: fgui.Controller;
  public giftList: fgui.GList;
  public stepper: fgui.GComponent;
  public btn_buy: fgui.GButton;
  public txt_limit: fgui.GTextField;
  public txt_server_buy: fgui.GTextField;
  public title: fgui.GRichTextField;
  public txt_lastPrice: fgui.GTextField;
  public tipBtn1: fgui.GButton;
  public txt_lastPrice_value: fgui.GTextField;
  public txt_nowPrice: fgui.GTextField;
  public tipBtn2: fgui.GButton;
  public txt_nowPrice_value: fgui.GTextField;
  public compDiamond: FUI_SuperGiftDiaComList;
  public static URL: string = "ui://lzu8jcp2nczxmiiz";

  public static createInstance(): FUI_SuperGiftITitleItemCell {
    return <FUI_SuperGiftITitleItemCell>(
      fgui.UIPackage.createObject("Funny", "SuperGiftITitleItemCell")
    );
  }

  protected onConstruct(): void {
    this.buy = this.getController("buy");
    this.giftList = <fgui.GList>this.getChild("giftList");
    this.stepper = <fgui.GComponent>this.getChild("stepper");
    this.btn_buy = <fgui.GButton>this.getChild("btn_buy");
    this.txt_limit = <fgui.GTextField>this.getChild("txt_limit");
    this.txt_server_buy = <fgui.GTextField>this.getChild("txt_server_buy");
    this.title = <fgui.GRichTextField>this.getChild("title");
    this.txt_lastPrice = <fgui.GTextField>this.getChild("txt_lastPrice");
    this.tipBtn1 = <fgui.GButton>this.getChild("tipBtn1");
    this.txt_lastPrice_value = <fgui.GTextField>(
      this.getChild("txt_lastPrice_value")
    );
    this.txt_nowPrice = <fgui.GTextField>this.getChild("txt_nowPrice");
    this.tipBtn2 = <fgui.GButton>this.getChild("tipBtn2");
    this.txt_nowPrice_value = <fgui.GTextField>(
      this.getChild("txt_nowPrice_value")
    );
    this.compDiamond = <FUI_SuperGiftDiaComList>this.getChild("compDiamond");
  }
}
