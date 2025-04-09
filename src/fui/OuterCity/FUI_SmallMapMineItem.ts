/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SmallMapMineItem extends fgui.GComponent {
  public picLoader: fgui.GLoader;
  public levelTxt: fgui.GTextField;
  public countList: fgui.GList;
  public static URL: string = "ui://xcvl5694fuyfmix6";

  public static createInstance(): FUI_SmallMapMineItem {
    return <FUI_SmallMapMineItem>(
      fgui.UIPackage.createObject("OuterCity", "SmallMapMineItem")
    );
  }

  protected onConstruct(): void {
    this.picLoader = <fgui.GLoader>this.getChild("picLoader");
    this.levelTxt = <fgui.GTextField>this.getChild("levelTxt");
    this.countList = <fgui.GList>this.getChild("countList");
  }
}
