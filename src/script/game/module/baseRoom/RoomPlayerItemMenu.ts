import FUI_RoomPlayerItemMenu from "../../../../fui/BaseRoom/FUI_RoomPlayerItemMenu";
import LangManager from "../../../core/lang/LangManager";
import LayerMgr from "../../../core/layer/LayerMgr";
import Logger from "../../../core/logger/Logger";
import { EmLayer } from "../../../core/ui/ViewInterface";
import { RoomPlayerItemType } from "../../constant/RoomDefine";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { RequestInfoEvent } from "../../constant/event/NotificationEvent";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerInfoManager } from "../../manager/PlayerInfoManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import RoomHallCtrl from "../../room/room/roomHall/RoomHallCtrl";
import FUIHelper from "../../utils/FUIHelper";

/*
 * @Author: jeremy.xu
 * @Date: 2023-11-22 11:28:19
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-22 11:31:05
 * @Description:
 */

export default class RoomPlayerItemMenu {
  public view: FUI_RoomPlayerItemMenu;
  public type: RoomPlayerItemType;
  public info: CampaignArmy;

  private static _instance: RoomPlayerItemMenu;

  public static get Instance(): RoomPlayerItemMenu {
    if (!this._instance) this._instance = new RoomPlayerItemMenu();
    return this._instance;
  }

  public Show(type: RoomPlayerItemType, info: CampaignArmy, pos: Laya.Point) {
    if (!this.view) {
      this.view = FUIHelper.createFUIInstance(
        EmPackName.BaseRoom,
        "RoomPlayerItemMenu",
      ) as FUI_RoomPlayerItemMenu;
      LayerMgr.Instance.addToLayer(this.view, EmLayer.GAME_MENU_LAYER);
    }
    this.view.setXY(pos.x, pos.y);
    this.type = type;
    this.info = info;

    let btnKick = this.view.getChild("btnKick");
    let btnMessage = this.view.getChild("btnMessage");
    let btnCaptainTransfer = this.view.getChild("btnCaptainTransfer");
    btnKick.onClick(this, this.btnKickClick.bind(this));
    btnMessage.onClick(this, this.btnMessageClick.bind(this));
    btnCaptainTransfer.onClick(this, this.btnCaptainTransferClick.bind(this));

    btnCaptainTransfer.visible = this.isOwner;
    btnKick.visible = this.isOwner;
    Laya.stage.on(Laya.Event.CLICK, this, this.onStageCLick);
  }

  public onStageCLick() {
    Laya.stage.off(Laya.Event.CLICK, this, this.onStageCLick);
    this.Hide();
  }

  public Hide() {
    if (this.view) {
      LayerMgr.Instance.removeByLayer(this.view, EmLayer.GAME_MENU_LAYER);
      this.view = null;
    }
  }

  private btnCaptainTransferClick() {
    let hInfo: ThaneInfo = this.info.baseHero;
    if (hInfo && this.isOwner && this.playerInfo.userId != hInfo.userId) {
      this.ctrl.sendChangeRoomOwner(hInfo.userId);
      this.Hide();
    }
  }

  private btnKickClick() {
    let hInfo: ThaneInfo = this.info.baseHero;
    if (hInfo && this.isOwner && this.playerInfo.userId != hInfo.userId) {
      this.ctrl.sendKickPlayerAlert(hInfo.userId);
      this.Hide();
    }
  }

  private btnMessageClick() {
    let hInfo: ThaneInfo = this.info.baseHero;
    if (hInfo) {
      PlayerManager.Instance.addEventListener(
        RequestInfoEvent.REQUEST_SIMPLEINFO,
        this.__recentContactHandler,
        this,
      );
      let serverName = hInfo.serviceName;
      if (serverName && serverName != this.playerInfo.serviceName) {
        PlayerInfoManager.Instance.sendRequestSimpleInfoCross(
          hInfo.userId,
          serverName,
        );
      } else {
        PlayerInfoManager.Instance.sendRequestSimpleInfo(hInfo.userId);
      }
      this.Hide();
    }
  }

  private __recentContactHandler(data1: number, data2: ThaneInfo) {
    PlayerManager.Instance.removeEventListener(
      RequestInfoEvent.REQUEST_SIMPLEINFO,
      this.__recentContactHandler,
      this,
    );
    var thane: ThaneInfo = data2;
    thane.isRobot = false;
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
  }

  private get isOwner(): boolean {
    return this.ctrl && this.ctrl.data.isOwner;
  }

  private get ctrl(): RoomHallCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.RoomHall) as RoomHallCtrl;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  dispose(): void {
    Laya.stage.off(Laya.Event.CLICK, this, this.onStageCLick);
  }
}
