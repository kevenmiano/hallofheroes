// @ts-nocheck
import FUI_OnlineGiftView from "../../../../../fui/Welfare/FUI_OnlineGiftView";
import { BaseItem } from "../../../component/item/BaseItem";
import WelfareCtrl from "../WelfareCtrl";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { PackageIn } from "../../../../core/net/PackageIn";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";
import { WelfareManager } from '../WelfareManager';
import OnlineRewardInfoRsp = com.road.yishi.proto.active.OnlineRewardInfoRsp;
import OnlineRewardMsg = com.road.yishi.proto.active.OnlineRewardMsg;
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";

/**
 * @description 在线奖励
 * @author yuanzhan.yu
 * @date 2021/6/23 15:59
 * @ver 1.0
 */
export class OnlineGiftView extends FUI_OnlineGiftView {
    // public item_0: BaseItem;
    // public item_1: BaseItem;
    // public item_2: BaseItem;
    // public item_3: BaseItem;
    // public item_4: BaseItem;
    // public item_5: BaseItem;
    // public item_6: BaseItem;
    // public item_7: BaseItem;
    // public item_8: BaseItem;
    // public item_9: BaseItem;

    private _itemList: OnlineRewardMsg[];//奖品池
    private _countDown: number = 0;//倒计时（秒）
    private _resultId: number = -1;//抽奖结果
    private _leftTimes: number = 0;//剩余抽奖次数
    private _pauseTime: number = 0;

    private isAnimating: boolean = false;//正在抽奖动画中

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.initData();
        this.initEvent();

        this.control.sendOnlineRewardReq(1);
        this.initView();
    }

    private initData() {
        this._itemList = [];
        this.isAnimating = false;
    }

    private initEvent() {
        this.btn_receive.onClick(this, this.onBtnReceiveClick);
        ServerDataManager.listen(S2CProtocol.U_C_ONLINE_REWARD, this, this.onLineRewardBack);
    }

    private initView() {

    }

    private onBtnReceiveClick(e: Laya.Event) {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        this._resultId = -1;

        if (this._leftTimes <= 0) {
            let str: string = LangManager.Instance.GetTranslation("lottery.LotteryFrame.noLeftCounts");
            MessageTipManager.Instance.show(str);
            return;
        }
        this.btn_receive.enabled = false;
        // this._resultId = Math.ceil(Math.random() * 10);//测试
        this.isAnimating = true;
        if (this._pauseTime > 0) {
            this.t0.play(Laya.Handler.create(this, this.onTranComplete1), 1, 0, this._pauseTime);
        } else {
            this.t0.play(Laya.Handler.create(this, this.onTranComplete1), 2, 0, this._pauseTime);
        }
    }

    private onTranComplete1() {
        this.t0.timeScale = 2;
        this.t0.play(Laya.Handler.create(this, this.onTranComplete2), 2);
    }

    private onTranComplete2() {
        this.t0.timeScale = 1;
        this.t0.play(Laya.Handler.create(this, this.onTranComplete3), 1);
        this.control.sendOnlineRewardReq(2);
    }

    private onTranComplete3() {
        this.t0.setHook(`item${this._resultId - 1}`, Laya.Handler.create(this, this.updateResult))
        this.t0.play();
    }

    private updateResult() {
        this.control.sendAddItemReq(this._itemList[this._resultId - 1]);
        this.t0.clearHooks();
        this.t0.setPaused(true);
        this._pauseTime = this.t0.getLabelTime(`item${this._resultId - 1}`);

        if (this.isAnimating) {
            this.isAnimating = false;
            this._leftTimes > 0 && (this.btn_receive.enabled = true);
        }
    }

    private onLineRewardBack(pkg: PackageIn) {
        let msg: OnlineRewardInfoRsp = pkg.readBody(OnlineRewardInfoRsp) as OnlineRewardInfoRsp;
        if (msg.op == 1) {
            this._itemList = msg.allItem as OnlineRewardMsg[];
            this.updateItems();
        } else if (msg.op == 2) {
            //抽奖结果
            this._resultId = msg.id;
            // this.updateResult(msg.id);
        } else if (msg.op == 3) {
            //扣次数
        }
        this._leftTimes = msg.rewardTime;
        this.txt_leftTimes.text = this._leftTimes.toString();
        if (this._leftTimes <= 0) {
            this.btn_receive.enabled = false;
        } else {
            if (!this.isAnimating) {
                this.btn_receive.enabled = true;
            }
        }
        if (msg.leftTime == -1) {
            let text = LangManager.Instance.GetTranslation("lottery.LotteryFrame.dayAddMax");
            this.txt_countDown.text = `[size=30]&nbsp;[/size] ` + text;
            // this.txt_countDown.setVar("text", text).flushVars();
            // this.txt_countDown.setVar("time", "").flushVars();
        } else {
            this._countDown = msg.leftTime;
            if (this._countDown >= 0) {
                Laya.timer.loop(1000, this, this.updateCountDown)
                this.updateCountDown();
            }
        }
    }

    private updateItems() {
        let info: GoodsInfo;
        for (let i = 0, len = this._itemList.length; i < len; i++) {
            const onlineRewardMsg = this._itemList[i];
            info = new GoodsInfo()
            info.templateId = onlineRewardMsg.itemId;
            info.count = onlineRewardMsg.num;
            (this[`item_${onlineRewardMsg.id - 1}`] as BaseItem).info = info;
        }
    }

    private updateCountDown() {
        this.txt_countDown.text=LangManager.Instance.GetTranslation("welfareWnd.OnlineGift.countDown");
        if (this._countDown > 0) {
            let countDown: string = DateFormatter.getConsortiaCountDate(this._countDown);
            // this.txt_countDown.setVar('text', LangManager.Instance.GetTranslation("welfareWnd.OnlineGift.countDown")).flushVars();
 
            this.txt_countDown.setVar('time', countDown.toString()).flushVars();
            this._countDown--;
        } else {
            // this.txt_countDown.setVar('text', LangManager.Instance.GetTranslation("welfareWnd.OnlineGift.countDown1")).flushVars();
            this.txt_countDown.setVar('time', "").flushVars();
            Laya.timer.clear(this, this.updateCountDown);
            this.control.sendOnlineRewardReq(1);//倒计时结束重新请求数据
        }
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    private removeEvent() {
        this.btn_receive.offClick(this, this.onBtnReceiveClick);
        ServerDataManager.cancel(S2CProtocol.U_C_ONLINE_REWARD, this, this.onLineRewardBack);
    }

    dispose() {
        this.removeEvent();
        this.t0.clearHooks();
        this.t0.stop();
        this.t0 = null;
        this._itemList = [];
        Laya.timer.clear(this, this.updateCountDown);
        if (this.isAnimating) {
            WelfareManager.Instance.sendOnlineRewardReq(3);//关闭直接发奖励
            this.control.sendOnlineRewardReq(1);//主动更新红点
        }
        super.dispose();
    }
}