/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ActivityCodeView extends fgui.GComponent {
  public activitybg: fgui.GImage;
  public title: fgui.GTextField;
  public TextBox: fgui.GComponent;
  public Btn_receive: fgui.GButton;
  public static URL: string = "ui://lzu8jcp2s1u94o";

  public static createInstance(): FUI_ActivityCodeView {
    return <FUI_ActivityCodeView>(
      fgui.UIPackage.createObject("Funny", "ActivityCodeView")
    );
  }

  protected onConstruct(): void {
    this.activitybg = <fgui.GImage>this.getChild("activitybg");
    this.title = <fgui.GTextField>this.getChild("title");
    this.TextBox = <fgui.GComponent>this.getChild("TextBox");
    this.Btn_receive = <fgui.GButton>this.getChild("Btn_receive");
  }
}
