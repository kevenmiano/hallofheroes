/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MineralAwardCell extends fgui.GComponent {
  public txt_Name: fgui.GRichTextField;
  public static URL: string = "ui://tny43dz1u2izhsx";

  public static createInstance(): FUI_MineralAwardCell {
    return <FUI_MineralAwardCell>(
      fgui.UIPackage.createObject("Home", "MineralAwardCell")
    );
  }

  protected onConstruct(): void {
    this.txt_Name = <fgui.GRichTextField>this.getChild("txt_Name");
  }
}
