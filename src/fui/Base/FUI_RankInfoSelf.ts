/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_Btn_Common from "./FUI_Btn_Common";

export default class FUI_RankInfoSelf extends fgui.GComponent {

	public imgBg:fgui.GLoader;
	public btnReward:FUI_Btn_Common;
	public rTxtReward1:fgui.GRichTextField;
	public rTxtReward2:fgui.GRichTextField;
	public gRewardTips:fgui.GGroup;
	public txtRank:fgui.GTextField;
	public txtScore:fgui.GTextField;
	public txtTime:fgui.GTextField;
	public static URL:string = "ui://og5jeos3t3q6i3p";

	public static createInstance():FUI_RankInfoSelf {
		return <FUI_RankInfoSelf>(fgui.UIPackage.createObject("Base", "RankInfoSelf"));
	}

	protected onConstruct():void {
		this.imgBg = <fgui.GLoader>(this.getChild("imgBg"));
		this.btnReward = <FUI_Btn_Common>(this.getChild("btnReward"));
		this.rTxtReward1 = <fgui.GRichTextField>(this.getChild("rTxtReward1"));
		this.rTxtReward2 = <fgui.GRichTextField>(this.getChild("rTxtReward2"));
		this.gRewardTips = <fgui.GGroup>(this.getChild("gRewardTips"));
		this.txtRank = <fgui.GTextField>(this.getChild("txtRank"));
		this.txtScore = <fgui.GTextField>(this.getChild("txtScore"));
		this.txtTime = <fgui.GTextField>(this.getChild("txtTime"));
	}
}