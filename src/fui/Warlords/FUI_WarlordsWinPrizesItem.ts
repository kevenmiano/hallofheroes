/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WarlordsWinPrizesItem extends fgui.GComponent {
  public itemBg: fgui.GImage;
  public nickNameTxt: fgui.GTextField;
  public baseItem: fgui.GButton;
  public static URL: string = "ui://6fsn69didw9z14";

  public static createInstance(): FUI_WarlordsWinPrizesItem {
    return <FUI_WarlordsWinPrizesItem>(
      fgui.UIPackage.createObject("Warlords", "WarlordsWinPrizesItem")
    );
  }

  protected onConstruct(): void {
    this.itemBg = <fgui.GImage>this.getChild("itemBg");
    this.nickNameTxt = <fgui.GTextField>this.getChild("nickNameTxt");
    this.baseItem = <fgui.GButton>this.getChild("baseItem");
  }
}
