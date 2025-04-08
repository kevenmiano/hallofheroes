/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DeleteFileLevelItem extends fgui.GComponent {

	public state:fgui.Controller;
	public list:fgui.GList;
	public txt_desc:fgui.GRichTextField;
	public btn_get:fgui.GButton;
	public static URL:string = "ui://lzu8jcp2ggc4mifv";

	public static createInstance():FUI_DeleteFileLevelItem {
		return <FUI_DeleteFileLevelItem>(fgui.UIPackage.createObject("Funny", "DeleteFileLevelItem"));
	}

	protected onConstruct():void {
		this.state = this.getController("state");
		this.list = <fgui.GList>(this.getChild("list"));
		this.txt_desc = <fgui.GRichTextField>(this.getChild("txt_desc"));
		this.btn_get = <fgui.GButton>(this.getChild("btn_get"));
	}
}