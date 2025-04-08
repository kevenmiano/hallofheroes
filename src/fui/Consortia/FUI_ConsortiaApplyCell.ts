/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaApplyCell extends fgui.GButton {
  public isTitle: fgui.Controller;
  public cApplyed: fgui.Controller;
  public cellbg: fgui.GImage;
  public bgGroup: fgui.GGroup;
  public title1: fgui.GTextField;
  public title2: fgui.GTextField;
  public title3: fgui.GTextField;
  public title4: fgui.GTextField;
  public static URL: string = "ui://8w3m5duwfszci7n";

  public static createInstance(): FUI_ConsortiaApplyCell {
    return <FUI_ConsortiaApplyCell>(
      fgui.UIPackage.createObject("Consortia", "ConsortiaApplyCell")
    );
  }

  protected onConstruct(): void {
    this.isTitle = this.getController("isTitle");
    this.cApplyed = this.getController("cApplyed");
    this.cellbg = <fgui.GImage>this.getChild("cellbg");
    this.bgGroup = <fgui.GGroup>this.getChild("bgGroup");
    this.title1 = <fgui.GTextField>this.getChild("title1");
    this.title2 = <fgui.GTextField>this.getChild("title2");
    this.title3 = <fgui.GTextField>this.getChild("title3");
    this.title4 = <fgui.GTextField>this.getChild("title4");
  }
}
