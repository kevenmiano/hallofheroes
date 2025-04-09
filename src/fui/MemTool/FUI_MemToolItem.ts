/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MemToolItem extends fgui.GButton {
  public img: fgui.GLoader;
  public txt1: fgui.GTextField;
  public txt2: fgui.GTextField;
  public txt3: fgui.GTextField;
  public txt4: fgui.GTextField;
  public txt5: fgui.GTextField;
  public btnRelease: fgui.GButton;
  public txt2t: fgui.GTextField;
  public txt6: fgui.GTextField;
  public static URL: string = "ui://skpcmomydgdx1";

  public static createInstance(): FUI_MemToolItem {
    return <FUI_MemToolItem>(
      fgui.UIPackage.createObject("MemTool", "MemToolItem")
    );
  }

  protected onConstruct(): void {
    this.img = <fgui.GLoader>this.getChild("img");
    this.txt1 = <fgui.GTextField>this.getChild("txt1");
    this.txt2 = <fgui.GTextField>this.getChild("txt2");
    this.txt3 = <fgui.GTextField>this.getChild("txt3");
    this.txt4 = <fgui.GTextField>this.getChild("txt4");
    this.txt5 = <fgui.GTextField>this.getChild("txt5");
    this.btnRelease = <fgui.GButton>this.getChild("btnRelease");
    this.txt2t = <fgui.GTextField>this.getChild("txt2t");
    this.txt6 = <fgui.GTextField>this.getChild("txt6");
  }
}
