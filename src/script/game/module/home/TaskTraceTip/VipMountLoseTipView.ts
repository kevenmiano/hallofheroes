import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MopupManager } from "../../../manager/MopupManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import FUIHelper from "../../../utils/FUIHelper";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class VipMountLoseTipView extends TaskTraceTipWnd {
  constructor() {
    super();
  }

  initView() {
    super.initView();
    this.setContentText(this.data.content);
    this.setContentIcon(
      FUIHelper.getItemURL("Base", "asset.taskTraceTips.VipIcon"),
    );
    this.setBtnTitle(
      LangManager.Instance.GetTranslation(
        "tasktracetip.view.VipMountLoseTipView.text",
      ),
    );
  }

  protected __btnHandler(e: Event) {
    super.__btnHandler(e);
    if (MopupManager.Instance.model.isMopup) {
      var str: string = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    RechargeAlertMannager.Instance.openShopRecharge();
    TaskTraceTipManager.Instance.cleanByType(this.data.type);
  }
}
