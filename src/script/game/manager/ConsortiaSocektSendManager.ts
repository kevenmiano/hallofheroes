import { SocketManager } from "../../core/net/SocketManager";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "./ArmyManager";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "./PlayerManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { ResourceManager } from "./ResourceManager";
import { MessageTipManager } from "./MessageTipManager";
import LangManager from "../../core/lang/LangManager";
import { TempleteManager } from "./TempleteManager";
import RechargeAlertMannager from "./RechargeAlertMannager";
import { ConsortiaVotingUserInfo } from "../module/consortia/data/ConsortiaVotingUserInfo";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { ConsortiaManager } from "./ConsortiaManager";
import { ConsortiaModel } from "../module/consortia/model/ConsortiaModel";
import { ConsortiaInviteInfo } from "../module/consortia/data/ConsortiaInviteInfo";

//@ts-expect-error: External dependencies
import ConsortiaAltarOpenReqMsg = com.road.yishi.proto.consortia.ConsortiaAltarOpenReqMsg;
//@ts-expect-error: External dependencies
import ConsortiaVotingReqMsg = com.road.yishi.proto.consortia.ConsortiaVotingReqMsg;
//@ts-expect-error: External dependencies
import SearchConditionMsg = com.road.yishi.proto.consortia.SearchConditionMsg;
//@ts-expect-error: External dependencies
import ConsortiaRenameReqMsg = com.road.yishi.proto.consortia.ConsortiaRenameReqMsg;
//@ts-expect-error: External dependencies
import ConsortiaUserOfferReqMsg = com.road.yishi.proto.consortia.ConsortiaUserOfferReqMsg;
//@ts-expect-error: External dependencies
import ConsortiaQuitReqMsg = com.road.yishi.proto.consortia.ConsortiaQuitReqMsg;
//@ts-expect-error: External dependencies
import ConsortiaMsg = com.road.yishi.proto.consortia.ConsortiaMsg;

/**
 * 公会socket数据发送类
 * @author yuanzhan.yu
 */
export class ConsortiaSocektSendManager {
  constructor() {}

  private static get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private static get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  /**
   * 开启魔神祭坛
   * @param type  祭坛类型（0普通, 1英雄）
   * @param waveNum    开始波数
   */
  public static sendOpenDemon(type: number, waveNum: number) {
    let msg: ConsortiaAltarOpenReqMsg = new ConsortiaAltarOpenReqMsg();
    msg.altarType = type;
    msg.waveNum = waveNum;
    SocketManager.Instance.send(C2SProtocol.C_OPEN_CONSORTIA__ALTAR, msg);
  }

  /**
   * 发送选举信息
   * @param info 选举列表中候选人信息
   */
  public static sendVotingInfo(info: ConsortiaVotingUserInfo) {
    if (!info) {
      return;
    }
    let msg: ConsortiaVotingReqMsg = new ConsortiaVotingReqMsg();
    msg.votingUser = info.userId;
    SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_VOTING, msg);
  }

  /**
   * 查找公会
   * @param consortiaName 公会名
   * @param pageIndex  查找公会页面
   * @param isNewOpen  是否新开公会
   */
  public static searchConsortia(
    consortiaName: string,
    pageIndex: number,
    isNewOpen: boolean,
  ) {
    let msg: SearchConditionMsg = new SearchConditionMsg();
    msg.consortiaName = consortiaName;
    msg.pageIndex = pageIndex;
    msg.isNewOpen = isNewOpen;
    SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_SEARCH, msg);
  }

  /**
   * 公会改名
   * @param $name  输入的公会名
   * @param same   是否同名
   * @param useBind
   */
  public static consortiaRename(
    $name: string,
    same: boolean = false,
    useBind: boolean = true,
  ) {
    let msg: ConsortiaRenameReqMsg = new ConsortiaRenameReqMsg();
    msg.newName = $name;
    msg.same = same;
    msg.payType = 0;
    if (!useBind) {
      msg.payType = 1;
    }
    SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_RENAME, msg);
  }

  /**
   * 公会捐献
   * @param $gold
   *
   */
  public static consortiaContribute($gold: number, $point: number) {
    let num: number = Math.floor($gold / 1000) * 1000;
    ConsortiaSocektSendManager.consortiaContributesend(num, $point);
  }

  /**
   * 公会捐献
   * @param $gold  捐献的黄金数
   * @param $point 捐献的钻石数
   */
  public static consortiaContributesend($gold: number, $point: number) {
    let msg: ConsortiaUserOfferReqMsg = new ConsortiaUserOfferReqMsg();
    msg.offerGold = $gold;
    msg.offerPoint = $point;
    SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_OFF, msg);
  }

  /**
   * 退出公会
   * @param type  退出时是否消耗钻石或盟约之证（1/0）
   * @param useBind
   */
  public static exitConsortia(type: number = 0, useBind: boolean = true) {
    let msg: ConsortiaQuitReqMsg = new ConsortiaQuitReqMsg();
    msg.clear_CDType = type;
    //			msg.payType = 0;
    //			if(!useBind)
    //			{
    //				msg.payType=1;
    //			}
    SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_QUIT, msg);
  }

  /**
   * 删除用户申请
   * @param $id  申请玩家ID
   *
   */
  public static deleteApplyConsortia($id: number) {
    let msg: ConsortiaMsg = new ConsortiaMsg();
    msg.applyId = $id;
    SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_INVITEDEL, msg);
  }

  /**
   * 申请加入公会
   * @param $id 申请的目标公会id
   *
   */
  public static applyJoinConsortiaSend($id: number) {
    let num: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.lastOutConsortia;
    let isAuto: boolean =
      PlayerManager.Instance.currentPlayerModel.playerInfo.isAuto;
    let isFirst =
      PlayerManager.Instance.currentPlayerModel.playerInfo.addGuildCount <= 1; //加入公会次数
    if (
      !isFirst &&
      isAuto &&
      num + 24 * 3600 >
        PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond
    ) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let point: string = TempleteManager.Instance.getConfigInfoByConfigName(
        "Consortia_ClearCD_Point",
      ).ConfigValue;
      let content: string = LangManager.Instance.GetTranslation(
        "Consortia.ConsortiaSocketOutManager.content",
        point,
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        content,
        confirm,
        cancel,
        alertHandler,
      );
      function alertHandler(b: boolean, flag: boolean) {
        if (b) {
          if (
            PlayerManager.Instance.currentPlayerModel.playerInfo.point <
            parseInt(
              TempleteManager.Instance.getConfigInfoByConfigName(
                "Consortia_ClearCD_Point",
              ).ConfigValue,
            )
          ) {
            RechargeAlertMannager.Instance.show();
            return;
          }
          let msg: ConsortiaMsg = new ConsortiaMsg();
          msg.consortiaId = $id;
          msg.isPay = true;
          SocketManager.Instance.send(
            C2SProtocol.U_C_CONSORTIA_USERINVITE,
            msg,
          );
        }
      }
    } else {
      let msg: ConsortiaMsg = new ConsortiaMsg();
      msg.consortiaId = $id;
      msg.isPay = false;
      SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_USERINVITE, msg);
    }
  }

  public static applyJoinConsortia(consortiaId: number) {
    if (ConsortiaSocektSendManager.checkApply(consortiaId)) {
      return;
    }
    ConsortiaSocektSendManager.applyJoinConsortiaSend(consortiaId);
  }

  private static checkApply(consortiaId: number): boolean {
    let str: string = "";
    let model: ConsortiaModel = ConsortiaManager.Instance.model;

    for (const key in model.applyList) {
      if (model.applyList.hasOwnProperty(key)) {
        let item: ConsortiaInviteInfo = model.applyList[key];
        if (item.consortiaId == consortiaId) {
          str = LangManager.Instance.GetTranslation(
            "consortia.ConsortiaControler.command02",
          );
          MessageTipManager.Instance.show(str);
          return true;
        }
      }
    }
    if (
      ConsortiaSocektSendManager.thane.grades <
      ConsortiaModel.CREAT_NEEDED_GRADES
    ) {
      str = LangManager.Instance.GetTranslation(
        "consortia.ConsortiaControler.command03",
        ConsortiaModel.CREAT_NEEDED_GRADES,
      );
      MessageTipManager.Instance.show(str);
      return true;
    }
    if (model.applyList.length >= ConsortiaModel.APPLY_MAX) {
      str = LangManager.Instance.GetTranslation(
        "consortia.ConsortiaControler.command04",
      );
      MessageTipManager.Instance.show(str);
      return true;
    }
    return false;
  }
}
