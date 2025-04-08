/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RecruitPawnCell extends fgui.GComponent {
  public unLock: fgui.Controller;
  public isEquip: fgui.Controller;
  public bg: fgui.GImage;
  public playerIconBg: fgui.GImage;
  public playerCom: fgui.GLoader;
  public Btn_RecruitPawn: fgui.GButton;
  public Btn_Upgrade: fgui.GButton;
  public needOpenGradeTxt: fgui.GTextField;
  public ownCount: fgui.GTextField;
  public titleNameTxt: fgui.GTextField;
  public static URL: string = "ui://u5b8u6g0jhi08";

  public static createInstance(): FUI_RecruitPawnCell {
    return <FUI_RecruitPawnCell>(
      fgui.UIPackage.createObject("Allocate", "RecruitPawnCell")
    );
  }

  protected onConstruct(): void {
    this.unLock = this.getController("unLock");
    this.isEquip = this.getController("isEquip");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.playerIconBg = <fgui.GImage>this.getChild("playerIconBg");
    this.playerCom = <fgui.GLoader>this.getChild("playerCom");
    this.Btn_RecruitPawn = <fgui.GButton>this.getChild("Btn_RecruitPawn");
    this.Btn_Upgrade = <fgui.GButton>this.getChild("Btn_Upgrade");
    this.needOpenGradeTxt = <fgui.GTextField>this.getChild("needOpenGradeTxt");
    this.ownCount = <fgui.GTextField>this.getChild("ownCount");
    this.titleNameTxt = <fgui.GTextField>this.getChild("titleNameTxt");
  }
}
