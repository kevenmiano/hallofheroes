/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_StoreBagCell extends fgui.GButton {

	public cSelectState:fgui.Controller;
	public cDark:fgui.Controller;
	public item:FUI_BaseItem;
	public stopper:fgui.GGraph;
	public heroEquipIcon:fgui.GImage;
	public static URL:string = "ui://og5jeos3tbczi5l";

	public static createInstance():FUI_StoreBagCell {
		return <FUI_StoreBagCell>(fgui.UIPackage.createObject("Base", "StoreBagCell"));
	}

	protected onConstruct():void {
		this.cSelectState = this.getController("cSelectState");
		this.cDark = this.getController("cDark");
		this.item = <FUI_BaseItem>(this.getChild("item"));
		this.stopper = <fgui.GGraph>(this.getChild("stopper"));
		this.heroEquipIcon = <fgui.GImage>(this.getChild("heroEquipIcon"));
	}
}