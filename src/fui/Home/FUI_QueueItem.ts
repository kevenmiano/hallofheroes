/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_QueueItem extends fgui.GButton {
  public cType: fgui.Controller;
  public bg: fgui.GImage;
  public titleTxt1: fgui.GRichTextField;
  public Btn_CompImmediately: fgui.GButton;
  public static URL: string = "ui://tny43dz1z5dt6f";

  public static createInstance(): FUI_QueueItem {
    return <FUI_QueueItem>fgui.UIPackage.createObject("Home", "QueueItem");
  }

  protected onConstruct(): void {
    this.cType = this.getController("cType");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.titleTxt1 = <fgui.GRichTextField>this.getChild("titleTxt1");
    this.Btn_CompImmediately = <fgui.GButton>(
      this.getChild("Btn_CompImmediately")
    );
  }
}
