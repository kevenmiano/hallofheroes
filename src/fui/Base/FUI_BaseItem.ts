/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_BaseItem extends fgui.GButton {
  public type: fgui.Controller;
  public isLack: fgui.Controller;
  public isConsume: fgui.Controller;
  public isActive: fgui.Controller;
  public privacy: fgui.Controller;
  public isArtifact: fgui.Controller;
  public isIdentify: fgui.Controller;
  public back: fgui.GLoader;
  public profile: fgui.GLoader;
  public Img_Consume: fgui.GImage;
  public privacy_title: fgui.GTextField;
  public strengthenIcon: fgui.GLoader;
  public fashionImage: fgui.GImage;
  public fashionText: fgui.GTextField;
  public fashion: fgui.GGroup;
  public img_better: fgui.GImage;
  public inlayItem1: fgui.GLoader;
  public inlayItem2: fgui.GLoader;
  public inlayItem3: fgui.GLoader;
  public inlayItem4: fgui.GLoader;
  public suit_icon: fgui.GLoader;
  public levelTxt: fgui.GRichTextField;
  public nameTxt: fgui.GTextField;
  public static URL: string = "ui://og5jeos3mv0ji49";

  public static createInstance(): FUI_BaseItem {
    return <FUI_BaseItem>fgui.UIPackage.createObject("Base", "BaseItem");
  }

  protected onConstruct(): void {
    this.type = this.getController("type");
    this.isLack = this.getController("isLack");
    this.isConsume = this.getController("isConsume");
    this.isActive = this.getController("isActive");
    this.privacy = this.getController("privacy");
    this.isArtifact = this.getController("isArtifact");
    this.isIdentify = this.getController("isIdentify");
    this.back = <fgui.GLoader>this.getChild("back");
    this.profile = <fgui.GLoader>this.getChild("profile");
    this.Img_Consume = <fgui.GImage>this.getChild("Img_Consume");
    this.privacy_title = <fgui.GTextField>this.getChild("privacy_title");
    this.strengthenIcon = <fgui.GLoader>this.getChild("strengthenIcon");
    this.fashionImage = <fgui.GImage>this.getChild("fashionImage");
    this.fashionText = <fgui.GTextField>this.getChild("fashionText");
    this.fashion = <fgui.GGroup>this.getChild("fashion");
    this.img_better = <fgui.GImage>this.getChild("img_better");
    this.inlayItem1 = <fgui.GLoader>this.getChild("inlayItem1");
    this.inlayItem2 = <fgui.GLoader>this.getChild("inlayItem2");
    this.inlayItem3 = <fgui.GLoader>this.getChild("inlayItem3");
    this.inlayItem4 = <fgui.GLoader>this.getChild("inlayItem4");
    this.suit_icon = <fgui.GLoader>this.getChild("suit_icon");
    this.levelTxt = <fgui.GRichTextField>this.getChild("levelTxt");
    this.nameTxt = <fgui.GTextField>this.getChild("nameTxt");
  }
}
