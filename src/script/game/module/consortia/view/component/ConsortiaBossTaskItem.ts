import FUI_ConsortiaBossTaskItem from "../../../../../../fui/Consortia/FUI_ConsortiaBossTaskItem";
import LangManager from "../../../../../core/lang/LangManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaModel } from "../../model/ConsortiaModel";

export default class ConsortiaBossTaskItem extends FUI_ConsortiaBossTaskItem {
  private _type: number = 0;
  private _model: ConsortiaModel;
  private _contorller: ConsortiaControler;
  private _currentProcess: number = 0;
  private maxProcess: number = 0;
  protected onConstruct() {
    super.onConstruct();
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._model = this._contorller.model;
  }

  public get currentProcess(): number {
    return this._currentProcess;
  }

  public get maxProcessValue(): number {
    return this.maxProcess;
  }

  private refreshView() {
    this._currentProcess = 0;
    this.maxProcess = 0;
    if (
      this._model.bossInfo.taskProcessArr &&
      this._model.bossInfo.taskProcessArr.length
    )
      this._currentProcess = this._model.bossInfo.taskProcessArr[this._type];
    if (
      this._model.bossInfo.taskMaxProcessArr &&
      this._model.bossInfo.taskMaxProcessArr.length
    )
      this.maxProcess = this._model.bossInfo.taskMaxProcessArr[this._type];
    if (this._currentProcess >= this.maxProcess) {
      //已完成
      this.taskTitleTxt.color = "#7ddf26";
      this.taskDescTxt.visible = false;
      this.taskTitleTxt.text =
        LangManager.Instance.GetTranslation(
          "ConsortiaBoss.ConsortiaBossTaskItem.ItemTitleTxt" + this._type,
        ) +
        LangManager.Instance.GetTranslation(
          "ConsortiaBoss.ConsortiaBossTaskItem.completeText",
        );
    } else {
      this.taskTitleTxt.color = "#FFC68F";
      this.taskDescTxt.color = "#FFECC6";
      this.taskDescTxt.visible = true;
      this.taskTitleTxt.text = LangManager.Instance.GetTranslation(
        "ConsortiaBoss.ConsortiaBossTaskItem.ItemTitleTxt" + this._type,
      );
      this.taskDescTxt.text = LangManager.Instance.GetTranslation(
        "ConsortiaBoss.ConsortiaBossTaskItem.ItemDescribeTxt" + this._type,
        this.currentProcess,
        this.maxProcess,
      );
    }
    // if (this.vgroup) {
    //     this.vgroup.ensureSizeCorrect();
    //     this.vgroup.ensureBoundsCorrect();
    // }
  }

  public set type(value: number) {
    this._type = value;
    this.refreshView();
  }

  public get type(): number {
    return this._type;
  }

  public dispose() {
    super.dispose();
  }
}
