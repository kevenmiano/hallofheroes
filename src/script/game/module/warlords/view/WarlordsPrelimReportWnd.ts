import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import WarlordsManager from "../../../manager/WarlordsManager";
import WarlordsModel from "../WarlordsModel";
import LangManager from '../../../../core/lang/LangManager';
import { WarlordsEvent } from "../../../constant/event/NotificationEvent";
import WarlordsPrelimReportItem from "./component/WarlordsPrelimReportItem";
import Utils from "../../../../core/utils/Utils";
/**
 * 众神之战预赛结果
 */
export default class WarlordsPrelimReportWnd extends BaseWindow {
    public MsgText1: fgui.GRichTextField;
    public MsgText2: fgui.GRichTextField;
    public rankList: fgui.GList;
    public c1: fgui.Controller;
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.c1 = this.getController("c1");
        this.initEvent();
        this.initData();
    }

    private initData() {
        WarlordsManager.Instance.reqAccessFinalList();
    }

    private initEvent() {
        this.warlordsModel.addEventListener(WarlordsEvent.ACCESS_FINALLIST_UPDATE, this.accessFinalListUpdateHandler, this);
        this.rankList.itemRenderer = Laya.Handler.create(this, this.renderRankListItem, null, false);
    }

    private removeEvent() {
        this.warlordsModel.removeEventListener(WarlordsEvent.ACCESS_FINALLIST_UPDATE, this.accessFinalListUpdateHandler, this);
        // if (this.rankList && this.rankList.itemRenderer) this.rankList.itemRenderer.recover();
        Utils.clearGListHandle(this.rankList);
    }

    renderRankListItem(index: number, item: WarlordsPrelimReportItem) {
        if (this.warlordsModel && this.warlordsModel.accessFinalList)
            if(item)item.info = this.warlordsModel.accessFinalList[index];
    }

    private accessFinalListUpdateHandler() {
        this.refresh();
    }

    private refresh() {
        if (this.warlordsModel.selfInfo.sort > 0 && this.warlordsModel.selfInfo.sort <= 100) {
            var group: String = WarlordsModel.checkIsTempleGroup(this.warlordsModel.selfInfo.fightingCapacityRank) ? LangManager.Instance.GetTranslation("warlords.WarlordsBetSelectFrame.temple") : LangManager.Instance.GetTranslation("warlords.WarlordsBetSelectFrame.brave");
            var time: String = this.warlordsModel.getMatchDate(3) ? DateFormatter.format(this.warlordsModel.getMatchDate(3), "MM-DD hh:mm") : "";
            this.c1.selectedIndex = 1;
            this.MsgText2.text = LangManager.Instance.GetTranslation("warlords.room.WarlordsPrelimReportView.MsgText1", this.warlordsModel.selfInfo.sort, this.warlordsModel.selfInfo.fightingCapacityRank, group, time);
        } else {
            this.c1.selectedIndex = 0;
        }
        this.rankList.numItems = this.warlordsModel.accessFinalList.length;
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }


    private get warlordsModel(): WarlordsModel {
        return WarlordsManager.Instance.model;
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}