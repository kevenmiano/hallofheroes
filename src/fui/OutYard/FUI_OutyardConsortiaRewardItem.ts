// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutyardConsortiaRewardItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public bg:fgui.GImage;
	public rankTxt:fgui.GRichTextField;
	public rewardList:fgui.GList;
	public static URL:string = "ui://w1giibvbncygt";

	public static createInstance():FUI_OutyardConsortiaRewardItem {
		return <FUI_OutyardConsortiaRewardItem>(fgui.UIPackage.createObject("OutYard", "OutyardConsortiaRewardItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.rankTxt = <fgui.GRichTextField>(this.getChild("rankTxt"));
		this.rewardList = <fgui.GList>(this.getChild("rewardList"));
	}
}