/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TextBox extends fgui.GComponent {

	public userName:fgui.GComponent;
	public static URL:string = "ui://og5jeos3iln6pe";

	public static createInstance():FUI_TextBox {
		return <FUI_TextBox>(fgui.UIPackage.createObject("Base", "TextBox"));
	}

	protected onConstruct():void {
		this.userName = <fgui.GComponent>(this.getChild("userName"));
	}
}