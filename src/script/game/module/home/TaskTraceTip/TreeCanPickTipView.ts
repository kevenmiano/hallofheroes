import LangManager from "../../../../core/lang/LangManager";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignSocketOutManager } from "../../../manager/CampaignSocketOutManager";
import { FarmManager } from "../../../manager/FarmManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MopupManager } from "../../../manager/MopupManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import FUIHelper from "../../../utils/FUIHelper";
import TaskTraceTipWnd from "./TaskTraceTipWnd";


export class TreeCanPickTipView extends TaskTraceTipWnd {

	constructor() {
		super();
	}

	initView() {
		super.initView();
		let text = LangManager.Instance.GetTranslation("tasktracetip.view.CanPickTipView.treeContent");
		this.setContentText(text);
		this.setContentIcon(FUIHelper.getItemURL("Base", "asset.taskTraceTips.TreeIcon"))
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.CanPickTipView.text"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		if (MopupManager.Instance.model.isMopup) {
			var str: string = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
			MessageTipManager.Instance.show(str);
			return;
		}
		if (FarmManager.Instance.model.preMapId > 0)//从副本地图进入(修行神殿)
		{
			CampaignSocketOutManager.Instance.sendReturnCampaignRoom(this.currentArmyId);
			FarmManager.Instance.model.preMapId = 0;
		}
		FarmManager.Instance.enterFarm();
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}

	private get currentArmyId(): number {
		var bArmy: BaseArmy = ArmyManager.Instance.army;
		if (bArmy) return bArmy.id;
		return 0;
	}
}