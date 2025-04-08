/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CarnivalDayTaskPageItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public isSummer: fgui.Controller;
  public Img_Title_Frame4A: fgui.GImage;
  public Img_Title_Frame4B: fgui.GImage;
  public btn_receive: fgui.GButton;
  public taskTitle: fgui.GTextField;
  public taskDes: fgui.GTextField;
  public taskPoint: fgui.GTextField;
  public static URL: string = "ui://qvbm8hnzpf9kgp";

  public static createInstance(): FUI_CarnivalDayTaskPageItem {
    return <FUI_CarnivalDayTaskPageItem>(
      fgui.UIPackage.createObject("Carnival", "CarnivalDayTaskPageItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.isSummer = this.getController("isSummer");
    this.Img_Title_Frame4A = <fgui.GImage>this.getChild("Img_Title_Frame4A");
    this.Img_Title_Frame4B = <fgui.GImage>this.getChild("Img_Title_Frame4B");
    this.btn_receive = <fgui.GButton>this.getChild("btn_receive");
    this.taskTitle = <fgui.GTextField>this.getChild("taskTitle");
    this.taskDes = <fgui.GTextField>this.getChild("taskDes");
    this.taskPoint = <fgui.GTextField>this.getChild("taskPoint");
  }
}
