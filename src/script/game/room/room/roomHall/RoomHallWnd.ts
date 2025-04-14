/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-20 11:10:46
 * @LastEditTime: 2024-01-04 15:10:12
 * @LastEditors: jeremy.xu
 * @Description: 房间内视图 PVE、PVP 【对应v2.46 RoomView、RoomRightView、PVPRoomView、PVPRoomRightView】】
 */

import Resolution from "../../../../core/comps/Resolution";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import StringHelper from "../../../../core/utils/StringHelper";
import Utils from "../../../../core/utils/Utils";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import {
  RoomEvent,
  RoomPlayerItemType,
  RoomSceneType,
} from "../../../constant/RoomDefine";
import { UIAlignType } from "../../../constant/UIAlignType";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import ConfigInfoManager from "../../../manager/ConfigInfoManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomManager } from "../../../manager/RoomManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import RoomPlayerItem from "../../../module/baseRoom/RoomPlayerItem";
import HomeWnd from "../../../module/home/HomeWnd";
import MainToolBar from "../../../module/home/MainToolBar";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
import RoomHallRightPve from "../right/RoomHallRightPve";
import RoomHallRightPvp from "../right/RoomHallRightPvp";

export default class RoomHallWnd extends BaseWindow {
  public cPvp: fgui.Controller;
  public cCross: fgui.Controller;
  private playerList: fgui.GList;
  private playerListPvp: fgui.GList;

  private comRightPve: fgui.GComponent;
  private comRightPvp: fgui.GComponent;
  private roomRightPvp: RoomHallRightPvp;
  private roomRightPve: RoomHallRightPve;

  private _playerList: RoomPlayerItem[] = [];
  private _playerListPos: SimpleDictionary = new SimpleDictionary();

  //跨服撮合
  public corssActiveTimeTxt: fgui.GRichTextField;
  public corssActiveDescTxt: fgui.GRichTextField;
  public corssLeftTmeTxt: fgui.GRichTextField;
  public matchTimeGroup: fgui.GGroup;
  private _timeCount: number = 0;
  /** 用于计算队伍的平均积分 */
  private _points: number = 0;
  private playerCount: number = 0; //实际人数

  constructor() {
    super();
    this.resizeContent = true;
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.initView();
    this.initPlayerItemList();
    this.refreshRoomInfo();
    this.ctrl.sendOwnerSelCampaign();
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATE_CROSS_PVE_STATUS,
      this.__updateRoomInfoHanlder,
      this,
    );
    NotificationManager.Instance.addEventListener(
      RoomEvent.HIDE_PVP_ROOM_LEFT_TIME,
      this.stopTime,
      this,
    );
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_CROSS_PVE_STATUS,
      this.__updateRoomInfoHanlder,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      RoomEvent.HIDE_PVP_ROOM_LEFT_TIME,
      this.stopTime,
      this,
    );
  }

  private __updateRoomInfoHanlder() {
    this.cCross.selectedIndex = 0;
    // if (this.ctrl.openCrossPve2) {//开放了跨服多人本
    //     this.cCross.selectedIndex = 1;
    // }
  }

  private initView() {
    this.cPvp = this.getController("cPvp");
    this.cCross = this.getController("cCross");
    this.roomRightPve = new RoomHallRightPve(this.comRightPve);
    this.roomRightPvp = new RoomHallRightPvp(this.comRightPvp);
    this.cPvp.selectedIndex =
      this.ctrl.roomSceneType == RoomSceneType.PVP ? 1 : 0;
    this.initCross();

    Resolution.addWidget(this.comRightPve.displayObject, UIAlignType.RIGHT);
    Resolution.addWidget(this.comRightPvp.displayObject, UIAlignType.RIGHT);
    if (Utils.isWxMiniGame()) {
      this.comRightPve.displayObject.scaleX = 0.8;
      this.comRightPve.displayObject.scaleY = 0.8;
      this.comRightPve.displayObject.y = 40;
      this.comRightPvp.displayObject.scaleX = 0.8;
      this.comRightPvp.displayObject.scaleY = 0.8;
      this.comRightPvp.displayObject.y = 40;
    }
  }

  // 刷新房间信息
  public refreshRoomInfo() {
    if (this.ctrl.roomSceneType == RoomSceneType.PVP) {
      this.roomRightPvp.refreshRoomInfo();
    } else if (this.ctrl.roomSceneType == RoomSceneType.PVE) {
      this.roomRightPve.refreshRoomInfo();
    }
  }

  public refreshPvPRoomInfo() {
    this.roomRightPve.refreshPvPRoomInfo();
  }

  public refreshEnterCount() {
    if (this.ctrl.roomSceneType == RoomSceneType.PVP) {
      // this.roomRightPvp.refreshEnterCount();
    } else if (this.ctrl.roomSceneType == RoomSceneType.PVE) {
      this.roomRightPve.refreshEnterCount();
    }
  }

  public autoSelectIncome() {
    if (this.ctrl.roomSceneType == RoomSceneType.PVE) {
      this.roomRightPve.autoSelectIncome();
    }
  }

  private initPlayerItemList() {
    if (!this.ctrl) return;
    let itemCount = this.ctrl.playerItemCnt;
    this._points = 0;
    for (let i: number = 0; i < itemCount; i++) {
      let item;
      switch (this.ctrl.roomSceneType) {
        case RoomSceneType.PVE:
          item = this.playerList.addItemFromPool() as RoomPlayerItem;
          item.type = RoomPlayerItemType.PveHall;
          break;
        case RoomSceneType.PVP:
          item = this.playerListPvp.addItemFromPool() as RoomPlayerItem;
          item.type = RoomPlayerItemType.PvpHall;
          break;
      }
      item.name = "item" + i;
      item.addBtnEvent();

      item.displayObject.zOrder = itemCount - i;
      if (itemCount == 4) {
        if (i == 1 || i == 2) {
          item.y += -45;
        }
      } else if (itemCount == 3) {
        if (i == 1) {
          item.y += -45;
        }
      }

      if (this.roomInfo) {
        item.placeState = this.roomInfo.placesState[i];
        item.index = i;
        this._playerList.push(item);
        this._playerListPos.add(item, {
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          target: item,
        });

        let info = this.roomInfo.getPlayerByPos(i);
        item.info = info;
        if (info) {
          this.playerCount++;
          this._points += info.baseHero.mulSportScore;
        }
      }
    }
  }

  private initCross() {
    let timeArray: Array<string> =
      ConfigInfoManager.Instance.getMultiMatchTime();
    let timeStr: string;
    if (timeArray) {
      for (let i: number = 0; i < timeArray.length; i++) {
        if (StringHelper.isNullOrEmpty(timeStr)) {
          timeStr = timeArray[i].replace(",", "-");
        } else {
          timeStr += "<br>" + timeArray[i].replace(",", "-");
        }
      }
    }
    this.corssActiveDescTxt.text = LangManager.Instance.GetTranslation(
      "roomHallwnd.cross.corssActiveTimeTxt",
    );
    this.corssActiveTimeTxt.text = timeStr;

    this.__updateRoomInfoHanlder();
  }

  public startTime() {
    this.stopTime();
    this.matchTimeGroup.visible = true;
    this._timeCount = 0;
    this.corssLeftTmeTxt.text = LangManager.Instance.GetTranslation(
      "roomHallwnd.cross.corssLeftTmeTxt",
      this._timeCount,
    );
    Laya.timer.loop(1000, this, this.updateCorssLeftTmeTxt);
  }

  public stopTime() {
    Laya.timer.clear(this, this.updateCorssLeftTmeTxt);
    this.matchTimeGroup.visible = false;
  }

  private updateCorssLeftTmeTxt() {
    this._timeCount++;
    this.corssLeftTmeTxt.text = LangManager.Instance.GetTranslation(
      "roomHallwnd.cross.corssLeftTmeTxt",
      this._timeCount,
    );
    //1900积分  匹配时长超过 60秒后不会出现提示
    // if (this._timeCount >= 60 && this.checkCancelMatch()) {
    //     this.ctrl.senPlayerCancel()
    //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('match.timeover'));
    // }
  }

  public showFigure(info: CampaignArmy) {
    let player = this._playerList[info.pos] as RoomPlayerItem;
    player.info = info;
    this.playerCount++;
    this._points += info.baseHero.mulSportScore;
  }

  public hideFigure(info: CampaignArmy) {
    let player = this._playerList[info.pos] as RoomPlayerItem;
    this._points -= player.info.baseHero.mulSportScore;
    player.info = null;
    this.playerCount--;
  }

  public checkCancelMatch() {
    let b = false;
    for (let index = 0; index < this._playerList.length; index++) {
      const player = this._playerList[index];
      if (
        player &&
        player.info &&
        player.info.baseHero &&
        player.info.baseHero.mulSportScore >= 1900
      ) {
        b = true;
        break;
      }
    }
    return b;
  }

  public __houseOwnerChangeHandler() {
    this.setMainTooBalStateReady();
    this.ctrl.sendOwnerSelCampaign();
    if (this.isPve) {
      this.roomRightPve.__houseOwnerChangeHandler();
    }
    this._playerList.forEach((player: RoomPlayerItem) => {
      player.updateOwnerState();
    });
  }

  public __roomMapChangeHandler() {
    this.setMainTooBalStateReady();
  }

  private setMainTooBalStateReady() {
    HomeWnd.Instance.getMainToolBar().switchToolsBarState(
      this.mainToolBarReadyState,
    );
  }

  public __placeStateChangeHandler() {
    for (let i = 0; i < this.ctrl.playerItemCnt; i++) {
      let player = this._playerList[i] as RoomPlayerItem;
      player.placeState = this.roomInfo.placesState[i];
    }
  }

  private get mainToolBarReadyState() {
    return this.ctrl.roomSceneType == RoomSceneType.PVE
      ? MainToolBar.PVE_ROOM_READY
      : MainToolBar.PVP_ROOM_READY;
  }

  public get isPvp(): boolean {
    return this.ctrl.roomSceneType == RoomSceneType.PVP;
  }

  public get isPve(): boolean {
    return this.ctrl.roomSceneType == RoomSceneType.PVE;
  }

  private get roomInfo(): RoomInfo {
    return RoomManager.Instance.roomInfo;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  dispose() {
    for (let i = 0; i < this.ctrl.playerItemCnt; i++) {
      let player = this._playerList[i] as RoomPlayerItem;
      if (player) {
        player.dispose();
      }
    }
    this.stopTime();
    this._playerListPos.clear();
    this.comRightPve.dispose();
    this.comRightPvp.dispose();
    super.dispose();
  }
}
