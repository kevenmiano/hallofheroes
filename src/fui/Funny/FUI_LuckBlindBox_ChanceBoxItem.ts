/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LuckBlindBox_ChanceBoxItem extends fgui.GComponent {
  public effect: fgui.Controller;
  public propItem: fgui.GButton;
  public chanceItem: fgui.GTextField;
  public static URL: string = "ui://lzu8jcp2kolxmigh";

  public static createInstance(): FUI_LuckBlindBox_ChanceBoxItem {
    return <FUI_LuckBlindBox_ChanceBoxItem>(
      fgui.UIPackage.createObject("Funny", "LuckBlindBox_ChanceBoxItem")
    );
  }

  protected onConstruct(): void {
    this.effect = this.getController("effect");
    this.propItem = <fgui.GButton>this.getChild("propItem");
    this.chanceItem = <fgui.GTextField>this.getChild("chanceItem");
  }
}
