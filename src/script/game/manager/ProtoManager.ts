// @ts-nocheck
import LangManager from "../../core/lang/LangManager";
import NetDelayUtils from "../../core/utils/NetDelayUtils";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PlayerManager } from "./PlayerManager";

export class ProtoCheckInfo {
    c2SCode: number
    s2cCodeList: number[]

    /** 延迟多久转圈 ms*/
    delayShowTime: number = 500
    /** 转圈多久结束 ms  应大于SocketManager触发重连的时间*/
    loadingTime: number = 15000
    /** 转圈提示 */
    loadingTip: string = ""
    constructor(c2SCode: number, s2cCodeList: number[]) {
        this.c2SCode = c2SCode
        this.s2cCodeList = s2cCodeList
    }
}

/**
 * 网络协议监听
 * 
 * 点击交互无反应后有相应的弱网提示（类似断线重连提示一样）如转圈等等, 超过一定时间后依旧未收到对应返回或未恢复到正常网络, 则弹窗提示
 */
export default class ProtoManager {
    private C2S_ProtoMap: Map<number, ProtoCheckInfo> = new Map();
    private S2C_ProtoMap: Map<number, number> = new Map();

    private static _inst: ProtoManager;
    public static get Instance(): ProtoManager {
        if (!this._inst) {
            this._inst = new ProtoManager();
        }
        return this._inst;
    }


    /**
     * 注册监听以及返回等待  不可重复注册c2sCode
     */
    public registerNetProto(c2sCode: number, s2cCodeList: number[]) {
        let checkInfo = new ProtoCheckInfo(c2sCode, s2cCodeList)
        switch (c2sCode) {
            case C2SProtocol.C_CHARGE_ORDER:
                checkInfo.loadingTip = LangManager.Instance.GetTranslation("shop.common.recharge")
                break;
        }
        this.C2S_ProtoMap.set(c2sCode, checkInfo);
        for (let index = 0; index < s2cCodeList.length; index++) {
            let s2cCode = s2cCodeList[index]
            this.S2C_ProtoMap.set(s2cCode, c2sCode);
        }
    }

    /**C2S */
    public isC2SProto(c2sCode: number): boolean {
        if (this.C2S_ProtoMap.has(c2sCode)) {
            return true;
        }
        return false;
    }

    /**S2C */
    public isS2CProto(s2cCode: number): boolean {
        if (this.S2C_ProtoMap.has(s2cCode)) {
            return true;
        }
        return false;
    }

    public preSetup() {
        this.registerNetProto(C2SProtocol.C_CHARGE_ORDER, [S2CProtocol.U_C_CHARGE_ORDER]);//充值
        this.registerNetProto(C2SProtocol.L_REGISTER_ROLE, [S2CProtocol.U_C_PLAYER_INFO]);//注册角色
        this.registerNetProto(C2SProtocol.U_C_SHOP_BUY, [S2CProtocol.U_C_SHOP_BUY]);//商城物品购买
        this.registerNetProto(C2SProtocol.C_FASHION_SHOP_BUY, [S2CProtocol.U_C_FASHION_SHOP_BUY]);//商城时装购买
        this.registerNetProto(C2SProtocol.C_PLAYER_SIGN_CMD, [S2CProtocol.U_C_PLAYER_SIGN]);//签到
        this.registerNetProto(C2SProtocol.C_PLAYER_SIGN_CMD, [S2CProtocol.U_C_CHANNEL_ALERT]);//补签活动结束
        this.registerNetProto(C2SProtocol.U_C_BAG_USEITEM, [S2CProtocol.U_C_BAG_MOVE_UPDATE, S2CProtocol.U_C_REWARD_FRESH]);//赠送鲜花  使用道具等|悬赏任务悬赏令刷新
        this.registerNetProto(C2SProtocol.U_C_HERO_RUNE_OP, [S2CProtocol.U_C_RUNE_OP]);//符文操作
        this.registerNetProto(C2SProtocol.C_STAR_BATCH_OP, [S2CProtocol.U_C_START_MOVE_UPDATE]);//星运背包出售
        this.registerNetProto(C2SProtocol.U_C_CAMPAIGN_ENTER, [S2CProtocol.U_C_CAMPAIGN_CREATE]);//战役/英雄之门开始
        this.registerNetProto(C2SProtocol.C_REWARD_FINISH, [S2CProtocol.U_C_REWARD_UPDATE]);//悬赏任务立即完成
        this.registerNetProto(C2SProtocol.C_REWARD_REMOVE, [S2CProtocol.U_C_REWARD_UPDATE]);//悬赏任务放弃
        this.registerNetProto(C2SProtocol.C_REWARD_ADD, [S2CProtocol.U_C_REWARD_UPDATE]);//悬赏任务接收
        this.registerNetProto(C2SProtocol.C_REWARD_FRESH, [S2CProtocol.U_C_REWARD_FRESH]);//悬赏任务
        this.registerNetProto(C2SProtocol.C_HERO_SKILLPOINT_RESET, [S2CProtocol.U_C_HERO_SKILLPOINT_RESET]);//技能洗点
        this.registerNetProto(C2SProtocol.U_C_CONSORTIA_LEVEL, [S2CProtocol.U_CH_CONSORTIA_FRESHINFO]);//公会升级

        this.registerNetProto(C2SProtocol.C_MARKET_INFO_REQ,
            [S2CProtocol.U_C_MARKET_SELLITEM_INFO, //市场出售
            S2CProtocol.U_C_MARKET_PURCHASEITEM_INFO, //市场求购
            S2CProtocol.U_C_MARKET_ITEM_LIST, //玩家订单列表
            S2CProtocol.U_C_MARKET_MYORDER_LIST, //市场订单
            ]);
        this.registerNetProto(C2SProtocol.C_MARKET_ORDER_ACTION, [S2CProtocol.U_C_MARKET_ORDERACTION_RESP]);//市场订单操作
    }

    public setup() {

    }

    public onSynchronized() {
        Laya.stage.timerOnce(5000, this, this.onHeartBreak);
    }

    public unSynchronized() {
        Laya.stage.clearTimer(this, this.onHeartBreak);
    }

    /**
     * 心跳
     */
    onHeartBreak() {
        PlayerManager.Instance.synchronizedSystime();
    }

    /**检查C2S协议 */
    checkC2SCode(code: number) {
        let info = this.C2S_ProtoMap.get(code)
        if (!info) return
        NetDelayUtils.Instance.show(info);
    }

    /**检查S2C协议 */
    checkS2CCode(code: number) {
        // this.unSynchronized();
        if (!this.isS2CProto(code))
            return;
        // this.onSynchronized();
        NetDelayUtils.Instance.hide();
    }

}