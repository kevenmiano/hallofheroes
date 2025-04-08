import BaseWindow from '../../../../core/ui/Base/BaseWindow';
import Utils from '../../../../core/utils/Utils';
import { SelectServerEvent } from '../../../constant/event/NotificationEvent';
import { NotificationManager } from '../../../manager/NotificationManager';
import ServerListData, { GroupSite } from '../model/ServerListData';
import RecordLoginPane from './RecordLoginPane';
import ServerInfoItem from './ServerInfoItem';
/**
* @author:pzlricky
* @data: 2021-08-09 15:18
* @description 选则服务器界面 
*/
export default class ServerlistWnd extends BaseWindow {


    public tabControl: fgui.Controller;
    public serverItemlist: fgui.GList;//具体服务器列表信息
    public recordlist: RecordLoginPane;//个人登录历史记录
    public serverList: fgui.GList;//左侧服务器列表

    private serverListData: ServerListData = null;
    private serverInfoListData: GroupSite = null;

    public modelEnable: boolean = false;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.addEvent();
        this.onInitData();

    }

    OnShowWind() {
        super.OnShowWind();
    }

    OnHideWind() {
        super.OnHideWind();
        this.offEvent();
    }

    addEvent() {
        this.serverList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.serverItemlist.itemRenderer = Laya.Handler.create(this, this.renderInfoListItem, null, false);
        this.serverList.on(fairygui.Events.CLICK_ITEM, this, this.onServerListSelect);
        this.serverItemlist.on(fairygui.Events.CLICK_ITEM, this, this.onServerInfoListSelect);
    }

    offEvent() {
        // this.serverList && this.serverList.itemRenderer.recover();
        // this.serverItemlist && this.serverItemlist.itemRenderer.recover();
        Utils.clearGListHandle(this.serverList);
        Utils.clearGListHandle(this.serverItemlist);
        this.serverList.off(fairygui.Events.CLICK_ITEM, this, this.onServerListSelect);
        this.serverItemlist.off(fairygui.Events.CLICK_ITEM, this, this.onServerInfoListSelect);
    }

    onInitData() {
        this.tabControl = this.getController('tabControl');
        this.tabControl.selectedIndex = 1;
        if (this.params)
            this.serverListData = this.params;

        if (this.serverListData) {//默认选择第0个页签
            this.serverList.numItems = this.serverListData.ALL.length;
            this.serverList.ensureBoundsCorrect();
            this.serverList.selectedIndex = 0;
            if (this.serverListData.recentLoginServer) {
                this.tabControl.selectedIndex = 0
                let itemdata = this.serverListData.ALL[0];
                this.recordlist.setData(itemdata);
                this.recordlist.setDefaultSelected();
            } else {
                this.onServerListSelect();
            }
        }
    }

    /**
     * 右侧服务器列表信息
     */
    renderInfoListItem(index: number, item: ServerInfoItem) {
        if (!this.serverInfoListData) return;
        let sitedata = this.serverInfoListData.sites[index];
        item.setItemData(sitedata);
    }

    /**渲染左侧服务器列表 */
    renderListItem(index: number, item: fgui.GButton) {
        let itemdata = this.serverListData.ALL[index];
        if (itemdata) {
            item.data = itemdata;
            item.title = this.getUnSelectTitleNameStr(itemdata.groupName);
            item.selectedTitle = this.getSelectTitleNameStr(itemdata.groupName);
        }
    }

    private getSelectTitleNameStr(titleStr: string): string {
        return `[size=24][color=#3B0005][B]${titleStr}[/B][/color][/size]`;
    }

    private getUnSelectTitleNameStr(titleStr: string): string {
        return `[size=24][color=#C1A163]${titleStr}[/color][/size]`;
    }

    /**
     * 右侧服务器列表点击
     * @param selectItem 
     */
    onServerInfoListSelect(selectItem: ServerInfoItem) {
        if (selectItem && selectItem.serverInfo) {
            NotificationManager.Instance.dispatchEvent(SelectServerEvent.CHANGE, selectItem.serverInfo);
        }
    }

    /**选择左侧服务器 */
    onServerListSelect() {
        let selectIndex = this.serverList.selectedIndex;
        let itemdata = this.serverListData.ALL[selectIndex];
        if (this.serverListData.recordLoginServers.length && selectIndex == 0) {//如果存在登录历史记录
            this.serverInfoListData = null;
            this.tabControl.selectedIndex = selectIndex;
            this.recordlist.setData(itemdata);
        } else {
            this.serverItemlist.clearSelection();
            this.serverInfoListData = itemdata;
            this.tabControl.selectedIndex = 1;
            this.serverItemlist.numItems = itemdata.sites.length;
            this.serverItemlist.ensureBoundsCorrect();
        }
    }

}