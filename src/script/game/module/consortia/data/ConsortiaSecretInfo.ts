import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import {SimpleDictionary} from "../../../../core/utils/SimpleDictionary";
import {PlayerManager} from "../../../manager/PlayerManager";
import {ConsortiaEvent, NotificationEvent} from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";

/**
 * 公会秘境数据
 * @author yuanzhan.yu
 */
export class ConsortiaSecretInfo extends GameEventDispatcher
{
    public static GIVE_POWER_STATE:number = 1;  //可充能状态
    public static Call_STATE:number = 2;  //可召唤状态
    public static NO_OPER_STATE:number = 3;  //不可操作状态
    public static TREE_STATE:string = "TREE_STATE";
    public static CALL_TIME:string = "CALL_TIME";
    public static REMAIN_MONSTER_TIME:string = "REMAIN_MONSTER_TIME";

    public consortiaId:number = 0;  //所属公会ID
    public membersNum:number = 0;  //秘境人数
    public rate:number = 0;  //倍率
    public treeGrade:number = 0;
    public treeGp:number = 0;
    public givePowerCount:number = 0;  //当前充能次数
    public oper:number = 0;  //操作（1充能, 2召唤）

    public canCallMonster:boolean;  //是否能召唤盗宝者
    public callEndDate:Date;  //召唤截止时间
    public warlordsFinalRank:number = 0;  //众神之战决赛获得名次
    public hasMonsterNow:boolean = false;  //当前有无盗宝者
    public curBatch:number = 0;  //当前盗宝者批次
    private _remainMonsterTime:number = 0;  //盗宝者刷新剩余时间（秒）
    private _remainMonsterTimeChange:boolean;

    private _treeState:number = 0;  //神树状态
    private _callTime:Date;  //召唤时间
    private _changeObj:SimpleDictionary;
    public isReturnedPlayer:boolean = false;

    constructor()
    {
        super();
        this._changeObj = new SimpleDictionary();
    }

    public get remainMonsterTime():number
    {
        return this._remainMonsterTime;
    }

    public set remainMonsterTime(value:number)
    {
        if(this._remainMonsterTime == value)
        {
            return;
        }
        this._remainMonsterTime = value;
        this._remainMonsterTimeChange = true;
    }

    public get remainMonsterTimeChange():boolean
    {
        return this._remainMonsterTimeChange;
    }

    public set remainMonsterTimeChange(value:boolean)
    {
        this._remainMonsterTimeChange = value;
    }

    public get treeState():number
    {
        return this._treeState;
    }

    public set treeState(value:number)
    {
        if(this._treeState == value)
        {
            return;
        }
        this._treeState = value;
        this._changeObj[ConsortiaSecretInfo.TREE_STATE] = true;
    }

    public set pickTime(value:Date)
    {
        if(this._callTime == value)
        {
            return;
        }
        this._callTime = value;
        this._changeObj[ConsortiaSecretInfo.CALL_TIME] = true;
    }

    /**
     * 剩余可获得收益的时间（秒）
     */
    public get remainGainTime():number
    {
        if(!this._callTime)
        {
            return 0;
        }
        let time:number = 900 - (PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond - this._callTime.getTime() / 1000);
        return time > 0 ? time : 0;
    }

    public clear()
    {
        this.consortiaId = 0;
        this.membersNum = 0;
        this.rate = 0;
        this.treeGrade = 1;
        this.treeGp = 0;
        this.givePowerCount = 0;
        this.oper = ConsortiaSecretInfo.NO_OPER_STATE;
        this.treeState = ConsortiaSecretInfo.NO_OPER_STATE;
        this._callTime = null;
        this.canCallMonster = false;
        this.callEndDate = null;
        this.warlordsFinalRank = 0;
        this.hasMonsterNow = false;
        this.curBatch = 0;
        this.remainMonsterTime = 0;
    }

    public beginChanges()
    {
        this._changeObj.clear();
    }

    public commitChanges()
    {
        if(this._changeObj[ConsortiaSecretInfo.TREE_STATE])
        {
            this.dispatchEvent(ConsortiaEvent.TREE_STATE_UPDATE);
        }
        if(this._changeObj[ConsortiaSecretInfo.CALL_TIME])
        {
            this.dispatchEvent(ConsortiaEvent.PICK_TIME_UPDATE);
        }
        this.dispatchEvent(ConsortiaEvent.SECRET_UPDATE);
        NotificationManager.Instance.dispatchEvent(NotificationEvent.UPDATE_SCREET_TREE);
    }

}