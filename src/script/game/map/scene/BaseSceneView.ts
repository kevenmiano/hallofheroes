import { NotificationEvent, SceneEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { SceneManager } from "./SceneManager";
import SceneType from "./SceneType";
import { IBaseSceneView } from '../../interfaces/IBaseSceneView';
import Resolution from '../../../core/comps/Resolution';
import ResMgr from "../../../core/res/ResMgr";

/**
 * 
 * 基本的scene视图
 * 主要的生命周期有, 进入前预加载--》进入--》离开
 * 
 */
export class BaseSceneView extends Laya.Sprite implements IBaseSceneView {

	private _prepared: boolean = false;
	protected _isEnterOver: boolean = false;
	public get isEnterOver() {
		return this._isEnterOver;
	}

	constructor() {
		super();
	}

	public get sceneView(): Laya.Sprite {
		return null;
	}

	public get prepared(): boolean {
		return this._prepared;
	}

	/**
	 * 开始 预加载
	 * 针对进入场景前, 所需的资源或数据够多, 导致等待的时间较长的情况下
	 * 让视较图停留在上一个场景中进行等待,设计出的一个预加载接口
	 * @param data 包括场景切换控制的参数(如是否强制切换, 是否打开loading等), 场景生命周期控制参数
	 * 
	 */
	public preLoadingStart(data: Object = null): Promise<void> {
		NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, true);
		// SceneManager.Instance.lockScene = true;
		return new Promise(resolve => {
			this.preLoadingOver();
			resolve();
		});
	}
	/**
	 * 预加载完成时调用 
	 * 主要会做一个预加载阶段的收尾工作
	 * 
	 */
	preLoadingOver() {
		NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
		NotificationManager.Instance.dispatchEvent(NotificationEvent.UI_ENTER_SCENE);
		SceneManager.Instance.preLoadingBack();
	}

	public prepare() {
		this._prepared = true;
	}

	/**
	 * 进入游戏场景, 主要涉及视图初始化工作
	 * @param preScene 上一个场景
	 * @param data 同预加载data参数
	 * 
	 */
	public enter(preScene: BaseSceneView, data: Object = null): Promise<void> {
		return new Promise(resolve => {
			resolve();
		});
	}
	/**
	 * 进入场景完成, 
	 * 在准备工作全部完成后, 会一些数据与视图上的后续逻辑需求, 单独提出来, 便于思路 
	 * ***如进入副本后会播入一个地图名动画, 会开始开启预加载等
	 */
	public enterOver(): Promise<void> {
		return new Promise(resolve => {
			this.releaseScene();
			this._isEnterOver = true;
			resolve();
		});
	}

	protected releaseScene() {
		let needRelease: boolean = true;
		switch (this.getUIID()) {
			case SceneType.LOGIN_SCENE:
				needRelease = false;
				break;
			case SceneType.EMPTY_SCENE:
				needRelease = true;
				break;
			case SceneType.TRAINER_SCENE:
				needRelease = true;
				break;
			case SceneType.CASTLE_SCENE:
				needRelease = true;
				break;
			case SceneType.SPACE_SCENE:
				needRelease = true;
				break;
			case SceneType.OUTER_CITY_SCENE:
				needRelease = true;
				break;
			case SceneType.CAMPAIGN_MAP_SCENE:
				needRelease = true;
				break;
			case SceneType.BATTLE_SCENE:
				needRelease = false;
				break;
			case SceneType.PVE_ROOM_SCENE:
				needRelease = true;
				break;
			case SceneType.PVP_ROOM_SCENE:
				needRelease = true;
				break;
			case SceneType.FARM:
				needRelease = true;
				break;
			case SceneType.WARLORDS_ROOM:
				needRelease = true;
				break;
			case SceneType.VEHICLE:
				needRelease = true;
				break;
			case SceneType.VEHICLE_ROOM_SCENE:
				needRelease = true;
				break;
		}
		if (needRelease) {
			ResMgr.Instance.onClearRes();
		}
	}


	/**
	 * 离开场景, 
	 * 主要做一些内存回收逻辑的工作,对视图与数据的销毁 
	 * 
	 */
	public leaving(): Promise<void> {
		return new Promise(resolve => {
			resolve();
		});
	}

	public onScale() {

	}

	resize() {
		this.width = Resolution.gameWidth;
		this.height = Resolution.gameHeight;
		for (var index = 0; index < this.numChildren; index++) {
			var element = this.getChildAt(index);
			if (element['resize']) {
				//@ts-ignore
				element.resize();
			}
		}
	}

	public addSceneChild(child): Laya.Node {
		this.addChild(child); return child;
	}

	public getUIID() {
		return SceneType.LOGIN_SCENE;
	}


	public get SceneName(): string {
		return "";
	}

	public get backSceneName(): string {
		return SceneType.CASTLE_SCENE;
	}

	public dispose() {

	}
}
