/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MonopolyFinishRewardItem extends fgui.GComponent {
  public iconLoader: fgui.GLoader;
  public profile: fgui.GLoader;
  public title: fgui.GRichTextField;
  public static URL: string = "ui://i4y6lftsvuwdiot";

  public static createInstance(): FUI_MonopolyFinishRewardItem {
    return <FUI_MonopolyFinishRewardItem>(
      fgui.UIPackage.createObject("Monopoly", "MonopolyFinishRewardItem")
    );
  }

  protected onConstruct(): void {
    this.iconLoader = <fgui.GLoader>this.getChild("iconLoader");
    this.profile = <fgui.GLoader>this.getChild("profile");
    this.title = <fgui.GRichTextField>this.getChild("title");
  }
}
