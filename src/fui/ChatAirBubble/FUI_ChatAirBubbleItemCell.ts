/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ChatAirBubbleItemCell extends fgui.GComponent {
  public state: fgui.Controller;
  public isEquiped: fgui.Controller;
  public itemImg: fgui.GImage;
  public Icon_Equ2: fgui.GImage;
  public btn_use: fgui.GButton;
  public btn_buy: fgui.GButton;
  public btn_watch: fgui.GButton;
  public txt_lock: fgui.GTextField;
  public group_lock: fgui.GGroup;
  public moneyType: fgui.GLoader;
  public txt_price: fgui.GTextField;
  public txt_bubble_name: fgui.GRichTextField;
  public txt_getDes: fgui.GRichTextField;
  public txt_now_use: fgui.GRichTextField;
  public txt_hasBuy: fgui.GTextField;
  public txt_Des: fgui.GRichTextField;
  public static URL: string = "ui://wjl4wwzou3zz4";

  public static createInstance(): FUI_ChatAirBubbleItemCell {
    return <FUI_ChatAirBubbleItemCell>(
      fgui.UIPackage.createObject("ChatAirBubble", "ChatAirBubbleItemCell")
    );
  }

  protected onConstruct(): void {
    this.state = this.getController("state");
    this.isEquiped = this.getController("isEquiped");
    this.itemImg = <fgui.GImage>this.getChild("itemImg");
    this.Icon_Equ2 = <fgui.GImage>this.getChild("Icon_Equ2");
    this.btn_use = <fgui.GButton>this.getChild("btn_use");
    this.btn_buy = <fgui.GButton>this.getChild("btn_buy");
    this.btn_watch = <fgui.GButton>this.getChild("btn_watch");
    this.txt_lock = <fgui.GTextField>this.getChild("txt_lock");
    this.group_lock = <fgui.GGroup>this.getChild("group_lock");
    this.moneyType = <fgui.GLoader>this.getChild("moneyType");
    this.txt_price = <fgui.GTextField>this.getChild("txt_price");
    this.txt_bubble_name = <fgui.GRichTextField>(
      this.getChild("txt_bubble_name")
    );
    this.txt_getDes = <fgui.GRichTextField>this.getChild("txt_getDes");
    this.txt_now_use = <fgui.GRichTextField>this.getChild("txt_now_use");
    this.txt_hasBuy = <fgui.GTextField>this.getChild("txt_hasBuy");
    this.txt_Des = <fgui.GRichTextField>this.getChild("txt_Des");
  }
}
