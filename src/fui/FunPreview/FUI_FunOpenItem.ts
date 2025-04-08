/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FunOpenItem extends fgui.GComponent {

	public c1:fgui.Controller;
	public txt_desc:fgui.GTextField;
	public loader:fgui.GLoader;
	public static URL:string = "ui://0onhz6ok6zo01e";

	public static createInstance():FUI_FunOpenItem {
		return <FUI_FunOpenItem>(fgui.UIPackage.createObject("FunPreview", "FunOpenItem"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.txt_desc = <fgui.GTextField>(this.getChild("txt_desc"));
		this.loader = <fgui.GLoader>(this.getChild("loader"));
	}
}