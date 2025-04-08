// @ts-nocheck
/**
 * @author:pzlricky
 * @data: 2020-11-10 18:00
 * @description ***
 */

import { ActionTemplateData } from "../../game/battle/skillsys/mode/ActionTemplateData";
import { ActionTemplateDataCate } from "../../game/config/resolve/ActionTemplateDataCate";
import { ActionTemplateInfoResolveII } from "../../game/config/resolve/ActionTemplateInfoResolveII";
import t_s_action, { t_s_actionData } from "../../game/config/t_s_action";
import t_s_actiontemplate from "../../game/config/t_s_actiontemplate";
import t_s_campaign, { t_s_campaignData } from "../../game/config/t_s_campaign";
import { ConfigType, ConfigUrl } from "../../game/constant/ConfigDefine";
import { PathInfo } from "../../game/datas/PathInfo";
import { SwitchInfo } from "../../game/datas/SwitchInfo";
import { PathManager } from "../../game/manager/PathManager";
import ComponentSetting from "../../game/utils/ComponentSetting";
import GameEventDispatcher from "../event/GameEventDispatcher";
// import IManager from "../Interface/IManager";
import Logger from "../logger/Logger";
import ResMgr from "../res/ResMgr";
import ObjectTranslator from "../utils/ObjectTranslator";
import t_s_upgradetemplate from "../../game/config/t_s_upgradetemplate";
import t_s_config from "../../game/config/t_s_config";
import t_s_transformtemplate from "../../game/config/t_s_transformtemplate";
import t_s_heroai from "../../game/config/t_s_heroai";
import t_s_shop from "../../game/config/t_s_shop";
import { t_s_shopData } from "../../game/config/t_s_shop";
import t_s_map from "../../game/config/t_s_map";
import { ShopGoodsInfo } from "../../game/module/shop/model/ShopGoodsInfo";
import t_s_mapnodeoffset from "../../game/config/t_s_mapnodeoffset";
import t_s_questgood from "../../game/config/t_s_questgood";
import t_s_questcondiction from "../../game/config/t_s_questcondiction";
import t_s_rewardgood from "../../game/config/t_s_rewardgood";
import t_s_rewardcondiction from "../../game/config/t_s_rewardcondiction";
import t_s_firstpay from "../../game/config/t_s_firstpay";
import t_s_fund from "../../game/config/t_s_fund";
import t_s_dropcondition from "../../game/config/t_s_dropcondition";
import t_s_consortialevel, {
  t_s_consortialevelData,
} from "../../game/config/t_s_consortialevel";
import StringUtils from "../../game/utils/StringUtils";
import t_s_dropview from "../../game/config/t_s_dropview";
import t_s_recharge from "../../game/config/t_s_recharge";
import t_s_outcityshop from "../../game/config/t_s_outcityshop";
import { t_s_outcityshopData } from "../../game/config/t_s_outcityshop";
import t_s_consortiaboss from "../../game/config/t_s_consortiaboss";
import t_s_runegem, { t_s_runegemData } from "../../game/config/t_s_runegem";
import t_s_uiplaybase from "../../game/config/t_s_uiplaybase";
import t_s_uiplaylevel from "../../game/config/t_s_uiplaylevel";
import t_s_petequipsuit from "../../game/config/t_s_petequipsuit";
import t_s_attribute from "../../game/config/t_s_attribute";
import t_s_dropitem from "../../game/config/t_s_dropitem";
import t_s_mounttemplate from "../../game/config/t_s_mounttemplate";
import t_s_pettemplate from "../../game/config/t_s_pettemplate";
import t_s_skilltemplate from "../../game/config/t_s_skilltemplate";
import t_s_vipprerogativetemplate from "../../game/config/t_s_vipprerogativetemplate";
import Utils from "../utils/Utils";
import t_s_remotepet from "../../game/config/t_s_remotepet";
import t_s_obtain from "../../game/config/t_s_obtain";
import t_s_qqgrade from "../../game/config/t_s_qqgrade";
import t_s_qqgradeprivilege from "../../game/config/t_s_qqgradeprivilege";
import t_s_qqgradepackage from "../../game/config/t_s_qqgradepackage";
import t_s_singlearenarewards from "../../game/config/t_s_singlearenarewards";
import t_s_runeactivation from "../../game/config/t_s_runeactivation";
import SiteZoneData from "../../game/module/login/model/SiteZoneData";
import t_s_wishingpool from "../../game/config/t_s_wishingpool";
import t_s_itemtemplate from "../../game/config/t_s_itemtemplate";
import t_s_mapmine from "../../game/config/t_s_mapmine";
import t_s_mapphysicposition from "../../game/config/t_s_mapphysicposition";
import t_s_petartifactproperty, {
  t_s_petartifactpropertyData,
} from "../../game/config/t_s_petartifactproperty";
import { SharedManager } from "../../game/manager/SharedManager";
import t_s_extrajobequipstrengthen from "../../game/config/t_s_extrajobequipstrengthen";
import t_s_secret from "../../game/config/t_s_secret";
import t_s_secretevent from "../../game/config/t_s_secretevent";
import t_s_secretoption from "../../game/config/t_s_secretoption";
import t_s_secrettreasure from "../../game/config/t_s_secrettreasure";
/**
    ------------------加载配置示例-----------------
    ConfigMgr.Instance.load(ConfigType.action, (config) => {
        let data:action = ConfigMgr.Instance.getSync(ConfigType.action)
        Logger.log("act data",data.mDataList);
    })
    ------------------加载所有配置示例-----------------
    ConfigMgr.Instance.loadAll(undefined, (config) => {
        let data:WealConfig = ConfigMgr.Instance.getSync(ConfigType.WealConfig)
        Logger.log("data",data.mDataList);
    })
*/

export default class ConfigMgr extends GameEventDispatcher {
  private static _instance: ConfigMgr;

  protected configMapDic = {}; //配置表 KV形式
  protected configMap = {}; //配置表 列表形式
  protected groupCache = {}; //资源组
  protected isLoadConfig = false; //是否加载了全局配置
  protected handleMap = {}; //处理类

  isInit: boolean;
  private _info: SwitchInfo;

  // --------------对应 TempleteManager.loadBaseTemplate 中的处理 -------------
  /**
   * 战斗中的动画模版
   */
  actionTemplate2 = {};
  /**
   * 游戏配置模版
   * 战斗音乐文件名, 以及物价, 建筑最大等级等数值
   */
  configInfoTemplateDic = {};
  /**
   * 任务完成条件模版
   */
  taskCondictionInfoList = {};
  /**
   * 任务物品模版
   */
  taskGoodTemplateList = {};
  /**
   * 任务模版
   */
  taskTemplateDic = {};
  /**
   *悬赏任务完成条件模版
   */
  offerRewardConditionTemplateList = {};
  /**
   * 悬赏任务物品模版
   */
  offerRewardGoodsTemplateList = {};
  /**
   * 悬赏任务模版
   */
  offerRewardTemplateDic = {};
  /**
   * 坐骑模版
   */
  mountTemplateDic = {};
  /**
   * 技能模版
   */
  skillTemplateDic = {};
  /**
   * 符文模板？？？
   */
  runeTemplateDic = {};
  /**
   * 合成模版
   */
  composeTemplateDic = {};
  /**
   * 升级模版
   */
  upgradeTemplateDic = {};
  /**
   * 公会相关模版
   * 建筑, 技能, 祈福等
   */
  consortialevelDic = {};

  runegemDic = {};
  /**
   * 天空之城地图节点模板
   */
  allSpaceDic = {};

  /**
   * 商城物品模版
   */
  shopTemplateDic = {};
  consortiaShopTemplateDic = {};
  athleticsShopTemplateDic = {};
  bloodShopTemplateDic = {};
  mazeShopTemplateDic = {};
  mysteryShopTemplateDic = {};
  farmShopTemplateDic = {};
  shopMainTemplateDic = {};
  mysteryExchangeShopTemplateDic = {};
  warlordsShopTemplateDic = {};
  petExchangeShopTemplateDic = {};
  mineralShopTemplateDic = {};
  advConsortiaShopTemplateDic = {};
  consortiaHighShopTemplateDic = {};
  /**
   * 副本模版
   * 包括单人战役, 多人副本, 试练塔, 战场, 世界BOSS等
   */
  campaignTemplateDic = {};
  pvpWarFightDic = {};
  worldBossDic = {};
  vehicleCampaignDic = {};
  outerCityShopExchangeTemplateDic = {};
  outerCityShopRandomTemplateDic = {};
  planesTemplateDic = {};

  /**
   * 英灵竞技奖励模板
   */
  petChallengeRewardCate = {};
  multilordsShopTemplateDic = {};
  // -------------------------------------------------------------------------

  public static get Instance(): ConfigMgr {
    return this._instance ? this._instance : (this._instance = new ConfigMgr());
  }

  preSetup(t?: any) {}

  setup(t?: any) {
    this.isInit = false;
  }

  public get info(): SwitchInfo {
    return this._info;
  }

  /**
   * 解析开关控制表
   * @param _configXml 开关控制表
   */
  parse(_configXml: any, _siteXml: any) {
    var switchInfo: SwitchInfo = new SwitchInfo();
    this._info = switchInfo;

    let pathInfo = new PathInfo();

    pathInfo.GAME_NAME = _configXml.GAMENAME;
    SharedManager.Instance.localKey = pathInfo.GAME_NAME;

    Logger.open = _configXml!.Terminal;
    //_siteXml
    pathInfo.SITE_ZONE = this.getSiteZone(_siteXml.SITE_ZONE);
    pathInfo.ResourcePath = _siteXml.ResourcePath;
    pathInfo.PAY = _siteXml.PAY;
    pathInfo.UPLOAD_PATH = _siteXml.UPLOAD_PATH;
    //_configXml
    pathInfo.PLATFORM = _configXml.PLATFORM;
    pathInfo.LANGUAGE = _configXml.LANGUAGE;
    pathInfo.SITES = _configXml.SITES;
    pathInfo.LOADINGSUSLIKS = _configXml.LOADINGSUSLIKS;
    pathInfo.LOGIN_CHECK_NICK = _configXml.LOGIN_CHECK_NICK;
    pathInfo.serviceAppID = Number(_configXml.serviceAppID);
    pathInfo.serviceURL = _configXml.serviceURL;
    pathInfo.FACE_NUM = _configXml.FACE_NUM;
    pathInfo.LOGO_CODE = _configXml.LOGO_CODE;
    pathInfo.SECURITY_GRAPHY = _configXml.SECURITY_GRAPHY;
    pathInfo.MICRO_TERMINAL = _configXml.MICRO_TERMINAL;
    pathInfo.BETA_SITES = _configXml.BETAS ? _configXml.BETAS : [];
    pathInfo.RELOAD_ALERT = _configXml.RELOAD_ALERT
      ? Boolean(_configXml.RELOAD_ALERT)
      : false;
    pathInfo.LANGUAGE_DEF = _configXml.LANGUAGE_DEF
      ? _configXml.LANGUAGE_DEF
      : [];
    pathInfo.share_android = _configXml.share_android
      ? _configXml.share_android
      : [];
    pathInfo.share_ios = _configXml.share_ios ? _configXml.share_ios : [];
    pathInfo.share_web = _configXml.share_web ? _configXml.share_web : [];
    ComponentSetting.IOS_VERSION =
      Boolean(_configXml.IOS_INTERROGATION) && Utils.isApp();
    if (Utils.isWxMiniGame()) {
      ComponentSetting.IOS_VERSION =
        Boolean(_configXml.IOS_INTERROGATION) && Laya.Browser.onIOS;
    }
    if (Utils.isApp()) {
      //@ts-ignore
      window.useAstc = Boolean(_configXml.USE_ASTC);
    } else {
      //@ts-ignore
      window.useAstc = false;
    }

    ComponentSetting.VERSION_DOWNS = _configXml.VERSION_DOWNS
      ? _configXml.VERSION_DOWNS
      : [];
    ComponentSetting.VERSION_COMPARE = Boolean(_configXml.VERSION_COMPARE); //是否强提示版本更新
    ComponentSetting.APP_DOWN_URL = String(_configXml.APP_DOWN_URL); //
    if (
      pathInfo.ResourcePath != undefined &&
      StringUtils.trim(pathInfo.ResourcePath) != ""
    )
      Laya.URL.basePath = pathInfo.ResourcePath;
    PathManager.setup(pathInfo);
    this.isInit = true;
  }

  private getSiteZone(value: any): SiteZoneData[] {
    let temp = [];
    for (let key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        let element = value[key];
        let zoneData = new SiteZoneData(element);
        temp.push(zoneData);
      }
    }
    return temp;
  }

  /**
   * 加载配置压缩包
   */
  loadZip(cfgType: ConfigType | string, callFunc?: Function) {
    if (cfgType && this.configMap[cfgType]) {
      callFunc && callFunc(this.configMap[cfgType]);
      return;
    }
    let cfgInfo = this.getConfigInfo(cfgType);
    if (!cfgInfo) {
      callFunc && callFunc(null);
      return;
    }
    let url = ComponentSetting.configZipUrl + cfgInfo.url;
    //先以二进制方式加载zip包
    ResMgr.Instance.loadRes(
      url,
      async (res) => {
        let jsZip = new JSZip();
        //获取ZIP包内容传入JSZip中解析
        let zip = Laya.loader.getRes(url);
        let fileData = await jsZip.loadAsync(zip);

        for (let file in fileData.files) {
          if (file.endsWith("json")) {
            let content = await fileData.file(file).async("string");
            if (!content || content == "") return;
            let jsonData = JSON.parse(content);
            if (!jsonData) return;
            // Logger.start("解析配置表开始");
            let clsData = null;
            let cls = Object.keys(jsonData)[0];
            let clsObj = Laya.ClassUtils.getClass(cls); //layaClassUtils需打开对应添加的配置表注册
            if (!clsObj) {
              cls = file.substring(0, file.lastIndexOf("."));
              clsObj = Laya.ClassUtils.getClass(cls);
            }
            if (clsObj) {
              //解析配置表
              clsData = ObjectTranslator.toInstance(
                jsonData[cls] || jsonData,
                clsObj
              );
              this.configMap[cls] = clsData;
              this.parseConfigToDic(cls, clsData, jsonData[cls] || jsonData);
              // Logger.end("解析配置表结束");
            }
          }
        }
        callFunc && callFunc();
      },
      null,
      Laya.Loader.BUFFER
    );
  }

  /**
   * 加载单个配置文件
   * @param cfgType 配置文件类型
   * @param callFunc
   */
  load(cfgType: ConfigType | string, callFunc?: Function) {
    if (cfgType && this.configMap[cfgType]) {
      callFunc && callFunc(this.configMap[cfgType]);
      return;
    }
    let cfgInfo = this.getConfigInfo(cfgType);
    if (!cfgInfo) {
      callFunc && callFunc(null);
      return;
    }
    let url = "";
    if (
      cfgType == ConfigType.t_s_gameconfig ||
      cfgType == ConfigType.siteConfig
    ) {
      if (Utils.isWxMiniGame() && cfgType == ConfigType.siteConfig) {
        url = cfgInfo.url;
      } else {
        url = cfgInfo.url + "?v=" + new Date().getTime();
      }
    } else if (cfgType == ConfigType.languageLogin) {
      url = cfgInfo.url;
    } else {
      url = ComponentSetting.CONFIG_PREFIX + cfgInfo.url;
    }
    let name = cfgInfo.name;
    let cls = cfgInfo.class;
    ResMgr.Instance.loadRes(
      url,
      (res) => {
        let clsData = null;
        let clsObj = Laya.ClassUtils.getClass(cls); //layaClassUtils需打开对应添加的配置表注册
        if (clsObj) {
          //解析配置表
          if (res && cls) {
            if (
              name == ConfigType.languageLogin ||
              name == ConfigType.language
            ) {
              clsData = ObjectTranslator.toInstance(res, clsObj);
            } else {
              clsData = ObjectTranslator.toInstance(
                name ? res[name] : res,
                clsObj
              );
            }
            this.configMap[cfgType] = clsData;
            this.parseConfigToDic(cfgType, clsData, res[name]);
          }
          callFunc && callFunc(clsData ? clsData : res);
        } else {
          Logger.error("请先用 LayaClassUtils 注册该配置表:", name);
        }
      },
      null,
      Laya.Loader.JSON
    );
  }

  private getConfigInfo(cfgType: ConfigType | string) {
    for (let key in ConfigUrl) {
      if (ConfigUrl.hasOwnProperty(key)) {
        let item = ConfigUrl[key];
        if (item && item.name === cfgType) {
          return item;
        }
      }
    }
  }

  /**
   * 加载所有的配置  所有配置打包在一个Config.json
   * @param cfgType 配置文件类型
   * @param callFunc
   */
  loadAll(cfgType: ConfigType = ConfigType.config, callFunc?: Function) {
    if (this.isLoadConfig) {
      callFunc && callFunc(this.configMap);
      return;
    }
    let url = ComponentSetting.CONFIG_PREFIX + ConfigUrl[cfgType].url;
    ResMgr.Instance.loadRes(
      url,
      (res) => {
        res.forEach((element) => {
          for (const name in element) {
            let cls = this.getClsByName(name);
            if (cls) {
              let clsData = ObjectTranslator.toInstance(element[name], cls);
              this.configMap[name] = clsData;
            }
          }
        });
        this.isLoadConfig = true;
        callFunc && callFunc(this.configMap);
      },
      null,
      Laya.Loader.JSON
    );
  }

  /**
   * 取得需要实例化的类
   * @param name
   * @param class
   */
  getClsByName(name: string) {
    for (const key in ConfigUrl) {
      if (ConfigUrl.hasOwnProperty(key)) {
        const element = ConfigUrl[key];
        if (element.name == name) {
          return element.class;
        }
      }
    }
    return null;
  }

  /**
   * 加载多个配置文件
   * @param cfgTypes 多个配置文件类型
   */
  loadGroup(cfgTypes: ConfigType[]) {
    cfgTypes.forEach((element) => {
      this.load(element);
    });
  }

  /**
   * 同步获取配置文件
   * @param cfgType 配置文件类型
   * @return 列表
   */
  getSync(cfgType: ConfigType | string) {
    if (this.configMap[cfgType]) return this.configMap[cfgType];
    return null;
  }

  /**
   * 异步获取配置文件
   * @param cfgType 配置文件类型
   * @param callFunc
   */
  getAsync(cfgType: ConfigType | string, callFunc?: Function) {
    this.load(cfgType, callFunc);
  }

  /**
   * 清理单个或多个缓存配置
   * @param cfgType 配置文件类型或类型数组
   */
  clear(cfgType: ConfigType | ConfigType[] | string | string[]) {
    if (Array.isArray(cfgType)) {
      cfgType.forEach((element) => {
        this.clear(element);
      });
      return;
    }

    if (cfgType == ConfigType.t_s_action) {
      this.actionTemplate2 = {};
    }

    let url = ComponentSetting.CONFIG_PREFIX + ConfigUrl[cfgType].url;
    Laya.loader.clearRes(url);
    this.handleMap[cfgType] = null;
    this.configMap[cfgType] = null;
    this.configMapDic[cfgType] = null;
  }

  /**
   * 清理所有缓存配置
   */
  clearAll() {
    this.isLoadConfig = false;
    for (const cfgType in this.configMap) {
      let url = ComponentSetting.CONFIG_PREFIX + ConfigUrl[cfgType].url;
      Laya.loader.clearRes(url);
    }
    this.configMap = {};
    this.configMapDic = {};
    this.actionTemplate2 = {};
  }

  /**
   * 同步获取配置文件
   * @param cfgType 配置文件类型
   * @return 字典
   */
  getDicSync(cfgType: ConfigType | string) {
    return this.configMapDic[cfgType];
  }

  /**
   * 获取一张表中的一条数据
   * @param cfgType 配置文件类型
   * @param value   唯一标志
   * @return
   */
  getTemplateByID(cfgType: ConfigType | string, value: string | number) {
    let tmp = this.getDicSync(cfgType);
    if (!tmp) {
      Logger.warn("[ConfigMgr]getTemplateByID 配置未加载 cfgType=", cfgType);
      return null;
    }
    let data = tmp[value];
    if (!data) {
      return null;
    }
    return data;
  }

  /**
   * 把配置表数据解析为字典存储
   * @param cfgType
   * @param clsData
   */
  parseConfigToDic(cfgType: ConfigType | string, clsData: any, list: Object[]) {
    if (!this.configMapDic[cfgType]) this.configMapDic[cfgType] = {};

    let map = this.configMapDic[cfgType];

    let dataList = clsData.mDataList;
    let element,
      index = -1;
    for (let k in dataList) {
      element = dataList[k];
      index++;
      // }
      // clsData.mDataList.forEach((element, index) => {
      let key = null;
      let typeKey = null;
      let sontypeKey = null;
      //类型分组
      if (element.hasOwnProperty("Types")) {
        typeKey = "Types" + element["Types"];
      }

      if (element.hasOwnProperty("Type")) {
        typeKey = "Type" + element["Type"];
      }

      if (element.hasOwnProperty("SonType")) {
        sontypeKey = "SonType" + element["SonType"];
      }

      if (clsData instanceof t_s_itemtemplate) {
        typeKey = "Property1" + element["Property1"];
      }

      if (clsData instanceof t_s_skilltemplate) {
        typeKey = "MasterType" + element["MasterType"];
      }

      if (clsData instanceof t_s_vipprerogativetemplate) {
        typeKey = "Grade" + element["grade"];
      }

      if (clsData instanceof t_s_pettemplate) {
        typeKey = "PetType" + element["PetType"];
      }

      if (clsData instanceof t_s_mounttemplate) {
        typeKey = "MountType" + element["MountType"];
      }

      if (
        clsData instanceof t_s_actiontemplate ||
        clsData instanceof t_s_action
      ) {
        key = element["ActionId"];
      } else if (clsData instanceof t_s_campaign) {
        key = element["CampaignId"];
      } else if (
        clsData instanceof t_s_upgradetemplate ||
        clsData instanceof t_s_map ||
        clsData instanceof t_s_wishingpool
      ) {
        key = element["Id"];
      } else if (clsData instanceof t_s_config) {
        key = element["ConfigName"];
      } else if (clsData instanceof t_s_transformtemplate) {
        key = element["TransformId"];
      } else if (clsData instanceof t_s_shop) {
        key = element["Id"];
      } else if (clsData instanceof t_s_recharge) {
        key = element["ProductId"];
      } else if (clsData instanceof t_s_mapnodeoffset) {
        key = element["path"];
      } else if (clsData instanceof t_s_questgood) {
        key = element["TemplateId"] + "_" + element["RewardItemID"];
      } else if (clsData instanceof t_s_rewardgood) {
        key =
          element["TemplateId"] +
          "_" +
          element["RepeatStep"] +
          "_" +
          element["RewardItemID"] +
          "_" +
          element["RewardItemCount"] +
          "_" +
          element["RepeatMinLevel"] +
          element["RepeatMaxLevel"];
      } else if (clsData instanceof t_s_questcondiction) {
        key = element["TemplateId"] + "_" + element["CondictionID"];
      } else if (clsData instanceof t_s_firstpay) {
        key = element["Time"] + "_" + element["Jobs"] + "_" + element["Gender"];
      } else if (clsData instanceof t_s_fund) {
        key = element["Grade"];
      } else if (clsData instanceof t_s_dropcondition) {
        key = element["DropId"];
        typeKey = "CondictionType" + element["CondictionType"];
      } else if (clsData instanceof t_s_dropview) {
        key = element["Site"];
      } else if (clsData instanceof t_s_outcityshop) {
        key = element["MapShopId"];
      } else if (clsData instanceof t_s_consortiaboss) {
        key = element["Level"];
      } else if (clsData instanceof t_s_uiplaybase) {
        key = element["UiPlayId"];
      } else if (clsData instanceof t_s_uiplaylevel) {
        key = element["UiLevelId"];
      } else if (clsData instanceof t_s_petequipsuit) {
        key = element["SuitId"];
      } else if (clsData instanceof t_s_dropitem) {
        key = element["Id"];
        typeKey = "DropId" + element["DropId"];
      } else if (clsData instanceof t_s_attribute) {
        key = element["AttributeId"];
      } else if (clsData instanceof t_s_obtain) {
        key = element["ObtainId"];
      } else if (clsData instanceof t_s_remotepet) {
        typeKey = "Skill" + element["Skill"];
      } else if (clsData instanceof t_s_qqgrade) {
        key = element["Grade"];
      } else if (clsData instanceof t_s_qqgradepackage) {
        key = element["ID"];
      } else if (clsData instanceof t_s_singlearenarewards) {
        key = element["Type"];
      } else if (clsData instanceof t_s_qqgradeprivilege) {
        typeKey = element["Grade"];
      } else if (clsData instanceof t_s_runeactivation) {
        key = element["SKillId"];
      } else if (
        clsData instanceof t_s_mapmine ||
        clsData instanceof t_s_mapphysicposition
      ) {
        key = element["ID"];
      } else if (clsData instanceof t_s_petartifactproperty) {
        key = element["ItemId"];
      } else if (clsData instanceof t_s_extrajobequipstrengthen) {
        key = element["StrengthenLevel"];
      } else if (clsData instanceof t_s_secret) {
        key = element["SecretId"];
      } else if (clsData instanceof t_s_secretevent) {
        key = element["EventId"];
      } else if (clsData instanceof t_s_secretoption) {
        key = element["OptionId"];
      } else if (clsData instanceof t_s_secrettreasure) {
        key = element["TreasureId"];
      } else {
        // 顺序 TemplateId->Id
        if (element.hasOwnProperty("TemplateId")) {
          key = element["TemplateId"];
        } else if (element.hasOwnProperty("Id")) {
          key = element["Id"];
        } else if (element.hasOwnProperty("id")) {
          key = element["id"];
        }
      }
      if (key != "" && key != undefined && !Number.isNaN(key)) {
        let complete = index + 1 == clsData.mDataList.length;
        if (clsData instanceof t_s_action) {
          //对应处理 TempleteManager.loadBaseTemplate
          this.solve_t_s_action(cfgType, key, element, complete);
        } else if (clsData instanceof t_s_campaign) {
          this.solve_t_s_campaign(cfgType, key, element, complete);
        } else if (clsData instanceof t_s_actiontemplate) {
          //把 t_s_**Data  包装一遍, 添加方法处理
          map[key] = new ActionTemplateDataCate(list[index]);
        } else if (clsData instanceof t_s_shop) {
          this.solve_t_s_shop(cfgType, key, element, complete);
        } else if (clsData instanceof t_s_consortialevel) {
          this.solve_t_s_consortialevel(cfgType, key, element, complete);
        } else if (clsData instanceof t_s_outcityshop) {
          this.solve_t_s_outcityshop(cfgType, key, element, complete);
        } else if (clsData instanceof t_s_runegem) {
          this.solve_t_s_runegem(cfgType, key, element, complete);
        } else {
          map[key] = element;
        }
      }
      //类型分组
      if (typeKey) {
        if (!map[typeKey]) map[typeKey] = [];
        map[typeKey].push(element);
      }
      if (sontypeKey) {
        if (!map[sontypeKey]) map[sontypeKey] = [];
        map[sontypeKey].push(element);
      }
    }
  }

  // eg:
  // var actionTemp : ActionTemplateData = TempleteManager.Instance.actionTemplate2[actionId];
  // var actionTemp : ActionTemplateData = ConfigMgr.Instance.actionTemplate2[actionId];
  solve_t_s_action(
    cfgType: ConfigType | string,
    key: string,
    element: t_s_actionData,
    complete: boolean
  ) {
    let map = this.configMapDic[cfgType];
    // 处理方式1 默认处理方式
    map[key] = element;

    // 处理方式2
    if (!this.handleMap[cfgType]) this.handleMap[cfgType] = {};
    let temp = this.handleMap[cfgType];
    temp[key] = temp[key] ? temp[key] : new ActionTemplateInfoResolveII();
    this.actionTemplate2[key] = temp[key].resolveImp(
      element
    ) as ActionTemplateData;

    if (complete) {
      for (const key in this.actionTemplate2) {
        if (this.actionTemplate2.hasOwnProperty(key)) {
          const actionTeamplateData = this.actionTemplate2[key];
          actionTeamplateData.refreshMembers();
        }
      }
    }

    // Logger.log("[ConfigMgr] .actionTemplate2 ", this.actionTemplate2)
  }

  solve_t_s_campaign(
    cfgType: ConfigType | string,
    key: string,
    element: t_s_campaignData,
    complete: boolean
  ) {
    let map = this.configMapDic[cfgType];
    // 处理方式1 默认处理方式
    map[key] = element;

    // 处理方式2
    if (element.Types == 0) {
      this.campaignTemplateDic[element.CampaignId] = element;
    } else if (element.Types == 5) {
      this.pvpWarFightDic[element.CampaignId] = element;
    } else if (element.Types == 9) {
      this.vehicleCampaignDic[element.CampaignId] = element;
    } else if (element.Types >= 1) {
      this.worldBossDic[element.CampaignId] = element;
    }

    // Logger.log("[ConfigMgr] .actionTemplate2 ", this.actionTemplate2)
  }

  solve_t_s_outcityshop(
    cfgType: ConfigType | string,
    key: string,
    element: t_s_outcityshopData,
    complete: boolean
  ) {
    let map = this.configMapDic[cfgType];
    // 处理方式1 默认处理方式
    map[key] = element;
    // 处理方式2
    if (element.Type == 1) {
      this.outerCityShopExchangeTemplateDic[element.MapShopId] = element;
    } else if (element.Type == 2) {
      this.outerCityShopRandomTemplateDic[element.MapShopId] = element;
    } else if (element.Type == 3) {
      this.planesTemplateDic[element.MapShopId] = element;
    }
  }

  solve_t_s_shop(
    cfgType: ConfigType | string,
    key: string,
    element: t_s_shopData,
    complete: boolean
  ) {
    let map = this.configMapDic[cfgType];
    // 处理方式1 默认处理方式
    map[key] = element;
    let goodsTempInfo: ShopGoodsInfo = new ShopGoodsInfo();
    for (let i in element) {
      goodsTempInfo[i] = element[i];
    }
    // 处理方式2
    if (element.ShopType == ShopGoodsInfo.SHOP) {
      this.shopTemplateDic[element.Id] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.CONSORTIA_SHOP) {
      this.consortiaShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.ATHLETICS_SHOP) {
      this.athleticsShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.BLOOD_SHOP) {
      this.bloodShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.MAZE_SHOP) {
      this.mazeShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.MYSTERY_SHOP) {
      this.mysteryShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.FARM_SHOP) {
      this.farmShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.HIDE_SHOP) {
      this.shopMainTemplateDic[element.Id] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.MYSTERY_EXCHANGE_SHOP) {
      this.mysteryExchangeShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.WARLORDS_SHOP) {
      this.warlordsShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.PET_EXCHANGE_SHOP) {
      this.petExchangeShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.MINERAL_SHOP) {
      this.mineralShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.ADVCONSORTIA_SHOP) {
      this.advConsortiaShopTemplateDic[element.ItemId] = goodsTempInfo;
    } else if (element.ShopType == ShopGoodsInfo.CONSORTIA_HIGH_SHOP) {
      this.consortiaHighShopTemplateDic[element.ItemId] = goodsTempInfo;
    }
    goodsTempInfo.init();
  }

  solve_t_s_consortialevel(
    cfgType: ConfigType | string,
    key: string,
    element: t_s_consortialevelData,
    complete: boolean
  ) {
    let map = this.configMapDic[cfgType];
    // 处理方式1 默认处理方式
    map[key] = element;

    // 处理方式2
    this.consortialevelDic[element.TemplateId] = element;
    this.consortialevelDic[element.Types + "_" + element.Levels] = element;
  }

  solve_t_s_runegem(
    cfgType: ConfigType | string,
    key: string,
    element: t_s_runegemData,
    complete: boolean
  ) {
    let map = this.configMapDic[cfgType];
    // 处理方式1 默认处理方式
    map[key] = element;

    // 处理方式2
    this.runegemDic[element.Id] = element;
    this.runegemDic[
      element.Types + "_" + element.Grades + "_" + element.RuneGemTypes
    ] = element;
  }
  public getConfigMap(name: string) {
    return this.configMap[name];
  }
}
