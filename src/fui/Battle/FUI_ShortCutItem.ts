/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ShortCutItem extends fgui.GComponent {

	public txt_name:fgui.GRichTextField;
	public btn_send:fgui.GButton;
	public static URL:string = "ui://tybyzkwzxb4i2d";

	public static createInstance():FUI_ShortCutItem {
		return <FUI_ShortCutItem>(fgui.UIPackage.createObject("Battle", "ShortCutItem"));
	}

	protected onConstruct():void {
		this.txt_name = <fgui.GRichTextField>(this.getChild("txt_name"));
		this.btn_send = <fgui.GButton>(this.getChild("btn_send"));
	}
}