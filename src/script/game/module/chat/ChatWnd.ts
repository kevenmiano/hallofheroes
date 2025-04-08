// @ts-nocheck
import FUI_ChatMsgCell from "../../../../fui/Chat/FUI_ChatMsgCell";
import FUI_VoiceMsgCell from "../../../../fui/Chat/FUI_VoiceMsgCell";
import AudioManager from "../../../core/audio/AudioManager";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { AndroidWebviewChannel } from "../../../core/sdk/android_webview/AndroidWebviewChannel";
import BaseChannel from "../../../core/sdk/base/BaseChannel";
import SDKManager from "../../../core/sdk/SDKManager";
import WanChannel from "../../../core/sdk/wan/WanChannel";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import StringHelper from "../../../core/utils/StringHelper";
import Utils from "../../../core/utils/Utils";
import { t_s_appellData } from "../../config/t_s_appell";
import {
  ChatEvent,
  IMEvent,
  IMFrameEvent,
  InteractiveEvent,
} from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { SoundIds } from "../../constant/SoundIds";
import { EmWindow } from "../../constant/UIDefine";
import UserType from "../../constant/UserType";
import BaseIMInfo from "../../datas/BaseIMInfo";
import { ChatChannel } from "../../datas/ChatChannel";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import IMModel from "../../datas/model/IMModel";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { ChatManager } from "../../manager/ChatManager";
import ChatSocketOutManager from "../../manager/ChatSocketOutManager";
import { ConfigManager } from "../../manager/ConfigManager";
import { ConsortiaSocketOutManager } from "../../manager/ConsortiaSocketOutManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
import { GoodsManager } from "../../manager/GoodsManager";
import IMManager from "../../manager/IMManager";
import { LongPressManager } from "../../manager/LongPressManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { MopupManager } from "../../manager/MopupManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { RoomListSocketOutManager } from "../../manager/RoomListSocketOutManager";
import { RoomManager } from "../../manager/RoomManager";
import { SharedManager } from "../../manager/SharedManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { RoomInfo } from "../../mvc/model/room/RoomInfo";
import ChatHelper from "../../utils/ChatHelper";
import { ItemHelper } from "../../utils/ItemHelper";
import { ThaneInfoHelper } from "../../utils/ThaneInfoHelper";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import MagicCardInfo from "../card/MagicCardInfo";
import { ConsortiaControler } from "../consortia/control/ConsortiaControler";
import { ConsortiaDutyInfo } from "../consortia/data/ConsortiaDutyInfo";
import StarInfo from "../mail/StarInfo";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import FUI_SystemMsgCell from "../../../../fui/Chat/FUI_SystemMsgCell";
import ChatDebug from "./ChatDebug";
import ChatInput from "./ChatInput";
import ChatItemMenu from "./ChatItemMenu";
import ChatModel from "./ChatModel";
import ChatMsgCell from "./ChatMsgCell";
import ChatTabBtn from "./ChatTabBtn";
import ChatCellData from "./data/ChatCellData";
import ChatData from "./data/ChatData";
import ChatTabData from "./data/ChatTabData";
import SysMsgCell from "./SysMsgCell";
import VoiceMsgCell from "./VoiceMsgCell";

import ChatItemInfoMsg = com.road.yishi.proto.chat.ChatItemInfoMsg;
import ChatStarInfoMsg = com.road.yishi.proto.chat.ChatStarInfoMsg;
import ChatPowCardInfoMsg = com.road.yishi.proto.chat.ChatPowCardInfoMsg;
import { NativeChannel } from "../../../core/sdk/native/NativeChannel";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { BattleManager } from "../../battle/BattleManager";
import { BattleModel } from "../../battle/BattleModel";
import { BattleType } from "../../constant/BattleDefine";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import Resolution from "../../../core/comps/Resolution";
import ComponentSetting from "../../utils/ComponentSetting";
import { YM_DEF } from "../../manager/YMWebManager";
import DevChannel from "../../../core/sdk/dev/DevChannel";
import H5SDKChannel from "../../../core/sdk/h5sdk/H5SDKChannel";
import ChatPrivateList from "./ChatPrivateList";
import { FriendManager } from "../../manager/FriendManager";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";

/**
 * @author:pzlricky
 * @data: 2021-04-29 10:15
 * @description 主界面聊天窗口
 */
export default class ChatWnd extends BaseWindow {
  private static curTabIndex = 0;

  public chatSendCtrl: fgui.Controller; //发送控制器
  public chatShowCtrl: fgui.Controller; //显示控制器
  public chatPrivateCtrl: fgui.Controller; //展示私聊列表
  public chatAnnounceCtrl: fgui.Controller; //公告控制器
  public voiceCtrl: fgui.Controller; //语音文字切换控制器

  public voice: fairygui.GComponent;
  public voice_tip: fairygui.GComponent;

  public chatmask: fgui.GGraph;
  public chatMsglist: fgui.GList;
  public chatTablist: fgui.GList;
  public chatInput: ChatInput;
  public btn_face: UIButton;
  public chatSendBtn: UIButton;
  public voiceMsgBtn: UIButton;
  public textBtn: UIButton;
  public hideBtn: UIButton;
  public privateChatList: fgui.GList;
  public translateSetBtn: UIButton;
  public tips: fgui.GLabel;
  public unreadLab: fgui.GTextField;
  public unreadGroup: fgui.GGroup;
  public unreadBg: fgui.GLoader;
  private chatTabTexts: Array<string> = [];
  private paramData: any;
  private openType: number = 0;
  // 全部、世界、系统、组队、工会、私聊
  private chatTabChannels: Array<number> = [
    // ChatChannel.CURRENT,//全部
    ChatChannel.WORLD, //世界
    ChatChannel.BIGBUGLE, //大喇叭
    ChatChannel.TEAM, //组队
    ChatChannel.CONSORTIA, //工会
    ChatChannel.PERSONAL, //私聊
    ChatChannel.SYSTEM, //系统
  ];

  /**聊天消息 */
  private chatMessages: Array<ChatData> = [];
  /**私聊消息 */
  private chatPrivateMessages: Array<ChatData> = [];

  private consortiaMsgCount: number = 0;
  private teamMsgCount: number = 0;

  // protected resizeContent: boolean = true;

  private maxUnreadCount = 999;

  privateList: ChatPrivateList;

  constructor() {
    super();
  }

  isTalkingWith(userId: number): boolean {
    if (
      this.privateList.currentSelected &&
      this.privateList.currentSelected.userId == userId
    ) {
      return true;
    }
    return false;
  }

  private initVoice() {
    let channel = SDKManager.Instance.getChannel();
    if (channel instanceof NativeChannel) {
      let isGranted = channel.checkPermission(
        "android.permission.RECORD_AUDIO"
      );
      if (isGranted != 1) {
        let confirm: string =
          LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string =
          LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string =
          LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation(
          "permissions.request.RECORD_AUDIO"
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          null,
          prompt,
          content,
          confirm,
          cancel,
          this.openPersonalCenter.bind(this)
        );
      }
    }
    this.voice.displayObject.on(
      InteractiveEvent.LONG_PRESS,
      this,
      this.onLongPress
    );
    this.voice.displayObject.on(
      InteractiveEvent.LONG_PRESS_END,
      this,
      this.onLongPressEnd
    );
    LongPressManager.Instance.enableLongPress(this.voice.displayObject);
  }

  private openPersonalCenter(b: boolean, flag: boolean) {
    if (b) {
      if (Utils.isAndroid() || Utils.isIOS())
        FrameCtrlManager.Instance.open(EmWindow.PersonalCenter, { page: 4 });
      else if (Utils.isPC())
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("web.permission.RECORD_AUDIO")
        );
    }
  }

  private onLongPress() {
    if (this.isCooling) return;
    if (!ChatHelper.checkCanSend("", this.getCurrentChannel(), true)) {
      return;
    }

    let channel: BaseChannel = SDKManager.Instance.getChannel();
    if (channel instanceof AndroidWebviewChannel) {
    } else if (
      channel instanceof WanChannel ||
      channel instanceof H5SDKChannel ||
      channel instanceof DevChannel
    ) {
      //暂时屏蔽
      // if(!WanChannel.hasRecorder){
      //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('notFoundRecorder'));
      //     return;
      // }
      //当前所在的频道
      let cur_channel = this.getCurrentChannel();
      let headId = ArmyManager.Instance.thane.snsInfo.headId;
      if (headId == 0) {
        headId = ArmyManager.Instance.thane.job;
      }
      let extraText =
        ArmyManager.Instance.thane.nickName +
        "|" +
        ArmyManager.Instance.thane.grades +
        "|" +
        headId;
      switch (cur_channel) {
        case ChatChannel.PERSONAL:
          channel.startRecord(
            "",
            1,
            extraText,
            this.startRecordCallback.bind(this)
          );
          break;
        case ChatChannel.WORLD:
          channel.startRecord(
            YM_DEF.WORLD_ROOM,
            2,
            extraText,
            this.startRecordCallback.bind(this)
          );
          break;
        case ChatChannel.CONSORTIA:
          channel.startRecord(
            YM_DEF.CONSORTIA_ROOM +
              PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID,
            2,
            extraText,
            this.startRecordCallback.bind(this)
          );
          break;
        case ChatChannel.TEAM:
          if (RoomManager.Instance.roomInfo) {
            channel.startRecord(
              YM_DEF.TEAM_ROOM + RoomManager.Instance.roomInfo.id,
              2,
              extraText,
              this.startRecordCallback.bind(this)
            );
          } else {
            channel.startRecord(
              YM_DEF.TEAM + FreedomTeamManager.Instance.model.teamId,
              2,
              extraText,
              this.startRecordCallback.bind(this)
            );
          }
          break;
        default:
          break;
      }
      this.startRecordCallback(true);
    } else if (channel instanceof NativeChannel) {
      //当前所在的频道
      let cur_channel = this.getCurrentChannel();
      let headId = ArmyManager.Instance.thane.snsInfo.headId;
      if (headId == 0) {
        headId = ArmyManager.Instance.thane.job;
      }
      let extraText =
        ArmyManager.Instance.thane.nickName +
        "|" +
        ArmyManager.Instance.thane.grades +
        "|" +
        headId;
      switch (cur_channel) {
        case ChatChannel.PERSONAL:
          if (this.model.privateData) {
            let userId =
              PlayerManager.Instance.currentPlayerModel.userInfo.mainSite +
              "_" +
              this.model.privateData.userId.toString();
            channel.startRecordAudio(userId, 1, extraText);
          }
          break;
        case ChatChannel.WORLD:
          channel.startRecordAudio(NativeChannel.WORLD_ROOM, 2, extraText);
          break;
        case ChatChannel.CONSORTIA:
          channel.startRecordAudio(
            NativeChannel.CONSORTIA_ROOM +
              PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID,
            2,
            extraText
          );
          break;
        case ChatChannel.TEAM:
          if (RoomManager.Instance.roomInfo) {
            channel.startRecordAudio(
              NativeChannel.TEAM_ROOM + RoomManager.Instance.roomInfo.id,
              2,
              extraText
            );
          } else {
            channel.startRecordAudio(
              NativeChannel.TEAM + FreedomTeamManager.Instance.model.teamId,
              2,
              extraText
            );
          }
          break;
        default:
          break;
      }
      this.startRecordCallback(true);
    }
  }
  private voiceTime: number = 0;
  /** 冷却时间, 避免频繁快速发送语音导致语音SDK那边编码错误 */
  private isCooling: boolean = false;

  /**
   * 录音成功后回调
   */
  startRecordCallback(isok: boolean) {
    if (!isok) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("notFoundRecorder")
      );
      return;
    }
    this.voice.getControllerAt(0).setSelectedIndex(1); //显示松开发送
    this.voiceTime = 0;
    this.voice_tip.visible = true;
    Laya.timer.loop(1000, this, this.showVoiceTime);
  }

  showVoiceTime() {
    this.voiceTime++;
    this.voice_tip.getChild("txt_sec").asTextField.text = this.voiceTime + "“";
    if (this.voiceTime == 60) {
      //最长1分钟
      this.sendVoice(true);
    }
  }

  //调用语音接口 录音结束并发送
  private onLongPressEnd(evt: Laya.Event, target: Laya.Sprite) {
    this.isCooling = true;
    //松开的时候检测是否取消发送
    let is_send = target.hitTestPoint(evt.stageX, evt.stageY);
    this.sendVoice(is_send);
    Laya.timer.once(1000, this, this.onCooling);
  }

  onCooling() {
    this.isCooling = false;
  }

  private sendVoice(is_send) {
    this.voice.getControllerAt(0).setSelectedIndex(0); //显示按住说话
    this.voice_tip.visible = false;
    Laya.timer.clear(this, this.showVoiceTime);
    this.voiceTime = 0;
    this.voice_tip.getChild("txt_sec").asTextField.text = "";
    let channel: BaseChannel = SDKManager.Instance.getChannel();
    if (channel instanceof AndroidWebviewChannel) {
      if (is_send) {
      } else {
      }
    } else if (
      channel instanceof WanChannel ||
      channel instanceof H5SDKChannel ||
      channel instanceof DevChannel
    ) {
      if (is_send) {
        //当前所在的频道
        let cur_channel = this.getCurrentChannel();
        switch (cur_channel) {
          case ChatChannel.PERSONAL:
            if (this.model.privateData) {
              let userId =
                PlayerManager.Instance.currentPlayerModel.userInfo.mainSite +
                "_" +
                this.model.privateData.userId;
              channel.stopAndSendAudio(userId);
            }
            break;
          case ChatChannel.WORLD:
            channel.stopAndSendAudio(YM_DEF.WORLD_ROOM);
            break;
          case ChatChannel.CONSORTIA:
            channel.stopAndSendAudio(YM_DEF.CONSORTIA_ROOM);
            break;
          case ChatChannel.TEAM:
            channel.stopAndSendAudio(YM_DEF.TEAM_ROOM);
            break;
          default:
            break;
        }
      } else {
        channel.cancelRecordAudio();
      }
    } else if (channel instanceof NativeChannel) {
      if (is_send) {
        //当前所在的频道
        let cur_channel = this.getCurrentChannel();
        switch (cur_channel) {
          case ChatChannel.PERSONAL:
            channel.stopAndSendAudio();
            break;
          case ChatChannel.WORLD:
            channel.stopAndSendAudio();
            break;
          case ChatChannel.CONSORTIA:
            channel.stopAndSendAudio();
            break;
          case ChatChannel.TEAM:
            channel.stopAndSendAudio();
            break;
          default:
            break;
        }
      } else {
        channel.cancelRecordAudio();
      }
    }
  }

  private isInit: boolean = false;
  public OnInitWind() {
    this.isInit = false;
    this.initView();
    this.addEvent();
    this.refreshData();
    this.voiceCtrl = this.getController("voiceCtrl");
    if (this.params && this.params.frameData) {
      if (this.params.frameData instanceof ChatData) {
        this.chatTablist.selectedIndex = ChatTabIndex.PERSONAL;
        this.__onChannelSelect();
      } else {
        if (this.params.frameData.thaneInfo)
          this.paramData = this.params.frameData.thaneInfo;
        this.openType = this.params.frameData.type;
        if (this.openType == 0) {
          //活跃度日常任务打开
          this.chatTablist.selectedIndex = ChatTabIndex.BIGBUGLE;
          this.chatSendCtrl.selectedIndex = ChatTabIndex.BIGBUGLE;
          this.__onChannelSelect();
        } else if (this.paramData) {
          this.__onChangeSelect(this.paramData);
          NotificationManager.Instance.sendNotification(
            ChatEvent.ADD_PRIVATE_CHAT,
            this.paramData
          );
        }
      }
    } else {
      this.__onChannelSelect();
    }
    this.__imFrameUpdateHandler();
    //以下逻辑不需要, 统一打开上一次页签
    // else {
    //     if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
    //         //战斗场景里根据战斗类型判断是否多人还是单人
    //         let bMode: BattleModel = BattleManager.Instance.battleModel;
    //         if (bMode) {
    //             switch (bMode.battleType) {
    //                 //单人
    //                 case BattleType.BATTLE_CHALLENGE:
    //                 case BattleType.WORLD_BOSS_BATTLE:
    //                 case BattleType.CAMPAIGN_BATTLE:
    //                 case BattleType.CASTLE_BATTLE:
    //                 case BattleType.TREASUREMAP_BATTLE:
    //                 case BattleType.WORLD_MAP_NPC:
    //                 case BattleType.MINERAL_PK:
    //                 case BattleType.PET__HUMAN_PK:
    //                 case BattleType.CROSS_WAR_FIELD_BATTLE:
    //                 case BattleType.NPC_FOLLOW_BATTLE:
    //                 case BattleType.WARLORDS:
    //                 case BattleType.PET_PK:
    //                 case BattleType.RES_WILDLAND_BATTLE:
    //                 case BattleType.NPC_WILDLAND_BATTLE:
    //                 case BattleType.TRE_WILDLAND_BATTLE:
    //                 case BattleType.CASTLE_BATTLE:
    //                     if (this.chatTablist) {
    //                         this.chatTablist.selectedIndex = ChatTabIndex.WORLD;
    //                     }
    //                     break;
    //                 //多人
    //                 case BattleType.BATTLE_MULTIPLAYER:
    //                 case BattleType.MULTIPLAYER_BOSS_BATTLE:
    //                 case BattleType.GUILD_WAR_BATTLE_PLAYER:
    //                 case BattleType.KING_TOWER_BATTLE:
    //                 case BattleType.TRIAL_TOWER_BATTLE:
    //                 case BattleType.CROSS_MULTI_CAMPAIGN:
    //                     if (this.chatTablist) {
    //                         this.chatTablist.selectedIndex = ChatTabIndex.TEAM;
    //                     }
    //                     break;
    //                 default:
    //                     this.chatTablist.selectedIndex = ChatTabIndex.WORLD;
    //                     break;
    //             }
    //         }
    //     } else {
    //         //pvp/pve的组队界面、副本界面、战斗界面三种, 在此场景下点击信息按钮默认打开应为“组队”信息栏
    //         if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE
    //             || SceneManager.Instance.currentType == SceneType.PVE_ROOM_SCENE
    //             || SceneManager.Instance.currentType == SceneType.PVP_ROOM_SCENE) {
    //             if (this.chatTablist) {
    //                 let mapModel = CampaignManager.Instance.mapModel;
    //                 if (mapModel && (mapModel.campaignTemplate.Capacity <= 1 || mapModel.campaignTemplate.Capacity > 999)) {
    //                     this.chatTablist.selectedIndex = ChatTabIndex.WORLD;
    //                 } else {
    //                     this.chatTablist.selectedIndex = ChatTabIndex.TEAM;
    //                 }
    //             }
    //         }
    //     }
    //     this.__onChannelSelect();
    // }
  }

  private initView() {
    this.btn_face.visible = !ComponentSetting.IOS_VERSION;
    this.voiceMsgBtn.visible = ConfigManager.info.VOICE;
    this.chatSendCtrl = this.getController("chatSendCtrl");
    this.chatShowCtrl = this.getController("chatShowCtrl");
    this.chatAnnounceCtrl = this.getController("chatAnnounceCtrl");
    this.chatPrivateCtrl = this.getController("chatPrivateCtrl");
    this.chatSendCtrl.selectedIndex = 1;
    this.chatPrivateCtrl.selectedIndex = 0;
    this.chatAnnounceCtrl.selectedIndex = 0;
    this.chatMsglist.setVirtual();
    this.chatInput.setInputText(ChatInput.NOT_SEND_MSG);
    this.chatMessages = [];
    this.chatPrivateMessages = [];
    //聊天Tab列表
    this.chatTabChannels = [
      // ChatChannel.CURRENT,//全部
      ChatChannel.WORLD, //世界
      ChatChannel.BIGBUGLE, //系统
      ChatChannel.TEAM, //组队
      ChatChannel.CONSORTIA, //工会
      ChatChannel.PERSONAL, //私聊
      ChatChannel.SYSTEM, //系统
    ];

    //Tab文本
    // (this.chatTabTexts[ChatChannel.CURRENT]) = LangManager.Instance.GetTranslation("chatII.datas.getChatChannelName.AllChannel");
    this.chatTabTexts[ChatChannel.WORLD] = LangManager.Instance.GetTranslation(
      "chatII.datas.getChatChannelName.WorldChannel"
    );
    this.chatTabTexts[ChatChannel.BIGBUGLE] =
      LangManager.Instance.GetTranslation(
        "chat.datas.getChatChannelName.BIGBUGLE"
      );
    this.chatTabTexts[ChatChannel.TEAM] = LangManager.Instance.GetTranslation(
      "chatII.datas.getChatChannelName.TeamChannel"
    );
    this.chatTabTexts[ChatChannel.CONSORTIA] =
      LangManager.Instance.GetTranslation(
        "chatII.datas.getChatChannelName.consortiaChannel"
      );
    this.chatTabTexts[ChatChannel.PERSONAL] =
      LangManager.Instance.GetTranslation(
        "chatII.datas.getChatChannelName.PersonChannel"
      );
    this.chatTabTexts[ChatChannel.SYSTEM] = LangManager.Instance.GetTranslation(
      "chatII.datas.getChatChannelName.SystemChannel"
    );
    this.chatSendBtn.title = LangManager.Instance.GetTranslation("public.send");
    this.tips.text = LangManager.Instance.GetTranslation(
      "ChatWnd.notsend.tips"
    );
  }

  OnShowWind() {
    super.OnShowWind();
    this.y = (Resolution.gameHeight - this.contentPane.height) / 2;
    this.x = Resolution.deviceStatusBarHeightL;
    if (this.chatShowCtrl) {
      this.chatShowCtrl.selectedIndex = 1;
    }
    this.translateSetBtn.visible = ConfigManager.info.CHAT_TRANSLATE;
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
    this.chatShowCtrl.selectedIndex = 0;
  }

  get model(): ChatModel {
    return ChatManager.Instance.model;
  }

  private refreshData() {
    Logger.log("allChats", ChatManager.Instance.model.allChats);

    let array = ChatManager.Instance.model.allChats;
    let len = array.length;
    for (let i = 0; i < len; i++) {
      const element = array[i];
      if (element.channel == ChatChannel.CONSORTIA) {
        this.consortiaMsgCount++;
      } else if (element.channel == ChatChannel.TEAM) {
        this.teamMsgCount++;
      }
    }
    if (this.isShowing) {
      this.chatTablist.numItems = this.chatTabChannels.length;
      this.chatTablist.selectedIndex = ChatWnd.curTabIndex;
      this.model.currentOutChannel = this.getCurrentChannel();
      this.__channelChangeHandler();
    }
  }

  // onFocusIn(){
  //     let ty = this.contentPane.y -  this.contentPane.height/2;
  //     Laya.Tween.to(this.contentPane, { y:ty }, 500);
  // }

  // onFocusOut(){
  //     let ty = this.contentPane.y +  this.contentPane.height/2;
  //     Laya.Tween.to(this.contentPane, { y:ty }, 500);
  // }

  private addEvent() {
    this.on(Laya.Event.CLICK, this, this.onChatWndClick);
    this.chatmask.on(Laya.Event.CLICK, this, this.onHideChatWnd);
    this.translateSetBtn.onClick(this, this.onShowTranslateSetting);
    this.chatTablist.itemRenderer = Laya.Handler.create(
      this,
      this.renderChannelListItem,
      null,
      false
    );
    this.chatMsglist.itemProvider = Laya.Handler.create(
      this,
      this.getListItemResource,
      null,
      false
    );
    this.chatMsglist.itemRenderer = Laya.Handler.create(
      this,
      this.renderMessageListItem,
      null,
      false
    );
    this.privateChatList.itemProvider = Laya.Handler.create(
      this,
      this.getPrivateListItemResource,
      null,
      false
    );
    this.privateChatList.itemRenderer = Laya.Handler.create(
      this,
      this.renderPrivateMessageListItem,
      null,
      false
    );
    this.privateChatList.setVirtual();
    this.chatTablist.on(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onChannelSelect
    );
    this.chatInput.inputmsg.displayObject.on(
      Laya.Event.ENTER,
      this,
      this.sendChatMessage
    );
    // if(Utils.isApp()){
    // this.chatInput.inputmsg.on(Laya.Event.FOCUS, this, this.onFocusIn);
    // this.chatInput.inputmsg.on(Laya.Event.BLUR, this, this.onFocusOut);
    // }
    Utils.setDrawCallOptimize(this.chatTablist);
    Utils.setDrawCallOptimize(this.chatMsglist);
    Utils.setDrawCallOptimize(this.privateChatList);

    this.chatSendBtn.onClick(this, this.sendChatMessage);
    this.voiceMsgBtn.onClick(this, this.sendChatVoice);
    this.textBtn.onClick(this, this.onShowInputTxt);
    this.btn_face.onClick(this, this.sendChatFace);
    this.hideBtn.onClick(this, this.onHideChatWnd);
    this.unreadBg.onClick(this, this.onUnreadFlagClick);

    NotificationManager.Instance.addEventListener(
      ChatEvent.CHAT_EMJOY_CLICK,
      this.__addEmjoyHandler,
      this
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.UPDATE_CHAT_VIEW,
      this.__updateChatViewHandler,
      this
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.CHAT_CHANNEL_CHANGE,
      this.__channelChangeHandler,
      this
    );

    NotificationManager.Instance.addEventListener(
      ChatEvent.SEND_GOODS,
      this.__sendGoodsinfoHandler,
      this
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.SEND_STAR,
      this.__sendstarInfoHandler,
      this
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.SEND_CARD,
      this.__sendCardInfoHandler,
      this
    );
    ArmyManager.Instance.thane.addEventListener(
      PlayerEvent.SMALL_BUGLE_FREE_COUNT,
      this.__smallBugleFreeCountHandler,
      this
    );

    NotificationManager.Instance.addEventListener(
      ChatEvent.CHANNEL_CLICK,
      this.__onChannelSelect,
      this
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.PLAYER_NAME_CLICK,
      this.__playerNameClickHandler,
      this
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.CONSORTIA_CLICK,
      this.__consortiaClickHandler,
      this
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.ROOM_CLICK,
      this.__roomClickHandler,
      this
    );
    // NotificationManager.Instance.addEventListener(ChatEvent.STAR_CLICK, this.__starClickHandler, this);
    // NotificationManager.Instance.addEventListener(ChatEvent.EQUIP_CLICK, this.__equipClickHandler, this);
    // NotificationManager.Instance.addEventListener(ChatEvent.PROP_CLICK, this.__propClickHandler, this);
    NotificationManager.Instance.addEventListener(
      ChatEvent.VIP_LINK_CLICK,
      this.__vipLinkClickHandler,
      this
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.APPELL_LINK_CLICK,
      this.__appellLinkClickHandler,
      this
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.ROSE_BACK_CLICK,
      this.__roseBackClickHandler,
      this
    );
    // NotificationManager.Instance.addEventListener(ChatEvent.REINFORCE_CLICK, this.__reinforceClickHandler, this);
    // NotificationManager.Instance.addEventListener(ChatEvent.SEEK_LINK_CLICK, this.__seekLinkClickHandler, this);
    // NotificationManager.Instance.addEventListener(ChatEvent.CARD_CLICK, this.__cardClickHandler, this);
    // NotificationManager.Instance.addEventListener(ChatEvent.FISH_CLICK, this.__fishClickHandler, this);
    // NotificationManager.Instance.addEventListener(ChatEvent.OUTER_CITY_BOSS_CLICK, this.onOuterCityBossClick, this);
    NotificationManager.Instance.addEventListener(
      ChatEvent.CHAT_MESSAGE,
      this.__onChangeSelect,
      this
    );
    // IMManager.Instance.addEventListener(IMEvent.MSG_SEND_RESPONSE, this.__sendMsgResponseHandler, this);
    IMManager.Instance.addEventListener(
      IMEvent.RECEIVE_MSG,
      this.__receiveMsgHandler,
      this
    );
    IMManager.Instance.addEventListener(
      IMEvent.RECEIVE_VOICE_MSG,
      this.addVoiceItem,
      this
    );

    NotificationManager.Instance.addEventListener(
      ChatEvent.UPDATE_SELECTED_PRIVATECHAT,
      this.refreshPrivateChatList,
      this
    );
    IMManager.Instance.addEventListener(
      IMEvent.MSG_LIST_DEL,
      this.__imFrameUpdateHandler,
      this
    );
    IMManager.Instance.addEventListener(
      IMFrameEvent.REMOVE,
      this.__imFrameUpdateHandler,
      this
    );
    IMManager.Instance.addEventListener(
      IMEvent.TRANSLATE_MSG,
      this.__refreshTranslate,
      this
    );
  }

  private __refreshTranslate() {
    this.chatMsglist.refreshVirtualList();
    this.privateChatList.refreshVirtualList();
  }

  private __imFrameUpdateHandler() {
    let frameNum: number = SharedManager.Instance.privacyMsgCount; // IMManager.Instance.model.msgBoxList.length;
    frameNum > IMModel.MAX_MSGBOX_ITEMNUM
      ? (frameNum = IMModel.MAX_MSGBOX_ITEMNUM)
      : frameNum;
    // if (frameNum > 0) {
    //     this.chatTablist.getChildAt(4)["redPoint"].visible = true;
    // } else {
    //     this.chatTablist.getChildAt(4)["redPoint"].visible = false;
    // }
    this.setRedPoint(ChatTabIndex.PERSONAL, frameNum > 0);
  }

  private setPrivateChatListData() {
    this.privateChatList.numItems = this.chatPrivateMessages.length;
  }

  private setPrivateChatBottom() {
    if (this.chatPrivateMessages.length > 0) {
      this.privateChatList.scrollPane.scrollBottom();
    }
  }
  //切换私聊,携带历史记录
  private refreshPrivateChatList() {
    if (this.model.privateData) {
      this.chatPrivateMessages = [];
      let arr = IMManager.Instance.getIMHistoryList(
        this.model.privateData.userId
      );
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          this.chatPrivateMessages.push(this.createMsgItem(arr[i]));
        }
      }

      this.setPrivateChatListData();
      this.setPrivateChatBottom();
    } else {
      this.privateChatList.numItems = 0;
    }
  }

  private _curReadIndex = 0;
  //接收私聊消息
  private __receiveMsgHandler(msg: BaseIMInfo) {
    let privateData = this.model.privateData;
    if (msg) {
      let chatData = this.createMsgItem(msg);
      let isself = this.checkSelf(chatData);
      if (
        privateData &&
        (privateData.userId == msg.userId || privateData.userId == msg.toId)
      ) {
        let toBottom = this.isPrivateChatBottom() || isself;
        this.chatPrivateMessages.push(chatData);
        this.setPrivateChatListData();
        if (toBottom) {
          this.setPrivateChatBottom();
          this.unreadGroup.visible = false;
          this._curReadIndex = this.chatPrivateMessages.length;
        } else {
          let count = this.chatPrivateMessages.length - this._curReadIndex - 1;
          this.unreadLab
            .setVar(
              "count",
              count > this.maxUnreadCount
                ? this.maxUnreadCount + "+"
                : count + ""
            )
            .flushVars();
          this.unreadGroup.visible = count > 0;
        }
      } else {
      }
      //收到新的私聊消息要放到前面
      if (isself) {
        this.privateList.sortList(msg.toId);
      } else {
        this.privateList.sortList(msg.userId);
      }

      if (this.getCurrentChannel() != ChatChannel.PERSONAL) {
        this.setRedPoint(ChatTabIndex.PERSONAL);
      } else {
        this.__imFrameUpdateHandler();
      }
    }
  }

  private checkSelf(value: ChatData) {
    let isSameServer: boolean = true;
    if (value.serverName && value.serverName != "")
      //跨服判断
      isSameServer =
        value.serverName ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
    let isSelf =
      value.uid == PlayerManager.Instance.currentPlayerModel.userInfo.userId &&
      isSameServer;
    return isSelf;
  }

  //私聊是否在最底
  private isPrivateChatBottom() {
    return this.privateChatList.scrollPane.isBottomMost;
  }

  private onUnreadFlagClick() {
    this.setPrivateChatBottom();
    this.unreadGroup.visible = false;
    this._curReadIndex = this.chatPrivateMessages.length;
    this._curChatReadIndex = this.chatMessages.length;
    this.chatMsglist.scrollPane.scrollBottom();
  }

  private addVoiceItem(msg: ChatData) {
    let toBottom = this.isPrivateChatBottom() || this.checkSelf(msg);
    this.chatPrivateMessages.push(msg);
    this.setPrivateChatListData();
    if (toBottom) {
      this.setPrivateChatBottom();
      this.unreadGroup.visible = false;
      this._curReadIndex = this.chatPrivateMessages.length;
    } else {
      let count = this.chatPrivateMessages.length - this._curReadIndex - 1;
      this.unreadLab
        .setVar(
          "count",
          count > this.maxUnreadCount ? this.maxUnreadCount + "+" : count + ""
        )
        .flushVars();
      this.unreadGroup.visible = count > 0;
    }

    // if (msg && this.model.privateData && this.model.privateData.userId == msg.uid) {
    // let toBottom = this.isPrivateChatBottom();
    // this.chatPrivateMessages.push(msg);
    // this.setPrivateChatListData();
    // if (toBottom) {
    //     this.setPrivateChatBottom();
    //     this.unreadGroup.visible = false;
    // } else {
    //     this.unreadGroup.visible = true;
    // }
    if (this.getCurrentChannel() != ChatChannel.PERSONAL) {
      // this.chatTablist.getChildAt(4)["redPoint"].visible = true;
      this.setRedPoint(ChatTabIndex.PERSONAL);
    }

    // }
  }

  private createMsgItem(msg: BaseIMInfo): ChatData {
    if (!msg) return null;
    var chatData: ChatData = new ChatData();
    chatData.uid = msg.userId;
    if (msg.userId == this.playerInfo.userId) {
      chatData.channel = ChatChannel.BUBBLETYPE_SELF;
      chatData.headId = ArmyManager.Instance.thane.snsInfo.headId;
    } else {
      chatData.channel = ChatChannel.BUBBLETYPE_TARGET;
      if (this.model.privateData && this.model.privateData.snsInfo) {
        chatData.headId = this.model.privateData.snsInfo.headId;
      }
    }
    chatData.appellId = msg.appellId;
    chatData.serverId = msg.serverId;
    chatData.userLevel = msg.userLevel;
    chatData.senderName = msg.nickName;
    chatData.job = msg.job;
    chatData.headId = msg.headId;
    chatData.frameId = msg.frameId;
    chatData.msg = msg.msg;
    chatData.encodemsg = msg.msg;
    chatData.sendTime = msg.sendTime;
    chatData.voiceTime = msg.voiceTime;
    chatData.receiveId = msg.toId;
    chatData.isRead = msg.isRead;
    chatData.consortiaId = msg.consortiaId;
    chatData.consortiaName = msg.consortiaName;
    chatData.fight = msg.fight;
    chatData.hashCode = msg.hashCode;
    chatData.translateMsg = msg.translateMsg;
    chatData.translateLangKey = msg.translateLangKey;

    if (msg.serverId) {
      chatData.serverId = msg.serverId;
    } else {
      chatData.msg = ChatManager.Instance.analyzeExpressionForIMChat(
        chatData.msg
      );
      chatData.commit();
    }

    return chatData;
  }

  private getTimer(): number {
    return Laya.systemTimer.currTimer;
  }

  /**发送聊天表情 */
  private sendChatFace() {
    if (!UIManager.Instance.isShowing(EmWindow.ChatFaceWnd)) {
      let globalPos = this.localToGlobal(
        new Laya.Point(this.btn_face.x, this.btn_face.y)
      );
      UIManager.Instance.ShowWind(EmWindow.ChatFaceWnd, globalPos);
    }
  }

  /**发送聊天语音 */
  private sendChatVoice() {
    this.voiceCtrl.setSelectedIndex(1);
    this.initVoice();
  }

  private onShowInputTxt() {
    this.voiceCtrl.setSelectedIndex(0); //显示松开发送
  }

  private onChatWndClick(evt: Laya.Event) {
    if (
      evt.target &&
      evt.target["$owner"] &&
      evt.target["$owner"].parent.name == "btn_face"
    ) {
      return;
    }
    if (UIManager.Instance.isShowing(EmWindow.ChatFaceWnd)) {
      UIManager.Instance.HideWind(EmWindow.ChatFaceWnd);
    }
    if (UIManager.Instance.isShowing(EmWindow.ChatItemMenu)) {
      UIManager.Instance.HideWind(EmWindow.ChatItemMenu);
    }
  }

  /**关闭聊天窗口 */
  private onHideChatWnd() {
    UIManager.Instance.HideWind(EmWindow.ChatFaceWnd);
    this.chatShowCtrl.selectedIndex = 0;
    Utils.delay(500).then(() => {
      //延迟500mS关闭界面
      // this.removeEvent();
      FrameCtrlManager.Instance.exit(EmWindow.ChatWnd);
      if (UIManager.Instance.isShowing(EmWindow.ChatItemMenu)) {
        UIManager.Instance.HideWind(EmWindow.ChatItemMenu);
      }
    });
  }

  private _currentChatStr: string = "";
  private _sendItemList: Array<GoodsInfo> = [];
  private _sendStarList: Array<StarInfo> = [];
  private _sendCardList: Array<MagicCardInfo> = [];
  /**发送聊天消息 */
  private sendChatMessage() {
    if (PlayerManager.Instance.currentPlayerModel.checkChatForbidIsOpen()) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("chat_forbiden_text")
      );
      return;
    }
    var chatStr: string = this.chatInput.getInputText();
    if (StringHelper.trim(chatStr) == "") {
      //空字符串不发送
      Logger.warn("不能发送空字符串");
      return;
    }

    if (ChatDebug.filter(chatStr)) {
      return;
    }
    Logger.log("发送聊天 : : : : :    " + this.getTimer() + "---:" + chatStr);

    var i: number = 0;
    var allLowstring: string = chatStr.toLocaleLowerCase();
    if (allLowstring.indexOf("/") == 0) {
      for (i = 0; i < ChatChannel.chanel_key_set.length; i++) {
        var index: number = allLowstring.indexOf(
          "/" + ChatChannel.chanel_key_set[i]
        );
        if (index == 0) {
          chatStr = chatStr.substring(2, chatStr.length);
          NotificationManager.Instance.sendNotification(
            ChatEvent.CHAT_CHANNEL_CHANGE,
            ChatChannel.channels[i]
          );
        }
      }
    }
    var srr: Array<string> = chatStr.match(/\[([^\]]*)\]*/g);
    let len: number = 0;
    if (srr) len = srr.length;
    var name: string = "";
    var itemList: Array<ChatItemInfoMsg> = [];
    var starList: Array<ChatStarInfoMsg> = [];
    var cardList: Array<ChatPowCardInfoMsg> = [];
    if (len > 0) {
      for (i = 0; i < len; i++) {
        for (const key in this._sendItemList) {
          if (Object.prototype.hasOwnProperty.call(this._sendItemList, key)) {
            var info: GoodsInfo = this._sendItemList[key];
            name = srr[i].toString().substring(1, srr[i].toString().length - 2);
            if (info.templateInfo.TemplateNameLang == name) {
              var itemMsg: ChatItemInfoMsg = ItemHelper.createChatItemInfoMsg(
                info,
                name
              );
              itemList.push(itemMsg);
              break;
            }
          }
        }

        for (const key in this._sendStarList) {
          if (Object.prototype.hasOwnProperty.call(this._sendStarList, key)) {
            var sinfo: StarInfo = this._sendStarList[key];
            name = srr[i].toString().substr(1, srr[i].toString().length - 2);
            if (sinfo.template.TemplateNameLang == name) {
              var starMsg: ChatStarInfoMsg = new ChatStarInfoMsg();
              starMsg.templateId = sinfo.tempId;
              starMsg.grade = sinfo.grade;
              starMsg.starName = name;
              starList.push(starMsg);
              break;
            }
          }
        }

        for (const key in this._sendCardList) {
          if (Object.prototype.hasOwnProperty.call(this._sendCardList, key)) {
            var cinfo: MagicCardInfo = this._sendCardList[key];
            name = srr[i].toString().substr(1, srr[i].toString().length - 2);
            if (cinfo.magicCardTemplate.TemplateName == name) {
              var cardMsg: ChatPowCardInfoMsg = new ChatPowCardInfoMsg();
              cardMsg.templateId = cinfo.templateId;
              cardMsg.grade = cinfo.grade;
              cardMsg.powcardName = name;
              cardMsg.buffId = cinfo.buff.bufId;
              cardMsg.sonType = cinfo.buff.sonType;
              cardMsg.fixValue = cinfo.buff.fixvalue;
              cardMsg.percent = cinfo.buff.percent;
              cardList.push(cardMsg);
              break;
            }
          }
        }
      }
    }

    this._currentChatStr = ChatHelper.parasMsgs(chatStr);
    if (
      !ChatHelper.checkCanSend(this._currentChatStr, this.getCurrentChannel())
    ) {
      this.chatInput.clearText();
      return;
    }

    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    if (playerInfo.right != UserType.NORMAL)
      this._currentChatStr = StringHelper.rePlaceHtmlTextField(chatStr);
    if (
      this.getCurrentChannel() == ChatChannel.CURRENT &&
      playerInfo.right == UserType.NORMAL
    ) {
      if (ChatHelper.checkSceneType()) {
        ChatHelper.lastSendTime1 = this.getTimer();
      } else {
        ChatHelper.lastSendTime2 = this.getTimer();
      }
    } else if (this.getCurrentChannel() == ChatChannel.BIGBUGLE) {
      let content: string =
        LangManager.Instance.GetTranslation("Chat.Bigbugle");
      var num: number = GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.BIG_BUGLE_TEMP_ID
      );
      let goodsCount: string = LangManager.Instance.GetTranslation(
        "chatwnd.goodsCount.text",
        num
      );
      UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {
        content: content,
        goodsId: ShopGoodsInfo.BIG_BUGLE_TEMP_ID,
        goodsCount: goodsCount,
        callback: this.promptCallback.bind(this),
      });
      return;
    } else if (this.getCurrentChannel() == ChatChannel.WORLD) {
      this.smallBugleHandler(
        this._currentChatStr,
        itemList,
        starList,
        cardList
      );
      return;
    } else if (this.getCurrentChannel() == ChatChannel.CROSS_BIGBUGLE) {
      this.crossBugleHandler(
        this._currentChatStr,
        itemList,
        starList,
        cardList
      );
      return;
    } else if (this.getCurrentChannel() == ChatChannel.SYSTEM) {
      //系统频道不允许发消息, 展示系统信息公告等
      return;
    }
    if (this.getCurrentChannel() == ChatChannel.PERSONAL) {
      if (!this.model.privateData) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("chat.personal.tip")
        );
        return;
      }
      //先判断对方是否是好友
      if (
        !FriendManager.getInstance().checkIsFriend(
          this.model.privateData.userId
        )
      ) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("chat.notfriend")
        );
      } else {
        IMManager.Instance.sendIMMsg(
          this.model.privateData.userId,
          this._currentChatStr
        );
      }
    } else {
      ChatManager.Instance.chatNormal(
        this._currentChatStr,
        this.getCurrentChannel(),
        "",
        itemList,
        starList,
        cardList
      );
    }
    this.chatInput.clearText();
  }

  private promptCallback(b: boolean) {
    if (b) {
      this.bigBugleHandler(this._currentChatStr, [], [], []);
    }
  }

  private bigBugleHandler(str: string, itemList, starList, cardList) {
    if (!this._flag) {
      let item: t_s_itemtemplateData =
        TempleteManager.Instance.getGoodsTemplatesByTempleteId(
          ShopGoodsInfo.BIG_BUGLE_TEMP_ID
        );
      if (item) {
        if (item.NeedGrades > ArmyManager.Instance.thane.grades) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "chatWnd.bigBugle.tips",
              item.NeedGrades
            )
          );
          return;
        }
      }
      var num: number = GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.BIG_BUGLE_TEMP_ID
      );
      if (num == 0) {
        var command: string = LangManager.Instance.GetTranslation(
          "chat.view.ChatInputView.command06"
        );
        MessageTipManager.Instance.show(command);
        var data: ShopGoodsInfo =
          TempleteManager.Instance.getShopTempInfoByItemId(
            ShopGoodsInfo.BIG_BUGLE_TEMP_ID
          );
        let obj = {
          info: data,
          count: 1,
          param: [
            ShopGoodsInfo.BIG_BUGLE_TEMP_ID,
            itemList,
            starList,
            cardList,
          ],
        };
        FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, obj);
        return;
      }
      ChatManager.Instance.chatByBugle(
        this._currentChatStr,
        itemList,
        starList,
        cardList
      );
      this.chatInput.setInputText("");
      this._flag = false;
    }
  }

  private _flag: boolean;
  private crossBugleHandler(str: string, itemList, starList, cardList) {
    if (!this._flag) {
      var num: number = GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.CROSS_BUGLE_TEMP_ID
      );
      if (num == 0) {
        var command: string = LangManager.Instance.GetTranslation(
          "chat.view.ChatInputView.command06"
        );
        MessageTipManager.Instance.show(command);
        var data: ShopGoodsInfo =
          TempleteManager.Instance.getShopTempInfoByItemId(
            ShopGoodsInfo.CROSS_BUGLE_TEMP_ID
          );
        let obj = {
          info: data,
          count: 1,
          callback: this.shopBugleBack.bind(this),
          param: [
            ShopGoodsInfo.CROSS_BUGLE_TEMP_ID,
            itemList,
            starList,
            cardList,
          ],
        };
        FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, obj);
        return;
      }
    }
    ChatManager.Instance.chatByCross(str, itemList, starList, cardList);
    this.chatInput.setInputText("");
  }

  private _smallBulgeFlag: boolean;
  private _smallBugleCache: Object;
  private smallBugleHandler(str: string, itemList, starList, cardList) {
    this._smallBugleCache = new Object();
    this._smallBugleCache["str"] = str;
    this._smallBugleCache["itemList"] = itemList;
    this._smallBugleCache["starList"] = starList;
    this._smallBugleCache["cardList"] = cardList;
    if (!this._flag) {
      var num: number = GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.SMALL_BUGLE_TEMP_ID
      );
      if (num == 0) {
        if (ArmyManager.Instance.thane.smallBugleFreeCount <= 0) {
          var command: string = LangManager.Instance.GetTranslation(
            "chat.view.ChatInputView.command06"
          );
          MessageTipManager.Instance.show(command);
          var data: ShopGoodsInfo =
            TempleteManager.Instance.getShopTempInfoByItemId(
              ShopGoodsInfo.SMALL_BUGLE_TEMP_ID
            );
          let obj = {
            info: data,
            count: 1,
            // callback: this.shopBugleBack.bind(this),
            param: [
              ShopGoodsInfo.SMALL_BUGLE_TEMP_ID,
              itemList,
              starList,
              cardList,
            ],
          };
          FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, obj);
          return;
        } else {
          this._smallBulgeFlag = true;
          ChatSocketOutManager.sendSmallBugleFreeCount();
          return;
        }
      }
    }
    ChatManager.Instance.chatBySmallBugle(str, itemList, starList, cardList);
    this.chatInput.setInputText("");
  }

  private __smallBugleFreeCountHandler(evt) {
    if (!this._smallBulgeFlag) {
      return;
    }
    this._smallBulgeFlag = false;
    var str: string = this._smallBugleCache["str"];
    var itemList = this._smallBugleCache["itemList"];
    var starList = this._smallBugleCache["starList"];
    var cardList = this._smallBugleCache["cardList"];
    if (!this._flag) {
      var num: number = GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.SMALL_BUGLE_TEMP_ID
      );
      if (num == 0) {
        if (ArmyManager.Instance.thane.smallBugleFreeCount <= 0) {
          var command: string = LangManager.Instance.GetTranslation(
            "chat.view.ChatInputView.command06"
          );
          MessageTipManager.Instance.show(command);

          var data: ShopGoodsInfo =
            TempleteManager.Instance.getShopTempInfoByItemId(
              ShopGoodsInfo.SMALL_BUGLE_TEMP_ID
            );
          let obj = {
            info: data,
            count: 1,
            callback: this.shopBugleBack.bind(this),
            param: [
              ShopGoodsInfo.SMALL_BUGLE_TEMP_ID,
              itemList,
              starList,
              cardList,
            ],
          };
          FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, obj);
          return;
        }
      }
    }
    ChatManager.Instance.chatBySmallBugle(str, itemList, starList, cardList);
    this.chatInput.setInputText("");
    ChatHelper.lastSendTime3 = this.getTimer(); //上一次发言成功后才开始计算冷却时间
  }

  // private quickUIcallback(list) {
  // var data: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(list[0]);
  // buyFrame.data(data, 1, list);
  // buyFrame.show();
  // buyFrame.callback = this.shopBugleBack.bind(this);
  // }

  private shopBugleBack(flag: boolean, data: Object) {
    if (flag) {
      this._flag = true;
      var itemId: number = Number(data[0]);
      if (itemId == ShopGoodsInfo.SMALL_BUGLE_TEMP_ID) {
        ChatManager.Instance.chatBySmallBugle(
          this._currentChatStr,
          data[1],
          data[2],
          data[3]
        );
      } else if (itemId == ShopGoodsInfo.BIG_BUGLE_TEMP_ID) {
        ChatManager.Instance.chatByBugle(
          this._currentChatStr,
          data[1],
          data[2],
          data[3]
        );
      } else if (itemId == ShopGoodsInfo.CROSS_BUGLE_TEMP_ID) {
        ChatManager.Instance.chatByCross(
          this._currentChatStr,
          data[1],
          data[2],
          data[3]
        );
      }
      this.chatInput.setInputText("");
      this._flag = false;
    }
  }

  private getCurrentChannel(): number {
    let channelTabIndex = this.chatTablist.selectedIndex;
    let channel = this.chatTabChannels[channelTabIndex];
    return channel;
  }

  /**渲染Tab列表 */
  private renderChannelListItem(index: number, item: ChatTabBtn) {
    if (!item) return;
    let channel = this.chatTabChannels[index];
    let channelText = this.chatTabTexts[channel];
    let channelNewMsgState = false;
    let itemData = new ChatTabData();
    itemData.index = index;
    itemData.channel = channel;
    itemData.channelText = channelText;
    //是否有新消息
    if (channel == ChatChannel.PERSONAL) {
      channelNewMsgState = SharedManager.Instance.privacyMsgCount > 0;
    } else if (channel == ChatChannel.CONSORTIA) {
      channelNewMsgState =
        this.consortiaMsgCount > SharedManager.Instance.consortiaMsgCount;
    } else if (channel == ChatChannel.TEAM) {
      channelNewMsgState =
        this.teamMsgCount > SharedManager.Instance.teamMsgCount;
    }
    itemData.hasNewMessage = channelNewMsgState;
    item.ItemData = itemData;
  }

  //不同渲染聊天单元格
  private getListItemResource(index: number) {
    let msg: ChatData = this.chatMessages[index];
    if (msg) {
      //系统信息
      if (
        msg.channel == ChatChannel.INFO ||
        msg.channel == ChatChannel.SYSTEM ||
        msg.channel == ChatChannel.NOTICE
      ) {
        return FUI_SystemMsgCell.URL; //系统聊天cell
      } else if (msg.channel == ChatChannel.CONSORTIA) {
        //公会
        if (msg.uid < 1) {
          return FUI_SystemMsgCell.URL;
        } else {
          if (msg.serverId) {
            return FUI_VoiceMsgCell.URL; //语音聊天消息cell
          } else {
            return FUI_ChatMsgCell.URL; //普通聊天消息cell
          }
        }
      } else {
        if (msg.serverId) {
          return FUI_VoiceMsgCell.URL; //语音聊天消息cell
        } else {
          return FUI_ChatMsgCell.URL; //普通聊天消息cell
        }
      }
    } else {
      return FUI_ChatMsgCell.URL; //普通聊天消息cell
    }
  }

  private getPrivateListItemResource(index: number) {
    let msg: ChatData = this.chatPrivateMessages[index];
    this._curReadIndex = Math.max(this._curReadIndex, index);
    if (this.unreadGroup.visible) {
      let count = this.chatPrivateMessages.length - this._curReadIndex - 1;
      this.unreadLab
        .setVar(
          "count",
          count > this.maxUnreadCount ? this.maxUnreadCount + "+" : count + ""
        )
        .flushVars();
      this.unreadGroup.visible = count > 0;
    }
    if (msg && msg.serverId) {
      return FUI_VoiceMsgCell.URL; //语音聊天消息cell
    } else {
      return FUI_ChatMsgCell.URL; //普通聊天消息cell
    }
  }

  /**渲染消息列表 */
  private renderMessageListItem(index: number, item: ChatMsgCell | SysMsgCell) {
    if (item) {
      item.chatData = this.chatMessages[index];
      this._curChatReadIndex = Math.max(index, this._curChatReadIndex);
      if (this.unreadGroup.visible) {
        let count = this.chatMessages.length - this._curChatReadIndex - 1;
        this.unreadLab
          .setVar(
            "count",
            count > this.maxUnreadCount ? this.maxUnreadCount + "+" : count + ""
          )
          .flushVars();
        this.unreadGroup.visible = count > 0;
      }
    }
  }

  private renderPrivateMessageListItem(
    index: number,
    item: ChatMsgCell | VoiceMsgCell
  ) {
    if (item) {
      item.chatData = this.chatPrivateMessages[index];
    }
    // Laya.timer.callLater(this,this.delayCall,[item]);
  }

  /**清除消息列表 */
  // private clearChannelMessage() {
  //     if (this.isShowing) {
  //         if (this.chatMsglist) {
  //             this.chatMsglist.numItems = 0;
  //         }
  //     }
  // }

  private __onChangeSelect(data: ThaneInfo) {
    this.chatTablist.selectedIndex = ChatTabIndex.PERSONAL;
    this.chatSendCtrl.selectedIndex = ChatTabIndex.WORLD;
    this.__onChannelSelect();
  }

  /**列表TabChannel  选择*/
  private __onChannelSelect() {
    if (!this.isInit) {
      this.isInit = true;
    } else {
      AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    }
    //
    if (!this.chatPrivateCtrl) return; //避免销毁后再访问
    this.privateList.visible = false;
    this.resetUnReadFlag();
    this.chatPrivateCtrl.selectedIndex = 0;
    let selectedIndex = this.chatTablist.selectedIndex;
    if (selectedIndex == ChatTabIndex.SYSTEM) {
      this.chatSendCtrl.selectedIndex = 1;
    } else {
      this.chatSendCtrl.selectedIndex = 0;
    }
    switch (selectedIndex) {
      // case 0:
      //     this.model.currentOutChannel = ChatChannel.ALL;
      //     break
      case ChatTabIndex.WORLD:
        this.model.currentOutChannel = ChatChannel.WORLD;
        this.voiceMsgBtn.enabled = false;
        this.onShowInputTxt();
        break;
      case ChatTabIndex.BIGBUGLE:
        this.voiceMsgBtn.enabled = false;
        this.model.currentOutChannel = ChatChannel.BIGBUGLE;
        break;
      case ChatTabIndex.TEAM:
        this.voiceMsgBtn.enabled = true;
        this.model.currentOutChannel = ChatChannel.TEAM;
        SharedManager.Instance.teamMsgCount = this.teamMsgCount;
        // SharedManager.Instance.saveNewMsg();
        // this.chatTablist.getChildAt(2)["redPoint"].visible = false;
        this.setRedPoint(selectedIndex, false);
        break;
      case ChatTabIndex.CONSORTIA:
        this.voiceMsgBtn.enabled = true;
        this.model.currentOutChannel = ChatChannel.CONSORTIA;
        SharedManager.Instance.consortiaMsgCount = this.consortiaMsgCount;
        // SharedManager.Instance.saveNewMsg();
        // this.chatTablist.getChildAt(3)["redPoint"].visible = false;
        this.setRedPoint(selectedIndex, false);
        break;
      case ChatTabIndex.PERSONAL:
        this.voiceMsgBtn.enabled = true;
        this.model.currentOutChannel = ChatChannel.PERSONAL;
        this.chatPrivateCtrl.selectedIndex = 1;
        this.privateList.visible = true;
        this.privateList.updateView();
        // this.chatTablist.getChildAt(4)["redPoint"].visible = false;
        this.setRedPoint(selectedIndex, false);
        // SharedManager.Instance.privacyMsgCount = 0;
        // SharedManager.Instance.saveNewMsg();
        IMManager.Instance.dispatchFrameRemoveEvent();
        break;
      case ChatTabIndex.SYSTEM:
        this.model.currentOutChannel = ChatChannel.SYSTEM;
        break;
    }
    ChatWnd.curTabIndex = selectedIndex;
  }

  /**切换聊天页签 */
  private __channelChangeHandler() {
    this.updateChatMsgList();
  }

  /**添加聊天表情 */
  private __addEmjoyHandler(emjoyData) {
    if (this.chatInput != null) {
      let text = this.chatInput.getInputText();
      if (emjoyData) {
        text += "#" + emjoyData.eindex;
        this.chatInput.setInputText(text);
        this.checkLength();
      } else {
        this.chatInput.setInputText(text.substring(0, text.length - 3));
      }
    }
  }

  /**
   * 检测有新消息时红点提示
   * 1、第一次打开界面的时候检测
   * 2、打开界面后有新消息时检测
   */
  private checkRedPoint(data) {
    if (data.channel == ChatChannel.CONSORTIA) {
      this.consortiaMsgCount++;
      if (this.consortiaMsgCount > SharedManager.Instance.consortiaMsgCount) {
        if (this.model.currentOutChannel != ChatChannel.CONSORTIA) {
          this.setRedPoint(ChatTabIndex.CONSORTIA);
        } else {
          SharedManager.Instance.consortiaMsgCount = this.consortiaMsgCount;
        }
      }
    } else if (data.channel == ChatChannel.TEAM) {
      this.teamMsgCount++;
      if (this.teamMsgCount > SharedManager.Instance.consortiaMsgCount) {
        if (this.model.currentOutChannel != ChatChannel.TEAM) {
          this.setRedPoint(ChatTabIndex.TEAM);
        } else {
          SharedManager.Instance.teamMsgCount = this.teamMsgCount;
        }
      }
    }
  }

  /**更新聊天展示 */
  private __updateChatViewHandler(evtData) {
    if (this.isShowing) {
      let data: ChatData = evtData as ChatData;
      this.checkRedPoint(data);
      if (!this.checkShow(data)) {
        return;
      }
      this.updateChatMsgList(evtData);
    }
  }
  private _curChatReadIndex = 0;
  private updateChatMsgList(chatData?: ChatData) {
    let list: Array<ChatData> = this.model.getChatsByOutputChannel();
    this.chatMessages.length = 0;
    for (let i: number = 0; i < list.length; i++) {
      this.chatMessages.push(list[i]);
    }
    let toBottom = this.chatMsglist.scrollPane.isBottomMost;
    this.chatMsglist.numItems = this.chatMessages.length;

    //增加聊天消息
    if (chatData) {
      if (toBottom || this.checkSelf(chatData)) {
      } else {
        let count = this.chatMessages.length - this._curChatReadIndex - 1;
        this.unreadLab
          .setVar(
            "count",
            count > this.maxUnreadCount ? this.maxUnreadCount + "+" : count + ""
          )
          .flushVars();
        this.unreadGroup.visible = count > 0;
        return;
      }
    }

    //切换页签
    this.chatMsglist.scrollPane.scrollBottom();
    this.unreadGroup.visible = false;
  }

  private resetUnReadFlag() {
    this.unreadGroup.visible = false;
    this._curChatReadIndex = 0;
    this._curReadIndex = 0;
  }
  private checkShow(data: ChatData): boolean {
    switch (this.model.currentOutChannel) {
      case ChatChannel.WORLD:
        return (
          data.channel != ChatChannel.CONSORTIA &&
          data.channel != ChatChannel.TEAM &&
          data.channel != ChatChannel.CURRENT
        );

      case ChatChannel.TEAM:
        return (
          data.channel != ChatChannel.CONSORTIA &&
          data.channel != ChatChannel.WORLD &&
          data.channel != ChatChannel.CURRENT
        );

      case ChatChannel.CONSORTIA:
        return (
          data.channel != ChatChannel.WORLD &&
          data.channel != ChatChannel.TEAM &&
          data.channel != ChatChannel.CURRENT
        );

      case ChatChannel.INFO:
        return (
          data.channel != ChatChannel.WORLD &&
          data.channel != ChatChannel.TEAM &&
          data.channel != ChatChannel.CONSORTIA &&
          data.channel != ChatChannel.CURRENT
        );
    }
    return true;
  }

  private __playerNameClickHandler(evtData) {
    var cellData: ChatCellData = evtData as ChatCellData;
    if (cellData.userId == this.playerInfo.userId) {
      if (cellData.serverName) {
        if (cellData.serverName == this.playerInfo.serviceName) return;
      } else {
        return;
      }
    }
    var scene: string = SceneManager.Instance.currentType;
    var isCross: boolean = false;
    if (
      cellData.serverName &&
      cellData.serverName != this.playerInfo.serviceName
    ) {
      if (!CampaignManager.Instance.exit && CampaignManager.Instance.mapModel) {
        isCross = CampaignManager.Instance.mapModel.isCross;
      }
      if (!isCross) {
        var str: string = LangManager.Instance.GetTranslation(
          "chatII.datas.getChatChannelName.NotSameServer"
        );
        MessageTipManager.Instance.show(str);
        return;
      }
    }
    var showConsortia: boolean = false;
    if (this.playerInfo.consortiaID > 0) {
      showConsortia = (
        FrameCtrlManager.Instance.getCtrl(
          EmWindow.Consortia
        ) as ConsortiaControler
      ).getRightsByIndex(ConsortiaDutyInfo.PASSINVITE);
      showConsortia = showConsortia && cellData.consortiaId <= 0;
    }
    cellData.point = new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY);
    // if (isCross || data.channel == ChatChannel.CROSS_BIGBUGLE) {
    //     this.showUseMenu(Laya.stage.mouseX, Laya.stage.mouseY, data.data.toString(), data.userId, false, data.serverName);
    // } else {
    //     this.showUseMenu(Laya.stage.mouseX, Laya.stage.mouseY, data.data.toString(), data.userId, showConsortia);
    // }
    UIManager.Instance.ShowWind(EmWindow.OuterCityArmyTips, [cellData]);
  }

  private showUseMenu(
    menuX: number,
    menuY: number,
    name: string,
    id: number,
    showConsortia: boolean,
    servername: string = null
  ) {
    var showInvite: boolean = FreedomTeamManager.Instance.canInviteMember(id);
    let point: Laya.Point = new Laya.Point(menuX, menuY);
    ChatItemMenu.Show(
      name,
      id,
      showConsortia,
      servername,
      false,
      false,
      showInvite,
      point
    );
  }

  private __consortiaClickHandler(evtData) {
    var data: ChatCellData = evtData as ChatCellData;
    if (
      this.playerInfo.consortiaID != 0 ||
      data.consortiaId == this.playerInfo.consortiaID
    ) {
      var str: string = LangManager.Instance.GetTranslation(
        "chat.view.ChatView.command01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    ConsortiaSocketOutManager.consortiaLink(data.consortiaId);
  }

  private __roomClickHandler(evtData) {
    if (!SwitchPageHelp.checkScene()) return;

    var roomInfo: RoomInfo = evtData.data as RoomInfo;
    RoomListSocketOutManager.sendSearchRoomState(roomInfo.id, 0);
  }

  // private __seekLinkClickHandler(evtData) {
  // if (ChatBar.inBattleFlag) return;
  // FrameCtrlManager.Instance.open(UIModuleTypes.TREASURE_HUNT);
  // }

  // private __cardClickHandler(evtData) {
  // var info: MagicCardInfo = (evtData as ChatCellData).data as MagicCardInfo;
  // if (info) {
  //     MagicCardManager.Instance.cardModel.isSelfCheck = false;
  //     FrameCtrlManager.Instance.open(UIModuleTypes.MAGIC_CARD, 1, info);
  // }
  // }

  // private __starClickHandler(evtData) {
  // tipDispose();
  // var info: StarInfo = (evtData as ChatCellData).data as StarInfo;
  // _starstip = new ChatStarTip();
  // _starstip.tipData = info;
  // LayerManager.Instance.addToLayer(_starstip, LayerManager.GAME_DYNAMIC_LAYER);
  // _starstip.x = StageReferance.stage.mouseX;
  // if (ChatBar.inBattleFlag) {
  //     BattleChatController.getInstance.adjustEquipTipPos(_starstip);
  // }
  // else {
  //     _starstip.x = 8 + this.width;
  //     _starstip.y = StageReferance.stage.stageHeight - _starstip.height;
  // }
  // }

  // private __equipClickHandler(evtData) {
  // tipDispose();
  // var data: ChatCellData = evtData as ChatCellData;
  // var info: GoodsInfo = data.data as GoodsInfo;
  // _goodstip = new ChatEquipTips();
  // _goodstip.tipData = info;
  // LayerManager.Instance.addToLayer(_goodstip, LayerManager.GAME_DYNAMIC_LAYER);
  // if (ChatBar.inBattleFlag) {
  //     BattleChatController.getInstance.adjustEquipTipPos(_goodstip);
  // }
  // else {
  //     _goodstip.x = 8 + this.width;
  //     _goodstip.y = StageReferance.stage.stageHeight - _goodstip.height;
  // }
  // }

  // private __propClickHandler(evtData) {
  //     var data: ChatCellData = evtData as ChatCellData;
  //     var info: GoodsInfo = data.data as GoodsInfo;
  // if (info.templateInfo.SonType == GoodsSonType.SONTYPE_PASSIVE_SKILL) {
  //     //符文石
  //     _proptip = new RuneTip();
  // }
  // else if (info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT_CARD) {
  //     _proptip = new MountCardTip;
  // }
  // else if (info.templateInfo.SonType == GoodsSonType.SONTYPE_MAGIC_CARD) {
  //     _proptip = new MagicCardTip();
  // }
  // else {
  //     _proptip = new PropTips();
  // }
  // _proptip.tipData = info;
  // LayerManager.Instance.addToLayer(_proptip, LayerManager.GAME_MENU_LAYER);
  // _proptip.x = StageReferance.stage.mouseX;
  // if (ChatBar.inBattleFlag) {
  //     _proptip.y = StageReferance.stage.mouseY
  // }
  // else {
  //     _proptip.y = StageReferance.stage.mouseY - _proptip.height - 5;
  // }
  // }

  private __vipLinkClickHandler(evtData) {
    FrameCtrlManager.Instance.open(EmWindow.VipCoolDownFrameWnd);
  }

  private __appellLinkClickHandler(evtData) {
    if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
      return;
    }
    var str: string = "";
    if (ArmyManager.Instance.thane.grades < 30) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatOutputViewII.AppellLinkClickTipTxt2"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    var data: ChatCellData = evtData as ChatCellData;
    var appellId: number = Number(data.appellId);
    var appellInfo: t_s_appellData =
      TempleteManager.Instance.getAppellInfoTemplateByID(appellId);
    if (!appellInfo) return;
    if (
      appellInfo.Job != 0 &&
      appellInfo.Job != ThaneInfoHelper.getJob(ArmyManager.Instance.thane.job)
    ) {
      str = LangManager.Instance.GetTranslation(
        "chat.view.ChatOutputViewII.AppellLinkClickTipTxt3"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, { appellID: appellId });
  }

  private __roseBackClickHandler(evtData) {
    if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
      return;
    }
    // if (GoodsManager.Instance.getGoodsNumByTempId(RosePresentBackView.ROSEID_1) <= 0) {
    //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("friends.im.IMFrame.present.TipTxt"));
    //     return;
    // }
    // var targetName: string = (evtData as ChatCellData).nickName;
    UIManager.Instance.ShowWind(EmWindow.SendFlowerWnd, evtData);
  }

  private setRedPoint(tabIndex: number, isShow = true) {
    let tab = this.chatTablist.getChildAt(tabIndex);
    if (!tab) return;
    let redPoint = tab["redPoint"];
    if (!redPoint) return;
    redPoint.visible = isShow;
  }

  // private __reinforceClickHandler(evtData) {
  // if (ChatBar.inBattleFlag) return;
  // var cellData: ChatCellData = (evtData as ChatCellData);
  // var userId: number = cellData.data.userId;
  // var mapId: number = cellData.data.mapId;
  // var posX: number = cellData.data.posX * Tiles.WIDTH;
  // var posY: number = cellData.data.posY * Tiles.HEIGHT;
  // var target: string = mapId + ",0";
  // var position: Laya.Point = new Laya.Point(posX, posY);
  // var reinforceTarget: Object = { userId: userId, mapId: mapId, posX: posX, posY: posY };
  // if (FreedomTeamManager.Instance.inMyTeam(userId)) {
  //     if (MopupManager.Instance.model.isMopup) {
  //         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("chat.view.ChatOutputViewII.ReinforceClickTipTxt1"));
  //     }
  //     else {
  //         TreasureMapManager.Instance.model.reinforceTarget = reinforceTarget;
  //         SwitchPageHelp.walkToCrossMapTarget(target, position);
  //     }
  // }
  // else {
  //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("chat.view.ChatOutputViewII.ReinforceClickTipTxt2"));
  // }
  // }

  // private onOuterCityBossClick(evtData) {
  // var str: string;
  // if (ChatBar.inBattleFlag) return;

  // if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
  //     return;
  // }
  // if (SceneManager.Instance.currentType != SceneType.CASTLE_SCENE) {
  //     str = LangManager.Instance.GetTranslation("map.outercity.view.bossinfo.SPACE_SCENE");
  //     MessageTipManager.Instance.show(str);
  //     return;
  // }

  // AudioManager.Instance.playSound(SoundIds.CAMPAIGN_OUTERCITY_STAR_SOUND);
  // SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE);
  // }

  // private __fishClickHandler(evtData) {
  // if (ChatBar.inBattleFlag) return;
  // if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
  //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("fish.FishFrame.outerCity"));
  //     return;
  // }
  // var cellData: ChatCellData = (evtData as ChatCellData);
  // var userId: number = cellData.userId;
  // FishManager.Instance.model.fishPoolInfo.userId = userId;
  // FishManager.Instance.fishAction(FishActionEnums.HELP, [userId]);
  // FishManager.Instance.model.fishRefuseInvitation = SharedManager.Instance.refuseInvitation;
  // FishManager.Instance.model.fishRefuseInvite = playerInfo.refuseInvite;
  // FishManager.Instance.model.fishRefuseTeamInvite = playerInfo.refuseTeamInvite;
  // if (!FishManager.Instance.model.fishRefuseInvite) {
  //     SocketSendManager.Instance.sendRefuseInvite();
  // }
  // if (!FishManager.Instance.model.fishRefuseInvitation) {
  //     SharedManager.Instance.refuseInvitation = !FishManager.Instance.model.fishRefuseInvitation;
  //     SharedManager.Instance.save();
  // }
  // if (!FishManager.Instance.model.fishRefuseTeamInvite) {
  //     SocketSendManager.Instance.sendRefuseTeamInvite();
  // }
  //			FrameCtrlManager.Instance.open(UIModuleTypes.FISH);
  // }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private __sendGoodsinfoHandler(evtData) {
    var info: GoodsInfo = evtData as GoodsInfo;
    this._sendItemList.push(info);
    let inputText = this.chatInput.getInputText();
    inputText += "[" + info.templateInfo.TemplateNameLang + "]";
    this.chatInput.setInputText(inputText);
    this.checkLength();
  }

  private __sendstarInfoHandler(evtData) {
    var info: StarInfo = evtData as StarInfo;
    this._sendStarList.push(info);
    let inputText = this.chatInput.getInputText();
    inputText += "[" + info.template.TemplateNameLang + "]";
    this.chatInput.setInputText(inputText);
    this.checkLength();
  }

  private __sendCardInfoHandler(evtData) {
    var info: MagicCardInfo = evtData as MagicCardInfo;
    this._sendCardList.push(info);
    let inputText = this.chatInput.getInputText();
    inputText += "[" + info.magicCardTemplate.TemplateName + "]";
    this.chatInput.setInputText(inputText);
    this.checkLength();
  }

  private checkLength() {
    var len: number = this.chatInput.getInputText().length;
    let maxCount = TempleteManager.Instance.CfgMaxWordCount;
    if (len > maxCount)
      this.chatInput.setInputText(
        this.chatInput.getInputText().substring(0, maxCount)
      );
  }

  private onShowTranslateSetting() {
    UIManager.Instance.ShowWind(EmWindow.ChatTranslateSetWnd);
  }

  private removeEvent() {
    if (this.destroyed) return;
    // if(Utils.isApp()){
    //     this.chatInput.inputmsg.off(Laya.Event.FOCUS, this, this.onFocusIn);
    //     this.chatInput.inputmsg.off(Laya.Event.BLUR, this, this.onFocusOut);
    // }
    this.off(Laya.Event.CLICK, this, this.onChatWndClick);
    if (this.chatmask) {
      this.chatmask.off(Laya.Event.CLICK, this, this.onHideChatWnd);
    }
    if (this.chatTablist) {
      // this.chatTablist.itemRenderer.recover();
      Utils.clearGListHandle(this.chatTablist);
      this.chatTablist.off(
        fairygui.Events.CLICK_ITEM,
        this,
        this.__onChannelSelect
      );
    }
    if (this.chatMsglist) {
      // this.chatMsglist.itemRenderer.recover();
      Utils.clearGListHandle(this.chatMsglist);
    }
    if (this.privateChatList) {
      // this.privateChatList.itemRenderer.recover();
      Utils.clearGListHandle(this.privateChatList);
    }

    if (this.chatInput && this.chatInput.inputmsg) {
      this.chatInput.inputmsg.displayObject.off(
        Laya.Event.ENTER,
        this,
        this.sendChatMessage
      );
    }
    if (this.chatSendBtn) {
      this.chatSendBtn.offClick(this, this.sendChatMessage);
    }
    if (this.voiceMsgBtn) {
      this.voiceMsgBtn.offClick(this, this.sendChatVoice);
    }
    if (this.btn_face) {
      this.btn_face.offClick(this, this.sendChatFace);
    }
    if (this.hideBtn) {
      this.hideBtn.offClick(this, this.onHideChatWnd);
    }

    NotificationManager.Instance.removeEventListener(
      ChatEvent.CHAT_EMJOY_CLICK,
      this.__addEmjoyHandler,
      this
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.UPDATE_CHAT_VIEW,
      this.__updateChatViewHandler,
      this
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.CHAT_CHANNEL_CHANGE,
      this.__channelChangeHandler,
      this
    );

    NotificationManager.Instance.removeEventListener(
      ChatEvent.SEND_GOODS,
      this.__sendGoodsinfoHandler,
      this
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.SEND_STAR,
      this.__sendstarInfoHandler,
      this
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.SEND_CARD,
      this.__sendCardInfoHandler,
      this
    );
    ArmyManager.Instance.thane.removeEventListener(
      PlayerEvent.SMALL_BUGLE_FREE_COUNT,
      this.__smallBugleFreeCountHandler,
      this
    );

    NotificationManager.Instance.removeEventListener(
      ChatEvent.CHANNEL_CLICK,
      this.__onChannelSelect,
      this
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.PLAYER_NAME_CLICK,
      this.__playerNameClickHandler,
      this
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.CONSORTIA_CLICK,
      this.__consortiaClickHandler,
      this
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.ROOM_CLICK,
      this.__roomClickHandler,
      this
    );
    // NotificationManager.Instance.removeEventListener(ChatEvent.STAR_CLICK, this.__starClickHandler, this);
    // NotificationManager.Instance.removeEventListener(ChatEvent.EQUIP_CLICK, this.__equipClickHandler, this);
    // NotificationManager.Instance.removeEventListener(ChatEvent.PROP_CLICK, this.__propClickHandler, this);
    NotificationManager.Instance.removeEventListener(
      ChatEvent.VIP_LINK_CLICK,
      this.__vipLinkClickHandler,
      this
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.APPELL_LINK_CLICK,
      this.__appellLinkClickHandler,
      this
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.ROSE_BACK_CLICK,
      this.__roseBackClickHandler,
      this
    );
    // NotificationManager.Instance.removeEventListener(ChatEvent.REINFORCE_CLICK, this.__reinforceClickHandler, this);
    // NotificationManager.Instance.removeEventListener(ChatEvent.SEEK_LINK_CLICK, this.__seekLinkClickHandler, this);
    // NotificationManager.Instance.removeEventListener(ChatEvent.CARD_CLICK, this.__cardClickHandler, this);
    // NotificationManager.Instance.removeEventListener(ChatEvent.FISH_CLICK, this.__fishClickHandler, this);
    // NotificationManager.Instance.removeEventListener(ChatEvent.OUTER_CITY_BOSS_CLICK, this.onOuterCityBossClick, this);
    NotificationManager.Instance.removeEventListener(
      ChatEvent.CHAT_MESSAGE,
      this.__onChangeSelect,
      this
    );
    // IMManager.Instance.removeEventListener(IMEvent.MSG_SEND_RESPONSE, this.__sendMsgResponseHandler, this);
    IMManager.Instance.removeEventListener(
      IMEvent.RECEIVE_MSG,
      this.__receiveMsgHandler,
      this
    );
    IMManager.Instance.removeEventListener(
      IMEvent.RECEIVE_VOICE_MSG,
      this.addVoiceItem,
      this
    );

    NotificationManager.Instance.removeEventListener(
      ChatEvent.UPDATE_SELECTED_PRIVATECHAT,
      this.refreshPrivateChatList,
      this
    );
    IMManager.Instance.removeEventListener(
      IMEvent.MSG_LIST_DEL,
      this.__imFrameUpdateHandler,
      this
    );
    IMManager.Instance.removeEventListener(
      IMFrameEvent.REMOVE,
      this.__imFrameUpdateHandler,
      this
    );
    if (this.voice && this.voice.displayObject) {
      this.voice.displayObject.off(
        InteractiveEvent.LONG_PRESS,
        this,
        this.onLongPress
      );
      this.voice.displayObject.off(
        InteractiveEvent.LONG_PRESS_END,
        this,
        this.onLongPressEnd
      );
    }
    if (this.voice_tip.visible) {
      this.voice_tip.visible = false;
      Laya.timer.clear(this, this.showVoiceTime);
      let channel: BaseChannel = SDKManager.Instance.getChannel();
      if (channel instanceof WanChannel) {
        channel.cancelRecordAudio();
      } else if (channel instanceof NativeChannel) {
        channel.cancelRecordAudio();
      }
    }
  }

  public getchatPrivate() {
    return this.chatPrivateMessages;
  }
}

//聊天页签枚举 对应chatTabChannels, 不使用数字, 修改麻烦, 容易出bug.
enum ChatTabIndex {
  // CURRENT,//全部
  WORLD, //世界
  BIGBUGLE, //大喇叭
  TEAM, //组队
  CONSORTIA, //工会
  PERSONAL, //私聊
  SYSTEM, //系统
}
