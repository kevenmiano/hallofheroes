/**
 * 精彩活动
 */

import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import {
  FeedBackEvent,
  FunnyEvent,
  NotificationEvent,
} from "../../../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import ActivityManager from "../../../manager/ActivityManager";
import FunnyManager from "../../../manager/FunnyManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ActiveInfo from "../../activity/ActiveInfo";
import FunnyCtrl from "../control/FunnyCtrl";
import FunnyBagData from "../model/FunnyBagData";
import FunnyData from "../model/FunnyData";
import FunnyType from "../model/FunnyType";
import ConsumoCalcView from "./ConsumoCalcView";
import ActivityCodeView from "./ActivityCodeView";
import FUIHelper from "../../../utils/FUIHelper";
import FunnyExchangeView from "./FunnyExchangeView";
import FunnyConditionType from "../model/FunnyConditionType";
import FunnyExchangeItem from "./FunnyExchangeItem";
import { SharedManager } from "../../../manager/SharedManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import CumulativeRechargeView from "./CumulativeRechargeView";
import CumulativeRechargeDayView from "./CumulativeRechargeDayView";
import FeedBackManager from "../../../manager/FeedBackManager";
import FeedBackItemData from "../../../datas/feedback/FeedBackItemData";
import AllExchangeView from "./AllExchangeView";
import AllManExchangeManager from "../../../manager/AllManExchangeManager";
import FirstRechargeView from "./FirstRechargeView";
import FunnySevenLoginView from "./FunnySevenLoginView";
import { LoginManager } from "../../login/LoginManager";
import { MemoryCardManager } from "../control/MemoryCardManager";
import { MemoryCardView } from "./MemoryCardView";
import LuckyExchangeManager from "../../../manager/LuckyExchangeManager";
import LuckyExchangeView from "./LuckyExchangeView";
//@ts-expect-error: External dependencies
import LuckExchangeTempMsg = com.road.yishi.proto.active.LuckExchangeTempMsg;
import { ConfigManager } from "../../../manager/ConfigManager";
import FoisonHornManager from "../../../manager/FoisonHornManager";
import FoisonHornView from "./FoisonHornView";
import DeleteChargeView from "./DeleteChargeView";
import NoticeActivityView from "./NoticeActivityView";
import { GoldenTreeView } from "./GoldenTreeView";
import { BottleManager } from "../../../manager/BottleManager";
import { RechargeLotteryView } from "./RechargeLotteryView";
import { LuckBlindBoxView } from "./LuckBlindBoxView";
import { ChargeLotteryManager } from "../../../manager/ChargeLotteryManager";
import { LuckBlindBoxManager } from "../../../manager/LuckBlindBoxManager";
import { DeleteFileLevelView } from "./DeleteFileLevelView";
import MaskLockOper from "../../../component/MaskLockOper";
import { SuperGiftOfGroupManager } from "../../../manager/SuperGiftOfGroupManager";
import { SuperGiftOfGroupView } from "./SuperGiftOfGroupView";
export default class FunnyWnd extends BaseWindow {
  protected setSceneVisibleOpen: boolean = true;

  public funnyBg: fgui.Controller;

  private tabData: Array<FunnyData> = [];

  private tabURL: Array<any> = [];

  private currentLoadView: any = null; //当前展示界面

  private contentLoadedURL: Map<string, any> = new Map();

  private contentView: fgui.GLoader;

  private tabList: fgui.GList; //Tab列表

  private activityCodeTab: fgui.GButton; //激活码按钮

  private _showData: Array<FunnyData>;
  private _activityData: FunnyData;
  private _index: number = 0;
  private _activityType: number = 0;
  private _numberOfActivity: number = 0;

  private _infoData: FunnyData = null;

  private maskNode: fgui.GComponent;

  /**
   * 界面初始化
   */
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.onEvent();
    if (this.frameData) {
      if (this.frameData.index) {
        this._index = this.frameData.index;
      }
      if (this.frameData.activityType) {
        this._activityType = this.frameData.activityType;
      }
    } else {
      //默认选中上次打开活动界面
      let showID = FunnyManager.Instance.selectedId;
      let showData = FunnyManager.Instance.getShowData(showID);
      if (showID && showData) {
        this._infoData = showData;
      }
    }
    FunnyManager.Instance.canShine = false;
    FunnyManager.Instance.sendGetBag(1); //查询用户个人的活动信息(解决礼包状态变化不能即时同步的问题)
    LoginManager.Instance.loginRebateChargeReq();
    FunnyManager.Instance.deleteChargeRewardIndex = 0;
    this.initShowData();
    this.refreshView();
    this.funnyBg = this.getController("funnyBg");
    this.funnyBg.selectedIndex = 1;
    this.__onTabSelectHandler();
    MaskLockOper.Instance.regist(this, this.doLockOper);
  }

  private doLockOper(isLock: boolean) {
    this.maskNode.enabled = isLock;
    this.maskNode.visible = isLock;
  }

  private initShowData() {
    this._showData = [];

    let arr: Array<LuckExchangeTempMsg> =
      LuckyExchangeManager.Instance.showData;
    if (arr && arr.length > 0) {
      ///添加幸运兑换相关按钮
      for (let i: number = 0; i < arr.length; i++) {
        let excData = new FunnyData();
        excData.type = FunnyType.LUCKY_EXCHANGE;
        excData.id = arr[i].id;
        excData.multiLangTitle = arr[i].name;
        this._showData.push(excData);
      }
    }

    if (this.activityList.length > 0) {
      for (var j: number = 0; j < this.activityList.length; j++) {
        var activity: FunnyData = new FunnyData();
        activity.id = this.activityList[j].activeId;
        activity.type = FunnyType.REDEEMING_TYPE;
        activity.anyToGet = true;
        activity.title = this.activityList[j].title;
        this._showData.push(activity);
      }
    }

    //商城部分暂时屏蔽
    // if (ShopManager.Instance.model.getTimeBuyList(0).length > 0) {
    //     var hotBuy: FunnyData = new FunnyData();
    //     hotBuy.id = FunnyType.HOT_BUY_ID;
    //     hotBuy.type = FunnyType.HOT_BUY_TYPE;
    //     hotBuy.title = LangManager.Instance.GetTranslation("funny.view.FunnyFrame.hotBuy.title");
    //     this._showData.push(hotBuy);
    // }
    // if (ShopManager.Instance.model.getTimeBuyList(1).length > 0) {
    //     var vipBuy: FunnyData = new FunnyData();
    //     vipBuy.id = FunnyType.VIP_BUY_ID;
    //     vipBuy.type = FunnyType.VIP_BUY_TYPE;
    //     vipBuy.title = LangManager.Instance.GetTranslation("funny.view.FunnyFrame.vipBuy.title");
    //     this._showData.push(vipBuy);
    // }

    if (AllManExchangeManager.Instance.model.isopen) {
      ///添加全民兑换按钮
      let excData = new FunnyData();
      excData.type = FunnyType.TYPE_ALL_EXCHANGE;
      excData.id = FunnyType.TYPE_ALL_EXCHANGE.toString();
      excData.title = LangManager.Instance.GetTranslation(
        "allmainexchange.str1",
      );
      this._showData.push(excData);
    }
    if (BottleManager.Instance.openBottle) {
      ///添加黄金神树按钮
      let excData = new FunnyData();
      excData.type = FunnyType.GOLDEN_TREE;
      excData.id = BottleManager.Instance.model.id;
      excData.title = LangManager.Instance.GetTranslation(
        "bottle.view.BottleFrame.titleText",
      );
      this._showData.push(excData);
    }
    if (
      ChargeLotteryManager.instance.openChargeLottery &&
      ChargeLotteryManager.instance.chargeMsg
    ) {
      ///添加充值轮盘按钮
      let excData = new FunnyData();
      excData.type = FunnyType.RECHARGE_LOTTERY;
      excData.id = ChargeLotteryManager.instance.chargeMsg.activeId;
      excData.title = LangManager.Instance.GetTranslation(
        "yishi.ChargeLotteryManager.title",
      );
      this._showData.push(excData);
      ChargeLotteryManager.instance.OperateChargeReq(1);
    }
    if (LuckBlindBoxManager.Instance.luckBlindBoxOpen) {
      ///添加幸运盲盒按钮
      let excData = new FunnyData();
      excData.type = FunnyType.LUCK_BLIND_BOX;
      excData.id = FunnyType.LUCK_BLIND_BOX.toString();
      // excData.id = "";//LuckBlindBoxManager.Instance.luckBlindBoxMessage.activeId;
      excData.title = LangManager.Instance.GetTranslation(
        "yishi.LuckBlindBoxManager.title",
      );
      this._showData.push(excData);
      // LuckBlindBoxManager.Instance.requestProtocol(1);
    }
    if (SuperGiftOfGroupManager.Instance.open) {
      // 添加超值团购按钮
      let excData = new FunnyData();
      excData.type = FunnyType.SUPER_GIFTOFGROUP;
      excData.id = FunnyType.SUPER_GIFTOFGROUP.toString();
      excData.title = LangManager.Instance.GetTranslation(
        "yishi.SuperGiftOfGroupManager.title",
      );
      this._showData.push(excData);
    }
    if (MemoryCardManager.Instance.model.isOpen) {
      let excData = new FunnyData();
      excData.type = FunnyType.TYPE_MEMORYCARD;
      excData.id = FunnyType.TYPE_MEMORYCARD.toString();
      excData.title = LangManager.Instance.GetTranslation(
        "NewMemoryCardFrame.Activity.TabTitle",
      );
      this._showData.push(excData);
    }
    for (var i: number = 0; i < this.funnyData.length; i++) {
      if (
        this.funnyData[i].showEnd < this.playerModel.nowDate ||
        this.funnyData[i].showStart > this.playerModel.nowDate
      )
        continue; //时间选择活动
      if (this.funnyData[i].type == FunnyType.TYPE_ONLINE) continue; //不显示在线时长奖励
      if (
        this.funnyData[i].type == FunnyType.TYPE_LEAVE &&
        !this.playerInfo.isBackPlayer
      )
        continue; //老玩家回归活动
      if (
        this.funnyData[i].type == FunnyType.TYPE_DELETE_CHARGE &&
        this.funnyData[i].state == -3
      )
        continue;
      if (
        this.funnyData[i].type == FunnyType.TYPE_DELETE_FILELEVEL &&
        this.funnyData[i].state == -3
      )
        continue;
      this._showData.push(this.funnyData[i]);
    }

    if (FoisonHornManager.Instance.model.isOpen) {
      //开放了丰收号角
      let excData = new FunnyData();
      excData.type = FunnyType.FOISON_HORN;
      excData.id = FunnyType.FOISON_HORN.toString();
      excData.title = LangManager.Instance.GetTranslation(
        "foisonHornview.title",
      );
      this._showData.push(excData);
    }
    //添加激活码按钮
    if (ConfigManager.info.IOS_ACTIVITY_CODE) {
      let activityData = new FunnyData();
      activityData.id = FunnyType.ACTIVITY_CODE_ID;
      activityData.type = FunnyType.ACTIVITY_CODE_TYPE;
      activityData.title = LangManager.Instance.GetTranslation(
        "mainBar.SmallMapBar.activityRewardBtnTipData",
      );
      this._activityData = activityData;
      this.setBtnData(this.activityCodeTab, activityData);
    } else {
      this.activityCodeTab.visible = false;
    }

    if (FeedBackManager.Instance.switchBtn1) {
      //如果有充值回馈
      var activity: FunnyData = new FunnyData();
      activity.id = FeedBackManager.Instance.data.id;
      activity.type = FunnyType.TYPE_CUMULATIVE_RECHARGE;
      activity.anyToGet = true;
      activity.title = LangManager.Instance.GetTranslation(
        "feedback.FeedBackFrame.title",
      );
      this._showData.unshift(activity);
    }
    FunnyManager.Instance.showData = this._showData;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  /**
   * 获得活动兑奖的列表
   */
  private get activityList(): Array<ActiveInfo> {
    return ActivityManager.Instance.activityList;
  }

  private get funnyData(): Array<FunnyData> {
    return FunnyManager.Instance.data;
  }

  /***
   * 刷新视图
   * 先刷新左边的按钮, 再根据左边选择的按钮, 刷新右边视图
   * */
  private refreshView() {
    //左边更新时根据长度更新右边数据
    let count = this._showData.length;
    this.tabData = [];
    for (var i: number = 0; i < count; i++) {
      if (i >= this._showData.length) break;
      if (
        this._showData[i].showEnd < this.playerModel.nowDate ||
        this._showData[i].showStart > this.playerModel.nowDate
      )
        continue; //时间选择活动
      if (this._showData[i].type == FunnyType.TYPE_ONLINE) continue; //不显示在线时长奖励
      let btndata = this._showData[i];
      this.tabData.push(btndata);
      this.tabURL[btndata.type] = this.getViewURL(btndata.type);
    }
    ///添加激活码按钮
    if (ConfigManager.info.IOS_ACTIVITY_CODE) {
      let activityData = new FunnyData();
      activityData.id = FunnyType.ACTIVITY_CODE_ID;
      activityData.type = FunnyType.ACTIVITY_CODE_TYPE;
      activityData.title = LangManager.Instance.GetTranslation(
        "mainBar.SmallMapBar.activityRewardBtnTipData",
      );
      this.tabURL[activityData.type] = this.getViewURL(activityData.type);
      this._activityData = activityData;
      this.setBtnData(this.activityCodeTab, activityData);
    } else {
      this.activityCodeTab.visible = false;
    }

    if (this._numberOfActivity != this.funnyData.length) {
      // this._index = 0;
      if (this._activityType != 0) {
        for (let i = 0, len = this.tabData.length; i < len; i++) {
          const tabDatum = this.tabData[i];
          if (tabDatum.type == this._activityType) {
            this._index = i;
            break;
          }
        }
      }
      this.tabList.selectedIndex = this._index;
      this._numberOfActivity = this.funnyData.length;
    }
    this.tabList.numItems = this.tabData.length;
    if (this.tabData.length) {
      //如果有活动则选择活动Tab, 没有活动则默认选择激活码
      this.onSelectTab(this._index);
    } else {
      this.onActivityCodeHandler();
    }
  }

  private __receiveTempHandler(event: Event) {
    this.offEvent();
    this.hide();
  }

  private __refreshHandler(event: FunnyEvent) {
    this.initShowData();
    this.refreshView();
    this.refreshDeleteFileLevelRed();
  }

  /**
   * 当前在记忆翻牌活动界面, 活动关闭会关闭界面
   * @param event
   * @returns
   */
  private __refreshMemoryCardState() {
    if (!MemoryCardManager.Instance.model.isOpen) {
      let selectItem = this.tabData[this.tabList.selectedIndex];
      if (!selectItem) return;
      if (selectItem.type == FunnyType.TYPE_MEMORYCARD) {
        this.hide();
      }
    }
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  /**
   * 界面展示
   */
  OnShowWind() {
    super.OnShowWind();
    MaskLockOper.Instance.doCall(false);
  }

  onEvent() {
    this.tabList.itemRenderer = Laya.Handler.create(
      this,
      this.renderTabListItem,
      null,
      false,
    );
    this.tabList.on(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onTabSelectHandler,
    );
    this.activityCodeTab.onClick(this, this.onActivityCodeHandler);
    FunnyManager.Instance.addEventListener(
      FunnyEvent.REFRESH_ITEM,
      this.__refreshHandler,
      this,
    );
    FunnyManager.Instance.addEventListener(
      FunnyEvent.REFRESH_TEMP,
      this.__receiveTempHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      FunnyEvent.REMAIN_STATE,
      this.__refreshHandler,
      this,
    );
    FeedBackManager.Instance.addEventListener(
      FeedBackEvent.FEEDBACK_RECEIVE_USERINFO,
      this.__refreshHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.MEMORYCARD_STATE_UPDATE,
      this.__refreshMemoryCardState,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.FOISONHORN_RED_CHANGE,
      this.refreshFoisonRed,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.FOISONHORN_INFO_CHANGE,
      this.refreshFoisonRed,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CHARGELOTTERY_RESULT_UPDATE,
      this.refreshLoggerHandler,
      this,
    );
  }

  offEvent() {
    if (this.tabList.itemRenderer instanceof Laya.Handler) {
      this.tabList.itemRenderer.recover();
      this.tabList.itemRenderer = null;
    }
    this.tabList.off(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onTabSelectHandler,
    );
    this.activityCodeTab.offClick(this, this.onActivityCodeHandler);
    FunnyManager.Instance.removeEventListener(
      FunnyEvent.REFRESH_ITEM,
      this.__refreshHandler,
      this,
    );
    FunnyManager.Instance.removeEventListener(
      FunnyEvent.REFRESH_TEMP,
      this.__receiveTempHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      FunnyEvent.REMAIN_STATE,
      this.__refreshHandler,
      this,
    );
    FeedBackManager.Instance.removeEventListener(
      FeedBackEvent.FEEDBACK_RECEIVE_USERINFO,
      this.__refreshHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.MEMORYCARD_STATE_UPDATE,
      this.__refreshMemoryCardState,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.FOISONHORN_RED_CHANGE,
      this.refreshFoisonRed,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.FOISONHORN_INFO_CHANGE,
      this.refreshFoisonRed,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CHARGELOTTERY_RESULT_UPDATE,
      this.refreshLoggerHandler,
      this,
    );
  }

  /**
   * 设置Tab按钮红点状态
   * @param tabIndex Tab索引
   * @param redPointState 是否展示红点
   */
  private setTabBtnState(
    titleName: string,
    redPointState: boolean,
    count: number = 0,
  ) {
    let btnView = this.getTabBtn(titleName);
    if (btnView && !btnView.isDisposed) {
      let ctrl = btnView.getController("redPointState");
      let redDotLabel = btnView.getChild("redDotLabel");
      if (count > 0 && redPointState) {
        ctrl.selectedIndex = 2;
        redDotLabel.text = count.toString();
      } else {
        ctrl.selectedIndex = redPointState ? 1 : 0;
        redDotLabel.text = "";
      }
    }
  }

  /**渲染Tab单元格 */
  renderTabListItem(index: number, item: fgui.GButton) {
    let itemData = this.tabData[index];
    if (!item || !itemData || item.isDisposed) return;
    this.setBtnData(item, itemData);
    this.checkItemAward(itemData);
  }

  setBtnData(item: fgui.GButton, itemData: FunnyData) {
    let titleStr = itemData.title;
    if (itemData.type == FunnyType.ACTIVITY_CODE_TYPE) {
      item.title = this.getUnSelectTitleNameStr(titleStr);
      item.selectedTitle = this.getSelectTitleNameStr(titleStr);
      item.icon = FUIHelper.getItemURL(EmPackName.Base, "Btn_Oth_4y");
      item.selectedIcon = FUIHelper.getItemURL(EmPackName.Base, "Btn_Oth_4y");
    } else {
      item.title = this.getTitleNameStr(titleStr);
      item.selectedTitle = this.getSelectTitleNameStr(titleStr);
      item.icon = FUIHelper.getItemURL(EmPackName.Base, "Tab_Event2_Nor");
      item.selectedIcon = FUIHelper.getItemURL(
        EmPackName.Base,
        "Tab_Event2_Sel",
      );
    }
    item.data = itemData;
  }

  /**签到红点 */
  checkItemAward(data: FunnyData) {
    let awardState = false;
    //时间选择活动
    if (
      data.showEnd < this.playerModel.nowDate ||
      data.showStart > this.playerModel.nowDate
    ) {
      awardState = false;
    } else {
      for (const key in data.bagList) {
        if (Object.prototype.hasOwnProperty.call(data.bagList, key)) {
          let element: FunnyBagData = data.bagList[key];
          if (element.conditionList[0].id == FunnyConditionType.EXCHANGE) {
            //兑换奖励是否可领奖
            let keyId = FunnyExchangeItem._shareWarnKey + element.id;
            let state = SharedManager.Instance.getProperty(keyId); //是否提醒兑换物品
            if ((state == true || state == undefined) && element.status == 1) {
              awardState = true;
              break;
            }
          } else if (
            element.conditionList[0].id == FunnyConditionType.RECHARGE_TIME
          ) {
            if (FunnyManager.Instance.rechargeBagData.status == 1) {
              awardState = true;
              break;
            }
          } else {
            if (element.status == 1) {
              awardState = true;
              break;
            }
          }
        }
      }
      if (data.type == FunnyType.TYPE_CUMULATIVE_RECHARGE) {
        let array: Array<FeedBackItemData> = FeedBackManager.Instance.list;
        let item: FeedBackItemData;
        if (array.length > 0) {
          for (let i = 0; i < array.length; i++) {
            item = array[i];
            if (
              item &&
              FeedBackManager.Instance.data.userPoint >= item.point &&
              !item.state
            ) {
              awardState = true;
              break;
            }
          }
        }
      }
      if (data.type == FunnyType.LUCKY_EXCHANGE) {
        if (LuckyExchangeManager.Instance.idMap.get(data.id) == true) {
          awardState = true;
        }
      }
      if (data.type == FunnyType.FOISON_HORN) {
        if (
          (FoisonHornManager.Instance.model &&
            FoisonHornManager.Instance.model.activeCount >=
              FoisonHornManager.Instance.model.goodsList.length &&
            FoisonHornManager.Instance.model.hasActiveCount <= 0) ||
          !SharedManager.Instance.foisonHornClick
        ) {
          awardState = true;
        }
      }
    }
    this.setTabBtnState(data.title, awardState);
  }

  private refreshFoisonRed() {
    let flag: boolean = false;
    if (
      (FoisonHornManager.Instance.model &&
        FoisonHornManager.Instance.model.activeCount >=
          FoisonHornManager.Instance.model.goodsList.length &&
        FoisonHornManager.Instance.model.hasActiveCount <= 0) ||
      !SharedManager.Instance.foisonHornClick
    ) {
      flag = true;
    }
    this.setTabBtnState(
      LangManager.Instance.GetTranslation("foisonHornview.title"),
      flag,
    );
  }

  private refreshLoggerHandler() {
    if (!ChargeLotteryManager.instance.openChargeLottery) return;
    let flag: boolean = false;
    if (ChargeLotteryManager.instance.chargeMsg.leftCount > 0) {
      flag = true;
    }
    this.setTabBtnState(
      LangManager.Instance.GetTranslation("yishi.ChargeLotteryManager.title"),
      flag,
    );
  }

  private refreshDeleteFileLevelRed() {
    let flag: boolean = false;
    let title: string = "";
    let datalist = FunnyManager.Instance.data;
    for (const key in datalist) {
      if (Object.prototype.hasOwnProperty.call(datalist, key)) {
        const data = datalist[key];
        if (data.type == FunnyConditionType.TYPE_DELETE_FILELEVEL) {
          title = data.title;
          if (
            data.showEnd < this.playerModel.nowDate ||
            data.showStart > this.playerModel.nowDate
          )
            continue;
          for (const key in data.bagList) {
            if (Object.prototype.hasOwnProperty.call(data.bagList, key)) {
              let element = data.bagList[key];
              if (
                element.conditionList[0].id ==
                FunnyConditionType.TYPE_DELETE_FILELEVEL
              ) {
                if (element.status == 1 || data.state == -1) {
                  flag = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
    this.setTabBtnState(title, flag);
  }

  /**返回界面URL */
  private getViewURL(actId: number | string): string {
    let URL: string = "";
    switch (actId) {
      case FunnyType.ACTIVITY_CODE_TYPE: //激活码类型
        URL = ActivityCodeView.URL;
        break;
      case FunnyType.TYPE_EXCHANGE: //兑换活动
        URL = FunnyExchangeView.URL;
        break;
      case FunnyType.TYPE_CUMULATIVE_RECHARGE: //累计充值
        URL = CumulativeRechargeView.URL;
        break;
      case FunnyType.TYPE_CUMULATIVE_RECHARGE_DAY: //累计充值天数
        URL = CumulativeRechargeDayView.URL;
        break;
      case FunnyType.TYPE_ALL_EXCHANGE: //全民兑换
        URL = AllExchangeView.URL;
        break;
      case FunnyType.RECHARGE_TIME: //时段性首充
        URL = FirstRechargeView.URL;
        break;
      case FunnyType.TYPE_SEVEN_LOGIN_DAY: //七日登录
        URL = FunnySevenLoginView.URL;
        break;
      case FunnyType.TYPE_MEMORYCARD: //记忆翻牌
        URL = MemoryCardView.URL;
        break;
      case FunnyType.LUCKY_EXCHANGE: //幸运兑换
        URL = LuckyExchangeView.URL;
        break;
      case FunnyType.FOISON_HORN: //丰收号角
        URL = FoisonHornView.URL;
        break;
      case FunnyType.GOLDEN_TREE: //黄金神树
        URL = GoldenTreeView.URL;
        break;
      case FunnyType.TYPE_DELETE_CHARGE: //删档充值
        URL = DeleteChargeView.URL;
        break;
      case FunnyType.TYPE_OTHERS: //公告
        URL = NoticeActivityView.URL;
        break;
      case FunnyType.RECHARGE_LOTTERY: //充值轮盘
        URL = RechargeLotteryView.URL;
        break;
      case FunnyType.LUCK_BLIND_BOX: // 幸运盲盒
        URL = LuckBlindBoxView.URL;
        break;
      case FunnyType.SUPER_GIFTOFGROUP: // 超值团购
        URL = SuperGiftOfGroupView.URL;
        break;
      case FunnyType.TYPE_DELETE_FILELEVEL: //删档冲级福利
        URL = DeleteFileLevelView.URL;
        break;
      default: //通用View
        URL = ConsumoCalcView.URL;
        break;
    }
    return URL;
  }

  private __tabIntervalOnce() {
    this.tabIntervalState = true;
    this.tabList.displayObject.mouseEnabled = true;
    Laya.timer.clear(this, this.__tabIntervalOnce);
  }

  private tabInterval: number = 200;
  private tabIntervalState: boolean = true;
  /**切换Tab */
  __onTabSelectHandler() {
    if (!this.tabIntervalState) return;
    this.tabIntervalState = false;
    this.tabList.displayObject.mouseEnabled = false;
    Laya.timer.once(this.tabInterval, this, this.__tabIntervalOnce);

    let tabIndex = this.tabList.selectedIndex;
    this.activityCodeTab.selected = false;
    this._index = tabIndex;
    if (this._showData[tabIndex]) {
      this.onSelectTab(tabIndex);
      if (this._showData[tabIndex].type == FunnyType.LUCKY_EXCHANGE) {
        LuckyExchangeManager.Instance.idMap.set(
          this._showData[tabIndex].id,
          false,
        );
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.LUCK_EXCHANGE_BTN_STATUS_CHANGE,
        );
        this.setTabBtnState(this._showData[tabIndex].title, false);
      }
      if (this._showData[tabIndex].type == FunnyType.FOISON_HORN) {
        SharedManager.Instance.foisonHornClick = true;
        SharedManager.Instance.saveFoisonHornClick();
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.FOISONHORN_RED_CHANGE,
        );
      }
    }
  }

  private checkSelectedMemoryCard() {
    let selectItem = this.tabData[this.tabList.selectedIndex];
    if (selectItem && selectItem.type == FunnyType.TYPE_MEMORYCARD) return true;
    return false;
  }

  /**选择激活码 */
  onActivityCodeHandler() {
    this.tabList.selectNone();
    this.activityCodeTab.selected = true;
    if (this._activityData) {
      FunnyManager.Instance.selectedId = this._activityData.id;
      this.onShowContentType(this._activityData.type, this._activityData.id);
    }
  }

  /**选择Tab索引 */
  onSelectTab(tabIndex: number) {
    if (!this.tabList || this.tabList.isDisposed) return;
    this.tabList.selectedIndex = tabIndex;

    let selectItem = this.tabData[tabIndex];
    if (!selectItem) return;
    FunnyManager.Instance.selectedId = this.tabData[tabIndex].id;
    //创建对应的tab内容窗体
    this.onShowContentType(selectItem.type, this.tabData[tabIndex].id);
  }

  onShowContentType(type, atyId: string) {
    let contentURL = null;
    //创建对应的tab内容窗体
    contentURL = this.tabURL[type];
    Logger.yyz("Load contentURL: " + contentURL);

    let mapURL = atyId + "_" + contentURL;
    let content = this.contentLoadedURL.get(mapURL);
    if (!content) {
      content = FUIHelper.createFUIByURL(contentURL);
      if (!content) {
        Logger.warn("不存在" + mapURL);
        return;
      }
    }

    if (this.currentLoadView == content) {
      content["onUpdate"] && content.onUpdate();
    } else {
      if (this.currentLoadView) {
        this.currentLoadView["onHide"] && this.currentLoadView.onHide();
      }
      this.removeContent();
      this.contentView.displayObject.addChild(content.displayObject);
      content["onShow"] && content.onShow();
      this.currentLoadView = content;
      this.contentLoadedURL.set(mapURL, content);
    }
  }

  /**移除旧界面 */
  private removeContent() {
    while (this.contentView.displayObject.numChildren > 1) {
      this.contentView.displayObject.removeChildAt(
        this.contentView.displayObject.numChildren - 1,
      );
    }
  }

  private getTitleNameStr(str: string): string {
    return `[size=20][color=#C1A163]${str}[/color][/size]`;
  }

  private getSelectTitleNameStr(titleStr: string): string {
    return `[size=20][color=#3B0005][B]${titleStr}[/B][/color][/size]`;
  }

  private getUnSelectTitleNameStr(titleStr: string): string {
    return `[size=20][color=#3B0005]${titleStr}[/color][/size]`;
  }

  /**获取Tab按钮 */
  private getTabBtn(btnName: string): fgui.GButton {
    let returnBtn: fgui.GButton;
    for (let i = 0; i < this.tabList.numChildren; i++) {
      let btn: fgui.GButton = this.tabList.getChildAt(i) as fgui.GButton;
      if (btn && btn.title == this.getTitleNameStr(btnName)) {
        returnBtn = btn;
        break;
      }
    }
    return returnBtn;
  }

  private removeItem(btnName: string) {
    for (let i = 0; i < this.tabList.numChildren; i++) {
      let btn: fgui.GButton = this.tabList.getChildAt(i) as fgui.GButton;
      if (btn && btn.title == this.getTitleNameStr(btnName)) {
        this.tabList.removeChildToPoolAt(i);
        this.tabURL.splice(i, 1);
        break;
      }
    }
  }

  protected OnClickModal() {}

  private get control(): FunnyCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as FunnyCtrl;
  }

  private removeAllLoadView() {
    if (this.currentLoadView) {
      this.currentLoadView["onHide"] && this.currentLoadView.onHide();
    }
    this.contentLoadedURL.forEach((value: fgui.GComponent, key: string) => {
      if (value && !value.isDisposed) {
        value.removeFromParent();
        value["dispose"] && value.dispose();
        value = null;
      }
    });
    this.contentLoadedURL.clear();
  }

  /**
   * 关闭界面
   */
  OnHideWind() {
    // this.tabData = [];
    // this.tabURL = [];
    // this._showData = null;
    // FunnyManager.Instance.canShine = true;
    MaskLockOper.Instance.unRegist();
    this.removeAllLoadView();
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    this.offEvent();
    this.tabData = [];
    this.tabURL = [];
    this._showData = null;
    FunnyManager.Instance.canShine = true;
    super.dispose(dispose);
  }
}
