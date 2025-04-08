import {DisplayObject} from "../../../../component/DisplayObject";

export class MapBaseLayer extends Laya.Sprite
{
    protected _dict:Map<string, Array<DisplayObject>> = new Map();//以区为Key
    constructor()
    {
        super();
    }

    protected get nineSliceScaling():any[]
    {
        throw new Error("override nineSliceScaling()");
        return null;
    }

    private _tempKeys:Array<string> = [];

    protected getOtherItmes():any[]
    {
        let temp:any[] = [];
        let arr:any[] = this.nineSliceScaling;
        this._dict.forEach((element, key) =>
        {
            this._tempKeys.push(key);
        })
        while(this._tempKeys.length > 0)
        {
            let kStr:string = this._tempKeys.pop();
            if(arr.indexOf(kStr) == -1)
            {
                temp = temp.concat(this._dict[kStr] as Array<DisplayObject>);
                this._dict[kStr] = null;
                delete this._dict[kStr];
                this.deleteRectCall(kStr);
            }
        }
        return temp;
    }

    protected removeAllChild()
    {
        while(this.numChildren > 0)
        {
            this.removeChildAt(0);
        }
    }

    protected addDict(mc:DisplayObject)
    {
        let id:string = MapBaseLayer.getFileName(mc.x, mc.y);
        let arr:any[] = this._dict[id] as Array<DisplayObject>;
        if(arr)
        {
            for(let i:number = 0; i < arr.length; i++)
            {
                if(arr[i] == mc)
                {
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        else
        {
            arr = [];
        }
        arr.push(mc);
        this._dict[id] = arr;
    }

    protected removeDict(mc:DisplayObject)
    {
        let id:string = MapBaseLayer.getFileName(mc.x, mc.y);
        let arr:any[] = this._dict[id] as Array<DisplayObject>;
        if(arr)
        {
            for(let i:number = 0; i < arr.length; i++)
            {
                if(arr[i] == mc)
                {
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        this._dict[id] = arr;
    }

    protected removeItemByXY($x:number, $y:number):DisplayObject
    {
        let id:string = MapBaseLayer.getFileName($x, $y);
        let arr:any[] = this._dict[id] as Array<DisplayObject>;
        let mc:DisplayObject;
        if(arr)
        {
            for(let i:number = 0; i < arr.length; i++)
            {
                if(arr[i].x == $x && arr[i].y == $y)
                {
                    mc = arr[i];
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        return mc;
    }

    public getItemByXY($x:number, $y:number):DisplayObject
    {
        let id:string = MapBaseLayer.getFileName($x, $y);
        let arr:any[] = this._dict[id] as Array<DisplayObject>;
        if(arr)
        {
            arr.forEach(element =>
            {
                if(element.x == $x && element.y == $y)
                {
                    return element;
                }
            })
        }
        return null;
    }

    protected deleteRectCall(key:string)
    {
    }

    protected removeOtherItems()
    {
        throw new Error("override removeOtherItems()");
    }

    public dispose()
    {
        this._tempKeys = [];
    }

    public static getFileName(startX:number, startY:number, unitWidth:number = 1000, unitHeight:number = 1000):string
    {
        let nx:number = Math.floor(startX / unitWidth);
        let ny:number = Math.floor(startY / unitHeight);
        return nx + "," + ny;
    }
}