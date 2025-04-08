/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GvgBufferIcon extends fgui.GProgressBar {
  public bufferIcon: fgui.GLoader;
  public txt_num: fgui.GTextField;
  public static URL: string = "ui://8w3m5duwpdrqi9g";

  public static createInstance(): FUI_GvgBufferIcon {
    return <FUI_GvgBufferIcon>(
      fgui.UIPackage.createObject("Consortia", "GvgBufferIcon")
    );
  }

  protected onConstruct(): void {
    this.bufferIcon = <fgui.GLoader>this.getChild("bufferIcon");
    this.txt_num = <fgui.GTextField>this.getChild("txt_num");
  }
}
