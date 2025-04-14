/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_DegreeActivityListCell extends fgui.GComponent {
  public state: fgui.Controller;
  public count: fgui.GTextField;
  public title: fgui.GRichTextField;
  public content: fgui.GRichTextField;
  public level: fgui.GRichTextField;
  public time: fgui.GRichTextField;
  public goHeadBtn: fgui.GButton;
  public Group: fgui.GGroup;
  public static URL: string = "ui://vw2db6bov2103n";

  public static createInstance(): FUI_DegreeActivityListCell {
    return <FUI_DegreeActivityListCell>(
      fgui.UIPackage.createObject("Welfare", "DegreeActivityListCell")
    );
  }

  protected onConstruct(): void {
    this.state = this.getController("state");
    this.count = <fgui.GTextField>this.getChild("count");
    this.title = <fgui.GRichTextField>this.getChild("title");
    this.content = <fgui.GRichTextField>this.getChild("content");
    this.level = <fgui.GRichTextField>this.getChild("level");
    this.time = <fgui.GRichTextField>this.getChild("time");
    this.goHeadBtn = <fgui.GButton>this.getChild("goHeadBtn");
    this.Group = <fgui.GGroup>this.getChild("Group");
  }
}
