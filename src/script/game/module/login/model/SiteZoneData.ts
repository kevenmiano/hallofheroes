import { multiLangName } from "../../../../core/lang/LanguageDefine";
import Utils from "../../../../core/utils/Utils";

/**区域 */
export enum ZONE_AREA {
  INLANG = 0, //国内
  OVERSEA,
}

export default class SiteZoneData {
  public area: number = 1; //type 0国内  >0海外
  public siteID: number = 0; //siteID
  public siteURL: string = ""; //site前缀
  public platformID: string = ""; //平台ID
  public siteName: multiLangName = {}; //大区名称
  public siteOrder: string = ""; //order地址
  public baseUrl: string = ""; //abstract-sdk 链接
  public appId: number = 0; //appID
  public packageId: number = 0; //packageId
  public android_packageId: number = 0; //packageId
  public official_packageId: number = 0; //official_packageId
  public iOS_packageId: number = 0; //packageId
  public YOUME: string = ""; //游密key

  constructor(data?: object) {
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }

    //区分IOS, Android
    if (this.area != ZONE_AREA.INLANG) {
      if (Utils.isAndroid()) {
        //1 是GP包 sourceId : 2 是官网包（其他三方做协同约定）

        if (window.sourceId == "1") {
          this.packageId = this.android_packageId; //谷歌包
        } else if (window.sourceId == "2") {
          this.packageId = this.official_packageId; //官包
        } else {
          this.packageId = this.android_packageId;
        }
      } else if (Utils.isIOS()) {
        this.packageId = this.iOS_packageId;
      }
    }
  }
}
