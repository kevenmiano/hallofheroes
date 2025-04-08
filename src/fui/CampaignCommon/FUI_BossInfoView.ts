// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_Prog_BossHp from "./FUI_Prog_BossHp";

export default class FUI_BossInfoView extends fgui.GComponent {
  public btnHead: fgui.GLoader;
  public progBossHp: FUI_Prog_BossHp;
  public txtRBossTitleName: fgui.GTextField;
  public txtRBossName: fgui.GTextField;
  public txtRBossGrade: fgui.GTextField;
  public roleShowInfo2: fgui.GGroup;
  public bossBufferCom: fgui.GComponent;
  public imgTrailBg: fgui.GImage;
  public txtTrailLevel: fgui.GRichTextField;
  public trail: fgui.GGroup;
  public topRight_Box: fgui.GGroup;
  public static URL: string = "ui://8u8203vzfszcp0";

  public static createInstance(): FUI_BossInfoView {
    return <FUI_BossInfoView>(
      fgui.UIPackage.createObject("CampaignCommon", "BossInfoView")
    );
  }

  protected onConstruct(): void {
    console.log("FUI_BossInfoView onConstruct");
    this.btnHead = <fgui.GLoader>this.getChild("btnHead");
    this.progBossHp = <FUI_Prog_BossHp>this.getChild("progBossHp");
    this.txtRBossTitleName = <fgui.GTextField>(
      this.getChild("txtRBossTitleName")
    );
    this.txtRBossName = <fgui.GTextField>this.getChild("txtRBossName");
    this.txtRBossGrade = <fgui.GTextField>this.getChild("txtRBossGrade");
    this.roleShowInfo2 = <fgui.GGroup>this.getChild("roleShowInfo2");
    this.bossBufferCom = <fgui.GComponent>this.getChild("bossBufferCom");
    this.imgTrailBg = <fgui.GImage>this.getChild("imgTrailBg");
    this.txtTrailLevel = <fgui.GRichTextField>this.getChild("txtTrailLevel");
    this.trail = <fgui.GGroup>this.getChild("trail");
    this.topRight_Box = <fgui.GGroup>this.getChild("topRight_Box");
  }
}
