//@ts-expect-error: External dependencies
/**
 * 登录活动Item
 */

import FUI_ConsumoCalcItem from "../../../../../fui/Funny/FUI_ConsumoCalcItem";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import FunnyManager from "../../../manager/FunnyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ThaneInfoHelper } from "../../../utils/ThaneInfoHelper";
import StarInfo from "../../mail/StarInfo";
import StarItem from "../../star/item/StarItem";
import FunnyBagData from "../model/FunnyBagData";
import FunnyConditionType from "../model/FunnyConditionType";

export default class ConsumoCalcItem extends FUI_ConsumoCalcItem {
  private _info: FunnyBagData;
  private _goodsArr: Array<any>;

  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
  }

  private initEvent() {
    this.getRewardBtn.onClick(this, this.getRewardBtnHandler);
    Utils.setDrawCallOptimize(this.goodsList);
    this.goodsList.itemRenderer = Laya.Handler.create(
      this,
      this.renderGoodsListItem,
      null,
      false,
    );
    this.goodsList.itemProvider = Laya.Handler.create(
      this,
      this.getListItemResource,
      null,
      false,
    );
  }

  private removeEvent() {
    this.getRewardBtn.offClick(this, this.getRewardBtnHandler);
    // this.goodsList.itemRenderer.recover();
    // this.goodsList.itemProvider.recover();
    Utils.clearGListHandle(this.goodsList);
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

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  /**
   * 设置领取状态
   * */
  public setState() {
    if (this._info == null) return;
    if (this._info.startTime > this.playerModel.nowDate) {
      this.c1.selectedIndex = 1;
    } else {
      switch (this._info.status) {
        case 1: //可领取
          this.c1.selectedIndex = 0;
          this.hideRemainTime();
          break;
        case 2: //已领取
          this.c1.selectedIndex = 2;
          this.hideRemainTime();
          break;
        case 3: //未到条件领取
          this.c1.selectedIndex = 1;
          break;
        default:
          this.c1.selectedIndex = 1;
          break;
      }
    }
  }

  /**
   * 显示倒计时文本（针对在线时长活动）
   */
  public showRemainTime() {
    if (this._info && this._info.remainTime > 0) {
      PlayerManager.Instance.currentPlayerModel.addEventListener(
        PlayerEvent.SYSTIME_UPGRADE_SECOND,
        this.__timerHandler,
        this,
      );
    }
  }

  /**
   * 隐藏倒计时文本（针对在线时长活动)
   */
  public hideRemainTime() {
    PlayerManager.Instance.currentPlayerModel.removeEventListener(
      PlayerEvent.SYSTIME_UPGRADE_SECOND,
      this.__timerHandler,
      this,
    );
  }

  private __timerHandler(event: Event) {
    this._info.remainTime -= 1;
    if (this._info && this._info.remainTime > 0) {
    } else {
      PlayerManager.Instance.currentPlayerModel.removeEventListener(
        PlayerEvent.SYSTIME_UPGRADE_SECOND,
        this.__timerHandler,
        this,
      );
      FunnyManager.Instance.sendGetBag(1); //查询用户个人的活动信息
    }
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  /**每日宝箱 */
  renderGoodsListItem(index: number, item: BaseItem) {
    item.info = this._goodsArr[index];
  }

  private getRewardBtnHandler() {
    if (
      FunnyManager.Instance.selectedFunnyData.endTime <=
      PlayerManager.Instance.currentPlayerModel.nowDate
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate"),
      );
      return;
    }
    FunnyManager.Instance.sendGetBag(2, this._info.id);
  }

  public set info(value) {
    this._info = value;
    this.refreshView();
  }

  private refreshView() {
    if (this._info) {
      this._goodsArr = [];
      let _data = this._info;
      this.DescTxt.text = _data.title;
      this.txt_Count.visible = false;
      let funnyData = FunnyManager.Instance.selectedFunnyData;
      if (funnyData) {
        this.txt_Count.visible =
          (funnyData.getWay == 1 || funnyData.getWay == 3) &&
          this._info.countActive;
      }
      if (_data.hasExchageTimes && this._info.exchangeCount > 1) {
        if (this._info.getIsSpeacial()) {
          this.txt_Count.text =
            this._info.finishValue.toString() +
            "/" +
            this._info.targetValue.toString();
        } else {
          this.txt_Count.text =
            this._info.finishValue.toString() +
            "/" +
            this._info.exchangeCount.toString();
        }
      } else {
        this.txt_Count.text = "";
      }
      for (var i: number = 0; i < _data.rewardList.length; i++) {
        if (_data.rewardList[i].temType == 1) {
          var ginfo: GoodsInfo = new GoodsInfo();
          ginfo.templateId = _data.rewardList[i].temId;
          ginfo.count = _data.rewardList[i].count;
          ginfo.isBinds = _data.rewardList[i].isBind;
          ginfo.strengthenGrade = _data.rewardList[i].strengthenGrade;
          if (GoodsManager.Instance.filterEquip(ginfo)) {
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
          if (!GoodsManager.Instance.filterStar(starInfo)) continue;
          this._goodsArr.push(starInfo);
        }
      }
      this.goodsList.numItems = this._goodsArr.length;
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
