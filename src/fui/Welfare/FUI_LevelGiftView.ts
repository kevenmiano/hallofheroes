// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LevelGiftView extends fgui.GComponent {

	public diamondBg:fgui.GImage;
	public list1:fgui.GList;
	public list2:fgui.GList;
	public diamondTxt:fgui.GTextField;
	public preBtn:fgui.GButton;
	public nextBtn:fgui.GButton;
	public static URL:string = "ui://vw2db6bowvo23x";

	public static createInstance():FUI_LevelGiftView {
		return <FUI_LevelGiftView>(fgui.UIPackage.createObject("Welfare", "LevelGiftView"));
	}

	protected onConstruct():void {
		this.diamondBg = <fgui.GImage>(this.getChild("diamondBg"));
		this.list1 = <fgui.GList>(this.getChild("list1"));
		this.list2 = <fgui.GList>(this.getChild("list2"));
		this.diamondTxt = <fgui.GTextField>(this.getChild("diamondTxt"));
		this.preBtn = <fgui.GButton>(this.getChild("preBtn"));
		this.nextBtn = <fgui.GButton>(this.getChild("nextBtn"));
	}
}