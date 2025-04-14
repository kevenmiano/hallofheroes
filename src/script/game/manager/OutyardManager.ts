import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import { NotificationEvent } from "../constant/event/NotificationEvent";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import OutyardAttackInfo from "../module/outyard/data/OutyardAttackInfo";
import OutyardGuildInfo from "../module/outyard/data/OutyardGuildInfo";
import OutyardUserInfo from "../module/outyard/data/OutyardUserInfo";
import OutyardModel from "../module/outyard/OutyardModel";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
//@ts-expect-error: External dependencies
import StackHeadStateMsg = com.road.yishi.proto.stackhead.StackHeadStateMsg;
//@ts-expect-error: External dependencies
import StackHeadBattleDefenceMsg = com.road.yishi.proto.stackhead.StackHeadBattleDefenceMsg;
//@ts-expect-error: External dependencies
import StackHeadSelfMsg = com.road.yishi.proto.stackhead.StackHeadSelfMsg;
//@ts-expect-error: External dependencies
import StackHeadFullMsg = com.road.yishi.proto.stackhead.StackHeadFullMsg;
//@ts-expect-error: External dependencies
import StackHeadGuildInfoMsg = com.road.yishi.proto.stackhead.StackHeadGuildInfoMsg;
//@ts-expect-error: External dependencies
import StackHeadAttackMsg = com.road.yishi.proto.stackhead.StackHeadAttackMsg;
//@ts-expect-error: External dependencies
import StackHeadUpdateMsg = com.road.yishi.proto.stackhead.StackHeadUpdateMsg;
//@ts-expect-error: External dependencies
import StackHeadSimpleGuildMsg = com.road.yishi.proto.stackhead.StackHeadSimpleGuildMsg;
//@ts-expect-error: External dependencies
import StackHeadGuildUserListMsg = com.road.yishi.proto.stackhead.StackHeadGuildUserListMsg;
//@ts-expect-error: External dependencies
import StackHeadGuildUserMsg = com.road.yishi.proto.stackhead.StackHeadGuildUserMsg;
//@ts-expect-error: External dependencies
import StackHeadSeniorGeneralMsg = com.road.yishi.proto.stackhead.StackHeadSeniorGeneralMsg;
//@ts-expect-error: External dependencies
import StackHeadRequestMsg = com.road.yishi.proto.stackhead.StackHeadRequestMsg;
//@ts-expect-error: External dependencies
import StackHeadRespMsg = com.road.yishi.proto.stackhead.StackHeadRespMsg;
//@ts-expect-error: External dependencies
import StackHeadReportListMsg = com.road.yishi.proto.stackhead.StackHeadReportListMsg;
//@ts-expect-error: External dependencies
import StackHeadReportMsg = com.road.yishi.proto.stackhead.StackHeadReportMsg;
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import { MessageTipManager } from "./MessageTipManager";
import LangManager from "../../core/lang/LangManager";
import OutyardReportInfo from "../module/outyard/data/OutyardReportInfo";
import ConfigInfoManager from "./ConfigInfoManager";
export default class OutyardManager {
  private static _instance: OutyardManager;
  private _stateMsg: StackHeadStateMsg;
  private _battleDefenceMsg: StackHeadBattleDefenceMsg;
  private _selfMsg: StackHeadSelfMsg;
  private _noticeStr: string = "";
  private _myGuildPos: number = 0;

  private _memberList: SimpleDictionary;
  private _nomalArr: Array<OutyardUserInfo> = [];
  private _seniorArr: Array<OutyardUserInfo> = [];
  private _guildArr: Array<OutyardGuildInfo> = [];
  private _attackArr: Array<OutyardAttackInfo> = [];

  public static OPEN_FRAME: number = 1; // 1 打开界面
  public static HEART: number = 2; // 2 心跳
  public static CLOSE_FRAME: number = 3; // 3 关闭界面
  public static DEFENCE_BUFF: number = 4; // 4 守备buff祝福
  public static ATTACK_BUFF: number = 5; // 5 进攻buff祝福
  public static ATTACK: number = 6; // 6 攻打
  public static REQUEST_LIST: number = 7; // 7 公会守备人员列表
  public static SET_SENIOR: number = 8; // 8 设置大将
  public static CHANGE_NOTICE: number = 9; // 9 修改通知
  public static BUY_EXECUTION: number = 10; //10 购买行动力
  public static ENTER: number = 11; //11 公会报名
  public static REFRESH_REPORT: number = 12; //12 刷新战报
  private _AttackReportArr: Array<OutyardReportInfo> = []; //进攻战报
  private _defenceReportArr: Array<OutyardReportInfo> = []; //防守战报

  private _model: OutyardModel;
  public canRefreshReport: boolean = false;
  public MAX_COUNT: number = 30;
  public defenceDebuffArr: Array<number> = [];
  constructor() {
    this._model = new OutyardModel();
    this.defenceDebuffArr =
      ConfigInfoManager.Instance.getStackHeadDefenceDebuff();
  }

  public static get Instance(): OutyardManager {
    if (!OutyardManager._instance) {
      OutyardManager._instance = new OutyardManager();
    }
    return OutyardManager._instance;
  }

  public setup() {
    this.initEvent();
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_STACK_HEAD_STATE,
      this,
      this.__stateInfoHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_STACK_HEAD_FULL,
      this,
      this.__fullInfoHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_STACK_HEAD_UPDATE,
      this,
      this.__updateHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_STACK_HEAD_USER_LIST,
      this,
      this.__userlistHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_STACK_HEAD_BATTLE_DEFENCE,
      this,
      this.__battleDefenceHandler,
    ); //战斗中对手信息
    ServerDataManager.listen(
      S2CProtocol.U_C_STACK_HEAD_SELF,
      this,
      this.__selfInfoHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_STACK_HEAD_SERVERSTATE,
      this,
      this.__broadInfoHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_STACK_HEAD_RESP,
      this,
      this.__exitHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_STACK_HEAD_REPORT,
      this,
      this.__reportHandler,
    );
  }

  //战报
  private __reportHandler(pkg: PackageIn) {
    let msg: StackHeadReportListMsg = pkg.readBody(
      StackHeadReportListMsg,
    ) as StackHeadReportListMsg;
    if (msg) {
      if (msg.type == 1) {
        //进攻列表
        if (!this._AttackReportArr) {
          this._AttackReportArr = [];
        }
        let outyardReportInfo: OutyardReportInfo;
        for (let i: number = 0; i < msg.list.length; i++) {
          outyardReportInfo = this.readReport(
            msg.list[i] as StackHeadReportMsg,
          );
          this._AttackReportArr.push(outyardReportInfo);
        }
        this._AttackReportArr = ArrayUtils.sortOn(
          this._AttackReportArr,
          "timestamp",
          ArrayConstant.DESCENDING,
        );
      } else if (msg.type == 2) {
        //防守列表
        if (!this._defenceReportArr) {
          this._defenceReportArr = [];
        }
        let outyardReportInfo: OutyardReportInfo;
        for (let i: number = 0; i < msg.list.length; i++) {
          outyardReportInfo = this.readReport(
            msg.list[i] as StackHeadReportMsg,
          );
          this._defenceReportArr.push(outyardReportInfo);
        }
        this._defenceReportArr = ArrayUtils.sortOn(
          this._defenceReportArr,
          "timestamp",
          ArrayConstant.DESCENDING,
        );
      }
      if (msg.list.length < this.MAX_COUNT) {
        this.canRefreshReport = false;
      } else {
        this.canRefreshReport = true;
      }
    }
    if (
      (this._AttackReportArr &&
        this._AttackReportArr.length > this.MAX_COUNT) ||
      (this._defenceReportArr && this._defenceReportArr.length > this.MAX_COUNT)
    ) {
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.OUTYARD_REFRESH_REPORT,
      );
    } else {
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.OUTYARD_INIT_REPORT,
      );
    }
  }

  private readReport(
    stackHeadReportMsg: StackHeadReportMsg,
  ): OutyardReportInfo {
    let outyardReportInfo: OutyardReportInfo = new OutyardReportInfo();
    outyardReportInfo.sourceGuildName = stackHeadReportMsg.sourceGuildName;
    outyardReportInfo.sourceUserNickName =
      stackHeadReportMsg.sourceUserNickName;
    outyardReportInfo.rivalGuildName = stackHeadReportMsg.rivalGuildName;
    outyardReportInfo.rivalUserNickName = stackHeadReportMsg.rivalUserNickName;
    outyardReportInfo.rivalIsNpc = stackHeadReportMsg.rivalIsNpc;
    outyardReportInfo.isWin = stackHeadReportMsg.isWin;
    outyardReportInfo.defenceDebuffLevel =
      stackHeadReportMsg.defenceDebuffLevel;
    outyardReportInfo.changeScore = stackHeadReportMsg.changeScore;
    outyardReportInfo.reportTime = stackHeadReportMsg.reportTime;
    outyardReportInfo.timestamp = stackHeadReportMsg.timestamp;
    return outyardReportInfo;
  }

  private __exitHandler(pkg: PackageIn) {
    let msg: StackHeadRespMsg = pkg.readBody(
      StackHeadRespMsg,
    ) as StackHeadRespMsg;
    if (msg.op == OutyardManager.CLOSE_FRAME) {
      if (msg.result) {
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.OUTYARD_CLOSE_WND,
        );
      }
    }
  }

  private __broadInfoHandler(pkg: PackageIn) {
    let msg: StackHeadStateMsg = pkg.readBody(
      StackHeadStateMsg,
    ) as StackHeadStateMsg;
    if (this._stateMsg) {
      this._stateMsg.state = msg.state;
      this._stateMsg.openTime = msg.openTime;
      this._stateMsg.timestamp = msg.timestamp;
      this._stateMsg.index = msg.index;
      this._stateMsg.session = msg.session;
      this._stateMsg.canSignin = msg.canSignin;
    } else {
      this._stateMsg = msg;
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.OUTYARD_STATE_INFO,
    );
  }

  //外域游戏状态
  private __stateInfoHandler(pkg: PackageIn) {
    let msg: StackHeadStateMsg = pkg.readBody(
      StackHeadStateMsg,
    ) as StackHeadStateMsg;
    if (this._stateMsg) {
      this._stateMsg.state = msg.state;
      this._stateMsg.openTime = msg.openTime;
      this._stateMsg.timestamp = msg.timestamp;
      this._stateMsg.index = msg.index;
      this._stateMsg.session = msg.session;
      this._stateMsg.canSignin = msg.canSignin;
      this._stateMsg.myGuildSignup = msg.myGuildSignup;
      this._stateMsg.myGuildJoin = msg.myGuildJoin;
    } else {
      this._stateMsg = msg;
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.OUTYARD_STATE_INFO,
    );
  }

  //外域完整数据
  private __fullInfoHandler(pkg: PackageIn) {
    let msg: StackHeadFullMsg = pkg.readBody(
      StackHeadFullMsg,
    ) as StackHeadFullMsg;
    this._noticeStr = msg.notice;
    if (msg.op == OutyardManager.OPEN_FRAME) {
      this._guildArr = [];
      this._attackArr = [];
      let i: number;
      let j: number;
      let guild: OutyardGuildInfo;
      let attack: OutyardAttackInfo;
      let guildMsg: StackHeadGuildInfoMsg;
      let attackMsg: StackHeadAttackMsg;
      if (!msg.battleField) return;
      let guildList: Array<any> = msg.battleField.guildInfoList;
      let attackList: Array<any> = msg.battleField.attackList;
      this._myGuildPos = msg.battleField.myGuildPos;

      for (i = 0; i < guildList.length; i++) {
        guildMsg = guildList[i] as StackHeadGuildInfoMsg;
        guild = new OutyardGuildInfo();
        guild.guildUid = guildMsg.guildUid;
        guild.guildName = guildMsg.guildName;
        guild.site = guildMsg.site;
        guild.currentScore = guildMsg.currentScore;
        guild.battleFieldUid = guildMsg.battleFieldUid;
        guild.crossServerId = guildMsg.crossServerId;
        guild.attackBuffLevel = guildMsg.attackBuffLevel;
        guild.defenceBuffLevel = guildMsg.defenceBuffLevel;
        guild.serverName = guildMsg.serverName;
        guild.pos = guildMsg.pos;
        guild.defenceArmyAlive = guildMsg.defenceArmyAlive;
        guild.defenceArmyTotal = guildMsg.defenceArmyTotal;
        if (guildMsg.pos == msg.battleField.myGuildPos) {
          //是我自己
          guild.isMySelf = true;
        } else {
          guild.isMySelf = false;
        }
        this._guildArr.push(guild);
      }
      this._attackArr.push(new OutyardAttackInfo(1, 2));
      this._attackArr.push(new OutyardAttackInfo(1, 3));
      this._attackArr.push(new OutyardAttackInfo(1, 4));
      this._attackArr.push(new OutyardAttackInfo(2, 1));
      this._attackArr.push(new OutyardAttackInfo(2, 3));
      this._attackArr.push(new OutyardAttackInfo(2, 4));
      this._attackArr.push(new OutyardAttackInfo(3, 1));
      this._attackArr.push(new OutyardAttackInfo(3, 2));
      this._attackArr.push(new OutyardAttackInfo(3, 4));
      this._attackArr.push(new OutyardAttackInfo(4, 1));
      this._attackArr.push(new OutyardAttackInfo(4, 2));
      this._attackArr.push(new OutyardAttackInfo(4, 3));

      for (i = 0; i < attackList.length; i++) {
        attackMsg = attackList[i] as StackHeadAttackMsg;
        for (j = 0; j < this._attackArr.length; j++) {
          attack = this._attackArr[j] as OutyardAttackInfo;
          if (attack.key == attackMsg.fromPos + "_" + attackMsg.toPos) {
            attack.totalCount = attackMsg.totalCount;
          }
        }
      }
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.OUTYARD_OPEN_FRAME,
      );
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.OUTYARD_FULL_INFO,
    );
  }

  //外域更新数据
  private __updateHandler(pkg: PackageIn) {
    let msg: StackHeadUpdateMsg = pkg.readBody(
      StackHeadUpdateMsg,
    ) as StackHeadUpdateMsg;
    let i: number;
    let j: number;
    let guild: OutyardGuildInfo;
    let guildMsg: StackHeadSimpleGuildMsg;
    let guildList: Array<any> = msg.guildInfoList;

    for (i = 0; i < guildList.length; i++) {
      guildMsg = guildList[i] as StackHeadSimpleGuildMsg;
      for (j = 0; j < this._guildArr.length; j++) {
        guild = this._guildArr[j] as OutyardGuildInfo;
        if (guild.pos == guildMsg.pos) {
          guild.currentScore = guildMsg.currentScore;
          guild.attackBuffLevel = guildMsg.attackBuffLevel;
          guild.defenceBuffLevel = guildMsg.defenceBuffLevel;
          guild.defenceArmyAlive = guildMsg.defenceArmyAlive;
        }
      }
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.OUTYARD_UPDATE_INFO,
      msg.attackList,
    );
  }

  //外域公会成员列表
  private __userlistHandler(pkg: PackageIn) {
    let msg: StackHeadGuildUserListMsg = pkg.readBody(
      StackHeadGuildUserListMsg,
    ) as StackHeadGuildUserListMsg;
    this._seniorArr = [];
    let info: OutyardUserInfo;
    let normalMsg: StackHeadGuildUserMsg;
    let seniorMsg: StackHeadSeniorGeneralMsg;
    let i: number = 0;
    let j: number = 0;
    if (msg.op == OutyardManager.REQUEST_LIST) {
      //公会守备人员列表
      for (i = 0; i < msg.seniorGeneralUser.length; i++) {
        seniorMsg = msg.seniorGeneralUser[i] as StackHeadSeniorGeneralMsg;
        let info1: OutyardUserInfo = new OutyardUserInfo();
        info1.index = seniorMsg.index;
        info1.alive = seniorMsg.alive;
        info1.inBattle = seniorMsg.inBattle;
        info1.userUid = seniorMsg.userUid;
        this._seniorArr.push(info1);
      }

      this._nomalArr = [];
      this._memberList = new SimpleDictionary();
      for (i = 0; i < msg.userList.length; i++) {
        normalMsg = msg.userList[i] as StackHeadGuildUserMsg;
        info = new OutyardUserInfo();
        info.userUid = normalMsg.userUid;
        info.userId = normalMsg.userid;
        info.nickName = normalMsg.nickName;
        info.defenceAlive = normalMsg.defenceAlive;
        info.defenceDebuffLevel = normalMsg.defenceDebuffLevel;
        info.fightingCapacity = normalMsg.fightCapacity;
        info.grades = normalMsg.grade;
        info.transGrade = normalMsg.transGrade;
        info.changeBranch = normalMsg.changeBranch;
        info.job = normalMsg.job;
        info.index = this.inSeniorArrIndex(info);
        this._nomalArr.push(info);
        this._memberList.add(info.userUid, info);
      }
      this._nomalArr = ArrayUtils.sortOn(
        this._nomalArr,
        ["fightingCapacity", "job", "grades"],
        [
          ArrayConstant.DESCENDING,
          ArrayConstant.DESCENDING,
          ArrayConstant.DESCENDING,
        ],
      );
      this._model.memberList = this._memberList;

      for (i = 0; i < this._seniorArr.length; i++) {
        let outyardUserInfo: OutyardUserInfo = this._seniorArr[i];
        for (j = 0; j < this._nomalArr.length; j++) {
          info = this._nomalArr[j] as OutyardUserInfo;
          if (outyardUserInfo.userUid == info.userUid) {
            outyardUserInfo = info.copy(outyardUserInfo);
          }
        }
      }
    } else if (msg.op == OutyardManager.SET_SENIOR) {
      //设置大将
      for (i = 0; i < msg.seniorGeneralUser.length; i++) {
        seniorMsg = msg.seniorGeneralUser[i] as StackHeadSeniorGeneralMsg;
        let info2: OutyardUserInfo = new OutyardUserInfo();
        for (j = 0; j < this._nomalArr.length; j++) {
          info = this._nomalArr[j] as OutyardUserInfo;
          if (seniorMsg.userUid == info.userUid) {
            info2 = info.copy(info2);
          }
        }
        info2.index = seniorMsg.index;
        info2.alive = seniorMsg.alive;
        info2.inBattle = seniorMsg.inBattle;
        if (this._memberList.get(info2.userUid)) {
          let outyardUserInfo: OutyardUserInfo = this._memberList.get(
            info2.userUid,
          );
          outyardUserInfo.index = this.inSeniorArrIndex(info2);
          this._memberList.set(info2.userUid, outyardUserInfo);
        }
        this._seniorArr.push(info2);
      }
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("outyard.setMainSolider"),
      );
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.OUTYARD_USERLIST_INFO,
    );
  }

  private inSeniorArrIndex(info: OutyardUserInfo): number {
    let index: number = 0;
    let len: number = this._seniorArr.length;
    let item: OutyardUserInfo;
    for (let i: number = 0; i < len; i++) {
      item = this._seniorArr[i];
      if (item && info && item.userUid == info.userUid) {
        index = item.index;
        break;
      }
    }
    return index;
  }

  //战斗对手信息
  private __battleDefenceHandler(pkg: PackageIn) {
    let msg: StackHeadBattleDefenceMsg = pkg.readBody(
      StackHeadBattleDefenceMsg,
    ) as StackHeadBattleDefenceMsg;
    this._battleDefenceMsg = msg;
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.OUTYARD_BATTLE_DEFENCE,
    );
  }

  //外域自身信息
  private __selfInfoHandler(pkg: PackageIn) {
    let msg: StackHeadSelfMsg = pkg.readBody(
      StackHeadSelfMsg,
    ) as StackHeadSelfMsg;
    this._selfMsg = msg;
    PlayerManager.Instance.currentPlayerModel.playerInfo.outyardCostEnergy =
      msg.weekPoint;
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.OUTYARD_SELF_INFO,
    );
  }

  public get stateMsg(): StackHeadStateMsg {
    return this._stateMsg;
  }

  public get battleDefenceMsg(): StackHeadBattleDefenceMsg {
    return this._battleDefenceMsg;
  }

  public get selfMsg(): StackHeadSelfMsg {
    return this._selfMsg;
  }

  public get noticeStr(): string {
    return this._noticeStr;
  }

  public get myGuildPos(): number {
    return this._myGuildPos;
  }

  public get myGuild(): OutyardGuildInfo {
    let guild: OutyardGuildInfo;
    for (let i: number = 0; i < this._guildArr.length; i++) {
      guild = this._guildArr[i] as OutyardGuildInfo;
      if (guild.pos == this._myGuildPos) {
        return guild;
      }
    }
    return null;
  }

  public get guildArr(): Array<OutyardGuildInfo> {
    return this._guildArr;
  }

  public get attackArr(): Array<OutyardAttackInfo> {
    return this._attackArr;
  }

  public get attackReportArr(): Array<OutyardReportInfo> {
    return this._AttackReportArr;
  }

  public setAttackReportArr(value: Array<OutyardReportInfo>) {
    this._AttackReportArr = value;
  }

  public get defenceReportArr(): Array<OutyardReportInfo> {
    return this._defenceReportArr;
  }

  public setDefenceReportArr(value: Array<OutyardReportInfo>) {
    this._defenceReportArr = value;
  }

  public getMemberArrByType(type: number): Array<OutyardUserInfo> {
    if (type == 0) {
      return this._nomalArr;
    }
    return this._seniorArr;
  }

  public get model(): OutyardModel {
    return this._model;
  }

  public OperateOutyard(
    op: number,
    pos: number = 0,
    notice: string = "",
    senior: StackHeadSeniorGeneralMsg = null,
    param1: number = 0,
  ) {
    let msg: StackHeadRequestMsg = new StackHeadRequestMsg();
    msg.op = op;
    msg.pos = pos;
    msg.notice = notice;
    msg.seniorGeneral = senior;
    msg.param1 = param1;
    SocketManager.Instance.send(C2SProtocol.C_STACK_HEAD_REQUEST, msg);
  }
}
