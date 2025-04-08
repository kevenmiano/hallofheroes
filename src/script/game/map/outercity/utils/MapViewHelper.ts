// @ts-nocheck
import {DisplayObject} from "../../../component/DisplayObject";
import {OuterCityManager} from "../../../manager/OuterCityManager";
import {StageReferance} from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import {OuterCityMap} from "../OuterCityMap";
import {t_s_mapData} from "../../../config/t_s_map";
import Point = Laya.Point;
import Rectangle = Laya.Rectangle;

export class MapViewHelper
{
    constructor()
    {
    }

    public static mapMoveCheck(p:Point):Point
    {
        let mapview:OuterCityMap = OuterCityManager.Instance.mapView;
        if(p.x > MapViewHelper.startX)
        {
            p.x = MapViewHelper.startX;
        }
        else if(p.x < (StageReferance.stageWidth - MapViewHelper.getMapTemplate.Width))
        {
            p.x = (StageReferance.stageWidth - MapViewHelper.getMapTemplate.Width);
        }

        if(p.y > MapViewHelper.startY)
        {
            p.y = MapViewHelper.startY;
        }
        else if(p.y < (StageReferance.stageHeight - MapViewHelper.getMapTemplate.Height))
        {
            p.y = (StageReferance.stageHeight - MapViewHelper.getMapTemplate.Height);
        }
        return p;
    }

    public static targetSolveCenter(p:Point):Point
    {
        let center:Point = new Point();
        center.x = Number(StageReferance.stageWidth / 2 - p.x);
        center.y = Number(StageReferance.stageHeight / 2 - p.y);
        center = MapViewHelper.mapMoveCheck(center);
        return center;
    }

    public static checkDistance(sx:number, sy:number, ex:number, ey:number):number
    {
        let dis:number = (sx - ex) * (sx - ex) + (sy - ey) * (sy - ey);
        return Math.sqrt(dis);
    }

    public static checkTargetPoint(p:Point):Point
    {
        let mapview:OuterCityMap = OuterCityManager.Instance.mapView;
        if(p.x + StageReferance.stageWidth > MapViewHelper.getMapTemplate.Width)
        {
            p.x = MapViewHelper.getMapTemplate.Width - StageReferance.stageWidth;
        }
        if(p.y + StageReferance.stageHeight > MapViewHelper.getMapTemplate.Height)
        {
            p.y = MapViewHelper.getMapTemplate.Height - StageReferance.stageHeight;
        }
        if(-p.x > MapViewHelper.startX)
        {
            p.x = MapViewHelper.startX;
        }
        else
        {
            p.x = -p.x;
        }
        if(-p.y > MapViewHelper.startY)
        {
            p.y = MapViewHelper.startY;
        }
        else
        {
            p.y = -p.y;
        }
        return p;
    }

    public static getCurrentMapRect(mapView:DisplayObject):Rectangle
    {
        let rect:Rectangle = new Rectangle();
        rect.x = -mapView.x + StageReferance.stageWidth / 2;
        rect.y = -mapView.y + StageReferance.stageHeight / 2;
        rect.width = StageReferance.stageWidth;
        rect.height = StageReferance.stageHeight;

        // this._model.mapTempInfo.Width
        return rect;
    }

    // 上面的有问题, 先用下个这个获取正确的
    public static getCurrentMapRectFix(mapView:Laya.Sprite) : Laya.Rectangle
    {
        var rect :Laya.Rectangle = new Laya.Rectangle();
        rect.x = -mapView.x;
        rect.y = -mapView.y;
        rect.width = StageReferance.stageWidth;
        rect.height = StageReferance.stageHeight;
        return rect;
    }

    public static get getMapTemplate():t_s_mapData
    {
        return OuterCityManager.Instance.model.mapTempInfo;
    }

    private static startY:number = 0;
    private static startX:number = -30;
}