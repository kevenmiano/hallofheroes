/*
 * @Author: jeremy.xu
 * @Date: 2022-03-02 17:57:05
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-03-07 11:07:40
 * @Description:
 */

import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { RoomSceneType, RoomType } from "../../../constant/RoomDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomListSocketOutManager } from "../../../manager/RoomListSocketOutManager";
import { RoomManager } from "../../../manager/RoomManager";
import { RoomSocketOuterManager } from "../../../manager/RoomSocketOuterManager";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
/**
 * 查找房间
 */
export default class FindRoomWnd extends BaseWindow {
  private txtInput: fgui.GTextInput;
  private _roomSceneType: RoomSceneType = RoomSceneType.PVE;
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
    this.initView();
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }

  private initView() {
    this.txtInput.restrict = "0-9";
    this.txtInput.promptText = this._alertString;
    if (this.frameData) {
      if (this.frameData.roomSceneType) {
        this._roomSceneType = this.frameData.roomSceneType;
      }
    }
  }

  private btnCancelClick() {
    this.OnBtnClose();
  }

  private btnConfirmClick() {
    if (this.txtInput.text == this._alertString || this.txtInput.text == "") {
      this.txtInput.requestFocus();
      // MessageTipManager.Instance.show(this._alertString);
      return;
    }
    let id = Number(this.txtInput.text);
    if (id > 0) {
      this.sendSearchRoomInfo(
        this._roomSceneType == RoomSceneType.PVE
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

  //return: S2CProtocol.U_C_ROOM_SEND
  public passwordInputBack(id: number, password: string) {
    RoomSocketOuterManager.sendLockCampaignRoom(id, password);
  }

  //return: S2CProtocol.U_C_ROOM_FIND_RESULT
  public sendSearchRoomInfo(roomType: RoomType, roomId: number) {
    RoomListSocketOutManager.sendSearchRoomInfo(roomType, roomId);
  }

  public dispose() {
    super.dispose();
  }
}
