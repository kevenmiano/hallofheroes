/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_comUnFolder from "./FUI_comUnFolder";

export default class FUI_ChestItem extends fgui.GComponent {
  public imgFolderBg: fgui.GImage;
  public comUnFolder: FUI_comUnFolder;
  public static URL: string = "ui://rmfxuq3pbtxo3";

  public static createInstance(): FUI_ChestItem {
    return <FUI_ChestItem>(
      fgui.UIPackage.createObject("ChestFrame", "ChestItem")
    );
  }

  protected onConstruct(): void {
    this.imgFolderBg = <fgui.GImage>this.getChild("imgFolderBg");
    this.comUnFolder = <FUI_comUnFolder>this.getChild("comUnFolder");
  }
}
