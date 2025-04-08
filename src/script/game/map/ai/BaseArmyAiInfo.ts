import { ArmyEvent } from "../../constant/event/NotificationEvent";
import MapDataUtils from "../../mapEngine/utils/MapDataUtils";
import AIBaseInfo from "./AIBaseInfo";

	export class BaseArmyAiInfo extends AIBaseInfo
	{
		private _road         : Map<any,Laya.Sprite>;//Image
		private _castleIndex : number = 0;
		private _castlesPath  :any[];
		
		public sysInfo(aInfo : AIBaseInfo) 
		{
			super.sysInfo(aInfo);
			this.road      = aInfo["road"];
			this._castleIndex = aInfo["castleIndex"];
			this.setCastlesPath(aInfo["castlesPath"]);
		}
		
		public get castleIndex():number
		{
			return this._castleIndex;
		}
		
		public set castleIndex(value:number)
		{
			this._castleIndex = value;
		}
		
		public get castlesPath():any[]
		{
			return this._castlesPath;
		}
		
		public setCastlesPath(value:any[],up:boolean=false)
		{
			this._castleIndex = 0;
			var arr :any[] 
			if(value) arr =  MapDataUtils.updateSeparatorByArray(value);
			this._castlesPath = arr;
			this.dispatchEvent(ArmyEvent.UPDATE_CASTLE,up);
		}
		
		public get road():Map<any,Laya.Sprite>
		{
			return this._road;
		}
		
		public set road(value:Map<any,Laya.Sprite>)
		{
			if(this._road)this.clearRoad(this._road);
			this._road = value;
        }
        
		private clearRoad(dic : Map<any,Laya.Sprite>) 
		{
            dic.forEach(element=>{
				element.destroy();
				element = null;
            });
        }
    }