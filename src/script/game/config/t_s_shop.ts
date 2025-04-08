// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_shop
*/
export default class t_s_shop {
        public mDataList: t_s_shopData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_shopData(list[i]));
                }
        }
}

export class t_s_shopData extends t_s_baseConfigData {
        //Id(编号)
        public Id: number;
        //ShopType(商店)
        public ShopType: number;
        //Area(区域)
        public Area: number;
        //MazeCoin(迷宫硬币售价)
        public MazeCoin: number;
        //MazeLayers2(深渊迷宫层数)
        public MazeLayers2: number;
        //MazeLayers(所需层数)
        public MazeLayers: number;
        //NeedGeste(所需荣誉)
        public NeedGeste: number;
        //ItemId(物品ID)
        public ItemId: number;
        //Point(点券)
        public Point: number;
        //GiftToken(礼券)
        public GiftToken: number;
        //Gold(黄金)
        public Gold: number;
        //LordsScore(荣耀水晶)
        public LordsScore: number;
        //ConsortiaOffer(贡献度)
        public ConsortiaOffer: number;
        //Honor(勋章)
        public Honor: number;
        //Rands(机率)
        public Rands: number;
        //ValidDate(有效分钟)
        public ValidDate: number;
        //NeedMaxGrade(最大等级)
        public NeedMaxGrade: number;
        //IsNeedPoint(钻石专用)
        public IsNeedPoint: number;
        //Score(积分)
        public Score: number;
        //NeedGrades(最小领主等级)
        public NeedGrades: number;
        //NeedMinGrade(最小等级)
        public NeedMinGrade: number;
        //NeedConsortiaLevels(需要公会等级)
        public NeedConsortiaLevels: number;
        //NeedMinVip(最小VIP)
        public NeedMinVip: number;
        //FirstPrice(原价)
        public FirstPrice: number;
        //NeedItem(需要物品)
        public NeedItem: number;
        //Discount(折扣)
        public Discount: number;
        //MineScore(矿场积分)
        public MineScore: number;
        //Price(价钱)
        public Price: number;
        //IsHot(热销)
        public IsHot: number;
        //Labels(标签)
        public Labels: number;
        //VIP0Count(限量)
        public VIP0Count: number;
        //VIP1Count(VIP1限量)
        public VIP1Count: number;
        //VIP2Count(VIP2限量)
        public VIP2Count: number;
        //VIP3Count(VIP3限量)
        public VIP3Count: number;
        //VIP4Count(VIP4限量)
        public VIP4Count: number;
        //VIP5Count(VIP5限量)
        public VIP5Count: number;
        //VIP6Count(VIP6限量)
        public VIP6Count: number;
        //Vipp0(限购)
        public Vipp0: number;
        //Vipp1(限购)
        public Vipp1: number;
        //Vipp2(限购)
        public Vipp2: number;
        //Vipp3(限购)
        public Vipp3: number;
        //Vipp4(限购)
        public Vipp4: number;
        //Vipp5(限购)
        public Vipp5: number;
        //Vipp6(限购)
        public Vipp6: number;
        //Vipp7(限购)
        public Vipp7: number;
        //Vipp8(限购)
        public Vipp8: number;
        //Vipp9(限购)
        public Vipp9: number;
        //Vipp10(限购)
        public Vipp10: number;
        //Vipp11(限购)
        public Vipp11: number;
        //Vipp12(限购)
        public Vipp12: number;
        //Vipp13(限购)
        public Vipp13: number;
        //Vipp14(限购)
        public Vipp14: number;
        //Vipp15(限购)
        public Vipp15: number;
        //Vipp16限购)
        public Vipp16: number;
        //Vipp17(限购)
        public Vipp17: number;
        //WeeklyLimit(周限购)
        public WeeklyLimit: number;
        //Sort(排序)
        public Sort: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
