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
 * 进阶通行证
 */
export default class PassAdvanceWnd extends BaseWindow {

    btn_buy: fairygui.GButton;
    //解锁的奖励物品列表
    list: fairygui.GList;
    //总价值
    txt_price0: fairygui.GTextField;
    //进阶价格
    txt_price1: fairygui.GTextField;
    private listData: Array<GoodsInfo>;
    private grade: number = 0;
    txt0: fairygui.GTextField;
    txt1: fairygui.GTextField;
    txt2: fairygui.GTextField;
    descTxt: fairygui.GTextField;
    frame: FUI_CommonFrame3;
    public txt_money: fgui.GRichTextField;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.btn_buy.onClick(this, this.onBuy);
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderList, null, false);
        this.listData = [];
        this.initLanguage();
    }

    private initLanguage() {
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('pass.text15');
        this.txt0.text = LangManager.Instance.GetTranslation('pass.text07');
        this.txt1.text = LangManager.Instance.GetTranslation('pass.text10');
        this.txt2.text = LangManager.Instance.GetTranslation('pass.text12');
        this.descTxt.text = LangManager.Instance.GetTranslation('pass.text13');
        this.btn_buy.title = LangManager.Instance.GetTranslation('campaign.TrailShop.BuyBtnTxt');
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
            // this.txt_price1.text = '¥ '+ rechargeData.MoneyNum;
            if (Utils.isInteger(rechargeData.MoneyNum)) {
                this.txt_money.text = ShopManager.Instance.getMoneyString() + parseInt(rechargeData.MoneyNum);//价格
            } else {
                this.txt_money.text = ShopManager.Instance.getMoneyString() + rechargeData.MoneyNum;//价格
            }
            this.btn_buy.title = "";
        }
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    private get ctrlData(): WelfareData {
        return this.control.data;
    }

    /**
     * 解锁的奖励物品列表
     * 将展示所有对应职业的进阶（PayReward）奖励, 这里需要做物品堆叠, 相同物品做堆叠处理
     */
    private refreshGoods() {
        this.list.numItems = 0;
        let array = TempleteManager.Instance.getPassCheckCfeByJob(this.ctrlData.passRewardInfo.passIndex);
        if(array.length == 0){
            array = TempleteManager.Instance.getPassCheckCfeByJob(0);
        }
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            //进阶奖励
            let payArr = element.PayReward.split('|');
            for (let i = 0; i < payArr.length; i++) {
                const element = payArr[i];
                let arr1 = element.split(',');
                this.checkSameGoods(parseInt(arr1[0]), parseInt(arr1[1]), this.listData);
            }
        }
        this.list.numItems = this.listData.length;
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

    onRenderList(index: number, item: BaseItem) {
        if (item) {
            item.info = this.listData[index];
        }
    }

    onBuy() {
        // let content: string = LangManager.Instance.GetTranslation("pass.buy0",this.txt_price1.text);
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

    OnHideWind() {
        this.btn_buy.offClick(this, this.onBuy);
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        super.OnHideWind();
    }
}