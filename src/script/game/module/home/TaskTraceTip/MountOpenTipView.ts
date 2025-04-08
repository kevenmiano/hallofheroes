import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import { TipMessageData } from "../../../datas/TipMessageData";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
/**
 *  40级坐骑开放的提示框
 */
export class MountOpenTipView extends TaskTraceTipWnd {
	constructor() {
		super();
	}

	initView() {
		super.initView();
		let htmlText = LangManager.Instance.GetTranslation("tasktracetip.view.MountOpenTipView.content");
		this.setContentText(htmlText);
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		FrameCtrlManager.Instance.open(EmWindow.MountsWnd);
		TaskTraceTipManager.Instance.cleanByType(TipMessageData.MOUNT_OPEN_TIP_VIEW);
	}
}