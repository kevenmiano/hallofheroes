// @ts-nocheck
import {OuterCityEvent} from "../../../../constant/event/NotificationEvent";
import {PlayerManager} from "../../../../manager/PlayerManager";
import {FloorMapInfo} from "../../../space/data/FloorMapInfo";
import {MapInfo} from "../../../space/data/MapInfo";
import ISelectMovie from "../../../space/interfaces/ISelectMovie";
import {MapPhysicsBase} from "../../../space/view/physics/MapPhysicsBase";
import {MapPhysicsFilter} from "../../filter/MapPhysicsFilter";
import {MapBaseLayer} from "./MapBaseLayer";

export class SimpleMapLayer extends MapBaseLayer
{
    protected _model:FloorMapInfo;
    private _fileter:MapPhysicsFilter = new MapPhysicsFilter();
    private _is:boolean;
    private _canAttack:any[] = [];
    private _noAttack:any[] = [];

    constructor()
    {
        super();
        this.scrollRect = null;
    }

    public set mapData(data:MapInfo)
    {
        this._model = data as FloorMapInfo;
        this._model.addEventListener(OuterCityEvent.COMMIT_LOADING, this.__commitLoadHandler, this);
    }

    protected __commitLoadHandler(evt:OuterCityEvent)
    {
        this.removeOtherItems();
    }

    protected get nineSliceScaling():any[]
    {
        return this._model.nineSliceScaling;
    }

    protected deleteRectCall(key:string)
    {
        this._model.reUserFile(key);
    }

    public mouseClickHandler(evt:Laya.Event):boolean
    {
        let mc:any = evt.target;
        if(mc)
        {
            return mc.mouseClickHandler(evt);
        }
        return false;
    }

    public mouseOverHandler(evt:Laya.Event):boolean
    {
        let mc:any = evt.target;
        if(mc)
        {
            return mc.mouseOverHandler(evt);
        }
        return false;
    }

    public mouseOutHandler(evt:Laya.Event):boolean
    {
        let mc:any = evt.target;
        if(mc)
        {
            return mc.mouseOutHandler(evt);
        }
        return false;
    }

    public setAllPhysicsFilter()
    {
        if(this._is)
        {
            return;
        }
        this._is = true;
        let timeline1:TimelineMax = new TimelineMax({repeat:-1, yoyo:true, repeatDelay:0.5});
        let timeline2:TimelineMax = new TimelineMax({repeat:-1, yoyo:true, repeatDelay:0.5});
        let timeline3:TimelineMax = new TimelineMax({repeat:-1, yoyo:true, repeatDelay:0.5});
        let timeline4:TimelineMax = new TimelineMax({repeat:-1, yoyo:true, repeatDelay:0.5});
        let canAttack:any[] = [];
        let noAttack:any[] = [];
        let userId:number = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
        this._dict.forEach(element =>
        {
            for(let i = 0; i < element.length; i++)
            {
                let item:any = element[i];
                item.beginSelectMovie();
                if(item['isPlaying'])
                {
                    if(item instanceof MapPhysicsBase)
                    {
                        if((<MapPhysicsBase>item).info.info.occupyPlayerId == userId)
                        {
                            noAttack.push(item.selectMovie);
                            this._noAttack.push(item);
                            continue;
                        }
                    }
                    canAttack.push(item.selectMovie);
                    this._canAttack.push(item);
                }
            }
        });
        timeline1.insertMultiple([TweenMax.from(canAttack, 0.5, {colorTransform:{tint:0xff0000, tintAmount:0.4}, glowFilter:{color:0xFF0000, alpha:.9, blurX:17, blurY:17}})]);
        timeline2.insertMultiple([TweenMax.from(canAttack, 0.5, {colorTransform:{tint:0xff0000, tintAmount:0.18}, glowFilter:{color:0xFF0000, alpha:1, blurX:0, blurY:0, delay:.5}})]);
        timeline3.insertMultiple([TweenMax.from(noAttack, 0.5, {colorTransform:{tint:0xFFFF00, tintAmount:0.4}, glowFilter:{color:0xFF0000, alpha:.9, blurX:17, blurY:17}})]);
        timeline4.insertMultiple([TweenMax.from(noAttack, 0.5, {colorTransform:{tint:0xFFFF00, tintAmount:0.15}, glowFilter:{color:0xFF0000, alpha:1, blurX:0, blurY:0, delay:.5}})]);
    }

    public clearAllPhysicsFilter()
    {
        this._is = false;
        TweenMax.killChildTweensOf(this, false);
        let item:ISelectMovie;
        while(this._canAttack.length > 0)
        {
            item = this._canAttack.pop();
            item.resetSelectMovie();
        }
        while(this._noAttack.length > 0)
        {
            item = this._noAttack.pop();
            item.resetSelectMovie();
        }
    }

    protected removeOtherItems()
    {
        throw new Error("override removeOtherItems()");
    }

    public dispose()
    {
        if(this._model)
        {
            this._model.removeEventListener(OuterCityEvent.COMMIT_LOADING, this.__commitLoadHandler, this);
        }
        this.removeAllChild();
        this._dict = null;
        this._model = null;
        if(this.parent)
        {
            this.parent.removeChild(this);
        }
    }
}