/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2021-03-18 16:12:52
 * @LastEditors: jeremy.xu
 * @Description: 翻牌
 */

import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import FrameCtrlBase from "../../mvc/FrameCtrlBase";
import CampaignTakeCardsMsg = com.road.yishi.proto.campaign.CampaignTakeCardsMsg;

export default class ChestFrameCtrl extends FrameCtrlBase {

    show() {
        super.show()
    }

    hide() {
        super.hide()

    }

    // override
    protected addEventListener() {
        super.addEventListener()
        NotificationManager.Instance.addEventListener(CampaignMapEvent.UPDATE_CHEST_INFO, this.__updateCardHandler, this);
    }
    // override
    protected delEventListener() {
        super.delEventListener()
        NotificationManager.Instance.removeEventListener(CampaignMapEvent.UPDATE_CHEST_INFO, this.__updateCardHandler, this);
    }

    private __updateCardHandler(msg: CampaignTakeCardsMsg){
        this.view.__updateCardHandler(msg)
    }
        
    dispose(){
        super.dispose()
    }
}