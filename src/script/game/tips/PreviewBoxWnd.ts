import LangManager from "../../core/lang/LangManager";
import BaseWindow from "../../core/ui/Base/BaseWindow";
import UIButton from "../../core/ui/UIButton";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { BaseItem } from "../component/item/BaseItem";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { MessageTipManager } from "../manager/MessageTipManager";
import { SocketSendManager } from "../manager/SocketSendManager";
import { TempleteManager } from "../manager/TempleteManager";
import { PreviewBoxItem } from "./PreviewBoxItem";

/**
 * 宝箱预览
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @datetime 2023年8月8日17:12:40
 */
export default class PreviewBoxWnd extends BaseWindow {
	/**道具列表 */
	public list: fgui.GList;
	/**开启按钮 */
	public btn_open: UIButton;
	/**宝箱道具 */
	private _box: GoodsInfo;
	/**开启数量 */
	private _openCount: number;
	/**是否预览 */
	private _preview: boolean = true;
	/**道具集合 */
	private _goods: GoodsInfo[];
	/**选择项 */
	private _selectItem: PreviewBoxItem = null;

	/**初始化窗体 */
	public OnInitWind() {
		super.OnInitWind();
		this.setCenter();

		[this._box, this._openCount, this._preview] = this.params;
		this.txtFrameTitle.text = this._box.templateInfo.TemplateNameLang;
		this.getController("preview").selectedIndex = Number(this._preview);

		this.list.setVirtual();
		this.list.on(fairygui.Events.CLICK_ITEM, this, this.onItemSelect);
		this.list.itemRenderer = Laya.Handler.create(this, this.onItemRenderer, null, false);

		let dropItems = TempleteManager.Instance.getDropItemssByDropId(this._box.templateId);
		this._goods = [];

		let goods: GoodsInfo = null;
		for (let dropItem of dropItems) {
			goods = new GoodsInfo();
			goods.pos = dropItem.Id;
			goods.count = dropItem.Data* this._openCount;
			goods.templateId = dropItem.ItemId;
			this._goods.push(goods);
		}
		this._goods = ArrayUtils.sortOn(this._goods, "Random", ArrayConstant.NUMERIC);
		this.btn_open.onClick(this, this.onComfirmHandler);
	}

	/**显示窗体 */
	public OnShowWind() {
		super.OnShowWind();
		this.list.numItems = this._goods.length;
	}

	/**渲染列表项 */
	private onItemRenderer(index: number, item: PreviewBoxItem) {
		let goods = this._goods[index];
		goods.count = goods.count;
		item.info = goods;
	}

	/**选择列表项 */
	private onItemSelect(selectedItem: PreviewBoxItem) {
		this._selectItem = selectedItem;
	}

	/**开启处理 */
	private onComfirmHandler() {
		if (!this._selectItem) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("box.select.goods.not"));
			return;
		}

		SimpleAlertHelper.Instance.Show(
			SimpleAlertHelper.SIMPLE_ALERT,
			null,
			LangManager.Instance.GetTranslation("public.prompt"),
			LangManager.Instance.GetTranslation(
				"box.open.confirm",
				"[color=" + this._selectItem.goods.templateInfo.profileColor + "]" + this._selectItem.goods.templateInfo.TemplateNameLang + "[/color]",
				(this._selectItem.goodsItem as BaseItem).text
			),
			LangManager.Instance.GetTranslation("public.confirm"),
			LangManager.Instance.GetTranslation("public.cancel"),
			this.alertCallback.bind(this)
		);
	}

	/**提醒弹窗回调 */
	private alertCallback(b: boolean, flag: boolean) {
		if (b) {
			let selectItemInfos = [];
			let obj = {
				pos: this._selectItem.goods.pos,
				count: this._openCount,
			};
			selectItemInfos.push(obj);

			let pos = this._box.pos;
			let count = this._openCount;
			SocketSendManager.Instance.sendUseItem(pos, count, 1, "", 0, selectItemInfos);
			this.hide();
		}
	}
}
