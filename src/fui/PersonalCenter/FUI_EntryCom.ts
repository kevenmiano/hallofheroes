// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_EntryCom extends fgui.GComponent {

	public list:fgui.GList;
	public static URL:string = "ui://6watmcoibkwq11";

	public static createInstance():FUI_EntryCom {
		return <FUI_EntryCom>(fgui.UIPackage.createObject("PersonalCenter", "EntryCom"));
	}

	protected onConstruct():void {
		this.list = <fgui.GList>(this.getChild("list"));
	}
}