// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OuterCityWarDefenceSettingItem extends fgui.GComponent {

	public cIsPet:fgui.Controller;
	public cIsDefence:fgui.Controller;
	public txtNickName:fgui.GTextField;
	public txtDefenceBuild:fgui.GTextField;
	public imgJob:fgui.GLoader;
	public txtPawn:fgui.GTextField;
	public txtCapaity:fgui.GTextField;
	public gHero:fgui.GGroup;
	public txtPetCapaity:fgui.GTextField;
	public txtPetTotalCapaity:fgui.GTextField;
	public gPet:fgui.GGroup;
	public txtDefenceState:fgui.GTextField;
	public btnConfirm:fgui.GButton;
	public static URL:string = "ui://flign0g5rch1t";

	public static createInstance():FUI_OuterCityWarDefenceSettingItem {
		return <FUI_OuterCityWarDefenceSettingItem>(fgui.UIPackage.createObject("OuterCityWar", "OuterCityWarDefenceSettingItem"));
	}

	protected onConstruct():void {
		this.cIsPet = this.getController("cIsPet");
		this.cIsDefence = this.getController("cIsDefence");
		this.txtNickName = <fgui.GTextField>(this.getChild("txtNickName"));
		this.txtDefenceBuild = <fgui.GTextField>(this.getChild("txtDefenceBuild"));
		this.imgJob = <fgui.GLoader>(this.getChild("imgJob"));
		this.txtPawn = <fgui.GTextField>(this.getChild("txtPawn"));
		this.txtCapaity = <fgui.GTextField>(this.getChild("txtCapaity"));
		this.gHero = <fgui.GGroup>(this.getChild("gHero"));
		this.txtPetCapaity = <fgui.GTextField>(this.getChild("txtPetCapaity"));
		this.txtPetTotalCapaity = <fgui.GTextField>(this.getChild("txtPetTotalCapaity"));
		this.gPet = <fgui.GGroup>(this.getChild("gPet"));
		this.txtDefenceState = <fgui.GTextField>(this.getChild("txtDefenceState"));
		this.btnConfirm = <fgui.GButton>(this.getChild("btnConfirm"));
	}
}