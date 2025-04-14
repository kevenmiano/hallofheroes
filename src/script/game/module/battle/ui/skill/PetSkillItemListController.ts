import { RemotePetEvent } from "../../../../../core/event/RemotePetEvent";
import { PackageIn } from "../../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../../core/net/ServerDataManager";

import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { BaseRoleView } from "../../../../battle/view/roles/BaseRoleView";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { BattleType } from "../../../../constant/BattleDefine";
import {
  BattleNotic,
  NotificationEvent,
} from "../../../../constant/event/NotificationEvent";
import { S2CProtocol } from "../../../../constant/protocol/S2CProtocol";
import { SkillInfo } from "../../../../datas/SkillInfo";

import { NotificationManager } from "../../../../manager/NotificationManager";
import { RemotePetManager } from "../../../../manager/RemotePetManager";
import { SocketSendManager } from "../../../../manager/SocketSendManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { PetSkillItemListView } from "./PetSkillItemListView";
import HeroOrderMsg = com.road.yishi.proto.battle.HeroOrderMsg;

export class PetSkillItemListController {
  private skills: SkillInfo[];
  private view: PetSkillItemListView;
  private _battleModel: BattleModel;
  private _useSkillFailed = false;

  public constructor(view: PetSkillItemListView) {
    this._battleModel = BattleManager.Instance.battleModel;
    this.view = view;
    this.init();
  }

  private init() {
    this.skills = [];
    let remotePetSkills = TempleteManager.Instance.getRemotePetSkill();
    let skillInfo: SkillInfo;
    for (let temp of remotePetSkills) {
      skillInfo = new SkillInfo();
      skillInfo.grade = 0;
      skillInfo.templateId = temp.TemplateId;
      this.skills.push(skillInfo);
    }

    let keyList = RemotePetManager.Instance.model.remotePetSkill;
    let keyCountList = RemotePetManager.Instance.model.remotePetSkillStatus;

    let length = keyList.length;

    for (let i = 0; i < length; i++) {
      skillInfo = this.skills[i];
      skillInfo.templateId = +keyList[i];
      skillInfo.grade = skillInfo.templateInfo.Grades;
      if (keyCountList[skillInfo.templateId]) {
        skillInfo.useCount = keyCountList[skillInfo.templateId];
      } else {
        skillInfo.useCount = 0;
      }
    }

    // this.model.addEventListener(RemotePetEvent.COMMIT, this.__commitHandler, this);
    if (this.view) {
      this.view.initView(this.skills);
      this.view.initCD();
    }
    this.addEvent();
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      BattleNotic.REMOTEPET_SKILL,
      this.__skillUse,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.SKILL_CD,
      this.onSkillCdHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.SKILL_ENABLE,
      this.__skillEnable,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.RESTRICT_CHANGED,
      this.restrictChangedHandler,
      this,
    );
    ServerDataManager.listen(
      S2CProtocol.U_B_HERO_ORDER,
      this,
      this.__skillUseServerBack,
    );
    // KeyboardManager.getInstance().addEventListener(KeyboardEvent.KEY_UP, onKeyUp);
    RemotePetManager.Instance.model.addEventListener(
      RemotePetEvent.COMMIT,
      this.onSkillCountHandler,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      BattleNotic.REMOTEPET_SKILL,
      this.__skillUse,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.SKILL_CD,
      this.onSkillCdHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.SKILL_ENABLE,
      this.__skillEnable,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.RESTRICT_CHANGED,
      this.restrictChangedHandler,
      this,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_B_HERO_ORDER,
      this,
      this.__skillUseServerBack,
    );
    RemotePetManager.Instance.model.removeEventListener(
      RemotePetEvent.COMMIT,
      this.onSkillCountHandler,
      this,
    );
  }

  /**
   * 使用技能成功, 对应技能进入cd时间
   * @param event
   *
   */
  private onSkillCdHandler(data: any) {
    let skillId: number = data.skillId;
    let waitTime: number = data.waitTime;
    this.view.cdStart(skillId, waitTime);
  }
  private __clearCD(id: number) {
    let skillId: number = id;
    this.view.clearCDButNotId(skillId); //清除其他技能的cd
    this.view.cdStart(skillId, 0); //添加当前使用的技能cd
    this.view.setEnable(true); //技能状态栏可用
  }

  private onKeyUp(event: KeyboardEvent) {
    // if (event.charCode == 32) {
    //     emptySelectableOnOff = !emptySelectableOnOff;
    // }
  }

  private onSkillCountHandler() {
    let keyCountList = RemotePetManager.Instance.model.remotePetSkillStatus;
    if (!this.view) return;
    this.view.updateAllSkillCount(keyCountList);
  }

  private get isWatchOnly(): boolean {
    if (BattleManager.Instance.battleModel.battleType == BattleType.PET_PK) {
      return true;
    } else if (
      BattleManager.Instance.battleModel.battleType ==
      BattleType.MONOPOLY_BATTLE_HELP
    ) {
      return true;
    }
    return false;
  }
  /**
   * 设置技能栏的可用状态
   * @param event
   *
   */
  private __skillEnable(b: boolean) {
    this.view.setEnable(b);
    this._useSkillFailed = false;
  }
  /**
   * 角色被锁定的状态改变
   * @param event
   *
   */
  private restrictChangedHandler(event: NotificationEvent) {
    this.__skillEnable(null);
  }

  /**
   * 客户端使用技能
   * @param event
   *
   */
  private __skillUse(data: any) {
    this.view.setEnable(false);
    let currentskillId: number = 0;
    let battleId = this._battleModel.battleId;
    if (data instanceof t_s_skilltemplateData) {
      let skillInfo: t_s_skilltemplateData = data as t_s_skilltemplateData;
      currentskillId = skillInfo.TemplateId;
      SocketSendManager.Instance.sendUsePetBattleSkill(
        battleId,
        currentskillId,
      );
      this._battleModel.currentReadySkillId = currentskillId;
    }
    this._battleModel.defaultSkillCount = 0;
  }
  /**
   * 在人物身上添加使用技能的图标
   * @param skillInfo
   *
   */
  private addSkillUsedFlag(skillInfo: t_s_skilltemplateData) {
    let heroView: BaseRoleView = BattleManager.Instance.getSelfRoleView();
    if (heroView && heroView.info && heroView.info.isLiving) {
      heroView.addSkillFlag(skillInfo);
    }
  }

  /**
   * 服务器返回技能使用结果
   * @param event
   *
   */
  private __skillUseServerBack(pkg: PackageIn) {
    if (
      BattleManager.Instance.battleModel.battleType !=
      BattleType.REMOTE_PET_BATLE
    )
      return;

    let msg = pkg.readBody(HeroOrderMsg) as HeroOrderMsg;

    var mapRoleDic = BattleManager.Instance.battleMap.rolesDict;

    let roleId: number = msg.heroIndexId;
    let skillId: number = msg.skillId;
    let result: number = msg.result;
    let castTime: number = msg.castTime;
    let qteTime: number = 0;
    let aims: number[] = [];
    let aimLen: number = msg.targetIndexs.length; //pkg.readInt()
    for (let i = 0; i < aimLen; i++) {
      aims.push(msg.targetIndexs[i]);
    }
    let skillInfo: t_s_skilltemplateData = null;
    let heroView: BaseRoleView;
    let flag = true;
    if (result == 0) {
      //服务器返回技能使用成功
      flag = true;
      skillInfo = this.getSkillTempInfoById(skillId);
      heroView = mapRoleDic[roleId] as BaseRoleView;
      if (heroView) {
        if (heroView.info && heroView.info.isLiving) {
          skillInfo =
            TempleteManager.Instance.getSkillTemplateInfoById(skillId);
          heroView.addCollectionEffect(false); //只在头上显示技能图标
          heroView.addSkillFlag(skillInfo);
          if (skillInfo.SonType == 20010) {
            //技能CD清零
            this.__clearCD(skillId);
          }
        }
      }
    } else {
      flag = false;
      //trace(""使用技能失败");

      this._battleModel.currentReadySkillId = -1;
      this._useSkillFailed = true;
      //失败 移除选中的效果
      for (let living in aims) {
        heroView = mapRoleDic[living] as BaseRoleView;
        if (heroView) {
          heroView.removeSkillAimFlag();
          //trace(""移除选中的效果:" + living);
        }
      }

      //失败时,让技能可选
      setTimeout(this.delayOpenSkillEnable.bind(this), 1000);
    }
  }

  private delayOpenSkillEnable() {
    if (this._useSkillFailed) {
      this._useSkillFailed = false;
      if (this.view) this.view.setEnable(true);
    }
  }

  /**
   * 根据技能id取得技能模板信息
   * @param skillId
   * @return
   *
   */
  private getSkillTempInfoById(skillId: number): t_s_skilltemplateData {
    let skillInfo: t_s_skilltemplateData;
    let allSkill = this.skills;
    for (let element of allSkill) {
      if (element.grade <= 0) {
        continue;
      }
      if (
        element.templateId == skillId || //技能id匹配
        (this._battleModel.isAutoFight &&
          element.templateInfo.Parameter3 == skillId)
      ) {
        //技能QTE id 匹配
        skillInfo = element.templateInfo;
        return skillInfo;
      }
    }
    return skillInfo;
  }

  private __cleanSkillSelect() {
    for (let roleView of BattleManager.Instance.battleMap.rolesDict) {
      //				roleView.removeSkillFlag();
      (roleView as BaseRoleView).removeSkillAimFlag(); //
    }
  }

  public dispose() {
    this.removeEvent();

    this.view = null;

    this.skills = null;
  }
}
