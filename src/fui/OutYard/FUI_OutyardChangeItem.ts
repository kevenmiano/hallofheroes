// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutyardChangeItem extends fgui.GComponent {

	public bg:fgui.GImage;
	public jobIcon:fgui.GLoader;
	public userNameTxt:fgui.GTextField;
	public levelTxt:fgui.GTextField;
	public fightValueTxt:fgui.GTextField;
	public selecteBtn:fgui.GButton;
	public static URL:string = "ui://w1giibvbncygm";

	public static createInstance():FUI_OutyardChangeItem {
		return <FUI_OutyardChangeItem>(fgui.UIPackage.createObject("OutYard", "OutyardChangeItem"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.jobIcon = <fgui.GLoader>(this.getChild("jobIcon"));
		this.userNameTxt = <fgui.GTextField>(this.getChild("userNameTxt"));
		this.levelTxt = <fgui.GTextField>(this.getChild("levelTxt"));
		this.fightValueTxt = <fgui.GTextField>(this.getChild("fightValueTxt"));
		this.selecteBtn = <fgui.GButton>(this.getChild("selecteBtn"));
	}
}