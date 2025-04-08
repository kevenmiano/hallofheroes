/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DiscountTitleItem extends fgui.GComponent {

	public title:fgui.GTextField;
	public static URL:string = "ui://qcwdul6nioqe3f";

	public static createInstance():FUI_DiscountTitleItem {
		return <FUI_DiscountTitleItem>(fgui.UIPackage.createObject("Shop", "DiscountTitleItem"));
	}

	protected onConstruct():void {
		this.title = <fgui.GTextField>(this.getChild("title"));
	}
}