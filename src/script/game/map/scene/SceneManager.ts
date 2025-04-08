import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import LayerMgr from '../../../core/layer/LayerMgr';
import Logger from '../../../core/logger/Logger';
import UIManager from '../../../core/ui/UIManager';
import { EmLayer } from "../../../core/ui/ViewInterface";
import HintUtils from '../../component/HintUtils';
import { ClientStateType } from "../../constant/ClientStateType";
import { NotificationEvent, SceneEvent } from "../../constant/event/NotificationEvent";
import { RoomSceneType } from "../../constant/RoomDefine";
import { EmWindow } from '../../constant/UIDefine';
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SocketSendManager } from '../../manager/SocketSendManager';
import LoadingSceneWnd from '../../module/loading/LoadingSceneWnd';
import BattleScene from '../../scene/BattleScene';
import { CampaignMapScene } from "../../scene/CampaignMapScene";
import CastleScene from '../../scene/CastleScene';
// import FarmScene from "../../scene/FarmScene";
import LoginScene from '../../scene/LoginScene';
import RoomScene from "../../scene/RoomScene";
import SpaceScene from "../../scene/SpaceScene";
import WarlordsRoomScene from "../../scene/WarlordsRoomScene";
import ComponentSetting from "../../utils/ComponentSetting";
import UIHelper from "../../utils/UIHelper";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import ISceneSwitchAnimation from "../space/interfaces/ISceneSwitchAnimation";
import { BaseSceneView } from "./BaseSceneView";
import { EmptyScene } from "./EmptyScene";
import EnterBattleSceneSwitchAnimation from "./EnterBattleSceneSwitchAnimation";
import { SceneSwitchAninmation } from "./SceneSwitchAninmation";
import SceneType from "./SceneType";
import { OuterCityScene } from "../../scene/OuterCityScene";
import ResMgr from "../../../core/res/ResMgr";
import HomeWnd from "../../module/home/HomeWnd";
import Resolution from "../../../core/comps/Resolution";


import SkillWndCtrl from "../../module/skill/SkillWndCtrl";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import SpaceManager from "../space/SpaceManager";

/**
 * 场景管理器
 */
export class SceneManager extends GameEventDispatcher {

	public currentType: string;
	private _sceneDict: Map<string, BaseSceneView>;
	private _currentScene: BaseSceneView;
	private _nextScene: BaseSceneView;
	private _data: any;
	private _sceneSwitchAnimation: ISceneSwitchAnimation;
	private _lock: boolean = false;
	private _loadType: number = 0;
	protected modelMask: Laya.Sprite;//蒙版
	public preSceneType: string;

	private get controler(): SkillWndCtrl {
		return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
	}

	public get nextScene(): BaseSceneView {
		return this._nextScene;
	}

	public set lock(value: boolean) {
		/**
		 * 切场景中过程中可用强制切到另外一个场景
		 * 解决bug: 玩家对结界塔进行要最后一次攻击时, 游戏黑屏;
		 */
		// this._lock = value;  
		this._lock = false;
		this.dispatchEvent(SceneEvent.SWITCH_SCENE_LOCK, this._lock);
	}

	public get lock(): boolean {
		return this._lock;
	}

	public get currentScene(): BaseSceneView {
		return this._currentScene;
	}

	public backSceneCall() {
		let scene: string = this._currentScene.backSceneName;
		this.setScene(scene);
	}

	public preSetup() {
		this.lock = false;
		this._sceneDict = new Map();
		NotificationManager.Instance.addEventListener(SceneEvent.LOCK_SCENE, this.onSwitchLockScene, this);
		NotificationManager.Instance.addEventListener(SceneEvent.HIDE_SCENE_OBJ, this.onHideSceneObj, this);
	}

	public setup() {
	}

	onSwitchLockScene(value) {
		this.lockScene = value;
	}
	onHideSceneObj(b) {
		SceneManager.Instance.currentScene.visible = b;
		SceneManager.Instance.currentScene.active = b;
		HomeWnd.Instance.visible = b;
		HomeWnd.Instance.active = b;

		let wind = UIManager.Instance.FindWind(EmWindow.SpaceTaskInfoWnd);
		if (wind && UIManager.Instance.isShowSpaceTaskInfoWndScene) {
			wind.visible = b;
		}
	}
	/**
	 * 屏幕锁定
	 * @param b
	 *
	 */
	public set lockScene(b: boolean) {
		Logger.yyz("🔔锁定场景:", b);
		let layer: any = LayerMgr.Instance.getLayerByType(EmLayer.GAME_TOP_LAYER);
		layer.mouseEnabled = !b;
		layer = LayerMgr.Instance.getLayerByType(EmLayer.GAME_BOTTOM_LAYER);
		layer.mouseEnabled = !b;
		if (b) {
			// CursorManagerII.instance.hide();
		} else {
			// CursorManagerII.instance.show();
		}
	}

	public get lockScene(): boolean {
		let layer: any = LayerMgr.Instance.getLayerByType(EmLayer.GAME_TOP_LAYER);
		let layer2: any = LayerMgr.Instance.getLayerByType(EmLayer.GAME_BOTTOM_LAYER);
		return !(layer.mouseEnabled && layer2.mouseEnabled)
	}

	private _dealyShowSmallLoadingTime: any = 0;
	private dealyShowSmallLoading(cur: string, next: string) {
		clearInterval(this._dealyShowSmallLoadingTime);
		this._dealyShowSmallLoadingTime = 0;
		if (cur == this.currentType && next != this.currentType) {
			LoadingSceneWnd.Instance.Show();
		}
	}
	/**
	 * @param type
	 * @param data
	 * @param isForce 注: 是否强制执行, 比如大地图中打开世界地图进行切换。
	 * @param createNew 是否创建新的视图.当需要在两个相同类型的视图间进行切换时应设置为true.(还未完善!!!)
	 */
	private _startTime: number = 0;
	public setScene(type: string, data = null, isForce: boolean = false, showLoader: boolean = false, loadType: number = 0) {
		Logger.base("[SceneManager]切换场景", type, this._lock);
		this.preSceneType = this.currentType;
		SpaceManager.ClickEnterHome = false;
		if (this._lock) return;
		//if(isTeamForbid(type))
		//{//组队时禁止进入的场景
		//		return;
		//}
		// LoaderManagerII.instance.removeCanClearList();
		this.enable = false;
		LoadingSceneWnd.Instance.switchSceneFlag = true;
		if (data && data.isDealyShowSmallLoading)
			data.isShowLoading = false;
		this._startTime = new Date().getTime();
		// KeyBoardRegister.instance.keyEnable = false;
		this._loadType = loadType;
		Logger.log('SceneManager.setScene:', type);
		if (this._sceneSwitchAnimation) {
			this._sceneSwitchAnimation.stop();
			this._sceneSwitchAnimation = null;
		}
		this._sceneSwitchAnimation = this.createSwitchAnimationByType(type);
		this._data = data;
		this.sendClientCurrentState(type);
		if (type == this.currentType) {
			if (isForce) {
				this.forceSetScene(type);
			}
			this.enable = true;
			return;
		}
		this.lock = true;
		if (type == null) throw new Error("setScene is null");
		ResMgr.Instance.clearUnLoaded();
		if ((data && data.isShowLoading) || (data && !data.hasOwnProperty("isShowLoading")) || !data)
			LoadingSceneWnd.Instance.Show();
		if (type == SceneType.CASTLE_SCENE) {
			SocketSendManager.Instance.enterCastle(true);
			PlayerManager.Instance.currentPlayerModel.inCastle = true;
		} else if (type == SceneType.OUTER_CITY_SCENE) { 
			PlayerManager.Instance.currentPlayerModel.inOutCity = true;
		}
		else if (type == SceneType.FARM) {
			// SocketSendManager.Instance.enterCastle(true);
		} else if (type == SceneType.SPACE_SCENE) {
			SocketSendManager.Instance.enterCastle(false);
		}
		let nextScene: BaseSceneView = this.getSceneByType(type);
		if (nextScene) {
			this.setSceneImp(nextScene);
		} else {
			this.createSceneAsynsImp(type, this.createSceneCallBack);
		}
		if (this.controler) {
			this.controler.reqRuneGemLottery(1);
		}
		// let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
		// playerInfo.dispatchEvent(PlayerEvent.RUNE_GEM_ENERGY,playerInfo);
	}

	private createSwitchAnimationByType(type: SceneType): ISceneSwitchAnimation {
		let switchAnim: ISceneSwitchAnimation;
		Logger.log('SceneManager.createSwitchAnimationByType:', type);
		if (type == SceneType.BATTLE_SCENE) {
			switchAnim = new EnterBattleSceneSwitchAnimation(this.sceneAninmationBack.bind(this));
		} else {
			switchAnim = new SceneSwitchAninmation(this.sceneAninmationBack.bind(this));
		}

		return switchAnim;
	}

	/**
	 * 强制切换到当前场景时的逻辑
	 */
	private _tempType: string;
	private forceSetScene(type: string) {
		this._tempType = type;
		this.lock = true;
		if (this._data && this._data.isShowLoading)
			LoadingSceneWnd.Instance.Show();
		let nextScene: BaseSceneView = this.getSceneByType(SceneType.EMPTY_SCENE);
		if (nextScene) {
			this.emptyScene(nextScene);
		} else {
			this.createSceneAsynsImp(SceneType.EMPTY_SCENE, this.emptyScene);
		}
	}

	private async emptyScene(scene: BaseSceneView) {
		Logger.log('SceneManager.emptyScene:line201');
		this._nextScene = scene;
		await this._nextScene.enter(this._currentScene, this._data);
		await this._currentScene.leaving();
		if (this._currentScene)
			LayerMgr.Instance.removeByLayer(this._currentScene, EmLayer.GAME_BOTTOM_LAYER);
		//清除所有UI
		// UIManager.Instance.HideAllWind(true);
		// FrameCtrlManager.Instance.exitAll();
		UIHelper.closeWindows();

		this._currentScene = this._nextScene;
		this._sceneDict.set(this._currentScene.SceneName, this._currentScene);

		this.currentType = this._currentScene.SceneName;
		if (this._currentScene && !this._currentScene.destroyed) {//避免偶现报错
			LayerMgr.Instance.addToLayer(this._currentScene, EmLayer.GAME_BOTTOM_LAYER);
		}
		this.lock = false;
		this._nextScene = null;
		NotificationManager.Instance.dispatchEvent(NotificationEvent.SWITCH_SCENE, this._currentScene.SceneName);

		this._currentScene.enterOver();
		await this.setScene(this._tempType, this._data, false, false, this._loadType);
	}

	/**
	 * 正常状态逻辑
	 * @param scene
	 *
	 */
	private createSceneCallBack(scene: BaseSceneView) {
		if (scene) {
			this.setSceneImp(scene);
		}
		else {
			this.lock = false;
		}
	}

	private setSceneImp(scene: BaseSceneView) {
		Logger.log('SceneManager.setSceneImp:');
		if (scene && scene != this._currentScene) {
			this.checkSceneRelease(this._currentScene, scene);
			this._nextScene = scene;
			Logger.log('SceneManager.setSceneImp _nextScene preLoadingStart: ', scene.SceneName);
			if (!this._nextScene.prepared) this._nextScene.prepare();
			if (this._data && this._data.isDealyShowSmallLoading) {
				this._dealyShowSmallLoadingTime = setInterval(this.dealyShowSmallLoading.bind(this), 2000, String(this.currentType), this._nextScene.SceneName);
			}
			this._nextScene.preLoadingStart(this._data);
		}
		else {
			Logger.log('SceneManager.setSceneImp:lock=false');
			this.lock = false;
		}
	}

	/**检查场景释放 */
	private checkSceneRelease(nowScene: BaseSceneView, nextScene: BaseSceneView) {
		// if (nextScene.getUIID() == SceneType.CAMPAIGN_MAP_SCENE && nowScene.getUIID() == SceneType.BATTLE_SCENE) {//战斗退出至副本
		// 	Logger.log('checkSceneRelease0:', nowScene.getUIID(), nextScene.getUIID());
		// } else if (nextScene.getUIID() == SceneType.CASTLE_SCENE && nowScene.getUIID() == SceneType.FARM) {//退出至内城
		// 	Logger.log('checkSceneRelease0:', nowScene.getUIID(), nextScene.getUIID());
		// } else {
		// 	Logger.log('checkSceneRelease1:', nowScene.getUIID(), nextScene.getUIID());
		// 	// ResMgr.Instance.onClearRes();
		// }
	}

	public preLoadingBack() {
		LoadingSceneWnd.Instance.Hide();
		LoadingSceneWnd.Instance.switchSceneFlag = false;
		if (!this._currentScene) {
			this.addNextSceneImp();
			return;
		}

		if (this._sceneSwitchAnimation) {
			this._sceneSwitchAnimation.stop();
			this._sceneSwitchAnimation = null;
		}
		this._sceneSwitchAnimation = this.createSwitchAnimationByType(this._loadType);
		Logger.log('SceneManager.preLoadingBack', 'nextScene:', this.nextScene.SceneName, 'currentScene:', this.currentScene.SceneName);
		this._sceneSwitchAnimation.nextScene(this._nextScene);
		this._sceneSwitchAnimation.curScene(this._currentScene);
		this._sceneSwitchAnimation.start();
	}

	/**
	 *当前场景为空时
	 */
	private async addNextSceneImp() {
		Logger.log('SceneManager.addNextSceneImp:line275');
		await this._nextScene.enter(this._currentScene, this._data);
		this._currentScene = this._nextScene;
		this._sceneDict.set(this._currentScene.SceneName, this._currentScene);
		this.currentType = this._currentScene.SceneName;
		if (this._currentScene && !this._currentScene.destroyed) {//避免偶现报错
			LayerMgr.Instance.addToLayer(this._currentScene, EmLayer.GAME_BOTTOM_LAYER);
		}
		this.lock = false;
		NotificationManager.Instance.dispatchEvent(NotificationEvent.SWITCH_SCENE, this._currentScene.SceneName);
		this._nextScene = null;
		Logger.log('SceneManager.addNextSceneImp:enterOver');
		await this._currentScene.enterOver();
		this.enable = true
		// KeyBoardRegister.instance.keyEnable = true;
	}

	public async sceneAninmationBack() {
		Logger.log('SceneManager.sceneAninmationBack场景动画完成回调:line359');
		if (!this.nextScene) {
			return;
		}
		if (this._currentScene) {
			NotificationManager.Instance.dispatchEvent(NotificationEvent.BEFORE_LEAVEING_SCENE, true);
			await this._currentScene.leaving();
		}

		if (this._currentScene) {
			LayerMgr.Instance.removeByLayer(this._currentScene, EmLayer.GAME_BOTTOM_LAYER);
		}
		HintUtils.clear();//清除掉队列消息
		await UIHelper.closeWindows();
		await this._nextScene.enter(this._currentScene, this._data);
		NotificationManager.Instance.dispatchEvent(NotificationEvent.BEFORE_LEAVEING_SCENE, false);

		this._currentScene = this._nextScene;
		this._sceneDict.set(this._currentScene.SceneName, this._currentScene);

		this.currentType = this._currentScene.SceneName;
		if (this._currentScene && !this._currentScene.destroyed) {//避免偶现报错
			LayerMgr.Instance.addToLayer(this._currentScene, EmLayer.GAME_BOTTOM_LAYER);
		}
		this.lock = false;
		this._nextScene = null;
		NotificationManager.Instance.dispatchEvent(NotificationEvent.SWITCH_SCENE, this._currentScene.SceneName);
		await this._currentScene.enterOver();
		Laya.timer.once(this.getSceneEnabledTime, this, () => { this.enable = true; });

		//清理无引用资源
		ResMgr.Instance.clearUnusedRes();
		Logger.log('SceneManager.sceneAninmationBack场景动画完成回调:line391', this._sceneSwitchAnimation);
		NotificationManager.Instance.dispatchEvent(SceneEvent.SCENE_SWITCH_CALL, null);
		Logger.base("-----------scene switch cost time-- :" + (new Date().getTime() - this._startTime) + "----");
	}

	private sendClientCurrentState(nextScene: string) {
		let state: number = ClientStateType.getClientState(nextScene);
		if (state >= 0) {
			SocketSendManager.Instance.sendCurrentClientState(state);
		}
	}

	private createSceneAsynsImp(type: string, callBack: Function) {
		this.createAsync(type, callBack);
	}

	private getSceneByType(type: string, createNew: boolean = false): BaseSceneView {
		let scene: BaseSceneView = this._sceneDict.get(type) as BaseSceneView;
		if (!scene || createNew) {
			scene = this.create(type);
		}
		return scene
	}

	/**
	 * 异步创建场景
	 * @param type
	 * @param callback
	 */
	private createAsync(type: string, callback: Function) {

	}

	private getSceneResources(type: string): Array<string> {
		let arr: Array<string> = [];
		switch (type) {
			case SceneType.CASTLE_SCENE:
				if (ArmyManager.Instance.thane.grades < 20) {
					arr.push(ComponentSetting.getUISourcePath(EmWindow.CASTLEMAP1));
				} else {
					arr.push(ComponentSetting.getUISourcePath(EmWindow.CASTLEMAP2));
				}
				arr.push(ComponentSetting.getUISourcePath(EmWindow.CORE));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.CASTLE));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.QUEUE_BAR));
				break;
			case SceneType.CAMPAIGN_MAP_SCENE:
				arr.push(ComponentSetting.getUISourcePath(EmWindow.MAP));
				let mapId: number = CampaignManager.Instance.mapModel.mapId;
				if (WorldBossHelper.checkGvg(mapId))
					arr.push(ComponentSetting.getUISourcePath(EmWindow.GVG));
				if (!WorldBossHelper.checkIsNoviceMap(mapId))
					arr.push(ComponentSetting.getUISourcePath(EmWindow.CAMPAIGN));
				if (ArmyManager.Instance.thane.grades >= 23)
					arr.push(ComponentSetting.getUISourcePath(EmWindow.MAZE));
				break;
			case SceneType.BATTLE_SCENE:
				if (!WorldBossHelper.checkIsNoviceMap(mapId))
					arr.push(ComponentSetting.getUISourcePath(EmWindow.QTE));
				break;
			case SceneType.TRAINER_SCENE:
				arr.push(ComponentSetting.getUISourcePath(EmWindow.NOVICE));
				break;
			case SceneType.PVE_ROOM_SCENE:
				arr.push(ComponentSetting.getUISourcePath(EmWindow.BASE_ROOM));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.PVE_ROON_SCENE));
				break;
			case SceneType.PVP_ROOM_SCENE:
				arr.push(ComponentSetting.getUISourcePath(EmWindow.BASE_ROOM));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.PVP_ROOMLIST));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.PVP_ROOM_SCENE));
				break;
			case SceneType.FARM:
				arr.push(ComponentSetting.getUISourcePath(EmWindow.FARMMAP));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.FARM));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.WATER));
				break;
			case SceneType.VEHICLE:
				arr.push(ComponentSetting.getUISourcePath(EmWindow.MAP));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.VEHICLE));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.VEHICLE_DAIMON_TRAIL));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.CAMPAIGN));
				break;
			case SceneType.WARLORDS_ROOM:
				arr.push(ComponentSetting.getUISourcePath(EmWindow.WARLORDS_ROOM));
				break;
			case SceneType.SPACE_SCENE:
				arr.push(ComponentSetting.getUISourcePath(EmWindow.QUEUE_BAR));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.MAP));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.CAMPAIGN));
				break;
			case SceneType.OUTER_CITY_SCENE:
				arr.push(ComponentSetting.getUISourcePath(EmWindow.MAP));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.OuterCity));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.MAP_HORSE));
				arr.push(ComponentSetting.getUISourcePath(EmWindow.TIPS));
				break;
		}
		return arr;
	}

	/**
	 * 创建场景
	 * @param type 
	 */
	private create(type: string): BaseSceneView {
		Logger.yyz("创建场景: type: " + type);
		switch (type) {
			case SceneType.LOGIN_SCENE:
				return new LoginScene();
			case SceneType.EMPTY_SCENE:
				return new EmptyScene();
			case SceneType.CASTLE_SCENE:
				return new CastleScene();
			case SceneType.PVE_ROOM_SCENE:
				return new RoomScene(RoomSceneType.PVE);
			case SceneType.PVP_ROOM_SCENE:
				return new RoomScene(RoomSceneType.PVP);
			case SceneType.SPACE_SCENE:
				return new SpaceScene();
			case SceneType.BATTLE_SCENE:
				return new BattleScene();
			case SceneType.CAMPAIGN_MAP_SCENE:
				return new CampaignMapScene();
			case SceneType.FARM:
				// return new FarmScene();
			case SceneType.WARLORDS_ROOM:
				return new WarlordsRoomScene();
			case SceneType.OUTER_CITY_SCENE:
				return new OuterCityScene();
		}
	}

	/** 移除当前场景 */
	public removeSceneType() {
		this._sceneDict.delete(this.currentType);
	}

	/**
	 * 设置场景是否可用  设置false后一定要设置true
	 * @param enable 
	 */
	public set enable(b: boolean) {
		Logger.base("设置场景是否可点击 ", b)
		if (b) {
			this.removeModel()
		} else {
			this.createModel()
		}
	}

	public setMainToolBarEnabled(b: boolean) {
		// if (HomeWnd.Instance.getMainToolBar()) {
		// 	HomeWnd.Instance.getMainToolBar().enable = b;
		// }
	}

	protected createModel() {
		if (!this.modelMask) {
			this.modelMask = new Laya.Sprite();
			this.modelMask.graphics.drawRect(0, 0, Resolution.gameWidth, Resolution.gameHeight, '#ff0000');
			this.modelMask.alpha = 0;
			this.modelMask.size(Resolution.gameWidth, Resolution.gameHeight)
			this.modelMask.x = 0;
			this.modelMask.y = 0;
			this.modelMask.mouseEnabled = true;
			this.modelMask.mouseThrough = false;
			this.modelMask.on(Laya.Event.CLICK, this, (evt) => {
				Logger.info('scene modal click');
			})
			let layer = LayerMgr.Instance.getLayer(EmLayer.STAGE_TOP_LAYER);
			layer.pushView(this.modelMask, 999);
		}
		this.modelMask.visible = true;
	}

	protected removeModel() {
		if (this.modelMask) {
			this.modelMask.visible = false;
			// LayerMgr.Instance.removeByLayer(this.modelMask, EmLayer.STAGE_TOP_LAYER);
			// this.modelMask = null
		}
	}

	private get getSceneEnabledTime() {
		let name = this._currentScene.SceneName
		let time = 1000
		switch (name) {
			case SceneType.FARM:
			case SceneType.CASTLE_SCENE:
			case SceneType.PVE_ROOM_SCENE:
			case SceneType.PVP_ROOM_SCENE:
				time = 600
				break;
			case SceneType.BATTLE_SCENE:
				time = 200
				break;
			default:

				break;
		}
		return time
	}

	public sceneEnterOver(sceneName: SceneType) {
		if (!sceneName || !this._currentScene) return false;
		let name = this._currentScene.SceneName;
		return name == sceneName && this._currentScene.isEnterOver;
	}

	private static _instance: SceneManager
	public static get Instance(): SceneManager {
		if (!SceneManager._instance) SceneManager._instance = new SceneManager();
		return SceneManager._instance;
	}

	removeSwitchAnimation() {
		Logger.log('SceneManager.removeSwitchAnimation', this._sceneSwitchAnimation);
		if (this._sceneSwitchAnimation) {
			this._sceneSwitchAnimation.stop();
			this._sceneSwitchAnimation = null;
		}
	}

	public refreshScene() {
		this.forceSetScene(this.currentType);
	}
}