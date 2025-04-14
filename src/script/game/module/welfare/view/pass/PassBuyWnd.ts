import FUI_CommonFrame3 from "../../../../../../fui/Base/FUI_CommonFrame3";
import LangManager from "../../../../../core/lang/LangManager";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../../core/ui/UIManager";
import Utils from "../../../../../core/utils/Utils";
import { BaseItem } from "../../../../component/item/BaseItem";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { t_s_passcheckData } from "../../../../config/t_s_passcheck";
import { EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import WelfareCtrl from "../../WelfareCtrl";
import WelfareData from "../../WelfareData";
import { WelfareManager } from "../../WelfareManager";

/**
 * 购买等级 : 通行证的购买按照等级收费, 数据表t_s_config新增的【通行证】等级购买价格（按等级收费）, 会配置玩家每升一级通行证所需要消耗的钻石
 */
export default class PassBuyWnd extends BaseWindow {
  btn_buy: fairygui.GButton;
  btn_plus: fairygui.GButton;
  btn_reduce: fairygui.GButton;
  public txt_num: fgui.GTextInput;
  //解锁的奖励物品列表
  list: fairygui.GList;
  //当前等级
  txt_level: fairygui.GTextField;
  //当前等级
  txt_level0: fairygui.GTextField;
  //购买后等级
  txt_level1: fairygui.GTextField;
  txt_price: fairygui.GTextField;
  txt_max: fairygui.GTextField;
  txt0: fairygui.GTextField;
  slider: fairygui.GSlider;
  private listData: Array<GoodsInfo>;
  private grade: number = 0;
  private _step: number = 1;
  private _maxGrade: number = 55;
  private price: number = 0;
  private totalPrice: number = 0;
  private curGrade: number = 0;
  private nextGrade: number = 1;
  c1: fairygui.Controller;
  frame: FUI_CommonFrame3;

  private get ctrlData(): WelfareData {
    return this.control.data;
  }

  private get control(): WelfareCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.listData = [];
    this.addEvent();
    this.c1 = this.getController("c1");
    this.initLanguage();
  }

  private initLanguage() {
    this.frame.getChild("title").text =
      LangManager.Instance.GetTranslation("pass.text01");
    this.txt0.text = LangManager.Instance.GetTranslation("pass.text09");
    this.btn_buy.title = LangManager.Instance.GetTranslation(
      "campaign.TrailShop.BuyBtnTxt",
    );
  }

  addEvent() {
    this.btn_plus.onClick(this, this.__plusHandler);
    this.btn_reduce.onClick(this, this.__reduceHandler);
    this.txt_num.on(Laya.Event.INPUT, this, this.__buyNumChange);
    // this.txt_num.on(Laya.Event.BLUR, this, this.__buyNumBlur);
    this.btn_buy.onClick(this, this.onBuy);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderList,
      null,
      false,
    );
    this.slider.on(fairygui.Events.STATE_CHANGED, this, this.onSlider);
  }

  removeEvent() {
    this.btn_buy.offClick(this, this.onBuy);
    this.btn_plus.offClick(this, this.__plusHandler);
    this.btn_reduce.offClick(this, this.__reduceHandler);
    this.txt_num.off(Laya.Event.INPUT, this, this.__buyNumChange);
    // this.txt_num.off(Laya.Event.BLUR, this, this.__buyNumBlur);
    this.slider.off(fairygui.Events.STATE_CHANGED, this, this.onSlider);
    // this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
  }

  OnShowWind() {
    super.OnShowWind();

    //最高可购买等级: 玩家可购买的通行证最大等级读取数据表t_s_config新增的【通行证】可购买至的最大等级
    let cfgVal = TempleteManager.Instance.getConfigInfoByConfigName(
      "passcheck_max_grade",
    ).ConfigValue;
    if (cfgVal) {
      this._maxGrade = parseInt(cfgVal);
      this.txt_max.text = LangManager.Instance.GetTranslation(
        "pass.buy1",
        cfgVal,
      );
    }

    cfgVal = TempleteManager.Instance.getConfigInfoByConfigName(
      "passcheck_grade_diamond",
    ).ConfigValue;
    if (cfgVal) {
      this.price = parseInt(cfgVal);
      this.txt_price.text = cfgVal;
    }

    this.curGrade = this.ctrlData.passGrade;
    this.txt_level0.text = this.txt_level.text = this.curGrade + "";
    this.nextGrade = this.curGrade + 1;
    this.txt_level1.text = this.nextGrade + "";
    this.txt_num.text = this.nextGrade - this.curGrade + "";
    this.slider.value = this._step;
    this.slider.min = 1;
    this.slider.max = this._maxGrade - this.curGrade;
    this.updateList();
    this.numChangeHandler();
    if (this.curGrade >= this._maxGrade) {
      this.c1.setSelectedIndex(1);
      this.btn_buy.enabled = false;
      this.txt0.text = LangManager.Instance.GetTranslation(
        "buildings.BaseBuildFrame.maxGrade",
      );
    }
  }

  /**
   * 更新不同等级对应的奖励列表
   */
  updateList() {
    this.listData.length = 0;
    //需要判定玩家是否进阶过通行证, 没有进阶的只需展示普通版的奖励
    let isAdvance: boolean = this.ctrlData.passRewardInfo.isPay;
    for (let i = this.curGrade + 1; i <= this.nextGrade; i++) {
      let passData: t_s_passcheckData =
        TempleteManager.Instance.getPassCheckItemByGrade(
          i,
          this.ctrlData.passRewardInfo.passIndex,
        );
      if (!passData) {
        //配置表找不到，默认用0
        passData = TempleteManager.Instance.getPassCheckItemByGrade(i, 0);
      }
      let arr = passData.FreeReward.split(",");
      this.checkSameGoods(parseInt(arr[0]), parseInt(arr[1]), this.listData);
      if (isAdvance) {
        //进阶奖励
        let payArr = passData.PayReward.split("|");
        for (let i = 0; i < payArr.length; i++) {
          const element = payArr[i];
          let arr1 = element.split(",");
          this.checkSameGoods(
            parseInt(arr1[0]),
            parseInt(arr1[1]),
            this.listData,
          );
        }
      }
    }
    this.list.numItems = this.listData.length;
    this.totalPrice = this.price * parseInt(this.txt_num.text);
    this.txt_price.text = this.totalPrice.toString();
  }

  /**
   * 相同的物品堆叠处理
   */
  checkSameGoods(templateId: number, count: number, listData: any) {
    let hasSame: boolean = false;
    listData.forEach((element) => {
      if (element.templateId == templateId) {
        hasSame = true;
        element.count += count;
        return;
      }
    });
    if (!hasSame) {
      let goods: GoodsInfo = new GoodsInfo();
      goods.templateId = templateId;
      goods.count = count;
      listData.push(goods);
    }
  }

  private onSlider(): void {
    let val = Math.ceil(this.slider.value);
    this.nextGrade = this.curGrade + val;
    this.txt_level1.text = this.nextGrade + "";
    this.txt_num.text = val + "";
    Laya.timer.callLater(this, this.numChangeHandler);
  }

  OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }

  onRenderList(index: number, item: BaseItem) {
    if (item) {
      item.info = this.listData[index];
    }
  }

  onBuy() {
    this.grade = this.nextGrade - this.curGrade;
    let content: string = LangManager.Instance.GetTranslation(
      "pass.buy2",
      this.grade,
      this.totalPrice,
    );
    SimpleAlertHelper.Instance.Show(
      null,
      null,
      null,
      content,
      null,
      null,
      this.confirmback.bind(this),
    );
  }

  private confirmback(b: boolean, check: boolean) {
    if (b) {
      if (
        this.totalPrice >
        PlayerManager.Instance.currentPlayerModel.playerInfo.point
      ) {
        RechargeAlertMannager.Instance.show();
      } else {
        WelfareManager.Instance.reqPassBuy(2, this.grade);
        UIManager.Instance.HideWind(EmWindow.PassBuyWnd);
      }
    }
  }

  private __plusHandler() {
    if (this.nextGrade >= this._maxGrade) {
      this.btn_plus.enabled = false;
      return;
    }
    this.nextGrade += this._step;
    this.numChangeHandler();
    this.slider.value = this.nextGrade - this.curGrade;
  }

  private __reduceHandler() {
    if (this.nextGrade <= 1) {
      return;
    }
    this.nextGrade -= this._step;
    this.numChangeHandler();
    this.slider.value = this.nextGrade - this.curGrade;
  }

  protected numChangeHandler() {
    if (this.nextGrade <= this.curGrade + 1) {
      this.btn_reduce.enabled = false;
      if (this.nextGrade >= this._maxGrade) {
        this.btn_plus.enabled = false;
      }
    } else if (this.nextGrade >= this._maxGrade) {
      this.btn_plus.enabled = false;
      this.btn_reduce.enabled = true;
    } else {
      this.btn_reduce.enabled = this.btn_plus.enabled = true;
    }
    this.updateValue();
  }

  updateValue() {
    this.txt_level1.text = this.nextGrade + "";
    this.txt_num.text = this.nextGrade - this.curGrade + "";
    this.updateList();
  }

  private __buyNumChange() {
    let val = parseInt(this.txt_num.text);
    if (!val) {
      this.txt_num.text = "1";
      val = 1;
    }
    this.nextGrade = this.curGrade + val;
    if (this.nextGrade > this._maxGrade) {
      this.nextGrade = this._maxGrade;
      this.txt_num.text = (this.nextGrade - this.curGrade).toString();
    }
    this.txt_level1.text = this.nextGrade + "";
    this.slider.value = val;
    this.numChangeHandler();
  }
}
