// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-11-26 10:34:34
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-26 11:58:15
 * @Description: 
 */

import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { BaseItem } from "../../component/item/BaseItem";
import { NumericStepper } from "../../component/NumericStepper";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ShopGoodsInfo } from '../shop/model/ShopGoodsInfo';


export class QuantitySelector extends BaseWindow {
    private txtContent: fgui.GLabel;
    private stepper: NumericStepper;
    private item: BaseItem;
    private _info: any;
    private _callBack: any;

    private contentStr: string = "";
    private goodsPrice: number = 0;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initView();
    }

    public OnHideWind() {
        super.OnHideWind();
    }

    private initView() {
        let count = 1
        let maxCount = 1
        let frameData = this.params
        if (frameData) {
            if (frameData.content) {
                this.contentStr = frameData.content;
            }
            if (frameData.count && frameData.count > 0) {
                count = frameData.count;
            }
            if (frameData.maxCount && frameData.maxCount > 0) {
                maxCount = frameData.maxCount;
            }
            if (frameData.price && frameData.price > 0) {
                this.goodsPrice = frameData.price;
            }
            if (frameData.callBack) {
                this._callBack = frameData.callBack
            }
            if (frameData.info) {
                this._info = frameData.info
                if (frameData.info instanceof GoodsInfo) {
                    this.item.info = frameData.info
                } else if (frameData.info instanceof ShopGoodsInfo) {
                    let gInfo = new GoodsInfo()
                    gInfo.templateId = frameData.info.templateId
                    this.item.info = gInfo
                }
                if (!frameData.showNum) {
                    this.item.text = ""
                }
            }
        }

        this.stepper.show(0, count, 1, maxCount, 999, 1, Laya.Handler.create(this, this.stepperChangeHandler, null, false));
        this.stepperChangeHandler(count);
    }

    private stepperChangeHandler(value: number) {
        let countPrice = value * this.goodsPrice;
        this.txtContent.text = LangManager.Instance.GetTranslation(this.contentStr, countPrice);
        
        let frameData = this.params
        if (frameData && this._info) {
            if (frameData.showNum) {
                if (this._info instanceof GoodsInfo) {
                    this.item.info = this._info
                    this.item.text = this._info.count * value + ""
                }
            }
        }
    }

    private btnCancelClick() {
        this._callBack && this._callBack(false, this.stepper.value, this._info)
        this.hide()
    }

    private btnConfirmClick() {
        this._callBack && this._callBack(true, this.stepper.value, this._info)
        this.hide()
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}