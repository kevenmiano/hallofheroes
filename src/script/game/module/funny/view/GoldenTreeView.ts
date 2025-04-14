import FUI_GoldenTreeView from "../../../../../fui/Funny/FUI_GoldenTreeView";
import { t_s_configData } from "../../../config/t_s_config";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsManager } from "../../../manager/GoodsManager";
import {
  BagEvent,
  BottleEvent,
} from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { BagType } from "../../../constant/BagDefine";
import { BaseItem } from "../../../component/item/BaseItem";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { PlayerManager } from "../../../manager/PlayerManager";
import { BottleManager } from "../../../manager/BottleManager";
import { BottleModel } from "../model/BottleModel";
import FunnyType from "../model/FunnyType";
import FunnyManager from "../../../manager/FunnyManager";
import FunnyData from "../model/FunnyData";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { SharedManager } from "../../../manager/SharedManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import UIButton, { UIButtonChangeType } from "../../../../core/ui/UIButton";
import { BottleIntergalBox } from "./BottleIntergalBox";
import { BottleBottomIntergalBox } from "./BottleBottomIntergalBox";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FunnyContent } from "./FunnyContent";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/21 16:25
 * @ver 1.0
 */
export class GoldenTreeView extends FUI_GoldenTreeView implements FunnyContent {
  public item: BaseItem;

  public box5: BottleIntergalBox;

  public box4: BottleIntergalBox;

  public box3: BottleIntergalBox;

  public box2: BottleIntergalBox;

  public box1: BottleIntergalBox;

  public bottomIntergalBox1: BottleBottomIntergalBox;

  public bottomIntergalBox2: BottleBottomIntergalBox;

  public bottomIntergalBox3: BottleBottomIntergalBox;

  public bottomIntergalBox4: BottleBottomIntergalBox;

  public bottomIntergalBox5: BottleBottomIntergalBox;
  private btn_open1: UIButton;
  private btn_open2: UIButton;
  private btn_open3: UIButton;

  private static HAMMER_ID: number = 208022; //魔錘TempId
  private _bottlePriceArr: string[];
  private _openType: number; //开启类型
  private _openNum: number; //开启次数
  private _openCost1: number; //开启1次消耗钻石数量
  private _openCost2: number; //开启10次消耗钻石数量
  private _openCost3: number; //开启50次消耗钻石数量
  private _openCost: number; //开启时消耗的钻石数量
  private _animeCount: number = 0;
  private _tempId: number;
  private _tempIdArr: any[] = [];
  private _bottleShowIdArr: any[];
  private _infoData: FunnyData;

  protected onConstruct(): void {
    super.onConstruct();
    this.txt_remainTime.text = LangManager.Instance.GetTranslation(
      "feedback.FeedBackItem.outDate",
    );
    this.btn_open1 = new UIButton(this._openBtn1);
    this.btn_open2 = new UIButton(this._openBtn2);
    this.btn_open3 = new UIButton(this._openBtn3);
    this.btn_open1.changeType = UIButtonChangeType.Light;
    this.btn_open2.changeType = UIButtonChangeType.Light;
    this.btn_open3.changeType = UIButtonChangeType.Light;
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
  }

  private initData() {
    BottleManager.Instance.sendOpenInfo(4, 0);

    let configInfo: t_s_configData;
    configInfo =
      TempleteManager.Instance.getConfigInfoByConfigName("Bottle_Price");
    if (configInfo && configInfo.ConfigValue) {
      this._bottlePriceArr = configInfo.ConfigValue.split("|");
    }
    this._openCost1 = Number(this._bottlePriceArr[0]);
    this._openCost2 = Number(this._bottlePriceArr[1]);
    this._openCost3 = Number(this._bottlePriceArr[2]);

    let showID = FunnyManager.Instance.selectedId;
    let showData = FunnyManager.Instance.getShowData(showID);
    if (showID && showData) {
      this._infoData = showData;
    }
  }

  private initView() {
    this.txt_openCost1.text = this._openCost1.toString();
    this.txt_openCost2.text = this._openCost2.toString();
    this.txt_openCost3.text = this._openCost3.toString();

    this._checkBtn.selected = true;
    let remainTime: number =
      this.bottleModel.endTime / 1000 -
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
    if (remainTime > 0) {
      this.setRemainTime();
      Laya.timer.loop(1000, this, this.setRemainTime);
    }

    this.__upDateHammerNum(null);

    for (let i = 0, len = 5; i < len; i++) {
      (this["box" + (i + 1)] as BottleIntergalBox).boxIndex = i;
    }
    for (let i = 0, len = 5; i < len; i++) {
      (
        this["bottomIntergalBox" + (i + 1)] as BottleBottomIntergalBox
      ).boxIndex = i;
    }
    this.updateLeftBox();
    this.updateBottleBox();
  }

  private initEvent() {
    this._helpBtn.onClick(this, this.onBtnHelpClick);
    this._fallItemsBtn.onClick(this, this.onFallItemsBtnClick);
    this._recordBtn.onClick(this, this.onRecordBtnClick);
    this.btn_open1.onClick(this, this.__openBottleHandler, [1]);
    this.btn_open2.onClick(this, this.__openBottleHandler, [2]);
    this.btn_open3.onClick(this, this.__openBottleHandler, [3]);
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__upDateHammerNum,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.__upDateHammerNum,
      this,
    );
    //黄金神树层数变化以及礼包对应的人物信息发生改变
    BottleManager.Instance.addEventListener(
      BottleEvent.UPDATE_REWARD_USERINFO,
      this.updateLeftBox,
      this,
    );
    BottleManager.Instance.addEventListener(
      BottleEvent.CT__UPDATE_BOX_STATUS,
      this.updateBottleBox,
      this,
    );
  }

  /**
   * 剩余时间（若还没开始, 则不显示）
   * */
  public setRemainTime() {
    if (!this._infoData || this._infoData.type != FunnyType.GOLDEN_TREE) {
      return;
    }
    let remainTime: number =
      this.bottleModel.endTime / 1000 - this.playerModel.sysCurTimeBySecond;
    if (remainTime >= 60) {
      this.txt_remainTime.text = LangManager.Instance.GetTranslation(
        "funny.FunnyRightView.active.remainTime",
        DateFormatter.getFullTimeString(remainTime),
      );
    } else if (remainTime > 0) {
      this.txt_remainTime.text = LangManager.Instance.GetTranslation(
        "funny.FunnyRightView.active.remainTime",
        DateFormatter.getFullDateString(remainTime),
      );
    } else {
      this.txt_remainTime.text = LangManager.Instance.GetTranslation(
        "feedback.FeedBackItem.outDate",
      );
    }

    if (this.bottleModel.startTime > this.playerModel.nowDate) {
      this.txt_remainTime.text =
        LangManager.Instance.GetTranslation("public.unopen") +
        LangManager.Instance.GetTranslation(
          "funny.FunnyRightView.active.timeText",
          DateFormatter.transDate(this._infoData.startTime / 1000),
          DateFormatter.transDate(this._infoData.endTime / 1000),
        );
    }
  }

  private __upDateHammerNum(infos: GoodsInfo[]): void {
    if (!infos) {
      this.setHammersItem();
      return;
    }
    for (let info of infos) {
      if (info) {
        if (
          info.bagType != BagType.Player ||
          info.templateId != GoldenTreeView.HAMMER_ID
        ) {
          continue;
        }
      }
    }
    this.setHammersItem();
  }

  private setHammersItem() {
    //消耗道具
    let goods: GoodsInfo = new GoodsInfo();
    goods.templateId = GoldenTreeView.HAMMER_ID;
    goods.count = GoodsManager.Instance.getGoodsNumByTempId(
      GoldenTreeView.HAMMER_ID,
    );
    this.item.info = goods;
  }

  private onBtnHelpClick() {
    let title = LangManager.Instance.GetTranslation("public.help");
    let content = LangManager.Instance.GetTranslation(
      "bottle.BottleFrame.helpFrame.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private onFallItemsBtnClick() {
    UIManager.Instance.ShowWind(EmWindow.GoldenTreePreviewWnd);
  }

  private onRecordBtnClick() {
    UIManager.Instance.ShowWind(EmWindow.GoldenTreeRecordWnd);
  }

  private updateLeftBox() {
    for (let i: number = 0; i < 5; i++) {
      (this["box" + (i + 1)] as BottleIntergalBox).boxIndex = i;
      (this["box" + (i + 1)] as BottleIntergalBox).refreshStatus();
    }
    //当前层数: [color=#ffecc6]{floor=150}[/color]
    this.txt_currentCount
      .setVar("floor", this.bottleModel.nowLayer + "")
      .flushVars();
    this.progress_floor.max = 100;

    let _currentheight: number = 0;
    let score: number = this.bottleModel.nowLayer;
    let currentArray: number[] = this.bottleModel.getHeightArray();
    let MAXCURRENT: number = 100;
    let HEIGHT_ARRAY: number[] = [60, 120, 120, 120, 120];
    let _totalHeight: number =
      HEIGHT_ARRAY[0] +
      HEIGHT_ARRAY[1] +
      HEIGHT_ARRAY[2] +
      HEIGHT_ARRAY[3] +
      HEIGHT_ARRAY[4];
    if (score == 0) {
      _currentheight = 0;
    } else if (0 < score && score <= currentArray[0]) {
      _currentheight =
        (MAXCURRENT * ((score * HEIGHT_ARRAY[0]) / currentArray[0] + 3)) /
        _totalHeight;
    } else if (currentArray[0] < score && score <= currentArray[1]) {
      _currentheight =
        (MAXCURRENT *
          (((score - currentArray[0]) * HEIGHT_ARRAY[1]) /
            (currentArray[1] - currentArray[0]) +
            HEIGHT_ARRAY[0])) /
        _totalHeight;
    } else if (currentArray[1] < score && score <= currentArray[2]) {
      _currentheight =
        (MAXCURRENT *
          (((score - currentArray[1]) * HEIGHT_ARRAY[2]) /
            (currentArray[2] - currentArray[1]) +
            HEIGHT_ARRAY[0] +
            HEIGHT_ARRAY[1])) /
        _totalHeight;
    } else if (currentArray[2] < score && score <= currentArray[3]) {
      _currentheight =
        (MAXCURRENT *
          (((score - currentArray[2]) * HEIGHT_ARRAY[3]) /
            (currentArray[3] - currentArray[2]) +
            HEIGHT_ARRAY[0] +
            HEIGHT_ARRAY[1] +
            HEIGHT_ARRAY[2])) /
        _totalHeight;
    } else if (currentArray[3] < score && score < currentArray[4]) {
      _currentheight =
        (MAXCURRENT *
          (((score - currentArray[3]) * HEIGHT_ARRAY[4]) /
            (currentArray[4] - currentArray[3]) +
            HEIGHT_ARRAY[0] +
            HEIGHT_ARRAY[1] +
            HEIGHT_ARRAY[2] +
            HEIGHT_ARRAY[3])) /
        _totalHeight;
    } else if (score >= currentArray[4]) {
      _currentheight = MAXCURRENT;
    }
    this.progress_floor.value = _currentheight;
  }

  private updateBottleBox() {
    for (let i: number = 0; i < 5; i++) {
      (
        this["bottomIntergalBox" + (i + 1)] as BottleBottomIntergalBox
      ).refreshStatus();
    }
    //当前开启次数: [color=#ffecc6]{floor=150}[/color]
    this.txt_currOpenNum
      .setVar("floor", this.bottleModel.openCount.toString())
      .flushVars();
    this.pro_currOpenNum.max = 100; //this.bottleModel.countRewardArr[4].param;

    let _currentheight: number = 0;
    let score: number = this.bottleModel.openCount;
    let currentArray: number[] = this.bottleModel.getCountArray();
    let MAXCURRENT: number = 100;
    let HEIGHT_ARRAY: number[] = [140, 140, 140, 140, 140];
    let _totalHeight: number =
      HEIGHT_ARRAY[0] +
      HEIGHT_ARRAY[1] +
      HEIGHT_ARRAY[2] +
      HEIGHT_ARRAY[3] +
      HEIGHT_ARRAY[4];
    if (score == 0) {
      _currentheight = 0;
    } else if (0 < score && score <= currentArray[0]) {
      _currentheight =
        (MAXCURRENT * ((score * HEIGHT_ARRAY[0]) / currentArray[0] + 3)) /
        _totalHeight;
    } else if (currentArray[0] < score && score <= currentArray[1]) {
      _currentheight =
        (MAXCURRENT *
          (((score - currentArray[0]) * HEIGHT_ARRAY[1]) /
            (currentArray[1] - currentArray[0]) +
            HEIGHT_ARRAY[0])) /
        _totalHeight;
    } else if (currentArray[1] < score && score <= currentArray[2]) {
      _currentheight =
        (MAXCURRENT *
          (((score - currentArray[1]) * HEIGHT_ARRAY[2]) /
            (currentArray[2] - currentArray[1]) +
            HEIGHT_ARRAY[0] +
            HEIGHT_ARRAY[1])) /
        _totalHeight;
    } else if (currentArray[2] < score && score <= currentArray[3]) {
      _currentheight =
        (MAXCURRENT *
          (((score - currentArray[2]) * HEIGHT_ARRAY[3]) /
            (currentArray[3] - currentArray[2]) +
            HEIGHT_ARRAY[0] +
            HEIGHT_ARRAY[1] +
            HEIGHT_ARRAY[2])) /
        _totalHeight;
    } else if (currentArray[3] < score && score < currentArray[4]) {
      _currentheight =
        (MAXCURRENT *
          (((score - currentArray[3]) * HEIGHT_ARRAY[4]) /
            (currentArray[4] - currentArray[3]) +
            HEIGHT_ARRAY[0] +
            HEIGHT_ARRAY[1] +
            HEIGHT_ARRAY[2] +
            HEIGHT_ARRAY[3])) /
        _totalHeight;
    } else if (score >= currentArray[4]) {
      _currentheight = MAXCURRENT;
    }
    this.pro_currOpenNum.value = _currentheight;
    this.pro_currOpenNum.getChild("title").asTextField.text = "";
  }

  private __openBottleHandler(target: any, evt: Event, indexArgs: number[]) {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    if (this.playerModel.sysCurTimeBySecond * 1000 > this.bottleModel.endTime) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.ActivityManager.command02",
        ),
      );
      return;
    }
    let index = 1;
    if (indexArgs && indexArgs.length) index = indexArgs[0];
    this._openCost = Number(this._bottlePriceArr[index - 1]);
    switch (index) {
      case 1:
        this._openType = 1;
        this._openNum = 1;
        break;
      case 2:
        this._openType = 2;
        this._openNum = 10;
        if (this.openAlert()) {
          return;
        }
        break;
      case 3:
        this._openType = 3;
        this._openNum = 50;
        if (this.openAlert()) {
          return;
        }
        break;
    }
    this.openCall();
  }

  /**
   * 开启魔罐提示
   */
  private openAlert(): boolean {
    let preDate: Date = SharedManager.Instance.mysteryShopRefreshCheckDate;
    let check: boolean = SharedManager.Instance.mysteryShopRefresh;
    let now: Date = new Date();
    let outdate: boolean = false;
    if (
      !check ||
      (preDate.getMonth() <= preDate.getMonth() &&
        preDate.getDate() < now.getDate())
    ) {
      outdate = true;
    }
    if (outdate) {
      let content: string = LangManager.Instance.GetTranslation(
        "bottle.view.BottleFrame.openTipData.openAlertContent",
        this._openCost,
        this._openNum,
      );
      let checkTxt: string = LangManager.Instance.GetTranslation(
        "yishi.view.base.ThewAlertFrame.text",
      );
      UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
        content: content,
        checkTxt: checkTxt,
        state: 2,
        backFunction: this.openAlertBack.bind(this),
        closeFunction: null,
      });
    }
    return outdate;
  }

  /**
   * 回调函数
   * @param check
   *
   */
  private openAlertBack(check: boolean): void {
    SharedManager.Instance.mysteryShopRefresh = check;
    SharedManager.Instance.mysteryShopRefreshCheckDate = new Date();
    SharedManager.Instance.saveMysteryShopRefreshCheck();

    this.openCall();
  }

  /**
   * 开启魔罐
   *
   */
  private openCall(): void {
    if (this._checkBtn.selected) {
      let hammerNum: number = GoodsManager.Instance.getGoodsNumByTempId(
        GoldenTreeView.HAMMER_ID,
      );
      if (
        this.playerModel.playerInfo.point + hammerNum * this._openCost1 <
        this._openCost
      ) {
        RechargeAlertMannager.Instance.show();
        return;
      }
    } else {
      if (this.playerModel.playerInfo.point < this._openCost) {
        RechargeAlertMannager.Instance.show();
        return;
      }
    }

    this.effect_tree.tranSacredGoldTree.play(
      Laya.Handler.create(this, this.effectPlayEnd),
      1,
      0,
      0,
      1.667,
    );
    for (let i = 0, len = 5; i < len; i++) {
      this.effect_tree.effect_gold["effect_" + i].tranGolds.play(null, 3);
    }
    BottleManager.Instance.sendOpenInfo(
      0,
      this._openType,
      this._checkBtn.selected,
    );
  }

  private effectPlayEnd() {
    for (let i = 0, len = 5; i < len; i++) {
      this.effect_tree.effect_gold["effect_" + i].tranGolds.stop();
    }
    BottleManager.Instance.sendOpenInfo(3, 0);
  }

  private get bottleModel(): BottleModel {
    return BottleManager.Instance.model;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  private removeEvent() {
    this._helpBtn.offClick(this, this.onBtnHelpClick);
    this._fallItemsBtn.offClick(this, this.onFallItemsBtnClick);
    this._recordBtn.offClick(this, this.onRecordBtnClick);
    this.btn_open1.offClick(this, this.__openBottleHandler);
    this.btn_open2.offClick(this, this.__openBottleHandler);
    this.btn_open3.offClick(this, this.__openBottleHandler);
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__upDateHammerNum,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_BAG,
      this.__upDateHammerNum,
      this,
    );
    //黄金神树层数变化以及礼包对应的人物信息发生改变
    BottleManager.Instance.removeEventListener(
      BottleEvent.UPDATE_REWARD_USERINFO,
      this.updateLeftBox,
      this,
    );
    BottleManager.Instance.removeEventListener(
      BottleEvent.CT__UPDATE_BOX_STATUS,
      this.updateBottleBox,
      this,
    );
  }

  dispose() {
    this.removeEvent();
    this._infoData = null;
    super.dispose();
  }
}
