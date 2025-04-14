/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_QuestionInput extends fgui.GComponent {
  public QuestTitle: fgui.GRichTextField;
  public inputlist: fgui.GList;
  public answerGroup: fgui.GGroup;
  public static URL: string = "ui://hu55xxyzphcuo";

  public static createInstance(): FUI_QuestionInput {
    return <FUI_QuestionInput>(
      fgui.UIPackage.createObject("QuestionNaire", "QuestionInput")
    );
  }

  protected onConstruct(): void {
    this.QuestTitle = <fgui.GRichTextField>this.getChild("QuestTitle");
    this.inputlist = <fgui.GList>this.getChild("inputlist");
    this.answerGroup = <fgui.GGroup>this.getChild("answerGroup");
  }
}
