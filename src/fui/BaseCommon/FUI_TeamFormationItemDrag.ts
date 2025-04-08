/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_TeamFormationItemDrag extends fgui.GButton {
  public imgLevelBg: fgui.GImage;
  public txtLevel: fgui.GTextField;
  public img_nameBg: fgui.GImage;
  public txt_name: fgui.GTextField;
  public icon_job: fgui.GLoader;
  public static URL: string = "ui://4x3i47txp8pki3g";

  public static createInstance(): FUI_TeamFormationItemDrag {
    return <FUI_TeamFormationItemDrag>(
      fgui.UIPackage.createObject("BaseCommon", "TeamFormationItemDrag")
    );
  }

  protected onConstruct(): void {
    this.imgLevelBg = <fgui.GImage>this.getChild("imgLevelBg");
    this.txtLevel = <fgui.GTextField>this.getChild("txtLevel");
    this.img_nameBg = <fgui.GImage>this.getChild("img_nameBg");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
    this.icon_job = <fgui.GLoader>this.getChild("icon_job");
  }
}
