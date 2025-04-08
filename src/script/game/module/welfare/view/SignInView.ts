// @ts-nocheck
import AudioManager from "../../../../core/audio/AudioManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Dictionary from "../../../../core/utils/Dictionary";
import { VIPEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { SoundIds } from "../../../constant/SoundIds";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import DayGuideManager from "../../../manager/DayGuideManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { VIPManager } from "../../../manager/VIPManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { VIPModel } from "../../../mvc/model/VIPModel";
import DayGuideCatecory from "../data/DayGuideCatecory";
import WelfareCtrl from "../WelfareCtrl";
import FUI_SignInView from "../../../../../fui/Welfare/FUI_SignInView";
import SignDateItem from "./component/SignDateItem";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { t_s_dropconditionData } from "../../../config/t_s_dropcondition";
import { BaseItem } from "../../../component/item/BaseItem";
import FUI_Btn_Common_Single from "../../../../../fui/Base/FUI_Btn_Common_Single";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";
import WelfareData from "../WelfareData";
import UIButton from "../../../../core/ui/UIButton";
import Utils from "../../../../core/utils/Utils";
import { VipPrivilegeType } from "../../../constant/VipPrivilegeType";
import PoolManager from "../../../../core/pool/PoolManager";
import { getdefaultLangageCfg } from "../../../../core/lang/LanguageDefine";
import UIManager from "../../../../core/ui/UIManager";
import SDKManager from "../../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../../core/thirdlib/RptEvent";

/**
 * @author:pzlricky
 * @data: 2021-06-24 12:00
 * @description 签到
 */
export default class SignInView extends FUI_SignInView {
  private _countList: Array<t_s_dropconditionData>;
  private _currentSignIndex: number = 0;
  private _signedCount: number = 0;
  private _dateItemList: Array<Date>;
  private awardData: Array<GoodsInfo> = [];

  private signInUIButton: UIButton; //签到
  private reSignInUIButton: UIButton; //补签
  private rewardUIButton: UIButton; //领取奖励

  private _needRefreshTab: boolean = true;
  constructor() {
    super();
  }

  onConstruct() {
    super.onConstruct();
    this.signInUIButton = new UIButton(this.signBtn);
    this.reSignInUIButton = new UIButton(this.signReBtn);
    this.rewardUIButton = new UIButton(this.rewardBtn);
    this.init();
  }

  private init() {
    this.initEvent();
    this.initMonth();
    this.initDate();
    this.initSignCount();
    this.defaultView();
    if (Utils.isWxMiniGame()) {
      this.signInUIButton.x -= 500;
      this.reSignInUIButton.x -= 500;
      this.signEffect_2.x -= 500;
    }
  }

  /**
   * 画出月份的图片
   * */
  private initMonth() {
    let monthValue = this.today.getMonth() + 1;
    let langCfg = getdefaultLangageCfg();
    let monthText = Utils.getMonthStr(monthValue, langCfg.key);
    this.month.text = monthText;
  }

  /**
   * 刷新日期格子
   * */
  private initDate() {
    var last: Date = new Date();
    last.setTime(this.today.getTime());
    last.setDate(1);

    if (last.getDay() != 0) {
      if (last.getMonth() > 0) {
        last.setMonth(
          this.today.getMonth() - 1,
          DateFormatter.getMonthMaxDay(
            this.today.getMonth() - 1,
            this.today.getFullYear()
          ) -
            last.getDay() +
            1
        );
      } else {
        last.setFullYear(
          this.today.getFullYear() - 1,
          11,
          31 - last.getDay() + 1
        );
      }
    }
    var date: Date;
    this._dateItemList = [];
    for (var i: number = 0; i < 42; i++) {
      date = new Date();
      date.setTime(last.getTime() + i * DayGuideCatecory.MS_of_Day);
      this._dateItemList.push(date);
    }

    PoolManager.instance.split(() => {
      if (!this.displayObject || this.displayObject.destroyed) {
        return;
      }
      //@ts-ignore
      this.monthDaylist._pool = PoolManager.instance.getPool();
      this.monthDaylist.numItems = this._dateItemList.length;
    });

    date = new Date();
    date.setTime(
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000
    );
    // this.signInUIButton.enabled = !this.cate.hasSigned(date);
  }

  /**
   * 取得签到次数计数点
   * */
  private initSignCount() {
    this._countList = [];
    let dic = TempleteManager.Instance.getSignDropTemplates();
    for (let tmpItem of dic) {
      if (tmpItem.Para1[0] > 0) this._countList.push(tmpItem);
    }
    this._countList = ArrayUtils.sortOn(
      this._countList,
      "DropId",
      ArrayConstant.NUMERIC
    );
    this.signTab.numItems = this._countList.length;
  }

  /**
   * 刷新签到次数的奖励领取状态
   * */
  private refreshSignCount() {
    this._signedCount = 0;
    for (var i: number = 0; i < this._countList.length; i++) {
      if (this.playerInfo.signTimes >= Number(this._countList[i].Para1[0])) {
        this._signedCount++;
        continue;
      }
    }
    // if (!this.cate.hasSigned(this.today)) {//没有签到
    //     this.signState.selectedIndex = 0;
    //     this.signEffect.selectedIndex = 1;
    // } else {
    //     this.signState.selectedIndex = 1;
    //     //已签到次数
    //     let monthDay = this.today.getDate();
    //     this.reSignInUIButton.enabled = (this.playerInfo.reissueNum > 0 || this.hasNotSignDay()) && this.playerInfo.signTimes < monthDay && this.playerInfo.hasGetData;
    //     //@ts-ignore
    //     this.reSignInUIButton._view.getChild('title').strokeColor = this.reSignInUIButton.enabled ? "#804802" : "#666666";
    //     this.signEffect.selectedIndex = this.reSignInUIButton.enabled ? 1 : 0;
    // }
  }

  private initEvent() {
    //@ts-ignore
    this.monthDaylist.splitFrame = true;
    this.monthDaylist.itemRenderer = Laya.Handler.create(
      this,
      this.renderDateItemListItem,
      null,
      false
    );
    Utils.setDrawCallOptimize(this.signRewardList);
    this.signRewardList.itemRenderer = Laya.Handler.create(
      this,
      this.renderRewardHandler,
      null,
      false
    );
    this.signTab.itemRenderer = Laya.Handler.create(
      this,
      this.renderRewardTabHandler,
      null,
      false
    );
    this.playerInfo.addEventListener(
      PlayerEvent.PLAYER_SIGNSITE_CHANGE,
      this.__changeHandler,
      this
    );
    this.playerInfo.addEventListener(
      PlayerEvent.REWARDSTATE_CHANGE,
      this.__changeHandler,
      this
    );
    this.vipModel.addEventListener(
      VIPEvent.UPFRAMEVIEW_CHANGE,
      this.__upGifViewHandler,
      this
    );
    this.signTab.on(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__selectedChangHandler
    );
    this.signInUIButton.onClick(this, this.__signHandler);
    this.reSignInUIButton.onClick(this, this.__reSignHandler);
    this.rewardUIButton.onClick(this, this.__rewardHandler);
    this.signTab.selectedIndex = -1;
  }

  private removeEvent() {
    // this.monthDaylist.itemRenderer.recover();
    // this.signRewardList.itemRenderer.recover();
    // this.signTab.itemRenderer.recover();

    Utils.clearGListHandle(this.monthDaylist);
    Utils.clearGListHandle(this.signRewardList);
    Utils.clearGListHandle(this.signTab);

    this.playerInfo.removeEventListener(
      PlayerEvent.PLAYER_SIGNSITE_CHANGE,
      this.__changeHandler,
      this
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.REWARDSTATE_CHANGE,
      this.__changeHandler,
      this
    );
    this.vipModel.removeEventListener(
      VIPEvent.UPFRAMEVIEW_CHANGE,
      this.__upGifViewHandler,
      this
    );
    this.signTab.off(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__selectedChangHandler
    );
    this.signInUIButton.offClick(this, this.__signHandler);
    this.reSignInUIButton.onClick(this, this.__reSignHandler);
    this.rewardUIButton.onClick(this, this.__rewardHandler);
  }

  /**是否存在未签到的天数 */
  private hasNotSignDay(): boolean {
    let flag: boolean = false;
    let len: number = this._dateItemList.length;
    let item: Date;
    for (let i: number = 0; i < len; i++) {
      item = this._dateItemList[i];
      // if (!this.cate.hasSigned(item)) {
      //     flag = true;
      //     break;
      // }
    }
    return flag;
  }

  private __upGifViewHandler(event: Laya.Event) {
    if (
      this.vipModel.vipInfo.IsTakeGift &&
      this.vipModel.vipInfo.IsVipAndNoExpirt
    ) {
      FrameCtrlManager.Instance.open(
        EmWindow.VipCoolDownFrameWnd,
        VIPModel.OPEN_GIFT_FRAME
      );
    } else {
      FrameCtrlManager.Instance.open(EmWindow.VipCoolDownFrameWnd);
    }
  }

  /**签到 */
  private __signHandler(e: Laya.Event) {
    if (this.playerInfo.signTimes == 1) {
      SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.GIFT_TWO_LOGIN);
    } else if (this.playerInfo.signTimes == 2) {
      SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.GIFT_THREE_LOGIN);
    } else if (this.playerInfo.signTimes == 6) {
      SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.GIFT_SEVEN_LOGIN);
    }
    this.control.sendSignReward(2);
  }

  /**补签 */
  private __reSignHandler(e: Laya.Event) {
    if (!this.hasNotSignDay()) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("signInView.signTips")
      );
      return;
    }
    if (
      VIPManager.Instance.model.isOpenPrivilege(VipPrivilegeType.RESIGN) &&
      this.playerInfo.reissueNum > 0
    ) {
      this.control.sendSignReward(3);
    } else {
      let content: string = LangManager.Instance.GetTranslation(
        "signInView.signContent",
        this.signCost
      );
      UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
        state: 1,
        content: content,
        backFunction: this.__signConfirmHandler.bind(this),
      });
    }
  }

  private __signConfirmHandler(b: boolean, flag: boolean) {
    if (flag) {
      //优先使用绑定钻石
      if (this.playerInfo.giftToken + this.playerInfo.point < this.signCost) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("Auction.ResultAlert11")
        );
        return;
      }
      this.reSignInUIButton.enabled = false;
      this.playerInfo.hasGetData = false;
      this.control.sendSignReward(3, 0, 2);
    } else {
      //只使用钻石
      if (this.playerInfo.point < this.signCost) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("Auction.ResultAlert11")
        );
        return;
      }
      this.reSignInUIButton.enabled = false;
      this.playerInfo.hasGetData = false;
      this.control.sendSignReward(3, 0, 1);
    }
  }

  private get signCost(): number {
    let cfgValue = 50;
    let cfgItem =
      TempleteManager.Instance.getConfigInfoByConfigName("Repairsignin_Point");
    if (cfgItem) {
      cfgValue = Number(cfgItem.ConfigValue);
    }
    return cfgValue;
  }

  private btnInternalState: boolean = false;
  private btnInternal: number = 2000;

  /**签到领取奖励 */
  private __rewardHandler(e: Laya.Event) {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    let selectTab = this.signTab.selectedIndex;
    let cfgSingCount = Number(this._countList[selectTab].Para1[0]);
    let self = this;
    if (this.btnInternalState) return;
    Utils.delay(this.btnInternal).then(() => {
      self.btnInternalState = false;
    });
    this.btnInternalState = true;
    this.control.sendSignReward(2, cfgSingCount);
  }

  /**
   * 签到次数选项的选择改变
   * */
  private __selectedChangHandler(e: Event) {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    var i: number = this.signTab.selectedIndex;
    this._currentSignIndex = i;
    let cfgSingCount = Number(this._countList[i].Para1[0]);
    if (this.playerInfo.signTimes < cfgSingCount) this.refreshGoods();
    else {
      this.refreshGoods(true);
    }
    this.signTimeRewardState.selectedIndex = this.getRewardState(
      i,
      cfgSingCount
    );
    this.refreshRedPoint();
  }

  private refreshBaseData() {
    this.signEffect.selectedIndex = 0;
    this.refreshSignCount();
    this.signCount
      .setVar("count", this.playerInfo.signTimes.toString())
      .flushVars(); //累计签到次数次数
    this.reSignCount
      .setVar("count", this.playerInfo.reissueNum.toString())
      .flushVars(); //剩余补签次数
  }

  /**
   * 签到成功
   * */
  private __changeHandler(evtData) {
    this.signInUIButton.enabled = false;
    this.initDate();
    this.refreshView();
  }

  private refreshView() {
    this.refreshBaseData();
    let cfgSingCount = Number(
      this._countList[this.signTab.selectedIndex].Para1[0]
    );
    this.refreshGoods(true);
    this.signTimeRewardState.selectedIndex = this.getRewardState(
      this.signTab.selectedIndex,
      cfgSingCount
    );
    this.refreshRedPoint();
  }

  private defaultView() {
    this.refreshBaseData();
    let hasReward: boolean = false;
    for (var i: number = 0; i < this._countList.length; i++) {
      let cfgSingCount = Number(this._countList[i].Para1[0]);
      if (this.getRewardState(i, cfgSingCount) == 1) {
        //签到次数奖励未领取
        this.signTab.selectedIndex = i;
        this._currentSignIndex = this.signTab.selectedIndex;
        this.refreshGoods(true);
        this.signTimeRewardState.selectedIndex = 1;
        this.refreshRedPoint();
        hasReward = true;
        break;
      }
    }
    if (!hasReward) {
      if (
        this.playerInfo.signTimes <
        Number(this._countList[this._countList.length - 1].Para1[0])
      ) {
        for (var i: number = 0; i < this._countList.length; i++) {
          let cfgSingCount = Number(this._countList[i].Para1[0]);
          if (this.playerInfo.signTimes < cfgSingCount) {
            this.signTab.selectedIndex = i;
            this._currentSignIndex = this.signTab.selectedIndex;
            this.refreshGoods(true);
            this.signTimeRewardState.selectedIndex = this.getRewardState(
              i,
              cfgSingCount
            );
            this.refreshRedPoint();
            break;
          }
        }
      } else {
        this.signTab.selectedIndex = this._countList.length - 1;
        this._currentSignIndex = this.signTab.selectedIndex;
        this.refreshGoods(true);
        let cfgSingCount = Number(
          this._countList[this._countList.length - 1].Para1[0]
        );
        this.signTimeRewardState.selectedIndex = this.getRewardState(
          this._countList.length - 1,
          cfgSingCount
        );
        this.refreshRedPoint();
      }
    }
  }

  /**刷新红点展示 */
  private refreshRedPoint() {
    // let signState = this.ctrlData.SignAwardStates;
    // for (var i: number = 0; i < this._countList.length; i++) {
    //     let btnElement = this.signTab.getChildAt(i).asButton;
    //     let state = signState[i];
    //     let redPoint = btnElement.getController('redPointState');
    //     if (state) {
    //         redPoint.selectedIndex = 1;
    //     } else {
    //         redPoint.selectedIndex = 0;
    //     }
    // }
  }

  /**获取签到次数的奖励领取状态 */
  private getRewardState(index: number, singCount: number = 0): number {
    let rewardState: string = this.playerInfo.rewardState;
    if (rewardState == "") {
      return 0;
    }
    let temp: string[] = rewardState.split(",");
    if (temp && temp.length) {
      let rewardValue = Number(temp[index]); // 0 未领取  1 已领取
      if (rewardValue == 1) {
        return 2;
      } else if (rewardValue == 0) {
        if (this.playerInfo.signTimes >= singCount) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }
    return 0;
  }

  /**
   * 刷新签到次数的奖励物品
   * */
  private refreshGoods(b: boolean = false) {
    this.signRewardList.numItems = 0;
    this.awardData = [];
    var list = TempleteManager.Instance.getDropItemssByDropId(
      this._countList[this._currentSignIndex].DropId
    );
    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        var temp = list[key];
        var goods: GoodsInfo = new GoodsInfo();
        goods.templateId = temp.ItemId;
        goods.count = temp.Data;
        this.awardData.push(goods);
      }
    }
    this.signRewardList.numItems = this.awardData.length;
  }

  private get cate(): DayGuideCatecory {
    return DayGuideManager.Instance.cate;
  }

  private get control(): WelfareCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
  }

  private get ctrlData(): WelfareData {
    return this.control.data;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get today(): Date {
    return PlayerManager.Instance.currentPlayerModel.sysCurtime;
  }
  private get vipModel(): VIPModel {
    return VIPManager.Instance.model;
  }

  private renderDateItemListItem(index: number, item: SignDateItem) {
    if (!item) return;
    item.date = this._dateItemList[index];
  }

  /**刷新领奖次数Tab */
  private renderRewardTabHandler(index: number, item: FUI_Btn_Common_Single) {
    if (!item) return;
    let itemData = this._countList[index];
    item.icon = fgui.UIPackage.getItemURL("Base", "Tab_Brown_N");
    item.selectedIcon = fgui.UIPackage.getItemURL("Base", "Tab_Brown_Y");
    let str = LangManager.Instance.GetTranslation(
      "SignInView.title",
      itemData.Para1[0]
    );
    item.title = "[size=22][color=#FFECC6]" + str + "[/color][/size]";
    item.selectedTitle = "[size=22][color=#FFC68F]" + str + "[/color][/size]";
  }

  private renderRewardHandler(index: number, item: BaseItem) {
    if (!item) return;
    item.info = this.awardData[index];
  }

  dispose() {
    this.removeEvent();
    this._countList = [];
    this._dateItemList = [];
    this.awardData = [];
    if (this.signRewardList && !this.signRewardList.isDisposed) {
      this.signRewardList.dispose();
    }
    this.signRewardList = null;

    if (this.signTab && !this.signTab.isDisposed) {
      this.signTab.dispose();
    }
    this.signTab = null;

    if (this.monthDaylist && !this.monthDaylist.isDisposed) {
      this.monthDaylist.dispose();
    }
    this.monthDaylist = null;

    super.dispose();
  }
}
