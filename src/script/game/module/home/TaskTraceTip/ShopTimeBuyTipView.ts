import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import { TipMessageData } from "../../../datas/TipMessageData";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import FUIHelper from "../../../utils/FUIHelper";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class ShopTimeBuyTipView extends TaskTraceTipWnd {
  constructor() {
    super();
  }

  initView() {
    super.initView();
    this.setContentText(this.data.content);
    this.setContentIcon(
      FUIHelper.getItemURL("Base", "asset.taskTraceTips.ShopIcon"),
    );
    this.setBtnTitle(
      LangManager.Instance.GetTranslation(
        "tasktracetip.view.ShopTimeBuyTipView.btnTxt",
      ),
    );
  }

  protected __btnHandler(e: Event) {
    super.__btnHandler(e);
    FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 0 });
    if (this.data && this.data.type) {
      TaskTraceTipManager.Instance.cleanByType(this.data.type);
    } else {
      TaskTraceTipManager.Instance.cleanByType(TipMessageData.SHOPTIMEBUY);
    }
  }
}
