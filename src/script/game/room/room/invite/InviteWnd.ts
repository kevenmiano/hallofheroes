/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-19 19:39:07
 * @LastEditTime: 2021-06-28 12:30:33
 * @LastEditors: jeremy.xu
 * @Description:房间内的邀请界面  【对应v2.46 RoomInviteFrame】
 */

import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Tabbar from "../../../../core/ui/Tabbar";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import GTabIndex from "../../../constant/GTabIndex";
import RelationType from "../../../constant/RelationType";
import { RoomInviteType } from "../../../constant/RoomDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import FreedomTeamManager from "../../../manager/FreedomTeamManager";
import { FriendManager } from "../../../manager/FriendManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomManager } from "../../../manager/RoomManager";
import InviteData from "./InviteData";
import InviteItem from "./item/InviteItem";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { YTextInput } from "../../../module/common/YTextInput";
import OpenGrades from "../../../constant/OpenGrades";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ChatEvent } from "../../../constant/event/NotificationEvent";

export default class InviteWnd extends BaseWindow {
  private _tabbar: Tabbar;
  private itemList: fgui.GList;
  private iTxtSearch: YTextInput;
  private _searchTempList: any[] = [];
  private type: number = 0;
  private curSelectItem: any;
  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.setCenter();
    this._tabbar = new Tabbar();
    let frameData = this.frameData;
    if (frameData && frameData.type == RoomInviteType.SpaceInvite) {
      this.type = RoomInviteType.SpaceInvite;
    }
    this._tabbar.init(
      {},
      [this["tabMainFriend"], this["tabMainGuild"], this["tabMainHall"]],
      undefined,
      this.__selectTabCallback.bind(this)
    );
    this._tabbar.interruptCallback = this.__interruptCallback.bind(this);

    this.itemList.on(fgui.Events.CLICK_ITEM, this, this.__clickItem);
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.__renderListItem,
      null,
      false
    );

    if (InviteData.playerInfo.consortiaID > 0) {
      this.changeIndex(GTabIndex.Invite_Guild, false, false);
    } else {
      this.changeIndex(GTabIndex.Invite_Friend, false, false);
    }

    this.iTxtSearch.fontSize = 22;
    this.iTxtSearch.singleLine = true;
    this.iTxtSearch.stroke = 1;
    this.iTxtSearch.strokeColor = "#000000";
    this.iTxtSearch.promptText = LangManager.Instance.GetTranslation(
      "InviteWnd.iTxtSearch.text"
    );
    this.iTxtSearch.on(Laya.Event.INPUT, this, this.__onTxtSearchChange);
    ConsortiaManager.Instance.getConsortiaUserInfos();
    NotificationManager.Instance.addEventListener(
      ChatEvent.BLACKLIST,
      this.onRecvBlackList,
      this
    );
  }

  /**关闭界面 */
  OnHideWind() {
    this.itemList.off(fgui.Events.CLICK_ITEM, this, this.__clickItem);
    this.iTxtSearch.off(Laya.Event.INPUT, this, this.__onTxtSearchChange);
    NotificationManager.Instance.removeEventListener(
      ChatEvent.BLACKLIST,
      this.onRecvBlackList,
      this
    );
    super.OnHideWind();
  }

  private __interruptCallback(changeToTabIndex: number): boolean {
    switch (changeToTabIndex) {
      case InviteData.TabIndex.Guild:
        if (InviteData.playerInfo.consortiaID == 0) {
          let str: string = LangManager.Instance.GetTranslation(
            "room.view.invite.RoomInviteFrame.command01"
          );
          MessageTipManager.Instance.show(str);
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  private __selectTabCallback(index: number, lastTabIndex: number) {
    this.iTxtSearch.text = "";
    let list: Array<any>;
    switch (index) {
      case InviteData.TabIndex.Friend:
        // this.refreshList(FriendManager.getInstance().friendList.getList());
        list = this.filterData(
          FriendManager.getInstance().friendList.getList()
        );
        this.refreshList(list);
        break;
      case InviteData.TabIndex.Guild:
        // this.refreshList(ConsortiaManager.Instance.model.consortiaMemberList.getList());
        list = this.filterData(
          ConsortiaManager.Instance.model.consortiaMemberList.getList()
        );
        this.refreshList(list);
        break;
      case InviteData.TabIndex.Hall:
        if (this.type == RoomInviteType.SpaceInvite) {
          this.refreshList(this.playerList.getList());
        } else {
          this.ctrl.sendRefreshInviteHall();
        }
        break;
    }
  }

  private filterData(sourArr: Array<any>): Array<any> {
    let list: Array<any> = [];
    if (FreedomTeamManager.Instance.model == null) {
      //自己没有队伍
      return sourArr;
    } else {
      if (sourArr) {
        let len: number = sourArr.length;
        for (let i: number = 0; i < len; i++) {
          let c: BaseArmy = sourArr[i];
          let baseArmy: BaseArmy =
            FreedomTeamManager.Instance.model.getMemberByUserId(c.userId);
          if (baseArmy == null) {
            list.push(c);
          }
        }
      }
    }
    return list;
  }

  public changeIndex(
    index: number,
    bConvert: boolean = false,
    bSwitchSound: boolean = true
  ) {
    if (this._tabbar) {
      this._tabbar.changeIndex(index, bConvert, bSwitchSound);
    }
  }

  private onRecvBlackList(result: boolean) {
    if (result) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat.notfriend02")
      );
      return;
    } else {
      this.sendInivte();
    }
  }

  private __clickItem(item: InviteItem) {
    this.curSelectItem = item;
    let info = item.info;
    info.invited = true;
    if (!item.btnInvite.enabled) return;
    //请求查询是否是对方的黑名单
    FriendManager.getInstance().reqBlackList(info.userId);
    return;
  }

  private sendInivte() {
    let info = this.curSelectItem.info;
    let roomInfo = RoomManager.Instance.roomInfo;
    if (roomInfo) {
      let str = LangManager.Instance.GetTranslation(
        "room.view.invite.InviteItem.command01"
      );
      // if (roomInfo.selectedMapTemplate && roomInfo.selectedMapTemplate.MinLevel > info.grades) {
      //     MessageTipManager.Instance.show(str);
      //     return;
      // }
      if (roomInfo.mapTemplate && roomInfo.mapTemplate.MinLevel > info.grades) {
        MessageTipManager.Instance.show(str);
        return;
      }
    }
    if (this.type == RoomInviteType.SpaceInvite) {
      FreedomTeamManager.Instance.inviteMember(info.userId);
    } else {
      if (roomInfo && roomInfo.roomType == 1) {
        if (info.grades < OpenGrades.CHALLENGE) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "room.view.invite.InviteItem.command01"
            )
          );
          return;
        }
      }
      this.ctrl.sendRoomInvite(info.userId);
    }
    this.curSelectItem.btnInvite.enabled = false;
  }

  private __renderListItem(index: number, item: InviteItem) {
    let cacheList = this.isSearching
      ? this._searchTempList
      : this.model.cacheList;
    if (cacheList.length == 0) return;
    if (!cacheList[index]) return;
    item.info = cacheList[index];
  }

  private __onTxtSearchChange(evt: Event) {
    if (this.isSearching) {
      this._searchTempList = [];
      this.model.cacheList.forEach((info: ThaneInfo) => {
        if (info.nickName.indexOf(this.iTxtSearch.text) >= 0) {
          if (this._searchTempList.length < 5) {
            this._searchTempList.push(info);
          }
        }
      });
      this.itemList.numItems = this._searchTempList.length;
      // if(this._searchTempList.length<1){
      //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("invite.search.friend.empty"));
      // }
    } else {
      this.itemList.numItems = this.model.cacheList.length;
    }
  }

  private refreshList(list: any[]) {
    this.refreshListView(list);
  }

  private refreshListView(list: any[], resetFlag: boolean = true) {
    this.model.cacheList = [];

    list.sort((info1: ThaneInfo, info2: ThaneInfo) => {
      return info2.grades - info1.grades;
    });
    for (let index = 0; index < list.length; index++) {
      const info: ThaneInfo = list[index];
      if (resetFlag) {
        info.invited = false;
      }
      if (
        info.relation != RelationType.BLACKLIST &&
        info.isOnline &&
        info.userId != InviteData.thane.userId
      ) {
        this.model.cacheList.push(info);
      }
    }

    this.itemList.numItems = this.model.cacheList.length;
  }

  private get isSearching() {
    return this.iTxtSearch.text != "";
  }

  public get curTabIndex(): number {
    return this._tabbar.curTabIndex;
  }

  public get playerList(): SimpleDictionary {
    return PlayerManager.Instance.watingList;
  }
}
