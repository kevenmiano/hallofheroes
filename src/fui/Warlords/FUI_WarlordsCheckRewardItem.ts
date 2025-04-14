/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WarlordsCheckRewardItem extends fgui.GComponent {
  public itemBg: fgui.GImage;
  public rankTxt: fgui.GTextField;
  public rewardList: fgui.GList;
  public static URL: string = "ui://6fsn69didw9z16";

  public static createInstance(): FUI_WarlordsCheckRewardItem {
    return <FUI_WarlordsCheckRewardItem>(
      fgui.UIPackage.createObject("Warlords", "WarlordsCheckRewardItem")
    );
  }

  protected onConstruct(): void {
    this.itemBg = <fgui.GImage>this.getChild("itemBg");
    this.rankTxt = <fgui.GTextField>this.getChild("rankTxt");
    this.rewardList = <fgui.GList>this.getChild("rewardList");
  }
}
