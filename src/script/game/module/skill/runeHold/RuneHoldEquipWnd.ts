import FUI_EquipHoldItem from "../../../../../fui/Skill/FUI_EquipHoldItem";
import FUI_EquipRuneList from "../../../../../fui/Skill/FUI_EquipRuneList";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { BagType } from "../../../constant/BagDefine";
import { CommonConstant } from "../../../constant/CommonConstant";
import { ItemSelectState } from "../../../constant/Const";
import { BagEvent, RuneEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { Enum_BagGridState } from "../../bag/model/Enum_BagState";
import NewbieUtils from "../../guide/utils/NewbieUtils";
import SkillWnd from "../SkillWnd";
import SkillWndCtrl from "../SkillWndCtrl";
import SkillWndData from "../SkillWndData";
import { EquipHoldBagItem } from "./EquipHoldBagItem";
import { RuneHoldRuneItem2 } from "./RuneHoldRuneItem2";
import { RuneHoleSkill } from "./RuneHoleSkill";
/**
 * 符石背包
 */
export default class RuneHoldEquipWnd extends BaseWindow {

    public frame: fgui.GLabel;
    public fb: fgui.GImage;
    public equipTitle: fgui.GTextField;
    public equipRuneList: FUI_EquipRuneList;
    public equipBagList: fgui.GList;
    public tbg: fgui.GImage;
    public sortBtn: fgui.GButton;
    public destoryBtn: fgui.GButton;
    public getMoreBtn: fgui.GButton;
    public holeSkillItem: RuneHoleSkill;

    private runeItems: FUI_EquipHoldItem[];
    private holeInfo: RuneHoleInfo;
    private bagRunes: GoodsInfo[];
    private spos: number

    private runeHoldProfileFilter: number[];

    private equipTypes: { [key: number]: number } = {};
    c1: fairygui.Controller;
    txt_count: fgui.GTextField;
    txt_energy0: fgui.GTextField;
    public btn_buy: fgui.GButton;
    public putOffBtn: fgui.GButton;
    public cancelBtn: fgui.GButton;
    public resolvBtn: fgui.GButton;
    protected setOptimize = true;
    /** 背包符石的拥有数量 */
    private ownNum: number = 0;
    /**默认开放背包格子数量 */
    private openGridNum: number = 10;
    /**背包最大上限格子数量 */
    private maxGridNum: number = 100;

    //选择的下标
    private selectedIndexs: number[] = [];

    private clickEquipTime = 0;

    private clickEquipDelay = 100;



    public OnInitWind() {
        this.setCenter();
        this.equipRuneList.displayObject['dyna'] = true;
        this.equipBagList.displayObject['dyna'] = true;
        this.c1 = this.contentPane.getController('c1');
        this.txt_energy0.text = LangManager.Instance.GetTranslation('armyII.viewII.allocate.number');
        if (this.params && this.params.frameData) {
            [this.holeInfo, this.spos] = this.params.frameData;
        } else {
            let runeHoldCom = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd).runeHoldCom;
            if (runeHoldCom) {
                this.holeInfo = runeHoldCom.runeHoleInfo;
                this.spos = 0;
            }
        }
        this.runeItems = [this.equipRuneList.rr0, this.equipRuneList.rr1, this.equipRuneList.rr2, this.equipRuneList.rr3, this.equipRuneList.rr4];
        this.runeHoldProfileFilter = (this.controler.data as SkillWndData).runeHoldProfileFilter;
        this.updateGridInfo(PlayerManager.Instance.currentPlayerModel.playerInfo, true);
        this.initEquipRune();
        this.initBagRune();
        this.addEvent();
        this.equipRuneList.RadioGroup.selectedIndex = this.spos;
        this.onSelectHole(null, this.spos);
    }

    updateGridInfo(playerInfo: PlayerInfo, isInit: boolean = false) {
        //【符石背包】默认开放, 最大上限
        let str = TempleteManager.Instance.getConfigInfoByConfigName("runehole_bag").ConfigValue;
        let arr = str.split(',');
        this.openGridNum = Number(arr[0]) + playerInfo.runeGemBagCount;
        this.maxGridNum = Number(arr[1]);
        // this.list.numItems = this.maxGridNum;
        this.updateRuneNum();
        if (!isInit) {
            this.equipBagList.numItems = this.maxGridNum;
        }
    }

    /**
     * 背包符石的拥有数量/数量上限
     */
    updateRuneNum() {
        let _bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE);
        this.ownNum = _bagData.length;
        if (this.ownNum > this.openGridNum) {
            this.ownNum = this.openGridNum;
        }
        this.txt_count.text = this.ownNum + "/" + this.openGridNum;
    }

    /**
     * 背包符文石操作事件处理
     * @param info 
     */
    private __bagItemUpdate(infos: GoodsInfo[]) {
        this.updateRuneBag();
        this.updateRuneNum();
    }

    private addEvent() {
        (this.controler.data as SkillWndData).addEventListener(SkillWndData.UPDATE_RUNEHOLE_INFO, this.updateView, this);
        (this.controler.data as SkillWndData).addEventListener(SkillWndData.CHAMGE_HOLD_FILTER, this.updateRuneBag, this);
        (this.controler.data as SkillWndData).addEventListener(SkillWndData.CHAMGE_RUNE_FILTER, this.onFilterSelected, this);

        this.destoryBtn.onClick(this, this.onDestoryClick)
        this.getMoreBtn.onClick(this, this.onGetMoreClick)
        this.sortBtn.onClick(this, this.onSortClick);
        this.btn_buy.onClick(this, this.onBuy);
        this.putOffBtn.onClick(this, this.onPutoff);
        this.cancelBtn.onClick(this, this.onCancelResolve);
        this.resolvBtn.onClick(this, this.onResolve);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdate, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.RUNE_GEM_BAG_CAPICITY, this.updateGridInfo, this);

    }

    private delectEvent() {
        (this.controler.data as SkillWndData).removeEventListener(SkillWndData.UPDATE_RUNEHOLE_INFO, this.updateView, this);
        (this.controler.data as SkillWndData).removeEventListener(SkillWndData.CHAMGE_HOLD_FILTER, this.updateRuneBag, this);
        (this.controler.data as SkillWndData).removeEventListener(SkillWndData.CHAMGE_RUNE_FILTER, this.onFilterSelected, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.RUNE_GEM_BAG_CAPICITY, this.updateGridInfo, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdate, this);
        this.destoryBtn.offClick(this, this.onDestoryClick)
        this.getMoreBtn.offClick(this, this.onGetMoreClick)
        this.sortBtn.offClick(this, this.onSortClick);
        this.btn_buy.offClick(this, this.onBuy);
        this.putOffBtn.offClick(this, this.onPutoff);
        this.cancelBtn.offClick(this, this.onCancelResolve);
        this.resolvBtn.offClick(this, this.onResolve);
    }

    private onBuy() {
        if (this.openGridNum >= this.maxGridNum) {
            let str0: string = LangManager.Instance.GetTranslation("runeGem.bagful1");
            MessageTipManager.Instance.show(str0);
            return;
        }
        let bool = this.showAlert(this.startAlertBack);
        if (!bool) {
            this.control.reqBuyRuneGemBagGrid(true, true, { line: 1 });
            return;
        }
        //【符石背包】购买数量, 购买价格5,50
        let str = TempleteManager.Instance.getConfigInfoByConfigName("runehole_bag_buy").ConfigValue;
        if (str) {
            let arr = str.split(',');
            // let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            // let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            // let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            let price = Number(arr[1]) * Number(arr[0]);
            let content: string = LangManager.Instance.GetTranslation('runeGem.buyBag', price, arr[0]);
            // let checkStr = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.useBind");
            // SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { line: 1, checkRickText: checkStr }, prompt, content, confirm, cancel, this.confirmFunc.bind(this));

            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { point:price,state: 0, content: content, line: 1, checkTxt: LangManager.Instance.GetTranslation('active.expback.frame.selectbtntxt'), backFunction: this.confirmFunc.bind(this) })
        }
    }

    private startAlertBack(check: boolean) {
        SharedManager.Instance.buyRuneGemBagNotAlert = check;
        SharedManager.Instance.buyRuneGemBagNotAlertCheckDate = new Date;
        SharedManager.Instance.saveNotalertCheck();
    }

    private showAlert(callBack: Function = null): boolean {
        var preDate: Date = SharedManager.Instance.buyRuneGemBagNotAlertCheckDate;
        var now: Date = new Date();
        var outdate: boolean = false;
        var check: boolean = SharedManager.Instance.buyRuneGemBagNotAlert;
        if (!check || preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate()) {
            outdate = true;
        }
        return outdate;
    }

    private confirmFunc(result: boolean, flag: boolean, data: any) {
        SharedManager.Instance.buyRuneGemBagNotAlert = result
        this.control.reqBuyRuneGemBagGrid(true, flag, { line: 1 });
    }

    private get control(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }

    private initEquipRune() {
        let pos = 0;
        for (let item of this.runeItems) {
            this.setRuneItemValue(this.holeInfo.getRuneByPos(pos), item);
            item.onClick(this, this.onSelectHole, [item, pos])
            pos++;
        }

        this.updateSkill();

    }

    private initBagRune() {
        this.equipBagList.itemRenderer = Laya.Handler.create(this, this.onItemRenderer, null, false);
        this.equipBagList.on(fairygui.Events.CLICK_ITEM, this, this.onSelectBagRune);
        this.equipBagList.setVirtual();
        this.updateRuneBag();
    }
    /**
     * 镶嵌符石时, 镶嵌后自动选中下一个未镶嵌符石位, 替换符石时不更改符石位选中
     */
    private updateView() {
        let getNext: boolean = false;
        this.updateSkill();
        let pos = 0;
        for (let item of this.runeItems) {
            let info = this.holeInfo.getRuneByPos(pos);
            if (info == -1 && !getNext) {
                this.onSelectHole(item, pos);
                this.equipRuneList.RadioGroup.selectedIndex = pos;
                getNext = true;
            }
            this.setRuneItemValue(info, item);
            pos++;
        }
        this.updateRuneBag();
    }

    private updateSkill() {
        this.holeSkillItem.visible = !!this.holeInfo.skill
        if (this.holeInfo.skill) {
            this.holeSkillItem.setInfo(this.holeInfo);
        }
    }

    private onItemRenderer(index: number, item: EquipHoldBagItem) {
        let info = this.bagRunes[index];
        item.info = info;
        let state = info ? Enum_BagGridState.Item : this.openGridNum > index ? Enum_BagGridState.Empty : Enum_BagGridState.Lock;
        item.state = state;

        if (state != Enum_BagGridState.Item) {
            item.selectState = ItemSelectState.Default;
            return;
        }

        item.hadPropertyFlag = info.bagType == BagType.RUNE_EQUIP || !!this.equipTypes[info.templateInfo.Property1];

        if (this.selectedIndexs[index]) {
            item.selectState = ItemSelectState.Selected;
            return;
        }
        item.selectState = this.c1.selectedIndex ? ItemSelectState.Selectable : ItemSelectState.Default;
    }

    public updateRuneBag() {
        let runeBag = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE);
        // let equipBag = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE_EQUIP);
        this.updateEquipType();
        // runeBag.push(...equipBag);
        this.bagRunes = runeBag;
        this.filterRune();
        this.bagRunes.sort(this.sortByProperty.bind(this));
        this.bagRunes.sort(this.sortByProfile.bind(this));
        this.bagRunes = this.sortFlag(this.bagRunes);
        this.equipBagList.numItems = this.maxGridNum;
        // this.equipNum = equipBag.length;
        //这里要显示所有符石背包最大上限 再加上符石装备背包的数量
        // this.equipBagList.numItems = this.maxGridNum ;
    }

    //品质排序
    private sortByProfile(a: GoodsInfo, b: GoodsInfo) {
        // return a.templateInfo.Profile - b.templateInfo.Profile;
        let p1 = a.templateInfo.Profile;
        let p2 = b.templateInfo.Profile;

        //未装备属性往前排
        // if (!this.equipTypes[a.templateInfo.Property1]) {
        //     p1 += 100;
        // }
        // // //未装备属性往前排
        // if (!this.equipTypes[b.templateInfo.Property1]) {
        //     p2 += 100;
        // }

        // //已镶嵌靠后排
        // if (a.bagType == BagType.RUNE_EQUIP) {
        //     p1 -= 50;
        // }
        // //已镶嵌靠后排
        // if (b.bagType == BagType.RUNE_EQUIP) {
        //     p2 -= 50;
        // }
        return p2 - p1;
    }

    //类型排序
    private sortByProperty(a: GoodsInfo, b: GoodsInfo) {
        let p1 = a.templateInfo.Property1;
        let p2 = b.templateInfo.Property1;
        return p1 - p2;

    }

    private sortFlag(runeBag: GoodsInfo[]) {
        let notFlags: GoodsInfo[] = [];
        let equiped: GoodsInfo[] = [];
        let hadPropertyFlag: GoodsInfo[] = [];
        for (let item of runeBag) {
            //优先判断已装备, 已装备必定为已有属性
            if (item.bagType == BagType.RUNE_EQUIP) {
                equiped.push(item); continue;
            }

            if (this.equipTypes[item.templateInfo.Property1]) {
                hadPropertyFlag.push(item); continue;
            }
            notFlags.push(item);
        }

        notFlags.push(...hadPropertyFlag);
        notFlags.push(...equiped);
        return notFlags;
    }

    private updateEquipType() {
        this.equipTypes = {};
        let goods: GoodsInfo | number = null;
        for (let i = 0; i < 5; i++) {
            goods = this.holeInfo.getRuneByPos(i);
            if (goods instanceof GoodsInfo) {
                this.equipTypes[goods.templateInfo.Property1] = 1;
            }

        }
    }

    private filterRune() {
        let temp: GoodsInfo[] = [];
        let ctrl = this.controler;
        let isFilterAtt = ctrl.isRuneFilter(2)
        let isFilteProfile = ctrl.isProfileFilter(2)
        //是否需要过滤
        if (!isFilterAtt && !isFilteProfile) {
            return
        }

        for (let item of this.bagRunes) {
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
                if (!ctrl.filterRuneAttribute(item, 2)) {
                    continue;
                }
            }
            temp.push(item);
        }
        this.bagRunes = temp;
    }


    private setRuneItemValue(value: GoodsInfo | number, item: FUI_EquipHoldItem) {
        // item.lockedTip.visible = value === 0;
        item.lockedTip.visible = (value === 0) || (value == null);
        let runeItem = (item.runeItem as RuneHoldRuneItem2);
        runeItem.info = value;
        item.runeName.visible = false;
        item.addDesc.visible = false;
        if (value instanceof GoodsInfo) {
            item.runeName.text = value.templateInfo.TemplateNameLang;
            item.runeName.color = GoodsSonType.getColorByProfile(value.templateInfo.Profile);
            item.addDesc.text = this.controler.addPropertyTxt(value);
            item.runeName.visible = true;
            item.addDesc.visible = true;
            return;
        }
    }

    private onSelectHole(item: FUI_EquipHoldItem, pos: number) {
        this.spos = pos;
        let info = this.holeInfo.getRuneByPos(pos);
        if (info instanceof GoodsInfo) {
            this.putOffBtn.visible = true;
        } else {
            this.putOffBtn.visible = false;
            if (!info) {//选择未解锁符石位时, 
                //、未解锁符孔位, 如果不符合条件, 直接浮动提示前置孔位, 不要先出弹窗再出浮动提示
                if (pos > 0) {
                    let preInfo = this.holeInfo.getRuneByPos(pos - 1);
                    if (preInfo == 0) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('runeGem.preHole'));
                        return;
                    }
                }

                //如果符孔钻不足, 浮动提示
                let needNum = parseInt(RuneHoleInfo.RuneOpenCost[pos]);
                let tempMax = GoodsManager.Instance.getGoodsNumByTempId(CommonConstant.RUNE_HOLE_CARVE);
                if (tempMax > needNum) {
                    //如果符孔钻足够, 弹窗提示是否解锁, 参考铁匠铺镶嵌开孔
                    let prmit = LangManager.Instance.GetTranslation("public.prompt");
                    let content = LangManager.Instance.GetTranslation("runeHole.unlock", needNum);
                    let confirm = LangManager.Instance.GetTranslation("public.confirm");
                    let calcel = LangManager.Instance.GetTranslation("public.cancel");
                    SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prmit, content, confirm, calcel, (res) => {
                        if (res) this.onOpenLockedClick();
                    });
                } else {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('lackCarveProp'));
                }
            }
        }
    }

    private onOpenLockedClick() {
        let ctrl = (FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl)
        ctrl.reqRuneHoldOpton(this.holeInfo.holeId, 3, this.spos + 1);
    }

    private onSelectBagRune(item: EquipHoldBagItem) {
        //分解选中状态切换
        if (this.c1.selectedIndex == 1) {
            this.onResolveSelect(item)
            return;
        }

        //解锁格子
        if (item.c2.selectedIndex == 0) {
            this.onBuy();
            return;
        }

        let info = item.info;
        if (!info || item.c2.selectedIndex == 1) return;

        // let target: { hole: RuneHoleInfo, pos: number } = null;
        // if (info.bagType == BagType.RUNE_EQUIP) {
        //     target = (this.controler.data as SkillWndData).getRuneHoleInfoByRune(info);
        //     //符孔相同
        //     if (target && target.hole == this.holeInfo) {
        //         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("RuneHoldEquipWnd.equiped"));
        //         return;
        //     }
        // }

        //加个时间间隔, 避免快速点击。
        let curTime = PlayerManager.Instance.currentPlayerModel.sysCurtime.getTime();
        if (curTime - this.clickEquipTime < this.clickEquipDelay) {
            console.warn("real man too quick!!!!")
            return;
        }
        this.clickEquipTime = curTime;

        this.controler.reqRuneGemEquip(this.holeInfo.holeId, this.spos + 1, info.templateId, info.pos);
    }


    private onDestoryClick() {
        this.equipRuneList.touchable = false;
        this.putOffBtn.visible = false;
        this.c1.selectedIndex = 1;
        UIManager.Instance.ShowWind(EmWindow.FilterRuneWnd, { filterType: 2, isResolve: true });
        this.equipBagList.refreshVirtualList();
    }

    private onGetMoreClick() {
        UIManager.Instance.ShowWind(EmWindow.RuneGemWnd, { openFromRuneBag: true, data: [this.holeInfo, this.spos] });
        this.hide();
    }

    private onSortClick() {
        UIManager.Instance.ShowWind(EmWindow.FilterRuneWnd, { filterType: 2 });
    }

    /**
     * 取消分解
     */
    private onCancelResolve() {
        this.c1.setSelectedIndex(0);
        this.equipRuneList.touchable = true;
        this.selectedIndexs = [];
        this.equipBagList.scrollPane.scrollTop();
        this.updateRuneBag();
        let info = this.holeInfo.getRuneByPos(this.spos);
        this.putOffBtn.visible = info instanceof GoodsInfo;
    }

    /**
     * 确认分解
     */
    private onResolve() {
        //当选择高品质的符石分解时, 需要有提示
        let length = this.selectedIndexs.length;

        let isAlterTips = false;

        for (let i = 0; i < length; i++) {
            if (this.selectedIndexs[i]) {
                if (this.bagRunes[i] && this.bagRunes[i].templateInfo.Profile >= 4) {
                    isAlterTips = true;
                    break;

                }
            }
        }

        if (isAlterTips) {
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

    private resolveAlertCallback(result: boolean) {
        if (result) {
            this.doResolve();
        }
    }

    private doResolve() {
        if (this.selectedIndexs.length <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('petEuip.resolveTip2'));
            return;
        }
        let length = this.selectedIndexs.length;
        let posArr: number[] = [];
        for (let i = 0; i < length; i++) {
            if (this.selectedIndexs[i]) {
                if (this.bagRunes[i]) {
                    posArr.push(this.bagRunes[i].pos);
                }
            }
        }
        let resolvePos = posArr.join(",");
        this.control.reqRuneGemResolve(resolvePos);
        this.onCancelResolve();
    }


    /**
     * 单个选择分解
     * @param pos 
     * @param profile 
     */
    private onResolveSelect(item: EquipHoldBagItem) {
        if (!item.info) return;

        //已镶嵌
        if (item.info.bagType == BagType.RUNE_EQUIP) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("runeHoldEquipWnd.resolve.equipedTip"));
            return;
        }
        let index = this.equipBagList.getChildIndex(item);
        index = this.equipBagList.childIndexToItemIndex(index)
        if (this.selectedIndexs[index]) {
            delete this.selectedIndexs[index];
        } else {
            this.selectedIndexs[index] = 1;
        }
        this.equipBagList.refreshVirtualList();
    }

    /**
     * 卸下符石
     */
    private onPutoff() {
        this.control.reqRuneGemUnload(this.holeInfo.holeId, this.equipRuneList.RadioGroup.selectedIndex + 1);
        this.putOffBtn.visible = false;
    }

    //选择筛选的符石
    private onFilterSelected() {

        let leng = this.bagRunes.length;

        let ctrl = this.controler;

        let isFilterAtt = ctrl.isRuneFilter(2, true)

        let isFilteProfile = ctrl.isProfileFilter(2, true);

        let profileFilter = (this.controler.data as SkillWndData).runeProfileFilter2;
        let item: GoodsInfo = null;
        let selectItems: GoodsInfo[] = [];
        let unselectItems: GoodsInfo[] = [];
        for (let i = 0; i < leng; i++) {
            item = this.bagRunes[i];
            unselectItems.push(item);
            //开启过滤品质
            if (isFilteProfile) {
                //该品质不需要选择
                if (!profileFilter[item.templateInfo.Profile - 1]) {
                    continue;
                }
            }

            //开启属性过滤
            if (isFilterAtt) {
                //未拥有属性不需要选择
                if (!ctrl.filterRuneAttribute(item, 2, true)) {
                    continue;
                }
            }
            //已镶嵌
            if (item.bagType == BagType.RUNE_EQUIP) {
                continue;
            }

            unselectItems.pop();
            selectItems.push(item);
            //下标会变
            this.selectedIndexs[selectItems.length - 1] = 1;
        }
        //选中的排到前面
        selectItems.push(...unselectItems)
        this.equipBagList.scrollPane.scrollTop();
        this.bagRunes = selectItems;
        this.equipBagList.numItems = this.bagRunes.length;
    }

    OnHideWind() {
        this.delectEvent();
        if (this.c1.selectedIndex == 1) {
            this.onCancelResolve();
        }
        super.OnHideWind();
        NotificationManager.Instance.dispatchEvent(RuneEvent.CLOSE_GEM);
    }

    private get controler(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }

}