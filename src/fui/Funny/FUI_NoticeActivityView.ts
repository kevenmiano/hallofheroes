/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_NoticeActivityView extends fgui.GComponent {

	public describeText:fgui.GRichTextField;
	public nameTitle:fgui.GTextField;
	public static URL:string = "ui://lzu8jcp2m9uwice";

	public static createInstance():FUI_NoticeActivityView {
		return <FUI_NoticeActivityView>(fgui.UIPackage.createObject("Funny", "NoticeActivityView"));
	}

	protected onConstruct():void {
		this.describeText = <fgui.GRichTextField>(this.getChild("describeText"));
		this.nameTitle = <fgui.GTextField>(this.getChild("nameTitle"));
	}
}