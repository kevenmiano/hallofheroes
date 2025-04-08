// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_QuestionAnswer extends fgui.GComponent {

	public QuestTitle:fgui.GRichTextField;
	public inputBg:fgui.GImage;
	public answerGroup:fgui.GGroup;
	public static URL:string = "ui://hu55xxyzqsyfd";

	public static createInstance():FUI_QuestionAnswer {
		return <FUI_QuestionAnswer>(fgui.UIPackage.createObject("QuestionNaire", "QuestionAnswer"));
	}

	protected onConstruct():void {
		this.QuestTitle = <fgui.GRichTextField>(this.getChild("QuestTitle"));
		this.inputBg = <fgui.GImage>(this.getChild("inputBg"));
		this.answerGroup = <fgui.GGroup>(this.getChild("answerGroup"));
	}
}