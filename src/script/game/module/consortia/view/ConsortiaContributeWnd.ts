/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-08-18 18:09:18
 * @Description: 公会贡献 v2.46 ConsortiaContributeFrame 已调试
 */
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import LangManager from '../../../../core/lang/LangManager';
import { ConsortiaContributeRankItem } from "./component/ConsortiaContributeRankItem";
import { ResourceEvent, ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ResourceData } from "../../../datas/resource/ResourceData";
import { ConsortiaSocektSendManager } from "../../../manager/ConsortiaSocektSendManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import StringUtils from "../../../utils/StringUtils";
import { TempleteManager } from "../../../manager/TempleteManager";
import { NumericStepper } from "../../../component/NumericStepper";
import { isOversea } from "../../login/manager/SiteZoneCtrl";

export class ConsortiaContributeWnd extends BaseWindow {

    private _contorller: ConsortiaControler;
    private _data: ConsortiaModel;
    private list: fgui.GList;
    private itemTitle: fgui.GButton;
    private txtExchangeDesc1: fgui.GLabel;
    private txtExchangeDesc2: fgui.GLabel;
    private txtMyContributeValue: fgui.GLabel; //我的贡献
    private txtMyContributeValueAdd: fgui.GLabel;//我的贡献+
    private txtGuildContributeValue: fgui.GLabel;//公会财富
    private txtGuildContributeValueAdd: fgui.GLabel;//公会财富+
    private txtGoldValue: fgui.GLabel;
    private txtDiamondValue: fgui.GLabel;
    private cRank: fgui.Controller;
    public frame: fgui.GComponent;
    public btnApplayRecord: fgui.GButton;
    public btnInviteRecord: fgui.GButton;
    public txtMyContribute: fgui.GTextField;
    public txtGuildContribute: fgui.GTextField;
    public btnGold: fgui.GButton;
    public btnDiamond: fgui.GButton;
    public stepper_gold: NumericStepper;
    public stepper_diamond: NumericStepper;

    private minGold = 1000;
    private unitGold = 10000;
    private minDiamond = 1;
    private unitDiamond = 10;
    private _handler_gold: Laya.Handler;
    private _handler_diamond: Laya.Handler;


    public OnInitWind() {
        super.OnInitWind();
        this.frame.getChild("title").text = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.title");
        this.btnApplayRecord.title = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.btnApplayRecord.title");
        this.btnInviteRecord.title = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.btnInviteRecord.title");
        // this.txtDiamond.text = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.txtDiamond.text");
        // this.txtGold.text = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.txtGold.text");
        this.txtMyContribute.text = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.txtMyContribute.text");
        this.txtGuildContribute.text = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.txtGuildContribute.text");
        this.btnGold.title = this.btnDiamond.title = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.btnDiamond.title");
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("PointConsortiaOffer_Price");
        if (cfgItem) {
            this.minDiamond = Number(cfgItem.ConfigValue);
        }
        this.setCenter();
        this.initData();
        this.initEvent();
        this.initView();
    }

    private initEvent() {
        this._data.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.__onConsortiaInfoUpdata, this);
        this._data.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_CONTRIBUTE_INFO, this.__onContributeInfoUpdata, this);
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__onPlayerDataUpdate, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.__onSelfOfferUpdata, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existConsortiaHandler, this);
        ResourceManager.Instance.gold.addEventListener(ResourceEvent.RESOURCE_UPDATE, this.__refreshGold, this);
    }

    private __refreshGold() {
        this.__onSelfGoldUpdata();
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        this._data = this._contorller.model;
    }

    private get cfgContributeValue(): number {
        let cfgValue = 1;
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("PointConsortiaOffer_Price");
        if (cfgItem) {
            cfgValue = Number(cfgItem.ConfigValue);
        }
        return cfgValue;
    }

    private initView() {
        this.txtExchangeDesc1.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.contribution.ConsortiaContributeFrame.contributePromptText");
        this.txtExchangeDesc2.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.contribution.ConsortiaContributeFrame.contributePromptText2", this.cfgContributeValue);
        this.itemTitle.getChild("txt1").text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.contribution.ConsortiaContributeFrame.rankingTxtText");
        this.itemTitle.getChild("txt2").text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.contribution.ConsortiaContributeFrame.memberNameTxtText");
        this.itemTitle.getChild("txt3").text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.contribution.ConsortiaContributeFrame.resourceTxtText");
        this.list.itemRenderer = Laya.Handler.create(this, this.__renderListItem, null, false);

        this._handler_gold && this._handler_gold.recover();
        this._handler_gold = Laya.Handler.create(this, this.stepper_goldChangeHandler, null, false);
        this.stepper_gold.show(0, 0, 0, this.gold.count, this.gold.count, this.unitGold, this._handler_gold);

        this._handler_diamond && this._handler_diamond.recover();
        this._handler_diamond = Laya.Handler.create(this, this.stepper_diamondChangeHandler, null, false);
        this.stepper_diamond.show(0, 0, 0, this.ownDiamond, this.ownDiamond, this.unitDiamond, this._handler_diamond);

        this.stepper_gold.txt_num.promptText = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.tfDiamond.text");
        this.stepper_diamond.txt_num.promptText = LangManager.Instance.GetTranslation("ConsortiaContributeWnd.tfDiamond.text");

        this.cRank = this.getController("cRank")
        this.cRank.on(fgui.Events.STATE_CHANGED, this, () => {
            this._contorller.getConsortiaOffer(this.cRank.selectedIndex == 1);
        })

        this.txtGuildContributeValue.text = this._data.consortiaInfo.offer + ""
        this.txtMyContributeValue.text = this.playerInfo.consortiaOffer + "";

        this.__onSelfGoldUpdata()
        this.__onSelfPointUpdata()
        this.__onSelfOfferUpdata()
        this.__onContributeInfoUpdata()
        this.stepper_goldChangeHandler(this.stepper_gold.value);
        this.stepper_diamondChangeHandler(this.stepper_diamond.value);
    }

    public OnShowWind() {
        super.OnShowWind();
        this.stepper_gold.g_num.ensureBoundsCorrect();
        this.stepper_gold.ensureBoundsCorrect();
        this.stepper_gold.x = 745;
        this.stepper_diamond.g_num.ensureBoundsCorrect();
        this.stepper_diamond.ensureBoundsCorrect();
        this.stepper_diamond.x = 745;
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private __renderListItem(index: number, item: ConsortiaContributeRankItem) {
        var arr: any[] = this._data.consortiaContributionList;
        let info = arr[index]
        if (item) item.setdata(index + 1, info, this._data.isHistory);
    }

    private btnDiamondClick() {
        let point = this.stepper_diamond.value;
        if (this.ownDiamond < point) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.view.myConsortia.contribution.ConsortiaContributeFrame.command02"));
            return;
        }
        if (this.minDiamond > point) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.view.myConsortia.contribution.ConsortiaContributeFrame.command06", this.minDiamond));
            return;
        }

        ConsortiaSocektSendManager.consortiaContribute(0, point);
        this.stepper_diamondChangeHandler(this.stepper_diamond.value);
    }

    private btnGoldClick() {
        let gold = this.stepper_gold.value;
        if (this.gold.count < gold) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.view.myConsortia.contribution.ConsortiaContributeFrame.command04"));
            return;
        }

        if (this.minGold > gold) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.view.myConsortia.contribution.ConsortiaContributeFrame.command05", this.minGold));
            return;
        }

        ConsortiaSocektSendManager.consortiaContribute(gold, 0);
        this.stepper_goldChangeHandler(this.stepper_gold.value);
    }

    //公会财富
    private __onConsortiaInfoUpdata() {
        this.txtGuildContributeValue.text = this._data.consortiaInfo.offer + "";
    }

    //我的金币
    private __onSelfGoldUpdata() {
        this.txtGoldValue.text = StringUtils.consortiaTxtStyle(this.gold.count + "");
    }

    //我的钻石
    private __onSelfPointUpdata() {
        this.txtDiamondValue.text = StringUtils.consortiaTxtStyle(this.ownDiamond + "");
    }

    private __onPlayerDataUpdate() {
        this.__onSelfPointUpdata()
        this.__onSelfGoldUpdata()
        // this.stepper_goldChangeHandler(this.stepper_gold.value);
        // this.stepper_diamondChangeHandler(this.stepper_diamond.value);
    }

    //我的贡献
    private __onSelfOfferUpdata() {
        this.txtMyContributeValue.text = this.playerInfo.consortiaOffer + "";
        this._contorller.getConsortiaOffer(this.cRank.selectedIndex == 1);
    }

    //公会捐献列表 
    private __onContributeInfoUpdata() {
        // this.itemMyRank.getChild("txt1").text = this._data.selfOrder <= 0 ? "" : this._data.selfOrder
        // this.itemMyRank.getChild("txt2").text = this._data.nickName;
        // this.itemMyRank.getChild("txt3").text = this._data.isHistory ? this._data.totalOffer : this._data.todayOffer
        this.list.numItems = this._data.consortiaContributionList.length
    }

    private __existConsortiaHandler(evt: PlayerEvent) {
        if (this.playerInfo.consortiaID == 0) {
            this.hide();
        }
    }

    private stepper_goldChangeHandler(value: number) {
        this.txtGuildContributeValueAdd.text = value == 0 ? "" : "+" + Math.floor(value / 1000);
        this.txtMyContributeValueAdd.text = value == 0 ? "" : "+" + Math.floor(value / 1000);
    }

    private stepper_diamondChangeHandler(value: number) {
        this.txtGuildContributeValueAdd.text = value == 0 ? "" : "+" + Math.floor(value / this.cfgContributeValue);
        this.txtMyContributeValueAdd.text = value == 0 ? "" : "+" + Math.floor(value / this.cfgContributeValue);
    }

    private removeEvent() {
        this._data!.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_INFO, this.__onConsortiaInfoUpdata, this);
        this._data!.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_CONTRIBUTE_INFO, this.__onContributeInfoUpdata, this);
        this.playerInfo!.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__onPlayerDataUpdate, this);
        this.playerInfo!.removeEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.__onSelfOfferUpdata, this);
        this.playerInfo!.removeEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existConsortiaHandler, this);
        ResourceManager.Instance.gold.removeEventListener(ResourceEvent.RESOURCE_UPDATE, this.__refreshGold, this);
    }

    private get gold(): ResourceData {
        return ResourceManager.Instance.gold;
    }

    private get ownDiamond(): number {
        let ownPoint = this.playerInfo.point + this.playerInfo.giftToken
        if (this.playerInfo.point < 0) {
            ownPoint = this.playerInfo.giftToken
        }
        return ownPoint
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}