// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_SoulIemBase from "./FUI_SoulIemBase";

export default class FUI_WildSoulItem extends fgui.GComponent {

	public baseItem:FUI_SoulIemBase;
	public activeBtn:fgui.GButton;
	public changeBtn:fgui.GButton;
	public restBtn:fgui.GButton;
	public mountBtn:fgui.GButton;
	public lianHuaBtn:fgui.GButton;
	public lookViewBtn:fgui.GButton;
	public optionBtns:fgui.GGroup;
	public static URL:string = "ui://b2almfghffix6";

	public static createInstance():FUI_WildSoulItem {
		return <FUI_WildSoulItem>(fgui.UIPackage.createObject("Mount", "WildSoulItem"));
	}

	protected onConstruct():void {
		this.baseItem = <FUI_SoulIemBase>(this.getChild("baseItem"));
		this.activeBtn = <fgui.GButton>(this.getChild("activeBtn"));
		this.changeBtn = <fgui.GButton>(this.getChild("changeBtn"));
		this.restBtn = <fgui.GButton>(this.getChild("restBtn"));
		this.mountBtn = <fgui.GButton>(this.getChild("mountBtn"));
		this.lianHuaBtn = <fgui.GButton>(this.getChild("lianHuaBtn"));
		this.lookViewBtn = <fgui.GButton>(this.getChild("lookViewBtn"));
		this.optionBtns = <fgui.GGroup>(this.getChild("optionBtns"));
	}
}