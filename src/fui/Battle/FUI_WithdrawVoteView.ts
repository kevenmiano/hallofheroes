// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_Prog_VoteCDLine from "./FUI_Prog_VoteCDLine";

export default class FUI_WithdrawVoteView extends fgui.GComponent {
  public btnAgree: fgui.GButton;
  public btnDisagree: fgui.GButton;
  public progVoteCDLine: FUI_Prog_VoteCDLine;
  public list: fgui.GList;
  public static URL: string = "ui://tybyzkwzsystick";

  public static createInstance(): FUI_WithdrawVoteView {
    return <FUI_WithdrawVoteView>(
      fgui.UIPackage.createObject("Battle", "WithdrawVoteView")
    );
  }

  protected onConstruct(): void {
    this.btnAgree = <fgui.GButton>this.getChild("btnAgree");
    this.btnDisagree = <fgui.GButton>this.getChild("btnDisagree");
    this.progVoteCDLine = <FUI_Prog_VoteCDLine>this.getChild("progVoteCDLine");
    this.list = <fgui.GList>this.getChild("list");
  }
}
