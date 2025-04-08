import Resolution from "../../../../core/comps/Resolution";
import LangManager from '../../../../core/lang/LangManager';
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { CampaignManager } from "../../../manager/CampaignManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { WorldBossSocketOutManager } from "../../../manager/WorldBossSocketOutManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import { DateFormatter } from '../../../../core/utils/DateFormatter';
import { ConsortiaSkillHelper } from "../../../utils/ConsortiaSkillHelper";
import SimpleAlertHelper from '../../../component/SimpleAlertHelper';
import { FormularySets } from "../../../../core/utils/FormularySets";
import HomeWnd from "../../home/HomeWnd";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
/**
 *  
 * 世界Boss, 魔神祭坛复活界面
 */
export default class WorldBossRiverWnd extends BaseWindow {
    public static WORLD_BOSS: number = 1;//世界Boss
    public static DEMON: number = 2;//魔神祭坛
    public static PET_BOSS: number = 3;//保卫英灵岛
    private riverBtn: UIButton;
    private battleBtn: UIButton;
    private timetxt: fgui.GLabel;
    private _type: number = 0;
    private _riverPay: number = 0;
    private _battlePoint: number = 3;
    private _tipRiver: boolean = false;
    private _count: number = 0;
    private descTxt: fairygui.GTextField;

    protected resizeContent: boolean = false;

    private btn_buy: UIButton;
    private diamondCtrl: fgui.Controller;
    private giftTxt: fairygui.GTextField;//钻石
    private voucherTxt: fairygui.GTextField;//绑定钻石

    public OnInitWind() {
        this.addEvent();
        if (this.params) {
            this._type = this.params.type;
            this._count = this.params.count;
            if (this._count <= 0) {
                this.OnBtnClose();
                return;
            } else {
                Laya.timer.loop(1000, this, this.__updateTimeHandler);
            }
        }
        this.initData();
        this.x = (Resolution.gameWidth - this.contentPane.width) / 2;
        this.y = Resolution.gameHeight - 350;
    }

    private addEvent() {
        this.battleBtn.onClick(this, this.battleHandler);
        this.riverBtn.onClick(this, this.__riverHandler);
        this.btn_buy.onClick(this, this.onBuy);
    }

    private removeEvent() {
        Laya.timer.clear(this, this.__updateTimeHandler);
        this.battleBtn.offClick(this, this.battleHandler);
        this.riverBtn.onClick(this, this.__riverHandler);
        this.btn_buy.offClick(this, this.onBuy);
    }

    private __updateTimeHandler() {
        this.timetxt.text = DateFormatter.getConsortiaCountDate(this._count);
        this._count--;
        if (this._count < 0) {
            Laya.timer.clear(this, this.__updateTimeHandler);
            this.OnBtnClose();
        }
    }

    private initData() {
        var tempInfo: ConfigInfosTempInfo;
        switch (this._type) {
            case WorldBossRiverWnd.WORLD_BOSS:
            case WorldBossRiverWnd.PET_BOSS:
                TempleteManager.Instance.getConfigInfoByConfigName("seventarget_Grade")
                tempInfo = TempleteManager.Instance.getConfigInfoByConfigName("Live_Pay");
                break;
            case WorldBossRiverWnd.DEMON:
                tempInfo = TempleteManager.Instance.getConfigInfoByConfigName("AltarLive_Offer");
                break;
        }

        if (tempInfo) {
            this._riverPay = parseInt(tempInfo.ConfigValue);
        }
        tempInfo = TempleteManager.Instance.getConfigInfoByConfigName("Live_Fight_Pay");
        if (tempInfo) {
            this._battlePoint = parseInt(tempInfo.ConfigValue);
        }
        switch (this._type) {
            case WorldBossRiverWnd.WORLD_BOSS:
                this.battleBtn.visible = true;
                this.riverBtn.visible = false;
                break;
            case WorldBossRiverWnd.DEMON:
                this.riverBtn.visible = true;
                this.battleBtn.visible = false;
                break;
            case WorldBossRiverWnd.PET_BOSS:
                this.riverBtn.visible = false;
                this.battleBtn.visible = false;
                break;
        }
        this.updateDiamond();
    }

    private updateDiamond() {
        if (!this.diamondCtrl) {
            this.diamondCtrl = this.getController("diamondCtrl");
            this.diamondCtrl.selectedIndex = (this._type == WorldBossRiverWnd.WORLD_BOSS) ? 1 : 0;
        }
        //钻石
        this.giftTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.point, HomeWnd.STEP);
        //绑定钻石
        this.voucherTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken, HomeWnd.STEP);
    }

    /**
     * 购买钻石
     */
    private onBuy() {
        RechargeAlertMannager.Instance.openShopRecharge();
    }

    private __riverHandler() {
        if (this._tipRiver) return;
        var needAlert: boolean = true;
        var lastSaveDate: Date;
        switch (this._type) {
            case WorldBossRiverWnd.WORLD_BOSS:
                lastSaveDate = SharedManager.Instance.worldBossRiverTodayNeedAlertCheckDate;
                break;
            case WorldBossRiverWnd.DEMON:
                lastSaveDate = SharedManager.Instance.demonReviveTipCheckDate;
                break;
        }
        if (this._type == WorldBossRiverWnd.DEMON) {
            var contextStr: string = LangManager.Instance.GetTranslation("map.campaign.view.ui.RiverView.content_river", this._riverPay + LangManager.Instance.GetTranslation("public.contribution"));
            var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, contextStr, confirm, cancel, this.riverHandler.bind(this));
        }
        else {
            if (lastSaveDate) {
                let today: Date = new Date();
                if (today.getFullYear() == lastSaveDate.getFullYear() &&
                    today.getMonth() == lastSaveDate.getMonth() &&
                    today.getDay() == lastSaveDate.getDay()) {
                    needAlert = false;
                }
            }
            if (needAlert) {
                let payStr: string = this._riverPay + LangManager.Instance.GetTranslation("mainBar.WorldBossBuyBuffBar.point");
                let content: string = LangManager.Instance.GetTranslation("map.campaign.view.ui.RiverView.content_river", payStr);
                UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.__todayNotAlert.bind(this), closeFunction: this.__closeHandler.bind(this), point: this._battlePoint });

            } else {
                this.sendRiver(true);
            }
        }
    }

    private __todayNotAlert(notAlert: boolean) {
        if (notAlert) {
            switch (this._type) {
                case WorldBossRiverWnd.WORLD_BOSS:
                    SharedManager.Instance.worldBossRiverTodayNeedAlertCheckDate = new Date();
                    SharedManager.Instance.saveWorldBossRiverTodayNeedAlert();
                    break;
                case WorldBossRiverWnd.DEMON:
                    SharedManager.Instance.demonReviveTipCheckDate = new Date();
                    SharedManager.Instance.saveDemonReviveTipCheck();
                    break;
            }
        }
        this.sendRiver(true);
    }

    private __closeHandler() {
        this.sendRiver(false);
    }

    private sendRiver(b: boolean) {
        this._tipRiver = false;
        if (b && this.checkPay) {
            this._tipRiver = true;
            this.hide();
            if (this.selfMemberData.isDie == 1) {
                WorldBossSocketOutManager.sendRiver();
            } else {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("riverView.notDieState"));
            }
        }
    }

    private get checkPay(): boolean {
        switch (this._type) {
            case WorldBossRiverWnd.WORLD_BOSS:
                if (this.playerInfo.point < this._riverPay) {
                    // RechargeAlertMannager.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
                    return false;
                }
                break;
            case WorldBossRiverWnd.DEMON:
                if (this.playerInfo.consortiaOffer < this._riverPay) {
                    ConsortiaSkillHelper.addOffer();
                    return false;
                }
                break;
        }
        return true;
    }

    private riverHandler(b: boolean, flag: boolean) {
        if (b) {
            if (this.selfMemberData.isDie == 1) {
                WorldBossSocketOutManager.sendRiver();
            } else {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("riverView.notDieState"));
            }
        }
    }

    private battleHandler() {
        if (this._tipRiver) return;
        var needAlert: boolean = true;
        var lastSaveDate: Date = new Date(SharedManager.Instance.worldBossRiverTodayNeedAlertCheckDate_enterBattle);
        if (lastSaveDate) {
            var today: Date = new Date();
            if (today.getFullYear() == lastSaveDate.getFullYear() &&
                today.getMonth() == lastSaveDate.getMonth() &&
                today.getDay() == lastSaveDate.getDay()) {
                needAlert = false;
            }
        }
        if (needAlert) {
            var content: String = LangManager.Instance.GetTranslation("map.campaign.view.ui.RiverView.content_battle", this._battlePoint);
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.__todayNotAlert2.bind(this), closeFunction: this.__closeHandler2.bind(this), point: this._battlePoint });
        } else {
            this.sendEnterBattle(true, SharedManager.Instance.worldBossRiverUseBind);
        }
    }

    private __todayNotAlert2(notAlert: boolean, useBind: boolean) {
        if (notAlert) {
            SharedManager.Instance.worldBossRiverTodayNeedAlertCheckDate_enterBattle = new Date();
            SharedManager.Instance.saveWorldBossRiverTodayNeedAlertCheckDate_enterBattle();
            SharedManager.Instance.worldBossRiverUseBind = useBind;
            SharedManager.Instance.saveWorldBossRiverUseBind();
        }
        var hasMoney: number = this.playerInfo.point;
        if (useBind) {
            hasMoney = this.playerInfo.point + this.playerInfo.giftToken;
        }
        if (hasMoney < this._battlePoint) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
            return;
        }
        this.sendEnterBattle(true, useBind);
    }

    private __closeHandler2() {
        this.sendEnterBattle(false);
    }


    private sendEnterBattle(b: boolean, useBind: boolean = true) {
        this._tipRiver = false;
        if (b) {
            var hasMoney: number = this.playerInfo.point;
            if (useBind) {
                hasMoney = this.playerInfo.giftToken + this.playerInfo.point;
            }
            if (hasMoney < this._battlePoint) {
                RechargeAlertMannager.Instance.show();
                return;
            }
            this._tipRiver = true;
            this.hideTime();
            if (this.selfMemberData.isDie == 1) {
                WorldBossSocketOutManager.sendEnterBattle(useBind);
            } else {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("riverView.notDieState"));
            }
        }
    }

    public hideTime() {
        Laya.timer.clear(this, this.__updateTimeHandler);
        this.OnBtnClose();
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get selfMemberData(): CampaignArmy {
        return CampaignManager.Instance.mapModel.selfMemberData;
    }

    OnHideWind() {
        this.removeEvent();
        super.OnHideWind();

        Laya.timer.clear(this, this.__updateTimeHandler);
    }
}