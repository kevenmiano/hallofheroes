import FUI_SkillItemCom from "../../../fui/Skill/FUI_SkillItemCom";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import UIButton from "../../core/ui/UIButton";
import { IconFactory } from "../../core/utils/IconFactory";
import { BaseIcon } from "../component/BaseIcon";
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import { SkillEvent } from "../constant/event/NotificationEvent";
import { IconType } from "../constant/IconType";
import { EmWindow } from "../constant/UIDefine";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { SkillInfo } from "../datas/SkillInfo";
import { ArmyManager } from "../manager/ArmyManager";
import DragManager from "../manager/DragManager";
import { NotificationManager } from "../manager/NotificationManager";
import { ResourceManager } from "../manager/ResourceManager";
import ExtraJobModel from "../module/bag/model/ExtraJobModel";
import ScrollTextField from "../module/common/ScrollTextField";
import NewbieUtils from "../module/guide/utils/NewbieUtils";
import SkillItemCom from "../module/skill/item/SkillItemCom";
import SkillWnd from "../module/skill/SkillWnd";
import SkillWndCtrl from "../module/skill/SkillWndCtrl";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import StringUtils from "../utils/StringUtils";
import BaseTips from "./BaseTips";

/**
 *
 */
export class SkillItemTips extends BaseTips {
  private skillEffect: fgui.GComponent;
  private skillEffectRichText: ScrollTextField; //当前技能效果
  private skillCold: fgui.GTextField; //当前技能冷却时间
  private skillCost: fgui.GTextField; //当前技能消耗怒气
  private skillCost2: fgui.GTextField; //当前技能消耗怒气
  private nextSkillCold: fgui.GTextField; //当前技能冷却时间
  private nextSkillCost: fgui.GTextField; //当前技能消耗怒气
  //下一级技能效果
  private skillEffect2: fgui.GComponent;
  private nextSkillEffectRichText: ScrollTextField; //下一级技能效果
  public skillName: fgui.GTextField;
  public skillLevel: fgui.GTextField;
  public skillName2: fgui.GTextField;
  public txt1: fgui.GTextField;
  public txt_gold: fgui.GTextField;
  private selectSkillItem: BaseIcon; //当前右侧选中技能
  private item2: BaseIcon; //当前右侧选中技能
  private bePassiveSkillLabel: fgui.GTextField; //被动
  private bePassiveSkillLabel2: fgui.GTextField; //被动
  private txt_lv1: fgui.GTextField;
  private txt_lv2: fgui.GTextField;
  private txt_condition: fgui.GTextField;
  private nextBox: fgui.GGroup;
  private curBox: fgui.GGroup;
  private totalBox: fgui.GGroup;
  // private box1: fgui.GGroup;
  // private box2: fgui.GGroup;
  private box3: fgui.GGroup;
  private costGold: fgui.GGroup;
  private studyBox: fgui.GGroup;
  private opreateGroup: fgui.GGroup;
  img_bg: fgui.GComponent;
  list: fgui.GList;
  listData: t_s_skilltemplateData[];
  private studyBtn: fgui.GButton; //学习
  private upgradeBtn: fgui.GButton;
  private selectSkillData: SkillInfo = null;
  /** 是否专精技能 */
  private isMasterySkill: boolean = false;
  constructor() {
    super();
  }

  public OnShowWind() {
    super.OnShowWind();
    this.addEvent();
    this.totalBox.ensureBoundsCorrect();
    this.setSelectSkillInfo(this.params[0]);
  }

  public OnInitWind() {
    super.OnInitWind();
    this.studyBtn.title = LangManager.Instance.GetTranslation(
      "armyII.viewII.skill.btnStudy",
    );
    this.upgradeBtn.title = LangManager.Instance.GetTranslation(
      "armyII.viewII.skill.btnUpgrade",
    );
    this.skillEffectRichText = new ScrollTextField(this.skillEffect);
    this.nextSkillEffectRichText = new ScrollTextField(this.skillEffect2);
  }

  __skillChangeHandler(info: SkillInfo) {
    this.selectSkillData = info;
    this.setSelectSkillInfo(this.selectSkillData);
  }

  /**清除选中技能数据 */
  cleatSkillData() {
    this.studyBtn.visible = false;
    this.upgradeBtn.visible = false;
    this.bePassiveSkillLabel.text = "";
  }

  private _grade: number = -1;
  /**选中某个技能 */
  setSelectSkillInfo(data: SkillInfo) {
    if (!data) return;
    this.selectSkillData = data;
    this.cleatSkillData();
    Logger.log("选择技能:", data.templateInfo.TemplateNameLang);
    this.skillName.text = data.templateInfo.TemplateNameLang;
    this.selectSkillItem.icon = IconFactory.getTecIconByIcon(
      data.templateInfo.Icons,
    );
    let info: SkillInfo = data as SkillInfo;
    let curTemp: t_s_skilltemplateData = info.templateInfo;
    this.isMasterySkill = curTemp.MasterType >= 41 && curTemp.MasterType <= 44;
    let nextTemp: t_s_skilltemplateData = info.nextTemplateInfo;
    this.bePassiveSkillLabel.text = this.bePassiveSkillLabel2.text =
      this.getSkillType(info.templateInfo);
    let ismax: boolean;
    this.costGold.visible = false;
    if (info.grade == 0) {
      //未激活
      this._grade = 0;
      this.skillName.text = nextTemp.TemplateNameLang;
      if (nextTemp.CoolDown > 0) {
        this.skillCold.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.cooldown01",
          nextTemp.CoolDown * 0.001,
        );
      }
      if (nextTemp.Cost < 0) {
        var num: number = Math.abs(nextTemp.Cost);
        this.skillCost.text = this.getCoststring(num);
      }
      let skillEffectText: string = StringUtils.stringFormat2(
        nextTemp.SkillDescription,
        { key: "Parameter1", value: Math.abs(nextTemp.Parameter1) },
        { key: "Parameter2", value: Math.abs(nextTemp.Parameter2) },
        { key: "Parameter3", value: Math.abs(nextTemp.Parameter3) },
        { key: "Cost", value: Math.abs(nextTemp.Cost) },
      );
      this.skillEffectRichText.text = skillEffectText;
      if (this.isMasterySkill) {
        if (this.checkCanStudy()) {
        } else {
          //xx秘典达到xx级
          let jobtype = this.selectSkillData.templateInfo.MasterType;
          let p1 = LangManager.Instance.GetTranslation(
            "Mastery.jobtype" + jobtype,
          );
          let str = LangManager.Instance.GetTranslation(
            "Mastery.sutdyCondition",
            p1,
            this.selectSkillData.templateInfo.NeedPlayerGrade,
          );
          this.txt_condition.text = str;
          this.txt_condition.visible = true;
        }
        this.list.visible = false;
      } else {
        this.listData = info.getUpgradeCondition(nextTemp);
        this.list.numItems = this.listData.length;
      }
      this.nextBox.visible = false;
    } else if (nextTemp) {
      //升级
      this.item2.icon = IconFactory.getTecIconByIcon(data.templateInfo.Icons);
      this.txt_lv1.text = LangManager.Instance.GetTranslation(
        "public.level2",
        curTemp.Grades,
      );
      this.txt_lv2.text = LangManager.Instance.GetTranslation(
        "public.level2",
        curTemp.Grades + 1,
      );
      this.nextBox.visible = true;
      this.skillName2.text = curTemp.TemplateNameLang;
      this.skillLevel.text =
        curTemp.Grades > 0
          ? LangManager.Instance.GetTranslation("public.level2", curTemp.Grades)
          : "";
      if (curTemp.CoolDown > 0) {
        this.skillCold.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.cooldown01",
          curTemp.CoolDown * 0.001,
        );
      }
      if (curTemp.Cost < 0) {
        num = Math.abs(curTemp.Cost);
        this.skillCost.text = this.getCoststring(num);
      }
      let skillEffect: string = StringUtils.stringFormat2(
        curTemp.SkillDescription,
        { key: "Parameter1", value: Math.abs(curTemp.Parameter1) },
        { key: "Parameter2", value: Math.abs(curTemp.Parameter2) },
        { key: "Parameter3", value: Math.abs(curTemp.Parameter3) },
        { key: "Cost", value: Math.abs(curTemp.Cost) },
      );
      this.skillEffectRichText.text = skillEffect;
      if (nextTemp.CoolDown > 0) {
        this.nextSkillCost.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.cooldown01",
          nextTemp.CoolDown * 0.001,
        );
      }
      if (nextTemp.Cost < 0) {
        this.skillCost2.text = this.getCoststring(nextTemp.Cost);
      }
      let nextEffect: string = StringUtils.stringFormat2(
        nextTemp.SkillDescription,
        { key: "Parameter1", value: Math.abs(nextTemp.Parameter1) },
        { key: "Parameter2", value: Math.abs(nextTemp.Parameter2) },
        { key: "Parameter3", value: Math.abs(nextTemp.Parameter3) },
        { key: "Cost", value: Math.abs(nextTemp.Cost) },
      );
      this.nextSkillEffectRichText.text = nextEffect;
      if (this.isMasterySkill) {
        if (this.checkCanAddExtrajob(this.selectSkillData)) {
        } else {
          //xx秘典达到xx级
          let jobtype = this.selectSkillData.templateInfo.MasterType;
          let p1 = LangManager.Instance.GetTranslation(
            "Mastery.jobtype" + jobtype,
          );
          let str = LangManager.Instance.GetTranslation(
            "Mastery.sutdyCondition",
            p1,
            this.selectSkillData.nextTemplateInfo.NeedPlayerGrade,
          );
          this.txt_condition.text = str;
          this.txt_condition.visible = true;
        }
        this.list.visible = false;
      } else {
        this.listData = info.getUpgradeCondition(nextTemp);
        this.list.numItems = this.listData.length;
      }
      if (this._grade == 0) {
        this._grade = info.grade;
        this.x -= this.contentPane.width / 2;
      }
      this.box3.visible = false;
    } else {
      //最大等级
      this.skillLevel.text =
        curTemp.Grades > 0
          ? LangManager.Instance.GetTranslation("public.level2", curTemp.Grades)
          : "";
      if (curTemp.CoolDown > 0) {
        this.skillCold.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.cooldown01",
          Math.ceil(curTemp.CoolDown * 0.001),
        );
      }
      if (curTemp.Cost < 0) {
        this.skillCost.text = this.getCoststring(curTemp.Cost);
      }
      let skillEffect: string = StringUtils.stringFormat2(
        curTemp.SkillDescription,
        { key: "Parameter1", value: Math.abs(curTemp.Parameter1) },
        { key: "Parameter2", value: Math.abs(curTemp.Parameter2) },
        { key: "Parameter3", value: Math.abs(curTemp.Parameter3) },
        { key: "Cost", value: Math.abs(curTemp.Cost) },
      );
      this.skillEffectRichText.text = skillEffect;
      this.nextBox.visible =
        this.opreateGroup.visible =
        this.costGold.visible =
        this.studyBox.visible =
          false;
      this.box3.visible = true;
      // this.img_bg.height = 415;
      ismax = true;
    }
    //检查按钮状态
    if (!ismax) {
      this.checkBtnCondition();
    }
    this.curBox.ensureBoundsCorrect();
    this.totalBox.ensureBoundsCorrect();
  }

  public checkBtnCondition() {
    let selectSkillData = this.selectSkillData; // || this.selectFastSkillData;
    if (!selectSkillData) return;
    let _isOpen: boolean = selectSkillData.grade == 0; //是否开放
    let _canAdd: boolean;
    let isgoldEnough;
    if (this.isMasterySkill) {
      _canAdd = this.checkCanAddExtrajob(selectSkillData);
      this.txt_gold.text =
        selectSkillData.nextTemplateInfo.Parameter3.toString();
      isgoldEnough =
        ResourceManager.Instance.gold.count >=
        selectSkillData.templateInfo.Parameter3;
      if (!isgoldEnough) {
        this.txt_gold.color = "#ff2e2e";
      }
    } else {
      _canAdd = this.checkCanAdd(selectSkillData); //是否可加点
    }

    if (_isOpen) {
      this.studyBtn.visible = true;
      this.txt1.text = LangManager.Instance.GetTranslation(
        "ConsortiaSkillTowerWnd.n70",
      );
      if (this.isMasterySkill) {
        let jobtype = this.selectSkillData.templateInfo.MasterType;
        let jobLevel = ExtraJobModel.instance.getExtrajobItemLevel(jobtype);
        if (jobLevel == 0) {
          //未激活
          this.opreateGroup.visible = this.costGold.visible = false;
          this.studyBox.visible = true;
        } else if (
          jobLevel >= this.selectSkillData.templateInfo.NeedPlayerGrade
        ) {
          //Parameter3——升级所消耗的黄金（无物品消耗）
          this.studyBtn.enabled = isgoldEnough;
          this.costGold.visible = true;
          this.studyBox.visible = false;
        } else {
          this.studyBtn.visible = false;
          this.costGold.visible = false;
        }
      } else {
        this.studyBtn.enabled = _canAdd;
      }
    } else {
      if (this.isMasterySkill) {
        this.opreateGroup.visible = _canAdd;
        this.costGold.visible = _canAdd;
        if (!_canAdd) {
          this.studyBox.visible = true;
          this.txt1.text = LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.SkillTips.need",
          );
        } else {
          this.upgradeBtn.visible = true;
          this.studyBox.visible = false;
        }
      } else {
        this.upgradeBtn.visible = true;
        this.txt1.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.need",
        );
        this.upgradeBtn.enabled = _canAdd;
      }
    }
  }

  checkCanStudy(): boolean {
    let jobtype = this.selectSkillData.templateInfo.MasterType;
    let jobLevel = ExtraJobModel.instance.getExtrajobItemLevel(jobtype);
    if (
      jobLevel <= 0 ||
      jobLevel < this.selectSkillData.templateInfo.NeedPlayerGrade
    ) {
      //升级所需对应秘典等级读取字段NeedPlayerGrade
      return false;
    }
    return true;
  }

  /**专精技能升级条件 */
  private checkCanAddExtrajob(skill: SkillInfo): boolean {
    let jobtype = skill.nextTemplateInfo.MasterType;
    let jobLevel = ExtraJobModel.instance.getExtrajobItemLevel(jobtype);
    if (skill.grade == 0) {
      let canStudy = jobLevel >= skill.templateInfo.NeedPlayerGrade;
      return canStudy;
    } else {
      let canUpgrade = jobLevel >= skill.nextTemplateInfo.NeedPlayerGrade;
      if (canUpgrade) {
        return true;
      }
    }
    return false;
  }

  /**是否可加点 */
  private checkCanAdd(selectSkillData: SkillInfo): boolean {
    let thane = ArmyManager.Instance.thane;
    if (!selectSkillData.nextTemplateInfo) return false;
    if (thane.skillCate.skillPoint <= 0) return false;
    if (
      selectSkillData.checkUpgradeCondition(selectSkillData.nextTemplateInfo)
        .length > 0
    )
      return false;
    return true;
  }

  private addEvent() {
    this.studyBtn.onClick(this, this._onStudySkill);
    this.upgradeBtn.onClick(this, this._onUpgradeSkill);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRender,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      SkillEvent.SKILL_UPGRADE,
      this.__skillChangeHandler,
      this,
    );
  }

  removeEvent() {
    this.studyBtn.offClick(this, this._onStudySkill);
    this.upgradeBtn.offClick(this, this._onUpgradeSkill);
    NotificationManager.Instance.removeEventListener(
      SkillEvent.SKILL_UPGRADE,
      this.__skillChangeHandler,
      this,
    );
  }
  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  onRender(index: number, item: FUI_SkillItemCom) {
    if (item) {
      let itemData: any = this.listData[index];
      if (itemData instanceof t_s_skilltemplateData) {
        item.txt_name.text = itemData.TemplateNameLang;
        item.icon = IconFactory.getTecIconByIcon(itemData.Icons);
        let curGrade = 0;
        let skillInfo;
        if (this.isMasterySkill) {
          skillInfo = this.thane.skillCate.getExtrajobSkillInfoBySkillTempId(
            itemData.TemplateId,
          );
        } else {
          skillInfo = this.thane.skillCate.getSkillInfoBySkillTempId(
            itemData.TemplateId,
          );
        }
        if (skillInfo) {
          curGrade = skillInfo.grade;
        }
        if (curGrade < itemData.Grades) {
          item.num.color = "#ff0000";
        }
        item.num.text = curGrade + "/" + itemData.Grades;
      } else {
        item.icon = IconFactory.getPlayerIcon(
          ArmyManager.Instance.thane.snsInfo.headId,
          IconType.HEAD_ICON,
        );
        item.txt_name.text = LangManager.Instance.GetTranslation(
          "buildings.BaseBuildFrame.gradeValue",
          itemData,
        );
        if (this.thane.grades < itemData) {
          item.num.color = "#ff0000";
        }
        item.num.autoSize = 1;
        item.num.text = this.thane.grades + "/" + itemData;
      }
      item.txt_name.fontSize = 18;
      item.skillLevelBox.visible = true;
    }
  }

  /**升级技能 */
  _onUpgradeSkill() {
    if (DragManager.Instance.isDraging) return;
    Logger.log("升级技能");
    if (this.isMasterySkill) {
      this.control.sendAddSkillPoint(
        this.selectSkillData,
        2,
        this.selectSkillData.templateInfo.MasterType,
      );
    } else {
      this.control.sendAddSkillPoint(this.selectSkillData);
    }
    // this.hide();
  }

  /**装备技能 */
  // private _onEquipOnSkill(e: Laya.Event) {
  //     NotificationManager.Instance.dispatchEvent(SkillEvent.PUTON);
  // }

  /**卸下技能 */
  // _onEquipOffSkill() {
  //     NotificationManager.Instance.dispatchEvent(SkillEvent.PUTOFF);
  // }

  /**学习技能 */
  private _onStudySkill() {
    if (DragManager.Instance.isDraging) return;
    Logger.log("学习技能");
    if (this.isMasterySkill) {
      this.control.sendAddSkillPoint(
        this.selectSkillData,
        2,
        this.selectSkillData.templateInfo.MasterType,
      );
    } else {
      this.control.sendAddSkillPoint(this.selectSkillData);
    }
    // this.hide();
  }

  private getSkillType(temp: t_s_skilltemplateData): string {
    if (temp.UseWay == 2)
      return (
        "[" +
        LangManager.Instance.GetTranslation(
          "yishi.datas.templates.SkillTempInfo.UseWay02",
        ) +
        "]"
      );
    switch (temp.AcceptObject) {
      case 1:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type01",
        );
        break;
      case 2:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type02",
        );
        break;
      case 3:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type03",
        );
        break;
      case 4:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type04",
        );
        break;
      case 5:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type05",
        );
        break;
      case 6:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type06",
        );
        break;
      case 7:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type07",
        );
        break;
      case 8:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type08",
        );
        break;
      case 9:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type09",
        );
        break;
      case 10:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type10",
        );
        break;
      case 11:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type11",
        );
        break;
      case 12:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type12",
        );
        break;
      case 13:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type13",
        );
        break;
      case 14:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type14",
        );
        break;
      case 15:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type15",
        );
        break;
      case 16:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type16",
        );
        break;
      case 17:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type17",
        );
        break;
      case 18:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type18",
        );
        break;
      case 19:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type19",
        );
        break;
      case 20:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type20",
        );
        break;
      case 21:
        return LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.SkillTips.Type21",
        );
        break;
    }
    return "";
  }

  public getCoststring(num: number): string {
    var str: string = "";
    num = Math.abs(num);
    num = parseInt(num.toString());
    str = LangManager.Instance.GetTranslation(
      "yishi.view.tips.goods.SkillTips.cooldown02",
      num,
    );
    return str;
  }

  private get control(): SkillWndCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
  }

  protected OnClickModal() {
    super.OnClickModal();
    this.hide();
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }
}
