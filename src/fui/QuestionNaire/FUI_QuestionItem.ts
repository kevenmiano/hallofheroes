// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_QuestionItem extends fgui.GComponent {

	public QuestTitle:fgui.GRichTextField;
	public list:fgui.GList;
	public group:fgui.GGroup;
	public static URL:string = "ui://hu55xxyzqsyfb";

	public static createInstance():FUI_QuestionItem {
		return <FUI_QuestionItem>(fgui.UIPackage.createObject("QuestionNaire", "QuestionItem"));
	}

	protected onConstruct():void {
		this.QuestTitle = <fgui.GRichTextField>(this.getChild("QuestTitle"));
		this.list = <fgui.GList>(this.getChild("list"));
		this.group = <fgui.GGroup>(this.getChild("group"));
	}
}