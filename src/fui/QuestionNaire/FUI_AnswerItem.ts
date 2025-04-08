/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_AnswerItem extends fgui.GButton {

	public inputCtrl:fgui.Controller;
	public check:fgui.GButton;
	public input:fgui.GTextInput;
	public item_line:fgui.GImage;
	public inputGroup:fgui.GGroup;
	public group:fgui.GGroup;
	public static URL:string = "ui://hu55xxyzphcul";

	public static createInstance():FUI_AnswerItem {
		return <FUI_AnswerItem>(fgui.UIPackage.createObject("QuestionNaire", "AnswerItem"));
	}

	protected onConstruct():void {
		this.inputCtrl = this.getController("inputCtrl");
		this.check = <fgui.GButton>(this.getChild("check"));
		this.input = <fgui.GTextInput>(this.getChild("input"));
		this.item_line = <fgui.GImage>(this.getChild("item_line"));
		this.inputGroup = <fgui.GGroup>(this.getChild("inputGroup"));
		this.group = <fgui.GGroup>(this.getChild("group"));
	}
}