import {Disposeable} from "../../component/DisplayObject";
import {OuterCityManager} from "../../manager/OuterCityManager";
import {StageReferance} from "../../roadComponent/pickgliss/toplevel/StageReferance";
import {OuterCityMap} from "./OuterCityMap";
import {t_s_mapData} from "../../config/t_s_map";
import Sprite = Laya.Sprite;
import {EmWindow} from "../../constant/UIDefine";

/**
 * @description    外城地图边界
 * @author yuanzhan.yu
 * @date 2021/11/17 18:05
 * @ver 1.0
 */
export class OuterCityBorderLayer extends Sprite implements Disposeable
{
    private _horizontalBorder:fgui.GImage;//横向
    private _verticalBorder:fgui.GImage;//纵向
    constructor()
    {
        super();
        this.init();
    }

    private init():void
    {
        this._verticalBorder = fgui.UIPackage.createObject(EmWindow.OuterCity, "BorderMaskVAsset").asImage;
        this._horizontalBorder = fgui.UIPackage.createObject(EmWindow.OuterCity, "BorderMaskHAsset").asImage;

        StageReferance.addEventListener(Laya.Event.RESIZE, this.__stageResizeHandler, this);
        this.__stageResizeHandler(null);
    }

    private __stageResizeHandler(evt:Event):void
    {
        this._horizontalBorder.width = StageReferance.stageWidth * 3;
        this._verticalBorder.height = StageReferance.stageHeight * 3;
        this.update(1);
    }

    public update(off:number = 0):void
    {
        let mapView:OuterCityMap = OuterCityManager.Instance.mapView;
        let mapTemp:t_s_mapData = OuterCityManager.Instance.model.mapTempInfo;
        if(mapView.x > -150)
        {
            this._verticalBorder.x = this._verticalBorder.width + off;
            this._verticalBorder.y = -mapView.y - StageReferance.stageHeight;
            this._verticalBorder.scaleX = -1;
            this.addChild(this._verticalBorder.displayObject);
        }
        else if(mapView.x < StageReferance.stageWidth + 150 - mapTemp.Width)
        {
            this._verticalBorder.x = mapTemp.Width - this._verticalBorder.width + off;
            this._verticalBorder.y = -mapView.y - StageReferance.stageHeight;
            this._verticalBorder.scaleX = 1;
            this.addChild(this._verticalBorder.displayObject);
        }
        else
        {
            if(this._verticalBorder.parent)
            {
                this._verticalBorder.parent.removeChild(this._verticalBorder);
            }
        }

        if(mapView.y > -150)
        {
            this._horizontalBorder.y = this._horizontalBorder.height + off;
            this._horizontalBorder.x = -mapView.x - StageReferance.stageWidth;
            this._horizontalBorder.scaleY = -1;
            this.addChild(this._horizontalBorder.displayObject);
        }
        else if(mapView.y < StageReferance.stageWidth + 150 - mapTemp.Height)
        {
            this._horizontalBorder.y = mapTemp.Height - this._horizontalBorder.height + off;
            this._horizontalBorder.x = -mapView.x - StageReferance.stageWidth;
            this._horizontalBorder.scaleY = 1;
            this.addChild(this._horizontalBorder.displayObject);
        }
        else
        {
            this._horizontalBorder.x = -8000000;
            if(this._horizontalBorder.parent)
            {
                this._horizontalBorder.parent.removeChild(this._horizontalBorder);
            }
        }
    }

    public dispose():void
    {
        StageReferance.removeEventListener(Laya.Event.RESIZE, this.__stageResizeHandler, this);
        if(this._horizontalBorder)
        {
            this._horizontalBorder.dispose();
            if(this._horizontalBorder.parent)
            {
                this._horizontalBorder.parent.removeChild(this._horizontalBorder);
            }
        }
        this._horizontalBorder = null;
        if(this._verticalBorder)
        {
            this._verticalBorder.dispose();
            if(this._verticalBorder.parent)
            {
                this._verticalBorder.parent.removeChild(this._verticalBorder);
            }
        }
        this._verticalBorder = null;
        this.removeSelf();
    }
}