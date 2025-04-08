/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_Prog_BossHp from "./FUI_Prog_BossHp";

export default class FUI_DoubleBossInfoView extends fgui.GComponent {

	public btnHead2:fgui.GLoader;
	public progBossHp2:FUI_Prog_BossHp;
	public txtRBossTitleName2:fgui.GTextField;
	public txtRBossName2:fgui.GTextField;
	public txtRBossGrade2:fgui.GTextField;
	public roleShowInfo2:fgui.GGroup;
	public bossBufferCom2:fgui.GComponent;
	public btnHead1:fgui.GLoader;
	public progBossHp1:FUI_Prog_BossHp;
	public txtRBossGrade1:fgui.GTextField;
	public txtRBossTitleName1:fgui.GTextField;
	public txtRBossName1:fgui.GTextField;
	public roleShowInfo1:fgui.GGroup;
	public bossBufferCom1:fgui.GComponent;
	public topRight_Box:fgui.GGroup;
	public static URL:string = "ui://8u8203vzlqmdi7h";

	public static createInstance():FUI_DoubleBossInfoView {
		return <FUI_DoubleBossInfoView>(fgui.UIPackage.createObject("CampaignCommon", "DoubleBossInfoView"));
	}

	protected onConstruct():void {
		this.btnHead2 = <fgui.GLoader>(this.getChild("btnHead2"));
		this.progBossHp2 = <FUI_Prog_BossHp>(this.getChild("progBossHp2"));
		this.txtRBossTitleName2 = <fgui.GTextField>(this.getChild("txtRBossTitleName2"));
		this.txtRBossName2 = <fgui.GTextField>(this.getChild("txtRBossName2"));
		this.txtRBossGrade2 = <fgui.GTextField>(this.getChild("txtRBossGrade2"));
		this.roleShowInfo2 = <fgui.GGroup>(this.getChild("roleShowInfo2"));
		this.bossBufferCom2 = <fgui.GComponent>(this.getChild("bossBufferCom2"));
		this.btnHead1 = <fgui.GLoader>(this.getChild("btnHead1"));
		this.progBossHp1 = <FUI_Prog_BossHp>(this.getChild("progBossHp1"));
		this.txtRBossGrade1 = <fgui.GTextField>(this.getChild("txtRBossGrade1"));
		this.txtRBossTitleName1 = <fgui.GTextField>(this.getChild("txtRBossTitleName1"));
		this.txtRBossName1 = <fgui.GTextField>(this.getChild("txtRBossName1"));
		this.roleShowInfo1 = <fgui.GGroup>(this.getChild("roleShowInfo1"));
		this.bossBufferCom1 = <fgui.GComponent>(this.getChild("bossBufferCom1"));
		this.topRight_Box = <fgui.GGroup>(this.getChild("topRight_Box"));
	}
}