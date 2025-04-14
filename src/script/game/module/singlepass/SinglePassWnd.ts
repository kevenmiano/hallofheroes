//@ts-expect-error: External dependencies
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import SinglePassCardInfo from "./model/SinglePassCardInfo";
import SinglePassCardItem from "./item/SinglePassCardItem";
import SinglePassModel from "./SinglePassModel";
import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import SinglePassManager from "../../manager/SinglePassManager";
import SinglePassSocketOutManager from "../../manager/SinglePassSocketOutManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { SinglePassEvent } from "../../constant/event/NotificationEvent";
import { PathManager } from "../../manager/PathManager";
import ResMgr from "../../../core/res/ResMgr";
import XmlMgr from "../../../core/xlsx/XmlMgr";
import SinglePassOrderInfo from "./model/SinglePassOrderInfo";
import FUIHelper from "../../utils/FUIHelper";
import { GoodsManager } from "../../manager/GoodsManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import SinglePassRewardItem from "./item/SinglePassRewardItem";
import SinglePassBtnItem from "./item/SinglePassBtnItem";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/11/25 17:35
 * @ver 1.0
 */
export class SinglePassWnd extends BaseWindow {
  public selectIndex: fgui.Controller;
  public c1: fgui.Controller;
  public frame: fgui.GLabel;
  public list: fgui.GList;
  public levelTxt: fgui.GRichTextField;
  public preBtn: fgui.GButton;
  public nextBtn: fgui.GButton;
  public RankBtn: fgui.GButton;
  public nextLayerBtn: fgui.GButton;
  public preLayerBtn: fgui.GButton;
  public btnList: fgui.GList;
  public allocationBtn: fgui.GButton;
  public allocationTxt: fgui.GTextField;
  public countTxt: fgui.GTextField;
  public leftCountTxt: fgui.GRichTextField;
  private _currentIndex: number = 0;
  private _oldIndex: number = 0;
  private _currentSelectedItem: SinglePassCardItem;
  private _oldSelectedItem: SinglePassCardItem;
  private _singlePassModel: SinglePassModel;
  private _canUpdateArea: boolean = false;
  private _bugleLeftCount: number;
  private _tollgateBtns: Array<SinglePassBtnItem>;
  private _leftCount: number;
  private _finallyCardInfos: Array<SinglePassCardInfo>;
  private _selectAreaTollgateCount: number = 0;
  public redBtn: fgui.GButton;
  public rewardItem: SinglePassRewardItem;
  public enterBtn: fgui.GButton;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initData();
    this.initView();
    this.initEvent();
  }

  private initData() {
    this._singlePassModel = SinglePassManager.Instance.model;
    SinglePassSocketOutManager.sendRequestSinglePassInfo();
    this.rewardItem = this.contentPane.getChild(
      "rewardItem",
    ) as SinglePassRewardItem;
    this.c1 = this.getController("c1");
  }

  private initView() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list.setVirtual();
    this.list.scrollPane.mouseWheelEnabled = false;

    let btnView: SinglePassBtnItem;
    this._tollgateBtns = [];
    for (var i: number = 0; i < SinglePassModel.TOLLGATE_PER_FLOOR; i++) {
      btnView = FUIHelper.createFUIInstance("SinglePass", "SinglePassBtnItem");
      btnView.index = i + 1;
      btnView.y = 515;
      btnView.x = 140 + i * 95;
      this.addChild(btnView.displayObject);
      btnView.clickFunction = this.clickFunction.bind(this);
      this._tollgateBtns.push(btnView);
    }
  }

  private initEvent() {
    this.list.on(fgui.Events.SCROLL, this, this.scrollEffect);
    this.list.on(fgui.Events.CLICK_ITEM, this, this.clickItemHandler);
    this.list.on(fgui.Events.SCROLL_END, this, this.scrollEffectEnd);
    this.preBtn.onClick(this, this.preBtnHandler);
    this.nextBtn.onClick(this, this.nextBtnHandler);
    this.preLayerBtn.onClick(this, this.preLayerBtnHandler);
    this.nextLayerBtn.onClick(this, this.nextLayerBtnHandler);
    this.frame.getChild("helpBtn").onClick(this, this.helpBtnHandler);
    this.RankBtn.onClick(this, this.rankBtnHandler);
    this.allocationBtn.onClick(this, this.allocationBtnHandler);
    this._singlePassModel.addEventListener(
      SinglePassEvent.SINGLEPASS_INFO_UPDATE,
      this.singlePassInfoUpdateHandler,
      this,
    );
    this._singlePassModel.addEventListener(
      SinglePassEvent.SINGLEPASS_UPDATE_REWARD,
      this.singlePassRewardUpdateHandler,
      this,
    );
    this.enterBtn.onClick(this, this.enterBtnHandler);
  }

  private removeEvent() {
    this.list.off(fgui.Events.SCROLL, this, this.scrollEffect);
    this.list.off(fgui.Events.CLICK_ITEM, this, this.scrollEffect);
    this.list.off(fgui.Events.SCROLL_END, this, this.scrollEffectEnd);
    this.preBtn.offClick(this, this.preBtnHandler);
    this.nextBtn.offClick(this, this.nextBtnHandler);
    this.preLayerBtn.offClick(this, this.preLayerBtnHandler);
    this.nextLayerBtn.offClick(this, this.nextLayerBtnHandler);
    this.frame.getChild("helpBtn").offClick(this, this.helpBtnHandler);
    this.RankBtn.offClick(this, this.rankBtnHandler);
    this.allocationBtn.offClick(this, this.allocationBtnHandler);
    this._singlePassModel.removeEventListener(
      SinglePassEvent.SINGLEPASS_INFO_UPDATE,
      this.singlePassInfoUpdateHandler,
      this,
    );
    this.enterBtn.offClick(this, this.enterBtnHandler);
    this._singlePassModel.removeEventListener(
      SinglePassEvent.SINGLEPASS_UPDATE_REWARD,
      this.singlePassRewardUpdateHandler,
      this,
    );
  }

  enterBtnHandler() {
    if (this._currentSelectedItem) {
      SinglePassManager.Instance.sendRequestSinglePassAttack(
        this._currentSelectedItem.info.tollgate,
      );
    }
  }

  /**信息更新 */
  private singlePassInfoUpdateHandler() {
    this._singlePassModel.selectArea = this._singlePassModel.area;
    this._singlePassModel.selectIndex = this._singlePassModel.maxIndex;
    if (
      this._singlePassModel.lastIndex > 0 &&
      this._singlePassModel.lastIndex != this._singlePassModel.maxIndex
    ) {
      var floor: number = parseInt(
        (
          (this._singlePassModel.lastIndex - 1) /
            SinglePassModel.TOLLGATE_PER_FLOOR +
          1
        ).toString(),
      );
      if (this._singlePassModel.floors.indexOf(floor) != -1) {
        this._singlePassModel.selectArea = floor;
      }
    }
    this.refreshView();
    this.scrollEffect();
  }

  private singlePassRewardUpdateHandler() {
    if (
      this._singlePassModel.areaRewardArray &&
      this._singlePassModel.areaRewardArray.indexOf(
        this._singlePassModel.selectArea.toString(),
      ) != -1
    ) {
      this.rewardItem.hasGetImg.visible = true;
      this.rewardItem.refreshRegister(false);
    } else {
      this.rewardItem.hasGetImg.visible = false;
      this.rewardItem.refreshRegister(true);
    }
  }

  private cardTurnFunction() {
    for (let i = 0; i < this._tollgateBtns.length; i++) {
      let item: SinglePassBtnItem = this._tollgateBtns[i] as SinglePassBtnItem;
      if (item && i == this._currentIndex - 1) {
        item.selectedType = 1;
      } else {
        item.selectedType = 0;
      }
    }
  }

  private changeList(index: number) {
    this.list.scrollToView(index, true);
    if (index == 2) {
      this.list.scrollPane.scrollRight(1, true);
    } else if (index == 1) {
      this.list.scrollPane.scrollLeft(1, true);
    }
    this.list.refreshVirtualList();
  }

  private changeSelectHander(index: number) {
    //计算前面选择的项跟当前点击的项目的差值, 为1就调用scrollLeft或者scrollRight
    this._oldIndex = this._currentIndex;
    this._currentIndex = index + 1;
    let delNum: number = 0;
    if (this._oldIndex > this._currentIndex) {
      //点击左侧按钮
      delNum = this._oldIndex - this._currentIndex;
      for (let i: number = 0; i < delNum; i++) {
        this.list.scrollPane.scrollLeft(1, true);
      }
    } else if (this._oldIndex < this._currentIndex) {
      //点击右侧按钮
      delNum = this._currentIndex - this._oldIndex;
      for (let j: number = 0; j < delNum; j++) {
        this.list.scrollPane.scrollRight(1, true);
      }
    }
  }
  /**
   *
   * @param index 点击按钮的处理
   */
  private clickFunction(index: number) {
    var _index: number;
    _index = (index % SinglePassModel.TOLLGATE_PER_FLOOR) - 1;
    if (_index < 0) {
      _index = 9;
    }
    this.changeSelectHander(_index);
    if (!this._singlePassModel.isMaxJudge(index)) {
      if (_index == this._currentIndex - 1) {
        // SinglePassManager.Instance.sendRequestSinglePassAttack(index);
      }
      this.cardTurnFunction();
      this.setBtnVisible();
    } else {
      // SinglePassManager.Instance.sendRequestSinglePassAttack(index);
    }
  }

  /**打开排行榜 */
  private rankBtnHandler() {
    MessageTipManager.Instance.show(
      "排行榜统一改为读取json, 服务器缺少对应json文件，解析逻辑需要修改",
    );
    return;

    ResMgr.Instance.loadRes(
      PathManager.singlePassOrderPath,
      this.singPassOrderLoadCompleteHandler.bind(this),
      null,
      Laya.Loader.BUFFER,
    );
  }

  private singPassOrderLoadCompleteHandler(res: any) {
    this._singlePassModel.orderList.length = 0;
    if (res && res != "") {
      let rankData: any = XmlMgr.Instance.decode(res);
      let rankArray: any[] = [];
      if (rankData && rankData.list.item) {
        rankArray = rankData.list.item;
      }
      for (let i: number = 0; i < rankArray.length; i++) {
        let itemData: any = rankArray[i];
        var orderInfo: SinglePassOrderInfo = new SinglePassOrderInfo();
        orderInfo.userId = parseInt(itemData.UserId.toString());
        orderInfo.job = parseInt(itemData.Job);
        orderInfo.nickName = itemData.NickName;
        orderInfo.consortiaName = itemData.ConsortiaName;
        orderInfo.order = parseInt(itemData.Order);
        orderInfo.grades = parseInt(itemData.Grades);
        orderInfo.index = parseInt(itemData.Index);
        orderInfo.fightingCapacity = parseInt(itemData.FightingCapacity);
        orderInfo.isVip = itemData.IsVip == "true";
        orderInfo.vipType = parseInt(itemData.VipType);
        this._singlePassModel.orderList.push(orderInfo);
      }
      this._singlePassModel.orderList.sort(this.compareFunction);
    }
    this.__orderDataLoadCompleteHandler();
  }

  private compareFunction(
    a: SinglePassOrderInfo,
    b: SinglePassOrderInfo,
  ): number {
    if (a.order > b.order) {
      return 1;
    } else if (a.order < b.order) {
      return -1;
    } else {
      return 0;
    }
  }

  /**打开排行榜界面*/
  private __orderDataLoadCompleteHandler() {
    FrameCtrlManager.Instance.open(EmWindow.SinglePassRankWnd);
  }

  /**领取号角 */
  private allocationBtnHandler() {
    var rewardCount: number = parseInt(
      (
        this._singlePassModel.maxIndex / SinglePassModel.REWARD_LIMIT
      ).toString(),
    );
    var nextRewardIndex: number =
      (rewardCount + 1) * SinglePassModel.REWARD_LIMIT;
    var floor: number = 0;
    var tollgate: number = 0;
    var content: string = "";
    floor = parseInt(
      (
        (nextRewardIndex - 1) / SinglePassModel.TOLLGATE_PER_FLOOR +
        1
      ).toString(),
    );
    tollgate = nextRewardIndex % SinglePassModel.TOLLGATE_PER_FLOOR;
    if (tollgate == 0) {
      tollgate = SinglePassModel.TOLLGATE_PER_FLOOR;
    }
    if (
      this._singlePassModel.maxIndex <
      SinglePassModel.MAX_FLOOR * SinglePassModel.TOLLGATE_PER_FLOOR
    ) {
      content = LangManager.Instance.GetTranslation(
        "singlepass.SinglePassView.GetHornBtnTips02",
        SinglePassModel.FLOOR_STR[floor],
        tollgate,
        this._singlePassModel.bugleCount,
      );
    } else {
      content = LangManager.Instance.GetTranslation(
        "singlepass.SinglePassView.GetHornBtnTips03",
      );
    }
    if (this._bugleLeftCount > 0) {
      this._singlePassModel.itemCount =
        this._singlePassModel.itemCount + this._bugleLeftCount;
      this._bugleLeftCount = 0;
      this.allocationBtn.enabled = false;
      this.redBtn.visible = false;
      SinglePassSocketOutManager.sendRequestGetBugle();
    } else {
      MessageTipManager.Instance.show(content);
    }
  }

  /**帮助说明 */
  private helpBtnHandler() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string = LangManager.Instance.GetTranslation(
      "singlepass.view.SinglePassHelpFrame.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  /**上一个 */
  private preBtnHandler() {
    this._currentIndex--;
    this.list.scrollPane.scrollLeft(1, true);
    this.setBtnVisible();
    this.cardTurnFunction();
  }

  /**下一个 */
  private nextBtnHandler() {
    this._currentIndex++;
    this.list.scrollPane.scrollRight(1, true);
    // this.setSinglePassCardItemLight();
    this.setBtnVisible();
    this.cardTurnFunction();
  }

  private setBtnVisible() {
    if (this._currentIndex == 1) {
      this.preBtn.visible = false;
    } else {
      this.preBtn.visible = true;
    }
    if (this._currentIndex == 10) {
      this.nextBtn.visible = false;
    } else {
      this.nextBtn.visible = true;
    }
  }
  /**上一层 */
  preLayerBtnHandler() {
    if (this._singlePassModel.selectArea == SinglePassModel.MIN_FLOOR) {
      return;
    }
    this._singlePassModel.selectArea = this.prevFloor;
    this._singlePassModel.selectIndex =
      SinglePassManager.Instance.getCardIndex();
    this.refreshView();
    this.scrollEffect();
  }

  /**下一层 */
  nextLayerBtnHandler() {
    if (this._singlePassModel.selectArea == SinglePassModel.MAX_FLOOR) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "singlepass.order.SinglePassView.TipTxt",
        ),
      );
      return;
    }
    if (this._canUpdateArea) {
      SinglePassSocketOutManager.sendRequestUpdateArea();
      this._canUpdateArea = false;
      return;
    }
    this._singlePassModel.selectArea = this.nextFloor;
    this._singlePassModel.selectIndex =
      SinglePassManager.Instance.getCardIndex();
    this.refreshView();
    this.scrollEffect();
    this.list.scrollPane.scrollLeft(1, true);
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private renderListItem(index: number, item: SinglePassCardItem) {
    item.index = index;
    item.info = this._finallyCardInfos[index];
    if (this._currentIndex == index) {
      item.selected = true;
    } else {
      item.selected = false;
    }
  }

  private clickItemHandler(clickItem: SinglePassCardItem) {
    if (this._currentSelectedItem && clickItem.index == this._currentIndex) {
      // SinglePassManager.Instance.sendRequestSinglePassAttack(this._currentSelectedItem.info.tollgate);
    } else {
      this.changeSelectHander(clickItem.index - 1);
      if (!this._singlePassModel.isMaxJudge(clickItem.info.tollgate)) {
        // SinglePassManager.Instance.sendRequestSinglePassAttack(clickItem.info.tollgate);
      }
    }
  }

  private refreshView() {
    this.preLayerBtn.enabled = false;
    this.nextLayerBtn.enabled = false;
    this.list.scrollPane.touchEffect = true;
    for (let i = 0; i < this._tollgateBtns.length; i++) {
      let item: SinglePassBtnItem = this._tollgateBtns[i] as SinglePassBtnItem;
      if (item) item.enable = false;
    }
    if (this._singlePassModel.selectArea < SinglePassModel.MIN_FLOOR) {
      this._singlePassModel.selectArea = SinglePassModel.MIN_FLOOR;
    } else if (this._singlePassModel.selectArea > this.maxFloor) {
      this._singlePassModel.selectArea = this.maxFloor;
    }
    if (this._singlePassModel.selectArea < this._singlePassModel.area) {
      this._selectAreaTollgateCount = SinglePassModel.TOLLGATE_PER_FLOOR;
    } else {
      this._selectAreaTollgateCount =
        this._singlePassModel.maxIndex -
        (this._singlePassModel.area - 1) * SinglePassModel.TOLLGATE_PER_FLOOR;
    }
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "singlepass.order.SinglePassView.TitleTxt",
      SinglePassModel.FLOOR_STR[this._singlePassModel.selectArea],
    );
    // this.levelTxt.text = LangManager.Instance.GetTranslation("singlepass.order.SinglePassView.TitleTxt", SinglePassModel.FLOOR_STR[this._singlePassModel.selectArea]);
    let cardInfos: Array<SinglePassCardInfo> =
      this._singlePassModel.getCardInfoByFloor(
        this._singlePassModel.selectArea,
      );
    let btnInfos: Array<SinglePassCardInfo> =
      this._singlePassModel.getCardInfoByFloor(
        this._singlePassModel.selectArea,
      );
    this._finallyCardInfos = cardInfos;
    //在原始数据前面插入一个空的、后面插入一个空的
    let firstCardInfo: SinglePassCardInfo = new SinglePassCardInfo();
    firstCardInfo.tollgate = SinglePassModel.TEST_VALUE;
    firstCardInfo.judge = SinglePassModel.TEST_VALUE;
    this._finallyCardInfos.unshift(firstCardInfo);
    this._finallyCardInfos.push(firstCardInfo);
    this.list.numItems = this._finallyCardInfos.length;
    this._currentIndex = SinglePassManager.Instance.getCardIndex() + 1; //从以前的0-9变成1-10（因为前后都加了一个空的）
    if (SinglePassManager.Instance.needTurnNext()) {
      this._singlePassModel.selectIndex = this._singlePassModel.maxIndex - 1;
      this._currentIndex = SinglePassManager.Instance.getCardIndex() + 2;
    }
    if (this._currentIndex >= 12) {
      this._currentIndex = 11;
    }
    this.changeList(this._currentIndex);
    for (var i: number = 0; i < SinglePassModel.TOLLGATE_PER_FLOOR; i++) {
      this._tollgateBtns[i].info = btnInfos[i];
      if (i <= this._selectAreaTollgateCount) {
        this._tollgateBtns[i].enable = true;
      }
    }
    if (this._singlePassModel.selectArea > SinglePassModel.MIN_FLOOR) {
      this.preLayerBtn.enabled = true;
    }
    if (this._singlePassModel.selectArea < this._singlePassModel.area) {
      this.nextLayerBtn.enabled = true;
    }
    if (this._singlePassModel.selectArea == this._singlePassModel.area) {
      if (
        this._singlePassModel.maxIndex ==
        this._singlePassModel.area * SinglePassModel.TOLLGATE_PER_FLOOR
      ) {
        this.nextLayerBtn.enabled = true;
        this._canUpdateArea = true;
      }
    } else {
      this._canUpdateArea = false;
    }
    this.singlePassRewardUpdateHandler();
    this._leftCount =
      this._singlePassModel.maxCount - this._singlePassModel.count;
    this.leftCountTxt.text = LangManager.Instance.GetTranslation(
      "PetChallengeCDView.remainTimesLabel",
    );
    if (this._leftCount <= 0) {
      this._leftCount = GoodsManager.Instance.getGoodsNumByTempId(
        SinglePassModel.PROP_TEMPLATE_ID,
      );
      if (this._leftCount > 0) {
        this.leftCountTxt.text = LangManager.Instance.GetTranslation(
          "singlepass.order.SinglePassView.LeftCountTxt",
        );
      }
    }
    this.countTxt.text = this._leftCount.toString();
    var rewardCount: number = parseInt(
      (
        this._singlePassModel.maxIndex / SinglePassModel.REWARD_LIMIT
      ).toString(),
    );
    this._bugleLeftCount =
      rewardCount * this._singlePassModel.bugleCount -
      this._singlePassModel.itemCount;
    if (this._bugleLeftCount > 0) {
      this.redBtn.title = this._bugleLeftCount.toString();
      this.allocationBtn.enabled = true;
      this.redBtn.visible = true;
    } else {
      this.redBtn.title = this._bugleLeftCount.toString();
      this.allocationBtn.enabled = false;
      this.redBtn.visible = false;
    }
    this.cardTurnFunction();
    this.setBtnVisible();
  }

  private scrollEffect() {
    let centerX: number = this.list.scrollPane.posX + this.list.viewWidth / 2;
    for (let i = 0, len = this.list.numChildren; i < len; i++) {
      let item: fgui.GObject = this.list.getChildAt(i);
      let delta: number = Math.abs(centerX - item.x - item.width / 2);
      if (delta > item.width) {
        item.setScale(1, 1);
      } else {
        let ss: number = 1 + (1 - delta / item.width) * 0.24;
        item.setScale(ss, ss);
      }
    }
    this.scrollEffectEnd();
  }

  private scrollEffectEnd() {
    this._currentIndex =
      (this.list.getFirstChildInView() + 1) % this.list.numItems;
    this.setSinglePassCardItemLight();
    this.cardTurnFunction();
    this.setBtnVisible();
    this.list.scrollPane.touchEffect = false;
  }

  private setSinglePassCardItemLight() {
    let index = this.list.itemIndexToChildIndex(this._currentIndex);
    this._oldSelectedItem = this._currentSelectedItem;
    if (this._oldSelectedItem) this._oldSelectedItem.selected = false;
    index = index > 0 ? index : 0;
    this._currentSelectedItem = this.list.getChildAt(
      index,
    ) as SinglePassCardItem;
    if (this._currentSelectedItem) this._currentSelectedItem.selected = true;
  }

  private get prevFloor(): number {
    return this._singlePassModel.selectArea - 1;
  }

  private get nextFloor(): number {
    // var index: number = this._singlePassModel.floors.indexOf(this._singlePassModel.selectArea);
    // index++;
    // if (index > this._singlePassModel.floors.length - 1) {
    //     index = this._singlePassModel.floors.length - 1;
    // }
    // if (this._singlePassModel.selectArea + 1 > this._singlePassModel.floors[index]) {
    //     return this._singlePassModel.floors[index]
    // }
    // else {

    // }
    return this._singlePassModel.selectArea + 1;
  }

  private get maxFloor(): number {
    return this._singlePassModel.floors[
      this._singlePassModel.floors.length - 1
    ];
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
