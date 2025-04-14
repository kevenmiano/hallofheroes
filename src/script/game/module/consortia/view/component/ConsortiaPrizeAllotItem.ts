//@ts-expect-error: External dependencies
import FUI_ConsortiaPrizeAllotItem from "../../../../../../fui/Consortia/FUI_ConsortiaPrizeAllotItem";
import { NumericStepper } from "../../../../component/NumericStepper";
import { EmWindow } from "../../../../constant/UIDefine";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import { ToolTipsManager } from "../../../../manager/ToolTipsManager";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import LangManager from "../../../../../core/lang/LangManager";

export default class ConsortiaPrizeAllotItem extends FUI_ConsortiaPrizeAllotItem {
  private _info: ThaneInfo;

  public numStep: NumericStepper;
  private _count: number;
  private _lastCount: number;
  private _handler: Laya.Handler;
  tipData: any;
  extData: any;
  tipType: EmWindow = EmWindow.CommonTips;
  canOperate: boolean = false;
  startPoint: Laya.Point = new Laya.Point(0, 0);
  showType: TipsShowType = TipsShowType.onClick;
  private _tips2: string = LangManager.Instance.GetTranslation(
    "consortia.view.myConsortia.building.ConsortiaPrizeAllotItem.tips2",
  );
  private _tips1: string = LangManager.Instance.GetTranslation(
    "consortia.view.myConsortia.building.ConsortiaPrizeAllotItem.tips1",
  );
  private _max: number = 0;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  private get model(): ConsortiaModel {
    return ConsortiaManager.Instance.model;
  }

  public get info(): ThaneInfo {
    return this._info;
  }

  public set info(value: ThaneInfo) {
    this._info = value;
    if (this._info) {
      this.userNameTxt.text = this._info.nickName;
      this.LevelTxt.text = LangManager.Instance.GetTranslation(
        "public.level3",
        this._info.grades.toString(),
      );
      this.fightValueTxt.text = this._info.fightingCapacity.toString();
      this._max = this.model.currentPrizeListCount + this._info.receivedCount;
      // this._max = max < this.model.currentPrizeListCountMax ? max : this.model.currentPrizeListCountMax;
      let initValue: number = this._info.receivedCount;
      this._handler && this._handler.recover();
      this._handler = Laya.Handler.create(
        this,
        this.stepperChangeHandler,
        null,
        false,
      );
      this.numStep.show(1, initValue, 0, this._max, 999, 1, this._handler);
      if (this._info.received) {
        ToolTipsManager.Instance.register(this);
        this.tipData = this._tips2;
      } else {
        ToolTipsManager.Instance.unRegister(this);
      }
      // this.refreshRecevied(this._info.received);
    }
  }

  private refreshRecevied(received: boolean = true) {
    if (received) {
      this.numStep.show(1, 0, 0, this._max, 999, 1, this._handler);
      // _receivedCountText.type = TextFieldType.DYNAMIC;
    } else {
      // _receivedCountText.type = TextFieldType.INPUT;
    }
  }

  public refresh(notenough: boolean = true) {
    var received: boolean = notenough ? notenough : this.info.received;
    var tips: string = notenough ? this._tips1 : this._tips2;
    if (this._info.received) {
      ToolTipsManager.Instance.register(this);
      this.tipData = tips;
    } else {
      ToolTipsManager.Instance.unRegister(this);
    }
    // this.refreshRecevied(received);
  }

  private stepperChangeHandler() {
    if (
      this.numStep.value == 0 &&
      this.numStep.value == this.info.receivedCount
    ) {
      return;
    }
    var max: number =
      this.model.currentPrizeListCount + this.info.receivedCount;
    // max = max < this.model.currentPrizeListCountMax ? max : this.model.currentPrizeListCountMax;
    max = max < this.numStep.value ? max : this.numStep.value;
    this.count = max;
    this._lastCount = this.info.receivedCount;
    this.info.receivedCount = this.count;
    this.model.currentPrizeListCount =
      this.model.currentPrizeListCount + this._lastCount - this.count;
  }

  public get count(): number {
    return this._count;
  }

  public set count(value: number) {
    this._count = value;
  }

  dispose() {
    this._info = null;
    super.dispose();
  }
}
