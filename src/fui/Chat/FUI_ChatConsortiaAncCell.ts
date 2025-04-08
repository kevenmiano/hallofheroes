/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ChatConsortiaAncCell extends fgui.GComponent {
  public msgContent: fgui.GRichTextField;
  public static URL: string = "ui://5w3rpk77e366x0";

  public static createInstance(): FUI_ChatConsortiaAncCell {
    return <FUI_ChatConsortiaAncCell>(
      fgui.UIPackage.createObject("Chat", "ChatConsortiaAncCell")
    );
  }

  protected onConstruct(): void {
    this.msgContent = <fgui.GRichTextField>this.getChild("msgContent");
  }
}
