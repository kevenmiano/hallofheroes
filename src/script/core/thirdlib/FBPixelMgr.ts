import Logger from "../logger/Logger";
import Singleton from "../singleton/Singleton";
import Utils from "../utils/Utils";
import { RPT_EVENT, RPT_KEY } from "./RptEvent";

/**
 * Adjust
 */
export default class FBPixelMgr extends Singleton {

    private token_key: Map<string, any> = new Map();

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
        this.registerToken();
    }

    private registerToken() {
        this.token_key = new Map();
        this.token_key.set(RPT_EVENT.REGISTER_PLATFORM, { event: RPT_KEY.REGISTER_PLATFORM, });
        this.token_key.set(RPT_EVENT.LOGIN_PLATFORM, { event: RPT_KEY.LOGIN_PLATFORM, });
        this.token_key.set(RPT_EVENT.GOOGLE_PLAY, { event: RPT_KEY.GOOGLE_PLAY, });
        this.token_key.set(RPT_EVENT.APP_STORE, { event: RPT_KEY.APP_STORE, });
        //********//
        this.token_key.set(RPT_EVENT.ENTER_GAME, { event: RPT_KEY.ENTER_GAME, name: "进区服" });
        this.token_key.set(RPT_EVENT.CREATE_ROLE, { event: RPT_KEY.CREATE_ROLE, name: "创建角色" });
        this.token_key.set(RPT_EVENT.TASK_12000, { event: RPT_KEY.TASK, name: "完成第一个主线任务" });
        this.token_key.set(RPT_EVENT.CHARGE_COMPLETE, { event: RPT_KEY.CHARGE_COMPLETE, name: "充值完成" });
        this.token_key.set(RPT_EVENT.CHARGE_COUNT, { event: RPT_KEY.CHARGE_COUNT, name: "充值金额" });
        this.token_key.set(RPT_EVENT.LEVEL_UP_5, { event: RPT_KEY.LEVEL_UP, name: "等级5" });
        this.token_key.set(RPT_EVENT.LEVEL_UP_10, { event: RPT_KEY.LEVEL_UP, name: "等级10" });
        this.token_key.set(RPT_EVENT.LEVEL_UP_15, { event: RPT_KEY.LEVEL_UP, name: "等级15" });
        this.token_key.set(RPT_EVENT.LEVEL_UP_20, { event: RPT_KEY.LEVEL_UP, name: "等级20" });
        this.token_key.set(RPT_EVENT.LEVEL_UP_25, { event: RPT_KEY.LEVEL_UP, name: "等级25" });
        //********//
    }

    /**
     * trackEvent: track revenue event, requires sdk instance to be initiated
     */
    public trackEvent(eventType: RPT_EVENT, value?: any) {
        Logger.info(":::::::FBPixelMgr trackEvent:::::::", "eventType:", eventType);
        let eventData: any = this.token_key.get(eventType);
        if (!eventData || eventData == undefined) return;
        try {
            //@ts-ignore
            fbq('track', eventData.name);
        } catch (error) {
            Logger.info(error);
        }

    }

}