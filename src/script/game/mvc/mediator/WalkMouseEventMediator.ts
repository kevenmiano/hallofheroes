import IMediator from "../../interfaces/IMediator";
import Sprite = Laya.Sprite;
import {OuterCityArmyView} from "../../map/outercity/OuterCityArmyView";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/11/18 21:05
 * @ver 1.0
 */
export class WalkMouseEventMediator implements IMediator
{
    constructor()
    {
    }

    public register(target:Sprite):void
    {
        target.on(Laya.Event.MOUSE_MOVE,this,  this.__mouseMoveHandler);
    }

    public unregister(target:Sprite):void
    {
		target.off(Laya.Event.MOUSE_MOVE,this,  this.__mouseMoveHandler);
    }

    private __mouseMoveHandler(evt:Laya.Event):void
    {
        let aView:OuterCityArmyView = evt.target as OuterCityArmyView;
        if(aView)
        {
            aView.mouseMoveHandler && aView.mouseMoveHandler(evt);
        }
    }
}