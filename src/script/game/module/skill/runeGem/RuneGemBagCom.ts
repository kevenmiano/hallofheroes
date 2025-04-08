import FUI_RuneBagCom from "../../../../../fui/Skill/FUI_RuneBagCom";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import UIManager from "../../../../core/ui/UIManager";
import { RuneBagCell } from "../../../component/item/RuneBagCell";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { BagType } from "../../../constant/BagDefine";
import { ItemSelectState } from "../../../constant/Const";
import { BagEvent, RuneEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { Enum_BagGridState } from "../../bag/model/Enum_BagState";
import SkillWndCtrl from "../SkillWndCtrl";
import SkillWndData from "../SkillWndData";
/**
 * 符文石背包面板
 */
export default class RuneGemBagCom extends FUI_RuneBagCom {

    /** 背包列表数据 */
    private _bagData: GoodsInfo[];
    /** 背包中当前选中的品质的列表数据 */
    private _curListData: GoodsInfo[];
    /** 背包符石的拥有数量 */
    private ownNum: number = 0;
    /** 背包符石的数量上限 */
    private maxNum: number = 100;
    /**默认开放背包格子数量 */
    private openGridNum: number = 10;
    /**背包最大上限格子数量 */
    private maxGridNum: number = 100;

    private runeHoldProfileFilter: number[];
    

    private get control(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }
    /**
     * 要分解的位置
     */
    private posArr: Array<number> = [];
    private profileArr: Array<number> = [];

    onConstruct() {
        super.onConstruct();
        this.txt_energy0.text = LangManager.Instance.GetTranslation('armyII.viewII.allocate.number');
        this.btn_resolve.title = LangManager.Instance.GetTranslation('runeGem.str4');
        this.btn_sure.title = LangManager.Instance.GetTranslation('runeGem.str3');
        this.btn_cancel.title = LangManager.Instance.GetTranslation('runeGem.str6');
        this.btn_sure.visible = true;
        this.list.setVirtual();
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderListItem, null, false);
    }

    public initView(){
        this.addEvent();
    }

    updateView() {
        this.runeHoldProfileFilter = (this.control.data as SkillWndData).runeProfileFilter;
        this.updateRuneBag();
        this.updateGridInfo(PlayerManager.Instance.currentPlayerModel.playerInfo);
        this.onAll();
        this.quickResolve.setSelectedIndex(0);
        this.setBagItemsState(ItemSelectState.Default);
        this.posArr.length = 0;
        this.profileArr.length = 0;
    }

    /**
     * 背包符石的拥有数量/数量上限
     */
    updateRuneNum() {
        let _bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE);
        this.ownNum = _bagData.length;
        this.txt_count.text = this.ownNum + "/" + this.openGridNum;
    }



    private addEvent() {
        this.sortBtn.onClick(this, this.onSortClick)
        this.btn_fast.onClick(this, this.onFast);
        this.btn_sure.onClick(this, this.onSure);
        this.btn_buy.onClick(this, this.onBuy);
        this.btn_resolve.onClick(this, this.onResolve);
        this.btn_cancel.onClick(this, this.onCancel);
        this.list.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagDelete, this);
        ServerDataManager.listen(S2CProtocol.U_C_RESOLVE, this, this.__onResolveResult);
        NotificationManager.Instance.addEventListener(RuneEvent.RESOLVE_RUNE_GEM, this.onResolveSelect, this);
        NotificationManager.Instance.addEventListener(RuneEvent.RUNE_GEM_RESOLVE, this.onRecvResolve, this);
        NotificationManager.Instance.addEventListener(RuneEvent.RUNE_GEM_UPGRADE, this.onRecvUpgrade, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.RUNE_GEM_BAG_CAPICITY, this.updateGridInfo, this);
        (this.control.data as SkillWndData).addEventListener(SkillWndData.CHAMGE_RUNE_FILTER, this.updateRuneBag, this);
    }


    private removeEvent() {
        this.sortBtn.offClick(this, this.onSortClick)
        this.btn_fast.offClick(this, this.onFast);
        this.btn_sure.offClick(this, this.onSure);
        this.btn_buy.offClick(this, this.onBuy);
        this.btn_resolve.offClick(this, this.onResolve);
        this.btn_cancel.offClick(this, this.onCancel);
        this.list.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagDelete, this);
        ServerDataManager.cancel(S2CProtocol.U_C_RESOLVE, this, this.__onResolveResult);
        NotificationManager.Instance.removeEventListener(RuneEvent.RESOLVE_RUNE_GEM, this.onResolveSelect, this);
        NotificationManager.Instance.removeEventListener(RuneEvent.RUNE_GEM_RESOLVE, this.onRecvResolve, this);
        NotificationManager.Instance.removeEventListener(RuneEvent.RUNE_GEM_UPGRADE, this.onRecvUpgrade, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.RUNE_GEM_BAG_CAPICITY, this.updateGridInfo, this);
        (this.control.data as SkillWndData).removeEventListener(SkillWndData.CHAMGE_RUNE_FILTER, this.updateRuneBag, this);
    }

    onAll() {
        if (this._curListData == null) {
            return;
        }

        this._curListData = null;

        this.list.refreshVirtualList();
    }

    updateGridInfo(playerInfo: PlayerInfo) {
        //【符石背包】默认开放, 最大上限
        let str = TempleteManager.Instance.getConfigInfoByConfigName("runehole_bag").ConfigValue;
        let arr = str.split(',');
        this.openGridNum = Number(arr[0]) + playerInfo.runeGemBagCount;
        this.maxGridNum = Number(arr[1]);
        this.list.numItems = this.maxGridNum;
        this.updateRuneNum();
    }

    onRecvResolve(info: GoodsInfo) {
        if (SharedManager.Instance.notAlertThisLogin) {
            this.control.reqRuneGemResolve(info.pos.toString());
            return;
        }

        let temp = new GoodsInfo();
        temp.templateId = info.templateInfo.Refresh;
        //基础数量
        let base = info.templateInfo.Property2 / temp.templateInfo.Property2;

        //分解返回百分比
        let percent = +TempleteManager.Instance.getConfigInfoByConfigName("runehole_decompose").ConfigValue;
        percent /= 100;

        //总升级数量
        let upgradeGp = 0;
        let strengthenGrade = info.strengthenGrade;
        let SonType = info.templateInfo.SonType;
        let indexGrade = 1;
        let levlTmep: t_s_upgradetemplateData
        while (strengthenGrade >= indexGrade) {
            levlTmep = TempleteManager.Instance.getTemplateByTypeAndLevelAndSonType(indexGrade, 200, SonType);
            upgradeGp += levlTmep.Data;
            indexGrade++;
        }

        //最后获得的碎片数量
        let count = (base + upgradeGp) * percent;
        UIManager.Instance.ShowWind(EmWindow.GetGoodsAlert, {
            goodsList: [{ goodsId: -1000, count: count >> 0 }], callback: () => {
                this.control.reqRuneGemResolve(info.pos.toString());
            }
        });



    }

    onRecvUpgrade(info: GoodsInfo) {
        // this.control.reqRuneGemUpgrade(info.pos.toString(),info.id,);
        UIManager.Instance.ShowWind(EmWindow.RuneGemUpgradeWnd, info);
    }

    onResolveSelect(pos: number, profile: number) {
        let idx = this.posArr.indexOf(pos);
        if (idx >= 0) {
            this.posArr.splice(idx, 1);
            this.profileArr.splice(idx, 1);
            if (this.posArr.length == 0) {
                this.btn_sure.title = LangManager.Instance.GetTranslation('runeGem.str24');
            }
        } else {
            this.posArr.push(pos);
            this.profileArr.push(profile);
            this.btn_sure.title = LangManager.Instance.GetTranslation('runeGem.str3');
        }
    }

    /**
     * 符文石分解返回
     * @param pkg 
     */
    private __onResolveResult(pkg: PackageIn) {
        Logger.log("[符文石分解返回]__onResolveResult", pkg)

        // this._bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE);
        // this.list.refreshVirtualList();
        this.updateRuneBag();
        this.btn_cancel.visible = false;
        this.btn_fast.visible = true;
    }

    //品质排序
    private sortByProfile(a: GoodsInfo, b: GoodsInfo) {
        // return a.templateInfo.Profile - b.templateInfo.Profile;
        let p1 = a.templateInfo.Profile;
        let p2 = b.templateInfo.Profile;
        return p2 - p1;
    }

    //类型排序
    private sortByProperty(a: GoodsInfo, b: GoodsInfo) {
        let p1 = a.templateInfo.Property1;
        let p2 = b.templateInfo.Property1;
        return p1 - p2;

    }
    /**
     * 背包符文石操作事件处理
     * @param info 
     */
    private __bagItemUpdate(infos: GoodsInfo[]) {
        this.updateRuneBag();
        this.updateRuneNum();
    }

    private __bagDelete(infos: GoodsInfo[]) {
        // this._bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE);
        // if (this._curListData && this._curListData.length > 0) {
        //     for (let i = 0; i < this._curListData.length; i++) {
        //         const element = this._curListData[i];
        //         if (element.templateId == info.templateId && element.pos == info.pos) {
        //             this._curListData.splice(i, 1);
        //             break;
        //         }
        //     }
        // }
        // this.list.refreshVirtualList();

        this.updateRuneBag();
        this.updateRuneNum();
    }

    private onClickItem(item: RuneBagCell) {
        if ((item.state == Enum_BagGridState.Lock) || (item.getController('c2').selectedIndex == 0)) {
            this.onBuy();
        }
    }


    /**
      * 列表渲染
      * @param index 
      * @param item 
      * @returns 
      */
    private onRenderListItem(index: number, item: RuneBagCell) {
        if (!item) return;
        let itemData;
        if (this._curListData) {
            itemData = this._curListData[index];
        } else {
            itemData = this._bagData[index];
        }
        if (!itemData) {
            item.info = null;
            if (index < this.openGridNum) {
                //没道具的空格子
                item.state = Enum_BagGridState.Empty;
            }
            else {
                //未解锁的格子
                item.state = Enum_BagGridState.Lock;
            }
            return
        } else {
            // if(itemData.templateInfo.Profile > this.profile && this.profile != 0){
            //     item.state = Enum_BagGridState.Empty;
            //     return;
            // }
        }
        item.state = Enum_BagGridState.Item;
        item.item.bagType = itemData.bagType;
        item.item.pos = itemData.pos;
        item.info = itemData;
        if (item.info) {
            item.selectState = item.info.selectState;
        }
    }




    /**
     * 
     */
    onSure() {
        if (this.btn_sure.title == LangManager.Instance.GetTranslation('runeGem.str24')) {
            this.quickResolve.setSelectedIndex(0);
            let array = this._bagData;
            for (let i = 0; i < array.length; i++) {
                let item = array[i];
                if (item) {
                    item.selectState = ItemSelectState.Default;
                }
            }
            this.setBagItemsState(ItemSelectState.Default);
        } else {
            //当选择高品质的符石分解时, 需要有提示
            if (this.profileArr.indexOf(4) >= 0 || this.profileArr.indexOf(5) >= 0) {
                let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
                let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
                let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
                let content: string = LangManager.Instance.GetTranslation("runeGem.resolve");
                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.resolveAlertCallback.bind(this));
                return;
            } else {
                this.doResolve();
            }

        }
        this.posArr.length = 0;
        this.profileArr.length = 0;
        // this.list.scrollPane.touchEffect = true;
    }

    private doResolve() {
        //符文石在符文石背包中的位置 pos1,pos2,pos3
        let pos: string = this.posArr.join(',');
        this.control.reqRuneGemResolve(pos);
        this.quickResolve.setSelectedIndex(0);

        this.setBagItemsState(ItemSelectState.Default);
    }

    resolveAlertCallback(result: boolean) {
        if (result) {
            this.doResolve();
            this.posArr.length = 0;
            this.profileArr.length = 0;
        }
    }

    /**
     * 快速选择
     */
    onFast() {
        this.btn_sure.visible = true;
        this.btn_cancel.visible = true;
        this.btn_fast.visible = false;
        this.setBagItemsState(ItemSelectState.Selected);
        //禁用触摸滚动
        // this.list.scrollPane.touchEffect = false;
    }

    onCancel() {
        this.btn_cancel.visible = false;
        this.btn_fast.visible = true;
        // this.c1.setSelectedIndex(0);
        this.setBagItemsState(ItemSelectState.Selectable);
        this.posArr.length = 0;
        this.profileArr.length = 0;
        this.btn_sure.title = LangManager.Instance.GetTranslation('runeGem.str24')
        // this.list.scrollPane.touchEffect = true;
    }

    onBuy() {
        if (this.openGridNum >= this.maxGridNum) {
            let str0: string = LangManager.Instance.GetTranslation("runeGem.bagful1");
            MessageTipManager.Instance.show(str0);
            return;
        }
        //【符石背包】购买数量, 购买价格5,50
        let str = TempleteManager.Instance.getConfigInfoByConfigName("runehole_bag_buy").ConfigValue;
        if (str) {
            let arr = str.split(',');
            let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            let price = Number(arr[1]) * Number(arr[0]);
            let content: string = LangManager.Instance.GetTranslation('runeGem.buyBag', price, arr[0]);
            let checkStr = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.useBind");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { line: 1, checkRickText: checkStr,point:price}, prompt, content, confirm, cancel, this.confirmFunc.bind(this));
        }
    }

    private confirmFunc(result: boolean, flag: boolean, data: any) {
        if (result) {
            this.control.reqBuyRuneGemBagGrid(result, flag, data);
        }
    }

    /**
     * 批量分解
     */
    onResolve() {
        //当玩家选择【批量分解】时: 按钮变成【快速选择】【取消分解】
        this.btn_sure.title = LangManager.Instance.GetTranslation('runeGem.str24')
        this.btn_fast.visible = true;
        this.btn_cancel.visible = false;
        this.quickResolve.setSelectedIndex(1);
        this.setBagItemsState(ItemSelectState.Selectable);
    }

    private setBagItemsState(state: ItemSelectState) {
        for (let index = 0; index < this.list.numChildren; index++) {
            const item = this.list.getChildAt(index) as RuneBagCell;
            if (item.info) {
                if (state == ItemSelectState.Selected) {
                    if (item.selectState != state) {
                        this.onResolveSelect(item.info.pos, item.info.templateInfo.Profile);
                    }
                } else if (state == ItemSelectState.Default) {
                    // this.onResolveSelect(item.info.pos);
                }
                item.info.selectState = state;
                item.selectState = state;
            }
        }
    }


    private onSortClick() {
        UIManager.Instance.ShowWind(EmWindow.FilterRuneWnd, { filterType: 1});
    }

    private updateRuneBag() {
        let runeBag = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE);
        this._bagData = runeBag;
        this.filterRune();
        this._bagData.sort(this.sortByProperty);
        this._bagData.sort(this.sortByProfile);
        this.list.numItems = this.maxGridNum;
    }

    private filterRune() {
        let temp: GoodsInfo[] = [];
        let ctrl = this.control;
        let isFilterAtt = ctrl.isRuneFilter(1)
        let isFilteProfile = ctrl.isProfileFilter(1)
        //是否需要过滤
        if (!isFilterAtt && !isFilteProfile) {
            return
        }

        for (let item of this._bagData) {
            //开启过滤品质
            if (isFilteProfile) {
                //该品质不需要显示
                if (!this.runeHoldProfileFilter[item.templateInfo.Profile - 1]) {
                    continue;
                }
            }


            //开启属性过滤
            if (isFilterAtt) {
                //未拥有属性不需要显示
                if (!ctrl.filterRuneAttribute(item, 1,false)) {
                    continue;
                }
            }
            temp.push(item);
        }
        this._bagData = temp;
    }

    dispose(): void {
        this.removeEvent();
        // super.dispose();
    }
}