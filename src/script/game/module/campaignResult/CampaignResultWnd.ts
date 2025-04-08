// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2023-07-10 14:18:50
 * @LastEditors: jeremy.xu
 * @Description: 
 */
import ConfigMgr from '../../../core/config/ConfigMgr';
import LangManager from '../../../core/lang/LangManager';
import Logger from '../../../core/logger/Logger';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import { DateFormatter } from '../../../core/utils/DateFormatter';
import { IconFactory } from '../../../core/utils/IconFactory';
import { ConfigType } from '../../constant/ConfigDefine';
import { EmPackName, EmWindow } from '../../constant/UIDefine';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import { CampaignManager } from '../../manager/CampaignManager';
import { PlayerManager } from '../../manager/PlayerManager';
import { VIPManager } from '../../manager/VIPManager';
import CampaignResultData from './CampaignResultData';

import CampaignReportMsg = com.road.yishi.proto.campaign.CampaignReportMsg

export default class CampaignResultWnd extends BaseWindow {
    private gradeList: fgui.GList
    private expList: fgui.GList
    private imgGrade: fgui.GLoader
    private imgGradeBg: fgui.GLoader
    private imgPetHead: fgui.GLoader
    private txtPetExp: fgui.GLabel
    private txtVipExp: fgui.GLabel
    private txtTotalExp: fgui.GLabel
    private rTxtAutoCloseTip: fgui.GRichTextField
    private gPetExp: fgui.GGroup
    private gVipExp: fgui.GGroup
    private timeCountDown: number = 0;

    private _msg: CampaignReportMsg;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this._msg = this.params.frameData
        this.initData()
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }

    private initData() {
        this.txtTotalExp.text = "+" + String(this._msg.totalGp)   //总经验
        this.txtVipExp.text = "+" + String(this._msg.vipJoin)    //vip加成

        //评价等级 (S A B C D) 
        this.imgGrade.icon = fgui.UIPackage.getItemURL(EmWindow.CampaignResult, CampaignResultData.EvaluateRes[this._msg.totalAppraisal - 1])
        this.imgGradeBg.icon = fgui.UIPackage.getItemURL(EmWindow.CampaignResult, CampaignResultData.EvaluateBgRes[this._msg.totalAppraisal - 1])

        this.gVipExp.visible = VIPManager.Instance.model.vipInfo.VipGrade > 0;
        // this.gPetExp.visible = Boolean(this.playerInfo.enterWarPet);
        if (this.playerInfo.enterWarPet) {
            this.txtPetExp.text = "+" + String(this._msg.petGp > 0 ? this._msg.petGp : 0);	//英灵经验
            this.imgPetHead.icon = IconFactory.getPetHeadSmallIcon(this.playerInfo.enterWarPet.templateId);
        }


        let gradeArr = [
            { name: LangManager.Instance.GetTranslation("CampaignResult.KillBossTime"), value: DateFormatter.getFullTimeString(this._msg.endBossTime), evaluate: this._msg.endBossAppraisal },
            { name: LangManager.Instance.GetTranslation("CampaignResult.DieCnt"), value: this._msg.failedCount, evaluate: this._msg.failedAppraisal },
        ]
        for (let i = 0; i < this.gradeList.numChildren; i++) {
            const element = this.gradeList.getChildAt(i).asCom;
            element.getChild("txtHurtDesc").text = gradeArr[i].name
            element.getChild("txtHurt").text = String(gradeArr[i].value)
        }

        let expArr = [
            { name: LangManager.Instance.GetTranslation("CampaignResult.Team"), value: this._msg.teamJoin },
            // { name: LangManager.Instance.GetTranslation("CampaignResult.Friend"), value: this._msg.friendJoin },
            { name: LangManager.Instance.GetTranslation("CampaignResult.Prop"), value: this._msg.propJoin },
            { name: LangManager.Instance.GetTranslation("CampaignResult.Other"), value: this._msg.otherJoin },
        ]
        let count = this.expList.numItems;
        let dataCount = expArr.length;
        for (let i = 0; i < count; i++) {
            const element = this.expList.getChildAt(i).asCom;
            if (i < dataCount) {
                element.getChild("txtName").text = expArr[i].name
                element.getChild("txtExp").text = "+" + String(expArr[i].value);
            } else {
                element.getChild("txtName").text = ""
                element.getChild("txtExp").text = ""
            }
        }

        // Laya.timer.once(CampaignResultData.AutoCloseTime * 1000, this, this.OnBtnClose)

        Laya.timer.loop(1000, this, this.autoClickToNextHandler)
        this.autoClickToNextHandler()
    }

    private autoClickToNextHandler() {
        let time: number = CampaignResultData.AutoCloseTime - this.timeCountDown;
        if (time <= 0) {
            time = 0;
            Laya.timer.clear(this, this.autoClickToNextHandler)
            this.hide();
            return;
        }
        this.rTxtAutoCloseTip.text = LangManager.Instance.GetTranslation("CampaignResult.AutoCloseTip", time);
        this.timeCountDown++;
    }

    /**
     * 伤害百分比是否超过或等于100% 
     */
    private isMax(num: number): boolean {
        return (num * CampaignResultData.NUM >= 100)
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
}