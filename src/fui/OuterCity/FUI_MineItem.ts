// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MineItem extends fgui.GComponent {

	public occupyCtr:fgui.Controller;
	public selectedCtr:fgui.Controller;
	public iconLoader:fgui.GLoader;
	public nameTxt:fgui.GTextField;
	public resourceTxt:fgui.GTextField;
	public countTxt:fgui.GTextField;
	public static URL:string = "ui://xcvl5694fuyfmiwx";

	public static createInstance():FUI_MineItem {
		return <FUI_MineItem>(fgui.UIPackage.createObject("OuterCity", "MineItem"));
	}

	protected onConstruct():void {
		this.occupyCtr = this.getController("occupyCtr");
		this.selectedCtr = this.getController("selectedCtr");
		this.iconLoader = <fgui.GLoader>(this.getChild("iconLoader"));
		this.nameTxt = <fgui.GTextField>(this.getChild("nameTxt"));
		this.resourceTxt = <fgui.GTextField>(this.getChild("resourceTxt"));
		this.countTxt = <fgui.GTextField>(this.getChild("countTxt"));
	}
}