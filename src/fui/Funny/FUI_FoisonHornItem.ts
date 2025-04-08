/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FoisonHornItem extends fgui.GComponent {

	public baseIcon:fgui.GButton;
	public countTxt:fgui.GTextField;
	public static URL:string = "ui://lzu8jcp2bheric6";

	public static createInstance():FUI_FoisonHornItem {
		return <FUI_FoisonHornItem>(fgui.UIPackage.createObject("Funny", "FoisonHornItem"));
	}

	protected onConstruct():void {
		this.baseIcon = <fgui.GButton>(this.getChild("baseIcon"));
		this.countTxt = <fgui.GTextField>(this.getChild("countTxt"));
	}
}