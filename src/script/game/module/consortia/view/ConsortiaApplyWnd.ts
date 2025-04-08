/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-05 18:01:18
 * @Description: 公会申请(未加入公会展示的界面) v2.46 ConsortiaApplyFrame   已调试
 */
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { ConsortiaSocektSendManager } from "../../../manager/ConsortiaSocektSendManager";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import ConsortiaApplyCell from "./component/ConsortiaApplyCell";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";
import ConsortiaApplyRecordCell from "./component/ConsortiaApplyRecordCell";
import { ConsortiaInviteInfo } from "../data/ConsortiaInviteInfo";
import Utils from "../../../../core/utils/Utils";
import { YTextInput } from "../../common/YTextInput";

export class ConsortiaApplyWnd extends BaseWindow {
	public frame: fgui.GLabel;
	public consortiaList: fgui.GList;
	public txt_search: YTextInput;
	public btnSearch: fgui.GButton;
	public applyBtn: fgui.GButton;
	public createBtn: fgui.GButton;
	public btnApplayRecord: fgui.GButton;
	public btnInviteRecord: fgui.GButton;
	public recordList: fgui.GList;
	public applyAllBtn: fgui.GButton;
	private _contorller: ConsortiaControler;
	private _data: ConsortiaModel;
	private _inputStr: string = "";
	private _rightList: Array<ConsortiaInviteInfo> = [];
	public consortiaApplyRecord: ConsortiaApplyRecordCell;
	public OnInitWind() {
		super.OnInitWind();
		this.setCenter();

		Utils.setDrawCallOptimize(this.consortiaList);
		Utils.setDrawCallOptimize(this.recordList);
		this.consortiaList.setVirtual();
		this.recordList.setVirtual();
		this.txt_search.singleLine = true;

		this.initData();
		this.initEvent();
		this.frame.getChild("helpBtn").visible = false;
		this.frame.getChild("title").text = LangManager.Instance.GetTranslation("public.consortia");
		this.txt_search.promptText = LangManager.Instance.GetTranslation("ConsortiaApplyWnd.txtSearch");
		//读取xml
		// this.applyBtn.title = LangManager.Instance.GetTranslation("ConsortiaApplyWnd.applyBtn.title");
		// this.applyAllBtn.title = LangManager.Instance.GetTranslation("ConsortiaApplyWnd.applyAllBtn.title");
		// this.createBtn.title = LangManager.Instance.GetTranslation("ConsortiaApplyWnd.createBtn.title");
		this.btnInviteRecord.title = LangManager.Instance.GetTranslation("ConsortiaApplyWnd.btnInviteRecord.title");
		this.btnApplayRecord.title = LangManager.Instance.GetTranslation("ConsortiaApplyWnd.btnApplayRecord.title");
		this.consortiaApplyRecord.getChild("title1").text = LangManager.Instance.GetTranslation("ConsortiaApplyCell.title1");
		this.consortiaApplyRecord.getChild("title2").text = LangManager.Instance.GetTranslation("ConsortiaApplyCell.title2");
		this.consortiaApplyRecord.getChild("title3").text = LangManager.Instance.GetTranslation("ConsortiaApplyWnd.consortiaApplyRecord.title3");

		this._contorller.getConsortiaInviteInfos();
		Laya.timer.once(100, this, this.reqConsortiaList);
		this._contorller.randomCount = 1;
	}

	private reqConsortiaList() {
		ConsortiaSocektSendManager.searchConsortia("", 1, true);
	}

	private initData() {
		this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
		this._data = this._contorller.model;
	}

	private initEvent() {
		this.txt_search.on(Laya.Event.INPUT, this, this.onSearch);
		this.btnSearch.onClick(this, this.__onSearchHandler);
		this.applyBtn.onClick(this, this.applyBtnHandler);
		this.applyAllBtn.onClick(this, this.applyAllBtnHandler);
		this.createBtn.onClick(this, this.createBtnHandler);
		this.btnInviteRecord.onClick(this, this.InviteRecord);
		this.btnApplayRecord.onClick(this, this.ApplayRecord);
		this.consortiaList.itemRenderer = Laya.Handler.create(this, this.renderConsortiaListItem, null, false);
		this.recordList.itemRenderer = Laya.Handler.create(this, this.renderRecordListItem, null, false);
		this._data.addEventListener(ConsortiaEvent.UPDA_RECORD_LIST, this.onRecordListUpdata, this);
		this._data.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_LIST, this.onSearchListUpdata, this);
	}

	private removeEvent() {
		this.txt_search.off(Laya.Event.INPUT, this, this.onSearch);
		this.btnSearch.offClick(this, this.__onSearchHandler);
		this.applyBtn.offClick(this, this.applyBtnHandler);
		this.applyAllBtn.offClick(this, this.applyAllBtnHandler);
		this.createBtn.offClick(this, this.createBtnHandler);
		// this.consortiaList.itemRenderer.recover();
		// this.recordList.itemRenderer.recover();
		Utils.clearGListHandle(this.consortiaList);
		Utils.clearGListHandle(this.recordList);
		this.btnInviteRecord.offClick(this, this.InviteRecord);
		this.btnApplayRecord.offClick(this, this.ApplayRecord);
		this._data.removeEventListener(ConsortiaEvent.UPDA_RECORD_LIST, this.onRecordListUpdata, this);
		this._data.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_LIST, this.onSearchListUpdata, this);
	}

	renderConsortiaListItem(index: number, item: ConsortiaApplyCell) {
		if (!item || item.isDisposed) return;
		if (!this._data.consortiaList) return;
		item.info = this._data.consortiaList[index];
	}

	renderRecordListItem(index: number, item: ConsortiaApplyRecordCell) {
		if (!item && item.isDisposed) return;
		item.info = this._rightList[index];
	}

	onSearchListUpdata() {
		this.consortiaList.numItems = this._data.consortiaList.length;
		this.consortiaList.selectedIndex = 0;
	}

	onRecordListUpdata(data) {
		let bInvite = false;
		if (data && data.bInvite) {
			bInvite = true;
		}

		if (this.btnApplayRecord.selected && !bInvite) {
			//申请
			this._rightList = this._data.applyList;
			this.recordList.numItems = this._data.applyList.length;
		} else {
			//邀请
			this._rightList = this._data.inviteList;
			this.recordList.numItems = this._data.inviteList.length;
		}
	}

	/**邀请记录 */
	InviteRecord() {
		this.btnApplayRecord.selected = false;
		this.consortiaApplyRecord.getChild("title2").text = LangManager.Instance.GetTranslation(
			"consortia.view.club.ConsortiaSearchRightView.chairman02"
		);
		this._rightList = this._data.inviteList;
		this.recordList.numItems = this._data.inviteList.length;
	}

	/**申请记录*/
	ApplayRecord() {
		this.btnInviteRecord.selected = false;
		this.consortiaApplyRecord.getChild("title2").text = LangManager.Instance.GetTranslation(
			"consortia.view.myConsortia.building.ConsortiaPrizeAllotFrame.tableTitle2"
		);

		this._rightList = this._data.applyList;
		this.recordList.numItems = this._data.applyList.length;
	}

	private onSearch(e: Laya.Event = null) {
		this.__onSearchHandler();
	}

	/**搜索按钮点击 */
	private __onSearchHandler() {
		if (this.txt_search.text == "") {
			this._contorller.randomCount++;
			ConsortiaSocektSendManager.searchConsortia("", this._contorller.randomCount, false);
			return;
		}
		this._contorller.randomCount++;
		if (this._inputStr != this.txt_search.text) {
			this._contorller.randomCount = 1;
		} else {
			if ((this._contorller.randomCount - 1) * ConsortiaModel.CONSORTIA_SEARCH_PAGE_NUM >= this._contorller.model.setTotalRows) {
				this._contorller.randomCount = 1;
			}
		}
		this._inputStr = this.txt_search.text;
		ConsortiaSocektSendManager.searchConsortia(this.txt_search.text, this._contorller.randomCount, true);
	}

	/**
	 * 申请加入
	 */
	applyBtnHandler() {
		let selectedIndex = this.consortiaList.selectedIndex;
		// 没有公会点申请会fgui库会报错
		if (selectedIndex < 0) return;
		let item: ConsortiaApplyCell = this.consortiaList.getChildAt(selectedIndex) as ConsortiaApplyCell;
		if (!item) return;
		if (1 + this._data.applyList.length > ConsortiaModel.APPLY_MAX) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.ConsortiaControler.command04"));
			return;
		}
		ConsortiaSocektSendManager.applyJoinConsortia(item.info.consortiaId);
	}

	/**
	 * 一键加入
	 */
	applyAllBtnHandler() {
		let len: number = this.consortiaList.numChildren;
		if (len + this._data.applyList.length > ConsortiaModel.APPLY_MAX) {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.ConsortiaControler.command04"));
			return;
		}
		for (var i: number = 0; i < len; i++) {
			let item: ConsortiaApplyCell = this.consortiaList.getChildAt(i) as ConsortiaApplyCell;
			if (item) {
				ConsortiaSocektSendManager.applyJoinConsortia(item.info.consortiaId);
			}
		}
	}

	/**
	 * 创建公会
	 */
	createBtnHandler() {
		FrameCtrlManager.Instance.open(EmWindow.ConsortiaCreate);
	}

	public OnShowWind() {
		super.OnShowWind();
	}

	public OnHideWind() {
		super.OnHideWind();
		this.removeEvent();
	}

	dispose(dispose?: boolean) {
		super.dispose(dispose);
	}
}
