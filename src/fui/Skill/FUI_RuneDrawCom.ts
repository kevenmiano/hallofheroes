// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_Btn_Draw from "./FUI_Btn_Draw";
import FUI_maskcom from "./FUI_maskcom";
import FUI_PropTip from "./FUI_PropTip";
import FUI_RewardTip from "./FUI_RewardTip";
import FUI_Btn_L3 from "./FUI_Btn_L3";

export default class FUI_RuneDrawCom extends fgui.GComponent {

	public c1:fgui.Controller;
	public btn_ten:FUI_Btn_Draw;
	public btn_buy:fgui.GButton;
	public txt_energy1:fgui.GTextField;
	public tipItem:fgui.GButton;
	public txt_time:fgui.GTextField;
	public item:fgui.GButton;
	public ball_pro:FUI_maskcom;
	public txt_val:fgui.GRichTextField;
	public img_fragment:fgui.GImage;
	public btn_help:fgui.GButton;
	public click_rect:fgui.GGraph;
	public btn_start:FUI_Btn_Draw;
	public propTip:FUI_PropTip;
	public rewardTip:FUI_RewardTip;
	public btn_bag:FUI_Btn_L3;
	public static URL:string = "ui://v98hah2os7q5sf";

	public static createInstance():FUI_RuneDrawCom {
		return <FUI_RuneDrawCom>(fgui.UIPackage.createObject("Skill", "RuneDrawCom"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.btn_ten = <FUI_Btn_Draw>(this.getChild("btn_ten"));
		this.btn_buy = <fgui.GButton>(this.getChild("btn_buy"));
		this.txt_energy1 = <fgui.GTextField>(this.getChild("txt_energy1"));
		this.tipItem = <fgui.GButton>(this.getChild("tipItem"));
		this.txt_time = <fgui.GTextField>(this.getChild("txt_time"));
		this.item = <fgui.GButton>(this.getChild("item"));
		this.ball_pro = <FUI_maskcom>(this.getChild("ball_pro"));
		this.txt_val = <fgui.GRichTextField>(this.getChild("txt_val"));
		this.img_fragment = <fgui.GImage>(this.getChild("img_fragment"));
		this.btn_help = <fgui.GButton>(this.getChild("btn_help"));
		this.click_rect = <fgui.GGraph>(this.getChild("click_rect"));
		this.btn_start = <FUI_Btn_Draw>(this.getChild("btn_start"));
		this.propTip = <FUI_PropTip>(this.getChild("propTip"));
		this.rewardTip = <FUI_RewardTip>(this.getChild("rewardTip"));
		this.btn_bag = <FUI_Btn_L3>(this.getChild("btn_bag"));
	}
}