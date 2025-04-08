// @ts-nocheck
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import LangManager from '../../../core/lang/LangManager';
import { CampaignManager } from "../../manager/CampaignManager";
import PvpWarFightInfo from "./data/PvpWarFightInfo";
import WarReportInfo from "./data/WarReportInfo";
import { PvpWarFightEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import WarFightOrderInfo from "./data/WarFightOrderInfo";
import { ArrayUtils, ArrayConstant } from '../../../core/utils/ArrayUtils';
import RvrBattleResultItem from "./RvrBattleResultItem";
import Resolution from "../../../core/comps/Resolution";
import PvpWarFightModel from "../../mvc/model/PvpWarFightModel";
import { PlayerManager } from "../../manager/PlayerManager";
import { GameBaseQueueManager } from "../../manager/GameBaseQueueManager";
import StoreRatingAction from "../../action/hero/StoreRatingAction";
import { StoreRatingsType } from "../../constant/StoreRatingsType";
import Utils from "../../../core/utils/Utils";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
/**
 * 战场结算界面
 */
export default class RvrBattleResultWnd extends BaseWindow {
    private type: number = 0;//打开方式 1 代表在战场内部打开界面 2代表战场结算
    public c1: fgui.Controller;
    public isVictory: fgui.GImage;
    public failed: fgui.GImage;
    public rankList: fgui.GList;
    public backBtn: fgui.GButton;
    public awardTxt: fgui.GTextField;
    public honorTxt: fgui.GTextField;
    public titleTxt: fgui.GTextField;
    public back: fgui.GImage;
    public openType: fgui.Controller;
    private _dataArray: Array<WarFightOrderInfo>;
    public OnInitWind() {
        super.OnInitWind();
        if (this.frameData) {
            if (this.frameData.type) {
                this.type = this.frameData.type;
            }
        }
        this.c1 = this.getController('c1');
        this.openType = this.getController('openType');
        this.addEvent();
        this.updateListHandler();
    }

    OnShowWind() {
        super.OnShowWind();
        if (UIManager.Instance.isShowing(EmWindow.LookPlayerList)) {
            UIManager.Instance.HideWind(EmWindow.LookPlayerList);
        }
        this.setCenter();
        this.initData();
    }

    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
        if (PlayerManager.Instance.isScoreRatingApp && PlayerManager.Instance.isExistScoreRating && PlayerManager.Instance.scoreRatingCondition == StoreRatingsType.FIRST_RVR_MVP) {
            GameBaseQueueManager.Instance.addAction(new StoreRatingAction(), true);
        }
    }

    private initData() {
        if (this.type == 1)//战场里面打开
        {
            this.titleTxt.text = LangManager.Instance.GetTranslation("map.campaign.pvp.title01");
            this.back.height = 494;
            this.openType.selectedIndex = 0;
            this.c1.selectedIndex = 0;
            this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2;
            this.y = (Resolution.gameHeight - 500) / 2;
        }
        else if (this.type == 2) {
            this.titleTxt.text = LangManager.Instance.GetTranslation("map.campaign.pvp.title02");
            this.back.height = 648;
            this.openType.selectedIndex = 1;
            this.isVictoryed ? this.c1.selectedIndex = 1 : this.c1.selectedIndex = 2;
            this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2;
            this.y = (Resolution.gameHeight - this.contentPane.sourceHeight) / 2;

            var obj: PvpWarFightModel = CampaignManager.Instance.pvpWarFightModel;
            if (obj) {
                if (obj.fightReportInfo) {
                    var count: number = obj.fightReportInfo.teamCount;
                    count = (count > 0 ? count : 0);
                }
                var info: WarFightOrderInfo = obj.findSelfInfo();
                if (info) {
                    this.awardTxt.text = "" + info.medal;
                    this.honorTxt.text = "" + info.honner;
                }
            }
        }
    }

    private addEvent() {
        this.rankList.itemRenderer = Laya.Handler.create(this, this.renderRankListList, null, false);
        NotificationManager.Instance.addEventListener(PvpWarFightEvent.PVP_WAR_FIGHT_ORDER_REPORT, this.updateListHandler, this);
        this.backBtn.onClick(this, this.backHandler);
    }

    private removeEvent() {
        // this.rankList.itemRenderer.recover();
        Utils.clearGListHandle(this.rankList);
        NotificationManager.Instance.removeEventListener(PvpWarFightEvent.PVP_WAR_FIGHT_ORDER_REPORT, this.updateListHandler, this);
        this.backBtn.offClick(this, this.backHandler);
    }

    private backHandler() {
        this.hide();
    }

    renderRankListList(index: number, item: RvrBattleResultItem) {
        if (!item || !this._dataArray[index]) return;
        item.type = this.type;
        item.info = this._dataArray[index];
    }

    private updateListHandler() {
        if (!CampaignManager.Instance.pvpWarFightModel) return;
        var data: Array<WarFightOrderInfo> = CampaignManager.Instance.pvpWarFightModel.warFightOrderList;
        if (!data || data.length === 0) return;
        data = ArrayUtils.sortOn(data, ["order"], [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING]);
        data = data.reverse();
        this.refreshList(data);
    }

    private refreshList(arr: Array<WarFightOrderInfo>) {
        if (!arr || arr.length == 0) return;
        this.findMvp(arr);
        this._dataArray = ArrayUtils.sortOn(arr, ["score"], [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING]);
        this.rankList.numItems = this._dataArray.length;
    }

    private findMvp(array: Array<WarFightOrderInfo>) {
        if (this.type == 1) return;
        array = ArrayUtils.sortOn(array, ["hitCount", "score"], [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING, ArrayConstant.NUMERIC | ArrayConstant.DESCENDING]);
        array[0].isMvp = true;
    }

    public get isVictoryed(): boolean {
        var pvpWarFightInfo: PvpWarFightInfo = CampaignManager.Instance.pvpWarFightModel.pvpWarFightInfo;
        var pvpWarReportInfo: WarReportInfo = CampaignManager.Instance.pvpWarFightModel.fightReportInfo;
        return pvpWarFightInfo && pvpWarReportInfo && pvpWarFightInfo.teamId == pvpWarReportInfo.oneTeamId;
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}