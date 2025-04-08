import {OuterCityEvent} from "../../constant/event/NotificationEvent";
import IMediator from "../../interfaces/IMediator";
import Sprite = Laya.Sprite;
import {CursorManagerII} from "../../manager/CursorManagerII";

/**
 * @description    外城鼠标手型逻辑
 * @author yuanzhan.yu
 * @date 2021/11/23 17:22
 * @ver 1.0
 */
export class OuterCityMapCursorMediator implements IMediator
{
    constructor()
    {
    }

    public register(target:Sprite):void
    {
        target.on(OuterCityEvent.DRAG_SCENE_END, this, this.__dragEndHandler);
        target.on(OuterCityEvent.DRAG_SCENE_START, this, this.__dragStartHandler);
    }

    public unregister(target:Sprite):void
    {
        target.off(OuterCityEvent.DRAG_SCENE_END, this, this.__dragEndHandler);
        target.off(OuterCityEvent.DRAG_SCENE_START, this, this.__dragStartHandler);
    }

    private __dragEndHandler():void
    {
        if(CursorManagerII.Instance.currentState == CursorManagerII.DRAG_CURSOR)
        {
            CursorManagerII.Instance.resetCursor();
        }
    }

    private __dragStartHandler():void
    {
        CursorManagerII.Instance.showCursorByType(CursorManagerII.DRAG_CURSOR);
    }

}