/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ForgeTargetItem extends fgui.GComponent {
  public iconTick: fgui.GLoader;
  public item: fgui.GButton;
  public rTxtDesc: fgui.GRichTextField;
  public imgSelectEffect: fgui.GLoader;
  public static URL: string = "ui://eolsofv9w6yfw";

  public static createInstance(): FUI_ForgeTargetItem {
    return <FUI_ForgeTargetItem>(
      fgui.UIPackage.createObject("Forge", "ForgeTargetItem")
    );
  }

  protected onConstruct(): void {
    this.iconTick = <fgui.GLoader>this.getChild("iconTick");
    this.item = <fgui.GButton>this.getChild("item");
    this.rTxtDesc = <fgui.GRichTextField>this.getChild("rTxtDesc");
    this.imgSelectEffect = <fgui.GLoader>this.getChild("imgSelectEffect");
  }
}
