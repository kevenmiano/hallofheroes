import { DisplayObject } from "../../component/DisplayObject";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { EnterFrameManager } from "../../manager/EnterFrameManager";

	/**
	 *  
	 * 人物层深
	 * 
	 */	
	export class WalkDepthMediator implements IMediator,IEnterFrame
	{
		private _target :Laya.Sprite;
		constructor()
		{
		}
		
		public register(target:Object)
		{
			this._target = <Laya.Sprite> target;
			EnterFrameManager.Instance.registeEnterFrame(this);
		}
		
		public unregister(target:Object)
		{
			EnterFrameManager.Instance.unRegisteEnterFrame(this);
		}
		private _tempArr :any[] = [];
		private _count : number = 0;
		public enterFrame() 
		{
			this._count ++;
			if(this._count % 20 != 0)return;
			for(var i:number=0;i<this._target.numChildren;i++)
			{
				var dv : any = this._target.getChildAt(i);
				this._tempArr.push({obj:dv,x:dv.x,y:dv.y,index:i});
			}
			this._tempArr = this._tempArr.sort(this.checkDepth);
			for(var j:number=0;j<this._tempArr.length;j++)
			{
				if(this._tempArr[j].index != j)
				{
					if(this._target.numChildren > j)this._target.addChildAt(this._tempArr[j].obj,j);
					else this._target.addChild(this._tempArr[j].obj);
				}
			}
			while(this._tempArr.length > 0)this._tempArr.pop();
        }
        
		private checkDepth(item1: any,item2:any) : number
		{
			if(item1.y > item2.y)
			{
				return 1;
			}
			else if(item1.y == item2.y)
			{
				if(item1.x < item2.x)
				{
					return -1;
				}
				else if(item1.x > item2.x)
				{
					return 1;
				}
				else
				{
					return (item1.index > item2.index ? 1 : -1);
				}
			}
			else
			{
				return -1;
			}
		}
	}