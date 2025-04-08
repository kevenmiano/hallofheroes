/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_FarmPetListItem extends fgui.GButton {
  public txtLevel: fgui.GTextField;
  public static URL: string = "ui://rcqiz171pkchhta";

  public static createInstance(): FUI_FarmPetListItem {
    return <FUI_FarmPetListItem>(
      fgui.UIPackage.createObject("Farm", "FarmPetListItem")
    );
  }

  protected onConstruct(): void {
    this.txtLevel = <fgui.GTextField>this.getChild("txtLevel");
  }
}
