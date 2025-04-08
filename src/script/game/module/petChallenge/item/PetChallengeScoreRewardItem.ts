// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-11-08 15:17:02
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-06-09 11:40:26
 * @Description: 英灵积分奖励Item
 */

import FUI_PetChallengeScoreRewardItem from "../../../../../fui/PetChallenge/FUI_PetChallengeScoreRewardItem";
import { PetChallengeRewardTemplate } from "../data/PetChallengeRewardTemplate";
import { BaseItem } from '../../../component/item/BaseItem';
import { GoodsInfo } from '../../../datas/goods/GoodsInfo';
import { EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import PetChallengeCtrl from "../PetChallengeCtrl";
import LangManager from "../../../../core/lang/LangManager";

export class PetChallengeScoreRewardItem extends FUI_PetChallengeScoreRewardItem {
    private _info: PetChallengeRewardTemplate;

    public get info(): PetChallengeRewardTemplate {
        return this._info;
    }

    public set info(value: PetChallengeRewardTemplate) {
        this._info = value;
        this.list.removeChildren();
        if (value) {
            for (let index = 0; index < value.goodList.length; index++) {
                const gInfo = value.goodList[index];
                let item = this.list.addItem() as BaseItem;
                item.info = gInfo as GoodsInfo;
            }
            this.txtScore.text = LangManager.Instance.GetTranslation("PetChallengeFrame.scoreScoop", value.minScore, value.maxScore);
        } else {

        }
    }

    public get control() {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.PetChallenge) as PetChallengeCtrl
    }

    public dispose() {
    }
}