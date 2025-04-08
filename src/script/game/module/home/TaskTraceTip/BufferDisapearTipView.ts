// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { PlayerBufferInfo } from "../../../datas/playerinfo/PlayerBufferInfo";
import { TipMessageData } from "../../../datas/TipMessageData";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { GoodsHelp } from "../../../utils/GoodsHelp";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class BufferDisapearTipView extends TaskTraceTipWnd {

	initView() {
		super.initView();
		let _contentTxt: string = "";
		var buffer: any = this.data.data;
		if (buffer) {
			var goodsInfo: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(buffer.goodsTemplateId);
			var name: string = "[color=" + GoodsHelp.getGoodColorString(goodsInfo.Profile) + "]" + buffer.name + "[/color]";
			var content: string = LangManager.Instance.GetTranslation("public.BufferDisapear");
			_contentTxt = name + content
		} else {
			_contentTxt = LangManager.Instance.GetTranslation("taskTraceTips.ContentTxt");
		}
		this.setContentText(_contentTxt);
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}
}