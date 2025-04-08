// @ts-nocheck
import SwitchInfoMsg = com.road.yishi.proto.switches.SwitchInfoMsg;

export class SwitchInfo {

    public SWITCH: Map<number, SwitchInfoMsg> = new Map();

    ////////////////////////////////////必须由客户端控制////////////////////////////////////

    public OPNE_LOADINGSUSLIKS: boolean = true;
    /**
     *战斗日志开关
     */
    public BATTLE_LOG: boolean = false;
    /**
     * 打地鼠
     */
    public LOADINGSUSLIKS: boolean = true;
    /**
     * 过滤开关
     * 开启: 
     *    英 雄    中间空格会被忽略, 需要过滤
     * 关闭
     *  fu ck    中间空格不会被忽略, 不需要过滤
     */
    public FILTER_TRIM: boolean = false;

    ////////////////////////////////////////////////////////////////////////////////

    /**
     * 地下迷宫自动爬塔
     */
    public AUTO_MAZE: boolean = false;

    /**
     * 世界boss buff增益
     */
    public WORLDBOSS_BUFF: boolean = true;
    /**
     * 客服语音开关
     */
    public VOICE: boolean = false;

    /////////////////////////////////////////////  以下是服务器发过来的开关
    /**
     * 登录器开关
     */
    public CLIENT_DOWNLAND: boolean = false;
    /**
     *手机任务
     */
    public MOBILE_TASK: boolean = false;

    /**
     * 客服系统开关
     */
    public CUSTOMER_SERVICE: boolean = false;
    /**
     * 迷宫首杀
     */
    public MAZE_FIRST_KILL: boolean = false;

    /**
     *战场
     */
    public PVP_CAMPAIGN: boolean = false;
    public PVP_CAMPAIGN_BEGIN_DATE: Date;
    public PVP_CAMPAIGN_END_DATE: Date
    /**
     * 跨服积分 默认打开
     */
    public CROSSSCORE: boolean = true;
    /**
     * 跨服排行榜 默认打开
     */
    public CROSSSORT: boolean = true;
    /**
     * 360礼包
     */
    public GIFT_360: boolean = false;
    /**
     *facebook开关
     */
    public FACE_BOOK: boolean = false;
    /**
     * Stage3D开关
     */
    public STAGE3D: boolean = false;

    /** 英灵钻石强化开关*/
    public PET_STRONG: boolean = false;
    /**
     * 夺宝奇兵
     */
    public GEMMAZE: boolean = false;
    /**
     * 云端历险
     */
    public MONOPOLY: boolean = false;

    /**
     * 七日目标
     */
    public SEVEN_GOALS: boolean = true;

    /**
     * IOS兑换码开关
     */
    public IOS_ACTIVITY_CODE: boolean = true;

    /**
    * 综合入口页签
    */
    public COMPREHENSIVE_ENTRANCE: boolean = true;

    /**
   * 综合入口-官网按钮
   */
    public COMPREHENSIVE_WEBSITE: boolean = true;

    /**
    * 综合入口-公众号
    */
    public COMPREHENSIVE_OFFICIAL_ACCOUNTS: boolean = true;

    /**
   * 综合入口-推送
   */
    public COMPREHENSIVE_PUSH: boolean = true;

    /**
     *综合入口-客服弹窗
     */
    public COMPREHENSIVE_CUSTOMER: boolean = true;

    /**
     *综合入口-隐私策略
     */
    public COMPREHENSIVE_PRIVATE: boolean = true;

    /**
     * 聊天翻译开关
     */
    public CHAT_TRANSLATE = false;

    /**
     * 小游戏IOS支付: 2016  默认开启
     */
    public MINI_GAME_PAY: boolean = true;

    /**
     * 坐骑分享开关
     */
    public MOUNT_SHARE: boolean = true;

    /**
     * 禁止发言:  2018: 默认关闭
     */
    public CHAT_FORBID: boolean = false;
    public CHAT_FORBID_BEGIN_DATE: Date;
    public CHAT_FORBID_END_DATE: Date

    /**
    * 禁止发言:  2020: 默认关闭
    */
    public SYS_OPEN: boolean = false;

    /**
    * 评分:  2021: 默认关闭
    */
    public STORE_RATING: boolean = false;

    /**
     * 微端:  2022: 默认关闭
     */
    public MICRO_APP: boolean = false;
    /**
     * 幸运金羊
     */
    public GOLDEN_SHEEP: boolean = true;

    /**
     * 打折商城
     */
    public DISCOUNT_SHOP_SWITCH: boolean = true;
    /**
     * 转盘活动
     */
    public TURNTABLE_ACTIVITY: boolean = true;

    /**
     * IOS支付: 2025  默认开启
     */
    public IOS_PAY: boolean = true;

    /**
     * QQ大厅特权礼包
     */
    public QQ_HALL_GIFT: boolean = true;
    /**
     * 绑定邮箱开关
     */
    public BIND_MAIL: boolean = false;
    /**
     * 绑定手机开关
     */
    public BIND_PHONE: boolean = false;
    /**
     * 充值轮盘周刷开关
     */
    public RECHARG_LOTTERY_REFRESH: boolean = false;
    /**
    * Discord开关
    */
    public Discord: boolean = false;
    /**
     * FB分享开关
     */
    public FB_SHARE: boolean = false;
    /**
     * Twitter分享开关
     */
    public Twitter_SHARE: boolean = false;
    /**
     * Discord分享开关
     */
    public Discord_SHARE: boolean = false;
    /**
     * Instagram分享开关
     */
    public Instagram_SHARE: boolean = false;
    /**
     * Telegram分享开关
     */
    public Telegram_SHARE: boolean = false;
    /**
     * Whatsapp分享开关
     */
    public Whatsapp_SHARE: boolean = false;
    /**
     * Youtube分享开关
     */
    public Youtube_SHARE: boolean = false;

    constructor() {
    }

}