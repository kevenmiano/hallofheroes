// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-09-06 10:03:01
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-26 14:46:19
 * @Description: 调试框
 */

import LayerMgr from "../../../core/layer/LayerMgr";
import ResMgr from "../../../core/res/ResMgr";
import SDKManager from "../../../core/sdk/SDKManager";
import { EmLayer } from "../../../core/ui/ViewInterface";
import { EmPackName, EmWindow, UIZOrder } from "../../constant/UIDefine";
import NewbieEvent, { NativeEvent, ChatDebugEvent, WinEvent } from "../../constant/event/NotificationEvent";
import { ArmyManager } from "../../manager/ArmyManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PathManager } from "../../manager/PathManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmDebugCode } from "./DebugCfg";

export default class DebugModule {
	private view: fgui.GComponent;
	private txtNewbieDetail: fgui.GLabel;
	private txtNewbie: fgui.GLabel;
	private btnNewbie: fgui.GButton;

	private txtEventType: fgui.GLabel;
	private btnEventPost: fgui.GButton;
	private btnQuickOpen: fgui.GButton;
	private btnEventHelper: fgui.GButton;

	public autoShowDebug: boolean;
	public autoShowDebugWnd: EmWindow;

	private static _instance: DebugModule;
	public static get Instance(): DebugModule {
		return this._instance ? this._instance : this._instance = new DebugModule();
	}

	public setup() {
		this.load();

	}

	public load() {
		ResMgr.Instance.loadFairyGui(EmPackName.Debug, () => {
			this.initView();
			this.addEvent();
		})
	}

	public unload() {
		this.removeEvent();
		LayerMgr.Instance.removeByLayer(this.view.displayObject, EmLayer.NOVICE_LAYER);
		this.view.dispose()
	}

	private initView() {
		this.view = fgui.UIPackage.createObject(EmPackName.Debug, "Debug") as fgui.GComponent
		LayerMgr.Instance.addToLayer(this.view.displayObject, EmLayer.STAGE_TIP_LAYER);
		this.view.name = "Debug";
		this.view.getController("cTab").selectedIndex = 1;
		this.hide();
		this.view.displayObject.zOrder = UIZOrder.Top;
		this.view.displayObject.visible = !PathManager.info.LOGIN_CHECK_NICK;

		this.txtNewbieDetail = this.view.getChild("txtNewbieDetail").asLabel
		this.txtNewbie = this.view.getChild("tfNewbie").asCom.getChild("userName").asLabel
		this.btnNewbie = this.view.getChild("btnNewbie").asButton
		this.btnNewbie.onClick(null, () => {

		})

		this.txtEventType = this.view.getChild("tfEventType").asCom.getChild("userName").asLabel;
		this.btnEventPost = this.view.getChild("btnEventPost").asButton;
		this.btnQuickOpen = this.view.getChild("btnQuickOpen").asButton;
		this.btnEventHelper = this.view.getChild("btnEventHelper").asButton;
		this.btnEventPost.onClick(null, () => {
			let arr = this.txtEventType.text.split(",")
			let code = arr[0]
			let param1 = arr[1]
			let param2 = arr[2]
			switch (code) {
				case EmDebugCode.ChangeLv:
					ArmyManager.Instance.thane.grades = Number(param1)
					ArmyManager.Instance.thane.commit()
					break;
				case EmDebugCode.ChangeStatusBar:
					let nP1 = Number(param1 ? param1 : 50)
					let nP2 = Number(param2 ? param2 : 50)
					NotificationManager.Instance.sendNotification(NativeEvent.STATUS_BAR_CHANGE, nP1, nP2, 1);
					break;
				case EmDebugCode.SdkEvent:
					let code: number = Number(param1);
					if (!isNaN(code)) {
						SDKManager.Instance.getChannel().postGameEvent(code);
					}
					break;
				case EmDebugCode.AutoShowDebug:
					this.autoShowDebug = Number(param1) != 0;
					break;
			}
		})
		this.btnEventHelper.onClick(null, () => {
			FrameCtrlManager.Instance.open(EmWindow.DebugHelpWnd)
		})
		this.btnQuickOpen.onClick(null, () => {
			FrameCtrlManager.Instance.open(EmWindow.QuickOpenFrameWnd)
		})

		this.refreshFinishNodeId()
	}

	private addEvent() {
		NotificationManager.Instance.addEventListener(WinEvent.HIDE, this.__typeWinHide, this);
		NotificationManager.Instance.addEventListener(ChatDebugEvent.Debug, this.__debugHandler, this);
		NotificationManager.Instance.addEventListener(NewbieEvent.MAIN_NODE_FINISH, this.__mainNodeFinishHandler, this);
	}

	private removeEvent() {
		NotificationManager.Instance.removeEventListener(WinEvent.HIDE, this.__typeWinHide, this);
		NotificationManager.Instance.removeEventListener(ChatDebugEvent.Debug, this.__debugHandler, this);
		NotificationManager.Instance.removeEventListener(NewbieEvent.MAIN_NODE_FINISH, this.__mainNodeFinishHandler, this);
	}

	private __typeWinHide(typeWin: EmWindow) {
		if (this.autoShowDebug && typeWin == this.autoShowDebugWnd) {
			this.autoShowDebugWnd = null;
			this.show();
		}
	}

	private __debugHandler() {
		this.view.displayObject.visible = !this.view.displayObject.visible
	}

	private __mainNodeFinishHandler() {
		this.refreshFinishNodeId()
	}

	private refreshFinishNodeId() {
		this.txtNewbieDetail.text = PlayerManager.Instance.newNoviceProcess
	}

	public show() {
		this.view.getController("cPos").selectedIndex = 0;
	}
	public hide() {
		this.view.getController("cPos").selectedIndex = 1;
	}

	public get available() {
		return this.view.displayObject.visible
	}
}