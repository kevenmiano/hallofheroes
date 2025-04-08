import LangManager from "../../../../core/lang/LangManager";
import { ArmyPawn } from "../../../datas/ArmyPawn";
import { ArmyManager } from "../../../manager/ArmyManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import { EmWindow } from '../../../constant/UIDefine';
import UIManager from '../../../../core/ui/UIManager';
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";

export class UpgradePawnTipView extends TaskTraceTipWnd {

	constructor() {
		super();
	}

	initView() {
		super.initView();
		let text = LangManager.Instance.GetTranslation("tasktracetip.view.UpgradePawnTipView.content");
		this.setContentText(text);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.UpgradePawnTipView.text"));
	}

	__btnHandler(e: Event) {
		super.__btnHandler(e);
		var ap: ArmyPawn = ArmyManager.Instance.army.getPawnByIndex(0);
		if (!ap || !ArmyManager.Instance.casernPawnList[ap.templateInfo.SonType]) ap = ArmyManager.Instance.casernPawnList[101] as ArmyPawn;
		FrameCtrlManager.Instance.open(EmWindow.PawnLevelUp);
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}

}