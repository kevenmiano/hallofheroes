/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SevenGoalsTaskItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public pointValueTxt:fgui.GTextField;
	public DescTxt:fgui.GTextField;
	public countTxt:fgui.GTextField;
	public goodsList:fgui.GList;
	public getRewardBtn:fgui.GButton;
	public openrationBtn:fgui.GButton;
	public overBtn:fgui.GButton;
	public gotoBtn:fgui.GButton;
	public static URL:string = "ui://tctdlybezy3d4";

	public static createInstance():FUI_SevenGoalsTaskItem {
		return <FUI_SevenGoalsTaskItem>(fgui.UIPackage.createObject("SevenTarget", "SevenGoalsTaskItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.pointValueTxt = <fgui.GTextField>(this.getChild("pointValueTxt"));
		this.DescTxt = <fgui.GTextField>(this.getChild("DescTxt"));
		this.countTxt = <fgui.GTextField>(this.getChild("countTxt"));
		this.goodsList = <fgui.GList>(this.getChild("goodsList"));
		this.getRewardBtn = <fgui.GButton>(this.getChild("getRewardBtn"));
		this.openrationBtn = <fgui.GButton>(this.getChild("openrationBtn"));
		this.overBtn = <fgui.GButton>(this.getChild("overBtn"));
		this.gotoBtn = <fgui.GButton>(this.getChild("gotoBtn"));
	}
}