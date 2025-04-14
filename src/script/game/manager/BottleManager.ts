import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { BottleModel } from "../module/funny/model/BottleModel";
import { PackageIn } from "../../core/net/PackageIn";
import {
  BottleEvent,
  NotificationEvent,
} from "../constant/event/NotificationEvent";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import { PlayerManager } from "./PlayerManager";
import { NotificationManager } from "./NotificationManager";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { BottleUserInfo } from "../module/funny/model/BottleUserInfo";

//@ts-expect-error: External dependencies
import BottlePassMsg = com.road.yishi.proto.item.BottlePassMsg;
//@ts-expect-error: External dependencies
import BottleDropListMsg = com.road.yishi.proto.item.BottleDropListMsg;
//@ts-expect-error: External dependencies
import BottleOpMsg = com.road.yishi.proto.item.BottleOpMsg;
//@ts-expect-error: External dependencies
import BottleScoreMsg = com.road.yishi.proto.item.BottleScoreMsg;
//@ts-expect-error: External dependencies
import BottleMsg = com.road.yishi.proto.item.BottleMsg;
//@ts-expect-error: External dependencies
import PlayerBottleMsg = com.road.yishi.proto.item.PlayerBottleMsg;
import { DateFormatter } from "../../core/utils/DateFormatter";
//@ts-expect-error: External dependencies
import BottleItemInfoMsg = com.road.yishi.proto.item.BottleItemInfoMsg;
//@ts-expect-error: External dependencies
import BottlePackage = com.road.yishi.proto.item.BottlePackage;

import LangManager from "../../core/lang/LangManager";
import SetItem2 from "../module/personalCenter/item/SetItem2";
import XmlMgr from "../../core/xlsx/XmlMgr";
import { TempleteManager } from "./TempleteManager";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/22 15:25
 * @ver 1.0
 */
export class BottleManager extends GameEventDispatcher {
  public openBottle: boolean = false;

  private static _instance: BottleManager;

  public static get Instance(): BottleManager {
    if (this._instance == null) {
      this._instance = new BottleManager();
    }
    return this._instance;
  }

  constructor() {
    super();
  }

  private _model: BottleModel;
  public get model(): BottleModel {
    return this._model;
  }

  public setup(): void {
    if (!this._model) {
      this._model = new BottleModel();
    }
    this.addEvent();
  }

  private addEvent(): void {
    ServerDataManager.listen(
      S2CProtocol.U_C_BOTTLE_PASS,
      this,
      this.__updateBottleInfo,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_BOTTLE_RESULT,
      this,
      this.__updateBottleResult,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_BOTTLE_DROP_DATA,
      this,
      this.__updateBottleData,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_BOTTLE_ACTIVE,
      this,
      this.__updateBottleUserInfomation,
    );
  }

  /**
   * 更新魔罐信息
   * @param pkg
   * passType:魔罐传递类型(1: 自身获得物品, 2: 幸运传递)
   * infos:信息
   */
  private __updateBottleInfo(pkg: PackageIn): void {
    let msg: BottlePassMsg = pkg.readBody(BottlePassMsg) as BottlePassMsg;
    //msgs 1   CastleServer.Bottle.Info.Alter
    //msgs 2   CastleServer.Bottle.Pass
    if (msg.passType == 1) {
      if (this._model.bottleRewardsInfo) {
        this._model.bottleRewardsInfo = this._model.bottleRewardsInfo.concat(
          msg.infos,
        );
      } else {
        this._model.bottleRewardsInfo = msg.infos;
      }
    } else if (msg.passType == 2) {
      //广播数据处理
      //
      let msgs = this.__updateBottleMsgs(msg.infos);
      this._model.bottleLuckShowInfo = msgs;
    }
  }

  /**转换消息 */
  private __updateBottleMsgs(msgs: string[]): string[] {
    let temp = [];
    let count = msgs.length;
    for (let index = 0; index < count; index++) {
      let element = msgs[index];
      let items = element.split("|");
      let users = "";
      let props = "";
      let count = "";
      if (items.length >= 3) {
        users = items[0];
        props = items[1];
        let xml = XmlMgr.Instance.decode(props);
        let tempinfo: t_s_itemtemplateData =
          TempleteManager.Instance.getGoodsTemplatesByTempleteId(
            Number(xml.a.tempid),
          );
        if (tempinfo) props = props.replace("{0}", tempinfo.TemplateNameLang);
        count = items[2];
      }
      let langMsg = LangManager.Instance.GetTranslation(
        "CastleServer.Bottle.Pass",
        users,
        props,
        count,
      );
      temp.push(langMsg);
    }
    return temp;
  }

  /**
   * 更新魔罐界面个人信息
   * 宝箱领取状态, 开启次数
   */
  private __updateBottleResult(pkg: PackageIn): void {
    let msg: BottleScoreMsg = pkg.readBody(BottleScoreMsg) as BottleScoreMsg;

    let addCount: number = msg.count - this._model.openCount;
    this._model.openCount = msg.count;
    this._model.boxMarkStr = msg.treeStatus;
    this._model.isOpenFrame = msg.openView;
    this.dispatchEvent(BottleEvent.CT__UPDATE_BOX_STATUS, {
      addCount: addCount,
      alert: msg.alterBottle,
    });
  }

  /**
   * 魔罐物品列表及次数配置
   * @param pkg
   * dropItem:获得物品列表 <br/>
   *        [BottleItemInfoMsg]    <br/>
   *        tempId:物品ID    <br/>
   *        count:数量        <br/>
   *        isShow:是否展示    <br/>
   *        isNewItems:是否是新物品    <br/>
   */
  private __updateBottleData(pkg: PackageIn): void {
    let msg: BottleDropListMsg = pkg.readBody(
      BottleDropListMsg,
    ) as BottleDropListMsg;
    this._model.id = msg.activeUuid;
    this._model.startTime = Number(msg.startTime);
    this._model.endTime = Number(msg.endTime);
    if (msg.dropItem && msg.dropItem.length > 0) {
      this._model.bottleShowItemInfo = msg.dropItem as BottleItemInfoMsg[];
    }
    if (msg.score && msg.score.length > 0) {
      this._model.countRewardArr = msg.score as BottlePackage[];
      this._model.countRewardArr = ArrayUtils.sortOn(
        this._model.countRewardArr,
        "param",
        ArrayConstant.NUMERIC,
      );
    }
    if (msg.storey && msg.storey.length > 0) {
      this._model.floorRewardArr = msg.storey as BottlePackage[];
      this._model.floorRewardArr = ArrayUtils.sortOn(
        this._model.floorRewardArr,
        "param",
        ArrayConstant.NUMERIC,
      );
    }
    if (this._model.hasOpenFrame) {
      // FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.BOTTLE);
    }

    //删除开关表
    if (
      msg.open &&
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000 <
        this._model.endTime
    ) {
      this.openBottle = true;
    } else {
      this.openBottle = false;
    }
    NotificationManager.Instance.sendNotification(
      NotificationEvent.REFRESH_TOPTOOLS,
    );
  }

  /**
   * 发送开罐信息
   * @param opType:魔罐背包操作类型（0:开启魔罐,1: 全部出售, 2: 全部拾取, 3: 广播消息, 4:打开魔罐界面, 5:领取次数宝箱, 6:领取楼层奖励）
   * @param alterType:魔罐开启类型（1: 1次, 2: 10次, 3: 50次；当op_type = 5,6时, 值为param;即次数或楼层）
   * @param useStick:是否优先使用开启道具
   */
  public sendOpenInfo(
    opType: number = 0,
    alterType: number = 0,
    useStick: boolean = true,
  ): void {
    let msg: BottleOpMsg = new BottleOpMsg();
    msg.alterType = alterType;
    msg.opType = opType;
    if (useStick) {
      msg.stickFirst = 0;
    } else {
      msg.stickFirst = 1;
    }
    SocketManager.Instance.send(C2SProtocol.C_BOTTLE_OP, msg);
  }

  /**
   *黄金神树踩楼奖励用户信息
   * @param pkg
   */
  private __updateBottleUserInfomation(pkg: PackageIn): void {
    let msg: BottleMsg = pkg.readBody(BottleMsg) as BottleMsg;

    this._model.nowLayer = msg.total;
    if (msg.isNewRound) {
      this._model.bottleLuckShowInfo = [];
    }
    // let topLayer:number = this._model.getHeightArray()[4];
    // if(this._model.nowLayer < topLayer || msg.total <= topLayer)
    // {
    //     this._model.nowLayer = msg.total <= topLayer ? msg.total : topLayer;
    // }
    let array: any[];
    let len: number;
    array = msg.playerBottle;
    len = array.length;
    this._model.userArray = [];
    for (let i: number = 0; i < len; i++) {
      let userInfo: BottleUserInfo = new BottleUserInfo();
      userInfo.userId = (array[i] as PlayerBottleMsg).userId;
      userInfo.userName = (array[i] as PlayerBottleMsg).nickName;
      userInfo.isVip = (array[i] as PlayerBottleMsg).isVip;
      userInfo.state = (array[i] as PlayerBottleMsg).state;
      this._model.userArray[i] = userInfo;
    }
    this.dispatchEvent(BottleEvent.UPDATE_REWARD_USERINFO);
  }
}
