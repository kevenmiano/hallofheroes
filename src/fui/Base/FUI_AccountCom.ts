// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseTipItem from "./FUI_BaseTipItem";
// import FUI_CommonBtn from "./FUI_CommonBtn";

export default class FUI_AccountCom extends fgui.GComponent {
  public typeCtrl: fgui.Controller;
  public showRecharge: fgui.Controller;
  public diamondTip: FUI_BaseTipItem;
  public giftTxt: fgui.GTextField;
  public btn_buy: FUI_CommonBtn;
  public giftTip: FUI_BaseTipItem;
  public voucherTxt: fgui.GTextField;
  public goldTip: FUI_BaseTipItem;
  public goldTxt: fgui.GTextField;
  public tipItem1: FUI_BaseTipItem;
  public txt_honor: fgui.GTextField;
  public txt_fate: fgui.GTextField;
  public tipItem2: FUI_BaseTipItem;
  public img_icon2: fgui.GImage;
  public txt_soul: fgui.GTextField;
  public txt_gem: fgui.GTextField;
  public tipItem3: FUI_BaseTipItem;
  public txt_dragonCrystal: fgui.GTextField;
  public tipItem4: FUI_BaseTipItem;
  public txt_petGrowthStone: fgui.GTextField;
  public tipItem5: FUI_BaseTipItem;
  public petGrowthStone_buy: FUI_CommonBtn;
  public txt_petCoeStone: fgui.GTextField;
  public tipItem6: FUI_BaseTipItem;
  public txt_petEquipStrengStone: fgui.GTextField;
  public tipItem7: FUI_BaseTipItem;
  public txt_money8: fgui.GTextField;
  public tipItem8: FUI_BaseTipItem;
  public txt_money9: fgui.GTextField;
  public tipItem9: FUI_BaseTipItem;
  public txt_money10: fgui.GTextField;
  public tipItem10: FUI_BaseTipItem;
  public txt_money12: fgui.GTextField;
  public tipItem12: FUI_BaseTipItem;
  public txt_money11: fgui.GTextField;
  public tipItem11: FUI_BaseTipItem;
  public txt_money13: fgui.GTextField;
  public tipItem13: FUI_BaseTipItem;
  public txt_dragonCrystal2: fgui.GTextField;
  public tipItem14: FUI_BaseTipItem;
  public txt_consortiajianse: fgui.GTextField;
  public tipItem15: FUI_BaseTipItem;
  public group: fgui.GGroup;
  public static URL: string = "ui://og5jeos3129oeii4";

  public static createInstance(): FUI_AccountCom {
    return <FUI_AccountCom>fgui.UIPackage.createObject("Base", "AccountCom");
  }

  protected onConstruct(): void {
    this.typeCtrl = this.getController("typeCtrl");
    this.showRecharge = this.getController("showRecharge");
    this.diamondTip = <FUI_BaseTipItem>this.getChild("diamondTip");
    this.giftTxt = <fgui.GTextField>this.getChild("giftTxt");
    this.btn_buy = <FUI_CommonBtn>this.getChild("btn_buy");
    this.giftTip = <FUI_BaseTipItem>this.getChild("giftTip");
    this.voucherTxt = <fgui.GTextField>this.getChild("voucherTxt");
    this.goldTip = <FUI_BaseTipItem>this.getChild("goldTip");
    this.goldTxt = <fgui.GTextField>this.getChild("goldTxt");
    this.tipItem1 = <FUI_BaseTipItem>this.getChild("tipItem1");
    this.txt_honor = <fgui.GTextField>this.getChild("txt_honor");
    this.txt_fate = <fgui.GTextField>this.getChild("txt_fate");
    this.tipItem2 = <FUI_BaseTipItem>this.getChild("tipItem2");
    this.img_icon2 = <fgui.GImage>this.getChild("img_icon2");
    this.txt_soul = <fgui.GTextField>this.getChild("txt_soul");
    this.txt_gem = <fgui.GTextField>this.getChild("txt_gem");
    this.tipItem3 = <FUI_BaseTipItem>this.getChild("tipItem3");
    this.txt_dragonCrystal = <fgui.GTextField>(
      this.getChild("txt_dragonCrystal")
    );
    this.tipItem4 = <FUI_BaseTipItem>this.getChild("tipItem4");
    this.txt_petGrowthStone = <fgui.GTextField>(
      this.getChild("txt_petGrowthStone")
    );
    this.tipItem5 = <FUI_BaseTipItem>this.getChild("tipItem5");
    this.petGrowthStone_buy = <FUI_CommonBtn>(
      this.getChild("petGrowthStone_buy")
    );
    this.txt_petCoeStone = <fgui.GTextField>this.getChild("txt_petCoeStone");
    this.tipItem6 = <FUI_BaseTipItem>this.getChild("tipItem6");
    this.txt_petEquipStrengStone = <fgui.GTextField>(
      this.getChild("txt_petEquipStrengStone")
    );
    this.tipItem7 = <FUI_BaseTipItem>this.getChild("tipItem7");
    this.txt_money8 = <fgui.GTextField>this.getChild("txt_money8");
    this.tipItem8 = <FUI_BaseTipItem>this.getChild("tipItem8");
    this.txt_money9 = <fgui.GTextField>this.getChild("txt_money9");
    this.tipItem9 = <FUI_BaseTipItem>this.getChild("tipItem9");
    this.txt_money10 = <fgui.GTextField>this.getChild("txt_money10");
    this.tipItem10 = <FUI_BaseTipItem>this.getChild("tipItem10");
    this.txt_money12 = <fgui.GTextField>this.getChild("txt_money12");
    this.tipItem12 = <FUI_BaseTipItem>this.getChild("tipItem12");
    this.txt_money11 = <fgui.GTextField>this.getChild("txt_money11");
    this.tipItem11 = <FUI_BaseTipItem>this.getChild("tipItem11");
    this.txt_money13 = <fgui.GTextField>this.getChild("txt_money13");
    this.tipItem13 = <FUI_BaseTipItem>this.getChild("tipItem13");
    this.txt_dragonCrystal2 = <fgui.GTextField>(
      this.getChild("txt_dragonCrystal2")
    );
    this.tipItem14 = <FUI_BaseTipItem>this.getChild("tipItem14");
    this.txt_consortiajianse = <fgui.GTextField>(
      this.getChild("txt_consortiajianse")
    );
    this.tipItem15 = <FUI_BaseTipItem>this.getChild("tipItem15");
    this.group = <fgui.GGroup>this.getChild("group");
  }
}
