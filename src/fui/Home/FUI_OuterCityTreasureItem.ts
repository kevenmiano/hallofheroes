/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_posLinkItem from "./FUI_posLinkItem";

export default class FUI_OuterCityTreasureItem extends fgui.GComponent {
  public bigImg: fgui.GImage;
  public smallImg: fgui.GImage;
  public link: FUI_posLinkItem;
  public userNameTxt: fgui.GTextField;
  public static URL: string = "ui://tny43dz1t3oxhvg";

  public static createInstance(): FUI_OuterCityTreasureItem {
    return <FUI_OuterCityTreasureItem>(
      fgui.UIPackage.createObject("Home", "OuterCityTreasureItem")
    );
  }

  protected onConstruct(): void {
    this.bigImg = <fgui.GImage>this.getChild("bigImg");
    this.smallImg = <fgui.GImage>this.getChild("smallImg");
    this.link = <FUI_posLinkItem>this.getChild("link");
    this.userNameTxt = <fgui.GTextField>this.getChild("userNameTxt");
  }
}
