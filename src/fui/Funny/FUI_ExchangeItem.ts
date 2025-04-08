// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_Exch from "./FUI_Exch";

export default class FUI_ExchangeItem extends fgui.GComponent {
  public c2: fgui.Controller;
  public bar: fgui.GProgressBar;
  public imgbox: FUI_Exch;
  public txt_input: fgui.GTextField;
  public txt: fgui.GRichTextField;
  public txt_count: fgui.GRichTextField;
  public btn_claim: fgui.GButton;
  public btn_exchange: fgui.GButton;
  public btn_exchange_all: fgui.GButton;
  public static URL: string = "ui://lzu8jcp2zi1966";

  public static createInstance(): FUI_ExchangeItem {
    return <FUI_ExchangeItem>(
      fgui.UIPackage.createObject("Funny", "ExchangeItem")
    );
  }

  protected onConstruct(): void {
    this.c2 = this.getController("c2");
    this.bar = <fgui.GProgressBar>this.getChild("bar");
    this.imgbox = <FUI_Exch>this.getChild("imgbox");
    this.txt_input = <fgui.GTextField>this.getChild("txt_input");
    this.txt = <fgui.GRichTextField>this.getChild("txt");
    this.txt_count = <fgui.GRichTextField>this.getChild("txt_count");
    this.btn_claim = <fgui.GButton>this.getChild("btn_claim");
    this.btn_exchange = <fgui.GButton>this.getChild("btn_exchange");
    this.btn_exchange_all = <fgui.GButton>this.getChild("btn_exchange_all");
  }
}
