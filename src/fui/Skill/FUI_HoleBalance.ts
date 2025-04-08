/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_HoleBalance extends fgui.GComponent {

	public tipItem1:fgui.GButton;
	public giftTxt:fgui.GTextField;
	public tipItem2:fgui.GButton;
	public txt_rune:fgui.GTextField;
	public static URL:string = "ui://v98hah2oo4iwipq";

	public static createInstance():FUI_HoleBalance {
		return <FUI_HoleBalance>(fgui.UIPackage.createObject("Skill", "HoleBalance"));
	}

	protected onConstruct():void {
		this.tipItem1 = <fgui.GButton>(this.getChild("tipItem1"));
		this.giftTxt = <fgui.GTextField>(this.getChild("giftTxt"));
		this.tipItem2 = <fgui.GButton>(this.getChild("tipItem2"));
		this.txt_rune = <fgui.GTextField>(this.getChild("txt_rune"));
	}
}