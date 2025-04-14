/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_WarlordsRewardItem extends fgui.GComponent {
  public picLoader: fgui.GLoader;
  public nameTxt: fgui.GTextField;
  public static URL: string = "ui://6fsn69diten51r";

  public static createInstance(): FUI_WarlordsRewardItem {
    return <FUI_WarlordsRewardItem>(
      fgui.UIPackage.createObject("Warlords", "WarlordsRewardItem")
    );
  }

  protected onConstruct(): void {
    this.picLoader = <fgui.GLoader>this.getChild("picLoader");
    this.nameTxt = <fgui.GTextField>this.getChild("nameTxt");
  }
}
