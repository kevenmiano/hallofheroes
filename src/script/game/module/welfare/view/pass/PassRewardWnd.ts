// @ts-nocheck
import FUI_CommonFrame3 from "../../../../../../fui/Base/FUI_CommonFrame3";
import LangManager from "../../../../../core/lang/LangManager";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../../core/ui/UIManager";
import Utils from "../../../../../core/utils/Utils";
import { BaseItem } from "../../../../component/item/BaseItem";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { t_s_rechargeData } from "../../../../config/t_s_recharge";
import { EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import { ShopManager } from "../../../../manager/ShopManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import WelfareCtrl from "../../WelfareCtrl";
import WelfareData from "../../WelfareData";
import { WelfareManager } from "../../WelfareManager";

/**
 * 奖励预览
 */
export default class PassRewardWnd extends BaseWindow {
    //基础版奖励
    list0: fairygui.GList;
    //进阶版奖励
    list1: fairygui.GList;
    //总价值
    txt_price0: fairygui.GTextField;
    //进阶价格
    txt_price1: fairygui.GTextField;
    txt0: fairygui.GTextField;
    txt1: fairygui.GTextField;
    txt2: fairygui.GTextField;
    txt_money: fairygui.GTextField;
    btn_buy: fairygui.GButton;
    buy_group: fairygui.GGroup;
    frame: FUI_CommonFrame3;
    private grade: number = 0;
    private listData0: Array<GoodsInfo>;
    private listData1: Array<GoodsInfo>;

    private get ctrlData(): WelfareData {
        return this.control.data;
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.btn_buy.onClick(this, this.onBuy);
        this.list0.itemRenderer = Laya.Handler.create(this, this.onRenderList0, null, false);
        this.list1.itemRenderer = Laya.Handler.create(this, this.onRenderList1, null, false);
        this.listData0 = [];
        this.listData1 = [];
        this.initLanguage();
    }

    private initLanguage() {
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('pass.text11');
        this.txt0.text = LangManager.Instance.GetTranslation('pass.text06');
        this.txt1.text = LangManager.Instance.GetTranslation('pass.text07');
        this.txt2.text = LangManager.Instance.GetTranslation('pass.text10');
        // this.btn_buy.title = LangManager.Instance.GetTranslation('campaign.TrailShop.BuyBtnTxt');
    }

    OnShowWind() {
        super.OnShowWind();
        this.refreshGoods();
        //【通行证】界面展示格式配置: 返利,价值
        let cfgVal = TempleteManager.Instance.getConfigInfoByConfigName('passcheck_exhibition').ConfigValue
        if (cfgVal) {
            //2总价值读取: 界面上的钻石总价值展示通过数据表t_s_config新增的【通行证】界面展示格式配置: 返利,价值, 来读取
            let arr = cfgVal.split(',');
            this.txt_price0.text = arr[1];
        }
        //进阶价格: 进阶所需钻石由t_s_config中新增的【通行证】进阶通行证所需的钻石, 控制
        // cfgVal = TempleteManager.Instance.getConfigInfoByConfigName('passcheck_open_diamond').ConfigValue
        // if(cfgVal){
        //     this.txt_price1.text = cfgVal;
        // }
        let rechargeData: t_s_rechargeData = TempleteManager.Instance.getPassCheckRechargeTemplete();
        if (rechargeData) {
            this.txt_price1.text = ShopManager.Instance.getMoneyString() + rechargeData.MoneyNum;
            this.txt_money.text = ShopManager.Instance.getMoneyString() + rechargeData.MoneyNum;
        }
        this.buy_group.visible = !this.ctrlData.passRewardInfo.isPay;
    }

    OnHideWind() {
        this.btn_buy.offClick(this, this.onBuy);
        // this.list0.itemRenderer.recover();
        // this.list1.itemRenderer.recover();
        Utils.clearGListHandle(this.list0);
        Utils.clearGListHandle(this.list1);
        super.OnHideWind();
    }

    /**
     * 解锁的奖励物品列表
     * 将展示所有对应职业的进阶（PayReward）奖励, 这里需要做物品堆叠, 相同物品做堆叠处理
     */
    private refreshGoods() {
        let array = TempleteManager.Instance.getPassCheckCfeByJob(ArmyManager.Instance.thane.job);
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            let arr = element.FreeReward.split(',');
            this.checkSameGoods(parseInt(arr[0]), parseInt(arr[1]), this.listData0);
            //进阶奖励
            let payArr = element.PayReward.split('|');
            for (let i = 0; i < payArr.length; i++) {
                const element = payArr[i];
                let arr1 = element.split(',');
                this.checkSameGoods(parseInt(arr1[0]), parseInt(arr1[1]), this.listData1);
            }
        }
        this.list0.numItems = this.listData0.length;
        this.list1.numItems = this.listData1.length;
    }

    /**
     * 相同的物品堆叠处理
     */
    checkSameGoods(templateId: number, count: number, listData: any) {
        let hasSame: boolean = false;
        listData.forEach(element => {
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

    onRenderList0(index: number, item: BaseItem) {
        if (item) {
            item.info = this.listData0[index];
        }
    }

    onRenderList1(index: number, item: BaseItem) {
        if (item) {
            item.info = this.listData1[index];
        }
    }

    onBuy() {
        // let content: string = LangManager.Instance.GetTranslation("pass.buy0");
        // SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, this.confirmback.bind(this));

        let rechargeData: t_s_rechargeData = TempleteManager.Instance.getPassCheckRechargeTemplete();
        if (!rechargeData) return;
        RechargeAlertMannager.Instance.recharge(rechargeData.ProductId);
        this.hide();
    }

    private confirmback(b: boolean, check: boolean) {
        if (b) {
            WelfareManager.Instance.reqPassBuy(1, this.grade);
            UIManager.Instance.HideWind(EmWindow.PassAdvanceWnd);
        }
    }

}