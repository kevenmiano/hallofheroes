// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_CarnivalInfoItem from "./FUI_CarnivalInfoItem";
import FUI_OutItemGroup from "./FUI_OutItemGroup";
import FUI_InItemGroup from "./FUI_InItemGroup";

export default class FUI_CarnivalRechargePage extends fgui.GComponent {
  public lang: fgui.Controller;
  public Img_CarnivalRecharge_Bg: fgui.GLoader;
  public Img_Txt_Carnival_Recharge: fgui.GLoader;
  public carnival_recharge: FUI_CarnivalInfoItem;
  public _luckTime: fgui.GTextField;
  public Img_CarnivalRecharge_Frame: fgui.GLoader;
  public outItemGroup: FUI_OutItemGroup;
  public inItemGroup: FUI_InItemGroup;
  public _luckBtn: fgui.GButton;
  public _allCountBg: fgui.GImage;
  public _allCountTxt: fgui.GTextField;
  public _oneBtn: fgui.GButton;
  public _tenBtn: fgui.GButton;
  public mainGroup: fgui.GGroup;
  public perCount: fgui.GTextField;
  public perRecharge: fgui.GGroup;
  public static URL: string = "ui://qvbm8hnzpf9kge";

  public static createInstance(): FUI_CarnivalRechargePage {
    return <FUI_CarnivalRechargePage>(
      fgui.UIPackage.createObject("Carnival", "CarnivalRechargePage")
    );
  }

  protected onConstruct(): void {
    this.lang = this.getController("lang");
    this.Img_CarnivalRecharge_Bg = <fgui.GLoader>(
      this.getChild("Img_CarnivalRecharge_Bg")
    );
    this.Img_Txt_Carnival_Recharge = <fgui.GLoader>(
      this.getChild("Img_Txt_Carnival_Recharge")
    );
    this.carnival_recharge = <FUI_CarnivalInfoItem>(
      this.getChild("carnival_recharge")
    );
    this._luckTime = <fgui.GTextField>this.getChild("_luckTime");
    this.Img_CarnivalRecharge_Frame = <fgui.GLoader>(
      this.getChild("Img_CarnivalRecharge_Frame")
    );
    this.outItemGroup = <FUI_OutItemGroup>this.getChild("outItemGroup");
    this.inItemGroup = <FUI_InItemGroup>this.getChild("inItemGroup");
    this._luckBtn = <fgui.GButton>this.getChild("_luckBtn");
    this._allCountBg = <fgui.GImage>this.getChild("_allCountBg");
    this._allCountTxt = <fgui.GTextField>this.getChild("_allCountTxt");
    this._oneBtn = <fgui.GButton>this.getChild("_oneBtn");
    this._tenBtn = <fgui.GButton>this.getChild("_tenBtn");
    this.mainGroup = <fgui.GGroup>this.getChild("mainGroup");
    this.perCount = <fgui.GTextField>this.getChild("perCount");
    this.perRecharge = <fgui.GGroup>this.getChild("perRecharge");
  }
}
