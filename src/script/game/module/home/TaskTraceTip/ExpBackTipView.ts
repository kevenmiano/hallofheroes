import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import LangManager from "../../../../core/lang/LangManager";

/**
 * 经验找回提示
 * @author zhen.zhao
 *
 */
export class ExpBackTipView extends TaskTraceTipWnd {
  constructor() {
    super();
  }

  initView() {
    super.initView();
    this.setContentText(this.data.content);
  }

  protected __btnHandler(e: Event) {
    super.__btnHandler(e);
    FrameCtrlManager.Instance.open(EmWindow.Welfare, {
      str: LangManager.Instance.GetTranslation("welfareWnd.tabTitle.expBack"),
    });
    TaskTraceTipManager.Instance.cleanByType(this.data.type);
  }
}
