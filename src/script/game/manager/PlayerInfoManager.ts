// @ts-nocheck
import Logger from '../../core/logger/Logger';
import { SocketManager } from '../../core/net/SocketManager';
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import { EmWindow } from '../constant/UIDefine';
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import { PlayerManager } from './PlayerManager';
import MountEditMsg = com.road.yishi.proto.campaign.MountEditMsg;
import DetailReqMsg = com.road.yishi.proto.simple.DetailReqMsg;
import InfoReqMsg = com.road.yishi.proto.simple.InfoReqMsg;
import PlayerPetOpMsg = com.road.yishi.proto.pet.PlayerPetOpMsg;
import { PlayerModel } from '../datas/playerinfo/PlayerModel';
import UserExtraJobReqMsg = com.road.yishi.proto.extrajob.UserExtraJobReqMsg;

/**
 * 查询其它玩家信息类 
 * 
 */
export class PlayerInfoManager {
    private static _instance: PlayerInfoManager;
    private _data: any;
    public static get Instance(): PlayerInfoManager {
        if (!PlayerInfoManager._instance) PlayerInfoManager._instance = new PlayerInfoManager();
        return PlayerInfoManager._instance;
    }

    public get data(): any {
        return this._data;
    }

    /**
     * 
     * @param value
     * @param opt 0 正常 10000 跨服 9999隐藏查看坐骑按钮
     * 
     */
    public show(value: any, opt: number = 0) {
        // FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.PLAYERINFO, null, { d: value, op: opt });

        FrameCtrlManager.Instance.open(EmWindow.PlayerInfoWnd, value);
        Logger.log("打开查看玩家信息界面")
    }

    /**
     * 查看玩家英灵信息
     * @param target_userid  玩家ID
     * @param petId 0查询当前参战ID
     */
    public sendRequestPetData(target_userid: number, petId: number = 0) {
        var msg: PlayerPetOpMsg = new PlayerPetOpMsg();
        msg.petId = petId;
        msg.targetUserid = target_userid;
        PlayerManager.Instance.currentPlayerModel.lookTargetUserId = target_userid;
        SocketManager.Instance.send(C2SProtocol.C_GET_PLAYER_PET_INFO, msg);
    }

    /**
     * 查看玩家坐骑信息
     * @param thaneId（领主ID）
     * 
     */
    public sendRequestMountInfo(thaneId: number) {
        var msg: MountEditMsg = new MountEditMsg();
        msg.param1 = thaneId;
        SocketManager.Instance.send(C2SProtocol.C_MOUNT_INFO_SEND, msg);
    }
    /**
     * 查看玩家装备
     * @param id（玩家ID）
     * @param needItem
     * @param needHero
     * @param needArmy
     * @param needPawn
     * 
     */
    public sendRequestEquip(id: number, needItem: boolean = false, needHero: boolean = false, needArmy: boolean = false, needPawn: boolean = false) {
        var msg: DetailReqMsg = new DetailReqMsg();
        msg.otherId = id;
        msg.itemInfo = needItem;
        msg.heroInfo = needHero;
        msg.armyInfo = needArmy;
        msg.pawnInfo = needPawn;
        SocketManager.Instance.send(C2SProtocol.C_BAG_EQUIPLOOK, msg);
    }

    /**
     * 查看用户简要信息
     * @param id（玩家ID）
     * 
     */
    public sendRequestSimpleInfo(id: number) {
        var msg: InfoReqMsg = new InfoReqMsg();
        msg.otherId = id;
        SocketManager.Instance.send(C2SProtocol.C_SIMPLEUSER_INFO, msg);
    }

    /**
     *跨服查询玩家信息 
     * @param id（玩家ID）
     * @param serverName（玩家所在服务器名）
     * 
     */
    public sendRequestSimpleInfoCross(id: number, serverName: string) {
        var msg: DetailReqMsg = new DetailReqMsg();
        msg.userId = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
        msg.serverName = PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
        msg.otherId = id;
        msg.otherName = serverName;
        SocketManager.Instance.send(C2SProtocol.CR_WARFIELD_USER_INFO, msg);
    }

    /**
     * 玩家专精信息请求(个人资料)
     * @param targetUserid 查看玩家ID
     */
    public reqUserExtraJobInfo(targetUserid: number) {
        let msg: UserExtraJobReqMsg = new UserExtraJobReqMsg();
        msg.targetUserid = targetUserid;
        SocketManager.Instance.send(C2SProtocol.C_USER_EXTRAJOB_REQ, msg);
    }
}