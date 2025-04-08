// @ts-nocheck
import FUI_ExchangeAnimation from "../../../../../fui/Funny/FUI_ExchangeAnimation";
import FUI_ExchangeItem from "../../../../../fui/Funny/FUI_ExchangeItem";
import LangManager from "../../../../core/lang/LangManager";
import UIButton from "../../../../core/ui/UIButton";
import { EmWindow } from "../../../constant/UIDefine";
import AllManExchangeManager from "../../../manager/AllManExchangeManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import FUIHelper from "../../../utils/FUIHelper";
import AllManExchangeModel from "../model/AllManExchangeModel";
import { FUIPoolMgr } from "../../../../core/res/FUIPoolMgr";
import { GoodsManager } from "../../../manager/GoodsManager";

/**
* 全民兑换大宝箱
*/
export default class ExchangeItem extends FUI_ExchangeItem implements ITipedDisplay {
    public static DEFAULT: number = 1;//还未到条件领取
    public static OPEN: number = 2;//可领取
    public static CLOSE: number = 3;//已领取
    tipType: EmWindow = EmWindow.CommonTips;
    tipData: any = null;
    startPoint: Laya.Point = new Laya.Point(-60, -80);
    showType?: TipsShowType = TipsShowType.onClick;
    canOperate?: boolean;
    tipDirctions?: string;
    tipGapV?: number;
    tipGapH?: number;
    private _mcArr: Array<fgui.GMovieClip> = [];
    private index: number = 0;

    private _btn_exchange: UIButton;
    private _btn_claim: UIButton;
    private _btn_exchange_all: UIButton;
    private get model(): AllManExchangeModel {
        return AllManExchangeManager.Instance.model;
    }

    protected onConstruct() {
        super.onConstruct();
        this.txt_count.text = LangManager.Instance.GetTranslation("allmainexchange.str4", 1, 10);
        // this.txt.text = LangManager.Instance.GetTranslation("allmainexchange.str3");
        this._btn_exchange = new UIButton(this.btn_exchange);
        this._btn_exchange.btnInternal = 200;
        this._btn_claim = new UIButton(this.btn_claim);
        this._btn_claim.btnInternal = 200;
        this._btn_exchange_all = new UIButton(this.btn_exchange_all);
        this._btn_exchange_all.btnInternal = 200;
        this.initEvent();
    }

    private initEvent() {
        this._btn_exchange.onClick(this, this.onClickExchange);
        this._btn_claim.onClick(this, this.onClickGetAward);
        this._btn_exchange_all.onClick(this, this.onClickExchangeAll);
    }

    public update(index: number) {
        this.index = index;
        this.imgbox.getControllerAt(0).selectedIndex = index;
        let hasPoint = Number(this.model.point[index]);
        let needPoint = Number(this.model.changeNeedPoint[index]);
        this.setProgress(hasPoint, needPoint);

        //剩余领奖次数
        let left_count = Number(this.model.boxChangeCount[index]) - Number(this.model.exchangeCount[index]);
        this.txt_count.text = LangManager.Instance.GetTranslation("allmainexchange.str4", left_count, this.model.boxChangeCount[index]);
        if (left_count <= 0) {
            this._btn_exchange.enabled = false;
            this._btn_exchange_all.enabled = false;
        } else {
            this._btn_exchange.enabled = true;
            this._btn_exchange_all.enabled = true;
        }
        this.tipData = this.model.getBigBoxTip(index + 1);
        FUIHelper.setTipData1(this.imgbox, this.tipType, this.tipData, this.startPoint, TipsShowType.onClick, null, 200, 200);
    }

    /**
     * 设置进度 
     * 
     */
    public setProgress(now: number, max: number) {
        var per: number = now / max;
        this.bar.value = per * 100;
        (this.bar.getChild('title').asTextField).text = now + "/" + max;
        if (now >= max) {
            this.c2.selectedIndex = 1;
        } else {
            this.c2.selectedIndex = 0;
        }
    }

    private removeEvent() {
        this._btn_exchange.offClick(this, this.onClickExchange);
        this._btn_claim.offClick(this, this.onClickGetAward);
    }

    protected onClickExchange() {
        ToolTipsManager.Instance.hideTip(this);
        var allRemainCount: number = this.model.allChangeCount - this.model.changeItemCount;
        if (1 > allRemainCount && this.model.allChangeCount != 0) {
            //总兑换次数没了
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("allmainexchange.str7"));
            return;
        }
        if (Number(this.model.boxChangeCount[this.index]) - Number(this.model.exchangeCount[this.index]) <= 0) {
            //领奖次数完了
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("allmainexchange.str9"));
            return;
        }
        if (!this.checkCount()) {//所需物品不足
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("allmainexchange.str21"));
            return;
        }
        this.playMc();
        AllManExchangeManager.Instance.sendExchangePoint(this.index, 1);
    }

    private onClickExchangeAll(){
        ToolTipsManager.Instance.hideTip(this);
        var allRemainCount: number = this.model.allChangeCount - this.model.changeItemCount;
        if (1 > allRemainCount && this.model.allChangeCount != 0) {
            //总兑换次数没了
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("allmainexchange.str7"));
            return;
        }
        if (Number(this.model.boxChangeCount[this.index]) - Number(this.model.exchangeCount[this.index]) <= 0) {
            //领奖次数完了
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("allmainexchange.str9"));
            return;
        }
        if (!this.checkEnoughCount()) {//所需物品不足
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("allmainexchange.str21"));
            return;
        }
        this.playMc();
        AllManExchangeManager.Instance.sendExchangePoint(this.index, 10);
    }

    private checkEnoughCount():boolean{
        let flag: boolean;
        let tempId: number = this.allManExchangeModel.changeItem;
        let count = GoodsManager.Instance.getGoodsNumByTempId(tempId);
        if (count >= 10) {
            flag = true;
        }
        return flag;
    }

    private checkCount(): boolean {
        let flag: boolean;
        let tempId: number = this.allManExchangeModel.changeItem;
        let count = GoodsManager.Instance.getGoodsNumByTempId(tempId);
        if (count >= 1) {
            flag = true;
        }
        return flag;
    }

    private exchangeComMap: fgui.GComponent[] = new Array();
    private playMc() {
        let _exchangeCom = FUIPoolMgr.Instance.getObject(FUI_ExchangeAnimation.URL);
        if (_exchangeCom) {
            this.exchangeComMap.push(_exchangeCom)
            this.addChild(_exchangeCom);
            let _exchangeMc = _exchangeCom.getChild("mc");
            _exchangeCom.x = 8;
            _exchangeCom.y = 30;
            _exchangeMc.playing = true;
            _exchangeMc.setPlaySettings(0, -1, 1, -1, Laya.Handler.create(this, () => {
                _exchangeMc.playing = false;
                (_exchangeCom as fgui.GComponent).removeFromParent();
                FUIPoolMgr.Instance.returnObject(_exchangeCom, FUI_ExchangeAnimation.URL);
            }));
        }
    }

    protected onClickGetAward() {
        if (Number(this.model.boxChangeCount[this.index]) - Number(this.model.exchangeCount[this.index]) <= 0) {
            //领奖次数完了
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("allmainexchange.str6"));
            return;
        }
        AllManExchangeManager.Instance.sendGetAward(1, this.index);
    }

    private get allManExchangeModel(): AllManExchangeModel {
        return AllManExchangeManager.Instance.model;
    }

    dispose() {
        this.removeEvent();
        FUIPoolMgr.Instance.clearPool(FUI_ExchangeAnimation.URL);
        super.dispose();
    }
}