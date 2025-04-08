/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TaskRingItem extends fgui.GButton {
  public cType: fgui.Controller;
  public bg: fgui.GImage;
  public Img_Shine: fgui.GImage;
  public typeTxt: fgui.GTextField;
  public ringTaskTxt: fgui.GTextField;
  public speedBtn: fgui.GButton;
  public static URL: string = "ui://tny43dz1klgt5n";

  public static createInstance(): FUI_TaskRingItem {
    return <FUI_TaskRingItem>(
      fgui.UIPackage.createObject("Home", "TaskRingItem")
    );
  }

  protected onConstruct(): void {
    this.cType = this.getController("cType");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.Img_Shine = <fgui.GImage>this.getChild("Img_Shine");
    this.typeTxt = <fgui.GTextField>this.getChild("typeTxt");
    this.ringTaskTxt = <fgui.GTextField>this.getChild("ringTaskTxt");
    this.speedBtn = <fgui.GButton>this.getChild("speedBtn");
  }
}
