/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SmallMapTreasureItem extends fgui.GComponent {
  public iconLoader: fgui.GLoader;
  public consortiaNameTxt: fgui.GTextField;
  public treasureNameTxt: fgui.GTextField;
  public static URL: string = "ui://xcvl5694fuyfmix4";

  public static createInstance(): FUI_SmallMapTreasureItem {
    return <FUI_SmallMapTreasureItem>(
      fgui.UIPackage.createObject("OuterCity", "SmallMapTreasureItem")
    );
  }

  protected onConstruct(): void {
    this.iconLoader = <fgui.GLoader>this.getChild("iconLoader");
    this.consortiaNameTxt = <fgui.GTextField>this.getChild("consortiaNameTxt");
    this.treasureNameTxt = <fgui.GTextField>this.getChild("treasureNameTxt");
  }
}
