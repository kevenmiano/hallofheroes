/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TaskAddFriendItem extends fgui.GButton {
  public background: fgui.GImage;
  public teamImg: fgui.GImage;
  public icon_background: fgui.GImage;
  public playerIcon: fgui.GComponent;
  public addFriendBtn: fgui.GButton;
  public LevelBg: fgui.GImage;
  public userNameTxt: fgui.GTextField;
  public playerLevelTxt: fgui.GTextField;
  public hpProgress: fgui.GProgressBar;
  public quick_invite: fgui.GTextField;
  public static URL: string = "ui://tny43dz1klgt5b";

  public static createInstance(): FUI_TaskAddFriendItem {
    return <FUI_TaskAddFriendItem>(
      fgui.UIPackage.createObject("Home", "TaskAddFriendItem")
    );
  }

  protected onConstruct(): void {
    this.background = <fgui.GImage>this.getChild("background");
    this.teamImg = <fgui.GImage>this.getChild("teamImg");
    this.icon_background = <fgui.GImage>this.getChild("icon_background");
    this.playerIcon = <fgui.GComponent>this.getChild("playerIcon");
    this.addFriendBtn = <fgui.GButton>this.getChild("addFriendBtn");
    this.LevelBg = <fgui.GImage>this.getChild("LevelBg");
    this.userNameTxt = <fgui.GTextField>this.getChild("userNameTxt");
    this.playerLevelTxt = <fgui.GTextField>this.getChild("playerLevelTxt");
    this.hpProgress = <fgui.GProgressBar>this.getChild("hpProgress");
    this.quick_invite = <fgui.GTextField>this.getChild("quick_invite");
  }
}
