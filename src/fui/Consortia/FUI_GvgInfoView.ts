/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GvgInfoView extends fgui.GComponent {
  public bg: fgui.GImage;
  public _buffIcon1: fgui.GLoader;
  public _selfNameTxt: fgui.GTextField;
  public _selfOccupyNumTxt: fgui.GTextField;
  public _selfScoreTxt: fgui.GTextField;
  public _buffTxt1: fgui.GTextField;
  public _targetNameTxt: fgui.GTextField;
  public _targetOccupyNumTxt: fgui.GTextField;
  public _targetScoreTxt: fgui.GTextField;
  public _buffTxt2: fgui.GTextField;
  public _buffIcon2: fgui.GLoader;
  public static URL: string = "ui://8w3m5duwpdrqi9f";

  public static createInstance(): FUI_GvgInfoView {
    return <FUI_GvgInfoView>(
      fgui.UIPackage.createObject("Consortia", "GvgInfoView")
    );
  }

  protected onConstruct(): void {
    this.bg = <fgui.GImage>this.getChild("bg");
    this._buffIcon1 = <fgui.GLoader>this.getChild("_buffIcon1");
    this._selfNameTxt = <fgui.GTextField>this.getChild("_selfNameTxt");
    this._selfOccupyNumTxt = <fgui.GTextField>(
      this.getChild("_selfOccupyNumTxt")
    );
    this._selfScoreTxt = <fgui.GTextField>this.getChild("_selfScoreTxt");
    this._buffTxt1 = <fgui.GTextField>this.getChild("_buffTxt1");
    this._targetNameTxt = <fgui.GTextField>this.getChild("_targetNameTxt");
    this._targetOccupyNumTxt = <fgui.GTextField>(
      this.getChild("_targetOccupyNumTxt")
    );
    this._targetScoreTxt = <fgui.GTextField>this.getChild("_targetScoreTxt");
    this._buffTxt2 = <fgui.GTextField>this.getChild("_buffTxt2");
    this._buffIcon2 = <fgui.GLoader>this.getChild("_buffIcon2");
  }
}
