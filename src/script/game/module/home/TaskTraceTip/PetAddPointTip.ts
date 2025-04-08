// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { PetData } from "../../pet/data/PetData";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class PetAddPointTip extends TaskTraceTipWnd {
	constructor() {
		super();
	}

	initView() {
		super.initView();
		let htmlText = LangManager.Instance.GetTranslation("PetAddPointTip.content");
		this.setContentText(htmlText);
		this.setBtnTitle(LangManager.Instance.GetTranslation("PetAddPointTip.btnTxt"));
		var petData: PetData = PlayerManager.Instance.currentPlayerModel.playerInfo.enterWarPet;
		if (petData) {
			this.setContentIcon(IconFactory.getPetHeadItemIcon(petData.templateId));
		}
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		FrameCtrlManager.Instance.open(EmWindow.Pet);
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}
}