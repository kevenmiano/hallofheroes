// @ts-nocheck
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import WarlordsModel from "./WarlordsModel";

/**
* @author:pzlricky
* @data: 2021-06-07 14:13
* @description 单个玩家的武斗会信息类 
*/
export default class WarlordsPlayerInfo {

    /**
         *排序或排名 
         */
    public sort: number = 0;
    /**
     *玩家标识key 
     */
    public userKey: string = "";
    /**
     *服务器名 
     */
    public serverName: string = "";
    public userId: number = 0;
    public nickname: string = "";
    public grade: number = 0;
    /**
     *战斗力 
     */
    public fightingCapacity: number = 0;
    /**
     * 战斗力排名
     */
    public fightingCapacityRank: number = 0;
    public isVip: boolean = false;
    public job:number = 0;
    /**
     *胜场数 
     */
    public winCount: number = 0;
    /**
     *连续胜场数 
     */
    public serialWinCount: number = 0;
    /**
     *获奖金额 
     */
    public awardGolds: number = 0;
    /**
     *预赛积分 
     */
    public prelimScore: number = 0;
    /**
     *下注名次（0表示未对其下注） 
     */
    public betRank: number = 0;
    /**
     *领主信息 
     */
    public thaneInfo: ThaneInfo;
    public headId:number = 0;
    constructor() {
    }

    /**
     *是否在战神之殿分组 
     */
    public get isTempleGroup(): boolean {
        return (this.fightingCapacityRank > 0 && this.fightingCapacityRank <= WarlordsModel.DIVIDING_RANK);
    }

    /**
     *展示的排名
     */
    public get displaySort(): number {
        if (this.sort <= 0) return this.sort;
        if (this.fightingCapacityRank <= WarlordsModel.DIVIDING_RANK)
            return this.sort;
        else
            return this.sort - WarlordsModel.DIVIDING_RANK;
    }

}