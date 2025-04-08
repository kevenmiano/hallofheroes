// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-02-03 20:17:48
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-20 10:34:57
 * @Description: 
 */
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { CampaignManager } from "../../manager/CampaignManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { TransactionBase } from "./TransactionBase";
import { S2CProtocol } from '../../constant/protocol/S2CProtocol';
import { t_s_campaignData } from "../../config/t_s_campaign";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { RoomManager } from "../../manager/RoomManager";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import Logger from "../../../core/logger/Logger";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { KingTowerManager } from "../../manager/KingTowerManager";
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { ArmyManager } from "../../manager/ArmyManager";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import Utils from "../../../core/utils/Utils";

/**
 *  退出副本事务, 清理副本数据
 */
export class CampaignOverTransaction extends TransactionBase {
    constructor() {
        super();
    }

    public handlePackage() {
        CampaignManager.Instance.exit = true;
        NotificationManager.Instance.dispatchEvent(NotificationEvent.UI_ENTER_SCENE);
        let campaignTemp: t_s_campaignData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_campaign, this.mapModel.mapTempInfo.CampaignId);
        if (campaignTemp && campaignTemp.Capacity == 1) {
            // TODO 连续 战斗-> 副本 ->内城  场景切不过去
            if (WorldBossHelper.checkIsNoviceMap(this.mapModel.mapId)) {
                Logger.info("[CampaignOverTransaction]新手战斗结束延迟回内城 ")
                Utils.delay(1000).then(()=>{
                    SwitchPageHelp.returnToSpace();
                })
            } else {
                Logger.info("[CampaignOverTransaction]单人战斗结束根据条件回到场景")
                RoomManager.Instance.dispose();
                SwitchPageHelp.returnToSpace();
            }
            return;
        }

        let max_tower: number = 0;
        let current_tower: number = 0;
        let current: number = 0;

        if (campaignTemp.isTrailTower) {//试炼之塔
            max_tower = this.playerInfo.maxTrialCount;
            current_tower = this.playerInfo.trialCount;
        } else if (campaignTemp.isKingTower) {//王者之塔
            max_tower = KingTowerManager.Instance.kingTowerInfo.maxKingCount;
            current_tower = KingTowerManager.Instance.kingTowerInfo.kingCount;
        } else if (campaignTemp.isTaila) {//泰拉神庙
            max_tower = this.playerInfo.tailaMaxCount;
            current_tower = max_tower - this.playerInfo.tailaCount;
        }

        current = max_tower - current_tower;

        let flag = false
        if (campaignTemp.SonTypes != 0 && current <= 0) {
            if (campaignTemp.isKingTower) {//王者之塔
                Logger.info("[CampaignOverTransaction]王者之塔次数不足 不进房间")
                flag = true;
            } else if (campaignTemp.isTaila) {//泰拉神庙
                Logger.info("[CampaignOverTransaction]泰拉神庙次数不足 不进房间")
                flag = true;
            } else {
                Logger.info("[CampaignOverTransaction]试炼之塔次数不足 不进房间")
                flag = true;
            }
        }
        if (flag) {
            Logger.info("[CampaignOverTransaction]退出房间 军队的主键id:", this.currentArmyId)
            CampaignSocketOutManager.Instance.sendReturnCampaignRoom(this.currentArmyId);
            RoomManager.Instance.dispose();
            SceneManager.Instance.setScene(SceneType.SPACE_SCENE, true, false);
            return;
        }

        Logger.info("[CampaignOverTransaction]战斗结束回到房间")
        SceneManager.Instance.setScene(SceneType.PVE_ROOM_SCENE);
    }

    public get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get currentArmyId(): number {
        var bArmy: any = ArmyManager.Instance.army;
        if (bArmy) {
            return bArmy.id;
        }
        return 0;
    }

    private get mapModel(): CampaignMapModel {
        return CampaignManager.Instance.mapModel;
    }

    public getCode(): number {
        return S2CProtocol.U_C_CAMPAIGN_FINISH;
    }

    public dispose() {
        super.dispose();
    }
}