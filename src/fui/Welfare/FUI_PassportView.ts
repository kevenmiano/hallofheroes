/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_PassRewardCom from "./FUI_PassRewardCom";

export default class FUI_PassportView extends fgui.GComponent {

	public c1:fgui.Controller;
	public c2:fgui.Controller;
	public Img_Banner_HeroToken:fgui.GImage;
	public expbar:fgui.GProgressBar;
	public Icon_HeroToken:fgui.GImage;
	public btn_buy:fgui.GButton;
	public txt0:fgui.GTextField;
	public txt_explv:fgui.GRichTextField;
	public txt_exp:fgui.GTextField;
	public dot:fgui.GImage;
	public txt1:fgui.GTextField;
	public txt_discount:fgui.GTextField;
	public txt2:fgui.GTextField;
	public txt_tip:fgui.GRichTextField;
	public reward_com:FUI_PassRewardCom;
	public taskList:fgui.GList;
	public txt_left:fgui.GTextField;
	public txt_left_time:fgui.GTextField;
	public btn_refresh:fgui.GButton;
	public btn_claim:fgui.GButton;
	public tab0:fgui.GList;
	public txt8:fgui.GTextField;
	public static URL:string = "ui://vw2db6botdr4i8j";

	public static createInstance():FUI_PassportView {
		return <FUI_PassportView>(fgui.UIPackage.createObject("Welfare", "PassportView"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.Img_Banner_HeroToken = <fgui.GImage>(this.getChild("Img_Banner_HeroToken"));
		this.expbar = <fgui.GProgressBar>(this.getChild("expbar"));
		this.Icon_HeroToken = <fgui.GImage>(this.getChild("Icon_HeroToken"));
		this.btn_buy = <fgui.GButton>(this.getChild("btn_buy"));
		this.txt0 = <fgui.GTextField>(this.getChild("txt0"));
		this.txt_explv = <fgui.GRichTextField>(this.getChild("txt_explv"));
		this.txt_exp = <fgui.GTextField>(this.getChild("txt_exp"));
		this.dot = <fgui.GImage>(this.getChild("dot"));
		this.txt1 = <fgui.GTextField>(this.getChild("txt1"));
		this.txt_discount = <fgui.GTextField>(this.getChild("txt_discount"));
		this.txt2 = <fgui.GTextField>(this.getChild("txt2"));
		this.txt_tip = <fgui.GRichTextField>(this.getChild("txt_tip"));
		this.reward_com = <FUI_PassRewardCom>(this.getChild("reward_com"));
		this.taskList = <fgui.GList>(this.getChild("taskList"));
		this.txt_left = <fgui.GTextField>(this.getChild("txt_left"));
		this.txt_left_time = <fgui.GTextField>(this.getChild("txt_left_time"));
		this.btn_refresh = <fgui.GButton>(this.getChild("btn_refresh"));
		this.btn_claim = <fgui.GButton>(this.getChild("btn_claim"));
		this.tab0 = <fgui.GList>(this.getChild("tab0"));
		this.txt8 = <fgui.GTextField>(this.getChild("txt8"));
	}
}