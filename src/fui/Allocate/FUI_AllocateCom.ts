/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AllocateCom extends fgui.GButton {

	public soliderIcon:fgui.GLoader;
	public countTxt:fgui.GTextField;
	public static URL:string = "ui://u5b8u6g0ibp0m";

	public static createInstance():FUI_AllocateCom {
		return <FUI_AllocateCom>(fgui.UIPackage.createObject("Allocate", "AllocateCom"));
	}

	protected onConstruct():void {
		this.soliderIcon = <fgui.GLoader>(this.getChild("soliderIcon"));
		this.countTxt = <fgui.GTextField>(this.getChild("countTxt"));
	}
}