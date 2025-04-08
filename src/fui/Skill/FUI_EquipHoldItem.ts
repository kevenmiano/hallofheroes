/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RuneHoldRuneItem2 from "./FUI_RuneHoldRuneItem2";

export default class FUI_EquipHoldItem extends fgui.GButton {

	public mbg:fgui.GImage;
	public lineImg:fgui.GImage;
	public selImg:fgui.GImage;
	public runeItem:FUI_RuneHoldRuneItem2;
	public runeName:fgui.GTextField;
	public addDesc:fgui.GTextField;
	public lockedTip:fgui.GTextField;
	public static URL:string = "ui://v98hah2olin8ipk";

	public static createInstance():FUI_EquipHoldItem {
		return <FUI_EquipHoldItem>(fgui.UIPackage.createObject("Skill", "EquipHoldItem"));
	}

	protected onConstruct():void {
		this.mbg = <fgui.GImage>(this.getChild("mbg"));
		this.lineImg = <fgui.GImage>(this.getChild("lineImg"));
		this.selImg = <fgui.GImage>(this.getChild("selImg"));
		this.runeItem = <FUI_RuneHoldRuneItem2>(this.getChild("runeItem"));
		this.runeName = <fgui.GTextField>(this.getChild("runeName"));
		this.addDesc = <fgui.GTextField>(this.getChild("addDesc"));
		this.lockedTip = <fgui.GTextField>(this.getChild("lockedTip"));
	}
}