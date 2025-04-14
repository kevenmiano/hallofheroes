import FUI_TaskTraceProgressTipWnd from "../../../../../fui/Home/FUI_TaskTraceProgressTipWnd";
import AudioManager from "../../../../core/audio/AudioManager";
import Resolution from "../../../../core/comps/Resolution";
import LangManager from "../../../../core/lang/LangManager";
import LayerMgr from "../../../../core/layer/LayerMgr";
import Logger from "../../../../core/logger/Logger";
import { EmLayer } from "../../../../core/ui/ViewInterface";
import { NumericProgressStepper } from "../../../component/NumericProgressStepper";
import {
  NotificationEvent,
  NativeEvent,
} from "../../../constant/event/NotificationEvent";
import { SoundIds } from "../../../constant/SoundIds";
import { UIBarEvent } from "../../../constant/UIBarEvent";
import { TipMessageData } from "../../../datas/TipMessageData";
import { CampaignManager } from "../../../manager/CampaignManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { TimerEvent, TimerTicker } from "../../../utils/TimerTicker";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";

/**
 * @author:pzlricky
 * @data: 2021-07-26 10:21
 * @description 屏幕右下角提醒
 */

const COUNTDOWN = 30; //30s自动关闭
export default class TaskTraceProgressTipWnd {
  public iconState: fgui.Controller;
  public warnIcon: fgui.GLoader;
  public warnContent: fgui.GComponent;
  public closeBtn: fgui.GButton;
  public operationBtn: fgui.GButton;
  public stepper: NumericProgressStepper;
  protected wnd: fgui.GComponent;
  protected _data: TipMessageData;

  private static inst: any;
  public txtCountdown: fairygui.GTextField;
  private _autoExitTimer: TimerTicker;

  public static get Instance() {
    if (!this.inst) {
      this.inst = new this();
    }
    return this.inst;
  }

  initView() {}

  /**倒计时5S关闭窗口 */
  private startTime() {
    // Laya.timer.clearAll(this);
    // Laya.timer.once(30000, this, this.onDecetiveWnd);
    this._autoExitTimer = new TimerTicker(1000, COUNTDOWN);
    this._autoExitTimer.addEventListener(
      TimerEvent.TIMER,
      this.__timerHandler,
      this,
    );
    this._autoExitTimer.start();
  }

  private __timerHandler() {
    let time: number = COUNTDOWN - this._autoExitTimer.currentCount;
    // Logger.xjy("__timerHandler", this._autoExitTimer.currentCount, time)
    if (time <= 0) {
      time = 0;
    }
    let timeStr = time + "";
    if (time < 10) {
      timeStr = "0" + time;
    }
    this.txtCountdown.text = LangManager.Instance.GetTranslation(
      "openBox.tip.countdown",
      timeStr,
    );
    if (time == 0) {
      this.Hide();
    }
  }

  private onDecetiveWnd() {
    Laya.timer.clearAll(this);
    this.Hide();
  }

  /**
   * 设置进度
   * @param count 数量
   */
  setProgress(count: number) {
    // let count = this._data.goods.count;
    this.stepper.show(0, count, 1, count, 999, 1, null);
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
          if (this.iconState && this.iconState["selectedIndex"])
            this.iconState.selectedIndex = 1;
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
      // this.Hide();
      return;
    }
    this.warnContent.getChild("content").text = value;
  }

  setBtnTitle(value: string) {
    if (!value) {
      // this.Hide();
      return;
    }
    this.operationBtn.title = value;
  }

  /**
   * 弹窗
   */
  async Show(data = null) {
    if (TaskTraceTipManager.Instance.isLoadingTipWnd) {
      return;
    }
    if (TaskTraceTipManager.Instance.showTipList.length > 0) {
      data = TaskTraceTipManager.Instance.showTipList[0];
    }
    if (!this.wnd) {
      TaskTraceTipManager.Instance.isLoadingTipWnd = true;
      this.wnd = await FUI_TaskTraceProgressTipWnd.createInstance();
      if (this.wnd) {
        this.warnIcon = <fgui.GLoader>this.wnd.getChild("warnIcon");
        this.warnContent = <fgui.GComponent>this.wnd.getChild("warnContent");
        this.warnContent.getChild("content").asTextField.color = "#3B0005";
        this.warnContent.getChild("content").asTextField.bold = true;
        this.closeBtn = <fgui.GButton>this.wnd.getChild("closeBtn");
        this.operationBtn = <fgui.GButton>this.wnd.getChild("operationBtn");
        this.txtCountdown = <fgui.GTextField>this.wnd.getChild("txtCountdown");
        this.stepper = <NumericProgressStepper>this.wnd.getChild("stepper");
      }
    }
    if (this.wnd) {
      LayerMgr.Instance.addToLayer(
        this.wnd.displayObject,
        EmLayer.GAME_TOP_LAYER,
        -2,
      );
      // this.iconState.selectedIndex = 0;
      this.onUpdateView(data);
      Logger.xjy("TaskTraceTipWnd Show type==" + data.type);
      TaskTraceTipManager.Instance.isLoadingTipWnd = false;
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
      if (TaskTraceTipManager.Instance.showTipList.length > 0) {
        TaskTraceTipManager.Instance.showTipList.shift();
      }
      LayerMgr.Instance.removeByLayer(
        this.wnd.displayObject,
        EmLayer.GAME_TOP_LAYER,
      );
      this.dispose();
    }
    this._data = null;
    if (TaskTraceTipManager.Instance.showTipList.length > 0) {
      this.Show();
    }
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

  private onCloseWnd(evt) {
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
    this._autoExitTimer.removeEventListener(
      TimerEvent.TIMER,
      this.__timerHandler,
      this,
    );
    this._autoExitTimer.stop();
    this.wnd && (this.wnd as fgui.GComponent).dispose();
    this.wnd = null;
  }
}
