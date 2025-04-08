/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BaseItem from "./FUI_BaseItem";

export default class FUI_RewardItem extends fgui.GComponent {

	public effectController:fgui.Controller;
	public item:FUI_BaseItem;
	public effect:fgui.GMovieClip;
	public static URL:string = "ui://og5jeos3xbyy10psp2w";

	public static createInstance():FUI_RewardItem {
		return <FUI_RewardItem>(fgui.UIPackage.createObject("Base", "RewardItem"));
	}

	protected onConstruct():void {
		this.effectController = this.getController("effectController");
		this.item = <FUI_BaseItem>(this.getChild("item"));
		this.effect = <fgui.GMovieClip>(this.getChild("effect"));
	}
}