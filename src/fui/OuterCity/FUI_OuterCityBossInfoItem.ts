/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_NameLink from "./FUI_NameLink";

export default class FUI_OuterCityBossInfoItem extends fgui.GComponent {

	public bossStatusCtr:fgui.Controller;
	public nameTxt:fgui.GTextField;
	public levelTxt:fgui.GTextField;
	public posLink:FUI_NameLink;
	public leftTimeTxt:fgui.GTextField;
	public statusTxt:fgui.GTextField;
	public attackBtn:fgui.GButton;
	public static URL:string = "ui://xcvl5694pimbmj1q";

	public static createInstance():FUI_OuterCityBossInfoItem {
		return <FUI_OuterCityBossInfoItem>(fgui.UIPackage.createObject("OuterCity", "OuterCityBossInfoItem"));
	}

	protected onConstruct():void {
		this.bossStatusCtr = this.getController("bossStatusCtr");
		this.nameTxt = <fgui.GTextField>(this.getChild("nameTxt"));
		this.levelTxt = <fgui.GTextField>(this.getChild("levelTxt"));
		this.posLink = <FUI_NameLink>(this.getChild("posLink"));
		this.leftTimeTxt = <fgui.GTextField>(this.getChild("leftTimeTxt"));
		this.statusTxt = <fgui.GTextField>(this.getChild("statusTxt"));
		this.attackBtn = <fgui.GButton>(this.getChild("attackBtn"));
	}
}