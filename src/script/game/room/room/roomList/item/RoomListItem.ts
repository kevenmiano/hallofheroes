/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-22 10:22:41
 * @LastEditTime: 2023-09-19 16:20:40
 * @LastEditors: jeremy.xu
 * @Description:
 */

import FUI_RoomListItem from "../../../../../../fui/RoomList/FUI_RoomListItem";
import LangManager from "../../../../../core/lang/LangManager";
import { RoomSceneType } from "../../../../constant/RoomDefine";
import { EmWindow } from "../../../../constant/UIDefine";
import { RoomInfo } from "../../../../mvc/model/room/RoomInfo";

export default class RoomListItem extends FUI_RoomListItem {
  private _roomInfo: RoomInfo;
  public roomSceneType: RoomSceneType = RoomSceneType.PVP;

  protected onConstruct() {
    super.onConstruct();
    this.resetItem();
  }

  public set roomInfo(value: RoomInfo) {
    this._roomInfo = value;
    this.refreshView();
  }

  public get roomInfo(): RoomInfo {
    return this._roomInfo;
  }

  private refreshView() {
    this.resetItem();
    if (this._roomInfo) {
      this.txtNum.text = LangManager.Instance.GetTranslation(
        "public.No",
        this._roomInfo.id
      );
      this.txtCapicity.text =
        this._roomInfo.curCount + " / " + this._roomInfo.capacity;
      this.imgBgNum.visible = true;
      this.imgLock.visible = this._roomInfo.isLock;
      this.imgBg.icon = fgui.UIPackage.getItemURL(
        EmWindow.RoomList,
        this.roomSceneType == RoomSceneType.PVE
          ? "Img_Room_Box1"
          : "Img_Room_Box2"
      );

      if (this.roomSceneType == RoomSceneType.PVE) {
        if (this._roomInfo.mapTemplate) {
          let lvstr = LangManager.Instance.GetTranslation(
            "public.level4",
            "<br>",
            this.roomInfo.mapTemplate.MinLevel,
            this.roomInfo.mapTemplate.MaxLevel
          );
          if (
            this.roomInfo.mapTemplate.MinLevel ==
            this.roomInfo.mapTemplate.MaxLevel
          ) {
            lvstr =
              "<br>" +
              LangManager.Instance.GetTranslation(
                "public.level3",
                this.roomInfo.mapTemplate.MinLevel
              );
          }
          this.txtTitle.text =
            this.roomInfo.mapTemplate.CampaignNameLang + lvstr;
          // _roomIcon.icon = PathManager.mapInstanceRoomIcon(this._roomInfo.campaignId);
          // _roomName.icon = PathManager.mapInstanceRoomName(this._roomInfo.campaignId);
          // if (this._roomInfo.mapTemplate.isKingTower) {//王者之塔
          //     _difficultyImg.visible = true;
          //     var diffGrade = this._roomInfo.mapTemplate.DifficultyGrade;
          //     _difficultyImg.setFrame(diffGrade);
          //     var instanceHard = diffGrade == KingTowerType.NIGHTMARE ? 3 : 2;
          //     _back.setFrame(instanceHard);
          //     if (diffGrade == KingTowerType.NIGHTMARE) {
          //         _iconBack.visible = true;
          //     }
          // }
          // else {
          //     _back.setFrame(this._roomInfo.mapTemplate.DifficultyGrade + 1);
          //     if (this._roomInfo.mapTemplate.DifficultyGrade > 1) {
          //         _iconBack.visible = true;
          //     }
          // }
        }
      } else if (this.roomSceneType == RoomSceneType.PVP) {
        this.txtTitle.text = LangManager.Instance.GetTranslation(
          "RoomListItem.Title01"
        );
        // this.imgSelect.alpha = 0
      }
    }
  }

  private resetItem() {
    this.imgBg.icon = fgui.UIPackage.getItemURL(
      EmWindow.RoomList,
      "Img_Room_Box"
    );
    this.txtNum.text = "";
    this.txtTitle.text = "";
    this.txtCapicity.text = "";
    this.imgLock.visible = false;
    this.imgBgNum.visible = false;
  }
}
