import FUI_HomeBugleNoticeWnd from "../../../../fui/Home/FUI_HomeBugleNoticeWnd";
import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import Utils from "../../../core/utils/Utils";
import XmlMgr from "../../../core/xlsx/XmlMgr";
import { AlertTipAction } from "../../battle/actions/AlertTipAction";
import {
  ChatEvent,
  NotificationEvent,
} from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { EmWindow } from "../../constant/UIDefine";
import { ChatChannel } from "../../datas/ChatChannel";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { ChatManager } from "../../manager/ChatManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { DelayActionsUtils } from "../../utils/DelayActionsUtils";
import ChatData from "../chat/data/ChatData";
import PetalFlyView from "./PetalFlyView";
/**
 * @author:pzlricky
 * @data: 2021-05-08 16:42
 * @description 场景中间横幅广播
 */
export default class HomeBugleNoticeWnd extends FUI_HomeBugleNoticeWnd {
  private _list: Array<ChatData>;

  private content: fgui.GRichTextField;

  private _dwellTime: number = 2000;
  private _druation: number = 6000;
  private _curBugleType: number = -1;

  onConstruct() {
    super.onConstruct();
    this._list = [];
    this.addEvent();
    this.content = this.scrollMsg.getChild("content").asRichTextField;
    this.visible = false;
    this._isPlaying = false;
    if (this.thane.grades < 6) {
      this.visible = false;
      this._isPlaying = false;
      this.thane.addEventListener(
        PlayerEvent.THANE_LEVEL_UPDATE,
        this.__levelUpHandler,
        this,
      );
    }
    this.touchable = false;
  }

  private __levelUpHandler(evt) {
    if (this.thane.grades >= 6) {
      this.thane.removeEventListener(
        PlayerEvent.THANE_LEVEL_UPDATE,
        this.__levelUpHandler,
        this,
      );
    }
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private moveOut() {
    if (this._isShowing) {
      Laya.Tween.to(
        this.content,
        { x: -this.content.width },
        this._druation,
        undefined,
        Laya.Handler.create(this, this.outComplete),
      );
    }
  }

  private outComplete() {
    this._isShowing = false;
    this._isPlaying = false;
    Laya.Tween.clearAll(this.content);
    this.playNext();
  }

  private moveIn() {
    this._isShowing = true;
    if (this._currentData.channel == ChatChannel.SYS_ALERT) {
      var msg: string = this._currentData.msg;
      var srr: Array<string> = msg.match(/\<([^>]*)>*/g);
      for (var i: number = 0; i < srr.length; i++) {
        try {
          var str: string = srr[i];
          var xml = XmlMgr.Instance.decode(str);
          var name: string = xml.name;
          msg = msg.replace(str, name);
        } catch (e) {
          msg = "";
        }
      }
      this.content.text = msg;
    } else if (this._currentData.channel == ChatChannel.NOTICE) {
      let elementText: string = "";
      let elements = this._currentData.getAllElements();
      for (let index = 0; index < elements.length; index++) {
        let element = elements[index];
        elementText += element.text;
      }
      this.content.text = elementText;
      this._currentData.msg = ChatManager.Instance.analyzeExpressionAfterNormal(
        this._currentData.msg,
      );
      this._currentData.channel = ChatChannel.BIGBUGLE;
    } else if (this._currentData.channel == ChatChannel.BIGBUGLE) {
      var useBigHorn: string = LangManager.Instance.GetTranslation(
        "chatII.view.ChatTopBugleView.useBigHorn",
      );
      var sendInfo: string =
        "[" + this._currentData.senderName + "] " + useBigHorn;
      let elementText: string = "";
      let elements = this._currentData.getAllElements();
      for (let index = 0; index < elements.length; index++) {
        let element = elements[index];
        elementText += element.text;
      }
      this.content.text = sendInfo + elementText;

      this._currentData.msg = ChatManager.Instance.analyzeExpressionAfterNormal(
        this._currentData.msg,
      );
      this._currentData.msg = sendInfo + this._currentData.msg;
      this._currentData.channel = ChatChannel.BIGBUGLE;
    } else if (this._currentData.channel == ChatChannel.GOLD_BIGBUGLE) {
      let useBigHorn: string = "";
      let sendInfo: string = "" + useBigHorn;
      let elementText: string = "";
      let elements = this._currentData.getAllElements();
      for (let index = 0; index < elements.length; index++) {
        let element = elements[index];
        elementText += element.text;
      }
      this.content.text = sendInfo + elementText;

      this._currentData.msg = ChatManager.Instance.analyzeExpressionAfterNormal(
        this._currentData.msg,
      );
      this._currentData.msg = sendInfo + this._currentData.msg;
      this._currentData.channel = ChatChannel.BIGBUGLE;
    } else if (this._currentData.channel == ChatChannel.CROSS_BIGBUGLE) {
      var useCrossHorn: string = LangManager.Instance.GetTranslation(
        "chatII.view.ChatTopBugleView.useCrossHorn",
      );
      var crossInfo: string =
        "[color='#00d8ff'][" +
        this._currentData.serverName +
        "-" +
        this._currentData.senderName +
        "][/color>] " +
        useCrossHorn;
      let elementText: string = "";
      let elements = this._currentData.getAllElements();
      for (let index = 0; index < elements.length; index++) {
        let element = elements[index];
        elementText += element.text;
      }
      this.content.text = crossInfo + elementText;
      crossInfo =
        "[" +
        this._currentData.serverName +
        "-" +
        this._currentData.senderName +
        "] " +
        useCrossHorn;

      this._currentData.msg = ChatManager.Instance.analyzeExpressionAfterNormal(
        this._currentData.msg,
      );
      this._currentData.msg = crossInfo + this._currentData.msg;
      this._currentData.channel = ChatChannel.CROSS_BIGBUGLE;
    } else {
      //TODO 测试公告
      this.content.text = this._currentData.msg;
      this._currentData.msg = ChatManager.Instance.analyzeExpressionAfterNormal(
        this._currentData.msg,
      );
      this._currentData.msg = this._currentData.msg;
      this._currentData.channel = ChatChannel.BIGBUGLE;
    }

    //文本移动
    this.content.x = this.width;
    let centerPosX = 0;
    if (this.content.width > this.width - 40) {
      centerPosX = 0;
    } else {
      centerPosX = (this.width - 40 - this.content.width) / 2;
    }
    Laya.Tween.to(
      this.content,
      { x: centerPosX },
      this._druation,
      undefined,
      Laya.Handler.create(this, this.inComplete),
    );
  }

  private inComplete() {
    Laya.Tween.clearAll(this.content);
    Utils.delay(this._dwellTime).then(() => {
      this.moveOut();
    });
  }

  private _isShowing: boolean = false;
  private _currentData: ChatData = null;
  private playNext() {
    if (this._currentData) {
      this._currentData = null;
    }
    let cloneData = this._list.shift();
    if (cloneData) {
      this._currentData = new ChatData();
      this._currentData = this._currentData.clone(cloneData);
    }

    if (
      !this._currentData ||
      this._currentData.msg == "" ||
      this._currentData.msg == undefined ||
      this.thane.grades < 6
    ) {
      this._isPlaying = false;
      this.visible = false;
      return;
    } else {
      this.c1.setSelectedIndex(0);
      this.setViewByBugleType(this._currentData.bigBugleType);
      if (!this._isShowing) {
        this.moveIn();
        if (this.checkScene()) {
          switch (this._currentData.bigBugleType) {
            case 1:
            case 2:
              this.c1.setSelectedIndex(1);
              if (this._currentData.receiverName == this.thane.nickName) {
                // var roseTempId: number = (this._currentData.bigBugleType == 1 ? RosePresentBackView.ROSEID_99 : RosePresentBackView.ROSEID_999);
                // public static const ROSEID_999 : int = 2170004;
                // public static const ROSEID_99 : int = 2170003;
                // public static const ROSEID_1 : int = 2170001;
                var roseTempId: number =
                  this._currentData.bigBugleType == 1 ? 2170003 : 2170004;
                DelayActionsUtils.Instance.addAction(
                  new AlertTipAction(
                    [
                      roseTempId,
                      this._currentData.senderName,
                      this._currentData.uid,
                    ],
                    this.showPresentBackCall.bind(this),
                  ),
                );
              }
              this.showFireworkCall([
                90,
                this._dwellTime / 1000,
                this._currentData.bigBugleType,
              ]);
              break;
            case 3:
              this.c1.setSelectedIndex(1);
              if (this._currentData.receiverName == this.thane.nickName) {
                //彩带
                DelayActionsUtils.Instance.addAction(
                  new AlertTipAction(
                    [2170005, this._currentData.senderName],
                    this.showPresentBackCall.bind(this),
                  ),
                );
              }
              this.showFireworkCall([
                90,
                this._dwellTime / 1000,
                this._currentData.bigBugleType,
              ]);
              // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.WARLORDS, this.showFireworkCall, );
              break;
            case 4:
              this.c1.setSelectedIndex(1);
              if (this._currentData.receiverName == this.thane.nickName) {
                //星星
                DelayActionsUtils.Instance.addAction(
                  new AlertTipAction(
                    [2170006, this._currentData.senderName],
                    this.showPresentBackCall.bind(this),
                  ),
                );
              }
              this.showFireworkCall([
                90,
                this._dwellTime / 1000,
                this._currentData.bigBugleType,
              ]);
              // this.showFireworkCall([0, this._dwellTime / 1000, this._currentData.bigBugleType])
              // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.WARLORDS, this.showFireworkCall, [0, this._dwellTime / 1000, this._currentData.bigBugleType]);
              break;
            default:
              if (this._currentData.receiverName == this.thane.nickName) {
                var roseTempId: number =
                  this._currentData.bigBugleType == 1 ? 2170003 : 2170004;
                DelayActionsUtils.Instance.addAction(
                  new AlertTipAction(
                    [roseTempId, this._currentData.senderName],
                    this.showPresentBackCall.bind(this),
                  ),
                );
              }
              break;
          }
        }
      }
    }
  }

  /**
   * 被赠予玩家收到99朵及999朵玫瑰时, 需要弹出回赠框
   * @param args
   */
  private showPresentBackCall(args) {
    // FrameControllerManager.Instance.friendControler.startFrameByType(FriendFrameType.ROSE_PRESENT_BACK, args);
    UIManager.Instance.ShowWind(EmWindow.ReceiveFlowerWnd, args);
  }
  private _petalFlyView: PetalFlyView;
  private showFireworkCall(args) {
    this.clearPetalFly();
    this._petalFlyView = new PetalFlyView(args[0], args[1], args[2], 3, 20);
    this._petalFlyView.show();
  }

  private setViewByBugleType(bugleType: number) {
    if (this._curBugleType == bugleType) return;
    this._curBugleType = bugleType;
    switch (this._curBugleType) {
      case 0: //普通大喇叭
        this._dwellTime = 2000;
        break;
      case 1: //99玫瑰大喇叭
        this._dwellTime = 20000;
        break;
      case 2: //999玫瑰大喇叭
        this._dwellTime = 20000;
        break;
      case 3: //武斗会大喇叭
        this._dwellTime = 20000;
        break;
      case 4: //跨区大喇叭
        this._dwellTime = 25000;
        break;
      case 5: //烟花大喇叭
        this._dwellTime = 15000;
        break;
      case 13: //神圣之光
        this._dwellTime = 20000;
        break;
    }
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SWITCH_SCENE,
      this.__onSceneChangeHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.UPDATE_BIGBUGLE_VIEW,
      this.__addDataHandler,
      this,
    );
  }

  private _isPlaying: boolean = false;
  private __addDataHandler(evtData) {
    var chatData: ChatData = null;
    let tempData = evtData as ChatData;
    chatData = Utils.deepCopy(tempData); //拷贝一份
    if (this.thane.grades < 6) return;
    if (chatData) {
      //将bigBugleType == 5的chatData, 即烟花大嗽叭放在队列最后
      var hasFirework: boolean = false;
      var len: number = this._list.length;
      for (var i: number = 0; i < len; i++) {
        if (this._list[i].bigBugleType == 5) {
          this._list.splice(i, 0, chatData);
          hasFirework = true;
          break;
        }
      }
      if (!hasFirework) this._list.push(chatData);
    }
    if (!this._isPlaying) {
      this._isPlaying = true;
      this.visible = true;
      this.playNext();
    }
  }

  private __onSceneChangeHandler(evt?: any) {
    if (this.__checkSceneShow()) {
      this.Show();
    } else {
      this.Hide();
    }
  }

  /**检查当前场景是否可以展示公告 */
  private __checkSceneShow(): boolean {
    if (this.checkScene()) {
      return this._currentData && this._currentData.bigBugleType != 5;
    } else {
      return false;
    }
  }

  public Show() {
    let state = this.__checkSceneShow();
    this.visible = state;
  }

  public Hide() {
    this.visible = false;
  }

  private checkScene(): boolean {
    return SceneManager.Instance.currentType != SceneType.BATTLE_SCENE;
  }

  private clearPetalFly() {
    if (this._petalFlyView) {
      this._petalFlyView.dispose();
      this._petalFlyView = null;
    }
  }

  public dispose() {
    super.dispose();
    this._isShowing = false;
    this._isPlaying = false;
    this.clearPetalFly();
  }
}
