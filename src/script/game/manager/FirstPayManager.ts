import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { NotificationEvent } from "../constant/event/NotificationEvent";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import FirstPayModel from '../module/firstpay/FirstPayModel';
import { NotificationManager } from "./NotificationManager";
import FirstChargeAwardMsg  = com.road.yishi.proto.active.FirstChargeAwardMsg;
import FirstChargeAwardInfo = com.road.yishi.proto.active.FirstChargeAwardInfo;
import TakeFirstChargeAwardReq = com.road.yishi.proto.active.TakeFirstChargeAwardReq;
import UIManager from "../../core/ui/UIManager";
import { EmWindow } from "../constant/UIDefine";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { ArmyManager } from "./ArmyManager";
import OpenGrades from "../constant/OpenGrades";
import { PlayerManager } from "./PlayerManager";
import { PlayerEvent } from "../constant/event/PlayerEvent";

export default class FirstPayManager
{
    private static _instance: FirstPayManager

    private _model:FirstPayModel;
    /** 本次登录已经打开过 */
    private thisLoginHasOpened: boolean;

    public static get Instance(): FirstPayManager {
        if (!FirstPayManager._instance)
        FirstPayManager._instance = new FirstPayManager();
        return FirstPayManager._instance;
    }

    public get model():FirstPayModel {
        return this._model;
    }

    public setup() {
        this.thisLoginHasOpened = false;
        this._model = new FirstPayModel();
        
        ServerDataManager.listen(S2CProtocol.U_C_FIRST_CHARGE_AWARD, this, this._firstPayDataHandler);

        NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this._onCheckOpenFirstPayHandler, this);
        ArmyManager.Instance.thane.removeEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this._onHeroLevelUpdateHandler, this); 
    }

    private _firstPayDataHandler(pkg: PackageIn)
    {
        let msg:FirstChargeAwardMsg = pkg.readBody(FirstChargeAwardMsg) as FirstChargeAwardMsg;
        for(let i:number = 0; i <msg.awardInfo.length;i++){
            let item:FirstChargeAwardInfo= msg.awardInfo[i] as FirstChargeAwardInfo;
            if(item)
            {
                this._model["state" + (i+1)] = item.state;
                this._model.day = item.days;
            }
        }
        NotificationManager.Instance.dispatchEvent(NotificationEvent.FIRSTPAY_DATA_UPDATE);
    }

    /**
     * 玩家等级变更
     */
    private _onHeroLevelUpdateHandler(): void {
        if (ArmyManager.Instance.thane.grades == OpenGrades.FIRST_PAY) { 
            this._onCheckOpenFirstPayHandler(null);
        } 
    }

    /**
     * 打开首充
     */
    private _onCheckOpenFirstPayHandler(e: NotificationEvent): void {
        //本次登录打开过就不重复打开
        if (this.thisLoginHasOpened) {
            return;
        }

        //9级开启首充后
        if (ArmyManager.Instance.thane.grades < OpenGrades.FIRST_PAY) { 
            return;
        } 

        //如在战斗界面不弹，切换至外城，内城，天空之城场景时弹出
        if (!this.canOpenInCurrentScene) {
            return;
        }

        //已领取完成：不再弹出首充界面
        if (this.isClaimRewardsComplete) {
            return;
        }

        //未充值/未领取完时
        if (!PlayerManager.Instance.currentPlayerModel.playerInfo.isFirstCharge || this.canClaimRewards) {
            UIManager.Instance.ShowWind(EmWindow.FirstPayWnd); 
            this.thisLoginHasOpened = true;
        }
    }

    /**
     * 能否在当前场景打开
     * @returns 
     */
    private get canOpenInCurrentScene(): boolean {
        //首充开启弹窗：9级开启首充后，弹出界面，如在战斗界面不弹，切换至外城，内城，天空之城场景时弹出		
        if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE 
            || SceneManager.Instance.currentType == SceneType.CASTLE_SCENE 
            || SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
                return true;
        } 

        return false;
    }

    /**
     * 是否可领取
     */
    private get canClaimRewards(): boolean {
        for (let i: number = 1; i <= 3; i++) {
            const state: number = this._model["state" + i];
            if (state == FirstPayModel.CAN_GET) {
                return true;
            }
        }

        return false;
    }

    /**
     * 领取奖励完成
     */
    private get isClaimRewardsComplete(): boolean {
        for (let i: number = 1; i <= 3; i++) {
            const state: number = this._model["state" + i];
            if (state == FirstPayModel.CAN_GET || state == FirstPayModel.UNABLE_GET) {
                return false;
            }
        }

        return true;
    }

    /**
     * 领取奖励
     */
    public getReward()
    {
        var msg: TakeFirstChargeAwardReq = new TakeFirstChargeAwardReq();
		SocketManager.Instance.send(C2SProtocol.C_TAKE_FIRST_CHARGE_REWARD, msg);
    }
}