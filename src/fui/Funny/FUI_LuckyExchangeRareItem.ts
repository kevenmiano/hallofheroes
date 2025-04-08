/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_LuckyExchangeRareItem extends fgui.GComponent {
  public baseItem: fgui.GButton;
  public mc: fgui.GMovieClip;
  public static URL: string = "ui://lzu8jcp27mu3ic2";

  public static createInstance(): FUI_LuckyExchangeRareItem {
    return <FUI_LuckyExchangeRareItem>(
      fgui.UIPackage.createObject("Funny", "LuckyExchangeRareItem")
    );
  }

  protected onConstruct(): void {
    this.baseItem = <fgui.GButton>this.getChild("baseItem");
    this.mc = <fgui.GMovieClip>this.getChild("mc");
  }
}
