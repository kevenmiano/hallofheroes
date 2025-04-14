//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-04-06 21:14:48
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-04-24 10:30:13
 * @Description:
 */
import { eFilterFrameText } from "../../../../component/FilterFrameText";
import { ArmyState } from "../../../../constant/ArmyState";
import {
  AvatarInfoUIEvent,
  NotificationEvent,
} from "../../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { HeroAvatar } from "../../../avatar/view/HeroAvatar";
import IBaseMouseEvent from "../../../space/interfaces/IBaseMouseEvent";
import { AvatarInfoUILayerHandler } from "../../../view/layer/AvatarInfoUILayer";
import { CampaignArmy } from "../../data/CampaignArmy";
import { CampaignWalkLayer } from "../layer/CampaignWalkLayer";
import { CampaignArmyView } from "./CampaignArmyView";

/**
 *
 * 战场中的人物形象 <br/>
 * 战场中人物名称的颜色只有两种
 */
export class PvpWarFightArmyView
  extends CampaignArmyView
  implements IBaseMouseEvent
{
  discriminator: string = "I-AM-A";
  IBaseMouseEvent: string = "IBaseMouseEvent";

  public set data(value) {
    super.data = value;
  }

  public get data(): CampaignArmy {
    return this._data;
  }

  protected setName(name: string = "", nameColor: number, grade?: number) {
    this.showName();
    super.setName(name, nameColor);
    if (WorldBossHelper.checkPvp(this.mapModel.mapId)) {
      if (!this._data) return;
      if (!this.isFriend) {
        nameColor = 5;
      } else {
        nameColor = this.getNameColor();
      }
      AvatarInfoUILayerHandler.handle_NAME_FRAME(
        this._uuid,
        nameColor,
        eFilterFrameText.AvatarName,
      );
      AvatarInfoUILayerHandler.handle_CONSORTIA_FRAME(
        this._uuid,
        nameColor,
        eFilterFrameText.AvatarName,
      );
    }
  }

  public mouseClickHandler(evt: Laya.Event): boolean {
    // CampaignManager.Instance.mapModel.selectNode = null;
    if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() >= 0) {
      //判断是否玩家重叠
      (this.parent as CampaignWalkLayer).checkClickPlayerNum(
        evt.stageX,
        evt.stageY,
        this.data,
      );
      return true;
    }
    return false;
  }

  public attackFun() {
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.LOCK_PVP_WARFIGHT,
      this._data,
    );
  }

  public mouseOverHandler(evt: Laya.Event): boolean {
    if (this.inPvpMapAndNotSelfTeamAndNotInFight) {
      if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() >= 0) {
        return true;
      }
    }
    return false;
  }

  public mouseOutHandler(evt: Laya.Event): boolean {
    if (this.inPvpMapAndNotSelfTeamAndNotInFight) {
      if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() >= 0) {
        return true;
      }
    }
    return false;
  }

  public mouseMoveHandler(evt: Laya.Event): boolean {
    if (this.inPvpMapAndNotSelfTeamAndNotInFight) {
      if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() >= 0) {
        return true;
      }
    }
    return false;
  }

  private get inPvpMapAndNotSelfTeamAndNotInFight(): boolean {
    return (
      WorldBossHelper.checkPvp(this.mapModel.mapId) &&
      this._data.teamId != this.mapModel.selfMemberData.teamId &&
      this._data.state != ArmyState.STATE_FIGHT
    );
  }

  protected __heroPropertyHandler(evt: PlayerEvent) {
    super.__heroPropertyHandler(evt);

    this.changeSpeedTo(this.precentSpeed);
  }

  protected showAvatar(value) {
    super.showAvatar(value);
    this.changeSpeedTo(this.precentSpeed);
  }

  private get isFriend(): boolean {
    return this.mapModel.selfMemberData.teamId == this._data.teamId;
  }
}
