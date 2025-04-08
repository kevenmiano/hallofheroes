// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_Prog_VoteCDLine from "./FUI_Prog_VoteCDLine";

export default class FUI_WithdrawVoteInitiatorView extends fgui.GComponent {
  public progVoteCDLine: FUI_Prog_VoteCDLine;
  public list: fgui.GList;
  public static URL: string = "ui://tybyzkwzsysticn";

  public static createInstance(): FUI_WithdrawVoteInitiatorView {
    return <FUI_WithdrawVoteInitiatorView>(
      fgui.UIPackage.createObject("Battle", "WithdrawVoteInitiatorView")
    );
  }

  protected onConstruct(): void {
    this.progVoteCDLine = <FUI_Prog_VoteCDLine>this.getChild("progVoteCDLine");
    this.list = <fgui.GList>this.getChild("list");
  }
}
