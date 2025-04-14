/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_MemoryCardItemUnFold from "./FUI_MemoryCardItemUnFold";

export default class FUI_MemoryCardItem extends fgui.GButton {
  public imgSelect: fgui.GImage;
  public comFront: FUI_MemoryCardItemUnFold;
  public comBack: fgui.GImage;
  public static URL: string = "ui://4x3i47txpir4ibu";

  public static createInstance(): FUI_MemoryCardItem {
    return <FUI_MemoryCardItem>(
      fgui.UIPackage.createObject("BaseCommon", "MemoryCardItem")
    );
  }

  protected onConstruct(): void {
    this.imgSelect = <fgui.GImage>this.getChild("imgSelect");
    this.comFront = <FUI_MemoryCardItemUnFold>this.getChild("comFront");
    this.comBack = <fgui.GImage>this.getChild("comBack");
  }
}
