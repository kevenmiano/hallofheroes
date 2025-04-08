import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class VipGiftGetTipView extends TaskTraceTipWnd {

	constructor() {
		super();
	}

	initView() {
		super.initView();
		let htmlText =  LangManager.Instance.GetTranslation("tasktracetip.view.VipGiftGetTipView.ContentTxt");
		this.setContentText(htmlText);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.VipGiftGetTipView.BtnTxt"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		RechargeAlertMannager.Instance.openShopRecharge();
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}

	protected check(): boolean {
		return false;
	}

}