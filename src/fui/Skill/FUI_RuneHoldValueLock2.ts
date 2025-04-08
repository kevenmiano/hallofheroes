// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneHoldValueLock2 extends fgui.GButton {

	public cb:fgui.GImage;
	public cbs:fgui.GImage;
	public crs:fgui.GImage;
	public bar:fgui.GImage;
	public lockImg:fgui.GImage;
	public expTxt:fgui.GTextField;
	public static URL:string = "ui://v98hah2olin8imr";

	public static createInstance():FUI_RuneHoldValueLock2 {
		return <FUI_RuneHoldValueLock2>(fgui.UIPackage.createObject("Skill", "RuneHoldValueLock2"));
	}

	protected onConstruct():void {
		this.cb = <fgui.GImage>(this.getChild("cb"));
		this.cbs = <fgui.GImage>(this.getChild("cbs"));
		this.crs = <fgui.GImage>(this.getChild("crs"));
		this.bar = <fgui.GImage>(this.getChild("bar"));
		this.lockImg = <fgui.GImage>(this.getChild("lockImg"));
		this.expTxt = <fgui.GTextField>(this.getChild("expTxt"));
	}
}