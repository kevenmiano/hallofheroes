/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-29 20:18:47
 * @LastEditTime: 2023-12-15 17:00:50
 * @LastEditors: jeremy.xu
 * @Description: 
 */
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { RoleEvent } from "../../constant/event/NotificationEvent";
import { HintCampaignGetType } from "../../constant/HintDefine";
import IMediator from "../../interfaces/IMediator";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { HeroAvatarView } from "../../map/view/hero/HeroAvatarView";
/**
 *  在收到BaseArmy上的获得事件 在人物身上播放一个获得的动画
 */
export class MapBattleMovieMediater implements IMediator {
    protected target: HeroAvatarView;
    protected data: any;

    public register($target: Object) {
        this.target = <HeroAvatarView>$target;
        this.data = this.target["data"];
        if (this.data && this.data.userId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {
            this.data.addEventListener(RoleEvent.BATTLE_STRATEGY, this.__strategyHandler, this);
            this.data.addEventListener(RoleEvent.BATTLE_GP, this.__gpHandler, this);
            this.data.addEventListener(RoleEvent.BATTLE_GOLD, this.__goldHandler, this);
        }
    }

    public unregister(target: Object) {
        if (this.data && this.data.userId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {
            this.data.removeEventListener(RoleEvent.BATTLE_STRATEGY, this.__strategyHandler, this);
            this.data.removeEventListener(RoleEvent.BATTLE_GP, this.__gpHandler, this);
            this.data.removeEventListener(RoleEvent.BATTLE_GOLD, this.__goldHandler, this);
        }
        this.data = null;
    }
    /** 战魂 */
    private __strategyHandler(data: any) {
        Logger.info("战魂", data)
        this.playScoreMovie(parseInt(data.toString()), HintCampaignGetType.Soul);
    }
    /** 经验 */
    private __gpHandler(data: any) {
        Logger.info("经验", data)
        this.playScoreMovie(parseInt(data.toString()), HintCampaignGetType.Exp);
    }
    /** 黄金 */
    private __goldHandler(data: any) {
        Logger.info("黄金", data)
        this.playScoreMovie(parseInt(data.toString()), HintCampaignGetType.Gold);
    }

    /**
     * 开始播放动画 
     * @param value
     * @param type  1积分, 2荣誉,3黄金, 4经验, 5战魂
     */
    playScoreMovie(value: number = -122, type: number = HintCampaignGetType.Integral) {
        // if (value == 0) return;
        // let strArr = ["", "public.score2", "public.honor2", "public.gold2", "public.exp2"]
        // let nameStr = LangManager.Instance.GetTranslation(strArr[type], value, "")
        // let str = LangManager.Instance.GetTranslation(value > 0 ? "public.addMark" : "public.delMark", nameStr)
        // MessageTipManager.Instance.show(str, null, true)
    }
}