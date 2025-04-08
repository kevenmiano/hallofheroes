/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SecretTresureItem extends fgui.GButton {

	public back:fgui.GLoader;
	public profile:fgui.GLoader;
	public txtTitle:fgui.GTextField;
	public txtName:fgui.GTextField;
	public static URL:string = "ui://og5jeos3xf2uwu8wyp";

	public static createInstance():FUI_SecretTresureItem {
		return <FUI_SecretTresureItem>(fgui.UIPackage.createObject("Base", "SecretTresureItem"));
	}

	protected onConstruct():void {
		this.back = <fgui.GLoader>(this.getChild("back"));
		this.profile = <fgui.GLoader>(this.getChild("profile"));
		this.txtTitle = <fgui.GTextField>(this.getChild("txtTitle"));
		this.txtName = <fgui.GTextField>(this.getChild("txtName"));
	}
}