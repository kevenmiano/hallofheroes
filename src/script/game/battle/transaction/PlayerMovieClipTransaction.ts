// @ts-nocheck
import { PackageIn } from "../../../core/net/PackageIn";
import { TransactionBase } from "./TransactionBase";
import { S2CProtocol } from '../../constant/protocol/S2CProtocol';
import { NotificationManager } from "../../manager/NotificationManager";
import { SLGSocketEvent } from "../../constant/event/NotificationEvent";
import { SceneManager } from '../../map/scene/SceneManager';
import SceneType from "../../map/scene/SceneType";


import PlayerMovieMsg = com.road.yishi.proto.player.PlayerMovieMsg;
import MovieType from "../../map/space/constant/MovieType";
import { NodeState } from "../../map/space/constant/NodeState";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";

/**
 *  播放动画事务
 */
export class PlayerMovieClipTransaction extends TransactionBase {
    constructor() {
        super();
    }

    public handlePackage() {
        // 场景已经销毁了 在这里执行动作结束后的逻辑
        if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE && SceneManager.Instance.currentType != SceneType.SPACE_SCENE) {
            let msg: PlayerMovieMsg = this._pkg.readBody(PlayerMovieMsg) as PlayerMovieMsg;
            switch (msg.movieType) {
                case MovieType.DISAPPEARD: // CampaignActionsFactory.createAction
                    let mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
                    if (mapModel) {
                        var nodeInfo: CampaignNode = mapModel.getMapNodesById(msg.targetId);
                        if (nodeInfo && nodeInfo.info) {
                            nodeInfo.info.state = NodeState.DESTROYED;
                        }
                    }
                    break;
                default:
                    break;
            }
        }else{
            NotificationManager.Instance.dispatchEvent(SLGSocketEvent.U_PLAY_MOVIE, this._pkg);
        }
    }

    get pkg(): PackageIn {
        return this._pkg;
    }

    public getCode(): number {
        return S2CProtocol.U_C_PLAY_MOVIE;
    }
}