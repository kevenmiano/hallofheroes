// TODO FIX
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-23 11:08:20
 * @LastEditTime: 2024-01-23 15:04:50
 * @LastEditors: jeremy.xu
 * @Description: 被邀请界面 【对应v2.46 InviteFrame】
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_campaignData } from "../../../config/t_s_campaign";
import { ConfigType } from "../../../constant/ConfigDefine";
import ItemID from "../../../constant/ItemID";
import { RoomType } from "../../../constant/RoomDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { KingTowerManager } from "../../../manager/KingTowerManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomListSocketOutManager } from "../../../manager/RoomListSocketOutManager";
import { SharedManager } from "../../../manager/SharedManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { TimerEvent, TimerTicker } from "../../../utils/TimerTicker";
import RoomHallCtrl from "../roomHall/RoomHallCtrl";
import InviteData from "./InviteData";

import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
import { CampaignManager } from "../../../manager/CampaignManager";
import StringHelper from "../../../../core/utils/StringHelper";
import { CampaignMapModel } from "../../../mvc/model/CampaignMapModel";
import UIButton from "../../../../core/ui/UIButton";
import { RoomManager } from "../../../manager/RoomManager";
import InviteTipManager, {
  EmInviteTipType,
} from "../../../manager/InviteTipManager";
import { ArmyManager } from "../../../manager/ArmyManager";

export default class BeingInviteWnd extends BaseWindow {
  public roomId: number;
  public roomType: number;
  public roomPwd: string;
  public tempId: number;
  public playerId: number;
  public position: number;

  private rTxtContent: fgui.GRichTextField;
  private txtCountDown: fgui.GLabel;
  private txtNotAcceptInvite: fgui.GLabel;
  private btnNotAcceptInvite: UIButton;
  private notAcceptTip: fgui.Controller;

  private _autoExitTimer: TimerTicker;
  private _showCancelBtnIncomeTip: boolean = true; // 打开界面只是提示一次

  private _campaign: t_s_campaignData;
  private _curCount: number;
  private _maxCount: number;
  private _content: string;
  private _quick: Boolean = false;
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

    this.notAcceptTip = this.getController("notAcceptTip");
    let frameData = this.frameData;
    Logger.xjy("BeingInviteWnd OnShowWind", frameData);
    if (frameData) {
      if (frameData.roomId) {
        this.roomId = frameData.roomId;
      }
      if (frameData.roomType || frameData.roomType == 0) {
        this.roomType = frameData.roomType;
      }
      if (frameData.roomPwd) {
        this.roomPwd = frameData.signStr;
      }
      if (frameData.tempId) {
        this.tempId = frameData.tempId;
      }
      if (frameData.playerId) {
        this.playerId = frameData.playerId;
      }
      if (frameData.position) {
        this.position = frameData.position;
      }
      if (frameData.titleText) {
        this.txtFrameTitle.text = frameData.titleText;
      }
      if (frameData.content) {
        this._content = frameData.content;
        this.rTxtContent.text = frameData.content;
      }
      if (frameData.quick) {
        this._quick = frameData.quick;
      }

      this.refreshCurrentCnt();
    }

    this.notAcceptTip.setSelectedIndex(this._quick ? 0 : 1);
    if (this._quick) {
      this.txtCountDown.visible = false;
      this["btnConfirm"].title =
        LangManager.Instance.GetTranslation("public.confirm1");
      this["btnCancel"].title =
        LangManager.Instance.GetTranslation("public.cancel1");
    } else {
      this._autoExitTimer = new TimerTicker(
        1000,
        InviteData.BeingInvite_AutoExitTime
      );
      this._autoExitTimer.addEventListener(
        TimerEvent.TIMER,
        this.__timerHandler,
        this
      );
      this._autoExitTimer.start();
    }
    this.txtNotAcceptInvite.text = LangManager.Instance.GetTranslation(
      "BeingInviteWnd.txtNotAcceptInvite"
    );

    ServerDataManager.listen(
      S2CProtocol.U_C_MULITY_CAMPAIGN_REQUEST,
      this,
      this.__mulityCampaignRequestHandler
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.on(
      PlayerEvent.MUTICOPY_COUNT,
      this.refreshCurrentCnt,
      this
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.on(
      PlayerEvent.TAILA_COUNT,
      this.refreshCurrentCnt,
      this
    );
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
    if (!this._quick) {
      this._autoExitTimer.removeEventListener(
        TimerEvent.TIMER,
        this.__timerHandler,
        this
      );
      this._autoExitTimer.stop();
    }
    SimpleAlertHelper.Instance.HideByType(SimpleAlertHelper.SIMPLE_ALERT);

    ServerDataManager.cancel(
      S2CProtocol.U_C_MULITY_CAMPAIGN_REQUEST,
      this,
      this.__mulityCampaignRequestHandler
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.off(
      PlayerEvent.MUTICOPY_COUNT,
      this.refreshCurrentCnt,
      this
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.off(
      PlayerEvent.TAILA_COUNT,
      this.refreshCurrentCnt,
      this
    );
  }

  private refreshCurrentCnt() {
    this._campaign = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_campaign,
      this.tempId
    );
    if (this._campaign) {
      let tempArr = CampaignMapModel.getCampaignCountArr(this._campaign);
      this._curCount = tempArr[0];
      this._maxCount = tempArr[1];

      this.getController("income").selectedIndex = 1;
      let showTick = this._curCount > 0;
      this["imgIncomeTick"].visible = showTick;
      this.rTxtContent.text =
        this._content +
        LangManager.Instance.GetTranslation(
          showTick ? "invite.campaign.income" : "invite.campaign.income.color",
          this._curCount,
          this._maxCount
        );
    }
  }

  private __timerHandler() {
    let time: number =
      InviteData.BeingInvite_AutoExitTime - this._autoExitTimer.currentCount;
    // Logger.xjy("__timerHandler", this._autoExitTimer.currentCount, time)
    if (time <= 0) {
      time = 0;
    }
    this.txtCountDown.text =
      time == 0 ? "" : DateFormatter.getConsortiaCountDate(time);
    if (time == 0) {
      this.hide();
    }
  }

  private btnIncomeClick() {
    // 点击后状态
    let sel = !this["imgIncomeTick"].visible;

    if (this.isSpecialFB) {
      let tempArr = CampaignMapModel.getCampaignCountArr(this._campaign);
      if (tempArr[0] <= 0) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "room.view.pve.RoomRightView.notEnoughIncome"
          )
        );
      }
    } else {
      if (this.playerInfo.multiCopyCount <= 0) {
        let flag = this.checkUseImperialCrusadeOrder();
        if (!flag) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "room.view.pve.RoomRightView.notEnoughIncome"
            )
          );
        }
      }
    }

    if (!sel) {
      if (this._showCancelBtnIncomeTip) {
        let content = LangManager.Instance.GetTranslation(
          "room.view.pve.RoomRightView.notUserIncomeWillNotGetReward"
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          null,
          null,
          content,
          null,
          null,
          (b: boolean) => {
            if (b) {
              this._showCancelBtnIncomeTip = false;
              this.refreshIncomeState(false);
            }
          }
        );
      } else {
        this.refreshIncomeState(false);
      }
    } else {
      this.refreshIncomeState(true);
    }
  }

  private refreshIncomeState(selected: boolean = true) {
    let tempArr = CampaignMapModel.getCampaignCountArr(this._campaign);
    if (tempArr[0] <= 0) {
      selected = false;
    }
    this["imgIncomeTick"].visible = selected;
  }

  public setInviteCancelIncome(selected: boolean) {
    let roomHallCtrl = FrameCtrlManager.Instance.getCtrl(
      EmWindow.RoomHall
    ) as RoomHallCtrl;
    roomHallCtrl.data.inviteCancelIncome = !selected;
  }

  public get isSpecialFB() {
    return (
      this._campaign.isTrailTower ||
      this._campaign.isTaila ||
      this._campaign.isKingTower
    );
  }

  public getImperialCrusadeOrderPos() {
    let pos = -1;
    let bagDic = GoodsManager.Instance.getGeneralBagList();
    for (const key in bagDic) {
      if (bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
        let info: GoodsInfo = bagDic[key];
        if (info.templateId == ItemID.IMPERIAL_CRUSADE_ORDER) {
          pos = info.pos;
          break;
        }
      }
    }
    return pos;
  }

  private checkUseImperialCrusadeOrder(): boolean {
    if (this._campaign.SonTypes != 0) {
      return false;
    }

    if (this.playerInfo.multiCopyCount > 0) {
      return false;
    }

    let pos = this.getImperialCrusadeOrderPos();
    if (pos == -1) {
      return false;
    } else {
      let content: string = LangManager.Instance.GetTranslation(
        "RoomHall.ImperialCrusadeOrderNoEnoughTip"
      );
      let num: number = GoodsManager.Instance.getGoodsNumByTempId(
        ItemID.IMPERIAL_CRUSADE_ORDER
      );
      let goodsCount: string =
        LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + num;
      UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {
        content: content,
        goodsId: ItemID.IMPERIAL_CRUSADE_ORDER,
        goodsCount: goodsCount,
        callback: (b: any) => {
          if (b) {
            SocketSendManager.Instance.sendUseItem(pos);
          } else {
            this["imgIncomeTick"].visible = false;
          }
        },
      });
      return true;
    }
  }

  private __mulityCampaignRequestHandler(pkg: PackageIn) {
    let refresh: Boolean = false;

    /**房间信息对象 */
    let roomInfo: RoomInfo = new RoomInfo();

    /**协议消息对象 */
    let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;

    /**竞技房间 */
    if (msg.param3 == 1) {
      return;
    }

    /**校验是不是聊天场景触发的[快捷:0;专属:1] */
    if (msg.param10 != null && msg.param10 != undefined && msg.param10 != 1) {
      return;
    }

    /**副本标识 */
    if (msg.param2 == null || msg.param2 == undefined) {
      return;
    }

    /**房间不存在|房间已满 */
    if (msg.param11 != null && msg.param11 != undefined && msg.param11 == 0) {
      this.OnBtnClose();
      return;
    }

    /**房间标识 */
    roomInfo.id = msg.param1;
    /**副本标识 */
    roomInfo.campaignId = msg.param2;
    /**房间类型 */
    roomInfo.roomType = msg.param3;

    /**副本对象 */
    let templateInfo: t_s_campaignData;

    templateInfo = roomInfo.mapTemplate
      ? roomInfo.mapTemplate
      : CampaignManager.Instance.mapModel.campaignTemplate;
    if (templateInfo == null || templateInfo == undefined) {
      return;
    }

    if (this.roomType != msg.param3) {
      refresh = true;
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("Invite.room.change.type")
      );
    }

    /**副本是否已经开始 */
    var isInCampaign: Boolean = msg.param7 && roomInfo.campaignId != 0;
    if ((this.position == 1) != isInCampaign) {
      refresh = true;
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("Invite.room.change.state")
      );
    }

    if (this._campaign.AreaId != templateInfo.AreaId) {
      refresh = true;
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("Invite.room.change.campaign")
      );
    }

    if (this._campaign.DifficutlyGrade != templateInfo.DifficutlyGrade) {
      refresh = true;
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("Invite.room.change.difficutly")
      );
    }

    if (refresh) {
      if (this._autoExitTimer) {
        this._autoExitTimer.reset();
        this._autoExitTimer.start();
        this.__timerHandler();
      }
      /**副本等级范围 */
      let lvstr = "";
      /**副本难度范围 */
      let difficultyGrade: string = "";

      // 构建副本等级范围字符串
      lvstr =
        LangManager.Instance.GetTranslation(
          "public.level3",
          templateInfo.MinLevel
        ) +
        "-" +
        LangManager.Instance.GetTranslation(
          "public.level3",
          templateInfo.MaxLevel
        );

      // 最小等级与最大等级相等时
      if (templateInfo.MinLevel == templateInfo.MaxLevel) {
        lvstr = LangManager.Instance.GetTranslation(
          "public.level3",
          templateInfo.MinLevel
        );
      }

      /**王者之塔 */
      if (templateInfo.isKingTower) {
        difficultyGrade =
          KingTowerManager.Instance.kingTowerInfo.difficultyStep(
            templateInfo.DifficutlyGrade
          );
      }

      // 提示标题文本
      let titleText = "";

      // 提示正文
      let content: string;

      // 发起邀请的玩家昵称。ps 这里的昵称是空的。通过查询的都是空的，只有直接邀请才会有玩家昵称。
      let nickName: string = msg.param6
        ? "[color=#00ff00]" + msg.param6 + "[/color]"
        : "";

      // 竞技邀请
      if (roomInfo.roomType == 1) {
        titleText = LangManager.Instance.GetTranslation(
          "yishi.manager.BaseManager.frame"
        );
        content = nickName
          ? LangManager.Instance.GetTranslation(
              "yishi.manager.BaseManager.content02",
              nickName,
              roomInfo.id
            )
          : LangManager.Instance.GetTranslation(
              "yishi.manager.BaseManager.content022",
              roomInfo.id
            );
      }

      // 普通副本邀请
      else if (roomInfo.roomType == 0) {
        titleText = LangManager.Instance.GetTranslation(
          "yishi.manager.BaseManager.frame02"
        );

        // 副本名称
        let nameMap: string = LangManager.Instance.GetTranslation(
          "yishi.manager.BaseManager.msg.name"
        );
        let str: string = StringHelper.isNullOrEmpty(msg.param4)
          ? nameMap
          : msg.param4;
        str += " " + lvstr;

        // 副本难度范围
        if (difficultyGrade) {
          str += "(" + difficultyGrade + ")";
        }
        content = nickName
          ? LangManager.Instance.GetTranslation(
              "yishi.manager.BaseManager.content03",
              nickName,
              str
            )
          : LangManager.Instance.GetTranslation(
              "yishi.manager.BaseManager.content033",
              str
            );

        // 副本是否已开始
        if (msg.param7) {
          content =
            content +
            LangManager.Instance.GetTranslation("invite.position.content");
        }
      }

      // 活动副本邀请
      else if (roomInfo.roomType == 2) {
        titleText = LangManager.Instance.GetTranslation(
          "yishi.manager.BaseManager.frame02"
        );
        content = LangManager.Instance.GetTranslation("vehicle.mapName");
        content = nickName
          ? LangManager.Instance.GetTranslation(
              "yishi.manager.BaseManager.content04",
              nickName,
              content
            )
          : LangManager.Instance.GetTranslation(
              "yishi.manager.BaseManager.content044",
              content
            );
        // 副本是否已开始
        if (msg.param7) {
          content =
            content +
            LangManager.Instance.GetTranslation("invite.position.content");
        }
      }

      this.roomId = roomInfo.id;
      this.roomType = roomInfo.roomType;
      this.tempId = templateInfo.CampaignId;
      this.position = isInCampaign ? 1 : 0;
      this._content = content;
      this.txtFrameTitle.text = titleText;
      this.rTxtContent.text = content;
      this._campaign = templateInfo;

      this.refreshCurrentCnt();
    } else {
      RoomListSocketOutManager.addRoomById(
        this.roomType,
        this.roomId,
        this.roomPwd,
        true,
        !this["imgIncomeTick"].visible
      );
      this.OnBtnClose();
    }
  }

  private btnConfirmClick() {
    if (
      !this.isAlert(
        !this["imgIncomeTick"].visible && this._showCancelBtnIncomeTip ? 0 : 1,
        (b: boolean, check: boolean) => {
          if (!b) return;
          SharedManager.Instance.inviteCheck = check;
          SharedManager.Instance.inviteCheckDate = new Date();
          SharedManager.Instance.saveInviteCheck();

          if (this.position == 1) {
            var content: string = LangManager.Instance.GetTranslation(
              "chat.view.ChatView.EnterCampaignTips"
            );
            SimpleAlertHelper.Instance.Show(
              SimpleAlertHelper.SIMPLE_ALERT,
              null,
              null,
              content,
              null,
              null,
              this.__btnConfirmClick.bind(this)
            );
            return;
          }

          if (this.roomType != 0 || !this.showThewAlert(this.send.bind(this))) {
            this.setInviteCancelIncome(this["imgIncomeTick"].visible);
            if (ArmyManager.Instance.army.onVehicle) {
              MessageTipManager.Instance.show(
                LangManager.Instance.GetTranslation(
                  "OuterCityCastleTips.gotoBtnTips"
                )
              );
              return;
            }
            RoomListSocketOutManager.sendSearchRoomState(this.roomId, 1);
          }
        },
        LangManager.Instance.GetTranslation(
          "room.view.pve.RoomRightView.notUserIncomeWillNotGetReward"
        )
      )
    ) {
      if (this.position == 1) {
        var content: string = LangManager.Instance.GetTranslation(
          "chat.view.ChatView.EnterCampaignTips"
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          null,
          null,
          content,
          null,
          null,
          this.__btnConfirmClick.bind(this)
        );
        return;
      }

      if (this.roomType != 0 || !this.showThewAlert(this.send.bind(this))) {
        this.setInviteCancelIncome(this["imgIncomeTick"].visible);
        if (ArmyManager.Instance.army.onVehicle) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "OuterCityCastleTips.gotoBtnTips"
            )
          );
          return;
        }
        RoomListSocketOutManager.sendSearchRoomState(this.roomId, 1);
      }
    }
  }

  private __btnConfirmClick(b: boolean, flag: boolean) {
    if (b) {
      if (ArmyManager.Instance.army.onVehicle) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips")
        );
        return;
      }
      RoomListSocketOutManager.sendSearchRoomState(this.roomId, 1);
      // RoomListSocketOutManager.addRoomById(this.roomType, this.roomId, this.roomPwd, true, !this["imgIncomeTick"].visible);
    }
  }

  private send(b: boolean, check: boolean) {
    if (!b) return;
    if (ArmyManager.Instance.army.onVehicle) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips")
      );
      return;
    }
    SharedManager.Instance.inviteCheck = check;
    SharedManager.Instance.inviteCheckDate = new Date();
    SharedManager.Instance.saveInviteCheck();
    RoomListSocketOutManager.sendSearchRoomState(this.roomId, 1);
    // RoomListSocketOutManager.addRoomById(this.roomType, this.roomId, this.roomPwd, true, !this["imgIncomeTick"].visible);
  }

  private showThewAlert(callBack: any) {
    if (this._campaign && this._campaign.SonTypes != 0) {
      if (this._campaign.isKingTower) {
      } else if (this._campaign.isTrailTower) {
        if (this._curCount < 1) {
          return this.isAlert(
            this._curCount,
            callBack,
            LangManager.Instance.GetTranslation(
              "yishi.view.base.ThewAlertFrame.disclistTRIAL_CHOSE"
            )
          );
        }
        return false;
      } else if (this._campaign.isTaila) {
      }
    } else {
      //如果是普通多人副本
      return this.isAlert(
        this.playerInfo.multiCopyCount,
        callBack,
        LangManager.Instance.GetTranslation(
          "yishi.view.base.ThewAlertFrame.disclist01"
        )
      );
    }

    return false;
  }

  private isAlert(
    currentCount: number,
    callBack: Function,
    content: string
  ): boolean {
    var flag: boolean = currentCount < 1;
    var preDate: Date = new Date(SharedManager.Instance.inviteCheckDate);
    var now: Date = new Date();
    var outdate: boolean = false;
    var check: boolean = SharedManager.Instance.inviteCheck;
    if (
      !check ||
      (preDate.getMonth() <= preDate.getMonth() &&
        preDate.getDate() < now.getDate())
    )
      outdate = true;
    if (flag && outdate) {
      var checkTxt: string = LangManager.Instance.GetTranslation(
        "yishi.view.base.ThewAlertFrame.text"
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        { checkRickText: checkTxt },
        null,
        content,
        null,
        null,
        callBack
      );
    }
    return flag && outdate;
  }

  private get playerInfo() {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private btnCancelClick() {
    if (this.btnNotAcceptInvite.selected) {
      InviteTipManager.Instance.set(
        EmInviteTipType.Room,
        this.playerId.toString(),
        true
      );
    }
    this.OnBtnClose();
  }
}
