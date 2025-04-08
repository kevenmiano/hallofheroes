import BaseWindow from "../../../core/ui/Base/BaseWindow";
import Utils from "../../../core/utils/Utils";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import OutyardManager from "../../manager/OutyardManager";
import OutyardReportInfo from "./data/OutyardReportInfo";
import OutyardBattleRecordItem from "./view/OutyardBattleRecordItem";
/**公会战战报 */
export default class OutyardBattleRecordWnd extends BaseWindow {
    public list: fgui.GList;
    public tab: fgui.Controller;
    private _listData: Array<OutyardReportInfo> = [];
    private _tabIndex: number = 0;
    public OnInitWind() {
        this.setCenter();
        this.tab = this.getController('tab');
        this.addEvent();
        this.tab.selectedIndex = 0;
    }

    OnShowWind() {
        super.OnShowWind();
        //请求界面初始化的战报数据
        OutyardManager.Instance.OperateOutyard(OutyardManager.REFRESH_REPORT, this._tabIndex + 1, "", null, 1);
        OutyardManager.Instance.OperateOutyard(OutyardManager.REFRESH_REPORT, this._tabIndex + 2, "", null, 1);
    }

    private addEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.tab.on(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
        this.list.on(fgui.Events.PULL_UP_RELEASE, this, this.onPullUpToRefresh);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_REFRESH_REPORT, this.refreshView, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_INIT_REPORT, this.initView, this);
    }

    private removeEvent() {
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        this.tab.off(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
        this.list.off(fgui.Events.PULL_UP_RELEASE, this, this.onPullUpToRefresh);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_REFRESH_REPORT, this.refreshView, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_INIT_REPORT, this.initView, this);
    }

    private onPullUpToRefresh(evt: Laya.Event) {
        if (!this.list.scrollPane.footer || !OutyardManager.Instance.canRefreshReport) {
            return;
        }
        var footer: fgui.GComponent = this.list.scrollPane.footer.asCom;
        this.list.scrollPane.lockFooter(footer.sourceHeight);
        footer.getController("c1").selectedIndex = 1;
        let notice: string = this._listData[this._listData.length - 1].timestamp;
        OutyardManager.Instance.OperateOutyard(OutyardManager.REFRESH_REPORT, this._tabIndex + 1, notice, null, 1);//刷新数据
    }

    private refreshView() {
        var footer: fgui.GComponent = this.list.scrollPane.footer.asCom;
        footer.getController("c1").selectedIndex = 0;
        this.initDataList();
        this.list.scrollPane.lockFooter(0);
    }

    private initView() {
        this.initDataList();
    }

    private initDataList(){
        if (this._tabIndex == 0) {//进攻
            this._listData = OutyardManager.Instance.attackReportArr;

        } else {//防守
            this._listData = OutyardManager.Instance.defenceReportArr;
        }
        this.list.numItems = this._listData.length;
    }

    private renderListItem(index: number, item: OutyardBattleRecordItem) {
        if (!item || item.isDisposed) return;
        item.type = this._tabIndex+1;
        item.info = this._listData[index];
    }

    private onTabChanged(cc: fgui.Controller) {
        this._tabIndex = cc.selectedIndex;
        this.initDataList();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose() {
        super.dispose();
        OutyardManager.Instance.setAttackReportArr([]);
        OutyardManager.Instance.setDefenceReportArr([]);
    }
}