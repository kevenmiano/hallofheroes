import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import { EmWindow } from "../../../constant/UIDefine";
import LangManager from "../../../../core/lang/LangManager";

export class StarTipView extends TaskTraceTipWnd {
	constructor() {
		super();
	}

	initView() {
		super.initView();
		let contenttext = LangManager.Instance.GetTranslation("tasktracetip.view.StarTipView.content");
		this.setContentText(contenttext);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.StarTipView.text"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		FrameCtrlManager.Instance.open(EmWindow.Star);
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}
}