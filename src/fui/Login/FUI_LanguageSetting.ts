/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LanguageSetting extends fgui.GComponent {

	public list:fgui.GList;
	public static URL:string = "ui://2ydb9fb2inojsmhihh";

	public static createInstance():FUI_LanguageSetting {
		return <FUI_LanguageSetting>(fgui.UIPackage.createObject("Login", "LanguageSetting"));
	}

	protected onConstruct():void {
		this.list = <fgui.GList>(this.getChild("list"));
	}
}