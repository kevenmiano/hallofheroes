import BaseWindow from "../../../core/ui/Base/BaseWindow";
import BuildingManager from "../../map/castle/BuildingManager";
import { BuildingEvent } from "../../map/castle/event/BuildingEvent";
import { PlayerManager } from "../../manager/PlayerManager";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import LangManager from "../../../core/lang/LangManager";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { BuildingSocketOutManager } from "../../manager/BuildingSocketOutManager";
import { EmWindow } from "../../constant/UIDefine";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { TempleteManager } from "../../manager/TempleteManager";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/11/15 16:39
 * @ver 1.0
 */
export class TransferBuildWnd extends BaseWindow {
  public progressBar: fgui.GProgressBar;
  public btnPower: fgui.GButton;
  public btnMap: fgui.GButton;

  private _data: BuildInfo;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this.initData();
    this.initView();
    this.initEvent();
    this.setCenter();
  }

  private initData() {
    this._data = this.params;
  }

  private initView() {
    this.progressBar.titleType = fgui.ProgressTitleType.ValueAndMax;
  }

  private initEvent() {
    this.btnPower.onClick(this, this.__powerHandler);
    this.btnMap.onClick(this, this.__onMapClick);
    BuildingManager.Instance.addEventListener(
      BuildingEvent.TRANSFER_POWER_SUCCESS,
      this.addPowerSuccess,
      this,
    );
  }

  public OnShowWind() {
    super.OnShowWind();

    this.refreshView();
  }

  private __powerHandler(e: Laya.Event): void {
    let cfgValue = 1;
    let cfgItem =
      TempleteManager.Instance.getConfigInfoByConfigName("AddEnergy_Price");
    if (cfgItem) {
      cfgValue = Number(cfgItem.ConfigValue);
    }
    let needPoint: number = this.getPowerPoint() * cfgValue;
    if (needPoint > 0) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let str: string = LangManager.Instance.GetTranslation(
        "buildings.transferbuilding.view.TransferBuildFrame.content",
        needPoint,
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.USEBINDPOINT_ALERT,
        { point: needPoint, checkDefault: true },
        prompt,
        str,
        confirm,
        cancel,
        this.addPowerBack.bind(this),
      );
    }
  }

  private getPowerPoint(): number {
    let max: number =
      PlayerManager.Instance.currentPlayerModel.playerEffect.getTransferPowerLimitAddition(
        this._data.templeteInfo.Property2,
      );
    let current: number = this._data.property1;
    return (max - current) / 5;
  }

  private addPowerBack(
    restult: boolean,
    flag: boolean,
    id: number = 0,
    type: number = 2,
  ): void {
    if (restult) {
      if (!flag) {
        type = 1;
      }
      BuildingSocketOutManager.sendAddTransferPower(type);
    }
  }

  private __onMapClick(e: Laya.Event): void {
    FrameCtrlManager.Instance.open(EmWindow.OuterCityMapWnd);
  }

  private addPowerSuccess(): void {
    this.refreshView();
  }

  private refreshView(): void {
    this.progressBar.max =
      PlayerManager.Instance.currentPlayerModel.playerEffect.getTransferPowerLimitAddition(
        this._data.templeteInfo.Property2,
      );
    this.progressBar.value = this._data.property1;
    this.btnPower.enabled =
      this._data.property1 !=
      PlayerManager.Instance.currentPlayerModel.playerEffect.getTransferPowerLimitAddition(
        this._data.templeteInfo.Property2,
      );
  }

  private removeEvent() {
    this.btnPower.offClick(this, this.__powerHandler);
    this.btnMap.offClick(this, this.__onMapClick);
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.TRANSFER_POWER_SUCCESS,
      this.addPowerSuccess,
      this,
    );
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._data = null;
    super.dispose(dispose);
  }
}
