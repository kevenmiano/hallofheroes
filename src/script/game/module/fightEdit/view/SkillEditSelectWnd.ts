import FUI_CommonFrame3 from "../../../../../fui/Base/FUI_CommonFrame3";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ArmyManager } from "../../../manager/ArmyManager";
import { EditSkillItem } from "./item/EditSkillItem";
import { EditTalentItem } from "./item/EditTalentItem";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { TempleteManager } from "../../../manager/TempleteManager";
import { RuneInfo } from "../../../datas/RuneInfo";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import FUI_Skill_Panel from "../../../../../fui/Skill/FUI_Skill_Panel";
import FUI_EditPanel from "../../../../../fui/SkillEdit/FUI_EditPanel";
import { SkillInfo } from "../../../datas/SkillInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import { SkillEvent } from "../../../constant/event/NotificationEvent";
import { t_s_runetemplateData } from "../../../config/t_s_runetemplate";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ThaneInfoHelper } from "../../../utils/ThaneInfoHelper";
import { SkillEditModel } from "../SkillEditModel";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import OpenGrades from "../../../constant/OpenGrades";

/**
 * @author:zhihua.zhou
 * @data: 2022-07-6 18:40
 * @description 选择技能
 */
export default class SkillEditSelectWnd extends BaseWindow {
  private txt1: fairygui.GTextField;
  private txt2: fairygui.GTextField;
  private txt3: fairygui.GTextField;
  private btn_sure: fairygui.GButton;
  private btn_cancel: fairygui.GButton;
  private frame: FUI_CommonFrame3;

  list1: fairygui.GList;
  list2: fairygui.GList;
  list3: fairygui.GList;
  skill_panel: FUI_EditPanel;

  private _curJob: number = 1;
  private _type: number = 1;
  private isClickRune: boolean = false;
  private isRune: boolean = false;

  private listData1: Array<t_s_skilltemplateData>;
  private listData2: Array<t_s_runetemplateData>;
  private listData3: Array<t_s_skilltemplateData>;

  private defualtId = [107, 207, 307];

  /**初始化 */
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();

    this._curJob = this.frameData.job;
    this._type = this.frameData.type;
    this.isClickRune = this.frameData.isClickRune;
    this.list1 = this.skill_panel.getChild("list1").asList;
    this.list2 = this.skill_panel.getChild("list2").asList;
    this.list3 = this.skill_panel.getChild("list3").asList;
    this.txt1 = this.skill_panel.getChild("txt1").asTextField;
    this.txt2 = this.skill_panel.getChild("txt2").asTextField;
    this.txt3 = this.skill_panel.getChild("txt3").asTextField;
    this.addEvent();
    this.initLanguage();
  }

  OnShowWind() {
    super.OnShowWind();
    //获取已激活的主动技能
    this.listData1 = [];
    let array = ArmyManager.Instance.thane.skillCate.skillScript.split(",");
    for (let index = 0; index < array.length; index++) {
      let id: number = Number(array[index]);
      let temp: t_s_skilltemplateData =
        TempleteManager.Instance.getSkillTemplateInfoById(id);
      if (
        temp &&
        temp.UseWay == 1 &&
        this.defualtId.indexOf(temp.SonType) == -1
      ) {
        this.listData1.push(temp);
      }
    }
    this.list1.numItems = this.listData1.length;

    this.listData2 = [];
    let array1 = ArmyManager.Instance.thane.runeCate.studiedRuneList.getList();
    for (let i = 0; i < array1.length; i++) {
      let runeInfo: RuneInfo = array1[i];
      this.listData2.push(runeInfo.templateInfo);
    }
    this.list2.numItems = this.listData2.length;

    this.listData3 = [];
    if (ArmyManager.Instance.thane.grades >= OpenGrades.TALENT) {
      let skillInfo: SkillInfo =
        ArmyManager.Instance.thane.talentData.allTalentList[10];
      var temp: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        skillInfo.templateId.toString(),
      );
      this.listData3.push(temp);
      let skillInfo1: SkillInfo =
        ArmyManager.Instance.thane.talentData.allTalentList[20];
      var temp1: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        skillInfo1.templateId.toString(),
      );
      this.listData3.push(temp1);
      let skillInfo2: SkillInfo =
        ArmyManager.Instance.thane.talentData.allTalentList[30];
      var temp2: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        skillInfo2.templateId.toString(),
      );
      this.listData3.push(temp2);
    }

    this.list3.numItems = this.listData3.length;
  }

  initLanguage() {
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "PetChallengeSkillSelectWnd.titleTxt",
    );
    this.txt1.text = LangManager.Instance.GetTranslation("FightSkillEdit.txt8");
    this.txt2.text = LangManager.Instance.GetTranslation(
      "bag.datas.GoodsSonType.RUNNES",
    );
    this.txt3.text = LangManager.Instance.GetTranslation("FightSkillEdit.txt9");
    this.btn_sure.title = LangManager.Instance.GetTranslation("public.confirm");
    this.btn_cancel.title =
      LangManager.Instance.GetTranslation("public.cancel");
  }

  private addEvent() {
    this.list1.on(fgui.Events.CLICK_ITEM, this, this.onClickList1);
    this.list2.on(fgui.Events.CLICK_ITEM, this, this.onClickList2);
    this.list3.on(fgui.Events.CLICK_ITEM, this, this.onClickList3);

    this.list1.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem1,
      null,
      false,
    );
    this.list2.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem2,
      null,
      false,
    );
    this.list3.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem3,
      null,
      false,
    );

    this.btn_sure.onClick(this, this.onSure);
    this.btn_cancel.onClick(this, this.onCancel);
  }

  private removeEvent(): void {
    this.list1.off(fgui.Events.CLICK_ITEM, this, this.onClickList1);
    this.list2.off(fgui.Events.CLICK_ITEM, this, this.onClickList2);
    this.list3.off(fgui.Events.CLICK_ITEM, this, this.onClickList3);
    this.btn_sure.offClick(this, this.onSure);
    this.btn_cancel.offClick(this, this.onCancel);
  }

  private onRenderListItem1(index: number, item: EditSkillItem) {
    if (item) {
      item.type = this._type;
      item.setData(this._curJob, this.listData1[index]);
    }
  }

  private onRenderListItem2(index: number, item: EditSkillItem) {
    if (item) {
      item.type = this._type;
      item.setData(this._curJob, this.listData2[index]);
    }
  }

  private onRenderListItem3(index: number, item: EditTalentItem) {
    if (item) {
      item.type = this._type;
      item.setData(this._curJob, this.listData3[index]);
    }
  }

  private _curSkill: string = "";
  onClickList1(item: EditSkillItem) {
    // item.setSelect(true);
    this.isRune = false;
    this._curSkill = "1:" + item.skillData.TemplateId;
    this.list2.selectedIndex = -1;
    this.list3.selectedIndex = -1;
  }

  onClickList2(item: EditSkillItem) {
    //最多只可以选择两个符文 换符文的时候判断所点击的符文是bu's
    if (SkillEditModel.instance.curRuneNum >= 2 && !this.isClickRune) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("FightSkillEdit.txt22"),
      );
      item.selected = false;
      return;
    }
    this.isRune = true;
    item.selected = true;
    // item.setSelect(true);
    this._curSkill = "2:" + item.skillData.TemplateId;
    this.list1.selectedIndex = -1;
    this.list3.selectedIndex = -1;
  }

  onClickList3(item: EditTalentItem) {
    // item.selected = true;
    // item.setSelect(true);
    this.isRune = false;
    this._curSkill = "3:" + item.skillData.TemplateId;
    this.list1.selectedIndex = -1;
    this.list2.selectedIndex = -1;
  }

  onSure() {
    if (this._curSkill == "") {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.view.ChatView.NullMap"),
      );
      return;
    }
    if (this.isRune) {
      SkillEditModel.instance.curRuneNum++;
    }
    NotificationManager.Instance.dispatchEvent(
      SkillEvent.CHANGE_SKILL,
      this._curSkill,
    );
    this.hide();
  }

  onCancel() {
    this.hide();
  }

  /**关闭 */
  OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }
}
