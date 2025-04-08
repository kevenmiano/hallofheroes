// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutyardMemberSecondItem extends fgui.GComponent {

	public bg:fgui.GImage;
	public jobIcon:fgui.GLoader;
	public userNameTxt:fgui.GTextField;
	public fightValueTxt:fgui.GTextField;
	public addPrecentTxt2:fgui.GTextField;
	public addPrecentTxt:fgui.GTextField;
	public changeBtn:fgui.GButton;
	public indexIcon:fgui.GLoader;
	public countValueTxt:fgui.GTextField;
	public static URL:string = "ui://w1giibvbncygp";

	public static createInstance():FUI_OutyardMemberSecondItem {
		return <FUI_OutyardMemberSecondItem>(fgui.UIPackage.createObject("OutYard", "OutyardMemberSecondItem"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.jobIcon = <fgui.GLoader>(this.getChild("jobIcon"));
		this.userNameTxt = <fgui.GTextField>(this.getChild("userNameTxt"));
		this.fightValueTxt = <fgui.GTextField>(this.getChild("fightValueTxt"));
		this.addPrecentTxt2 = <fgui.GTextField>(this.getChild("addPrecentTxt2"));
		this.addPrecentTxt = <fgui.GTextField>(this.getChild("addPrecentTxt"));
		this.changeBtn = <fgui.GButton>(this.getChild("changeBtn"));
		this.indexIcon = <fgui.GLoader>(this.getChild("indexIcon"));
		this.countValueTxt = <fgui.GTextField>(this.getChild("countValueTxt"));
	}
}