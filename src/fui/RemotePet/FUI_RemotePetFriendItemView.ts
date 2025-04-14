/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetFriendItemView extends fgui.GComponent {
  public _icon: fgui.GLoader;
  public redBox: fgui.GImage;
  public powerImg: fgui.GImage;
  public _fightTxt: fgui.GTextField;
  public _nameTxt: fgui.GTextField;
  public static URL: string = "ui://dq4xsyl3m8wx1w";

  public static createInstance(): FUI_RemotePetFriendItemView {
    return <FUI_RemotePetFriendItemView>(
      fgui.UIPackage.createObject("RemotePet", "RemotePetFriendItemView")
    );
  }

  protected onConstruct(): void {
    this._icon = <fgui.GLoader>this.getChild("_icon");
    this.redBox = <fgui.GImage>this.getChild("redBox");
    this.powerImg = <fgui.GImage>this.getChild("powerImg");
    this._fightTxt = <fgui.GTextField>this.getChild("_fightTxt");
    this._nameTxt = <fgui.GTextField>this.getChild("_nameTxt");
  }
}
