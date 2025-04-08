/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CumulativeRechargeDayView extends fgui.GComponent {

	public reward:fgui.Controller;
	public nameTitle:fgui.GTextField;
	public remainTImes:fgui.GRichTextField;
	public describeText:fgui.GRichTextField;
	public activityTime:fgui.GRichTextField;
	public goodsList:fgui.GList;
	public dayslist:fgui.GList;
	public btn_recharge:fgui.GButton;
	public arrowGroup:fgui.GGroup;
	public getRewardBtn:fgui.GButton;
	public unfinishBtn:fgui.GButton;
	public overBtn:fgui.GButton;
	public static URL:string = "ui://lzu8jcp2hk1w5f";

	public static createInstance():FUI_CumulativeRechargeDayView {
		return <FUI_CumulativeRechargeDayView>(fgui.UIPackage.createObject("Funny", "CumulativeRechargeDayView"));
	}

	protected onConstruct():void {
		this.reward = this.getController("reward");
		this.nameTitle = <fgui.GTextField>(this.getChild("nameTitle"));
		this.remainTImes = <fgui.GRichTextField>(this.getChild("remainTImes"));
		this.describeText = <fgui.GRichTextField>(this.getChild("describeText"));
		this.activityTime = <fgui.GRichTextField>(this.getChild("activityTime"));
		this.goodsList = <fgui.GList>(this.getChild("goodsList"));
		this.dayslist = <fgui.GList>(this.getChild("dayslist"));
		this.btn_recharge = <fgui.GButton>(this.getChild("btn_recharge"));
		this.arrowGroup = <fgui.GGroup>(this.getChild("arrowGroup"));
		this.getRewardBtn = <fgui.GButton>(this.getChild("getRewardBtn"));
		this.unfinishBtn = <fgui.GButton>(this.getChild("unfinishBtn"));
		this.overBtn = <fgui.GButton>(this.getChild("overBtn"));
	}
}