// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_IconAvatarFrame extends fgui.GComponent {
  public c1: fgui.Controller;
  public head: fgui.GLoader;
  public frame: fgui.GLoader;
  public group: fgui.GGroup;
  public static URL: string = "ui://4x3i47txgq0dmigi";

  public static createInstance(): FUI_IconAvatarFrame {
    return <FUI_IconAvatarFrame>(
      fgui.UIPackage.createObject("BaseCommon", "IconAvatarFrame")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.head = <fgui.GLoader>this.getChild("head");
    this.frame = <fgui.GLoader>this.getChild("frame");
    this.group = <fgui.GGroup>this.getChild("group");
  }
}
