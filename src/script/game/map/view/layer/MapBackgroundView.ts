// @ts-nocheck
import ComponentSetting from "../../../utils/ComponentSetting";
import {MapElmsLibrary} from "../../libray/MapElmsLibrary";
import {MapInfo} from "../../space/data/MapInfo";

/**
 * @description    地图底
 * @author yuanzhan.yu
 * @date 2021/10/26 16:37
 * @ver 1.0
 */
export class MapBackgroundView extends Laya.Sprite
{
    private _mapWidth:number = 0;
    private _mapHeight:number = 0;
    private _source:Laya.Texture;

    constructor()
    {
        super();
    }

    public set mapHeight(value:number)
    {
        this._mapHeight = value;
    }

    public set mapWidth(value:number)
    {
        this._mapWidth = value;
    }

    public set path(str:string)
    {
        this.drawBackGround(MapElmsLibrary.Instance.getElementByPath(ComponentSetting.RES_ANIMATION + str));
    }

    private drawBackGround(bit:Laya.Texture)
    {
        this._source = bit;
        if(!this.stage)
        {
            return;
        }
        this.draw();
    }

    private draw()
    {
        let w:number = this.stage.width;
        let h:number = this.stage.height;
        if(!this._source)
        {
            return;
        }
        this.graphics && this.graphics.clear();
        if(this._mapWidth > MapInfo.MAX_WIDTH || this._mapHeight > MapInfo.MAX_HEIGHT)
        {
            this.graphics && this.graphics.fillTexture(this._source, -100, -100, w + 300, h + 300, "repeat");
        }
        else
        {
            this.graphics && this.graphics.fillTexture(this._source, 0, 0, this._mapWidth, this._mapHeight, "repeat");
        }
    }

    public resize()
    {
        if(this._source)
        {
            this.draw();
        }
    }

    public dispose()
    {
        this._source = null;
        this.graphics && this.graphics.clear();
    }
}