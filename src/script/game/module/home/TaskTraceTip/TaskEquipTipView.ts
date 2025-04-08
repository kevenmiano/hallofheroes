// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import { EmWindow } from "../../../constant/UIDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { BagEvent } from "../../../constant/event/NotificationEvent";

export class TaskEquipTipView extends TaskTraceTipWnd {

	constructor() {
		super();
	}

	initView() {
		super.initView();
		let text = LangManager.Instance.GetTranslation("tasktracetip.view.TaskEquipTipView.content");
		this.setContentText(text);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.TaskEquipTipView.text"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		FrameCtrlManager.Instance.open(EmWindow.RoleWnd);
		FrameCtrlManager.Instance.open(EmWindow.BagWnd);
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}


}
