// @ts-nocheck
import FUI_VipPrivilegeItem from '../../../../fui/Shop/FUI_VipPrivilegeItem';
import LangManager from '../../../core/lang/LangManager';
import { VIPEvent } from '../../constant/event/NotificationEvent';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import { VipGiftState } from '../../datas/vip/VipInfo';
import { TempleteManager } from '../../manager/TempleteManager';
import { VIPManager } from '../../manager/VIPManager';
import PrivilegeItemData from './PrivilegeItemData';
import VipTitle from './VipTitle';
import { VipGiftType } from './VipTitle';


/**
 * 特权渲染单元格
 */
export default class VipPrivilegeItem extends FUI_VipPrivilegeItem {

    //@ts-ignore
    public vipDayGift: VipTitle;
    //@ts-ignore
    public vipWelfare: VipTitle;
    //@ts-ignore
    public vipProGift: VipTitle;

    private _itemData: PrivilegeItemData;

    onConstruct() {
        super.onConstruct();
        this.addEvent();
        this.vipDayGift.type = VipGiftType.DAY;
        this.vipWelfare.type = VipGiftType.WELFARE;
        this.vipProGift.type = VipGiftType.PAY;
    }

    private addEvent() {
        VIPManager.Instance.addEventListener(VIPEvent.VIP_PRIVILEGE_UPDATE, this.onRefresh, this);
    }

    private offEvent() {
        VIPManager.Instance.removeEventListener(VIPEvent.VIP_PRIVILEGE_UPDATE, this.onRefresh, this);
    }


    onRefresh() {
        if (!this._itemData) return;
        let grade = this._itemData.grade;
        let giftStates = VIPManager.Instance.model.vipInfo.giftState;
        let userVip = VIPManager.Instance.model.vipInfo.VipGrade;
        let curState: VipGiftState = null;
        for (let index = 0; index < giftStates.length; index++) {
            let element = giftStates[index];
            if (element.vip_grade == grade) {
                curState = element;
                break;
            }
        }
        if (curState) {
            this.vipDayGift.dayGiftState = curState.dayGiftState;
            if (userVip < grade) {
                this.vipWelfare.dayGiftState = 0;
                this.vipProGift.dayGiftState = 0;
            } else {
                this.vipWelfare.dayGiftState = curState.isFreeGift ? 1 : 2;
                this.vipProGift.dayGiftState = curState.isPayGift ? 1 : 2;
            }
        } else {
            this.vipDayGift.dayGiftState = 0;
            this.vipWelfare.dayGiftState = 0;
            this.vipProGift.dayGiftState = 0;
        }
    }

    public set itemData(value: PrivilegeItemData) {
        this._itemData = value;
        this.vipLevel.text = value.grade.toString();
        this.vipDes.getChild("content").text = value.des;
        this.vipPro.text = LangManager.Instance.GetTranslation("vip.vipPrivilegeWnd.title0", value.grade.toString(), value.count.toString());
        this.vipDayGift.title.text = LangManager.Instance.GetTranslation("vip.vipPrivilegeWnd.title1", value.grade.toString());
        this.vipWelfare.title.text = LangManager.Instance.GetTranslation("vip.vipPrivilegeWnd.title2", value.grade.toString());
        this.vipProGift.title.text = LangManager.Instance.GetTranslation("vip.vipPrivilegeWnd.title3", value.grade.toString());

        //每日礼包
        let itemData = TempleteManager.Instance.getVipPackageByType(value.grade, -1);
        if (itemData && itemData.Item != "") {
            let goodsList = [];
            let items = itemData.Item.split("|");
            for (let index = 0; index < items.length; index++) {
                let element = items[index];
                let goodsItem = element.split(",");
                let goodsInfo = new GoodsInfo();
                goodsInfo.templateId = parseInt(goodsItem[0]);
                goodsInfo.count = parseInt(goodsItem[1]);

                const displayEffect: number = parseInt(goodsItem[2]);
                goodsInfo.displayEffect = isNaN(displayEffect) ? 0 : displayEffect;

                goodsList.push(goodsInfo);
            }
            this.vipDayGift.vipgrade = itemData.Grade;
            this.vipDayGift.itemData = goodsList;
        }

        //福利礼包
        itemData = TempleteManager.Instance.getVipPackageByType(value.grade, 0);
        if (itemData && itemData.Item != "") {
            let goodsList = [];
            let items = itemData.Item.split("|");
            for (let index = 0; index < items.length; index++) {
                let element = items[index];
                let goodsItem = element.split(",");
                let goodsInfo = new GoodsInfo();
                goodsInfo.templateId = Number(goodsItem[0]);
                goodsInfo.count = Number(goodsItem[1]);
                
                const displayEffect: number = parseInt(goodsItem[2]);
                goodsInfo.displayEffect = isNaN(displayEffect) ? 0 : displayEffect;

                goodsList.push(goodsInfo);
            }
            this.vipWelfare.vipgrade = itemData.Grade;
            this.vipWelfare.itemData = goodsList;//每日礼包
        }

        //特权礼包
        itemData = TempleteManager.Instance.getVipPackageByType(value.grade, 1);
        if (itemData && itemData.Item != "") {
            let goodsList = [];
            let items = itemData.Item.split("|");
            for (let index = 0; index < items.length; index++) {
                let element = items[index];
                let goodsItem = element.split(",");
                let goodsInfo = new GoodsInfo();
                goodsInfo.templateId = Number(goodsItem[0]);
                goodsInfo.count = Number(goodsItem[1]);
               
                const displayEffect: number = parseInt(goodsItem[2]);
                goodsInfo.displayEffect = isNaN(displayEffect) ? 0 : displayEffect;

                goodsList.push(goodsInfo);
            }
            this.vipProGift.vipgrade = itemData.Grade;
            this.vipProGift.OriginalPrice = itemData.OriginalPrice;
            this.vipProGift.Price = itemData.Price;
            this.vipProGift.itemData = goodsList;//每日礼包
        }

        this.onRefresh();
    }

    public get itemData() {
        return this._itemData;
    }

    dispose() {
        this.offEvent();
        this._itemData = null;
        super.dispose();
    }
}