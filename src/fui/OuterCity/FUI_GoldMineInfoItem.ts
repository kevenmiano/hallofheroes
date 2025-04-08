/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_NameLink from "./FUI_NameLink";

export default class FUI_GoldMineInfoItem extends fgui.GComponent {

	public isself:fgui.Controller;
	public goldNameTxt:fgui.GTextField;
	public userNameTxt:fgui.GTextField;
	public attackBtn:fgui.GButton;
	public giveUpLink:FUI_NameLink;
	public static URL:string = "ui://xcvl5694fuyfmiwt";

	public static createInstance():FUI_GoldMineInfoItem {
		return <FUI_GoldMineInfoItem>(fgui.UIPackage.createObject("OuterCity", "GoldMineInfoItem"));
	}

	protected onConstruct():void {
		this.isself = this.getController("isself");
		this.goldNameTxt = <fgui.GTextField>(this.getChild("goldNameTxt"));
		this.userNameTxt = <fgui.GTextField>(this.getChild("userNameTxt"));
		this.attackBtn = <fgui.GButton>(this.getChild("attackBtn"));
		this.giveUpLink = <FUI_NameLink>(this.getChild("giveUpLink"));
	}
}