import Dictionary from "../../../core/utils/Dictionary";
import LangManager from "../../../core/lang/LangManager";

/**
 * SNS模块数据的存储、处理类, 提供数据操作的API
 */
export class SNSModel {
  /**
   *是否已加载完社交模板
   */
  public hasSnsTemp: boolean = false;
  /**
   *国家列表
   */
  public countryList: object[];
  /**
   *省份列表
   */
  public provinceList: Dictionary;
  /**
   *城市列表
   */
  public cityList: Dictionary;
  /**
   *星座列表
   */
  public horoscopeList: object[];
  /**
   *性别列表
   */
  public sexList: Dictionary;
  /**
   *血型列表
   */
  public bloodTypeList: Dictionary;

  constructor() {
    this.countryList = [];
    this.provinceList = new Dictionary();
    this.cityList = new Dictionary();
    this.horoscopeList = [];

    this.sexList = new Dictionary();
    var str: string = LangManager.Instance.GetTranslation("sns.SNSModel.sex01");
    this.sexList[1] = { id: "1", name: str };
    str = LangManager.Instance.GetTranslation("sns.SNSModel.sex02");
    this.sexList[2] = { id: "2", name: str };

    this.bloodTypeList = new Dictionary();
    str = LangManager.Instance.GetTranslation("sns.SNSModel.blood01");
    this.bloodTypeList[1] = { id: "1", name: str };
    str = LangManager.Instance.GetTranslation("sns.SNSModel.blood02");
    this.bloodTypeList[2] = { id: "2", name: str };
    str = LangManager.Instance.GetTranslation("sns.SNSModel.blood03");
    this.bloodTypeList[3] = { id: "3", name: str };
    str = LangManager.Instance.GetTranslation("sns.SNSModel.blood04");
    this.bloodTypeList[4] = { id: "4", name: str };
    str = LangManager.Instance.GetTranslation("sns.SNSModel.blood05");
    this.bloodTypeList[5] = { id: "5", name: str };
  }

  /**
   *通过ID得到星座对象, 没有返回null
   */
  public getHoroscopeObj(id: number): object {
    for (const key in this.horoscopeList) {
      if (Object.prototype.hasOwnProperty.call(this.horoscopeList, key)) {
        const horoscope = this.horoscopeList[key];
        if (horoscope["id"] == id) return horoscope;
      }
    }
    return null;
  }

  /**
   *通过ID得到国家对象, 没有返回null
   */
  public getCountryObj(id: number): object {
    for (const key in this.countryList) {
      if (Object.prototype.hasOwnProperty.call(this.countryList, key)) {
        const country = this.countryList[key];
        if (country["id"] == id) return country;
      }
    }
    return null;
  }

  /**
   *通过ID得到省份对象, 没有返回null
   */
  public getProvinceObj(id: number): object {
    for (const key in this.provinceList) {
      if (Object.prototype.hasOwnProperty.call(this.provinceList, key)) {
        let provinceArr = this.provinceList[key];
        for (const key in provinceArr) {
          if (Object.prototype.hasOwnProperty.call(provinceArr, key)) {
            let province = provinceArr[key];
            if (province["id"] == id) return province;
          }
        }
      }
    }
    return null;
  }

  /**
   *通过ID得到城市对象, 没有返回null
   */
  public getCityObj(id: number): object {
    for (const key in this.cityList) {
      if (Object.prototype.hasOwnProperty.call(this.cityList, key)) {
        const cityArr = this.cityList[key];
        for (const key in cityArr) {
          if (Object.prototype.hasOwnProperty.call(cityArr, key)) {
            const city = cityArr[key];
            if (city["id"] == id) return city;
          }
        }
      }
    }
    return null;
  }
}
