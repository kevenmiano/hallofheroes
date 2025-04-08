// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-11-08 15:17:02
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-06-12 12:08:50
 * @Description: 英灵头像Item - 英灵排行界面
 */

import FUI_PetChallengeRankHeadItem from "../../../../../fui/PetChallenge/FUI_PetChallengeRankHeadItem";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PetData } from "../../pet/data/PetData";

export class PetChallengeRankHeadItem extends FUI_PetChallengeRankHeadItem {
    private _info: PetData;

    public get info(): PetData {
        return this._info;
    }

    public set info(value: PetData) {
        this._info = value;
        if (value) {
            this.title = value.fightPower.toString()
            let gInfo = new GoodsInfo();
            gInfo.petData = value;
            let baseItem = (this.item as BaseItem);
            baseItem.info = gInfo;
        } else {
            let baseItem = (this.item as BaseItem);
            baseItem.info = null;
        }
    }

    onConstruct() {
        super.onConstruct();
    }

    public dispose() {
        super.dispose();
    }
}