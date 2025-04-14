import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { PackageOut } from "../../core/net/PackageOut";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SNSEvent } from "../constant/event/NotificationEvent";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { BaseSnsInfo } from "../datas/BaseSnsInfo";
// import LoaderInfo from "../datas/LoaderInfo";
import { SNSModel } from "../datas/model/SNSModel";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "./ArmyManager";
import LangManager from "../../core/lang/LangManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { FilterWordManager } from "./FilterWordManager";
import { SocketManager } from "../../core/net/SocketManager";

//@ts-expect-error: External dependencies
import SNSInfoMsg = com.road.yishi.proto.simple.SNSInfoMsg;

//@ts-expect-error: External dependencies
import SNSUpdatedMsg = com.road.yishi.proto.simple.SNSUpdatedMsg;
import { MessageTipManager } from "./MessageTipManager";

/**
 * 主要负责SNS模块的协议处理, 提供协议发送、数据操作的API
 */
export class SNSManager extends GameEventDispatcher {
  private static _Instance: SNSManager;

  public static get Instance(): SNSManager {
    if (!this._Instance) {
      this._Instance = new SNSManager();
    }
    return this._Instance;
  }

  private _model: SNSModel;
  public get model(): SNSModel {
    return this._model;
  }

  constructor() {
    super();
    if (!this._model) {
      this._model = new SNSModel();
    }
    this.addEvent();
  }

  private addEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_CH_SNS_UPDATED,
      this,
      this.__updateSnsInfoHandler,
    );
  }

  /**
   * 收到社交信息更新
   */
  private __updateSnsInfoHandler(pkg: PackageIn) {
    let msg: SNSUpdatedMsg = pkg.readBody(SNSUpdatedMsg) as SNSUpdatedMsg;
    if (msg.result == 1) {
      if (msg.snsInfo.hasOwnProperty("userId")) {
        this.thane.snsInfo.userId = msg.snsInfo.userId;
      }
      if (msg.snsInfo.hasOwnProperty("nickname")) {
        this.thane.snsInfo.nickName = msg.snsInfo.nickname;
      }
      if (msg.snsInfo.hasOwnProperty("headId")) {
        this.thane.snsInfo.headId = msg.snsInfo.headId;
      }
      if (msg.snsInfo.hasOwnProperty("signDesc")) {
        this.thane.snsInfo.sign = msg.snsInfo.signDesc;
      }
      if (msg.snsInfo.hasOwnProperty("sex")) {
        this.thane.snsInfo.sex = msg.snsInfo.sex;
      }
      if (msg.snsInfo.hasOwnProperty("birthdayType")) {
        this.thane.snsInfo.birthdayType = msg.snsInfo.birthdayType;
      }
      if (msg.snsInfo.hasOwnProperty("birthYear")) {
        this.thane.snsInfo.birthYear = msg.snsInfo.birthYear;
      }
      if (msg.snsInfo.hasOwnProperty("birthMonth")) {
        this.thane.snsInfo.birthMonth = msg.snsInfo.birthMonth;
      }
      if (msg.snsInfo.hasOwnProperty("birthDay")) {
        this.thane.snsInfo.birthDay = msg.snsInfo.birthDay;
      }
      if (msg.snsInfo.hasOwnProperty("starId")) {
        this.thane.snsInfo.horoscope = msg.snsInfo.starId;
      }
      if (msg.snsInfo.hasOwnProperty("bloodType")) {
        this.thane.snsInfo.bloodType = msg.snsInfo.bloodType;
      }
      if (msg.snsInfo.hasOwnProperty("country")) {
        this.thane.snsInfo.country = msg.snsInfo.country;
      }
      if (msg.snsInfo.hasOwnProperty("province")) {
        this.thane.snsInfo.province = msg.snsInfo.province;
      }
      if (msg.snsInfo.hasOwnProperty("city")) {
        this.thane.snsInfo.city = msg.snsInfo.city;
      }
      this.dispatchEvent(SNSEvent.SNSINFO_UPDATE);
    } else {
      let str: string = LangManager.Instance.GetTranslation(
        "sns.SNSManager.command01",
      );
      MessageTipManager.Instance.show(str);
    }
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  ////////////////////////////////////////////////////////////////  公开方法
  /**
   *加载社交模板
   *
   */
  public loadSnsTemplate() {
    if (this.model.hasSnsTemp) {
      return;
    }
    // LoaderManagerII.Instance.load(PathManager.snsTempPath, LoaderInfo.COMPRESS_TEXT_LOADER, LoaderPriority.Priority_8, this.__loadSnsTempCompleteHandler);
  }

  /**
   * 加载完成后解析社交模板
   */
  // private __loadSnsTempCompleteHandler(info: LoaderInfo, content: object) {
  //   // 		var temp: XML = XML(content);
  //   // 		var countryList: XMLList = temp.CountryXml.Country;
  //   // 		var provinceList: XMLList = temp.ProvinceXml.Province;
  //   // 		var cityList: XMLList = temp.CityXml.City;
  //   // 		var horoscopeList: XMLList = temp.StarXml.Star;
  //   // 		for each(var country: XML in countryList)
  //   // 		{
  //   // 			var countryObj: Object = new Object();
  //   // 			countryObj["id"] = number(country.@Id);
  //   // 			countryObj["name"] = string(country.@CountryName);
  //   // 			this.model.countryList.push(countryObj);
  //   // 		}
  //   // 		for each(var province: XML in provinceList)
  //   // 		{
  //   // 			var provinceObj: Object = new Object();
  //   // 			provinceObj["id"] = number(province.@Id);
  //   // 			provinceObj["name"] = string(province.@ProvinceName);
  //   // 			if (this.model.provinceList[number(province.@CountryId)])
  //   // 			{
  //   // 				this.model.provinceList[number(province.@CountryId)].push(provinceObj);
  //   // 			}
  //   // 				else
  //   // 				{
  //   // 	var list: Object[] = []();
  //   // 	list.push(provinceObj);
  //   // 	model.provinceList[number(province.@CountryId)] = list;
  //   // }
  //   // 			}
  //   // for each(var city: XML in cityList)
  //   // {
  //   // 	var cityObj: Object = new Object();
  //   // 	cityObj["id"] = number(city.@Id);
  //   // 	cityObj["name"] = string(city.@CityName);
  //   // 	if (model.cityList[number(city.@ProvinceId)])
  //   // 	{
  //   // 		model.cityList[number(city.@ProvinceId)].push(cityObj);
  //   // 	}
  //   // 				else
  //   // 	{
  //   // 		var objList: Object[] = []();
  //   // 		objList.push(cityObj);
  //   // 		model.cityList[number(city.@ProvinceId)] = objList;
  //   // 	}
  //   // }
  //   // for each(var horoscope: XML in horoscopeList)
  //   // {
  //   // 	var horoscopeObj: Object = new Object();
  //   // 	horoscopeObj["id"] = number(horoscope.@Id);
  //   // 	horoscopeObj["name"] = string(horoscope.@StarName);
  //   // 	model.horoscopeList.push(horoscopeObj);
  //   // }
  //   // model.hasSnsTemp = true;
  //   // dispatchEvent(new SNSEvent(SNSEvent.SNSTEMP_LOAD_COMPLETE));
  // }

  ///////////////////////////////////////////////////////////////////  协议发送
  /**
   *发送更新社交信息
   * @param info
   */
  public sendUpdateSnsInfo(info: BaseSnsInfo) {
    let msg: SNSInfoMsg = new SNSInfoMsg();
    msg.userId = info.userId;
    msg.nickname = info.nickName;
    msg.signDesc = FilterWordManager.filterWrod(info.sign);
    msg.sex = info.sex;
    msg.birthdayType = info.birthdayType;
    msg.birthYear = info.birthYear;
    msg.birthMonth = info.birthMonth;
    msg.birthDay = info.birthDay;
    msg.starId = info.horoscope;
    msg.bloodType = info.bloodType;
    msg.country = info.country;
    msg.province = info.province;
    msg.city = info.city;
    SocketManager.Instance.send(C2SProtocol.CH_SNS_UPDATE, msg);
  }

  /**
   * 发送重置社交信息
   */
  public sendResetSnsInfo() {
    var pkg: PackageOut = new PackageOut(C2SProtocol.CH_SNSINFO_RESET);
    SocketManager.Instance.send(C2SProtocol.CH_SNSINFO_RESET, null);
  }

  /**
   *发送需要自动保存的信息（只传需要保存的字段）
   * @param info
   */
  public sendAutoSaveInfo(info: BaseSnsInfo) {
    var pkg: PackageOut = new PackageOut(C2SProtocol.CH_SNS_UPDATE);
    var msg: SNSInfoMsg = new SNSInfoMsg();
    msg.signDesc = FilterWordManager.filterWrod(info.sign);
    SocketManager.Instance.send(C2SProtocol.CH_SNS_UPDATE, msg);
  }
}
