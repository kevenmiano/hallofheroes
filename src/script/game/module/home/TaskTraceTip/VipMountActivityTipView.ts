// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MopupManager } from "../../../manager/MopupManager";
import { MountsManager } from "../../../manager/MountsManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import FUIHelper from "../../../utils/FUIHelper";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import { EmWindow } from "../../../constant/UIDefine";

export class VipMountActivityTipView extends TaskTraceTipWnd {
	constructor() {
		super();
	}

	initView() {
		super.initView();
		this.setContentText(this.data.content);
		this.setContentIcon(FUIHelper.getItemURL("Base", "asset.taskTraceTips.VipIcon"))
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.VipMountActivateTipView.text"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		if (MopupManager.Instance.model.isMopup) {
			var str: string = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
			MessageTipManager.Instance.show(str);
			return;
		}
		MountsManager.Instance.vipMountActivity = true;
		FrameCtrlManager.Instance.open(EmWindow.WildSoulWnd);
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}

}