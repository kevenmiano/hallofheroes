/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CastleBuildInfoItem extends fgui.GComponent {
  public buildNameTxt: fgui.GTextField;
  public levelTxt: fgui.GTextField;
  public lookInfoBtn: fgui.GButton;
  public static URL: string = "ui://sm9fel4l95p3y";

  public static createInstance(): FUI_CastleBuildInfoItem {
    return <FUI_CastleBuildInfoItem>(
      fgui.UIPackage.createObject("Castle", "CastleBuildInfoItem")
    );
  }

  protected onConstruct(): void {
    this.buildNameTxt = <fgui.GTextField>this.getChild("buildNameTxt");
    this.levelTxt = <fgui.GTextField>this.getChild("levelTxt");
    this.lookInfoBtn = <fgui.GButton>this.getChild("lookInfoBtn");
  }
}
