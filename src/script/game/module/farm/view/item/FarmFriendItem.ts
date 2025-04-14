//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-08-15 10:39:53
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-12-23 10:45:03
 * @Description:
 */

import { IconFactory } from "../../../../../core/utils/IconFactory";
import FUI_FarmFriendItem from "../../../../../../fui/Farm/FUI_FarmFriendItem";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import FriendFarmStateInfo from "../../data/FriendFarmStateInfo";
import { ThaneInfoHelper } from "../../../../utils/ThaneInfoHelper";
import { FarmEvent } from "../../../../constant/event/NotificationEvent";
import { IconType } from "../../../../constant/IconType";
import { FarmManager } from "../../../../manager/FarmManager";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { TempleteManager } from "../../../../manager/TempleteManager";

export class FarmFriendItem extends FUI_FarmFriendItem {
  public pos: number = -1;
  public farmStateInfo: FriendFarmStateInfo;

  public headIcon: IconAvatarFrame;
  protected onConstruct() {
    super.onConstruct();
  }

  private _info: ThaneInfo;
  public get info(): ThaneInfo {
    return this._info;
  }

  public set info(data: ThaneInfo) {
    this._info = data;
    if (data) {
      this.title = data.nickName;
      let headId: number = data.snsInfo.headId;
      if (headId == 0) {
        //说明没修改过头像, 使用默认头像
        headId = ThaneInfoHelper.getJob(data.templateId);
      }
      this.headIcon.headId = headId;
      if (this._info.frameId > 0) {
        let itemData: t_s_itemtemplateData =
          TempleteManager.Instance.getGoodsTemplatesByTempleteId(
            this._info.frameId,
          );
        if (itemData) {
          this.headIcon.headFrame = itemData.Avata;
          this.headIcon.headEffect =
            Number(itemData.Property1) == 1 ? itemData.Avata : "";
        }
      } else {
        this.headIcon.headFrame = "";
        this.headIcon.headEffect = "";
      }
      this.txtCount.text = data.friendGrade + "";
      this.farmStateInfo = FarmManager.Instance.model.getFarmStateInfo(
        data.userId,
      );
      this.farmStateInfo.removeEventListener(
        FarmEvent.FRIEND_FARM_STATE_CHANGE,
        this.__friendFarmStateChangeHandler,
        this,
      );
      this.farmStateInfo.addEventListener(
        FarmEvent.FRIEND_FARM_STATE_CHANGE,
        this.__friendFarmStateChangeHandler,
        this,
      );
      this.imgOpt.icon = this.farmStateInfo
        ? this.farmStateInfo.curStateFrame
        : "";
    } else {
    }
  }

  private __friendFarmStateChangeHandler() {
    if (this.farmStateInfo) {
      this.imgOpt.icon = this.farmStateInfo
        ? this.farmStateInfo.curStateFrame
        : "";
    }
  }

  public dispose() {
    if (this.farmStateInfo) {
      this.farmStateInfo.removeEventListener(
        FarmEvent.FRIEND_FARM_STATE_CHANGE,
        this.__friendFarmStateChangeHandler,
        this,
      );
    }
    super.dispose();
  }
}
