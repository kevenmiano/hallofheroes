// @ts-nocheck
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow"
import Dictionary from "../../../core/utils/Dictionary";
import { IconFactory } from "../../../core/utils/IconFactory";
import Utils from "../../../core/utils/Utils";
import { BaseItem } from "../../component/item/BaseItem";
import { t_s_uiplaybaseData } from "../../config/t_s_uiplaybase";
import { t_s_uiplaylevelData } from "../../config/t_s_uiplaylevel";
import { ConfigType } from "../../constant/ConfigDefine";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PetCampaignManager } from "../../manager/PetCampaignManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import FUIHelper from "../../utils/FUIHelper";
import { PetData } from "../pet/data/PetData";
import PetCampaignModel from "./PetCampaignModel";
import UserUiPlayInfoMsg = com.road.yishi.proto.uiplay.UserUiPlayInfoMsg;
import BattleReportMsg = com.road.yishi.proto.battle.BattleReportMsg;
import BaseItemMsg = com.road.yishi.proto.battle.BaseItemMsg;
import ItemID from "../../constant/ItemID";
import { TempleteManager } from "../../manager/TempleteManager";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { PetCampaignEvent } from "./enum/PetCampaignEnum";
import UIManager from "../../../core/ui/UIManager";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
/**
 * 英灵副本挑战胜利结算界面
 */
export default class PetCampaignResultWnd extends BaseWindow {
    public list: fgui.GList;
    public getReward: fgui.GButton;
    private _goodsList: Array<GoodsInfo>;
    private _currentData: UserUiPlayInfoMsg;
    public levelTxt: fgui.GTextField;
    public txt_count: fgui.GTextField;
    public exitBtn: fgui.GButton;
    public costIcon: fgui.GLoader;
    public costTxt: fgui.GTextField;
    public txt_grade: fgui.GTextField;
    public nextBtn: fgui.GButton;
    public nextGroup: fgui.GGroup;
    private _nextData: t_s_uiplaylevelData;
    private _battleReportMsg: BattleReportMsg;
    private _level: number;
    public btn_buy: fgui.GButton;
    private pet_battle_count: number;
    public OnInitWind() {
        this.setCenter();
        this._battleReportMsg = this.params.frameData;
        this.initEvent();
        this.initView();
        this.updateRewardStatus(null);
    }

    private initView() {
        this._currentData = this.petCampaignModel.userUiPlayInfoMsg;
        this._level = this._battleReportMsg.param1;
        let cfg = TempleteManager.Instance.getConfigInfoByConfigName("pet_battle_count");
        if (cfg) {
            this.pet_battle_count = parseInt(cfg.ConfigValue);
        }
        if (this._currentData) {
            this.txt_count.text = LangManager.Instance.GetTranslation('PetCampaignLeftRewardTimes', PetCampaignManager.Instance.model.leftRewardCount);
            let str;
            let baseDic: Map<number, t_s_uiplaybaseData> = ConfigMgr.Instance.getDicSync(ConfigType.t_s_uiplaybase);
            for (const key in baseDic) {
                if (Object.prototype.hasOwnProperty.call(baseDic, key)) {
                    let data: t_s_uiplaybaseData = baseDic[key];
                    if (data && data.UiPlayId == this._currentData.playId) {
                        str = data.UiPlayNameLang;
                    }
                }
            }
            // this.nameTxt.text = LangManager.Instance.GetTranslation("PetCampaignResultWnd.nameTxt", str);
            this.levelTxt.text = str + ' ' + LangManager.Instance.GetTranslation("petCampaign.Level", this._level);
            let goodsCount: number = this._battleReportMsg.baseItem.length;
            let baseItem: BaseItemMsg;
            this._goodsList = [];
            var tempDic: Dictionary = new Dictionary();
            for (var i: number = 0; i < goodsCount; i++) {
                baseItem = this._battleReportMsg.baseItem[i] as BaseItemMsg;
                if (baseItem.templateId == -700) continue;
                var goodsInfo: GoodsInfo = tempDic[baseItem.templateId] as GoodsInfo;
                if (!goodsInfo) goodsInfo = new GoodsInfo();
                goodsInfo.templateId = baseItem.templateId;
                goodsInfo.count += baseItem.count;
                goodsInfo.rewardType = baseItem.type;
                if (!(baseItem.templateId in tempDic)) {
                    this._goodsList.push(goodsInfo);
                    tempDic[baseItem.templateId] = goodsInfo;
                }
            }

            /* this._selectedData = frameData.selectedData;
                 this.getReward.enabled = frameData.flag;
                 let dataArr:Array<t_s_dropitemData> = TempleteManager.Instance.getDropItemssByDropId(this._selectedData.FristReward);
                 if(dataArr && dataArr.length>0){
                     this._goodsList = [];
                     let len:number = dataArr.length;
                     for(let i:number = 0;i<len;i++){
                         let item:t_s_dropitemData = dataArr[i] as t_s_dropitemData;
                         let goods:GoodsInfo = new GoodsInfo();
                         goods.templateId = item.ItemId;
                         goods.count = item.Data;
                         this._goodsList.push(goods);
                     }
                 }*/
            this._goodsList.sort(this.compareFunction);
            this.list.numItems = this._goodsList.length;
            this.list.ensureBoundsCorrect();
            if (this.hasNext()) {//还有下一关
                this._nextData = PetCampaignManager.Instance.model.getCurLevelList()[this._level];
                if (this._nextData) {
                    this.costTxt.color = "#FFECC6";
                    this.nextGroup.visible = true;
                    this.exitBtn.x = 426;
                    let canEnetrNextFlag: boolean = true;//是否可进入下一关
                    this.costTxt.text = this._nextData.ConsumeNum.toString();
                    if (this._nextData.ConsumeType == 0) {//消耗体力
                        this.costIcon.url = FUIHelper.getItemURL("Base", "Icon_Unit_Stamina_S");
                        let hasEnergy: number = PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
                        if (hasEnergy < this._nextData.ConsumeNum) {//体力不足
                            this.costTxt.color = "#FF0000";
                        }
                    }
                    else {
                        this.costIcon.url = IconFactory.getGoodsIconByTID(this._nextData.ConsumeType);
                        let hasGoodsCount: number = GoodsManager.Instance.getGoodsNumByTempId(this._nextData.ConsumeType);
                        if (hasGoodsCount < this._nextData.ConsumeNum) {
                            canEnetrNextFlag = false;
                        }
                    }
                    if (this._nextData.Grade > ArmyManager.Instance.thane.grades) {
                        canEnetrNextFlag = false;
                        this.txt_grade.text = this._nextData.Grade + LangManager.Instance.GetTranslation("battle.logsys.BattleLogStarView.open");
                    }
                    if (!canEnetrNextFlag) {//不能进入下一关了
                        this.costTxt.color = "#FF0000";
                        this.nextBtn.enabled = false;
                    }
                }
            }
            else {
                this.nextGroup.visible = false;
                this.exitBtn.x = 549;
            }
        }
    }

    private initEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        Utils.setDrawCallOptimize(this.list);
        this.exitBtn.onClick(this, this.exitBtnHander);
        this.nextBtn.onClick(this, this.nextBtnHandler);
        this.btn_buy.onClick(this, this.onBuy);
        PetCampaignManager.Instance.addEventListener(PetCampaignEvent.PET_CAMPAIGN_UPDATE, this.updateRewardStatus, this);
    }

    private removeEvent() {
        this.exitBtn.offClick(this, this.exitBtnHander);
        this.nextBtn.offClick(this, this.nextBtnHandler);
        this.btn_buy.offClick(this, this.onBuy);
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        PetCampaignManager.Instance.removeEventListener(PetCampaignEvent.PET_CAMPAIGN_UPDATE, this.updateRewardStatus, this);
    }

    private propNum: number = 0;
    private onBuy() {
        //剩余收益次数: ”+玩家具体收益次数
        let str = LangManager.Instance.GetTranslation('PetCampaignLeftRewardTimes', PetCampaignManager.Instance.model.leftRewardCount);
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

    private updateRewardStatus(msg: UserUiPlayInfoMsg) {
        let isItemAdd: boolean = false;
        if (msg && msg.itemAdd) {//增加次数
            isItemAdd = true;
            PetCampaignManager.Instance.model.leftRewardCount = PetCampaignManager.Instance.model.leftRewardCount = this.pet_battle_count - msg.uiPlayRewardCount;
        }
        let item: UserUiPlayInfoMsg;
        let len: number = PetCampaignManager.Instance.model.userUiPlayListMsg.uiPlayInfoList.length;
        for (let i: number = 0; i < len; i++) {
            item = PetCampaignManager.Instance.model.userUiPlayListMsg.uiPlayInfoList[i] as UserUiPlayInfoMsg;
            if (item && item.playId == this.petCampaignModel.curPlayID) {
                if (item.uiPlayRewardCount && !isItemAdd) {
                    PetCampaignManager.Instance.model.leftRewardCount = this.pet_battle_count - item.uiPlayRewardCount;
                }
                break;
            }
        }
        this.txt_count.text = LangManager.Instance.GetTranslation('PetCampaignLeftRewardTimes', PetCampaignManager.Instance.model.leftRewardCount);
        if (msg && msg.itemAdd) {//增加次数
            this.propNum = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_CRUSADE);
            let str = LangManager.Instance.GetTranslation('PetCampaignLeftRewardTimes', PetCampaignManager.Instance.model.leftRewardCount);
            let content: string = str + '<br>' + LangManager.Instance.GetTranslation("petCampaign.useProp");
            this.propNum = GoodsManager.Instance.getGoodsNumByTempId(TemplateIDConstant.TEMP_ID_CRUSADE);
            let goodsCount: string = LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + this.propNum;
            let params = { content: content, goodsId: TemplateIDConstant.TEMP_ID_CRUSADE, goodsCount: goodsCount, hidecheck1: true, propNum: this.propNum, autoClose: this.propNum <= 1, callback: this.quickSubmit.bind(this) };
            NotificationManager.Instance.dispatchEvent(NotificationEvent.USE_PROP, params);
        }
    }

    private hasNext(): boolean {
        let flag: boolean = true;
        let userUiPlayInfoMsg: UserUiPlayInfoMsg = this.petCampaignModel.userUiPlayInfoMsg;
        let curList = PetCampaignManager.Instance.model.getCurLevelList();
        if (curList && userUiPlayInfoMsg && userUiPlayInfoMsg.levelSort == curList.length)//已经全部通关过了
        {
            if (userUiPlayInfoMsg && this._battleReportMsg.param1 >= userUiPlayInfoMsg.levelSort) {
                flag = false;
            }
        }
        else {
            if (curList && curList.length <= this._currentData.levelSort) {
                flag = false;
            }
        }
        return flag;
    }

    private exitBtnHander() {
        this.hide();
        FrameCtrlManager.Instance.open(EmWindow.PetCampaignWnd, { playId: this._currentData.playId });
    }

    private nextBtnHandler() {
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
        PetCampaignManager.Instance.model.curLevelData = this._nextData;
        if (this._nextData.ConsumeType == 0) {//消耗体力
            let hasEnergy: number = PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
            if (hasEnergy < this._nextData.ConsumeNum) {//体力不足
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
            } else {//体力足够
                PetCampaignManager.Instance.sendUIPlayChallenge(PetCampaignModel.ENTER_BATTLE, this._nextData.UiPlayId, this._nextData.UiLevelId);
            }
        }
        else {
            PetCampaignManager.Instance.sendUIPlayChallenge(PetCampaignModel.ENTER_BATTLE, this._nextData.UiPlayId, this._nextData.UiLevelId);
        }
        this.hide();
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

    private get petInfoList(): any[] {
        return PlayerManager.Instance.currentPlayerModel.playerInfo.petList;
    }

    private renderListItem(index: number, item: BaseItem) {
        (item.getChild("item") as BaseItem).info = this._goodsList[index];
        if ( this._goodsList[index].rewardType == 1) {//1 英灵战役首通奖励
            (item.getChild("title") as fairygui.GTextField).text = LangManager.Instance.GetTranslation('yishi.view.tips.SinglePassRewardTip.firstKill');
        }
    }

    public get petCampaignModel(): PetCampaignModel {
        return PetCampaignManager.Instance.model;
    }

    private compareFunction(a: GoodsInfo, b: GoodsInfo): number {
        if (a.templateInfo.Profile > b.templateInfo.Profile) {
            return -1;
        } else if (a.templateInfo.Profile < b.templateInfo.Profile) {
            return 1;
        } else {
            if (a.count < b.count) {
                return -1;
            } else if (a.count > b.count) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }
}