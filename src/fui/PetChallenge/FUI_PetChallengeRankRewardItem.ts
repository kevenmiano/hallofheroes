/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetChallengeRankRewardItem extends fgui.GComponent {
  public imgRank: fgui.GLoader;
  public txtAppell: fgui.GTextField;
  public txtAppellValue: fgui.GTextField;
  public txtAttr: fgui.GTextField;
  public txtAttrValue: fgui.GTextField;
  public txtUpDesc: fgui.GTextField;
  public static URL: string = "ui://qwu5t408h4lgiba";

  public static createInstance(): FUI_PetChallengeRankRewardItem {
    return <FUI_PetChallengeRankRewardItem>(
      fgui.UIPackage.createObject("PetChallenge", "PetChallengeRankRewardItem")
    );
  }

  protected onConstruct(): void {
    this.imgRank = <fgui.GLoader>this.getChild("imgRank");
    this.txtAppell = <fgui.GTextField>this.getChild("txtAppell");
    this.txtAppellValue = <fgui.GTextField>this.getChild("txtAppellValue");
    this.txtAttr = <fgui.GTextField>this.getChild("txtAttr");
    this.txtAttrValue = <fgui.GTextField>this.getChild("txtAttrValue");
    this.txtUpDesc = <fgui.GTextField>this.getChild("txtUpDesc");
  }
}
