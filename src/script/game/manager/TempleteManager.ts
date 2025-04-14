import ConfigMgr from "../../core/config/ConfigMgr";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import Dictionary from "../../core/utils/Dictionary";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import Utils from "../../core/utils/Utils";
import { t_s_appellData } from "../config/t_s_appell";
import { t_s_attributeData } from "../config/t_s_attribute";
import { t_s_buildingtemplateData } from "../config/t_s_buildingtemplate";
import { t_s_campaignData } from "../config/t_s_campaign";
import { t_s_campaignbufferData } from "../config/t_s_campaignbuffer";
import { t_s_campaigndataData } from "../config/t_s_campaigndata";
import { t_s_carnivaldailychallengeData } from "../config/t_s_carnivaldailychallenge";
import { t_s_carnivalluckdrawData } from "../config/t_s_carnivalluckdraw";
import { t_s_carnivalpointexchangeData } from "../config/t_s_carnivalpointexchange";
import { t_s_chatbubbleData } from "../config/t_s_chatbubble";
import { t_s_composeData } from "../config/t_s_compose";
import { t_s_configData } from "../config/t_s_config";
import { t_s_consortiabossData } from "../config/t_s_consortiaboss";
import { t_s_consortialevelData } from "../config/t_s_consortialevel";
import { t_s_dropconditionData } from "../config/t_s_dropcondition";
import { t_s_dropitemData } from "../config/t_s_dropitem";
import { t_s_dropviewData } from "../config/t_s_dropview";
import { t_s_extrajobData } from "../config/t_s_extrajob";
import { t_s_extrajobequipData } from "../config/t_s_extrajobequip";
import { t_s_extrajobequipstrengthenData } from "../config/t_s_extrajobequipstrengthen";
import { t_s_herotemplateData } from "../config/t_s_herotemplate";
import { t_s_honorequipData } from "../config/t_s_honorequip";
import t_s_itempricelimit from "../config/t_s_itempricelimit";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { t_s_leedtemplateData } from "../config/t_s_leedtemplate";
import { t_s_mapData } from "../config/t_s_map";
import { t_s_mounttemplateData } from "../config/t_s_mounttemplate";
import { t_s_obtainData } from "../config/t_s_obtain";
import { t_s_outcityshopData } from "../config/t_s_outcityshop";
import { t_s_passcheckData } from "../config/t_s_passcheck";
import { t_s_passchecktaskData } from "../config/t_s_passchecktask";
import { t_s_pawntemplateData } from "../config/t_s_pawntemplate";
import { t_s_petartifactpropertyData } from "../config/t_s_petartifactproperty";
import { t_s_petequipqualityData } from "../config/t_s_petequipquality";
import { t_s_petequipstrengthenData } from "../config/t_s_petequipstrengthen";
import { t_s_petequipsuitData } from "../config/t_s_petequipsuit";
import { t_s_pettemplateData } from "../config/t_s_pettemplate";
import { t_s_powcardsuitetemplateData } from "../config/t_s_powcardsuitetemplate";
import { t_s_powcardtemplateData } from "../config/t_s_powcardtemplate";
import t_s_question, { t_s_questionData } from "../config/t_s_question";
import { t_s_questtemplateData } from "../config/t_s_questtemplate";
import { t_s_rechargeData } from "../config/t_s_recharge";
import { t_s_recoverData } from "../config/t_s_recover";
import t_s_remotepet, {
  t_s_remotepettemplateData,
} from "../config/t_s_remotepet";
import { t_s_rewardtemplateData } from "../config/t_s_rewardtemplate";
import { t_s_runeactivationData } from "../config/t_s_runeactivation";
import { t_s_runegemData } from "../config/t_s_runegem";
import { t_s_runeholeData } from "../config/t_s_runehole";
import { t_s_runetemplateData } from "../config/t_s_runetemplate";
import { t_s_seventargetData } from "../config/t_s_seventarget";
import { t_s_skillbuffertemplateData } from "../config/t_s_skillbuffertemplate";
import { t_s_skillpropertytemplateData } from "../config/t_s_skillpropertytemplate";
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import { t_s_specialtemplateData } from "../config/t_s_specialtemplate";
import { t_s_startemplateData } from "../config/t_s_startemplate";
import { t_s_upgradetemplateData } from "../config/t_s_upgradetemplate";
import { t_s_valueData } from "../config/t_s_value";
import { t_s_vippackageData } from "../config/t_s_vippackage";
import t_s_vipprerogativetemplate, {
  t_s_vipprerogativetemplateData,
} from "../config/t_s_vipprerogativetemplate";
import { ConfigType } from "../constant/ConfigDefine";
import { DropCondictionType } from "../constant/DropContictionType";
import { GlobalConfig } from "../constant/GlobalConfig";
import ProductType from "../constant/ProductType";
import ConfigInfosTempInfo from "../datas/ConfigInfosTempInfo";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import ForgeData from "../module/forge/ForgeData";
import { isOversea } from "../module/login/manager/SiteZoneCtrl";
import OfferRewardTemplate from "../module/offerReward/OfferRewardTemplate";
import OutyardRewardInfo from "../module/outyard/data/OutyardRewardInfo";
import { ShopGoodsInfo } from "../module/shop/model/ShopGoodsInfo";
import { SinglePassAreaRewardData } from "../module/singlepass/model/SinglePassAreaRewardData";
import SinglePassBossRewardData from "../module/singlepass/model/SinglePassBossRewardData";
import { TaskTemplate } from "../module/task/TaskTemplate";
import GrowthFundItemInfo from "../module/welfare/data/GrowthFundItemInfo";
import { RemotePetTurnTemplateInfo } from "../mvc/model/remotepet/RemotePetTurnTemplateInfo";
import RingTaskManager from "./RingTaskManager";
import { TaskManage } from "./TaskManage";

/**
 * 一些常用的取配置表操作
 */
export class TempleteManager {
  private static _instance: TempleteManager;

  public static get Instance(): TempleteManager {
    if (!this._instance) {
      this._instance = new TempleteManager();
    }
    return this._instance;
  }

  public setup(data: any, callback?: Function) {}

  public getTemplateByTypeAndLevel(
    level: number,
    type: number,
  ): t_s_upgradetemplateData {
    let templateDic = this.getTemplatesByType(type);
    let temp: t_s_upgradetemplateData = null;
    //先尝试一次取值,再去查找

    // temp = templateDic[level - 1];
    // if (temp && temp.Grades == level) {
    //     return temp;
    // }

    // temp = templateDic[level];
    // if (temp && temp.Grades == level) {
    //     return temp;
    // }

    //数据都是有顺序的, 可以使用插值查找
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         temp = templateDic[dicKey];
    //         if (temp.Grades == level) {
    //             return temp;
    //         }
    //     }
    // }

    //测试结果为不管是否有值, 基本都是一次找到。比上面实现要好很多。上面实现, 在有值的情况可以一次, 没有就要全部遍历。
    let findIdx = Utils.insertValueSearch(
      templateDic,
      0,
      templateDic.length - 1,
      level,
      "Grades",
    );
    if (findIdx >= 0) temp = templateDic[findIdx];
    return temp;
  }

  public getTemplateByTypeAndLevelAndSonType(
    level: number,
    type: number,
    sonType: number,
  ): t_s_upgradetemplateData {
    let templateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_upgradetemplate,
    );
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_upgradetemplateData = templateDic[dicKey];
        if (
          temp.Grades == level &&
          temp.Types == type &&
          temp.TemplateId == sonType
        ) {
          return temp;
        }
      }
    }
    return null;
  }

  /**
   * 获取SkillBuff模板ID
   * @param templateId Buff模板ID
   * @returns
   */
  getSkillBuffTemplateByID(templateId: number): t_s_skillbuffertemplateData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skillbuffertemplate,
      templateId,
    );
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_skillbuffertemplateData = templateDic[dicKey];
    //         if (temp.Id == templateId) {
    //             return temp;
    //         }
    //     }
    // }
    return temp;
  }

  /**
   * 称号模板数据
   */
  public getAppellTemplates(): SimpleDictionary {
    //数据不大, 先标记后优化
    let tempDic: SimpleDictionary = new SimpleDictionary();
    let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_appell);
    if (templateDic)
      for (const dicKey in templateDic) {
        if (templateDic.hasOwnProperty(dicKey)) {
          let temp: t_s_appellData = templateDic[dicKey];
          tempDic.add(temp.TemplateId, temp);
        }
      }
    return tempDic;
  }

  /**
   * 根据模板id取得符文模板
   * @param tid
   * @return
   */
  public getRuneTemplateByTid(tid: number): t_s_runetemplateData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_runetemplate,
      tid,
    );
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_runetemplateData = templateDic[dicKey];
    //         if (temp.TemplateId == tid) {
    //             return temp;
    //         }
    //     }
    // }
    return temp;
  }

  /**
   * 根据模板id取得符文孔模板
   * @param tid
   * @return
   */
  public getRuneHoleTemplateByTid(tid: number): t_s_runeholeData {
    let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_runehole);
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_runeholeData = templateDic[dicKey];
        if (temp.Id == tid) {
          return temp;
        }
      }
    }
    return null;
  }

  getBufferTemplateByType(buffType: number): Array<t_s_campaignbufferData> {
    // let tempDic = [];
    let templateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_campaignbuffer,
      "Types" + buffType,
    );
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_campaignbufferData = templateDic[dicKey];
    //         if (temp.Types == buffType) {
    //             tempDic.push(temp);
    //         }
    //     }
    // }
    return templateDic;
  }

  public getStarTemplateById(id: number): t_s_startemplateData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_startemplate,
      id,
    );
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_startemplateData = templateDic[dicKey];
    //         if (temp.TemplateId == id) {
    //             return temp;
    //         }
    //     }
    // }
    return temp;
  }

  public getMapTemplateDataByID(mapID: number): t_s_mapData {
    if (mapID > GlobalConfig.Novice.NewMapID)
      mapID = GlobalConfig.Novice.OutCityMapID;
    let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_map, mapID);
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_mapData = templateDic[dicKey];
    //         if (temp.Id == id) {
    //             return temp;
    //         }
    //     }
    // }
    return temp;
  }

  public getTemplateByTypeAndLevelAndID(
    level: number,
    type: number,
    templateId: number,
  ): t_s_upgradetemplateData {
    let temps = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_upgradetemplate,
      "Types" + type,
    ) as t_s_upgradetemplateData[];
    if (temps)
      for (let temp of temps) {
        if (temp && temp.Grades == level && temp.TemplateId == templateId) {
          return temp;
        }
      }
    return null;
  }

  /**通过商品ID获取商品配置 */
  public getRechargeTempleteByProductID(
    productId: string = "",
  ): t_s_rechargeData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_recharge,
      productId,
    );
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_rechargeData = templateDic[dicKey];
    //         if (temp.ProductId == productId) {
    //             return temp;
    //         }
    //     }
    // }
    return temp;
  }

  /**
   * 充值
   * ProductType 为1
   */
  public getRechargeTempletes(
    productType: number = 1,
    param1?: number,
  ): t_s_rechargeData[] {
    let arr: t_s_rechargeData[] = [];
    let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_recharge);
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_rechargeData = templateDic[dicKey];
        if (!param1) {
          if (temp.ProductType == productType) arr.push(temp);
        } else {
          if (
            temp.ProductType == productType &&
            param1.toString() == temp.Para1
          )
            arr.push(temp);
        }
      }
    }
    return arr;
  }

  public getTemplatesByType(type: number): t_s_upgradetemplateData[] {
    // let arr: t_s_upgradetemplateData[];
    let arr = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_upgradetemplate,
      "Types" + type,
    );
    !arr && (arr = []);
    return arr;
  }

  public getTemplatesByTypeAndId(
    type: number,
    id: number,
  ): t_s_upgradetemplateData[] {
    let arr: t_s_upgradetemplateData[] = [];
    let templateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_upgradetemplate,
      "Types" + type,
    );
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_upgradetemplateData = templateDic[dicKey];
        if (temp.Types == type && temp.TemplateId == id) {
          arr.push(temp);
        }
      }
    }
    return arr;
  }

  /**
   * 获取VIP特权礼包
   * @param grade VIP等级
   * @param quality 类型  （-1每日礼包, 0免费福利, 1付费）
   * @returns t_s_vippackageData
   */
  public getVipPackageByType(
    grade: number,
    quality: number,
  ): t_s_vippackageData {
    //数据不大,可以按 PayQuality 分组, 先标记
    let temp: t_s_vippackageData = null;
    let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_vippackage);
    let item: t_s_vippackageData;
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        item = templateDic[dicKey];
        if (item.Grade == grade && item.PayQuality == quality) {
          temp = item;
          break;
        }
      }
    }
    return temp;
  }

  /**VIP特权 */
  public getPrivilegeTempletes(): t_s_vipprerogativetemplateData[] {
    let config = ConfigMgr.Instance.getConfigMap(
      "t_s_vipprerogativetemplate",
    ) as t_s_vipprerogativetemplate;
    return config.mDataList.concat();
  }

  /**VIP特权 */
  public getPrivilegeTempletesByLevel(
    vipLevel: number,
  ): t_s_vipprerogativetemplateData[] {
    let arr: t_s_vipprerogativetemplateData[] = [];
    let templateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_vipprerogativetemplate,
      "Grade" + vipLevel,
    );
    let temp: t_s_vipprerogativetemplateData = null;
    if (templateDic)
      for (const dicKey in templateDic) {
        if (templateDic.hasOwnProperty(dicKey)) {
          temp = templateDic[dicKey];
          if (temp.para1 > 0) arr.push(temp);
        }
      }
    return arr;
  }

  /**VIP特权 */
  public getPrivilegeTempletesByType(
    type: number,
  ): t_s_vipprerogativetemplateData[] {
    //用的不多, 标记
    let arr: t_s_vipprerogativetemplateData[] = [];
    let templateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_vipprerogativetemplate,
    );
    let temp: t_s_vipprerogativetemplateData;
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        temp = templateDic[dicKey];
        if (temp.type == type && temp.para1 > 0) arr.push(temp);
      }
    }
    return arr;
  }

  /**
   * 前期检查是否有该特权, 再获取对应数据
   * VIPManager.Instance.model.isOpenPrivilege(VipPrivilegeType.DISCOUNT, grade);
   * @param type VIP类型
   * @param vipLevel  VIP等级
   * @returns
   */
  public getPrivilegeTempletesByTypeLevel(
    type: number,
    vipLevel: number,
  ): t_s_vipprerogativetemplateData {
    let item: t_s_vipprerogativetemplateData = null;
    let templateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_vipprerogativetemplate,
      "Grade" + vipLevel,
    ) as t_s_vipprerogativetemplateData[];
    if (templateDic)
      for (let temp of templateDic) {
        if (temp.grade == vipLevel && temp.type == type) {
          item = temp;
          break;
        }
      }

    return item;
  }

  public getMapTemplatesByID(mapID: number): t_s_mapData {
    if (mapID > GlobalConfig.Novice.NewMapID)
      mapID = GlobalConfig.Novice.OutCityMapID;
    let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_map, mapID);
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_mapData = templateDic[dicKey];
    //         if (temp.Id == mapID) {
    //             return temp;
    //         }
    //     }
    // }
    return temp;
  }

  /**
   * 返回当前职业所有最低等级符文列表
   * @param job
   * @return
   *
   */
  public getMinRuneTemplateInfoByJob(job: number) {
    let dic: t_s_runetemplateData[] = [];
    let runeTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_runetemplate,
    );
    let temp: t_s_runetemplateData = null;
    for (const dicKey in runeTemplateDic) {
      temp = runeTemplateDic[dicKey];
      if (temp instanceof t_s_runetemplateData)
        if (
          (temp.Job.indexOf(0) >= 0 || temp.Job.indexOf(job) >= 0) &&
          temp.RuneGrade == 1
        ) {
          // dic.add(temp.RuneIndex, temp);
          dic.push(temp);
        }
    }
    return dic;
  }

  public getRuneTemplateInfoByRuneType(runeType: number): t_s_runetemplateData {
    let runeTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_runetemplate,
    );
    for (const dicKey in runeTemplateDic) {
      if (runeTemplateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_runetemplateData = runeTemplateDic[dicKey];
        if (temp.RuneType == runeType) {
          return temp;
        }
      }
    }
    return null;
  }

  public getRuneMaxLevel(runeType: number): number {
    let result: number = 0;
    let runeTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_runetemplate,
    );
    for (const dicKey in runeTemplateDic) {
      if (runeTemplateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_runetemplateData = runeTemplateDic[dicKey];
        if (temp.RuneType == runeType) {
          if (temp.RuneGrade > result) {
            result = temp.RuneGrade;
          }
        }
      }
    }
    return result;
  }

  public getRuneTemplateInfoByRuneTypeAndLevel(
    runeType: number,
    level: number,
  ): t_s_runetemplateData {
    let runeTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_runetemplate,
    );
    for (const dicKey in runeTemplateDic) {
      if (runeTemplateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_runetemplateData = runeTemplateDic[dicKey];
        if (temp.RuneType == runeType && temp.RuneGrade == level) {
          return temp;
        }
      }
    }
    return null;
  }

  public getQuestionTempletes(): t_s_questionData[] {
    // let templist: t_s_questionData[] = [];
    // let questionTemplateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_question);
    // for (const dicKey in questionTemplateDic) {
    //     if (questionTemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_questionData = questionTemplateDic[dicKey];
    //         templist.push(temp);
    //     }
    // }
    // return templist;

    let tquestion = ConfigMgr.Instance.getConfigMap(
      ConfigType.t_s_question,
    ) as t_s_question;
    return tquestion.mDataList.concat();
  }

  /**
   *获取当前职业所有技能模版
   * @param job
   * @return
   *
   */
  public getAllSkillTemplateInfoByJob(job: number): SimpleDictionary {
    let dic: SimpleDictionary = new SimpleDictionary();
    let skillTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      "MasterType" + job,
    );
    let temp: t_s_skilltemplateData = null;
    if (skillTemplateDic)
      for (const dicKey in skillTemplateDic) {
        if (skillTemplateDic.hasOwnProperty(dicKey)) {
          temp = skillTemplateDic[dicKey];
          dic.add(temp.TemplateId, temp);
        }
      }
    return dic;
  }

  /**
   *获取当前职业所有天赋模版
   * @param job
   * @return
   *MasterType(主类型): 用于区分天赋技能所属职业, 9为公用天赋技能；10为战士天赋技能；20为射手天赋技能；30为法师天赋技能；100为圣印技能
   */
  public getAllTalentTemplateInfoByJob(job: number): SimpleDictionary {
    let dic: SimpleDictionary = new SimpleDictionary();
    let skillTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      "MasterType" + job,
    );
    this.getSkillTemplateDic(skillTemplateDic, dic);
    skillTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      "MasterType" + 9,
    );
    this.getSkillTemplateDic(skillTemplateDic, dic);
    skillTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      "MasterType" + 100,
    );
    this.getSkillTemplateDic(skillTemplateDic, dic);
    return dic;
  }

  private getSkillTemplateDic(skillTemplateDic, dic) {
    if (skillTemplateDic) {
      let temp: t_s_skilltemplateData = null;
      for (const dicKey in skillTemplateDic) {
        if (skillTemplateDic.hasOwnProperty(dicKey)) {
          temp = skillTemplateDic[dicKey];
          //Index(位置): 用于判断技能于界面上显示的所属位置, 配置为: 十位数为所属技能树, 根据圣印1-3分别填写1-3；个位数为对应格子位置, 根据从左到右, 从上到下的顺序, 8个格子, 分别为0-7, 例: 圣印1位置配置为10
          if (temp.Index > 9 && temp.Index < 100 && temp.Grades == 1) {
            dic.add(temp.TemplateId, temp);
          }
        }
      }
    }
  }

  /**
   * 获取指定职业的最低等级技能模板集合
   * @param job
   * @return
   *
   */
  public getMinSkillTemplateInfoByJob(job: number): SimpleDictionary {
    let dic: SimpleDictionary = new SimpleDictionary();
    let temp: t_s_skilltemplateData;
    let skillTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      "MasterType" + job,
    );
    if (skillTemplateDic)
      for (const dicKey in skillTemplateDic) {
        if (skillTemplateDic.hasOwnProperty(dicKey)) {
          temp = skillTemplateDic[dicKey];
          if (temp.Grades == 1) {
            dic.add(temp.Index, temp);
          }
        }
      }
    return dic;
  }

  /**
   *获取当前职业所有专精技能模版
   * @param job
   * @return
   *
   */
  public getAllExtrajobSkillTemplateInfoByJob(job: number): SimpleDictionary {
    let jobArr = [];
    if (job == 1 || job == 4) {
      //战士屏蔽41
      jobArr = [42, 43, 44];
    } else if (job == 2 || job == 5) {
      //射手屏蔽42
      jobArr = [41, 43, 44];
    } else {
      //法师屏蔽43
      jobArr = [41, 42, 44];
    }
    let dic: SimpleDictionary = new SimpleDictionary();
    let temp: t_s_skilltemplateData = null;
    for (let i = 0; i < jobArr.length; i++) {
      const jobtype = jobArr[i];
      let skillTemplateDic = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        "MasterType" + jobtype,
      );
      if (skillTemplateDic)
        for (const dicKey in skillTemplateDic) {
          if (skillTemplateDic.hasOwnProperty(dicKey)) {
            temp = skillTemplateDic[dicKey];
            dic.add(temp.TemplateId, temp);
          }
        }
    }
    return dic;
  }

  /**
   * 获取指定职业的最低等级专精技能模板集合
   * @param job 技术特殊处理：战士屏蔽41，射手屏蔽42，法师屏蔽43
   * @return
   *
   */
  public getExtrajobMinSkillTemplateInfoByJob(job: number): SimpleDictionary {
    let jobArr = [];
    if (job == 1 || job == 4) {
      //战士屏蔽41
      jobArr = [42, 43, 44];
    } else if (job == 2 || job == 5) {
      //射手屏蔽42
      jobArr = [41, 43, 44];
    } else {
      //法师屏蔽43
      jobArr = [41, 42, 44];
    }
    let dic: SimpleDictionary = new SimpleDictionary();
    let temp: t_s_skilltemplateData;
    for (let i = 0; i < jobArr.length; i++) {
      const jobtype = jobArr[i];
      let skillTemplateDic = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        "MasterType" + jobtype,
      );
      if (skillTemplateDic)
        for (const dicKey in skillTemplateDic) {
          if (skillTemplateDic.hasOwnProperty(dicKey)) {
            temp = skillTemplateDic[dicKey];
            if (temp.Grades == 1) {
              dic.add(jobtype + "_" + temp.Index, temp);
            }
          }
        }
    }
    return dic;
  }

  public getMinTalentTemplateInfoByJob(job: number): SimpleDictionary {
    // let dic: SimpleDictionary = new SimpleDictionary();
    // let skillTemplateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_skilltemplate);
    // for (const dicKey in skillTemplateDic) {
    //     if (skillTemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_skilltemplateData = skillTemplateDic[dicKey];
    //         if (temp.MasterType == job && temp.Grades == 1) {
    //             dic.add(temp.Index, temp);
    //         }
    //     }
    // }
    // return dic;
    return this.getMinSkillTemplateInfoByJob(job);
  }

  /**
   *获取当前技能最低等级信息
   * @param sontype
   * @return
   *
   */
  public getMinSkillTemplateInfoBySonType(
    sontype: number,
  ): t_s_skilltemplateData {
    let skillTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      "SonType" + sontype,
    );
    let temp: t_s_skilltemplateData = null;
    if (skillTemplateDic)
      //这里要注意,看起来应该最多2次循环可以取得数据
      for (const dicKey in skillTemplateDic) {
        if (skillTemplateDic.hasOwnProperty(dicKey)) {
          temp = skillTemplateDic[dicKey];
          if (temp.Grades == 1) {
            return temp;
          }
        }
      }
    return null;
  }

  /**
   *获取当前技能信息  根据sontype和等级
   * @param sontype
   * @return
   *
   */
  public getSkillTemplateInfoBySonTypeAndGrade(sontype: number, grade: number) {
    let skillTemplateDic: t_s_skilltemplateData[] =
      ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        "SonType" + sontype,
      );
    if (!skillTemplateDic) return null;
    //这里先尝试一次性取值,命中了直线飙升。
    let temp: t_s_skilltemplateData = null;
    // temp = skillTemplateDic[grade];
    // if (temp.Grades == grade) {
    //     return temp;
    // }

    // temp = skillTemplateDic[grade - 1];
    // if (temp.Grades == grade) {
    //     return temp;
    // }

    //没有命中,数据是有序,回头要修改成插值查找
    // for (const dicKey in skillTemplateDic) {
    //     if (skillTemplateDic.hasOwnProperty(dicKey)) {
    //         temp = skillTemplateDic[dicKey];
    //         if (temp.Grades == grade) {
    //             return temp;
    //         }
    //     }
    // }

    let findIdx = Utils.insertValueSearch(
      skillTemplateDic,
      0,
      skillTemplateDic.length - 1,
      grade,
      "Grades",
    );
    if (findIdx >= 0) {
      temp = skillTemplateDic[findIdx];
    }
    return temp;
  }

  public getActiveTemplates() {
    // let dic = new Dictionary();
    let activityTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_activetemplate,
    );
    // let temp: t_s_activetemplateData
    // for (const dicKey in activityTemplateDic) {
    //     if (activityTemplateDic.hasOwnProperty(dicKey)) {
    //         temp = activityTemplateDic[dicKey];
    //         if (!dic[temp.TemplateId]) {
    //             dic[temp.TemplateId] = temp;
    //         }
    //     }
    // }
    return activityTemplateDic;
  }

  public getDropItemssByDropId(dropId: number): Array<t_s_dropitemData> {
    let templateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_dropitem,
      "DropId" + dropId,
    );
    return templateDic.concat();
  }

  public getSignDropTemplates() {
    // let tempDic = new Dictionary();
    let _dic = this.getDropConditionByType(17);
    // for (const dicKey in _dic) {
    //     if (_dic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_dropconditionData = _dic[dicKey];
    //         // if (temp.CondictionType == 17) {
    //         tempDic[temp.Para1[0]] = temp;
    //         // }
    //     }
    // }
    return _dic;
  }

  /**
   * 获取掉落条件类型
   */
  public getDropConditionByType(
    condictionType: number,
  ): t_s_dropconditionData[] {
    let temp: t_s_dropconditionData[];
    let leedTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_dropcondition,
      "CondictionType" + condictionType,
    );
    temp = leedTemplateDic ? leedTemplateDic.concat() : [];
    // for (const dicKey in leedTemplateDic) {
    //     if (leedTemplateDic.hasOwnProperty(dicKey)) {
    //         let item: t_s_dropconditionData = leedTemplateDic[dicKey];
    //         if (item.CondictionType == condictionType) {
    //             temp.push(item);
    //         }
    //     }
    // }
    return temp;
  }

  /**
   * 获取掉落条件类型
   */
  public getDropConditionByPara1(sonType: number): t_s_dropconditionData[] {
    //这要看看业务逻辑, 不好优化。
    let temp: t_s_dropconditionData[] = [];
    let leedTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_dropcondition,
    );
    if (leedTemplateDic)
      for (const dicKey in leedTemplateDic) {
        if (leedTemplateDic.hasOwnProperty(dicKey)) {
          let item: t_s_dropconditionData = leedTemplateDic[dicKey];
          if (item.Para1 && item.Para1.length && item.Para1[0] == sonType) {
            temp.push(item);
          }
        }
      }
    return temp;
  }

  public getLeedTemplateByID(id: number): t_s_leedtemplateData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_leedtemplate,
      id,
    );
    // for (const dicKey in leedTemplateDic) {
    //     if (leedTemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_leedtemplateData = leedTemplateDic[dicKey];
    //         if (temp.TemplateId == id) {
    //             return temp;
    //         }
    //     }
    // }
    return temp;
  }

  /**
   * 一个英灵有不同的品质, 分为不同的模板, 找到与target相同, 品质为curQuality的英灵
   * @param target
   * @param curQuality
   * @return
   *
   */
  public getQualityGradeTemplate(
    target: t_s_pettemplateData,
    curQuality: number,
  ): t_s_pettemplateData {
    if (!target) {
      return null;
    }

    let list: t_s_pettemplateData[] = this.getPetTemplatesByType(
      target.PetType,
    );
    for (let item of list) {
      if (
        item.TemplateNameLang == target.TemplateNameLang &&
        item.Quality == curQuality
      ) {
        return item;
      }
    }
    return null;
  }

  public getPetEquipStrenData(level: number): t_s_petequipstrengthenData {
    let petTempleteData: t_s_petequipstrengthenData = null;
    let petTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_petequipstrengthen,
    );
    for (const dicKey in petTemplateDic) {
      if (petTemplateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_petequipstrengthenData = petTemplateDic[dicKey];
        if (temp.StrengthenGrow == level) {
          petTempleteData = temp;
          break;
        }
      }
    }
    return petTempleteData;
  }

  public getPetEquipSuitData(suitId: number): t_s_petequipsuitData {
    let petTempleteData: t_s_petequipsuitData = null;
    let petTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_petequipsuit,
    );
    for (const dicKey in petTemplateDic) {
      if (petTemplateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_petequipsuitData = petTemplateDic[dicKey];
        if (temp.SuitId == suitId) {
          petTempleteData = temp;
          break;
        }
      }
    }
    return petTempleteData;
  }

  private petEquipSuitArr: t_s_petequipsuitData[];
  public getPetEquipSuitArr(): t_s_petequipsuitData[] {
    if (!this.petEquipSuitArr) {
      this.petEquipSuitArr = [];
      let petTemplateDic = ConfigMgr.Instance.getDicSync(
        ConfigType.t_s_petequipsuit,
      );
      for (const dicKey in petTemplateDic) {
        if (petTemplateDic.hasOwnProperty(dicKey)) {
          let temp: t_s_petequipsuitData = petTemplateDic[dicKey];
          if (temp) {
            this.petEquipSuitArr.push(temp);
          }
        }
      }
    }
    return this.petEquipSuitArr;
  }

  public getPetTemplateById(petId: number): t_s_pettemplateData {
    let petTempleteData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      petId,
    );
    // for (const dicKey in petTemplateDic) {
    //     if (petTemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_pettemplateData = petTemplateDic[dicKey];
    //         if (temp.TemplateId == petId) {
    //             petTempleteData = temp;
    //             break;
    //         }
    //     }
    // }
    return petTempleteData;
  }

  public getAppellInfoTemplateByID(templeteId: number): t_s_appellData {
    let TempleteData: t_s_appellData = null;
    TempleteData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_appell,
      templeteId,
    );
    // for (const dicKey in TemplateDic) {
    //     if (TemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_appellData = TemplateDic[dicKey];
    //         if (temp.TemplateId == templeteId) {
    //             TempleteData = temp;
    //             break;
    //         }
    //     }
    // }
    return TempleteData;
  }

  public getMagicCardTemplateByID(templeteId: number) {
    let TempleteData: t_s_powcardsuitetemplateData = null;
    TempleteData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_powcardsuitetemplate,
      templeteId,
    );
    // for (const dicKey in TemplateDic) {
    //     if (TemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_powcardsuitetemplateData = TemplateDic[dicKey];
    //         if (temp.TemplateId == templeteId) {
    //             TempleteData = temp;
    //             break;
    //         }
    //     }
    // }
    return TempleteData;
  }

  public getPowerCardTemplateByID(templeteId: number) {
    let TempleteData: t_s_powcardtemplateData = null;
    TempleteData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_powcardtemplate,
      templeteId,
    );
    // for (const dicKey in TemplateDic) {
    //     if (TemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_powcardtemplateData = TemplateDic[dicKey];
    //         if (temp.TemplateId == templeteId) {
    //             TempleteData = temp;
    //             break;
    //         }
    //     }
    // }
    return TempleteData;
  }

  public getPetTemplatesByType(type: number): t_s_pettemplateData[] {
    let petTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pettemplate,
      "PetType" + type,
    );
    // for (const dicKey in petTemplateDic) {
    //     if (petTemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_pettemplateData = petTemplateDic[dicKey];
    //         if (temp.PetType == type) {
    //             list.push(temp);
    //         }
    //     }
    // }
    !petTemplateDic && (petTemplateDic = []);
    return petTemplateDic;
  }

  /**
   *根据ID获取当前技能数据
   * @param ids
   * @return
   *
   */
  public getSkillTemplateInfoByIds(ids: string) {
    let arr: t_s_skilltemplateData[] = [];
    if (!ids) {
      return arr;
    }
    let list = ids.split(",");
    if (list.length == 0) {
      return arr;
    }
    let skillTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_skilltemplate,
    );
    if (!skillTemplateDic) {
      Logger.warn("未加载t_s_skilltemplate");
      return arr;
    }
    for (let index: number = 0; index < list.length; index++) {
      let skillId = list[index];
      if (skillId && skillTemplateDic[skillId]) {
        arr[index] = skillTemplateDic[skillId];
      }
    }
    return arr;
  }

  public getPetEquipAttri(AttributeId: number): t_s_attributeData {
    let tempDic = null;
    let itemTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_attribute,
    );
    for (const key in itemTemplateDic) {
      if (itemTemplateDic.hasOwnProperty(key)) {
        let info: t_s_attributeData = itemTemplateDic[key];
        if (info.AttributeId == AttributeId) {
          tempDic = info;
          break;
        }
      }
    }
    return tempDic;
  }

  public getpetequipqualityData(Profile: number): t_s_petequipqualityData {
    let tempDic = null;
    let itemTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_petequipquality,
    );
    for (const key in itemTemplateDic) {
      if (itemTemplateDic.hasOwnProperty(key)) {
        let info: t_s_petequipqualityData = itemTemplateDic[key];
        if (info.Profile == Profile) {
          tempDic = info;
          break;
        }
      }
    }
    return tempDic;
  }

  public getPawnTemplateById(Id: number): t_s_pawntemplateData {
    let pawntemplateData: t_s_pawntemplateData = null;
    pawntemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pawntemplate,
      Id,
    );
    // for (const dicKey in pawnTemplateDic) {
    //     if (pawnTemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_pawntemplateData = pawnTemplateDic[dicKey];
    //         if (temp.TemplateId == Id) {
    //             pawntemplateData = temp;
    //             break;
    //         }
    //     }
    // }
    return pawntemplateData;
  }

  public getSkillTemplateInfoById(Id: number): t_s_skilltemplateData {
    let skilltemplateData: t_s_skilltemplateData = null;
    skilltemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      Id,
    );
    // for (const dicKey in skillTemplateDic) {
    //     if (skillTemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_skilltemplateData = skillTemplateDic[dicKey];
    //         if (temp.TemplateId == Id) {
    //             skilltemplateData = temp;
    //             break;
    //         }
    //     }
    // }
    return skilltemplateData;
  }

  public getPawnSpecialTemplateByID(Id: number): t_s_specialtemplateData {
    let specialtemplateData: t_s_specialtemplateData = null;
    specialtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_specialtemplate,
      Id,
    );
    // for (const dicKey in specialtemplateDic) {
    //     if (specialtemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_specialtemplateData = specialtemplateDic[dicKey];
    //         if (temp.TemplateId == Id) {
    //             specialtemplateData = temp;
    //             break;
    //         }
    //     }
    // }
    return specialtemplateData;
  }

  public getBuildTemplateByID(Id: number): t_s_buildingtemplateData {
    let buildtemplateData: t_s_buildingtemplateData = null;
    buildtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_buildingtemplate,
      Id,
    );
    return buildtemplateData;
  }

  public getMinGradeBuildTemplate(sonType: number): t_s_buildingtemplateData {
    let buildtemplateData: t_s_buildingtemplateData = null;
    let buildtemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_buildingtemplate,
      "SonType" + sonType,
    );
    let temp: t_s_buildingtemplateData = null;
    if (buildtemplateDic)
      for (const dicKey in buildtemplateDic) {
        if (buildtemplateDic.hasOwnProperty(dicKey)) {
          temp = buildtemplateDic[dicKey];
          if (temp && temp.SonType == sonType && temp.BuildingGrade == 1) {
            buildtemplateData = temp;
            break;
          }
        }
      }
    return buildtemplateData;
  }

  getConfigLanguages(): string[] {
    let openCfgs =
      TempleteManager.Instance.getConfigInfoByConfigName("Language");
    if (openCfgs) {
      let configValue = String(openCfgs.ConfigValue);
      let keyMaps = configValue.split(",");
      return keyMaps;
    }
    return [];
  }

  /**获取固定配置参数数据 */
  getConfigInfoByConfigName(configName: string) {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_config,
      configName,
    ) as t_s_configData;
    if (!temp) temp = ConfigInfosTempInfo.temp as t_s_configData;
    // for (const dicKey in configtemplateDic) {
    //     if (configtemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_configData = configtemplateDic[dicKey];
    //         if (configName == temp.ConfigName) {
    //             configtemplateData = new ConfigInfosTempInfo(temp);
    //             break;
    //         }
    //     }
    // }
    return temp;
  }

  /**最大文字字数限制 */
  public get CfgMaxWordCount(): number {
    if (isOversea) {
      return 100;
    }
    return 38;
  }

  public getCampaignTemplateByID(Id: number): t_s_campaignData {
    let campaignTemplateData: t_s_campaignData = null;
    campaignTemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_campaign,
      Id,
    );
    // for (const dicKey in campaignTemplateDataDic) {
    //     if (campaignTemplateDataDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_campaignData = campaignTemplateDataDic[dicKey];
    //         if (temp.CampaignId == Id) {
    //             campaignTemplateData = temp;
    //             break;
    //         }
    //     }
    // }
    return campaignTemplateData;
  }

  public getMapTemplateById(mapID: number): t_s_mapData {
    if (mapID > GlobalConfig.Novice.NewMapID)
      mapID = GlobalConfig.Novice.OutCityMapID;
    let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_map, mapID);
    // for (const dicKey in mapTemplateDic) {
    //     if (mapTemplateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_mapData = mapTemplateDic[dicKey];
    //         if (temp.Id == Id) {
    //             pawntemplateData = temp;
    //             break;
    //         }
    //     }
    // }
    return temp;
  }

  /**获取商品物品 */
  public getShopTempInfoByItemId(id: number, area?: number): ShopGoodsInfo {
    let shopTemplateDic = ConfigMgr.Instance.shopTemplateDic;
    let temp: ShopGoodsInfo = null;
    for (const key in shopTemplateDic) {
      if (shopTemplateDic.hasOwnProperty(key)) {
        temp = shopTemplateDic[key];
        if (area) {
          if (temp.ItemId == id && temp.Area == area) {
            return temp;
          }
        } else {
          if (temp.ItemId == id) {
            return temp;
          }
        }
      }
    }
    return null;
  }

  public getShopTempInfoById(id: number): ShopGoodsInfo {
    let shopTemplateDic = ConfigMgr.Instance.shopTemplateDic;
    let temp = shopTemplateDic[id];
    // for (const key in shopTemplateDic) {
    //     if (shopTemplateDic.hasOwnProperty(key)) {
    //         const temp = shopTemplateDic[key];
    //         if (temp.Id == id) {
    //             return temp;
    //         }
    //     }
    // }
    return temp;
  }

  public getShopMainTempInfoByItemId(id: number): ShopGoodsInfo {
    let shopMainTemplateDic = ConfigMgr.Instance.shopMainTemplateDic;
    for (const key in shopMainTemplateDic) {
      if (shopMainTemplateDic.hasOwnProperty(key)) {
        const temp = shopMainTemplateDic[key];
        if (temp.ItemId == id) {
          return temp;
        }
      }
    }
    return null;
  }

  public getShopInfoByItemId(id: number): ShopGoodsInfo {
    let _shopTemplateDic = ConfigMgr.Instance.shopTemplateDic;
    for (const key in _shopTemplateDic) {
      if (_shopTemplateDic.hasOwnProperty(key)) {
        const temp = _shopTemplateDic[key];
        if (temp.ItemId == id) {
          return temp;
        }
      }
    }
    return null;
  }

  public getShopMainInfoByItemId(id: number): ShopGoodsInfo {
    let shopMainTemplateDic = ConfigMgr.Instance.shopMainTemplateDic;
    for (const key in shopMainTemplateDic) {
      if (shopMainTemplateDic.hasOwnProperty(key)) {
        const temp = shopMainTemplateDic[key];
        if (temp.Id == id) {
          return temp;
        }
      }
    }
    return null;
  }

  public getMazeShopTempInfoByItemId(itemId: number): ShopGoodsInfo {
    let mazeShopTemplateDic = ConfigMgr.Instance.mazeShopTemplateDic;
    for (const key in mazeShopTemplateDic) {
      if (mazeShopTemplateDic.hasOwnProperty(key)) {
        const temp: ShopGoodsInfo = mazeShopTemplateDic[key];
        if (temp.ItemId == itemId) {
          return temp;
        }
      }
    }
    return null;
  }

  public getComposeTempleteByTempleteId(tid: number): t_s_composeData {
    let composeTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_compose,
      "Types" + ForgeData.COMPOSE_TYPE_GEM,
    ) as t_s_composeData[];
    if (composeTemplateDic)
      for (let info of composeTemplateDic) {
        if (info.NewMaterial == tid) {
          return info;
        }
      }
    return null;
  }

  public getCrystalTempleteByTempleteId(tid: number): t_s_composeData {
    let composeTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_compose,
      "Types" + ForgeData.COMPOSE_TYPE_CRYSTAL,
    ) as t_s_composeData[];
    if (composeTemplateDic)
      for (let info of composeTemplateDic) {
        if (info.NewMaterial == tid) {
          return info;
        }
      }
    return null;
  }
  /**
   * 根据主材料ID得到合成公式模板
   * @param id
   * @return
   */
  public getEquipUpdateComposeTempleteByMainMaterialId(
    id: number,
  ): t_s_composeData {
    //要看业务逻辑, 这没有合适的优化
    let composeTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_compose,
    );
    if (composeTemplateDic)
      for (const key in composeTemplateDic) {
        if (composeTemplateDic.hasOwnProperty(key)) {
          const info = composeTemplateDic[key];
          if (info.Material1 == id) {
            return info;
          }
        }
      }
    return null;
  }

  public getComposeByType(types: number) {
    let composeTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_compose,
      "Types" + 7,
    ) as t_s_composeData[];
    return composeTemplateDic;
  }

  public getComposeById(Id: number) {
    return ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_compose,
      Id,
    ) as t_s_composeData;
  }

  private _upGradeComposeTemId: number = 0; //升级公式ID
  public getUpGradeComposeTemId(TemplateId: number): number {
    let composeTem =
      TempleteManager.Instance.getEquipUpdateComposeTempleteByMainMaterialId(
        TemplateId,
      );
    if (composeTem) {
      this._upGradeComposeTemId = composeTem.Id;
    }
    return this._upGradeComposeTemId;
  }

  public getGoodsTemplatesBySonType(
    sonType: number,
  ): Array<t_s_itemtemplateData> {
    // let tempDic = [];
    let itemTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      "SonType" + sonType,
    );
    // for (const key in itemTemplateDic) {
    //     if (itemTemplateDic.hasOwnProperty(key)) {
    //         let info: t_s_itemtemplateData = itemTemplateDic[key];
    //         if (info.SonType == sonType)
    //             tempDic.push(info);
    //     }
    // }
    !itemTemplateDic && (itemTemplateDic = []);
    return itemTemplateDic;
  }

  public getGoodsTemplatesByTempleteId(
    templateId: number,
  ): t_s_itemtemplateData {
    // let tempDic = null;
    let info = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      templateId,
    );
    // for (const key in itemTemplateDic) {
    //     if (itemTemplateDic.hasOwnProperty(key)) {
    //         let info: t_s_itemtemplateData = itemTemplateDic[key];
    //         if (info.TemplateId == templateId) {
    //             tempDic = info;
    //             break;
    //         }
    //     }
    // }
    return info;
  }

  public getGoodsTempleteDesc(templateInfo: t_s_itemtemplateData): string {
    //类型为206的箱子道具新增字段控制描述显示.
    let retStr = "";
    let p3 = templateInfo.Property3;
    if (templateInfo.SonType == 206 && p3 > 0) {
      let langs = LangManager.Instance;
      let showRandom = p3 == 2;
      let resultStr: string = "";
      let str0: string = "";
      let str1: string = "";
      let str2: string = "";
      let str3: string = langs.GetTranslation("propTips.boxTip6"); //没有1时, “并”字省略
      let dropArr: t_s_dropitemData[] =
        TempleteManager.Instance.getDropItemssByDropId(templateInfo.Property1);
      for (let i = 0; i < dropArr.length; i++) {
        const dropdata: t_s_dropitemData = dropArr[i];
        let cfg = TempleteManager.Instance.getGoodsTemplatesByTempleteId(
          dropdata.ItemId,
        );
        if (dropdata.AppearType == 1) {
          //必定开出: str0
          if (str0 == "") {
            str0 = langs.GetTranslation("propTips.boxTip1") + "<br>";
          }
          str0 +=
            langs.GetTranslation(
              "propTips.boxTip4",
              cfg.TemplateNameLang,
              dropdata.Data,
            ) + "<br>";
        } else if (dropdata.AppearType == 4) {
          //并】可获得以下物品中的一种:  str1
          if (str1 == "") {
            str1 = langs.GetTranslation("propTips.boxTip2") + "<br>";
          }

          if (showRandom && dropdata.Random) {
            str1 +=
              langs.GetTranslation(
                "propTips.boxTip5",
                cfg.TemplateNameLang,
                dropdata.Data,
                dropdata.Random / 1000,
              ) + "<br>";
          } else {
            str1 +=
              langs.GetTranslation(
                "propTips.boxTip4",
                cfg.TemplateNameLang,
                dropdata.Data,
              ) + "<br>";
          }
        } else if (dropdata.AppearType == 3) {
          //同时有几率额外开出:
          if (str2 == "") {
            str2 = langs.GetTranslation("propTips.boxTip3") + "<br>";
          }
          if (showRandom && dropdata.Random) {
            str2 +=
              langs.GetTranslation(
                "propTips.boxTip5",
                cfg.TemplateNameLang,
                dropdata.Data,
                dropdata.Random / 100000,
              ) + "<br>";
          } else {
            str2 +=
              langs.GetTranslation(
                "propTips.boxTip4",
                cfg.TemplateNameLang,
                dropdata.Data,
              ) + "<br>";
          }
        }
      }
      if (str0.length > 0 && str1.length > 0) {
        str1 = str3 + str1;
      }
      if (str2.length) {
        str2 = "<br>" + str2;
      }
      resultStr = str0 + "<br>" + str1 + str2;
      retStr = resultStr;
    } else {
      if (
        templateInfo.DescriptionLang != "" &&
        templateInfo.DescriptionLang != undefined
      ) {
        retStr = templateInfo.DescriptionLang;
      }
    }
    return retStr;
  }

  //没有调用
  public get pvpWarFightDic() {
    let campaignTemplateDataDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_campaign,
      "Types5",
    );
    return campaignTemplateDataDic;
  }
  //没有调用
  public get worldBossTemplateDict(): Dictionary {
    let _pvpWarFightDic = new Dictionary();
    let campaignTemplateDataDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_campaign,
    );
    for (const dicKey in campaignTemplateDataDic) {
      if (campaignTemplateDataDic.hasOwnProperty(dicKey)) {
        let temp: t_s_campaignData = campaignTemplateDataDic[dicKey];
        if (temp.Types >= 1) {
          _pvpWarFightDic[temp.CampaignId] = temp;
        }
      }
    }
    return _pvpWarFightDic;
  }

  public taskTemplateDic() {
    return ConfigMgr.Instance.getDicSync(ConfigType.t_s_questtemplate);
  }

  public taskGoodTemplateList() {
    return ConfigMgr.Instance.getDicSync(ConfigType.t_s_questgood);
  }

  public taskCondictionInfoList() {
    return ConfigMgr.Instance.getDicSync(ConfigType.t_s_questcondiction);
  }

  public offerRewardTemplateDic() {
    return ConfigMgr.Instance.getDicSync(ConfigType.t_s_rewardtemplate);
  }

  public offerRewardConditionTemplateList() {
    return ConfigMgr.Instance.getDicSync(ConfigType.t_s_rewardcondiction);
  }

  public offerRewardGoodsTemplateList() {
    return ConfigMgr.Instance.getDicSync(ConfigType.t_s_rewardgood);
  }

  public initTemplate() {
    let taskTemplateList = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_questtemplate,
    );
    for (let dicKey in taskTemplateList) {
      if (taskTemplateList.hasOwnProperty(dicKey)) {
        let condition: t_s_questtemplateData = taskTemplateList[dicKey];
        let tTemp: TaskTemplate = new TaskTemplate(condition);
        TaskManage.Instance.allTasks[tTemp.TemplateId] = tTemp;
        tTemp.initTask(); //添加奖励物品和完成条件
      }
    }
    let offerRewardTemplateList = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_rewardtemplate,
    );
    for (let dicKey in offerRewardTemplateList) {
      if (offerRewardTemplateList.hasOwnProperty(dicKey)) {
        let condition: t_s_rewardtemplateData = offerRewardTemplateList[dicKey];
        let tTemp: OfferRewardTemplate = new OfferRewardTemplate(condition);
        RingTaskManager.Instance.allReward[tTemp.TemplateId] = tTemp;
        tTemp.addData(); //添加奖励物品和完成条件
      }
    }
  }

  public getMountTemplateById(id: number): t_s_mounttemplateData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_mounttemplate,
      id,
    );
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_mounttemplateData = templateDic[dicKey];
    //         if (temp.TemplateId == id) {
    //             return temp;
    //         }
    //     }
    // }
    return temp;
  }

  public getMountsByType(type: number) {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_mounttemplate,
      "MountType" + type,
    ) as t_s_mounttemplateData[];
    return temp ? temp.concat() : [];
  }

  /**
   * 首充送豪礼奖励数据获取
   * @param Time 天数
   * @param Jobs  职业（1战,2射,3法）)
   * @param Gender 性别(0为女,1为男)
   * @returns
   */
  public getRewardInfo(Time: number, Jobs: number, Gender: number): any[] {
    let rewardInfo: any[] = [];
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_firstpay,
      Time + "_" + Jobs + "_" + Gender,
    );
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_firstpayData = templateDic[dicKey];
    //         if (temp.Time == Time && temp.Jobs == Jobs && temp.Gender == Gender) {
    //             rewardInfo.push(temp.AvatarPath);
    //             rewardInfo.push(temp.ImagePath);
    //             rewardInfo.push(temp.Item);
    //             rewardInfo.push(temp.Offset);
    //             rewardInfo.push(temp.Scale);
    //             rewardInfo.push(temp.Avatartype);
    //         }
    //     }
    // }
    if (temp) {
      rewardInfo.push(temp.AvatarPath);
      rewardInfo.push(temp.ImagePath);
      rewardInfo.push(temp.Item);
      rewardInfo.push(temp.Offset);
      rewardInfo.push(temp.Scale);
      rewardInfo.push(temp.Avatartype);
    }

    return rewardInfo;
  }

  /**月卡 */
  public getMonthCardRechargeTemplete(Para1: string): t_s_rechargeData {
    let rechargeData: t_s_rechargeData = null;
    let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_recharge);
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_rechargeData = templateDic[dicKey];
        if (
          temp.ProductType == ProductType.MONTH_RECHARGE &&
          temp.Para1 == Para1
        ) {
          rechargeData = temp;
          break;
        }
      }
    }
    return rechargeData;
  }

  /**勇士犒赏令支付方式 */
  public getPassCheckRechargeTemplete(): t_s_rechargeData {
    let rechargeData: t_s_rechargeData = null;
    let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_recharge);
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_rechargeData = templateDic[dicKey];
        if (temp.ProductType == ProductType.PASS_CHECK) {
          rechargeData = temp;
          break;
        }
      }
    }
    return rechargeData;
  }

  public getGrowthFundItemInfo(grade: number): GrowthFundItemInfo {
    let growthFundItemInfo: GrowthFundItemInfo;
    let rechargeData: t_s_rechargeData = null;
    let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_recharge);
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_rechargeData = templateDic[dicKey];
        if (temp.ProductType == ProductType.GROWTH_RECHARGE) {
          rechargeData = temp;
          break;
        }
      }
    }
    if (!rechargeData) return null;
    let Grades = rechargeData[0].Para2;
    let Diamonds = rechargeData[0].Para3;
    let gradeMap = Grades.split("|");
    let dismondsMap = Diamonds.split("|");
    let count = gradeMap.length;
    for (let index = 0; index < count; index++) {
      let gradeKey = gradeMap[index];
      if (grade == Number(gradeKey)) {
        let gradeDiamond = dismondsMap[index];
        growthFundItemInfo = new GrowthFundItemInfo();
        growthFundItemInfo.grade = Number(gradeKey);
        growthFundItemInfo.bindDiamondCount = Number(gradeDiamond);
        break;
      }
    }
    return growthFundItemInfo;
  }

  public getGrowthFundInfoArr(): Array<GrowthFundItemInfo> {
    let rewardInfo: Array<GrowthFundItemInfo> = [];
    let growthFundItemInfo: GrowthFundItemInfo;
    let rechargeData: t_s_rechargeData = null;
    let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_recharge);
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_rechargeData = templateDic[dicKey];
        if (temp.ProductType == ProductType.GROWTH_RECHARGE) {
          rechargeData = temp;
          break;
        }
      }
    }
    if (!rechargeData) return [];
    let Grades = rechargeData.Para2;
    let Diamonds = rechargeData.Para3;
    let gradeMap = Grades.split("|");
    let dismondsMap = Diamonds.split("|");
    let count = gradeMap.length;
    for (let index = 0; index < count; index++) {
      let gradeKey = gradeMap[index];
      let gradeDiamond = dismondsMap[index];
      growthFundItemInfo = new GrowthFundItemInfo();
      growthFundItemInfo.grade = Number(gradeKey);
      growthFundItemInfo.sortOrder = 2;
      if (gradeDiamond != "")
        growthFundItemInfo.bindDiamondCount = Number(gradeDiamond);
      else growthFundItemInfo.bindDiamondCount = 0;
      rewardInfo.push(growthFundItemInfo);
    }
    return rewardInfo;
  }

  public getSevenTaskByTaskId(taskId: number): t_s_seventargetData {
    let tempDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_seventarget,
      taskId,
    );
    // for (const key in itemTemplateDic) {
    //     if (itemTemplateDic.hasOwnProperty(key)) {
    //         let info: t_s_seventargetData = itemTemplateDic[key];
    //         if (info.Id == taskId) {
    //             tempDic = info;
    //             break;
    //         }
    //     }
    // }
    return tempDic;
  }

  public getConsortiaTempleteById(id: number): t_s_consortialevelData {
    let consortialevelDic = ConfigMgr.Instance.consortialevelDic;
    return consortialevelDic[id];
  }

  public getConsortiaTempleteByTypeAndLevel(
    type: number,
    level: number,
  ): t_s_consortialevelData {
    let consortialevelDic = ConfigMgr.Instance.consortialevelDic;
    return consortialevelDic[type + "_" + level];
  }

  public getRuneGemCfgByTypeAndLevel(
    type: number,
    level: number,
    shapeId: number,
  ): t_s_runegemData {
    let runegemDic = ConfigMgr.Instance.runegemDic;
    return runegemDic[type + "_" + level + "_" + shapeId];
  }

  public getRuneGemCfgById(id: number): t_s_runegemData {
    let runegemDic = ConfigMgr.Instance.runegemDic;
    return runegemDic[id];
  }

  public getRecoverInfoTemplateByID(Id: number): t_s_recoverData {
    let recoverData: t_s_recoverData = null;
    recoverData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_recover,
      Id,
    );
    // for (const dicKey in recoverDataDic) {
    //     if (recoverDataDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_recoverData = recoverDataDic[dicKey];
    //         if (temp.TemplateId == Id) {
    //             recoverData = temp;
    //             break;
    //         }
    //     }
    // }
    return recoverData;
  }

  public getConsortiaDropTemplateCate(site: number): t_s_dropviewData {
    let dropData: t_s_dropviewData = null;
    dropData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_dropview,
      site,
    );
    // for (const dicKey in dropDataDic) {
    //     if (dropDataDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_dropviewData = dropDataDic[dicKey];
    //         if (temp.Site == site) {
    //             dropData = temp;
    //             break;
    //         }
    //     }
    // }
    return dropData;
  }

  /**
   * 根据称号模板取得称号数据
   */
  getAppellTemplateByID(templateId: number): t_s_appellData {
    let templateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_appell,
      templateId,
    );
    // for (const dicKey in templateDic) {
    //     if (templateDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_appellData = templateDic[dicKey];
    //         if (temp.TemplateId == templateId) {
    //             return temp;
    //         }
    //     }
    // }
    return templateDic;
  }

  public getGodArriveData(campId: number, gate: number): t_s_campaigndataData {
    let campaignTemplateData: t_s_campaigndataData = null;
    let campaignTemplateDataDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_campaigndata,
    );
    for (const dicKey in campaignTemplateDataDic) {
      if (campaignTemplateDataDic.hasOwnProperty(dicKey)) {
        let temp: t_s_campaigndataData = campaignTemplateDataDic[dicKey];
        if (temp.CampaignId == campId && temp.Param1 == gate) {
          campaignTemplateData = temp;
          break;
        }
      }
    }
    return campaignTemplateData;
  }

  /**天穹之径区域通关奖励 */
  public getAreaRewardByAreaId(areaId: number): SinglePassAreaRewardData {
    let temp: SinglePassAreaRewardData;
    let dropArr: t_s_dropconditionData[] =
      TempleteManager.Instance.getDropConditionByType(
        DropCondictionType.AREA_REWAR,
      );
    for (let index = 0; index < dropArr.length; index++) {
      const element: t_s_dropconditionData = dropArr[index];
      if (element.Para2 && element.Para2.length && element.Para2[0] == areaId) {
        temp = new SinglePassAreaRewardData();
        temp.Area = element.Para2[0];
        temp.DropId = element.DropId;
        temp.goodsInfoArr = this.getRewardInfoByDropId(element.DropId);
        break;
      }
    }
    return temp;
  }

  /**
   * 天穹之径BOSS奖励
   */
  public getSinglePassBossReward(
    type: number,
    floorId: number,
  ): SinglePassBossRewardData {
    var temp: SinglePassBossRewardData;
    let dropArr: t_s_dropconditionData[] =
      TempleteManager.Instance.getDropConditionByType(
        DropCondictionType.BOSS_REWARD,
      );
    for (let index = 0; index < dropArr.length; index++) {
      const element: t_s_dropconditionData = dropArr[index];
      if (
        element.Para2 &&
        element.Para2.length &&
        element.Para2[0] == floorId &&
        element.Para1 &&
        element.Para1.length &&
        element.Para1[0] == type
      ) {
        temp = new SinglePassBossRewardData();
        temp.DropId = element.DropId;
        temp.goodsInfoArr = this.getRewardInfoByDropId(element.DropId);
        break;
      }
    }
    return temp;
  }

  private getRewardInfoByDropId(dropId: number): Array<GoodsInfo> {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_dropitem,
      "DropId" + dropId,
    );
    let goodsInfo: GoodsInfo;
    let arr: Array<GoodsInfo> = [];
    for (const key in temp) {
      if (Object.prototype.hasOwnProperty.call(temp, key)) {
        const info: t_s_dropitemData = temp[key] as t_s_dropitemData;
        if (info.DropId == dropId) {
          goodsInfo = new GoodsInfo();
          goodsInfo.count = info.Data;
          goodsInfo.templateId = info.ItemId;
          arr.push(goodsInfo);
        }
      }
    }
    return arr;
  }

  public getSkillPropertyTemplateCate(
    Id: number,
  ): t_s_skillpropertytemplateData {
    let skilltemplateData: t_s_skillpropertytemplateData = null;
    skilltemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skillpropertytemplate,
      Id,
    );
    // for (const dicKey in skillTemplateProDic) {
    //     if (skillTemplateProDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_skillpropertytemplateData = skillTemplateProDic[dicKey];
    //         if (temp.TemplateId == Id) {
    //             skilltemplateData = temp;
    //             break;
    //         }
    //     }
    // }
    return skilltemplateData;
  }

  public getValueTemplateCate(Id: number): t_s_valueData {
    // let valuetemplateData: t_s_valueData = null;
    let valuetemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_value,
      Id,
    );
    // for (const dicKey in valueTemplateProDic) {
    //     if (valueTemplateProDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_valueData = valueTemplateProDic[dicKey];
    //         if (temp.Id == Id) {
    //             valuetemplateData = temp;
    //             break;
    //         }
    //     }
    // }
    return valuetemplateData;
  }

  public getValueArrByType(type: number): Array<t_s_valueData> {
    // let valuetemplateData: Array<t_s_valueData> = [];
    let valueTemplateProDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_value,
      "Type" + type,
    );
    // for (const dicKey in valueTemplateProDic) {
    //     if (valueTemplateProDic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_valueData = valueTemplateProDic[dicKey];
    //         if (temp.Type == type) {
    //             valuetemplateData.push(temp);
    //         }
    //     }
    // }
    return valueTemplateProDic ? valueTemplateProDic.concat() : [];
  }

  public gameHeroTemplateCate(templateId: number): t_s_herotemplateData {
    let info = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_herotemplate,
      templateId,
    );
    // for (const key in gameHeroTemplateDic) {
    //     if (gameHeroTemplateDic.hasOwnProperty(key)) {
    //         const info = gameHeroTemplateDic[key];
    //         if (info.TemplateId == templateId) {
    //             return info;
    //         }
    //     }
    // }
    return info;
  }

  public getouterCityShopRandomByMapShopId(
    MapShopId: number,
  ): t_s_outcityshopData {
    let outerCityShopRandomTemplateDic =
      ConfigMgr.Instance.outerCityShopRandomTemplateDic;
    let temp: t_s_outcityshopData = outerCityShopRandomTemplateDic[MapShopId];
    return temp;
    // for (const key in outerCityShopRandomTemplateDic) {
    //     if (Object.prototype.hasOwnProperty.call(outerCityShopRandomTemplateDic, key)) {
    //         let temp: t_s_outcityshopData = outerCityShopRandomTemplateDic[key] as t_s_outcityshopData;
    //         if (temp.MapShopId == MapShopId) {
    //             return temp;
    //         }
    //     }
    // }
  }

  // private passCheckArr: Array<t_s_passcheckData>;
  // public getPassCheckCfgArrByJob(job:number): Array<t_s_passcheckData> {
  //     if(!this.passCheckArr){
  //         this.passCheckArr = [];
  //         let dic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_passcheck);
  //         for (const dicKey in dic) {
  //             if (dic.hasOwnProperty(dicKey)) {
  //                 let temp: t_s_passcheckData = dic[dicKey];
  //                 // if (temp.Type == type) {
  //                     this.passCheckArr.push(temp);
  //                 // }
  //             }
  //         }
  //     }
  //     return this.passCheckArr;
  // }

  /**
   * 通行证任务配置表
   * @returns
   */
  public hasPassTask(type: number): boolean {
    //标记
    let dic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_passchecktask);
    for (const dicKey in dic) {
      if (dic.hasOwnProperty(dicKey)) {
        let temp: t_s_passchecktaskData = dic[dicKey];
        if (temp.Area == type) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 获得指定类型任务下的指定任务ID的任务配置数据
   * @param taskType
   * @param taskId
   * @returns
   */
  public getPassTask(taskType: number, taskId: number): t_s_passchecktaskData {
    let temp: t_s_passchecktaskData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_passchecktask,
      taskId,
    );
    if (temp && temp.TaskType != taskType) {
      temp = null;
    }
    // for (const dicKey in dic) {
    //     if (dic.hasOwnProperty(dicKey)) {
    //         let temp: t_s_passchecktaskData = dic[dicKey];
    //         if (temp.TaskType == taskType && temp.Id == taskId) {
    //             return temp;
    //         }
    //     }
    // }
    return temp;
  }

  public getPassCheckCfeByJob(index: number): Array<t_s_passcheckData> {
    //标记
    let arr: Array<t_s_passcheckData> = [];
    let dic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_passcheck);
    for (const dicKey in dic) {
      if (dic.hasOwnProperty(dicKey)) {
        let temp: t_s_passcheckData = dic[dicKey];
        if (temp.Index == index && temp.Grade != -1) {
          arr.push(temp);
        }
      }
    }
    return arr;
  }

  /**
   *
   * @param grade 等级
   * @param index 第几期
   * @returns
   */
  public getPassCheckItemByGrade(
    grade: number,
    index: number,
  ): t_s_passcheckData {
    let dic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_passcheck);
    for (const dicKey in dic) {
      if (dic.hasOwnProperty(dicKey)) {
        let temp: t_s_passcheckData = dic[dicKey];
        if (temp.Grade == grade && temp.Index == index) {
          return temp;
        }
      }
    }
    return null;
  }

  public getConsortiaBossRewardByLevel(level: number): t_s_consortiabossData {
    let dic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_consortiaboss);
    for (const dicKey in dic) {
      if (dic.hasOwnProperty(dicKey)) {
        let temp: t_s_consortiabossData = dic[dicKey];
        if (temp.Level == level) {
          return temp;
        }
      }
    }
    return null;
  }

  /**
   * 气泡
   * @returns
   */
  public getAllAirBubbles(): t_s_chatbubbleData[] {
    let dic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_chatbubble);
    let temp = [];
    if (!dic) return temp;
    for (const dicKey in dic) {
      if (dic.hasOwnProperty(dicKey)) {
        let data: t_s_chatbubbleData = dic[dicKey];
        temp.push(data);
      }
    }
    return temp;
  }

  public getRemotePetTemplateById(
    index: number,
    type: number,
  ): RemotePetTurnTemplateInfo {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_remotepet,
      index + "_" + type,
    );
    return temp;
  }

  public getRemotePetSkill() {
    let remotePetSkill: t_s_skilltemplateData[] = [];
    let skillTemplateDic = this.getAllRemotePetSkill();
    let temp: t_s_skilltemplateData = null;
    if (skillTemplateDic)
      for (const dicKey in skillTemplateDic) {
        if (skillTemplateDic.hasOwnProperty(dicKey)) {
          temp = skillTemplateDic[dicKey];
          if (temp.Grades == 1) remotePetSkill.push(temp);
        }
      }
    return remotePetSkill;
  }

  public getAllRemotePetSkill(): t_s_skilltemplateData[] {
    let skillTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      "MasterType200",
    );
    if (skillTemplateDic) return skillTemplateDic;
    return [];
  }

  //英灵远征关卡信息
  public getRemotePetTurns(): t_s_remotepettemplateData[] {
    let dic = ConfigMgr.Instance.getConfigMap(
      ConfigType.t_s_remotepet,
    ) as t_s_remotepet;
    return dic.mDataList;
  }

  //通过技能Id 获得英灵远征关卡信息
  public getRemotePetTurnBySkill(skillId: number): t_s_remotepettemplateData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_remotepet,
      "Skill" + skillId,
    ) as t_s_remotepettemplateData;
    if (temp[0]) return temp[0];
    return null;
  }

  //通过技能Id 获得英灵远征所有关卡信息
  public getRemotePetTurnsBySkill(skillId: number) {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_remotepet,
      "Skill" + skillId,
    ) as t_s_remotepettemplateData[];
    return temp;
  }

  //获得途径
  public getObtainCfg(obtainId: string): t_s_obtainData {
    let tempDic = null;
    let itemTemplateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_obtain);
    for (const key in itemTemplateDic) {
      if (itemTemplateDic.hasOwnProperty(key)) {
        let info: t_s_obtainData = itemTemplateDic[key];
        if (info.ObtainId && info.ObtainId.toString() == obtainId) {
          tempDic = info;
          break;
        }
      }
    }
    return tempDic;
  }

  public getHonorCfgs(): t_s_honorequipData[] {
    let tempDic = [];
    let itemTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_honorequip,
    );
    for (const key in itemTemplateDic) {
      if (itemTemplateDic.hasOwnProperty(key)) {
        let info: t_s_honorequipData = itemTemplateDic[key];
        tempDic.push(info);
      }
    }
    return tempDic;
  }

  /**
   * 荣誉装备表
   * @param upgradeType
   * @param level
   * @returns
   */
  public geHonorCfgByType(
    upgradeType: number,
    level: number,
  ): t_s_honorequipData {
    let tempDic = null;
    let itemTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_honorequip,
    );
    for (const key in itemTemplateDic) {
      if (itemTemplateDic.hasOwnProperty(key)) {
        let info: t_s_honorequipData = itemTemplateDic[key];
        if (info.UpgradeType == upgradeType && level == info.Level) {
          tempDic = info;
          break;
        }
      }
    }
    return tempDic;
  }

  public geHonorLevelByHonor(
    upgradeType: number,
    honor: number,
  ): t_s_honorequipData {
    let tempDic = null;
    let itemTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_honorequip,
    );
    for (const key in itemTemplateDic) {
      if (itemTemplateDic.hasOwnProperty(key)) {
        let info: t_s_honorequipData = itemTemplateDic[key];
        if (info.UpgradeType == upgradeType) {
          if (info.Honor >= honor) {
            tempDic = info;
            break;
          }
        }
      }
    }
    return tempDic;
  }

  /**
   * 公会战个人奖励
   * Para1  1为排名奖励, 2为个人消耗活跃度奖励
   * Para2  当Para1为1时, 是对应的排名, 当Para1为2时, 是对消耗的活跃度
   */
  public getOutyardRewardByType(type: number): OutyardRewardInfo[] {
    let outyardRewardInfo: OutyardRewardInfo;
    let outyardRewardArr: Array<OutyardRewardInfo> = [];
    let dropArr: t_s_dropconditionData[] =
      TempleteManager.Instance.getDropConditionByType(
        DropCondictionType.OUTYARD_REWARD,
      );
    for (let index = 0; index < dropArr.length; index++) {
      let element: t_s_dropconditionData = dropArr[index];
      if (
        element &&
        element.Para1 &&
        element.Para1.length &&
        element.Para1[0] == type
      ) {
        outyardRewardInfo = new OutyardRewardInfo();
        outyardRewardInfo.DropId = element.DropId;
        if (type == 1) {
          outyardRewardInfo.rank = element.Para2[0];
        } else {
          outyardRewardInfo.cost = element.Para2[0];
        }
        outyardRewardInfo.goodsInfoArr = this.getRewardInfoByDropId(
          element.DropId,
        );
        outyardRewardArr.push(outyardRewardInfo);
      }

      if (type == 1) {
        outyardRewardArr = ArrayUtils.sortOn(
          outyardRewardArr,
          ["rank"],
          [ArrayConstant.NUMERIC],
        );
      } else {
        outyardRewardArr = ArrayUtils.sortOn(
          outyardRewardArr,
          ["cost"],
          [ArrayConstant.NUMERIC],
        );
      }
    }
    return outyardRewardArr;
  }
  //符孔雕刻技能
  public getRuneActivationBySkillId(skillId: number) {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_runeactivation,
      skillId,
    ) as t_s_runeactivationData;
    return temp;
  }

  /**嘉年华-每日挑战 */
  getCarnivalDailyChallengeTempInfo(
    taskId: number,
  ): t_s_carnivaldailychallengeData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_carnivaldailychallenge,
      taskId,
    ) as t_s_carnivaldailychallengeData;
    return temp;
  }

  /**嘉年华-幸运 */
  getCarnivalLuckDrawTempInfo(Id: number): t_s_carnivalluckdrawData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_carnivalluckdraw,
      Id,
    ) as t_s_carnivalluckdrawData;
    return temp;
  }

  /**嘉年华-幸运 */
  getCarnivalPlayGroundTempInfo(Id: number) {
    // let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_carnivalluckdraw, Id) as t_s_carnivalluckdrawData;
    // return temp;
  }

  /**嘉年华-积分领奖 */
  getCarnivalPointExchangeTempInfo(Id: number): t_s_carnivalpointexchangeData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_carnivalpointexchange,
      Id,
    ) as t_s_carnivalpointexchangeData;
    return temp;
  }

  /**嘉年华在线奖励 */
  getCarnivalByType(type: number): t_s_carnivalpointexchangeData[] {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_carnivalpointexchange,
      "Type" + type,
    ) as t_s_carnivalpointexchangeData[];
    if (!temp) temp = [];
    return temp;
  }

  /**嘉年华充值有礼 */
  getCarnivalLuckDrawTempList(
    mType: number,
    sType: number = 0,
  ): t_s_carnivalluckdrawData[] {
    let key = "SonType" + sType;
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_carnivalluckdraw,
      key,
    ) as t_s_carnivalluckdrawData[];
    if (!temp) temp = [];
    let result: t_s_carnivalluckdrawData[] = [];
    for (let t of temp) {
      if (t.MasterType == mType) {
        result.push(t);
      }
    }
    return result;
  }

  /**市场可出售商品列表**/
  getItempricelimit() {
    let dic = ConfigMgr.Instance.getConfigMap(
      ConfigType.t_s_itempricelimit,
    ) as t_s_itempricelimit;
    return dic.mDataList;
  }

  public getArtifactTemplate(templateId: number): t_s_petartifactpropertyData {
    let temp = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_petartifactproperty,
      templateId,
    ) as t_s_petartifactpropertyData;
    return temp;
  }

  public getExtrajobCfg(jobType: number, jobLevel: number): t_s_extrajobData {
    let tempDic = null;
    let itemTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_extrajob,
    );
    for (const key in itemTemplateDic) {
      if (itemTemplateDic.hasOwnProperty(key)) {
        let info: t_s_extrajobData = itemTemplateDic[key];
        if (info.JobType == jobType && info.JobLevel == jobLevel) {
          tempDic = info;
          break;
        }
      }
    }
    return tempDic;
  }

  public getExtrajobEquipCfg(
    equipType: number,
    equipLevel: number,
  ): t_s_extrajobequipData {
    let tempDic = null;
    let itemTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_extrajobequip,
    );
    for (const key in itemTemplateDic) {
      if (itemTemplateDic.hasOwnProperty(key)) {
        let info: t_s_extrajobequipData = itemTemplateDic[key];
        if (info.EquipType == equipType && info.EquipLevel == equipLevel) {
          tempDic = info;
          break;
        }
      }
    }
    return tempDic;
  }

  public getExtrajobEquipStrenthenCfg(
    strenLevel: number,
  ): t_s_extrajobequipstrengthenData {
    let tempDic = null;
    let itemTemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_extrajobequipstrengthen,
    );
    for (const key in itemTemplateDic) {
      if (itemTemplateDic.hasOwnProperty(key)) {
        let info: t_s_extrajobequipstrengthenData = itemTemplateDic[key];
        if (info.StrengthenLevel == strenLevel) {
          tempDic = info;
          break;
        }
      }
    }
    return tempDic;
  }

  public getSkillIdByTypeAndGrade(
    sonType: number,
    profile: number,
    grade: number,
  ): t_s_skilltemplateData {
    let skilltemplateData: t_s_skilltemplateData = null;
    let skilltemplateDic = ConfigMgr.Instance.getDicSync(
      ConfigType.t_s_skilltemplate,
    );
    for (const dicKey in skilltemplateDic) {
      if (skilltemplateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_skilltemplateData = skilltemplateDic[dicKey];
        if (
          temp.MasterType == sonType &&
          temp.SonType == profile &&
          temp.Grades == grade
        ) {
          skilltemplateData = temp;
          break;
        }
      }
    }
    return skilltemplateData;
  }
}
