/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutyardPersonRewardItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public bg:fgui.GImage;
	public costTxt:fgui.GRichTextField;
	public progressTxt:fgui.GTextField;
	public rewardList:fgui.GList;
	public static URL:string = "ui://w1giibvbncygs";

	public static createInstance():FUI_OutyardPersonRewardItem {
		return <FUI_OutyardPersonRewardItem>(fgui.UIPackage.createObject("OutYard", "OutyardPersonRewardItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.costTxt = <fgui.GRichTextField>(this.getChild("costTxt"));
		this.progressTxt = <fgui.GTextField>(this.getChild("progressTxt"));
		this.rewardList = <fgui.GList>(this.getChild("rewardList"));
	}
}