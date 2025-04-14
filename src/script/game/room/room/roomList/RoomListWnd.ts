/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-19 19:39:07
 * @LastEditTime: 2024-02-19 18:12:32
 * @LastEditors: jeremy.xu
 * @Description: 房间界面pvp
 */

import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { RoomSceneType, RoomType } from "../../../constant/RoomDefine";
import { RoomState } from "../../../constant/RoomState";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import RoomListItem from "./item/RoomListItem";
import RoomListData from "./RoomListData";
import StringHelper from "../../../../core/utils/StringHelper";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import { EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import FUI_RoomListPvpMemberItem from "../../../../../fui/RoomList/FUI_RoomListPvpMemberItem";
import { JobType } from "../../../constant/JobType";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
import RankStarItem from "./item/RankStarItem";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";

//@ts-expect-error: External dependencies
import RoomPlayerMsg = com.road.yishi.proto.room.RoomPlayerMsg;
import UIManager from "../../../../core/ui/UIManager";
import OpenGrades from "../../../constant/OpenGrades";

export default class RoomListWnd extends BaseWindow {
  private frame: fgui.GComponent;
  private btnSearch: UIButton;
  private btnQuickJoin: UIButton;
  private itemList: fgui.GList;
  private txtEnterCount: fgui.GLabel;
  private iTxtSearch: fgui.GTextField;
  private gSearch: fgui.GGroup;
  private searchTips: fgui.GLabel;
  private selectRoom: RoomInfo;
  public radio: fgui.Controller;

  public btnSearchOld: fgui.GButton;
  public txtEnterCountDesc: fgui.GTextField;
  public btnEnterRoom: fgui.GButton;
  public btnCreateRoom: fgui.GButton;
  public btnSearchRoom: fgui.GButton;
  public btnRefreshRoom: fgui.GButton;
  public txt1: fgui.GTextField;
  public txt2: fgui.GTextField;
  public txt3: fgui.GTextField;
  public player0: FUI_RoomListPvpMemberItem;
  public player1: FUI_RoomListPvpMemberItem;
  public player2: FUI_RoomListPvpMemberItem;
  public txtScoreTitle: fgui.GTextField;
  public txtScore: fgui.GTextField;
  public btnReward: fgui.GButton;
  public rankStarItem: RankStarItem;

  private _alertString: string = LangManager.Instance.GetTranslation(
    "pveroomlist.view.PVERoomSearchFrame.alert",
  );

  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.itemList.setVirtual();
    this.itemList.on(fgui.Events.CLICK_ITEM, this, this.__clickItem);
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.__renderListItem,
      null,
      false,
    );
    this.iTxtSearch.on(Laya.Event.FOCUS, this, this.__onContentFocusIn);
    this.iTxtSearch.on(Laya.Event.BLUR, this, this.__onContentFocusOut);
    this.searchTips.text = this._alertString;
    this.frame.getChild("title").text =
      LangManager.Instance.GetTranslation("pvp.PvPFrame.title");
    this.txt1.text = LangManager.Instance.GetTranslation(
      "answer.view.rank.name",
    );
    this.txt2.text = LangManager.Instance.GetTranslation(
      "answer.view.rank.score",
    );
    this.txt3.text = LangManager.Instance.GetTranslation(
      "PveRoomListWnd.jobTxt",
    );
    this.txtScoreTitle.text = LangManager.Instance.GetTranslation(
      "RvrBattleMapRightWnd.myScoreTxt",
    );
    this.txtEnterCountDesc.text = LangManager.Instance.GetTranslation(
      "PveSelectCampaignWnd.enterCountTxt",
    );

    this.btnSearchRoom.title = LangManager.Instance.GetTranslation(
      "pveroomlist.view.PVERoomSearchFrame.title",
    );
    this.btnCreateRoom.title = LangManager.Instance.GetTranslation(
      "PveRoomListWnd.createRoomTxt",
    );
    this.btnEnterRoom.title = LangManager.Instance.GetTranslation(
      "PveRoomListWnd.enterRoomTxt",
    );

    this.refresh();
  }

  __onContentFocusIn() {
    this.searchTips.visible = false;
  }

  __onContentFocusOut() {
    let text = this.iTxtSearch.text;
    this.searchTips.visible = StringHelper.isNullOrEmpty(text);
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
    this.itemList.off(fgui.Events.CLICK_ITEM, this, this.__clickItem);
    this.iTxtSearch.off(Laya.Event.FOCUS, this, this.__onContentFocusIn);
    this.iTxtSearch.off(Laya.Event.BLUR, this, this.__onContentFocusOut);
  }

  private __clickItem(item: RoomListItem) {
    let roomInfo = item.roomInfo;
    if (!roomInfo) {
      if (!this.selectRoom) {
        this.itemList.selectNone();
      } else {
        let preIndex = -1;
        for (let index = 0; index < this.itemList.numChildren; index++) {
          const item = this.itemList.getChildAt(index) as RoomListItem;
          if (item.roomInfo && this.selectRoom.id == item.roomInfo.id) {
            preIndex = index;
            break;
          }
        }
        if (preIndex != -1) {
          this.itemList.selectedIndex = preIndex;
        } else {
          this.itemList.selectNone();
        }
      }
      return;
    }

    if (roomInfo.roomState != RoomState.STATE_USEING) {
      MessageTipManager.Instance.show(
        RoomState.getStateNameTips(roomInfo.roomState),
      );
      this.itemList.selectNone();
    } else {
      this.selectRoom = roomInfo;
      this.refreshRoomMembers();
    }

    // if (roomInfo.roomState != RoomState.STATE_USEING) {
    //     MessageTipManager.Instance.show(RoomState.getStateNameTips(roomInfo.roomState));
    // } else {
    //     if (this.ctrl.roomSceneType == RoomSceneType.PVE) {
    //         if (roomInfo.mapTemplate && this.model.thane.grades < roomInfo.mapTemplate.MinLevel) {
    //             let str = LangManager.Instance.GetTranslation("pveroomlist.view.PVERoomItem.command01");
    //             MessageTipManager.Instance.show(str);
    //             return;
    //         }
    //         this.ctrl.sendSearchRoomInfo(RoomType.NORMAL, roomInfo.id);
    //     } else if (this.ctrl.roomSceneType == RoomSceneType.PVP) {
    //         this.ctrl.sendSearchRoomInfo(RoomType.MATCH, roomInfo.id);
    //     }
    // }
  }

  helpBtnClick() {
    let title = "";
    let content = "";
    title = LangManager.Instance.GetTranslation("public.help");
    content = LangManager.Instance.GetTranslation(
      "room.roomList.roomHelpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private __renderListItem(index: number, item: RoomListItem) {
    if (!this.model) return;
    let roomList = this.model.roomList;
    if (!roomList) return;
    item.roomInfo = roomList[index];
  }

  public refresh() {
    let len = this.model.roomList.length;
    this.itemList.numItems =
      len < RoomListData.PvePageRoomItems ? RoomListData.PvePageRoomItems : len;

    // this.txtEnterCount.text = this.model.playerInfo.JJCcount + " / " + this.model.playerInfo.JJCMaxCount;
    this.txtEnterCount.text = "";
    this.txtEnterCountDesc.text = "";

    this.rankStarItem.setInfo(this.playerInfo.segmentId);
    this.txtScore.text = this.playerInfo.mulSportScore + "";

    this.selectRoom = null;
    this.itemList.selectNone();
    this.refreshRoomMembers();
  }

  private btnQuickJoinClick() {
    this.ctrl.sendQuickJoin();
  }

  private btnSearchClick() {
    if (
      this.iTxtSearch.text == this._alertString ||
      this.iTxtSearch.text == ""
    ) {
      this.iTxtSearch.requestFocus();
      this.searchTips.visible = false;
      // MessageTipManager.Instance.show(this._alertString);
      return;
    }
    let id = Number(this.iTxtSearch.text);
    if (id > 0) {
      this.ctrl.sendSearchRoomInfo(
        this.ctrl.roomSceneType == RoomSceneType.PVE
          ? RoomType.NORMAL
          : RoomType.MATCH,
        id,
      );
    } else if (id == 0) {
      let str = LangManager.Instance.GetTranslation(
        "pveroomlist.view.PVERoomSearchFrame.command01",
      );
      MessageTipManager.Instance.show(str);
    } else {
      MessageTipManager.Instance.show(this._alertString);
    }
  }

  private refreshRoomMembers() {
    if (this.selectRoom) {
      for (let index = 0; index < 3; index++) {
        const item = this["player" + index] as FUI_RoomListPvpMemberItem;
        item.visible = false;
      }

      let cnt = 0;
      for (const key in this.selectRoom.roomPlayer) {
        if (
          Object.prototype.hasOwnProperty.call(this.selectRoom.roomPlayer, key)
        ) {
          const army = this.selectRoom.roomPlayer[key] as RoomPlayerMsg;

          const item = this["player" + cnt] as FUI_RoomListPvpMemberItem;
          if (item) {
            item.visible = true;
            item.imgCaptain.visible =
              this.selectRoom.houseOwnerId == army.playerId;
            // item.imgVip.visible = army.baseHero.vipGrade > 0;
            item.imgVip.visible = false;
            item.txtName.text = army.nickName;
            item.txtLevel.text = army.mulSportScore + "";
            item.imgIcon.icon = JobType.getJobIcon(army.job);
          }
          cnt++;
        }
      }
    } else {
      for (let index = 0; index < 3; index++) {
        const item = this["player" + index] as FUI_RoomListPvpMemberItem;
        item.visible = false;
      }
    }
  }

  btnCreateRoomClick() {
    if (this.thane.grades < OpenGrades.CHALLENGE) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("pvp.view.PvPMultiView.command01"),
      );
      return;
    }
    let tips: string = WorldBossHelper.getCampaignTips();
    if (tips != "") {
      MessageTipManager.Instance.show(tips);
      return;
    }
    this.ctrl.sendCreateRoom();
  }

  private btnRewardClick() {
    FrameCtrlManager.Instance.open(EmWindow.PvpRewardsWnd);
  }

  private btnSearchRoomClick() {
    FrameCtrlManager.Instance.open(EmWindow.FindRoom, {
      roomSceneType: RoomType.MATCH,
    });
  }

  private btnEnterRoomClick() {
    if (this.selectRoom) {
      let id = Number(this.selectRoom.id);
      if (id > 0) {
        this.ctrl.sendSearchRoomInfo(RoomType.MATCH, id);
      } else {
        let str = LangManager.Instance.GetTranslation(
          "pveroomlist.view.PVERoomSearchFrame.command01",
        );
        MessageTipManager.Instance.show(str);
      }
    } else {
      let str = LangManager.Instance.GetTranslation(
        "pveroomlist.view.PVERoomSearchFrame.selectRoom",
      );
      MessageTipManager.Instance.show(str);
    }
  }

  private btnRefreshRoomClick() {
    this.ctrl.requestRoomInfo();
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }
}
