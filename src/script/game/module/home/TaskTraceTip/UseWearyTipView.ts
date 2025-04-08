import LangManager from "../../../../core/lang/LangManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import { EmWindow } from "../../../constant/UIDefine";

export class UseWearyTipView extends TaskTraceTipWnd {
	constructor() {
		super();
	}

	initView() {
		super.initView();
		let htmlText = LangManager.Instance.GetTranslation("tasktracetip.view.UseWearyTipView.content");
		this.setContentText(htmlText);
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		FrameCtrlManager.Instance.open(EmWindow.RoleWnd);
		FrameCtrlManager.Instance.open(EmWindow.BagWnd);
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}


}