/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WarlordRoomRankItem extends fgui.GComponent {
  public rankTxt: fgui.GTextField;
  public userNameTxt: fgui.GTextField;
  public scoreTxt: fgui.GTextField;
  public static URL: string = "ui://6fsn69didcpq1k";

  public static createInstance(): FUI_WarlordRoomRankItem {
    return <FUI_WarlordRoomRankItem>(
      fgui.UIPackage.createObject("Warlords", "WarlordRoomRankItem")
    );
  }

  protected onConstruct(): void {
    this.rankTxt = <fgui.GTextField>this.getChild("rankTxt");
    this.userNameTxt = <fgui.GTextField>this.getChild("userNameTxt");
    this.scoreTxt = <fgui.GTextField>this.getChild("scoreTxt");
  }
}
