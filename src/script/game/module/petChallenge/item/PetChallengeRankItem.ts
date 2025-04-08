// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-11-11 12:07:37
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 14:38:56
 * @Description: 英灵排行Item
 */


import FUI_PetChallengeRankItem from "../../../../../fui/PetChallenge/FUI_PetChallengeRankItem";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import RankData from "../../rank/RankData";
import { PetChallengeObjectData } from "../data/PetChallengeObjectData";
import { PetChallengeRankHeadItem } from "./PetChallengeRankHeadItem";

export default class PetChallengeRankItem extends FUI_PetChallengeRankItem {
    private _info: PetChallengeObjectData;


    public set info(info: PetChallengeObjectData) {
        this._info = info
        this.imgRank.url = ""
        this.petList.removeChildrenToPool()
        if (info) {
            let rank = info.ranking
            this.txtRank.text = rank.toString()
            this.txtScore.text = info.score.toString()
            this.txtUserName.text = info.userName
            this.txtTotalFightPower.text = info.totalFightPower.toString()
            this.txtRank.visible = rank > 3
            if (rank <= 3) {
                this.imgRank.url = fgui.UIPackage.getItemURL(EmPackName.Base, RankData.RankRes[rank - 1])
            }
            for (let index = 0; index < info.petList.length; index++) {
                let item = this.petList.addItemFromPool() as PetChallengeRankHeadItem
                item.info = info.petList[index]
            }
        }
    }

    public get info() {
        return this._info
    }

    public dispose(){
        super.dispose();
    }
}