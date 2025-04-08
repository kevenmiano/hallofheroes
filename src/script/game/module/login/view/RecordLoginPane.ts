// @ts-nocheck
import FUI_RecordList from '../../../../../fui/Login/FUI_RecordList';
import Utils from '../../../../core/utils/Utils';
import { SelectServerEvent } from '../../../constant/event/NotificationEvent';
import { NotificationManager } from '../../../manager/NotificationManager';
import { GroupSite } from '../model/ServerListData';
import AccountItem from './AccountItem';


/**
* @author:pzlricky
* @data: 2021-08-10 19:29
* @description 玩家登录记录
*/
export default class RecordLoginPane extends FUI_RecordList {

    private userLoginData: GroupSite;

    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
        this.allAccountList.setVirtual();
        this.addEvent();
    }

    addEvent() {
        this.lastLoginItem.onClick(this, this.onClickItem);
        this.allAccountList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.allAccountList.on(fairygui.Events.CLICK_ITEM, this, this.onServerListSelect);
    }

    offEvent() {
        this.lastLoginItem.offClick(this, this.onClickItem);
        // this.allAccountList.itemRenderer && this.allAccountList.itemRenderer.recover();
        Utils.clearGListHandle(this.allAccountList);
        this.allAccountList.off(fairygui.Events.CLICK_ITEM, this, this.onServerListSelect);
    }

    renderListItem(index: number, item: AccountItem) {
        let siteData = this.userLoginData.sites[index];
        item.setItemData(siteData);
    }

    onClickItem() {
        //清除所有历史选择
        this.allAccountList.clearSelection();
        if (this.lastLoginItem && (this.lastLoginItem as AccountItem).serverInfo) {
            NotificationManager.Instance.dispatchEvent(SelectServerEvent.CHANGE, (this.lastLoginItem as AccountItem).serverInfo);
        }
    }

    //选择服务器
    onServerListSelect(selectedItem: AccountItem) {
        if (this.lastLoginItem)
            this.lastLoginItem.selected = false;
        if (selectedItem && selectedItem.serverInfo) {
            NotificationManager.Instance.dispatchEvent(SelectServerEvent.CHANGE, selectedItem.serverInfo);
        }
    }

    setData(data: GroupSite) {
        this.userLoginData = data;
        this.lastLoginItem.visible = data.sites.length > 0;
        if (data.sites.length > 0)
            (this.lastLoginItem as AccountItem).setItemData(data.sites[0]);
        this.allAccountList.numItems = data.sites.length;
        this.allAccountList.ensureBoundsCorrect();
    }

    setDefaultSelected() {
        if (this.lastLoginItem && (this.lastLoginItem as AccountItem).serverInfo)
            this.lastLoginItem.selected = false;
    }
}