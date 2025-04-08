// @ts-nocheck

import Resolution from "../../../../core/comps/Resolution";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { ConsortiaEvent, NativeEvent } from "../../../constant/event/NotificationEvent";
import { UIAlignType } from "../../../constant/UIAlignType";
import { EmWindow } from "../../../constant/UIDefine";
import { UpgradeType } from "../../../constant/UpgradeType";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ConsortiaSocketOutManager } from "../../../manager/ConsortiaSocketOutManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ConsortiaSkillHelper } from "../../../utils/ConsortiaSkillHelper";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaDutyLevel } from "../data/ConsortiaDutyLevel";
import { ConsortiaSecretInfo } from "../data/ConsortiaSecretInfo";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { NotificationManager } from "../../../manager/NotificationManager";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { ConsortiaDutyInfo } from "../data/ConsortiaDutyInfo";
export default class ConsortiaSecretInfoWnd extends BaseWindow {
    protected resizeContent: boolean = true;
    public treeLevelTxt: fgui.GTextField;
    public expValueTxt: fgui.GTextField;
    public titleTxt: fgui.GTextField;
    public countTxt: fgui.GTextField;
    public rateTxt: fgui.GTextField;
    public helpBtn: fgui.GButton;
    public callTreeBtn: fgui.GButton;
    public getBufferBtn: fgui.GButton;
    public callMonsterBtn: fgui.GButton;
    public precentImg: fgui.GImage;
    private _controller: ConsortiaControler;
    private _info: ConsortiaSecretInfo;
    private _model: ConsortiaModel;
    public timeCtr: fgui.Controller;
    public monsterCtr: fgui.Controller;
    public descTxt1: fgui.GTextField;
    public timeTxt1: fgui.GTextField;
    public descTxt2: fgui.GTextField;
    public timeTxt2: fgui.GTextField;
    public batchTxt: fgui.GTextField;
    public infoBg: fgui.GImage;
    private _currentLeftOffTime: number = 0;
    private _currentLeftOffMonster: number = 0;
    private _btnCount: number = 0;
    private _secretBuffPrice: number = 0;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        if (this.frameData) {
            this._info = this.frameData
        }
        this.initData();
        this.initEvent();
        this.refreshView();
    }

    public OnShowWind() {
        super.OnShowWind();
        this.refreshView();
    }

    private initData() {
        this._controller = FrameCtrlManager.Instance.getCtrl(EmWindow.ConsortiaSecretInfoWnd) as ConsortiaControler;
        this._model = this._controller.model;
        this.timeCtr = this.contentPane.getController("timeCtr");
        this.monsterCtr = this.contentPane.getController("monsterCtr");
        let configTemp: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("Fam_Buffer_Price");
        this._secretBuffPrice = configTemp ? parseInt(configTemp.ConfigValue) : 200;
        this.secretSeened();
    }

    private secretSeened() {
        if (this._model.secretInfo && this._model.secretInfo.remainGainTime > 0) {
            this._model.secretSeened = true;
            NotificationManager.Instance.dispatchEvent(ConsortiaEvent.SECRET_SEENED);
        }
    }

    private initEvent() {
        this.helpBtn.onClick(this, this.onHelpClick);
        this.callTreeBtn.onClick(this, this.onGetTreeClick);
        this.getBufferBtn.onClick(this, this.onGetBuffClick);
        this.callMonsterBtn.onClick(this, this.onCallMonsterClick);
        this._model.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_CHAIRMAN, this.chairmanChangeHandler, this);
        this._model.secretInfo.addEventListener(ConsortiaEvent.SECRET_UPDATE, this.secretUpdateHandler, this);
        this._model.secretInfo.addEventListener(ConsortiaEvent.PICK_TIME_UPDATE, this.pickTimeUpdateHandler, this);
        NotificationManager.Instance.addEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
    }

    private removeEvent() {
        this.helpBtn.offClick(this, this.onHelpClick);
        this.callTreeBtn.offClick(this, this.onGetTreeClick);
        this.getBufferBtn.offClick(this, this.onGetBuffClick);
        this.callMonsterBtn.offClick(this, this.onCallMonsterClick);
        this._model.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_CHAIRMAN, this.chairmanChangeHandler, this);
        this._model.secretInfo.removeEventListener(ConsortiaEvent.SECRET_UPDATE, this.secretUpdateHandler, this);
        this._model.secretInfo.removeEventListener(ConsortiaEvent.PICK_TIME_UPDATE, this.pickTimeUpdateHandler, this);
        NotificationManager.Instance.removeEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
        Laya.timer.clear(this, this.updateOffMonsterHandler);
    }

    private onHelpClick() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("map.campaign.view.ui.secretland.ConsortiaSecretInfoView.helpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private onGetTreeClick() {
        var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        var content: string = LangManager.Instance.GetTranslation("map.campaign.view.ui.secretland.ConsortiaSecretInfoView.callTree");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.getTreeCall.bind(this));
    }

    private getTreeCall(b: boolean, flag: boolean) {
        if (b) {
            ConsortiaSocketOutManager.sendCallSecretTree();
        }
    }

    onGetBuffClick() {
        if (!this.showGetBuffAlert()) {
            this.sendGetSecretBuff();
        }
    }

    private showGetBuffAlert(): boolean {
        var preDate: Date = new Date(SharedManager.Instance.secretGetBuffTipCheckDate);
        var now: Date = new Date();
        var outdate: boolean = false;
        var check: boolean = SharedManager.Instance.secretGetBuffTip;
        if (!check || preDate.getMonth() <= preDate.getMonth() && preDate.getDay() < now.getDay())
            outdate = true;
        if (outdate) {


            var content: string = LangManager.Instance.GetTranslation("map.campaign.view.ui.secretland.ConsortiaSecretInfoView.getBuff", this._secretBuffPrice);
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.startGetBuffAlertBack.bind(this), closeFunction: null, state: 2 });
        }
        return outdate;
    }

    private startGetBuffAlertBack(check: boolean) {
        SharedManager.Instance.secretGetBuffTip = check;
        SharedManager.Instance.secretGetBuffTipCheckDate = new Date;
        SharedManager.Instance.saveSecretGetBuffTipCheck();
        this.sendGetSecretBuff();
    }

    private sendGetSecretBuff() {
        if (this.playerInfo.consortiaOffer < this._secretBuffPrice) {
            ConsortiaSkillHelper.addOffer();
            return;
        }
        ConsortiaSocketOutManager.sendGetSecretBuff();
    }

    onCallMonsterClick() {
        var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        var content: string = LangManager.Instance.GetTranslation("map.campaign.view.ui.secretland.ConsortiaSecretInfoView.callMonster");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.callMonsterCall.bind(this));
    }

    private callMonsterCall(b: boolean, flag: boolean) {
        if (b) {
            ConsortiaSocketOutManager.sendCallSecretMonster();
        }
    }

    private chairmanChangeHandler() {
        this.refreshBtns();
    }

    private secretUpdateHandler() {
        this.refreshInfoView();
        this.refreshMonsterView();
        this.secretSeened();
    }

    private pickTimeUpdateHandler() {
        this.refreshTimeView();
    }

    private refreshBtns() {
        this.callTreeBtn.visible = this.getBufferBtn.visible = this.callMonsterBtn.visible = false;
        this._btnCount = 0;
        if (!this._info) return;
        if (this._info.treeState == ConsortiaSecretInfo.Call_STATE && (this.isChairman(ConsortiaDutyInfo.CALL_TREE))) {
            this.callTreeBtn.visible = true;
            this._btnCount++;
        }
        if (this._info.remainGainTime > 0) {
            this.getBufferBtn.visible = true;
            this._btnCount++;
        }
        if (this._info.canCallMonster) {
            this.callMonsterBtn.visible = true;
            this._btnCount++;
        }
        this.infoBg.height = 80 + 50 * this._btnCount;
        this.callMonsterBtn.y = this._btnCount == 2 ? 310 : 262;
    }

    private clear() {
        this.countTxt.setVar("count", "0").flushVars();
        this.rateTxt.setVar("count", "0").flushVars();
        this.treeLevelTxt.setVar("level", "1").flushVars();
        this.expValueTxt.text = "0/0";
        this.precentImg.fillAmount = 0;
        this.callTreeBtn.visible = this.getBufferBtn.visible = this.callMonsterBtn.visible = false;
    }

    private refreshInfoView() {
        if (!this._info) {
            this.clear();
            return;
        }
        this.countTxt.setVar("count", this._info.membersNum.toString()).flushVars();
        this.rateTxt.setVar("count", this._info.rate.toFixed(1)).flushVars();
        this.treeLevelTxt.setVar("level", this._info.treeGrade.toString()).flushVars();
        var upGrade: t_s_upgradetemplateData = TempleteManager.Instance.getTemplateByTypeAndLevel(this._info.treeGrade + 1, UpgradeType.UPGRADE_TYPE_CONSORTIA_TREE);
        if (upGrade) {
            this.expValueTxt.text = this._info.treeGp + " / " + upGrade.Data;
            this.precentImg.fillAmount = this._info.treeGp / upGrade.Data;
        }
        else {
            this.expValueTxt.text = LangManager.Instance.GetTranslation("map.campaign.view.ui.secretland.ConsortiaTreeExpView.maxLevel");
            this.precentImg.fillAmount = 1;
        }
        this.refreshBtns();
    }

    public refreshView() {
        this.refreshInfoView();
        this.refreshTimeView();
        this.refreshMonsterView();
    }

    /**刷新神树倒计时信息 */
    public refreshTimeView() {
        if (this._info && this._info.remainGainTime > 0) {
            this.timeCtr.selectedIndex = 1;
            this._currentLeftOffTime = this._model.secretInfo.remainGainTime;
            this.timeTxt1.text = DateFormatter.getSevenDateString(this._currentLeftOffTime);
            Laya.timer.loop(1000, this, this.updateOffTimeHandler);
        }
        else {
            this.timeCtr.selectedIndex = 0;
            Laya.timer.clear(this, this.updateOffTimeHandler);
        }
    }

    private updateOffTimeHandler() {
        this._currentLeftOffTime--;
        if (this.timeTxt1 && !this.timeTxt1.isDisposed)
            this.timeTxt1.text = DateFormatter.getSevenDateString(this._currentLeftOffTime);
        if (this._currentLeftOffTime < 0) {
            Laya.timer.clear(this, this.updateOffTimeHandler);
            this.timeCtr.selectedIndex = 0;
        }
    }

    /**刷新盗宝着波数信息 */
    private refreshMonsterView() {
        if (this._info && this._info.hasMonsterNow) {
            this.monsterCtr.selectedIndex = 1;
            let str: string = "(" + this._info.curBatch + "/3)";
            this.batchTxt.setVar("count", str).flushVars();
            if (this._info.remainMonsterTimeChange) {
                this._currentLeftOffMonster = this._info.remainMonsterTime;
                Laya.timer.loop(1000, this, this.updateOffMonsterHandler);
                this._info.remainMonsterTimeChange = false;
            }
        }
        else {
            this.monsterCtr.selectedIndex = 0;
            Laya.timer.clear(this, this.updateOffMonsterHandler);
        }
    }

    private updateOffMonsterHandler() {
        this.timeTxt2.text = DateFormatter.getSevenDateString(this._currentLeftOffMonster);
        this._currentLeftOffMonster--;
        if (this._currentLeftOffMonster < 0) {
            Laya.timer.clear(this, this.updateOffMonsterHandler);
            this.monsterCtr.selectedIndex = 0;
        }
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    /**权限 */
    private isChairman(duty: number): boolean {
        return this._model.getRightsByIndex(duty);
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    dispose(dispose?: boolean) {
        this._controller = null;
        super.dispose(dispose);
    }
}