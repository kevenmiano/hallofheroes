/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CarnivalGamePageItem extends fgui.GComponent {

	public iconCtrl:fgui.Controller;
	public isSummer:fgui.Controller;
	public btn_start:fgui.GButton;
	public gameIcon_1:fgui.GImage;
	public gameIcon_2:fgui.GImage;
	public gameIcon_3:fgui.GImage;
	public rewardList:fgui.GList;
	public txt_reward_title:fgui.GTextField;
	public txt_title:fgui.GRichTextField;
	public txt_reward:fgui.GRichTextField;
	public static URL:string = "ui://qvbm8hnzpf9kgo";

	public static createInstance():FUI_CarnivalGamePageItem {
		return <FUI_CarnivalGamePageItem>(fgui.UIPackage.createObject("Carnival", "CarnivalGamePageItem"));
	}

	protected onConstruct():void {
		this.iconCtrl = this.getController("iconCtrl");
		this.isSummer = this.getController("isSummer");
		this.btn_start = <fgui.GButton>(this.getChild("btn_start"));
		this.gameIcon_1 = <fgui.GImage>(this.getChild("gameIcon_1"));
		this.gameIcon_2 = <fgui.GImage>(this.getChild("gameIcon_2"));
		this.gameIcon_3 = <fgui.GImage>(this.getChild("gameIcon_3"));
		this.rewardList = <fgui.GList>(this.getChild("rewardList"));
		this.txt_reward_title = <fgui.GTextField>(this.getChild("txt_reward_title"));
		this.txt_title = <fgui.GRichTextField>(this.getChild("txt_title"));
		this.txt_reward = <fgui.GRichTextField>(this.getChild("txt_reward"));
	}
}