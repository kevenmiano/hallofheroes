/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_AirGardenGameMemoryCardItemUnFold from "./FUI_AirGardenGameMemoryCardItemUnFold";

export default class FUI_AirGardenGameMemoryCardItem extends fgui.GButton {
  public imgSelect: fgui.GImage;
  public comFront: FUI_AirGardenGameMemoryCardItemUnFold;
  public comBack: fgui.GImage;
  public txtTestType: fgui.GTextField;
  public static URL: string = "ui://qvbm8hnzr991midb";

  public static createInstance(): FUI_AirGardenGameMemoryCardItem {
    return <FUI_AirGardenGameMemoryCardItem>(
      fgui.UIPackage.createObject("Carnival", "AirGardenGameMemoryCardItem")
    );
  }

  protected onConstruct(): void {
    this.imgSelect = <fgui.GImage>this.getChild("imgSelect");
    this.comFront = <FUI_AirGardenGameMemoryCardItemUnFold>(
      this.getChild("comFront")
    );
    this.comBack = <fgui.GImage>this.getChild("comBack");
    this.txtTestType = <fgui.GTextField>this.getChild("txtTestType");
  }
}
