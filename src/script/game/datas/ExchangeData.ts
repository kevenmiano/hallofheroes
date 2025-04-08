import { GoodsInfo } from './goods/GoodsInfo';
import StarInfo from '../module/mail/StarInfo';

/**
 * 兑换数据
 */
export default class ExchangeData {
    //兑换所需道具
    public requireInfos: Array<GoodsInfo | StarInfo>;
    //兑换可获得道具
    public rewardsInfo: Array<GoodsInfo | StarInfo>;
    //最大可兑换次数
    public maxExchangeCount: number = 0;
    //最大限制兑换次数
    public maxCount: number = 0;

    public exchangeId: string = "";

    constructor() {
        this.requireInfos = [];
        this.rewardsInfo = [];
    }
}