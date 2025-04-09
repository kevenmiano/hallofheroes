import FUI_EquipTipsAttribute from "../../../fui/Base/FUI_EquipTipsAttribute";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import LangManager from "../../core/lang/LangManager";
import { ArmyManager } from "../manager/ArmyManager";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { GoodsManager } from "../manager/GoodsManager";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import { TempleteManager } from "../manager/TempleteManager";
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import { GoodAttributeItem } from "./GoodAttributeItem";
import { InlayItem } from "./InlayItem";
import GoodsSonType from "../constant/GoodsSonType";
import { GoodsCheck } from "../utils/GoodsCheck";
import { GoodsType } from "../constant/GoodsType";
import { t_s_suitetemplateData } from "../config/t_s_suitetemplate";
import { BagType } from "../constant/BagDefine";
import StringHelper from "../../core/utils/StringHelper";
import { BaseItem } from "../component/item/BaseItem";
import ForgeData from "../module/forge/ForgeData";
import { GoodsHelp } from "../utils/GoodsHelp";
import ComponentSetting from "../utils/ComponentSetting";
export default class EquipTipsAttribute extends FUI_EquipTipsAttribute {
  //@ts-ignore
  public power: GoodAttributeItem;
  //@ts-ignore
  public agility: GoodAttributeItem;
  //@ts-ignore
  public ability: GoodAttributeItem;
  //@ts-ignore
  public physique: GoodAttributeItem;
  //@ts-ignore
  public captain: GoodAttributeItem;
  //@ts-ignore
  public attack: GoodAttributeItem;
  //@ts-ignore
  public magicAttack: GoodAttributeItem;
  //@ts-ignore
  public defence: GoodAttributeItem;
  //@ts-ignore
  public magicDefence: GoodAttributeItem;
  //@ts-ignore
  public parry: GoodAttributeItem;
  //@ts-ignore
  public live: GoodAttributeItem;
  //@ts-ignore
  public forceHit: GoodAttributeItem;
  //@ts-ignore
  public conat: GoodAttributeItem;
  //@ts-ignore
  public inlayItem1: InlayItem;
  //@ts-ignore
  public inlayItem2: InlayItem;
  //@ts-ignore
  public inlayItem3: InlayItem;
  //@ts-ignore
  public inlayItem4: InlayItem;
  private _info: GoodsInfo;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public set info(info: GoodsInfo) {
    this.clean();
    this.initData(info, info.templateInfo);
  }

  protected initData(info: GoodsInfo, temp: t_s_itemtemplateData) {
    this._info = info;
    this._mouldGrade = info.mouldGrade;
    this.initBase(info, temp);
    this.initAttribute(info, temp);
    this.initInlay(info);
    this.initSkill(info, temp);
    this.initSuit(info, temp);
    this.txt_intensify.visible = info.templateInfo.StrengthenMax > 0;
    //FIXME 一定范围不可拖动, 此处的动态大小计算显示上还是不准确 可能是富文本引起的
    Laya.timer.callLater(this, () => {
      this.totalGroup.ensureBoundsCorrect();
      this.touchable = this.height > this.maxHeight - 100;
      // 拖动区域不准确
      if (this.scrollPane) {
        this.scrollPane.viewWidth = this.totalGroup.width;
      }
    });
    this.totalGroup.displayObject.name = "totalGroup";
  }

  protected initBase(info: GoodsInfo, temp: t_s_itemtemplateData) {
    this.txt_intensify.text =
      info.templateInfo.StrengthenMax == 0
        ? ""
        : LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.EquipTipsContent.intensify",
            info.templateInfo.StrengthenMax
          );
    this.txt_describe.text = temp.DescriptionLang;
    if (!StringHelper.isNullOrEmpty(this.txt_describe.text)) {
      this.txt_describe.visible = true;
    }
    if (ComponentSetting.SHEN_ZHOU) {
      this.setCastState(info, temp);
    }
  }

  /**
   * 设置神铸状态
   */
  private setCastState(info: GoodsInfo, temp: t_s_itemtemplateData) {
    if (
      temp.StrengthenMax > 0 &&
      temp.Profile >= 5 &&
      temp.NeedGrades >= ForgeData.MOULE_NEED_TEMP_GRADE
    ) {
      if (info.mouldRank > ForgeData.MOULD_MAX_RANK_SENIOR) {
        //TODO yishi.view.tips.goods.EquipTipsContent.castSelected.text4页神没有这个翻译不知道是什么
        this.txt_intensify.text += "页神没有这个翻译不知道是什么";
        // this.txt_intensify.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.castSelected.text4",info.mouldRankShow,info.mouldStar);
      } else if (info.mouldRank > ForgeData.MOULD_MAX_RANK) {
        this.txt_intensify.text +=
          "  " +
          LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.EquipTipsContent.castSelected.text3",
            info.mouldRankShow,
            info.mouldStar
          );
      } else {
        this.txt_intensify.text +=
          "  " +
          LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.EquipTipsContent.castSelected.text2",
            info.mouldRankShow,
            info.mouldStar
          );
      }
    } else {
      //不可神铸
      // this.txt_intensify.text += '  ' + LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.castSelected.text1");
    }
  }

  private getFashionLevelByInfo(info: GoodsInfo): number {
    let skillId: number = info.randomSkill1;
    if (!TempleteManager.Instance.getSkillTemplateInfoById(info.randomSkill1)) {
      skillId = parseInt(info.templateInfo.DefaultSkill.split(",")[0]);
    }
    let cfg = TempleteManager.Instance.getSkillTemplateInfoById(skillId);
    if (cfg) {
      return cfg.Grades;
    }
    return 0;
  }

  private initAttribute(info: GoodsInfo, temp: t_s_itemtemplateData) {
    let str: string = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip01"
    );
    this.updateAttributeTxt(
      this.power,
      str,
      temp.Power,
      this.getAdd(temp.Power, info),
      this.getNewAdd(temp.Power, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip02"
    );
    this.updateAttributeTxt(
      this.agility,
      str,
      temp.Agility,
      this.getAdd(temp.Agility, info),
      this.getNewAdd(temp.Agility, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip03"
    );
    this.updateAttributeTxt(
      this.ability,
      str,
      temp.Intellect,
      this.getAdd(temp.Intellect, info),
      this.getNewAdd(temp.Intellect, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip04"
    );
    this.updateAttributeTxt(
      this.physique,
      str,
      temp.Physique,
      this.getAdd(temp.Physique, info),
      this.getNewAdd(temp.Physique, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip05"
    );
    this.updateAttributeTxt(
      this.captain,
      str,
      temp.Captain,
      this.getAdd(temp.Captain, info),
      this.getNewAdd(temp.Captain, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip13"
    );
    this.updateAttributeTxt(
      this.attack,
      str,
      temp.Attack,
      this.getAdd(temp.Attack, info),
      this.getNewAdd(temp.Attack, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip15"
    );
    this.updateAttributeTxt(
      this.magicAttack,
      str,
      temp.MagicAttack,
      this.getAdd(temp.MagicAttack, info),
      this.getNewAdd(temp.MagicAttack, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip14"
    );
    this.updateAttributeTxt(
      this.defence,
      str,
      temp.Defence,
      this.getAdd(temp.Defence, info),
      this.getNewAdd(temp.Defence, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip16"
    );
    this.updateAttributeTxt(
      this.magicDefence,
      str,
      temp.MagicDefence,
      this.getAdd(temp.MagicDefence, info),
      this.getNewAdd(temp.MagicDefence, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip19"
    );
    this.updateAttributeTxt(
      this.parry,
      str,
      temp.Parry,
      this.getAdd(temp.Parry, info),
      this.getNewAdd(temp.Parry, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip11"
    );
    this.updateAttributeTxt(
      this.live,
      str,
      temp.Live,
      this.getAdd(temp.Live, info),
      this.getNewAdd(temp.Live, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip10"
    );
    this.updateAttributeTxt(
      this.forceHit,
      str,
      temp.ForceHit,
      this.getAdd(temp.ForceHit, info),
      this.getNewAdd(temp.ForceHit, info),
      info.objectId
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip17"
    );
    this.updateAttributeTxt(
      this.conat,
      str,
      temp.Conat,
      this.getAdd(temp.Conat, info),
      this.getNewAdd(temp.Conat, info),
      info.objectId
    );
  }

  private initInlay(info: GoodsInfo) {
    let index: number = 1;
    let key: string;
    let isFashion: boolean = this.isFashion(info.templateInfo);
    if (info.id == 0) {
      let len: number = info.templateInfo.Property1;
      if (isFashion) {
        len = 0;
      }
      for (index = 1; index <= len; index++) {
        key = "inlayItem" + index;
        if (this.hasOwnProperty(key) && this[key] != null) {
          (this[key] as InlayItem).setData(0, 0);
          (this[key] as InlayItem).visible = true;
        }
      }
    } else {
      for (index = 1; index <= 4; index++) {
        key = "inlayItem" + index;
        if (this.hasOwnProperty(key) && this[key] != null) {
          (this[key] as InlayItem).setData(info["join" + index], info.objectId);
          if (info["join" + index] != -1) {
            (this[key] as InlayItem).visible = true;
          }
        }
      }
    }
  }

  private initSkill(info: GoodsInfo, temp: t_s_itemtemplateData) {
    this.txt_skill.text = "";
    let tempStr: string = "";
    let skillString: string = "";
    let hasSkill: boolean = false;
    for (let i: number = 1; i < 6; i++) {
      skillString += info["randomSkill" + i] + ",";
      if (info["randomSkill" + i] != 0) {
        hasSkill = true;
      }
    }
    if (hasSkill == false) {
      skillString = info.templateInfo.DefaultSkill;
    }
    if (info.templateInfo.MasterType == GoodsType.HONER) {
      tempStr +=
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip23") +
        " " +
        info.templateInfo.Strength +
        "<br>";
      tempStr +=
        LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip24") +
        " " +
        info.templateInfo.Tenacity +
        "<br>";
    }
    let skillList: t_s_skilltemplateData[] =
      TempleteManager.Instance.getSkillTemplateInfoByIds(skillString);
    let skillTemp: t_s_skilltemplateData;

    if (this.isFashion(temp)) {
      for (let i = 0; i < skillList.length; i++) {
        skillTemp = skillList[i];
        if (!skillTemp) {
          continue;
        }
        tempStr += skillTemp.SkillTemplateName + "<br>";
      }
    } else {
      for (let i = 0; i < skillList.length; i++) {
        skillTemp = skillList[i];
        if (!skillTemp) {
          continue;
        }
        let star: string = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTipsContent.star",
          skillTemp.Grades
        );
        star = LangManager.Instance.GetTranslation("public.parentheses1", star);
        tempStr += skillTemp.SkillTemplateName + " " + star + "<br>";
      }
    }

    if (
      info.id == 0 &&
      !this.txt_skill.text &&
      info.templateInfo.RandomSkillCount != 0
    ) {
      tempStr +=
        "[" +
        LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTipsContent.RandomSkillCount",
          info.templateInfo.RandomSkillCount
        ) +
        "]<br>";
    }
    if (tempStr) {
      tempStr = tempStr.substr(0, tempStr.length - 4); //去掉最后一个<br>
    }

    this.txt_skill.displayObject.name = "txt_skill";
    if (tempStr) {
      this.txt_skill.text = tempStr;
      this.txt_skill.visible = true;
      this.ph_skill.visible = true;
    } else {
      this.txt_skill.visible = false;
      this.ph_skill.visible = false;
    }
  }

  private isFashion(temp: t_s_itemtemplateData): boolean { //检测是否属于时装
    if (!temp) {
      return false;
    }
    if (
      temp.SonType == GoodsSonType.SONTYPE_WING ||
      temp.SonType == GoodsSonType.FASHION_CLOTHES ||
      temp.SonType == GoodsSonType.FASHION_HEADDRESS ||
      temp.SonType == GoodsSonType.FASHION_WEAPON
    ) {
      return true;
    }
    return false;
  }

  private initSuit(info: GoodsInfo, temp: t_s_itemtemplateData) {
    let skillString: string = "";
    let suitTemp: t_s_suitetemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_suitetemplate,
      temp.SuiteId
    ); //取得套装模板
    if (suitTemp) {
      let heroId: number = info.objectId;
      let baseHero: ThaneInfo = ArmyManager.Instance.thane;
      let current: number;
      if (baseHero.id == heroId) {
        //自己
        let list: any[];
        if (info.bagType == BagType.HeroEquipment) {
          list = GoodsManager.Instance.getHeroEquipListById(heroId).getList();
        } else if (info.bagType == BagType.Honer) {
          list = GoodsManager.Instance.getHeroHonorListById(heroId).getList();
        }
        current = suitTemp.existCount(list);
      } //别人
      else {
        current = info.suitCount;
      }
      //以上基督受难集齐的套装数量

      let num: number = suitTemp.suitCount;
      this.txt_suitTitle.text =
        suitTemp.TemplateNameLang +
        "(" +
        (current > 0 ? current : 0) +
        "/" +
        num +
        ")";
      if (num > 1) {
        this.txt_suitTitle.visible = true;
      } else {
        this.txt_suitTitle.visible = false;
      }
      let text: fgui.GTextField;
      for (let k: number = 1; k < 9; k++) {
        //每套最大8件套装单件
        let suitGood: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          suitTemp["Template" + k]
        ); //取得单件模板（物品模板）
        let info: GoodsInfo = GoodsManager.Instance.getGoodsByObjectIdAndGoodID(
          heroId,
          suitTemp["Template" + k]
        );
        if (!info) {
          info = GoodsManager.Instance.getGoodsByObjectIdAndGoodID(
            heroId,
            suitTemp["Template" + k + "S"]
          );
        }
        if (suitGood) {
          text = this["txt_suit" + k] as fgui.GTextField;
          text.text = suitGood.TemplateNameLang;
          text.color = "#7d7d7d";
          if (num > 1) {
            text.visible = true;
          } else {
            text.visible = false;
          }

          if (info && current > 0) {
            text.color = "#ffffff";
          }
          skillString += suitTemp["Property" + k] + ","; //property1-8为集齐对应套装数量的技能
        }
      }
      this.initSuitSkill(num, skillString, current);
    }
  }

  private initSuitSkill(suitCount: number, skillIds: string, current: number) {
    //套装技能
    let text: fgui.GTextField;
    let skillList: t_s_skilltemplateData[] =
      TempleteManager.Instance.getSkillTemplateInfoByIds(skillIds); //取得技能模板
    for (let count: number = 0; count < skillList.length; count++) {
      let skillTemp: t_s_skilltemplateData = skillList[count];
      if (skillTemp) {
        text = this["txt_suitSkill" + (count + 1)];
        if (suitCount > 1) {
          text.text = "(" + (count + 1) + ")" + skillTemp.SkillTemplateName;
        } else {
          text.text = skillTemp.SkillTemplateName;
        }
        text.color = "#7d7d7d";
        if (suitCount <= 1 || count < current) {
          //到达数量换颜色显示
          text.color = "#eedb05";
        }
        text.visible = true;
      }
    }
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private updateAttributeTxt(
    item: GoodAttributeItem,
    property: string,
    value: number,
    addValue: number,
    newAddValue?: number,
    objectId?: number
  ) {
    if (value != 0) {
      item.visible = true;
      item.updateText(property, value, addValue, newAddValue, objectId);
    } else {
      item.visible = false;
    }
  }

  /** 获取神铸的添加值 */
  private getNewAdd(preValue: number, gInfo: GoodsInfo): number {
    let temp: t_s_itemtemplateData =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(gInfo.templateId);
    if (
      temp.StrengthenMax > 0 &&
      temp.Profile >= 5 &&
      temp.NeedGrades >= 50 &&
      temp.MasterType != GoodsType.PET_EQUIP
    ) {
      if (gInfo.mouldGrade > 0) {
        let curr: number = GoodsHelp.getMouldAddition(
          preValue,
          this.getPropertyMouldGrade(gInfo)
        );
        return curr;
      }
    }
    return -1;
  }

  private getAdd(preValue: number, gInfo: GoodsInfo): number {
    return (
      Math.floor(preValue * gInfo.strengthenGrade * 0.1) +
      gInfo.strengthenGrade * 5
    );
  }

  private getStrengthenGrade(gInfo: GoodsInfo): Object {
    return gInfo.strengthenGrade > 0 ? "+" + gInfo.strengthenGrade : "";
  }

  private _mouldGrade: number;
  private getPropertyMouldGrade(gInfo: GoodsInfo): number {
    if (this._mouldGrade < 1) {
      return 1;
    } else if (this._mouldGrade > gInfo.MOULD_MAX_GRADE) {
      return gInfo.MOULD_MAX_GRADE;
    }
    return this._mouldGrade;
  }

  dispose() {
    super.dispose();
  }

  public clean() {
    this.txt_skill.visible = false;
    this.txt_suitTitle.visible = false;

    let key: string = "";
    for (let i = 1, len = 4; i <= len; i++) {
      key = "inlayItem" + i;
      (this[key] as InlayItem).visible = false;
    }

    let text: fgui.GTextField;
    for (let k: number = 1; k < 9; k++) {
      text = this["txt_suit" + k];
      text.visible = false;
    }

    for (let i: number = 1; i < 9; i++) {
      text = this["txt_suitSkill" + i];
      text.visible = false;
    }

    this.power.visible = false;
    this.agility.visible = false;
    this.ability.visible = false;
    this.physique.visible = false;
    this.captain.visible = false;
    this.attack.visible = false;
    this.magicAttack.visible = false;
    this.defence.visible = false;
    this.magicDefence.visible = false;
    this.parry.visible = false;
    this.live.visible = false;
    this.forceHit.visible = false;
    this.conat.visible = false;

    this.txt_intensify.visible = false;
    this.txt_describe.visible = false;
  }
}
