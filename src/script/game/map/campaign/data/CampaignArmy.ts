import ConfigMgr from "../../../../core/config/ConfigMgr";
import StringHelper from "../../../../core/utils/StringHelper";
import { t_s_mapData } from "../../../config/t_s_map";
import { ConfigType } from "../../../constant/ConfigDefine";
import {
  CampaignMapEvent,
  PhysicsEvent,
  RoomEvent,
} from "../../../constant/event/NotificationEvent";
import { ArmyManager } from "../../../manager/ArmyManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { BaseArmy } from "../../space/data/BaseArmy";

/**
 *
 * 副本军队信息
 *
 */
export class CampaignArmy extends BaseArmy {
  private _online: boolean = true;
  public level: number = 0;
  public roomId: number = 0;
  private _combatPower: number = 0;
  private _pos: number = 0;
  private _isDie: number = 0; //0, 正常, 1死亡,2运输,3死亡运输

  private _curHp: number = 0; //当前血量
  public totalHp: number = 0; //总血量
  public riverStartTime: number = 0; //接到复活的开始时间
  public riverTime: number = 0; //复活时间
  private _hangupState: number = 0; //0未挂机, 1挂机
  private _transeferWaitState: boolean = false;
  private _teamId: number = 0; //所属阵营
  private _bufferTempId: number = 0; //buff
  public preParent: Laya.Sprite;
  public angle: number = -1;
  private _score: number = 0;
  private _geste: number = 0;
  public needInit: boolean = false; //是否需要初始化到视图
  /**是否使用收益次数 */
  public isNoGet: boolean = false;
  public isReturnedPlayer: boolean = false;
  constructor() {
    super();
  }

  public get teamId(): number {
    return this._teamId;
  }

  public set teamId(value: number) {
    if (value != this._teamId) {
      this._teamId = value;
      this.dispatchEvent(CampaignMapEvent.UPDATE_TEAM_ID, this);
    }
  }

  public get geste(): number {
    return this._geste;
  }

  public set geste(value: number) {
    this._geste = value;
    this.dispatchEvent(CampaignMapEvent.UPDATE_PVP_GESTE, value);
  }

  public get score(): number {
    return this._score;
  }

  public set score(value: number) {
    this._score = value;
    this.dispatchEvent(CampaignMapEvent.UPDATE_PVP_SCORE, value);
  }

  public get bufferTempId(): number {
    return this._bufferTempId;
  }

  public set bufferTempId(value: number) {
    this._bufferTempId = value;
    this.dispatchEvent(CampaignMapEvent.BUFFER_TEMP_ID, value);
  }

  public get transeferWaitState(): boolean {
    return this._transeferWaitState;
  }

  public setTranseferWait(value: boolean, nodeId: number, mapId: number) {
    this._transeferWaitState = value;
    if (nodeId != 0) {
      this.dispatchEvent(CampaignMapEvent.TRANSEFER_WAIT_STATE, {
        state: value,
        nodeId: nodeId,
        mapId: mapId,
      });
    }
  }

  public get hangupState(): number {
    return this._hangupState;
  }

  public set hangupState(value: number) {
    if (value != this._hangupState) {
      this._hangupState = value;
      this.dispatchEvent(CampaignMapEvent.HANGUP_STATE, value);
    }
  }

  public set huangupAdd(value: number) {
    if (value > 0) {
      this.dispatchEvent(CampaignMapEvent.HANGUP_ADD, value);
    }
  }

  public get curHp(): number {
    return this._curHp;
  }

  public set curHp(value: number) {
    this._curHp = value;
    this.dispatchEvent(PhysicsEvent.UPDATE_CUR_HP, value);
  }

  public get isDie(): number {
    return this._isDie;
  }

  public set isDie(value: number) {
    this._isDie = value;
    this.dispatchEvent(CampaignMapEvent.IS_DIE, value);
  }

  public get pos(): number {
    return this._pos;
  }

  public set pos(value: number) {
    this._pos = value;
  }

  public get online(): boolean {
    return this._online;
  }

  public get mapTempInfo(): t_s_mapData {
    return ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_map,
      String(this.mapId),
    );
  }

  public set online(value: boolean) {
    if (this._online == value) {
      return;
    }
    this._online = value;
    this.dispatchEvent(CampaignMapEvent.ONLINE_STATE, this);
  }

  public get combatPower(): number {
    return this._combatPower;
  }

  public set combatPower(value: number) {
    this._combatPower = value;
  }

  public syncArmyInfo() {
    let id: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    if (id == this.userId) {
      let army: any = ArmyManager.Instance.army;
      if (this.baseHero) {
        if (StringHelper.isNullOrEmpty(this.baseHero.serviceName)) {
          if (army) {
            army.state = this.state;
          }
        } else if (
          this.baseHero.serviceName ==
          PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName
        ) {
          if (army) {
            army.state = this.state;
          }
        }
      } else {
        if (army) {
          army.state = this.state;
        }
      }
    }
    this.dispatchEvent(CampaignMapEvent.UPDATE_CAMPAIGN_ARMY, this);
  }

  public commit() {
    this.dispatchEvent(RoomEvent.UPDATE_ROOM_PLAYER_DATA, this);
  }
}
