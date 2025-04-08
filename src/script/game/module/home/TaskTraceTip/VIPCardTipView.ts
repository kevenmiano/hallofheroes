import LangManager from "../../../../core/lang/LangManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

/**
 *  
 * 新手礼包中获得vip体验卡 提示玩家使用
 * 
 */
export class VIPCardTipView extends TaskTraceTipWnd {
	constructor() {
		super();
	}
	
	initView() {
		super.initView();
		let htmlText =  LangManager.Instance.GetTranslation("tasktracetip.view.vipCommand02");
		this.setContentText(htmlText);
	}

	protected __btnHandler(evt) {
		super.__btnHandler(evt);
		this.useVipCard();
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}


	private useVipCard() {
		this.data && SocketSendManager.Instance.sendUseItem(this.data.goods.pos);
	}


}