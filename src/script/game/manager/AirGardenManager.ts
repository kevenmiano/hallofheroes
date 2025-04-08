import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { EmWindow } from "../constant/UIDefine";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";

import CommonMsg = com.road.yishi.proto.player.CommonMsg;
import CarnivalModel from "../module/carnival/model/CarnivalModel";

export class AirGardenManager {

    private static _instance: AirGardenManager;

    public static get Instance(): AirGardenManager {
        if (!this._instance) {
            this._instance = new AirGardenManager();
        }
        return this._instance;
    }

    public setup() {
        this.initEvent();
    }

    private initEvent() {
        ServerDataManager.Instance.addEventListener(S2CProtocol.U_C_MINI_GAME_OPEN, this.__gameStartBackHandler, this);
    }

    private __gameStartBackHandler(pkg: PackageIn) {
        let msg = pkg.readBody(CommonMsg) as CommonMsg;
        let type = Number(msg.param1);
        if (type == CarnivalModel.GAME_TYPE_1) {
            FrameCtrlManager.Instance.open(EmWindow.AirGardenGameLLK);
        } else if (type == CarnivalModel.GAME_TYPE_2) {
            FrameCtrlManager.Instance.open(EmWindow.AirGardenGameMemoryCard);
        } else if (type == CarnivalModel.GAME_TYPE_3) {
            FrameCtrlManager.Instance.open(EmWindow.AirGardenGameSuDuWnd);
        }
    }
}