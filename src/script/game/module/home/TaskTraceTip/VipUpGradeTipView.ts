import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { VIPManager } from "../../../manager/VIPManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class VipUpGradeTipView extends TaskTraceTipWnd {
  constructor() {
    super();
  }

  initView() {
    super.initView();
    var vipGrade: number = VIPManager.Instance.model.vipInfo.VipGrade;
    let text = LangManager.Instance.GetTranslation(
      "tasktracetip.view.VipUpGradeTipView.ContentTxt",
      vipGrade,
    );
    this.setContentText(text);
    this.setBtnTitle(
      LangManager.Instance.GetTranslation(
        "tasktracetip.view.VipUpGradeTipView.BtnTxt",
      ),
    );
  }

  protected __btnHandler(e: Event) {
    super.__btnHandler(e);
    RechargeAlertMannager.Instance.openShopRecharge();
    TaskTraceTipManager.Instance.cleanByType(this.data.type);
  }

  protected check(): boolean {
    return false;
  }

  public dispose() {
    this.removeEvent();
    // super.dispose();
    // ObjectUtils.disposeAllChildren(this);
  }
}
