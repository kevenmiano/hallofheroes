/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_Btn_ShopService from "./FUI_Btn_ShopService";

export default class FUI_PayView extends fgui.GComponent {
  public effectShow: fgui.Controller;
  public showLottery: fgui.Controller;
  public txt_uid: fgui.GRichTextField;
  public btn_service: FUI_Btn_ShopService;
  public effectShow_2: fgui.GComponent;
  public btn_vip: fgui.GButton;
  public vipExpProgress: fgui.GProgressBar;
  public list: fgui.GList;
  public txt_vipexp: fgui.GRichTextField;
  public helpBtn: fgui.GButton;
  public imgVipLv: fgui.GImage;
  public vipLevel: fgui.GTextField;
  public rTxtReward1: fgui.GRichTextField;
  public helpTips: fgui.GGroup;
  public btn_lottery: fgui.GButton;
  public wartTips: fgui.GTextField;
  public static URL: string = "ui://qcwdul6nl35xw";

  public static createInstance(): FUI_PayView {
    return <FUI_PayView>fgui.UIPackage.createObject("Shop", "PayView");
  }

  protected onConstruct(): void {
    this.effectShow = this.getController("effectShow");
    this.showLottery = this.getController("showLottery");
    this.txt_uid = <fgui.GRichTextField>this.getChild("txt_uid");
    this.btn_service = <FUI_Btn_ShopService>this.getChild("btn_service");
    this.effectShow_2 = <fgui.GComponent>this.getChild("effectShow");
    this.btn_vip = <fgui.GButton>this.getChild("btn_vip");
    this.vipExpProgress = <fgui.GProgressBar>this.getChild("vipExpProgress");
    this.list = <fgui.GList>this.getChild("list");
    this.txt_vipexp = <fgui.GRichTextField>this.getChild("txt_vipexp");
    this.helpBtn = <fgui.GButton>this.getChild("helpBtn");
    this.imgVipLv = <fgui.GImage>this.getChild("imgVipLv");
    this.vipLevel = <fgui.GTextField>this.getChild("vipLevel");
    this.rTxtReward1 = <fgui.GRichTextField>this.getChild("rTxtReward1");
    this.helpTips = <fgui.GGroup>this.getChild("helpTips");
    this.btn_lottery = <fgui.GButton>this.getChild("btn_lottery");
    this.wartTips = <fgui.GTextField>this.getChild("wartTips");
  }
}
