/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 10:43:29
 * @LastEditTime: 2023-09-19 20:46:03
 * @LastEditors: jeremy.xu
 * @Description: 占星背包
 */
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { ShowAvatar } from "../../avatar/view/ShowAvatar";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { StarBagType, StarEvent, StarSelectState } from "../../constant/StarDefine";
import { DataCommonManager } from "../../manager/DataCommonManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { StarManager } from "../../manager/StarManager";
import StarInfo from "../mail/StarInfo";
import StarItemBase from "./item/StarItemBase";
import { PlayerModel } from '../../datas/playerinfo/PlayerModel';
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { StarHelper } from "../../utils/StarHelper";
import { EmWindow } from "../../constant/UIDefine";
import FUIHelper from '../../utils/FUIHelper';
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import ComponentSetting from "../../utils/ComponentSetting";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import StarItem from "./item/StarItem";
import OpenGrades from "../../constant/OpenGrades";
import StarModel from "./StarModel";
import { ArmyManager } from "../../manager/ArmyManager";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { isOversea } from "../login/manager/SiteZoneCtrl";

export default class StarBagWnd extends BaseWindow {
    private rightStarList: fgui.GList;
    private leftStarList: fgui.GList;
    private gOptNormal: fgui.GGroup;
    private cChooseSell: fgui.Controller;
    private cChooseCompose: fgui.Controller;
    private comStarPower: fgui.GComponent;
    private _rightStarList: StarItemBase[] = [];
    private _leftStarList: StarItemBase[] = [];
    private: boolean = false;
    private _heroFigure: ShowAvatar;
    private _sellPosList: number[] = [];
    private eatItem: StarItemBase;
    private _firstSelectPos: number = -1;
    public maskPic: fgui.GGraph;
    private _sourceStarInfo: StarInfo;
    private _isLock: boolean = false;
    public leftMaskPic: fgui.GGraph;
    private _leftSourceStarInfo: StarInfo;
    private _isLeftLock: boolean = false;
    private btnFinishing: fgui.GButton;
    private btnOneKeyEquip: fgui.GButton;
    private btnQuickSell: fgui.GButton;
    private btnQuickComposeConfirm: fgui.GButton;
    private avatarCom: fgui.GComponent;
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this.leftStarList.on(fgui.Events.CLICK_ITEM, this, this.onClickLeftItem);
        this.rightStarList.on(fgui.Events.CLICK_ITEM, this, this.onClickRightItem);

        //45级之前 7个
        if (isOversea()) {
            if (ArmyManager.Instance.thane.grades >= 45) {
                PlayerModel.EQUIP_STAR_BAG_COUNT = 8;
            } else {
                PlayerModel.EQUIP_STAR_BAG_COUNT = 7;
            }
        } else {
            PlayerModel.EQUIP_STAR_BAG_COUNT = 8;
        }

        this.initView();
        this.initFigure()
        this.addEvent();
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }

    private onClickLeftItem(item: StarItemBase) {
        if (!item.opened) {
            return
        }
    }

    private onClickRightItem(item: StarItemBase) {
        if (!item.opened) {
            this.starManager.sendBagCellBuy();
            return;
        }
        if (this.isProcessSell || this.isProcessCompose) {
            if (item.itemDrag.locked) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("vicepassword.description11"));
                return;
            }
            if (item.selectState == StarSelectState.Selectable) {
                item.selectState = StarSelectState.Selected
            } else if (item.selectState == StarSelectState.Selected) {
                item.selectState = StarSelectState.Selectable
            } else if (item.selectState == StarSelectState.Default && item.itemDrag.info.pos != this._firstSelectPos) {
                item.selectState = StarSelectState.Selected;
            }
        }
        this.checkComposeState();
    }

    checkComposeState() {
        if (this.cChooseCompose.selectedIndex == 0) {
            return;
        }
        let count = 0;
        this._rightStarList.forEach((item: StarItemBase) => {
            if (item.selectState == StarSelectState.Selected && item.info) {
                count++;
            }
        });
        this.btnQuickComposeConfirm.enabled = count > 0;
    }

    refresh() { }

    private initFigure() {
        this._heroFigure = new ShowAvatar(false);
        this.avatarCom.displayObject.addChild(this._heroFigure);
        this._heroFigure.pos(100, 200);
        this._heroFigure.data = DataCommonManager.thane
    }

    private initView() {
        this.cChooseSell = this.getController("cChooseSell")
        this.cChooseCompose = this.getController("cChooseCompose")
        this.leftStarList.numItems = PlayerModel.EQUIP_STAR_BAG_COUNT
        this.rightStarList.numItems = PlayerModel.PLAYER_STAR_BAG_COUNT

        for (let i: number = 0; i < PlayerModel.PLAYER_STAR_BAG_COUNT; i++) {
            let item = this.rightStarList.getChildAt(i) as StarItemBase
            this._rightStarList.push(item);
            let itemDrag = item.itemDrag
            itemDrag.bagPos = i;
            itemDrag.bagType = StarBagType.PLAYER;
        }

        for (let i: number = 0; i < PlayerModel.EQUIP_STAR_BAG_COUNT; i++) {
            let item = this.leftStarList.getChildAt(i) as StarItemBase
            this._leftStarList.push(item);
            let itemDrag = item.itemDrag
            itemDrag.bagPos = i;
            itemDrag.bagType = StarBagType.THANE;
        }

        this.refreshView()
        this.__updateStarPowHandler()
    }

    private refreshView() {
        let OPEND_BAG_CNT: number = PlayerModel.ORIGINAL_OPEN_BAG_COUNT + DataCommonManager.playerInfo.starBagCount;
        for (let i: number = 0; i < PlayerModel.PLAYER_STAR_BAG_COUNT; i++) {
            let item = this.rightStarList.getChildAt(i) as StarItemBase
            item.opened = i < OPEND_BAG_CNT

            let itemDrag = item.itemDrag
            itemDrag.resetItem()
            if (item.opened) {
                itemDrag.registerDrag()
            }
            let info = StarManager.Instance.getStarInfoByBagTypeAndPos(StarBagType.PLAYER, i);
            if (info) {
                item.info = info
            }
        }

        let openGrid = StarManager.Instance.starModel.openEquipGridNum()
        for (let i: number = 0; i < PlayerModel.EQUIP_STAR_BAG_COUNT; i++) {
            let item = this.leftStarList.getChildAt(i) as StarItemBase
            let itemDrag = item.itemDrag
            let info = StarManager.Instance.getStarInfoByBagTypeAndPos(StarBagType.THANE, i);
            if (info) {
                item.info = info
            }

            if (i < openGrid) {
                itemDrag.registerDrag()
                item.opened = true;
                item.txtOpenDesc.text = "";
            } else {
                item.opened = false;
                if (!ComponentSetting.STAR_BAG && i > 4) {
                    item.txtOpenDesc.text = LangManager.Instance.GetTranslation("public.unopen");
                } else {
                    let openLevel = OpenGrades.STAR + (i + 1 - StarModel.BASE_OPEN_EQUIP_GRID) * StarModel.ADD_GRID_LEVEL;
                    item.txtOpenDesc.text = LangManager.Instance.GetTranslation("armyII.viewII.equip.EquipView.runes", openLevel);
                }
            }
        }
    }

    private addEvent() {
        NotificationManager.Instance.addEventListener(StarEvent.UPDATE_STAR, this.__updateHandler, this);
        NotificationManager.Instance.addEventListener(StarEvent.DELETE_STAR, this.__deleteHandler, this);
        NotificationManager.Instance.addEventListener(StarEvent.UPDATE_STAR_POWER, this.__updateStarPowHandler, this);
        NotificationManager.Instance.addEventListener(StarEvent.STAR_COMPOSE, this.__starCompose, this);
        DataCommonManager.playerInfo.addEventListener(PlayerEvent.STARBAG_CAPICITY_INCRESS, this.__increaseBagHandler, this);
        NotificationManager.Instance.addEventListener(StarEvent.START_SELL_SELECT_STATUS, this.__selecteHander, this);
        NotificationManager.Instance.addEventListener(StarEvent.STAR_EXCHANGE, this.exchange, this);
        this.on(Laya.Event.CLICK, this, this.onClickHandler);
        NotificationManager.Instance.addEventListener(StarEvent.STAR_NEW_COMPOSE, this.__starNewCompose, this);
        NotificationManager.Instance.addEventListener(StarEvent.STAR_LEFT_EXCHANGE, this.leftExchange, this);
        NotificationManager.Instance.addEventListener(StarEvent.EXIT_STAR_EXCHANGE, this.resetLeftExchange, this);
        NotificationManager.Instance.addEventListener(StarEvent.EXIT_STAR_LEFT_EXCHANGE, this.resetRightExchange, this);
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(StarEvent.UPDATE_STAR, this.__updateHandler, this);
        NotificationManager.Instance.removeEventListener(StarEvent.DELETE_STAR, this.__deleteHandler, this);
        NotificationManager.Instance.removeEventListener(StarEvent.UPDATE_STAR_POWER, this.__updateStarPowHandler, this);
        NotificationManager.Instance.removeEventListener(StarEvent.STAR_COMPOSE, this.__starCompose, this);
        DataCommonManager.playerInfo.removeEventListener(PlayerEvent.STARBAG_CAPICITY_INCRESS, this.__increaseBagHandler, this);
        NotificationManager.Instance.removeEventListener(StarEvent.START_SELL_SELECT_STATUS, this.__selecteHander, this);
        NotificationManager.Instance.removeEventListener(StarEvent.STAR_EXCHANGE, this.exchange, this);
        this.off(Laya.Event.CLICK, this, this.onClickHandler);
        NotificationManager.Instance.removeEventListener(StarEvent.STAR_NEW_COMPOSE, this.__starNewCompose, this);
        NotificationManager.Instance.removeEventListener(StarEvent.STAR_LEFT_EXCHANGE, this.leftExchange, this);
        NotificationManager.Instance.removeEventListener(StarEvent.EXIT_STAR_EXCHANGE, this.resetLeftExchange, this);
        NotificationManager.Instance.removeEventListener(StarEvent.EXIT_STAR_LEFT_EXCHANGE, this.resetRightExchange, this);

    }

    private leftExchange(data: any) {
        this.leftMaskPic.visible = true;
        this._leftSourceStarInfo = data.starInfo;
        this._isLeftLock = true;
        let len: number = this.rightStarList.numChildren;
        for (let i: number = 0; i < len; i++) {
            let starItemBase: StarItemBase = this.rightStarList.getChildAt(i) as StarItemBase;
            if (starItemBase && starItemBase.opened) {
                starItemBase.flag = true;
            }
        }
        this.btnOneKeyEquip.enabled = this.btnFinishing.enabled = this.btnQuickSell.enabled = false;
        this.comStarPower.enabled = false;
    }

    private onClickHandler(event: Laya.Event) {
        if (this._isLeftLock) {
            event.stopPropagation();
            let item1: any = event.target;
            if (!item1) return;
            let item: any = item1.$owner;
            if (item instanceof StarItem) {
                if (item.info && item.info.template) {
                    if (item.info.template.TemplateId == 4) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("starTips.clickTips"));
                        return;
                    }
                    let equipPos: number = item.info.pos;
                    let sourceName: string;
                    let equipName: string
                    if (this._leftSourceStarInfo) {
                        sourceName = this._leftSourceStarInfo.template.TemplateNameLang;
                    }
                    equipName = item.info.template.TemplateNameLang;
                    let content: string = LangManager.Instance.GetTranslation("starTips.showAlert", sourceName, equipName);
                    SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean) => {
                        if (b) {
                            StarManager.Instance.starMove(this._leftSourceStarInfo.pos, StarBagType.THANE, equipPos, StarBagType.PLAYER);
                            this.leftMaskPic.visible = false;
                            this._isLeftLock = false;
                            NotificationManager.Instance.dispatchEvent(StarEvent.EXIT_STAR_LEFT_EXCHANGE);
                        }
                    });
                }
                else {
                    StarManager.Instance.starMove(this._leftSourceStarInfo.pos, StarBagType.THANE, item.bagPos, StarBagType.PLAYER);
                    this.leftMaskPic.visible = false;
                    this._isLeftLock = false;
                    NotificationManager.Instance.dispatchEvent(StarEvent.EXIT_STAR_LEFT_EXCHANGE);
                }
            }
            else {
                let content: string = LangManager.Instance.GetTranslation("starTips.showAlert2");
                SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean) => {
                    if (b) {
                        this.leftMaskPic.visible = false;
                        this._isLeftLock = false;
                        NotificationManager.Instance.dispatchEvent(StarEvent.EXIT_STAR_LEFT_EXCHANGE);
                    }
                });
            }
        }
        else if (this._isLock) {
            event.stopPropagation();
            let item1: any = event.target;
            if (!item1) return;
            let item: any = item1.$owner;
            if (item instanceof StarItem) {
                if (item.opened) {
                    if (item.info && item.info.template) {
                        let equipPos: number = item.info.pos;
                        let sourceName: string;
                        let equipName: string
                        if (this._sourceStarInfo) {
                            sourceName = this._sourceStarInfo.template.TemplateNameLang;
                        }
                        equipName = item.info.template.TemplateNameLang;
                        let content: string = LangManager.Instance.GetTranslation("starTips.showAlert", sourceName, equipName);
                        SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean) => {
                            if (b) {
                                StarManager.Instance.starMove(this._sourceStarInfo.pos, StarBagType.PLAYER, equipPos, StarBagType.THANE);
                                this.maskPic.visible = false;
                                this._isLock = false;
                                NotificationManager.Instance.dispatchEvent(StarEvent.EXIT_STAR_EXCHANGE);
                            }
                        });
                    }
                    else {
                        StarManager.Instance.starMove(this._sourceStarInfo.pos, StarBagType.PLAYER, item.bagPos, StarBagType.THANE);
                        this.maskPic.visible = false;
                        this._isLock = false;
                        NotificationManager.Instance.dispatchEvent(StarEvent.EXIT_STAR_EXCHANGE);
                    }
                }
                else {
                    let content: string = LangManager.Instance.GetTranslation("starTips.showAlert2");
                    SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean) => {
                        if (b) {
                            this.maskPic.visible = false;
                            this._isLock = false;
                            NotificationManager.Instance.dispatchEvent(StarEvent.EXIT_STAR_EXCHANGE);
                        }
                    });
                }
            }
            else {
                let content: string = LangManager.Instance.GetTranslation("starTips.showAlert2");
                SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean) => {
                    if (b) {
                        this.maskPic.visible = false;
                        this._isLock = false;
                        NotificationManager.Instance.dispatchEvent(StarEvent.EXIT_STAR_EXCHANGE);
                    }
                });
            }
        }
    }

    private __updateHandler(info: StarInfo) {
        if (info.bagType == StarBagType.PLAYER) {
            let item = this._rightStarList[info.pos] as StarItemBase;
            if (item) item.info = info;
        }
        if (info.bagType == StarBagType.THANE) {
            var item = this._leftStarList[info.pos] as StarItemBase;
            if (item) item.info = info;
        }
    }

    private __deleteHandler(info: StarInfo) {
        if (info.bagType == StarBagType.PLAYER) {
            let item = this._rightStarList[info.pos] as StarItemBase;
            if (item) item.info = null;
        }
        if (info.bagType == StarBagType.THANE) {
            var item = this._leftStarList[info.pos] as StarItemBase;
            if (item) item.info = null;
        }
    }

    private __updateStarPowHandler() {
        if (this.isShowing && !this.destroyed) {
            this.comStarPower.getChild("title").asLabel.text = String(this.starManager.starModel.getStarPow());
            FUIHelper.setTipData(
                this.comStarPower,
                EmWindow.StarPowerTip,
                this.starManager.getStarListByBagType(StarBagType.THANE),
                new Laya.Point(-136, -27)
            )
        }
    }

    private __starNewCompose(data: any) {
        let compose = data.compose
        this.gOptNormal.visible = !compose;
        this.cChooseCompose.selectedIndex = compose ? 1 : 0;
        this.leftStarList.touchable = !compose;
        this.eatItem = this.leftStarList.getChildAt(data.pos) as StarItemBase;
        this.setPlayerStarItemsState(StarSelectState.Selectable);
        this.btnQuickComposeConfirm.enabled = !compose;
    }

    private __starCompose(data: any) {
        let compose = data.compose
        this.gOptNormal.visible = !compose;
        this.cChooseCompose.selectedIndex = compose ? 1 : 0;
        this.btnQuickComposeConfirm.enabled = !compose;
        this.leftStarList.touchable = !compose;
        this._firstSelectPos = data.pos;
        if (compose && (data.pos || data.pos == 0)) {
            let item = this.rightStarList.getChildAt(data.pos) as StarItemBase;
            this.eatItem = item;
            this.setPlayerStarItemsState(StarSelectState.Selectable);
            item.gray();
            item.selectState = StarSelectState.Default;
        } else {
            this.eatItem.normal();
            this.eatItem = null;
            this.setPlayerStarItemsState(StarSelectState.Default);
        }
    }

    private __increaseBagHandler() {
        for (let i: number = PlayerModel.ORIGINAL_OPEN_BAG_COUNT; i < PlayerModel.ORIGINAL_OPEN_BAG_COUNT + DataCommonManager.playerInfo.starBagCount; i++) {
            if (i < PlayerModel.PLAYER_STAR_BAG_COUNT) {
                let openItem = this._rightStarList[i] as StarItemBase;
                if (openItem.opened == false) {
                    openItem.itemDrag.registerDrag();
                    openItem.opened = true;
                }
            }
        }
        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("armyII.viewII.horoscope.PlayerStarListView.command01"));
    }

    private __selecteHander(type: number) {
        this._rightStarList.forEach((item: StarItemBase) => {
            if (item && item.itemDrag && item.itemDrag.info
                && item.itemDrag.info.template) {
                if (item.itemDrag.info.pos != this._firstSelectPos && !item.itemDrag.locked) {
                    if (item.itemDrag.info.template.Profile <= type) {
                        item.selectState = StarSelectState.Selected;
                    } else if (item.itemDrag.info.template.Profile > type) {
                        item.selectState = StarSelectState.Selectable;
                    }
                }
            }
        });
        this.checkComposeState();
    }

    private exchange(data: any) {
        this.maskPic.visible = true;
        this._sourceStarInfo = data.starInfo;
        this._isLock = true;
        let len: number = this.leftStarList.numChildren;
        for (let i: number = 0; i < len; i++) {
            let starItemBase: StarItemBase = this.leftStarList.getChildAt(i) as StarItemBase;
            if (starItemBase && starItemBase.opened) {
                starItemBase.flag = true;
            }
        }
        this.comStarPower.enabled = false;
    }

    private resetLeftExchange() {
        let len: number = this.leftStarList.numChildren;
        for (let i: number = 0; i < len; i++) {
            let starItemBase: StarItemBase = this.leftStarList.getChildAt(i) as StarItemBase;
            if (starItemBase && starItemBase.opened) {
                starItemBase.flag = false;
            }
        }
        this.comStarPower.enabled = true;
    }

    private resetRightExchange() {
        let len: number = this.rightStarList.numChildren;
        for (let i: number = 0; i < len; i++) {
            let starItemBase: StarItemBase = this.rightStarList.getChildAt(i) as StarItemBase;
            if (starItemBase && starItemBase.opened) {
                starItemBase.flag = false;
            }
        }
        this.btnOneKeyEquip.enabled = this.btnFinishing.enabled = this.btnQuickSell.enabled = true;
        this.comStarPower.enabled = true;
    }

    private btnOneKeyEquipClick() {
        let playerDic = this.starManager.getStarListByBagType(StarBagType.PLAYER);
        if (playerDic.getList().length == 0) {
            return
        }

        let equipIdlePosList: number[] = this.starManager.getStarEquipBagIdlePosList()
        let equipIdleNum: number = equipIdlePosList.length
        if (equipIdleNum == 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.command05"));
            return
        }

        //已装备的类型
        let equipMasterList = {}
        let equipDic = this.starManager.getStarListByBagType(StarBagType.THANE);
        equipDic.getList().forEach((info: StarInfo) => {
            equipMasterList[info.template.MasterType] = true
        });

        // 从右边找equipIdleNum个自动装备的星运
        let needEquipListDic = new SimpleDictionary()
        let needEquipList: StarInfo[] = needEquipListDic.getList();
        playerDic.getList().forEach((info: StarInfo, pos: number) => {
            if (!equipMasterList[info.template.MasterType] && info.template.Profile != 6) {
                let existInfo = needEquipListDic.get(info.template.MasterType)
                let bMorePower = (existInfo && StarHelper.getStarTotalExp(info) > StarHelper.getStarTotalExp(existInfo))
                if (!existInfo || bMorePower) {
                    needEquipListDic.add(info.template.MasterType, info)
                }
            }
        });

        if (needEquipList.length == 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("StarBagWnd.NotFindSuitableEquip"));
            return
        }
        needEquipList.sort((a, b) => { return StarHelper.getStarTotalExp(b) - StarHelper.getStarTotalExp(a) })

        // 发送移动协议
        let len = needEquipList.length > equipIdleNum ? equipIdleNum : needEquipList.length
        for (let index = 0; index < len; index++) {
            const info = needEquipList[index];
            StarManager.Instance.starMove(info.pos, StarBagType.PLAYER, equipIdlePosList[index], StarBagType.THANE);
        }
    }

    private btnOneKeyComposeClick() {
        this.starManager.oneKeyCompose(StarBagType.PLAYER);
    }

    //整理临时背包
    private btnFinishingClick() {
        this.starManager.sendBtnFinishing();
    }

    // 快速出售
    private btnQuickSellClick() {
        this.gOptNormal.visible = false;
        this.cChooseSell.selectedIndex = 1;
        this.setPlayerStarItemsState(StarSelectState.Selectable);
        this.leftStarList.touchable = false;
    }

    private btnQuickSellCancelClick() {
        this.gOptNormal.visible = true;
        this.cChooseSell.selectedIndex = 0;
        this.setPlayerStarItemsState(StarSelectState.Default);
        this.leftStarList.touchable = true;
    }

    private btnQuickSellConfirmClick() {
        let hasComposed: boolean = false;
        this.leftStarList.touchable = true;
        let totalPrice = 0
        this._sellPosList = []
        this._rightStarList.forEach((item: StarItemBase) => {
            if (item.info && item.selectState == StarSelectState.Selected) {
                totalPrice += item.info.template.SellGold
                this._sellPosList.push(item.info.pos);
                if (item.info.grade > 1 || item.info.gp > 0) {
                    hasComposed = true;
                }
            }
        });
        if (hasComposed) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("star.view.StarIconView.composedTip"));
            return;
        }

        if (totalPrice <= 0) return;
        let content = LangManager.Instance.GetTranslation("StarBagWnd.SellStarTip", totalPrice)
        SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean) => {
            if (b && this._sellPosList.length > 0) {
                this.gOptNormal.visible = true;
                this.cChooseSell.selectedIndex = 0;
                this.setPlayerStarItemsState(StarSelectState.Default);
                this.starManager.sendBatchOpt(1, undefined, this._sellPosList);
            }
        });
    }

    //快递选择
    private btnQuickSelectClick() {
        this.gOptNormal.visible = false;
        FrameCtrlManager.Instance.open(EmWindow.StarSellSelectWnd);
    }

    // 取消合成
    private btnQuickComposeCancelClick() {
        this.gOptNormal.visible = true;
        this.cChooseCompose.selectedIndex = 0;
        NotificationManager.Instance.dispatchEvent(StarEvent.STAR_COMPOSE_COMPLETE);
        this.__starCompose({ compose: false });
        this.leftStarList.touchable = true;
    }
    // 确认合成 
    private btnQuickComposeConfirmClick() {
        if (!this.eatItem || !this.eatItem.info || !this.eatItem.info.template) return;

        let sEatInfo: StarInfo = this.eatItem.info
        let totalGP: number = 0
        let beEatenStarArr = [];
        let beginType: number = 0;
        this._rightStarList.forEach((item: StarItemBase) => {
            if (item.selectState == StarSelectState.Selected && item.info) {
                totalGP += StarHelper.getStarTotalExp(item.info);
                beginType = item.info.bagType;
                beEatenStarArr.push(item.info.pos)
            }
        });
        if (totalGP <= 0) return;
        let tempName: string = StarHelper.getStarHtmlName(this.eatItem.info.template);
        let content = LangManager.Instance.GetTranslation("StarBagWnd.ComposeStarTip", tempName, totalGP);
        var tempLevel: number = StarHelper.checkCanUpGrade(totalGP, sEatInfo);
        if (tempLevel > sEatInfo.grade) {
            content += LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.Level.up", tempLevel);
        }
        SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean) => {
            if (b && beEatenStarArr.length > 0) {
                this.starManager.sendBatchOpt(2, sEatInfo.pos, beEatenStarArr, beginType, sEatInfo.bagType);
                NotificationManager.Instance.dispatchEvent(StarEvent.STAR_COMPOSE_COMPLETE);
                this.__starCompose({ compose: false });
            }
        });
    }

    private setPlayerStarItemsState(state: StarSelectState) {
        let len: number = this._rightStarList.length;
        for (let index = 0; index < len; index++) {
            const item = this._rightStarList[index] as StarItemBase;
            item.selectState = state
        }
    }

    // 售出进行中
    private get isProcessSell(): boolean {
        return this.cChooseSell.selectedIndex == 1;
    }
    // 合成进行中
    private get isProcessCompose(): boolean {
        return this.cChooseCompose.selectedIndex == 1;
    }

    private get starManager(): StarManager {
        return StarManager.Instance;
    }

    public dispose() {
        ObjectUtils.disposeObject(this._heroFigure);
        this.removeEvent();
        super.dispose()
    }
}
