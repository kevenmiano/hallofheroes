import FUI_PetPKSkillItemListView from "../../../../../../fui/Battle/FUI_PetPKSkillItemListView";
import Logger from "../../../../../core/logger/Logger";
import Dictionary from "../../../../../core/utils/Dictionary";
import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { BattleCooldownModel } from "../../../../battle/data/BattleCooldownModel";
import { SkillData } from "../../../../battle/data/SkillData";
import { HeroRoleInfo } from "../../../../battle/data/objects/HeroRoleInfo";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { BattleNotic } from "../../../../constant/event/NotificationEvent";
import { BattlePropItem } from "../../../../datas/BattlePropItem";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import NewbieModule from "../../../guide/NewbieModule";
import NewbieConfig from "../../../guide/data/NewbieConfig";
import { PetData } from "../../../pet/data/PetData";
import { BattleSkillItemII } from "./BattleSkillItemII";
import PetPKSkillItemListController from "./PetPKSkillItemListController";
import { PropSkillBattleItem } from "./PropSkillBattleItem";
/**
 * 英灵战役技能视图
 */
export default class PetPKSkillItemListView extends FUI_PetPKSkillItemListView {
  private controller: PetPKSkillItemListController; //控制器
  private _skillItemViews: BattleSkillItemII[];
  /**
   * 战斗技能 包括符文
   */
  private _heroSkills: BattleSkillItemII[];
  private _specialSkills: BattleSkillItemII[];
  public static TalentIndex = 18;
  public static SkillIndex1 = 6;
  public static SkillIndex2 = 12;
  public static SkillIndex3 = 18;
  private indexArr1: Array<number> = [0, 1, 2, 3, 4, 5, 18, 19, 20, 21];
  private indexArr2: Array<number> = [6, 7, 8, 9, 10, 11, 18, 19, 20, 21];
  private indexArr3: Array<number> = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  private indexArr4: Array<number> = [0, 1, 2, 3, 4, 5];
  private indexArr5: Array<number> = [6, 7, 8, 9, 10, 11];
  private indexArr6: Array<number> = [12, 13, 14, 15, 16, 17];
  private indexArr7: Array<number> = [18, 19, 20];
  private _enable = false;

  protected onConstruct() {
    super.onConstruct();
  }

  public init() {
    this.controller = new PetPKSkillItemListController(this);
  }

  public initView(skills: any[]) {
    this._skillItemViews = [];
    this._heroSkills = [];
    this._specialSkills = [];
    if (!this.battleModel) return;
    this.battleModel.skillUserInfoDic = new Dictionary();
    for (let i = 0; i < 22; i++) {
      let item: BattleSkillItemII;
      if (i < PetPKSkillItemListView.SkillIndex1) {
        //第一个英灵的6个普通技能
        let btnName = "itemSkill1_" + (i + 1);
        item = new BattleSkillItemII(this.getChild(btnName) as fgui.GComponent);
        item.index = i;
        item.numCount = i + 1;
      } else if (
        i >= PetPKSkillItemListView.SkillIndex1 &&
        i < PetPKSkillItemListView.SkillIndex2
      ) {
        //第二个英灵的6个普通技能
        let btnName = "itemSkill2_" + (i - 5);
        item = new BattleSkillItemII(this.getChild(btnName) as fgui.GComponent);
        item.index = i;
        item.numCount = i - 5;
      } else if (
        i >= PetPKSkillItemListView.SkillIndex2 &&
        i < PetPKSkillItemListView.SkillIndex3
      ) {
        //第三个英灵的6个普通技能
        let btnName = "itemSkill3_" + (i - 11);
        item = new BattleSkillItemII(this.getChild(btnName) as fgui.GComponent);
        item.index = i;
        item.numCount = i - 11;
      } else if (i == PetPKSkillItemListView.TalentIndex) {
        //天赋
        item = new BattleSkillItemII(
          this.getChild("itemTalent") as fgui.GComponent,
        );
        item.index = PetPKSkillItemListView.TalentIndex;
        item.numCount = PetPKSkillItemListView.TalentIndex;
        this._specialSkills.push(item);
      } else {
        //符文
        let index;
        if (i == 19) index = 1;
        if (i == 20) index = 2;
        if (i == 21) index = 3;
        if (index) {
          let btnName = "itemRune_" + index;
          item = new PropSkillBattleItem(
            this.getChild(btnName) as fgui.GComponent,
          );
          item.index = i;
          item.numCount = index + 7;
          this._specialSkills.push(item);
        }
      }

      if (!item) return;
      item.subIndex = i;
      if (
        i == PetPKSkillItemListView.TalentIndex &&
        this.battleModel.isLockTalent
      ) {
        (<BattleSkillItemII>item).enabled = false;
        (<BattleSkillItemII>item).setState(BattleSkillItemII.STATE_LOCK);
      } else {
        item.enabled = true;
        if (this.checkNotShowHeroSkill(i)) {
          item.data = null;
        } else {
          item.data = skills[i];
        }
      }
      let talentCtrl = this.getController("cTalent");
      if (talentCtrl) {
        talentCtrl.selectedIndex = this.battleModel.isLockTalent ? 0 : 1;
      }
      this._skillItemViews.push(item);
      this._heroSkills.push(item);
      item.setClicked(this.__skillClick.bind(this));
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
    } else if (data instanceof BattlePropItem) {
      skillId = data.skillTempId;
    }
    return skillId;
  }

  /**
   * @param target
   * @param data
   */
  private __skillClick(target: BattleSkillItemII, data: any) {
    if (!BattleManager.Instance.battleModel.currentHero.isLiving) {
      Logger.xjy(
        "英灵 死亡 == ",
        BattleManager.Instance.battleModel.currentHero,
      );
      return;
    }
    if (!this.checkIndex(target.index)) return;
    if (this._skillItemViews) {
      this._skillItemViews.forEach((skill: BattleSkillItemII) => {
        skill.selected(skill == target);
      });
    }
    this.setClickEnable(false); //只把当前英灵的技能置灰包括天赋和符文全部为灰色。
    let livingID: number =
      BattleManager.Instance.battleModel.currentHero.livingId;
    if (target.index == 18) {
      //天赋
      this.battleModel.skillUserInfoDic.set(target.data.TemplateId, {
        livingId: livingID,
        skillId: target.data.TemplateId,
        isProp: false,
      });
    } else if (target.index == 19 || target.index == 20 || target.index == 21) {
      //符文
      this.battleModel.skillUserInfoDic.set(target.data.skillTempId, {
        livingId: livingID,
        skillId: target.data.skillTempId,
        isProp: true,
      });
      this.battleModel.hasPropIngUsed = true;
    }
    NotificationManager.Instance.sendNotification(
      BattleNotic.PETPK_ACTION_SKILL,
      data,
    );
  }

  //点击后把当前选择的置为不可用
  private setClickEnable(value: boolean) {
    this._enable = value;
    for (let index = 0; index < this._skillItemViews.length; index++) {
      const element: BattleSkillItemII = this._skillItemViews[index];
      if (!element.isLock && this.checkIndex(element.index)) {
        if (element.data) {
          if (
            this._enable &&
            element.data.hasOwnProperty("useCount") &&
            element.data.useCount <= 0
          ) {
            continue;
          }
          element.parentEnable = this._enable;
          element.enabled = this._enable;
        }
      }
    }
  }

  public resetSelect(value: boolean) {
    for (let index = 0; index < this._specialSkills.length; index++) {
      let element: BattleSkillItemII = this._specialSkills[index];
      if (element.data) {
        if (element.data instanceof t_s_skilltemplateData) {
          //天赋
          element.selected(value);
        } else if (element.data instanceof BattlePropItem) {
          //符文
          element.selected(value);
        }
      }
    }
  }

  public setSpecialEnable(value: boolean) {
    this._enable = value;
    let skillId: number = 0;
    for (let index = 0; index < this._specialSkills.length; index++) {
      let element: BattleSkillItemII = this._specialSkills[index];
      if (element.data) {
        if (element.data instanceof t_s_skilltemplateData) {
          //天赋
          skillId = element.data.TemplateId;
          if (!this.battleModel.skillUserInfoDic.get(skillId)) {
            element.parentEnable = this._enable;
            element.enabled = this._enable;
          } else {
            element.parentEnable = false;
            element.enabled = false;
          }
        } else if (element.data instanceof BattlePropItem) {
          //符文
          skillId = element.data.skillTempId;
          if (
            !this.battleModel.skillUserInfoDic.get(skillId) &&
            !this.battleModel.hasPropIngUsed
          ) {
            if (
              this._enable &&
              element.data.hasOwnProperty("useCount") &&
              element.data.useCount <= 0
            ) {
              continue;
            }
            element.parentEnable = this._enable;
            element.enabled = this._enable;
          } else {
            element.parentEnable = false;
            element.enabled = false;
          }
        }
      }
    }
  }

  public checkIsLock() {
    let skillId: number = 0;
    for (let index = 0; index < this._skillItemViews.length; index++) {
      let element: BattleSkillItemII = this._skillItemViews[index];
      if (element.data) {
        if (element.data instanceof t_s_skilltemplateData) {
          skillId = element.data.TemplateId;
        } else if (element.data instanceof BattlePropItem) {
          skillId = element.data.skillTempId;
        }
        if (
          this.existUnenableSkillBuffer(skillId) &&
          this.checkIndex(element.index)
        ) {
          element._imgBan.visible = true;
        } else {
          element._imgBan.visible = false;
        }
      }
    }
  }

  public checkIsLockByPetInfo(data: PetData) {
    let skillId: number = 0;
    for (let index = 0; index < this._skillItemViews.length; index++) {
      let element: BattleSkillItemII = this._skillItemViews[index];
      if (element.data) {
        if (element.data instanceof t_s_skilltemplateData) {
          skillId = element.data.TemplateId;
        } else if (element.data instanceof BattlePropItem) {
          skillId = element.data.skillTempId;
        }
        if (this.petExistUnenableSkillBuffer(skillId, data)) {
          element._imgBan.visible = true;
        } else {
          element._imgBan.visible = false;
        }
      }
    }
  }

  private petExistUnenableSkillBuffer(id: number, data: PetData) {
    let armyInfoHeros = this.battleModel.armyInfoLeft.getHeros;
    let flag: boolean;
    for (const key in armyInfoHeros) {
      let hRole: HeroRoleInfo = armyInfoHeros.get(key);
      if (
        hRole &&
        hRole.existUnenableSkillBuffer(id) &&
        hRole.templateId == data.templateId
      ) {
        flag = true;
      }
    }
    return flag;
  }

  private existUnenableSkillBuffer(id: number): boolean {
    let armyInfoHeros = this.battleModel.armyInfoLeft.getHeros;
    let flag: boolean;
    for (const key in armyInfoHeros) {
      let hRole: HeroRoleInfo = armyInfoHeros.get(key);
      if (hRole && hRole.existUnenableSkillBuffer(id)) {
        flag = true;
      }
    }
    return flag;
  }

  /**
   * 设置所有技能的可使用状态
   * @param value
   */
  public setEnable(value: boolean) {
    this._enable = value;
    let livingId: number = this.battleModel.needUpdatePetLivingId; //当前是哪个英灵的技能释放完成了
    if (livingId > 0) {
      let hero1: HeroRoleInfo = this.battleModel.getBaseRoleInfoByPetTemplateId(
        this.battleModel.petTemplateId1,
      );
      let hero2: HeroRoleInfo = this.battleModel.getBaseRoleInfoByPetTemplateId(
        this.battleModel.petTemplateId2,
      );
      let hero3: HeroRoleInfo = this.battleModel.getBaseRoleInfoByPetTemplateId(
        this.battleModel.petTemplateId3,
      );
      if (
        hero1 &&
        hero1.petRoleInfo &&
        livingId == hero1.petRoleInfo.livingId
      ) {
        for (let index = 0; index < this._skillItemViews.length; index++) {
          const element: BattleSkillItemII = this._skillItemViews[index];
          if (element.data && this.indexArr4.indexOf(element.index) != -1) {
            if (
              this._enable &&
              element.data.hasOwnProperty("useCount") &&
              element.data.useCount <= 0
            ) {
              continue;
            }
            element.parentEnable = this._enable;
            element.enabled = this._enable;
          }
        }
      } else if (
        hero2 &&
        hero2.petRoleInfo &&
        livingId == hero2.petRoleInfo.livingId
      ) {
        for (let index = 0; index < this._skillItemViews.length; index++) {
          const element: BattleSkillItemII = this._skillItemViews[index];
          if (element.data && this.indexArr5.indexOf(element.index) != -1) {
            if (
              this._enable &&
              element.data.hasOwnProperty("useCount") &&
              element.data.useCount <= 0
            ) {
              continue;
            }
            element.parentEnable = this._enable;
            element.enabled = this._enable;
          }
        }
      } else if (
        hero3 &&
        hero3.petRoleInfo &&
        livingId == hero3.petRoleInfo.livingId
      ) {
        for (let index = 0; index < this._skillItemViews.length; index++) {
          const element: BattleSkillItemII = this._skillItemViews[index];
          if (element.data && this.indexArr6.indexOf(element.index) != -1) {
            if (
              this._enable &&
              element.data.hasOwnProperty("useCount") &&
              element.data.useCount <= 0
            ) {
              continue;
            }
            element.parentEnable = this._enable;
            element.enabled = this._enable;
          }
        }
      }
    } else {
      for (let index = 0; index < this._skillItemViews.length; index++) {
        const element: BattleSkillItemII = this._skillItemViews[index];
        if (element.isLock) continue;
        if (element.data) {
          if (
            this._enable &&
            element.data.hasOwnProperty("useCount") &&
            element.data.useCount <= 0
          ) {
            continue;
          }
          element.parentEnable = this._enable;
          element.enabled = this._enable;
        }
      }
    }
  }

  private checkIndex(index: number): boolean {
    let flag: boolean = false;
    if (
      this.petIndexCtr.selectedIndex == 0 &&
      this.indexArr1.indexOf(index) != -1
    ) {
      flag = true;
    } else if (
      this.petIndexCtr.selectedIndex == 1 &&
      this.indexArr2.indexOf(index) != -1
    ) {
      flag = true;
    } else if (
      this.petIndexCtr.selectedIndex == 2 &&
      this.indexArr3.indexOf(index) != -1
    ) {
      flag = true;
    }
    return flag;
  }

  /**
   *
   * @param info 更新天赋技能数据
   */
  public updateTalentSkill(info: t_s_skilltemplateData) {
    let item = this._skillItemViews[
      PetPKSkillItemListView.TalentIndex
    ] as BattleSkillItemII;
    item.data = info;
  }

  /**
   * 指定的技能开始cd计时
   * @param skillId 技能模板id
   * @param waitTime
   * @param cd
   *
   */
  public startCD(
    skillId: number,
    waitTime: number = 0,
    cd: number = -1,
    cdType: number = 0,
  ) {
    let isProp: boolean = false;
    let vec: BattleSkillItemII[] = this.getItemViewBySkillId(skillId);
    if (vec.length > 0) {
      vec.forEach((item: BattleSkillItemII) => {
        if (item instanceof PropSkillBattleItem) {
          isProp = true;
        }
        item.startCD(waitTime, cd);
      });
    }
    if (isProp) {
      //是符文
      this.startPropPublicCD(skillId, waitTime, cd);
    }
  }

  private startPropPublicCD(
    skillId: number,
    waitTime: number = 0,
    cd: number = -1,
  ) {
    let publicCd: number = Number(
      TempleteManager.Instance.getConfigInfoByConfigName("RuneCommonCD")
        .ConfigValue,
    );
    for (let index = 0; index < this._skillItemViews.length; index++) {
      const item = this._skillItemViews[index];
      if (item instanceof PropSkillBattleItem) {
        if (!item.data) continue;
        if ((<BattlePropItem>item.data).skillTempId != skillId) {
          (<PropSkillBattleItem>item).startPublicCD(waitTime, publicCd);
        }
      }
    }
  }

  private checkNotShowHeroSkill(itemIndex: number) {
    let b =
      itemIndex == 1 &&
      !NewbieModule.Instance.checkNodeFinish(NewbieConfig.NEWBIE_70);
    if (b) {
      Logger.info("还未引导获得第二个技能, 不显示");
    }
    return b;
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
