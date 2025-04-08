/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaPrizeAllotItem extends fgui.GComponent {
  public userNameTxt: fgui.GTextField;
  public LevelTxt: fgui.GTextField;
  public fightValueTxt: fgui.GTextField;
  public numStep: fgui.GComponent;
  public static URL: string = "ui://8w3m5duwdy0ji8v";

  public static createInstance(): FUI_ConsortiaPrizeAllotItem {
    return <FUI_ConsortiaPrizeAllotItem>(
      fgui.UIPackage.createObject("Consortia", "ConsortiaPrizeAllotItem")
    );
  }

  protected onConstruct(): void {
    this.userNameTxt = <fgui.GTextField>this.getChild("userNameTxt");
    this.LevelTxt = <fgui.GTextField>this.getChild("LevelTxt");
    this.fightValueTxt = <fgui.GTextField>this.getChild("fightValueTxt");
    this.numStep = <fgui.GComponent>this.getChild("numStep");
  }
}
