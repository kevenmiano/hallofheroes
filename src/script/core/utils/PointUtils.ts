// @ts-nocheck
import LangManager from '../lang/LangManager';

	export class PointUtils
	{
		public static clonePoint(p : Laya.Point) : Laya.Point
		{
			return new Laya.Point(p.x,p.y);
		}
		public static scaleTransform(p:Laya.Point,scaleX:number,scaleY:number) : Laya.Point
		{
			return new Laya.Point(parseInt((p.x/scaleX).toString()),parseInt((p.y/scaleY).toString()));
		}
		public static scaleTransformII(p:Laya.Point,scaleX:number,scaleY:number) : Laya.Point
		{
			return new Laya.Point(parseInt((p.x*scaleX).toString()),parseInt((p.y*scaleY).toString()));
		}
		public static strToPoint(value:string,delim:string) : Laya.Point
		{
			var arr :any[] = value.split(delim);
			var p : Laya.Point 
			if(arr.length == 2)
			{
				p = new Laya.Point(arr[0],arr[1]);
			}
			else
			{
				var errorTip:string = LangManager.Instance.GetTranslation("map.internals.utils.PointUtils.errorTip") ;
				throw new Error(errorTip + " :  " + value);
			}
			arr = [];
			return p;
		}
		public static XYToString($x:number,$y:number,delim:string) : string
		{
			return ($x + delim + $y);
		}
	}