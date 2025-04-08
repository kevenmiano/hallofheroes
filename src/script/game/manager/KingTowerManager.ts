/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-22 12:04:42
 * @LastEditTime: 2021-04-22 12:14:15
 * @LastEditors: jeremy.xu
* @Description: 
*/

import LangManager from "../../core/lang/LangManager";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { AlertTipAction } from "../battle/actions/AlertTipAction";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { KingTowerInfo } from "../datas/kingtower/KingTowerInfo";
import SceneType from "../map/scene/SceneType";
import { DelayActionsUtils } from "../utils/DelayActionsUtils";

import KingTowerInfoMsg = com.road.yishi.proto.campaign.KingTowerInfoMsg

export class KingTowerManager {
    private _info: KingTowerInfo;
    private static _instance: KingTowerManager;
    public static get Instance(): KingTowerManager {
        if (KingTowerManager._instance == null) KingTowerManager._instance = new KingTowerManager();
        return KingTowerManager._instance;
    }

    public setup() {
        this.initEvent();
        this._info = new KingTowerInfo();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_KING_INFO, this, this.__updateKingTowerInfoHandler);
    }

    private __updateKingTowerInfoHandler(pkg: PackageIn) {
        var msg: KingTowerInfoMsg = pkg.readBody(KingTowerInfoMsg) as KingTowerInfoMsg;

        if (msg.hasOwnProperty("enterCount"))
            this._info.kingCount = msg.enterCount;

        if (msg.hasOwnProperty("maxIndex"))
            this._info.maxIndex = msg.maxIndex;

        if (msg.hasOwnProperty("currentIndex"))
            this._info.currentIndex = msg.currentIndex;

        if (msg.hasOwnProperty("currentStep"))
            this._info.currentStep = msg.currentStep;

        if (msg.hasOwnProperty("rewardCount")) {
            this._info.rewardCount = msg.rewardCount;
            if (this._info.rewardCount > 0) {
                var diffType: string = this._info.difficultyStep(this._info.currentStep);

                var str3: string = LangManager.Instance.GetTranslation("yishi.manager.KingTowerManager.str", diffType, this._info.currentIndex, this._info.rewardCount);
                DelayActionsUtils.Instance.addAction(new AlertTipAction(str3, this.KingTowerReport.bind(this), SceneType.PVE_ROOM_SCENE));
            }
        }
    }

    private KingTowerReport(str: string) {
        // TODO
        // SimpleAlertHelper.Instance.data = [str];
        // var confirm:string = LangManager.Instance.GetTranslation("public.confirm");
        // var prompt:string = LangManager.Instance.GetTranslation("public.prompt");
        // SimpleAlertHelper.Instance.Show(prompt,str,confirm,"",false,true,true,LayerManager.ALPHA_BLOCKGOUND,SimpleAlertHelper.SIMPLE_ALERT,210);
    }

    public get kingTowerInfo(): KingTowerInfo {
        return this._info;
    }

}