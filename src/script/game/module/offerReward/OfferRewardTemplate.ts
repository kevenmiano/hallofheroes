import { DateFormatter } from "../../../core/utils/DateFormatter";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { t_s_rewardcondictionData } from '../../config/t_s_rewardcondiction';
import { t_s_rewardgoodData } from '../../config/t_s_rewardgood';

export default class OfferRewardTemplate {
    /**
     * 任务编号
     */
    public TemplateId: number;

    /** 任务类型 0 悬赏  1 普通环任务  2 环任务 3为环任务没接取时在任务面板中显示的内容*/
    public Type: number;
    /**
     * 任务标题
     */
    public TitleLang: string;
    /**
     * 任务描述
     */
    public DetailLang: string;
    /**
     *任务副本ID 
     */
    public NeedFightId: number;
    /**
     * 所需领主最小等级
     */
    public NeedMinLevel: number;
    /**
     * 接受领主最高等级
     */
    public NeedMaxLevel: number;
    /**
     * 是否需要公会
     */
    public IsLeague: boolean;
    /**
     * 奖励经验
     */
    public RewardPlayGP: number;
    /**
     * 奖励黄金
     */
    public RewardGold: number;
    /**
     * 奖励战魂
     */
    public RewardStrategy: number;
    /**
     *开始时间 
     */
    public StartDate: string;
    /**
     *结束时间 
     */
    public EndDate: string;
    /**
     * 出现概率
     */
    public Rands: number;
    public ShowType: number;


    private _rewardItemList: any[];
    private _conditionList: t_s_rewardcondictionData[];

    constructor(data?: Object) {
		for (let i in data) {
			this[i] = data[i];
		}
        this.TitleLang = data['TitleLang']
        this.DetailLang = data['DetailLang']
	}

    /**
     *悬赏任务奖励物品列表 
     * @return 
     * 
     */
    public get rewardItemList(): any[] {
        return this._rewardItemList;
    }

    /**
     *悬赏任务完成条件列表 
     * @return 
     * 
     */
    public get conditionList(): t_s_rewardcondictionData[] {
        return this._conditionList;
    }

    /**
     *悬赏任务品质 
     */
    public profile: number;

    /**
     *添加悬赏任务数据 
     * 
     */
    public addData(){
        this.addRewardGoodsList();
        this.addRewardConditionList();
    }

    /**
     * 是否已到任务可接取时间
     */
    public get isReachDate(): boolean {
        var curDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        var startDate: Date = DateFormatter.parse(this.StartDate, "YYYY-MM-DD hh:mm:ss");
        return (curDate.getTime() > startDate.getTime());
    }

    /**
     * 是否已过期
     */
    public get isOutDate(): boolean {
        var curDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        var endDate: Date = DateFormatter.parse(this.EndDate, "YYYY-MM-DD hh:mm:ss");
        return (curDate.getTime() > endDate.getTime());
    }

    /**
     *添加奖励物品 
     * 
     */
    private addRewardGoodsList(){
        if (!this._rewardItemList) this._rewardItemList = [];
        var goodsList = TempleteManager.Instance.offerRewardGoodsTemplateList();
        for (let dicKey in goodsList) {
            if (goodsList.hasOwnProperty(dicKey)) {
                let goodTemp:t_s_rewardgoodData = goodsList[dicKey];
                if (goodTemp.TemplateId == this.TemplateId) {
                    this._rewardItemList.push(goodTemp);
                }
            }
        }
    }

    /**
     *添加完成条件 
     * 
     */
    private addRewardConditionList(){
        if (!this._conditionList) this._conditionList = [];
        var conditionList = TempleteManager.Instance.offerRewardConditionTemplateList();
        for (let dicKey in conditionList) {
            if (conditionList.hasOwnProperty(dicKey)) {
                let condition: t_s_rewardcondictionData = conditionList[dicKey];
                if (condition.TemplateId == this.TemplateId) {
                    this._conditionList.push(condition);
                }
            }
        }
    }

}