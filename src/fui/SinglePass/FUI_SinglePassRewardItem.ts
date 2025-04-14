/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SinglePassRewardItem extends fgui.GComponent {
  public rewardBtn: fgui.GButton;
  public descTxt: fgui.GTextField;
  public hasGetImg: fgui.GImage;
  public static URL: string = "ui://udjm963knktx18";

  public static createInstance(): FUI_SinglePassRewardItem {
    return <FUI_SinglePassRewardItem>(
      fgui.UIPackage.createObject("SinglePass", "SinglePassRewardItem")
    );
  }

  protected onConstruct(): void {
    this.rewardBtn = <fgui.GButton>this.getChild("rewardBtn");
    this.descTxt = <fgui.GTextField>this.getChild("descTxt");
    this.hasGetImg = <fgui.GImage>this.getChild("hasGetImg");
  }
}
