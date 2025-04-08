// @ts-nocheck

import FUI_PetEuipBag from "../../../../../../fui/Pet/FUI_PetEuipBag";
import { SocketManager } from "../../../../../core/net/SocketManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { BagEvent, PetEvent } from "../../../../constant/event/NotificationEvent";
import { C2SProtocol } from "../../../../constant/protocol/C2SProtocol";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PetData } from "../../data/PetData";
import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
import { BagType } from "../../../../constant/BagDefine";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { PetEquipCell } from "./PetEquipCell";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { Enum_BagGridState } from "../../../bag/model/Enum_BagState";
import { ItemSelectState } from "../../../../constant/Const";
import LangManager from "../../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import PetCtrl from "../../control/PetCtrl";
import UIManager from "../../../../../core/ui/UIManager";
import { SharedManager } from "../../../../manager/SharedManager";
import { t_s_petequipstrengthenData } from "../../../../config/t_s_petequipstrengthen";
import Utils from "../../../../../core/utils/Utils";
/**
 * 英灵装备背包界面
 */
export class PetEuipBag extends FUI_PetEuipBag {

    private petEquipBagDatas: GoodsInfo[] = [];

    private defaultOpenCount = 0;

    private maxBagCount = 0;

    private curOpenCount = 0;

    private selectedGoods: GoodsInfo[] = [];

    private petData: PetData;

    private selectedSonType = 501;

    private bagGoodsCount: number = 0;

    private urlArr = ['Icon_Box_Earrings1', 'Icon_Box_Earrings2', 'Icon_Box_Accessory1', 'Icon_Box_Accessory2', 'Icon_Box_Artifact', 'Icon_Box_Belt'];

    protected onConstruct() {
        super.onConstruct();
        let str = TempleteManager.Instance.getConfigInfoByConfigName("pet_bag").ConfigValue.split(",");
        this.defaultOpenCount = +str[0];
        this.maxBagCount = +str[1];
        this.initTabView();
        this.addEvent();
        this.updateBagCount();
        this.list_tab.selectedIndex = 0;
        Utils.setDrawCallOptimize(this.equipBagList);
        this.equipBagList.displayObject['dyna'] = true;
        this.equipBagList.numItems = this.maxBagCount;
    }

    private initTabView() {
        for (let i = 0; i < this.list_tab.numChildren; i++) {
            const tabBtn = this.list_tab.getChildAt(i) as fairygui.GComponent;
            (tabBtn.getChild('icon0') as fgui.GLoader).url = fgui.UIPackage.getItemURL(EmWindow.Pet, 'Icon_Tab_' + (i + 1) + '_Nor');
            (tabBtn.getChild('icon1') as fgui.GLoader).url = fgui.UIPackage.getItemURL(EmWindow.Pet, 'Icon_Tab_' + (i + 1) + '_Sel');
        }
    }

    resetView() {
    }

    /**
     * 切换英灵的时候调用
     * @param data 
     * @returns 
     */
    updateView(data: PetData) {
        this.petData = data;
        this.refreshBag();
    }

    private addEvent() {
        this.equipBagList.setVirtual();
        this.equipBagList.itemRenderer = Laya.Handler.create(this, this.onBagRenderer, null, false);
        this.btn_resolve.onClick(this, this.onResolveClick);
        this.btn_cancel.onClick(this, this.onCancelResolveClick);
        this.btn_all.onClick(this, this.onSelectedAllClick);
        this.btn_buy.onClick(this, this.onBuyClick);
        this.list_tab.on(fgui.Events.CLICK_ITEM, this, this.onTabClick);
        //购买背包格子
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.PET_BAG_CAPICITY, this.onBuyBagCellReceive, this);
        NotificationManager.Instance.addEventListener(PetEvent.REPLACE_PET_EQUIP, this.refreshBag, this);
        NotificationManager.Instance.addEventListener(PetEvent.PET_EUIP_PART, this.onPart, this);
        NotificationManager.Instance.addEventListener(PetEvent.STERN_PET_EQUIP, this.refreshBag, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.refreshBag, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.refreshBag, this);
    }

    private onBagRenderer(index: number, item: PetEquipCell) {
        if (!item || item.isDisposed) return;
        let equipInfo = this.petEquipBagDatas[index];
        item.info = equipInfo;
        let state = equipInfo ? Enum_BagGridState.Item : this.curOpenCount > index ? Enum_BagGridState.Empty : Enum_BagGridState.Lock;
        item.state = state;
        item.maskGray = !this.canEquip(equipInfo);
        if (state != Enum_BagGridState.Item) {
            item.selectState = ItemSelectState.Default;
            (item.getChild('part_icon') as fgui.GLoader).url = fgui.UIPackage.getItemURL(EmWindow.Pet, this.urlArr[this.list_tab.selectedIndex]);
            return;
        }

        if (this.selectedGoods[item.info.id]) {
            item.selectState = ItemSelectState.Selected;
            return;
        }

        item.selectState = this.resolveCtrl.selectedIndex ? ItemSelectState.Selectable : ItemSelectState.Default;
    }

    private removeEvent() {
        this.equipBagList.off(fgui.Events.CLICK_ITEM, this, this.onBagCellClick);
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.PET_BAG_CAPICITY, this.onBuyBagCellReceive, this);
        NotificationManager.Instance.removeEventListener(PetEvent.REPLACE_PET_EQUIP, this.refreshBag, this);
        NotificationManager.Instance.removeEventListener(PetEvent.PET_EUIP_PART, this.onPart, this);
        NotificationManager.Instance.removeEventListener(PetEvent.STERN_PET_EQUIP, this.refreshBag, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.refreshBag, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.refreshBag, this);
    }

    private refreshBag() {
        this.filterBySonType();
        this.equipBagList.refreshVirtualList();
        this.updateBagCount();
    }

    private onPart(part: number) {
        this.list_tab.selectedIndex = part;
        this.refreshPart();
    }

    private onBuyClick() {
        if (this.curOpenCount >= this.maxBagCount) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('petEquip.buymax'));
            return;
        }
        let str = TempleteManager.Instance.getConfigInfoByConfigName("pet_bag_buy").ConfigValue;
        if (str) {
            let arr = str.split(',');
            let price = parseInt(arr[0]) * parseInt(arr[1]);
            let content: string = LangManager.Instance.GetTranslation('runeGem.buyBag', price, arr[0]);
            let checkStr = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.useBind");
            let checkStr2 = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.promptTxt");

            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { line: 1, checkRickText: checkStr, checkRickText2: checkStr2, checkDefault: true,point:price }, null, content, null, null, this.confirmBuyBagCell.bind(this));
        }
    }

    private onTabClick() {
        this.refreshPart();
        NotificationManager.Instance.dispatchEvent(PetEvent.PET_EUIP_BAG_PART, this.list_tab.selectedIndex);
    }

    private refreshPart() {
        this.selectedSonType = 501 + this.list_tab.selectedIndex;
        this.refreshBag();
    }

    private filterBySonType() {
        let allBagDatas = GoodsManager.Instance.getGoodsByBagType(BagType.PET_BAG);
        this.bagGoodsCount = allBagDatas.length;
        let canEquips: GoodsInfo[] = [];
        let unEquips: GoodsInfo[] = [];
        for (let equipData of allBagDatas) {
            if (equipData.templateInfo.SonType == this.selectedSonType) {
                this.canEquip(equipData) ?
                    canEquips.push(equipData) : unEquips.push(equipData);
            }
        }
        //强化等级排序
        canEquips.sort((a, b) => { return b.strengthenGrade - a.strengthenGrade });
        unEquips.sort((a, b) => { return b.strengthenGrade - a.strengthenGrade })
        //品质排序
        canEquips.sort((a, b) => { return b.templateInfo.Profile - a.templateInfo.Profile });
        unEquips.sort((a, b) => { return b.templateInfo.Profile - a.templateInfo.Profile });
        canEquips.push(...unEquips);
        this.petEquipBagDatas = canEquips;
    }

    private onBagCellClick(item: PetEquipCell) {
        if (!item.info) return;
        // let index = this.equipBagList.getChildIndex(item);
        // index = this.equipBagList.childIndexToItemIndex(index)
        if (this.selectedGoods[item.info.id]) {
            delete this.selectedGoods[item.info.id];
        } else {
            this.selectedGoods[item.info.id] = item.info;
        }
        this.equipBagList.refreshVirtualList();
    }

    private onResolveClick() {
        if (this.resolveCtrl.selectedIndex == 0) {
            this.resolveCtrl.selectedIndex = 1;
            this.equipBagList.refreshVirtualList();
            this.equipBagList.on(fgui.Events.CLICK_ITEM, this, this.onBagCellClick)
            return
        }
        this.relolveEquips();
        // this.selectedIndexs = [];
        // this.equipBagList.refreshVirtualList();
    }

    private onCancelResolveClick() {
        this.equipBagList.off(fgui.Events.CLICK_ITEM, this, this.onBagCellClick)
        this.resolveCtrl.selectedIndex = 0;
        this.selectedGoods = [];
        this.equipBagList.refreshVirtualList();
    }

    private onSelectedAllClick() {
        let length = this.petEquipBagDatas.length;
        let goods: GoodsInfo;
        for (let i = 0; i < length; i++) {
            goods = this.petEquipBagDatas[i]
            this.selectedGoods[goods.id] = goods;
        }
        this.equipBagList.refreshVirtualList();
    }

    private relolveEquips() {
        if (this.selectedGoods.length <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('petEuip.resolveTip2'));
            return;
        }

        let hasGoodEquip = false;


        let goodsId: number[] = [];
        let goodsInfo: GoodsInfo;

        // for (let i = 0; i < length; i++) {
        for (let key in this.selectedGoods) {
            goodsInfo = this.selectedGoods[key]
            if (!goodsInfo) continue;
            goodsId.push(goodsInfo.templateId);
            if (goodsInfo.strengthenGrade >= 10 || goodsInfo.templateInfo.Profile > 3 || goodsInfo.star >= 3) {
                hasGoodEquip = true;
            }
        }

        // }

        if (goodsId.length <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('petEuip.resolveTip2'));
            return;
        }

        let resolveGoods = this.getRefreshArr();

        //检测当前是否已经选中要分解的装备是否存在好装备（3星以上、紫色以上品质、强化+10以上, 表格配置）
        // if (hasGoodEquip) {
        //     //若【存在】触发二次确认界面 
        //     let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        //     let confirm1: string = LangManager.Instance.GetTranslation("public.confirm");
        //     let cancel1: string = LangManager.Instance.GetTranslation("public.cancel");
        //     let msg = LangManager.Instance.GetTranslation("petEuip.resolveTip");
        //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, resolveGoods, prompt, msg, confirm1, cancel1, this.checkConfirmRelosve.bind(this))
        //     return;
        // }

        this.checkConfirmRelosve(true, false, resolveGoods);
    }

    private checkConfirmRelosve(b: boolean, checked: boolean, goodsId: { goodsId: number, count: number }[]) {
        if (!b) return;
        if (SharedManager.Instance.notAlertThisLogin) {
            this.confirmRelosve(true);
        } else {
            UIManager.Instance.ShowWind(EmWindow.GetGoodsAlert, { goodsList: goodsId, callback: this.confirmRelosve.bind(this) });
        }
    }

    private confirmRelosve(b: boolean) {
        if (b) {
            let posArr: number[] = [];
            for (let key in this.selectedGoods) {
                posArr.push(this.selectedGoods[key].pos);
            }

            let pos = posArr.join(',');
            this.selectedGoods = [];
            this.equipBagList.refreshVirtualList();
            if (posArr.length == 0) return;
            PetCtrl.reqPetEquipResolve(pos);
        }
    }

    private updateBagCount() {
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        this.curOpenCount = playerInfo.petBagCount + this.defaultOpenCount;
        this.txt_bag.text = `${this.bagGoodsCount}/${this.curOpenCount}`
    }

    private confirmBuyBagCell(result: boolean, flag: boolean, data: any) {
        if (result) {
            let msg: PayTypeMsg = new PayTypeMsg();
            msg.type = 2;//背包扩容, 参数type==1 符文背包  2=英灵背包
            msg.payType = 0;
            if (!flag) {
                msg.payType = 1;
            }
            msg.property1 = data.line;
            SocketManager.Instance.send(C2SProtocol.U_C_BAG_BUY, msg);
        }
    }

    private onBuyBagCellReceive() {
        this.updateBagCount();
        this.equipBagList.refreshVirtualList();
    }

    private canEquip(equip: GoodsInfo) {
        if (!this.petData || !equip) return true;
        let job = equip.templateInfo.Job[0];
        if (job == 0) return true;
        return job == this.petData.template.PetType;
    }

    //分解获得
    private getRefreshArr() {
        let result: { goodsId: number, count: number }[] = [];
        let goodsInfo: GoodsInfo;
        for (let key in this.selectedGoods) {
            goodsInfo = this.selectedGoods[key];
            if (!goodsInfo) continue;

            let totalCnt = 0
            for (let index = 1; index <= goodsInfo.strengthenGrade; index++) {
                let cfg: t_s_petequipstrengthenData = TempleteManager.Instance.getPetEquipStrenData(index);
                let curCfg: t_s_petequipstrengthenData = TempleteManager.Instance.getPetEquipStrenData(index);
                let curCnt = cfg.StrengthenConsume
                if (curCfg) {
                    curCnt *= curCfg.Resolveadd / 100;
                }
                totalCnt += curCnt;
            }
            let resolveCnt = goodsInfo.templateInfo.Property5 + totalCnt;
            let obj = { goodsId: goodsInfo.templateInfo.Refresh, count: resolveCnt };
            result.push(obj);
        }
        return result;
    }

    dispose(): void {
        this.removeEvent();
        super.dispose();
    }
}