/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-19 19:39:07
 * @LastEditTime: 2022-03-07 10:48:38
 * @LastEditors: jeremy.xu
 * @Description:
 */

import LangManager from "../../../../core/lang/LangManager";
import { t_s_campaignData } from "../../../config/t_s_campaign";
import { RoomCampaignType } from "../../../constant/RoomDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignTemplateManager } from "../../../manager/CampaignTemplateManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import FrameDataBase from "../../../mvc/FrameDataBase";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
import FUIHelper from "../../../utils/FUIHelper";

export default class RoomListData extends FrameDataBase {
  public static PageRoomItems = 8;
  public static PvePageRoomItems = 6;
  public roomList: RoomInfo[] = [];
  public selCampaignID: number = 0;

  show() {
    super.show();
  }

  hide() {
    super.hide();
    this.selCampaignID = 0;
  }

  dispose() {
    super.dispose();
  }

  public addRoom(info: RoomInfo, currentIndex: number, totalIndex: number) {
    this.roomList.push(info);
    // if(currentIndex == totalIndex - 1)
    //     this.dispatchEvent(RoomlistData.REFRESH_ROOM_LIST);
  }

  public getRoomInfoById(roomId: number): RoomInfo {
    for (let index = 0; index < this.roomList.length; index++) {
      const info: RoomInfo = this.roomList[index];
      if (info.id == roomId) return info;
    }
    return null;
  }

  private formatList(
    arr: t_s_campaignData[],
    type: number = RoomCampaignType.Multy,
  ) {
    let format = [];
    arr.forEach((item) => {
      let obj = {};
      obj["CampaignId"] = item.CampaignId;
      obj["CampaignName"] = LangManager.Instance.GetTranslation(
        "public.PVEroomlist",
        item.CampaignNameLang,
        item.MinLevel,
        item.MaxLevel,
      );
      if (type != RoomCampaignType.Multy) {
        obj["CampaignName"] +=
          " " + LangManager.Instance.GetTranslation("public.Activity");
      }
      obj["SonTypes"] = item.SonTypes;
      obj["isKingTower"] = item.isKingTower;
      format.push(obj);
    });
    return format;
  }

  private getComboList(): t_s_campaignData[] {
    let list: any[] = CampaignTemplateManager.Instance.getMutiCampaignList();
    let list2: any[] = CampaignTemplateManager.Instance.getActiveCampaignList();
    list = this.formatList(list, RoomCampaignType.Multy);
    list2 = this.formatList(list2, RoomCampaignType.Activity);
    list = list.concat(list2);
    return list;
  }

  private getComboListNames(): string[] {
    let list = this.getComboList() as t_s_campaignData[];
    let temp: string[] = [
      LangManager.Instance.GetTranslation("RoomList.AllMap"),
    ];
    list.forEach((element) => {
      temp.push(element.CampaignNameLang);
    });
    return temp;
  }

  private getComboListIds(): number[] {
    let list = this.getComboList() as t_s_campaignData[];
    let temp: number[] = [0];
    list.forEach((element) => {
      temp.push(element.CampaignId);
    });
    return temp;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  /**
   * 获取段位图标
   * @param id 段位
   */
  getIconBySegment(id: number) {
    let rank = Math.ceil(id / 3);
    if (rank > 6) {
      rank = 6;
    }
    return FUIHelper.getItemURL("RoomList", "Img_Division0" + rank);
  }

  /**
   * 获取段位图标
   * @param id 段位
   */
  getStarBySegment(id: number) {
    if (id >= 16) {
      return 0;
    }
    let rank = id % 3;
    if (rank == 0) {
      rank = 3;
    }
    return rank;
  }
}
