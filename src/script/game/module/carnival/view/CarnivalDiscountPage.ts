// @ts-nocheck
import FUI_CarnivalDiscountPage from "../../../../../fui/Carnival/FUI_CarnivalDiscountPage";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import Dictionary from "../../../../core/utils/Dictionary";
import { t_s_carnivalpointexchangeData } from "../../../config/t_s_carnivalpointexchange";
import CarnivalManager from "../../../manager/CarnivalManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import CarnivalModel, { CARNIVAL_THEME } from "../model/CarnivalModel";
import { CarnivalBasePage } from "./CarnivalBasePage";
import CarnivalDiscountPageItem from "./CarnivalDiscountPageItem";

/**
 * 嘉年华--特惠礼包
 */
export default class CarnivalDiscountPage extends FUI_CarnivalDiscountPage implements CarnivalBasePage {

    private _tempList: Array<t_s_carnivalpointexchangeData> = [];
    private dicLimit: Dictionary;

    protected onConstruct() {
        super.onConstruct();
        let themeType = this.model.themeType;
        if (themeType == CARNIVAL_THEME.SUMMER) {
            this.isSummer.selectedIndex = 1;
        } else {
            this.isSummer.selectedIndex = 0;
        }
        this.addEvent()
    }

    addEvent() {

    }

    offEvent() {

    }

    private initData() {
        let limitArr: Array<string>;
        this.dicLimit = new Dictionary();
        this.carnival_recharge.type.selectedIndex = 2;
        this.carnival_reset.type.selectedIndex = 1;
        this.carnival_recharge.txt_title.text = LangManager.Instance.GetTranslation("carnival.today");
        this.carnival_reset.txt_title.text = LangManager.Instance.GetTranslation("carnival.today.reset");
        this.carnival_recharge.ensureSizeCorrect();
        this.carnival_reset.ensureSizeCorrect();
        let limitInfo = TempleteManager.Instance.getConfigInfoByConfigName("carnival_buy_gift_limit");
        if (limitInfo != null) {
            limitArr = limitInfo.ConfigValue.split("|");
            let temArr: Array<string>;
            for (const key in limitArr) {
                if (Object.prototype.hasOwnProperty.call(limitArr, key)) {
                    let str: string = limitArr[key];
                    temArr = str.split(",");
                    this.dicLimit[temArr[0]] = parseInt(temArr[1]);
                }
            }
        }
        this._tempList = TempleteManager.Instance.getCarnivalByType(CarnivalModel.TYPE_DAYGIFT);
        var len: number = this._tempList ? this._tempList.length : 0;
        var tInfo: t_s_carnivalpointexchangeData;
        var item: CarnivalDiscountPageItem;
        for (var i: number = 0; i < len; i++) {
            tInfo = this._tempList[i];
            item = this.getItem(i);
            if (item) {
                item.index = i;
                item.dicLimit = this.dicLimit;
                item.info = tInfo;
            }
        }
        this.refreshView();
    }

    private refreshView() {
        var currPoint: number = this.model.dayCharge;
        this.carnival_recharge.txt_value.text = " " + currPoint.toString();
        var item: CarnivalDiscountPageItem;
        var len: number = this._tempList.length;
        for (var i: number = 0; i < len; i++) {
            item = this.getItem(i);
            if (item)
                item.refreshView();
        }
    }

    private getItem(index: number): CarnivalDiscountPageItem {
        return this["item_" + index];
    }

    protected get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

    onShow() {
        Logger.info("CarnivalDiscountPage:onShow");
        this.initData();
    }

    onHide() {
        Logger.info("CarnivalDiscountPage:onHide");
    }

    onDestroy() {
        Logger.info("CarnivalDiscountPage:onDestroy");
        this.offEvent();
        if (this._tempList) {
            var item: CarnivalDiscountPageItem;
            var len: number = this._tempList.length;
            for (var i: number = 0; i < len; i++) {
                item = this["item_" + i];
                if (item) {
                    item.dispose();
                    item = null;
                }
            }
        }
        this._tempList = null;
    }

    onUpdate(data: any) {
        Logger.info("CarnivalAwardPointPage:onUpdate-", data);
        this.refreshView();
    }

}