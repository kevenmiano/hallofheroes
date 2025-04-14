//@ts-expect-error: External dependencies
import FUI_LuckBlindBoxView from "../../../../../fui/Funny/FUI_LuckBlindBoxView";

import UIManager from "../../../../core/ui/UIManager";
import LangManager from "../../../../core/lang/LangManager";
import MaskLockOper from "../../../component/MaskLockOper";
import MainToolBar from "../../home/MainToolBar";
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";
import { EmWindow } from "../../../constant/UIDefine";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { NumericStepper } from "../../../component/NumericStepper";

import { SharedManager } from "../../../manager/SharedManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";

import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";

import { LuckBlindBoxManager } from "../../../manager/LuckBlindBoxManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";

/**幸运盲盒响应对象 */
import LuckBlindBoxMessage = com.road.yishi.proto.active.ChargePointLotteryMsg;
/**幸运盲盒物品项响应对象 */
import LuckBlindBoxRewardItemMessage = com.road.yishi.proto.active.LotteryItemMsg;

import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { LuckBlindBoxChanceBoxItem } from "./LuckBlindBoxChanceBoxItem";
import { FunnyContent } from "./FunnyContent";
import Utils from "../../../../core/utils/Utils";

/**
 * 幸运盲盒
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @datetime 2023年7月4日17:09:14
 */
export class LuckBlindBoxView
  extends FUI_LuckBlindBoxView
  implements FunnyContent
{
  public simBox: NumericStepper;
  /**开启数量变更处理 */
  private _openNumberChangeHandler: Laya.Handler;

  /**钻石总数 */
  private _diamondTotal: number = 0;

  /**钻石消耗数(单次) */
  private _diamondConsumeNumber: number = 0;

  /**最大开启数 */
  private _openMax: number = 0;

  /**开启总数(已开启) */
  private _openTotal: number = 0;

  /**开启数量(一次开启盲盒数) */
  private _openNumber: number = 0;

  /**活动剩余时间 */
  private _residueTime: number = 0;

  private _resultIds: number[] = [];

  /**
   * 幸运盲盒协议消息对象
   */
  private _luckBlindBoxMessage: LuckBlindBoxMessage;

  /**
   * 构造函数
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:09:19
   */
  constructor() {
    super();
  }

  onShow() {
    this.initData();
    this.initView();
    this.initEvent();
  }

  onUpdate() {
    this.initData();
    this.initView();
  }

  onHide() {
    this.removeEvent();

    this._resultIds = [];

    Laya.timer.clearAll(this);
    TaskTraceTipManager.Instance.showTraceTip = true;
  }

  /**
   * 初始化数据
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:09:38
   */
  private initData() {
    TaskTraceTipManager.Instance.showTraceTip = false;
    LuckBlindBoxManager.Instance.requestProtocol(1);
    TaskTraceTipManager.Instance.showTraceTip = false;
  }

  /**
   * 初始化视图
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:09:42
   */
  private initView() {
    this._openMax = 1;
    this._openTotal = 0;
    this._openNumber = 1;
    this._diamondConsumeNumber = 1;
    this.background.getChild("helpBtn").visible = false;
    this.background.getChild("closeBtn").visible = false;
    this._diamondTotal =
      PlayerManager.Instance.currentPlayerModel.playerInfo.point;
  }

  /**
   * 初始化事件
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:10:02
   */
  private initEvent() {
    // MaskLockOper.Instance.doCall(false);

    /**概率列表 */
    this.chanceBox.getChild("chanceList").asList.itemRenderer =
      Laya.Handler.create(this, this.onRenderChanceItem, null, false);

    /**购买按钮 */
    this.btn_buy.onClick(this, this.onBuyButton);

    /**标准按钮 */
    this.background.getChild("helpBtn").onClick(this, this.onHelpeButton);

    /**开启按钮 */
    this.runeBtn.onClick(this, this.onRuneButton);

    /**幸运盲盒信息更新 */
    NotificationManager.Instance.addEventListener(
      NotificationEvent.LUCKBLINDBOX_INFO_UPDATE,
      this.onInfoUpdate,
      this,
    );
  }

  /**
   * 移除事件
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:10:09
   */
  private removeEvent() {
    MaskLockOper.Instance.doCall(false);

    // this.chanceBox.getChild("chanceList").asList.itemRenderer.recover();
    Utils.clearGListHandle(this.chanceBox.getChild("chanceList").asList);

    this.btn_buy.offClick(this, this.onBuyButton);

    this.background.getChild("helpBtn").offClick(this, this.onHelpeButton);

    this.runeBtn.offClick(this, this.onRuneButton);

    NotificationManager.Instance.removeEventListener(
      NotificationEvent.LUCKBLINDBOX_INFO_UPDATE,
      this.onInfoUpdate,
      this,
    );
  }

  /**
   * 遍历读取概率项
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:10:29
   * @param index 下标
   * @param item 概率项对象
   */
  private onRenderChanceItem(
    index: number,
    item: LuckBlindBoxChanceBoxItem,
  ): void {
    let rewardArray = LuckBlindBoxManager.Instance.rewardArray;
    rewardArray = ArrayUtils.sortOn(rewardArray, "pos", ArrayConstant.NUMERIC);
    item.info = rewardArray[index] as LuckBlindBoxRewardItemMessage;
  }

  /**
   * 初始化概率列表集合
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:11:45
   */
  private initChanceList(): void {
    // 因为FunnyWnd视图机制: 开启操作后会重新渲染视图,导致重新走一遍释放与初始化,所以这边增加历史数据对比会导致除后面都无法完成概率列表的渲染
    // if (!LuckBlindBoxManager.Instance.rewardIsChange()) {
    // 	LuckBlindBoxManager.Instance.historyRewardArray = LuckBlindBoxManager.Instance.rewardArray;
    // 	this.chanceBox.getChild("chanceList").asList.numItems = LuckBlindBoxManager.Instance.luckBlindBoxMessage.reward.length;
    // }
    this.chanceBox.getChild("chanceList").asList.numItems =
      LuckBlindBoxManager.Instance.luckBlindBoxMessage.reward.length;
  }

  /**
   * 活动信息更新后处理函数
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:12:10
   * @returns
   */
  private onInfoUpdate(): void {
    this._luckBlindBoxMessage =
      LuckBlindBoxManager.Instance.luckBlindBoxMessage;

    /**op=>1:活动信息获取;2:幸运盲盒开启;3:异常 */
    if (this._luckBlindBoxMessage.op == 1) {
      this.initChanceList();
      this.refreshView();
      this.loopResidueTime();
    } else if (this._luckBlindBoxMessage.op == 2) {
      this.refreshView();

      this.background.getController("open").selectedIndex = 2;
      if (this._luckBlindBoxMessage.resultPos.length == 0) {
        MaskLockOper.Instance.doCall(false);
        return;
      } else {
        this._resultIds = this._luckBlindBoxMessage.resultPos;
      }
      this.openResult();
    } else if (this._luckBlindBoxMessage.op == 3) {
      this.refreshView();
      MaskLockOper.Instance.doCall(false);
    }
  }

  /**
   * 充值钻石按钮
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:13:10
   */
  private onBuyButton(): void {
    FrameCtrlManager.Instance.exit(EmWindow.Funny);
    RechargeAlertMannager.Instance.openShopRecharge();
  }

  /**
   * 帮助按钮
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:13:21
   */
  private onHelpeButton(): void {
    let title: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation(
      "yishi.LuckBlindBoxManager.helper",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  /**开启盲盒数量变更处理 */
  private onOpenNumberChangeHandler(value: number) {
    this._openNumber = value;
    this.diamondConsumeTxt.text = (
      this._diamondConsumeNumber * this._openNumber
    ).toString();
  }

  /**
   * 开启按钮
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:14:30
   * @returns
   */
  private onRuneButton(): void {
    MaskLockOper.Instance.doCall(true);
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);

    if (this._diamondTotal < this._diamondConsumeNumber * this._openNumber) {
      MaskLockOper.Instance.doCall(false);
      RechargeAlertMannager.Instance.show();
      return;
    }

    if (this._openTotal >= this._openMax) {
      MaskLockOper.Instance.doCall(false);
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "yishi.LuckBlindBoxManager.open.max",
        ),
      );
      return;
    }

    if (!LuckBlindBoxManager.Instance.luckBlindBoxOpen) {
      MaskLockOper.Instance.doCall(false);
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "yishi.LuckBlindBoxManager.open.exist",
        ),
      );
      return;
    }

    if (this.showOpenBlindBoxAlert()) return;

    this.openBlindBox();
  }

  /**
   * 显示开启盲盒前的提示
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月11日15:57:25
   * @returns
   */
  private showOpenBlindBoxAlert(): boolean {
    let result: boolean = false;

    let currentDate: Date = new Date();

    let checkFlag: boolean = SharedManager.Instance.resolveStrengthen;
    let originDate: Date = new Date(
      SharedManager.Instance.resolveStrengthenCheckDate,
    );

    if (
      !checkFlag ||
      (originDate.getMonth() <= currentDate.getMonth() &&
        originDate.getDate() < currentDate.getDate())
    )
      result = true;

    if (result) {
      let content: string = LangManager.Instance.GetTranslation(
        "yishi.LuckBlindBoxManager.open.tips",
        this._diamondConsumeNumber * this._openNumber,
        this._openNumber,
      );
      let checkTxt: string = LangManager.Instance.GetTranslation(
        "yishi.view.base.ThewAlertFrame.text",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.USEBINDPOINT_ALERT,
        { checkRickText: checkTxt },
        null,
        content,
        null,
        null,
        this.startOpenBlindBoxCallback.bind(this),
      );
    }

    return result;
  }

  /**
   * 开始开启盲盒回调
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月11日15:57:59
   * @param decision 决定
   * @param check 下次是否提醒
   * @returns
   */
  private startOpenBlindBoxCallback(decision: boolean, check: boolean) {
    if (!decision) {
      MaskLockOper.Instance.doCall(false);
      return;
    }

    SharedManager.Instance.resolveStrengthen = check;
    SharedManager.Instance.resolveStrengthenCheckDate = new Date();
    SharedManager.Instance.saveResolveStrengthenTipCheck();

    this.openBlindBox();
  }

  /**
   * 开启盲盒
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月11日15:59:59
   */
  private openBlindBox(): void {
    this.runeBtn.enabled = false;
    MainToolBar.FLASH_NEW_GOODS = false;
    this.background.getController("open").selectedIndex = 1;

    this.background
      .getChild("openBlindBox")
      .asMovieClip.setPlaySettings(
        0,
        -1,
        1,
        -1,
        Laya.Handler.create(this, this.onOpenBlindBoxCompleteHandler),
      );
  }

  /**
   * 开启盲盒动画完成处理函数
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:14:53
   */
  private onOpenBlindBoxCompleteHandler(): void {
    LuckBlindBoxManager.Instance.requestProtocol(
      2,
      this._openNumber > 1,
      this._openNumber,
    );
  }

  /**
   * 刷新视图
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:14:56
   */
  private refreshView(): void {
    this._diamondTotal =
      PlayerManager.Instance.currentPlayerModel.playerInfo.point;
    this._openTotal = this._luckBlindBoxMessage.leftCount;
    this._openMax = this._luckBlindBoxMessage.dayMaxCount;
    this._diamondConsumeNumber = this._luckBlindBoxMessage.oneNeedPoint;

    this.diamondTotalTxt.text = this._diamondTotal.toString();
    this.diamondConsumeTxt.text = this._diamondConsumeNumber.toString();
    this.runeBtn.enabled = this._openMax > this._openTotal;
    this.runeBtn.getChild("consumeStatTxt").text =
      this._openTotal.toString() + "/" + this._openMax.toString();

    let openResidueMax: number = 1;
    this._openNumberChangeHandler && this._openNumberChangeHandler.recover();
    this._openNumberChangeHandler = Laya.Handler.create(
      this,
      this.onOpenNumberChangeHandler,
      null,
      false,
    );
    openResidueMax = Math.floor(
      this._diamondTotal / this._diamondConsumeNumber,
    );
    if (openResidueMax >= this._openMax - this._openTotal) {
      openResidueMax = this._openMax - this._openTotal;
    }
    if (openResidueMax < 1) openResidueMax = 1;

    this.simBox.show(
      0,
      1,
      1,
      openResidueMax,
      openResidueMax,
      1,
      this._openNumberChangeHandler,
    );
  }

  /**
   * 设置剩余时间
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:15:04
   */
  private setResidueTime() {
    this._residueTime--;
    if (this._residueTime >= 60) {
      this.runeBtn.enabled = true;
      this.buttomBox.getChild("activityTimeTxt").text =
        DateFormatter.getFullTimeString(this._residueTime);
    } else if (this._residueTime > 0) {
      this.runeBtn.enabled = true;
      this.buttomBox.getChild("activityTimeTxt").text =
        DateFormatter.getFullDateString(this._residueTime);
    } else {
      this.runeBtn.enabled = false;
      this.buttomBox.getChild("activityTimeTxt").text =
        LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate");
    }
  }

  /**
   * 轮询剩余时间
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月6日14:15:06
   */
  private loopResidueTime(): void {
    let endTime: Date = DateFormatter.parse(
      this._luckBlindBoxMessage.stopTime,
      "YYYY-MM-DD hh:mm:ss",
    );
    this._residueTime =
      endTime.getTime() / 1000 -
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
    if (this._residueTime > 0) {
      this.setResidueTime();
      Laya.timer.loop(1000, this, this.setResidueTime);
    } else {
      this.runeBtn.enabled = false;
      this.buttomBox.getChild("activityTimeTxt").text =
        LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate");
      Laya.timer.clear(this, this.setResidueTime);
    }
  }

  /**
   * 开启盲盒结果
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年7月11日14:47:55
   */
  private openResult(): void {
    MainToolBar.FLASH_NEW_GOODS = true;

    let rewardArray = LuckBlindBoxManager.Instance.rewardArray;
    rewardArray = ArrayUtils.sortOn(rewardArray, "pos", ArrayConstant.NUMERIC);

    let resultStr = "";
    let resultArray = [];
    let resultObject = {};
    let count = this._resultIds.length;
    for (let index = 0; index < count; index++) {
      let _resultId = this._resultIds[index];
      let reward = rewardArray[_resultId - 1];
      if (!reward) continue;

      let resultGoodsInfo = resultObject[reward.templateId];
      if (!resultGoodsInfo) {
        resultGoodsInfo = new GoodsInfo();
        resultGoodsInfo.templateId = reward.templateId;
        resultGoodsInfo.count = reward.count;
        resultObject[reward.templateId] = resultGoodsInfo;
        resultArray.push(resultGoodsInfo);
      } else {
        resultGoodsInfo.count += reward.count;
      }

      // let resultGoodsInfo = new GoodsInfo();
      // resultGoodsInfo.templateId = reward.templateId;
      // resultGoodsInfo.count = reward.count;

      // resultArray.push(resultGoodsInfo);
      // resultStr = resultGoodsInfo.templateInfo.TemplateNameLang + "x" + resultGoodsInfo.count;

      // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("tasktracetip.view.TreasureMapTipView.content", resultStr));
    }

    resultStr = resultArray
      .map((resultGoodsInfo) => {
        return `${resultGoodsInfo.templateInfo.TemplateNameLang}x${resultGoodsInfo.count}`;
      })
      .join(", ");

    MessageTipManager.Instance.show(
      LangManager.Instance.GetTranslation(
        "tasktracetip.view.TreasureMapTipView.content",
        resultStr,
      ),
    );

    // 播放飘获得动画(背包增加物品有飘落动画)
    // GoodsManager.Instance.dispatchEvent(BagEvent.NEW_GOODS, resultArray);

    this._resultIds = [];
    MaskLockOper.Instance.doCall(false);
  }
}
