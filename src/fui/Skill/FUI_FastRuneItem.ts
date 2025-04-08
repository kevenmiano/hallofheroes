/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RunesItem from "./FUI_RunesItem";

export default class FUI_FastRuneItem extends fgui.GComponent {

	public indexTxt:fgui.GTextField;
	public item:FUI_RunesItem;
	public lock:fgui.GImage;
	public static URL:string = "ui://v98hah2ooicxr3";

	public static createInstance():FUI_FastRuneItem {
		return <FUI_FastRuneItem>(fgui.UIPackage.createObject("Skill", "FastRuneItem"));
	}

	protected onConstruct():void {
		this.indexTxt = <fgui.GTextField>(this.getChild("indexTxt"));
		this.item = <FUI_RunesItem>(this.getChild("item"));
		this.lock = <fgui.GImage>(this.getChild("lock"));
	}
}