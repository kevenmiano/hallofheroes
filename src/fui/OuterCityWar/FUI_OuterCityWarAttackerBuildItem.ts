/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OuterCityWarAttackerBuildItem extends fgui.GComponent {

	public cJob:fgui.Controller;
	public imgBg:fgui.GImage;
	public imgJob:fgui.GLoader;
	public txtNickName:fgui.GTextField;
	public txtGrade:fgui.GTextField;
	public txtCapaity:fgui.GTextField;
	public txtDefenceForce:fgui.GTextField;
	public txtState:fgui.GTextField;
	public imgJob1:fgui.GImage;
	public imgJob2:fgui.GImage;
	public imgJob3:fgui.GImage;
	public static URL:string = "ui://flign0g5rch115";

	public static createInstance():FUI_OuterCityWarAttackerBuildItem {
		return <FUI_OuterCityWarAttackerBuildItem>(fgui.UIPackage.createObject("OuterCityWar", "OuterCityWarAttackerBuildItem"));
	}

	protected onConstruct():void {
		this.cJob = this.getController("cJob");
		this.imgBg = <fgui.GImage>(this.getChild("imgBg"));
		this.imgJob = <fgui.GLoader>(this.getChild("imgJob"));
		this.txtNickName = <fgui.GTextField>(this.getChild("txtNickName"));
		this.txtGrade = <fgui.GTextField>(this.getChild("txtGrade"));
		this.txtCapaity = <fgui.GTextField>(this.getChild("txtCapaity"));
		this.txtDefenceForce = <fgui.GTextField>(this.getChild("txtDefenceForce"));
		this.txtState = <fgui.GTextField>(this.getChild("txtState"));
		this.imgJob1 = <fgui.GImage>(this.getChild("imgJob1"));
		this.imgJob2 = <fgui.GImage>(this.getChild("imgJob2"));
		this.imgJob3 = <fgui.GImage>(this.getChild("imgJob3"));
	}
}