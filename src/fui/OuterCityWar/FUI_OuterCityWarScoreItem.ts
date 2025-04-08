// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OuterCityWarScoreItem extends fgui.GComponent {

	public cIsMonster:fgui.Controller;
	public txtName:fgui.GTextField;
	public imgScore:fgui.GImage;
	public txtScore:fgui.GTextField;
	public maincontainer:fgui.GGroup;
	public static URL:string = "ui://flign0g5rch1r";

	public static createInstance():FUI_OuterCityWarScoreItem {
		return <FUI_OuterCityWarScoreItem>(fgui.UIPackage.createObject("OuterCityWar", "OuterCityWarScoreItem"));
	}

	protected onConstruct():void {
		this.cIsMonster = this.getController("cIsMonster");
		this.txtName = <fgui.GTextField>(this.getChild("txtName"));
		this.imgScore = <fgui.GImage>(this.getChild("imgScore"));
		this.txtScore = <fgui.GTextField>(this.getChild("txtScore"));
		this.maincontainer = <fgui.GGroup>(this.getChild("maincontainer"));
	}
}