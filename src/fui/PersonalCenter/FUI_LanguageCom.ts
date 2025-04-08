/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LanguageCom extends fgui.GComponent {

	public list:fgui.GList;
	public static URL:string = "ui://6watmcoitrgyiga";

	public static createInstance():FUI_LanguageCom {
		return <FUI_LanguageCom>(fgui.UIPackage.createObject("PersonalCenter", "LanguageCom"));
	}

	protected onConstruct():void {
		this.list = <fgui.GList>(this.getChild("list"));
	}
}