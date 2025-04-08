/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_item from "./FUI_item";

export default class FUI_SAppellCellItem extends fgui.GButton {

	public c1:fgui.Controller;
	public bg:FUI_item;
	public Btn_Equipon:fgui.GButton;
	public Btn_Equipoff:fgui.GButton;
	public static URL:string = "ui://6fvk31suh5mpig9";

	public static createInstance():FUI_SAppellCellItem {
		return <FUI_SAppellCellItem>(fgui.UIPackage.createObject("SBag", "SAppellCellItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.bg = <FUI_item>(this.getChild("bg"));
		this.Btn_Equipon = <fgui.GButton>(this.getChild("Btn_Equipon"));
		this.Btn_Equipoff = <fgui.GButton>(this.getChild("Btn_Equipoff"));
	}
}