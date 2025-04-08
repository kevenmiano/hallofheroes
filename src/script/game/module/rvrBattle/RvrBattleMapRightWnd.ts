// @ts-nocheck
import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { PvpWarFightEvent } from "../../constant/event/NotificationEvent";
import { UIAlignType } from "../../constant/UIAlignType";
import { EmWindow } from "../../constant/UIDefine";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import PvpWarFightInfo from "./data/PvpWarFightInfo";

/**
 * 战场右侧信息显示
 */
export default class RvrBattleMapRightWnd extends BaseWindow {
    protected resizeContent: boolean = true;
    public type: fgui.Controller;
    public teamScoreTxt: fgui.GTextField;
    public integralTitleTxt: fgui.GTextField;
    public honerValueTxt: fgui.GTextField;
    public extendBtn: fgui.GButton;
    public helpBtn: fgui.GButton;
    public buyHpBtn: fgui.GButton;
    public rankBtn: fgui.GButton;
    public blueImg: fgui.GImage;
    public redImg: fgui.GImage;
    public comRvrBattleMapRight: fgui.GComponent;
    private _pvpWarFightInfo: PvpWarFightInfo;
    public OnInitWind() {
        super.OnInitWind();

        BaseFguiCom.autoGenerate(this.comRvrBattleMapRight, this);
        Resolution.addWidget(this.comRvrBattleMapRight.displayObject, UIAlignType.RIGHT);
        
        if (CampaignManager.Instance.pvpWarFightModel) {
            this._pvpWarFightInfo = CampaignManager.Instance.pvpWarFightModel.pvpWarFightInfo;
        }
        this.type = this.comRvrBattleMapRight.getController('type');
        this.initEvent();
    }

    OnShowWind() {
        super.OnShowWind();
        this.initData();
    }

    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

    private pvpWarFightInfoHandler() {
        this.initData();
    }

    public initData() {
        if(this._pvpWarFightInfo)
        {
            this.integralTitleTxt.text = this._pvpWarFightInfo.score + "";
            this.honerValueTxt.text = this._pvpWarFightInfo.geste + "";
            this.type.selectedIndex = this._pvpWarFightInfo.teamId - 1;//teamId == 1 蓝色
            if (this._pvpWarFightInfo.teamId == 1) {
                this.teamScoreTxt.text = this._pvpWarFightInfo.oneScore.toString();
            } else {
                this.teamScoreTxt.text = this._pvpWarFightInfo.twoScore.toString();
            }
        }
    }

    private initEvent() {
        if (this._pvpWarFightInfo) this._pvpWarFightInfo.addEventListener(PvpWarFightEvent.PVP_WAR_FIGHT_INFO_CHAGE, this.pvpWarFightInfoHandler, this);
        if (this.buyHpBtn) this.buyHpBtn.onClick(this, this.resetHandler);
        if (this.rankBtn) this.rankBtn.onClick(this, this.sortHandler);
        if(this.helpBtn) this.helpBtn.onClick(this,this.helpHandler);
    }

    private removeEvent() {
        if (this._pvpWarFightInfo) this._pvpWarFightInfo.removeEventListener(PvpWarFightEvent.PVP_WAR_FIGHT_INFO_CHAGE, this.pvpWarFightInfoHandler, this);
        if (this.buyHpBtn) this.buyHpBtn.offClick(this, this.resetHandler);
        if (this.rankBtn) this.rankBtn.offClick(this, this.sortHandler);
        if(this.helpBtn) this.helpBtn.offClick(this,this.helpHandler);
    }

    private resetHandler() {
        CampaignSocketOutManager.Instance.requestWarFightOrderList();
        CampaignSocketOutManager.Instance.warMaxhp();
    }
    private sortHandler() {
        FrameCtrlManager.Instance.open(EmWindow.RvrBattleResultWnd, { type: 1 });
        CampaignSocketOutManager.Instance.requestWarFightOrderList();
    }

    private helpHandler()
    {
        let title = LangManager.Instance.GetTranslation("worldboss.WorldBossFrame.title02");
        let content = LangManager.Instance.GetTranslation("worldboss.view.BaseHelpFrame.BattleHelpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}