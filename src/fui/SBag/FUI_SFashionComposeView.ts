// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_SFashionBag from "./FUI_SFashionBag";

export default class FUI_SFashionComposeView extends fgui.GComponent {

	public bag:FUI_SFashionBag;
	public swallow:fgui.GImage;
	public btn_compose:fgui.GButton;
	public item_0:fgui.GButton;
	public btn_detail:fgui.GButton;
	public barbg:fgui.GImage;
	public progressBar2:fgui.GImage;
	public progressBar:fgui.GImage;
	public progressTxt:fgui.GTextField;
	public levelTxt:fgui.GTextField;
	public nextLevelTxt:fgui.GTextField;
	public _progressAddTxt:fgui.GTextField;
	public t0:fgui.Transition;
	public static URL:string = "ui://6fvk31suqvnohicl";

	public static createInstance():FUI_SFashionComposeView {
		return <FUI_SFashionComposeView>(fgui.UIPackage.createObject("SBag", "SFashionComposeView"));
	}

	protected onConstruct():void {
		this.bag = <FUI_SFashionBag>(this.getChild("bag"));
		this.swallow = <fgui.GImage>(this.getChild("swallow"));
		this.btn_compose = <fgui.GButton>(this.getChild("btn_compose"));
		this.item_0 = <fgui.GButton>(this.getChild("item_0"));
		this.btn_detail = <fgui.GButton>(this.getChild("btn_detail"));
		this.barbg = <fgui.GImage>(this.getChild("barbg"));
		this.progressBar2 = <fgui.GImage>(this.getChild("progressBar2"));
		this.progressBar = <fgui.GImage>(this.getChild("progressBar"));
		this.progressTxt = <fgui.GTextField>(this.getChild("progressTxt"));
		this.levelTxt = <fgui.GTextField>(this.getChild("levelTxt"));
		this.nextLevelTxt = <fgui.GTextField>(this.getChild("nextLevelTxt"));
		this._progressAddTxt = <fgui.GTextField>(this.getChild("_progressAddTxt"));
		this.t0 = this.getTransition("t0");
	}
}