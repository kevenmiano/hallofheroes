import FUI_CarnivalDiscountPageItem from "../../../../../fui/Carnival/FUI_CarnivalDiscountPageItem";
import LangManager from "../../../../core/lang/LangManager";
import { getdefaultLangageCfg } from "../../../../core/lang/LanguageDefine";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import Dictionary from "../../../../core/utils/Dictionary";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_carnivalpointexchangeData } from "../../../config/t_s_carnivalpointexchange";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import CarnivalManager from "../../../manager/CarnivalManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { TempleteManager } from "../../../manager/TempleteManager";
import CarnivalModel, { CARNIVAL_FOLDER, CARNIVAL_THEME } from "../model/CarnivalModel";
import CarnivalDisBtn from "./CarnivalDisBtn";

/**
 * 嘉年华--特惠礼包-Item
 */
export default class CarnivalDiscountPageItem extends FUI_CarnivalDiscountPageItem {

    //@ts-ignore
    public btn_receive: CarnivalDisBtn;

    private _btnReceive: UIButton;

    public index: number = 0;
    private _itemList: Array<GoodsInfo> = [];
    private _tempInfo: t_s_carnivalpointexchangeData;
    private _dic: Dictionary;

    protected onConstruct() {
        super.onConstruct();
        this._btnReceive = new UIButton(this.btn_receive);
        let themeType = this.model.themeType;
        if (themeType == CARNIVAL_THEME.SUMMER) {
            this.isSummer.selectedIndex = 1;
        } else {
            this.isSummer.selectedIndex = 0;
        }
        this.addEvent();
    }

    private addEvent() {
        this._btnReceive.onClick(this, this.clickHandler);
        this.goodsList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private removeEvent() {
        this._btnReceive.offClick(this, this.clickHandler);
        Utils.clearGListHandle(this.goodsList);
    }

    renderListItem(index: number, item: BaseItem) {
        if (item && !item.isDisposed) {
            item.info = this._itemList[index];
        }
    }

    public set dicLimit(value) {
        this._dic = value;
    }

    /** */
    public set info(value: t_s_carnivalpointexchangeData) {
        if (!value) return;
        this.Img_Gift_2.url = this.model.getThemeFolderImgPath(CARNIVAL_FOLDER.DISCOUNT, "Img_Gift_2");

        this._tempInfo = value;
        this.giftBagType.selectedIndex = this.index;
        if (this._tempInfo) {
            this._itemList = [];
            this.refreshView();
            this.createGoodItem(this._tempInfo.Item1, this._tempInfo.ItemNum1);
            this.createGoodItem(this._tempInfo.Item2, this._tempInfo.ItemNum2);
            this.createGoodItem(this._tempInfo.Item3, this._tempInfo.ItemNum3);
            this.createGoodItem(this._tempInfo.Item4, this._tempInfo.ItemNum4);
            this.goodsList.numItems = this._itemList.length;
        }
    }

    private clickHandler(e: MouseEvent) {
        if (this._tempInfo) {
            if (this._tempInfo.Price > 0) {
                var points: number = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
                if (this._tempInfo.Price > points) {
                    RechargeAlertMannager.Instance.show();
                } else {
                    let langCfg = getdefaultLangageCfg();
                    var content: string = LangManager.Instance.GetTranslation("carnival.gift.buy", this._tempInfo.Price, Utils.toCNUpper(this._tempInfo.Sort, langCfg.key));
                    UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.sendBuy.bind(this), state: 2 });
                }
            } else {
                this.sendBuy();
            }
        }
    }

    private sendBuy() {
        if (this._tempInfo)
            CarnivalManager.Instance.opRequest(CarnivalManager.OP_BUY_GIFT, this._tempInfo.Id);
    }

    protected get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

    public refreshView() {

        var hasRewardStr: string = this.model.giftBuyInfo;
        var hasRewardList: Array<string> = hasRewardStr.split("|");//【id,num | ...】
        var dicBuy: Dictionary = new Dictionary();
        var temArr: Array<string>;
        for (let key in hasRewardList) {
            if (Object.prototype.hasOwnProperty.call(hasRewardList, key)) {
                let str = hasRewardList[key];
                temArr = str.split(",");
                dicBuy[temArr[0]] = Number(temArr[1]);
            }
        }
        if (this._tempInfo) {
            var findId: string = "" + this._tempInfo.Id;
            var maxNum: number = this._dic[findId];
            var hasByNum: number = 0;
            if (dicBuy[findId]) {
                hasByNum = Number(dicBuy[findId]);
            } else {
                hasByNum = 0;
            }
            var leftNum: number = maxNum - hasByNum;
            if (leftNum < 0) leftNum = 0;
            //刷新次数
            if (this._tempInfo.Target == 0) {
                if (this._tempInfo.Price == 0) {
                    this.txt_title.text = LangManager.Instance.GetTranslation("carnival.gift.free", leftNum, maxNum);
                } else {
                    this.txt_title.text = LangManager.Instance.GetTranslation("carnival.gift.noCondition", leftNum, maxNum);
                }
            } else {
                this.txt_title.text = LangManager.Instance.GetTranslation("carnival.gift.needPoint", this._tempInfo.Target, leftNum, maxNum);
            }

            if (dicBuy[findId] != null && dicBuy[findId] == maxNum) {
                this.awardState.selectedIndex = 1;
            } else {
                this.awardState.selectedIndex = 0;
                this._btnReceive.enabled = false;
                if (this._tempInfo.Target <= this.model.dayCharge) {
                    this._btnReceive.enabled = true;
                    if (this._tempInfo.Target == 0) {
                        if (this._tempInfo.Price == 0) {//免费购买
                            this.btn_receive.showIcon.selectedIndex = 0;
                            this.btn_receive.text = LangManager.Instance.GetTranslation("carnival.discountpageitem.freebuy");//
                        } else {
                            this.btn_receive.showIcon.selectedIndex = 1;
                            this.btn_receive.title = this._tempInfo.Price.toString();
                        }
                    } else {
                        this.btn_receive.showIcon.selectedIndex = 1;
                        this.btn_receive.title = this._tempInfo.Price.toString();
                    }
                } else {
                    this._btnReceive.enabled = false;
                    this.btn_receive.showIcon.selectedIndex = 1;
                    this.btn_receive.title = this._tempInfo.Price.toString();
                }
            }
        }

        this.btn_receive.enabled = CarnivalManager.Instance.isRewardTime&&this._btnReceive.enabled;
        !CarnivalManager.Instance.isRewardTime && (this.btn_receive.title = LangManager.Instance.GetTranslation("carnival.active.timeover"));
    }

    private createGoodItem(itemId: number, itemCount: number) {
        if (itemId == 0) return;
        var g: GoodsInfo = new GoodsInfo();
        g.templateId = itemId;
        g.count = itemCount;
        this._itemList.push(g);
    }
}