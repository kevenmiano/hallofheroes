import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import Utils from "../../../core/utils/Utils";
import { HookEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import { HookManager } from "../../manager/HookManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { VIPManager } from "../../manager/VIPManager";
import HookInfo from "./data/HookInfo";
import HookItem from "./view/HookItem";
/**
 * @author pzlricky
 * @description 修行神殿
 * @Date 2021-11-29 11:23:20
 **/
export default class HookWnd extends BaseWindow {
  private frame: fgui.GComponent;
  private list: fgui.GList;
  private txt_tips: fgui.GTextField;

  private hooklistData: Array<HookInfo> = [];

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    let titleText = LangManager.Instance.GetTranslation("hook.HookFrame.title");
    this.frame.getChild("title").text = titleText;
    // this.txt_tips.text = LangManager.Instance.GetTranslation("hookWnd.hook.rulesDesc");
    //VIP特权体力领取
    let minLevel = VIPManager.Instance.model.getMinGradeHasPrivilege(
      VipPrivilegeType.HOOK_OUTDATE_STAMINA,
    );
    this.txt_tips.setVar("level", minLevel.toString()).flushVars();
    this.initEvent();
    this.initRequest();
  }

  helpBtnClick() {
    let title = "";
    let content = "";
    title = LangManager.Instance.GetTranslation(
      "map.campaign.view.frame.HookHelperFrame.title",
    );
    content = LangManager.Instance.GetTranslation(
      "map.campaign.view.frame.HookHelperFrame.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private initEvent() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      HookEvent.UPDATE_HOOK,
      this.updateHookHandler,
      this,
    );
  }

  private offEvent() {
    // this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    NotificationManager.Instance.removeEventListener(
      HookEvent.UPDATE_HOOK,
      this.updateHookHandler,
      this,
    );
  }

  /**更新修行神殿信息 */
  private updateHookHandler() {
    this.initData();
  }

  private initData() {
    this.hooklistData = HookManager.Instance.hookInfolist;
    if (this.hooklistData.length) {
      this.list.numItems = this.hooklistData.length;
    }
  }

  private renderListItem(index: number, item: HookItem) {
    item.cellValue = this.hooklistData[index];
  }

  private initRequest() {
    HookManager.Instance.requestHookInfo();
  }

  OnShowWind() {
    super.OnShowWind();
  }

  OnHideWind() {
    super.OnHideWind();
    this.offEvent();
  }
}
