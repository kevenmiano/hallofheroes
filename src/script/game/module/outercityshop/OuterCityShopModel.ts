// @ts-nocheck
import ConfigMgr from "../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { ArrayConstant, ArrayUtils } from '../../../core/utils/ArrayUtils';
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { t_s_outcityshopData } from '../../config/t_s_outcityshop';
import { OuterCityShopEvent } from "../../constant/event/NotificationEvent";
import GoodsSonType from "../../constant/GoodsSonType";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import ConfigInfosTempInfo from "../../datas/ConfigInfosTempInfo";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { RuneInfo } from "../../datas/RuneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import FUIHelper from "../../utils/FUIHelper";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { OuterCityShopItemInfo } from "./data/OuterCityShopItemInfo";

/**
 *外城商店的数据模型 
 * @author zhongyi.bao
 * 
 */
export class OuterCityShopModel extends GameEventDispatcher {
    /**
     *付费刷新物品需要支付钻石 
     */
    private tempNeedPay: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("MapShopPoint");
    public refreshNeedPoint: number = (this.tempNeedPay ? parseInt(this.tempNeedPay.ConfigValue) : 10);
    /**
     *付费刷新物品需要支付战魂 
     */
    private tempNeedStrategy: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("MapShopStrategy");
    public refreshNeedStrategy: number = (this.tempNeedStrategy ? parseInt(this.tempNeedStrategy.ConfigValue) : 20000);
    /**
     *付费刷新物品需要支付最大的战魂 
     */
    private tempNeedStrategyMax: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("MapShopStrategyMax");
    public refreshNeedStrategyMax: number = (this.tempNeedStrategyMax ? parseInt(this.tempNeedStrategyMax.ConfigValue) : 1280000);

    /**
     *最大幸运值
     */
    public static MAX_BLESS_NUM: number = 10;
    /**
     *最大幸运值(星星)的个数
     */
    public static MAX_LUCKY_NUM: number = 5;
    /**
     *最大物品列表数量 
     */
    public static MAX_GOODS_NUM: number = 6;
    /**
     *最大精品预览列表数量 
     */
    public static MAX_LOOK_GOODS_NUM: number = 30;
    /**
     *下次刷新时间 
     */
    public fresh_time: Date;
    /**
     *幸运值 
     */
    public bless: number = 0;
    /**
     *战魂刷新的次数 
     */
    public fresh_count: number = 0;
    /**
     * 积分 
     */
    public consumePoints: number = 0;

    public goodsList: Array<OuterCityShopItemInfo>;

    private _payType: number = 1;//默认值为1钻石  2为积分

    private _shopLuckShowInfo: Array<any>;
    /**
         *上次刷新物品列表时间 
         */
    private _lastRefreshTime: Date;
    /**
     *每日已购买次数 
     */
    private _buyCount: number = 0;

    /**
         *每日最大购买次数 
         */
    private _maxBuyCount: number = 0;

    public static EXCHANGE_SHOP: number = 1; //积分兑换
    public static RANDOM_SHOP: number = 2; //随机兑换
    public static PLANES_SHOP: number = 3; //位面战争黑市
    // 周限购
    public weeklyLimitItems: com.road.yishi.proto.mapshop.IMapshopIteminfoMsg[] = [];

    public OuterCityShopModel() {

    }

    public get payType(): number {
        return this._payType;
    }

    public set payType(value: number) {
        this._payType = value;
        this.dispatchEvent(OuterCityShopEvent.PAYTYPE_CHANGE);
    }
    public commit() {
        this.dispatchEvent(OuterCityShopEvent.FRESH_VIEW);
        this.dispatchEvent(OuterCityShopEvent.EXCHANGE_GOODS_LIST_UPDATE);
    }
    /**
     * 还有多久可免费刷新 
     * @return 
     * 
     */
    public get lastFreshTime(): number {
        if (this.fresh_time) {
            return this.fresh_time.getTime() / 1000 - this.playerModel.sysCurTimeBySecond;
        }
        else {
            return 0;
        }
    }
    /**
     *固定兑换列表
     */
    public exchangeGoodsList: Array<any>;

    public _showGoodsList: Array<any>;
    public get showGoodsList(): Array<any> {
        if (!this._showGoodsList) {
            this._showGoodsList = new Array();
        }
        return this._showGoodsList;
    }

    public set showGoodsList(value: Array<any>) {
        this._showGoodsList = value;
        this.dispatchEvent(OuterCityShopEvent.EXCHANGE_GOODS_LIST_UPDATE);
    }
    public currentPageNum: number = OuterCityShopModel.MAX_GOODS_NUM;
    public resetData(curPage: number = 1, pageNum: number = OuterCityShopModel.MAX_GOODS_NUM) {
        this.currentPage = curPage;
        this.currentPageNum = pageNum;
        this.totalPage = Math.ceil(this.exchangeGoodsList.length / this.currentPageNum);
    }

    public updateShowGoodsList() {
        let startIndex: number = (this.currentPage - 1) * this.currentPageNum;
        let endIndex: number = startIndex + this.currentPageNum;
        if (endIndex > this.exchangeGoodsList.length) endIndex = this.exchangeGoodsList.length;
        this.showGoodsList = this.exchangeGoodsList.slice(startIndex, endIndex);
    }

    private _currentPage: number = 1;
    public get currentPage(): number {
        return this._currentPage;
    }

    public set currentPage(value: number) {
        value = value <= 0 ? 1 : value;
        this._currentPage = value;
    }

    private _totalPage: number = 1;
    public get totalPage(): number {
        return this._totalPage;
    }

    public set totalPage(value: number) {
        value = value <= this._currentPage ? this._currentPage : value;
        this._totalPage = value;
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    /**
     * 幸运传递信息 
     */
    public get shopLuckShowInfo(): Array<any> {
        return this._shopLuckShowInfo;
    }

    /**
     * @private
     */
    public set shopLuckShowInfo(value: Array<any>) {
        this._shopLuckShowInfo = value;
        this.dispatchEvent(OuterCityShopEvent.UPDATE_LUCK_SHOW_INFO);
    }
    /**
     *精品预览列表
     */
    public lookGoodsList: Array<any>;

    public _showLookGoodsList: Array<any>;
    public get showLookGoodsList(): Array<any> {
        if (!this._showLookGoodsList) {
            this._showLookGoodsList = new Array();
        }
        return this._showLookGoodsList;
    }

    public set showLookGoodsList(value: Array<any>) {
        this._showLookGoodsList = value;
        this.dispatchEvent(OuterCityShopEvent.LOOK_GOODS_LIST_UPDATE);
    }
    public currentLookPageNum: number = OuterCityShopModel.MAX_LOOK_GOODS_NUM;
    public resetLookData(curPage: number = 1, pageNum: number = OuterCityShopModel.MAX_LOOK_GOODS_NUM) {
        this.currentLookPage = curPage;
        this.currentLookPageNum = pageNum;
        this.totalLookPage = Math.ceil(this.lookGoodsList.length / this.currentLookPageNum);
    }

    public updateShowLookGoodsList() {
        var startIndex: number = (this.currentLookPage - 1) * this.currentLookPageNum;
        var endIndex: number = startIndex + this.currentLookPageNum;
        if (endIndex > this.lookGoodsList.length) endIndex = this.lookGoodsList.length;
        this.showLookGoodsList = this.lookGoodsList.slice(startIndex, endIndex);
    }

    private _currentLookPage: number = 1;
    public get currentLookPage(): number {
        return this._currentLookPage;
    }

    public set currentLookPage(value: number) {
        value = value <= 0 ? 1 : value;
        this._currentLookPage = value;
    }

    private _totalLookPage: number = 1;
    public get totalLookPage(): number {
        return this._totalLookPage;
    }

    public set totalLookPage(value: number) {
        value = value <= this.currentLookPage ? this.currentLookPage : value;
        this._totalLookPage = value;
    }

    public get maxBuyCount(): number {
        return this._maxBuyCount;
    }

    public set maxBuyCount(value: number) {
        this._maxBuyCount = value;
    }

    public get buyCount(): number {
        return this._buyCount;
    }

    public set buyCount(value: number) {
        this._buyCount = value;
    }

    public get lastRefreshTime(): Date {
        return this._lastRefreshTime;
    }

    public set lastRefreshTime(value: Date) {
        this._lastRefreshTime = value;
    }

    initExchangeGoodsData() {
        if (!this.exchangeGoodsList) {
            this.exchangeGoodsList = [];
            //优化标记 数据不是很大, 可以忽略
            var outerCityShopExchangeTemplateDic = ConfigMgr.Instance.outerCityShopExchangeTemplateDic;
            let grades = ArmyManager.Instance.thane.grades;
            for (const key in outerCityShopExchangeTemplateDic) {
                if (Object.prototype.hasOwnProperty.call(outerCityShopExchangeTemplateDic, key)) {
                    let temp: t_s_outcityshopData = outerCityShopExchangeTemplateDic[key] as t_s_outcityshopData;
                    // 神秘商店兑换加上职业限定
                    if (temp.NeedJob == 0 || temp.NeedJob == ArmyManager.Instance.thane.templateInfo.Job) {
                        // if (grades >= temp.MinLevel && grades <= temp.MaxLevel)
                        this.exchangeGoodsList.push(temp);
                    }
                }
            }
            this.exchangeGoodsList = ArrayUtils.sortOn(this.exchangeGoodsList, ["Sort"], [ArrayConstant.NUMERIC]);
        }
        this.dispatchEvent(OuterCityShopEvent.EXCHANGE_GOODS_LIST_UPDATE);
    }

    /**
     * 获取周限购物品的购买次数
     * @param itemId 
     * @returns 
     */
    getWeekLimitBuyCount(itemId: string | number) {
        let count = 0;
        for (let i = 0; i < this.weeklyLimitItems.length; i++) {
            let item = this.weeklyLimitItems[i];
            if (itemId == item.mapshopitemid) {
                count = item.count;
                break;
            }
        }
        return count;
    }

    getUrlByType(type: number) {
        let str: string = "";//资源图标路径
        if (type == -100) {//黃金
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Coin_S");
        }
        else if (type == -300) {//战魂
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Daru");
        }
        else if (type == -400) {//钻石
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Diam_S");
        }
        else if (type == -600) {//水晶
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Kyanite");
        }
        else if (type == ShopGoodsInfo.MYSTERY_STONE) {//神秘石
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_MysteryStone");
        }
        else if (type == ShopGoodsInfo.MEDAL_TEMPID) {//勋章
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Insignia");
        }
        else {//积分 Score不是number
            str = FUIHelper.getItemURL(EmPackName.Base, "Icon_Unit_Points")
        }
        return str;
    }

    /**
     * 检查符文石的状态
     * @param data 物品模板
     * @returns 0未拥有 1已学习 2已拥有 
     */
    getRuneState(data: t_s_itemtemplateData) {
        var runeList: Array<any> = ArmyManager.Instance.thane.runeCate.allRuneList.getList();
        for (let key in runeList) {
            if (Object.prototype.hasOwnProperty.call(runeList, key)) {
                var index: number = Number(key);
                var info: RuneInfo = runeList[index];
                if (info && info.templateInfo.RuneType == data.Property1 && info.grade > 0) {
                    // 已学习
                    return 1;
                }
            }
        }
        let count = 0;
        //玩家背包
        var arr: Array<GoodsInfo> = GoodsManager.Instance.getGeneralBagGoodsBySonType(GoodsSonType.SONTYPE_PASSIVE_SKILL);
        var gInfo: GoodsInfo = null;
        count = arr.length;
        for (var i: number = 0; i < count; i++) {
            gInfo = arr[i] as GoodsInfo;
            if (gInfo.templateInfo.Property1 == data.Property1) {
                // 已拥有
                return 2;
            }
        }
        //公会仓库
        let consortiaGoods = GoodsManager.Instance.consoritaBagList;
        for (const key in consortiaGoods) {
            if (Object.prototype.hasOwnProperty.call(consortiaGoods, key)) {
                let gInfo = consortiaGoods[key];
                if (gInfo && gInfo.templateInfo && gInfo.templateInfo.SonType == GoodsSonType.SONTYPE_PASSIVE_SKILL && gInfo.templateInfo.Property1 == data.Property1) {
                    // 已拥有
                    return 2;
                }
            }
        }
        return 0;
    }
}