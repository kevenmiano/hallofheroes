/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RoomPlayerItem extends fgui.GComponent {
  public imgStage: fgui.GImage;
  public btnInvite: fgui.GButton;
  public imgState: fgui.GLoader;
  public imgOwner: fgui.GImage;
  public txtPlayerNameShadow: fgui.GTextField;
  public txtPlayerName: fgui.GTextField;
  public txtGuildNameShadow: fgui.GTextField;
  public txtGuildName: fgui.GTextField;
  public miniRank: fgui.GComponent;
  public gName: fgui.GGroup;
  public btnChallenge: fgui.GButton;
  public imgRankBg: fgui.GLoader;
  public txtRank: fgui.GTextField;
  public gChallenge: fgui.GGroup;
  public txtPower: fgui.GTextField;
  public txtScore: fgui.GTextField;
  public gScore: fgui.GGroup;
  public btnOwnerOpt: fgui.GButton;
  public static URL: string = "ui://qz4gxkvgomck0";

  public static createInstance(): FUI_RoomPlayerItem {
    return <FUI_RoomPlayerItem>(
      fgui.UIPackage.createObject("BaseRoom", "RoomPlayerItem")
    );
  }

  protected onConstruct(): void {
    this.imgStage = <fgui.GImage>this.getChild("imgStage");
    this.btnInvite = <fgui.GButton>this.getChild("btnInvite");
    this.imgState = <fgui.GLoader>this.getChild("imgState");
    this.imgOwner = <fgui.GImage>this.getChild("imgOwner");
    this.txtPlayerNameShadow = <fgui.GTextField>(
      this.getChild("txtPlayerNameShadow")
    );
    this.txtPlayerName = <fgui.GTextField>this.getChild("txtPlayerName");
    this.txtGuildNameShadow = <fgui.GTextField>(
      this.getChild("txtGuildNameShadow")
    );
    this.txtGuildName = <fgui.GTextField>this.getChild("txtGuildName");
    this.miniRank = <fgui.GComponent>this.getChild("miniRank");
    this.gName = <fgui.GGroup>this.getChild("gName");
    this.btnChallenge = <fgui.GButton>this.getChild("btnChallenge");
    this.imgRankBg = <fgui.GLoader>this.getChild("imgRankBg");
    this.txtRank = <fgui.GTextField>this.getChild("txtRank");
    this.gChallenge = <fgui.GGroup>this.getChild("gChallenge");
    this.txtPower = <fgui.GTextField>this.getChild("txtPower");
    this.txtScore = <fgui.GTextField>this.getChild("txtScore");
    this.gScore = <fgui.GGroup>this.getChild("gScore");
    this.btnOwnerOpt = <fgui.GButton>this.getChild("btnOwnerOpt");
  }
}
