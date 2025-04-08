/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaApplyRecordCell extends fgui.GComponent {
  public isTitle: fgui.Controller;
  public cellbg: fgui.GImage;
  public bgGroup: fgui.GGroup;
  public title1: fgui.GTextField;
  public title2: fgui.GTextField;
  public title3: fgui.GTextField;
  public title4: fgui.GTextField;
  public acceptBtn: fgui.GButton;
  public rejectBtn: fgui.GButton;
  public static URL: string = "ui://8w3m5duwfszci7q";

  public static createInstance(): FUI_ConsortiaApplyRecordCell {
    return <FUI_ConsortiaApplyRecordCell>(
      fgui.UIPackage.createObject("Consortia", "ConsortiaApplyRecordCell")
    );
  }

  protected onConstruct(): void {
    this.isTitle = this.getController("isTitle");
    this.cellbg = <fgui.GImage>this.getChild("cellbg");
    this.bgGroup = <fgui.GGroup>this.getChild("bgGroup");
    this.title1 = <fgui.GTextField>this.getChild("title1");
    this.title2 = <fgui.GTextField>this.getChild("title2");
    this.title3 = <fgui.GTextField>this.getChild("title3");
    this.title4 = <fgui.GTextField>this.getChild("title4");
    this.acceptBtn = <fgui.GButton>this.getChild("acceptBtn");
    this.rejectBtn = <fgui.GButton>this.getChild("rejectBtn");
  }
}
