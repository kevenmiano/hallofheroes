/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneHoldEffectLock extends fgui.GButton {

	public cbg:fgui.GImage;
	public skillIcon:fgui.GLoader;
	public profile:fgui.GLoader;
	public lockImg:fgui.GImage;
	public static URL:string = "ui://v98hah2olin8imq";

	public static createInstance():FUI_RuneHoldEffectLock {
		return <FUI_RuneHoldEffectLock>(fgui.UIPackage.createObject("Skill", "RuneHoldEffectLock"));
	}

	protected onConstruct():void {
		this.cbg = <fgui.GImage>(this.getChild("cbg"));
		this.skillIcon = <fgui.GLoader>(this.getChild("skillIcon"));
		this.profile = <fgui.GLoader>(this.getChild("profile"));
		this.lockImg = <fgui.GImage>(this.getChild("lockImg"));
	}
}