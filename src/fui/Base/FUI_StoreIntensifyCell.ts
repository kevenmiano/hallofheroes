/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_StoreIntensifyCell extends fgui.GButton {

	public item:FUI_BaseItem;
	public iconTick:fgui.GLoader;
	public activeBack:fgui.GMovieClip;
	public static URL:string = "ui://og5jeos3tbczi5m";

	public static createInstance():FUI_StoreIntensifyCell {
		return <FUI_StoreIntensifyCell>(fgui.UIPackage.createObject("Base", "StoreIntensifyCell"));
	}

	protected onConstruct():void {
		this.item = <FUI_BaseItem>(this.getChild("item"));
		this.iconTick = <fgui.GLoader>(this.getChild("iconTick"));
		this.activeBack = <fgui.GMovieClip>(this.getChild("activeBack"));
	}
}