// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_OuterCityWarBuildCharacterItem from "./FUI_OuterCityWarBuildCharacterItem";

export default class FUI_OuterCityWarBuildBriefInfoItem extends fgui.GComponent {
  public imgNameBg: fgui.GImage;
  public txtName: fgui.GTextField;
  public item0: FUI_OuterCityWarBuildCharacterItem;
  public item1: FUI_OuterCityWarBuildCharacterItem;
  public item2: FUI_OuterCityWarBuildCharacterItem;
  public item3: FUI_OuterCityWarBuildCharacterItem;
  public item4: FUI_OuterCityWarBuildCharacterItem;
  public gOppcState: fgui.GGroup;
  public static URL: string = "ui://flign0g5rch1q";

  public static createInstance(): FUI_OuterCityWarBuildBriefInfoItem {
    return <FUI_OuterCityWarBuildBriefInfoItem>(
      fgui.UIPackage.createObject(
        "OuterCityWar",
        "OuterCityWarBuildBriefInfoItem"
      )
    );
  }

  protected onConstruct(): void {
    this.imgNameBg = <fgui.GImage>this.getChild("imgNameBg");
    this.txtName = <fgui.GTextField>this.getChild("txtName");
    this.item0 = <FUI_OuterCityWarBuildCharacterItem>this.getChild("item0");
    this.item1 = <FUI_OuterCityWarBuildCharacterItem>this.getChild("item1");
    this.item2 = <FUI_OuterCityWarBuildCharacterItem>this.getChild("item2");
    this.item3 = <FUI_OuterCityWarBuildCharacterItem>this.getChild("item3");
    this.item4 = <FUI_OuterCityWarBuildCharacterItem>this.getChild("item4");
    this.gOppcState = <fgui.GGroup>this.getChild("gOppcState");
  }
}
