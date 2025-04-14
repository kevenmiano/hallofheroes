//@ts-expect-error: External dependencies
/**
 * 登录活动Item
 */

import FUI_FunnyExchangeItem from "../../../../../fui/Funny/FUI_FunnyExchangeItem";
import LangManager from "../../../../core/lang/LangManager";
import { FormularySets } from "../../../../core/utils/FormularySets";
import { BaseItem } from "../../../component/item/BaseItem";
import ItemID from "../../../constant/ItemID";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import FunnyManager from "../../../manager/FunnyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ThaneInfoHelper } from "../../../utils/ThaneInfoHelper";
import { FashionModel } from "../../bag/model/FashionModel";
import HomeWnd from "../../home/HomeWnd";
import StarInfo from "../../mail/StarInfo";
import StarItem from "../../star/item/StarItem";
import FunnyHelper from "../control/FunnyHelper";
import FunnyBagData from "../model/FunnyBagData";
import FunnyConditionType from "../model/FunnyConditionType";
import FunnyRewardData from "../model/FunnyRewardData";
import ColorConstant from "../../../constant/ColorConstant";
import { EmWindow } from "../../../constant/UIDefine";
import UIManager from "../../../../core/ui/UIManager";
import Logger from "../../../../core/logger/Logger";
import { SharedManager } from "../../../manager/SharedManager";
import ExchangeData from "../../../datas/ExchangeData";
import Utils from "../../../../core/utils/Utils";
import { NotificationManager } from "../../../manager/NotificationManager";
import { FunnyEvent } from "../../../constant/event/NotificationEvent";

export default class FunnyExchangeItem extends FUI_FunnyExchangeItem {
  private _info: FunnyBagData;
  private _goodsArr: Array<any>;
  private exchangeReq: Array<GoodsInfo>;
  private lastCheckState: boolean = false;

  //勾选提醒确认框  本地保存key
  private shareAlertKey: string = "Funny_Exchange_Item_Alert";
  public static _shareWarnKey: string = "Funny_Exchange_Item_";

  protected onConstruct() {
    super.onConstruct();
    Utils.setDrawCallOptimize(this);
    this.initEvent();
  }

  private initEvent() {
    this.exchangeBtn.onClick(this, this.exchangeBtnHandler);
    this.check.onClick(this, this.onCheckHandler);
    this.exchangeList1.itemRenderer = Laya.Handler.create(
      this,
      this.renderGoodsListItem1,
      null,
      false,
    );
    this.exchangeList2.itemRenderer = Laya.Handler.create(
      this,
      this.renderGoodsListItem2,
      null,
      false,
    );
    this.exchangeList1.itemProvider = Laya.Handler.create(
      this,
      this.getListItemResource,
      null,
      false,
    );
    this.exchangeList2.itemProvider = Laya.Handler.create(
      this,
      this.getListItemResource,
      null,
      false,
    );
  }

  private removeEvent() {
    this.exchangeBtn.offClick(this, this.exchangeBtnHandler);
    this.check.offClick(this, this.onCheckHandler);
    // this.exchangeList1.itemRenderer.recover();
    // this.exchangeList1.itemProvider.recover();
    // this.exchangeList2.itemRenderer.recover();
    // this.exchangeList2.itemProvider.recover();
    Utils.clearGListHandle(this.exchangeList1);
    Utils.clearGListHandle(this.exchangeList2);
  }

  /**提醒 */
  private onCheckHandler() {
    let checkState = this.check.selected;
    let warns = SharedManager.Instance.funnyExhchangeNotAlert;
    if (!warns) {
      let tipsText: string = "";
      if (checkState) {
        tipsText = LangManager.Instance.GetTranslation(
          "funny.datas.FunnyBagData.alert1",
        );
      } else {
        tipsText = LangManager.Instance.GetTranslation(
          "funny.datas.FunnyBagData.alert2",
        );
      }
      UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
        state: 2,
        content: tipsText,
        backFunction: this.handlerAlertCB.bind(this),
        closeFunction: this.handlerAlertClose.bind(this),
      });
    } else {
      SharedManager.Instance.setProperty(this.shareWarnKey, checkState); //是否提醒兑换物品
      NotificationManager.Instance.dispatchEvent(FunnyEvent.REMAIN_STATE);
    }
  }

  /**取消关闭窗口 */
  handlerAlertClose() {
    this.check.selected = this.lastCheckState;
  }

  /**点击确定回调 */
  handlerAlertCB(b: boolean) {
    Logger.warn("onCheckHandler:", b);
    if (b) {
      SharedManager.Instance.funnyExhchangeNotAlert = true;
      SharedManager.Instance.saveFunnyExchangeTodayNeedAlert();
    }
    SharedManager.Instance.setProperty(this.shareWarnKey, this.check.selected); //是否提醒兑换物品
    NotificationManager.Instance.dispatchEvent(FunnyEvent.REMAIN_STATE);
    this.lastCheckState = this.check.selected;
  }

  private get shareWarnKey(): string {
    return FunnyExchangeItem._shareWarnKey + this._info.id;
  }

  setCheckState() {
    let checkState = SharedManager.Instance.getProperty(this.shareWarnKey);
    if (checkState == undefined) {
      checkState = true;
    }
    SharedManager.Instance.setProperty(this.shareWarnKey, checkState);
    this.check.selected = checkState;
    this.lastCheckState = checkState;
  }

  //不同渲染聊天单元格
  private getListItemResource(index: number) {
    let data: any = this._goodsArr[index];
    //系统信息
    if (data instanceof StarInfo) {
      return StarItem.URL; //星运
    } else {
      return BaseItem.URL; //物品
    }
  }

  /**
   * 设置领取状态
   * */
  public setState() {
    if (this._info == null) return;
    if (this.hasExchangeTimes) {
      this.c1.selectedIndex = 0;
      this.exchangeBtn.enabled = this.canExchange;
    } else {
      this.c1.selectedIndex = 1;
    }
  }

  private isFashion(reward: FunnyRewardData): boolean {
    var ginfo: GoodsInfo = new GoodsInfo();
    ginfo.templateId = reward.temId;
    ginfo.count = reward.count;
    ginfo.isBinds = reward.isBind;
    ginfo.strengthenGrade =
      reward.strengthenGrade <= 0 ? 1 : reward.strengthenGrade;
    if (this.fashionModel.isFashion(ginfo)) {
      return true;
    } else {
      return false;
    }
  }

  private get hasFashion(): boolean {
    if (!this._info || this._info.rewardList.length <= 0) {
      return false;
    }
    for (const key in this._info.rewardList) {
      if (Object.prototype.hasOwnProperty.call(this._info.rewardList, key)) {
        let reward: FunnyRewardData = this._info.rewardList[key];
        var ginfo: GoodsInfo = new GoodsInfo();
        ginfo.templateId = reward.temId;
        ginfo.count = reward.count;
        ginfo.isBinds = reward.isBind;
        ginfo.strengthenGrade =
          reward.strengthenGrade <= 0 ? 1 : reward.strengthenGrade;
        if (this.fashionModel && this.fashionModel.isFashion(ginfo)) {
          return true;
        }
      }
    }
    return false;
  }

  private get fashionModel(): FashionModel {
    return null;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  /**兑换材料 */
  renderGoodsListItem1(index: number, item: BaseItem) {
    if (!item || item.isDisposed) return;
    let infoData = this.exchangeReq[index];
    if (!infoData) return;
    item.info = infoData;
    //已拥有数量/兑换需要数量
    let count = infoData.count;
    let ownCount = 0;
    let countVlaue: string = "";
    if (infoData.templateId == ItemID.DIAMOND_PROP) {
      //钻石
      ownCount = this.playerModel.playerInfo.point;
      countVlaue = ownCount.toString();
    } else if (infoData.templateId == ItemID.GOLD_PROP) {
      //黄金
      ownCount = ResourceManager.Instance.gold.count;
      countVlaue = FormularySets.toStringSelf(
        ResourceManager.Instance.gold.count,
        HomeWnd.STEP,
      ).toString();
    } else {
      ownCount = FunnyHelper.getBagCount(infoData.templateId);
      countVlaue = ownCount.toString();
    }
    item.text =
      "[color=" +
      this.getLackColor(ownCount >= count) +
      "]" +
      countVlaue +
      "[/color]/" +
      count;
    if (item.isConsume) item.isConsume.selectedIndex = 1;
  }

  /**数量不够展示红色 */
  getLackColor(isFixed: boolean): string {
    if (isFixed) {
      return ColorConstant.WHITE_COLOR;
    } else {
      return ColorConstant.RED_COLOR;
    }
  }

  /**可兑换物品 */
  renderGoodsListItem2(index: number, item: BaseItem) {
    if (!item || item.isDisposed) return;
    item.info = this._goodsArr[index];
  }

  private exchangeData: ExchangeData = null;
  private exchangeBtnHandler() {
    if (
      FunnyManager.Instance.selectedFunnyData.endTime <=
      PlayerManager.Instance.currentPlayerModel.nowDate
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate"),
      );
      return;
    }
    if (!this.exchangeData) {
      this.exchangeData = new ExchangeData();
    }
    this.exchangeData.requireInfos = this.exchangeReq;
    this.exchangeData.rewardsInfo = this._goodsArr;
    this.exchangeData.maxCount = this._info.conditionList[0].bak2; //最大限制兑换次数
    this.exchangeData.maxExchangeCount = this._info.maxExchangeCount; //最大可兑换次数
    this.exchangeData.exchangeId = this._info.id;
    // FunnyManager.Instance.sendGetBag(2, this._info.id);
    UIManager.Instance.ShowWind(EmWindow.Exchange, { data: this.exchangeData });
  }

  public set info(value) {
    this._info = value;
    this.refreshView();
  }

  private hasExchangeTimes: boolean = true; //还剩余可兑换次数
  private canExchange: boolean = false; //是否满足兑换条件
  private refreshView() {
    if (this._info) {
      this.hasExchangeTimes = this._info.hasExchageTimes;
      this.canExchange = this._info.canExchage;
      this._goodsArr = [];
      this.exchangeReq = [];
      let _data = this._info;

      if (this._info.conditionList[0].id == FunnyConditionType.EXCHANGE) {
        //兑换
        if (this._info.conditionList[0].bak2 > 0) {
          this.txt_Count.text =
            this._info.getCount +
            "/" +
            this._info.conditionList[0].bak2.toString();
          this.txt_Count.visible = this._info.getCount > 0;
        } else {
          this.txt_Count.text = "";
          this.txt_Count.visible = false;
        }
      } else {
        //领取
        this.txt_Count.text = "";
        this.txt_Count.visible = false;
      }

      //兑换需要
      var ginfo: GoodsInfo = null;

      var len: number = _data.conditionList.length;
      for (var j: number = 0; j < len; j++) {
        let conditionId = _data.conditionList[j].bak;
        ginfo = new GoodsInfo();
        ginfo.templateId = conditionId;
        ginfo.count = _data.conditionList[j].value;
        if (this.filterEquip(ginfo)) {
          this.exchangeReq.push(ginfo);
        }
      }
      this.exchangeList1.numItems = this.exchangeReq.length;

      //兑换获得
      for (var i: number = 0; i < _data.rewardList.length; i++) {
        if (_data.rewardList[i].temType == 1) {
          ginfo = new GoodsInfo();
          ginfo.templateId = _data.rewardList[i].temId;
          ginfo.count = _data.rewardList[i].count;
          ginfo.isBinds = _data.rewardList[i].isBind;
          ginfo.strengthenGrade =
            _data.rewardList[i].strengthenGrade <= 0
              ? 1
              : _data.rewardList[i].strengthenGrade;
          if (this.filterEquip(ginfo)) {
            this._goodsArr.push(ginfo);
          } else {
            continue;
          }
        } else if (_data.rewardList[i].temType == 2) {
          var starInfo: StarInfo = new StarInfo();
          starInfo.template = TempleteManager.Instance.getStarTemplateById(
            _data.rewardList[i].temId,
          );
          starInfo.count = _data.rewardList[i].count;
          starInfo.grade =
            _data.rewardList[i].strengthenGrade <= 0
              ? 1
              : _data.rewardList[i].strengthenGrade;
          if (!this.filterStar(starInfo)) continue;
          this._goodsArr.push(starInfo);
        }
      }

      this.exchangeList2.numItems = this._goodsArr.length;
      this.exchangeList1.resizeToFit(); //
      this.exchangeList2.resizeToFit(); //
      if (this.group) {
        this.group.ensureSizeCorrect();
      }
      this.setCheckState();
      this.setState();
    }
  }

  /**
   * 匹配的星运
   * @param starInfo
   * @return
   */
  private filterStar(starInfo: StarInfo): boolean {
    if (!starInfo || !starInfo.template) {
      return false;
    }
    if (starInfo.template.Job.indexOf(0) >= 0) {
      return true;
    }
    switch (this.thane.job) {
      case 1:
      case 4:
        if (starInfo.template.Job.indexOf(1) >= 0) {
          return true;
        } else {
          return false;
        }
        break;
      case 2:
      case 5:
        if (starInfo.template.Job.indexOf(2) >= 0) {
          return true;
        } else {
          return false;
        }
        break;
      case 3:
      case 6:
        if (starInfo.template.Job.indexOf(3) >= 0) {
          return true;
        } else {
          return false;
        }
        break;
    }
    return false;
  }

  /**
   * 过滤跟自己无关的装备
   * */
  public filterEquip(info: GoodsInfo): boolean {
    var myjob: number = ThaneInfoHelper.getJob(ArmyManager.Instance.thane.job);
    if (!info || !info.templateInfo) return true;
    if (
      info.templateInfo.Job[0] == 0 ||
      info.templateInfo.Job.indexOf(myjob) != -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
