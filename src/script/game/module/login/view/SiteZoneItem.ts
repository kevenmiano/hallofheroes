//@ts-expect-error: External dependencies
import FUI_SiteZoneItem from "../../../../../fui/Login/FUI_SiteZoneItem";
import { getdefaultLangageCfg } from "../../../../core/lang/LanguageDefine";
import SiteZoneData from "../model/SiteZoneData";

export default class SiteZoneItem extends FUI_SiteZoneItem {
  private _siteData: any;

  protected onConstruct(): void {
    super.onConstruct();
  }

  public set info(value: SiteZoneData) {
    this._siteData = value;
    let langCfg = getdefaultLangageCfg();
    this.siteName.text = value.siteName[langCfg.key];
  }

  public get info(): SiteZoneData {
    return this._siteData;
  }
}
