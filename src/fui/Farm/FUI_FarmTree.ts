/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BtnFarmOpt from "./FUI_BtnFarmOpt";

export default class FUI_FarmTree extends fgui.GComponent {

	public imgTree:fgui.GLoader;
	public mcTree:fgui.GMovieClip;
	public btnTipOpt:FUI_BtnFarmOpt;
	public progTranstion:fgui.GProgressBar;
	public img_timebg:fgui.GImage;
	public txtCountDown:fgui.GTextField;
	public txtGetMsg:fgui.GTextField;
	public txtProgTranstion:fgui.GTextField;
	public imgBg:fgui.GImage;
	public progShow:fgui.GProgressBar;
	public btnCurProg:fgui.GButton;
	public txtProgress:fgui.GTextField;
	public static URL:string = "ui://rcqiz171sxpsfmi5a";

	public static createInstance():FUI_FarmTree {
		return <FUI_FarmTree>(fgui.UIPackage.createObject("Farm", "FarmTree"));
	}

	protected onConstruct():void {
		this.imgTree = <fgui.GLoader>(this.getChild("imgTree"));
		this.mcTree = <fgui.GMovieClip>(this.getChild("mcTree"));
		this.btnTipOpt = <FUI_BtnFarmOpt>(this.getChild("btnTipOpt"));
		this.progTranstion = <fgui.GProgressBar>(this.getChild("progTranstion"));
		this.img_timebg = <fgui.GImage>(this.getChild("img_timebg"));
		this.txtCountDown = <fgui.GTextField>(this.getChild("txtCountDown"));
		this.txtGetMsg = <fgui.GTextField>(this.getChild("txtGetMsg"));
		this.txtProgTranstion = <fgui.GTextField>(this.getChild("txtProgTranstion"));
		this.imgBg = <fgui.GImage>(this.getChild("imgBg"));
		this.progShow = <fgui.GProgressBar>(this.getChild("progShow"));
		this.btnCurProg = <fgui.GButton>(this.getChild("btnCurProg"));
		this.txtProgress = <fgui.GTextField>(this.getChild("txtProgress"));
	}
}