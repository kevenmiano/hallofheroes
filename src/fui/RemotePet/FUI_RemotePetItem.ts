/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetItem extends fgui.GComponent {
  public _icon: fgui.GLoader;
  public redBox: fgui.GImage;
  public powerImg: fgui.GImage;
  public _fightTxt: fgui.GTextField;
  public static URL: string = "ui://dq4xsyl3h0f62d";

  public static createInstance(): FUI_RemotePetItem {
    return <FUI_RemotePetItem>(
      fgui.UIPackage.createObject("RemotePet", "RemotePetItem")
    );
  }

  protected onConstruct(): void {
    this._icon = <fgui.GLoader>this.getChild("_icon");
    this.redBox = <fgui.GImage>this.getChild("redBox");
    this.powerImg = <fgui.GImage>this.getChild("powerImg");
    this._fightTxt = <fgui.GTextField>this.getChild("_fightTxt");
  }
}
