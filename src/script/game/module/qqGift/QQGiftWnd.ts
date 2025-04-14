import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { BaseItem } from "../../component/item/BaseItem";
import { QQ_HALL_EVENT } from "../../constant/event/NotificationEvent";
import QQGiftManager from "../../manager/QQGiftManager";
import { QQLevelGiftItem } from "./item/QQLevelGiftItem";
import QQGiftModel from "./QQGiftModel";

export default class QQGiftWnd extends BaseWindow {
  // public setOptimize = false;
  public cType: fgui.Controller;
  public tabList: fgui.GList;
  public txtTitle: fgui.GTextField;
  public levelList: fgui.GList;
  public txt1: fgui.GTextField;
  public txt2: fgui.GTextField;
  public txt3: fgui.GTextField;
  public btn_receive: fgui.GButton;
  public btnGray: fgui.GButton;
  public list: fgui.GList;
  tabData: string[];

  public OnInitWind() {
    this.setCenter();
    this.cType = this.getController("cType");
    this.tabData = [
      "box.novice.GradeBoxFrame.title",
      "QQ.Hall.Gift.levelGift",
      "QQ.Hall.Gift.dailyGift",
    ];
    this.addEvent();
    this.initView();
  }

  public OnShowWind(): void {
    this.tabList.selectedIndex = 0;
    this.cType.selectedIndex = 0;
    this._model.setCurType(0);
  }

  private get _model(): QQGiftModel {
    return QQGiftManager.Instance.model;
  }

  private addEvent() {
    this.tabList.itemRenderer = Laya.Handler.create(
      this,
      this.renderTabListItem,
      null,
      false,
    );
    this.tabList.numItems = this.tabData.length;
    this.tabList.on(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onTabSelectHandler,
    );
    this.tabList.selectedIndex = 0;
    this.cType.selectedIndex = 0;
    this._model.addEventListener(
      QQ_HALL_EVENT.GIFT_CHANGE,
      this.refreshView,
      this,
    );
    this._model.addEventListener(
      QQ_HALL_EVENT.GIFT_TAB_CHANGE,
      this.refreshView,
      this,
    );
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.levelList.itemRenderer = Laya.Handler.create(
      this,
      this.renderLevelListItem,
      null,
      false,
    );
    this.levelList.numItems = this._model.getLevelList().length;
    this.btn_receive.onClick(this, this.onBtnReceive);
  }

  private offEvent() {
    this.tabList.off(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onTabSelectHandler,
    );
    this._model.removeEventListener(
      QQ_HALL_EVENT.GIFT_CHANGE,
      this.refreshView,
      this,
    );
    this._model.removeEventListener(
      QQ_HALL_EVENT.GIFT_TAB_CHANGE,
      this.refreshView,
      this,
    );
    this.btn_receive.offClick(this, this.onBtnReceive);
  }

  private initView() {
    this.initText();
    // this.initTabList();
    // this.initDataList();
    this.refreshView();
  }

  initText() {
    this.txtTitle.text =
      LangManager.Instance.GetTranslation("QQ.Hall.Gift.title");
    this.txt1.text = LangManager.Instance.GetTranslation("QQ.Hall.Gift.title1");
    this.txt2.text = LangManager.Instance.GetTranslation("QQ.Hall.Gift.title2");
    this.txt3.text = LangManager.Instance.GetTranslation(
      "consortia.view.club.ConsortiaSearchRightView.operationTxtText",
    );

    this.btn_receive.title = LangManager.Instance.GetTranslation(
      "GrowthFundItem.getTxt",
    );
    this.btnGray.title = LangManager.Instance.GetTranslation(
      "GrowthFundItem.getTxt",
    );
  }

  refreshView() {
    this.cType.selectedIndex = this._model.getCurType();
    let len = this._model.getCurList().length;
    this.list.numItems = len;
    let isRed = this._model.isRedDotByType(this._model.getCurType());
    if (len > 0) {
      this.btn_receive.visible = isRed;
      this.btnGray.visible = !isRed;
    } else {
      this.btn_receive.visible = false;
      this.btnGray.visible = false;
    }

    if (this.cType.selectedIndex == 1) {
      this.levelList.numItems = this._model.getLevelList().length;
    }

    for (let i = 0; i < this.tabData.length; i++) {
      this.setTabBtnState(i, this._model.isRedDotByType(i));
    }
  }

  /**渲染Tab单元格 */
  renderTabListItem(index: number, item: fgui.GButton) {
    let titleStr;
    if (this.tabData[index]) {
      titleStr = LangManager.Instance.GetTranslation(this.tabData[index]);
    }
    if (!item) return;
    item.title = this.getTitleNameStr(titleStr);
    item.selectedTitle = `[size=24][color=#FFFAD6][B]${titleStr}[/B][/color][/size]`;
    item.data = this.tabData[index];
  }

  /** 等级礼包 */
  renderLevelListItem(index: number, item: QQLevelGiftItem) {
    item.info = this._model.getLevelList()[index];
  }

  /** 每日礼包和成长礼包 */
  renderListItem(index: number, item: BaseItem) {
    item.info = this._model.getCurList()[index];
  }

  /**切换Tab */
  __onTabSelectHandler() {
    // console.log(this.tabList.selectedIndex);
    this._model.setCurType(this.tabList.selectedIndex);
  }

  private getTitleNameStr(str: string): string {
    return `[size=24][color=#d1b186]${str}[/color][/size]`;
  }

  /**
   * 设置Tab按钮红点状态
   * @param tabIndex Tab索引
   * @param redPointState 是否展示红点
   */
  private setTabBtnState(
    index: number,
    redPointState: boolean,
    count: number = 0,
  ) {
    let btnView = this.tabList.getChildAt(index) as fgui.GButton;
    if (btnView) {
      let ctrl = btnView.getController("redPointState");
      let redDotLabel = btnView.getChild("redDotLabel");
      ctrl.selectedIndex = redPointState ? 1 : 0;
      redDotLabel.text = count > 0 ? count.toString() : "";
    }
  }

  onBtnReceive() {
    QQGiftManager.Instance.getGift(this._model.getGiftType(), 0);
  }

  OnHideWind() {
    super.OnHideWind();
    this.offEvent();
  }
}
