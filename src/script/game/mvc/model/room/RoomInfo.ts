import ConfigMgr from "../../../../core/config/ConfigMgr";
import Logger from "../../../../core/logger/Logger";
import { t_s_campaignData } from "../../../config/t_s_campaign";
import { t_s_mapData } from "../../../config/t_s_map";
import { ConfigType } from "../../../constant/ConfigDefine";
import {
  NotificationEvent,
  RoomEvent,
} from "../../../constant/event/NotificationEvent";
import { RoomState } from "../../../constant/RoomState";
import { NotificationManager } from "../../../manager/NotificationManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import { SimpleRoomInfo } from "./SimpleRoomInfo";

export class RoomInfo extends SimpleRoomInfo {
  private _houseOwnerId: number = 0;
  private _campaignId: number = 0;
  private _armyFightPos: any[]; //多人本部队战斗站位
  public isCross: boolean = false;
  private memberId: any[] = [];
  public roomPlayer: any;

  constructor() {
    super();
  }

  public get armyFightPos(): any[] {
    return this._armyFightPos;
  }

  public set armyFightPos(value: any[]) {
    if (this._armyFightPos != value) {
      this._armyFightPos = value;
      this.dispatchEvent(RoomEvent.UPDATE_TEAM_FIGHT_POS, value);
    }
  }

  public set campaignId(value: number) {
    if (this._campaignId != value) {
      this._campaignId = value;
      this.dispatchEvent(RoomEvent.UPDATE_ROOM_MAP, this);
    }
  }
  public get campaignId(): number {
    return this._campaignId;
  }

  public get mapTemplate(): t_s_campaignData {
    let temp: t_s_campaignData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_campaign,
      this.campaignId,
    );
    if (!temp) {
      // 由于多人副本多个关卡, 每进入一个关卡发的是 map中的Id, 再通过Id找CampaignId
      let Id = this.campaignId;
      let tempMap: t_s_mapData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_map,
        Id,
      );
      if (tempMap) {
        temp = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_campaign,
          tempMap.CampaignId,
        );
      }
      if (temp) {
        this._campaignId = tempMap.CampaignId;
      } else {
        Logger.warn("[RoomInfo]获取副本配置失败", this.campaignId);
      }
      // TODO vehicleCampaignDic
      // temp =ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_campaign, this.campaignId);
    }
    return temp;
  }

  // private _selectedMapTemplate: t_s_campaignData;
  // public set selectedMapTemplate(value: t_s_campaignData) {
  //     this._selectedMapTemplate = value;
  // }

  // public get selectedMapTemplate(): t_s_campaignData {
  //     return this._selectedMapTemplate;
  // }

  private _armyList: Map<string, CampaignArmy> = new Map();
  /**
   * 房间中加入一个玩家
   * @param army
   * @param isDispatch
   *
   */
  public addArmy(army: CampaignArmy, isDispatch: boolean = true) {
    Logger.info("[RoomInfo]addArmy", army, this._armyList);
    var serverName: string = "";
    if (this.isCross) {
      serverName = army.baseHero.serviceName;
    }

    for (const key in this._armyList) {
      let campaignArmy: CampaignArmy = this._armyList[key];
      if (campaignArmy && campaignArmy.baseHero.userId == army.userId) {
        if (this.isCross) {
          delete this._armyList["_" + army.baseHero.userId];
        } else {
          delete this._armyList[
            army.baseHero.serviceName + "_" + army.baseHero.userId
          ];
        }
      }
    }
    this._armyList[serverName + "_" + army.baseHero.userId] = army;
    this.dispatchEvent(RoomEvent.ADD_PLAYER_ROOM, army);
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.ROOM_INFO_UPDATE,
    );
    if (this.isCross)
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.CROSS_ADD_GOONBTN,
      );
  }
  /**
   * 从房间中移除一个玩家
   * @param userId
   * @param serverName
   * @return
   *
   */
  public removePlayerByUserId(
    userId: number,
    serverName: string = "",
  ): CampaignArmy {
    Logger.info(
      "[RoomInfo]removePlayerByUserId 需要删除",
      userId,
      serverName,
      this._armyList,
    );
    if (!this.isCross) serverName = "";
    var key: string = serverName + "_" + userId;
    var player = this._armyList[key] as CampaignArmy;
    if (!player) return;

    let playerTmp = new CampaignArmy();
    playerTmp.userId = player.userId;
    playerTmp.pos = player.pos;
    playerTmp.id = player.id;

    this.curCount = this.curCount > 1 ? this.curCount - 1 : 1;
    this.roomState = RoomState.STATE_USEING;
    delete this._armyList[key];
    this.dispatchEvent(RoomEvent.REMOVE_PLAYER_ROOM, playerTmp);
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.ROOM_INFO_UPDATE,
    );
    if (this.isCross)
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.CROSS_ADD_GOONBTN,
      );
    return player;
  }

  public getPlayerByPos(pos: number): CampaignArmy {
    for (const key in this._armyList) {
      let info: CampaignArmy = this._armyList[key];
      if (info.pos == pos) return info;
    }
    return null;
  }

  public getPlayerByUserId(
    userId: number,
    serverName: string = "",
  ): CampaignArmy {
    if (!this.isCross) serverName = "";
    return this._armyList[serverName + "_" + userId] as CampaignArmy;
  }

  public getPlayerByArmyId(
    armyId: number,
    serverName: string = "",
  ): CampaignArmy {
    if (serverName == null || !this.isCross) serverName = "";
    var cArmy: CampaignArmy;
    if (this.isCross) {
      for (const key in this._armyList) {
        let cArmy = this._armyList[key];
        if (cArmy.id == armyId && cArmy.baseHero.serviceName == serverName)
          return cArmy;
      }
    } else {
      for (const key in this._armyList) {
        let cArmy = this._armyList[key];
        if (cArmy.id == armyId) return cArmy;
      }
    }
    return null;
  }

  public get playerList(): Map<string, CampaignArmy> {
    return this._armyList;
  }

  public get playerCount(): number {
    var count: number = 0;
    for (const key in this._armyList) {
      count++;
    }
    return count;
  }

  public get allPlayerReader(): boolean {
    for (const key in this._armyList) {
      if (this._armyList.hasOwnProperty(key)) {
        let info = this._armyList[key];
        if (
          info.roomState == RoomState.STATE_UNUSE &&
          this.houseOwnerId != info.baseHero.userId
        )
          return false;
      }
    }
    return true;
  }

  /**
   * 检查房间人数
   * @return
   *
   */
  public checkRoomPlayerCount(): boolean {
    var leng: number = 0;
    for (const key in this._armyList) {
      leng++;
    }
    if (leng == this.capacity) return true;
    return false;
  }

  public set houseOwnerId(value: number) {
    if (this._houseOwnerId != value) {
      this._houseOwnerId = value;
      this.dispatchEvent(RoomEvent.ROOM_HOUSEOWNER_CHANGE, null);
      if (this.isCross)
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.CROSS_ADD_GOONBTN,
        );
    }
  }

  public get houseOwnerId(): number {
    return this._houseOwnerId;
  }

  public checkRoomHasBackPlayer(): boolean {
    for (const key in this._armyList) {
      if (this._armyList.hasOwnProperty(key)) {
        let info: CampaignArmy = this._armyList[key];
        if (info.isReturnedPlayer) return true;
      }
    }
    return false;
  }
}
