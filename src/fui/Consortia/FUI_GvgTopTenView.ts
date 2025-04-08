/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GvgTopTenView extends fgui.GComponent {

	public c1:fgui.Controller;
	public _rewardTxt02:fgui.GTextField;
	public list:fgui.GList;
	public _inWarNumTxt:fgui.GTextField;
	public _rewardTxt01:fgui.GTextField;
	public _contributionTxt:fgui.GTextField;
	public static URL:string = "ui://8w3m5duwpdrqi9j";

	public static createInstance():FUI_GvgTopTenView {
		return <FUI_GvgTopTenView>(fgui.UIPackage.createObject("Consortia", "GvgTopTenView"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this._rewardTxt02 = <fgui.GTextField>(this.getChild("_rewardTxt02"));
		this.list = <fgui.GList>(this.getChild("list"));
		this._inWarNumTxt = <fgui.GTextField>(this.getChild("_inWarNumTxt"));
		this._rewardTxt01 = <fgui.GTextField>(this.getChild("_rewardTxt01"));
		this._contributionTxt = <fgui.GTextField>(this.getChild("_contributionTxt"));
	}
}