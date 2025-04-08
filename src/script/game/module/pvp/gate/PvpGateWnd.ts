/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 10:32:05
 * @LastEditTime: 2024-02-20 10:43:31
 * @LastEditors: jeremy.xu
 * @Description: 多人竞技
 */

import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { RankIndex } from "../../../constant/RankDefine";
import { RoomSceneType } from "../../../constant/RoomDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import UIButton from '../../../../core/ui/UIButton';
import OpenGrades from "../../../constant/OpenGrades";

export default class PvpGateWnd extends BaseWindow {
    protected setSceneVisibleOpen: boolean = true;
    private txtOpenTime: fgui.GLabel
    public btnChallenge: UIButton

    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind() {
        super.OnInitWind();
        // this.setCenter();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        let str = TempleteManager.Instance.getConfigInfoByConfigName("MatchTime").ConfigValue
        str = str.replace(/,/g, "-")
        str = str.replace(/\|/g, "  ")
        this.txtOpenTime.text = str
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }

    btnShopClick() {
        if (this.thane.grades < OpenGrades.CHALLENGE) {
            let str: string = LangManager.Instance.GetTranslation("pvp.view.PvPMultiView.command01");
            MessageTipManager.Instance.show(str);
            return;
        }
        // FrameCtrlManager.Instance.open(EmWindow.PvpShop);
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 2});
    }


    btnRankClick() {
        FrameCtrlManager.Instance.open(EmWindow.Rank, { rankIndex: RankIndex.RankItemR5_001 });
    }

    btnTeamHallClick() {
        if (this.thane.grades < OpenGrades.CHALLENGE) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("pvp.view.PvPMultiView.command01"));
            return;
        }
        if(ArmyManager.Instance.army.onVehicle){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
            return;
        }

        FrameCtrlManager.Instance.open(EmWindow.RoomList, { "roomSceneType": RoomSceneType.PVP });
    }

    btnQuickJoinClick() {
        if (this.thane.grades < OpenGrades.CHALLENGE) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("pvp.view.PvPMultiView.command01"));
            return;
        }
        if(ArmyManager.Instance.army.onVehicle){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
            return;
        }
        this.ctrl.sendQuickJoin()
    }

    btnCreateRoomClick() {
        if (this.thane.grades < OpenGrades.CHALLENGE) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("pvp.view.PvPMultiView.command01"));
            return;
        }
        if(ArmyManager.Instance.army.onVehicle){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
            return;
        }
        let tips: string = WorldBossHelper.getCampaignTips();
        if (tips != "") {
            MessageTipManager.Instance.show(tips);
            return;
        }
        this.ctrl.sendCreateRoom();
    }

    btnChallengeClick() {
        if(ArmyManager.Instance.army.onVehicle){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
            return;
        }
        FrameCtrlManager.Instance.open(EmWindow.Colosseum, { returnToWin: EmWindow.PvpGate }, null, EmWindow.PvpGate);
    }


    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }
}