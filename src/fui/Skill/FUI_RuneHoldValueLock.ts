/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneHoldValueLock extends fgui.GButton {

	public cbg:fgui.GImage;
	public bar:fgui.GImage;
	public lockImg:fgui.GImage;
	public expTxt:fgui.GTextField;
	public static URL:string = "ui://v98hah2olin8ipi";

	public static createInstance():FUI_RuneHoldValueLock {
		return <FUI_RuneHoldValueLock>(fgui.UIPackage.createObject("Skill", "RuneHoldValueLock"));
	}

	protected onConstruct():void {
		this.cbg = <fgui.GImage>(this.getChild("cbg"));
		this.bar = <fgui.GImage>(this.getChild("bar"));
		this.lockImg = <fgui.GImage>(this.getChild("lockImg"));
		this.expTxt = <fgui.GTextField>(this.getChild("expTxt"));
	}
}