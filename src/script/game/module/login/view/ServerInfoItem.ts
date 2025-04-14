import FUI_ServerInfoItem from "../../../../../fui/Login/FUI_ServerInfoItem";
import ServerListData, { ServerSite } from "../model/ServerListData";

/**
 * @author:pzlricky
 * @data: 2021-08-10 19:38
 * @description 服务器列表信息
 */
export default class ServerInfoItem extends FUI_ServerInfoItem {
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

  setItemData(data: ServerSite) {
    if (!data) return;
    this.serverInfoData = data;
    this.siteState1.selectedIndex = ServerListData.getServerState(
      data.isOpen,
      data.isRepair,
    ); //非维护并且打开则展示成开启状态
    this.siteState2.selectedIndex = data.type - 1;
    this.serverSite.text = data.siteName;
    this.serverName.text = data.showName;
  }
}
