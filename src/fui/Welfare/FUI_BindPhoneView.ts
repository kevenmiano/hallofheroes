// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BindPhoneView extends fgui.GComponent {

	public list:fgui.GList;
	public btnBind:fgui.GButton;
	public static URL:string = "ui://vw2db6botqmj9micp";

	public static createInstance():FUI_BindPhoneView {
		return <FUI_BindPhoneView>(fgui.UIPackage.createObject("Welfare", "BindPhoneView"));
	}

	protected onConstruct():void {
		this.list = <fgui.GList>(this.getChild("list"));
		this.btnBind = <fgui.GButton>(this.getChild("btnBind"));
	}
}