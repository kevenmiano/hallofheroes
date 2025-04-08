// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TalentBalance extends fgui.GComponent {

	public talentPoint:fgui.GTextField;
	public txt_gold:fgui.GTextField;
	public txt_exp:fgui.GTextField;
	public skillResetBtn:fgui.GButton;
	public tipItem1:fgui.GButton;
	public tipItem2:fgui.GButton;
	public static URL:string = "ui://v98hah2of7eoilt";

	public static createInstance():FUI_TalentBalance {
		return <FUI_TalentBalance>(fgui.UIPackage.createObject("Skill", "TalentBalance"));
	}

	protected onConstruct():void {
		this.talentPoint = <fgui.GTextField>(this.getChild("talentPoint"));
		this.txt_gold = <fgui.GTextField>(this.getChild("txt_gold"));
		this.txt_exp = <fgui.GTextField>(this.getChild("txt_exp"));
		this.skillResetBtn = <fgui.GButton>(this.getChild("skillResetBtn"));
		this.tipItem1 = <fgui.GButton>(this.getChild("tipItem1"));
		this.tipItem2 = <fgui.GButton>(this.getChild("tipItem2"));
	}
}