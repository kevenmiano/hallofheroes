// @ts-nocheck
import { NotificationManager } from "../../manager/NotificationManager";
import ISceneSwitchAnimation from "../space/interfaces/ISceneSwitchAnimation";
import { BaseSceneView } from "./BaseSceneView";
import LayerMgr from '../../../core/layer/LayerMgr';
import { EmLayer } from "../../../core/ui/ViewInterface";
import {SceneEvent} from "../../constant/event/NotificationEvent";
import Logger from "../../../core/logger/Logger";

export class SceneSwitchAninmation extends Laya.Sprite implements ISceneSwitchAnimation {

	private _callBack: Function;
	private _curScene: BaseSceneView;
	private _nextScene: BaseSceneView;

	private _runTween: boolean;

	private _count: number = 0;
	/** 是否正在切换动画中 */

	constructor($callBack: Function) {
		super();
		this._callBack = $callBack;
		this.mouseEnabled = true;
		this.mouseThrough = false;
	}

	/**
	 * 下个场景
	 */
	public nextScene($scene: BaseSceneView) {
		this._nextScene = $scene;
	}

	/**
	 * 当前场景
	 */
	public curScene(value: BaseSceneView) {
		this._curScene = value;
	}

	public start() {
		//避免重复创建
		Logger.log('SceneSwitchAninmation.start 创建场景切换动画');
		this.graphics.drawRect(0, 0, 30000, 30000, "#000000");
		this.alpha = 0;
		this._count = 0;
		this._runTween = false;
		let layer = LayerMgr.Instance.getLayerByType(EmLayer.STAGE_TOP_LAYER);
		if(layer){
			layer.pushView(this);
		}
		Laya.timer.loop(1000, this, this.tweenImp);//多余代码(并非多余代码, 为了特殊情况下下面的代码没执行完成而以防万一的)
		Laya.Tween.to(this, {alpha: 0.5}, 500, Laya.Ease.linearNone, Laya.Handler.create(this, this.tweenImp));
	}

	// public enterFrame() {

	// }

	private tweenImp() {
		Laya.Tween.clearAll(this);
		Laya.timer.clear(this, this.tweenImp);
		if (this._runTween) return;
		this._runTween = true;
		this.alpha = 0.5;
		NotificationManager.Instance.on(SceneEvent.SCENE_SWITCH_CALL, this.__sceneSwitchCallHandler, this);
		if (this._callBack != null) this._callBack(); this._callBack = null;
	}

	private __sceneSwitchCallHandler(evt: Event) {
		this.upDateNextRend();
		NotificationManager.Instance.off(SceneEvent.SCENE_SWITCH_CALL, this.__sceneSwitchCallHandler, this);
	}

	public upDateNextRend() {
		Laya.timer.loop(1200, this, this.stop);//多余代码
		Laya.Tween.to(this, { alpha: 0}, 800, Laya.Ease.sineOut, Laya.Handler.create(this, this.stop));
	}

	public stop() {
		this.alpha = 0;
		this.graphics.clear();
		Laya.timer.clearAll(this);
		Laya.Tween.clearAll(this);
		NotificationManager.Instance.off(SceneEvent.SCENE_SWITCH_CALL, this.__sceneSwitchCallHandler, this);
		let layer = LayerMgr.Instance.getLayerByType(EmLayer.STAGE_TOP_LAYER);
		if(layer){
			layer.popView(this);
		}
		this._nextScene = null;
		this._curScene = null;
		this._callBack = null;
		Logger.log('SceneSwitchAninmation.stop 移除场景切换动画完成');
	}
}
