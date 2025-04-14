import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import Dictionary from "../../../../core/utils/Dictionary";
import {
  CampaignEvent,
  GvgEvent,
} from "../../../constant/event/NotificationEvent";
import { GuildWarJoinPlayerInfo } from "../../../map/campaign/data/GuildWarJoinPlayerInfo";
import { GvgTopTenInfo } from "../data/gvg/GvgTopTenInfo";
import { GvgWarBufferInfo } from "../data/gvg/GvgWarBufferInfo";

/**
 * @description    公会战 包括双方公会信息 自己的公会战buff列表 以及贡献排行榜
 * @author yuanzhan.yu
 * @date 2021/10/25 11:14
 * @ver 1.0
 */
export class GvgMapModel extends GameEventDispatcher {
  public selfConsortiaName: string;
  public selfGuardCount: number; //己方参战人数
  public selfScore: number;
  public selfConsortiaId: number;
  public enemyConsortiaName: string;
  public enemyGuardCount: number; //对方参战人数
  public enemyScore: number;
  public enemyConsortiaId: number;
  private _gvgBufferList: Dictionary;
  private _joinPlayerinfo: GuildWarJoinPlayerInfo;
  public leftTime: number = 0;
  public get joinPlayerinfo(): GuildWarJoinPlayerInfo {
    return this._joinPlayerinfo;
  }

  public set joinPlayerinfo(value: GuildWarJoinPlayerInfo) {
    this._joinPlayerinfo = value;
    this.dispatchEvent(GvgEvent.GUILDWAR_PLAYER_COUNT, value);
  }

  constructor() {
    super();
    this._gvgBufferList = new Dictionary();
  }

  public beginChanges(): void {}

  public commit(): void {
    this.dispatchEvent(CampaignEvent.UPDATE_GVG_INFO, null);
  }

  public dispatchGuildWarOpenLeftTime(value: number): void {
    this.leftTime = value;
    this.dispatchEvent(GvgEvent.GUILDWAR_OPEN_LEFTTIME, value);
  }

  public get gvgBufferList(): Dictionary {
    return this._gvgBufferList;
  }

  public getGvgBufferByTemplateId(tid: number): GvgWarBufferInfo {
    return this._gvgBufferList[tid];
  }

  public addGvgBuffer(buffer: GvgWarBufferInfo): void {
    this._gvgBufferList[buffer.templateId] = buffer;
  }

  private _topTen: GvgTopTenInfo;

  public get topTen(): GvgTopTenInfo {
    return this._topTen;
  }

  public set topTen(value: GvgTopTenInfo) {
    this._topTen = value;
    this.dispatchEvent(GvgEvent.TOP_TEN_CHANGE, value);
  }
}
