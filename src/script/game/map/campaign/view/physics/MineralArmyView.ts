//@ts-expect-error: External dependencies
import LangManager from "../../../../../core/lang/LangManager";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import StringHelper from "../../../../../core/utils/StringHelper";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../../../../component/FilterFrameText";
import { ArmyState } from "../../../../constant/ArmyState";
import { AvatarInfoTag } from "../../../../constant/Const";
import {
  AvatarInfoUIEvent,
  CampaignEvent,
  CampaignMapEvent,
  NotificationEvent,
} from "../../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import MineralModel from "../../../../mvc/model/MineralModel";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { HeroAvatar } from "../../../avatar/view/HeroAvatar";
import { NodeState } from "../../../space/constant/NodeState";
import IBaseMouseEvent from "../../../space/interfaces/IBaseMouseEvent";
import {
  AvatarInfoUILayer,
  AvatarInfoUILayerHandler,
} from "../../../view/layer/AvatarInfoUILayer";
import { CampaignArmy } from "../../data/CampaignArmy";
import { CampaignArmyState } from "../../data/CampaignArmyState";
import { CampaignWalkLayer } from "../layer/CampaignWalkLayer";
import { CampaignArmyView } from "./CampaignArmyView";

/**
 * 紫晶矿场人物视图
 * @author pzlricky
 *
 */
export class MineralArmyView
  extends CampaignArmyView
  implements IBaseMouseEvent
{
  protected _mineralTxt: FilterFrameText;

  IBaseMouseEvent: string = "IBaseMouseEvent";
  discriminator: string = "I-AM-A";

  constructor() {
    super();
  }

  protected initView() {
    super.initView();
    this._mineralTxt = new FilterFrameText(240, 20, undefined, 16);
    this._mineralTxt.y = this._showNamePosY - 40;
    this.addChild(this._mineralTxt);
  }

  protected layoutTxtViewWithNamePosY() {
    super.layoutTxtViewWithNamePosY();
    this._mineralTxt.y = this._showNamePosY - AvatarInfoUILayer.GAPY_CONSORTIA;
    if (this.consortiaName) {
      this._mineralTxt.y -= 20;
    }
    this.layoutCB && this.layoutCB();
  }

  protected setHitArea() {
    super.setHitArea();
  }

  /**计算人物头顶坐标 */
  public caluateTopPos(): number {
    var pos: number = this._showNamePosY - 40;
    if (this.consortiaName) {
      pos -= 20;
    }
    return pos;
  }

  public mouseClickHandler(evt: Laya.Event): boolean {
    // if (this._avatar && this.isSelf) {
    // (this.parent as CampaignWalkLayer).checkClickPlayerNum(evt.stageX, evt.stageY);
    // if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() < 50 || this.isSelf) {
    //     if (evt) {
    //         this.throughDispatch(evt);
    //     }
    //     return false;
    // }

    if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() >= 0) {
      //判断是否玩家重叠
      (this.parent as CampaignWalkLayer).checkClickPlayerNum(
        evt.stageX,
        evt.stageY,
      );
      return true;
    }
    if (this.inMineralMapAndNotInFight) {
      PlayerManager.Instance.currentPlayerModel.selectTarget = this.data;
      if (!this.isSelf && !this.isSelfConsortia && !this.isSelfTeam) {
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.LOCK_PVP_WARFIGHT,
          this.data,
        );
      }
      evt.stopPropagation();
      return false;
    }
    return true;
  }

  public mouseOverHandler(evt: Laya.Event): boolean {
    return false;
  }

  public mouseOutHandler(evt: Laya.Event): boolean {
    if (!this.isSelf) {
      if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() >= 0)
        return true;
    }
    if (this._avatar) {
      UIFilter.normal(this._avatar);
    }
    return false;
  }

  private get inMineralMapAndNotInFight(): boolean {
    return (
      WorldBossHelper.checkMineral(this.mapModel.mapId) &&
      this._data.state != ArmyState.STATE_FIGHT
    );
  }

  public mouseMoveHandler(evt: Laya.Event): boolean {
    if (this.isSelf) {
      this.mouseEnabled = false;
      return false;
    }
    if (this._avatar) {
      if ((<HeroAvatar>this._avatar).getCurrentPixels() >= 0) {
        UIFilter.light(this._avatar);
        return (
          this.inMineralMapAndNotInFight &&
          !this.isSelfConsortia &&
          !this.isSelfTeam
        );
      } else {
        UIFilter.normal(this._avatar);
        if (evt) {
          this.throughDispatch(evt);
        }
        return false;
      }
    }
    return false;
  }

  private throughDispatch(e: Laya.Event) {
    var arr: any[] = CampaignManager.Instance.mapModel.mapNodesData;
    if (!arr) return;
    for (const key in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, key)) {
        let element = arr[key];
        if (NodeState.displayState(element.info.state)) {
          if (
            element.nodeView &&
            element.nodeView != this &&
            element.nodeView.stage
          ) {
            var rect: Laya.Rectangle = element.nodeView.getBounds();
            if (rect.contains(e.stageX, e.stageY)) {
              element.nodeView.dispatchEvent(e);
              return;
            }
          }
        }
      }
    }

    arr = null;
  }

  public lockTargetAndHideFate() {
    if (this._fateSkillEffect && this._fateSkillEffect.parent) {
      this._fateSkillEffect.parent.removeChild(this._fateSkillEffect);
    }
  }

  public unlockTargetAndShowFate() {
    if (this._fateSkillEffect) {
      this.addChildAt(this._fateSkillEffect, 0);
    }
  }

  protected removeEvent() {
    super.removeEvent();
    this.mineralModel.removeEventListener(
      CampaignEvent.UPDATE_MINERAL_INFO,
      this.__updateCarInfo,
      this,
    );
  }

  protected addEvent() {
    super.addEvent();
    this.mineralModel.addEventListener(
      CampaignEvent.UPDATE_MINERAL_INFO,
      this.__updateCarInfo,
      this,
    );
  }

  protected __updateCarInfo(event: CampaignEvent) {
    this.setMineralText();
  }

  protected setConsortiaName(
    name: string,
    nameColor: number,
    noSymbol: boolean = false,
  ) {
    if (StringHelper.isNullOrEmpty(name)) {
      AvatarInfoUILayerHandler.handle_CON_VISIBLE(
        this._uuid,
        AvatarInfoTag.ConsortiaName,
        false,
      );
      // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CON_VISIBLE, this._uuid, AvatarInfoTag.ConsortiaName, false)
      return;
    }
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.ConsortiaName,
      this._isPlaying,
    );
    // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CON_VISIBLE, this._uuid, AvatarInfoTag.ConsortiaName, this._isPlaying)

    if (this.isSelf) {
      nameColor = 3;
    } else if (this.isSelfConsortia || this.isSelfTeam) {
      nameColor = 2;
    } else {
      nameColor = 5;
    }
    AvatarInfoUILayerHandler.handle_CONSORTIA_TEXT(
      this._uuid,
      noSymbol
        ? name
        : LangManager.Instance.GetTranslation(
            "map.avatar.view.consortiaName",
            name,
          ),
    );
    AvatarInfoUILayerHandler.handle_CONSORTIA_FRAME(
      this._uuid,
      nameColor,
      eFilterFrameText.AvatarName,
    );
    // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CONSORTIA_TEXT, this._uuid, (noSymbol ? name : LangManager.Instance.GetTranslation("map.avatar.view.consortiaName", name)))
    // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CONSORTIA_FRAME, this._uuid, nameColor, eFilterFrameText.core_NpcNameText)
  }

  private get minerals(): string {
    var result: number = 0;
    result = this.mineralModel.carInfos[this.data.baseHero.userId]
      ? this.mineralModel.carInfos[this.data.baseHero.userId].minerals
      : 0;
    return LangManager.Instance.GetTranslation(
      "map.campaign.view.physics.MineralCarView.minerals",
      result,
    );
  }

  protected setMineralText() {
    if (!this._mineralTxt) {
      this._mineralTxt = new FilterFrameText(240, 20, undefined, 16);
      this._mineralTxt.y = this._showNamePosY - 40;
    }
    this._mineralTxt.text = this.minerals;
    if (this._mineralTxt && !this._mineralTxt.parent)
      this.addChild(this._mineralTxt);
  }

  private get mineralModel(): MineralModel {
    return CampaignManager.Instance.mineralModel;
  }

  protected __heroPropertyHandler(evt: PlayerEvent) {
    super.__heroPropertyHandler(evt);

    this.changeSpeedTo(this.precentSpeed);
  }

  protected showAvatar(value: CampaignArmy) {
    super.showAvatar(value);
    this.changeSpeedTo(this.precentSpeed);
  }

  protected __isDieHandler(evt: CampaignMapEvent) {
    if (!this._data) return;
    if (CampaignArmyState.checkDied(this._data.isDie)) {
      UIFilter.gray(this);
      if (this._petAvatarView) UIFilter.gray(this._petAvatarView);
      this.mouseThrough = this.mouseEnabled = false;
    } else {
      UIFilter.normal(this);
      if (this._petAvatarView) UIFilter.normal(this._petAvatarView);
      this.mouseEnabled = true;
      this.mouseThrough = false;
    }
  }

  public get isHoner(): boolean {
    return false;
  }

  protected setFireView() {
    super.setFireView();
    this.mouseEnabled = false;
  }

  protected clearFireView() {
    super.clearFireView();
    this.__isDieHandler(null);
  }

  public dispose() {
    if (this._mineralTxt) this._mineralTxt.dispose();
    this._mineralTxt = null;
    super.dispose();
  }
}
