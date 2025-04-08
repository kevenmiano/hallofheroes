/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BindMailView extends fgui.GComponent {

	public privacy:fgui.Controller;
	public list:fgui.GList;
	public btnBind:fgui.GButton;
	public static URL:string = "ui://vw2db6botqmj9micr";

	public static createInstance():FUI_BindMailView {
		return <FUI_BindMailView>(fgui.UIPackage.createObject("Welfare", "BindMailView"));
	}

	protected onConstruct():void {
		this.privacy = this.getController("privacy");
		this.list = <fgui.GList>(this.getChild("list"));
		this.btnBind = <fgui.GButton>(this.getChild("btnBind"));
	}
}