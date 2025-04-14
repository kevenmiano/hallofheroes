import AudioManager from "../../core/audio/AudioManager";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LangManager from "../../core/lang/LangManager";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import Dictionary from "../../core/utils/Dictionary";
import ObjectTranslator from "../../core/utils/ObjectTranslator";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import {
  ChatEvent,
  FindResultEvent,
  FriendGroupEvent,
  FriendUpdateEvent,
} from "../constant/event/NotificationEvent";
import { PlayerEvent } from "../constant/event/PlayerEvent";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import RelationType from "../constant/RelationType";
import { SoundIds } from "../constant/SoundIds";
import { StateType } from "../constant/StateType";
import { ChatChannel } from "../datas/ChatChannel";
import FriendGroupId from "../datas/FriendGroupId";
import FriendGroupInfo from "../datas/FriendGroupInfo";
import FriendModel from "../datas/model/FriendModel";
import IMModel from "../datas/model/IMModel";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { RecommendInfo } from "../datas/RecommendInfo";
import RequestInfoRientation from "../datas/RequestInfoRientation";
import ToolInviteInfo from "../datas/ToolInviteInfo";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import ChatData from "../module/chat/data/ChatData";
import { ArmyManager } from "./ArmyManager";
import { FriendSocketOutManager } from "./FriendSocketOutManager";
import IMManager from "./IMManager";
import { MessageTipManager } from "./MessageTipManager";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
import { SharedManager } from "./SharedManager";
import { VIPManager } from "./VIPManager";
//@ts-expect-error: External dependencies
import ChatStateListRspMsg = com.road.yishi.proto.chat.ChatStateListRspMsg;
//@ts-expect-error: External dependencies
import IsInBlackListMsg = com.road.yishi.proto.chat.IsInBlackListMsg;
//@ts-expect-error: External dependencies
import FriendAddMsgList = com.road.yishi.proto.friend.FriendAddMsgList;
//@ts-expect-error: External dependencies
import FriendAddedMsg = com.road.yishi.proto.friend.FriendAddedMsg;
//@ts-expect-error: External dependencies
import FriendAddedMsgAct = com.road.yishi.proto.friend.FriendAddedMsgAct;
//@ts-expect-error: External dependencies
import FriendPlayer = com.road.yishi.proto.friend.FriendPlayer;
//@ts-expect-error: External dependencies
import FriendRelationMsg = com.road.yishi.proto.friend.FriendRelationMsg;
//@ts-expect-error: External dependencies
import MoveFriendReqMsg = com.road.yishi.proto.friend.MoveFriendReqMsg;
//@ts-expect-error: External dependencies
import RecommendListMsg = com.road.yishi.proto.friend.RecommendListMsg;
//@ts-expect-error: External dependencies
import FriendGroupMsg = com.road.yishi.proto.simple.FriendGroupMsg;
//@ts-expect-error: External dependencies
import FriendInfoMsg = com.road.yishi.proto.simple.FriendInfoMsg;
//@ts-expect-error: External dependencies
import FriendSearchRspMsg = com.road.yishi.proto.simple.FriendSearchRspMsg;
//@ts-expect-error: External dependencies
import SNSInfoMsg = com.road.yishi.proto.simple.SNSInfoMsg;
//@ts-expect-error: External dependencies
import ChatStateMsg = com.road.yishi.proto.chat.ChatStateMsg;
//@ts-expect-error: External dependencies
import FriendSearchNickNameRspMsg = com.road.yishi.proto.friend.FriendSearchNickNameRspMsg;
import { TimerEvent } from "../utils/TimerTicker";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";

/**
 * 主要负责好友模块的协议处理, 提供协议发送、数据操作的API
 */
export class FriendManager extends GameEventDispatcher {
  /**
   *最大好友分组数量
   */
  public static MAX_GROUP_NUM: number = 4;
  public static COUNT_DOWN: number = 5;
  /** 每次登录或者升级后要显示推荐红点 */
  public static SHOW_RED_DOT: boolean = true;
  private _friendList: SimpleDictionary;
  /** 最近联系过的人 */
  private _recentPrivatePerson: ThaneInfo[];
  /** 正在聊天的人 头像列表 */
  private _talkingPerson: ThaneInfo[];
  private _groupDic: SimpleDictionary;
  private _requirDic: SimpleDictionary;
  private _bufferList: SimpleDictionary;
  private _model: FriendModel = new FriendModel();
  private _isUpgrade: boolean = false;
  private _isInBlackList: boolean = false; //是否被对方加入黑名单

  public get model(): FriendModel {
    return this._model;
  }

  public get isInBlackList(): boolean {
    return this._isInBlackList;
  }

  constructor() {
    super();
  }

  public init() {
    this._toolInviteFriend = [];
    this._bufferList = new SimpleDictionary();
    this._requirDic = new SimpleDictionary();
    this._recentPrivatePerson = [];
    this._talkingPerson = [];
    this._friendList = new SimpleDictionary();
    this._groupDic = new SimpleDictionary();
    this.initEvent();
  }

  public setup(obj1: any, obj2: any) {
    this.initRelationList(obj1);
    this.initGroupList(obj2);
    this.sendRecommendFriendRequest();
  }

  public addFriends(obj1: any, obj2: any) {
    this.initRelationList(obj1, false);
    this.initGroupList(obj2);
  }

  private initRelationList(obj: Array<any>, getShared: boolean = false) {
    //初始化好友列表
    let arr: any[] = obj;
    for (const key in arr) {
      if (arr.hasOwnProperty(key)) {
        let info = arr[key];
        this._friendList.add(info.userId, info);
      }
    }
    // if (getShared) {
    //     arr = SharedManager.Instance.recentList;　　//从缓存取出最近联系人列表, 并分别向服务器请求最近联系人信息
    //     if (!arr) {
    //         return;
    //     }
    //     for (let i: number = 0; i < arr.length; i++) {
    //         this.reqPrivatePerson(Number(arr[i]));
    //     }
    // }
  }

  private initGroupList(obj: Array<any>) {
    //初始化自定义分组列表
    let defaultGroup = new FriendGroupInfo();
    let list: any[] = obj;
    defaultGroup.groupId = FriendGroupId.FRIEND;
    defaultGroup.groupName =
      LangManager.Instance.GetTranslation("public.friend");
    this._groupDic.add(defaultGroup.groupId, defaultGroup);
    for (const key in list) {
      if (list.hasOwnProperty(key)) {
        let gInfo: FriendGroupInfo = list[key];
        this._groupDic.add(gInfo.groupId, gInfo);
      }
    }
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_CH_ADD_RELATIONSHIP,
      this,
      this.__addFriend,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_REMOVE_RELATIONSHIP,
      this,
      this.__removeFriend,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIEND_LOGIN,
      this,
      this.__friendLogin,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIEND_LOGOUT,
      this,
      this.__friendLoginOut,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIENDADD_CONFIRM,
      this,
      this.__addFriendConfirmHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_RECOMMENDLIST,
      this,
      this._recommendFriend,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIEND_UPDATE,
      this,
      this.__updateFriend,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_ADD_GROUP,
      this,
      this.__addGroupHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_DEL_GROUP,
      this,
      this.__delGroupHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_RENAME_GROUP,
      this,
      this.__renameGroupHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIEND_MOVE,
      this,
      this.__moveFriendHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIEND_ADDED,
      this,
      this.__friendAddHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_CHAT_STATE,
      this,
      this.__recentContactStateUpdateHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIEND_SEARCH,
      this,
      this.__findFriendHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIEND_SEARCH_NICKNAME,
      this,
      this.__findFriendByNameHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIEND_UPDATE_PLAYINFO,
      this,
      this.__friendInfoUpdate,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIEND_ADDED_LIST,
      this,
      this.__friendAddListHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_FRIEND_REQMSG_ACT,
      this,
      this.__friendAddedMsgActHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_CH_INBLACK_LIST,
      this,
      this._recvInBlackList,
    );
    this.thane.addEventListener(
      PlayerEvent.THANE_LEVEL_UPDATE,
      this.__levelUpgradeHandler,
      this,
    );
  }

  protected get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private _recvInBlackList(pkg: PackageIn) {
    let msg: IsInBlackListMsg = pkg.readBody(IsInBlackListMsg);
    this._isInBlackList = msg.isInBlackList;
    NotificationManager.Instance.dispatchEvent(
      ChatEvent.BLACKLIST,
      this._isInBlackList,
    );
  }

  private __friendInfoUpdate(pkg: PackageIn) {
    let msg: FriendInfoMsg = pkg.readBody(FriendInfoMsg);
    let id: number = msg.userId;
    if (this._friendList[id]) {
      let info = this._friendList[id];
      let targetInfo: ThaneInfo = info;
      targetInfo.beginChanges();
      targetInfo.grades = msg.grades;
      targetInfo.nickName = msg.nickName;
      targetInfo.frameId = msg.frameId;
      info.commit();
    }
  }

  /**
   * 按条件查找好友返回结果
   */
  private __findFriendHandler(pkg: PackageIn) {
    let msg: FriendSearchRspMsg = pkg.readBody(FriendSearchRspMsg);
    let totalPage: number = Math.ceil(
      msg.totalRows / FriendModel.FIND_RESULTS_PER_PAGE,
    );
    let list: any[] = [];
    for (let i = 0; i < msg.snsInfo.length; i++) {
      const smsg: SNSInfoMsg = msg.snsInfo[i] as SNSInfoMsg;
      let cls = Laya.ClassUtils.getClass("BaseSnsInfo");
      let info = new cls();
      info.userId = smsg.userId;
      info.nickName = smsg.nickname;
      info.sign = smsg.signDesc;
      info.sex = smsg.sex;
      info.birthdayType = smsg.birthdayType;
      info.birthYear = smsg.birthYear;
      info.birthMonth = smsg.birthMonth;
      info.birthDay = smsg.birthDay;
      info.horoscope = smsg.starId;
      info.bloodType = smsg.bloodType;
      info.country = smsg.country;
      info.province = smsg.province;
      info.city = smsg.city;
      info.headId = smsg.headId;
      list.push(info);
    }
    this.dispatchEvent(FindResultEvent.GET_FIND_RESULTS, list, totalPage);
  }

  /**
   * 按昵称查找好友返回结果
   */
  private __findFriendByNameHandler(pkg: PackageIn) {
    let msg: FriendSearchNickNameRspMsg = pkg.readBody(
      FriendSearchNickNameRspMsg,
    ) as FriendSearchNickNameRspMsg;
    let friend: FriendPlayer;
    let info: RecommendInfo;
    let list: RecommendInfo[] = [];
    for (let i: number = 0; i < msg.list.length; i++) {
      friend = msg.list[i] as FriendPlayer;
      info = new RecommendInfo();
      info.id = friend.playerId;
      info.name = friend.nickName;
      info.level = friend.level;
      info.sex = friend.sex;
      info.attack = friend.attack;
      info.mapname = friend.mapName;
      info.headId = friend.headId;
      info.frameId = friend.frameId;
      info.job = friend.job;
      list.push(info);
    }
    if (list.length > 0)
      this.dispatchEvent(FindResultEvent.GET_FIND_RESULTS_BY_NAME, list);
    else
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "friends.findfriend.FindResultFrame.unfindTip",
        ),
      );
  }

  private __recentContactStateUpdateHandler(pkg: PackageIn) {
    let msg = pkg.readBody(ChatStateListRspMsg) as ChatStateListRspMsg;

    for (let i = 0; i < msg.chatState.length; i++) {
      const recent: ChatStateMsg = msg.chatState[i] as ChatStateMsg;
      let info: ThaneInfo = this.getRecentInfoById(recent.userId);
      if (info) {
        info.state = recent.chatState;
      }
    }
    this.dispatchEvent(FriendUpdateEvent.RECENT_CONTACT_UPDATE, null);
  }

  /**单个操作返回 */
  private __friendAddedMsgActHandler(pkg: PackageIn) {
    let msg: FriendAddedMsgAct = pkg.readBody(
      FriendAddedMsgAct,
    ) as FriendAddedMsgAct;
    let op = msg.op;
    if (op == 0) {
      let reqId = msg.reqId;
      for (let i: number = 0; i < this._toolInviteFriend.length; i++) {
        if (reqId == this._toolInviteFriend[i].reqId) {
          this._toolInviteFriend.splice(i, 1);
          break;
        }
      }
    } else {
      this._toolInviteFriend = [];
    }
    NotificationManager.Instance.dispatchEvent(
      FriendUpdateEvent.INVITE_UPDATE,
      null,
    );
  }

  /**
   * 玩家添加信息列表
   */
  private __friendAddListHandler(pkg: PackageIn) {
    let msg: FriendAddMsgList = pkg.readBody(
      FriendAddMsgList,
    ) as FriendAddMsgList;
    if (
      ArmyManager.Instance.thane.grades < 6 ||
      PlayerManager.Instance.currentPlayerModel.playerInfo.refuseFriend
    ) {
      return;
    }
    let list = msg.list;
    for (let index = 0; index < list.length; index++) {
      let listItem = list[index];
      let invite: ToolInviteInfo = new ToolInviteInfo();
      invite.grades = listItem.grades;
      invite.id = listItem.userId;
      invite.nickName = listItem.nickName;
      invite.sex = listItem.sex;
      invite.reqId = listItem.reqId;
      this.addToolInviteFriend(invite);
    }
    NotificationManager.Instance.dispatchEvent(
      FriendUpdateEvent.INVITE_UPDATE,
      null,
    );
  }

  /**
   * 收到好友申请
   */
  private __friendAddHandler(pkg: PackageIn) {
    let msg: FriendAddedMsg = pkg.readBody(FriendAddedMsg) as FriendAddedMsg;
    if (
      ArmyManager.Instance.thane.grades < 6 ||
      PlayerManager.Instance.currentPlayerModel.playerInfo.refuseFriend
    ) {
      return;
    }
    let invite: ToolInviteInfo = new ToolInviteInfo();
    invite.grades = msg.grades;
    invite.id = msg.userId;
    invite.nickName = msg.nickName;
    invite.sex = msg.sex;
    invite.reqId = msg.reqId;
    this.addToolInviteFriend(invite);
  }

  private __confirmAddFriend(b: boolean, nickName: string, id: number) {
    if (b) {
      FriendSocketOutManager.sendAddFriendRequest(
        nickName,
        RelationType.FRIEND,
      );
    }
  }

  /**
   * 通过userId获取好友info
   */
  public getFriendById(id: number): ThaneInfo {
    for (const key in this._friendList) {
      if (this._friendList.hasOwnProperty(key)) {
        let info: ThaneInfo = this._friendList[key];
        if (info.userId == id) {
          return info;
        }
      }
    }
    return null;
  }

  /**
   * 加好友验证
   */
  private __addFriendConfirmHandler(pkg: PackageIn) {
    let msg: FriendRelationMsg = pkg.readBody(
      FriendRelationMsg,
    ) as FriendRelationMsg;
    let name: string = msg.nickName;
    let noticeMsg: string = msg.noticeMsg;
    let reqId = msg.reqId;

    if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
      this._bufferList.add(name, { message: noticeMsg });
      // MainToolBar.Instance.blinkFriendBtnNoTime();
    } else if (!this._requirDic[name]) {
      this.createApplyFriendFrame(name, noticeMsg);
    }
  }

  public noteApplyPopFrame(name: string) {
    this._requirDic[name] = true;
  }

  public removeNoteApplyPopFrame(name: string) {
    this._requirDic.del(name);
  }

  public createApplyFriendFrame(name: string, msg: string) {
    if (this.thane.grades <= 6) {
      return;
    }
    // PopFrameCheck.Instance.addAction(new ApplyFriendAction(name, msg));
  }

  public popBufferFrame() {
    let arr: any[] = this._bufferList.splice(0, 1);
    if (arr.length > 0) {
      this.createApplyFriendFrame(arr[0].key, arr[0].value);
    }
  }

  /**
   * 添加分组返回
   */
  private __addGroupHandler(pkg: PackageIn) {
    let msg: FriendGroupMsg = pkg.readBody(FriendGroupMsg) as FriendGroupMsg;

    let gInfo: FriendGroupInfo = new FriendGroupInfo();
    gInfo.groupId = msg.groupId;
    gInfo.groupName = msg.groupName;
    this._groupDic.add(gInfo.groupId, gInfo);
    this.dispatchEvent(FriendGroupEvent.ADD_GROUP, gInfo);
  }

  /**
   * 删除分组返回
   */
  private __delGroupHandler(pkg: PackageIn) {
    let msg: FriendGroupMsg = pkg.readBody(FriendGroupMsg) as FriendGroupMsg;
    let gInfo: FriendGroupInfo = this._groupDic[msg.groupId];
    if (gInfo) {
      this.changeListGroup(gInfo.groupId, FriendGroupId.FRIEND);
      this._groupDic.del(gInfo.groupId);
      this.dispatchEvent(FriendGroupEvent.DEL_GROUP, gInfo);
    }
  }

  /**
   * 重命名分组
   */
  private __renameGroupHandler(pkg: PackageIn) {
    let msg: FriendGroupMsg = pkg.readBody(FriendGroupMsg) as FriendGroupMsg;
    let group: FriendGroupInfo = this._groupDic[msg.groupId];
    if (group) {
      group.groupName = msg.groupName;
      this.dispatchEvent(FriendGroupEvent.RENAME_GROUP, group);
    }
  }

  /**
   * 移动分组好友返回
   */
  private __moveFriendHandler(pkg: PackageIn) {
    let msg: MoveFriendReqMsg = pkg.readBody(
      MoveFriendReqMsg,
    ) as MoveFriendReqMsg;

    if (msg.result == 1 && this._friendList[msg.firendId]) {
      let fInfo = this._friendList[msg.firendId];
      fInfo.groupId = msg.groupId;
      this.dispatchEvent(FriendGroupEvent.MOVE_FRIEND, fInfo);
    }
  }

  /**
   * 更新好友信息
   */
  private __updateFriend(pkg: PackageIn) {
    let msg: FriendInfoMsg = pkg.readBody(FriendInfoMsg) as FriendInfoMsg;
    let id: number = msg.userId;
    if (this._friendList[id]) {
      let info = this._friendList[id];
      info.beginChanges();
      info.friendGrade = msg.relationGrade;
      info.friendGp = msg.relationGp;
      info.relation = msg.relation;
      info.groupId = msg.groupId;
      info.tarRelation = msg.tarRelation;
      if (msg.expAdded > 0) {
        //好感度增加聊天窗提示
        let chatData: ChatData = Laya.Pool.getItemByClass("ChatData", ChatData);
        chatData.channel = ChatChannel.INFO;
        chatData.msg = LangManager.Instance.GetTranslation(
          "yishi.manager.FriendManager.chatData.msg",
          info.nickName,
          msg.expAdded,
        );
        chatData.commit();
        NotificationManager.Instance.sendNotification(
          ChatEvent.ADD_CHAT,
          chatData,
        );
      }
      info.commit();
    }
  }

  /**
   * 添加关系返回（关系类型参考RelationType）
   */
  private __addFriend(pkg: PackageIn) {
    let msg: FriendInfoMsg = pkg.readBody(FriendInfoMsg) as FriendInfoMsg;
    let result: boolean = msg.result;
    let noticeMsg: string = msg.addMsg;
    if (result) {
      AudioManager.Instance.playSound(SoundIds.FRIENDS_ADD_SUCCEED_SOUND);
      this.readFriendInfo(msg);
      this.dispatchEvent(FriendUpdateEvent.FRIEND_UPDATE, null);
      this.dispatchEvent(FriendUpdateEvent.ADD_FRIEND, msg.userId);
    } else {
      MessageTipManager.Instance.show(noticeMsg);
    }
    this.removeFromRecmmondList(msg.userId); //从推荐好友列表删除
  }

  /**
   * 删除好友返回
   */
  private __removeFriend(pkg: PackageIn) {
    let msg: FriendRelationMsg = pkg.readBody(
      FriendRelationMsg,
    ) as FriendRelationMsg;
    if (msg.result) {
      let fid: number = msg.otherId;
      let reqId: string = msg.reqId;
      this._friendList.del(fid);
      this.removePrivatePerson(fid);
      IMManager.Instance.cleanMsgListByIdAndType(fid, IMModel.MSG_DIC_UNREAD);
      this.dispatchEvent(FriendUpdateEvent.FRIEND_UPDATE, null);
      this.dispatchEvent(FriendUpdateEvent.REMOVE_FRIEND, fid);
    }
  }

  /**
   * 好友上线通知
   */
  private __friendLogin(pkg: PackageIn) {
    let msg: FriendRelationMsg = pkg.readBody(
      FriendRelationMsg,
    ) as FriendRelationMsg;
    let fInfo: ThaneInfo = this._friendList[msg.otherId] as ThaneInfo;
    if (fInfo) {
      let relation: number = fInfo.relation;
      if (
        relation == RelationType.FRIEND ||
        relation == RelationType.STRANGER ||
        relation == RelationType.BLACKLIST
      ) {
        fInfo.beginChanges();
        fInfo.state = StateType.ONLINE;
        fInfo.commit();
        this.dispatchEvent(FriendUpdateEvent.FRIEND_CHANGE, fInfo);
      }
      if (
        relation == RelationType.FRIEND ||
        relation == RelationType.STRANGER
      ) {
        let chatData: ChatData = Laya.Pool.getItemByClass("ChatData", ChatData);
        let noticeMsg: string =
          "<a t='1' id='" +
          fInfo.userId +
          "' name='" +
          fInfo.nickName +
          "' consortiaId='" +
          fInfo.consortiaID +
          "'/>" +
          LangManager.Instance.GetTranslation(
            "yishi.manager.FriendManager.noticeMsg",
          );
        chatData.msg = noticeMsg;
        chatData.channel = ChatChannel.INFO;
        chatData.commit();
        NotificationManager.Instance.sendNotification(
          ChatEvent.ADD_CHAT,
          chatData,
        );
      }
    }
  }

  /**
   * 好友下线通知
   */
  private __friendLoginOut(pkg: PackageIn) {
    let msg: FriendRelationMsg = pkg.readBody(
      FriendRelationMsg,
    ) as FriendRelationMsg;
    let fInfo = this._friendList[msg.otherId];
    if (fInfo) {
      fInfo.beginChanges();
      fInfo.state = StateType.OFFLINE;
      fInfo.commit();
      this.dispatchEvent(FriendUpdateEvent.FRIEND_CHANGE, fInfo);
    }
  }

  private readFriendInfo(info: FriendInfoMsg) {
    let cls = Laya.ClassUtils.getClass("FriendItemCellInfo");
    let playerInfo = ObjectTranslator.toInstance(null, cls);
    playerInfo.userId = info.userId; //;
    playerInfo.templateId = info.job;
    playerInfo.relation = info.relation;
    playerInfo.groupId = info.groupId;
    playerInfo.type = FriendModel.ITEMTYPE_FRIEND;
    playerInfo.sexs = info.sex; //条件;
    playerInfo.pics = info.pic;
    playerInfo.grades = info.grades;
    playerInfo.nickName = info.nickName;
    playerInfo.friendGrade = info.relationGrade;
    playerInfo.friendGp = info.relationGp;
    playerInfo.consortiaID = info.consortiaId;
    playerInfo.consortiaName = info.consortiaName;
    playerInfo.fightingCapacity = info.fightCapacity;
    playerInfo.IsVipAndNoExpirt = info.isVip;
    playerInfo.vipType = info.vipType;
    playerInfo.state = info.chatState;
    playerInfo.frameId = info.frameId;
    if (info.snsInfo) {
      if (info.snsInfo.hasOwnProperty("userId")) {
        playerInfo.snsInfo.userId = info.snsInfo.userId;
      }
      if (info.snsInfo.hasOwnProperty("nickname")) {
        playerInfo.snsInfo.nickName = info.snsInfo.nickname;
      }
      if (info.snsInfo.hasOwnProperty("headId")) {
        playerInfo.snsInfo.headId = info.snsInfo.headId;
      }
      if (info.snsInfo.hasOwnProperty("signDesc")) {
        playerInfo.snsInfo.sign = info.snsInfo.signDesc;
      }
      if (info.snsInfo.hasOwnProperty("sex")) {
        playerInfo.snsInfo.sex = info.snsInfo.sex;
      }
      if (info.snsInfo.hasOwnProperty("birthdayType")) {
        playerInfo.snsInfo.birthdayType = info.snsInfo.birthdayType;
      }
      if (info.snsInfo.hasOwnProperty("birthYear")) {
        playerInfo.snsInfo.birthYear = info.snsInfo.birthYear;
      }
      if (info.snsInfo.hasOwnProperty("birthMonth")) {
        playerInfo.snsInfo.birthMonth = info.snsInfo.birthMonth;
      }
      if (info.snsInfo.hasOwnProperty("birthDay")) {
        playerInfo.snsInfo.birthDay = info.snsInfo.birthDay;
      }
      if (info.snsInfo.hasOwnProperty("starId")) {
        playerInfo.snsInfo.horoscope = info.snsInfo.starId;
      }
      if (info.snsInfo.hasOwnProperty("bloodType")) {
        playerInfo.snsInfo.bloodType = info.snsInfo.bloodType;
      }
      if (info.snsInfo.hasOwnProperty("country")) {
        playerInfo.snsInfo.country = info.snsInfo.country;
      }
      if (info.snsInfo.hasOwnProperty("province")) {
        playerInfo.snsInfo.province = info.snsInfo.province;
      }
      if (info.snsInfo.hasOwnProperty("city")) {
        playerInfo.snsInfo.city = info.snsInfo.city;
      }
    }
    this._friendList.add(playerInfo.userId, playerInfo);
    if (playerInfo.relation == RelationType.BLACKLIST) {
      this.removePrivatePerson(playerInfo.userId);
      IMManager.Instance.cleanMsgListByIdAndType(
        playerInfo.userId,
        IMModel.MSG_DIC_UNREAD,
      );
    }
    this.updatePrivatePerson(playerInfo);
  }

  /**
   * 发送添加关系请求一键添加
   * @param name　玩家昵称
   * @param relation　关系类型, 参考RelationType
   */
  public sendAddAllFriend(idArr: number[], relation: number): boolean {
    if (ArmyManager.Instance.thane.grades < 6) {
      let str: string = LangManager.Instance.GetTranslation(
        "yishi.manager.FriendManager.command01",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    FriendSocketOutManager.sendAddAllFriend(idArr, relation);
    return true;
  }

  public sendAddFriendRequest(
    name: string,
    relation: number,
    reqId: string = "",
  ): boolean {
    if (ArmyManager.Instance.thane.grades < 6) {
      let str: string = LangManager.Instance.GetTranslation(
        "yishi.manager.FriendManager.command01",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (!this.checkFriendList(name, relation)) {
      return false;
    }
    if (relation == RelationType.BLACKLIST) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let content: string = LangManager.Instance.GetTranslation(
        "yishi.manager.FriendManager.addToBlacklistTip",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        [name, relation, reqId],
        prompt,
        content,
        confirm,
        cancel,
        this.addRelationCall.bind(this),
      );
      return false;
    }
    FriendSocketOutManager.sendAddFriendRequest(name, relation, reqId);
    return true;
  }

  private addRelationCall(b: boolean, flag: boolean, data: any) {
    if (b) {
      let name: string = data[0];
      let relation: number = data[1];
      let reqId: string = data[2];
      FriendSocketOutManager.sendAddFriendRequest(name, relation, reqId);
    }
  }

  /**
   * 从推荐好友列表中移除
   */
  private removeFromRecmmondList(id: number) {
    for (let i = 0; i < this.recommendList.length; i++) {
      const info: RecommendInfo = this.recommendList[i];
      if (info.id == id) {
        this.recommendList.splice(this.recommendList.indexOf(info), 1);
      }
    }
  }

  /**
   * 检查是否还能添加关系
   */
  private checkFriendList(name: string, relation: number): boolean {
    let str: string = "";
    if (
      this.countFriend >= FriendManager.getInstance().maxFriendCount &&
      relation != RelationType.BLACKLIST
    ) {
      str = LangManager.Instance.GetTranslation(
        "yishi.manager.FriendManager.command02",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (name == PlayerManager.Instance.currentPlayerModel.playerInfo.nickName) {
      if (relation != RelationType.BLACKLIST) {
        str = LangManager.Instance.GetTranslation(
          "yishi.manager.FriendManager.command03",
        );
        MessageTipManager.Instance.show(str);
      } else {
        str = LangManager.Instance.GetTranslation(
          "yishi.manager.FriendManager.command04",
        );
        MessageTipManager.Instance.show(str);
      }
      return false;
    }
    if (this.isExist(name, relation)) {
      str = LangManager.Instance.GetTranslation(
        "yishi.manager.FriendManager.command05",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (this.FullBlackList(relation) >= 50) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let content: string = LangManager.Instance.GetTranslation(
        "yishi.manager.FriendManager.content",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        content,
        confirm,
        cancel,
      );
      return false;
    }
    return true;
  }

  /**
   * 黑名单人数
   */
  public FullBlackList(relation: number): number {
    if (relation != RelationType.BLACKLIST) {
      return 0;
    }
    let count: number = 0;
    for (const key in this._friendList) {
      if (this._friendList.hasOwnProperty(key)) {
        let info: ThaneInfo = this._friendList[key];
        if (info.relation == RelationType.BLACKLIST) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * 计算好友数量
   */
  public get countFriend(): number {
    let count: number = 0;
    if (this._friendList) {
      count =
        this._friendList.getList().length -
        this.FullBlackList(RelationType.BLACKLIST);
    }
    return count;
  }

  /**
   * 最大好友数
   */
  public get maxFriendCount(): number {
    return 200 + VIPManager.Instance.model.vipFriendPrivilege;
  }

  /**
   *检查是否存在指定关系
   * @param userId  玩家ID
   * @param type  关系类型
   */
  public checkIsExistRelation(userId: number, type: number): boolean {
    for (const key in this._friendList) {
      if (this._friendList.hasOwnProperty(key)) {
        let info = this._friendList[key];
        if (info.userId == userId && info.relation == type) {
          return true;
        }
      }
    }
    return false;
  }

  public checkIsFriend(userId): boolean {
    let info = this._friendList[userId];
    if (info && info.groupId == FriendGroupId.FRIEND) {
      return true;
    }
    return false;
  }

  /**
   *检查是否存在好友信息
   * @param userId
   */
  public checkIsExistFriendInfo(userId: number): any {
    let info = this._friendList[userId];
    if (!info) {
      info = this.getRecentInfoById(userId);
    }
    return info;
  }

  /**
   *检查是否存在指定关系
   * @param name　玩家昵称
   * @param type　　关系类型
   */
  public isExist(name: string, type: number): boolean {
    let list: Dictionary = this.friendList;

    for (const key in list) {
      if (list.hasOwnProperty(key)) {
        let info: ThaneInfo = list[key];
        if (info.nickName == name && info.relation == type) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   *推荐好友列表
   */
  public recommendList: RecommendInfo[] = [];

  private _recommendFriend(pkg: PackageIn) {
    //收到更新推荐好友列表
    this.recommendList.length = 0;
    let msg: RecommendListMsg = pkg.readBody(
      RecommendListMsg,
    ) as RecommendListMsg;
    let friend: FriendPlayer;
    let info: RecommendInfo;
    for (let i: number = 0; i < msg.girlList.length; i++) {
      friend = msg.girlList[i] as FriendPlayer;
      info = new RecommendInfo();
      info.id = friend.playerId;
      info.name = friend.nickName;
      info.level = friend.level;
      info.sex = friend.sex;
      info.attack = friend.attack;
      info.mapname = friend.mapName;
      info.headId = friend.headId;
      info.frameId = friend.frameId;
      info.job = friend.job;
      this.recommendList.push(info);
    }
    for (let i: number = 0; i < msg.boyList.length; i++) {
      friend = msg.boyList[i] as FriendPlayer;
      info = new RecommendInfo();
      info.id = friend.playerId;
      info.name = friend.nickName;
      info.level = friend.level;
      info.sex = friend.sex;
      info.attack = friend.attack;
      info.mapname = friend.mapName;
      info.headId = friend.headId;
      info.frameId = friend.frameId;
      info.job = friend.job;
      this.recommendList.push(info);
    }
    this.dispatchEvent(FriendUpdateEvent.UPDATE_RECOMONDLIST, null);

    if (this._isUpgrade) {
      this._isUpgrade = false;
      // MainToolBar.Instance.recommendBtnIsExist();
    }
  }

  /**
   * 发送删除好友
   */
  public sendRemoveFriendRequest(fid: number) {
    FriendSocketOutManager.sendRemoveFriendRequest(fid);
  }

  /**
   * 发送请求推荐好友
   */
  public sendRecommendFriendRequest() {
    FriendSocketOutManager.sendRecommendFriend();
  }

  /**添加好友列表请求 */
  public sendReqAddFriendList() {
    this.sendReqFriendMsgList(2); //请求列表
  }

  /**添加全部好友列表请求 */
  public sendReqAddAllFriendList() {
    this.sendReqFriendMsgList(3); //请求列表
  }

  /**
   * 发送请求好友申请列表
   * 操作类型 0:删除 1:删除全部 2:请求添加好友请求列表 3:同意所有请求
   */
  public sendReqFriendMsgList(op: number = 0, reqId: string = "") {
    FriendSocketOutManager.sendReqFriendMsgList(op, reqId);
  }

  private static _Instance: FriendManager;

  public static getInstance(): FriendManager {
    if (!FriendManager._Instance) {
      FriendManager._Instance = new FriendManager();
    }
    return FriendManager._Instance;
  }

  /**
   * 通过userId得到最近联系人info
   */
  public getRecentInfoById(id: number): ThaneInfo {
    for (let i = 0; i < this._recentPrivatePerson.length; i++) {
      const info: ThaneInfo = this._recentPrivatePerson[i];
      if (info.userId == id) {
        return info;
      }
    }
    return null;
  }

  /**
   * 得到最近联系人userId列表
   */
  private getRecentInfoIdList(): any[] {
    let arr: any[] = [];
    for (let i: number = 0; i < this._recentPrivatePerson.length; i++) {
      let info = this._recentPrivatePerson[i];
      arr.unshift(info.userId);
    }
    return arr;
  }

  /**
   * 向服务器请求最近联系人信息
   */
  public reqPrivatePerson(id: number) {
    if (!this.getRecentInfoById(id)) {
      PlayerManager.Instance.sendRequestSimpleAndSnsInfo(
        id,
        RequestInfoRientation.RECENT_CONTACT,
      );
      return;
    }
  }

  /**
   * 添加最近联系人
   */
  public addPrivatePerson(thane: ThaneInfo, islogin: boolean = false) {
    // if(!islogin){
    let isExist: boolean = false;
    for (let i = 0; i < this._talkingPerson.length; i++) {
      const info: ThaneInfo = this._talkingPerson[i];
      if (info.userId == thane.userId) {
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      this._talkingPerson.unshift(thane);
    }
    // }

    let info = this.getRecentInfoById(thane.userId);
    if (info) {
      return;
    }
    this._recentPrivatePerson.unshift(thane);
    if (this._recentPrivatePerson.length > 15) {
      this._recentPrivatePerson.pop();
    }
    SharedManager.Instance.updateRecent(this.getRecentInfoIdList());
    this.dispatchEvent(FriendUpdateEvent.ADD_RECENT_CONTACT, null);
  }

  /**
   * 删除最近联系人
   */
  public removePrivatePerson(id: number) {
    let info = this.getRecentInfoById(id);
    if (info) {
      this._recentPrivatePerson.splice(
        this._recentPrivatePerson.indexOf(info),
        1,
      );
      SharedManager.Instance.updateRecent(this.getRecentInfoIdList());
      this.dispatchEvent(FriendUpdateEvent.ADD_RECENT_CONTACT, null);
    }
    for (let i = 0; i < this._talkingPerson.length; i++) {
      const element = this._talkingPerson[i];
      if (element.userId == id) {
        this._talkingPerson.splice(i, 1);
        break;
      }
    }
  }

  /**
   * 更新最近联系人info
   */
  public updatePrivatePerson(recent) {
    let info = this.getRecentInfoById(recent.userId);
    if (recent && info) {
      this._recentPrivatePerson[this._recentPrivatePerson.indexOf(info)] =
        recent;
      this.addPrivatePerson(info);
    }
  }

  /**
   * 头像列表
   */
  public get talkingPerson(): ThaneInfo[] {
    return this._talkingPerson;
  }

  /**
   * 最近联系人列表
   */
  public get privatePerson(): ThaneInfo[] {
    return this._recentPrivatePerson;
  }

  /**
   * 好友列表
   */
  public get friendList(): SimpleDictionary {
    return this._friendList;
  }

  /**
   * 好友分组列表
   */
  public get groupDic(): SimpleDictionary {
    return this._groupDic;
  }

  /**
   *通过分组和状态得到好友列表（不包括最近联系人）
   * @param id  分组ID
   * @param state  好友状态, 参看StateType
   */
  public getListByGroupIdAndState(id: number, state: number): any[] {
    let arr: any[] = [];
    if (state == StateType.NO_LIMIT) {
      for (const key in this._friendList) {
        if (this._friendList.hasOwnProperty(key)) {
          const info = this._friendList[key];
          if (info.groupId == id) {
            arr.push(info);
          }
        }
      }
    } else {
      for (const key in this._friendList) {
        if (this._friendList.hasOwnProperty(key)) {
          const fInfo = this._friendList[key];
          if (fInfo.groupId == id && fInfo.state == state) {
            arr.push(fInfo);
          }
        }
      }
    }
    return arr;
  }

  //农场好友，必需互为好友。
  public getListForFarmFriend() {
    let friendList = this._friendList.getList() as ThaneInfo[];
    let farmFriendList: ThaneInfo[] = [];
    for (let info of friendList) {
      if (
        info.relation == RelationType.FRIEND &&
        info.tarRelation == RelationType.FRIEND
      ) {
        farmFriendList.push(info);
      }
    }
    farmFriendList = ArrayUtils.sortOn(
      farmFriendList,
      ["friendGrade", "friendGp"],
      ArrayConstant.DESCENDING | ArrayConstant.NUMERIC,
    );
    return farmFriendList;
  }

  /**
   * 得到在线的
   */
  public getOnlineList(list: any[]): any[] {
    let arr: any[] = [];
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let info = list[key];
        if (info.isOnline) {
          arr.push(info);
        }
      }
    }
    return arr;
  }

  /**
   * 得到不在线的
   */
  public getOfflineList(list: any[]): any[] {
    let arr: any[] = [];
    for (let key in list) {
      if (list.hasOwnProperty(key)) {
        let info = list[key];
        if (!info.isOnline) {
          arr.push(info);
        }
      }
    }
    return arr;
  }

  /**
   *改变整组的分组ID
   * @param currentId  当前分组ID
   * @param changeId  改变后的分组ID
   */
  public changeListGroup(currentId: number, changeId: number) {
    for (let key in this._friendList) {
      if (this._friendList.hasOwnProperty(key)) {
        let info = this._friendList[key];
        if (info.groupId == currentId) {
          info.groupId = changeId;
        }
      }
    }
  }

  public get friendListByArray(): any[] {
    let arr: any[] = [];
    for (let key in this._friendList) {
      if (this._friendList.hasOwnProperty(key)) {
        let info = this._friendList[key];
        if (info.relation == RelationType.FRIEND) {
          arr.push(info);
        }
      }
    }
    arr = ArrayUtils.sortOn(
      arr,
      ["friendGrade", "friendGp"],
      ArrayConstant.DESCENDING | ArrayConstant.NUMERIC,
    );
    return arr;
  }

  /**
   * 好友userId列表
   */
  public get friendListByArrayUserId(): any[] {
    let arr: any[] = [];
    for (const key in this._friendList) {
      if (this._friendList.hasOwnProperty(key)) {
        const info = this._friendList[key];
        if (info.relation == RelationType.FRIEND) {
          arr.push(info.userId);
        }
      }
    }
    return arr;
  }

  /**
   * 在线好友列表
   */
  public get onlineFriends(): any[] {
    let arr: any[] = [];
    for (const key in this._friendList) {
      if (this._friendList.hasOwnProperty(key)) {
        const info = this._friendList[key];
        if (info.relation == RelationType.FRIEND && info.isOnline) {
          arr.push(info);
        }
      }
    }
    arr = ArrayUtils.sortOn(arr, "friendGrade", ArrayConstant.NUMERIC);
    return arr;
  }

  /**
   * 不在线好友列表
   */
  public get offlineFriends(): any[] {
    let arr: any[] = [];
    for (const key in this._friendList) {
      if (this._friendList.hasOwnProperty(key)) {
        const info = this._friendList[key];
        if (info.relation == RelationType.FRIEND && !info.isOnline) {
          arr.push(info);
        }
      }
    }
    arr = ArrayUtils.sortOn(arr, "friendGrade", ArrayConstant.NUMERIC);
    return arr;
  }

  /**
   * 在线黑名单列表
   */
  public get onlineBlacks(): ThaneInfo[] {
    let arr: ThaneInfo[] = [];
    for (const key in this._friendList) {
      if (this._friendList.hasOwnProperty(key)) {
        let info: ThaneInfo = this._friendList[key];
        if (info.relation == RelationType.BLACKLIST && info.isOnline) {
          arr.push(info);
        }
      }
    }
    arr = ArrayUtils.sortOn(arr, "friendGrade", ArrayConstant.NUMERIC);
    return arr;
  }

  /**
   * 不在线黑名单列表
   */
  public get offlineBlacks(): ThaneInfo[] {
    let arr: ThaneInfo[] = [];
    for (const key in this._friendList) {
      if (this._friendList.hasOwnProperty(key)) {
        const info = this._friendList[key];
        if (info.relation == RelationType.BLACKLIST && !info.isOnline) {
          arr.push(info);
        }
      }
    }
    arr = ArrayUtils.sortOn(arr, "friendGrade", ArrayConstant.NUMERIC);
    return arr;
  }

  public bufferLength(): number {
    return this._bufferList.getList().length;
  }

  protected __levelUpgradeHandler(event: Event) {
    this._isUpgrade = true;
    FriendManager.SHOW_RED_DOT = true;
    this.sendRecommendFriendRequest();
  }

  private _toolInviteFriend: ToolInviteInfo[];

  /**
   * 添加好友邀请信息
   */
  public addToolInviteFriend(value: ToolInviteInfo) {
    for (let i: number = 0; i < this._toolInviteFriend.length; i++) {
      if (value.id == this._toolInviteFriend[i].id) {
        return;
      }
    }
    this._toolInviteFriend.push(value);
    NotificationManager.Instance.dispatchEvent(
      FriendUpdateEvent.INVITE_UPDATE,
      null,
    );
  }

  /**
   * 移除好友邀请信息
   */
  public removeToolAllFriend() {
    this.sendReqFriendMsgList(1);
  }

  /**
   * 移除好友邀请信息
   */
  public removeToolInviteFriend(value: ToolInviteInfo) {
    this.sendReqFriendMsgList(0, value.reqId);
  }

  /**
   * 好友邀请列表
   */
  public get toolInviteFriendList(): ToolInviteInfo[] {
    return this._toolInviteFriend;
  }

  public startTimer() {
    Laya.timer.loop(1000, this, this.onTimer);
  }

  private onTimer() {
    FriendManager.COUNT_DOWN--;
    this.dispatchEvent(TimerEvent.TIMER);
    if (FriendManager.COUNT_DOWN == 0) {
      FriendManager.COUNT_DOWN = 5;
      Laya.timer.clear(this, this.onTimer);
    }
  }

  public reqBlackList(otherId: number) {
    let msg: IsInBlackListMsg = new IsInBlackListMsg();
    msg.otherId = otherId;
    SocketManager.Instance.send(C2SProtocol.CH_INBLACK_LIST, msg);
  }
}
