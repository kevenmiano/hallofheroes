// @ts-nocheck
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from '../../core/net/ServerDataManager';
import { SocketManager } from "../../core/net/SocketManager";
import SDKManager from "../../core/sdk/SDKManager";
import { GameEventCode } from "../constant/GameEventCode";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import { VipInfo, VipGiftState } from '../datas/vip/VipInfo';
import { VipRouletteInfo } from "../datas/vip/VipRouletteInfo";
import { VIPModel } from "../mvc/model/VIPModel";
import { ArmyManager } from "./ArmyManager";
import { MessageTipManager } from './MessageTipManager';
import { NotificationManager } from './NotificationManager';
import { VIPEvent } from '../constant/event/NotificationEvent';
import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import VipRouletteMsg = com.road.yishi.proto.vip.VipRouletteMsg;
import VipInfoMsg = com.road.yishi.proto.vip.VipInfoMsg;
import VipOpenInfoMsg = com.road.yishi.proto.vip.VipOpenInfoMsg;
import OpenGiftRsp = com.road.yishi.proto.vip.OpenGiftRsp;

/**
 *VIP相关操作及信息与服务器相关的请求
 * @author
 *
 */
export class VIPManager extends GameEventDispatcher {
    private _model: VIPModel = new VIPModel();
    private static _instance: VIPManager;

    public setup() {
        this.initEvent();
    }

    public static get Instance(): VIPManager {
        if (!VIPManager._instance) {
            VIPManager._instance = new VIPManager();
        }
        return VIPManager._instance;
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_VIP_INFO, this, this._vipInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_OPENVIPROULETTE, this, this._openVipRouletteHandler);
        ServerDataManager.listen(S2CProtocol.U_C_VIPROULETTE_RESULT, this, this._openVipRouletteResultHandler);
        ServerDataManager.listen(S2CProtocol.U_C_VIP_OPENTIPS, this, this._vipOpenTipsHandler);
        ServerDataManager.listen(S2CProtocol.U_C_VIP_GIFT_RSP, this, this._vipOpenGiftHandler)
    }

    public get vipGiftState():boolean {
        let giftStates = VIPManager.Instance.model.vipInfo.giftState;
        let userVip = VIPManager.Instance.model.vipInfo.VipGrade;
        let effectState = false;
        for (let index = 0; index < giftStates.length; index++) {
            let element = giftStates[index];
            if (userVip >= element.vip_grade && element.dayGiftState == 1 || element.isFreeGift) {
                effectState = true;
                break;
            }
        }
        return effectState;
    }

    public get model(): VIPModel {
        return this._model;
    }

    /**VIP获取礼包返回 */
    _vipOpenGiftHandler(pkg: PackageIn) {
        let msg = pkg.readBody(OpenGiftRsp) as OpenGiftRsp;
        if (msg.ret == 1) {
            let vipGrade = msg.grade;
            let giftType = msg.type;
            // MessageTipManager.Instance.show('111');
        }
    }

    /**
     * VIP续费提示
     *
     * */
    private _vipOpenTipsHandler(pkg: PackageIn) {
        this.model.vipOpenTips();
    }

    /**
     * VIP轮盘获得物品
     *
     * */
    private _openVipRouletteResultHandler(pkg: PackageIn) {
        let msg = pkg.readBody(VipRouletteMsg) as VipRouletteMsg;
        let rouletteInfo: VipRouletteInfo = new VipRouletteInfo();
        rouletteInfo.LeftCount = msg.leftCount;
        rouletteInfo.NeedVipItem = msg.needVipItem;
        rouletteInfo.OpenIndex = msg.openIndex;
        rouletteInfo.TakedTempList = msg.takeItem;
        rouletteInfo.BoxTempIdList = msg.leftItem;
        rouletteInfo.IsStart = msg.isStart;
        rouletteInfo.startType = msg.opType;
        this.model.rouletteInfo = rouletteInfo;
    }

    /**
     * 打开VIP轮盘
     *
     * */
    private _openVipRouletteHandler(pkg: PackageIn) {
        // MaskUtils.instance.maskHide();
        let msg = pkg.readBody(VipRouletteMsg) as VipRouletteMsg;
        let rouletteInfo: VipRouletteInfo = new VipRouletteInfo();

        if (msg.leftItem.length < 18) {
            return;
        }
        // LayerManager.Instance.clearnGameDynamic();
        rouletteInfo.LeftCount = msg.leftCount;
        rouletteInfo.NeedVipItem = msg.needVipItem;
        rouletteInfo.OpenIndex = msg.openIndex;
        rouletteInfo.TakedTempList = msg.takeItem;
        rouletteInfo.BoxTempIdList = msg.leftItem;
        rouletteInfo.IsStart = msg.isStart;
        rouletteInfo.startType = msg.opType;

        this.model.rouletteInfo = rouletteInfo;
        this.model.commitOpenBoxEvent();
    }

    /**
     * 更新VIP信息
     *
     * */
    private _vipInfoHandler(pkg: PackageIn) {
        let msg = pkg.readBody(VipInfoMsg) as VipInfoMsg;
        let vipInfo: VipInfo = new VipInfo();

        vipInfo.VipGp = msg.vipGp;
        vipInfo.VipGrade = msg.vipGrade;
        vipInfo.buffEndTime = msg.buffEndTime;
        vipInfo.buffGainTime = msg.buffGainTime;
        vipInfo.isGainBuff = msg.isGainBuff;
        vipInfo.giftState = [];
        for (let key in msg.giftState) {
            if (Object.prototype.hasOwnProperty.call(msg.giftState, key)) {
                let element = msg.giftState[key];
                let vo = new VipGiftState();
                vo.dayGiftState = element.dayGiftState;
                vo.dayGiftTime = element.dayGiftTime;
                vo.vip_grade = element.vipGrade;
                vo.isFreeGift = element.isFreeGift;
                vo.isPayGift = element.isPayGift;
                vipInfo.giftState.push(vo);
            }
        }

        ArmyManager.Instance.thane.vipType = vipInfo.VipType;
        ArmyManager.Instance.thane.IsVipAndNoExpirt = vipInfo.IsVipAndNoExpirt;

        this.model.vipInfo = vipInfo;
        this.dispatchEvent(VIPEvent.VIP_PRIVILEGE_UPDATE);//VIP特权更新
        SDKManager.Instance.getChannel().postGameEvent(GameEventCode.Code_1024);
    }

    /**
     * 发送Vip轮盘转动
     * @param type 0为普通开启, 1为一键开启
     */
    public senVIPRolette(type: number = 0) {
        let msg: VipRouletteMsg = new VipRouletteMsg();
        msg.opType = type;
        SocketManager.Instance.send(C2SProtocol.C_VIPROULETTE, msg);
    }


    /**
     * VIP开通
     * @is_friend 是否好友
     * @friend_id 好友ID
     * @friend_nick_name  好友昵称
     * @days  开通天数
     */
    public openVip(is_friend: boolean, friend_id: number, friend_nick_name: string, days: number) {
        let msg: VipOpenInfoMsg = new VipOpenInfoMsg;
        msg.isFriend = is_friend;
        msg.friendId = friend_id;
        msg.friendNickName = friend_nick_name;
        msg.days = days;
        SocketManager.Instance.send(C2SProtocol.C_VIP_OPEN, msg);
    }

    /**
     * VIP礼包领取
     */
    public senReceiveGift() {
        SocketManager.Instance.send(C2SProtocol.C_VIP_BOX_DROP);
    }
}