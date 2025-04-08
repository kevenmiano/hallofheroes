/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-08 10:45:27
 * @LastEditTime: 2023-03-03 17:34:56
 * @LastEditors: jeremy.xu
 * @Description: 商城物品数据
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { ShopEvent } from "../../../constant/event/NotificationEvent";
import { ShopManager } from "../../../manager/ShopManager";
import { VIPManager } from '../../../manager/VIPManager';

export class ShopGoodsInfo extends GameEventDispatcher {
    //商城ID 	
    public Id: number = 0;
    //1为商城, 2为公会商城,, 3为竞技商城, 4为迷宫商城, 5为神秘商城, 6为农场商城
    public ShopType: number = 0;
    //1为热销, 2为钻石, 3为礼金
    public Area: number = 0;
    //对应商品的模板ID 
    public ItemId: number = 0;
    //需要 积分(神秘商店专用积分)
    public Score: number = 0;
    //需要 钻石	
    public Point: number = 0;
    //需要 礼金
    public GiftToken: number = 0;
    //需要 黄金
    public Gold: number = 0;
    //需要农场等级
    public NeedGrades: number = 0;
    //需要最低等级
    public NeedMinGrade: number = 0;
    //需要最高等级
    public NeedMaxGrade: number = 0;
    //需要紫晶积分
    public MineScore: number = 0;
    //需要的荣誉等级
    public NeedGeste: number = 0;
    //需要的荣誉
    public Honor: number = 0;
    //需要的荣耀水晶
    public LordsScore: number = 0;
    //需要最少VIP等级
    public NeedMinVip: number = 0;
    //公会贡献 
    public ConsortiaOffer: number = 0;
    //需要公会等级
    public NeedConsortiaLevels: number = 0;
    //迷宫硬币
    public MazeCoin: number = 0;
    //所需迷宫层数
    public MazeLayers: number = 0;
    //所需深渊迷宫层数
    public MazeLayers2: number = 0;
    //有效日时间,单位:分钟, 
    public ValidDate: number = 0;
    //VIP等级限购数量 -1为不限购
    public VIP0Count: number = -1;
    public VIP1Count: number = -1;
    public VIP2Count: number = -1;
    public VIP3Count: number = -1;
    public VIP4Count: number = -1;
    public VIP5Count: number = -1;
    public VIP6Count: number = -1;
    public VIP7Count: number = -1;
    public VIP8Count: number = -1;
    public VIP9Count: number = -1;

    //VIP等级限购数量 -1为不限购
    public Vipp0: number = -1;
    public Vipp1: number = -1;
    public Vipp2: number = -1;
    public Vipp3: number = -1;
    public Vipp4: number = -1;
    public Vipp5: number = -1;
    public Vipp6: number = -1;
    public Vipp7: number = -1;
    public Vipp8: number = -1;
    public Vipp9: number = -1;
    public Vipp10: number = -1;
    public Vipp11: number = -1;
    public Vipp12: number = -1;
    public Vipp13: number = -1;
    public Vipp14: number = -1;
    public Vipp15: number = -1;
    public Vipp16: number = -1;
    public Vipp17: number = -1;
    public Vipp18: number = -1;
    public Vipp19: number = -1;
    public Vipp20: number = -1;
    public Vipp21: number = -1;
    public Vipp22: number = -1;
    public Vipp23: number = -1;
    public Vipp24: number = -1;
    public Vipp25: number = -1;
    public Vipp26: number = -1;
    public Vipp27: number = -1;
    public Vipp28: number = -1;
    public Vipp29: number = -1;
    public Vipp30: number = -1;
    //打折
    public Discount: number = 0;
    public WeeklyLimit: number = 0;

    //		原价
    //		public FirstPrice:number = 0;
    //		现价
    //		public Price:number = 0;
    //越小排在越前 	
    public Sort: number = 0;
    //是否为热销商品 	
    public IsHot: boolean;
    //0没有标签, 1为新品, 2为推荐 
    public Labels: number = 0;
    //出现几率
    public Rands: number = 0;

    //购买类型
    private _payType: number = 0;
    //购买价格
    private _price: number = 0;
    //一人当前已购买的数量
    private _oneCurrentCount: number = 0;
    //周限购次数(当周已购买)
    private _weekCount: number = 0;

    private _type: number = 1;

    public static PAY_BY_POINT: number = 1;//点券(钻石)
    public static PAY_BY_GIFT: number = 2;//礼金(绑钻)
    public static PAY_BY_GOLD: number = 3;//金币
    public static PAY_BY_OFFER: number = 4;//公会贡献
    public static PAY_BY_HONOR: number = 5;//荣誉
    public static PAY_BY_MAZE: number = 6;//迷宫硬币
    public static PAY_BY_GLORY: number = 7;//荣耀水晶
    public static PAY_BY_BACKPLAYER: number = 8;//勇士回归劵
    public static PAY_BY_GUILD: number = 9;//恐惧之牙
    public static PAY_BY_GODWINER: number = 13;//泰坦结晶
    public static PAY_BY_CONTRIBUTION: number = 14;//个人建设
    public static PAY_BY_FRAGMENT_1001: number = 1001;
    public static PAY_BY_FRAGMENT_1002: number = 1002;
    public static PAY_BY_FRAGMENT_1003: number = 1003;
    public static PAY_BY_FRAGMENT_1004: number = 1004;
    public static PAY_BY_FRAGMENT_1005: number = 1005;
    public static PAY_BY_FRAGMENT_1006: number = 1006;
    public static HOMEPAGE_GOODS: number = 0;//首页
    public static HOT_GOODS: number = 1;//热销
    public static PROP_GOODS: number = 2;//道具
    public static GIFT_GOODS: number = 3;//礼金
    public static GEMSTONE_GOODS: number = 4;//宝石
    public static CARDREEL_GOODS: number = 5;//卡片卷轴
    public static HOME_GOODS: number = 6;//主页
    public static PET_GOODS: number = 7;//商城英灵
    public static BACK_PLAYER: number = 8;//老玩家回归
    public static NO_SEARCH_SHOP: number = 52; //不对玩家显示

    public static FASHION_ALL_BUY: number = 8; //时装全部购买
    public static FASHION_LOOK: number = 9; //时装预览
    public static STAR_SHOP: number = 101; //星运商城
    public static HIDE_SHOP: number = 99;//隐藏背包
    public static BLOOD_SHOP: number = 100;//快捷购买, 血包
    public static SHOP: number = 1; //商城
    public static CONSORTIA_SHOP: number = 2; //公会商城
    public static ATHLETICS_SHOP: number = 3; //竞技商城
    public static MAZE_SHOP: number = 4; //迷宫商城
    public static MYSTERY_SHOP: number = 5; //神秘商店
    public static FARM_SHOP: number = 6; //农场商城
    public static MYSTERY_EXCHANGE_SHOP: number = 7; //神秘商店(积分兑换物品)
    public static PET_EXCHANGE_SHOP: number = 8; //英灵兑换
    public static WARLORDS_SHOP: number = 10;//众神商城
    public static MINERAL_SHOP: number = 11;//紫晶商城
    public static ADVCONSORTIA_SHOP: number = 17; //高级公会商店
    public static CONSORTIA_HIGH_SHOP: number = 18; //公会建设商店
    public static PET_EXCHANGE_SHOPTYPE: number = 888; //英灵兑换

    public static NEW_GOODS: number = 1;
    public static RECOMMENDED_GOODS: number = 2;
    public static HOT_GOODS_FLAG: number = 3;


    public static CROSS_BUGLE_TEMP_ID: number = 208025;//跨区大喇叭
    public static BIG_BUGLE_TEMP_ID: number = 208002;//本区大喇叭
    public static SMALL_BUGLE_TEMP_ID: number = 208003;//小喇叭
    public static MAZE_KEY: number = 208008;//迷宫钥匙
    public static MEDAL_TEMPID: number = 208001;//勋章
    public static BACKPLAYER_TEMPID: number = 2125048;//勇士回归劵
    public static CD_Time: number = 2031701;//精灵盟约  时钟之神

    public NeedItem: number = 0; //需要物品模板id
    public static MYSTERY_STONE: number = 2131057; //神秘石

    public static REMOTEPET_TEMPID: number = 2131200;//远征碎片
    public static REMOTEPET_TEMPID2: number = 2131201; //远征精华

    public static MOUNT_FOOD_TEMPID: number = 208017;//兽魂石
    public static PET_GROWTH_STONE_TEMPID: number = 208023;//圣魂石
    public static IMPERIAL_PASS: number = 2131021;//帝国通行证
    public static GUILD_CONTRIBUTION: number = -6200;//公会高级贡献（公会个人建设值）

    public get price(): number {
        return this._price;
    }

    public get weekCount(): number {
        return this._weekCount;
    }
    public set weekCount(v: number) {
        this._weekCount = v;
    }

    private setPrice() {
        if (this.ShopType == 8) {
            let needItemTemp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this.NeedItem);
            this._price = this.Score;
            this._payType = ShopGoodsInfo.PAY_BY_FRAGMENT_1001;
            if (needItemTemp) {
                switch (needItemTemp.Property1) {
                    case 101:
                        this._payType = ShopGoodsInfo.PAY_BY_FRAGMENT_1001;
                        break;
                    case 102:
                        this._payType = ShopGoodsInfo.PAY_BY_FRAGMENT_1002;
                        break;
                    case 103:
                        this._payType = ShopGoodsInfo.PAY_BY_FRAGMENT_1003;
                        break;
                    case 104:
                        this._payType = ShopGoodsInfo.PAY_BY_FRAGMENT_1004;
                        break;
                    case 105:
                        this._payType = ShopGoodsInfo.PAY_BY_FRAGMENT_1005;
                        break;
                    case 106:
                        this._payType = ShopGoodsInfo.PAY_BY_FRAGMENT_1006;
                        break;
                    default:
                        this._payType = ShopGoodsInfo.PAY_BY_FRAGMENT_1001;
                        break;
                }
            }
        }
        else if (this.ShopType == ShopGoodsInfo.ADVCONSORTIA_SHOP) {
            this._payType = ShopGoodsInfo.PAY_BY_GUILD;
            this._price = this.Score;
        }
        else if (this.ShopType == ShopGoodsInfo.CONSORTIA_HIGH_SHOP) {
            this._payType = ShopGoodsInfo.PAY_BY_CONTRIBUTION;
            this._price = this.Score;
        }
        else if (this.Point > 0) {
            this._payType = ShopGoodsInfo.PAY_BY_POINT;
            this._price = this.Point;
        }
        else if (this.GiftToken > 0) {
            this._payType = ShopGoodsInfo.PAY_BY_GIFT;
            this._price = this.GiftToken;
        }
        else if (this.Gold > 0) {
            this._payType = ShopGoodsInfo.PAY_BY_GOLD;
            this._price = this.Gold;
        }
        else if (this.Honor > 0) {
            this._payType = ShopGoodsInfo.PAY_BY_HONOR;
            this._price = this.Honor;
        }
        else if (this.ConsortiaOffer > 0) {
            this._payType = ShopGoodsInfo.PAY_BY_OFFER;
            this._price = this.ConsortiaOffer;
        }
        else if (this.MazeCoin > 0) {
            this._payType = ShopGoodsInfo.PAY_BY_MAZE;
            this._price = this.MazeCoin;
        }
        else if (this.LordsScore > 0) {
            this._payType = ShopGoodsInfo.PAY_BY_GLORY;
            this._price = this.LordsScore;
        }
        else if (this.NeedItem == ShopGoodsInfo.BACKPLAYER_TEMPID) {
            this._payType = ShopGoodsInfo.PAY_BY_BACKPLAYER;
            this._price = this.Score;
        }
        else {
            this._payType = ShopGoodsInfo.PAY_BY_POINT;
            this._price = 1;
        }
    }

    public get canBuyNum(): number {
        if (this.canTotalCount == -1 && this.canOneCount == -1) {
            return -1;
        }
        else if (this.canTotalCount == -1) {
            return this.canOneCount;
        }
        else if (this.canOneCount == -1) {
            return this.canOneCount;
        }
        else {
            return Math.min(this.canTotalCount, this.canOneCount);
        }
    }

    public get canOneCount(): number {
        if (this.OneDayCount != -1) {
            return this.OneDayCount - this._oneCurrentCount;
        }
        else {
            return -1;
        }
    }

    public get canTotalCount(): number {
        return -1;
    }

    public set oneTotalCount(value: number) {

    }

    /**
     * 当天已购买数量
     */
    public get OneCurrentCount(): number {
        return this._oneCurrentCount;
    }

    public set OneCurrentCount(value: number) {
        this._oneCurrentCount = value;
        ShopManager.Instance.model.dispatchEvent(ShopEvent.GOODS_INFO_UPDATE);
    }

    public get OneDayCount(): number {
        let userVip = VIPManager.Instance.model.vipInfo.VipGrade;
        return this["Vipp" + userVip];
    }

    // public get OneDayCount(): number {
    //     return this["VIP" + 0 + "Count"];
    // }

    public get PayType(): number {
        return this._payType;
    }

    public init() {
        this.setPrice();
    }

    public get type(): number {
        return this._type;
    }

}