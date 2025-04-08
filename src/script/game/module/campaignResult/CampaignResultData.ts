/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2021-03-17 17:31:50
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import FrameDataBase from "../../mvc/FrameDataBase";

import CampaignReportMsg = com.road.yishi.proto.campaign.CampaignReportMsg
export default class CampaignResultData extends FrameDataBase {
    public static AutoCloseTime = 5
    public static NUM = 0.0001
    public static EvaluateRes = ["Img_D_L", "Img_C_L", "Img_B_L", "Img_A_L", "Img_S_L"]
    public static EvaluateBgRes = ["Img_D_LBg", "Img_C_LBg", "Img_B_LBg", "Img_A_LBg", "Img_S_LBg"]
    public static EvaluateLRes = ["Lab_D", "Lab_C", "Lab_B", "Lab_A", "Lab_S"]

    
    show(){
        super.show()
    }

    hide(){
        super.hide()
    }

    dispose(){
        super.dispose()
    }

    getTestData(){
        let msg = new CampaignReportMsg()
        msg.totalGp = 500000
        msg.petGp = 10000
        msg.totalAppraisal = 4

        msg.vipJoin = 3000
        msg.teamJoin = 30001
        msg.friendJoin = 3002
        msg.propJoin = 3003
        msg.otherJoin = 3004

        msg.woundValue = 2000
        msg.hurtValue = 2000
        msg.failedCount = 2000
        msg.woundAppraisal = 2
        msg.hurtAppraisal = 3
        msg.failedAppraisal = 3
        return msg
    }
}