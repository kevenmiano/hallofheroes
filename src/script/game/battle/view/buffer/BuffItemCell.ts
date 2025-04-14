//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-15 16:49:08
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-30 15:07:45
 * @Description:
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { t_s_skillbuffertemplateData } from "../../../config/t_s_skillbuffertemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import { BufferDamageData } from "../../data/BufferDamageData";
import FUI_BufferItemCell from "../../../../../fui/Battle/FUI_BufferItemCell";
import LangManager from "../../../../core/lang/LangManager";
import UnExistRes from "../../../../core/res/UnExistRes";
import Logger from "../../../../core/logger/Logger";
import { RoleEvent } from "../../../constant/event/NotificationEvent";

export default class BuffItemCell
  extends FUI_BufferItemCell
  implements ITipedDisplay
{
  tipType: EmWindow = EmWindow.CommonTips;
  tipData: any = null;
  startPoint: Laya.Point = new Laya.Point(0, 0);
  showType: TipsShowType = TipsShowType.onClick;
  lastDamage: number = 0;

  static ItemWidth: number = 45;

  private _cellData: BufferDamageData;

  public set cellData(value: BufferDamageData) {
    if (!value) {
      this.tipData = "";
      this._cellData = null;
      this.txtLayerCount.text = "";
      this.bufferIcon.icon = "";
      ToolTipsManager.Instance.unRegister(this);
      return;
    }
    this._cellData = value;

    //护盾 需要展示s剩余护盾数值
    if (this._cellData.AttackType == 34) {
      let role = this._cellData.getBuffTargetRole();
      role &&
        role.addEventListener(RoleEvent.BLOOD_CHANGE, this.updateView, this);
    }
    this.updateView();
    ToolTipsManager.Instance.register(this);
  }

  private updateView() {
    let bufferData = this._cellData;
    let tempId = bufferData.templateId;
    let bufferTempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skillbuffertemplate,
      tempId.toString(),
    ) as t_s_skillbuffertemplateData;
    if (!bufferTempInfo) return;

    if (!bufferTempInfo.Icon || UnExistRes.isExist(bufferTempInfo.Icon)) {
      return;
    }

    this.bufferIcon.icon = IconFactory.getCommonIconPath(bufferTempInfo.Icon);
    this.cIsDebuff.selectedIndex = bufferTempInfo.AttackData == 1 ? 0 : 1;
    let layerCount = 1;
    if (bufferData.layerCount > 1 && bufferTempInfo.PressCount > 0) {
      //buffer有叠加
      this.txtLayerCount.text = bufferData.layerCount + "";
      layerCount = bufferData.layerCount;
    } else {
      this.txtLayerCount.text = "";
    }

    let turnText = "";
    let countWayText = "";

    let tipsText = this._cellData.buffName;

    //护盾数值
    if (this._cellData.AttackType == 34) {
      tipsText = tipsText.replace(
        "0",
        this._cellData.getBuffTargetRole().bloodB + "",
      );
    }
    //流血数值
    if (this._cellData.AttackType == 305) {
      if (this._cellData.damages.length <= 0) {
        tipsText = tipsText.replace("0", this.lastDamage + "");
      } else {
        let bloodC = 0;
        for (let d of this._cellData.damages) {
          //24 流程展示伤害, 6真实伤害。第一回合24, 生效后为6
          if (d.bloodType == 24 || d.bloodType == 6) {
            bloodC += d.damageValue;
          }
        }

        tipsText = tipsText.replace("0", bloodC * layerCount + "");
        this.lastDamage = bloodC * layerCount;
      }
    }

    if (bufferData.currentTurn > 0) {
      turnText =
        LangManager.Instance.GetTranslation(
          "battle.view.buffer.BufferListItemTip.turnText02",
        ) + bufferData.currentTurn;
    }
    if (bufferData.countWay > 0) {
      countWayText =
        LangManager.Instance.GetTranslation(
          "battle.view.buffer.BufferListItemTip.turnText01",
        ) + bufferData.countWay;
    }

    if (turnText) {
      tipsText += "<br>" + turnText;
    }
    if (countWayText) {
      tipsText += "<br>" + countWayText;
    }
    if (
      this._cellData.templateId == 65999 ||
      this._cellData.templateId == 66000
    ) {
      tipsText = this._cellData.buffName;
    }
    // 是否可驱散
    if (this._cellData.templateInfo.Dispel) {
      this.getController("cannotdisperse").selectedIndex = 1;
    }

    if (Logger.openBattleBuffCon(bufferData)) {
      Logger.battle(
        "XXX[BuffItemCell]更新buff",
        bufferData.templateId,
        bufferData.countWay,
        bufferData.currentTurn,
        tipsText,
      );
    }
    this.tipData = tipsText;
  }

  public get cellData(): BufferDamageData {
    return this._cellData;
  }

  public refreshTurn() {
    if (!this._cellData) return;
    this.updateView();
  }

  public dispose() {
    ToolTipsManager.Instance.unRegister(this);
    let role = null;
    if (this._cellData) {
      role = this._cellData.getBuffTargetRole();
    }
    role &&
      role.removeEventListener(RoleEvent.BLOOD_CHANGE, this.updateView, this);
    super.dispose();
  }
}
