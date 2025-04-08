/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2024-02-19 17:41:13
 * @LastEditors: jeremy.xu
 * @Description: 选择战役控制类
 */

import { t_s_campaignData } from "../../../config/t_s_campaign";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";


export default class PveCampaignCtrl extends FrameCtrlBase {
    protected initDataPreShow() {
        super.initDataPreShow()
        if (this.frameData && this.frameData["campaignData"]) {
            this.data.taskCampaignTem = this.frameData["campaignData"] as t_s_campaignData;
        }
    }

    protected clearDataPreHide() {
        super.clearDataPreHide()
        this.data.taskCampaignTem = null;
    }
}