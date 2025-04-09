/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PetChallengeScoreRewardItem extends fgui.GButton {
  public list: fgui.GList;
  public txtScore: fgui.GTextField;
  public static URL: string = "ui://qwu5t408ysufj";

  public static createInstance(): FUI_PetChallengeScoreRewardItem {
    return <FUI_PetChallengeScoreRewardItem>(
      fgui.UIPackage.createObject("PetChallenge", "PetChallengeScoreRewardItem")
    );
  }

  protected onConstruct(): void {
    this.list = <fgui.GList>this.getChild("list");
    this.txtScore = <fgui.GTextField>this.getChild("txtScore");
  }
}
