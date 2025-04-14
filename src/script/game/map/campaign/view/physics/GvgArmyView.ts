//@ts-expect-error: External dependencies
import IBaseMouseEvent from "../../../space/interfaces/IBaseMouseEvent";
import { CampaignArmyView } from "./CampaignArmyView";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import {
  CampaignMapEvent,
  NotificationEvent,
} from "../../../../constant/event/NotificationEvent";
import { HeroAvatar } from "../../../avatar/view/HeroAvatar";
import { ArmyState } from "../../../../constant/ArmyState";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { CampaignArmy } from "../../data/CampaignArmy";
import { AvatarInfoUILayerHandler } from "../../../view/layer/AvatarInfoUILayer";
import { eFilterFrameText } from "../../../../component/FilterFrameText";

/**
 * 公会战中的人物形象
 * 可以进行攻击 有防御图标
 *
 */
export class GvgArmyView extends CampaignArmyView implements IBaseMouseEvent {
  // private _defenceIcon:Bitmap;

  constructor() {
    super();
    //todo by yuyuanzhan 添加防御图标
    // this._defenceIcon = ComponentFactory.Instance.creatBitmap("asset.campaign.GVGDefenceIcon");
    // this.mouseEnabled = true;
  }

  public get data(): CampaignArmy {
    return this._data;
  }

  public set data(value: CampaignArmy) {
    super.data = value;
  }

  protected setName(name: string = "", nameColor?: number, grade?: number) {
    super.setName();
    if (WorldBossHelper.checkGvg(this.mapModel.mapId)) {
      if (!this._data) return;
      this.showName();
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
    CampaignManager.Instance.mapModel.selectNode = null;
    if (this.isAttackState) {
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.LOCK_PVP_WARFIGHT,
        this._data,
      );
      return true;
    }

    return false;
  }

  public mouseOverHandler(): boolean {
    if (this.isAttackState) {
      if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() > 50) {
        return true;
      }
    }
    return false;
  }

  public mouseOutHandler(): boolean {
    if (this.isAttackState) {
      if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() > 50) {
        return true;
      }
    }
    return false;
  }

  public mouseMoveHandler(): boolean {
    if (this.isAttackState) {
      if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() > 50) {
        return true;
      }
    }
    return false;
  }

  private get isAttackState(): boolean {
    if (
      this._data.baseHero.consortiaID ==
      this.mapModel.selfMemberData.baseHero.consortiaID
    ) {
      return this._data.state == ArmyState.STATE_FIGHT;
    } else {
      return true;
    }
  }

  protected __isDieHandler(evt: CampaignMapEvent) {
    super.__isDieHandler(evt);
    if (evt == null) {
      return;
    }
    this.layoutDefenceIcon();
  }

  /**
   * 加上防御状态时 调整名称布局
   *
   */
  private layoutDefenceIcon() {
    // let state:number = this._data.isDie;
    // if(CampaignArmyState.checkIsDefence(state))
    // {
    //     //加上防御状态
    //     this.addChild(this._defenceIcon);
    //     this._defenceIcon.y = this._showNamePosY - 2;
    //     if(this.isVip)
    //     {
    //         this._defenceIcon.x = _vipIcon.x - this._defenceIcon.width - 2;
    //     }
    //     else
    //     {
    //         let w:number = (this._npcName.width - this._npcName.textWidth) / 2;
    //         this._defenceIcon.x = this._npcName.x + w - this._defenceIcon.width - 2;
    //     }
    // }
    // else
    // {
    //     if(this._defenceIcon && this._defenceIcon.parent)
    //     {
    //         this._defenceIcon.parent.removeChild(this._defenceIcon);
    //     }
    // }
  }

  protected layoutTxtViewWithNamePosY() {
    super.layoutTxtViewWithNamePosY();
    this.layoutDefenceIcon();
  }

  private get isFriend(): boolean {
    return this.mapModel.selfMemberData.teamId == this._data.teamId;
  }

  public dispose() {
    // ObjectUtils.disposeObject(this._defenceIcon); this._defenceIcon = null;
    super.dispose();
  }
}
