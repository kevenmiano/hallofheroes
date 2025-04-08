// @ts-nocheck
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import Logger from "../../core/logger/Logger";
import {ActionsEvent} from "../constant/event/NotificationEvent";
import {IAction} from "../interfaces/IAction";

/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description action队列管理器 , 由外部程序不停调用update方法来更新动作
 */
export class ActionQueueManager extends GameEventDispatcher
{
    /**
     * 当前正在执行的action
     */
    protected _current:IAction;
    /**
     * action列表
     */
    protected _actions:Array<any>;

    public constructor()
    {
        super()
        this._actions = [];
    }

    public update()
    {
        if(!this._current)
        {
            this.shiftAction();
        }

        if(!this._current)
        {
            return;
        }

        if(this._current.finished)
        {
            this._current.dispose();
            this._current = null;
            if(this._actions.length <= 0)
            {
                this.dispatchEvent(ActionsEvent.ACTION_ALL_COMPLETE);
            }
        }
        else
        {
            this._current.update();
            if(this._current && this._current.finished)
            {
                this._current.dispose();
                this._current = null;
                if(this._actions.length <= 0)
                {
                    this.dispatchEvent(ActionsEvent.ACTION_ALL_COMPLETE);
                }
            }
        }
    }

    public getMessage():string
    {
        let mssage:string = "";
        let count:number;
        this._actions.forEach((item) =>
        {
            count++;
            // mssage += (count +" : " + getQualifiedClassName(item) +"\n");
        });

        return mssage;
    }

    /**
     * 取出队列第一个动作
     *
     */
    protected shiftAction()
    {
        if(this._actions.length > 0)
        {
            this._current = this._actions.shift();
            this._current.prepare();
            Logger.yyz("⚡执行动作: ", this._current);
        }
    }

    /**
     * 返回队列总长度
     * @return
     *
     */
    public get size():number
    {
        return this._actions.length;
    }

    /**
     * 返回当前的运行的action
     * @return
     *
     */
    public get current():IAction
    {
        return this._current;
    }

    public addAction(action:IAction, immediately:boolean = false)
    {
        if(this._current)
        {
            if(this._current.filter(action))
            {//正在运行的action是否和添加的action可以相互过滤, 如果可以则不用添加
                action.cancel();
                action.dispose();
                action = null;
                return;
            }
            if(this._current.replace(action))
            {//添加的action是否可以换正在执行的action, 如果可以则停止正在执行的action
                this._current.cancel();
                this._current.dispose();
                this._current = null;
            }
        }
        let temp:IAction;
        for(let i:number = 0; i < this._actions.length; i++)
        {//队列中石佛劝可以过滤或者替换的action存在
            temp = this._actions[i] as IAction;
            if(temp.filter(action))
            {
                action.cancel();
                action.dispose();
                action = null;
                return;
            }
            if(temp.replace(action))
            {
                temp.cancel();
                temp.dispose();
                temp = null;
                this._actions[i] = action;
            }
        }
        if(immediately)
        {
            this._actions.unshift(action);
        }
        else
        {
            this._actions.push(action);
        }
        Logger.yyz("⌛动作队列: ", this._actions);
    }

    /**
     * 取消指定类型的action
     * @param type
     *
     */
    public cancelActionByType(type:string)
    {
        for(let i:number = 0; i < this._actions.length; i++)
        {
            let iaction:IAction = this._actions[i] as IAction;
            if(iaction.type == type)
            {
                iaction.cancel();
            }
        }
        if(this._current && this._current.type == type)
        {
            this._current.cancel();
        }
    }

    /**
     * 返回所有未执行的action
     * @return
     *
     */
    public getActions():Array<any>
    {
        return this._actions;
    }

    /**
     * 清楚所有未执行action
     *
     */
    public cleanActions()
    {
        this._actions = [];
    }

    public dispose()
    {
        for(let i:number = 0; i < this._actions.length; i++)
        {
            let iaction:IAction = this._actions[i] as IAction;
            iaction.dispose();
            iaction = null;
        }
        this._actions = null;
        this._current = null;
    }
}