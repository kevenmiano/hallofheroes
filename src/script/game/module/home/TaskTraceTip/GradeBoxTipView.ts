import LangManager from "../../../../core/lang/LangManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class GradeBoxTipView extends TaskTraceTipWnd {

	constructor() {
		super();
	}

	initView() {
		super.initView();
		this.setContentText(this.data.title);
		this.setContentIcon(this.data.goods.templateInfo.iconPath);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.GradeBoxTipView.text"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		if (GoodsManager.Instance.getGoodsByGoodsIdFromGeneralBag(this.data.goods.id)) {
		} else {
			var str: string = LangManager.Instance.GetTranslation("tasktracetip.view.GradeBoxTipView.command01");
			MessageTipManager.Instance.show(str);
		}
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}
}