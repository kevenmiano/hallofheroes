import LangManager from "../../../../core/lang/LangManager";
import { t_s_dropitemData } from "../../../config/t_s_dropitem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import TaskTraceProgressTipWnd from "./TaskTraceProgressTipWnd";

export class OpenBoxTipView extends TaskTraceProgressTipWnd {
	private _goodsInfo: GoodsInfo;
	private _toPos: number = -1;
	constructor() {
		super();
	}

	initView() {
		super.initView();
		if (!this.data) {
			return;
		}

		let desc = TempleteManager.Instance.getGoodsTempleteDesc(this.data.goods.templateInfo);
		this.setContentText(desc);
		this.setContentIcon(this.data.goods.templateInfo.iconPath);
		this.setBtnTitle(LangManager.Instance.GetTranslation("cell.view.GoodsItemMenu.use"));
		let count = this.data.goods.count;
		if (this.data.useCount > 0) {
			count = this.data.useCount;
		}
		this.setProgress(count);
	}

	protected __btnHandler(evt) {
		super.__btnHandler(evt);
		if (!this._data || !this._data.goods) {
			this.Hide();
			return;
		}

		let count = this.stepper.value;
		if (count) {
			SocketSendManager.Instance.sendUseItem(this.data.goods.pos, count);
			this.Hide();
		}

	}


}