import { isOversea } from "../../game/module/login/manager/SiteZoneCtrl";
import Logger from "../logger/Logger";
import Singleton from "../singleton/Singleton";
import Utils from "../utils/Utils";
import { RPT_EVENT, RPT_KEY } from "./RptEvent";

/**
 * Adjust
 */
export default class AdjustMgr extends Singleton {
  private requestUrl: string = "https://app.adjust.com/event";

  private APP_TOKEN: string = "ltplsil66cqo";

  private token_key: Map<string, any> = new Map();

  private environment = "production"; //'production';//'sandbox'

  /**
   * 初始化
   * @param t
   */
  setup(t?: any) {
    if (Utils.isApp()) {
      return;
    }
    this.initSdk();
  }

  public initSdk() {
    if (!isOversea()) return;
    this.registerToken();

    // Adjust.initSdk({
    //   appToken: this.APP_TOKEN, // required
    //   environment: this.environment, // required, 'production' or 'sandbox' in case you are testing SDK locally with your web app
    //   attributionCallback: function (e, attribution) {
    //     // optional
    //     // define your attribution callback function
    //   },
    //   logLevel: "verbose", // optional, default is 'error', other options are 'none', 'error', 'warning', 'info', 'verbose'
    //   logOutput: "#output", // optional, outputs logs from sdk into provided container
    //   reftag: "SQH5",
    //   defaultTracker: "dl7m7x", // optional
    //   // externalDeviceId: 'YOUR_EXTERNAL_DEVICE_ID', // optional
    //   // customUrl: 'YOUR_CUSTOM_URL', // optional
    //   // eventDeduplicationListLimit: 'YOUR_EVENT_DEDUPLICATION_LIST_LIMIT' // optional, default set to 10
    //   // namespace: 'YOUR_CUSTOM_STORAGE_NAMESPACE' // optional, namespace for sdk data storage
    // });
  }

  private registerToken() {
    this.token_key = new Map();
    this.token_key.set(RPT_EVENT.REGISTER_PLATFORM, {
      event: RPT_KEY.REGISTER_PLATFORM,
      token: "msu642",
    });
    this.token_key.set(RPT_EVENT.LOGIN_PLATFORM, {
      event: RPT_KEY.LOGIN_PLATFORM,
      token: "unxxxm",
    });
    this.token_key.set(RPT_EVENT.GOOGLE_PLAY, {
      event: RPT_KEY.GOOGLE_PLAY,
      token: "h73ein",
    });
    this.token_key.set(RPT_EVENT.APP_STORE, {
      event: RPT_KEY.APP_STORE,
      token: "atq97a",
    });
    //********//
    this.token_key.set(RPT_EVENT.ENTER_GAME, {
      event: RPT_KEY.ENTER_GAME,
      token: "dl7m7x",
      name: "进区服",
    });
    this.token_key.set(RPT_EVENT.CREATE_ROLE, {
      event: RPT_KEY.CREATE_ROLE,
      token: "4g282e",
      name: "创建角色",
    });
    this.token_key.set(RPT_EVENT.TASK_12000, {
      event: RPT_KEY.TASK,
      token: "msyd53",
      name: "完成第一个主线任务",
    });
    this.token_key.set(RPT_EVENT.CHARGE_COMPLETE, {
      event: RPT_KEY.CHARGE_COMPLETE,
      token: "wl7tpa",
      name: "充值完成",
    });
    this.token_key.set(RPT_EVENT.CHARGE_COUNT, {
      event: RPT_KEY.CHARGE_COUNT,
      token: "ojvdgk",
      name: "充值金额",
    });
    this.token_key.set(RPT_EVENT.LEVEL_UP_5, {
      event: RPT_KEY.LEVEL_UP,
      token: "y7yytv",
      name: "等级5",
    });
    this.token_key.set(RPT_EVENT.LEVEL_UP_10, {
      event: RPT_KEY.LEVEL_UP,
      token: "rtnsvn",
      name: "等级10",
    });
    this.token_key.set(RPT_EVENT.LEVEL_UP_15, {
      event: RPT_KEY.LEVEL_UP,
      token: "yb6icr",
      name: "等级15",
    });
    this.token_key.set(RPT_EVENT.LEVEL_UP_20, {
      event: RPT_KEY.LEVEL_UP,
      token: "u15kyr",
      name: "等级20",
    });
    this.token_key.set(RPT_EVENT.LEVEL_UP_25, {
      event: RPT_KEY.LEVEL_UP,
      token: "nszvbx",
      name: "等级25",
    });
    this.token_key.set(RPT_EVENT.GIFT_TWO_LOGIN, {
      event: RPT_KEY.SIGN,
      token: "lhu7qc",
      name: "第二天签到",
    });
    this.token_key.set(RPT_EVENT.GIFT_THREE_LOGIN, {
      event: RPT_KEY.SIGN,
      token: "r1roj1",
      name: "第三天签到",
    });
    this.token_key.set(RPT_EVENT.GIFT_SEVEN_LOGIN, {
      event: RPT_KEY.SIGN,
      token: "cjtr1b",
      name: "第七天签到",
    });
    this.token_key.set(RPT_EVENT.FIRST_PURCHASE, {
      event: RPT_KEY.FIRST_PURCHASE,
      token: "c7jjyz",
      name: "首冲",
    });
    this.token_key.set(RPT_EVENT.MONTHLY_CARD_PURCHASE, {
      event: RPT_KEY.MONTHLY_CARD_PURCHASE,
      token: "5et0q8",
      name: "购买月卡",
    });
    this.token_key.set(RPT_EVENT.FIRST_KILL, {
      event: RPT_KEY.GUIDE,
      token: "1uikof",
      name: "消灭第1只怪",
    });
    this.token_key.set(RPT_EVENT.CLICK_SKILL, {
      event: RPT_KEY.GUIDE,
      token: "jlxg1p",
      name: "点击技能图标使用技能",
    });
    this.token_key.set(RPT_EVENT.TASK_RESCUE_GIRL, {
      event: RPT_KEY.TASK,
      token: "h7bb1j",
      name: "提交任务: 解救少女",
    });
    this.token_key.set(RPT_EVENT.CLICK_WEAPON, {
      event: RPT_KEY.GUIDE,
      token: "a3u074",
      name: "装备武器",
    });
    this.token_key.set(RPT_EVENT.TASK_KILL_DEMONS, {
      event: RPT_KEY.TASK,
      token: "esxot9",
      name: "提交任务: 清剿魔物",
    });
    this.token_key.set(RPT_EVENT.TASK_GET_TOWN, {
      event: RPT_KEY.TASK,
      token: "equbpz",
      name: "提交任务: 夺回城镇",
    });
    this.token_key.set(RPT_EVENT.TASK_RECRUIT_GUNMEN, {
      event: RPT_KEY.TASK,
      token: "5g4rsh",
      name: "提交任务: 招募枪兵",
    });
    this.token_key.set(RPT_EVENT.TASK_GET_GOLDMINE, {
      event: RPT_KEY.TASK,
      token: "bwckpt",
      name: "提交任务: 占领金矿",
    });
    this.token_key.set(RPT_EVENT.TASK_KILL_NEST, {
      event: RPT_KEY.TASK,
      token: "y0d493",
      name: "提交任务: 清剿魔狼巢穴",
    });
    this.token_key.set(RPT_EVENT.GIFT_LEVEL_10, {
      event: RPT_KEY.GIFT_LEVEL,
      token: "s8jmmr",
      name: "领取10级等级礼包",
    });
    this.token_key.set(RPT_EVENT.GIFT_LEVEL_20, {
      event: RPT_KEY.GIFT_LEVEL,
      token: "w90eln",
      name: "领取20级等级礼包",
    });
    this.token_key.set(RPT_EVENT.TASK_TO_GRASSLAND, {
      event: RPT_KEY.TASK,
      token: "kbfgy0",
      name: "提交任务: 前往自由草原",
    });
    this.token_key.set(RPT_EVENT.CLICK_TREE, {
      event: RPT_KEY.GUIDE,
      token: "l9x8rx",
      name: "农场指引点击神树",
    });
    this.token_key.set(RPT_EVENT.CLICK_JOIN_CLUB, {
      event: RPT_KEY.GUIDE,
      token: "esiwyz",
      name: "公会指引点击“申请加入",
    });
    this.token_key.set(RPT_EVENT.TASK_TO_SKYCITY, {
      event: RPT_KEY.TASK,
      token: "lx8nr9",
      name: "提交任务: 前往天空之城",
    });
    this.token_key.set(RPT_EVENT.TASK_CHALLENGE, {
      event: RPT_KEY.TASK,
      token: "t6x5ta",
      name: "提交任务: 挑战",
    });
    this.token_key.set(RPT_EVENT.TASK_GET_FOREST_UNDERWORLD, {
      event: RPT_KEY.TASK,
      token: "hbmtbc",
      name: "提交任务: 通关幽冥之林",
    });
    this.token_key.set(RPT_EVENT.CLICK_ASTROLOGY, {
      event: RPT_KEY.GUIDE,
      token: "m7b86s",
      name: "引导点击占星",
    });
    this.token_key.set(RPT_EVENT.CLICK_MAZE, {
      event: RPT_KEY.GUIDE,
      token: "2ns9ft",
      name: "引导点击地下迷宫",
    });
    this.token_key.set(RPT_EVENT.CLICK_TEMPLE, {
      event: RPT_KEY.GUIDE,
      token: "rnqvuu",
      name: "引导点击修行神殿",
    });

    this.token_key.set(RPT_EVENT.CLICK_SECOND_SKILL, {
      event: RPT_KEY.GUIDE,
      token: "qcqdea",
      name: "新手引导点击使用第二个技能",
    });
    this.token_key.set(RPT_EVENT.GET_TRANSMIT, {
      event: RPT_KEY.GUIDE,
      token: "8j73d2",
      name: "新手引导通过第一个传送阵",
    });
    this.token_key.set(RPT_EVENT.ZGT_2, {
      event: RPT_KEY.TASK,
      token: "z9bggs",
      name: "内政厅升级至2级",
    });
    this.token_key.set(RPT_EVENT.BY_2, {
      event: RPT_KEY.TASK,
      token: "nyrb71",
      name: "兵营升级至2级",
    });
    this.token_key.set(RPT_EVENT.BY_10, {
      event: RPT_KEY.TASK,
      token: "4rjbyl",
      name: "兵营升级至10级",
    });
    this.token_key.set(RPT_EVENT.TASK_RECRUIT_ARCHER, {
      event: RPT_KEY.TASK,
      token: "vmacn1",
      name: "完成任务: 招募弓手",
    });
    this.token_key.set(RPT_EVENT.TASK_EQUIP_3, {
      event: RPT_KEY.TASK,
      token: "5u9xzs",
      name: "完成任务: 任意装备强化到3级",
    });
    this.token_key.set(RPT_EVENT.TASK_KILL_FILYARI, {
      event: RPT_KEY.TASK,
      token: "8iboyg",
      name: "完成任务: 击杀菲尔娅丽",
    });
    this.token_key.set(RPT_EVENT.TASK_KILL_IBERIAN, {
      event: RPT_KEY.TASK,
      token: "qzogn5",
      name: "完成任务: 击杀伊比利斯",
    });
    this.token_key.set(RPT_EVENT.TASK_LEVY, {
      event: RPT_KEY.TASK,
      token: "oei39z",
      name: "完成任务: 征收",
    });
    this.token_key.set(RPT_EVENT.TASK_GET_ORC_PLAIN, {
      event: RPT_KEY.TASK,
      token: "o31n73",
      name: "完成任务: 通关兽人平原",
    });
    this.token_key.set(RPT_EVENT.TASK_KIL_KNOX, {
      event: RPT_KEY.TASK,
      token: "icl953",
      name: "完成任务: 击杀族长克诺斯",
    });
    this.token_key.set(RPT_EVENT.TASK_KIL_SHADY, {
      event: RPT_KEY.TASK,
      token: "wrff8h",
      name: "完成任务: 击杀夏迪子爵",
    });
    this.token_key.set(RPT_EVENT.TASK_RECRUIT_SWORDSMAN, {
      event: RPT_KEY.TASK,
      token: "4zo8qx",
      name: "完成任务: 招募剑士",
    });
    this.token_key.set(RPT_EVENT.TASK_GET_ABYSS_BREATH, {
      event: RPT_KEY.TASK,
      token: "orwlwn",
      name: "完成任务: 通关深渊气息",
    });
    this.token_key.set(RPT_EVENT.TREE_CHARGE_1, {
      event: RPT_KEY.TASK,
      token: "2yotr5",
      name: "第二天为自己农场神树充能",
    });
    this.token_key.set(RPT_EVENT.TREE_CHARGE_3, {
      event: RPT_KEY.TASK,
      token: "uyq144",
      name: "第三天为自己农场神树充能",
    });
    this.token_key.set(RPT_EVENT.TREE_CHARGE_7, {
      event: RPT_KEY.TASK,
      token: "6fbqeq",
      name: "第七天为自己农场神树充能",
    });

    //CBT
    this.token_key.set(RPT_EVENT.LOGIN_TOURIST_CHOOSE, {
      event: RPT_KEY.LOGIN_TOURIST_CHOOSE,
      token: "nfpda8",
      name: "登录界面点击“以游客继续”按钮",
    });
    this.token_key.set(RPT_EVENT.LOGIN_ACCOUNTS_CHOOSE, {
      event: RPT_KEY.LOGIN_ACCOUNTS_CHOOSE,
      token: "grdm0s",
      name: "登录界面点击“登录其他账户”按钮",
    });
    this.token_key.set(RPT_EVENT.LOGIN_7ROAD_ACCOUNT, {
      event: RPT_KEY.LOGIN_7ROAD_ACCOUNT,
      token: "xpp0ni",
      name: "登录界面点击七道账号登录按钮",
    });
    this.token_key.set(RPT_EVENT.LOGIN_GG_ACCOUNT, {
      event: RPT_KEY.LOGIN_GG_ACCOUNT,
      token: "kw441o",
      name: "登录界面点击谷歌账号登录按钮",
    });
    this.token_key.set(RPT_EVENT.LOGIN_FB_ACCOUNT, {
      event: RPT_KEY.LOGIN_FB_ACCOUNT,
      token: "coyftj",
      name: "登录界面点击Facebook账号登录按钮",
    });
    this.token_key.set(RPT_EVENT.LOGIN_TOURIST_ACCOUNT, {
      event: RPT_KEY.LOGIN_TOURIST_ACCOUNT,
      token: "vpqzt2",
      name: "登录界面点击游客账号登录按钮",
    });
    this.token_key.set(RPT_EVENT.CLICK_LANGUAGE_CONFIRM, {
      event: RPT_KEY.CLICK_LANGUAGE_CONFIRM,
      token: "hys49h",
      name: "点击切换语言二级弹窗“确认”按钮",
    });
    this.token_key.set(RPT_EVENT.CLICK_AREA_CONFIRM, {
      event: RPT_KEY.CLICK_AREA_CONFIRM,
      token: "6ybmax",
      name: "点击切换大区按钮",
    });
    this.token_key.set(RPT_EVENT.CLICK_AD_CLOSE, {
      event: RPT_KEY.CLICK_AD_CLOSE,
      token: "u1b0an",
      name: "点击关闭公告弹窗",
    });

    //********//
  }

  /**
   * trackEvent: track revenue event, requires sdk instance to be initiated
   */
  public trackEvent(eventType: RPT_EVENT, value?: any) {
    Logger.info(":::::::Adjust trackEvent:::::::", "eventType:", eventType);
    let eventData: any = this.token_key.get(eventType);
    if (!eventData || eventData == undefined) return;
    let adjustKey = String(eventData.event);
    let adjustToken = String(eventData.token);
    let eventName = String(eventData.name);
    Logger.warn(
      "Adjust trackEvent:::::::",
      "eventType:",
      adjustKey,
      "eventToken:" + adjustToken,
    );

    switch (adjustKey) {
      case RPT_KEY.CHARGE_COUNT:
        // { productId: productId, orderId: orderId, point: point, moneyFen: moneyFen }

        //@ts-expect-error: Adjust
        Adjust.trackEvent({
          eventToken: adjustToken,
          currency: "USD",
          revenue: String(value.moneyFen),
          // callbackParams: [
          //     { key: "productId", value: value.productId ? String(value.productId) : "0" },
          //     { key: "orderId", value: value.orderId ? String(value.orderId) : "0" },
          //     { key: "point", value: value.point ? String(value.point) : "0" },
          //     { key: "moneyFen", value: value.moneyFen ? String(value.moneyFen) : "0" },
          // ],
          // partnerParams: [
          //     { key: "productId", value: value.productId ? value.productId : "" },
          //     { key: "orderId", value: value.orderId ? value.orderId : "" },
          //     { key: "point", value: value.point ? String(value.point) : "0" },
          //     { key: "moneyFen", value: value.moneyFen ? String(value.moneyFen) : "0" },
          // ]
        });
        break;
      default:
        //@ts-expect-error: Adjust
        Adjust.trackEvent({
          eventToken: adjustToken,
          adjustKey: value ? String(value) : "",
          callbackParams: [
            { key: eventName, value: value ? String(value) : "" },
          ],
          partnerParams: [
            { key: eventName, value: value ? String(value) : "" },
          ],
        });
        break;
    }
  }
}
