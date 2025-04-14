/**
 * 玩家聊天气泡管理器
 */

import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { CharBubbleEvent } from "../constant/event/NotificationEvent";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import ChatAirBubbleData from "../module/chat/data/ChatAirBubbleData";
import { NotificationManager } from "./NotificationManager";

//@ts-expect-error: External dependencies
import AllBubbleInfoMsg = com.road.yishi.proto.bubble.AllBubbleInfoMsg;
//@ts-expect-error: External dependencies
import BubbleInfoMsg = com.road.yishi.proto.bubble.BubbleInfoMsg;
//@ts-expect-error: External dependencies
import ChangeBubbleInfoMsg = com.road.yishi.proto.bubble.ChangeBubbleInfoMsg;
//@ts-expect-error: External dependencies
import ChangeBubbleReq = com.road.yishi.proto.bubble.ChangeBubbleReq;

export default class ChatAirBubbleManager {
  private static _Instance: ChatAirBubbleManager;
  public static get Instance(): ChatAirBubbleManager {
    if (!ChatAirBubbleManager._Instance)
      ChatAirBubbleManager._Instance = new ChatAirBubbleManager();
    return ChatAirBubbleManager._Instance;
  }

  private _allBubbles: Map<number, ChatAirBubbleData> = new Map();

  public setup() {
    // ServerDataManager.listen(S2CProtocol.U_C_GET_ALL_BUBBLE, this, this.__getAllBubbleRet);
    // ServerDataManager.listen(S2CProtocol.U_C_CHANGE_BUBBLE, this, this.__changeBubbleRet);
  }

  public getBubbleData(id: number): ChatAirBubbleData {
    if (this._allBubbles.has(id)) {
      return this._allBubbles.get(id);
    }
    return null;
  }

  /**
   * 获取所有气泡返回
   */
  private __getAllBubbleRet(pkg: PackageIn) {
    this._allBubbles.clear();
    let msg = pkg.readBody(AllBubbleInfoMsg) as AllBubbleInfoMsg;
    let bubbles = msg.allBubble;
    for (const key in bubbles) {
      if (Object.prototype.hasOwnProperty.call(bubbles, key)) {
        let bubbleItem = bubbles[key];
        let bubbleData = new ChatAirBubbleData();
        bubbleData.bubbleId = bubbleItem.bubbleId;
        bubbleData.isUse = bubbleItem.isUse;
        this._allBubbles.set(bubbleData.bubbleId, bubbleData);
      }
    }
    NotificationManager.Instance.dispatchEvent(
      CharBubbleEvent.ALL_CHAT_BUBBLES,
    );
  }

  /**
   * 更换/购买 气泡返回
   */
  private __changeBubbleRet(pkg: PackageIn) {
    let msg = pkg.readBody(ChangeBubbleInfoMsg) as ChangeBubbleInfoMsg;
    let op = msg.op;
    let info = msg.bubbleInfo;
    if (info) {
      let bubbleData = new ChatAirBubbleData();
      bubbleData.bubbleId = info.bubbleId;
      bubbleData.isUse = info.isUse;
      if (op == 2) {
        this._allBubbles.set(bubbleData.bubbleId, bubbleData);
        NotificationManager.Instance.dispatchEvent(
          CharBubbleEvent.CHAT_BUBBLES_OPT,
          op,
          info.bubbleId,
        );
      } else if (op == 1) {
        if (this._allBubbles) {
          for (let i of this._allBubbles.values()) {
            if (i.bubbleId == bubbleData.bubbleId) i.isUse = 1;
            else i.isUse = 2;
          }
        }
        NotificationManager.Instance.dispatchEvent(
          CharBubbleEvent.CHAT_BUBBLES_OPT,
          op,
        );
      }
    }
  }

  /**
   * 获取所有拥有的气泡
   */
  public reqAllAirBubbles() {}

  /**
   * 更换气泡
   * int32 bubbleId = 1;// 要更换或要购买的气泡Id
   * int32 op = 2; //操作类型 1更换气泡  2 购买气泡
   */
  public reqChangeBubble(bubbleId: number, op: number = 1) {
    let msg: ChangeBubbleReq = new ChangeBubbleReq();
    msg.bubbleId = bubbleId;
    msg.op = op;
    this.sendProtoBuffer(C2SProtocol.C_BUBBLE_CHANGE, msg);
  }

  public sendProtoBuffer(code: number, message = null) {
    SocketManager.Instance.send(code, message);
  }
}
