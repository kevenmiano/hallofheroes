// @ts-nocheck
import {InheritIActionType} from "../../constant/BattleDefine";
import {SceneEvent} from "../../constant/event/NotificationEvent";
import {IAction} from "../../interfaces/IAction";
import {NotificationManager} from "../../manager/NotificationManager";

/**
 * @author yuanzhan.yu
 */
export class MapBaseAction implements IAction
{
    public level:number = 0;
    protected _finished:boolean = false;
    protected _paused:boolean;
    protected _mapId:number = 0;
    protected _count:number = 0;

    constructor()
    {
    }

    public set mapId(value:number)
    {
        this._mapId = value;
    }

    public synchronization()
    {
    }

    public get finished():boolean
    {
        return this._finished;
    }

    public set finished(value:boolean)
    {
        this._finished = value;
    }

    public replace(action:IAction):boolean
    {
        return false;
    }

    public prepare()
    {
        NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, true);
        // SceneManager.Instance.lockScene = true;
    }

    public ready($liftTime:number = 0):boolean
    {
        return true;
    }

    public filter(action:IAction):boolean
    {
        return false;
    }

    public update()
    {
    }

    public cancel()
    {
    }

    public get priority():number
    {
        return 0;
    }

    public dispose()
    {
        NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
        // SceneManager.Instance.lockScene = false;
    }

    public getCode():number
    {
        return 0x00;
    }

    protected actionOver()
    {
        this._finished = true;
    }

    public get type():string
    {
        return "";
    }

    public pause()
    {
        this._paused = true;
    }

    public resume()
    {
        this._paused = false;
    }

    inheritType:InheritIActionType;
}