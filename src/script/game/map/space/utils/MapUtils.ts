// @ts-nocheck
/**
 * 地图操作帮助类
 */
import {StageReferance} from "../../../roadComponent/pickgliss/toplevel/StageReferance";

export class MapUtils
{
    /**
     * 得到当前屏幕交集的地图块
     * @param rect
     * @return
     *
     */
    public static getNineSliceScaling(rect:Laya.Rectangle):string[]
    {
        let arr:string[] = MapUtils.getCurrentMinScreen(rect);
        return arr;// getFileNameList(rect.x,rect.y,rect.width,rect.height,1000,1000);
    }

    /**
     * 得到当前屏幕交集的地图块
     * @param rect
     * @return
     *
     */
    public static getCurrentMinScreen(rect:Laya.Rectangle):string[]
    {
        let unitWidth:number = 1000;
        let unitHeight:number = 1000;
        let arr:string[] = [];

        let tempX:number = 0;
        let tempY:number = 0;
        let p:Laya.Point = new Laya.Point(rect.x - StageReferance.stageWidth / 2 - 100, rect.y - StageReferance.stageWidth / 2 - 100);
        arr.push(MapUtils.getFileName(p.x, p.y, unitWidth, unitHeight));//中间
        arr.push(MapUtils.getFileName(p.x, p.y + 1000, unitWidth, unitHeight));//中间
        tempX = (1000 - rect.x % 1000) + 1000;
        arr.push(MapUtils.getFileName(p.x + 1000, p.y, unitWidth, unitHeight));//中间
        arr.push(MapUtils.getFileName(p.x + 1000, p.y + 1000, unitWidth, unitHeight));//中间
        if(tempX < Laya.stage.width)
        {
            arr.push(MapUtils.getFileName(p.x + 2000, p.y, unitWidth, unitHeight));//中间
            arr.push(MapUtils.getFileName(p.x + 2000, p.y + 1000, unitWidth, unitHeight));//中间
        }
        tempY = 1000 - p.y % 1000;
        if(tempY < 150)
        {
            arr.push(MapUtils.getFileName(p.x, p.y + 2000, unitWidth, unitHeight));//中间
            arr.push(MapUtils.getFileName(p.x + 1000, p.y + 2000, unitWidth, unitHeight));//中间
        }
        return arr;
    }

    /**
     * 取得指定区域文件列表
     * @param centerX
     * @param centerY
     * @param totalWidth
     * @param totalHeight
     * @param unitWidth
     * @param unitHeight
     * @return
     *
     */
    public static getFileNameList(centerX:number, centerY:number, totalWidth:number, totalHeight:number, unitWidth:number, unitHeight:number):any[]
    {
        let arr:any[] = [];
        for(let i:number = (centerX - 1500); i < (centerX + 1500 + unitWidth); i)
        {
            if(i < 0)
            {
                i += unitWidth;
                continue;
            }
            for(let j:number = (centerY - 1500); j < (centerY + 1500 + unitHeight); j)
            {
                if(j < 0)
                {
                    j += unitHeight;
                    continue;
                }
                arr.push(MapUtils.getFileName(i, j, unitWidth, unitHeight));
                j += unitHeight;
            }
            i += unitWidth;
        }
        arr = arr.reverse();
        return arr;
    }

    /**
     * 地图中的点所属的地图块
     * @param startX 地图中的点
     * @param startY
     * @param unitWidth 1000
     * @param unitHeight 1000
     * @return
     *
     */
    public static getFileName(startX:number, startY:number, unitWidth:number = 1000, unitHeight:number = 1000):string
    {
        let nx:number = Math.floor(startX / unitWidth);
        let ny:number = Math.floor(startY / unitHeight);
        return nx + "," + ny;
    }

    /**
     * 转换为tile中的x,y
     * @param tileWidth 20
     * @param tileHeight 20
     * @param px 舞台像素
     * @param py 舞台像素
     * @return
     *
     */
    public static getTiles(tileWidth:number, tileHeight:number, px:number, py:number):Laya.Point
    {
        let cx:number, cy:number;
        cx = Math.floor(px / tileWidth);
        cy = Math.floor(py / tileHeight);
        return new Laya.Point(cx, cy);
    }

    /**
     * 将字符串按“,”拆分 取其前两个组成point
     * @param id
     * @return
     *
     */
    public static getStartPoint(id:string):Laya.Point
    {
        let arr:any[] = id.split(",");
        let vx:number = parseInt((arr[0] * 1000).toString());
        let vy:number = parseInt((arr[1] * 1000).toString());
        let point:Laya.Point = new Laya.Point(vx, vy);

        arr = null;
        return point;
    }

    /**
     *  按区域取数据
     *  格式为0_0,1_0,x_x
     *
     */
    public static getFilesIds(arr:any[]):string
    {
        let str:string = "";
        let reg:RegExp = /,/;
        for(let i:number = 0; i < arr.length; i++)
        {
            str += arr[i].replace(reg, "_") + ",";
        }
        return str.substring(0, str.length - 1);
    }

    /**
     * 将字符串拆分成点
     * @param value 例: 20_30
     * @param delim "_"
     * @return Point(20,30)
     *
     */
    public static strToPoint(value:string, delim:string):Laya.Point
    {
        let arr:any[] = value.split(delim);
        let p:Laya.Point;
        if(arr.length == 2)
        {
            p = new Laya.Point(arr[0], arr[1]);
        }
        else
        {
            throw new Error("string转换Point错误 :  " + value);
        }
        arr = null;
        return p;
    }

    /**
     * 按“,”拆分成点
     * @param castleName "20,40"
     * @return
     *
     */
    public static castleToPoint(castleName:string):Laya.Point
    {
        let arr:any[] = castleName.split(",");
        let p:Laya.Point
        if(arr.length == 2)
        {
            p = new Laya.Point(arr[0], arr[1]);
        }
        else
        {
            throw new Error("string转换Point错误 :  " + castleName);
        }
        arr = null;
        return p;
    }

    /**
     * 把tag替换为空
     * @param tag
     * @param arr 字符窜数组
     * @return
     *
     */
    public static getArrayValueByTag(tag:string, arr:any[]):string
    {
        let tagIndex:number = 0;
        let reg:RegExp = new RegExp(tag);
        for(let str of arr)
        {
            tagIndex = str.indexOf(tag);
            if(tagIndex != -1)
            {
                return str.replace(reg, "");
            }
        }
        return "";
    }
}