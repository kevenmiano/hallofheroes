// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_QuestionTitle extends fgui.GComponent {

	public questionTitle:fgui.GRichTextField;
	public group:fgui.GGroup;
	public static URL:string = "ui://hu55xxyzqsyfc";

	public static createInstance():FUI_QuestionTitle {
		return <FUI_QuestionTitle>(fgui.UIPackage.createObject("QuestionNaire", "QuestionTitle"));
	}

	protected onConstruct():void {
		this.questionTitle = <fgui.GRichTextField>(this.getChild("questionTitle"));
		this.group = <fgui.GGroup>(this.getChild("group"));
	}
}