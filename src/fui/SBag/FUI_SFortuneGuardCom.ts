/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_SFotruneHead from "./FUI_SFotruneHead";

export default class FUI_SFortuneGuardCom extends fgui.GComponent {

	public c1:fgui.Controller;
	public fateIcon:fgui.GButton;
	public ownFateLab:fgui.GTextField;
	public atkFortune:FUI_SFotruneHead;
	public protectFortune:FUI_SFotruneHead;
	public fortuneLvLab:fgui.GTextField;
	public fortuneLab:fgui.GTextField;
	public atkLvLab:fgui.GTextField;
	public atkLab:fgui.GTextField;
	public protectLvLab:fgui.GTextField;
	public protectLab:fgui.GTextField;
	public fortuneTip:fgui.GGroup;
	public modeList:fgui.GList;
	public txt_lv0:fgui.GTextField;
	public txt_lv1:fgui.GTextField;
	public static URL:string = "ui://6fvk31suexm6hici";

	public static createInstance():FUI_SFortuneGuardCom {
		return <FUI_SFortuneGuardCom>(fgui.UIPackage.createObject("SBag", "SFortuneGuardCom"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.fateIcon = <fgui.GButton>(this.getChild("fateIcon"));
		this.ownFateLab = <fgui.GTextField>(this.getChild("ownFateLab"));
		this.atkFortune = <FUI_SFotruneHead>(this.getChild("atkFortune"));
		this.protectFortune = <FUI_SFotruneHead>(this.getChild("protectFortune"));
		this.fortuneLvLab = <fgui.GTextField>(this.getChild("fortuneLvLab"));
		this.fortuneLab = <fgui.GTextField>(this.getChild("fortuneLab"));
		this.atkLvLab = <fgui.GTextField>(this.getChild("atkLvLab"));
		this.atkLab = <fgui.GTextField>(this.getChild("atkLab"));
		this.protectLvLab = <fgui.GTextField>(this.getChild("protectLvLab"));
		this.protectLab = <fgui.GTextField>(this.getChild("protectLab"));
		this.fortuneTip = <fgui.GGroup>(this.getChild("fortuneTip"));
		this.modeList = <fgui.GList>(this.getChild("modeList"));
		this.txt_lv0 = <fgui.GTextField>(this.getChild("txt_lv0"));
		this.txt_lv1 = <fgui.GTextField>(this.getChild("txt_lv1"));
	}
}