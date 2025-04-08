import LangManager from "../../../../core/lang/LangManager";
import StringHelper from "../../../../core/utils/StringHelper";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { ConsortiaSocketOutManager } from "../../../manager/ConsortiaSocketOutManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import FUIHelper from "../../../utils/FUIHelper";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

/**
 * 
 * @author kbin.liu
 * 
 */
export class DemonOpenTipView extends TaskTraceTipWnd {

	constructor() {
		super();
	}

	initView() {
		super.initView();
		let text = LangManager.Instance.GetTranslation("tasktracetip.view.DemonOpenTipView.content");
		this.setContentText(text);
		this.setContentIcon(FUIHelper.getItemURL("Base", "asset.taskTraceTips.DemonIcon"));
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.DemonOpenTipView.text"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		var canJoin: number = ConsortiaManager.Instance.model.demonInfo.isCanJoin;
		if (canJoin == 0) {
			if (this.checkScene()) {
				ConsortiaSocketOutManager.sendEnterDemon();
			}
		}
		else {
			MessageTipManager.Instance.show(ConsortiaManager.Instance.model.demonInfo.getLimitTip(canJoin));
			TaskTraceTipManager.Instance.cleanByType(this.data.type);
		}
	}

	/**
	 * 场景检测 是否能在当前场景进行的操作 
	 * @return 能返回true 否则返回false
	 * 
	 */
	private checkScene(): boolean {
		var tipStr: string = WorldBossHelper.getCampaignTips();
		if (StringHelper.isNullOrEmpty(tipStr)) {
			return true;
		} else {
			MessageTipManager.Instance.show(tipStr);
			return false;
		}
	}

}