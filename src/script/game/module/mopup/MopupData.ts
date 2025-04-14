/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-13 10:56:53
 * @LastEditTime: 2021-09-09 21:08:37
 * @LastEditors: jeremy.xu
 * @Description:
 */

import Logger from "../../../core/logger/Logger";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { TowerInfo } from "../../datas/playerinfo/TowerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import FrameDataBase from "../../mvc/FrameDataBase";
import { WorldBossHelper } from "../../utils/WorldBossHelper";

// 扫荡页面类型
export enum eMopupState {
  CampaignMopupPre = 1,
  CampaignMopuping,
  MazeMopupPre,
  MazeMopuping,
  PetCampaignMopupPre,
  PetCampaignMopupping,
}

// 扫荡类型
export enum eMopupType {
  CampaignMopup = 1,
  MazeMopup,
  PetCampaignMopup,
}

// 扫荡操作 扫荡、加速、结果、取消
export enum eMopupOptType {
  Mopup = 1,
  Speed,
  GetResult,
  Cancel,
}

// 扫荡item 类型: 无、扫荡中、单次扫荡结束, 扫荡结束
export enum eMopupItemType {
  None = 0,
  Mopuping,
  Mopuped,
  MopupEnd,
}

export default class MopupData extends FrameDataBase {
  public static WEARY: number = 20;
  public static MOPUP_LIST_REFRESH: string = "MOPUP_LIST_REFRESH";
  public static MOPUP_END: string = "MOPUP_END";

  /**
   * 副本ID
   */
  public campaignId: number = 0;
  /**
   * 副本次数
   */
  public mopupCount: number = 0;
  /**
   * 迷宫层数
   */
  public mopupLayer: number = 0;
  /**
   * 是否处于扫荡状态
   */
  private _isMopup: boolean;
  public set isMopup(value: boolean) {
    this._isMopup = value;
    if (this._isMopup) {
      //上线时扫荡中有奖励界面则关闭
      // if (FrameControllerManager.instance.dayGuideController.frame) {
      //     FrameControllerManager.instance.dayGuideController.frame.dispose();
      // }
      // NotificationManager.instance.sendNotification(NotificationEvent.LOCK_TEAM_FOLLOW_TARGET, null);
    }
  }
  public get isMopup(): boolean {
    return this._isMopup;
  }
  /**
   * 消耗时间
   */
  public mopupTime: number = 0;
  /**
   * 剩余时间
   */
  public mopupRemainTime: number = 0;
  /**
   * 消耗黄金
   */
  public mopupPayGold: number = 0;
  /**
   * 累积经验
   */
  public mopupExt: number = 0;
  /**
   * 扫荡是否结束
   */
  private _mopupEnd: boolean;
  public set mopupEnd(value: boolean) {
    this._mopupEnd = value;
    this._changeObj[MopupData.MOPUP_END] = value;
  }

  public get mopupEnd(): boolean {
    return this._mopupEnd;
  }
  /**
   * 是否正常结束
   */
  public isNormalEnd: boolean = true;
  /**
   * 是否双倍效益  使用迷宫钥匙
   */
  public isDoubleProfit: number = 1;
  /**
   * 下线上线返回的物品列表
   */
  public mopupGoods: any[] = [];
  /**
   * 返回结果列表
   * type:number 			响应类型 1 完成 2 未完成
   * gold:number 			得到的金钱
   * gp:number 			得到的经验
   * campaign_id:number 	副本ID
   * time:number			剩余时间
   * template_id:array 	得到的物品模板ID
   * cIndex:number 		迷宫扫荡当前层
   * eIndex:number		迷宫扫荡结束层
   */
  private _resultInfoList: any[] = [];
  public set resultInfoList(value: any[]) {
    this._resultInfoList = value;
    this._changeObj[MopupData.MOPUP_LIST_REFRESH] = true;
  }

  public get resultInfoList(): any[] {
    return this._resultInfoList;
  }
  private _changeObj: SimpleDictionary = new SimpleDictionary();

  public beginChanges() {
    this._changeObj.clear();
  }

  show() {
    super.show();
  }

  hide() {
    this.clear();
    super.hide();
  }

  public clear() {
    Logger.xjy("[MopupData]clear");
    this.isMopup = false;
    this.campaignId = 0;
    this.mopupCount = 0;
    this.mopupLayer = 0;
    this._resultInfoList = [];

    this.mopupTime = 0;
    this.mopupRemainTime = 0;
    this.mopupPayGold = 0;
    this.mopupExt = 0;
    this.mopupEnd = false;
    this.isNormalEnd = true;
    // this.isDoubleProfit = 1 //不清理这个记录
    this.mopupGoods = [];
  }

  public commit() {
    if (this._changeObj[MopupData.MOPUP_LIST_REFRESH])
      this.dispatchEvent(MopupData.MOPUP_LIST_REFRESH);
    if (this._changeObj[MopupData.MOPUP_END])
      this.dispatchEvent(MopupData.MOPUP_END);
  }

  private get towerInfo(): TowerInfo {
    if (WorldBossHelper.checkMaze(this.campaignId)) {
      return PlayerManager.Instance.currentPlayerModel.towerInfo1;
    } else if (WorldBossHelper.checkMaze2(this.campaignId)) {
      return PlayerManager.Instance.currentPlayerModel.towerInfo2;
    }
    return PlayerManager.Instance.currentPlayerModel.towerInfo;
  }

  public get weary(): number {
    return PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
  }
}
