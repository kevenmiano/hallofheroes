/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneHoldRuneItem extends fgui.GButton {

	public cbg:fgui.GImage;
	public runeIcon:fgui.GLoader;
	public plusImg:fgui.GImage;
	public lockImg:fgui.GImage;
	public static URL:string = "ui://v98hah2olin8imo";

	public static createInstance():FUI_RuneHoldRuneItem {
		return <FUI_RuneHoldRuneItem>(fgui.UIPackage.createObject("Skill", "RuneHoldRuneItem"));
	}

	protected onConstruct():void {
		this.cbg = <fgui.GImage>(this.getChild("cbg"));
		this.runeIcon = <fgui.GLoader>(this.getChild("runeIcon"));
		this.plusImg = <fgui.GImage>(this.getChild("plusImg"));
		this.lockImg = <fgui.GImage>(this.getChild("lockImg"));
	}
}