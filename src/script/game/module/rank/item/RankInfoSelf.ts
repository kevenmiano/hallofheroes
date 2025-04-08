/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-11 16:10:23
 * @LastEditTime: 2023-07-10 14:39:05
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import FUI_RankInfoSelf from "../../../../../fui/Base/FUI_RankInfoSelf";
import Logger from "../../../../core/logger/Logger";
import { SocketManager } from "../../../../core/net/SocketManager";
import UIButton from "../../../../core/ui/UIButton";
import OpenGrades from "../../../constant/OpenGrades";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ArmyManager } from '../../../manager/ArmyManager';

import ChallengeRankRewardMsg = com.road.yishi.proto.player.ChallengeRankRewardMsg;

export default class RankInfoSelf extends FUI_RankInfoSelf {
    private _showingTip = false
    private _info: any
    private _uBtnReward: UIButton
    private _titleBg: string = fgui.UIPackage.getItemURL(EmPackName.Base, "Img_Title_Bg")

    onConstruct() {
        super.onConstruct()

        this.btnReward.onClick(this, this.btnRewardClick.bind(this))
        this._uBtnReward = new UIButton(this.btnReward);
    }

    onStageClick(evt: Laya.Event) {
        let sourceTarget = evt.target["$owner"];
        if (this._uBtnReward.view == sourceTarget) {
            evt.stopPropagation();
            return;
        }
        if (this._showingTip) {
            this.btnRewardClick(evt);
        }
    }

    btnRewardClick(evt?: any) {
        if (!this._showingTip && this.playerInfo.canAcceptCrossScoreAward) {
            this.requestRankAward();
            return;
        }
        this._showingTip = !this._showingTip
        this.gRewardTips.visible = this._showingTip;
        if (this._showingTip)
            Laya.stage.on(Laya.Event.CLICK, this, this.onStageClick);
        else
            Laya.stage.off(Laya.Event.CLICK, this, this.onStageClick);
        evt.stopPropagation();
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
    private requestRankAward() {
        //获取跨服战场积分排名奖励
        let msg = new ChallengeRankRewardMsg();
        SocketManager.Instance.send(C2SProtocol.C_TAKE_CROSS_SCORE_REWARD, msg);
    }

    public set info(data: any) {
        this._info = data
        if (data) {
            this.txtRank.text = data.rank
            this.txtScore.text = data.score
            this.txtTime.text = data.time
        }
    }

    public get info() {
        return this._info
    }

    public set titleBg(value: string) {
        if (value) {
            this._titleBg = value
        }
        this.imgBg.icon = this._titleBg
    }

    dispose() {
        super.dispose();
        Laya.stage.off(Laya.Event.CLICK, this, this.onStageClick);
    }
}
