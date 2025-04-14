/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_AirGardenGameSuDuItem from "./FUI_AirGardenGameSuDuItem";

export default class FUI_OpSuDuCellGroup extends fgui.GComponent {
  public c0: FUI_AirGardenGameSuDuItem;
  public c1: FUI_AirGardenGameSuDuItem;
  public c2: FUI_AirGardenGameSuDuItem;
  public c3: FUI_AirGardenGameSuDuItem;
  public c4: FUI_AirGardenGameSuDuItem;
  public c5: FUI_AirGardenGameSuDuItem;
  public static URL: string = "ui://qvbm8hnzohnemieu";

  public static createInstance(): FUI_OpSuDuCellGroup {
    return <FUI_OpSuDuCellGroup>(
      fgui.UIPackage.createObject("Carnival", "OpSuDuCellGroup")
    );
  }

  protected onConstruct(): void {
    this.c0 = <FUI_AirGardenGameSuDuItem>this.getChild("c0");
    this.c1 = <FUI_AirGardenGameSuDuItem>this.getChild("c1");
    this.c2 = <FUI_AirGardenGameSuDuItem>this.getChild("c2");
    this.c3 = <FUI_AirGardenGameSuDuItem>this.getChild("c3");
    this.c4 = <FUI_AirGardenGameSuDuItem>this.getChild("c4");
    this.c5 = <FUI_AirGardenGameSuDuItem>this.getChild("c5");
  }
}
