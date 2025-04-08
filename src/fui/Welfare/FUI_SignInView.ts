// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SignInView extends fgui.GComponent {

	public signState:fgui.Controller;
	public signTimeRewardState:fgui.Controller;
	public signEffect:fgui.Controller;
	public month:fgui.GTextField;
	public signCount:fgui.GRichTextField;
	public reSignCount:fgui.GRichTextField;
	public signBtn:fgui.GButton;
	public signReBtn:fgui.GButton;
	public opreateGroup:fgui.GGroup;
	public titleBg:fgui.GImage;
	public signEffect_2:fgui.GMovieClip;
	public titlelist:fgui.GList;
	public monthDaylist:fgui.GList;
	public signTab:fgui.GList;
	public signRewardList:fgui.GList;
	public unrewardBtn:fgui.GButton;
	public rewardBtn:fgui.GButton;
	public rewardGroup:fgui.GGroup;
	public static URL:string = "ui://vw2db6bov2103o";

	public static createInstance():FUI_SignInView {
		return <FUI_SignInView>(fgui.UIPackage.createObject("Welfare", "SignInView"));
	}

	protected onConstruct():void {
		this.signState = this.getController("signState");
		this.signTimeRewardState = this.getController("signTimeRewardState");
		this.signEffect = this.getController("signEffect");
		this.month = <fgui.GTextField>(this.getChild("month"));
		this.signCount = <fgui.GRichTextField>(this.getChild("signCount"));
		this.reSignCount = <fgui.GRichTextField>(this.getChild("reSignCount"));
		this.signBtn = <fgui.GButton>(this.getChild("signBtn"));
		this.signReBtn = <fgui.GButton>(this.getChild("signReBtn"));
		this.opreateGroup = <fgui.GGroup>(this.getChild("opreateGroup"));
		this.titleBg = <fgui.GImage>(this.getChild("titleBg"));
		this.signEffect_2 = <fgui.GMovieClip>(this.getChild("signEffect"));
		this.titlelist = <fgui.GList>(this.getChild("titlelist"));
		this.monthDaylist = <fgui.GList>(this.getChild("monthDaylist"));
		this.signTab = <fgui.GList>(this.getChild("signTab"));
		this.signRewardList = <fgui.GList>(this.getChild("signRewardList"));
		this.unrewardBtn = <fgui.GButton>(this.getChild("unrewardBtn"));
		this.rewardBtn = <fgui.GButton>(this.getChild("rewardBtn"));
		this.rewardGroup = <fgui.GGroup>(this.getChild("rewardGroup"));
	}
}