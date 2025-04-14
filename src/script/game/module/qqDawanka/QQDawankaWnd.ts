import FUI_titleBtn from "../../../../fui/QQDawanka/FUI_titleBtn";
import AudioManager from "../../../core/audio/AudioManager";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { QQ_HALL_EVENT } from "../../constant/event/NotificationEvent";
import { SoundIds } from "../../constant/SoundIds";

import QQDawankaManager from "../../manager/QQDawankaManager";
import QQDawankaModel from "./QQDawankaModel";
import QQDawankaItem1 from "./item/QQDawankaItem1";
import QQDawankaItem2 from "./item/QQDawankaItem2";
import SDKManager from "../../../core/sdk/SDKManager";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
import { TempleteManager } from "../../manager/TempleteManager";
import Utils from "../../../core/utils/Utils";

export default class QQDawankWnd extends BaseWindow {
  public setOptimize = false;
  public cPage: fgui.Controller;
  public cActive: fgui.Controller;
  public txtLevel: fgui.GTextField;
  public txtValue: fgui.GTextField;
  public txtBtn: fgui.GButton;
  public closeBtn: fgui.GButton;
  public unlockBtn: fgui.GButton;
  public txtActiving: fgui.GRichTextField;
  public dateTablist: fgui.GList;
  public tabSelect: fgui.GImage;
  public datalist1: fgui.GList;
  public datalist2: fgui.GList;

  public OnInitWind() {
    this.setCenter();
    // this.c1Control = this.getController("c1");
    // this.effect = this.getController("effect");
    // this.getRewardCtr = this.getController("getRewardCtr");
    // PetCampaignManager.Instance.model.parseConfig();
    this.cPage = this.getController("cPage");
    this.cActive = this.getController("cActive");

    this.addEvent();
    this.initView();
  }

  private get _model(): QQDawankaModel {
    return QQDawankaManager.Instance.model;
  }

  private addEvent() {
    this.txtBtn.onClick(this, this.helpBtnClick);
    this.unlockBtn.onClick(this, this.unlockBtnClick);
    this._model.addEventListener(
      QQ_HALL_EVENT.GARDE_CHANGE,
      this.refreshView,
      this,
    );
    this._model.addEventListener(
      QQ_HALL_EVENT.TAB_CHANGE,
      this.onTabChange,
      this,
    );
  }

  private offEvent() {
    // this.txtBtn.offClick(this, this.helpBtnClick);
    this._model.removeEventListener(
      QQ_HALL_EVENT.GARDE_CHANGE,
      this.refreshView,
      this,
    );
    this._model.removeEventListener(
      QQ_HALL_EVENT.TAB_CHANGE,
      this.onTabChange,
      this,
    );

    if (this.dateTablist) {
      // this.dateTablist.itemRenderer.recover();
      Utils.clearGListHandle(this.dateTablist);
      this.dateTablist.off(
        fairygui.Events.CLICK_ITEM,
        this,
        this.__onTitleSelect,
      );
    }
  }

  private initView() {
    this.initText();
    this.initTabList();
    this.initDataList();
    this.refreshView();
  }

  private initTabList() {
    this.dateTablist.itemRenderer = Laya.Handler.create(
      this,
      this.renderTitleListItem,
      null,
      false,
    );
    this.dateTablist.numItems = this._model.gradeMap.size;
    this.dateTablist.selectedIndex = 0;
    let selectGrade = this._model.getIndexGrade(0);
    this._model.setSelectGrade(selectGrade);
    this.dateTablist.on(fairygui.Events.CLICK_ITEM, this, this.__onTitleSelect);
  }

  initDataList() {
    this.datalist1.itemRenderer = Laya.Handler.create(
      this,
      this.renderDataListItem1,
      null,
      false,
    );
    this.datalist2.itemRenderer = Laya.Handler.create(
      this,
      this.renderDataListItem2,
      null,
      false,
    );
  }

  renderDataListItem1(index: number, item: QQDawankaItem1) {
    // item.title.text = this._model.getQQGradePrivilegeDataByGrade(this._model.getSelectGrade())[index].Privilegename;
    // let data = this._model.getQQGradePrivilegeDataByGrade(this._model.getSelectGrade())[index];
    // let info = JSON.parse(JSON.stringify(data));
    // if (index == 2) {
    //     info.rewards = this._model.getQQGradeData(index).Privilegereward;
    //     info.Privilegename = '绝版专享特权';
    // } else if (index == 1) {
    //     info.rewards = this._model.getQQGradeData(index).Weekgiftbag;
    //     info.Privilegename = '专属周礼特权';
    // }
    // item.setInfo(info);
    item.setInfo(this._model.getRenderList(true, index));
  }

  renderDataListItem2(index: number, item: QQDawankaItem2) {
    // item.title.text = this._model.getQQGradePrivilegeDataByGrade(this._model.getSelectGrade())[index].Privilegename;
    // item.setInfo(this._model.getQQGradePrivilegeDataByGrade(this._model.getSelectGrade())[index + 1]);

    item.setInfo(this._model.getRenderList(false, index));
  }

  renderTitleListItem(index: number, item: FUI_titleBtn) {
    let gradeLevel = this._model.gradeMap.get(index);
    item.title = this._model.getGradeNameByGrade(gradeLevel);
    item.data = gradeLevel;

    item.sIndex = index;
  }

  __onTitleSelect(item) {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    // this.cPage.selectedIndex = item.sIndex;
    this._model.setSelectGrade(item.data);
  }

  onTabChange() {
    let index = this._model.getSelectGrade();
    let tabIndex = this._model.getGradeIndex(index);
    this.cPage.selectedIndex = tabIndex;
    this.refreshView();
  }

  OnShowWind() {
    super.OnShowWind();
    // 服务器会主动推
    // QQDawankaManager.Instance.getInfo();
  }

  private initText() {
    this.txtBtn.text = LangManager.Instance.GetTranslation(
      "QQ.Hall.Dawanka.tips1",
    );
    this.txtActiving.text = LangManager.Instance.GetTranslation(
      "QQ.Hall.Dawanka.activing",
    );
  }

  private refreshView() {
    this.txtLevel.text = LangManager.Instance.GetTranslation(
      "QQ.Hall.Dawanka.myLevel",
      this._model.getGradeNameByGrade(this._model.getPlayerGarde()),
    );
    this.txtValue.text = LangManager.Instance.GetTranslation(
      "QQ.Hall.Dawanka.myValue",
      this._model.getPlayerDawankaValue(),
    );
    this.datalist1.numItems = this._model.getNUM_UP();
    this.datalist2.numItems = this._model.getNUM_UP() + 1;
    // this.cPage.selectedIndex = this._model.getSelectGrade() - 1;
    this.cActive.selectedIndex = this._model.getUnlock() ? 1 : 0;

    let arrs = this._model.getTitleRedDotArrs();
    for (let i = 0; i < arrs.length; i++) {
      this["red" + i].visible = arrs[i];
    }
  }

  helpBtnClick() {
    // let title = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.title");
    // let content = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.help");
    // UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    SDKManager.Instance.getChannel().jumpPrivilege(1006);
  }

  unlockBtnClick() {
    //调取6元充值
    // RechargeAlertMannager.Instance.recharge(TempleteManager.Instance.getRechargeTempletes()[0].ProductId);
    RechargeAlertMannager.Instance.openShopRecharge();
  }

  OnHideWind() {
    super.OnHideWind();
    this.offEvent();
  }
}
