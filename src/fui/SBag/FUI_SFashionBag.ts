/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SFashionBag extends fgui.GComponent {

	public list_item:fgui.GList;
	public list_tab:fgui.GList;
	public static URL:string = "ui://6fvk31suqvnohicm";

	public static createInstance():FUI_SFashionBag {
		return <FUI_SFashionBag>(fgui.UIPackage.createObject("SBag", "SFashionBag"));
	}

	protected onConstruct():void {
		this.list_item = <fgui.GList>(this.getChild("list_item"));
		this.list_tab = <fgui.GList>(this.getChild("list_tab"));
	}
}