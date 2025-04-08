/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-11 20:16:46
 * @LastEditTime: 2023-06-16 16:27:40
 * @LastEditors: jeremy.xu
 * @Description: 确认挑战
 */

import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { EmWindow } from "../../constant/UIDefine";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { PetChallengeObjectData } from "./data/PetChallengeObjectData";
import { TeamFormationPetFigureItem } from "./item/TeamFormationPetFigureItem";
import PetChallengeCtrl from "./PetChallengeCtrl";
import PetChallengeData from "./PetChallengeData";

export default class PetChallengeConfirmWnd extends BaseWindow {
    private txtTitleName: fgui.GLabel;
    private txtCapacityValue: fgui.GLabel;
    private txtWinValue: fgui.GLabel;
    private txtLoseValue: fgui.GLabel;
    private _info: PetChallengeObjectData;

    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter()
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this._info = this.frameData
        this.refresh()
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }

    private refresh() {
        let selfScore = this.control.data.score
        let defencerScore = this._info.score

        let win = PetChallengeData.getResultScore(selfScore, defencerScore, true)
        let lose = PetChallengeData.getResultScore(selfScore, defencerScore, false)

        this.txtWinValue.text = LangManager.Instance.GetTranslation("petchallenge.PetChallengeTopFrame.ScoreTitleTxt") + "+" + win;
        this.txtLoseValue.text = LangManager.Instance.GetTranslation("petchallenge.PetChallengeTopFrame.ScoreTitleTxt") + lose;
        this.txtTitleName.text = LangManager.Instance.GetTranslation("PetChallengePetListInfoView.Title", this._info.userName);
        this.txtCapacityValue.text = this._info.totalFightPower.toString();

        let petLen = this._info.petList.length
        if (petLen == 1) {
            (this["item2"] as TeamFormationPetFigureItem).info = this._info.petList[0]
        } else {
            for (let i = 0; i < PetChallengeData.CARRY_PET_CNT; i++) {
                let data = this._info.petList[i];
                (this["item" + (i + 1)] as TeamFormationPetFigureItem).info = data
            }
        }
    }

    private btnCancelClick() {
        this.hide();
    }

    private btnConfirmClick() {
        if (this.control.data.buildingOrder.remainCount <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("PetChallengeCtrl.lackChallengeCnt"));
            return;
        }
        
        this.control.sendChallengeCommand(this._info.userId);
    }

    public get control() {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.PetChallenge) as PetChallengeCtrl
    }
}
