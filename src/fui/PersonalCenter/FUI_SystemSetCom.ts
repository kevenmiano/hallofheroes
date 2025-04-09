/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SystemSetCom extends fgui.GComponent {
  public list: fgui.GList;
  public img0: fgui.GImage;
  public img1: fgui.GImage;
  public img2: fgui.GImage;
  public t0: fgui.GTextField;
  public list1: fgui.GList;
  public musicSlider: fgui.GSlider;
  public soundSlider: fgui.GSlider;
  public musicCbx: fgui.GButton;
  public soundCbx: fgui.GButton;
  public txt_pro0: fgui.GTextField;
  public txt_pro1: fgui.GTextField;
  public list2: fgui.GList;
  public static URL: string = "ui://6watmcoibkwqw";

  public static createInstance(): FUI_SystemSetCom {
    return <FUI_SystemSetCom>(
      fgui.UIPackage.createObject("PersonalCenter", "SystemSetCom")
    );
  }

  protected onConstruct(): void {
    this.list = <fgui.GList>this.getChild("list");
    this.img0 = <fgui.GImage>this.getChild("img0");
    this.img1 = <fgui.GImage>this.getChild("img1");
    this.img2 = <fgui.GImage>this.getChild("img2");
    this.t0 = <fgui.GTextField>this.getChild("t0");
    this.list1 = <fgui.GList>this.getChild("list1");
    this.musicSlider = <fgui.GSlider>this.getChild("musicSlider");
    this.soundSlider = <fgui.GSlider>this.getChild("soundSlider");
    this.musicCbx = <fgui.GButton>this.getChild("musicCbx");
    this.soundCbx = <fgui.GButton>this.getChild("soundCbx");
    this.txt_pro0 = <fgui.GTextField>this.getChild("txt_pro0");
    this.txt_pro1 = <fgui.GTextField>this.getChild("txt_pro1");
    this.list2 = <fgui.GList>this.getChild("list2");
  }
}
