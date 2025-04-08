// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import WarlordsModel from "../../warlords/WarlordsModel";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

/**
 * 
 * @author kbin.liu
 * 
 */
export class WarlordsBetTipView extends TaskTraceTipWnd {

	constructor() {
		super();
	}

	initView() {
		super.initView();
		let text = LangManager.Instance.GetTranslation("tasktracetip.view.WarlordsBetTipView.str01");
		this.setContentText(text);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.WarlordsBetTipView.str02"));
	}


	protected __btnHandler(evt) {
		super.__btnHandler(evt);
		if (ArmyManager.Instance.thane.grades < WarlordsModel.BET_OPEN_GRADE) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.BuildingManager.command08", WarlordsModel.BET_OPEN_GRADE));
			return;
		}
		FrameCtrlManager.Instance.open(EmWindow.WarlordsBetWnd);
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}
}