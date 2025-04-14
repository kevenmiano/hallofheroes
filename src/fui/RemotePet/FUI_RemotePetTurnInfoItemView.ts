/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_MaskIcon from "./FUI_MaskIcon";

export default class FUI_RemotePetTurnInfoItemView extends fgui.GComponent {
  public _icon: FUI_MaskIcon;
  public _minboss_box: fgui.GImage;
  public _boss_box: fgui.GImage;
  public _normal_box: fgui.GImage;
  public _challenge: fgui.GImage;
  public _number: fgui.GTextField;
  public static URL: string = "ui://dq4xsyl3usc91l";

  public static createInstance(): FUI_RemotePetTurnInfoItemView {
    return <FUI_RemotePetTurnInfoItemView>(
      fgui.UIPackage.createObject("RemotePet", "RemotePetTurnInfoItemView")
    );
  }

  protected onConstruct(): void {
    this._icon = <FUI_MaskIcon>this.getChild("_icon");
    this._minboss_box = <fgui.GImage>this.getChild("_minboss_box");
    this._boss_box = <fgui.GImage>this.getChild("_boss_box");
    this._normal_box = <fgui.GImage>this.getChild("_normal_box");
    this._challenge = <fgui.GImage>this.getChild("_challenge");
    this._number = <fgui.GTextField>this.getChild("_number");
  }
}
