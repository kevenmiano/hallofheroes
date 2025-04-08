/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2024-01-03 11:14:26
 * @LastEditTime: 2024-02-02 14:39:35
 * @LastEditors: jeremy.xu
 * @Description: 战斗撤退
 */

import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { EmPackName } from "../../../constant/UIDefine";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import FUIHelper from "../../../utils/FUIHelper";
import BattleWnd from "../BattleWnd";

import WithdrawRespMsg = com.road.yishi.proto.battle.WithdrawRespMsg;
import WithdrawVoteInitiatorView from "../ui/withdraw/WithdrawVoteInitiatorView";
import WithdrawVoteView from "../ui/withdraw/WithdrawVoteView";
export class WithdrawHandler {
    private wnd: BattleWnd;
    private comWithdrawVote: WithdrawVoteView;
    private comWithdrawVoteInitiator: WithdrawVoteInitiatorView;
    private withdrawVotePos: fgui.GGraph;
    constructor(wnd: BattleWnd) {
        this.wnd = wnd;

        if (!this.battleModel.isEnableWithdraw) return;

        this.initView()
        this.addEvent()
    }

    private addEvent() {
        ServerDataManager.listen(S2CProtocol.U_BATTLE_WITHDRAW_RSP, this, this.onBattleWithdrawRsp);
    }

    private removeEvent() {
        ServerDataManager.cancel(S2CProtocol.U_BATTLE_WITHDRAW_RSP, this, this.onBattleWithdrawRsp);
    }

    private initView() {
        this.withdrawVotePos = this.wnd["withdrawVotePos"]
        this.refresh()
    }

    private refresh() {
        
    }
    
    private onBattleWithdrawRsp(pkg: PackageIn) {
        let msg: WithdrawRespMsg = pkg.readBody(WithdrawRespMsg) as WithdrawRespMsg;
        Logger.battle("收到撤退", msg)

        if (msg.result != 1) {
            if (msg.info && msg.info.length > 0) {
                this.battleModel.withdrawInfoList = msg.info;
                this.battleModel.withdrawCountdown = msg.countdown;
                let selfWithdraw = this.battleModel.selfHero.userId == msg.info[0].userId;
                this.addWithdrawVoteInfo(selfWithdraw);
            }
        }

        // 0未出 1成功 2失败
        if (msg.result != 0) {
            this.removeWithdrawVote();
            if (msg.result == 1) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("battle.view.ui.withdraw.success"), null, true);
            } else if (msg.result == 2) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("battle.view.ui.withdraw.failed"), null, true);
            }
        }
    }
    
    /**
     * @param selfWithdraw 是否是自己发起的撤退
     */
    public addWithdrawVoteInfo(selfWithdraw: boolean) {
        if (selfWithdraw) {
            if (!this.comWithdrawVoteInitiator) {
                this.comWithdrawVoteInitiator = FUIHelper.createFUIInstance(EmPackName.Battle, "WithdrawVoteInitiatorView");
                this.wnd.getContentPane().addChild(this.comWithdrawVoteInitiator);
                this.comWithdrawVoteInitiator.setXY(this.withdrawVotePos.x, this.withdrawVotePos.y)
            }
            this.comWithdrawVoteInitiator.refresh()
        } else {
            if (!this.comWithdrawVote) {
                this.comWithdrawVote = FUIHelper.createFUIInstance(EmPackName.Battle, "WithdrawVoteView");
                this.wnd.getContentPane().addChild(this.comWithdrawVote);
                this.comWithdrawVote.setXY(this.withdrawVotePos.x, this.withdrawVotePos.y)
            }
            this.comWithdrawVote.refresh()
        }
    }

    public removeWithdrawVote() {
        if (this.comWithdrawVote) {
            this.comWithdrawVote.dispose();
            this.comWithdrawVote = null;
        }
        if (this.comWithdrawVoteInitiator) {
            this.comWithdrawVoteInitiator.dispose();
            this.comWithdrawVoteInitiator = null;
        }
    }
    
    public get showWithdrawVote(): boolean {
        return Boolean(this.comWithdrawVote) || Boolean(this.comWithdrawVoteInitiator)
    }
    
    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public dispose() {
        this.removeEvent();
        this.removeWithdrawVote();
    }
}