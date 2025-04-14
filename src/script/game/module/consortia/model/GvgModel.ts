import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { GvgEvent } from "../../../constant/event/NotificationEvent";
import { GuildOrderInfo } from "../data/gvg/GuildOrderInfo";
import { GuildChallengeInfo } from "../data/gvg/GuildChallengeInfo";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { GuildGroupInfo } from "../data/gvg/GuildGroupInfo";
import { GuildGroupIndex } from "../data/gvg/GuildGroupIndex";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";

/**
 * 公会战
 */
export class GvgModel extends GameEventDispatcher {
  public guildName: string = "";
  public guildGrade: number = 0;
  public guildOffer: number = 0;
  public guildOrder: number = 0;
  public guildFightPower: number = 0;

  private _guildChallengeList: GuildChallengeInfo[] = [];
  private _guildOrderList: GuildOrderInfo[] = [];
  public currentApplyGuild: GuildOrderInfo;
  private _selectMember: ThaneInfo;
  private _guildGroup: GuildGroupInfo[] = [];
  private _guildOrderGroup: GuildGroupInfo[] = [];
  public guildOrderDate: Date;

  constructor() {
    super();
  }

  public get guildGroup(): GuildGroupInfo[] {
    return this._guildGroup;
  }

  public set guildGroup(value: GuildGroupInfo[]) {
    if (this._guildGroup == value) {
      return;
    }
    this._guildGroup = value;
    this.dispatchEvent(GvgEvent.UPDATE_GUILD_GROUP, this._guildGroup);
  }

  public get guildOrderGroup(): GuildGroupInfo[] {
    return this._guildOrderGroup;
  }

  public set guildOrderGroup(value: GuildGroupInfo[]) {
    if (this._guildOrderGroup == value) {
      return;
    }
    this._guildOrderGroup = value;
    this.dispatchEvent(
      GvgEvent.UPDATE_GUILD_ORDER_GROUP,
      this._guildOrderGroup,
    );
  }

  public get hasGuildOrder(): boolean {
    return this._guildOrderGroup && this._guildOrderGroup.length > 0;
  }

  public get selectMember(): ThaneInfo {
    return this._selectMember;
  }

  public set selectMember(value: ThaneInfo) {
    this._selectMember = value;
    this.dispatchEvent(GvgEvent.SELECT_MEMBER_ITEM, value);
  }

  public set currentGuildOrderList(value: GuildOrderInfo[]) {
    this._guildOrderList = value;
    this.dispatchEvent(GvgEvent.GUILD_ORDER_INFO_LIST, value);
  }

  public get currentGuildOrderList(): GuildOrderInfo[] {
    return this._guildOrderList;
  }

  public set currentGuildChallengeList(value: GuildChallengeInfo[]) {
    this._guildChallengeList = value;
    this.dispatchEvent(GvgEvent.GUILD_CHALLENGE_LIST, value);
  }

  public get currentGuildChallengeList(): GuildChallengeInfo[] {
    return this._guildChallengeList;
  }

  public findGuildOrderById(id: number): GuildOrderInfo {
    for (let i = 0, len = this._guildOrderList.length; i < len; i++) {
      const info: GuildOrderInfo = this._guildOrderList[i];
      if (info.id == id) {
        return info;
      }
    }
    return null;
  }

  public getLeftGvgInfo(): GuildChallengeInfo {
    for (let i = 0, len = this._guildChallengeList.length; i < len; i++) {
      const info = this._guildChallengeList[i];
      if (
        info.attackGuildId ==
        ConsortiaManager.Instance.model.consortiaInfo.consortiaId
      ) {
        return info;
      }
    }
    return null;
  }

  public getRightGvgInfo(): GuildChallengeInfo {
    for (let i = 0, len = this._guildChallengeList.length; i < len; i++) {
      const info = this._guildChallengeList[i];
      if (
        info.attackGuildId !=
        ConsortiaManager.Instance.model.consortiaInfo.consortiaId
      ) {
        return info;
      }
    }
    return null;
  }

  /**
   *找出指定天的战斗情况
   * @param index
   * @return
   *
   */
  public getGroupByIndex(index: number): GuildGroupInfo[] {
    if (index < GuildGroupIndex.group10 && this._guildGroup) {
      this._guildGroup = ArrayUtils.sortOn(
        this._guildGroup,
        "total" + index,
        ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
      );
      let tempGroup: GuildGroupInfo[] = [];
      for (let i = 0, len = this._guildGroup.length; i < len; i++) {
        const gInfo = this._guildGroup[i];
        tempGroup.push(gInfo);
      }
      let temp: GuildGroupInfo[] = [];
      while (tempGroup.length > 0) {
        let info: GuildGroupInfo = tempGroup.shift();
        temp.push(info);
        let b: boolean = false;
        for (let i: number = 0; i < tempGroup.length; i++) {
          let g: GuildGroupInfo = tempGroup[i] as GuildGroupInfo;
          if (info["group" + index] == g["group" + index]) {
            tempGroup.splice(i, 1);
            temp.push(g);
            b = true;
            break;
          }
        }
        if (!b) {
          temp.push(new GuildGroupInfo());
        }
      }
      return temp;
    }
    return this._guildOrderGroup;
  }

  /**
   * 是否已经开启该组战斗
   *
   */
  public get isStartGroup(): number {
    let groups: number[] = [
      GuildGroupIndex.group1,
      GuildGroupIndex.group2,
      GuildGroupIndex.group3,
    ];
    let arr: number[] = this.getStartGroups();
    let index: number = 0;
    for (let i: number = 0; i < arr.length; i++) {
      if (arr[i] != 0) {
        index = i;
      }
    }
    return groups[index];
  }

  public getStartGroups(): number[] {
    let reslut: number[] = [1, 0, 0];

    for (let i = 0, len = this._guildGroup.length; i < len; i++) {
      const g = this._guildGroup[i];
      reslut[0] += g.group1;
      reslut[1] += g.group2;
      reslut[2] += g.group3;
    }
    return reslut;
  }

  /**
   * 自已是否可以参与公会战
   */
  public get isFightMember(): boolean {
    let consortiaId: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID;
    if (consortiaId == 0) {
      return false;
    }
    for (let i = 0, len = this._guildGroup.length; i < len; i++) {
      const g = this._guildGroup[i];
      if (consortiaId == g.consortiaId) {
        return true;
      }
    }
    return false;
  }

  /**
   * 公会战是否排期
   * @return
   *
   */
  public get gvgScheduling(): boolean {
    let count: number = 0;
    for (let i = 0, len = this._guildGroup.length; i < len; i++) {
      const g = this._guildGroup[i];
      count++;
    }
    return count > 2;
  }

  /**
   *
   * 是否为参战管理员
   *
   */
  public get isFightManager(): boolean {
    if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
      if (!this.isFightMember) {
        return false;
      }
    }
    let userId: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    let temp: ThaneInfo =
      ConsortiaManager.Instance.model.consortiaMemberList[userId];
    return (
      temp && (temp.dutyId == 1 || (temp.dutyId == 2 && temp.isTeamPlayer))
    );
  }

  /**
   *是否是参与公会战的公会会长
   */
  public get isFightChairman(): boolean {
    if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
      if (!this.isFightMember) {
        return false;
      }
    }
    let userId: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    let chairmanID: number =
      ConsortiaManager.Instance.model.consortiaInfo.chairmanID;
    return userId == chairmanID;
  }
}
