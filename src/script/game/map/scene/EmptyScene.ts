import Logger from '../../../core/logger/Logger';
import { SceneEvent } from '../../constant/event/NotificationEvent';
import { IBaseSceneView } from '../../interfaces/IBaseSceneView';
import { NotificationManager } from '../../manager/NotificationManager';
import { BaseSceneView } from "./BaseSceneView";
import { SceneManager } from "./SceneManager";
import SceneType from "./SceneType";

/**
 * 强制切换到当前场景时, 过渡的场景
 */
export class EmptyScene extends BaseSceneView implements IBaseSceneView {
	private _bitmap: Laya.Sprite;

	constructor() {
		super();
	}

	public preLoadingStart(data: Object = null): Promise<any> {
		return super.preLoadingStart(data);
	}

	public enter(preScene: BaseSceneView, data: Object = null): Promise<void> {
		return new Promise(resolve => {
			// var isShow: boolean = (LoadingSceneView.Instance.parent ? true : false);
			// LoadingSceneView.Instance.hide()
			var w: number = Laya.stage.width;
			var h: number = Laya.stage.height;
			this._bitmap = new Laya.Sprite();
			this._bitmap.graphics.drawRect(0, 0, w, h, 0x00000000);
			this.addChild(this._bitmap);
			Logger.log('SceneManager.EmptyScene.enter')
			resolve();
		});
	}

	public enterOver(): Promise<void> {
		return new Promise(resolve => {
			Logger.log('SceneManager.EmptyScene.enterOver')
			this._bitmap && this._bitmap.removeSelf();
			this._bitmap && this._bitmap.destroy();
			resolve();
		});
	}

	public leaving(): Promise<void> {
		return new Promise(resolve => {
			// FullBar.Instance.hide();
			// MainToolBar.Instance.hide();
			// MainToolBar.Instance.mouseChildren = true;
			// TipsBar.Instance.hide();
			// ChatBar.Instance.hide();
			// ResourcesBar.Instance.hide();
			// if (this._bitmap) {
			// 	if (this._bitmap.bitmapData) this._bitmap.bitmapData.dispose();
			// 	if (this._bitmap.parent) this._bitmap.parent.removeChild(this._bitmap);
			// }
			// this._bitmap = null;
			// if (parent) parent.removeChild(this);
			Logger.log('SceneManager.EmptyScene.leaving')

			NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE,false);

			// SceneManager.Instance.lockScene = false;
			resolve();
		});
	}

	public get SceneName(): string {
		return SceneType.EMPTY_SCENE;
	}
}