// @ts-nocheck
import FUI_SelectItem from '../../../../../fui/Login/FUI_SelectItem';
import ServerListData, { ServerSite } from '../model/ServerListData';

/**
* @author:pzlricky
* @data: 2021-08-09 15:10
* @description 选择服务器信息
*/
export default class SelectServerItem extends FUI_SelectItem {

    private serverInfoData: ServerSite = null;

    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
    }

    public get serverInfo() {
        return this.serverInfoData;
    }

    setServer(data: ServerSite) {
        if (!data) return;
        this.serverInfoData = data;
        this.siteState.selectedIndex = ServerListData.getServerState(data.isOpen, data.isRepair);//非维护并且打开则展示成开启状态
        this.siteMode.selectedIndex = ServerListData.getServerMode(data.type);//区服标识
        this.serverSite.text = data.siteName;
        this.serverName.text = data.showName;
    }

    dispose() {
        this.serverInfoData = null;
        super.dispose();
    }


}