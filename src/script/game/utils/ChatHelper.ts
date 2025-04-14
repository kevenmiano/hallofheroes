import LangManager from "../../core/lang/LangManager";
import StringHelper from "../../core/utils/StringHelper";
import { ChatChannel } from "../datas/ChatChannel";
import { ArmyManager } from "../manager/ArmyManager";
import { CampaignManager } from "../manager/CampaignManager";
import { FilterWordManager } from "../manager/FilterWordManager";
import FreedomTeamManager from "../manager/FreedomTeamManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { PlayerManager } from "../manager/PlayerManager";
import { RoomManager } from "../manager/RoomManager";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { CampaignMapModel } from "../mvc/model/CampaignMapModel";
import { WorldBossHelper } from "./WorldBossHelper";

/**
 * @author:pzlricky
 * @data: 2021-04-30 09:52
 * @description 聊天帮助类
 */
export default class ChatHelper {
  /**
   * 当前频道（内城, 外城, 以及部分副本场景）聊天CD
   */
  public static SEND_CD_1: number = 30000;
  /**
   * 当前频道（房间, 战斗, 以及部分副本场景）聊天CD
   */
  public static SEND_CD_2: number = 2000;
  /**
   * 世界频道聊天CD
   */
  public static SEND_CD_3: number = 30000;
  /**
   * 当前频道（内城, 外城, 以及部分副本场景）聊天最后发送时间
   */
  public static lastSendTime1: number = -30000;
  /**
   * 当前频道（房间, 战斗, 以及部分副本场景）聊天最后发送时间
   */
  public static lastSendTime2: number = -2000;
  /**
   * 世界频道聊天最后发送时间
   */
  public static lastSendTime3: number = -10000;

  public static parasMsgs(fieldText: string): string {
    var result: string = fieldText;
    result = StringHelper.rePlaceHtmlTextField(result);
    let tempStr = result;
    let tempResult = StringHelper.trimWords(tempStr); //先过滤掉特殊字符
    if (FilterWordManager.isGotForbiddenWords(tempResult)) {
      tempStr = FilterWordManager.filterWrod(tempResult);
    } else {
      tempStr = FilterWordManager.filterWrod(tempStr);
    }
    return tempStr;
  }

  public static parseTrMsg(fieldText: string): string {
    var result: string = fieldText;

    let tempStr = result;

    if (FilterWordManager.isGotForbiddenWords(result)) {
      tempStr = FilterWordManager.filterWrod(result);
    } else {
      tempStr = FilterWordManager.filterWrod(result);
    }
    return tempStr;
  }

  public static checkCanSend(
    chatStr: string,
    channel: number,
    isvoice?: boolean,
  ): boolean {
    if (ArmyManager.Instance.thane.grades < 6 && channel != ChatChannel.WORLD) {
      //非世界频道
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatInputView.command05",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    let worldmsgLevel: number = 20; //1.	世界频道发言需要修改发言等级要求为20级
    if (
      ArmyManager.Instance.thane.grades < 20 &&
      channel == ChatChannel.WORLD
    ) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatInputView.command07",
        worldmsgLevel,
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    var str: string = "";
    if (isvoice) {
    } else {
      if (chatStr.length == 0) return false;
      if (chatStr == "") {
        str = LangManager.Instance.GetTranslation(
          "chat.view.ChatInputView.command01",
        );
        MessageTipManager.Instance.show(str);
        return false;
      }
    }

    if (channel == ChatChannel.CURRENT) {
      str = LangManager.Instance.GetTranslation("chat.shutup");
      MessageTipManager.Instance.show(str);
      return false; //综合不能发言
      // if (ChatHelper.checkSceneType()) {
      //     if (ChatHelper.getTimer() - ChatHelper.lastSendTime1 < ChatHelper.SEND_CD_1) {
      //         str = LangManager.Instance.GetTranslation("chat.view.ChatInputView.command02", ChatHelper.SEND_CD_1 * 0.001);
      //         MessageTipManager.Instance.show(str);
      //         return false;
      //     }
      // } else {
      //     if (ChatHelper.getTimer() - ChatHelper.lastSendTime2 < ChatHelper.SEND_CD_2) {
      //         str = LangManager.Instance.GetTranslation("chat.view.ChatInputView.command02", ChatHelper.SEND_CD_2 * 0.001);
      //         MessageTipManager.Instance.show(str);
      //         return false;
      //     }
      // }
    }
    if (
      channel == ChatChannel.WORLD &&
      ChatHelper.getTimer() - ChatHelper.lastSendTime3 < ChatHelper.SEND_CD_3
    ) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatInputView.command02",
        ChatHelper.SEND_CD_3 * 0.001,
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (
      channel == ChatChannel.CONSORTIA &&
      PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0
    ) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatInputView.command03",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (channel == ChatChannel.TEAM) {
      if (!ChatHelper.checkTeamChatScene()) {
        str = LangManager.Instance.GetTranslation(
          "chat.view.ChatInputView.command04",
        );
        MessageTipManager.Instance.show(str);
        return false;
      }
    }
    return true;
  }

  static getTimer(): number {
    return new Date().getTime();
  }

  /**
   * 检测是否可以组队聊天
   * @return
   *
   */
  private static checkTeamChatScene(): boolean {
    var canTeamChat: boolean = true;
    if (FreedomTeamManager.Instance.hasTeam) {
      canTeamChat = true;
    } else if (SceneManager.Instance.currentType == SceneType.VEHICLE) {
      canTeamChat = true;
    } else if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      canTeamChat = false;
    } else if (!RoomManager.Instance.roomInfo) {
      canTeamChat = false;
    } else if (
      CampaignManager.Instance.mapModel &&
      WorldBossHelper.checkIsNoTeamChatMap(
        CampaignManager.Instance.mapModel.mapId,
      )
    ) {
      canTeamChat = false;
    } else if (
      CampaignManager.Instance.mapModel &&
      CampaignManager.Instance.mapModel.allBaseArmy.size <= 1
    ) {
      canTeamChat = false;
    }
    return canTeamChat;
  }

  /**
   * 检查当前场景（内城, 外城, 以及部分副本返回true）
   * @return
   *
   */
  public static checkSceneType(): boolean {
    var scene: string = SceneManager.Instance.currentType;
    switch (scene) {
      case SceneType.CAMPAIGN_MAP_SCENE:
        var model: CampaignMapModel = CampaignManager.Instance.mapModel;
        var types: number = model.campaignTemplate.Types;
        if (
          model &&
          model.campaignTemplate &&
          (types == 1 || types == 2 || types == 10)
        ) {
          return true;
        } else {
          return false;
        }
        break;
      case SceneType.PVE_ROOM_SCENE:
      case SceneType.PVP_ROOM_SCENE:
      case SceneType.BATTLE_SCENE:
      case SceneType.VEHICLE:
        return false;
        break;
      default:
        return true;
    }
  }
}
