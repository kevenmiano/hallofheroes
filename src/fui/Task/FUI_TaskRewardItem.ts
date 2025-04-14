/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TaskRewardItem extends fgui.GComponent {
  public tipItem: fgui.GButton;
  public rewardCountTxt: fgui.GTextField;
  public static URL: string = "ui://m40vdx3kil8rf";

  public static createInstance(): FUI_TaskRewardItem {
    return <FUI_TaskRewardItem>(
      fgui.UIPackage.createObject("Task", "TaskRewardItem")
    );
  }

  protected onConstruct(): void {
    this.tipItem = <fgui.GButton>this.getChild("tipItem");
    this.rewardCountTxt = <fgui.GTextField>this.getChild("rewardCountTxt");
  }
}
