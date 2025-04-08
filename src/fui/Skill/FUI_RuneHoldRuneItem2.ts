/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneHoldRuneItem2 extends fgui.GButton {

	public cb:fgui.GImage;
	public runeIcon:fgui.GLoader;
	public pb:fgui.GImage;
	public plusImg:fgui.GImage;
	public pulsFlag:fgui.GGroup;
	public lockImg:fgui.GImage;
	public selImg:fgui.GImage;
	public lvbg:fgui.GImage;
	public levelTxt:fgui.GTextField;
	public levelFlag:fgui.GGroup;
	public static URL:string = "ui://v98hah2olin8imp";

	public static createInstance():FUI_RuneHoldRuneItem2 {
		return <FUI_RuneHoldRuneItem2>(fgui.UIPackage.createObject("Skill", "RuneHoldRuneItem2"));
	}

	protected onConstruct():void {
		this.cb = <fgui.GImage>(this.getChild("cb"));
		this.runeIcon = <fgui.GLoader>(this.getChild("runeIcon"));
		this.pb = <fgui.GImage>(this.getChild("pb"));
		this.plusImg = <fgui.GImage>(this.getChild("plusImg"));
		this.pulsFlag = <fgui.GGroup>(this.getChild("pulsFlag"));
		this.lockImg = <fgui.GImage>(this.getChild("lockImg"));
		this.selImg = <fgui.GImage>(this.getChild("selImg"));
		this.lvbg = <fgui.GImage>(this.getChild("lvbg"));
		this.levelTxt = <fgui.GTextField>(this.getChild("levelTxt"));
		this.levelFlag = <fgui.GGroup>(this.getChild("levelFlag"));
	}
}