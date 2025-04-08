// @ts-nocheck
import Logger from "../logger/Logger";
import Singleton from "../singleton/Singleton";
import { RPT_EVENT, RPT_KEY } from "./RptEvent";

export default class GTagMgr extends Singleton {

    private token_key: Map<string, any> = new Map();

    /**
     * 初始化
     * @param t 
     */
    setup(t?: any) {
        this.initSdk();
    }

    public initSdk() {
        this.registerToken();
    }

    private registerToken() {
        this.token_key = new Map();
        this.token_key.set(RPT_EVENT.REGISTER_PLATFORM, { event: RPT_KEY.REGISTER_PLATFORM, token: "AW-303222529/fFWwCOyt1IQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.LOGIN_PLATFORM, { event: RPT_KEY.LOGIN_PLATFORM, token: "AW-303222529/_-hICKy21IQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.GOOGLE_PLAY, { event: RPT_KEY.GOOGLE_PLAY, token: "AW-303222529/qfrICJnK04QYEIGey5AB" });
        this.token_key.set(RPT_EVENT.APP_STORE, { event: RPT_KEY.APP_STORE, token: "AW-303222529/LXWjCIzG1IQYEIGey5AB" });
        //********//
        this.token_key.set(RPT_EVENT.ENTER_GAME, { event: RPT_KEY.ENTER_GAME, token: "AW-303222529/f3ymCNe61IQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.CREATE_ROLE, { event: RPT_KEY.CREATE_ROLE, token: "AW-303222529/O8ZtCInP1IQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.TASK_12000, { event: RPT_KEY.TASK, token: "AW-303222529/30tVCO_J1IQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.CHARGE_COMPLETE, { event: RPT_KEY.CHARGE_COMPLETE, token: "AW-303222529/oN26CMCR2IQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.CHARGE_COUNT, { event: RPT_KEY.CHARGE_COUNT, token: "AW-303222529/rX9yCOXO1YQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.LEVEL_UP_5, { event: RPT_KEY.LEVEL_UP, token: "AW-303222529/lQl2CJjk1IQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.LEVEL_UP_10, { event: RPT_KEY.LEVEL_UP, token: "AW-303222529/9RZBCNny1IQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.LEVEL_UP_15, { event: RPT_KEY.LEVEL_UP, token: "AW-303222529/rKdzCNzy1IQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.LEVEL_UP_20, { event: RPT_KEY.LEVEL_UP, token: "AW-303222529/ZmhXCN_y1IQYEIGey5AB" });
        this.token_key.set(RPT_EVENT.LEVEL_UP_25, { event: RPT_KEY.LEVEL_UP, token: "AW-303222529/MdzJCOLy1IQYEIGey5AB" });
        //********//
    }

    /**
     * trackEvent: track revenue event, requires sdk instance to be initiated
     */
    public trackEvent(eventType: RPT_EVENT, value?: any) {
        Logger.info(":::::::GTag trackEvent:::::::", "eventType:", eventType);
        let eventData: any = this.token_key.get(eventType);
        if (!eventData || eventData == undefined) return;
        let GTagKey = eventData.event;
        let GTagToken = eventData.token;
        Logger.warn("GTag trackEvent:::::::", "eventType:", GTagKey, "eventToken:" + GTagToken);

        switch (GTagKey) {
            case RPT_KEY.CHARGE_COUNT:
                //@ts-ignore
                window.gtag('event', 'conversion', {
                    'send_to': GTagToken,
                    'transaction_id': value.orderId,
                    "items": [{
                        "productId": value.productId ? value.productId : "",
                        "orderId": value.orderId ? value.orderId : "",
                        "point": value.point ? value.point : 0,
                        "moneyFen": value.moneyFen ? value.moneyFen : 0,
                    }
                    ], 'event_callback': this.event_callback.bind(this)
                });
                return false;
                break;
            default:
                //@ts-ignore
                window.gtag('event', 'conversion', {
                    'send_to': GTagToken,
                    'event_callback': this.event_callback.bind(this)
                });
                return false;
                break;
        }
    }

    private event_callback(value: any) {
        Logger.info(":::::::GTag event_callback:::::::", value);
        if (typeof (value) != 'undefined') {
            // window.location = value;
        }
    }
}
