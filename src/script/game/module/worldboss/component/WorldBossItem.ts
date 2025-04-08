import FUI_WorldBossItem from "../../../../../fui/WorldBoss/FUI_WorldBossItem";
import LangManager from "../../../../core/lang/LangManager";
import { t_s_campaignData } from "../../../config/t_s_campaign";
import { ConfigManager } from "../../../manager/ConfigManager";
import FUIHelper from "../../../utils/FUIHelper";
import { UIFilter } from '../../../../core/ui/UIFilter';
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import WorldBossManager from "../../../manager/WorldBossManager";
import WorldBossStuntmanInfo from "../../../mvc/model/worldboss/WorldBossStuntmanInfo";
import { WorldBossSocketOutManager } from "../../../manager/WorldBossSocketOutManager";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { SharedManager } from "../../../manager/SharedManager";
import ConfigInfosTempInfo from '../../../datas/ConfigInfosTempInfo';
import { TempleteManager } from "../../../manager/TempleteManager";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";

export default class WorldBossItem extends FUI_WorldBossItem {
    private _info: t_s_campaignData;
    private state: number = 0;
    private _payCount: number = 0;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.initEvent();
        let configTemp: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("WorldBoss_Replacement_Price");
        if (configTemp) {
            this._payCount = parseInt(configTemp.ConfigValue);
        }
    }

    private initEvent() {
        this.onClick(this, this.__enterHander);
        this.checkBtn.onClick(this, this.__onBuyAvatarHandler);
    }

    private removeEvent() {
        this.offClick(this, this.__enterHander);
        this.checkBtn.offClick(this, this.__onBuyAvatarHandler);
    }

    private __enterHander() {
        if (!this._info) return;
        var str: string;
        if (this._info.MinLevel > ArmyManager.Instance.thane.grades) {
            str = LangManager.Instance.GetTranslation("activity.view.ActivityItem.command02");
            MessageTipManager.Instance.show(str);

        }
        else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            MessageTipManager.Instance.show(WorldBossHelper.getCampaignTips());
        }
        else {

            if (this.stuntman.hasBuyFor(this._info.CampaignId)) {
                this.alertWarning();
            } else {
                if(this.playerModel)this.playerModel.setWorldBossAutoFight(PlayerModel.WORLDBOSS_CANCAL_AUTO_FIGHT);
                WorldBossManager.Instance.sendEnterBattle(this._info);
                FrameCtrlManager.Instance.exit(EmWindow.WorldBossWnd);
            }
        }
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }
    
    private alertWarning() {
        var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        var content: string = LangManager.Instance.GetTranslation("worldboss.BuyAvatarFrame.command04");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.enter.bind(this));
    }

    private enter(result: boolean, flag: boolean) {
        if (result) {
            WorldBossManager.Instance.sendEnterBattle(this._info);
            WorldBossManager.Instance.sendCancelStunmanFor(this._info.CampaignId);
            this.stuntman.cancelBuyFor(this._info.CampaignId);
        }
    }

    private __onBuyAvatarHandler(e: Laya.Event) {
        e.stopPropagation();
        if (WorldBossManager.Instance.stuntman.hasBuyFor(this._info.CampaignId)) {
            WorldBossSocketOutManager.sendCancelStunmanFor(this._info.CampaignId);
            WorldBossManager.Instance.stuntman.cancelBuyFor(this._info.CampaignId);
        } else {
            if (this.isNeedAlert()) {
                let content: string = LangManager.Instance.GetTranslation("map.campaign.worldBoss.buyAlert", this._payCount);
                UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.todayNotAlert.bind(this), closeFunction: this.cancelHandle.bind(this), state: 2 });
            }
            else {
                this.sendBuyStunmanFor();
            }
        }
    }

    private todayNotAlert(notAlert: boolean, useBind: boolean) {
        if (notAlert) {
            SharedManager.Instance.worldBossBuyStunmanFoCheckDate = new Date();
            SharedManager.Instance.worldBossBuyStunmanFoDate();
        }
        this.sendBuyStunmanFor();
    }

    private cancelHandle() {
        if (WorldBossManager.Instance.stuntman.hasBuyFor(this._info.CampaignId)) {
            this.checkBtn.selected = true;
        }
        else {
            this.checkBtn.selected = false;
        }
    }

    private isNeedAlert(): boolean {
        var needAlert: boolean = true;
        let lastSaveDate: Date = new Date(SharedManager.Instance.worldBossBuyStunmanFoCheckDate);
        let today: Date = new Date();
        if (lastSaveDate) {
            if (today.getFullYear() == lastSaveDate.getFullYear() &&
                today.getMonth() == lastSaveDate.getMonth() &&
                today.getDay() == lastSaveDate.getDay()) {
                needAlert = false;
            }
        }
        return needAlert;
    }

    private sendBuyStunmanFor() {
        WorldBossSocketOutManager.sendBuyStunmanFor(this._info.CampaignId);
        WorldBossManager.Instance.stuntman.buyFor(this._info.CampaignId);
    }

    public set info(value: t_s_campaignData) {
        this._info = value;
        this.refreshView();
    }

    private refreshView() {

        this.typeLoad1.url = FUIHelper.getItemURL('WorldBoss', 'Img_lang');
        this.typeLoad2.url = FUIHelper.getItemURL('WorldBoss', 'Img_lightred');
        this.openGradeTxt.text = LangManager.Instance.GetTranslation("buildings.casern.view.RecruitPawnCell.command06", this._info.MinLevel);
        this.openTimeTxt.text = LangManager.Instance.GetTranslation("worldboss.view.WorldBossItem.time", this._info.OpenTime, this._info.StopTime);
        this.descTxt.text = this._info.DescriptionLang ? this._info.DescriptionLang : "";
        this.updateState();
    }

    public updateState() {
        this.state = this._info.state;
        this.openStatusTxt.text = this._info.stateValue;
        this.checkBtn.visible = false;
        this.userTishenTxt.visible = false;
        this.openStatusTxt.visible = false;
        UIFilter.gray(this.typeLoad1.displayObject);
        if (this.state == 2) {//今日已结束
            this.openStatusTxt.visible = true;
        } else if (this.state == 1) {//今日尚未开放
            this.openStatusTxt.visible = true;
            this.updateBuyState();
        } else if (this.state == 0) { //开放
            this.openStatusTxt.visible = true;
            UIFilter.normal(this.typeLoad1.displayObject);
        }
    }

    updateBuyState() {
        if (this.stuntman.hasBuyFor(this._info.CampaignId)) {
            this.checkBtn.selected = true;
        } else {
            this.checkBtn.selected = false;
        }
    }

    /** 替身 */
    private get stuntman(): WorldBossStuntmanInfo {
        return WorldBossManager.Instance.stuntman;
    }

    public dispose() {
        this.removeEvent();
        super.dispose();
    }

}