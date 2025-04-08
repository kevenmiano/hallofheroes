/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OuterCityWarBuildSiteItem extends fgui.GComponent {

	public cIsPet:fgui.Controller;
	public cOptState:fgui.Controller;
	public txtNickName:fgui.GTextField;
	public txtPetTotalCapaity:fgui.GTextField;
	public petItem1:fgui.GComponent;
	public petItem2:fgui.GComponent;
	public petItem3:fgui.GComponent;
	public gPet:fgui.GGroup;
	public imgJob:fgui.GLoader;
	public txtPawn:fgui.GTextField;
	public txtCapaity:fgui.GTextField;
	public gHero:fgui.GGroup;
	public txtDefenceForce:fgui.GTextField;
	public txtGuild:fgui.GTextField;
	public imgScore:fgui.GImage;
	public txtOccupyScore:fgui.GTextField;
	public txtOptState0:fgui.GTextField;
	public txtOptState3:fgui.GTextField;
	public btnSettingDefance:fgui.GButton;
	public btnAttack:fgui.GButton;
	public btnGiveUp:fgui.GButton;
	public btnOccupy:fgui.GButton;
	public txtOptState6:fgui.GTextField;
	public static URL:string = "ui://flign0g5rch1u";

	public static createInstance():FUI_OuterCityWarBuildSiteItem {
		return <FUI_OuterCityWarBuildSiteItem>(fgui.UIPackage.createObject("OuterCityWar", "OuterCityWarBuildSiteItem"));
	}

	protected onConstruct():void {
		this.cIsPet = this.getController("cIsPet");
		this.cOptState = this.getController("cOptState");
		this.txtNickName = <fgui.GTextField>(this.getChild("txtNickName"));
		this.txtPetTotalCapaity = <fgui.GTextField>(this.getChild("txtPetTotalCapaity"));
		this.petItem1 = <fgui.GComponent>(this.getChild("petItem1"));
		this.petItem2 = <fgui.GComponent>(this.getChild("petItem2"));
		this.petItem3 = <fgui.GComponent>(this.getChild("petItem3"));
		this.gPet = <fgui.GGroup>(this.getChild("gPet"));
		this.imgJob = <fgui.GLoader>(this.getChild("imgJob"));
		this.txtPawn = <fgui.GTextField>(this.getChild("txtPawn"));
		this.txtCapaity = <fgui.GTextField>(this.getChild("txtCapaity"));
		this.gHero = <fgui.GGroup>(this.getChild("gHero"));
		this.txtDefenceForce = <fgui.GTextField>(this.getChild("txtDefenceForce"));
		this.txtGuild = <fgui.GTextField>(this.getChild("txtGuild"));
		this.imgScore = <fgui.GImage>(this.getChild("imgScore"));
		this.txtOccupyScore = <fgui.GTextField>(this.getChild("txtOccupyScore"));
		this.txtOptState0 = <fgui.GTextField>(this.getChild("txtOptState0"));
		this.txtOptState3 = <fgui.GTextField>(this.getChild("txtOptState3"));
		this.btnSettingDefance = <fgui.GButton>(this.getChild("btnSettingDefance"));
		this.btnAttack = <fgui.GButton>(this.getChild("btnAttack"));
		this.btnGiveUp = <fgui.GButton>(this.getChild("btnGiveUp"));
		this.btnOccupy = <fgui.GButton>(this.getChild("btnOccupy"));
		this.txtOptState6 = <fgui.GTextField>(this.getChild("txtOptState6"));
	}
}