// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_Runes_Panel extends fgui.GComponent {

	public isOversea:fgui.Controller;
	public runesList:fgui.GList;
	public tipTxt:fgui.GTextField;
	public equipRunes:fgui.GList;
	public btn_set:fgui.GButton;
	public static URL:string = "ui://v98hah2obwl5k";

	public static createInstance():FUI_Runes_Panel {
		return <FUI_Runes_Panel>(fgui.UIPackage.createObject("Skill", "Runes_Panel"));
	}

	protected onConstruct():void {
		this.isOversea = this.getController("isOversea");
		this.runesList = <fgui.GList>(this.getChild("runesList"));
		this.tipTxt = <fgui.GTextField>(this.getChild("tipTxt"));
		this.equipRunes = <fgui.GList>(this.getChild("equipRunes"));
		this.btn_set = <fgui.GButton>(this.getChild("btn_set"));
	}
}