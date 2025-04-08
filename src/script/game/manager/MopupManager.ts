import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import { MopupModel } from "../mvc/model/MopupModel";
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import { EmWindow } from '../constant/UIDefine';

export class MopupManager extends GameEventDispatcher {
	public model: MopupModel;

	private static _instance: MopupManager;
	public static get Instance(): MopupManager {
		if (!MopupManager._instance) MopupManager._instance = new MopupManager();
		return MopupManager._instance;
	}

	setup() {

	}

	constructor() {
		super();
		let mopupCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Mopup);
		if (!mopupCtrl) {
			this.model = new MopupModel();
			return;
		}
		this.model = mopupCtrl.data;
	}
}