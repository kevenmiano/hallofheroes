import FUI_AccountItem from "../../../../../fui/Login/FUI_AccountItem";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { IconType } from "../../../constant/IconType";
import ServerListData, { ServerSite } from "../model/ServerListData";

/**
 * @author:pzlricky
 * @data: 2021-08-10 19:37
 * @description 玩家登录记录列表
 */
export default class AccountItem extends FUI_AccountItem {
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
    this.siteState.selectedIndex = ServerListData.getServerState(
      data.isOpen,
      data.isRepair,
    ); //非维护并且打开则展示成开启状态
    let show = data.playinfo != null;
    this.userState.selectedIndex = show ? 1 : 0;
    if (data.playinfo) {
      let headid = data.playinfo.headId;
      if (headid == 0) {
        headid = data.playinfo.job;
      }
      this.headIcon.url = IconFactory.getPlayerIcon(headid, IconType.HEAD_ICON);
      this.userName.text = data.playinfo.nickName;
      this.userLevel.text = data.playinfo.grades.toString();
    }
    this.userSite.text = data.siteName;
    this.serverSite.text = data.siteName;
    this.serverName.text = data.showName;
  }
}
