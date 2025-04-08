import { DisplayObject } from "../../component/DisplayObject";
import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { MouseData } from "../../map/space/data/MouseData";
import SpaceArmy from "../../map/space/data/SpaceArmy";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceModel } from "../../map/space/SpaceModel";
import { CampaignMapCenterCheckHelper } from "../../map/space/utils/CampaignMapCenterCheckHelper";
import { SpaceArmyView } from "../../map/space/view/physics/SpaceArmyView";
import { SpaceSceneMapView } from "../../map/space/view/SpaceSceneMapView";
import HomeWnd from "../../module/home/HomeWnd";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";

export class SpaceMapCameraMediator extends Laya.Sprite implements IMediator, IEnterFrame {
	public static isLockCamera: boolean;
	private _role: any;
	private _target: DisplayObject;
	private _isLocked: boolean;
	private _xLimen: number = 10;
	private _yLimen: number = 10;
	private _yLimenOff: number = 0;
	private _bevelSpeed: number = 0;
	private _tweenValue: number = 0.2;
	private _mapWidth: number = 0;
	private _mapHeight: number = 0;
	private _updatePoint: Laya.Point = new Laya.Point();
	constructor() {
		super();
		this._bevelSpeed = this.bevelSpeed;
		this.setMapSize();
		MouseData.Instance.curState = MouseData.NORMAL
	}

	private setMapSize() {
		let mMode: SpaceModel = SpaceManager.Instance.model;
		let w: number = (mMode ? mMode.mapTempInfo.Width : 100000);
		let h: number = (mMode ? mMode.mapTempInfo.Height : 100000);
		this._mapWidth = this._xLimen + this._bevelSpeed + w;
		this._mapHeight = this._yLimen + this._bevelSpeed + h;
	}

	private get bevelSpeed(): number {
		let data: SpaceArmy = SpaceManager.Instance.model.selfArmy;
		let armyView: Object = SpaceManager.Instance.controller.getArmyView(data);
		if (data && armyView) {
			if (armyView instanceof SpaceArmyView) {
				return armyView.aiInfo.speed;
			}
			else {
				return 7;
			}
		}
		return 7;
	}

	public register(target: any) {
		this._target = <DisplayObject>target;
		EnterFrameManager.Instance.registeEnterFrame(this);
		target.on(Laya.Event.RENDER, this, this.__onScreenRend);
		target.on(CampaignMapEvent.LOOK_AT_ROLE, this, this.__lookAtRoleHandler);
	}

	public unregister(target: any) {
		EnterFrameManager.Instance.unRegisteEnterFrame(this);
		target.off(Laya.Event.RENDER, this, this.__onScreenRend);
		target.off(CampaignMapEvent.LOOK_AT_ROLE, this, this.__lookAtRoleHandler);
	}

	private __onScreenRend() {
		if (this._updatePoint.x != 10000) {
			this._updatePoint = CampaignMapCenterCheckHelper.checkOutScene(this._updatePoint);
			if (this._target.x != this._updatePoint.x || this._target.y != this._updatePoint.y) {
				this._updatePoint.x = 10000;
				this._target.event(CampaignMapEvent.MOVE_SCENET_END, this._target);
			}
		}
	}

	public locked() {
		this._isLocked = true;
	}

	public unLocked() {
		this._isLocked = false;
	}

	private __lookAtRoleHandler(data: SpaceArmy) {
		this.setMapSize();
		this._role = data;
		let stageWidth: number = StageReferance.stageWidth;
		let stageHeight: number = StageReferance.stageHeight;
		let targetPosX: number = this._role.x - stageWidth / 2;
		let targetPosY: number = this._role.y - stageHeight / 2 - this._yLimenOff;
		let curPosX: number = this._target.x;
		let curPosY: number = this._target.y;
		if (targetPosX + stageWidth > this.mapWidth) targetPosX = this.mapWidth - stageWidth;
		if (targetPosY + stageHeight > this.mapHeight) targetPosY = this.mapHeight - stageHeight;
		targetPosX = - targetPosX; targetPosY = - targetPosY;
		if (targetPosX > 0) targetPosX = 0;
		if (targetPosY > 0) targetPosY = 0;
		targetPosX = Math.abs(targetPosX - curPosX) < this._xLimen + this._bevelSpeed ? curPosX : targetPosX;
		targetPosY = Math.abs(targetPosY - curPosY) < this._yLimen + this._bevelSpeed ? curPosY : targetPosY;
		this._updatePoint.x = targetPosX;
		this._updatePoint.y = targetPosY;
		(<SpaceSceneMapView>this._target).setPosition(this._updatePoint.x, this._updatePoint.y);
	}

	public enterFrame() {
		if (MouseData.Instance.curState == MouseData.NORMAL) this.moveXY();
	}

	private moveXY(para: boolean = false) {
		if (!this._role) return;
		let stageWidth: number = StageReferance.stageWidth;
		let stageHeight: number = StageReferance.stageHeight;
		let targetPosX: number = this._role.x - (stageWidth >> 1);
		let targetPosY: number = this._role.y - (stageHeight >> 1) - this._yLimenOff;
		let curPosX: number = this._target.x;
		let curPosY: number = this._target.y;

		if (targetPosX + stageWidth > this.mapWidth) targetPosX = this.mapWidth - stageWidth;
		if (targetPosY + stageHeight > this.mapHeight) targetPosY = this.mapHeight - stageHeight;
		let _loc_5: Laya.Point = new Laya.Point(targetPosX, targetPosY);
		if (_loc_5.x < 0) _loc_5.x = 0;
		if (_loc_5.y < 0) _loc_5.y = 0;

		targetPosX = - targetPosX; targetPosY = - targetPosY;
		if (targetPosX > 0) targetPosX = 0;
		if (targetPosY > 0) targetPosY = 0;

		targetPosX = Math.abs(targetPosX - curPosX) < this._xLimen + this._bevelSpeed ? curPosX : targetPosX;
		targetPosY = Math.abs(targetPosY - curPosY) < this._yLimen + this._bevelSpeed ? curPosY : targetPosY;
		let offX: number = targetPosX - curPosX;
		let offY: number = targetPosY - curPosY;
		if (Math.abs(offX) < this._xLimen && Math.abs(offY) < this._yLimen) return;

		let _loc_4: number = 10;
		let _loc_6: number = curPosX;
		let _loc_7: number = curPosY;

		let mMode: SpaceModel = SpaceManager.Instance.model;
		let mapW: number = mMode.mapTempInfo.Width;
		let mapH: number = mMode.mapTempInfo.Height;

		//保证地图不会太过
		let pos: Laya.Point = new Laya.Point(this._target.x, this._target.y);
		if ((_loc_6 + _loc_5.x) > _loc_4) {
			if (stageWidth - this._target.x >= mapW) {
				pos.x = stageWidth - mapW;
			} else {
				_loc_6 = (_loc_6 - (((_loc_6 + _loc_5.x) - _loc_4) * this._tweenValue));
				pos.x = ((_loc_6 + 0.5) >> 0);
			}
		} else {
			if (this._target.x >= -10) {
				pos.x = -10;
			}
			else if ((_loc_6 + _loc_5.x) < -(_loc_4)) {
				_loc_6 = (_loc_6 - (((_loc_6 + _loc_5.x) + _loc_4) * this._tweenValue));
				pos.x = ((_loc_6 + 0.5) >> 0);
			}
		};

		if ((_loc_7 + _loc_5.y) > _loc_4) {
			if (stageHeight - this._target.y >= mapH) {
				pos.y = stageHeight - mapH;
			}
			else {
				_loc_7 = (_loc_7 - (((_loc_7 + _loc_5.y) - _loc_4) * this._tweenValue));
				pos.y = ((_loc_7 + 0.5) >> 0);
			}
		} else {
			if (pos.y >= -10) {
				pos.y = -10
			}
			else if ((_loc_7 + _loc_5.y) < -(_loc_4)) {
				_loc_7 = (_loc_7 - (((_loc_7 + _loc_5.y) + _loc_4) * this._tweenValue));
				pos.y = ((_loc_7 + 0.5) >> 0);
			};
		};
		(<SpaceSceneMapView>this._target).setPosition(pos.x, pos.y);
	}

	protected get mapWidth(): number {
		return this._mapWidth;
	}
	protected get mapHeight(): number {
		return this._mapHeight;
	}

	static lockMapCamera() {
		SpaceMapCameraMediator.isLockCamera = true;
		MouseData.Instance.curState = MouseData.LOCK;
		HomeWnd.Instance.showUnlockMapCameraBtn(true);
    }

	static unlockMapCamera() {
		SpaceMapCameraMediator.isLockCamera = false;
		MouseData.Instance.curState = MouseData.NORMAL;
		HomeWnd.Instance.showUnlockMapCameraBtn(false);
    }
}