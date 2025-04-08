// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { FormularySets } from "../../../../core/utils/FormularySets";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import ColorConstant from "../../../constant/ColorConstant";
import ItemID from "../../../constant/ItemID";
import ExchangeData from "../../../datas/ExchangeData";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import HomeWnd from "../../home/HomeWnd";
import StarInfo from "../../mail/StarInfo";
import StarItem from "../../star/item/StarItem";
import FunnyHelper from "../control/FunnyHelper";
import FunnyManager from "../../../manager/FunnyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";

/**
 * 兑换
 */
export default class ExchangeWnd extends BaseWindow {
  public frame: fgui.GComponent;
  public txt_ExchangeCount: fgui.GTextField;
  public txt_ReqMaterials: fgui.GTextField;
  public txt_ExchangeRet: fgui.GTextField;
  public txt_num: fgui.GTextInput;
  public Btn_Confirm: fgui.GButton;
  public btn_min: fgui.GButton;
  public btn_max: fgui.GButton;
  public btn_reduce: fgui.GButton;
  public btn_plus: fgui.GButton;
  public progressSlider: fgui.GSlider;
  public exchangeList1: fgui.GList;
  public exchangeList2: fgui.GList;

  private baglistAry: Array<any>; //所需材料
  private rewardsAry: Array<any>; //兑换物品

  private _maxNumber: number = 0;
  private _min: number = 0;

  private _canExchangeNumber: number = 0; //可兑换数量

  private _exchangeNumber: number = 0; //当前输入兑换次数

  private _exchangeData: ExchangeData; //兑换数据

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "yishi.view.frame.NumBuyFrame.title"
    );
    this.addEvent();
    this.initData();
  }

  private addEvent() {
    this.exchangeList1.setVirtual();
    this.exchangeList2.setVirtual();
    this.Btn_Confirm.onClick(this, this.__onOKHandler.bind(this));
    this.txt_num.on(Laya.Event.BLUR, this, this.__buyNumChange);
    this.btn_min.onClick(this, this.minBtnHandler.bind(this));
    this.btn_max.onClick(this, this.maxBtnHandler.bind(this));
    this.btn_reduce.onClick(this, this.onReduce);
    this.btn_plus.onClick(this, this.onPlus);
    this.progressSlider.on(fairygui.Events.STATE_CHANGED, this, this.onChanged);
    Utils.setDrawCallOptimize(this.exchangeList1);
    Utils.setDrawCallOptimize(this.exchangeList2);
    this.exchangeList1.itemRenderer = Laya.Handler.create(
      this,
      this.renderGoodsListItem1,
      null,
      false
    );
    this.exchangeList2.itemRenderer = Laya.Handler.create(
      this,
      this.renderGoodsListItem2,
      null,
      false
    );
    this.exchangeList1.itemProvider = Laya.Handler.create(
      this,
      this.getListItemResource1,
      null,
      false
    );
    this.exchangeList2.itemProvider = Laya.Handler.create(
      this,
      this.getListItemResource2,
      null,
      false
    );
  }

  private removeEvent() {
    this.Btn_Confirm.offClick(this, this.__onOKHandler.bind(this));
    this.txt_num.off(Laya.Event.BLUR, this, this.__buyNumChange);
    this.btn_min.offClick(this, this.minBtnHandler.bind(this));
    this.btn_max.offClick(this, this.maxBtnHandler.bind(this));
    this.btn_reduce.offClick(this, this.onReduce);
    this.btn_plus.offClick(this, this.onPlus);
    this.progressSlider.off(
      fairygui.Events.STATE_CHANGED,
      this,
      this.onChanged
    );
  }

  private initData() {
    let exchangeData = this.params.data;
    if (!exchangeData) {
      exchangeData = new ExchangeData();
    }
    this._exchangeData = exchangeData;
    this._exchangeNumber = 1; //默认一次
    this.txt_num.text = this._exchangeNumber.toString(); //
    this.btn_reduce.enabled = this.btn_min.enabled = false;
    this._canExchangeNumber = this._exchangeData.maxExchangeCount; //最大可兑换次数
    this._maxNumber =
      this._canExchangeNumber > 0 ? this._canExchangeNumber : 999; //最大限制兑换次数
    if (this._maxNumber == 1) {
      this.btn_plus.enabled = this.btn_max.enabled = false;
    }
    this.baglistAry = this._exchangeData.requireInfos;
    this.rewardsAry = this._exchangeData.rewardsInfo;
    this.exchangeList1.numItems = this.baglistAry.length;
    this.exchangeList2.numItems = this.rewardsAry.length;
    this.setProgressSliderValue();
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  //不同渲染聊天单元格
  private getListItemResource1(index: number) {
    let data: any = this.baglistAry[index];
    //系统信息
    if (data instanceof StarInfo) {
      return StarItem.URL; //星运
    } else {
      return BaseItem.URL; //物品
    }
  }

  //不同渲染聊天单元格
  private getListItemResource2(index: number) {
    let data: any = this.rewardsAry[index];
    //系统信息
    if (data instanceof StarInfo) {
      return StarItem.URL; //星运
    } else {
      return BaseItem.URL; //物品
    }
  }

  /**兑换材料 */
  renderGoodsListItem1(index: number, item: BaseItem) {
    let infoData = this.baglistAry[index];
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
        HomeWnd.STEP
      ).toString();
    } else {
      ownCount = FunnyHelper.getBagCount(infoData.templateId);
      countVlaue = ownCount.toString();
    }
    let timesCount = this._exchangeNumber * count;
    item.text =
      "[color=" +
      this.getLackColor(ownCount >= timesCount) +
      "]" +
      countVlaue +
      "[/color]/" +
      timesCount;
    item.isConsume.selectedIndex = 1;
  }

  /**兑换奖励 */
  renderGoodsListItem2(index: number, item: BaseItem) {
    let rewardData = this.rewardsAry[index];
    item.info = rewardData;
    item.text = (rewardData.count * this._exchangeNumber).toString();
  }

  /**数量不够展示红色 */
  getLackColor(isFixed: boolean): string {
    if (isFixed) {
      return ColorConstant.WHITE_COLOR;
    } else {
      return ColorConstant.RED_COLOR;
    }
  }

  private onChanged() {
    if (this._maxNumber == 1) {
      this.txt_num.text = "1";
      this.btn_min.enabled = false;
      this.btn_max.enabled = false;
      this.btn_reduce.enabled = false;
      this.btn_plus.enabled = false;
    } else {
      this.updateBtnState();
    }
    this._exchangeNumber = Number(this.txt_num.text);
    this.exchangeList1.numItems = this.baglistAry.length;
    this.exchangeList2.numItems = this.rewardsAry.length;
  }

  updateBtnState() {
    let value: number = this.progressSlider.value;
    let num: number = parseInt(((value * this._maxNumber) / 100).toString());
    if (this._exchangeNumber <= 1) {
      this.txt_num.text = "1";
      this.btn_min.enabled = this.btn_reduce.enabled = false;
      this.btn_max.enabled = this.btn_plus.enabled = true;
    } else if (this._exchangeNumber == this._maxNumber) {
      this.txt_num.text = this._maxNumber.toString();
      this.btn_min.enabled = this.btn_reduce.enabled = true;
      this.btn_max.enabled = this.btn_plus.enabled = false;
    } else {
      this.txt_num.text = this._exchangeNumber.toString();
      this.btn_min.enabled = this.btn_plus.enabled = true;
      this.btn_max.enabled = this.btn_reduce.enabled = true;
    }
  }

  private onReduce() {
    this._exchangeNumber--;
    if (this._exchangeNumber <= 1) {
      this._exchangeNumber = 1;
      this.btn_reduce.enabled = this.btn_min.enabled = false;
    }
    this.progressSlider.value =
      this._exchangeNumber == 1
        ? 0
        : (this._exchangeNumber / this._maxNumber) * 100;

    this.btn_plus.enabled = this.btn_max.enabled = true;
    this.txt_num.text = this._exchangeNumber.toString();
    this.exchangeList1.numItems = this.baglistAry.length;
    this.exchangeList2.numItems = this.rewardsAry.length;
  }

  private onPlus() {
    this._exchangeNumber++;
    this.progressSlider.value = (this._exchangeNumber / this._maxNumber) * 100;
    if (this._exchangeNumber >= this._maxNumber) {
      this._exchangeNumber = this._maxNumber;
      this.btn_plus.enabled = this.btn_max.enabled = false;
    }
    this.btn_reduce.enabled = this.btn_min.enabled = true;
    this.txt_num.text = this._exchangeNumber.toString();
    this.exchangeList1.numItems = this.baglistAry.length;
    this.exchangeList2.numItems = this.rewardsAry.length;
  }

  private minBtnHandler() {
    this.txt_num.text = "1";
    this.progressSlider.value = 0;
    this.btn_min.enabled = this.btn_reduce.enabled = false;
    this.btn_max.enabled = this.btn_plus.enabled = true;
    this._exchangeNumber = parseInt(this.txt_num.text);
    this.exchangeList1.numItems = this.baglistAry.length;
    this.exchangeList2.numItems = this.rewardsAry.length;
  }

  private maxBtnHandler() {
    this.txt_num.text = this._maxNumber.toString();
    this.progressSlider.value = 100;
    this.btn_min.enabled = this.btn_reduce.enabled = true;
    this.btn_max.enabled = this.btn_plus.enabled = false;
    this._exchangeNumber = parseInt(this.txt_num.text);
    this.exchangeList1.numItems = this.baglistAry.length;
    this.exchangeList2.numItems = this.rewardsAry.length;
  }

  private __buyNumChange(event: Laya.Event) {
    if (this.txt_num.text == "0") this.txt_num.text = "1";
    this._exchangeNumber = parseInt(this.txt_num.text);
    if (isNaN(this._exchangeNumber)) {
      this._exchangeNumber = 1;
    }
    if (this._exchangeNumber >= this._canExchangeNumber) {
      this._exchangeNumber = this._canExchangeNumber;
    }
    this.txt_num.text = this._exchangeNumber.toString();
    this.setProgressSliderValue();
    this.exchangeList1.numItems = this.baglistAry.length;
    this.exchangeList2.numItems = this.rewardsAry.length;

    this.updateBtnState();
  }

  private setProgressSliderValue() {
    this.progressSlider.value =
      this._exchangeNumber == 1
        ? 0
        : Number((100 * this._exchangeNumber) / this._maxNumber);
  }

  private __onOKHandler() {
    if (this._exchangeNumber > this._canExchangeNumber) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "funny.datas.ExchangeWnd.exchangeOver"
        )
      );
      return;
    }
    if (this._exchangeNumber <= 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "funny.datas.ExchangeWnd.exchangeNone"
        )
      );
      return;
    }
    FunnyManager.Instance.sendGetBag(
      2,
      this._exchangeData.exchangeId,
      this._exchangeNumber
    );
    this.OnBtnClose();
  }

  OnShowWind() {
    super.OnShowWind();
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }
}
