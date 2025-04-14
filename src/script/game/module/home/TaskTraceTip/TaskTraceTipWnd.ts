import AudioManager from "../../../../core/audio/AudioManager";
import Resolution from "../../../../core/comps/Resolution";
import {
  NativeEvent,
  NotificationEvent,
} from "../../../constant/event/NotificationEvent";
import { SoundIds } from "../../../constant/SoundIds";
import { UIBarEvent } from "../../../constant/UIBarEvent";
import { TipMessageData } from "../../../datas/TipMessageData";
import { CampaignManager } from "../../../manager/CampaignManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import FUI_TaskTraceTipWnd from "../../../../../fui/Home/FUI_TaskTraceTipWnd";
import LayerMgr from "../../../../core/layer/LayerMgr";
import { EmLayer } from "../../../../core/ui/ViewInterface";
import Logger from "../../../../core/logger/Logger";

/**
 * @author:pzlricky
 * @data: 2021-07-26 10:21
 * @description 屏幕右下角提醒
 */
export default class TaskTraceTipWnd {
  public iconState: fgui.Controller;
  public warnIcon: fgui.GLoader;
  public warnContent: fgui.GTextField;
  public closeBtn: fgui.GButton;
  public operationBtn: fgui.GButton;
  protected wnd: fgui.GComponent;
  protected _data: TipMessageData;
  protected isShowIng: boolean = false;

  private static inst: any;

  public static get Instance() {
    if (!this.inst) {
      this.inst = new this();
    }
    return this.inst;
  }

  initView() {}

  /**倒计时5S关闭窗口 */
  private startTime() {
    Laya.timer.clearAll(this);
    Laya.timer.once(5000, this, this.onDecetiveWnd);
  }

  protected onDecetiveWnd() {
    Laya.timer.clearAll(this);
    this.Hide();
  }

  /**
   * 设置展示图标
   * @param value 图标URL
   */
  setContentIcon(value: string) {
    try {
      if (this.wnd && !this.wnd.isDisposed) {
        if (value != "") {
          if (this.warnIcon && !this.warnIcon.isDisposed)
            this.warnIcon.url = value;
          if (this.iconState) this.iconState.selectedIndex = 1;
        }
      }
    } catch (error) {
      Logger.error("error:", error);
    }
  }

  /**
   * 设置展示内容
   * @param value 展示文本
   */
  setContentText(value: string) {
    if (!value) {
      this.Hide();
      return;
    }
    this.warnContent.text = value;
  }

  setBtnTitle(value: string) {
    if (!value) {
      this.Hide();
      return;
    }
    this.operationBtn.title = value;
  }

  /**
   * 弹窗
   */
  async Show(data = null) {
    if (this.isShowIng) return;
    this.isShowIng = true;
    if (!this.wnd) {
      this.wnd = await FUI_TaskTraceTipWnd.createInstance();
      if (this.wnd) {
        this.iconState = this.wnd.getController("iconState");
        this.warnIcon = <fgui.GLoader>this.wnd.getChild("warnIcon");
        this.warnContent = <fgui.GTextField>this.wnd.getChild("warnContent");
        this.closeBtn = <fgui.GButton>this.wnd.getChild("closeBtn");
        this.operationBtn = <fgui.GButton>this.wnd.getChild("operationBtn");
      }
    }
    if (this.wnd) {
      LayerMgr.Instance.addToLayer(
        this.wnd.displayObject,
        EmLayer.GAME_UI_LAYER,
        -2,
      );
      this.onUpdateView(data);
      Logger.xjy("TaskTraceTipWnd Show type==" + data.type);
    }
  }

  /**更新界面UI */
  private onUpdateView(data) {
    this._data = data;
    this.onSetPosition();
    this.initView();
    this.initEvent();
    this.startTime();
  }

  public Hide() {
    if (this.wnd) {
      LayerMgr.Instance.removeByLayer(
        this.wnd.displayObject,
        EmLayer.GAME_UI_LAYER,
      );
      this.dispose();
    }
    this._data = null;
    this.isShowIng = false;
  }

  protected initEvent() {
    this.operationBtn &&
      !this.operationBtn.isDisposed &&
      this.operationBtn.onClick(this, this.__btnHandler);
    this.closeBtn &&
      !this.closeBtn.isDisposed &&
      this.closeBtn.onClick(this, this.onCloseWnd);
    NotificationManager.Instance.addEventListener(
      UIBarEvent.SHOW_TASK_TRACE,
      this.__show,
      this,
    );
    NotificationManager.Instance.addEventListener(
      UIBarEvent.HIDE_TASK_TRACE,
      this.__hide,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SWITCH_SCENE,
      this._onSceneViewAdded,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.__afterStatusBarChange,
      this,
    );
  }

  protected removeEvent() {
    this.operationBtn &&
      !this.operationBtn.isDisposed &&
      this.operationBtn.offClick(this, this.__btnHandler);
    this.closeBtn &&
      !this.closeBtn.isDisposed &&
      this.closeBtn.offClick(this, this.onCloseWnd);
    NotificationManager.Instance.removeEventListener(
      UIBarEvent.SHOW_TASK_TRACE,
      this.__show,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      UIBarEvent.HIDE_TASK_TRACE,
      this.__hide,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SWITCH_SCENE,
      this._onSceneViewAdded,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.__afterStatusBarChange,
      this,
    );
  }

  protected onCloseWnd(evt) {
    this.Hide();
  }

  protected __show(evt) {
    if (this.wnd) this.wnd.visible = true;
    this.startTime();
  }

  protected __hide(evt) {
    var mapId: number = CampaignManager.Instance.mapModel
      ? CampaignManager.Instance.mapModel.mapId
      : 0;
    if (WorldBossHelper.checkConsortiaDemon(mapId)) return;
    if (this.wnd) this.wnd.visible = false;
  }

  protected _onSceneViewAdded(evt) {
    this.onSetPosition();
  }

  protected __afterStatusBarChange() {
    this.onSetPosition();
  }

  onSetPosition() {
    if (!this.wnd || this.wnd.isDisposed) return;
    let padding: number = 120 + Resolution.deviceStatusBarHeightR;
    var xPoint: number = Resolution.gameWidth - this.wnd.width - padding;
    if (
      SceneManager.Instance.currentType == SceneType.CASTLE_SCENE ||
      SceneManager.Instance.currentType == SceneType.SPACE_SCENE ||
      SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE
    ) {
      if (xPoint < Resolution.gameWidth - this.wnd.width - padding)
        xPoint = Resolution.gameWidth - this.wnd.width - padding;
    }

    var yPoint: number = Resolution.gameHeight - this.wnd.height - padding;
    if (yPoint < Resolution.gameHeight - this.wnd.height - padding)
      yPoint = Resolution.gameHeight - this.wnd.height - padding;
    this.wnd.x = xPoint;
    this.wnd.y = yPoint;
  }

  protected get data(): TipMessageData {
    return this._data;
  }

  protected set data(value: TipMessageData) {
    this._data = value;
  }

  protected __btnHandler(evt) {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
  }

  protected check(): boolean {
    return false;
  }

  protected addMessage() {
    // if (this._data && this.check())
    //     TipsBar.Instance.messageBtnList.addMessage(this._data);
  }

  dispose() {
    this.removeEvent();
    TweenMax.killTweensOf(this);
    Laya.timer.clearAll(this);
    this.wnd && (this.wnd as fgui.GComponent).dispose();
    this.wnd = null;
    this.isShowIng = false;
  }
}
