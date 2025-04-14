/**数据包对象 */
import { PackageIn } from "../../core/net/PackageIn";
/**服务端To客户端协议枚举 */
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
/**客户端To服务端协议枚举 */
import { C2SProtocol } from "../constant/protocol/C2SProtocol";

/**客户端To服务端Socket管理者 */
import { SocketManager } from "../../core/net/SocketManager";
/**服务端To客户端数据包管理者 */
import { ServerDataManager } from "../../core/net/ServerDataManager";

/**消息通知事件枚举 */
import { NotificationEvent } from "../constant/event/NotificationEvent";
/**消息通知管理者 */
import { NotificationManager } from "./NotificationManager";

/**游戏UI常量 */
import { EmWindow } from "../constant/UIDefine";
/**游戏UI控制管理者 */
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";

/**活动类型常量 */
import CCCActiveType from "../constant/CCCActiveType";

/**简单属性响应对象 */
//@ts-expect-error: External dependencies
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
/**幸运盲盒响应对象 */
//@ts-expect-error: External dependencies
import LuckBlindBoxMessage = com.road.yishi.proto.active.ChargePointLotteryMsg;

/**幸运盲盒物品项响应对象 */
//@ts-expect-error: External dependencies
import LuckBlindBoxRewardItemMessage = com.road.yishi.proto.active.LotteryItemMsg;

/**
 * 幸运盲盒管理对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @datetime 2023年7月4日17:46:08
 */
export class LuckBlindBoxManager {
  /**静态实例 */
  private static _instance: LuckBlindBoxManager;

  /**
   * 获取实例
   */
  public static get Instance(): LuckBlindBoxManager {
    if (!this._instance) this._instance = new LuckBlindBoxManager();
    return this._instance;
  }

  /**
   * 幸运盲盒协议消息对象
   */
  private _luckBlindBoxMessage: LuckBlindBoxMessage;

  /**
   * 获取幸运盲盒协议消息对象
   */
  public get luckBlindBoxMessage(): LuckBlindBoxMessage {
    return this._luckBlindBoxMessage;
  }

  /**
   * 幸运盲盒是否开启
   */
  private _luckBlindBoxOpen: boolean = false;

  /**
   * 获取幸运盲盒是否开启
   */
  public get luckBlindBoxOpen(): boolean {
    return this._luckBlindBoxOpen;
  }

  /**
   * 历史物品概率列表
   */
  private _historyRewardArray: LuckBlindBoxRewardItemMessage[] = [];

  public set historyRewardArray(value: LuckBlindBoxRewardItemMessage[]) {
    this._historyRewardArray = value;
  }

  /**
   * 获取历史物品概率列表
   */
  public get historyRewardArray(): LuckBlindBoxRewardItemMessage[] {
    return this._historyRewardArray;
  }

  public rewardIsChange(): boolean {
    return this.compareArrays(this.historyRewardArray, this.rewardArray);
  }

  /**
   * 构造函数
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日15:36:46
   */
  constructor() {}

  /**
   * 设置(配置/事件)
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日15:36:53
   */
  public setup(): void {
    this.initEvent();
  }

  /**
   * 幸运盲盒请求协议(C2S)
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月5日10:22:51
   * @param op 操作类型
   * @param isOneKey 是否一键开启
   * @param openNumber 开启数量
   */
  public requestProtocol(
    op: number,
    isOneKey: boolean = false,
    openNumber: number = 1,
  ): void {
    let luckBlindBoxMessage: LuckBlindBoxMessage = new LuckBlindBoxMessage();

    luckBlindBoxMessage.op = op;
    luckBlindBoxMessage.isOneKey = isOneKey;
    luckBlindBoxMessage.lotteryNum = openNumber;

    SocketManager.Instance.send(
      C2SProtocol.C_CCCACTIVE_CLIENTOP,
      luckBlindBoxMessage,
      CCCActiveType.LUCKBLINDBOX,
    );
  }

  /**
   * 获取幸运盲盒物品数组
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日15:36:58
   */
  public get rewardArray(): LuckBlindBoxRewardItemMessage[] {
    return this._luckBlindBoxMessage.reward as LuckBlindBoxRewardItemMessage[];
  }

  /**
   * 初始化事件(监听)
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月5日10:23:45
   */
  private initEvent(): void {
    ServerDataManager.listen(
      S2CProtocol.U_C_LUCKYBOX_INFO,
      this,
      this.onReceiveInfo,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_LUCHYBOX_STATE,
      this,
      this.onReceiveState,
    );
  }

  /**
   * 处理返回活动信息(S2C)
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月4日15:05:55
   * @param pkg 信息包对象
   */
  private onReceiveInfo(pkg: PackageIn) {
    let luckBlindBoxMessage: LuckBlindBoxMessage = pkg.readBody(
      LuckBlindBoxMessage,
    ) as LuckBlindBoxMessage;

    if (luckBlindBoxMessage.op == 1) {
      this._luckBlindBoxMessage = luckBlindBoxMessage;
    } else if (luckBlindBoxMessage.op == 2) {
      this._luckBlindBoxMessage.op = luckBlindBoxMessage.op;
      this._luckBlindBoxMessage.leftNeedPoint =
        luckBlindBoxMessage.leftNeedPoint;
      this._luckBlindBoxMessage.leftCount = luckBlindBoxMessage.leftCount;
      this._luckBlindBoxMessage.dayAddCount = luckBlindBoxMessage.dayAddCount;
      this._luckBlindBoxMessage.isOneKey = luckBlindBoxMessage.isOneKey;
      this._luckBlindBoxMessage.isRare = luckBlindBoxMessage.isRare;
      this._luckBlindBoxMessage.resultPos = luckBlindBoxMessage.resultPos.slice(
        0,
        luckBlindBoxMessage.resultPos.length,
      );
    } else if (luckBlindBoxMessage.op == 3) {
      this._luckBlindBoxMessage.op = luckBlindBoxMessage.op;
      this._luckBlindBoxMessage.logs = luckBlindBoxMessage.logs.slice(
        0,
        luckBlindBoxMessage.logs.length,
      );
    }

    NotificationManager.Instance.sendNotification(
      NotificationEvent.LUCKBLINDBOX_INFO_UPDATE,
    );
  }

  /**
   * 处理返回开启信息
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月5日19:44:13
   * @param pkg 信息包对象
   */
  private onReceiveState(pkg: PackageIn) {
    let propertyMessage: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;

    this._luckBlindBoxOpen = propertyMessage.param7;
    if (!this._luckBlindBoxOpen) {
      if (FrameCtrlManager.Instance.isOpen(EmWindow.Funny))
        FrameCtrlManager.Instance.exit(EmWindow.Funny);
    }

    NotificationManager.Instance.sendNotification(
      NotificationEvent.REFRESH_TOPTOOLS,
    );
  }

  /**
   * 数组对比
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月11日14:48:00
   * @param historyRewardArray
   * @param currentRewardArray
   * @returns
   */
  private compareArrays(
    historyRewardArray: LuckBlindBoxRewardItemMessage[],
    currentRewardArray: LuckBlindBoxRewardItemMessage[],
  ): boolean {
    if (historyRewardArray.length != currentRewardArray.length) {
      return false;
    }

    for (let i = 0; i < historyRewardArray.length; i++) {
      const historyItem = historyRewardArray[i];
      const currentItem = currentRewardArray[i];

      // 比较数组元素对象的属性值是否相等
      if (!this.areObjectsEqual(historyItem, currentItem)) {
        return false;
      }
    }

    return true;
  }

  private areObjectsEqual(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const value1 = obj1[key];
      const value2 = obj2[key];

      // 使用深度比较来判断属性值是否相等
      if (!this.isDeepEqual(value1, value2)) {
        return false;
      }
    }

    return true;
  }

  private isDeepEqual(value1: any, value2: any): boolean {
    // 对于数组和对象, 递归调用areObjectsEqual方法进行深度比较
    if (Array.isArray(value1) && Array.isArray(value2)) {
      return this.compareArrays(value1, value2);
    }

    if (typeof value1 === "object" && typeof value2 === "object") {
      return this.areObjectsEqual(value1, value2);
    }

    // 使用严格相等运算符进行比较
    return value1 === value2;
  }
}
