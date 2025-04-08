// @ts-nocheck
import {Disposeable} from "../../component/DisplayObject";
import {OuterCityEvent} from "../../constant/event/NotificationEvent";
import {IEnterFrame} from "../../interfaces/IEnterFrame";
import {EnterFrameManager} from "../../manager/EnterFrameManager";
import {OuterCityManager} from "../../manager/OuterCityManager";
import {StageReferance} from "../../roadComponent/pickgliss/toplevel/StageReferance";
import {OuterCityMap} from "./OuterCityMap";
import ResMgr from "../../../core/res/ResMgr";
import Sprite = Laya.Sprite;
import Point = Laya.Point;

/**
 * @description 漂浮的云
 * @author yuanzhan.yu
 * @date 2021/11/18 21:05
 * @ver 1.0
 */
export class OuterCityCloudView extends Sprite implements Disposeable, IEnterFrame
{
    private _cloudBitmapI:Sprite;
    private _cloudBitmapII:Sprite;
    private _cloudPoint:Point = new Point();
    private _cloudPointII:Point = new Point();

    private _clouds:any[];

    constructor()
    {
        super();
        this.initBitmaps();
        this._cloudBitmapI = this._clouds[0];
        this._cloudBitmapII = this._clouds[1];
        this.mouseEnabled = false;
        this.on(Laya.Event.DISPLAY, this, this.__addToStageHanlder);
    }

    private initBitmaps():void
    {
        this._clouds = [];
        for(let i:number = 0; i < 4; i++)
        {
            let bitmap:Sprite = new Laya.Sprite();
            let path:string = "res/game/outercity/asset.outercity.CloundAsset.png";
            ResMgr.Instance.loadRes(path, (res) =>
            {
                if(res)
                {
                    bitmap && bitmap.graphics.clear();
                    bitmap && bitmap.graphics.drawTexture(res);
                }
            });
            bitmap.y = 500;
            bitmap.cacheAs = "bitmap";
            bitmap.mouseEnabled = false;
            this._clouds.push(bitmap)
        }
    }

    private __addToStageHanlder(evt:Event):void
    {
        this.addEvent();
        this.__dragSceneEndHandler(null);
    }

    private addEvent():void
    {
        EnterFrameManager.Instance.registeEnterFrame(this);
        this.mapView.on(OuterCityEvent.DRAG_SCENE_END, this, this.__dragSceneEndHandler);
    }

    private removeEvent():void
    {
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        this.off(Laya.Event.DISPLAY, this, this.__addToStageHanlder);
        this.mapView.off(OuterCityEvent.DRAG_SCENE_END, this, this.__dragSceneEndHandler);
    }

    private curMapPos:Point = new Point();
    private curBitPos:Point = new Point();

    private __dragSceneEndHandler(evt:OuterCityEvent):void
    {
        this.curMapPos.x = StageReferance.stageWidth / 2 - this.mapView.x;
        this.curMapPos.y = StageReferance.stageHeight / 2 - this.mapView.y;
        this.moveBitmap(this._cloudBitmapI, new Point(this._cloudBitmapI.x, this._cloudBitmapI.y));
        this.moveBitmap(this._cloudBitmapII, new Point(this._cloudBitmapII.x, this._cloudBitmapII.y));
    }

    private moveBitmap(bit:Sprite, point:Point):void
    {
        this.curBitPos.x = point.x;
        this.curBitPos.y = point.y;
        if(this.curMapPos.distance(this.curBitPos.x, this.curBitPos.y) > StageReferance.stageWidth + 200)
        {
            if(point.x > -this.mapView.x)
            {
                point.x = -Math.random() * 1500 - this.mapView.x;
            }
            else
            {
                point.x = StageReferance.stageWidth - this.mapView.x + Math.random() * 1500;
            }
            point.y = 100 + Math.random() * StageReferance.stageHeight - this.mapView.y;

            if(bit && bit.parent)
            {
                bit.parent.removeChild(bit);
            }
            let index:number = this._clouds.length * Math.random();
            let temp:Sprite = this._clouds[index];
            while(temp == this._cloudBitmapI || temp == this._cloudBitmapII)
            {
                index = this._clouds.length * Math.random();
                temp = this._clouds[index];
            }
            if(bit == this._cloudBitmapI)
            {
                this._cloudPoint.x = point.x;
                this._cloudPoint.y = point.y;
            }
            else
            {
                this._cloudPointII.x = point.x;
                this._cloudPointII.y = point.y;
            }
        }

    }

    private get mapView():OuterCityMap
    {
        return OuterCityManager.Instance.mapView;
    }

    public enterFrame():void
    {
        this._cloudPoint.x += 1;
        this._cloudPointII.x += 1;
        let w:number = StageReferance.stageWidth + this._cloudBitmapI.width;
        let h:number = StageReferance.stageHeight + this._cloudBitmapI.height;
        let vx:number = this._cloudPoint.x - this.curMapPos.x + StageReferance.stageWidth / 2;
        let vy:number = this._cloudPoint.y - this.curMapPos.y + StageReferance.stageHeight / 2;
        if(vx < -this._cloudBitmapI.width || vx > w || vy < -this._cloudBitmapI.height || vy > h)
        {
            if(this._cloudBitmapI.parent)
            {
                this._cloudBitmapI.parent.removeChild(this._cloudBitmapI);
            }
        }
        else
        {
            this._cloudBitmapI.x = this._cloudPoint.x;
            this._cloudBitmapI.y = this._cloudPoint.y;
            if(!this._cloudBitmapI.parent)
            {
                this.addChild(this._cloudBitmapI);
            }
        }
        vx = this._cloudPointII.x - this.curMapPos.x + StageReferance.stageWidth / 2;
        vy = this._cloudPointII.y - this.curMapPos.y + StageReferance.stageHeight / 2;
        if(vx < -this._cloudBitmapII.width || vx > w || vy < -this._cloudBitmapII.height || vy > h)
        {
            if(this._cloudBitmapII.parent)
            {
                this._cloudBitmapII.parent.removeChild(this._cloudBitmapII);
            }
        }
        else
        {
            this._cloudBitmapII.x = this._cloudPointII.x;
            this._cloudBitmapII.y = this._cloudPointII.y;
            if(!this._cloudBitmapII.parent)
            {
                this.addChild(this._cloudBitmapII);
            }
        }
    }

    public dispose():void
    {
        this.removeEvent();
        if(this._cloudBitmapI)
        {
            this._cloudBitmapI.destroy();
            if(this._cloudBitmapI.parent)
            {
                this._cloudBitmapI.parent.removeChild(this._cloudBitmapI);
            }
        }
        this._cloudBitmapI = null;
        if(this._cloudBitmapII)
        {
            this._cloudBitmapII.destroy();
            if(this._cloudBitmapII.parent)
            {
                this._cloudBitmapII.parent.removeChild(this._cloudBitmapII);
            }
        }
        this._cloudBitmapII = null;
        this.removeSelf();
    }
}