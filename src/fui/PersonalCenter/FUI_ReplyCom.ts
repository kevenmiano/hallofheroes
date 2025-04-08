// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ReplyCom extends fgui.GComponent {

	public txt_title:fgui.GTextInput;
	public txt_desc:fgui.GTextInput;
	public combox1:fgui.GComboBox;
	public combox2:fgui.GComboBox;
	public combox3:fgui.GComboBox;
	public txt_num:fgui.GTextField;
	public static URL:string = "ui://6watmcoik5t126";

	public static createInstance():FUI_ReplyCom {
		return <FUI_ReplyCom>(fgui.UIPackage.createObject("PersonalCenter", "ReplyCom"));
	}

	protected onConstruct():void {
		this.txt_title = <fgui.GTextInput>(this.getChild("txt_title"));
		this.txt_desc = <fgui.GTextInput>(this.getChild("txt_desc"));
		this.combox1 = <fgui.GComboBox>(this.getChild("combox1"));
		this.combox2 = <fgui.GComboBox>(this.getChild("combox2"));
		this.combox3 = <fgui.GComboBox>(this.getChild("combox3"));
		this.txt_num = <fgui.GTextField>(this.getChild("txt_num"));
	}
}