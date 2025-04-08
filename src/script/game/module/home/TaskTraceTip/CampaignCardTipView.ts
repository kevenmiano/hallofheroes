import LangManager from "../../../../core/lang/LangManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class CampaignCardTipView extends TaskTraceTipWnd {


	initView() {
		super.initView();
		let text = LangManager.Instance.GetTranslation("tasktracetip.view.campaignCommand01");
		this.setContentText(text);
	}

	protected __btnHandler(evt) {
		super.__btnHandler(evt);
		this.useVipCard();
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}

	private useVipCard() {
		this._data && SocketSendManager.Instance.sendUseItem(this.data.goods.pos);
	}

}