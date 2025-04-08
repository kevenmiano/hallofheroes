// @ts-nocheck
import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import UIManager from '../../core/ui/UIManager';
import { SimpleDictionary } from '../../core/utils/SimpleDictionary';
import { t_s_appellData } from '../config/t_s_appell';
import { NotificationEvent } from "../constant/event/NotificationEvent";
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import { EmWindow } from '../constant/UIDefine';
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import AppellModel from '../module/appell/AppellModel';
import { ArmyManager } from "./ArmyManager";
import { NotificationManager } from "./NotificationManager";
import { TempleteManager } from './TempleteManager';
import Logger from '../../core/logger/Logger';

import AppellExchangeMsg = com.road.yishi.proto.player.AppellExchangeMsg;
import AppellInfoMsg = com.road.yishi.proto.player.AppellInfoMsg;
import AppellsMsg = com.road.yishi.proto.player.AppellsMsg;

export default class AppellManager extends GameEventDispatcher {
	private _delayPkg: PackageIn;

	private _model: AppellModel = new AppellModel();
	private static _instance: AppellManager;
	public static get Instance(): AppellManager {
		if (!this._instance) this._instance = new AppellManager();
		return this._instance;
	}

	public setup() {
		ServerDataManager.listen(S2CProtocol.U_APPELL_DATA, this, this.__updateAppellDataHandler);
		ServerDataManager.listen(S2CProtocol.U_APPELL_GET, this, this.__getAppellHandler);
	}

	private __updateAppellDataHandler(pkg: PackageIn) {
		let msg = pkg.readBody(AppellsMsg) as AppellsMsg;
		var appells: any[] = msg.appells;
		Logger.xjy("[AppellManager]__updateAppellDataHandler", appells)
		if (this.model.infos == null || this.model.infos.getList().length == 0) {
			this.model.infos = TempleteManager.Instance.getAppellTemplates();
		}
		var item: t_s_appellData;
		var dic: SimpleDictionary = new SimpleDictionary();
		for (var i: number = 0; i < appells.length; i++) {
			var appell: AppellInfoMsg = appells[i] as AppellInfoMsg;
			if (!this.model.infos.hasOwnProperty(appell.appellId)) {
				continue;
			}
			item = this.model.infos.get(appell.appellId);
			item.isGet = appell.isGet;
			item.progress = appell.value;
			if (item.Quality == 2) {
				item.Quality = 3;
			}
			if (this.thane.templateInfo && item.Job != this.thane.templateInfo.Job && item.Job != 0) {
				continue;
			}
			dic.add(item.TemplateId, item);
		}
		this.model.appells = dic;
	}

	private __getAppellHandler(pkg: PackageIn) {
		this._delayPkg = pkg;
		this.__switchSceneHandler(null);
	}

	private __switchSceneHandler(e: NotificationEvent) {
		NotificationManager.Instance.removeEventListener(NotificationEvent.SWITCH_SCENE, this.__switchSceneHandler, this);
		if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
			NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this.__switchSceneHandler, this);
		} else {
			this.getAppellTip(this._delayPkg);
		}
	}

	private getAppellTip(pkg: PackageIn) {
		let msg = pkg.readBody(AppellExchangeMsg) as AppellExchangeMsg;
		var appellInfo: t_s_appellData = TempleteManager.Instance.getAppellInfoTemplateByID(msg.appellId);
		if (appellInfo && appellInfo.Notice) {
			UIManager.Instance.ShowWind(EmWindow.AppellGetTips, appellInfo);
		}
	}

	public get model(): AppellModel {
		return this._model;
	}

	private get thane(): ThaneInfo {
		return ArmyManager.Instance.army.baseHero;
	}

}