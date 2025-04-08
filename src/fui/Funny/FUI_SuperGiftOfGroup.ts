/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SuperGiftOfGroup extends fgui.GComponent {

	public activityTimeLable:fgui.GTextField;
	public activityTimeTxt:fgui.GTextField;
	public diamondTip:fgui.GButton;
	public giftTxt:fgui.GTextField;
	public btn_buy:fgui.GButton;
	public list:fgui.GList;
	public helpBtn:fgui.GButton;
	public static URL:string = "ui://lzu8jcp2nczxmiiy";

	public static createInstance():FUI_SuperGiftOfGroup {
		return <FUI_SuperGiftOfGroup>(fgui.UIPackage.createObject("Funny", "SuperGiftOfGroup"));
	}

	protected onConstruct():void {
		this.activityTimeLable = <fgui.GTextField>(this.getChild("activityTimeLable"));
		this.activityTimeTxt = <fgui.GTextField>(this.getChild("activityTimeTxt"));
		this.diamondTip = <fgui.GButton>(this.getChild("diamondTip"));
		this.giftTxt = <fgui.GTextField>(this.getChild("giftTxt"));
		this.btn_buy = <fgui.GButton>(this.getChild("btn_buy"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.helpBtn = <fgui.GButton>(this.getChild("helpBtn"));
	}
}