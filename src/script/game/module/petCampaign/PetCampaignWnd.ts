import FUI_PetCampaignBackBtn from '../../../../fui/PetCampaign/FUI_PetCampaignBackBtn';
// import FUI_PetCampaignItem from '../../../../fui/PetCampaign/FUI_PetCampaignItem';
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import { IconFactory } from '../../../core/utils/IconFactory';
import Utils from '../../../core/utils/Utils';
import { BaseItem } from '../../component/item/BaseItem';
import { t_s_uiplaylevelData } from '../../config/t_s_uiplaylevel';
import ColorConstant from '../../constant/ColorConstant';
import { PlayerEvent } from '../../constant/event/PlayerEvent';
import { EmWindow } from '../../constant/UIDefine';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import { ArmyManager } from '../../manager/ArmyManager';
import FreedomTeamManager from '../../manager/FreedomTeamManager';
import { GoodsManager } from '../../manager/GoodsManager';
import { MessageTipManager } from '../../manager/MessageTipManager';
import { PetCampaignManager } from '../../manager/PetCampaignManager';
import { PlayerManager } from '../../manager/PlayerManager';
import { ResourceManager } from '../../manager/ResourceManager';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import FUIHelper from '../../utils/FUIHelper';
import { eMopupState, eMopupType } from '../mopup/MopupData';
import { PetData } from '../pet/data/PetData';
import { PetCampaignEvent } from './enum/PetCampaignEnum';
import PetCampaignLevelItem from './item/PetCampaignLevelItem';
import PetCampaignModel from './PetCampaignModel';
import UserUiPlayInfoMsg = com.road.yishi.proto.uiplay.UserUiPlayInfoMsg;
import { TempleteManager } from '../../manager/TempleteManager';
import ItemID from '../../constant/ItemID';
import BaseTipItem from '../../component/item/BaseTipItem';
import TemplateIDConstant from '../../constant/TemplateIDConstant';
import { ShopGoodsInfo } from '../shop/model/ShopGoodsInfo';
import UIButton from '../../../core/ui/UIButton';
import UIManager from '../../../core/ui/UIManager';
import { SocketSendManager } from '../../manager/SocketSendManager';
import { BagEvent, NotificationEvent } from '../../constant/event/NotificationEvent';
import { NotificationManager } from '../../manager/NotificationManager';
export default class PetCampaignWnd extends BaseWindow {

    private TabList: fgui.GList = null;//导航按钮组
    private tree: fgui.GList = null;//导航按钮组
    private itemList: fgui.GList = null;//导航按钮组
    private frame: fgui.GLabel;
    private tabListData: string[];
    private titleArrs: string[];
    private curList: t_s_uiplaylevelData[];
    private _mayFallItemList: any[];
    private btnChallenge: any;
    private txtReward: fgui.GLabel;
    private txtTip: fgui.GLabel;
    private txtLevelTitle: fgui.GLabel;
    private _mainDafaultSelectIndex: number = 0;
    public btnBack: FUI_PetCampaignBackBtn;
    private txtSweepCost: fgui.GTextField;
    private txtChallengeCost: fgui.GTextField;
    private txtRequireTip: fgui.GTextField;
    private DescriptionTip: fgui.GTextField;
    private txt_grade: fgui.GTextField;
    private txt_count: fgui.GTextField;
    private txtSweepTip: fgui.GLabel;
    private _selectedLevelData: t_s_uiplaylevelData;
    public gSweep: fgui.GGroup;
    public challenge: fgui.GGroup;
    public lookReward: fgui.GButton;
    public btnSweep: fgui.GButton;
    public btn_buy: fgui.GButton;
    private _maxLevelSort: number;
    private pet_battle_count: number;
    /** 剩余收益次数 */
    private leftRewardCount: number = 0;
    public effect: fgui.Controller;
    public getRewardCtr: fgui.Controller;
    private _isCanGet: boolean = false;
    private tipItem1: BaseTipItem;
    private tipItem2: BaseTipItem;
    public OnInitWind() {
        this.setCenter();
        this.effect = this.getController("effect");
        this.getRewardCtr = this.getController("getRewardCtr");
        let cfg = TempleteManager.Instance.getConfigInfoByConfigName("pet_battle_count");
        if (cfg) {
            this.pet_battle_count = parseInt(cfg.ConfigValue);
        }
        if (PetCampaignManager.ISLOGIN) {
            PetCampaignManager.ISLOGIN = false;
            this.leftRewardCount = PetCampaignManager.Instance.model.leftRewardCount = this.pet_battle_count - PetCampaignManager.Instance.model.userUiPlayListMsg.uiPlayRewardCount
        } else {
            this.leftRewardCount = PetCampaignManager.Instance.model.leftRewardCount;
        }
        this.updateRewardCount();
        PetCampaignManager.Instance.model.parseConfig();
        this.addEvent();
        this.initView();
        this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    }

    private addEvent() {
        this.txtSweepTip.text = LangManager.Instance.GetTranslation("MopupWnd.Sweep.Tip");
        this.tree.itemRenderer = Laya.Handler.create(this, this.renderLevelListItem, null, false);
        this.itemList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        Utils.setDrawCallOptimize(this.itemList);
        this.TabList.on(fairygui.Events.CLICK_ITEM, this, this.onTabClick);
        this.tree.on(fairygui.Events.CLICK_ITEM, this, this.onTreeClick);
        this.btnChallenge.onClick(this, this.onBtnChallenge);
        PetCampaignManager.Instance.model.addEventListener(PetCampaignEvent.PET_CAMPAIGN_JUMP_LEVEL, this.onJumpLevel, this);
        PetCampaignManager.Instance.addEventListener(PetCampaignEvent.PET_CAMPAIGN_TREE_SELECT, this.refreshLeft, this);
        // this.btnBack.onClick(this, this.btnBackHandler);
        this.lookReward.onClick(this, this.lookRewardHandler);
        PetCampaignManager.Instance.addEventListener(PetCampaignEvent.PET_CAMPAIGN_UPDATE, this.updateRewardStatus, this);
        this.btnSweep.onClick(this, this.btnSweepHandler);
        this.btn_buy.onClick(this, this.onBuy);
        this.playerInfo.addEventListener(PlayerEvent.WEARY_CHANGE, this.refreshPower, this);
    }

    private offEvent() {
        // this.tree.itemRenderer.recover();
        // this.itemList.itemRenderer.recover();
        Utils.clearGListHandle(this.tree);
        Utils.clearGListHandle(this.itemList);
        this.btn_buy.offClick(this, this.onBuy);
        this.TabList.off(fairygui.Events.CLICK_ITEM, this, this.onTabClick);
        this.tree.off(fairygui.Events.CLICK_ITEM, this, this.onTreeClick);
        this.btnChallenge.offClick(this, this.onBtnChallenge);
        PetCampaignManager.Instance.model.removeEventListener(PetCampaignEvent.PET_CAMPAIGN_JUMP_LEVEL, this.onJumpLevel, this);
        PetCampaignManager.Instance.removeEventListener(PetCampaignEvent.PET_CAMPAIGN_TREE_SELECT, this.refreshLeft, this);
        // this.btnBack.offClick(this, this.btnBackHandler);
        this.lookReward.offClick(this, this.lookRewardHandler);
        PetCampaignManager.Instance.removeEventListener(PetCampaignEvent.PET_CAMPAIGN_UPDATE, this.updateRewardStatus, this);
        this.btnSweep.offClick(this, this.btnSweepHandler);
        this.playerInfo.removeEventListener(PlayerEvent.WEARY_CHANGE, this.refreshPower, this);
    }

    private initView() {
        this.initText();
        this.initTabList();
        if (this.frameData) {
            this.petCampaignModel.curPlayID = this.frameData.playId;
            let index = this.petCampaignModel.playIdArrs.indexOf(this.frameData.playId);
            this.TabList.selectedIndex = index;
            this.onTabClick();
            // PetCampaignManager.Instance.model.setUiPlay(index);
        }
        else {
            this.TabList.selectedIndex = 0;
            this.onTabClick();
        }
    }

    private initTabList() {
        this.tabListData = PetCampaignManager.Instance.model.getTabListData();
        this.titleArrs = [];
        this.tabListData.forEach(value => {
            let btn: fgui.GButton = <fgui.GButton>this.TabList.addItemFromPool().asButton;
            btn.selected = false;
            btn.text = value;
            this.titleArrs.push(value);
        });
        this.TabList.ensureBoundsCorrect();
        this.effect.selectedIndex = 0;
    }

    private propNum: number = 0;
    private onBuy() {
        //剩余收益次数: ”+玩家具体收益次数
        let str = LangManager.Instance.GetTranslation('PetCampaignLeftRewardTimes', this.leftRewardCount);
        let content: string = str + '<br>' + LangManager.Instance.GetTranslation("petCampaign.useProp");
        this.propNum = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_CRUSADE);
        let goodsCount: string = LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + this.propNum;
        UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, { content: content, goodsId: TemplateIDConstant.TEMP_ID_CRUSADE, goodsCount: goodsCount, hidecheck1: true, autoClose: this.propNum <= 1, callback: this.quickSubmit.bind(this) });
    }

    private quickSubmit(b: boolean, flag: boolean) {
        if (b) {
            if (this.propNum <= 0) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('petCampaign.useProp2'));
            } else {
                let goods: GoodsInfo[] = GoodsManager.Instance.getBagGoodsByTemplateId(TemplateIDConstant.TEMP_ID_CRUSADE);
                if (goods && goods[0]) {
                    SocketSendManager.Instance.sendUseItem(goods[0].pos);
                }
            }
        }
    }

    private refreshByTab() {
        // this.frame.getChild('title').text = this.titleArrs[this.TabList.selectedIndex];
        this.refreshView();
    }

    OnShowWind() {
        super.OnShowWind();

    }

    private initText() {
        this.txtTip.text = LangManager.Instance.GetTranslation('selectcampaign.view.mayFall');
        this.txtReward.text = LangManager.Instance.GetTranslation('yishi.view.tips.SinglePassRewardTip.firstKill');
    }

    private refreshView() {
        // if (this.c1Control.selectedIndex == 0) {
        //     this._mainDafaultSelectIndex = this.getMainDafaultSelectIndex();
        //     let item1 = this.item1 as PetCampaignItem;
        //     item1.index = this._mainDafaultSelectIndex;
        //     item1.vdata = PetCampaignManager.Instance.model.getUiPlayBaseByIndex(this._mainDafaultSelectIndex);
        //     let item2 = this.item2 as PetCampaignItem;
        //     item2.index = this._mainDafaultSelectIndex + 1;
        //     item2.vdata = PetCampaignManager.Instance.model.getUiPlayBaseByIndex(this._mainDafaultSelectIndex + 1);
        // } else {
        this.curList = PetCampaignManager.Instance.model.getCurLevelList();
        this.tree.numItems = this.curList.length;
        this.tree.ensureBoundsCorrect();
        if (this.petCampaignModel.levelSort > 0) {
            let maxLevel = this.petCampaignModel.levelSort >= this.tree.numItems ? this.tree.numItems : this.petCampaignModel.levelSort;
            this.tree.scrollToView(maxLevel - 1);
        }
        // }
    }

    private refreshLeft() {
        this._selectedLevelData = PetCampaignManager.Instance.model.getCurLevelData();
        if (!this._selectedLevelData) return;
        this.txtRequireTip.text = LangManager.Instance.GetTranslation("petCampaign.txtRequireTip", this._selectedLevelData.Grade);
        //海外翻译新增
        this.txtLevelTitle.text = LangManager.Instance.GetTranslation("petCampaign.Level", this._selectedLevelData.UiLevelSort);
        this.DescriptionTip.text = LangManager.Instance.GetTranslation("petCampaign.DescriptionTip", this._selectedLevelData.DescriptionLang);
        this.txtSweepCost.text = this._selectedLevelData.ContinuityGold.toString();
        this.txtChallengeCost.text = this._selectedLevelData.ConsumeNum.toString();
        this.txtChallengeCost.color = this.getTxtChallengeColor();
        this.txtSweepCost.color = this.getTxtSweepCostColor();
        if (this._selectedLevelData.IsContinuity == 0) {//不能扫荡
            this.gSweep.visible = false;
        }
        else {
            this.gSweep.visible = true;
        }
        if (this._selectedLevelData.ConsumeType != 0) {//不是消耗体力
            this.tipItem2.setInfo(this._selectedLevelData.ConsumeType);
        }
        else {
            this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_POWER);
        }
        this.btnSweep.enabled = this.petCampaignModel.levelSort >= this._selectedLevelData.UiLevelSort ? true : false;
        this.txtSweepTip.visible = !this.btnSweep.enabled;
        this._mayFallItemList = [];
        let mayFallIdList = this._selectedLevelData.Item;
        let strArr = mayFallIdList.split("|");
        if (strArr) {
            for (let index = 0; index < strArr.length; index++) {
                let info: GoodsInfo = new GoodsInfo();
                info.templateId = parseInt(strArr[index].split(',')[0]);
                info.count = parseInt(strArr[index].split(',')[1]);
                this._mayFallItemList.push(info);
            }
        }
        this.itemList.numItems = this._mayFallItemList.length;
        this.itemList.ensureBoundsCorrect();
        // if (this._selectedLevelData.UiLevelSort > this._maxLevelSort) {
        //     this.gSweep.enabled = false;
        // } else {
        //     this.gSweep.enabled = true;
        // }
        this.updateRewardStatus(null);
        if (this._selectedLevelData.Grade > ArmyManager.Instance.thane.grades) {
            this.txt_grade.text = this._selectedLevelData.Grade + LangManager.Instance.GetTranslation("battle.logsys.BattleLogStarView.open");
        } else {
            this.txt_grade.text = '';
        }
    }
    private updateRewardStatus(msg: UserUiPlayInfoMsg) {
        let isItemAdd: boolean = false;
        if (msg && msg.itemAdd) {//增加次数
            isItemAdd = true;
            this.leftRewardCount = PetCampaignManager.Instance.model.leftRewardCount = this.pet_battle_count - msg.uiPlayRewardCount;
        }
        let item: UserUiPlayInfoMsg;
        this._maxLevelSort = 0;
        let len: number = PetCampaignManager.Instance.model.userUiPlayListMsg.uiPlayInfoList.length;
        for (let i: number = 0; i < len; i++) {
            item = PetCampaignManager.Instance.model.userUiPlayListMsg.uiPlayInfoList[i] as UserUiPlayInfoMsg;
            if (item && item.playId == this.petCampaignModel.curPlayID) {
                this._maxLevelSort = item.levelSort;
                if (item.uiPlayRewardCount && !isItemAdd && msg) {
                    this.leftRewardCount = PetCampaignManager.Instance.model.leftRewardCount = this.pet_battle_count - item.uiPlayRewardCount;
                }
                break;
            }
        }
        this.txtReward.visible = true;
        this.lookReward.visible = true;
        this.lookReward.enabled = true;
        this.getRewardCtr.selectedIndex = 0;
        this.effect.selectedIndex = 0;
        this._isCanGet = false;
        if (this._selectedLevelData.FristReward == 0) {//没有配置首通奖励
            this.lookReward.visible = false;
            this.txtReward.visible = false;
        }
        else {
            if (this._selectedLevelData.UiLevelSort <= this._maxLevelSort) {//通关
                if (item && item.firstRewardSet.indexOf(this._selectedLevelData.UiLevelSort) != -1) {//已经领取
                    this.lookReward.enabled = false;
                    this.getRewardCtr.selectedIndex = 1;
                }
                else {
                    this.effect.selectedIndex = 1;
                    this._isCanGet = true;
                }
            }
        }
        this.updateRewardCount();
        if (msg && msg.itemAdd) {//增加次数
            this.propNum = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_CRUSADE);
            let str = LangManager.Instance.GetTranslation('PetCampaignLeftRewardTimes', this.leftRewardCount);
            let content: string = str + '<br>' + LangManager.Instance.GetTranslation("petCampaign.useProp");
            this.propNum = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_CRUSADE);
            let goodsCount: string = LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + this.propNum;
            let params = { content: content, goodsId: TemplateIDConstant.TEMP_ID_CRUSADE, goodsCount: goodsCount, hidecheck1: true, propNum: this.propNum, autoClose: this.propNum <= 1, callback: this.quickSubmit.bind(this) };
            NotificationManager.Instance.dispatchEvent(NotificationEvent.USE_PROP, params);
        }
    }

    private updateRewardCount() {

        this.txt_count.text = LangManager.Instance.GetTranslation('PetCampaignLeftRewardTimes', this.leftRewardCount);
    }

    private onJumpLevel() {
        // this.c1Control.selectedIndex = 1;
        this.refreshView();
    }

    private onBtnChallenge() {
        if (!this._selectedLevelData) return;
        if (this.checkInTeam()) return
        if (this._selectedLevelData.Grade > ArmyManager.Instance.thane.grades) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("room.view.pve.instance.InstanceRightView.command04", this._selectedLevelData.Grade));
            return;
        }
        //判断玩家当前收益次数是否足够消耗所需次数, 若不足, 则飘文字提示“收益次数不足”
        if (this.leftRewardCount < 1) {
            this.propNum = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_CRUSADE);
            if (this.propNum > 0) {
                this.onBuy();
            } else {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.notEnoughIncome"));
            }
            return;
        }
        if (this._selectedLevelData.ConsumeType == 0) {//消耗体力
            let hasEnergy: number = PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
            if (hasEnergy < this._selectedLevelData.ConsumeNum) {
                if (this.hasWearyMedicine()) {//背包拥有体力药水时,弹出体力补充弹窗
                    FrameCtrlManager.Instance.open(EmWindow.WearySupplyWnd, { type: 1 });
                    return;
                } else if (!this.hasWearyMedicine()) {//背包无体力药水时
                    if (this.todayCanBuyWearyMedicine()) {//今日还能购买, 弹出高级体力药水快捷购买弹窗
                        let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(ItemID.WEARY_MEDICINE3);
                        if (info) {
                            FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info });
                            return;
                        }
                    } else {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("petCampaign.challengeTips1"));
                        return;
                    }
                }
            }
        }
        else {
            let hasGoodsCount: number = GoodsManager.Instance.getGoodsNumByTempId(this._selectedLevelData.ConsumeType);
            if (hasGoodsCount < this._selectedLevelData.ConsumeNum) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("petCampaign.challengeTips2"));
                return;
            }
        }
        let flag: boolean = false;
        for (let i: number = 0; i < this.petInfoList.length; i++) {
            let item: PetData = this.petInfoList[i];
            if (item && item.isEnterWar) {
                flag = true;
                break;
            }
        }
        if (!flag) {//没有携带英灵
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("PetCampaignResultWnd.nextBtnTips"));
            return;
        }
        PetCampaignManager.Instance.sendUIPlayChallenge(PetCampaignModel.ENTER_BATTLE, this.petCampaignModel.curPlayID, this.petCampaignModel.curLevelData.UiLevelId);
    }

    public hasWearyMedicine(): boolean {
        let num0: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE0)
        let num1: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE1)
        let num2: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE2)
        let num3: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE3)
        return num0 > 0 || num1 > 0 || num2 > 0 || num3 > 0
    }

    //今日是否还能购买高级体力药水
    private todayCanBuyWearyMedicine(): boolean {
        let flag: boolean = false;
        let shopGoodsInfo: any = TempleteManager.Instance.getShopTempInfoByItemId(ItemID.WEARY_MEDICINE3);
        let num: number = shopGoodsInfo.canOneCount;
        if (num > 0) {
            flag = true;
        }
        return flag;
    }

    private renderLevelListItem(index: number, item: PetCampaignLevelItem) {
        item.setIndex(index);
        item.vdata = this.curList[index];
    }

    private renderListItem(index: number, item: BaseItem) {
        let itemData = this._mayFallItemList[index];
        item.info = itemData ? itemData : null
    }

    private btnSweepHandler() {
        //判断玩家当前收益次数是否足够消耗所需次数, 若不足, 则飘文字提示“收益次数不足”
        if (this.leftRewardCount < 1) {
            this.propNum = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_CRUSADE);
            if (this.propNum > 0) {
                this.onBuy();
            } else {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("room.view.pve.RoomRightView.notEnoughIncome"));
            }
            return;
        }
        if (this._selectedLevelData.ConsumeType == 0) {//消耗体力
            let hasEnergy: number = PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
            if (hasEnergy < this._selectedLevelData.ConsumeNum) {
                if (this.hasWearyMedicine()) {//背包拥有体力药水时,弹出体力补充弹窗
                    FrameCtrlManager.Instance.open(EmWindow.WearySupplyWnd, { type: 1 });
                    return;
                } else if (!this.hasWearyMedicine()) {//背包无体力药水时
                    if (this.todayCanBuyWearyMedicine()) {//今日还能购买, 弹出高级体力药水快捷购买弹窗
                        let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(ItemID.WEARY_MEDICINE3);
                        if (info) {
                            FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info });
                            return;
                        }
                    } else {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("petCampaign.challengeTips1"));
                        return;
                    }
                }
            }
        }
        else {
            let hasGoodsCount: number = GoodsManager.Instance.getGoodsNumByTempId(this._selectedLevelData.ConsumeType);
            if (hasGoodsCount < this._selectedLevelData.ConsumeNum) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("petCampaign.challengeTips2"));
                return;
            }
        }

        FrameCtrlManager.Instance.open(EmWindow.Mopup, { type: eMopupType.PetCampaignMopup, state: eMopupState.PetCampaignMopupPre, levelData: this._selectedLevelData })
    }

    private refreshPower() {
        this.txtChallengeCost.color = this.getTxtChallengeColor();
        this.txtSweepCost.color = this.getTxtSweepCostColor();
    }

    // private btnBackHandler() {
    //     this.c1Control.selectedIndex = 0;
    // }

    private lookRewardHandler() {
        FrameCtrlManager.Instance.open(EmWindow.PetGetRewardWnd, { selectedData: this._selectedLevelData, flag: this._isCanGet });
    }

    /**切换Tab */
    private onTabClick() {
        PetCampaignManager.Instance.model.setUiPlay(this.TabList.selectedIndex);
        this.refreshByTab();
    }

    private onTreeClick(item: PetCampaignLevelItem) {
        if (this.petCampaignModel.levelSort < item.index) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("petCampaign.onTreeClick"));
            return;
        }
        if (item.isSelect.selectedIndex == 1) return;
        PetCampaignManager.Instance.model.setSelectIndex(item.index);
    }

    private getTxtChallengeColor(): string {
        let str: string = ColorConstant.LIGHT_TEXT_COLOR;
        if (!this._selectedLevelData) return str;
        if (this._selectedLevelData.ConsumeType == 0) {//消耗体力
            let hasEnergy: number = PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
            if (hasEnergy < this._selectedLevelData.ConsumeNum) {
                str = ColorConstant.RED_COLOR;
            }
        }
        else {
            let hasGoodsCount: number = GoodsManager.Instance.getGoodsNumByTempId(this._selectedLevelData.ConsumeType);
            if (hasGoodsCount < this._selectedLevelData.ConsumeNum) {
                str = ColorConstant.RED_COLOR;
            }
        }
        return str
    }

    private getTxtSweepCostColor(): string {
        let str: string = ColorConstant.LIGHT_TEXT_COLOR;
        if (this._selectedLevelData.ContinuityGold > ResourceManager.Instance.gold.count) {
            str = ColorConstant.RED_COLOR;
        }
        return str;
    }

    private getMainDafaultSelectIndex(): number {
        return 0;
    }

    private get petCampaignModel(): PetCampaignModel {
        return PetCampaignManager.Instance.model;
    }

    private get petInfoList(): any[] {
        return PlayerManager.Instance.currentPlayerModel.playerInfo.petList;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private checkInTeam(): boolean {
        let thane = ArmyManager.Instance.thane
        let model = FreedomTeamManager.Instance.model
        let inTeam = model && Boolean(model.getMemberByUserId(thane.userId))
        if (inTeam) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("petCampaign.data.CanNotBegainPetCampaignInTeam"))
        }
        return inTeam;
    }

    OnHideWind() {
        super.OnHideWind();
        this.offEvent();
    }
}

