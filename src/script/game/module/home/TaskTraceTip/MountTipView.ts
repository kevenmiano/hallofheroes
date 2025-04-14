import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import GTabIndex from "../../../constant/GTabIndex";

export class MountTipView extends TaskTraceTipWnd {
  constructor() {
    super();
  }

  initView() {
    super.initView();
    let htmlText = LangManager.Instance.GetTranslation(
      "tasktracetip.view.MountTipView.content",
    );
    this.setContentText(htmlText);
    this.setBtnTitle(
      LangManager.Instance.GetTranslation(
        "tasktracetip.view.MountTipView.text",
      ),
    );
  }

  protected __btnHandler(e: Event) {
    super.__btnHandler(e);
    FrameCtrlManager.Instance.open(EmWindow.Forge, {
      tabIndex: GTabIndex.Forge_XQ,
    });
    TaskTraceTipManager.Instance.cleanByType(this.data.type);
  }
}
