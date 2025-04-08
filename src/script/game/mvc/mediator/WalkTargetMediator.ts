// @ts-nocheck
import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignMapView } from "../../map/campaign/view/CampaignMapView";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { CampaignMapModel } from "../model/CampaignMapModel";
import {EmPackName} from "../../constant/UIDefine";

	/**
	 *  
	 * 控制地图上行走目标点
	 * 
	 */	
	export class WalkTargetMediator implements IMediator
	{
		private _walkTarget  : fgui.GMovieClip;
		private _curLayer    : number = 0;
		private static fogUpLayer : number = 1;
		private static npcDownLayer : number = 2;
		constructor()
		{
			this._walkTarget = fgui.UIPackage.createObject(EmPackName.Base, "asset.map.WalkTargetEffectAsset").asMovieClip;
			this._walkTarget.setPivot(0.5, 0.75, true);
			this._walkTarget.touchable = false;
		}
		
		public register(target:Object)
		{
			if(this.mapModel){
				this.mapModel.addEventListener(CampaignMapEvent.LOCAL_UPDATE_FOG,   		this.__updateFogDataHandler,this);
				this.mapModel.addEventListener(CampaignMapEvent.SYN_FOG_DATA,   			this.__updateFogDataHandler,this);
				this.mapModel.addEventListener(CampaignMapEvent.UPDATE_WALK_TARGET, 		this.__updateWalkTargetHandler,this);
			}
		}
		
		public unregister(target:Object)
		{
			if(this.mapModel){
				this.mapModel.removeEventListener(CampaignMapEvent.LOCAL_UPDATE_FOG,  	  	this.__updateFogDataHandler,this);
				this.mapModel.removeEventListener(CampaignMapEvent.SYN_FOG_DATA,   			this.__updateFogDataHandler,this);
				this.mapModel.removeEventListener(CampaignMapEvent.UPDATE_WALK_TARGET,		this.__updateWalkTargetHandler,this);
			}
			if(this._walkTarget)
			{
				this._walkTarget.playing = false;
				this._walkTarget.displayObject.removeSelf();
				this._walkTarget.dispose();
			}
			this._walkTarget = null;
        }
        
		private __updateFogDataHandler(data : any)
		{
			if(WorldBossHelper.checkFogMap(this.mapModel.mapId))return;
			var obj : any = data;
			this.setWalkTargetDepth(new Laya.Point(obj.x,obj.y));
        }
        
		private __updateWalkTargetHandler(data : Laya.Point)
		{
			var end :Laya.Point = data;
			if(end)
			{
				this._walkTarget.x = end.x;
				this._walkTarget.y = end.y;
				this._walkTarget.playing = true
				this._walkTarget.visible = true;
				this.setWalkTargetDepth(end);
			}
			else
			{
				this._walkTarget.visible = false;
				this._walkTarget.playing = false;
				if(this._walkTarget.parent)this._walkTarget.parent.removeChild(this._walkTarget);
			}
			
		}
		private setWalkTargetDepth(end:Laya.Point) 
		{
			var b : boolean;
            if(WorldBossHelper.fogNoExits(this.mapModel.mapId))
            {
				b = false;
			}
			else
			{
				b = this.mapView.fogLayer ?　this.mapView.fogLayer.checkFogEmpty(end.x,end.y)　: false;
			}
			b ? this.mapView.addChild(this._walkTarget.displayObject) : this.mapView.mainBuidingLayer.centerLayer.addChild(this._walkTarget.displayObject);
		}
		private get mapView() : CampaignMapView
		{
			return CampaignManager.Instance.mapView;
		}
		private get mapModel() : CampaignMapModel
		{
			return CampaignManager.Instance.mapModel;
		}
	}