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

/**超级团购礼包消息 */
//@ts-expect-error: External dependencies
import SuperGiftOfGroupMsg = com.road.yishi.proto.active.GroupBuyMsg;
//@ts-expect-error: External dependencies
import SuperGiftOfGroupGiftMsg = com.road.yishi.proto.active.GiftMsg;
//@ts-expect-error: External dependencies
import SuperGiftOfGroupGiftItemMsg = com.road.yishi.proto.active.ItemMsg;
//@ts-expect-error: External dependencies
import SuperGiftOfGroupGiftLevelMsg = com.road.yishi.proto.active.LevelMsg;
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";

/**
 * 超值团购礼包管理对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @datetime 2023年11月29日14:13:29
 */
export class SuperGiftOfGroupManager {
  /**静态实例 */
  private static _instance: SuperGiftOfGroupManager;

  /**
   * 获取实例
   */
  public static get Instance(): SuperGiftOfGroupManager {
    if (!this._instance) this._instance = new SuperGiftOfGroupManager();
    return this._instance;
  }

  /**
   * 超值团购礼包活动是否开启
   */
  private _open: boolean = false;

  /**
   * 超值团购礼包活动开始时间
   */
  private _startTime: string = "";

  /**
   * 超值团购礼包活动结束时间
   */
  private _stopTime: string = "";

  /**
   * 超值团购礼包活动详情消息数据包
   */
  private _detailMessage: SuperGiftOfGroupMsg;

  /**
   * mock测试
   */
  private _mock: boolean = false;

  /**
   * 构造函数
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月29日14:17:12
   */
  constructor() {}

  /**
   * 超值团购礼包活动是否开启
   */
  public get open(): boolean {
    return this._open;
  }

  public set open(open: boolean) {
    this._open = open;
  }

  /**
   * 超值团购礼包活动开始时间
   */
  public get startTime(): string {
    return this._startTime;
  }

  /**
   * 超值团购礼包活动结束时间
   */
  public get stopTime(): string {
    return this._stopTime;
  }

  /**
   * 超值团购礼包活动详情数据包
   */
  public get detail(): SuperGiftOfGroupMsg {
    return this._detailMessage;
  }

  /**
   * 超值团购礼包活动礼包集合
   */
  public get giftList(): SuperGiftOfGroupGiftMsg[] {
    return ArrayUtils.sortOn(
      this._detailMessage.giftMsg,
      "sort",
      ArrayConstant.NUMERIC,
    );
  }

  /**
   * Mock数据
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月30日16:43:52
   */
  private mock(): void {
    let info: SuperGiftOfGroupMsg = new SuperGiftOfGroupMsg();
    info.op = 1;
    info.isOpen = true;
    info.openTime = "2023-11-28 00:00:000";
    info.stopTime = "2028-09-30 14:25:000";

    let gift1: SuperGiftOfGroupGiftMsg = new SuperGiftOfGroupGiftMsg();
    gift1.giftId = "zhongjyuan1";
    gift1.count = 125;
    gift1.seflCount = 3;
    gift1.price = 588;
    gift1.discountPrice = 288;
    gift1.giftName = "超值礼包①";
    gift1.limitCount = 8;

    let giftItem1: SuperGiftOfGroupGiftItemMsg =
      new SuperGiftOfGroupGiftItemMsg();
    giftItem1.itemId = 2050103;
    giftItem1.count = 58;
    gift1.itemMsg.push(giftItem1);

    let giftItem2: SuperGiftOfGroupGiftItemMsg =
      new SuperGiftOfGroupGiftItemMsg();
    giftItem2.itemId = 1070004;
    giftItem2.count = 28;
    gift1.itemMsg.push(giftItem2);

    let giftItem3: SuperGiftOfGroupGiftItemMsg =
      new SuperGiftOfGroupGiftItemMsg();
    giftItem3.itemId = 1060004;
    giftItem3.count = 5;
    gift1.itemMsg.push(giftItem3);

    let giftLevel2: SuperGiftOfGroupGiftLevelMsg =
      new SuperGiftOfGroupGiftLevelMsg();
    giftLevel2.level = 2;
    giftLevel2.sellCount = 200;
    giftLevel2.backCount = 58;
    giftLevel2.isReward = false;
    gift1.levelMsg.push(giftLevel2);

    let giftLevel1: SuperGiftOfGroupGiftLevelMsg =
      new SuperGiftOfGroupGiftLevelMsg();
    giftLevel1.level = 1;
    giftLevel1.sellCount = 100;
    giftLevel1.backCount = 28;
    giftLevel1.isReward = false;
    gift1.levelMsg.push(giftLevel1);

    let giftLevel3: SuperGiftOfGroupGiftLevelMsg =
      new SuperGiftOfGroupGiftLevelMsg();
    giftLevel3.level = 3;
    giftLevel3.sellCount = 300;
    giftLevel3.backCount = 88;
    giftLevel3.isReward = false;
    gift1.levelMsg.push(giftLevel3);

    info.giftMsg.push(gift1);
    info.giftMsg.push(gift1);
    info.giftMsg.push(gift1);
    info.giftMsg.push(gift1);

    this._open = info.isOpen;
    this._startTime = info.openTime;
    this._stopTime = info.stopTime;

    this._detailMessage = info;
  }

  /**
   * 设置(配置/事件)
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月29日14:29:38
   */
  public setup(): void {
    this.addEvent();
  }

  /**
   * 发起请求(C2S)
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月29日14:30:26
   */
  public request() {
    if (this._mock) {
      this.mock();
      NotificationManager.Instance.sendNotification(
        NotificationEvent.SUPERGIFTOFGROUP_DETAIL_UPDATE,
      );
    } else {
      let superGiftOfGroupMsg: SuperGiftOfGroupMsg = new SuperGiftOfGroupMsg();

      superGiftOfGroupMsg.op = 1;

      SocketManager.Instance.send(
        C2SProtocol.C_CCCACTIVE_CLIENTOP,
        superGiftOfGroupMsg,
        CCCActiveType.SUPERGIFTODGROUP,
      );
    }
  }

  /**
   * 购买礼包(C2S)
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月30日09:57:21
   * @param giftId 礼包ID
   * @param count 购买数量
   */
  public buyGift(giftId: string, count: number) {
    let superGiftOfGroupMsg: SuperGiftOfGroupMsg = new SuperGiftOfGroupMsg();

    superGiftOfGroupMsg.op = 2;
    superGiftOfGroupMsg.giftId = giftId;
    superGiftOfGroupMsg.buyNum = count;

    SocketManager.Instance.send(
      C2SProtocol.C_CCCACTIVE_CLIENTOP,
      superGiftOfGroupMsg,
      CCCActiveType.SUPERGIFTODGROUP,
    );
  }

  /**
   * 添加监听事件
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月29日14:31:25
   */
  private addEvent(): void {
    ServerDataManager.listen(
      S2CProtocol.U_C_SUPERGIFTOFGROUP_INFO,
      this,
      this.onReceiveDetail,
    );
  }

  /**
   * 移除监听事件
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月29日14:31:55
   */
  private removeEvent(): void {
    ServerDataManager.cancel(
      S2CProtocol.U_C_SUPERGIFTOFGROUP_INFO,
      this,
      this.onReceiveDetail,
    );
  }

  /**
   * 接收超值团购礼包详情数据包(S2C)
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月29日14:33:40
   * @param pkg 数据包对象
   */
  private onReceiveDetail(pkg: PackageIn) {
    let superGiftOfGroupMsg: SuperGiftOfGroupMsg = pkg.readBody(
      SuperGiftOfGroupMsg,
    ) as SuperGiftOfGroupMsg;

    this._open = superGiftOfGroupMsg.isOpen;
    this._startTime = superGiftOfGroupMsg.openTime;
    this._stopTime = superGiftOfGroupMsg.stopTime;

    this._detailMessage = superGiftOfGroupMsg;

    NotificationManager.Instance.sendNotification(
      NotificationEvent.SUPERGIFTOFGROUP_DETAIL_UPDATE,
    );
  }

  /**
   * 接收超值团购礼包状态数据包(S2C)
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月29日14:37:01
   * @param pkg 数据包对象
   */
  private onReceiveState(pkg: PackageIn) {
    let propertyMessage: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;

    this._open = propertyMessage.param7;
    if (!this._open) {
      if (FrameCtrlManager.Instance.isOpen(EmWindow.Funny))
        FrameCtrlManager.Instance.exit(EmWindow.Funny);
    }

    NotificationManager.Instance.sendNotification(
      NotificationEvent.SUPERGIFTOFGROUP_STATE_UPDATE,
    );
  }
}
