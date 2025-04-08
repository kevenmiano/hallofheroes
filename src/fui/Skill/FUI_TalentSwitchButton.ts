/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TalentSwitchButton extends fgui.GButton {

	public bg:fgui.GImage;
	public selectedImg:fgui.GImage;
	public lockImg:fgui.GImage;
	public static URL:string = "ui://v98hah2orjhpiq1";

	public static createInstance():FUI_TalentSwitchButton {
		return <FUI_TalentSwitchButton>(fgui.UIPackage.createObject("Skill", "TalentSwitchButton"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.selectedImg = <fgui.GImage>(this.getChild("selectedImg"));
		this.lockImg = <fgui.GImage>(this.getChild("lockImg"));
	}
}