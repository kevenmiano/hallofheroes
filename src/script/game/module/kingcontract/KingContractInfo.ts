// @ts-nocheck
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import {TimerEvent, TimerTicker} from "../../utils/TimerTicker";
import {PlayerManager} from "../../manager/PlayerManager";
import {t_s_kingcontractData} from "../../config/t_s_kingcontract";

/**
 * 精灵盟约buff信息
 *
 */
export class KingContractInfo extends GameEventDispatcher
{
    public templateId:number;
    public template:t_s_kingcontractData;
    private _endData:Date;
    /**
     * 持续时间
     */
    private _leftTime:number = -1;
    private _time:TimerTicker;

    constructor()
    {
        super();
    }

    private __timerHandler(e:TimerEvent)
    {
        --this._leftTime;
        this.dispatchEvent(Laya.Event.CHANGE);
        if(this._leftTime == 0)
        {
            this.dispatchEvent(Laya.Event.COMPLETE);
            if(this._time)
            {
                this._time.stop();
            }
        }
    }

    public set leftTime(value:number)
    {
        this._leftTime = value;
        if(this._leftTime > 0)
        {
            if(!this._time)
            {
                this._time = new TimerTicker(1000);
            }
            this._time.addEventListener(TimerEvent.TIMER, this.__timerHandler, this);
            this._time.start();
        }
        else if(this._time)
        {
            this._time.stop();
        }
    }

    public get leftTime():number
    {
        return this._leftTime;
    }

    public get endData():Date
    {
        return this._endData;
    }

    /** buffer的结束日期 , 如果没有过期启动倒计时*/
    public set endData(value:Date)
    {
        this._endData = value;
        if(this.endData == null || (this.endData && this.endData.getTime() < this.currentTime.getTime()))
        {
            this.leftTime = -1;
            return;
        }
        this.leftTime = (this.endData.getTime() - this.currentTime.getTime()) / 1000;
    }

    private get currentTime():Date
    {
        return PlayerManager.Instance.currentPlayerModel.sysCurtime;
    }
}