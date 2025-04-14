/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-12 10:16:36
 * @LastEditTime: 2024-02-02 14:37:41
 * @LastEditors: jeremy.xu
 * @Description: 战斗技能Item
 */

import Logger from "../../../../../core/logger/Logger";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { BattleType } from "../../../../constant/BattleDefine";
import { BattleNotic } from "../../../../constant/event/NotificationEvent";
import { SkillPriorityType } from "../../../../constant/SkillSysDefine";
import { EmWindow } from "../../../../constant/UIDefine";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import FUIHelper from "../../../../utils/FUIHelper";
import CommonTipItem from "../../../../component/item/CommonTipItem";
import { BattleCooldownModel } from "../../../../battle/data/BattleCooldownModel";
import Utils from "../../../../../core/utils/Utils";
import { BattleRecordReader } from "../../../../battle/record/BattleRecordReader";
import { SkillItemListView } from "./SkillItemListView";
import PetPKSkillItemListView from "./PetPKSkillItemListView";
import { HeroRoleInfo } from "../../../../battle/data/objects/HeroRoleInfo";
import UIManager from "../../../../../core/ui/UIManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";

export class BattleSkillItemII {
  public static STATE_NORMAL: number = 0;
  public static STATE_GRAY: number = 1;
  public static STATE_DARK: number = 2;
  public static STATE_LOCK: number = 3;
  public static STATE_UNLOCK: number = 4; // 这个状态目前用不到 因为一场战斗中锁上的目前不会刷新解锁

  protected _item: fgui.GComponent;
  protected _maskDark: fgui.GImage;
  protected _imgBattleS: fgui.GImage;
  protected _imgDown: fgui.GImage;
  public _imgBan: fgui.GImage; //禁止使用
  protected _imgLock: fgui.GImage; //未开启
  protected _imgPetSkillBan: fgui.GImage; //
  protected _icon: fgui.GLoader;

  protected _remoteSkillCount: fgui.GLabel; //英灵远征技能次数
  protected _remoteSkillBg: fgui.GLabel; //英灵远征技能次数
  public get icon(): fgui.GLoader {
    return this._icon;
  }
  protected _txtShortKey: fgui.GLabel; //快捷键数字
  protected _shortKeyGroup: fgui.GGroup;
  public get shortKeyGroup(): fgui.GGroup {
    return this._shortKeyGroup;
  }
  protected _txtCDNum: fgui.GLabel;
  protected _txtSkillName: fgui.GLabel; //技能名称 测试
  protected _txtSkillCount: fgui.GLabel; //数量

  protected _numCount: number = -1;
  protected _numCDTime: number = 0;
  protected _enabled: boolean = true;
  protected _isLock: boolean = false;
  public set isLock(b: boolean) {
    this._isLock = b;
    if (this._imgLock) {
      this._imgLock.visible = b;
    }
  }
  public get isLock(): boolean {
    return this._isLock;
  }
  public index: number = 0;
  public subIndex: number = 0;
  public _shortcutChar: string;
  protected coolType: number;

  /**
   * 整个技能栏是否有效
   */
  public parentEnable: boolean = true;
  public bufferUnEnable: boolean;

  // 新手方法
  public noviceFunc: Function;
  private _clickFunc: Function;
  private _cdAttr: object = { prog: 1, time: 0 }; //缓动用的
  public get cdAttr(): object {
    return this._cdAttr;
  }

  public view: fgui.GComponent;
  constructor(view: fgui.GComponent) {
    this.view = view;
    this.initView();
    this.initEvent();
  }

  protected initView() {
    this._item = this.view.getChild("item") as fgui.GComponent;
    this._txtCDNum = this.view.getChild("txtCDNum") as fgui.GLabel;
    this._txtSkillName = this.view.getChild("txtSkillName") as fgui.GLabel;
    this._txtSkillCount = this.view.getChild("txtSkillCount") as fgui.GLabel;
    this._imgDown = this.view.getChild("Img_Down") as fgui.GImage;
    this._txtShortKey = this.view.getChild("txtShortKey") as fgui.GLabel;
    this._shortKeyGroup = this.view.getChild("shortKeyGroup") as fgui.GGroup;

    this._icon = this._item.getChild("Img_Icon") as fgui.GLoader;
    this._imgBan = this._item.getChild("Img_Ban") as fgui.GImage;
    this._imgLock = this._item.getChild("Img_Lock") as fgui.GImage;
    this._imgPetSkillBan = this._item.getChild(
      "Img_PetSkillBan",
    ) as fgui.GImage;
    this._imgBattleS = this._item.getChild("Img_Battle_S") as fgui.GImage;
    this._maskDark = this._item.getChild("Mask_Dark") as fgui.GImage;

    this._remoteSkillCount = this.view.getChild(
      "remoteSkillCount",
    ) as fgui.GLabel;
    this._remoteSkillBg = this.view.getChild("remoteSkillBg") as fgui.GLabel;
  }

  private initEvent() {
    this.view.onClick(this, this.__iconClick);
    NotificationManager.Instance.addEventListener(
      BattleNotic.BUFFER_SKILL_ENABLE,
      this.__bufferEnabeleHandler,
      this,
    );
    Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDownHandler);
  }

  protected removeEvent() {
    this.view.offClick(this, this.__iconClick);
    NotificationManager.Instance.removeEventListener(
      BattleNotic.BUFFER_SKILL_ENABLE,
      this.__bufferEnabeleHandler,
      this,
    );
    Laya.stage.off(Laya.Event.KEY_DOWN, this, this.onKeyDownHandler);
  }

  public onKeyDownHandler(event: Laya.Event) {
    if (FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) return;
    if (UIManager.Instance.isShowing(EmWindow.ChatBugleWnd)) return;
    if (BattleRecordReader.inRecordMode) return;
    if (!this._data) return;
    if (this._numCount < 0) return;
    if (this.battleModel.isAllPetPKBattle()) {
      if (this._numCount == 18) {
        if (this.isValidKey(event.keyCode)) {
          this.__iconClick(null);
        }
      } else {
        if (
          event.keyCode == this._numCount + 48 ||
          event.keyCode == this._numCount + 96
        ) {
          this.__iconClick(null);
        }
      }
    } else {
      if (this._numCount == SkillItemListView.TalentIndex + 1) {
        if (this.isValidKey(event.keyCode)) {
          this.__iconClick(null);
        }
      } else {
        if (
          event.keyCode == this._numCount + 48 ||
          event.keyCode == this._numCount + 96
        ) {
          this.__iconClick(null);
        }
      }
    }
  }

  public isValidKey(charCode: number): boolean {
    // 数字8与大写X-32 ascii一样,  统一转换成大写来判断
    let shortcutCharUpper = this._shortcutChar.toUpperCase();
    if (shortcutCharUpper && charCode == shortcutCharUpper.charCodeAt(0)) {
      return true;
    }
    return false;
  }

  protected __bufferEnabeleHandler() {
    if (this._isLock) return;
    if (!this._data) {
      this._imgBan.visible = false;
      this.setState(BattleSkillItemII.STATE_NORMAL);
      return;
    }
    if (this._data instanceof t_s_skilltemplateData) {
      if (!this.battleModel.isAllPetPKBattle()) {
        this.bufferUnEnable =
          this.battleModel.selfHero.existUnenableSkillBuffer(
            (<t_s_skilltemplateData>this._data).TemplateId,
          );
        if (this.bufferUnEnable) {
          this._imgBan.visible = true;
          this.enabled = false;
          this.setState(BattleSkillItemII.STATE_GRAY);
        } else {
          this._imgBan.visible = false;
          let isEnough: boolean =
            this.battleModel.selfHero.sp + this._data.Cost >= 0;
          let hasReadySkill: boolean =
            this.battleModel.currentReadySkillId != -1;
          let inTrialTowerBattle: boolean =
            this.battleModel.battleType == BattleType.TRIAL_TOWER_BATTLE;
          let isDie: boolean = this.battleModel.selfHero.bloodA <= 0;
          if (isDie || hasReadySkill || !isEnough || inTrialTowerBattle) return;
          this.enabled = true;
          this.setState(BattleSkillItemII.STATE_NORMAL);
        }
      }
    }
  }

  protected __iconClick(evt: any) {
    if (!this._data) return;

    this.noviceFunc && this.noviceFunc(this, this._data);

    if (!this._enabled) {
      Logger.battle("技能不可用 技能禁用中");
      return;
    }
    if (this._isLock) {
      Logger.battle("技能不可用 技能未解锁");
      return;
    }

    // 点击了正常情况下可以使用的按钮 取消自动战斗
    // if (BattleManager.Instance.battleModel) {
    //     BattleManager.Instance.battleModel.setAutoFight(BattleModel.CANCEL_AUTO_FIGHT);
    // }

    if (!this.isPetSkillStateCanUse) {
      Logger.battle("技能不可用 觉醒状态不可使用改技能");
      return;
    }
    if (this.isCding) {
      Logger.battle("技能不可用 冷却中");
      return;
    }
    if (this._data.useCount <= 0) {
      Logger.battle("技能不可用 使用次数小于0");
      return;
    }
    if (this.battleModel.selfHero.isWaitingChangeBody) {
      Logger.battle("技能不可用 等待变身中");
      return;
    }
    if (
      this.battleModel.selfHero.useSkill700001 ||
      this.battleModel.selfHero.useSkill700002
    ) {
      Logger.battle(
        "技能不可用 正在变身/取消变身",
        this.battleModel.selfHero.useSkill700001,
        this.battleModel.selfHero.useSkill700002,
      );
      return;
    }

    this._clickFunc && this._clickFunc(this, this._data);
  }

  setClicked(func: Function) {
    this._clickFunc = func;
  }

  public get numCount(): number {
    return this._numCount;
  }
  public set numCount(value: number) {
    if (this.battleModel.isAllPetPKBattle() && value == 18) {
      this._numCount = value;
      this._shortcutChar = "Q";
      this._txtShortKey.text = this._shortcutChar;
    } else if (value == SkillItemListView.TalentIndex + 1) {
      this._numCount = value;
      this._shortcutChar = "Q";
      this._txtShortKey.text = this._shortcutChar;
    } else {
      this._numCount = value;
      this._txtShortKey.text = value.toString();
    }
    this.showShortKey(true);
  }

  protected _data: any;
  public get data(): any {
    return this._data;
  }
  public set data(value: any) {
    this._data = value;
    if (this._data) {
      this._icon.visible = true;
      this._icon.icon = IconFactory.getTecIconByIcon(this._data.Icons);
      if (this._imgBattleS) {
        this._imgBattleS.visible = SkillPriorityType.isSuperSkill(
          this._data.Priority,
        );
      }

      if (!this.isLock) {
        FUIHelper.setTipData(
          this.view,
          EmWindow.SkillTip,
          value,
          undefined,
          TipsShowType.onLongPress,
        );
      }

      this._txtSkillName.visible = false;
      this._txtSkillName.text = this._data.TemplateName;
    } else {
      this._icon.visible = false;
      this._icon.icon = "";
      this._txtSkillName.visible = false;
      if (this._imgBattleS) {
        this._imgBattleS.visible = false;
      }
      let tipItem = this.view.getChild("CommonTipItem") as CommonTipItem;
      if (tipItem) {
        tipItem.dispose();
      }
    }
  }

  public setState(state: number) {
    if (!this._icon || !this._icon.displayObject) return;
    this.showShortKey(true);
    if (
      this.index == SkillItemListView.TalentIndex &&
      this.battleModel.isLockTalent
    ) {
      state = BattleSkillItemII.STATE_LOCK;
    }

    let filtersTmp = [UIFilter.normalFilter];
    switch (state) {
      case BattleSkillItemII.STATE_NORMAL:
        break;
      case BattleSkillItemII.STATE_GRAY:
        filtersTmp = [UIFilter.grayFilter];
        break;
      case BattleSkillItemII.STATE_DARK:
        filtersTmp = [UIFilter.darkFilter2];
        break;
      case BattleSkillItemII.STATE_LOCK:
        this.isLock = true;
        this.showShortKey(false);
        break;
      case BattleSkillItemII.STATE_UNLOCK:
        this.isLock = false;
        break;
    }

    this._icon.filters = filtersTmp;
    if (this._imgBattleS) {
      this._imgBattleS.filters = filtersTmp;
    }
    // if (this._txtSkillCount) {
    //     this._txtSkillCount.filters = filtersTmp;
    // }
  }

  public selected(value: boolean = false) {
    if (this._imgDown && this._imgDown.displayObject) {
      this._imgDown.visible = value;
    }
  }

  // Skill CD
  ///////////////////////////////////
  /**
   * 开始cd计时
   * @param delay  1000
   * @param cd     1000
   */
  public startCD(delay: number = 0, cd: number = -1, coolType: number = 0) {
    if (!this._data) return;

    let cdTime = cd;
    if (coolType == 0) {
      if (!this._data.CoolDown || this._data.CoolDown <= 0) {
        this.resetCD();
        return;
      }
      cdTime = cdTime > 0 ? cdTime : this._data.CoolDown;
    } else {
      if (!this._data.AppearCD || this._data.AppearCD <= 0) {
        this.resetCD();
        return;
      }
      // if (this._data.AppearCD <= this.getLeftTime()) return;
      cdTime = cdTime > 0 ? cdTime : this._data.AppearCD;
    }

    this.coolType = coolType;

    this.addCoolDownInfo(cdTime, coolType, delay);

    if (delay > 0) {
      Laya.timer.once(delay, this, () => {
        this.startCDProcess(cdTime);
        this.showCDNum();
      });
    } else {
      this.startCDProcess(cdTime);
      this.showCDNum();
    }
  }

  //记录变身前还在冷却的技能的时间, 变身回需要刷新冷却（不包括符文与试炼技能）
  protected addCoolDownInfo(
    cd: number,
    coolType: number = 0,
    delay: number = 0,
  ) {
    if (this._data instanceof t_s_skilltemplateData && cd > 0) {
      let gameInfo = BattleManager.Instance.model;
      let cdMode = new BattleCooldownModel();
      for (let index = 0; index < gameInfo.cooldownInfo.length; index++) {
        const element = gameInfo.cooldownInfo[index];
        if (element.templateId == this._data.TemplateId) {
          cdMode = element;
          break;
        }
      }
      if (!cdMode) {
        cdMode = new BattleCooldownModel();
        gameInfo.cooldownInfo.push(cdMode);
      } else {
        cdMode.stop();
      }
      cdMode.templateId = this._data.TemplateId;
      cdMode.cooldown = cd / 1000;
      cdMode.coolType = coolType;
      cdMode.appearCoolDown = this._data.AppearCD / 1000;

      Logger.battle(
        "[BattleSkillItemII]addCoolDownInfo",
        cdMode.templateId,
        cdMode.cooldown,
        cdMode,
      );
      Laya.timer.once(delay, this, () => {
        cdMode.start();
      });
    }
  }

  protected startCDProcess(time: number) {
    this.resetCD();
    this.showMask(true);

    /**
     * TODO 重新连接时候被天赋影响的技能CD可能有影响, 需要服务器发总时间
     */
    time = time / 1000;
    let totalCool: number;
    if (this.coolType === 0) {
      totalCool = this._data.CoolDown;
    } else if (this.coolType === 1) {
      totalCool = this._data.AppearCD;
    }
    let rate = 1;
    if (totalCool) {
      rate = time / (totalCool / 1000);
    }

    this._cdAttr["prog"] = rate < 1 ? rate : 1;
    this._cdAttr["time"] = time;

    Logger.battle(
      "[BattleSkillItemII]初始进度",
      time,
      rate,
      this._data.CoolDown,
      this._data.AppearCD,
      this._cdAttr["prog"],
    );
    //@ts-expect-error: External dependencies
    TweenLite.to(this._cdAttr, time, {
      prog: 0,
      time: 0,
      //@ts-expect-error: External dependencies
      ease: Linear.easeNone,
      onUpdate: () => {
        this._maskDark.fillAmount = this._cdAttr["prog"];
        this.updateCDNum(Math.ceil(this._cdAttr["time"]));
      },
      onComplete: () => {
        this.cdCompleteHandler();
      },
    });
  }

  public startAppearCD(delay: number = 0, cd: number = -1) {
    if (!this._data || !this._data.hasOwnProperty("AppearCD")) {
      return;
    }
    this.startCD(delay, cd, 1);
  }

  protected showCDNum(value: boolean = true) {
    if (this._txtCDNum && this._txtCDNum.displayObject)
      this._txtCDNum.visible = value;
  }
  protected showMask(value: boolean = true) {
    if (this._maskDark && this._maskDark.displayObject)
      this._maskDark.visible = value;
  }
  protected updateCDNum(value: number) {
    if (this._txtCDNum && this._txtCDNum.displayObject)
      this._txtCDNum.text = value.toString();
  }

  protected getLeftTime(): number {
    return Math.ceil(this._cdAttr["time"]);
  }
  protected cdCompleteHandler() {
    this.resetCD();
    this.coolType = null;
  }

  public get isCding(): boolean {
    return this._maskDark.visible;
  }

  public set enabled(value: boolean) {
    this._enabled = value;
    this.setState(
      value ? BattleSkillItemII.STATE_NORMAL : BattleSkillItemII.STATE_DARK,
    );
  }
  public get enabled() {
    return this._enabled;
  }

  /**是否为宠物技能 */
  protected _isPetSkill: boolean = false;
  public set isPetSkill(value: boolean) {
    this._isPetSkill = value;
    // if (value && this.index >= SkillItemListView.PetSkillCnt && !(this.data instanceof TrailPropInfo)) {
    //     this._imgPetSkillBan.visible = true
    // } else {
    //     this._imgPetSkillBan.visible = false
    // }
  }
  public get isPetSkill(): boolean {
    return this._isPetSkill;
  }
  /**觉醒情况下可用 */
  public get isPetSkillStateCanUse(): boolean {
    return true;
    return !this._imgPetSkillBan.visible;
  }

  public showShortKey(b: boolean) {
    if (Utils.isIOS() || Utils.isAndroid()) {
      b = false;
    }
    this._shortKeyGroup.visible = b;
  }

  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }
  ///////////////////////////////////

  public clearCD() {
    this.cdCompleteHandler();
  }

  public resetCD() {
    this.showCDNum(false);
    this.showMask(false);
    this.selected(false);
    TweenLite.killTweensOf(this._cdAttr);
    this._cdAttr["prog"] = 1;
    this._cdAttr["time"] = 0;
  }

  public setSkillCount(count: number) {
    this._data.useCount = count;
    let str = count + "";
    this._remoteSkillCount.text = str;
    this._remoteSkillCount.visible = !this.isLock;
    this._remoteSkillBg.visible = this._remoteSkillCount.visible;
  }

  public dispose() {
    this.removeEvent();
    TweenLite.killTweensOf(this._cdAttr);
    if (this.view && !this.view.isDisposed) {
      this.view.dispose();
    }
  }
}
