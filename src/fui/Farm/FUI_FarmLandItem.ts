/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BtnFarmOpt from "./FUI_BtnFarmOpt";

export default class FUI_FarmLandItem extends fgui.GComponent {

	public cOpen:fgui.Controller;
	public cNextOpen:fgui.Controller;
	public imgUnOpen:fgui.GImage;
	public imgDef:fgui.GImage;
	public imgGrass2:fgui.GImage;
	public imgSelected:fgui.GImage;
	public imgCrop:fgui.GLoader;
	public mcMature:fgui.GMovieClip;
	public gLand:fgui.GGroup;
	public btnLandOpt:FUI_BtnFarmOpt;
	public btnClickItem:fgui.GLoader;
	public txtGetMsg:fgui.GTextField;
	public t0:fgui.Transition;
	public static URL:string = "ui://rcqiz171cju829";

	public static createInstance():FUI_FarmLandItem {
		return <FUI_FarmLandItem>(fgui.UIPackage.createObject("Farm", "FarmLandItem"));
	}

	protected onConstruct():void {
		this.cOpen = this.getController("cOpen");
		this.cNextOpen = this.getController("cNextOpen");
		this.imgUnOpen = <fgui.GImage>(this.getChild("imgUnOpen"));
		this.imgDef = <fgui.GImage>(this.getChild("imgDef"));
		this.imgGrass2 = <fgui.GImage>(this.getChild("imgGrass2"));
		this.imgSelected = <fgui.GImage>(this.getChild("imgSelected"));
		this.imgCrop = <fgui.GLoader>(this.getChild("imgCrop"));
		this.mcMature = <fgui.GMovieClip>(this.getChild("mcMature"));
		this.gLand = <fgui.GGroup>(this.getChild("gLand"));
		this.btnLandOpt = <FUI_BtnFarmOpt>(this.getChild("btnLandOpt"));
		this.btnClickItem = <fgui.GLoader>(this.getChild("btnClickItem"));
		this.txtGetMsg = <fgui.GTextField>(this.getChild("txtGetMsg"));
		this.t0 = this.getTransition("t0");
	}
}