/*
 * @Author: jeremy.xu
 * @Date: 2021-11-08 15:17:02
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 14:36:12
 * @Description: 英灵排名奖励Item
 */

import FUI_PetChallengeRankRewardItem from "../../../../../fui/PetChallenge/FUI_PetChallengeRankRewardItem";
import { PetChallengeRewardTemplate } from "../data/PetChallengeRewardTemplate";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import PetChallengeCtrl from "../PetChallengeCtrl";
import RankData from "../../rank/RankData";
import { PetChallengeRewardType, PetChallengeTimeRewardType } from "../../../constant/PetDefine";

export class PetChallengeRankRewardItem extends FUI_PetChallengeRankRewardItem {
    private _info: number;

    public get info(): number {
        return this._info;
    }

    public set info(rankIdx: number) {
        this._info = rankIdx;

        if (rankIdx) {
            let appelTmp = this.control.data.rewardCate[PetChallengeRewardType.APPELL.toString() + PetChallengeTimeRewardType.WeekReward.toString() + rankIdx.toString()] as PetChallengeRewardTemplate
            this.txtAppellValue.text = appelTmp.rewardName
            let buffTmp = this.control.data.rewardCate[PetChallengeRewardType.BUFF.toString() + PetChallengeTimeRewardType.WeekReward.toString() + rankIdx.toString()] as PetChallengeRewardTemplate
            this.txtAttrValue.text = buffTmp.rewardName
            this.imgRank.url = fgui.UIPackage.getItemURL(EmPackName.Base, RankData.RankRes[rankIdx - 1])
        } else {

        }
    }

    public get control() {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.PetChallenge) as PetChallengeCtrl
    }

    public dispose() {
    }
}