/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaTaskScoreItem extends fgui.GButton {

	public effect:fgui.Controller;
	public txtCount:fgui.GTextField;
	public static URL:string = "ui://8w3m5duwmhrtidq";

	public static createInstance():FUI_ConsortiaTaskScoreItem {
		return <FUI_ConsortiaTaskScoreItem>(fgui.UIPackage.createObject("Consortia", "ConsortiaTaskScoreItem"));
	}

	protected onConstruct():void {
		this.effect = this.getController("effect");
		this.txtCount = <fgui.GTextField>(this.getChild("txtCount"));
	}
}