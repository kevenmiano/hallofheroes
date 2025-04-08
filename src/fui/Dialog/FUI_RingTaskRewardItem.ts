/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RingTaskRewardItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public Img_rewardType1: fgui.GImage;
  public Img_rewardType2: fgui.GImage;
  public Img_rewardType3: fgui.GImage;
  public Img_rewardType4: fgui.GImage;
  public Img_rewardType5: fgui.GImage;
  public Img_rewardType6: fgui.GImage;
  public rewardCountTxt: fgui.GTextField;
  public static URL: string = "ui://ulm55jf7t604i75";

  public static createInstance(): FUI_RingTaskRewardItem {
    return <FUI_RingTaskRewardItem>(
      fgui.UIPackage.createObject("Dialog", "RingTaskRewardItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.Img_rewardType1 = <fgui.GImage>this.getChild("Img_rewardType1");
    this.Img_rewardType2 = <fgui.GImage>this.getChild("Img_rewardType2");
    this.Img_rewardType3 = <fgui.GImage>this.getChild("Img_rewardType3");
    this.Img_rewardType4 = <fgui.GImage>this.getChild("Img_rewardType4");
    this.Img_rewardType5 = <fgui.GImage>this.getChild("Img_rewardType5");
    this.Img_rewardType6 = <fgui.GImage>this.getChild("Img_rewardType6");
    this.rewardCountTxt = <fgui.GTextField>this.getChild("rewardCountTxt");
  }
}
