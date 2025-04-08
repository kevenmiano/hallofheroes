// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-13 10:47:57
 * @LastEditTime: 2023-01-06 14:25:55
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { SocketManager } from "../../../core/net/SocketManager";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../constant/UIDefine";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { SocketSceneBufferManager } from "../../manager/SocketSceneBufferManager";
import SceneType from "../../map/scene/SceneType";
import FrameCtrlBase from "../../mvc/FrameCtrlBase";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { eMopupOptType, eMopupState, eMopupType } from "./MopupData";

import CampaignSweepRsp = com.road.yishi.proto.campaign.CampaignSweepRsp
import CampaignSweepReq = com.road.yishi.proto.campaign.CampaignSweepReq
import SweepResult = com.road.yishi.proto.campaign.SweepResult
export default class MopupCtrl extends FrameCtrlBase {
    constructor() {
        super()

        ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_SWEEP, this, this.__refreshMopupInfoHandler.bind(this));
    }

    show() {
        super.show()
    }

    hide() {
        super.hide()
    }

    private __refreshMopupInfoHandler(pkg: PackageIn) {
        this.data.beginChanges();
        let msg = pkg.readBody(CampaignSweepRsp) as CampaignSweepRsp;
        Logger.xjy("[MopupCtrl]__refreshMopupInfoHandler", msg)

        this.data.mopupEnd = false;
        this.data.resultInfoList = [];
        
        if (msg.campaignId != 0) {
            this.data.campaignId = msg.campaignId;
        }
        if (msg.dropItems) {
            this.data.mopupGoods = msg.dropItems;
        }
        if (msg.result.length > 0) {
            this.data.resultInfoList = new Array();
            for (var i: number = 0; i < msg.result.length; i++) {
                if (msg.result[i])
                    this.data.resultInfoList.push(msg.result[i]);
                if (msg.result[i].time)
                    this.data.mopupRemainTime = msg.result[i].time;
                if (msg.result[i].gp)
                    this.data.mopupExt += msg.result[i].gp;
                //下线上线返回结果删除物品列表中包含的结果包物品
                if (this.data.mopupGoods && this.data.mopupGoods.length > 0) {
                    for (var k: number = 0; k < msg.result[i].items.length; k++) {
                        for (var j: number = 0; j < this.data.mopupGoods.length; j++) {
                            if (msg.result[i].items[k].templateId == this.data.mopupGoods[j].templateId) {
                                this.data.mopupGoods[j].count -= msg.result[i].items[k].count;
                                if (this.data.mopupGoods[j].count <= 0) {
                                    this.data.mopupGoods.splice(j, 1); j--;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (msg.status) {
            var mopupTipData: string = "";
            switch (msg.status) {
                case 1:
                    if (!this.view) {
                        Logger.error("[MopupCtrl] 界面未打开");
                        return
                    }
                    this.view.setPage(true)
                    break;
                case 2:
                    //正在扫荡中
                    mopupTipData = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
                    MessageTipManager.Instance.show(mopupTipData);
                    break;
                case 3:
                    //黄金不足
                    mopupTipData = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData02");
                    MessageTipManager.Instance.show(mopupTipData);
                    break;
                case 4:
                    //钻石不够 TODO
                    // RechargeAlertMannager.Instance.show();
                    break;
                // case 5:
                //     // 找不到用户扫荡信息
                //     break;
                case 6:
                    //体力不足
                    mopupTipData = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData03");
                    MessageTipManager.Instance.show(mopupTipData);
                    break;
                case 7:
                    // if (msg.sweepType == 1)
                    //     mopupTipData = "该副本没有通关";
                    // else
                    //     mopupTipData = "请输入正确层数";
                    break;
                // case 8:
                //     "参数错误"
                //     break;
                case 9:
                    //"取消扫荡成功"
                    return;
                case 10:
                    //"上线返回结果"
                    this.data.mopupExt = msg.totalGp;
                    this.data.mopupEnd = true;
                    if (msg.result && msg.result.length > 0) {
                        if (msg.result[msg.result.length - 1].type == 1) {
                            this.data.mopupEnd = true;
                        }
                        else if (msg.result[msg.result.length - 1].type == 2) {
                            this.data.mopupEnd = false;
                        }
                        else {
                            this.data.mopupEnd = true;
                        }
                    }

                    Laya.timer.once(1000, this, () => {
                        SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, SceneType.SPACE_SCENE, this.enterSpaceShow.bind(this));
                    })
                    break;
                case 11:
                    //扫荡正常结束
                    this.data.mopupEnd = true;
                    this.data.isNormalEnd = true;
                    break;
                case 12:
                    //今日次数用完！
                    mopupTipData = LangManager.Instance.GetTranslation("maze.MazeFrame.command01");
                    MessageTipManager.Instance.show(mopupTipData);
                    break;
                case 14:
                    //扫荡层数须大于当前所在层数
                    mopupTipData = LangManager.Instance.GetTranslation("mopup.view.MazeMopupPrepareFrame.layerTipData2");
                    MessageTipManager.Instance.show(mopupTipData);
                    break;
                case 15:
                    //扫荡异常结束
                    this.data.mopupEnd = true;
                    this.data.isNormalEnd = false;
                    break;
            }
        }
        this.data.commit();
    }

    public enterSpaceShow(pkg: PackageIn) {
        let msg = pkg.readBody(CampaignSweepRsp) as CampaignSweepRsp;
        Logger.xjy("[MopupCtrl]enterSpaceShow", msg.sweepType)
        switch (msg.sweepType) {
            case eMopupType.CampaignMopup:
                FrameCtrlManager.Instance.open(EmWindow.Mopup, { type: eMopupType.CampaignMopup, state: eMopupState.CampaignMopuping });
                break;
            case eMopupType.MazeMopup:
                FrameCtrlManager.Instance.open(EmWindow.Mopup, { type: eMopupType.MazeMopup, state: eMopupState.MazeMopuping });
                break;
            case eMopupType.PetCampaignMopup:
                let result: SweepResult = msg.result[0] as SweepResult;
                FrameCtrlManager.Instance.open(EmWindow.Mopup, { type: eMopupType.PetCampaignMopup, state: eMopupState.PetCampaignMopupping, UiLevelId: result.eIndex });
                break;
        }
    }

    /**
     *发送扫荡信息
     */
    public sendMopupInfo(sweep_type: number, op_type: number, campaign_id: number = 0, count: number = 0, eIndex: number = 0, enterType: number = 1, openSilverBox: boolean = false, openSecretBox: boolean = false, payType: number = 2) {
        if (op_type == eMopupOptType.GetResult) {
            Logger.xjy("[MopupCtrl]sendMopupInfo GetResult")
        }
        let msg: CampaignSweepReq = new CampaignSweepReq();
        msg.sweepType = sweep_type;
        msg.opType = op_type;
        msg.campaignId = campaign_id;
        msg.count = count;
        msg.eIndex = eIndex;
        msg.enterType = enterType
        msg.openSilverBox = openSilverBox;
        msg.openSecretBox = openSecretBox;
        msg.payType = payType;
        SocketManager.Instance.send(C2SProtocol.C_CAMPAIGN_SWEEP, msg);
    }
}
