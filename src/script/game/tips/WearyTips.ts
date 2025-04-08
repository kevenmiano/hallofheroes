import LangManager from "../../core/lang/LangManager";
import DateUtils from "../../core/utils/DateUtils";
import { PlayerEvent } from "../constant/event/PlayerEvent";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import GameManager from "../manager/GameManager";
import { PlayerManager } from "../manager/PlayerManager";
import { TempleteManager } from "../manager/TempleteManager";
import BaseTips from "./BaseTips";

/**
 * 体力Tips
 * @author: haibin.xie
 * @date: 2024-6-13
 */
export default class WearyTips extends BaseTips {
  public bg: fgui.GLoader;
  public titleTxt: fgui.GRichTextField;
  public describeTxt: fgui.GRichTextField;
  public timeTxt: fgui.GRichTextField;

  private _info: GoodsInfo;
  /** 下次恢复时间 */
  private _nextRecoveryTimeSec: number;
  /** 每小时恢复体力值 */
  private _wearyRestore: string;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.initView();
    this.addEvent();
    this.updateView();
  }

  protected onClickEvent() {
    this.onInitClick();
  }

  createModel() {
    super.createModel();
    this.modelMask.alpha = 0;
  }

  private initData() {
    [this._info] = this.params;

    let cfg =
      TempleteManager.Instance.getConfigInfoByConfigName("Weary_Restore");
    if (cfg) {
      this._wearyRestore = cfg.ConfigValue;
    }
  }

  private initView() {}

  private addEvent() {
    GameManager.Instance.addEventListener(
      PlayerEvent.SYSTIME_UPGRADE_MINUTE,
      this.onSysTimeUpdateHandler,
      this
    );
  }

  private removeEvent() {
    GameManager.Instance.removeEventListener(
      PlayerEvent.SYSTIME_UPGRADE_MINUTE,
      this.onSysTimeUpdateHandler,
      this
    );

    Laya.timer.clear(this, this.onUpdateRecoveryCountdownHandler);
  }

  /**
   * 系统时间更新
   */
  private onSysTimeUpdateHandler(): void {
    this._nextRecoveryTimeSec = this.calculationRecoveryTime();
  }

  private updateView() {
    if (!this._info) {
      return;
    }

    this.titleTxt.text = this._info.templateInfo.TemplateNameLang;
    this.describeTxt.text = this._info.templateInfo.DescriptionLang;

    this._nextRecoveryTimeSec = this.calculationRecoveryTime();
    this.updateTimeText();
    Laya.timer.loop(1000, this, this.onUpdateRecoveryCountdownHandler);
  }

  /**
   * 计算恢复时间
   */
  private calculationRecoveryTime(): number {
    const sysTime = PlayerManager.Instance.currentPlayerModel.sysCurtime;
    const minutes: number = sysTime.getMinutes();
    const second: number = sysTime.getSeconds();
    const recoveryTimeSec: number = (60 - minutes) * 60 - second;
    return recoveryTimeSec;
  }

  /**
   * 更新恢复倒计时
   */
  private onUpdateRecoveryCountdownHandler(): void {
    --this._nextRecoveryTimeSec;
    if (this._nextRecoveryTimeSec <= 0) {
      this._nextRecoveryTimeSec = this.calculationRecoveryTime();
    }

    this.updateTimeText();
  }

  private updateTimeText(): void {
    const timeStr: string = DateUtils.getFormatBySecond(
      this._nextRecoveryTimeSec,
      3
    );
    this.timeTxt.text = LangManager.Instance.GetTranslation(
      "WearyTips.RecoveryTime",
      timeStr,
      this._wearyRestore
    );
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  protected OnClickModal() {
    super.OnClickModal();
  }

  public OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    this._info = null;
    super.dispose(dispose);
  }
}
