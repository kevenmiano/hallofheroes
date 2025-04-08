// @ts-nocheck
import FUI_GrowthFundItem from "../../../../../../fui/Welfare/FUI_GrowthFundItem";
import { BaseItem } from "../../../../component/item/BaseItem";
import GrowthFundItemInfo from "../../data/GrowthFundItemInfo";
import LangManager from '../../../../../core/lang/LangManager';
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import WelfareCtrl from "../../WelfareCtrl";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/6/23 16:03
 * @ver 1.0
 *
 */

export class GrowthFundItem extends FUI_GrowthFundItem {
    private _vInfo: GrowthFundItemInfo;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public set vInfo(vInfo: GrowthFundItemInfo) {
        if (!vInfo) {
            this.clear();
            this.removeEvent();
        }
        else {
            this._vInfo = vInfo;
            this.refreshView();
            this.addEvent();
        }
    }

    private refreshView() {
        let goods: GoodsInfo = new GoodsInfo();
        if (this._vInfo.grade == 0) {
            this.txt_level.text = LangManager.Instance.GetTranslation("growthFundview.item.txt_level");
            goods.count = this._vInfo.bindDiamondCount;
            goods.templateId = -400;
            (this.item as BaseItem).info = goods;
        }
        else {
            this.txt_level.text = LangManager.Instance.GetTranslation("growthFundview.item.txt_level2", this._vInfo.grade);
            goods.count = this._vInfo.bindDiamondCount;
            goods.templateId = -500;
            (this.item as BaseItem).info = goods;
        }
        this.c1.selectedIndex = this._vInfo.packageState - 1 >= 0 ? this._vInfo.packageState - 1 : 0;
        this.btn_receive.enabled = this.c1.selectedIndex == 1;
        let disableColor = "#aaaaaa";
        let enableColor = "#FFF6B9";
        this.btn_receive.titleColor = this.btn_receive.enabled?enableColor:disableColor;
    }

    private addEvent() {
        this.btn_receive.onClick(this, this.receiveHandler);
    }

    private removeEvent() {
        this.btn_receive.offClick(this, this.receiveHandler);
    }

    private receiveHandler() {
        this.control.getRewardFundViewByGrade(this._vInfo.grade);
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    private clear() {
        this.txt_level.text = "";
        (this.item as BaseItem).info = null;
        this.c1.selectedIndex = 0;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}