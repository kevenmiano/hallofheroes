// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import StringHelper from "../../../../core/utils/StringHelper";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ConsortiaSocketOutManager } from "../../../manager/ConsortiaSocketOutManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MopupManager } from "../../../manager/MopupManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import TaskTraceTipWnd from "./TaskTraceTipWnd";


/**
 * 
 * @author kbin.liu
 * 
 */
export class SecretTreeTipView extends TaskTraceTipWnd {
	constructor() {
		super();
	}

	initView() {
		super.initView();
		this.setContentText(this.data.content);
		this.setContentIcon(this.data.icon);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.SecretTreeTipView.text"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		var tip: string = this.checkLimit;
		if (tip != "") {
			MessageTipManager.Instance.show(tip);
			this.dispose();
			return;
		}
		if(ArmyManager.Instance.army.onVehicle){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
            return;
        }
		if (this.checkScene()) {
			ConsortiaSocketOutManager.sendEnterSecretLand();
			TaskTraceTipManager.Instance.cleanByType(this.data.type);
		}
	}

	private get checkLimit(): string {
		if (MopupManager.Instance.model.isMopup) return LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
		return WorldBossHelper.getCampaignTips();
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