/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SpecialSelecteItem extends fgui.GComponent {
  public NameTxt1: fgui.GTextField;
  public NameTxt2: fgui.GTextField;
  public NameTxt3: fgui.GTextField;
  public Btn_select: fgui.GButton;
  public playerCom: fgui.GLoader;
  public static URL: string = "ui://u5b8u6g0dp9dq";

  public static createInstance(): FUI_SpecialSelecteItem {
    return <FUI_SpecialSelecteItem>(
      fgui.UIPackage.createObject("Allocate", "SpecialSelecteItem")
    );
  }

  protected onConstruct(): void {
    this.NameTxt1 = <fgui.GTextField>this.getChild("NameTxt1");
    this.NameTxt2 = <fgui.GTextField>this.getChild("NameTxt2");
    this.NameTxt3 = <fgui.GTextField>this.getChild("NameTxt3");
    this.Btn_select = <fgui.GButton>this.getChild("Btn_select");
    this.playerCom = <fgui.GLoader>this.getChild("playerCom");
  }
}
