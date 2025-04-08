/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_VSTeamItem extends fgui.GComponent {

	public bg:fgui.GLoader;
	public _resultIcon01:fgui.GLoader;
	public _teamTxt01:fgui.GTextField;
	public _resultIcon02:fgui.GLoader;
	public _teamTxt02:fgui.GTextField;
	public static URL:string = "ui://8w3m5duwwfpbi8u";

	public static createInstance():FUI_VSTeamItem {
		return <FUI_VSTeamItem>(fgui.UIPackage.createObject("Consortia", "VSTeamItem"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GLoader>(this.getChild("bg"));
		this._resultIcon01 = <fgui.GLoader>(this.getChild("_resultIcon01"));
		this._teamTxt01 = <fgui.GTextField>(this.getChild("_teamTxt01"));
		this._resultIcon02 = <fgui.GLoader>(this.getChild("_resultIcon02"));
		this._teamTxt02 = <fgui.GTextField>(this.getChild("_teamTxt02"));
	}
}