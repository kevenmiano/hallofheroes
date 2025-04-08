// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OfferRewardItem extends fgui.GComponent {

	public Img_HasComplete:fgui.GImage;
	public Btn_quick:fgui.GButton;
	public Btn_accept:fgui.GButton;
	public Btn_recive:fgui.GButton;
	public TaskTitleTxt:fgui.GTextField;
	public TaskContentTxt:fgui.GTextField;
	public TaskExpValueTxt:fgui.GTextField;
	public TaskGoldValueTxt:fgui.GTextField;
	public giveBtn:fgui.GButton;
	public picIcon:fgui.GLoader;
	public static URL:string = "ui://98lc2o5bn3381";

	public static createInstance():FUI_OfferRewardItem {
		return <FUI_OfferRewardItem>(fgui.UIPackage.createObject("Space", "OfferRewardItem"));
	}

	protected onConstruct():void {
		this.Img_HasComplete = <fgui.GImage>(this.getChild("Img_HasComplete"));
		this.Btn_quick = <fgui.GButton>(this.getChild("Btn_quick"));
		this.Btn_accept = <fgui.GButton>(this.getChild("Btn_accept"));
		this.Btn_recive = <fgui.GButton>(this.getChild("Btn_recive"));
		this.TaskTitleTxt = <fgui.GTextField>(this.getChild("TaskTitleTxt"));
		this.TaskContentTxt = <fgui.GTextField>(this.getChild("TaskContentTxt"));
		this.TaskExpValueTxt = <fgui.GTextField>(this.getChild("TaskExpValueTxt"));
		this.TaskGoldValueTxt = <fgui.GTextField>(this.getChild("TaskGoldValueTxt"));
		this.giveBtn = <fgui.GButton>(this.getChild("giveBtn"));
		this.picIcon = <fgui.GLoader>(this.getChild("picIcon"));
	}
}