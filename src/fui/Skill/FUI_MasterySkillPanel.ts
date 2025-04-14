/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MasterySkillPanel extends fgui.GComponent {
  public masteryList: fgui.GList;
  public static URL: string = "ui://v98hah2opv1firj";

  public static createInstance(): FUI_MasterySkillPanel {
    return <FUI_MasterySkillPanel>(
      fgui.UIPackage.createObject("Skill", "MasterySkillPanel")
    );
  }

  protected onConstruct(): void {
    this.masteryList = <fgui.GList>this.getChild("masteryList");
  }
}
