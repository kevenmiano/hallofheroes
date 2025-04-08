/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_ConsortiaMemberView from "./FUI_ConsortiaMemberView";

export default class FUI_ConsortiaMemberPage extends fgui.GComponent {
  public memberView: FUI_ConsortiaMemberView;
  public consortTransferBtn: fgui.GButton;
  public consortEventBtn: fgui.GButton;
  public consortEmailBtn: fgui.GButton;
  public recruitLinkBtn: fgui.GButton;
  public recruitBtn: fgui.GButton;
  public txtOnlineValue: fgui.GTextField;
  public static URL: string = "ui://8w3m5duwfszci8a";

  public static createInstance(): FUI_ConsortiaMemberPage {
    return <FUI_ConsortiaMemberPage>(
      fgui.UIPackage.createObject("Consortia", "ConsortiaMemberPage")
    );
  }

  protected onConstruct(): void {
    this.memberView = <FUI_ConsortiaMemberView>this.getChild("memberView");
    this.consortTransferBtn = <fgui.GButton>this.getChild("consortTransferBtn");
    this.consortEventBtn = <fgui.GButton>this.getChild("consortEventBtn");
    this.consortEmailBtn = <fgui.GButton>this.getChild("consortEmailBtn");
    this.recruitLinkBtn = <fgui.GButton>this.getChild("recruitLinkBtn");
    this.recruitBtn = <fgui.GButton>this.getChild("recruitBtn");
    this.txtOnlineValue = <fgui.GTextField>this.getChild("txtOnlineValue");
  }
}
