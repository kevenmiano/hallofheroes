/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 10:32:05
 * @LastEditTime: 2021-12-01 21:13:42
 * @LastEditors: jeremy.xu
 * @Description: 排名奖励
 */

import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { PlayerManager } from "../../../manager/PlayerManager";
import ColosseumCtrl from "./ColosseumCtrl";
import { BaseItem } from "../../../component/item/BaseItem";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import FUI_CommonFrame3 from "../../../../../fui/Base/FUI_CommonFrame3";
import { t_s_singlearenarewardsData } from "../../../config/t_s_singlearenarewards";

export default class ColosseumRankRewardWnd extends BaseWindow {
    public frame: FUI_CommonFrame3;
    private itemList: fgui.GList;
    private txtDesc: fgui.GLabel;
    private btnConfirm: UIButton;
    goodsArr: GoodsInfo[];

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
        Utils.setDrawCallOptimize(this.itemList);
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('ColosseumRankRewardWnd.rankAwardTxt1');
        this.itemList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        // this.btnConfirm.enabled = PlayerManager.Instance.currentPlayerModel.playerInfo.isChallReward
        if (this.frameData) {
            this.goodsArr = this.getRewards(this.frameData);
            this.itemList.numItems = this.goodsArr.length;
            // if (this.frameData.txtDesc && !this.btnConfirm.enabled) {
            //     this.txtDesc.text = LangManager.Instance.GetTranslation("ColosseumRankRewardWnd.GetTime", this.frameData.txtDesc)
            // }
        }
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }

    private renderListItem(index: number, item: BaseItem) {
        // let rewardList = this.frameData.rewardList
        // if (!rewardList) return
        // let itemData = rewardList[index]
        // if (!itemData) {
        //     item.info = null
        //     return
        // }
        // item.info = itemData
        item.info = this.goodsArr[index];
    }

    getRewards(info: t_s_singlearenarewardsData) {
        let rewards: GoodsInfo[] = [];
        if (info.RewardItemID1) {
            let goods1 = new GoodsInfo();
            goods1.templateId = info.RewardItemID1;
            goods1.count = info.RewardItemCount1;
            rewards.push(goods1);
        }
        if (info.RewardItemID2) {
            let goods2 = new GoodsInfo();
            goods2.templateId = info.RewardItemID2;
            goods2.count = info.RewardItemCount2;
            rewards.push(goods2);
        }
        
        return rewards;
    }
    
    private btnConfirmClick() {
        // ColosseumCtrl.sendTakeReward()
        ColosseumCtrl.requestChallengeReward(this.frameData.Id);
        this.OnBtnClose()
    }

    private btnCancelClick() {
        this.OnBtnClose()
    }
}