import LangManager from "../../../../core/lang/LangManager";
import FightingType from "../../../constant/FightingType";
import FightingManager from "../../../manager/FightingManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";

export class FightingTipView extends TaskTraceTipWnd {
  private _type: number = 0;
  constructor() {
    super();
  }

  initView() {
    super.initView();
    if (!this.data || !this.data.data) return;
    var obj: any = this.data.data;
    this._type = obj.type;
    switch (obj.type) {
      case FightingType.F_EQUIP:
        FightingManager.Instance.getEquipScore();
        break;
      case FightingType.F_GEM:
        FightingManager.Instance.getGemAndMarkingScore();
        break;
      case FightingType.F_PET:
        FightingManager.Instance.getPetScore();
        break;
      case FightingType.F_START:
        FightingManager.Instance.getStartScore();
        break;
      case FightingType.F_CONSORTIATETECHNOLOGY:
        break;
      case FightingType.F_TALENT:
        FightingManager.Instance.getTalentAndRuneScore();
        break;
      case FightingType.F_MOUNT:
        FightingManager.Instance.getMountScore();
        break;
    }
    let content = FightingManager.Instance.showTipDesc;
    this.setContentText(content);
    this.setBtnTitle(
      LangManager.Instance.GetTranslation(
        "tasktracetip.view.FightingTipView.textButton.text",
      ),
    );
  }

  protected __btnHandler(e: Event) {
    super.__btnHandler(e);
    // FrameCtrlManager.Instance.open(EmWindow.FightingWnd);
    TaskTraceTipManager.Instance.cleanByType(37);
  }
}
