// @ts-nocheck
import Logger from "../../../core/logger/Logger";
import { DisplayObject } from "../../component/DisplayObject";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { ArmyManager } from "../../manager/ArmyManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import OutercityVehicleArmyView from "../../map/campaign/view/physics/OutercityVehicleArmyView";
import { WildLand } from "../../map/data/WildLand";
import { OuterCityMap } from "../../map/outercity/OuterCityMap";
import { OuterCityModel } from "../../map/outercity/OuterCityModel";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceModel } from "../../map/space/SpaceModel";
import { BaseArmy } from "../../map/space/data/BaseArmy";
import { MouseData } from "../../map/space/data/MouseData";
import { SpaceSceneMapView } from "../../map/space/view/SpaceSceneMapView";
import HomeWnd from "../../module/home/HomeWnd";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";

/**
 *  
 * 外城镜头跟随
 * 
 */
export class OuterCityMapCameraMediator extends Laya.Sprite implements IMediator, IEnterFrame {
	public static isLockCamera: boolean = false;
	private _count: number = 0;
	private _xLimen: number = 10;
	private _yLimen: number = 10;
	private _tweenValue: number = 0.2;
	private _mapWidth: number = 0;
	private _mapHeight: number = 0;
	private _target: DisplayObject;
	constructor() {
		super();
		this.setMapSize();
		MouseData.Instance.curState = MouseData.NORMAL;
	}

	private setMapSize() {
		let w: number = (this.outercityModel ? this.outercityModel.mapTempInfo.Width : 30000);
		let h: number = (this.outercityModel ? this.outercityModel.mapTempInfo.Height : 30000);
		this._mapWidth = this._xLimen + w;
		this._mapHeight = this._yLimen + h;
	}

	protected get mapWidth(): number {
		return this._mapWidth;
	}
	protected get mapHeight(): number {
		return this._mapHeight;
	}

	enterFrame() {
		if(this.outercityModel && this.outercityModel.isWalkIng && !OuterCityMapCameraMediator.isLockCamera){
			let army =  ArmyManager.Instance.army
			if (!army) return;
			if (!army.armyView) {
				return;
			}
			let armyPosX = army.armyView.x;
			let armyPosY = army.armyView.y;
			let stageWidth: number = StageReferance.stageWidth;
			let stageHeight: number = StageReferance.stageHeight;
			let targetPosX: number = armyPosX - (stageWidth >> 1);
			let targetPosY: number = armyPosY - (stageHeight >> 1);
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

			targetPosX = Math.abs(targetPosX - curPosX) < this._xLimen ? curPosX : targetPosX;
			targetPosY = Math.abs(targetPosY - curPosY) < this._yLimen ? curPosY : targetPosY;
			let offX: number = targetPosX - curPosX;
			let offY: number = targetPosY - curPosY;
			if (Math.abs(offX) < this._xLimen && Math.abs(offY) < this._yLimen) return;

			let _loc_4: number = 10;
			let _loc_6: number = curPosX;
			let _loc_7: number = curPosY;

			let mapW: number = this.outercityModel.mapTempInfo.Width;
			let mapH: number = this.outercityModel.mapTempInfo.Width;

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
			(<OuterCityMap>this._target).setPosition(pos.x, pos.y);
		}else{
			if(!OuterCityMapCameraMediator.isLockCamera && this.outercityModel){
				let army =  ArmyManager.Instance.army;
				if (!army) return;
				if (army.onVehicle) {
					let selfVehicle: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
					if (selfVehicle) {
						let point: Laya.Point = new Laya.Point(selfVehicle.x - StageReferance.stageWidth / 2, selfVehicle.y - StageReferance.stageHeight / 2);
						OuterCityManager.Instance.mapView.motionTo(point);
						return;
					}
				} 
			}
		}
	}

	private get outercityModel(): OuterCityModel {
		return OuterCityManager.Instance.model;
	}

	public register(target: any) {
		this._target = <DisplayObject>target;
		EnterFrameManager.Instance.registeEnterFrame(this);
	}

	public unregister(target: any) {
		EnterFrameManager.Instance.unRegisteEnterFrame(this);
	}

	static lockMapCamera() {
		OuterCityMapCameraMediator.isLockCamera = true;
		MouseData.Instance.curState = MouseData.LOCK;
		HomeWnd.Instance.showUnlockMapCameraBtn(true);
	}

	static unlockMapCamera() {
		OuterCityMapCameraMediator.isLockCamera = false;
		MouseData.Instance.curState = MouseData.NORMAL;
		HomeWnd.Instance.showUnlockMapCameraBtn(false);
	}

	static motion() {
		let id = ArmyManager.Instance.army.id;
		let army: BaseArmy = OuterCityManager.Instance.model.allArmyDict[id];
		if (army && army.armyView) {
			let x = army.armyView.x;
			let y = army.armyView.y;
			let point: Laya.Point = new Laya.Point(x - StageReferance.stageWidth / 2, y - StageReferance.stageHeight / 2);
			OuterCityManager.Instance.mapView.motionTo(point);
		} else if (ArmyManager.Instance.army.onVehicle) {
			let selfVehicle: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle()
			let x = selfVehicle && selfVehicle.x;
			let y = selfVehicle && selfVehicle.y;
			let point: Laya.Point = new Laya.Point(x - StageReferance.stageWidth / 2, y - StageReferance.stageHeight / 2);
			OuterCityManager.Instance.mapView.motionTo(point);
		}
	}
}