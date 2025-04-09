/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CastleDefenceView extends fgui.GComponent {
  public status: fgui.Controller;
  public nameBg: fgui.GImage;
  public consortiaNameTxt: fgui.GTextField;
  public cityNameTxt: fgui.GTextField;
  public imgFlag: fgui.GLoader;
  public imgFlag2: fgui.GLoader;
  public static URL: string = "ui://xcvl5694r54oilm";

  public static createInstance(): FUI_CastleDefenceView {
    return <FUI_CastleDefenceView>(
      fgui.UIPackage.createObject("OuterCity", "CastleDefenceView")
    );
  }

  protected onConstruct(): void {
    this.status = this.getController("status");
    this.nameBg = <fgui.GImage>this.getChild("nameBg");
    this.consortiaNameTxt = <fgui.GTextField>this.getChild("consortiaNameTxt");
    this.cityNameTxt = <fgui.GTextField>this.getChild("cityNameTxt");
    this.imgFlag = <fgui.GLoader>this.getChild("imgFlag");
    this.imgFlag2 = <fgui.GLoader>this.getChild("imgFlag2");
  }
}
