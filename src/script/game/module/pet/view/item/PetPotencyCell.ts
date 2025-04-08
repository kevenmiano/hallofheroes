// @ts-nocheck
import FUI_PetPotencyCell from "../../../../../../fui/Pet/FUI_PetPotencyCell";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import Utils from "../../../../../core/utils/Utils";
import { EmWindow } from "../../../../constant/UIDefine";
import { BagEvent } from "../../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { ToolTipsManager } from "../../../../manager/ToolTipsManager";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import { isOversea } from "../../../login/manager/SiteZoneCtrl";

export default class PetPotencyCell extends FUI_PetPotencyCell {
    private _goodsTemplate: number = 0;
    private _goodsInfo: GoodsInfo;
    tipData: any;
    tipType: EmWindow;
    alphaTest: boolean = true;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    protected onConstruct() {
        super.onConstruct();
        Utils.setDrawCallOptimize(this);
        this._goodsInfo = new GoodsInfo();
        this.addEvent();
    }

    private addEvent() {
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__updateNumberHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__updateNumberHandler, this);
    }

    private removeEvent() {
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__updateNumberHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__updateNumberHandler, this);
    }

    private __updateNumberHandler() {
        this._goodsInfo.count = GoodsManager.Instance.getGoodsNumByTempId(this._goodsInfo.templateId);
        if (this._goodsInfo.count > 0) {
            this.countTxt.text = this.getCountStr(this._goodsInfo);
            UIFilter.normal(this);
        }
        else {
            this.countTxt.text = "0";
            UIFilter.gray(this);
            ToolTipsManager.Instance.register(this);
            this.tipType = EmWindow.PropTips;
            this.tipData = this._goodsInfo;
        }
    }

    public set status(value: number) {
        this.c1.selectedIndex = value;
    }

    public get info(): number {
        return this._goodsTemplate;
    }

    public set info(value: number) {
        this._goodsTemplate = value;
        if (value) {
            this._goodsInfo.templateId = this._goodsTemplate;
            this.goodsIcon.icon = IconFactory.getGoodsIconByTID(this._goodsTemplate);
            this.__updateNumberHandler();
        }
    }

    private getCountStr(value: GoodsInfo): string {
        if (!value || !value.templateInfo || value.templateInfo.MaxCount <= 1 || value.count <= 0) {
            return "";
        }
        if (isOversea()) {
            //北美钻石跟绑钻显示具体数量
            if (value.templateId == -400 || value.templateId == -500) {
                return value.count.toString();
            }
            let num: number = value.count / 1000;
            if (value.count % 1000 == 0) {
                if (num >= 1) {
                    return Number(num) + "K"
                }
            } else if (num >= 1 && num < 10) {
                return num.toFixed(1) + "K";
            } else if (num > 10) {
                return Number(num) + "K";
            } else {
                return value.count.toString();
            }
        } else {
            let num: number = value.count / 10000;
            if (value.count % 10000 == 0) {
                if (num >= 1) {
                    return Number(num) + "W"
                }
            } else if (num >= 1 && num < 10) {
                return num.toFixed(1) + "W";
            } else if (num > 10) {
                if (num / 10 == 0) {//整数直接取整
                    return num.toString() + "W";
                }
                return num.toFixed(1) + "W";//小数保留一位小数
            }
            return value.count.toString();
        }
    }


    public dispose() {
        ToolTipsManager.Instance.unRegister(this);
        this.removeEvent();
        super.dispose();
    }
}

