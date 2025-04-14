/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WarlordsPlayerItem extends fgui.GComponent {
  public c1: fgui.Controller;
  public nameTxt: fgui.GTextField;
  public personPic2: fgui.GImage;
  public personPic3: fgui.GImage;
  public personPic1: fgui.GImage;
  public static URL: string = "ui://6fsn69didw9z10";

  public static createInstance(): FUI_WarlordsPlayerItem {
    return <FUI_WarlordsPlayerItem>(
      fgui.UIPackage.createObject("Warlords", "WarlordsPlayerItem")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.nameTxt = <fgui.GTextField>this.getChild("nameTxt");
    this.personPic2 = <fgui.GImage>this.getChild("personPic2");
    this.personPic3 = <fgui.GImage>this.getChild("personPic3");
    this.personPic1 = <fgui.GImage>this.getChild("personPic1");
  }
}
