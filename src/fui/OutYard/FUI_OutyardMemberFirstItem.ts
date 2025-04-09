/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_OutyardMemberFirstItem extends fgui.GComponent {
  public bg: fgui.GImage;
  public jobIcon: fgui.GLoader;
  public userNameTxt: fgui.GTextField;
  public levelTxt: fgui.GTextField;
  public fightValueTxt: fgui.GTextField;
  public statusTxt: fgui.GTextField;
  public indexIcon: fgui.GLoader;
  public countTxt: fgui.GTextField;
  public precentTxt: fgui.GTextField;
  public static URL: string = "ui://w1giibvbncygo";

  public static createInstance(): FUI_OutyardMemberFirstItem {
    return <FUI_OutyardMemberFirstItem>(
      fgui.UIPackage.createObject("OutYard", "OutyardMemberFirstItem")
    );
  }

  protected onConstruct(): void {
    this.bg = <fgui.GImage>this.getChild("bg");
    this.jobIcon = <fgui.GLoader>this.getChild("jobIcon");
    this.userNameTxt = <fgui.GTextField>this.getChild("userNameTxt");
    this.levelTxt = <fgui.GTextField>this.getChild("levelTxt");
    this.fightValueTxt = <fgui.GTextField>this.getChild("fightValueTxt");
    this.statusTxt = <fgui.GTextField>this.getChild("statusTxt");
    this.indexIcon = <fgui.GLoader>this.getChild("indexIcon");
    this.countTxt = <fgui.GTextField>this.getChild("countTxt");
    this.precentTxt = <fgui.GTextField>this.getChild("precentTxt");
  }
}
