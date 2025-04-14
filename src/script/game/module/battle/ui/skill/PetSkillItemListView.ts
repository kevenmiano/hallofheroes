import FUI_PetSkillItemListView from "../../../../../../fui/Battle/FUI_PetSkillItemListView";
import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { BattleCooldownModel } from "../../../../battle/data/BattleCooldownModel";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { BattleNotic } from "../../../../constant/event/NotificationEvent";
import { SkillInfo } from "../../../../datas/SkillInfo";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { BattleSkillItemII } from "./BattleSkillItemII";
import { PetSkillItemListController } from "./PetSkillItemListController";

export class PetSkillItemListView extends FUI_PetSkillItemListView {
  /**
   * 战斗技能控制器
   */
  private controller: PetSkillItemListController;

  private _skillItemViews: BattleSkillItemII[];

  private _enable = false;

  protected onConstruct() {
    super.onConstruct();
  }

  public init() {
    this._skillItemViews = [];
    this.controller = new PetSkillItemListController(this);
  }

  public initView(skills: SkillInfo[]) {
    if (!this.battleModel) return;
    this._skillItemViews = [];
    let item: BattleSkillItemII = null;
    for (let i = 0; i < 10; i++) {
      item = new BattleSkillItemII(this.getChildAt(i) as fgui.GComponent);
      item.data = skills[i].templateInfo;
      item.index = i;
      item.numCount = i + 1;
      this._skillItemViews.push(item);
      item.setClicked(this.__skillClick.bind(this));
      if (skills[i].grade <= 0) {
        item.setState(BattleSkillItemII.STATE_LOCK);
      }
      item.setSkillCount(skills[i].useCount);
    }
  }

  public initCD() {
    let cdInfos: BattleCooldownModel[] = this.battleModel.cooldownInfo;
    if (cdInfos) {
      //初始化所有技能的cd时间
      for (let cdMode of cdInfos) {
        let cooldown = Math.max(cdMode.cooldown, cdMode.appearCoolDown);
        if (cooldown > 0) {
          cdMode.stop();
          this.cdStart(cdMode.templateId, 0, cooldown * 1000);
        }
      }
    }
  }

  /**
   * 指定的技能开始cd计时
   * @param skillId 技能模板id
   * @param waitTime
   * @param cd
   *
   */
  public cdStart(
    skillId: number,
    waitTime: number = 0,
    cd: number = -1,
    cdType: number = 0,
  ) {
    let vec = this.getItemViewBySkillId(skillId);
    if (vec.length > 0) {
      for (let item of vec) {
        item.startCD(waitTime, cd);
      }
    }
  }
  //批量更新使用次数
  public updateAllSkillCount(skills: { [key: string]: number }) {
    for (let skillid in skills) {
      this.updateSkillCount(+skillid, skills[skillid]);
    }
  }

  //更新使用次数
  public updateSkillCount(skillId: number, count: number) {
    let vec = this.getItemViewBySkillId(skillId);
    if (vec.length > 0) {
      for (let item of vec) {
        item.setSkillCount(count);
      }
    }
  }

  public clearCDButNotId(skillId: number) {
    for (let item of this._skillItemViews) {
      if (skillId != this.getSkillId(item.data)) {
        item.clearCD();
      }
    }
  }
  /**
   * 根据技能id取得相关技能对象, 同一个id可能会存在多个技能显示对象
   * 如果是符文技能, 则相同类型的符文技能都要进入冷却
   * @param skillId
   * @return
   *
   */
  private getItemViewBySkillId(skillId: number) {
    let vec: BattleSkillItemII[] = [];
    for (let item of this._skillItemViews) {
      let itemSkill: number = this.getSkillId(item.data);
      if (itemSkill == skillId) {
        vec.push(item);
      }
      if (
        item.data instanceof t_s_skilltemplateData &&
        skillId == (item.data as t_s_skilltemplateData).Parameter3
      ) {
        //使用qte以后, 收到的技能id为qte技能id, 原id为p3字段
        vec.push(item);
      }
    }
    return vec;
  }
  private getSkillId(data: object): number {
    let skillId: number = -1;
    if (data instanceof t_s_skilltemplateData) {
      skillId = (data as t_s_skilltemplateData).TemplateId;
    }
    return skillId;
  }
  private __skillClick(target: BattleSkillItemII, data: any) {
    for (let skill of this._skillItemViews) {
      // skill.setDownEffect();
      skill.selected(skill == target);
    }
    NotificationManager.Instance.sendNotification(
      BattleNotic.REMOTEPET_SKILL,
      data,
    );
  }
  /**
   * 设置所有技能的可使用状态
   * @param value
   *
   */
  public setEnable(value: boolean) {
    if (value == this._enable) {
      return;
    }

    this._enable = value;
    for (let element of this._skillItemViews) {
      if (element.isLock) continue;
      if (!this._enable) {
        // element.setDownEffect();
      }
      if (element.data) {
        if (
          this._enable &&
          element.data.hasOwnProperty("useCount") &&
          element.data.useCount <= 0
        ) {
          continue;
        }
        element.parentEnable = this._enable;
        // element.buttonSkiner.enable =this. _enable;
      }
    }
  }

  public get enable() {
    return this._enable;
  }

  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }

  public dispose() {
    if (this._skillItemViews)
      for (let item of this._skillItemViews) {
        item.dispose();
      }
    this._skillItemViews = null;
    if (this.controller) {
      this.controller.dispose();
      this.controller = null;
    }
  }
}
