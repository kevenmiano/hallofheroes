/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SocialMediaSetting extends fgui.GComponent {

	public list:fgui.GList;
	public static URL:string = "ui://2ydb9fb2inojsmhihq";

	public static createInstance():FUI_SocialMediaSetting {
		return <FUI_SocialMediaSetting>(fgui.UIPackage.createObject("Login", "SocialMediaSetting"));
	}

	protected onConstruct():void {
		this.list = <fgui.GList>(this.getChild("list"));
	}
}