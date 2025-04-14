/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_posLinkItem from "./FUI_posLinkItem";

export default class FUI_OuterCityBossInfoView extends fgui.GComponent {
  public showBossCtr: fgui.Controller;
  public btn_help2: fgui.GButton;
  public statusTxt: fgui.GTextField;
  public bossTreasureList: fgui.GList;
  public location: FUI_posLinkItem;
  public btn_help: fgui.GButton;
  public _enemyCountTxt0: fgui.GTextField;
  public _enemyCountTxt1: fgui.GTextField;
  public _enemyCountTxt2: fgui.GTextField;
  public bossInfoTxt: FUI_posLinkItem;
  public static URL: string = "ui://tny43dz1nn3jhtv";

  public static createInstance(): FUI_OuterCityBossInfoView {
    return <FUI_OuterCityBossInfoView>(
      fgui.UIPackage.createObject("Home", "OuterCityBossInfoView")
    );
  }

  protected onConstruct(): void {
    this.showBossCtr = this.getController("showBossCtr");
    this.btn_help2 = <fgui.GButton>this.getChild("btn_help2");
    this.statusTxt = <fgui.GTextField>this.getChild("statusTxt");
    this.bossTreasureList = <fgui.GList>this.getChild("bossTreasureList");
    this.location = <FUI_posLinkItem>this.getChild("location");
    this.btn_help = <fgui.GButton>this.getChild("btn_help");
    this._enemyCountTxt0 = <fgui.GTextField>this.getChild("_enemyCountTxt0");
    this._enemyCountTxt1 = <fgui.GTextField>this.getChild("_enemyCountTxt1");
    this._enemyCountTxt2 = <fgui.GTextField>this.getChild("_enemyCountTxt2");
    this.bossInfoTxt = <FUI_posLinkItem>this.getChild("bossInfoTxt");
  }
}
