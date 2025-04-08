// @ts-nocheck
import Dictionary from "../../../../core/utils/Dictionary";
import {OuterCityEvent} from "../../../constant/event/NotificationEvent";
import {MapUtils} from "../utils/MapUtils";
import {MapInfo} from "./MapInfo";
import MapDataUtils from "../../../mapEngine/utils/MapDataUtils";

/**
 *  由几块组成的地图
 */
export class FloorMapInfo extends MapInfo
{
    private _nineSliceScaling:string[] = [];//当前9宫格
    private _preNineSliceScaling:string[] = [];//上一个9宫格
    public _currentOuterCityConfig:Dictionary;
    private _noteUserFiles:Dictionary = new Dictionary();

    constructor()
    {
        super();
        this._currentOuterCityConfig = new Dictionary();
    }

    public set nineSliceScaling(arr:string[])
    {
        this._preNineSliceScaling = this._nineSliceScaling;
        this._nineSliceScaling = arr;
        this.dispatchEvent(OuterCityEvent.NINE_SLICE_SCALING, arr);
    }

    public get nineSliceScaling():string[]
    {
        return this._nineSliceScaling;
    }

    /**
     * 强行更新时, 删掉上一屏的部分记录
     * @param str
     *
     */
    public upPreNineSliceScaling(str:string)
    {
        let i:number = this._nineSliceScaling.indexOf(str);
        if(i != -1)
        {
            this._nineSliceScaling.splice(i);
        }

    }

    //取得当前9宫格中变动的格子
    public checkUpdateConfig():any[]
    {
        let arr:any[] = [];
        let len:number = this._nineSliceScaling.length;
        for(let i:number = 0; i < len; i++)
        {
            let exits:boolean = false;
            let len2:number = this._preNineSliceScaling.length;
            for(let j:number = 0; j < len2; j++)
            {
                if(this._nineSliceScaling[i] == this._preNineSliceScaling[j])
                {
                    exits = true;
                }
            }
            if(!exits)
            {
                arr.push(this._nineSliceScaling[i]);
            }
        }
        return arr;
    }

    //过滤已存在的配置
    public checkConfigNoExites():any[]
    {
        let arr:any[] = this.checkUpdateConfig();
        for(let i:number = arr.length - 1; i >= 0; i--)
        {
            if(this._currentOuterCityConfig[arr[i] + "_f"] && this._currentOuterCityConfig[arr[i] + "_b"])
            {
                this.addOuterCityConfig(arr[i], this._currentOuterCityConfig[arr[i] + "_f"], this._currentOuterCityConfig[arr[i] + "_b"]);
                arr.splice(i, 1);
            }
        }
        return arr;
    }


    public addOuterCityConfig(id:string, floor:any[], build:any[])
    {
        this._noteUserFiles[id] = true;
        if(this._currentOuterCityConfig[id + "_f"])
        {
            this.dispatchEvent(OuterCityEvent.CURRENT_CONFIG_CHANGE, {floor:floor, build:build, id:id});
        }
        else
        {
            this._currentOuterCityConfig[id + "_f"] = floor;
            this._currentOuterCityConfig[id + "_b"] = build;
            this.dispatchEvent(OuterCityEvent.CURRENT_CONFIG_CHANGE, {floor:floor, build:build, id:id});
        }
    }

    public reUserFile(id:string)
    {
        this._noteUserFiles[id] = false;
    }

    public set currentFloorData(arr:any[])
    {
        if(arr.length == 0)
        {
            return;
        }
        //通知删去多的元素
        this.dispatchEvent(OuterCityEvent.COMMIT_LOADING, null);

        let tempDic:Dictionary = new Dictionary();
        let len:number = this._nineSliceScaling.length;
        for(let i:number = 0; i < len; i++)
        {
            let title = this._nineSliceScaling[i];
            if(this._currentSceneFloorData[title])
            {
                tempDic[title] = this._currentSceneFloorData[title];
            }
            else
            {
                let data:Object = this.sloveRectData(title);
                if(data["floor"])
                {
                    let start:Laya.Point = MapUtils.getStartPoint(title);
                    data["start"] = start;
                    data["id"] = title;
                    tempDic[title] = data;
                }
            }
        }
		this._currentSceneFloorData = tempDic;

		for(let key in this._currentSceneFloorData)
		{
			let floor :any[] = this._currentSceneFloorData[key] as any[];
			let movie :any[] = this.moviesData ? this.moviesData[key] as any[] : [];
			let tops  :any[] = this.topsData ? this.topsData[key] as any[] : [];
			let start2 : Laya.Point = MapDataUtils.getStartPoint(key);
			this.dispatchEvent(OuterCityEvent.CURRENT_CONFIG_CHANGE,{floor:floor,movies:movie,tops:tops,id:key,start:start2});
		}
    }


    protected sloveRectData(id:string):Object
    {
        let start:Laya.Point = MapUtils.getStartPoint(id);
        let key:string
        if(this.getARectOrBRect(start))
        {
            key = (start.x % 5000) / 1000 + "," + (start.y % 5000) / 1000;
        }
        else
        {
            key = (start.x % 5000) / 1000 + "," + parseInt(((start.y % 5000) / 1000 + 5).toString());
        }
        let data:Object = {};
        data["floor"] = this.floorData[key];
        if(this.topsData)
        {
            data["tops"] = this.topsData[key];
        }
        if(this.moviesData)
        {
            data["movies"] = this.moviesData[key];
        }
        return data;
    }

    private getARectOrBRect(p:Laya.Point):boolean
    {
        let vx:number = Math.floor(p.x / 5000) % 2;
        let vy:number = Math.floor(p.y / 5000) % 2;
        if(vx == 0)
        {//双
            if(vy == 0)
            {
                return true;//a
            }
        }
        else
        {
            if(vy != 0)
            {
                return true;//a
            }
        }
        return false;//b;
    }

	public mapAddToStage(): void
	{
		this.dispatchEvent(OuterCityEvent.MAP_MOVE,[]);
	}

	public mapMove(offX:number,offY:number)　: void
	{
		this.dispatchEvent(OuterCityEvent.MAP_MOVE,[]);
	}

	public dispose()
    {
        super.dispose();
        this._nineSliceScaling = null;
        this._preNineSliceScaling = null;
        this._noteUserFiles = null;
        this._currentOuterCityConfig = null;
    }
}
