import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import Utils from "../../../core/utils/Utils";
import { EmWindow } from "../../constant/UIDefine";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { NotificationManager } from "../../manager/NotificationManager";
import OutyardManager from "../../manager/OutyardManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../consortia/control/ConsortiaControler";
import { ConsortiaDutyInfo } from "../consortia/data/ConsortiaDutyInfo";
import OutyardGuildInfo from "./data/OutyardGuildInfo";
import OutyardUserInfo from "./data/OutyardUserInfo";
import OutyardMemberFirstItem from "./view/OutyardMemberFirstItem";
import OutyardMemberSecondItem from "./view/OutyardMemberSecondItem";
/**
 * 部队列表 守备部队和四将列表
 */
export default class OutyardMemberWnd extends BaseWindow {
  public list1: fgui.GList;
  public group1: fgui.GGroup;
  public list2: fgui.GList;
  public group2: fgui.GGroup;
  public typeCtr: fgui.Controller;
  private list1Data: Array<OutyardUserInfo> = [];
  private list2Data: Array<OutyardUserInfo> = [];
  public tabBtn0: UIButton;
  public tabBtn1: UIButton;
  public tabBtn2: UIButton;
  public tabBtn3: UIButton;
  public tabCtr: fgui.Controller;
  public attackTxt: fgui.GTextField;
  public defenceTxt: fgui.GTextField;
  private _currentOutyardGuildInfo: OutyardGuildInfo;
  private _guildArr: Array<OutyardGuildInfo> = [];
  private _config1: Array<any> = [];
  private _config2: Array<any> = [];
  public OnInitWind() {
    this.setCenter();
    this.typeCtr = this.getController("typeCtr");
    this.tabCtr = this.getController("tabCtr");
    this.addEvent();
    this._config1 = ConfigInfoManager.Instance.getStackHeadAttackBuff();
    this._config2 = ConfigInfoManager.Instance.getStackHeadDefenceBuff();

    this.initGroupBtn();
  }

  OnShowWind() {
    super.OnShowWind();
    this.tabCtr.selectedIndex = 0;
    this.onTabChangeController();
    this.typeCtr.selectedIndex = 0;
    this.onChangeController();
  }

  private addEvent() {
    this.list1.itemRenderer = Laya.Handler.create(
      this,
      this.renderList1Item,
      null,
      false,
    );
    this.list2.itemRenderer = Laya.Handler.create(
      this,
      this.renderList2Item,
      null,
      false,
    );
    this.typeCtr.on(
      fairygui.Events.STATE_CHANGED,
      this,
      this.onChangeController,
    );
    this.tabCtr.on(
      fairygui.Events.STATE_CHANGED,
      this,
      this.onTabChangeController,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.OUTYARD_USERLIST_INFO,
      this.onChangeController,
      this,
    );
  }

  private removeEvent() {
    // this.list1.itemRenderer.recover();
    // this.list2.itemRenderer.recover();
    Utils.clearGListHandle(this.list1);
    Utils.clearGListHandle(this.list2);
    this.typeCtr.off(
      fairygui.Events.STATE_CHANGED,
      this,
      this.onChangeController,
    );
    this.tabCtr.off(
      fairygui.Events.STATE_CHANGED,
      this,
      this.onTabChangeController,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.OUTYARD_USERLIST_INFO,
      this.onChangeController,
      this,
    );
  }

  private renderList1Item(index: number, item: OutyardMemberFirstItem) {
    if (!item || item.isDisposed) return;
    item.info = this.list1Data[index];
  }

  private renderList2Item(index: number, item: OutyardMemberSecondItem) {
    if (!item || item.isDisposed) return;
    item.index = index + 1;
    item.flag = this.isConsortiaMian() && this.tabCtr.selectedIndex == 0;
    item.info = this.list2Data[index];
  }

  private initGroupBtn() {
    let guildArr: Array<OutyardGuildInfo> = OutyardManager.Instance.guildArr;
    this._guildArr = ArrayUtils.sortOn(
      guildArr,
      ["isMySelf", "pos"],
      [ArrayConstant.DESCENDING, ArrayConstant.NUMERIC],
    );
    if (this._guildArr) {
      let len: number = this._guildArr.length;
      let outyardGuildInfo: OutyardGuildInfo;
      for (let i: number = 0; i < 4; i++) {
        outyardGuildInfo = this._guildArr[i];
        if (i < len) {
          this["tabBtn" + i].visible = true;
          this["tabBtn" + i].title = outyardGuildInfo.guildName;
          this["tabBtn" + i].view.getController("rankCtr").selectedIndex =
            outyardGuildInfo.order - 1;
        } else {
          this["tabBtn" + i].visible = false;
        }
      }
    }
  }

  private onChangeController() {
    switch (this.typeCtr.selectedIndex) {
      case 0:
        this.list1Data = OutyardManager.Instance.getMemberArrByType(0);
        this.list1.numItems = this.list1Data.length;
        break;
      case 1:
        this.list2Data = OutyardManager.Instance.getMemberArrByType(1);
        this.list2.numItems = this.list2Data.length;
        break;
    }
  }

  private onTabChangeController() {
    let index = this.tabCtr.selectedIndex;
    this._currentOutyardGuildInfo = this._guildArr[index];
    let attackValue =
      this._currentOutyardGuildInfo.attackBuffLevel * this._config1[1] + "%";
    let defenceValue =
      this._currentOutyardGuildInfo.defenceBuffLevel * this._config2[1] + "%";
    this.attackTxt.text = LangManager.Instance.GetTranslation(
      "outyardMember.attack.text",
      attackValue,
    );
    this.defenceTxt.text = LangManager.Instance.GetTranslation(
      "outyardMember.defence.text",
      defenceValue,
    );
    OutyardManager.Instance.OperateOutyard(
      OutyardManager.REQUEST_LIST,
      0,
      this._currentOutyardGuildInfo.guildUid,
    );
  }

  private isConsortiaMian(): boolean {
    let flag: boolean = false;
    let consortiaControler: ConsortiaControler =
      FrameCtrlManager.Instance.getCtrl(
        EmWindow.ConsortiaSecretInfoWnd,
      ) as ConsortiaControler;
    if (
      consortiaControler &&
      consortiaControler.getRightsByIndex(
        ConsortiaDutyInfo.STACKHEAD_SENIORGENERAL,
      )
    ) {
      flag = true;
    }
    return flag;
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose() {
    super.dispose();
  }
}
