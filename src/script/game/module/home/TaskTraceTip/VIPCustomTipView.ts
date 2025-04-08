// @ts-nocheck
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class VIPCustomTipView extends TaskTraceTipWnd {
	constructor() {
		super();
	}

	initView() {
		super.initView();
		this.setContentText(this.data.content);
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		SocketSendManager.Instance.vipCustomAdd();
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}
}