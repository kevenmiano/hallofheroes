/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaElectionItem extends fgui.GButton {
  public selecteBtn: fgui.GButton;
  public nameTxt: fgui.GTextField;
  public countTxt: fgui.GTextField;
  public static URL: string = "ui://8w3m5duwk5w5iai";

  public static createInstance(): FUI_ConsortiaElectionItem {
    return <FUI_ConsortiaElectionItem>(
      fgui.UIPackage.createObject("Consortia", "ConsortiaElectionItem")
    );
  }

  protected onConstruct(): void {
    this.selecteBtn = <fgui.GButton>this.getChild("selecteBtn");
    this.nameTxt = <fgui.GTextField>this.getChild("nameTxt");
    this.countTxt = <fgui.GTextField>this.getChild("countTxt");
  }
}
