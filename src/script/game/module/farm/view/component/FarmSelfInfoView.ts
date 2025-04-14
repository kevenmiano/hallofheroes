/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 18:13:55
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-08-15 16:50:54
 * @Description: 自己农场的头像及农场信息
 */

import BaseFguiCom from "../../../../../core/ui/Base/BaseFguiCom";
import { FormularySets } from "../../../../../core/utils/FormularySets";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import {
  FarmEvent,
  ResourceEvent,
} from "../../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { IconType } from "../../../../constant/IconType";
import { UpgradeType } from "../../../../constant/UpgradeType";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ResourceData } from "../../../../datas/resource/ResourceData";
import IMManager from "../../../../manager/IMManager";
import FarmInfo from "../../data/FarmInfo";
import { FarmModel } from "../../data/FarmModel";
import { BaseIcon } from "../../../../component/BaseIcon";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ResourceManager } from "../../../../manager/ResourceManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { t_s_upgradetemplateData } from "../../../../config/t_s_upgradetemplate";
import LangManager from "../../../../../core/lang/LangManager";
import UIButton from "../../../../../core/ui/UIButton";
import { EmWindow } from "../../../../constant/UIDefine";
import UIManager from "../../../../../core/ui/UIManager";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../../constant/TemplateIDConstant";
import ColorConstant from "../../../../constant/ColorConstant";

export class FarmSelfInfoView extends BaseFguiCom {
  private levelTxt: fgui.GLabel;
  private progressTxt: fgui.GLabel;
  private progress: fgui.GImage;
  private _data: FarmInfo;

  constructor(container?: fgui.GComponent) {
    super(container);
  }

  private addFarmListener(target: FarmInfo) {
    if (target) {
      target.addEventListener(FarmEvent.FARM_GP_CHANGE, this.__gpChanged, this);
      target.addEventListener(
        FarmEvent.FARM_GRADE_CHANGE,
        this.__gradeChanged,
        this,
      );
    }
  }

  private __gradeChanged(event: FarmEvent) {
    if (this._data) {
      this.levelTxt.text = LangManager.Instance.GetTranslation(
        "public.level3",
        this._data.grade,
      );
      this.__gpChanged(null);
    }
  }

  private __gpChanged(event: FarmEvent) {
    if (this._data && !this.comPart.isDisposed) {
      var str: string;
      var percentage: number;
      var upGrade: t_s_upgradetemplateData = this.getNextGradeTemp(
        this._data.grade + 1,
        UpgradeType.UPGRADE_TYPE_FARM,
      );
      if (upGrade) {
        percentage = this._data.gp / upGrade.Data;
        if (percentage > 1) {
          percentage = 1;
          str = upGrade.Data + " / " + upGrade.Data;
        } else {
          str = this._data.gp + " / " + upGrade.Data;
        }
      } else {
        percentage = 1;
        str = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.StarTip.gp01",
        );
      }
      if (this.progressTxt && !this.progressTxt.isDisposed) {
        this.progressTxt.text = str;
      }
      if (this.progress && !this.progress.isDisposed) {
        this.progressTxt.text = str;
        this.progress.fillAmount = percentage;
      }
    }
  }

  public set data(info: FarmInfo) {
    this._data = info;
    this.addFarmListener(this._data);
    if (this._data) {
      this.levelTxt.text = LangManager.Instance.GetTranslation(
        "public.level3",
        this._data.grade,
      );
      this.__gpChanged(null);
    } else {
      this.progressTxt.text = "0/0";
      this.levelTxt.text = LangManager.Instance.GetTranslation(
        "public.level2",
        1,
      );
    }
  }

  // private btnChargeClick() {

  // }

  private getNextGradeTemp(
    grade: number,
    type: number,
  ): t_s_upgradetemplateData {
    return TempleteManager.Instance.getTemplateByTypeAndLevel(grade, type);
  }

  // private get thane(): ThaneInfo {
  // 	return ArmyManager.Instance.thane;
  // }

  // private get playerInfo(): PlayerInfo {
  // 	return PlayerManager.Instance.currentPlayerModel.playerInfo;
  // }

  // private get gold(): ResourceData {
  // 	return ResourceManager.Instance.gold;
  // }

  // private get crystal(): ResourceData {
  // 	return ResourceManager.Instance.waterCrystal;
  // }

  public dispose() {
    super.dispose();
  }
}
