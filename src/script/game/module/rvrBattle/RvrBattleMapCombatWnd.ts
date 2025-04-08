// @ts-nocheck
import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { PvpWarFightEvent } from "../../constant/event/NotificationEvent";
import { UIAlignType } from "../../constant/UIAlignType";
import { CampaignManager } from "../../manager/CampaignManager";
import { PlayerManager } from "../../manager/PlayerManager";
import PvpWarFightInfo from "./data/PvpWarFightInfo";

/**
 * 战场对阵信息窗口
 */
export default class RvrBattleMapCombatWnd extends BaseWindow {
    protected resizeContent: boolean = true;
    public blueScoreTxt: fgui.GTextField;
    public redScoreTxt: fgui.GTextField;
    public blueCountTxt: fgui.GTextField;
    public redCountTxt: fgui.GTextField;
    public comRvrBattleMapCombat: fgui.GComponent;
    public redCom: fgui.GComponent;
    public blueCom: fgui.GComponent;
    private _pvpWarFightInfo: PvpWarFightInfo;

    public OnInitWind() {
        super.OnInitWind();

        BaseFguiCom.autoGenerate(this.comRvrBattleMapCombat, this);
        Resolution.addWidget(this.comRvrBattleMapCombat.displayObject, UIAlignType.RIGHT);

        PlayerManager.Instance.synchronizedSystime();
        this._pvpWarFightInfo = CampaignManager.Instance.pvpWarFightModel.pvpWarFightInfo;

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

    private initEvent() {
        if (this._pvpWarFightInfo) this._pvpWarFightInfo.addEventListener(PvpWarFightEvent.PVP_WAR_FIGHT_INFO_CHAGE, this.pvpWarFightInfoHandler, this);
    }

    private removeEvent() {
        if (this._pvpWarFightInfo) this._pvpWarFightInfo.removeEventListener(PvpWarFightEvent.PVP_WAR_FIGHT_INFO_CHAGE, this.pvpWarFightInfoHandler, this);
    }

    private pvpWarFightInfoHandler() {
        this.initData();
    }

    public initData() {
        this.blueScoreTxt.text = this._pvpWarFightInfo.oneScore + "";
        this.redScoreTxt.text = this._pvpWarFightInfo.twoScore + "";
        this.blueCountTxt.text = LangManager.Instance.GetTranslation("RVR.NumberOfContestants", this._pvpWarFightInfo.oneCount);
        this.redCountTxt.text = LangManager.Instance.GetTranslation("RVR.NumberOfContestants", this._pvpWarFightInfo.twoCount);
        this.redCom.getChild("title").text = LangManager.Instance.GetTranslation("RvrBattleMapCombatWnd.redCamp");
        this.blueCom.getChild("title").text = LangManager.Instance.GetTranslation("RvrBattleMapCombatWnd.blueCamp");
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}