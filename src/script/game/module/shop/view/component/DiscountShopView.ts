//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2022-12-08 16:48:56
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-10-11 20:30:08
 * @Description: 欢乐折扣
 */
import FUI_DiscountShopView from "../../../../../../fui/Shop/FUI_DiscountShopView";
import ShopDiscountScoreItem from "./ShopDiscountScoreItem";
import ShopDiscountGoodItem from "./ShopDiscountGoodItem";
import LangManager from "../../../../../core/lang/LangManager";
import { ShopEvent } from "../../../../constant/event/NotificationEvent";
import { DiscountShopManager } from "../../control/DiscountShopManager";
import { DiscountShopModel } from "../../model/DiscountShopModel";
import { NotificationManager } from "../../../../manager/NotificationManager";
import Logger from "../../../../../core/logger/Logger";
import { isOversea } from "../../../login/manager/SiteZoneCtrl";
import UIButton from "../../../../../core/ui/UIButton";
import { isCNLanguage } from "../../../../../core/lang/LanguageDefine";

export default class DiscountShopView extends FUI_DiscountShopView {
  private _isClickRandom: boolean = false;
  private _refreshGoodImmediately: boolean = false;

  public init() {
    this.initData();
    this.initView();
    this.addEvent();
    DiscountShopManager.Instance.operationDiscountShop(1);
  }

  private initData() {}

  private initView() {
    this.setOverSeaCountByDiscount(0);
    this.cIsOverSea.selectedIndex = isCNLanguage() ? 0 : 1;
    this.goodList.setVirtual();
    this.goodList.itemRenderer = Laya.Handler.create(
      this,
      this.renderGoodListItem,
      null,
      false,
    );
  }

  private addEvent() {
    this.btnRandom.onClick(this, this.btnRandomClick);
    NotificationManager.Instance.addEventListener(
      ShopEvent.DISCOUNTSHOP_UPDATE,
      this.refreshView,
      this,
    );
  }

  private removeEvent() {
    Laya.timer.clear(this, this.__timerRefreshGoodList);
    this.btnRandom.offClick(this, this.btnRandomClick);
    NotificationManager.Instance.removeEventListener(
      ShopEvent.DISCOUNTSHOP_UPDATE,
      this.refreshView,
      this,
    );
  }

  private refreshGoodList() {
    this.goodList.numItems = this.discountModel.discountShopGoodInfoList.length;
  }

  private refreshScoreList() {
    for (let index = 0; index < 5; index++) {
      const info = this.discountModel.discountShopScoreInfoList[index];
      if (info) {
        this["imgScoreLine" + index].visible =
          this.discountModel.myScore >= info.score;
        let socreItem = this["scoreItem" + index] as ShopDiscountScoreItem;
        socreItem.info = info;
        socreItem.index = index;
      }
    }
  }

  public resetUI() {
    this.refreshView();
    this.refreshGoodList();
  }

  private refreshView() {
    let beginTime = this.discountModel.beginTime.slice(0, 10);
    let endTime = this.discountModel.endTime.slice(0, 10);
    this.txt_time.text = LangManager.Instance.GetTranslation(
      "public.zhi",
      beginTime + " ",
      " " + endTime,
    );

    let myDiscount = this.discountModel.myDiscount;
    this.txt_myScore.text = this.discountModel.myScore.toString();
    this.btnRandom.visible = myDiscount <= 0;
    this.txt_resetTip.visible = myDiscount > 0;
    UIButton.setRedDot(this.btnRandom, myDiscount <= 0 ? 1 : 0, 1);
    UIButton.setRedDotPos(this.btnRandom, 204, 4, true);

    this.txtMyDiscount.visible = true;
    this.txtMyDiscount.getController("cNum").selectedIndex = 0;
    this.mcMyDiscount.visible = false;
    this.mcMyDiscount.getChild("gNum").asCom.y = -2269;
    this._refreshGoodImmediately = true;

    if (myDiscount > 0) {
      Logger.info("我的折扣", myDiscount);

      // mark 暂时直接出折扣
      if (!isCNLanguage()) {
        this.setOverSeaCountByDiscount(myDiscount);
      } else {
        // 动画后显示 折扣
        if (this._isClickRandom) {
          this._isClickRandom = false;
          this.mcMyDiscount.visible = true;
          this.txtMyDiscount.visible = false;
          let tMyDiscount = this.mcMyDiscount.getTransition(
            "tRoll" + myDiscount,
          );
          if (tMyDiscount) {
            this._refreshGoodImmediately = false;
            tMyDiscount.play(
              Laya.Handler.create(this, this.__myDiscountMCComplete),
              1,
            );
          } else {
            Logger.info("抽取折扣动画不存在");
          }
        } else {
          this.txtMyDiscount.getController("cNum").selectedIndex = myDiscount;
        }
      }
    }

    if (this._refreshGoodImmediately) {
      this.refreshGoodList();
    }
    this.refreshScoreList();
  }

  private setOverSeaCountByDiscount(myDiscount: number) {
    if (isCNLanguage()) return;

    let str = "?% OFF";
    if (myDiscount > 0) {
      str = (10 - myDiscount) * 10 + "% OFF";
    }

    this.txt_myDiscountDescOverSea.getChild("txt_myDiscountDesc21").text = str;
    this.txt_myDiscountDescOverSea.getChild("txt_myDiscountDesc2").text = str;
  }

  private __myDiscountMCComplete() {
    if (!this._refreshGoodImmediately) {
      Laya.timer.once(250, this, this.__timerRefreshGoodList);
    }
  }

  private __timerRefreshGoodList() {
    if (this.isDisposed) return;
    this.refreshGoodList();
  }

  private renderGoodListItem(index: number, item: ShopDiscountGoodItem) {
    item.info = this.discountModel.discountShopGoodInfoList[index];
  }

  private btnRandomClick() {
    this._isClickRandom = true;
    DiscountShopManager.Instance.operationDiscountShop(2);
  }

  public get discountModel(): DiscountShopModel {
    return DiscountShopManager.Instance.model;
  }

  public dispose(destroy = true) {
    this.removeEvent();
    destroy && super.dispose();
  }
}
