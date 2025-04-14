/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 14:19:58
 * @LastEditTime: 2021-11-29 21:04:09
 * @LastEditors: jeremy.xu
 * @Description:
 */

import ConfigMgr from "../../core/config/ConfigMgr";
import LangManager from "../../core/lang/LangManager";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import StringHelper from "../../core/utils/StringHelper";
import { t_s_skillbuffertemplateData } from "../config/t_s_skillbuffertemplate";
import { t_s_startemplateData } from "../config/t_s_startemplate";
import { t_s_upgradetemplateData } from "../config/t_s_upgradetemplate";
import { ConfigType } from "../constant/ConfigDefine";
import { UpgradeType } from "../constant/UpgradeType";
import { TempleteManager } from "../manager/TempleteManager";
import StarInfo from "../module/mail/StarInfo";

export class StarHelper {
  /**
   * 根据星运品质获得品质名称
   */
  public static getProfileNameByProfile(profile: number): string {
    var str: string = "";
    switch (profile) {
      case 1:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName01",
        );
        break;
      case 2:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName02",
        );
        break;
      case 3:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName03",
        );
        break;
      case 4:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName04",
        );
        break;
      case 5:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName05",
        );
        break;
      case 6:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName06",
        );
        break;
      case 7:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName07",
        );
        break;
    }
    return str;
  }

  /**
   * 获得指定品质星运的升级模板列表
   * @param profile : number
   * @return upgradeList :any[]
   */
  public static getStarUpgradeListByProfile(profile: number): any[] {
    var type: number;
    switch (profile) {
      case 2:
        type = UpgradeType.UPGRADE_TYPE_STAR_PROFILE2;
        break;
      case 3:
        type = UpgradeType.UPGRADE_TYPE_STAR_PROFILE3;
        break;
      case 4:
        type = UpgradeType.UPGRADE_TYPE_STAR_PROFILE4;
        break;
      case 5:
        type = UpgradeType.UPGRADE_TYPE_STAR_PROFILE5;
        break;
      case 6:
        type = UpgradeType.UPGRADE_TYPE_STAR_PROFILE6;
        break;
      case 7:
        type = UpgradeType.UPGRADE_TYPE_STAR_PROFILE7;
        break;
    }
    return TempleteManager.Instance.getTemplatesByType(type);
  }

  /**
   * 获得指定品质星运的最高模板等级
   * @param profile : number
   * @return grade : number
   */
  public static getStarMaxGradeByProfile(profile: number): number {
    var upgradeList: any[] = StarHelper.getStarUpgradeListByProfile(profile);
    var level: number = -1;
    upgradeList.forEach((tp: t_s_upgradetemplateData) => {
      if (tp.Grades > level) level = tp.Grades;
    });
    return level;
  }

  /**
   *检查星运可升至等级
   * @param exp  经验
   * @param info  星运
   */
  public static checkCanUpGrade(exp: number, info: StarInfo): number {
    var upGrade: number = info.grade;
    var upgradeList: t_s_upgradetemplateData[] =
      StarHelper.getStarUpgradeListByProfile(info.template.Profile);
    upgradeList.sort((a, b) => {
      return a.Grades - b.Grades;
    });
    for (let index = 0; index < upgradeList.length; index++) {
      const temp = upgradeList[index] as t_s_upgradetemplateData;
      if (temp.Grades == info.grade + 1) exp = exp - (temp.Data - info.gp);
      if (temp.Grades > info.grade + 1) exp = exp - temp.Data;
      if (exp >= 0) upGrade = temp.Grades;
      else break;
    }
    return upGrade;
  }

  /**
   * 获得星运积累经验
   * @param info:StarInfo
   * @return totalExp:number
   */
  public static getStarTotalExp(info: StarInfo): number {
    var totalExp: number = 0;
    if (!info || !info.template) return 0;
    var currentGrade: number = info.grade;
    var upgradeList: any[] = StarHelper.getStarUpgradeListByProfile(
      info.template.Profile,
    );
    for (let index = 0; index < upgradeList.length; index++) {
      const tp = upgradeList[index] as t_s_upgradetemplateData;
      if (currentGrade >= tp.Grades) totalExp += tp.Data;
    }
    totalExp += info.gp + info.template.SellGp;
    return totalExp;
  }

  /**
   * 获得指定品质、等级星运的模板经验
   * @param level : number
   * @param profile : number
   * @return exp : number
   */
  public static getStarExp(level: number, profile: number): number {
    var upgradeList: any[] = StarHelper.getStarUpgradeListByProfile(profile);
    for (let index = 0; index < upgradeList.length; index++) {
      const tp = upgradeList[index] as t_s_upgradetemplateData;
      if (level == tp.Grades) {
        return tp.Data;
      }
    }
    return 0;
  }

  /**
   * 得到星运属性加成
   */
  public static getStarAttributeAdd(info: StarInfo): string {
    var str: string = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip01",
    );
    if (info.template.Power * info.grade > 0) {
      return str + "+" + info.template.Power * info.grade;
    }
    if (info.template.Agility * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip02",
      );
      return str + "+" + info.template.Agility * info.grade;
    }
    if (info.template.Intellect * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip03",
      );
      return str + "+" + info.template.Intellect * info.grade;
    }
    if (info.template.Physique * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip04",
      );
      return str + "+" + info.template.Physique * info.grade;
    }
    if (info.template.Captain * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip05",
      );
      return str + "+" + info.template.Captain * info.grade;
    }
    if (info.template.Attack * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip13",
      );
      return str + "+" + info.template.Attack * info.grade;
    }
    if (info.template.Defence * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip14",
      );
      return str + "+" + info.template.Defence * info.grade;
    }
    if (info.template.MagicAttack * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip15",
      );
      return str + "+" + info.template.MagicAttack * info.grade;
    }
    if (info.template.MagicDefence * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip16",
      );
      return str + "+" + info.template.MagicDefence * info.grade;
    }
    if (info.template.ForceHit * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip10",
      );
      return str + "+" + info.template.ForceHit * info.grade;
    }
    if (info.template.Live * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip11",
      );
      return str + "+" + info.template.Live * info.grade;
    }
    if (info.template.Conat * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip17",
      );
      return str + "+" + info.template.Conat * info.grade;
    }
    if (info.template.Parry * info.grade > 0) {
      str = LangManager.Instance.GetTranslation(
        "armyII.ThaneAttributeView.Tip19",
      );
      return str + "+" + info.template.Parry * info.grade;
    }
    if (info.template.DefaultSkill.length > 0)
      return StarHelper.getStarBufferName(info);
    return "";
  }

  /**
   *得到星运buffer描述
   * @param info:StarInfo
   */
  public static getStarBufferName(info: StarInfo): string {
    var bufferTemp: t_s_skillbuffertemplateData =
      ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skillbuffertemplate,
        info.template.DefaultSkill[0],
      );
    if (bufferTemp) {
      var bufferField: string = StringHelper.getSubStrBetweenTwoChar(
        "{",
        "}",
        bufferTemp.BufferNameLang,
      );
      if (StringHelper.isNullOrEmpty(bufferField)) {
        return bufferTemp.BufferNameLang;
      } else {
        var bufferValue: number = bufferTemp.hasOwnProperty(bufferField)
          ? Math.abs(bufferTemp[bufferField]) * info.grade
          : 0;
        return StringHelper.replaceStr(
          bufferTemp.BufferNameLang,
          "{" + bufferField + "}",
          String(bufferValue),
        );
      }
    }
    return "";
  }

  public static profileColors = [
    "#ffffff",
    "#999999",
    "#59cd41",
    "#32a2f8",
    "#a838f7",
    "#ff8000",
    "#ce0f0f",
    "#ce0f0f",
  ];
  public static getStarHtmlName(temp: t_s_startemplateData): string {
    if (!temp) return "";
    if (!StarHelper.profileColors) {
      StarHelper.profileColors = [
        "#ffffff",
        "#999999",
        "#59cd41",
        "#32a2f8",
        "#a838f7",
        "#ff8000",
        "#ce0f0f",
        "#ce0f0f",
      ];
    }
    var color: string = StarHelper.profileColors[temp.Profile];
    if (color) {
      return (
        "\\[" +
        LangManager.Instance.GetTranslation(
          "StarHelper.tempTxt",
          color,
          temp.TemplateNameLang,
        ) +
        "]"
      );
    }
    return "[" + temp.TemplateNameLang + "]";
  }

  /**
   * 计算列表星力值
   */
  public static getStarPowerByList(dic: SimpleDictionary): number {
    var starPow: number = 0;
    for (let index = 0; index < dic.getList().length; index++) {
      const info = dic.getList()[index];
      if (info instanceof StarInfo)
        starPow += StarHelper.getStarTotalExp(<StarInfo>info);
    }
    starPow = Math.floor(starPow / 10);
    return starPow;
  }

  /**
   * 检查列表中是否有星运
   */
  public static checkExistStarInfoInDic(dic: SimpleDictionary): boolean {
    for (let index = 0; index < dic.getList().length; index++) {
      const info = dic.getList()[index];
      if (info instanceof StarInfo) return true;
    }
    return false;
  }

  /**
   * 检查列表中是否有星运
   */
  public static getStarInfo(dic: SimpleDictionary): Array<StarInfo> {
    let result: Array<StarInfo> = [];
    for (const key in dic) {
      const element = dic[key];
      if (element instanceof StarInfo) {
        result.push(element);
      }
    }
    return result;
  }

  /**
   * 计算列表星力值
   */
  public static getStarPower(dic: Array<StarInfo>): number {
    var starPow: number = 0;
    for (let index = 0; index < dic.length; index++) {
      const info = dic[index];
      starPow += StarHelper.getStarTotalExp(<StarInfo>info);
    }
    starPow = Math.floor(starPow / 10);
    return starPow;
  }
}
