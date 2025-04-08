// @ts-nocheck
import GemRewardInfoVO from "./GemRewardInfoVO";

/**
 * 夺宝奇兵每次更新的数据, 包含: 当前回合消除的宝石、新增的宝石、获得的积分等 
 */
 export default class GemInfoUpdateInfoVO{
    private  _gemDelArr:Array<any> = [];
		
    private  _gemAddArr:Array<any> = [];
    /**
     * 本回合奖励信息 
     */		
    public  rewardInfo:GemRewardInfoVO;
    /**
     *本回合增加的积分数组
     * 
     */		
    public  scoreAdd:Array<any>;
    /**
     * 当前经验 
     * 
     */		
    public  curExp:number;
    /**
     * 当前等级经验上限 
     * 
     */		
    public  maxExp:number;
    
    public  addIntergal:Array<any>; //当前回合增加的积分
    
    constructor()
    {
        this.rewardInfo = new GemRewardInfoVO();
    }

    /**
     * 本回合需要新增的宝石数组 
     * 
     */
    public  get gemAddArr():Array<any>
    {
        return this._gemAddArr;
    }

    /**
     * @private
     */
    public  set gemAddArr(value:Array<any>)
    {
        this._gemAddArr = value;
    }

    /**
     * 本回合需要消除的宝石数组 
     */
    public  get gemDelArr():Array<any>
    {
        return this._gemDelArr;
    }

    /**
     * @private
     */
    public  set gemDelArr(value:Array<any>)
    {
        this._gemDelArr = value;
    }

 }