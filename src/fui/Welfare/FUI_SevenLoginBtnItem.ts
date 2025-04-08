/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SevenLoginBtnItem extends fgui.GComponent {

	public btnStatus:fgui.Controller;
	public bg:fgui.GImage;
	public hasGetBtn:fgui.GImage;
	public getRewardBtn:fgui.GButton;
	public baseItem:fgui.GButton;
	public dayTitleTxt:fgui.GTextField;
	public static URL:string = "ui://vw2db6box6dri7z";

	public static createInstance():FUI_SevenLoginBtnItem {
		return <FUI_SevenLoginBtnItem>(fgui.UIPackage.createObject("Welfare", "SevenLoginBtnItem"));
	}

	protected onConstruct():void {
		this.btnStatus = this.getController("btnStatus");
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.hasGetBtn = <fgui.GImage>(this.getChild("hasGetBtn"));
		this.getRewardBtn = <fgui.GButton>(this.getChild("getRewardBtn"));
		this.baseItem = <fgui.GButton>(this.getChild("baseItem"));
		this.dayTitleTxt = <fgui.GTextField>(this.getChild("dayTitleTxt"));
	}
}