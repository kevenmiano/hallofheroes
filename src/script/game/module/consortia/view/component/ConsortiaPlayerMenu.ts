//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-26 16:39:32
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-12-02 11:26:55
 * @Description: 成员操作
 */

import LangManager from "../../../../../core/lang/LangManager";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../../core/ui/UIManager";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import {
  FriendUpdateEvent,
  RequestInfoEvent,
} from "../../../../constant/event/NotificationEvent";
import RelationType from "../../../../constant/RelationType";
import { EmWindow } from "../../../../constant/UIDefine";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { ConsortiaSocketOutManager } from "../../../../manager/ConsortiaSocketOutManager";
import FreedomTeamManager from "../../../../manager/FreedomTeamManager";
import { FriendManager } from "../../../../manager/FriendManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { PlayerInfoManager } from "../../../../manager/PlayerInfoManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import { GlobalConfig } from "../../../../constant/GlobalConfig";
import { ConsortiaDutyLevel } from "../../data/ConsortiaDutyLevel";
import FriendItemCellInfo from "../../../../datas/FriendItemCellInfo";
import IMManager from "../../../../manager/IMManager";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import Logger from "../../../../../core/logger/Logger";
import { ConsortiaDutyInfo } from "../../data/ConsortiaDutyInfo";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { StageReferance } from "../../../../roadComponent/pickgliss/toplevel/StageReferance";

export default class ConsortiaPlayerMenu extends BaseWindow {
  private _contorller: ConsortiaControler;
  private _data: ConsortiaModel;

  private _itemUserID: number = 0;
  private _itemName: string = "";
  private _selfThane: ThaneInfo;
  private _itemThane: ThaneInfo;
  private _serverName: string;
  private _contributeStr: string;
  private _jianseStr: string;
  private _isRobot: boolean = false;
  private _point: Laya.Point = null;
  private list: fgui.GList;
  public closeRights: boolean;

  private fireBtn: fgui.GComponent;
  private demotionBtn: fgui.GComponent;
  private promotionBtn: fgui.GComponent;
  private friendBtn: fgui.GComponent;
  public nameTxt: fgui.GTextField;
  public descTxt: fgui.GTextField;
  public descTxt2: fgui.GTextField;
  public contributeTxt: fgui.GTextField;
  public contributeTxt2: fgui.GTextField;

  private btnTextKeys = [
    "MESSAGE",
    "TEAMINVITE",
    "ADDFRI",
    "DEMOTION",
    "PROMOTION",
    "KICKOUT",
  ];
  private btnTextStrs = {
    MESSAGE: LangManager.Instance.GetTranslation("yishi.view.PlayerMenu.info"), //查看信息
    TEAMINVITE: LangManager.Instance.GetTranslation(
      "yishi.view.PlayerMenu.invite",
    ), //邀请组队
    ADDFRI: LangManager.Instance.GetTranslation(
      "yishi.view.PlayerMenu.addFriend",
    ), //添加好友
    DELFRI: LangManager.Instance.GetTranslation(
      "yishi.view.PlayerMenu.delFriend",
    ), //删除好友
    PROMOTION: LangManager.Instance.GetTranslation(
      "yishi.view.PlayerMenu.demotion",
    ),
    DEMOTION: LangManager.Instance.GetTranslation(
      "yishi.view.PlayerMenu.promotion",
    ),
    KICKOUT: LangManager.Instance.GetTranslation(
      "yishi.view.PlayerMenu.kickOutConsortia",
    ),
  };

  public static Show(
    selfThane: ThaneInfo,
    itemThane: ThaneInfo,
    point: Laya.Point,
    contributeStr: string,
    jianSeStr: string,
  ) {
    let obj = {
      selfThane: selfThane,
      itemThane: itemThane,
      point: point,
      contributeStr: contributeStr,
      jianSeStr: jianSeStr,
    };
    if (!UIManager.Instance.isShowing(EmWindow.ConsortiaPlayerMenu)) {
      UIManager.Instance.ShowWind(EmWindow.ConsortiaPlayerMenu, obj);
    }
  }

  public static Hide() {
    if (UIManager.Instance.isShowing(EmWindow.ConsortiaPlayerMenu)) {
      UIManager.Instance.HideWind(EmWindow.ConsortiaPlayerMenu);
    }
  }

  public OnInitWind() {
    super.OnInitWind();
    this.list.on(fairygui.Events.CLICK_ITEM, this, this.__clickItem);
    for (let index = 0; index < this.list.numChildren; index++) {
      const element = this.list.getChildAt(index).asCom;
      let key: string = this.btnTextKeys[index];
      let data = {
        index: index,
        text: this.btnTextStrs[key],
      };
      element.data = data;
      element.getChild("btn").text = data.text;
    }

    this.fireBtn = this.list.getChildAt(5).asCom;
    this.demotionBtn = this.list.getChildAt(4).asCom;
    this.promotionBtn = this.list.getChildAt(3).asCom;
    this.friendBtn = this.list.getChildAt(2).asCom;

    this.promotionBtn.enabled = false;
    this.demotionBtn.enabled = false;
    this.fireBtn.enabled = false;
  }

  OnShowWind() {
    super.OnShowWind();
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._data = this._contorller.model;

    this._selfThane = this.params.selfThane;
    this._itemThane = this.params.itemThane;
    this._itemName = this._itemThane.nickName;
    this._contributeStr = this.params.contributeStr;
    this._jianseStr = this.params.jianSeStr;
    this._itemUserID = this._itemThane.userId;
    this._isRobot = this.params.isRobot;
    this._point = this.params.point;

    if (!this._point) {
      this._point = new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY);
    }
    this.contentPane.x = this._point.x;
    this.contentPane.y = this._point.y;
    if (this.contentPane.y < 0) this.contentPane.y = 0;
    if (
      this.contentPane.y + this.contentPane.height >
      StageReferance.stageHeight
    ) {
      this.contentPane.y = StageReferance.stageHeight - this.contentPane.height;
    }
    this.list.getChildAt(1).enabled = this._itemThane.isOnline;
    this.addEvent();
    this.setBtnState();
    this.nameTxt.text = this._itemName;
    this.descTxt.text = LangManager.Instance.GetTranslation(
      "ConsortiaPlayerMenu.descTxt",
    );
    this.descTxt2.text = LangManager.Instance.GetTranslation(
      "ConsortiaPlayerMenu.descTxt2",
    );
    this.contributeTxt.text = this._contributeStr;
    this.contributeTxt2.text = this._jianseStr;
    //请求查询是否是对方的黑名单
    FriendManager.getInstance().reqBlackList(this._itemUserID);
  }

  private addEvent() {
    this._itemThane.addEventListener(
      PlayerEvent.CONSORTIA_DUTY_CHANGE,
      this.__onDutyUpdata,
      this,
    );
    FriendManager.getInstance().addEventListener(
      FriendUpdateEvent.FRIEND_UPDATE,
      this.__onFriendInfoUpdata,
      this,
    );
  }

  private delEvent() {
    this._itemThane.removeEventListener(
      PlayerEvent.CONSORTIA_DUTY_CHANGE,
      this.__onDutyUpdata,
      this,
    );
    FriendManager.getInstance().removeEventListener(
      FriendUpdateEvent.FRIEND_UPDATE,
      this.__onFriendInfoUpdata,
      this,
    );
  }

  private __onDutyUpdata() {
    // if (this._itemThane.dutyId == ConsortiaDutyLevel.NORMAL) {
    //     this.demotionBtn.enabled = false;
    // } else if (this._itemThane.dutyId == ConsortiaDutyLevel.VICE_CHAIRMAN) {
    //     this.promotionBtn.enabled = false;
    // }
  }

  private __onFriendInfoUpdata() {
    var fInfo: FriendItemCellInfo = IMManager.Instance.getFriendInfo(
      this._itemUserID,
    );
    if (fInfo) {
      switch (fInfo.relation) {
        case RelationType.FRIEND:
          this.friendBtn.getChild("btn").text = this.btnTextStrs.DELFRI;
          break;
        case RelationType.STRANGER:
        case RelationType.BLACKLIST:
          this.friendBtn.getChild("btn").text = this.btnTextStrs.ADDFRI;
          break;
      }
    }
  }

  private setBtnState() {
    this.__onFriendInfoUpdata();

    var flag: boolean = this._contorller.getRightsByIndex(
      ConsortiaDutyInfo.CHANGEDUTY,
    );
    if (flag && !this.closeRights) {
      if (
        this._selfThane.dutyId &&
        this._selfThane.dutyId < this._itemThane.dutyId &&
        this._selfThane.dutyId != ConsortiaDutyLevel.ELITE
      ) {
        if (
          this._itemThane.dutyId > ConsortiaDutyLevel.VICE_CHAIRMAN &&
          this._selfThane.dutyId < this._itemThane.dutyId - 1 &&
          this._selfThane.dutyId != ConsortiaDutyLevel.ELITE
        )
          this.promotionBtn.enabled = true;
        if (this._itemThane.dutyId < ConsortiaDutyLevel.ELITE)
          this.demotionBtn.enabled = true;
      } else {
        this.promotionBtn.enabled = false;
        this.demotionBtn.enabled = false;
      }
    }
    flag = this._contorller.getRightsByIndex(ConsortiaDutyInfo.KICKMEMBER);
    if (!flag) {
      this.promotionBtn.visible = false;
      this.demotionBtn.visible = false;
    }
    if (flag && !this.closeRights) {
      if (
        this._selfThane.dutyId &&
        this._selfThane.dutyId < this._itemThane.dutyId &&
        this._selfThane.dutyId != ConsortiaDutyLevel.NORMAL
      )
        this.fireBtn.enabled = true;
      else this.fireBtn.enabled = false;
    } else {
      this.fireBtn.visible = false;
    }

    // switch (this.selfJobTitle) {
    //     case ConsortiaDutyLevel.CHAIRMAN:
    //         break;
    //     case ConsortiaDutyLevel.VICE_CHAIRMAN:
    //         this.promotionBtn.enabled = this.compareDuty();
    //         break;
    //     case ConsortiaDutyLevel.OFFICIAL:
    //         this.promotionBtn.enabled = false;
    //         this.demotionBtn.enabled = false;
    //         this.promotionBtn.enabled = this.compareDuty();
    //         break;
    //     case ConsortiaDutyLevel.NORMAL:
    //         this.promotionBtn.enabled = false;
    //         this.demotionBtn.enabled = false;
    //         this.promotionBtn.enabled = false;
    //         break;
    // }
  }

  private __clickItem(targetItem) {
    let index = this.list.getChildIndex(targetItem);
    switch (index) {
      case 0: //查看资料  暂时没有
        this.__messageHandler();
        break;
      case 1: //邀请组队
        if (FriendManager.getInstance().isInBlackList) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("chat.notfriend02"),
          );
          return;
        }
        this.__teamInviteHandler();
        break;
      case 2: //好友操作
        this.__friendHandler();
        break;
      case 3: //升职
        this.__promotionHandler();
        break;
      case 4: //降职
        this.__demotionHandler();
        break;
      case 5: //踢出公会
        this.__kickOutHandler();
        break;
    }
  }

  private __messageHandler() {
    PlayerManager.Instance.addEventListener(
      RequestInfoEvent.REQUEST_SIMPLEINFO,
      this.__recentContactHandler,
      this,
    );
    if (
      this._serverName &&
      this._serverName !=
        PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName
    ) {
      PlayerInfoManager.Instance.sendRequestSimpleInfoCross(
        this._itemUserID,
        this._serverName,
      );
    } else {
      PlayerInfoManager.Instance.sendRequestSimpleInfo(this._itemUserID);
    }
  }

  private __teamInviteHandler() {
    FreedomTeamManager.Instance.inviteMember(this._itemUserID);
    ConsortiaPlayerMenu.Hide();
  }

  private __friendHandler() {
    var str: string;
    if (
      ArmyManager.Instance.thane.grades < GlobalConfig.Communication.AddFriend
    ) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatItemMenu.command01",
      );
      MessageTipManager.Instance.show(str);
      ConsortiaPlayerMenu.Hide();
      return;
    }
    if (this._isRobot) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatItemMenu.RobotTips01",
      );
      MessageTipManager.Instance.show(str);
      ConsortiaPlayerMenu.Hide();
      return;
    }

    var fInfo: FriendItemCellInfo = IMManager.Instance.getFriendInfo(
      this._itemUserID,
    );
    if (fInfo) {
      switch (fInfo.relation) {
        case RelationType.FRIEND:
          Logger.xjy("[ConsortiaPlayerMenu]删除好友", this._itemUserID);
          FriendManager.getInstance().sendRemoveFriendRequest(this._itemUserID);
          ConsortiaPlayerMenu.Hide();
          break;
        case RelationType.STRANGER:
        case RelationType.BLACKLIST:
          Logger.xjy("[ConsortiaPlayerMenu]添加好友", this._itemName);
          FriendManager.getInstance().sendAddFriendRequest(
            this._itemName,
            RelationType.FRIEND,
          );
          ConsortiaPlayerMenu.Hide();
          break;
      }
    } else {
      Logger.xjy("[ConsortiaPlayerMenu]添加好友2", this._itemName);
      FriendManager.getInstance().sendAddFriendRequest(
        this._itemName,
        RelationType.FRIEND,
      );
      ConsortiaPlayerMenu.Hide();
    }
  }

  private __promotionHandler() {
    if (this._itemThane.dutyId == ConsortiaDutyLevel.NORMAL)
      this._contorller.changeDuty(this._itemThane.dutyId - 2, this._itemUserID);
    else
      this._contorller.changeDuty(this._itemThane.dutyId - 1, this._itemUserID);

    ConsortiaPlayerMenu.Hide();
  }

  private __demotionHandler() {
    if (this._itemThane.dutyId == ConsortiaDutyLevel.OFFICIAL)
      this._contorller.changeDuty(this._itemThane.dutyId + 2, this._itemUserID);
    else
      this._contorller.changeDuty(this._itemThane.dutyId + 1, this._itemUserID);

    ConsortiaPlayerMenu.Hide();
  }

  private __kickOutHandler() {
    var content = LangManager.Instance.GetTranslation(
      "consortia.view.myConsortia.ConsortiaPlayerMenu.content",
    );
    SimpleAlertHelper.Instance.Show(
      null,
      null,
      null,
      content,
      null,
      null,
      (b: boolean, check: boolean, data: any) => {
        if (b) {
          ConsortiaPlayerMenu.Hide();
          ConsortiaSocketOutManager.fireMember(this._itemUserID);
        }
      },
    );
  }

  private __recentContactHandler(data1: number, data2: ThaneInfo) {
    PlayerManager.Instance.removeEventListener(
      RequestInfoEvent.REQUEST_SIMPLEINFO,
      this.__recentContactHandler,
      this,
    );
    var thane: ThaneInfo = data2;
    thane.isRobot = this._isRobot;
    if (!(thane && thane.nickName)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "ChatItemMenu.cannotSearchPlayerInfo",
        ),
      );
      return;
    }
    if (data1 == 10000) {
      PlayerInfoManager.Instance.show(thane, 10000);
    } else {
      PlayerInfoManager.Instance.show(thane);
    }
    ConsortiaPlayerMenu.Hide();
  }

  /**
   * 判断对方权限比自己小
   */
  private compareDuty() {
    if (!this._selfThane && !this._itemThane) return false;
    return this._selfThane.dutyId < this._itemThane.dutyId;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  OnHideWind() {
    super.OnHideWind();
    this.delEvent();
    this.list.itemRenderer = null;
    this.list.numItems = 0;
  }
}
