import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import Logger from "../../core/logger/Logger";
import Utils from "../../core/utils/Utils";
import { ChatChannel } from "../datas/ChatChannel";
import ChatData from "../module/chat/data/ChatData";
import { getZoneData } from "../module/login/manager/SiteZoneCtrl";
import { ChatManager } from "./ChatManager";
import FreedomTeamManager from "./FreedomTeamManager";
import IMManager from "./IMManager";
import { MessageTipManager } from "./MessageTipManager";
import { PlayerManager } from "./PlayerManager";
import { RoomManager } from "./RoomManager";

export enum YM_DEF {
  /** 接收世界频道语音的房间 */
  WORLD_ROOM = "world_room",
  /** 接收公会频道语音的房间 + 公会ID */
  CONSORTIA_ROOM = "consortia_room_",
  /** 接收组队频道语音的房间 + 组队房间ID */
  TEAM_ROOM = "team_room_",
  /** 接收组队频道语音的房间 + 组队房间ID */
  TEAM = "team_",
}

/**
 * yimsdk流程: 先初始化sdk,再login(userId,token):token应由后台生成然后服务端传给前端
 */
export default class YMWebManager extends GameEventDispatcher {
  /** 公司标识 */
  private IDENTIFY: string = "7ROAD";
  /** 游密账号ID */
  private YOUME_USERID: string = "7665";

  private curRoomId: string = "";
  /** type =1表示私聊 type =2表示群聊 */
  private chatType: number = 0;
  private voice: any;
  private yim: any;
  // 所有消息的列表, { id: Message }
  private msgHash = {};
  private initOK: boolean = false;
  /** 是否有录音设备 */
  private hasRecorder: boolean = false;
  //登陆状态
  private _loginState: boolean = false;

  private static inst: YMWebManager;

  public static get Instance(): YMWebManager {
    if (!this.inst) {
      this.inst = new YMWebManager();
    }
    return this.inst;
  }

  /**不接受语音*/
  private get isNoneVoice(): boolean {
    return (
      Utils.isQQHall() ||
      Utils.isQQMobile() ||
      Utils.isQQZone() ||
      Utils.isWxMiniGame()
    );
  }

  /**
   * 初始化 YIM 实例, 注册消息类型插件
   */
  async setup() {
    if (this.isNoneVoice) return;
    this.loadymlib().then(() => {
      let zoneData = getZoneData();
      if (!zoneData) return;
      let ymKey = zoneData.YOUME;
      if (!ymKey || ymKey == "") return;

      //@ts-expect-error: YIM
      this.yim = new YIM({
        appKey: ymKey,
        // userId: '7665',
        // token: token,
        // roomId: DevChannel.WORLD_ROOM,
        //@ts-expect-error: YIM

        useMessageType: [TextMessage, VoiceMessage],
      });
      // 初始化录音插件
      //@ts-expect-error: YIM

      VoiceMessage.registerRecorder([MP3Recorder, AMRRecorder]);
      //@ts-expect-error: YIM

      this.yim.registerMessageType([TextMessage, VoiceMessage]);

      //@ts-expect-error: YIM

      VoiceMessage.initRecorder()
        .then(() => {
          this.hasRecorder = true;
          Logger.log("YM初始化录音完毕。");
        })
        .catch(function (e) {
          Logger.warn("YM初始化录音失败" + e.name);
          // MessageTipManager.Instance.show(this.getErrorMsg(e.name))
        });

      this.initOK = true;
      this._loginState = false;
      Logger.log("YMSDK初始化完毕。");
    });
  }

  loadymlib() {
    let libs = [
      "libs/h5sdk/yim.core.min.js",
      "libs/h5sdk/yim.text.message.min.js",
      "libs/h5sdk/yim.voice.message.min.js",
      "libs/h5sdk/yim.mp3.recorder.min.js",
      "libs/h5sdk/yim.wav.recorder.min.js",
      "libs/h5sdk/yim.amr.recorder.min.js",
    ];
    let groupLoadIndex = 0;
    return new Promise((resolve) => {
      if (Utils.isWxMiniGame()) {
        resolve(true);
      } else {
        let loadFunc = () => {
          let resKey = libs[groupLoadIndex];
          window["loadLib"](resKey, () => {
            if (groupLoadIndex >= libs.length - 1) {
              Logger.base("游密库....");
              resolve(true);
            } else {
              groupLoadIndex++;
              loadFunc();
            }
          });
        };
        loadFunc();
      }
    });
  }

  private onLoginOK() {
    this._loginState = true;
    Logger.log("成功登录SDK到" + this.yim.getMyUserId());
    if (Utils.isWxMiniGame() || this.isNoneVoice) {
      return;
    }
    Logger.log("成功登录SDK到" + this.yim.getMyUserId());
    let consortiaID =
      PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID;
    Logger.log("consortiaID" + consortiaID);
    if (consortiaID > 0) {
      let roomID = YM_DEF.CONSORTIA_ROOM + consortiaID + this.getMainSite();
      this.yim
        .joinRoom(roomID)
        .then(function (e) {
          Logger.log("加入公会房间成功" + e);
        })
        .catch(function (e) {
          Logger.error("加入公会房间失败: " + e.name);
        });
    }

    if (FreedomTeamManager.Instance.hasTeam) {
      let teamId = FreedomTeamManager.Instance.model.teamId;
      if (teamId > 0) {
        this.joinTeamRoom(teamId.toString(), true);
      }
    }

    if (RoomManager.Instance.roomInfo) {
      let teamId = RoomManager.Instance.roomInfo.id;
      if (teamId > 0) {
        this.joinTeamRoom(teamId.toString());
      }
    }

    //监听消息 event:message:receive:[user|group]:[userId|roomId]
    //监听消息 event:message:send:[user|group]:[userId|roomId]
    this.yim.on("message:*", this.onReceiveMsg.bind(this));
  }
  /**
   * 语音登录
   * 在游戏中需要使用语音功能的地方调用voiceLogin(string userId, string password, string token)方法进行登录,
   * userId、token字段可由游戏自行定义, password 可传空
   */
  voiceLogin(userId: string, password: string, token: string) {
    if (!this.initOK) {
      Logger.error("SDK还未初始化完成");
      return;
    }
    if (!userId) {
      Logger.error("请输入用户ID。");
      return;
    }
    if (!token) {
      Logger.error("请输入token。");
      return;
    }
    if (this.isNoneVoice) {
      return;
    }

    // 事件绑定: 已登录
    this.yim.on("account.login", this.onLoginOK.bind(this));
    Logger.log("yim.login", this.yim, userId, token);
    // 登录
    this.yim.login(userId, token).catch(function (e) {
      Logger.error("登录失败: " + e.name);
      // MessageTipManager.Instance.show(YMWebManager.Instance.getErrorMsg(e.name))
    });
  }

  getMainSite(): string {
    return "_" + PlayerManager.Instance.currentPlayerModel.userInfo.mainSite;
  }

  joinConsortiaRoom(roomid: string) {
    if (this.isNoneVoice) {
      return;
    }
    if (Utils.isWxMiniGame()) {
      return;
    }
    if (!this._loginState) {
      return;
    }
    // 登录并加入房间 默认加入世界频道和公会频道
    let roomId = YM_DEF.CONSORTIA_ROOM + roomid + this.getMainSite();
    this.yim
      .joinRoom(roomId)
      .then(function (e) {
        Logger.log("加入公会房间成功" + roomId);
      })
      .catch(function (e) {
        Logger.log("加入公会房间失败: " + e.name);
      });
  }

  exitConsortiaRoom(roomid: string) {
    if (this.isNoneVoice) {
      return;
    }
    if (!this._loginState) {
      return;
    }
    let roomId = YM_DEF.CONSORTIA_ROOM + roomid + this.getMainSite();
    this.yim
      .leaveRoom(roomId)
      .then(function (e) {
        Logger.log("退出公会房间成功" + roomId);
      })
      .catch(function (e) {
        Logger.log("退出公会房间失败: " + e.name);
      });
  }

  joinTeamRoom(roomid: string, isteam: boolean = false) {
    if (this.isNoneVoice) {
      return;
    }
    if (Utils.isWxMiniGame()) {
      return;
    }
    if (!this._loginState) {
      return;
    }
    // 登录并加入房间 默认加入世界频道和公会频道
    let roomId = YM_DEF.TEAM_ROOM + roomid + this.getMainSite();
    if (isteam) {
      roomId = YM_DEF.TEAM + roomid + this.getMainSite();
    }
    this.yim
      .joinRoom(roomId)
      .then(function (e) {
        Logger.log("加入组队房间成功" + roomId);
      })
      .catch(function (e) {
        Logger.log("加入组队房间失败: " + e.name);
      });
  }

  exitTeamRoom(roomid: string, isteam: boolean = false) {
    if (this.isNoneVoice) {
      return;
    }
    if (!this._loginState) {
      return;
    }
    let roomId = YM_DEF.TEAM_ROOM + roomid + this.getMainSite();
    if (isteam) {
      roomId = YM_DEF.TEAM + roomid + this.getMainSite();
    }
    this.yim
      .leaveRoom(roomId)
      .then(function (e) {
        Logger.log("退出组队房间成功" + roomId);
      })
      .catch(function (e) {
        Logger.log("退出组队房间失败: " + e.name);
      });
  }

  /**
   * 开始录音
   * chatRoomId 传游戏自定义的id,type =1表示私聊 type =2表示群聊
   * */
  startRecord(
    chatRoomId: string,
    type: number,
    extraText: string,
    cb: Function,
  ) {
    if (this.isNoneVoice) {
      return;
    }
    if (!this._loginState) {
      return;
    }
    this.curRoomId = chatRoomId + this.getMainSite();
    this.chatType = type;

    //@ts-expect-error: YIM

    this.voice = new VoiceMessage(extraText); // 新建实例 .0
    this.voice.startRecord();
    // this.voice.startRecord().then(()=> {
    //     if(cb){
    //         cb(true);
    //     }
    // }).catch(function (e) {
    //     if (e.name !== 'RecordTooShortError') {
    //         // 'RecordTooShortError' 错误将在 finishRecord() 中报错, 这里不再重复
    //         Logger.warn('startRecord:',e);
    //     }
    // });

    Logger.log("开始录音:chatRoomId", chatRoomId, "headI:", extraText);
  }

  getErrorMsg(errorName) {
    return this.ERROR_NAME[errorName] || errorName;
  }

  ERROR_NAME = {
    // 通用
    NotLoginError: "请先登录",
    InvalidParamError: "无效的参数",
    InvalidLoginError: "无效的登录",
    UsernameOrTokenError: "用户名或token错误",
    LoginTimeoutError: "登录超时",
    ServiceOverloadError: "服务过载, 消息传输过于频繁",
    MessageTooLongError: "消息长度超出限制, 最大长度1400",
    // 录音
    UnsupportedVoiceFormatError: "不支持的音频格式",
    DeviceNotSupportedError: "设备不支持录音",
    AlreadyReadyError:
      "已经录过音或加载过音频了, 要重新录音请重新 new 一个新实例",
    CanceledError:
      "已经取消了录音或录音出错了, 要重新录音请重新 new 一个新实例",
    NotAllowedError: "没有录音权限",
    RecorderNotStartedError: "没有启动录音却企图完成录音",
    RecorderBusyError: "录音系统正忙, 可能有其他实例正在录音中",
    RecordTooShortError: "录音时长太短",
    WXObjectIsEmptyError: "未传入微信wx对象",
    WXObjectNoConfigError: "微信wx对象尚未初始化",
    NotFoundError: "无音频设备",
  };

  /**
   * 停止录音并发送
   * 可在onSendAudioMessageCallBack中收到发送成功的回调
   * */
  stopAndSendAudio(receiverId: string) {
    if (this.isNoneVoice) {
      return;
    }
    if (!this.voice) return;

    if (!this._loginState) {
      return;
    }

    let chatType = this.chatType;
    let voice = this.voice;
    let yim = this.yim;
    let curRoomId = this.curRoomId;
    voice
      .finishRecord()
      .then(() => {
        if (chatType == 1) {
          // 私发消息给某人
          yim.sendToUser(receiverId, voice); // 发送录音
          Logger.log("停止录音并发送私聊sendToUser:", "receiverId", receiverId);
        } else {
          yim.sendToRoom(curRoomId, voice); // 发送录音
          Logger.log("停止录音并发送到房间sendToRoom:", curRoomId);
        }
      })
      .catch(function (e) {
        // MessageTipManager.Instance.show(YMWebManager.Instance.getErrorMsg(e.name))
      });
  }

  /**
   * 播放语音
   * audioPath为语音文件的路径
   * */
  startPlayAudio(serverId: any) {
    if (this.isNoneVoice) {
      return;
    }

    if (!this._loginState) {
      return;
    }

    let msg = this.msgHash[serverId].message;
    if (msg) {
      if (msg.isPlaying()) {
        msg.stop();
      } else {
        msg.play();
      }
    }
  }

  /**
   * 停止播放语音
   * */
  stopPlayAudio() {
    if (this.isNoneVoice) {
      return;
    }
    if (this.voice) {
      this.voice.stop();
    }
  }

  /**
   * 取消发送语音
   * */
  cancelRecordAudio() {
    if (this.isNoneVoice) {
      return;
    }
    if (this.voice) {
      this.voice.cancelRecord();
    }
  }

  /**
   * 接收消息
   * @param eventName  event:message:receive:[user|group]:[userId|roomId]
   * @param msgObj  MessageObject
   */
  onReceiveMsg(eventName: string, msgObj: any) {
    if (this.isNoneVoice) {
      return;
    }

    if (!this._loginState) {
      return;
    }
    Logger.log("onReceiveMsg eventName", eventName, msgObj);
    // 获得消息对象（TextMessage 或 VoiceMessage）
    switch (msgObj.message.getType()) {
      case "voice":
        this.addVoiceItem(eventName, msgObj);
        // msgObj.message.getExtra(); // 获取语音消息所携带的额外文本消息
        break;
    }
  }

  // 添加语音消息message:receive:[user|group]:[userId|roomId]
  addVoiceItem(eventName: string, msgObj) {
    if (this.isNoneVoice) {
      return;
    }

    if (!this._loginState) {
      return;
    }
    Logger.log(
      "添加语音消息addVoiceItem: isFromMe" + msgObj.isFromMe,
      "getDuration:" + msgObj.message.getDuration(),
      "msgObj.time:",
      msgObj.time,
    );

    //message:receive:group:room123
    if (this.msgHash[msgObj.serverId]) {
      //过滤浏览器兼容问题导致的会收到多条同样的消息
      return;
    }
    // 把 msgObj 存起来
    this.msgHash[msgObj.serverId] = msgObj;
    Logger.log(
      "msgObj.serverId",
      msgObj.serverId,
      "this.msgHash",
      this.msgHash,
      "sender: ",
      msgObj.senderId,
    );
    //解析为ChatData
    let chatData: ChatData = new ChatData();
    chatData.isFromMe = msgObj.isFromMe;
    let str = msgObj.message.getExtra();
    let arr0 = str.split("|");
    chatData.senderName = arr0[0];
    chatData.userLevel = Number(arr0[1]);
    chatData.headId = Number(arr0[2]);
    chatData.serverId = msgObj.serverId;
    chatData.curTime = msgObj.time;
    chatData.isRead = chatData.isFromMe;
    chatData.voiceTime = Math.round(msgObj.message.getDuration());
    let arr = eventName.split(":");

    let receiveArr: any = msgObj.receiverId.split("_");
    if (receiveArr.length > 0) {
      chatData.receiveId = receiveArr[receiveArr.length - 1]; //区服_userId
      if (!chatData.receiveId) {
        chatData.receiveId = 0;
      }
    }

    let senderArr: any = msgObj.senderId.split("_");
    if (senderArr.length > 0) {
      chatData.uid = Number(senderArr[senderArr.length - 1]); //区服|userId
    }

    let roomId: string = arr[3];
    if (roomId.indexOf(YM_DEF.CONSORTIA_ROOM) >= 0) {
      chatData.channel = ChatChannel.CONSORTIA;
    } else if (roomId.indexOf(YM_DEF.TEAM) >= 0) {
      chatData.channel = ChatChannel.TEAM;
    } else {
      IMManager.Instance.addVoice(chatData);
      return;
    }
    ChatManager.Instance.model.addChat(chatData);
  }

  logout() {
    if (this.isNoneVoice) {
      return;
    }
    if (this.yim) {
      this.yim.logout();
      this._loginState = false;
    }
  }
}
