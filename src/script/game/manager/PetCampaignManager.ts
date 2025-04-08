import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PetCampaignEvent } from "../module/petCampaign/enum/PetCampaignEnum";
import PetCampaignModel from "../module/petCampaign/PetCampaignModel";
import UserUiPlayInfoMsg = com.road.yishi.proto.uiplay.UserUiPlayInfoMsg;
import UserUiPlayListMsg = com.road.yishi.proto.uiplay.UserUiPlayListMsg;
import UiPlayChallengeMsg = com.road.yishi.proto.uiplay.UiPlayChallengeMsg;
/**
 * 英灵战役管理类、持有Model的引用, 负责收发协议, 处理协议更新数据到Model, 并抛出事件
 * 
 */
export class PetCampaignManager extends GameEventDispatcher {
    private static _instance: PetCampaignManager;
    public static ISLOGIN:Boolean=true;
    private _model: PetCampaignModel = new PetCampaignModel();
    constructor() {
        super();
    }

    public static get Instance(): PetCampaignManager {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }

    public setup() {
        this.addEvent();
    }

    public get model(): PetCampaignModel {
        return this._model;
    }

    public addEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_UIPLAY_INFO, this, this._playInfoUpdate);
    }

    public removeEvent() {
        ServerDataManager.cancel(S2CProtocol.U_C_UIPLAY_INFO, this, this._playInfoUpdate);
    }

    public dispose() {
        this.removeEvent();
    }

    private _playInfoUpdate(pkg: PackageIn) {
        let msg: UserUiPlayInfoMsg = pkg.readBody(UserUiPlayInfoMsg) as UserUiPlayInfoMsg;
        if (msg) {
            this.model.userUiPlayInfoMsg = msg;
            let flag: boolean = false;
            let len: number = PetCampaignManager.Instance.model.userUiPlayListMsg.uiPlayInfoList.length;
            for (let i: number = 0; i < len; i++) {
                let item: UserUiPlayInfoMsg = PetCampaignManager.Instance.model.userUiPlayListMsg.uiPlayInfoList[i] as UserUiPlayInfoMsg;
                if (item && item.playId == msg.playId) {
                    item.firstRewardSet = msg.firstRewardSet;
                    item.levelSort = msg.levelSort;
                    item.uiPlayRewardCount = msg.uiPlayRewardCount;
                    flag = true;
                }
            }
            if (!flag && !msg.itemAdd) {
                PetCampaignManager.Instance.model.userUiPlayListMsg.uiPlayInfoList.push(msg);
            }
            this.dispatchEvent(PetCampaignEvent.PET_CAMPAIGN_UPDATE,msg);
        }
    }

    public updateUserUiPlayListInfo(msg: UserUiPlayListMsg) {
        this.model.userUiPlayListMsg = msg;
    }

    public setTreeSelectIndex(index: number) {
        this.model.setTreeSelectIndex(index);
        this.dispatchEvent(PetCampaignEvent.PET_CAMPAIGN_TREE_SELECT, index);
    }

    /**
     * 
     * @param playId 玩法id
     * @param levelId 关卡id
     */
    public sendUIPlayChallenge(op: number, playId: number, levelId: number) {
        let msg: UiPlayChallengeMsg = new UiPlayChallengeMsg();
        msg.op = op;
        msg.playId = playId;
        msg.levelID = levelId;
        SocketManager.Instance.send(C2SProtocol.C_UIPLAY_CHALLENGE, msg);
    }

}