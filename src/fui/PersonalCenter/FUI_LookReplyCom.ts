// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LookReplyCom extends fgui.GComponent {

	public txt_desc:fgui.GTextField;
	public txt_desc1:fgui.GTextField;
	public txt_title:fgui.GTextField;
	public txt_time:fgui.GTextField;
	public static URL:string = "ui://6watmcoik5t127";

	public static createInstance():FUI_LookReplyCom {
		return <FUI_LookReplyCom>(fgui.UIPackage.createObject("PersonalCenter", "LookReplyCom"));
	}

	protected onConstruct():void {
		this.txt_desc = <fgui.GTextField>(this.getChild("txt_desc"));
		this.txt_desc1 = <fgui.GTextField>(this.getChild("txt_desc1"));
		this.txt_title = <fgui.GTextField>(this.getChild("txt_title"));
		this.txt_time = <fgui.GTextField>(this.getChild("txt_time"));
	}
}