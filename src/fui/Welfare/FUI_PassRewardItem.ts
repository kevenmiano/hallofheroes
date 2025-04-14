/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PassRewardItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public txt_level: fgui.GTextField;
  public item2: fgui.GButton;
  public img_lock2: fgui.GImage;
  public img_claim2: fgui.GImage;
  public img_red2: fgui.GMovieClip;
  public group2: fgui.GGroup;
  public item1: fgui.GButton;
  public img_lock1: fgui.GImage;
  public img_claim1: fgui.GImage;
  public img_red1: fgui.GMovieClip;
  public group1: fgui.GGroup;
  public item0: fgui.GButton;
  public img_lock0: fgui.GImage;
  public img_claim0: fgui.GImage;
  public img_red0: fgui.GMovieClip;
  public txt_count: fgui.GTextField;
  public group0: fgui.GGroup;
  public static URL: string = "ui://vw2db6boo9c7i8k";

  public static createInstance(): FUI_PassRewardItem {
    return <FUI_PassRewardItem>(
      fgui.UIPackage.createObject("Welfare", "PassRewardItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.txt_level = <fgui.GTextField>this.getChild("txt_level");
    this.item2 = <fgui.GButton>this.getChild("item2");
    this.img_lock2 = <fgui.GImage>this.getChild("img_lock2");
    this.img_claim2 = <fgui.GImage>this.getChild("img_claim2");
    this.img_red2 = <fgui.GMovieClip>this.getChild("img_red2");
    this.group2 = <fgui.GGroup>this.getChild("group2");
    this.item1 = <fgui.GButton>this.getChild("item1");
    this.img_lock1 = <fgui.GImage>this.getChild("img_lock1");
    this.img_claim1 = <fgui.GImage>this.getChild("img_claim1");
    this.img_red1 = <fgui.GMovieClip>this.getChild("img_red1");
    this.group1 = <fgui.GGroup>this.getChild("group1");
    this.item0 = <fgui.GButton>this.getChild("item0");
    this.img_lock0 = <fgui.GImage>this.getChild("img_lock0");
    this.img_claim0 = <fgui.GImage>this.getChild("img_claim0");
    this.img_red0 = <fgui.GMovieClip>this.getChild("img_red0");
    this.txt_count = <fgui.GTextField>this.getChild("txt_count");
    this.group0 = <fgui.GGroup>this.getChild("group0");
  }
}
