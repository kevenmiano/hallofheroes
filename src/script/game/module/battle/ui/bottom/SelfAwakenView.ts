/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-06 20:11:20
 * @LastEditTime: 2024-02-02 14:38:08
 * @LastEditors: jeremy.xu
 * @Description: 底部英雄觉醒
 */
import GameEventDispatcher from "../../../../../core/event/GameEventDispatcher";
import Logger from "../../../../../core/logger/Logger";
import UIManager from "../../../../../core/ui/UIManager";
import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { HeroRoleInfo } from "../../../../battle/data/objects/HeroRoleInfo";
import { SkillData } from "../../../../battle/data/SkillData";
import { BattleRecordReader } from "../../../../battle/record/BattleRecordReader";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import {
  BattleEvent,
  BattleNotic,
  NotificationEvent,
  RoleEvent,
} from "../../../../constant/event/NotificationEvent";
import OpenGrades from "../../../../constant/OpenGrades";
import { EmWindow } from "../../../../constant/UIDefine";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import BattleWnd from "../../BattleWnd";
import PetAwakeingBtn from "./PetAwakeingBtn";

export class SelfAwakenView extends GameEventDispatcher {
  private _awakenlist: fgui.GList;
  private _imgAwakenBg: fgui.GImage;

  private _currentAwaken: number = 0;

  /**  1觉醒；2解除*/
  private _job: number = 1;
  private _hero: HeroRoleInfo;
  private _hasPet: boolean = false;
  private _battleModel: BattleModel;
  private _lastClick: number = 0;

  private view: BattleWnd;

  constructor(view: BattleWnd, $job: number = 1) {
    super();
    this.view = view;
    this._battleModel = BattleManager.Instance.battleModel;
    this._job = $job;
    this._awakenlist = this.view["awakenList"];
    this._imgAwakenBg = this.view["imgAwakenBg"];
    if (this.isOpen) {
      this._awakenlist.visible = true;
      this._imgAwakenBg.visible = true;
    } else {
      return;
    }

    if (this._job == 100) {
      this._job = 1;
    }
    if (this._battleModel) {
      this._hero = this._battleModel.selfHero;
    }
    if (this._hero && this._hero.petRoleInfo) {
      this._hasPet = true;
    }
    if (!this._hasPet) {
      this._awakenlist.displayObject.mouseEnabled = false;
    } else {
      this._awakenlist.displayObject.mouseEnabled = true;
    }
    this.addEvent();
    this.initView();
    this.__onSelfAwakenChangedHandler();
  }

  private initView() {
    if (BattleModel.battleDynamicLoaded) {
      this.onBattleDynimicUILoaded();
    }
  }

  public addEvent() {
    this._hero.addEventListener(
      RoleEvent.AWAKEN,
      this.__onSelfAwakenChangedHandler,
      this,
    );
    this._hero.addEventListener(
      RoleEvent.IS_LIVING,
      this.__livingHandler,
      this,
    );
    this._awakenlist.itemRenderer = Laya.Handler.create(
      this,
      this.__onRenderListItem,
      null,
      false,
    );
    this._awakenlist.on(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onClickCellItem,
    );
    NotificationManager.Instance.addEventListener(
      BattleEvent.BATTLE_COMPLETE,
      this.__battleEndHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.SKILL_CD,
      this.__skillEnabeleHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.USE_SKILL_RESULT,
      this._skillResultHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.RESTRICT_CHANGED,
      this.__restrictChangeHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.SKILL_ENABLE,
      this.__skillEnable,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.ACTION_SKILL,
      this.__skillUse,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleEvent.BATTLE_DYNAMIC_UI_LOADED,
      this.onBattleDynimicUILoaded,
      this,
    );
    Laya.stage.on(Laya.Event.KEY_DOWN, this, this.__onKeyDownHandler);
  }

  public removeEvent() {
    if (this._hero) {
      this._hero.removeEventListener(
        RoleEvent.AWAKEN,
        this.__onSelfAwakenChangedHandler,
        this,
      );
      this._hero.removeEventListener(
        RoleEvent.IS_LIVING,
        this.__livingHandler,
        this,
      );
    }
    this._awakenlist.off(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onClickCellItem,
    );
    NotificationManager.Instance.removeEventListener(
      BattleEvent.BATTLE_COMPLETE,
      this.__battleEndHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.SKILL_CD,
      this.__skillEnabeleHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.USE_SKILL_RESULT,
      this._skillResultHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.RESTRICT_CHANGED,
      this.__restrictChangeHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.SKILL_ENABLE,
      this.__skillEnable,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.ACTION_SKILL,
      this.__skillUse,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleEvent.BATTLE_DYNAMIC_UI_LOADED,
      this.onBattleDynimicUILoaded,
      this,
    );
    Laya.stage.off(Laya.Event.KEY_DOWN, this, this.__onKeyDownHandler);
  }

  private __onRenderListItem(index: number, item: PetAwakeingBtn) {
    if (!item || item.isDisposed) return;
    item.index = index;
    item.job.selectedIndex = 1;
    // item.effectMc.getController("job").selectedIndex = this._job;
    // item.effectFireMc.getController("job").selectedIndex = this._job;
    if (index == 0) {
      this.updateTo(this._hero.awaken);
      BattleModel.battleAwakenUIInit = true;
    }
  }

  private __onKeyDownHandler(event: Laya.Event) {
    if (BattleRecordReader.inRecordMode) return;

    // 网页端打字空格, 容易触发英灵觉醒
    if (FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) return;
    if (FrameCtrlManager.Instance.isOpen(EmWindow.BattleShortCutWnd)) return;
    if (UIManager.Instance.isShowing(EmWindow.ChatBugleWnd)) return;

    if (event.keyCode == 32) {
      this.__onClickCellItem(null);
    }
  }

  /**开启或关闭觉醒 */
  private __onClickCellItem(item: PetAwakeingBtn) {
    Logger.battle("觉醒...");
    // if (!BattleModel.battleDynamicLoaded) return;
    if (this._battleModel.isOver) return;
    if (!this._hero) return;
    if (this._hero.restricted) return;
    if (this._hero.bloodA <= 0) return;
    if (this._hero.useSkill700001) return;
    var curent: number = new Date().getTime();
    if (curent - this._lastClick < 3000) return;
    var skill: t_s_skilltemplateData;
    if (this._hero.canMorph()) {
      skill = TempleteManager.Instance.getSkillTemplateInfoById(
        SkillData.PET_MORPH_SKILL,
      );
      NotificationManager.Instance.sendNotification(
        BattleNotic.ACTION_SKILL,
        skill,
      );
      this._lastClick = curent;
    } else if (this._hero.canCancelMorph()) {
      skill = TempleteManager.Instance.getSkillTemplateInfoById(
        SkillData.PET_UNMORPH_SKILL,
      );
      NotificationManager.Instance.sendNotification(
        BattleNotic.ACTION_SKILL,
        skill,
      );
      this._lastClick = curent;
    }
    // if (this._battleModel.getAutoFightFlag() == BattleModel.AUTO_FIGHT) {
    //     this._battleModel.setAutoFight(BattleModel.CANCEL_AUTO_FIGHT);
    // }
  }

  private onBattleDynimicUILoaded() {
    this._awakenlist.numItems = 1;
  }

  private _skillEnable: boolean = false;
  private __skillEnable(evt) {
    if (!BattleModel.battleDynamicLoaded) return;
    if (evt && evt.data == true) {
      NotificationManager.Instance.removeEventListener(
        BattleNotic.SKILL_ENABLE,
        this.__skillEnable,
        this,
      );
      this._skillEnable = true;
    }
  }

  private __skillUse(evt) {
    if (!BattleModel.battleDynamicLoaded) return;
    if (evt instanceof t_s_skilltemplateData) {
      var skill: t_s_skilltemplateData = evt;
      if (skill.TemplateId == SkillData.PET_MORPH_SKILL) {
        this._hero.useSkill700001 = true;
        this.update();
      } else if (skill.TemplateId == SkillData.PET_UNMORPH_SKILL) {
        this._hero.useSkill700002 = true;
        this.update();
      }
    }
  }

  public onKeyDown(e: KeyboardEvent) {
    if (Number(e.code) != Laya.Keyboard.SPACE) return;
    if (!this._skillEnable) {
      Logger.battle("技能禁用中");
      return;
    }
    if (this._battleModel.isOver) return;
    if (!this._hero) return;
    if (this._hero.restricted) return;
    if (this._hero.bloodA <= 0) return;
    if (this._hero.useSkill700001) return;
    var curent: number = new Date().getTime();
    if (curent - this._lastClick < 3000) return;
    var skill: t_s_skilltemplateData;
    if (this._hero.canMorph()) {
      skill = TempleteManager.Instance.getSkillTemplateInfoById(700001);
      NotificationManager.Instance.sendNotification(
        BattleNotic.ACTION_SKILL,
        skill,
      );
      this._lastClick = curent;
      // if (this._battleModel.getAutoFightFlag() == BattleModel.AUTO_FIGHT) {
      //     this._battleModel.setAutoFight(BattleModel.CANCEL_AUTO_FIGHT);
      // }
    }
  }

  private __onSelfAwakenChangedHandler() {
    if (!BattleModel.battleDynamicLoaded) return;
    this.updateTo(this._hero.awaken);
  }

  //死亡后灰显
  private __livingHandler(e) {
    if (!this._hero.isLiving) {
      this._hero.useSkill700001 = false;
      this._hero.useSkill700002 = false;
      this.stopMc();
    }
    this.update();
  }

  public __battleEndHandler(e: Event) {
    if (!BattleModel.battleDynamicLoaded) return;
    this.update();
  }

  private __skillEnabeleHandler(e) {
    if (!BattleModel.battleDynamicLoaded) return;
    var skillId: number = e.skillId;
    if (skillId == SkillData.PET_MORPH_SKILL) {
      this._hero.useSkill700001 = false;
      this.update();
    } else if (skillId == SkillData.PET_UNMORPH_SKILL) {
      this._hero.useSkill700002 = false;
      this.update();
    }
  }

  private _skillResultHandler(e) {
    if (!BattleModel.battleDynamicLoaded) return;
    var skillId: number = e.skillId;
    var success: boolean = e.result;
    if (!success) {
      //700001使用失败
      if (skillId == SkillData.PET_MORPH_SKILL && this._hero.useSkill700001) {
        this._hero.useSkill700001 = false;
      } else if (
        skillId == SkillData.PET_UNMORPH_SKILL &&
        this._hero.useSkill700002
      ) {
        this._hero.useSkill700002 = false;
      }
    }
    this.update();
  }

  private __restrictChangeHandler(e) {
    if (!BattleModel.battleDynamicLoaded) return;
    this.update();
  }

  /**
   * 直接跳到 没有缓动
   * @param value
   */
  public updateTo(value: number = 0) {
    if (!this.isOpen) return;
    if (!BattleModel.battleDynamicLoaded) return;

    // if (value != 0 && value == this._currentAwaken) return;

    this._currentAwaken = value;
    let tmpFillAmount = value / BattleModel.AWAKEN_FULL_VALUE;
    if (tmpFillAmount < 0) {
      tmpFillAmount = 0;
    }
    if (tmpFillAmount > 1) {
      tmpFillAmount = 1;
    }

    let item: PetAwakeingBtn = this.awakenItem;
    let effectCom: fgui.GComponent;
    let lineCom: fgui.GComponent;
    let effectMcMask: fgui.GLoader;
    if (this._job == 1 || this._job == 2 || this._job == 3) {
      lineCom = item.line501;
      effectCom = item.mc501;
    }
    //  else if (this._job == 2) {
    //     lineCom = item.line502
    //     effectCom = item.mc502;
    // } else if (this._job == 3) {
    //     lineCom = item.line503
    //     effectCom = item.mc503;
    // }
    effectMcMask = effectCom.getChild("job_mask").asLoader;
    effectMcMask.fillAmount = tmpFillAmount;

    let lineMc = lineCom.getChild("lineMc");
    lineMc.visible = tmpFillAmount > 0 && tmpFillAmount < 1;
    let offset = item.height - lineCom.getChild("lineMask").height;
    lineMc.y = item.job_bg.height * (1 - tmpFillAmount) + offset;

    // 缓动后处理
    this.update();
    this.updateAwakenValue();
  }

  public get currentAwaken() {
    return this._hero.awaken;
  }

  public get awakenItem(): PetAwakeingBtn {
    // return this._petAwakenBtn
    return this._awakenlist.getChildAt(0) as PetAwakeingBtn;
  }

  /**
   * 更新觉醒值
   * 隐藏
   */
  private updateAwakenValue() {
    if (!BattleModel.battleDynamicLoaded) return;

    if (!this._hero || !this._hero.petRoleInfo) {
      return;
    }
    let item: PetAwakeingBtn = this.awakenItem;
    item.getChild("txtCurAwaken").text =
      this._currentAwaken + " / " + BattleModel.AWAKEN_FULL_VALUE;
    item.getChild("txtCurAwaken").visible = this._hasPet;
  }

  // 更新觉醒提示
  public updateStateTip() {
    if (!BattleModel.battleDynamicLoaded) return;
    let item: PetAwakeingBtn = this.awakenItem;
    item.cAwakenState.selectedIndex = 0;

    if (this.isRestrict) return;

    if (this._hero.canMorph() && !this._hero.useSkill700001) {
      item.cAwakenState.selectedIndex = 1;
    } else if (this._hero.canCancelMorph() && !this._hero.useSkill700002) {
      item.cAwakenState.selectedIndex = 2;
    } else if (
      this._hero.useSkill700001 &&
      this._hero.awaken == BattleModel.AWAKEN_FULL_VALUE
    ) {
      item.cAwakenState.selectedIndex = 3;
    } else if (this._hero.useSkill700002) {
      item.cAwakenState.selectedIndex = 3;
    }
  }

  public enable() {
    if (!BattleModel.battleDynamicLoaded) return;
    this.dark();
    if (this.isRestrict) return;

    var showButtonMode: boolean = false;
    if (
      !this._hero.useSkill700001 && //没用过700001
      !this._hero.useSkill700002 &&
      (this._hero.canMorph() || this._hero.canCancelMorph())
    ) {
      //能够变身 或 解除
      //设为button模式
      showButtonMode = true;
    }

    if (showButtonMode) {
      this.light();
    }

    if (!this._hero.isLiving) {
      this.stopMc();
    }
  }

  private dark() {
    this._awakenlist.touchable = false;
  }

  private light() {
    this._awakenlist.touchable = true;
  }

  public stopMc() {}

  public update() {
    if (!this.isOpen) return;
    if (!BattleModel.battleDynamicLoaded) return;
    this.enable();
    this.updateStateTip();
  }

  private get isRestrict(): boolean {
    if (!this._hero) return true;
    if (this._hero.restricted || !this._hero.isLiving) {
      return true;
    }
    return false;
  }

  private get isOpen(): boolean {
    return ArmyManager.Instance.thane.grades >= OpenGrades.PET;
  }

  private _direction: number = 1;
  /** 朝向 1, -1*/
  public get direction(): number {
    return this._direction;
  }
  public set direction(value: number) {
    this._direction = value;
  }

  public dispose() {
    this.removeEvent();
  }
}
