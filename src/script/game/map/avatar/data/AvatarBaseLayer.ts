// @ts-nocheck
import Logger from "../../../../core/logger/Logger";
import ResMgr from "../../../../core/res/ResMgr";
import {AvatarActions} from "../../../avatar/data/AvatarActions";
import {AvatarLayouData} from "./AvatarLayouData";
import {ResourceLoaderInfo} from "./ResourceLoaderInfo";

/**
 * 对应每件avatar <br/>
 * 提供当前avatar某个状态的bitmapdata
 *
 */
export class AvatarBaseLayer
{
    public resourceInfo:ResourceLoaderInfo;
    public curBaseNum:number = 0;
    public visible:boolean = true;
    public offsetX:number = 0;
    public offsetY:number = 0;
    public flight:number = 0;

    public layouPara:AvatarLayouData;
    public loadOver:boolean;

    public parent:Laya.Sprite;
    public sizeType:number = 0;
    private _texture:Laya.Texture;

    private _avaterType:number = -1;
    public get avaterType():number
    {
        return this._avaterType;
    }

    public set avaterType(value:number)
    {
        this._avaterType = value;

        // 测试
        // this._bitmap.removeChildren(0)
        // let img: Laya.Sprite = new Laya.Sprite();
        // switch (value) {
        //     case HeroAvatar.STAND:
        //         img.loadImage("res/game/common/blank2.png");
        //         break;
        //     case HeroAvatar.WALK:
        //         img.loadImage("res/game/common/blank3.png");
        //         break;
        //     default:
        //         break;
        // }
        // img.scale(0.5, 0.5) 
        // this._bitmap.addChild(img)
    }

    public get tempBitmapData():Laya.Texture
    {
        return this._texture;
    }

    public set tempBitmapData(value:Laya.Texture)
    {
        this._texture = value;
    }

    constructor(parent?:Laya.Sprite, actionType?:number)
    {
    }

    // draw(){
    //     this._bitmap.graphics.clear();
    // }

    // getCacheName(actionName:string, frameY:number){
    //     if (!this.resourceInfo) return;
    //     return this.resourceInfo.preUrl + this.resourceInfo.packageName + actionName + frameY.toString()
    // }

    /**
     * 取得站立时对应位置的帧图片
     * @param fx
     * @param fy
     *
     */
    public getStandCellByFrame(fx:number, fy:number):Laya.Texture
    {
        if(!this.resourceInfo)
        {
            return;
        }
        // Logger.warn("getStandCellByFrame",this.resourceInfo, ResMgr.Instance.getRes(this.resourceInfo.url))
        let pngName:string = AvatarActions.ACTION_STOP + "_" + fx + "_" + fy + ".png";
        let texture = ResMgr.Instance.getRes(this.resourceInfo.preUrl + pngName)
        if(texture)
        {
            this.tempBitmapData = texture
        }
        else
        {
            // Logger.warn("[AvatarBaseLayer]getStandCellByFrame texture is null, url=", this.resourceInfo.preUrl + pngName, "fx=", fx, "fy=", fy)
        }
    }

    /**
     * 取得行走时对应位置的帧图片
     * @param fx
     * @param fy
     *
     */
    public getWalksCellByFrame(fx:number, fy:number):Laya.Texture
    {
        if(!this.resourceInfo)
        {
            return;
        }

        // eg: asset.wizard_body023_1.W_0_2
        let pngName:string = AvatarActions.ACTION_WALK + "_" + fx + "_" + fy + ".png";
        let texture = ResMgr.Instance.getRes(this.resourceInfo.preUrl + pngName)
        if(texture)
        {
            this.tempBitmapData = texture
        }
        else
        {
            // Logger.warn("[AvatarBaseLayer]getWalksCellByFrame texture is null, url=", this.resourceInfo.preUrl + pngName, "fx=", fx, "fy=", fy)
        }
    }

    public dispose()
    {
        this.resourceInfo = null;
        this.layouPara = null;
        this.tempBitmapData = null;
    }
}