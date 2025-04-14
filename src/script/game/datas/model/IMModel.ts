import LangManager from "../../../core/lang/LangManager";
import Dictionary from "../../../core/utils/Dictionary";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { StateType } from "../../constant/StateType";
import { NotificationManager } from "../../manager/NotificationManager";
import { SharedManager } from "../../manager/SharedManager";
import IMStateInfo from "../IMStateInfo";

/**
 * IM模块数据的存储、处理类, 提供数据操作的API
 */
export default class IMModel {
  /**
   *IM聊天泡泡_自己
   */
  public static BUBBLETYPE_SELF: number = 1;
  /**
   *IM聊天泡泡_对方
   */
  public static BUBBLETYPE_TARGET: number = 2;
  /**
   *最多同时打开IM聊天窗数量
   */
  public static MAX_OPENFRAME_NUM: number = 3;
  /**
   *消息盒子最多显示消息提示数量
   */
  public static MAX_MSGBOX_ITEMNUM: number = 30;
  /**
   *每页历史信息数
   */
  public static MSGS_PER_PAGE: number = 8;
  /**
   *信息列表类型——未读
   */
  public static MSG_DIC_UNREAD: number = 1;
  /**
   *信息列表类型——临时
   */
  public static MSG_DIC_TEMP: number = 2;
  /**
   *移除消息盒子计时器
   */
  public removeMsgBoxTimeOut: number = 0;
  /**
   *是否开启主工具条好友按钮闪动
   */
  public isOpenFriendBtnShine: boolean = true;

  public constructor() {
    this._unreadMsgDic = new SimpleDictionary();
    this._openIMFrameDic = new SimpleDictionary();
    this._miniFrameDic = new SimpleDictionary();
    this.initStateList();
  }

  private initStateList() {
    this._stateList = new SimpleDictionary();
    let replyList: Dictionary = SharedManager.Instance.autoReplyList;

    let online: IMStateInfo = new IMStateInfo();
    let leave: IMStateInfo = new IMStateInfo();
    let busy: IMStateInfo = new IMStateInfo();
    let noDisturb: IMStateInfo = new IMStateInfo();
    online.id = StateType.ONLINE;
    online.name = LangManager.Instance.GetTranslation(
      "friends.im.view.IMStateComBox.online",
    );
    leave.id = StateType.LEAVE;
    leave.name = LangManager.Instance.GetTranslation(
      "friends.im.view.IMStateComBox.leave",
    );
    leave.replyContent =
      replyList && replyList[leave.id]
        ? replyList[leave.id]
        : LangManager.Instance.GetTranslation(
            "friends.im.view.IMStateComBox.leaveReply",
          );
    busy.id = StateType.BUSY;
    busy.name = LangManager.Instance.GetTranslation(
      "friends.im.view.IMStateComBox.busy",
    );
    busy.replyContent =
      replyList && replyList[busy.id]
        ? replyList[busy.id]
        : LangManager.Instance.GetTranslation(
            "friends.im.view.IMStateComBox.leaveReply",
          );
    noDisturb.id = StateType.NO_DISTURB;
    noDisturb.name = LangManager.Instance.GetTranslation(
      "friends.im.view.IMStateComBox.noDisturb",
    );
    noDisturb.replyContent =
      replyList && replyList[noDisturb.id]
        ? replyList[noDisturb.id]
        : LangManager.Instance.GetTranslation(
            "friends.im.view.IMStateComBox.leaveReply",
          );

    this._stateList.add(online.id, online);
    this._stateList.add(leave.id, leave);
    this._stateList.add(busy.id, busy);
    this._stateList.add(noDisturb.id, noDisturb);
  }

  /**
   * 聊天状态列表
   */
  private _stateList: SimpleDictionary;
  public get stateList(): SimpleDictionary {
    return this._stateList;
  }

  /**
   *当前聊天状态
   */
  private _curState: number = 1;
  public get curState(): number {
    return this._curState;
  }

  public set curState(stateId: number) {
    if (this._curState == stateId) return;
    this._curState = stateId;
    NotificationManager.Instance.sendNotification(
      NotificationEvent.IMSTATE_CHANGE,
      this._stateList[this._curState],
    );
  }

  /**
   * 设置状态回复内容
   */
  public setStateReply(stateId: number, replyStr: string) {
    if (this._stateList[stateId]) {
      this._stateList[stateId].replyContent = replyStr;
      SharedManager.Instance.autoReplyList[stateId] = replyStr;
      SharedManager.Instance.saveAutoReplyList();
    }
  }

  /**
   * 未读信息列表  可以用来判断红点逻辑
   */
  private _unreadMsgDic: SimpleDictionary;
  public get unreadMsgDic(): SimpleDictionary {
    return this._unreadMsgDic;
  }

  /**
   *已打开聊天窗列表
   */
  private _openIMFrameDic: SimpleDictionary;
  public get openIMFrameDic(): SimpleDictionary {
    return this._openIMFrameDic;
  }

  /**
   *最小化聊天窗列表
   */
  private _miniFrameDic: SimpleDictionary;
  public get miniFrameDic(): SimpleDictionary {
    this._miniFrameDic.clear();
    for (let framekey in this._openIMFrameDic) {
      let frame = this._openIMFrameDic[framekey];
      if (!frame.parent) this._miniFrameDic.add(frame["data"].userId, frame);
    }
    return this._miniFrameDic;
  }

  /**
   *消息盒子信息提示列表
   * @return
   *
   */
  public get msgBoxList(): Array<any> {
    let list: Array<any> = [];
    // let miniList: Array<any> = this.miniFrameDic.getList();
    // let unreadList: Array<any> = this.unreadMsgDic.getList();
    // for each(frame: Frame in miniList)
    // {
    //         if(frame['data'])
    //         list.push(frame['data']);
    //     }
    //         for each(msgList: Vector.< BaseIMInfo > in unreadList)
    //         {
    //                     if(let msgList.length > 0) {
    //                     msg: BaseIMInfo = msgList[0];
    //                     if(!this.miniFrameDic[msg.userId]) {
    //                let  tInfo: ThaneInfo = new ThaneInfo();
    //                 tInfo.userId = msg.userId;
    //                 tInfo.nickName = msg.nickName;
    //                 list.push(tInfo);
    //             }
    //     }
    // }
    return list;
  }

  private _imHistoryDic: Dictionary;
  /**
   * IM历史记录
   */
  public get imHistoryDic(): Dictionary {
    if (!this._imHistoryDic) {
      this._imHistoryDic = new Dictionary();
    }
    return this._imHistoryDic;
    // return SharedManager.Instance.imHistoryDic;
  }
}
