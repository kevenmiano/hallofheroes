// @ts-nocheck
import GameEventDispatcher from "../../../../../core/event/GameEventDispatcher";
import {GvgEvent} from "../../../../constant/event/NotificationEvent";
import {PlayerManager} from "../../../../manager/PlayerManager";
import {DateFormatter} from "../../../../../core/utils/DateFormatter";

/**
 *公会战buff的信息
 * @author yuanzhan.yu
 */
export class GvgWarBufferInfo extends GameEventDispatcher
{
    public templateId:number = 0;
    public consortiaId:number = 0;
    public bufferNameLang:string;// buffer名称
    private _curreCount:number = 0;// 当前剩余数量
    public maxCdTimer:number = 0;// CD所需时间
    public objectData:number = 0;// 一个值
    public needPay:number = 0;// 所需支付(财富)
    public DescriptionLang:string = "";
    /** CD开始时间 */
    public startDateStr:string;
    public startTime:number = 0;

    constructor()
    {
        super();
    }

    public get curreCount():number
    {
        return this._curreCount;
    }

    public set curreCount(value:number)
    {
        let pre:number = this._curreCount;
        if(this._curreCount != value)
        {
            this._curreCount = value;
            if(pre != 0)
            {
                this.dispatchEvent(GvgEvent.UPDATE_CURRENT_COUNT, value);
            }
        }

    }

    /**
     * 获得CD剩余时间（s）
     * @return
     *
     */
    public get lefTime():number
    {
        let time:number = 0;
        let serverDate:number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
        if(this.startDateStr != "")
        {
            let startDate:Date = DateFormatter.parse(this.startDateStr, "YYYY-MM-DD hh:mm:ss");
            if(startDate.getTime() > 0)
            {
                time = Math.floor((serverDate - startDate.getTime() / 1000));
            }
            if(time > this.maxCdTimer)
            {
                time = 0;
            }
            else if(time < 0)
            {
                time = this.maxCdTimer;
            }
            else if(time > 0)
            {
                time = this.maxCdTimer - time;
            }
        }
        return time;
    }
}