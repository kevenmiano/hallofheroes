/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RuneBalance extends fgui.GComponent {

	public tipItem1:fgui.GButton;
	public tipItem2:fgui.GButton;
	public txt_rune:fgui.GTextField;
	public giftTxt:fgui.GTextField;
	public static URL:string = "ui://v98hah2ovvezima";

	public static createInstance():FUI_RuneBalance {
		return <FUI_RuneBalance>(fgui.UIPackage.createObject("Skill", "RuneBalance"));
	}

	protected onConstruct():void {
		this.tipItem1 = <fgui.GButton>(this.getChild("tipItem1"));
		this.tipItem2 = <fgui.GButton>(this.getChild("tipItem2"));
		this.txt_rune = <fgui.GTextField>(this.getChild("txt_rune"));
		this.giftTxt = <fgui.GTextField>(this.getChild("giftTxt"));
	}
}