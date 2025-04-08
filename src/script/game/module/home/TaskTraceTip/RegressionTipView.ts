// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import { EmWindow } from '../../../constant/UIDefine';
import OpenGrades from "../../../constant/OpenGrades";

export class RegressionTipView extends TaskTraceTipWnd {
	constructor() {
		super();
	}

	initView() {
		super.initView();
		let htmlText =  LangManager.Instance.GetTranslation("tasktracetip.view.RegressionTipView.content");
		this.setContentText(htmlText);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.RegressionTipView.text"));
	}

	
	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		if (this.thane.grades < OpenGrades.FUNNY) {
			var str: string = LangManager.Instance.GetTranslation("mainBar.TopToolsBar.dayGuideBtn.underLevel");
			MessageTipManager.Instance.show(str);
		} else {
			FrameCtrlManager.Instance.open(EmWindow.Funny)
		}
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}

	private get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}
}