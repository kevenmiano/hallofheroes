// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-24 16:22:29
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-21 15:04:28
 * @Description: 内城城战地图
 */

import MouseMgr from "../../../../core/Input/MouseMgr";
import Resolution from "../../../../core/comps/Resolution";
import ResMgr from "../../../../core/res/ResMgr";
import { EmWindow } from "../../../constant/UIDefine";
import { AnimationManager } from "../../../manager/AnimationManager";
import { CursorManagerII } from "../../../manager/CursorManagerII";
import CastleConfigUtil from "../../../map/castle/utils/CastleConfigUtil";
import { TweenDrag } from "../../../map/castle/utils/TweenDrag";
import CastleAnimalLayer from "../../../map/castle/view/layer/CastleAnimalLayer";
import CastleBackgroundLayer from "../../../map/castle/view/layer/CastleBackgroundLayer";
import CastleBuildingBaseView from "../../../map/castle/view/layer/CastleBuildingBaseView";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { OuterCityWarBuildLayer } from "./OuterCityWarBuildLayer";


export class OuterCityWarMapView extends Laya.Sprite {
	/**
	 * 各种屏幕下把此点显示到中心
	 */
	public static MAP_SHOW_ANCHOR_POINT: Laya.Point = new Laya.Point(0.4, 0.6);
	/**
	 * 背景层 
	 */
	protected _backgroundLayer: CastleBackgroundLayer;
	/**
	 * 动画层 
	 */
	protected _animalLayer: CastleAnimalLayer;
	/**
	 * 建筑层 
	 */
	protected _buildLayer: OuterCityWarBuildLayer;

	private _mouseDown: boolean;

	private _dragObj: TweenDrag;

	constructor() {
		super();
		this.mouseEnabled = true;
		this.mouseThrough = true;
		this.size(CastleConfigUtil.MAP_RAW_WIDTH, CastleConfigUtil.MAP_RAW_HEIGHT);
		this.initBackgroundLayer();
		this.initAnimalLayer();
		this.initWalklayer();
		this.initEvent();
	}

	private initBackgroundLayer() {
		this._backgroundLayer = new CastleBackgroundLayer();
		this._backgroundLayer.mouseEnabled = true;
		this.addChild(this._backgroundLayer);
	}

	private initAnimalLayer() {
		this._animalLayer = new CastleAnimalLayer();
		this.addChild(this._animalLayer);
	}

	private initWalklayer() {
		this._buildLayer = new OuterCityWarBuildLayer();
		this.addChild(this._buildLayer);
	}

	private initEvent() {
		this._dragObj = new TweenDrag(this, FrameCtrlManager.Instance.getCtrl(EmWindow.OuterCityWarWnd).view);
		this._dragObj.onDraging = this.dragingCallBack.bind(this);
		this._dragObj.onDragDrop = this.dropCallBack.bind(this);
		this._dragObj.onTweening = this.dragingCallBack.bind(this);
	}

	private removeEvent() {
		MouseMgr.Instance.remove(this);
	}

	resize() {
		this.dragingCallBack();
		this.dropCallBack();
	}


	private dragStart() {
		Laya.timer.clear(this, this.dragStart);
		if (this._mouseDown) this.dragStartCallBack();
	}

	private dragStartCallBack() {
		TweenMax.killTweensOf(this);
		CursorManagerII.Instance.showCursorByType(CursorManagerII.DRAG_CURSOR);
	}

	public dropCallBack() {
		CursorManagerII.Instance.resetCursor();
		this._mouseDown = null;
	}

	public dragingCallBack() {
		if ((CastleConfigUtil.MAP_RAW_WIDTH * this.scaleX) < Resolution.gameWidth) {
			this.x = 0;
		}
		else if (this.x < Resolution.gameWidth - CastleConfigUtil.MAP_RAW_WIDTH * this.scaleX) {
			this.x = Resolution.gameWidth - CastleConfigUtil.MAP_RAW_WIDTH * this.scaleX;
		}
		else if (this.x > 0) {
			this.x = 0;
		}

		if ((CastleConfigUtil.MAP_RAW_HEIGHT * this.scaleY) < Resolution.gameHeight) {
			this.y = 0;
		}
		else if (this.y < Resolution.gameHeight - CastleConfigUtil.MAP_RAW_HEIGHT * this.scaleY) {
			this.y = Resolution.gameHeight - CastleConfigUtil.MAP_RAW_HEIGHT * this.scaleY;
		}
		else if (this.y > 0) {
			this.y = 0;
		}
	}

	public getRealWidth() {
		return CastleConfigUtil.MAP_RAW_WIDTH * this.scaleX
	}

	public getRealHeight() {
		return CastleConfigUtil.MAP_RAW_HEIGHT * this.scaleY
	}

	public dispose() {
		this.removeEvent();
		TweenMax.killTweensOf(this)
		this._dragObj.dispose(); this._dragObj = null;

		let aniNameMap = CastleBuildingBaseView.aniNameMap;
		let resUrlMap = CastleBuildingBaseView.resUrlMap;
		aniNameMap.forEach((v, name) => {
			AnimationManager.Instance.clearAnimationByName(name);
		})
		resUrlMap.forEach((v, url) => {
			ResMgr.Instance.cancelLoadByUrl(url);
			ResMgr.Instance.releaseRes(url);
		})
		aniNameMap.clear();
		resUrlMap.clear();
	}
}
