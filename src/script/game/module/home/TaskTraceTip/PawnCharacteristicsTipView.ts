import LangManager from "../../../../core/lang/LangManager";
import UIManager from '../../../../core/ui/UIManager';
import { EmWindow } from "../../../constant/UIDefine";
import { TipMessageData } from "../../../datas/TipMessageData";
import { ArmyManager } from "../../../manager/ArmyManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class PawnCharacteristicsTipView extends TaskTraceTipWnd {

	constructor() {
		super();
	}

	initView() {
		super.initView();
		let contenttext = LangManager.Instance.GetTranslation("tasktracetip.view.PawnCharacteristicsTipView.content");
		this.setContentText(contenttext);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.PawnCharacteristicsTipView.text"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		TaskTraceTipManager.Instance.cleanByType(TipMessageData.PAWN_CHARACTERISTICS_TIP_VIEW);
		var tempArr: any[] = ArmyManager.Instance.casernPawnList.getList();
		for (var i: number = tempArr.length - 1; i >= 0; i--) {
			if (tempArr[i].templateInfo.Level >= 10) {
				UIManager.Instance.ShowWind(EmWindow.PawnSpecialAbilityWnd, tempArr[i]);
				break;
			}
		}
	}

	protected isDie: boolean = false;

}
