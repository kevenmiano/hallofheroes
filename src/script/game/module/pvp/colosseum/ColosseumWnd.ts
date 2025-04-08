// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 10:32:05
 * @LastEditTime: 2024-02-19 18:13:24
 * @LastEditors: jeremy.xu
 * @Description: 角斗场界面0非实时竞技
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import WXAdapt from "../../../../core/sdk/wx/adapt/WXAdapt";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import Utils from "../../../../core/utils/Utils";
import { t_s_singlearenarewardsData } from "../../../config/t_s_singlearenarewards";
import { ConfigType } from "../../../constant/ConfigDefine";
import { NativeEvent } from "../../../constant/event/NotificationEvent";
import { IconType } from "../../../constant/IconType";
import ItemID from "../../../constant/ItemID";
import { RankIndex } from "../../../constant/RankDefine";
import { RoomPlayerItemType } from "../../../constant/RoomDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { BuildingOrderInfo } from "../../../datas/playerinfo/BuildingOrderInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { ArmyManager } from "../../../manager/ArmyManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { VIPManager } from "../../../manager/VIPManager";
import BuildingManager from "../../../map/castle/BuildingManager";
import RoomPlayerItem from "../../baseRoom/RoomPlayerItem";
import QueueItem from "../../home/QueueItem";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ColosseumBox from "./ColosseumBox";
import ColosseumCtrl from "./ColosseumCtrl";
import ColosseumData from "./ColosseumData";

export default class ColosseumWnd extends BaseWindow {
  protected setSceneVisibleOpen: boolean = true;
  private _order: BuildingOrderInfo;
  public txtMyRankDesc: fgui.GTextField;
  public txtCountTitle: fgui.GTextField;
  public txtCount: fgui.GTextField;
  public activityBar: fgui.GProgressBar;
  public dayBoxlist: fgui.GList;
  public txtCount0: fgui.GTextField;
  public txtCount1: fgui.GTextField;
  public txtCount2: fgui.GTextField;
  public txtCount3: fgui.GTextField;
  public txtOrderDesc: fgui.GTextField;
  public background: fgui.GImage;
  public playerList: fgui.GList;
  public btnRank: fgui.GButton;
  public btnRecord: fgui.GButton;
  public btnRefresh: fgui.GButton;
  public btnReturn: fgui.GButton;
  public btnOrderCool: fgui.GButton;
  public txtOrderTime: fgui.GTextField;
  public gOrder: fgui.GGroup;
  public imgMyHead: fgui.GLoader;
  public btnReward: fgui.GButton;
  public txtEnterCountDesc: fgui.GTextField;
  public txtEnterCount: fgui.GTextField;
  public txtMyRank: fgui.GTextField;

  private _playerList: RoomPlayerItem[] = [];

  private canRefresh: boolean = true;
  _remainTime: any;
  boxDataList: t_s_singlearenarewardsData[];

  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
    this.btnReturn.title = LangManager.Instance.GetTranslation(
      "mainBar.MainToolBar.returnBtnTipData"
    );
    // this.setCenter()
    this.initText();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.initBox();
    this.initOrder();
    this.initPlayerItemList();
    this.refresh();
    this.addEvent();
    if (Utils.isWxMiniGame()) {
      //@ts-ignore
      this.btnRank && WXAdapt.Instance.wxMenuAdapt(this.btnRank);
    }
  }

  initText() {
    this.txtMyRankDesc.text = LangManager.Instance.GetTranslation(
      "RvrBattleMapRightWnd.myScoreTxt"
    );
    this.txtEnterCountDesc.text = LangManager.Instance.GetTranslation(
      "ColosseumWnd.limtCountTxt"
    );
    this.txtCountTitle.text = LangManager.Instance.GetTranslation(
      "RoomList.pvp.colosseum.tip.txt1"
    );
    this.txtEnterCountDesc.text = LangManager.Instance.GetTranslation(
      "securityCode.view.remainCountText"
    );
    this.txtOrderDesc.text = LangManager.Instance.GetTranslation(
      "RoomList.pvp.colosseum.tip.txt2"
    );

    this.btnReward.title = LangManager.Instance.GetTranslation(
      "godarrive.GodArriveFrame.rewardBtn"
    );
  }

  initBox() {
    this.boxDataList = this.model.getBoxDataList();
    for (let i = 0; i < this.boxDataList.length; i++) {
      const element = this.boxDataList[i];
      this["txtCount" + i].text = LangManager.Instance.GetTranslation(
        "RoomList.pvp.colosseum.box.txt1",
        element.Property1
      );
    }
    this.activityBar.max =
      this.boxDataList[this.boxDataList.length - 1].Property1;

    this.dayBoxlist.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false
    );
  }

  /**关闭界面 */
  OnHideWind() {
    this.disposeOrder();
    if (this._order) {
      this._order.off(Laya.Event.CHANGE, this.__onChange, this);
      this._order.off(Laya.Event.COMPLETE, this.__completeHandler, this);
    }
    this._order = null;
    FrameCtrlManager.Instance.exit(EmWindow.ColosseumRankReward);
    UIManager.Instance.HideWind(EmWindow.VipCoolDownFrameWnd);
    FrameCtrlManager.Instance.exit(EmWindow.ColosseumEvent);
    FrameCtrlManager.Instance.exit(EmWindow.Rank);
    this.delEvent();
    super.OnHideWind();
  }

  btnHelpClick() {
    let title = "";
    let content = "";
    title = LangManager.Instance.GetTranslation("public.help");
    content = LangManager.Instance.GetTranslation("pvp.view.PvPHelpContent");
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.onAfterStatusBarChange,
      this
    );
  }

  private delEvent() {
    NotificationManager.Instance.removeEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.onAfterStatusBarChange,
      this
    );
  }

  public refresh() {
    this._refreshFigureCnt = 0;
    Laya.timer.clear(this, this.refreshFigure);
    Laya.timer.loop(100, this, this.refreshFigure);

    this.imgMyHead.icon = IconFactory.getHeadIcon(
      ArmyManager.Instance.thane.snsInfo.headId,
      IconType.HEAD_ICON
    );

    if (this.model.curScore == undefined || this.model.curScore == null) {
      return;
    }
    this.txtMyRank.text = this.model.curScore.toString();
    // if (this.model.remainFreeCount > 0) {
    //     // this.txtEnterCount.setFrame(1);
    //     this.txtEnterCountDesc.text = LangManager.Instance.GetTranslation("securityCode.view.remainCountText");
    //     this.txtEnterCount.text = this.model.remainFreeCount.toString();
    // } else {
    //     // this.txtEnterCount.setFrame(2);
    //     this.txtEnterCountDesc.text = LangManager.Instance.GetTranslation("godarrive.GodArriveFrame.LeftBuyText") + ":";
    //     this.txtEnterCount.text = this.model.remainBuyCount.toString();
    // }
    this.txtEnterCount.text = LangManager.Instance.GetTranslation(
      "fish.FishFrame.countText",
      this.model.remainFreeCount,
      this.model.totalFreeCount
    );
    this.txtCount.text = LangManager.Instance.GetTranslation(
      "RoomList.pvp.colosseum.box.txt1",
      this.model.lastWinCount
    );

    this.gOrder.visible = true;
    this._remainTime =
      this.model.nextRefreshTime - this.playerModel.sysCurTimeBySecond;
    if (this._remainTime > 0) {
      this.__updateTimeHandler();
      Laya.timer.loop(1000, this, this.__updateTimeHandler);
    }

    let curCount =
      this.model.getRewardProgress(this.model.lastWinCount) *
      this.activityBar.max;
    this.activityBar.value = curCount;
    // @ts-ignore
    this.activityBar._titleObject.visible = false;
    this.dayBoxlist.numItems = this.boxDataList.length;

    this.openAutoGetReward();
  }

  private _refreshFigureCnt = 0;
  private refreshFigure() {
    let item = this._playerList[this._refreshFigureCnt] as RoomPlayerItem;
    if (item) {
      item.info = this.model.heroList[this._refreshFigureCnt];
    }
    // Logger.info(">>>>>>>>>>>>>ColosseumWnd -", this._refreshFigureCnt)
    this._refreshFigureCnt++;
    if (this._refreshFigureCnt >= ColosseumData.PlayerItemCnt) {
      Laya.timer.clear(this, this.refreshFigure);
    }
  }

  renderListItem(index: number, item: ColosseumBox) {
    item.setInfo(
      this.boxDataList[index],
      this.model.lastWinCount,
      this.model.winCountReward
    );
  }

  setRemainTime() {
    this._remainTime--;
    if (this._remainTime >= 60) {
      this.txtOrderTime.text = DateFormatter.getCountDateByMS(this._remainTime);
    } else if (this._remainTime > 0) {
      this.txtOrderTime.text = DateFormatter.getCountDateByMS(this._remainTime);
    } else {
      ColosseumCtrl.requestChallengeData();
      this.txtOrderTime.text = DateFormatter.getCountDateByMS(0);
      // this.txtOrderTime.text = LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate");
    }
  }

  __updateTimeHandler() {
    this.setRemainTime();
  }

  private initPlayerItemList() {
    for (let i: number = 0; i < ColosseumData.PlayerItemCnt; i++) {
      let item = this.playerList.addItemFromPool() as RoomPlayerItem;
      item.type = RoomPlayerItemType.PvpChallenge;
      item.addBtnEvent();
      item.index = i;
      this._playerList.push(item);
    }
  }

  public initOrder() {
    for (
      let index = 0;
      index < BuildingManager.Instance.model.colosseumOrderList.length;
      index++
    ) {
      const element = BuildingManager.Instance.model.colosseumOrderList[index];
      if (element.remainTime > 0) {
        element.on(Laya.Event.CHANGE, this.__onChange, this);
        element.on(Laya.Event.COMPLETE, this.__completeHandler, this);
        this._order = element;
        this.gOrder.visible = true;
        return;
      }
    }
  }

  private disposeOrder() {
    for (
      let index = 0;
      index < BuildingManager.Instance.model.colosseumOrderList.length;
      index++
    ) {
      const element = BuildingManager.Instance.model.colosseumOrderList[index];
      element.off(Laya.Event.CHANGE, this.__onChange, this);
      element.off(Laya.Event.COMPLETE, this.__completeHandler, this);
    }
  }

  private get rewardList() {
    let _rewardList = [];

    let gInfo1 = new GoodsInfo();
    gInfo1.templateId = ItemID.GOLD_PROP;
    //战魂去掉了, 需要把战魂的数量加入到黄金里面
    gInfo1.count = this.model.getTakeCount() * 2;
    // let gInfo2 = new GoodsInfo()
    // gInfo2.templateId = ItemID.SOUL_PROP
    // gInfo2.count = this.model.getTakeCount()

    _rewardList.push(gInfo1);
    return _rewardList;
  }

  public getItemByIndex(idx: number) {
    return this._playerList[idx];
  }

  protected __onChange(event: Event) {
    if (!this._order) return;
    if (this._order.remainTime > 0) {
      if (this.txtOrderTime && !this.txtOrderTime.isDisposed)
        this.txtOrderTime.text = DateFormatter.getCountDate(
          this._order.remainTime
        );
    } else {
      this.__completeHandler(null);
    }
  }

  private __completeHandler(event: Event) {
    UIManager.Instance.HideWind(EmWindow.VipCoolDownFrameWnd);
    if (!this._order) return;
    this._order.off(Laya.Event.CHANGE, this.__onChange, this);
    this._order.off(Laya.Event.COMPLETE, this.__completeHandler, this);
    this.gOrder.visible = false;
  }

  getList(): t_s_singlearenarewardsData[] {
    let obj = ConfigMgr.Instance.getDicSync(ConfigType.t_s_singlearenarewards);
    if (obj && obj["Type2"]) {
      return obj["Type2"];
    }
    return [];
  }

  private btnRankClick() {
    FrameCtrlManager.Instance.open(EmWindow.Rank, {
      rankIndex: RankIndex.RankItemR4_001,
    });
  }

  private btnRecordClick() {
    FrameCtrlManager.Instance.open(EmWindow.ColosseumEvent);
  }

  private btnRefreshClick() {
    if (this.canRefresh) {
      this.canRefresh = false;
      this.btnRefresh.enabled = false;
      Laya.timer.once(3000, this, this.__btnRefreshClick);
      ColosseumCtrl.requestChallengeData();
    }
  }

  private __btnRefreshClick() {
    if (this.destroyed) return;
    this.canRefresh = true;
    this.btnRefresh.enabled = true;
  }

  private btnReturnClick() {
    this.OnBtnClose();
  }

  private btnRewardClick() {
    // let desc = LangManager.Instance.GetTranslation("colosseum.view.ColosseumSelfView.rewardDateValueText", this.model.leftDay)
    // FrameCtrlManager.Instance.open(EmWindow.ColosseumRankReward, { rewardList: this.rewardList, txtDesc: desc });
    FrameCtrlManager.Instance.open(EmWindow.ColosseumRewardsWnd);
  }

  openAutoGetReward() {
    let data = this.model.getAutoData();
    if (data) {
      FrameCtrlManager.Instance.open(EmWindow.ColosseumRankReward, data);
    }
  }

  private btnOrderCoolClick() {
    if (!this._order) return;

    if (VIPManager.Instance.model.vipCoolPrivilege) {
      this.__btnOrderCoolClick(true, this._order.orderId);
    } else {
      let cfgItemChallenge = TempleteManager.Instance.getConfigInfoByConfigName(
        "QuickCoolChallenge_Price"
      );
      let cfgItemChallengeValue = 1;
      if (cfgItemChallenge) {
        //挑战
        cfgItemChallengeValue = Number(cfgItemChallenge.ConfigValue);
      }
      let point =
        cfgItemChallengeValue * Math.ceil(this._order.remainTime / 60);
      UIManager.Instance.ShowWind(EmWindow.VipCoolDownFrameWnd, {
        type: QueueItem.QUEUE_TYPE_ALCHEMY,
        orderId: this._order.orderId,
        pointNum: point,
        backFun: this.__btnOrderCoolClick.bind(this),
      });
    }
  }

  private __btnOrderCoolClick(
    b: boolean,
    id: number = 0,
    type: number = 0,
    useBind: boolean = true
  ) {
    if (b) {
      ColosseumCtrl.sendCoolColosseun(0, useBind);
    }
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  dispose() {
    Laya.timer.clear(this, this.refreshFigure);
    Laya.timer.clear(this, this.__updateTimeHandler);
    for (let i: number = 0; i < ColosseumData.PlayerItemCnt; i++) {
      let item = this._playerList[i] as RoomPlayerItem;
      item.dispose();
    }
    if (this._order) {
      this._order.off(Laya.Event.CHANGE, this.__onChange, this);
      this._order.off(Laya.Event.COMPLETE, this.__completeHandler, this);
    }
    this._order = null;
    super.dispose();
  }
}
