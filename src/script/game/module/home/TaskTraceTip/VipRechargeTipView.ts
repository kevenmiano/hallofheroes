import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";


export class VipRechargeTipView extends TaskTraceTipWnd {
	constructor() {
		super();
	}

	initView() {
		super.initView();
		let text = LangManager.Instance.GetTranslation("tasktracetip.view.VipRechargeTipView.ContentTxt");
		this.setContentText(text);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.VipRechargeTipView.BtnTxt"));
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