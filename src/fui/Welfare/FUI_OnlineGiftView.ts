/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OnlineGiftView extends fgui.GComponent {

	public btn_receive:fgui.GButton;
	public item_0:fgui.GButton;
	public item_1:fgui.GButton;
	public item_2:fgui.GButton;
	public item_3:fgui.GButton;
	public item_4:fgui.GButton;
	public item_5:fgui.GButton;
	public item_6:fgui.GButton;
	public item_7:fgui.GButton;
	public item_8:fgui.GButton;
	public item_9:fgui.GButton;
	public txt_get:fgui.GTextField;
	public txt_countDown:fgui.GRichTextField;
	public txt_leftTimes:fgui.GTextField;
	public t0:fgui.Transition;
	public static URL:string = "ui://vw2db6bowvo23z";

	public static createInstance():FUI_OnlineGiftView {
		return <FUI_OnlineGiftView>(fgui.UIPackage.createObject("Welfare", "OnlineGiftView"));
	}

	protected onConstruct():void {
		this.btn_receive = <fgui.GButton>(this.getChild("btn_receive"));
		this.item_0 = <fgui.GButton>(this.getChild("item_0"));
		this.item_1 = <fgui.GButton>(this.getChild("item_1"));
		this.item_2 = <fgui.GButton>(this.getChild("item_2"));
		this.item_3 = <fgui.GButton>(this.getChild("item_3"));
		this.item_4 = <fgui.GButton>(this.getChild("item_4"));
		this.item_5 = <fgui.GButton>(this.getChild("item_5"));
		this.item_6 = <fgui.GButton>(this.getChild("item_6"));
		this.item_7 = <fgui.GButton>(this.getChild("item_7"));
		this.item_8 = <fgui.GButton>(this.getChild("item_8"));
		this.item_9 = <fgui.GButton>(this.getChild("item_9"));
		this.txt_get = <fgui.GTextField>(this.getChild("txt_get"));
		this.txt_countDown = <fgui.GRichTextField>(this.getChild("txt_countDown"));
		this.txt_leftTimes = <fgui.GTextField>(this.getChild("txt_leftTimes"));
		this.t0 = this.getTransition("t0");
	}
}