// @ts-nocheck
import FUI_PassRewardItem from "../../../../../../fui/Welfare/FUI_PassRewardItem";
import WelfareBinder from "../../../../../../fui/Welfare/WelfareBinder";
import LangManager from "../../../../../core/lang/LangManager";
import { BaseItem } from "../../../../component/item/BaseItem";
import { t_s_passcheckData } from "../../../../config/t_s_passcheck";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { ToolTipsManager } from "../../../../manager/ToolTipsManager";
import { WelfareManager } from "../../WelfareManager";

/**
* @author:zhihua.zhou
* @data: 2022-05-30
* @description 勇士犒赏令的奖励列表ITEM
*/
export default class PassRewardItem extends FUI_PassRewardItem {

    public static DEFAULT: number = 1;//还未到条件领取
    public static OPEN: number = 2;//可领取
    public static CLOSE: number = 3;//已领取
    private _baseState: number = 1;
    private _advanceState: number = 1;
    cfgdata: t_s_passcheckData;

    onConstruct() {
        super.onConstruct();

        this.item0.onClick(this, this.onBoxClick, [0]);
        this.item1.onClick(this, this.onBoxClick, [1]);
        this.item2.onClick(this, this.onBoxClick, [2]);
    }

    onBoxClick(idx) {
        if (idx == 0) {
            if (this._baseState == PassRewardItem.OPEN) {
                WelfareManager.Instance.reqPassRewardInfo(2, 1, this.cfgdata.Grade);
            }
        } else {
            if (this._advanceState == PassRewardItem.OPEN) {
                WelfareManager.Instance.reqPassRewardInfo(2, 2, this.cfgdata.Grade);
            }
        }
    }

    setData(cfgdata: t_s_passcheckData) {
        //等级
        this.cfgdata = cfgdata;
        this.txt_level.text = LangManager.Instance.GetTranslation('public.level2', cfgdata.Grade);
        //基础奖励
        let arr = cfgdata.FreeReward.split(',');
        this.createIcon(arr, this.item0 as BaseItem);
        //进阶奖励
        this.visibleIcon();
        let payArr = cfgdata.PayReward.split('|');
        for (let i = 0; i < payArr.length; i++) {
            const element = payArr[i];
            let arr1 = element.split(',');
            this.createIcon(arr1, this['item' + (i + 1)] as BaseItem);
            this['group' + (i + 1)].visible = true;
        }
    }

    private visibleIcon() {
        let count = 2;
        for (let i = 0; i < count; i++) {
            this['group' + (i + 1)].visible = false;
        }
    }

    private createIcon(arr, item: BaseItem) {
        let goods: GoodsInfo = new GoodsInfo();
        goods.templateId = parseInt(arr[0]);
        goods.count = parseInt(arr[1]);
        item.info = goods;
    }

    /**
     * 基础奖励领取状态
     */
    public set baseState(value: number) {
        this._baseState = value;
        switch (value) {
            case PassRewardItem.DEFAULT:
                this.img_red0.visible = false;
                this.img_claim0.visible = false;
                this.img_lock0.visible = true;
                break;
            case PassRewardItem.OPEN:
                this.img_red0.visible = true;
                this.img_claim0.visible = false;
                this.img_lock0.visible = false;
                ToolTipsManager.Instance.unRegister(this.item0);
                break;
            case PassRewardItem.CLOSE:
                this.img_red0.visible = false;
                this.img_claim0.visible = true;
                this.img_lock0.visible = false;
                ToolTipsManager.Instance.register(this.item0);

                break;
        }
    }

    /**
     * 进阶奖励领取状态
     */
    public set advanceState(value: number) {
        this._advanceState = value;
        switch (value) {
            case PassRewardItem.DEFAULT:
                this.img_lock1.visible = this.img_lock2.visible = true;
                this.img_claim1.visible = this.img_claim2.visible = false;
                this.img_red1.visible = this.img_red2.visible = false;
                break;
            case PassRewardItem.OPEN:
                this.img_lock1.visible = this.img_lock2.visible = false;
                this.img_claim1.visible = this.img_claim2.visible = false;
                this.img_red1.visible = this.img_red2.visible = true;
                ToolTipsManager.Instance.unRegister(this.item1);
                ToolTipsManager.Instance.unRegister(this.item2);
                break;
            case PassRewardItem.CLOSE:
                this.img_lock1.visible = this.img_lock2.visible = false;
                this.img_claim1.visible = this.img_claim2.visible = true;
                this.img_red1.visible = this.img_red2.visible = false;
                ToolTipsManager.Instance.register(this.item1);
                ToolTipsManager.Instance.register(this.item2);
                break;
        }
    }

    dispose(): void {
        this.item0.offClick(this, this.onBoxClick);
        this.item1.offClick(this, this.onBoxClick);
        this.item2.offClick(this, this.onBoxClick);
        super.dispose();
    }
}