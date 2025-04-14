/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-12 10:20:20
 * @LastEditTime: 2023-12-25 10:59:05
 * @LastEditors: jeremy.xu
 * @Description: 符文Item
 */
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import Logger from "../../../../../core/logger/Logger";
import UIManager from "../../../../../core/ui/UIManager";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { BattleManager } from "../../../../battle/BattleManager";
import { HeroRoleInfo } from "../../../../battle/data/objects/HeroRoleInfo";
import { BattleRecordReader } from "../../../../battle/record/BattleRecordReader";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { BattleType } from "../../../../constant/BattleDefine";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { BattleEvent } from "../../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../../constant/UIDefine";
import { BattlePropItem } from "../../../../datas/BattlePropItem";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import FUIHelper from "../../../../utils/FUIHelper";
import { BattleSkillItemII } from "./BattleSkillItemII";

export class PropSkillBattleItem extends BattleSkillItemII {
  protected _enabled: boolean = true;
  protected _lackUseCount: boolean = false;
  constructor(view: fgui.GComponent) {
    super(view);
  }

  protected __bufferEnabeleHandler() {
    if (!this._data) {
      this._imgBan.visible = false;
      this.setState(BattleSkillItemII.STATE_NORMAL);
      return;
    }
    if (this._data instanceof BattlePropItem) {
      if (!BattleManager.Instance.battleModel.isAllPetPKBattle()) {
        this.bufferUnEnable = this.roleInfo.existUnenableSkillBuffer(
          (<BattlePropItem>this._data).skillTempId,
        );
        if (this.bufferUnEnable) {
          this.enabled = false;
          this.setState(BattleSkillItemII.STATE_GRAY);
          this._imgBan.visible = true;
        } else {
          this._imgBan.visible = false;
          if (this.checkLackUseCount()) return;
          var hasReadySkill: boolean =
            BattleManager.Instance.battleModel.currentReadySkillId != -1;
          var inTrialTowerBattle: boolean =
            BattleManager.Instance.battleModel.battleType ==
            BattleType.TRIAL_TOWER_BATTLE;
          if (hasReadySkill || inTrialTowerBattle) return;
          if (this.roleInfo.bloodA <= 0) return;

          this.enabled = true;
          this.setState(BattleSkillItemII.STATE_NORMAL);
        }
      }
    }
  }

  public onKeyDownHandler(event: Laya.Event) {
    if (FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) return;
    if (UIManager.Instance.isShowing(EmWindow.ChatBugleWnd)) return;
    if (BattleRecordReader.inRecordMode) return;
    if (this.data) {
      if (this.isValidKey(event.keyCode)) {
        this.__iconClick(null);
      }
    }
  }

  public set data(value: any) {
    this._data = value;
    if (value) {
      this._data.addEventListener(
        BattleEvent.PROP_USECOUNT_CHANGE,
        this.__countChangeHandler,
        this,
      );
      var skillTemp: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        this._data.skillTempId.toString(),
      );
      this._icon.icon = IconFactory.getTecIconByIcon(skillTemp.Icons);

      this._txtSkillCount.text = this._data.useCount + "";
      this._txtSkillCount.visible = true;
      if (!this.isLock) {
        FUIHelper.setTipData(
          this.view,
          EmWindow.SkillTip,
          skillTemp,
          undefined,
          TipsShowType.onLongPress,
        );
      }
      this.checkLackUseCount();
    }
  }

  public get data(): any {
    return this._data;
  }

  private __countChangeHandler(e: BattleEvent) {
    if (this._data) {
      this._txtSkillCount.text = this._data.useCount.toString();
      this.checkLackUseCount();
    }
  }

  public startPublicCD(delay: number = 0, cd: number = -1) {
    if (this.checkLackUseCount()) {
      return;
    }

    let currentCd = this.getLeftTime();
    Logger.xjy("[PropSkillBattleItem]publicCDStart", delay, cd, currentCd);
    if (currentCd > 0) {
      if (currentCd > cd / 1000) {
        return;
      }
    }

    if (delay > 0) {
      Laya.timer.once(delay, this, () => {
        this.startCDProcess(cd);
        this.showCDNum();
      });
    } else {
      this.startCDProcess(cd);
      this.showCDNum();
    }
  }

  public startCD(delay: number = 0, cd: number = -1) {
    Logger.xjy("[PropSkillBattleItem]startCD", delay, cd);

    if (this.checkLackUseCount()) {
      return;
    }

    let coolDown = (this._data.getSkillTemplate() as t_s_skilltemplateData)
      .PropCoolDown;
    if (!coolDown || coolDown <= 0) {
      this.resetCD();
      return;
    }
    cd = cd > 0 ? cd : coolDown;

    if (delay > 0) {
      Laya.timer.once(delay, this, () => {
        this.startCDProcess(cd);
        this.showCDNum();
      });
    } else {
      this.startCDProcess(cd);
      this.showCDNum();
    }
  }

  public setState(state: number) {
    // 35, 40 各开放一个符文
    let openLevel = 35 + (this._numCount - 8) * 5;
    openLevel = Math.min(40, openLevel);
    let isLock = !(ArmyManager.Instance.thane.grades >= openLevel); //
    if (isLock) {
      state = BattleSkillItemII.STATE_LOCK;
    }
    super.setState(state);
  }

  protected cdCompleteHandler() {
    super.cdCompleteHandler();
    this.checkLackUseCount();
  }

  private checkLackUseCount(): boolean {
    if (!this._data) return true;
    if ((<BattlePropItem>this._data).useCount <= 0) {
      this.selected(false);
      this._lackUseCount = true;
      this.enabled = false;
      return true;
    }
    return false;
  }

  public set numCount(value: number) {
    this._numCount = value;
    if (this._numCount == 7) {
      this._shortcutChar = "Q";
    } else if (this._numCount == 8) {
      this._shortcutChar = "Z";
    } else if (this._numCount == 9) {
      this._shortcutChar = "X";
    } else if (this._numCount == 10) {
      this._shortcutChar = "C";
    }
    this._txtShortKey.text = this._shortcutChar;
  }

  private removeItemCount() {
    if (this._txtSkillCount) {
      this._txtSkillCount.text = "";
      this._txtSkillCount.visible = false;
    }
  }

  public set enabled(value: boolean) {
    if (this.view && !this.view.isDisposed) {
      if (this._lackUseCount) {
        this._enabled = false;
        this.setState(BattleSkillItemII.STATE_GRAY);
      } else {
        this._enabled = value;
        this.setState(
          this._enabled
            ? BattleSkillItemII.STATE_NORMAL
            : BattleSkillItemII.STATE_DARK,
        );
      }
    }
  }

  public get enabled() {
    if (this._lackUseCount) return false;
    return this._enabled;
  }

  private get roleInfo(): HeroRoleInfo {
    return BattleManager.Instance.battleModel.selfHero;
  }

  public dispose() {
    if (this._data) {
      this._data.removeEventListener(
        BattleEvent.PROP_USECOUNT_CHANGE,
        this.__countChangeHandler,
        this,
      );
    }
    this.removeItemCount();
    super.dispose();
  }
}
