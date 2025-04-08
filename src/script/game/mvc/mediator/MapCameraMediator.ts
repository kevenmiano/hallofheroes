import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignMapView } from "../../map/campaign/view/CampaignMapView";
import { CampaignArmyView } from "../../map/campaign/view/physics/CampaignArmyView";
import { MouseData } from "../../map/space/data/MouseData";
import { CampaignMapCenterCheckHelper } from "../../map/space/utils/CampaignMapCenterCheckHelper";
import HomeWnd from "../../module/home/HomeWnd";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { CampaignMapModel } from "../model/CampaignMapModel";


/**
 *  
 * 镜头跟随
 * 
 */
export class MapCameraMediator extends Laya.Sprite implements IMediator, IEnterFrame {
	public static isLockCamera: boolean;
	private _role: any;
	private _target: any;
	private _isLocked: boolean;
	private _updatePoint: Laya.Point = new Laya.Point();
	private _model: CampaignMapModel;

	constructor() {
		super();
		this.setMapSize();
		MouseData.Instance.curState = MouseData.NORMAL;
	}

	private setMapSize() {
		this._model = CampaignManager.Instance.mapModel;
		let w: number = (this._model ? this._model.mapTempInfo.Width : 100000);
		let h: number = (this._model ? this._model.mapTempInfo.Height : 100000);
		this._mapWidth = this._xLimen + this.bevelSpeed + w;
		this._mapHeight = this._yLimen + this.bevelSpeed + h;
	}

	private get bevelSpeed(): number {
		let data: CampaignArmy = this._model.selfMemberData;
		let armyView: Object = CampaignManager.Instance.controller.getArmyView(data);
		if (data && armyView) {
			if (armyView instanceof CampaignArmyView) {
				return armyView.aiInfo.speed;
			} else {
				return 7;
			}
		}
		return 7;
	}

	public register(target: any) {
		this._target = target;
		EnterFrameManager.Instance.registeEnterFrame(this);
		target.on(Laya.Event.RENDER, this.__onScreenRend.bind(this));
		target.on(CampaignMapEvent.LOOK_AT_ROLE, this, this.__lookAtRoleHandler.bind(this));
	}

	public unregister(target: any) {
		EnterFrameManager.Instance.unRegisteEnterFrame(this);
		this._target.off(Laya.Event.RENDER, this.__onScreenRend.bind(this));
		this._target.off(CampaignMapEvent.LOOK_AT_ROLE, this, this.__lookAtRoleHandler.bind(this));
	}
	protected upDateNextRend() {
		if (this._target.stage) this._target.stage.invalidate();
	}
	protected __onScreenRend(evt: Event) {
		if (this._updatePoint.x != 10000) {
			this._updatePoint = CampaignMapCenterCheckHelper.checkOutScene(this._updatePoint, this._target);
			if (this._target.x != this._updatePoint.x || this._target.y != this._updatePoint.y) {
				this._target.x = this._updatePoint.x;
				this._target.y = this._updatePoint.y;
				this._updatePoint.x = 10000;
				this._target.dispatchEvent(CampaignMapEvent.MOVE_SCENET_END, this._target);
			}

		}
	}

	public locked() {
		this._isLocked = true;
	}

	public unLocked() {
		this._isLocked = false;
	}

	private moveTweenEnd() {
		this.unLocked();
		if (this._unLockTime > 0) {
			clearInterval(this._unLockTime);
			this._unLockTime = 0;
		}
		this._target.dispatchEvent(CampaignMapEvent.MOVE_SCENET_END, this._target);
	}

	private __lookAtRoleHandler(data: any) {
		this.setMapSize();

		this._role = data;

		let stageWidth: number = StageReferance.stageWidth;
		let stageHeight: number = StageReferance.stageHeight;
		let targetPosX: number = this._role.x - stageWidth / 2;
		let targetPosY: number = this._role.y - stageHeight / 2 - this._yLimenOff;
		let curPosX: number = this._target.x;
		let curPosY: number = this._target.y;

		if (targetPosX + stageWidth > this.mapWidth * this._target.scaleX) targetPosX = this.mapWidth * this._target.scaleX - stageWidth;
		if (targetPosY + stageHeight > this.mapHeight * this._target.scaleY) targetPosY = this.mapHeight * this._target.scaleY - stageHeight;
		targetPosX = - targetPosX; targetPosY = - targetPosY;
		if (targetPosX > 0) targetPosX = 0;
		if (targetPosY > 0) targetPosY = 0;
		targetPosX = Math.abs(targetPosX - curPosX) < this._xLimen + this.bevelSpeed ? curPosX : targetPosX;
		targetPosY = Math.abs(targetPosY - curPosY) < this._yLimen + this.bevelSpeed ? curPosY : targetPosY;
		this._updatePoint.x = targetPosX;
		this._updatePoint.y = targetPosY;
		this._updatePoint = CampaignMapCenterCheckHelper.checkOutScene(this._updatePoint, this._target);
		(<CampaignMapView>this._target).initPosition(this._updatePoint.x, this._updatePoint.y);
	}

	public enterFrame() {
		if (MouseData.Instance.curState == MouseData.NORMAL) this.moveXY();
	}
	
	private _xLimen: number = 10;
	private _yLimen: number = 10;
	private _yLimenOff: number = 0;
	private _bevelSpeed: number = 0;
	private _tweenValue: number = 0.2;

	public moveXY(para: boolean = false) {
		if (this._isLocked || !this._role) return;
		let stageWidth: number = StageReferance.stageWidth;
		let stageHeight: number = StageReferance.stageHeight;
		let targetPosX: number = this._role.x* this._target.scaleX - (stageWidth >> 1);
		let targetPosY: number = this._role.y* this._target.scaleY - (stageHeight >> 1) - this._yLimenOff;
		let curPosX: number = this._target.x;
		let curPosY: number = this._target.y;

		if (targetPosX + stageWidth > this.mapWidth * this._target.scaleX) targetPosX = this.mapWidth * this._target.scaleX - stageWidth;
		if (targetPosY + stageHeight > this.mapHeight * this._target.scaleY) targetPosY = this.mapHeight * this._target.scaleY - stageHeight;
		let _loc_5: Laya.Point = new Laya.Point(targetPosX, targetPosY);
		if (_loc_5.x < 0) _loc_5.x = 0;
		if (_loc_5.y < 0) _loc_5.y = 0;

		targetPosX = - targetPosX; targetPosY = - targetPosY;
		if (targetPosX > 0) targetPosX = 0;
		if (targetPosY > 0) targetPosY = 0;

		targetPosX = this.getAbs(targetPosX - curPosX) < this._xLimen + this.bevelSpeed ? curPosX : targetPosX;
		targetPosY = this.getAbs(targetPosY - curPosY) < this._yLimen + this.bevelSpeed ? curPosY : targetPosY;
		let offX: number = targetPosX - curPosX;
		let offY: number = targetPosY - curPosY;
		if (this.getAbs(offX) < this._xLimen && this.getAbs(offY) < this._yLimen) return;

		let _loc_4: number = 10;
		let _loc_6: number = curPosX;
		let _loc_7: number = curPosY;

		let mMode: CampaignMapModel = this._model;
		if (!mMode || !mMode.mapTempInfo) return;
		let mapW: number = mMode.mapTempInfo.Width * this._target.scaleX;
		let mapH: number = mMode.mapTempInfo.Height * this._target.scaleY;

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
			if (pos.x >= -10) {
				pos.x = -10;
			} else if ((_loc_6 + _loc_5.x) < -(_loc_4)) {
				_loc_6 = (_loc_6 - (((_loc_6 + _loc_5.x) + _loc_4) * this._tweenValue));
				pos.x = ((_loc_6 + 0.5) >> 0);
			}
		};

		if ((_loc_7 + _loc_5.y) > _loc_4) {
			if (stageHeight - this._target.y >= mapH) {
				pos.y = stageHeight - mapH;
			} else {
				_loc_7 = (_loc_7 - (((_loc_7 + _loc_5.y) - _loc_4) * this._tweenValue));
				pos.y = ((_loc_7 + 0.5) >> 0);
			}
		} else {
			if (pos.y >= -10) {
				pos.y = -10
			} else if ((_loc_7 + _loc_5.y) < -(_loc_4)) {
				_loc_7 = (_loc_7 - (((_loc_7 + _loc_5.y) + _loc_4) * this._tweenValue));
				pos.y = ((_loc_7 + 0.5) >> 0);
			};
		};

		(<CampaignMapView>this._target).setPosition(pos.x, pos.y);

		//			_sp.graphics.clear();
		//			_sp.graphics.beginFill(0xff0000);
		//			_sp.graphics.drawCircle(StageReferance.stageWidth / 2, StageReferance.stageHeight / 2, 5);
		//			_sp.graphics.endFill();
		//			StageReferance.stage.addChild(_sp);
		//			
		//			
		//			if(Math.abs(offX) > _xLimen * 2 || Math.abs(offY) > _yLimen*3)
		//			{
		//				locked();
		//				TweenLite.to(_target,.6,{x:targetPosX,y:targetPosY});
		//				if(_unLockTime > 0)clearInterval(_unLockTime);_unLockTime = 0;
		//				_unLockTime = setInterval(moveTweenEnd.bind(this),600);
		//				return;
		//			}
		//			if(offX != 0 || offY != 0)
		//			{
		//				if(offX != 0)_updatePoint.x = _target.x + (offX > 0 ? offX - _xLimen : offX + _xLimen);
		//				else _updatePoint.x = _target.x;
		//				if(offY != 0)_updatePoint.y = _target.y + (offY > 0 ? offY - _yLimen : offY + _yLimen)
		//				else _updatePoint.y = _target.y;
		//				upDateNextRend();
		//			}
	}

	private getAbs(value: number): number {
		return (value ^ (value >> 31)) - (value >> 31);
	}

	private _unLockTime: number;

	private _mapWidth: number = 0;
	private _mapHeight: number = 0;
	protected get mapWidth(): number {
		return this._mapWidth;
	}
	protected get mapHeight(): number {
		return this._mapHeight;
	}

	static lockMapCamera() {
		MapCameraMediator.isLockCamera = true;
		MouseData.Instance.curState = MouseData.LOCK;
		HomeWnd.Instance.showUnlockMapCameraBtn(true);
    }

	static unlockMapCamera() {
		MapCameraMediator.isLockCamera = false;
		MouseData.Instance.curState = MouseData.NORMAL;
		HomeWnd.Instance.showUnlockMapCameraBtn(false);
    }
}