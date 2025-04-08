// @ts-nocheck
import GameEventDispatcher from '../../../core/event/GameEventDispatcher';
import { DateFormatter } from '../../../core/utils/DateFormatter';
import { SimpleDictionary } from '../../../core/utils/SimpleDictionary';
import StringHelper from '../../../core/utils/StringHelper';
import { WarlordsEvent } from '../../constant/event/NotificationEvent';
import WarlordsPlayerInfo from './WarlordsPlayerInfo';
import FrameDataBase from '../../mvc/FrameDataBase';

import TimerInfoMsg = com.road.yishi.proto.timer.TimerInfoMsg;
/**
* @author:pzlricky
* @data: 2021-06-07 14:08
* @description 武斗会模块数据的存储、处理类, 提供数据操作的API
*/
export default class WarlordsModel extends FrameDataBase {

    /**
     *参赛开放等级 
     */
    public static OPEN_GRADE: number = 50;
    /**
     *竞猜开放等级 
     */
    public static BET_OPEN_GRADE: number = 35;
    /**
     *准备阶段 
     */
    public static PROCESS_READY: number = 0;
    /**
     *预赛阶段 
     */
    public static PROCESS_PRELIM: number = 1;
    /**
     *决赛阶段 
     */
    public static PROCESS_FINAL: number = 2;
    /**
     *竞猜阶段 
     */
    public static PROCESS_BET: number = 3;
    /**
     *结束阶段 
     */
    public static PROCESS_OVER: number = 4;
    /**
     *可竞猜列表type 
     */
    public static BETTING: number = 1;
    /**
     *排行榜列表type 
     */
    public static LAST_RANK: number = 2;
    /**
     *获奖列表type 
     */
    public static LAST_AWARD: number = 3;
    /**
     *进入决赛玩家列表type 
     */
    public static ACCESS_FINAL: number = 4;
    /**
     *各职业第一type 
     */
    public static TOP: number = 4;
    /**
     *当前选择竞猜列表type 
     */
    public static CUR_BETTING: number = 5;
    /**
     *本职业前三type 
     */
    public static JOB_TOP3: number = 6;
    /**
     *最小竞猜数量 
     */
    public static MIN_BET_NUM: number = 600;
    /**
     *最大竞猜数量 
     */
    public static MAX_BET_NUM: number = 5000;
    /**
     *竞猜成功获得最大倍数 
     */
    public static MAX_WIN_RATE: number = 20;
    /**
     *竞猜成功获得最小倍数 
     */
    public static MIN_WIN_RATE: number = 1.5;
    /**
     *竞猜失败获得倍数 
     */
    public static FAIL_RATE: number = 1;
    /**
     *战神之殿、勇者之殿分组名次
     */
    public static DIVIDING_RANK: number = 16;
    /**
     *活动届数 
     */
    public period: number = 0;
    /**
     *活动进程 
     */
    public process: number = 0;
    /**
     *当前回合 
     */
    public curRound: number = 0;
    /**
     *总回合数 
     */
    public totalRound: number = 0;
    /**
     *是否进入决赛 
     */
    public isEnterFinal: boolean = false;
    /**
     *当前奖池金额 
     */
    public curAwardTotal: number = 0;
    /**
     *上届大奖获奖金额 
     */
    public lastAwardNum: number = 0;
    /**
     *竞猜获得奖励金额 
     */
    public selfAwardNum: number = 0;
    /**
     *可竞猜列表 
     */
    public canBetList: Array<WarlordsPlayerInfo>;
    /**
     *已竞猜数量 
     */
    public betNum: number = 0;
    /**
     *决赛房间右侧排名列表 
     */
    public finalRankList: Array<WarlordsPlayerInfo> = [];
    /**
     *等待开始的时间（秒） 
     */
    public waitTime: number = 0;
    /**
     *排行榜生成日期 
     */
    public rankListCreateDate: Date = null;
    /**
     *排行榜我的排名 
     */
    public lastSelfRank: number = 0;
    /**
     *排行榜届数 
     */
    public lastPeriod: number = 0;
    /**
     *未收到服务器返回时重复请求（容错处理） 
     */
    public reqAgainTimer: any = 0;
    /**
     *重复请求次数 
     */
    public reqAgainCount: number = 0;

    private _selfInfo: WarlordsPlayerInfo;
    private _rewardState: number;  //奖励领取状态
    private _lastAwardList: Array<WarlordsPlayerInfo> = [];  //上届获奖列表
    private _accessFinalList: Array<WarlordsPlayerInfo> = [];  //进入决赛玩家列表
    private _topDic: SimpleDictionary;  //各职业第一
    private _jobTop3Dic: SimpleDictionary;  //本职业前三
    private _matchDateDic: SimpleDictionary;  //比赛时间列表
    private _bettingDic: SimpleDictionary;  //已竞猜列表
    private _lastRankDic: SimpleDictionary;  //排行榜列表
    private _curBettingDic: SimpleDictionary;  //当前选择竞猜列表

    //1时效坐骑、2物品、3绚丽称号、4战神神像
    public static REWARD_TYPE_ONE: number = 1;
    public static REWARD_TYPE_TWO: number = 2;
    public static REWARD_TYPE_THREE: number = 3;
    public static REWARD_TYPE_FOUR: number = 4;

    constructor() {
        super();
        this._selfInfo = new WarlordsPlayerInfo();
        this._topDic = new SimpleDictionary();
        this._jobTop3Dic = new SimpleDictionary();
        this._matchDateDic = new SimpleDictionary();
        this._bettingDic = new SimpleDictionary();
        this._lastRankDic = new SimpleDictionary();
        this._curBettingDic = new SimpleDictionary();
        this._accessFinalList = [];
    }

    public initTimerInfo(timerInfoMsg: TimerInfoMsg) {
        let matchDate: Date;
        matchDate = DateFormatter.parse(timerInfoMsg.readyOpen, "YYYY-MM-DD hh:mm:ss");
        this._matchDateDic.add(1, matchDate);
        matchDate = DateFormatter.parse(timerInfoMsg.readyStop, "YYYY-MM-DD hh:mm:ss");
        this._matchDateDic.add(2, matchDate);
        matchDate = DateFormatter.parse(timerInfoMsg.finalOpen, "YYYY-MM-DD hh:mm:ss");
        this._matchDateDic.add(3, matchDate);
        matchDate = DateFormatter.parse(timerInfoMsg.finalStop, "YYYY-MM-DD hh:mm:ss");
        this._matchDateDic.add(4, matchDate);
        matchDate = new Date(DateFormatter.parse(timerInfoMsg.finalStop, "YYYY-MM-DD hh:mm:ss").getTime() + 259200000);
        this._matchDateDic.add(5, matchDate);
        this.dateInitComplete();
    }
    /**
     * 获得列表每一页显示数量
     * @ param type  每一页类型
     */
    public static getPerPageNum(type: number): number {
        switch (type) {
            case WarlordsModel.BETTING:
                return 9;
                break;
            case WarlordsModel.LAST_RANK:
                return 8;
                break;
            case WarlordsModel.LAST_AWARD:
                return 9;
                break;
            default:
                return 10;
        }
    }

    /**
     *判断是否在战神之殿分组 
     */
    public static checkIsTempleGroup(rank: number): boolean {
        return (rank > 0 && rank <= WarlordsModel.DIVIDING_RANK);
    }

    /**
     *转换成展示的排名
     */
    public static getDisplayRank(rank: number): number {
        if (rank <= 0) return rank;
        if (rank <= WarlordsModel.DIVIDING_RANK)
            return rank;
        else
            return rank - WarlordsModel.DIVIDING_RANK;
    }

    /**
     *自己的武斗会信息 
     */
    public get selfInfo(): WarlordsPlayerInfo {
        return this._selfInfo;
    }

    /**
     * 是否已竞猜
     */
    public get hasBet(): boolean {
        return (this._bettingDic[1] && this._bettingDic[2] && this._bettingDic[3] && this.betNum > 0);
    }

    /**
     *奖励领取状态 
     */
    public get rewardState(): number {
        return this._rewardState;
    }
    public set rewardState(value: number) {
        if (this._rewardState == value) return;
        this._rewardState = value;
        this.dispatchEvent(WarlordsEvent.REWARD_STATE_CHANGE);
    }

    /**
     *上届获奖列表 
     */
    public get lastAwardList(): Array<WarlordsPlayerInfo> {
        return this._lastAwardList;
    }
    public set lastAwardList(value: Array<WarlordsPlayerInfo>) {
        if (this._lastAwardList == value) return;
        this._lastAwardList = value;
        this.dispatchEvent(WarlordsEvent.LAST_AWARDLIST_UPDATE);
    }

    /**
     *进入决赛玩家列表 
     */
    public get accessFinalList(): Array<WarlordsPlayerInfo> {
        return this._accessFinalList;
    }

    public set accessFinalList(arr: Array<WarlordsPlayerInfo>) {
        this._accessFinalList = arr;
    }

    public getWarlordsPlayerInfoByUserIdAndServerName(userId: number, serverName: string): WarlordsPlayerInfo {
        for (const key in this.accessFinalList) {
            if (Object.prototype.hasOwnProperty.call(this.accessFinalList, key)) {
                let playerInfo: WarlordsPlayerInfo = this.accessFinalList[key];
                if (playerInfo.userId == userId && playerInfo.serverName == serverName) {
                    return playerInfo;
                }
            }
        }
        return null;
    }

    /**
     * 获得比赛时间（Date）
     * @param type  1预赛开始, 2预赛结束, 3决赛开始, 4决赛结束, 5荣耀水晶清零
     */
    public getMatchDate(type: number): Date {
        if (this._matchDateDic.get(type)) {
            return this._matchDateDic.get(type);
        } else {
            return new Date(2000, 1, 1, 0, 0, 0, 0);
        }
    }

    /**
     * 获得比赛时间（String）
     * @param type  1预赛开始, 2预赛结束, 3决赛开始, 4决赛结束
     */
    public getMatchDateString(type: number, format: string = "YYYY-MM-DD hh:mm"): string {
        return DateFormatter.format(this._matchDateDic.get(type), format);
    }

    /**
     *是否存在指定数据 
     * @param type  类型
     */
    public isExistData(type: number, key: number = 0): boolean {
        switch (type) {
            case WarlordsModel.TOP:
                return this._topDic[key];
                break;
            case WarlordsModel.BETTING:
                return (this.canBetList && this.canBetList.length > 0);
                break;
            case WarlordsModel.CUR_BETTING:
                return this._curBettingDic[key];
                break;
            case WarlordsModel.LAST_RANK:
                return this._lastRankDic[key];
                break;
            case WarlordsModel.LAST_AWARD:
                return (this._lastAwardList && this._lastAwardList.length > 0);
                break;
            case WarlordsModel.ACCESS_FINAL:
                return (this._accessFinalList && this._accessFinalList.length > 0);
                break;
        }
        return false;
    }

    /**
     *取得指定列表数据 
     * @param type  类型
     * @param key  对应键值
     */
    public getListData(type: number, key: number): any {
        switch (type) {
            case WarlordsModel.BETTING:
                return this._bettingDic[key];
                break;
            case WarlordsModel.LAST_RANK:
                return this._lastRankDic[key];
                break;
            case WarlordsModel.TOP:
                return this._topDic[key];
                break;
            case WarlordsModel.JOB_TOP3:
                return this._jobTop3Dic[key];
                break;
            case WarlordsModel.CUR_BETTING:
                return this._curBettingDic[key];
                break;
        }
        return null;
    }

    /**
     *添加数据到指定列表 
     * @param type  类型
     * @param key  对应键值
     * @param obj  数据对象
     */
    public addListData(type: number, key: number, obj: Object) {
        switch (type) {
            case WarlordsModel.BETTING:
                if (key > 0) {
                    if (this._bettingDic[key]) {//如果原来存在, 覆盖前要先将其竞猜名次betRank设为0
                        (this._bettingDic[key] as WarlordsPlayerInfo).betRank = 0;
                    }
                    if (obj) {
                        this._bettingDic.del((obj as WarlordsPlayerInfo).betRank);  //如果之前已对其押注, 需先从列表移除
                        (obj as WarlordsPlayerInfo).betRank = key;
                    }
                    this._bettingDic.add(key, obj);
                }
                break;
            case WarlordsModel.LAST_RANK:
                this._lastRankDic.add(key, obj);
                break;
            case WarlordsModel.TOP:
                this._topDic.add(key, obj);
                break;
            case WarlordsModel.JOB_TOP3:
                this._jobTop3Dic.add(key, obj);
                break;
            case WarlordsModel.CUR_BETTING:
                if (key > 0) {
                    if (this._curBettingDic[key]) {//如果原来存在, 覆盖前要先将其竞猜名次betRank设为0
                        (this._curBettingDic[key] as WarlordsPlayerInfo).betRank = 0;
                    }
                    if (obj) {
                        this._curBettingDic.del((obj as WarlordsPlayerInfo).betRank);  //如果之前已对其押注, 需先从列表移除
                        (obj as WarlordsPlayerInfo).betRank = key;
                    }
                    this._curBettingDic.add(key, obj);
                    this.dispatchEvent(WarlordsEvent.CUR_BETTING_CHANGE);
                }
                break;
        }
    }

    /**
     *删除指定列表数据 
     * @param type  类型
     * @param key  对应键值
     */
    public delListData(type: number, key: number) {
        switch (type) {
            case WarlordsModel.BETTING:
                if (this._bettingDic[key]) {//如果原来存在, 移除前要先将其竞猜名次betRank设为0
                    (this._bettingDic[key] as WarlordsPlayerInfo).betRank = 0;
                }
                this._bettingDic.del(key);
                break;
            case WarlordsModel.LAST_RANK:
                this._lastRankDic.del(key);
                break;
            case WarlordsModel.TOP:
                this._topDic.del(key);
                break;
            case WarlordsModel.JOB_TOP3:
                this._jobTop3Dic.del(key);
                break;
            case WarlordsModel.CUR_BETTING:
                if (this._curBettingDic[key]) {//如果原来存在, 移除前要先将其竞猜名次betRank设为0
                    (this._curBettingDic[key] as WarlordsPlayerInfo).betRank = 0;
                }
                this._curBettingDic.del(key);
                this.dispatchEvent(WarlordsEvent.CUR_BETTING_CHANGE);
                break;
        }
    }

    /**
     *根据操作更新已竞猜列表 
     * @param type  0为还原, 1为确定
     */
    public updateBettingByType(type: number) {
        let info: WarlordsPlayerInfo;
        switch (type) {
            case 0:
                for (const key in this._curBettingDic) {
                    if (Object.prototype.hasOwnProperty.call(this._curBettingDic, key)) {
                        let info = this._curBettingDic[key];
                        info.betRank = 0;
                    }
                }
                this._curBettingDic.clear();
                for (let key in this._bettingDic) {
                    if (this._bettingDic.hasOwnProperty(key)) {
                        info = this._bettingDic[Number(key)] as WarlordsPlayerInfo;
                        if (info) info.betRank = Number(key);
                    }
                }
                break;
            case 1:
                for (let key in this._bettingDic) {
                    if (this._bettingDic.hasOwnProperty(key)) {
                        info = this._bettingDic[Number(key)] as WarlordsPlayerInfo;
                        if (info) info.betRank = 0;
                    }
                }
                this._bettingDic.clear();
                for (let k in this._curBettingDic) {//copy, 不能直接将_curBettingDic赋值给_bettingDic, 这样就指向同一个对象了
                    if (this._curBettingDic.hasOwnProperty(k)) {
                        this._bettingDic.add(k, this._curBettingDic[k]);
                    }
                }
                break;
        }
    }

    /**
     * 竞猜结果
     * 返回格式如[0,1,1,0], 第1位表示总体竞猜结果, 其后分别为相应名次的竞猜结果
     */
    public getBetResultList(): Array<number> {
        let list: Array<number> = [];
        let totalResult: number = 1;
        for (let i: number = 1; i <= 3; i++) {
            if (this._bettingDic[i] && this._jobTop3Dic[i] && this._bettingDic[i].userKey == this._jobTop3Dic[i].userKey && !StringHelper.isNullOrEmpty(this._bettingDic[i].userKey)) {
                list[i] = 1;
            }
            else {
                list[i] = 0;
                totalResult = 0;
            }
        }
        list[0] = totalResult;
        return list;
    }

    public topAvatarChange() {
        this.dispatchEvent(WarlordsEvent.TOP_AVATAR_CHANGE);
    }

    public beginChanges() {
    }

    public commitChanges() {
        this.dispatchEvent(WarlordsEvent.INFO_UPDATE);
    }

    public dateInitComplete(){
        this.dispatchEvent(WarlordsEvent.DATE_INIT_COMPLETE);
    }
}