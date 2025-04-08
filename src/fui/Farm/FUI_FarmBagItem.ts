/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FarmBagItem extends fgui.GButton {

	public imgSelect:fgui.GImage;
	public baseItem:fgui.GButton;
	public txt_time:fgui.GTextField;
	public static URL:string = "ui://rcqiz171cju8u";

	public static createInstance():FUI_FarmBagItem {
		return <FUI_FarmBagItem>(fgui.UIPackage.createObject("Farm", "FarmBagItem"));
	}

	protected onConstruct():void {
		this.imgSelect = <fgui.GImage>(this.getChild("imgSelect"));
		this.baseItem = <fgui.GButton>(this.getChild("baseItem"));
		this.txt_time = <fgui.GTextField>(this.getChild("txt_time"));
	}
}