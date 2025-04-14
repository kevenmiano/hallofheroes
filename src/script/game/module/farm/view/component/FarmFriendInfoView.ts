/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 18:13:55
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-08-30 15:28:42
 * @Description: 好友农场的头像及农场信息
 */

import BaseFguiCom from "../../../../../core/ui/Base/BaseFguiCom";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { FarmEvent } from "../../../../constant/event/NotificationEvent";
import { IconType } from "../../../../constant/IconType";
import { UpgradeType } from "../../../../constant/UpgradeType";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import IMManager from "../../../../manager/IMManager";
import FarmInfo from "../../data/FarmInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { t_s_upgradetemplateData } from "../../../../config/t_s_upgradetemplate";
import LangManager from "../../../../../core/lang/LangManager";
import IconAvatarFrame from "../../../../map/space/view/physics/IconAvatarFrame";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";

export class FarmFriendInfoView extends BaseFguiCom {
  private imgIcon: IconAvatarFrame;
  private userNameTxt: fgui.GLabel;
  private levelTxt: fgui.GLabel;
  private progressTxt: fgui.GLabel;
  private progress: fgui.GProgressBar;

  private _data: FarmInfo;
  private _headId: number = 0;
  constructor(container?: fgui.GComponent) {
    super(container);
    this.progress.getChild("title").visible = false;
  }

  private removeFarmListener(target: FarmInfo) {
    if (target) {
      target.removeEventListener(
        FarmEvent.FARM_GP_CHANGE,
        this.__gpChanged,
        this,
      );
      target.removeEventListener(
        FarmEvent.FARM_GRADE_CHANGE,
        this.__gradeChanged,
        this,
      );
    }
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
        "public.level2",
        this._data.grade,
      );
      this.__gpChanged(null);
    }
  }

  private __gpChanged(event: FarmEvent) {
    if (this._data && !this.comPart.isDisposed) {
      var str: string;
      var percentage: number = 0;
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
      if (this.progress && !this.progress.isDisposed) {
        this.progressTxt.text = str;
        this.progress.value = Math.floor(percentage * 100);
      }
    }
  }

  public set data(info: FarmInfo) {
    this.removeFarmListener(this._data);
    this._data = info;
    this.addFarmListener(this._data);

    if (this._data) {
      if (this._data.userId == this.thane.userId) {
        this.userNameTxt.text = this.thane.nickName;
        this._headId = this.thane.snsInfo.headId;
      } else {
        var fInfo: ThaneInfo = IMManager.Instance.getFriendInfo(
          this._data.userId,
        );
        if (fInfo) {
          this.userNameTxt.text = fInfo.nickName;
          this._headId = fInfo.snsInfo.headId;
        } else {
          this.userNameTxt.text = this._data.nickName;
        }
      }
      this.imgIcon.headId = this._headId;
      if (this._data.frameId > 0) {
        let itemData: t_s_itemtemplateData =
          TempleteManager.Instance.getGoodsTemplatesByTempleteId(
            this._data.frameId,
          );
        if (itemData) {
          this.imgIcon.headFrame = itemData.Avata;
          this.imgIcon.headEffect =
            Number(itemData.Property1) == 1 ? itemData.Avata : "";
        }
      } else {
        this.imgIcon.headFrame = "";
        this.imgIcon.headEffect = "";
      }
      this.levelTxt.text = LangManager.Instance.GetTranslation(
        "public.level2",
        this._data.grade,
      );
      this.__gpChanged(null);
    } else {
      this.progressTxt.text = "0/0";
      this.imgIcon.icon = "";
      this.userNameTxt.text = "";
      this.levelTxt.text = LangManager.Instance.GetTranslation(
        "public.level2",
        1,
      );
    }
  }
  private getNextGradeTemp(
    grade: number,
    type: number,
  ): t_s_upgradetemplateData {
    return TempleteManager.Instance.getTemplateByTypeAndLevel(grade, type);
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public dispose() {
    this.removeFarmListener(this._data);
    super.dispose();
  }
}
