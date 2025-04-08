import LangManager from "../../../../core/lang/LangManager";
import GTabIndex from "../../../constant/GTabIndex";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { SwitchPageHelp } from "../../../utils/SwitchPageHelp";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class IntensifyTipView extends TaskTraceTipWnd {


	constructor() {
		super();
	}

	initView() {
		super.initView();
		let htmlText = LangManager.Instance.GetTranslation("tasktracetip.view.IntensifyTipView.content");
		this.setContentText(htmlText);
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_QH);
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}
	
}