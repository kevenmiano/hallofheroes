// @ts-nocheck
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import ByteArray from "../../core/net/ByteArray";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import BaseChannel from "../../core/sdk/base/BaseChannel";
import { NativeChannel } from "../../core/sdk/native/NativeChannel";
import SDKManager from "../../core/sdk/SDKManager";
import WanChannel from "../../core/sdk/wan/WanChannel";
import { RPT_EVENT, RPT_EVENT_PREFIX } from "../../core/thirdlib/RptEvent";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import StoreRatingAction from "../action/hero/StoreRatingAction";
import { TransferOuterCityAction } from "../action/map/TransferOuterCityAction";
import { FriendUpdateEvent, NotificationEvent, OuterCityEvent, PetEvent, RequestInfoEvent, ServiceReceiveEvent, ShopEvent } from "../constant/event/NotificationEvent";
import { PlayerEvent } from "../constant/event/PlayerEvent";
import { GameEventCode } from "../constant/GameEventCode";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { StoreRatingsType } from "../constant/StoreRatingsType";
import { EmWindow } from "../constant/UIDefine";
import FriendItemCellInfo from "../datas/FriendItemCellInfo";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { BattleGuardInfo } from "../datas/playerinfo/BattleGuardInfo";
import { BattleGuardSocketInfo } from "../datas/playerinfo/BattleGuardSocketInfo";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../datas/playerinfo/PlayerModel";
import { SimpleMountInfo } from "../datas/playerinfo/SimpleMountInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { TowerInfo } from "../datas/playerinfo/TowerInfo";
import RequestInfoRientation from "../datas/RequestInfoRientation";
import { TipMessageData } from "../datas/TipMessageData";
import { CampaignArmy } from "../map/campaign/data/CampaignArmy";
import { MineralCarInfo } from "../map/campaign/data/MineralCarInfo";
import BuildingManager from "../map/castle/BuildingManager";
import { BuildInfo } from "../map/castle/data/BuildInfo";
import SpaceNodeType from "../map/space/constant/SpaceNodeType";
import { SpaceNode } from "../map/space/data/SpaceNode";
import SpaceManager from "../map/space/SpaceManager";
import { PetData } from "../module/pet/data/PetData";
import { OptType } from "../module/setting/SettingData";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { CampaignMapModel } from "../mvc/model/CampaignMapModel";
import MineralModel from "../mvc/model/MineralModel";
import { PlayerEffectHelper } from "../utils/PlayerEffectHelper";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import { ArmyManager } from "./ArmyManager";
import { CampaignManager } from "./CampaignManager";
import { ConfigManager } from "./ConfigManager";
import { FriendManager } from "./FriendManager";
import { GameBaseQueueManager } from "./GameBaseQueueManager";
import IMManager from "./IMManager";
import { MessageTipManager } from "./MessageTipManager";
import { NotificationManager } from "./NotificationManager";
import { ShopManager } from "./ShopManager";
import { SocketGameReader } from "./SocketGameReader";
import { SocketSendManager } from "./SocketSendManager";
import { TaskTraceTipManager } from "./TaskTraceTipManager";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import { BottleManager } from "./BottleManager";
import Dictionary from "../../core/utils/Dictionary";
import HeadFrameInfo from "../module/bag/view/HeadFrameInfo";
import HeadIconModel from "../module/bag/view/HeadIconModel";
import { SharedManager } from "./SharedManager";
import ExtraJobModel from "../module/bag/model/ExtraJobModel";
import { ExtraJobItemInfo } from "../module/bag/model/ExtraJobItemInfo";
import { ExtraJobEquipItemInfo } from "../module/bag/model/ExtraJobEquipItemInfo ";

import SynchronizedTimeMsg = com.road.yishi.proto.player.SynchronizedTimeMsg;
import TowerInfoMsg = com.road.yishi.proto.campaign.TowerInfoMsg;
import TowerListMsg = com.road.yishi.proto.campaign.TowerListMsg;
import PropertyUpdatedMsg = com.road.yishi.proto.player.PropertyUpdatedMsg;
import PlayerMsg = com.road.yishi.proto.player.PlayerMsg;
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import InfoReqMsg = com.road.yishi.proto.simple.InfoReqMsg;
import DetailReqMsg = com.road.yishi.proto.simple.DetailReqMsg;
import PlayerPetMsg = com.road.yishi.proto.pet.PlayerPetMsg;
import PetInfoMsg = com.road.yishi.proto.pet.PetInfoMsg;
import HeroWatchMsg = com.road.yishi.proto.watch.HeroWatchMsg;
import HeroWatchOpMsg = com.road.yishi.proto.watch.HeroWatchOpMsg;
import ItemSmithyMsg = com.road.yishi.proto.item.ItemSmithyMsg;
import RoomPlayerListMsg = com.road.yishi.proto.room.RoomPlayerListMsg;
import RoomPlayerMsg = com.road.yishi.proto.room.RoomPlayerMsg;
import InfoRspMsg = com.road.yishi.proto.simple.InfoRspMsg;
import SimpleHeroInfoMsg = com.road.yishi.proto.army.SimpleHeroInfoMsg;
import RelationPlayerMsg = com.road.yishi.proto.simple.RelationPlayerMsg;
import RefuseFriendRspMsg = com.road.yishi.proto.player.RefuseFriendRspMsg;
import PlayerSettingMsg = com.road.yishi.proto.player.PlayerSettingMsg;
import MultiCampaignEnterCountMsg = com.road.yishi.proto.player.MultiCampaignEnterCountMsg;
import CastleReqMsg = com.road.yishi.proto.castle.CastleReqMsg;
import DetailRspMsg = com.road.yishi.proto.simple.DetailRspMsg;
import MountInfoMsg = com.road.yishi.proto.campaign.MountInfoMsg;
import FateEditMsg = com.road.yishi.proto.fate.FateEditMsg;
import FateListMsg = com.road.yishi.proto.fate.FateListMsg;
import FetchTokenReq = com.road.yishi.proto.voice.FetchTokenReq;
import FetchTokenRsp = com.road.yishi.proto.voice.FetchTokenRsp;
import ChargeProductCountList = com.road.yishi.proto.charge.ChargeProductCountList;
import ChargeOrderArrive = com.road.yishi.proto.charge.ChargeOrderArrive;
import TramcarInfoMsg = com.road.yishi.proto.campaign.TramcarInfoMsg;
import QueryCollectCampaignNodeRspMsg = com.road.yishi.proto.player.QueryCollectCampaignNodeRspMsg;
import CollectCampaignNodeMsg = com.road.yishi.proto.player.CollectCampaignNodeMsg;
import StoreRatingsNotifyInfo = com.road.yishi.proto.storeratings.StoreRatingsNotifyInfo;
import StoreRatingsReport = com.road.yishi.proto.storeratings.StoreRatingsReport;
import StoreRatingsResp = com.road.yishi.proto.storeratings.StoreRatingsResp;
import MicroTerminalInfo = com.road.yishi.proto.microterminal.MicroTerminalInfo;
import HonorEquipInfoMsg = com.road.yishi.proto.simple.HonorEquipInfoMsg;
import HonorEquipReq = com.road.yishi.proto.simple.HonorEquipReq;
import TimeZoneMsg = com.road.yishi.proto.player.TimeZoneMsg;
import GoldImposeReqMsg = com.road.yishi.proto.simple.GoldImposeReqMsg;
import LotteryRuneRspMsg = com.road.yishi.proto.army.LotteryRuneRspMsg;
import PetDetailMsg = com.road.yishi.proto.pet.PetDetailMsg;
import SimpleItemInfoMsg = com.road.yishi.proto.simple.SimpleItemInfoMsg;
import PetDetailMsgList = com.road.yishi.proto.pet.PetDetailMsgList;
import FrameInfoMsgList = com.road.yishi.proto.frame.FrameInfoMsgList;
import FrameInfoMsg = com.road.yishi.proto.frame.FrameInfoMsg;
import ExtraJobReqMsg = com.road.yishi.proto.extrajob.ExtraJobReqMsg;
import ExtraJobEquipReqMsg = com.road.yishi.proto.extrajob.ExtraJobEquipReqMsg;
import ExtraJobItemMsg = com.road.yishi.proto.extrajob.ExtraJobItemMsg;
import ExtraJobEquipItemMsg = com.road.yishi.proto.extrajob.ExtraJobEquipItemMsg;
import UserExtraJobMsg = com.road.yishi.proto.extrajob.UserExtraJobMsg;
import ExtraJobEquipMsg = com.road.yishi.proto.extrajob.ExtraJobEquipMsg;
import ExtraJobMsg = com.road.yishi.proto.extrajob.ExtraJobMsg;
import CustomerIsReplyMsg = com.road.yishi.proto.customer.CustomerIsReplyMsg;
import UserBindReward = com.road.yishi.proto.player.UserBindReward;
import UserIsBind = com.road.yishi.proto.player.UserIsBind;
import HiSkillInfoMsg = com.road.yishi.proto.consortia.HiSkillInfoMsg;
import { ConsortiaSocketOutManager } from "./ConsortiaSocketOutManager";

/**
 *玩家信息处理与服务器交互类
 *
 */
export class PlayerManager extends GameEventDispatcher {
    private static _instance: PlayerManager;

    public static get Instance(): PlayerManager {
        if (!this._instance) {
            this._instance = new PlayerManager();
        }
        return this._instance;
    }

    public loginState: number = -1;
    private _playerModel: PlayerModel;
    private _watingList: SimpleDictionary;

    /**
     * 玩家充值数据
     */
    public productData: Map<string, number> = null;

    /**
     * 玩家当天充值数据
     */
    public productTodayData: Map<string, number> = null;

    /**
    * 玩家周充值数据
    */
    public productWeekData: Map<string, number> = null;

    /**
     * 是否存在新手遮罩
     */
    public isExistNewbieMask: boolean;

    /**
     * 是否存在评分
     */
    public isExistScoreRating: boolean = false;
    public scoreRatingCondition: number = 0;

    /**
     * 是否已领取奖励
     */
    public hasRecMicroAppReward: boolean = false;

    public get isScoreRatingApp(): boolean {
        let sourceId = NativeChannel.sourceId;
        //
        Logger.warn("app SournceId:", sourceId);
        if (sourceId == "0" || sourceId == "1") {
            return true;
        }
        return false;
    }

    constructor() {
        super();
        this._playerModel = new PlayerModel();
        this._watingList = new SimpleDictionary();
        this.productData = new Map();
        this.productTodayData = new Map();
        this.productWeekData = new Map();
    }


    /**
     * 设置新版新手进度
     */
    public set newNoviceProcess(id: string) {
        this.currentPlayerModel.playerInfo.newNoviceProcess = id;
    }
    public get newNoviceProcess(): string {
        return this.currentPlayerModel.playerInfo.newNoviceProcess;
    }

    public setup() {
        this.initEvent();
    }

    public initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_PLAYER_INFO, this, this.__uPlayerInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_REFUSEFRIEND_REFRESH, this, this.__uRefusefriend);
        ServerDataManager.listen(S2CProtocol.U_C_REFUSEINVITE_REFRESH, this, this.__uRefuseInvite);
        ServerDataManager.listen(S2CProtocol.U_C_PLAYER_SETTING, this, this.__recvPlayerSetting);
        ServerDataManager.listen(S2CProtocol.U_C_REFUSETEAMINVITE_REFRESH, this, this.__uRefuseTeamInvite);
        ServerDataManager.listen(S2CProtocol.U_C_PLAYER_EFFECT, this, this.__playerEffectHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ITEM_SMITH, this, this.__addComposeTempHandler);
        ServerDataManager.listen(S2CProtocol.U_C_BUILDING_TRANSCASTLE, this, this.__transferCastleHandler);
        ServerDataManager.listen(S2CProtocol.U_C_TRASNBUILDING_RESULT, this, this.__transferResultHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_WAITING_PLAYER_LIST, this, this.__playerListHandler);
        // ServerDataManager.listen(S2CProtocol.U_C_OFFLINE_REWARD, this, this.__hookRewardHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SIMPLEUSER_INFO, this, this.__getSimpleInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_CH_SIMPLEUSER_INFO, this, this.__getSimpleAndSnsInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_TOWERINFO, this, this.__towerInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_TOWERLIST, this, this.__towerListHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SYNCHRONIZED_TIME, this, this.__sysTimeHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ENTER_COPY_NUM_REFRESH, this, this.__uPlayerEnterCopyNumHandler);
        // ServerDataManager.listen(S2CProtocol.U_C_OPEN_CUSTOMER, this, this._openCustomerHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CROSS_USER_INFO, this, this.__crossPlayerInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_DAYGESTE_SEND, this, this.__daygesteUpdateHandler);
        // ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_PROFILE_CHANGE, this, this.__vehicleProfileChangeHandler);
        // ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_LIST_RSP, this, this.__receiveVehicleListHandler);
        // ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_TECH_RSP, this, this.__vehicleTechHandler);
        ServerDataManager.listen(S2CProtocol.U_C_PLAYER_PETINFO, this, this.__petInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_PLAYER_LOGIN_SYNC_MAPID, this, this.__loginSyncMapIdHandler);
        ServerDataManager.listen(S2CProtocol.U_C_BAG_EQUIPLOOK, this, this.__receiveEquipHandler);
        ServerDataManager.listen(S2CProtocol.U_C_MOUNT_INFO_SEND, this, this.__recvPlayerMountInfo);
        ServerDataManager.listen(S2CProtocol.U_C_RECEIVE_PET_DATA, this, this.__receivePetDataHandler);
        ServerDataManager.listen(S2CProtocol.U_C_BATTLEGUARD_INFO, this, this.__battleguardInfoHandler);
        // ServerDataManager.listen(S2CProtocol.U_C_DRAGON_REQ, this, this.__dragonSoulReqHandler);
        ServerDataManager.listen(S2CProtocol.U_C_FETCH_TOKEN, this, this.onRecvToken);
        ServerDataManager.listen(S2CProtocol.U_C_CHANGE_PRODUCT_COUNT, this, this.onRecvProductCount);
        ServerDataManager.listen(S2CProtocol.U_C_CHANGE_PRODUCT_TODAYCOUNT, this, this.onRecvTodayProductCount);
        ServerDataManager.listen(S2CProtocol.U_C_CHANGE_PRODUCT_WEEKCOUNT, this, this.onRecvWeekProductCount);
        ServerDataManager.listen(S2CProtocol.U_C_CHARGE_ARRIVE, this, this.onRecvChargeArrive);
        ServerDataManager.listen(S2CProtocol.U_C_SYNC_MINE_TRAMCAR, this, this.__mineralHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SELECT_NEW_YEAR_BOX_NODE, this, this.__receiveYearNodeDataHandler);
        // ServerDataManager.listen(S2CProtocol.U_C_TRANSFER, this, this.__dragonSoulTransferHandler);
        // ServerDataManager.listen(S2CProtocol.U_C_TRANS_GRADE, this, this.__dragonSoulTransferInfoHandler);
        // ServerDataManager.listen(S2CProtocol.U_C_VICEPASSWORD, this, this.__vicePassword);
        ServerDataManager.listen(S2CProtocol.U_C_STORE_RATINGS_NOTIFY, this, this.__storeRatingNotify)
        ServerDataManager.listen(S2CProtocol.U_C_STORE_RATINGS_REPORT_RESP, this, this.__storeRatingRsp);
        ServerDataManager.listen(S2CProtocol.U_C_MICRO_TERMINAL_REWARD, this, this.__microAppInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_HONOR_EQUIP, this, this._onRecvHonorEquipInfo);
        ServerDataManager.listen(S2CProtocol.U_C_TIME_ZONE, this, this.__onReceTimeZone);
        ServerDataManager.listen(S2CProtocol.U_C_LOTTERY_RUNE_INFO, this, this.onRecvLottery);
        ServerDataManager.listen(S2CProtocol.U_C_PET_ARTIFACT_LIST, this, this.__receivePetArtifactDataHandler);
        ServerDataManager.listen(S2CProtocol.U_C_FRAME_LIST, this, this.__frameListHandler);
        ServerDataManager.listen(S2CProtocol.U_EXTRAJOB_DETAIL, this, this.__onRecvExtraJobDetail);
        ServerDataManager.listen(S2CProtocol.U_EXTRAJOB_EQUIP_LIST, this, this.__onRecvExtraJobEquipList);
        ServerDataManager.listen(S2CProtocol.U_EXTRAJOB_LIST, this, this.__onRecvExtraJobList);

        //用户绑定相关
        ServerDataManager.listen(S2CProtocol.U_C_ACCOUNT_BIND_RESP, this, this.__onRecvAccountBindResp);
        ServerDataManager.listen(S2CProtocol.U_C_UPACCOUNT_REWARD_RESP, this, this.__onRecvUpAccountRewardResp);

        ServerDataManager.listen(S2CProtocol.U_C_KF_ISREPLY_RESP, this, this._onRecvCustomerisReplyResp);
    }

    /**请求绑定状态 */
    public reqUserBindState() {
        SocketManager.Instance.send(C2SProtocol.C_USER_BIND_QUERY);
    }

    /**请求领取奖励 */
    public reqUserBindReward() {
        SocketManager.Instance.send(C2SProtocol.C_USER_UPACCOUNT_REWARD);
    }

    /**请求客服是否有新回复消息 */
    public reqCustomerIsReply() {
        SocketManager.Instance.send(C2SProtocol.C_KF_REPLY_QUERY);
    }

    private _customerReplyState: boolean = false;

    private _onRecvCustomerisReplyResp(pkg: PackageIn) {
        let msg: CustomerIsReplyMsg = pkg.readBody(CustomerIsReplyMsg) as CustomerIsReplyMsg;
        this._customerReplyState = msg.isreply;
        NotificationManager.Instance.dispatchEvent(NotificationEvent.CUSTOMER_SERVICE_REPLY);
    }

    private __onRecvUpAccountRewardResp(pkg: PackageIn) {
        let msg: UserBindReward = pkg.readBody(UserBindReward) as UserBindReward;
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        playerInfo.userBindState = msg.ret;//-1:不能领取 -2: 领取过了  1:领取成功
        playerInfo.isBindReward = msg.ret == -2 || msg.ret == 1;
        NotificationManager.Instance.dispatchEvent(NotificationEvent.USER_BIND_REWARD);
    }

    private __onRecvAccountBindResp(pkg: PackageIn) {
        let msg: UserIsBind = pkg.readBody(UserIsBind) as UserIsBind;
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        playerInfo.isBindReward = msg.isReward;
        NotificationManager.Instance.dispatchEvent(NotificationEvent.USER_IS_BIND);
    }

    //返回玩家秘典列表  msg.op //0:全量（初始化） >0：更新 msg.activeList // 激活秘典列表
    private __onRecvExtraJobList(pkg: PackageIn) {
        let msg: ExtraJobMsg = pkg.readBody(ExtraJobMsg) as ExtraJobMsg;
        if (msg) {
            Logger.info("[PlayerManager]返回玩家秘典列表", msg)
            let len = msg.activeList.length;
            for (let i = 0; i < len ; i++) {
                const element:ExtraJobItemMsg =  msg.activeList[i] as ExtraJobItemMsg;
                let itemInfo:ExtraJobItemInfo = new ExtraJobItemInfo();
                itemInfo.jobType = element.jobType;
                itemInfo.jobLevel = element.jobLevel;
                itemInfo.skillScript = element.skillScript;
                ExtraJobModel.instance.updateItemInfo(itemInfo);
                if(msg.op == 99){//升级后更新
                    this.thane.skillCate.updateExtraJobSkill(itemInfo);
                }
            }  
            if (msg.op == 0) {
                ArmyManager.Instance.thane.skillCate.initExtraJobSkill();
            }
        }
    }
 
    //返回玩家魂器列表  msg.op //0:全量（初始化） >0：更新  msg.equipList// 激活魂器列表
    private __onRecvExtraJobEquipList(pkg: PackageIn) {
        let msg: ExtraJobEquipMsg = pkg.readBody(ExtraJobEquipMsg) as ExtraJobEquipMsg;
        if (msg) {
            Logger.info("[PlayerManager]返回玩家魂器列表", msg)
            for (let i = 0; i <  msg.equipList.length; i++) {
                const element:ExtraJobEquipItemMsg =  msg.equipList[i] as ExtraJobEquipItemMsg;
                let itemInfo:ExtraJobEquipItemInfo = new ExtraJobEquipItemInfo();
                itemInfo.equipType = element.equipType;
                itemInfo.equipLevel = element.equipLevel;
                itemInfo.strengthenLevel = element.strengthenLevel;
                itemInfo.join1 = element.join1;
                itemInfo.join2 = element.join2;
                itemInfo.join3 = element.join3;
                itemInfo.join4 = element.join4;
                ExtraJobModel.instance.updateEquipItemInfo(itemInfo);
            }  
        }
    }

    //返回玩家专精信息列表
    private __onRecvExtraJobDetail(pkg: PackageIn) {
        let msg: UserExtraJobMsg = pkg.readBody(UserExtraJobMsg) as UserExtraJobMsg;
        if (msg) {
            Logger.info("[PlayerManager]返回玩家专精信息列表", msg)
            msg.targetUserid//查看玩家ID
            msg.activeList// 激活秘典列表
            msg.equipList// 激活魂器列表
            let activeList = [];
            let equipList = [];
            for (let i = 0; i <  msg.equipList.length; i++) {
                const element:ExtraJobEquipItemMsg =  msg.equipList[i] as ExtraJobEquipItemMsg;
                let itemInfo:ExtraJobEquipItemInfo = new ExtraJobEquipItemInfo();
                itemInfo.equipType = element.equipType;
                itemInfo.equipLevel = element.equipLevel;
                itemInfo.strengthenLevel = element.strengthenLevel;
                itemInfo.join1 = element.join1;
                itemInfo.join2 = element.join2;
                itemInfo.join3 = element.join3;
                itemInfo.join4 = element.join4;
                equipList.push(itemInfo);
            }
            for (let i = 0; i <  msg.activeList.length; i++) {
                const element:ExtraJobItemMsg =  msg.activeList[i] as ExtraJobItemMsg;
                let itemInfo:ExtraJobItemInfo = new ExtraJobItemInfo();
                itemInfo.jobType = element.jobType;
                itemInfo.jobLevel = element.jobLevel;
                itemInfo.skillScript = element.skillScript;
                activeList.push(itemInfo);
            }
            this.dispatchEvent(RequestInfoEvent.QUERY_MASTERY_RESULT,[equipList,activeList])
        }
       
    }

    //返回头像框信息  op = 1;// 0:初始化全量 1:新增/修改
    private __frameListHandler(pkg: PackageIn) {
        let msg: FrameInfoMsgList = pkg.readBody(FrameInfoMsgList) as FrameInfoMsgList;
        let flag: boolean = false;
        if (msg) {
            if (msg.op == 0) {//返回所有的头像框
                HeadIconModel.instance.allHeadFrameList = new Dictionary();
                HeadIconModel.instance.allHeadFrameFrameIdList = [];
                for (let i: number = 0; i < msg.frames.length; i++) {
                    let item: FrameInfoMsg = msg.frames[i] as FrameInfoMsg;
                    let headFrameInfo: HeadFrameInfo = new HeadFrameInfo();
                    if (item) {
                        headFrameInfo.frameId = item.frameId;
                        headFrameInfo.isUse = item.isUse;
                        if (SharedManager.Instance.headIconClickDic[headFrameInfo.frameId]) {
                            headFrameInfo.clickNum = SharedManager.Instance.headIconClickDic[headFrameInfo.frameId];
                        } else {
                            headFrameInfo.clickNum = 0;
                        }
                        HeadIconModel.instance.allHeadFrameFrameIdList.push(headFrameInfo.frameId);
                        HeadIconModel.instance.allHeadFrameList.set(headFrameInfo.frameId, headFrameInfo);
                        if (headFrameInfo.isUse == 1) {
                            HeadIconModel.instance.currentEquipFrameId = headFrameInfo.frameId;
                        }
                    }
                }
            } else {
                HeadIconModel.instance.currentEquipFrameId = 0;
                for (let i: number = 0; i < msg.frames.length; i++) {
                    let item: FrameInfoMsg = msg.frames[i] as FrameInfoMsg;
                    if (item) {
                        let headFrameInfo: HeadFrameInfo = new HeadFrameInfo();
                        headFrameInfo.frameId = item.frameId;
                        headFrameInfo.isUse = item.isUse;
                        headFrameInfo.clickNum = 1;
                        if (headFrameInfo.isUse == 1) {
                            HeadIconModel.instance.currentEquipFrameId = headFrameInfo.frameId;
                        }
                        HeadIconModel.instance.allHeadFrameList.set(item.frameId, headFrameInfo);
                        if (HeadIconModel.instance.allHeadFrameFrameIdList.indexOf(item.frameId) == -1) {//新增的
                            headFrameInfo.clickNum = 0;
                            HeadIconModel.instance.allHeadFrameFrameIdList.push(headFrameInfo.frameId);
                            flag = true;
                        }
                    }
                }
            }
            SharedManager.Instance.saveHeadIconClickDic();
            NotificationManager.Instance.sendNotification(NotificationEvent.UPDATE_HEADFRAME_INFO);
            if (flag) {//有新激活的头像框，加红点提示
                NotificationManager.Instance.sendNotification(NotificationEvent.UPDATE_HEADFRAME_ACTIVE);
            }
        }
    }


    private onRecvLottery(pkg: PackageIn): void {
        let msg: LotteryRuneRspMsg = pkg.readBody(LotteryRuneRspMsg) as LotteryRuneRspMsg;
        if (msg) {
            let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
            playerInfo.runePowerPoint = msg.powerPointNum;
            playerInfo.dispatchEvent(PlayerEvent.RUNE_GEM_ENERGY, playerInfo);
        }
    }

    /**
     * 登录会推送这条消息, 告知当前服务器时区及offset , 跨夏令时或冬令时时会全服推送
     * @param pkg 
     */
    private __onReceTimeZone(pkg: PackageIn) {
        let msg = pkg.readBody(TimeZoneMsg) as TimeZoneMsg;
        if (this._playerModel) {
            this._playerModel.zoneId = msg.castleZoneId;
            this._playerModel.zoneOffset = msg.castleOffset;
        }
    }

    /**
     * 更新荣誉装备等级信息  对应HonorEquipInfoMsg结构 登录推送 和请求升级后返回
     * @param pkg 
     */
    private _onRecvHonorEquipInfo(pkg: PackageIn) {
        let msg = pkg.readBody(HonorEquipInfoMsg) as HonorEquipInfoMsg;
        if (msg) {
            this.thane.honorEquipLevel = msg.level;
            this.thane.honorEquipStage = msg.stage;
            NotificationManager.Instance.dispatchEvent(NotificationEvent.HONOR_EQUIP_LEVELUP);
        }
    }

    private __mineralHandler(pkg: PackageIn) {
        let msg = pkg.readBody(TramcarInfoMsg) as TramcarInfoMsg;
        let leng: number = msg.carInfo.length;
        if (!this.mineralModel) return;
        this.mineralModel.maxCount = msg.count;
        this.mineralModel.multiple = msg.multiple;
        if (leng > 1) this.mineralModel.resetCarInfos();
        for (let i: number = 0; i < leng; i++) {
            let userId: number = (msg.carInfo[i]).userId;
            let info: MineralCarInfo = this.mineralModel.getCarInfoById(userId);
            if (!info) info = new MineralCarInfo();
            info.ownerId = userId;
            info.isUpdate = true;
            info.armyId = (msg.carInfo[i]).armyId;
            info.minerals = (msg.carInfo[i]).minerals;
            info.quality = (msg.carInfo[i]).quality;
            info.get_count = (msg.carInfo[i]).tramcarCount;
            info.hand_count = (msg.carInfo[i]).handCount;
            info.pick_count = (msg.carInfo[i]).pickCount;
            if (info.is_own != (msg.carInfo[i]).isOwn) {
                info.is_own = (msg.carInfo[i]).isOwn;
                this.mineralModel.addCarInfo(info);
                this.setCarUpdate(userId);
            } else {
                info.is_own = (msg.carInfo[i]).isOwn;
                this.mineralModel.addCarInfo(info);
            }

        }
        this.mineralModel.activeTime = msg.activeTime;
        this.mineralModel.commit();
    }

    private get mineralModel(): MineralModel {
        return CampaignManager.Instance.mineralModel;
    }

    /**
     * 创建或者删除矿车 
     * @param userId
     */
    private setCarUpdate(userId: number) {
        if (this.mapModel) {
            let army: CampaignArmy = this.mapModel.getUserArmyByUserId(userId);
            if (army) {
                this.mineralModel.updateCar(army);
            }
        }
    }

    private get mapModel(): CampaignMapModel {
        return CampaignManager.Instance.mapModel;
    }

    /**
     * 当天到账商品列表信息   特惠礼包
     * @param pkg 
     */
    private onRecvTodayProductCount(pkg: PackageIn) {
        let msg = pkg.readBody(ChargeProductCountList) as ChargeProductCountList;
        this.productTodayData.clear();
        if (msg.list) {
            for (const key in msg.list) {
                if (Object.prototype.hasOwnProperty.call(msg.list, key)) {
                    let element = msg.list[key];
                    let product_id = element.productId;
                    let count = element.count;
                    this.productTodayData.set(product_id, count);
                }
            }
        }
        NotificationManager.Instance.dispatchEvent(ShopEvent.PRODUCT_TODAY_UPDATE_COUNT);
    }

    /**
     * 周到账商品列表信息   特惠礼包
     * @param pkg 
     */
    private onRecvWeekProductCount(pkg: PackageIn) {
        let msg = pkg.readBody(ChargeProductCountList) as ChargeProductCountList;
        this.productWeekData.clear();
        if (msg.list) {
            for (const key in msg.list) {
                if (Object.prototype.hasOwnProperty.call(msg.list, key)) {
                    let element = msg.list[key];
                    let product_id = element.productId;
                    let count = element.count;
                    this.productWeekData.set(product_id, count);
                }
            }
        }
        NotificationManager.Instance.dispatchEvent(ShopEvent.PRODUCT_WEEK_UPDATE_COUNT);
    }

    /**
     * 充值到账
     * @param pkg 
     */
    private onRecvChargeArrive(pkg: PackageIn) {
        let msg = pkg.readBody(ChargeOrderArrive) as ChargeOrderArrive;
        let productId: string = msg.productId; // 商品ID
        let orderId: string = msg.orderId; // 订单ID
        let point = msg.point;    //实际获得钻石
        let moneyFen = msg.moneyFen;   //订单金额分
        SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CHARGE_COUNT,
            { productId: productId, orderId: orderId, point: point, moneyFen: moneyFen }
        )
    }

    /**
    * 返回玩家充值次数
    * @param pkg 
    */
    private onRecvProductCount(pkg: PackageIn) {
        let msg = pkg.readBody(ChargeProductCountList) as ChargeProductCountList;
        if (msg.list) {
            for (const key in msg.list) {
                if (Object.prototype.hasOwnProperty.call(msg.list, key)) {
                    let element = msg.list[key];
                    let product_id = element.productId;
                    let count = element.count;
                    this.productData.set(product_id, count);
                }
            }
        }
        if (!SharedManager.Instance.isFirstPay && msg.list.length > 0) {
            Logger.warn("isFirstPay:", SharedManager.Instance.isFirstPay);
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.FIRST_PURCHASE);
            SharedManager.Instance.saveFirstPay();
            Logger.warn("save isFirstPay:", SharedManager.Instance.isFirstPay);
        }
        NotificationManager.Instance.dispatchEvent(ShopEvent.PRODUCT_UPDATE_COUNT);
    }

    // /**
    //  *二级密码返回
    //  * @param event
    //  *
    //  */
    // private __vicePassword(pkg:PackageIn)
    // {
    //     let msg:VicePasswordMsg = pkg.readBody(VicePasswordMsg) as VicePasswordMsg;
    //     let str:string;
    //     if(msg.opType == 1)
    //     {
    //         //1 验证密码
    //         if(msg.result == 0)
    //         {//0 操作失败
    //
    //         }
    //         else if(msg.result == 1)
    //         {//1 操作成功
    //             MsgMan.notifyObserver(MsgEventType.VICE_PASSWORD_OP_SUCCESS_EVENT);
    //             GlobalConfig.isConfirmPassword = true;
    //             str = LangManager.Instance.GetTranslation("vicepassword.description16");
    //             // MessageTipManager.Instance.show(str);
    //         }
    //     }
    //     else if(msg.opType == 2)
    //     { //2 设置密码
    //         if(msg.result == 0)
    //         {//0 操作失败
    //
    //         }
    //         else if(msg.result == 1)
    //         {//1 操作成功
    //             MsgMan.notifyObserver(MsgEventType.VICE_PASSWORD_OP_SUCCESS_EVENT);
    //             this.currentPlayerModel.playerInfo.hasVicePassword = 1;
    //             GlobalConfig.isConfirmPassword = true;//设置密码成功后, 可以不需要验证密码
    //             str = LangManager.Instance.GetTranslation("vicepassword.description17");
    //             // MessageTipManager.Instance.show(str);
    //         }
    //     }
    //     else if(msg.opType == 3)
    //     { //3 修改密码
    //         if(msg.result == 0)
    //         {//0 操作失败
    //
    //         }
    //         else if(msg.result == 1)
    //         {//1 操作成功
    //             MsgMan.notifyObserver(MsgEventType.VICE_PASSWORD_OP_SUCCESS_EVENT);
    //             GlobalConfig.isConfirmPassword = true;//修改密码成功后, 可以不需要验证密码
    //             str = LangManager.Instance.GetTranslation("vicepassword.description18");
    //             // MessageTipManager.Instance.show(str);
    //         }
    //     }
    //     else if(msg.opType == 4)
    //     { //4 重置密码
    //         if(msg.result == 0)
    //         {//0 操作失败
    //
    //         }
    //         else if(msg.result == 1)
    //         {//1 操作成功
    //             this.currentPlayerModel.playerInfo.isDuringResetTime = 1;
    //             str = LangManager.Instance.GetTranslation("vicepassword.description19");
    //             // MessageTipManager.Instance.show(str);
    //         }
    //     }
    //     else if(msg.opType == 5)
    //     {
    //         if(msg.result == 0)//需要引导
    //         {
    //             this.currentPlayerModel.playerInfo.needViceGuild = false;
    //         }
    //         else if(msg.result == 1)
    //         {
    //             this.currentPlayerModel.playerInfo.needViceGuild = true;
    //             DelayActionsUtils.Instance.addAction(new AlertTipAction("", this.__showNewbieLockHandler));
    //         }
    //     }
    //     else if(msg.opType == 6)
    //     {
    //         if(msg.result == 0)//奖励展示
    //         {
    //             this.currentPlayerModel.playerInfo.needShowReward = false;
    //         }
    //         else if(msg.result == 1)
    //         {
    //             this.currentPlayerModel.playerInfo.needShowReward = true;
    //         }
    //     }
    // }

    // private __showNewbieLockHandler(result:string)
    // {
    //     let BagNiewbieNode:Class = DisplayLoader.Context.applicationDomain.getDefinition("nodes.BagNiewbieNode") as Class;
    //     if(BagNiewbieNode)
    //     {
    //         BagNiewbieNode["Ins"].start();
    //     }
    // }

    public openCustomerServiceFrame: number = 0;
    public curDay: number = 0;

    private __sysTimeHandler(pkg: PackageIn) {
        Logger.log('__sysTimeHandler curDay:', this.curDay);
        let msg: SynchronizedTimeMsg = pkg.readBody(SynchronizedTimeMsg) as SynchronizedTimeMsg;
        let date: Date = DateFormatter.parse(msg.sysCurtime, "YYYY-MM-DD hh:mm:ss");
        //为了解决“商城限购, 每天0点, 玩家在线状态, 商城的限购次数没有被重置”, 在同步系统时间的时候判断一下是否同一天
        this._playerModel.sysCurtime = date;
        let systemDay = this._playerModel.sysCurtime.getDate();
        if (this.curDay != systemDay) {
            if (this.curDay != 0) {//避免刚登录游戏第一次就执行请求协议
                this.aCrossTheDayHandler();
            }
            this.curDay = systemDay;
        }
        this.dispatchEvent(PlayerEvent.PET_BOSS);
        NotificationManager.Instance.dispatchEvent(PlayerEvent.SYSTIME_UPGRADE_DATE);
    }

    private __towerInfoHandler(pkg: PackageIn) {
        let msg: TowerInfoMsg = pkg.readBody(TowerInfoMsg) as TowerInfoMsg;
        let info: TowerInfo = this.currentPlayerModel.towerInfo;
        this.readTowerInfo(info, msg);
        if (WorldBossHelper.checkMaze(msg.campaignId)) {
            info = this.currentPlayerModel.towerInfo1;
        } else if (WorldBossHelper.checkMaze2(msg.campaignId)) {
            info = this.currentPlayerModel.towerInfo2;
        }
        this.readTowerInfo(info, msg);
        Logger.info("PlayerManager __towerInfoHandler msg==", msg);
        this.dispatchEvent(PlayerEvent.UPDATE_TOWER_INFO, msg);
    }

    private __towerListHandler(pkg: PackageIn) {
        let msg: TowerListMsg = pkg.readBody(TowerListMsg) as TowerListMsg;
        let info: TowerInfo;
        for (let i: number = 0; i < msg.towerInfo.length; i++) {
            let item: TowerInfoMsg = msg.towerInfo[i] as TowerInfoMsg;
            if (WorldBossHelper.checkMaze(item.campaignId)) {
                info = this.currentPlayerModel.towerInfo1;
            } else if (WorldBossHelper.checkMaze2(item.campaignId)) {
                info = this.currentPlayerModel.towerInfo2;
            }
            this.readTowerInfo(info, item);
        }
    }

    private readTowerInfo(info: TowerInfo, msg: TowerInfoMsg) {
        info.campaignId = msg.campaignId;
        info.index = msg.index;
        info.enterCount = msg.enterCount;
        info.maxIndex = msg.maxIndex;
        info.order = msg.order;
        info.totalGp = msg.totalGp;
        info.towerIndex = msg.towerIndex;
        info.maxEnterCount = msg.maxEnterCount;
        info.itemTempIds = msg.itemTempIds;
        info.freeEnterCount = msg.freeEnterCount;
        info.firstBloodId = msg.firstHitId;
        info.firstBloodName = msg.firstHitName;
        info.towerPassIndex = msg.passIndex;
        info.pass = msg.pass;
        info.commit();
    }

    //
    // private __hookRewardHandler(pkg:PackageIn)
    // {
    //     let msg:OfflineRewardMsg = pkg.readBody(OfflineRewardMsg) as OfflineRewardMsg;
    //     this.currentPlayerModel.hookTime = msg.offlineTime;
    //     this.currentPlayerModel.hookGp = msg.gpCount;
    // }
    //
    private __playerEffectHandler(pkg: PackageIn) {
        //0x006E
        let msg: PropertyUpdatedMsg = pkg.readBody(PropertyUpdatedMsg) as PropertyUpdatedMsg;
        let index: number = msg.propertyType;
        let value: number = msg.value;
        PlayerEffectHelper.updatePlayerEffect(index, value, this._playerModel.playerEffect);
    }

    private __addComposeTempHandler(pkg: PackageIn) {
        let msg: ItemSmithyMsg = pkg.readBody(ItemSmithyMsg) as ItemSmithyMsg;
        let playerInfo: PlayerInfo = this.currentPlayerModel.playerInfo;
        playerInfo.beginChanges();
        playerInfo.addComposeTemp(msg.composeId);
        playerInfo.commit();
    }

    /**
     * 设置信息返回
     * @param pkg 
     */
    private __recvPlayerSetting(pkg: PackageIn) {
        let playerMsg: PlayerSettingMsg = pkg.readBody(PlayerSettingMsg) as PlayerSettingMsg;
        switch (playerMsg.optType) {
            case 1://1 是否拒绝切磋(result: 0: 可以 1: 拒绝) 
                this._playerModel.playerInfo.refuseFamInvite = playerMsg.result == 1;
                break;
            case 2://  是否拒绝被查看信息 (result: 0: 可以 1: 拒绝) 
                this._playerModel.playerInfo.refuseLookInfo = playerMsg.result == 1;
                break;
            case 3:// 是否拒绝公会邀请（result: 0: 可以, 1: 拒绝）
                this._playerModel.playerInfo.refuseConsortiaInvite = playerMsg.result == 1;
                break;
            case 4:// 消息推送result: 0: 不接收 1: 接收) 
                this._playerModel.playerInfo.isOpenPushMsg = playerMsg.result == 1;
                break;
            case 5:// 
                this._playerModel.playerInfo.isOpenSettingType5 = playerMsg.result == 1;
                break;
            case 6://
                this._playerModel.playerInfo.isOpenSettingType6 = playerMsg.result == 1;
                break;
            case 7:// 
                this._playerModel.playerInfo.isOpenSettingType7 = playerMsg.result == 1;
                break;
            case 8:// 
                this._playerModel.playerInfo.isOpenSettingType8 = playerMsg.result == 1;
                break;
            case 9://
                this._playerModel.playerInfo.isOpenSettingType9 = playerMsg.result == 1;
                break;
            case 10://
                this._playerModel.playerInfo.isOpenSettingType10 = playerMsg.result == 1;
                break;
            case 11:// 
                this._playerModel.playerInfo.pushFarm = playerMsg.result == 1;
                break;
            case 12:// 
                this._playerModel.playerInfo.pushWorldBoss = playerMsg.result == 1;
                break;
            case 13:// 
                this._playerModel.playerInfo.pushGuildTree = playerMsg.result == 1;
                break;
            case 14:// 
                this._playerModel.playerInfo.pushGuildWar = playerMsg.result == 1;
                break;
            case 15:// 
                this._playerModel.playerInfo.pushMultiCamp = playerMsg.result == 1;
                break;
            case 16:// 
                this._playerModel.playerInfo.pushBuildingOrder = playerMsg.result == 1;
                break;
            case 17:// 
                this._playerModel.playerInfo.pushTempleReward = playerMsg.result == 1;
                break;
            case 18:// 
                this._playerModel.playerInfo.teamQChat = playerMsg.value;
                break;
            case 19:// 
                this._playerModel.playerInfo.battleQChat = playerMsg.value;
                break;
            case OptType.chat_translate:
                this._playerModel.playerInfo.chatTranslateKey = playerMsg.value;
                this.dispatchEvent(NotificationEvent.CHAT_TRANSLATE_SETTING);
                break;
            default:
                break;
        }


    }

    private __uRefusefriend(pkg: PackageIn) {
        let playerMsg: RefuseFriendRspMsg = pkg.readBody(RefuseFriendRspMsg) as RefuseFriendRspMsg;
        this._playerModel.playerInfo.refuseFriend = playerMsg.result;
    }

    private __uRefuseInvite(pkg: PackageIn) {
        let playerMsg: RefuseFriendRspMsg = pkg.readBody(RefuseFriendRspMsg) as RefuseFriendRspMsg;
        this._playerModel.playerInfo.refuseInvite = playerMsg.result;
    }

    private __uRefuseTeamInvite(pkg: PackageIn) {
        let playerMsg: RefuseFriendRspMsg = pkg.readBody(RefuseFriendRspMsg) as RefuseFriendRspMsg;
        this._playerModel.playerInfo.refuseTeamInvite = playerMsg.result;
    }

    private __uPlayerEnterCopyNumHandler(pkg: PackageIn) {
        let msg: MultiCampaignEnterCountMsg = pkg.readBody(MultiCampaignEnterCountMsg) as MultiCampaignEnterCountMsg;
        this._playerModel.playerInfo.beginChanges();
        this._playerModel.playerInfo.multiCopyCount = msg.campaignCount;
        this._playerModel.playerInfo.multiCopyMaxCount = msg.campaignMaxcount;
        this._playerModel.playerInfo.commit();
    }

    private __uPlayerInfoHandler(pkg: PackageIn) {

        let playerMsg: PlayerMsg = pkg.readBody(PlayerMsg) as PlayerMsg;

        let frist: boolean = false;
        let thaneChange: boolean = false;
        let playerInfo: PlayerInfo = this.currentPlayerModel.playerInfo;
        // this.dispatchEvent('TEST',playerInfo.userId);

        playerInfo.beginChanges();
        if (!playerInfo.userId) {
            frist = true;
        }

        playerInfo.trialCount = playerMsg.trialCount;
        playerInfo.maxTrialCount = playerMsg.trialMaxCount;
        playerInfo.tailaCount = playerMsg.terraTempleCount;
        playerInfo.tailaMaxCount = playerMsg.terraTempleMaxCount;

        playerMsg.runeCount

        if (playerMsg.hasOwnProperty('warFieldCount')) {
            playerInfo.warFieldCount = playerMsg.warFieldCount;
        }
        if (playerMsg.hasOwnProperty('serverName')) {
            playerInfo.serviceName = playerMsg.serverName;
        }
        if (playerMsg.hasOwnProperty('playerId')) {
            playerInfo.userId = playerMsg.playerId;
        }
        if (playerMsg.hasOwnProperty('nickName')) {
            playerInfo.nickName = playerMsg.nickName;
        }
        if (playerMsg.hasOwnProperty("right")) {
            playerInfo.right = playerMsg.right;
        }
        if (playerMsg.hasOwnProperty("sex")) {
            playerInfo.sexs = playerMsg.sex;
        }
        if (playerMsg.hasOwnProperty("pic")) {
            playerInfo.pics = playerMsg.pic;
        }
        if (playerMsg.hasOwnProperty("camp")) {
            playerInfo.camp = playerMsg.camp;
        }
        if (playerMsg.hasOwnProperty("point")) {
            if (playerMsg.point > playerInfo.point) {
                // let iconUrl = IconFactory.getGoodsIconByTID(-400);
                // if (iconUrl != "")
                //     BagHelper.playGoldEffect(iconUrl);
            }
            playerInfo.point = playerMsg.point;

        }
        if (playerMsg.hasOwnProperty("giftToken")) {
            playerInfo.giftToken = playerMsg.giftToken;
        }
        if (playerMsg.hasOwnProperty("state")) {
            playerInfo.state = playerMsg.state;
        }
        if (playerMsg.hasOwnProperty("lastAward")) {
            playerInfo.lastAward = DateFormatter.parse(playerMsg.lastAward, "YYYY-MM-DD hh:mm:ss");
        }
        if (playerMsg.hasOwnProperty("totalGp")) {
            playerInfo.totalGP = Number(playerMsg.totalGp);
        }
        if (playerMsg.hasOwnProperty("signSite") && playerMsg.signSite != 0) {
            playerInfo.signSite = playerMsg.signSite;
        }
        if (playerMsg.hasOwnProperty("signTimes")) {
            playerInfo.signTimes = playerMsg.signTimes;
        }
        if (playerMsg.hasOwnProperty("firstCharge")) {
            playerInfo.isFirstCharge = playerMsg.firstCharge;
        }
        if (playerMsg.hasOwnProperty("questSite")) {
            playerInfo.questSite = new ByteArray();
            playerInfo.questSite.writeArrayBuffer(playerMsg.questSite);
            playerInfo.questSite.position = 0;
        }
        if (playerMsg.hasOwnProperty("consortiaId")) {
            if (playerInfo.consortiaID > 0 && playerMsg.consortiaId <= 0) {//退出或解散公会
                let channel = SDKManager.Instance.getChannel();
                if (channel instanceof WanChannel) {
                    channel.exitConsortiaRoom(playerInfo.consortiaID + '');
                }
                else if (channel instanceof NativeChannel) {
                    channel.leaveChatRoom(NativeChannel.CONSORTIA_ROOM + playerInfo.consortiaID);
                }
            }

            if (playerInfo.consortiaID <= 0 && playerMsg.consortiaId > 0) {//加入公会
                let channel = SDKManager.Instance.getChannel();
                if (channel instanceof WanChannel) {
                    channel.joinConsortiaRoom(playerMsg.consortiaId + '');
                }
                else if (channel instanceof NativeChannel) {
                    if (NativeChannel.isVoiceLogin) {
                        channel.joinChatRoom(NativeChannel.CONSORTIA_ROOM + playerMsg.consortiaId);
                    }
                }
            }
            playerInfo.consortiaID = playerMsg.consortiaId;
            playerInfo.dutyId = playerMsg.guildDuty;
            if (playerInfo.consortiaID > 0 && this._playerModel.createConsortiaFlag) {
                FrameCtrlManager.Instance.exit(EmWindow.ConsortiaApply);
                FrameCtrlManager.Instance.open(EmWindow.Consortia);
                this._playerModel.createConsortiaFlag = false;
            }
        }
        if (playerMsg.hasOwnProperty("consortiaName")) {
            playerInfo.consortiaName = playerMsg.consortiaName;
        }
        if (playerMsg.hasOwnProperty("claimId")) {
            playerInfo.claimId = playerMsg.claimId;
        }
        if (playerMsg.hasOwnProperty("claimName")) {
            playerInfo.claimName = playerMsg.claimName;
        }
        if (playerMsg.hasOwnProperty("lastOutConsortia")) {
            playerInfo.lastOutConsortia = (DateFormatter.parse(playerMsg.lastOutConsortia, "YYYY-MM-DD hh:mm:ss")).getTime() / 1000;
        }
        if (playerMsg.hasOwnProperty("isAuto")) {
            playerInfo.isAuto = playerMsg.isAuto;
        }
        if (playerMsg.hasOwnProperty("blessingBuff")) {
            playerInfo.seminaryEffect = playerMsg.blessingBuff;
        }
        if (playerMsg.hasOwnProperty("lordsScore")) {
            playerInfo.gloryPoint = playerMsg.lordsScore;
        }
        if (playerMsg.hasOwnProperty("isReceived")) {
            playerInfo.isReceived = playerMsg.isReceived
        }
        if (playerMsg.hasOwnProperty("mineScore")) {
            playerInfo.mineral = playerMsg.mineScore;
        }
        if (playerMsg.hasOwnProperty("isBackPlayer")) {
            playerInfo.isBackPlayer = playerMsg.isBackPlayer;
        }
       

        this.thane.beginChanges();
        if (playerMsg.hasOwnProperty("job")) {
            playerInfo.job = playerMsg.job;
            if (this.thane.job != playerMsg.job) {
                thaneChange = true;
            }
            this.thane.job = playerMsg.job;
        }
        if (playerMsg.hasOwnProperty("grades")) {
            if (this.thane.grades != playerMsg.grades) {
                thaneChange = true;
                let curLevelType = RPT_EVENT_PREFIX.LEVEL_UP + playerMsg.grades;
                if (playerMsg.grades % 5 == 0 && playerMsg.grades <= 25) {
                    SDKManager.Instance.getChannel().postGameEvent(GameEventCode.Code_1042);
                    SDKManager.Instance.getChannel().adjustEvent(curLevelType, playerMsg.grades);
                }
            }
            this.thane.grades = playerMsg.grades;
        }
        if (playerMsg.hasOwnProperty("gp")) {
            if (this.thane.gp != playerMsg.gp) {
                thaneChange = true;
            }
            this.thane.gp = playerMsg.gp;
        }
        if (playerMsg.hasOwnProperty("leaveGp")) {
            if (this.thane.offlineGp != playerMsg.leaveGp) {
                thaneChange = true;
            }
            this.thane.offlineGp = playerMsg.leaveGp;
        }
        if (playerMsg.hasOwnProperty("onlineTime")) {
            if (this.thane.onlineTime != playerMsg.onlineTime) {
                thaneChange = true;
            }
            this.thane.onlineTime = Number(playerMsg.onlineTime);
        }
        if (playerMsg.hasOwnProperty("geste")) {
            if (this.thane.honer != playerMsg.geste) {
                thaneChange = true;
            }
            this.thane.honer = playerMsg.geste;
            playerInfo.honer = playerMsg.geste;
        }
        if (playerMsg.hasOwnProperty("charm")) {
            if (this.thane.charms != playerMsg.charm) {
                thaneChange = true;
            }
            playerInfo.charms = playerMsg.charm;
            this.thane.charms = playerMsg.charm;
        }
        if (playerMsg.hasOwnProperty("lordsScore")) {
            if (this.thane.gloryPoint != playerMsg.lordsScore) {
                thaneChange = true;
            }
            this.thane.gloryPoint = playerMsg.lordsScore;
        }
        if (playerMsg.hasOwnProperty("rewardTimes")) {
            if (this.thane.rewardCount != playerMsg.rewardTimes) {
                thaneChange = true;
            }
            this.thane.rewardCount = playerMsg.rewardTimes;
        }
        if (playerMsg.hasOwnProperty("storeGrade")) {
            if (this.thane.jewelGrades != playerMsg.storeGrade) {
                thaneChange = true;
            }
            this.thane.jewelGrades = playerMsg.storeGrade;
        }
        if (playerMsg.hasOwnProperty("gradeProcess")) {
            if (this.thane.jewelGp != playerMsg.storeGp) {
                thaneChange = true;
            }
            this.thane.jewelGp = playerMsg.storeGp;
        }
        if (playerMsg.hasOwnProperty("appellId")) {
            if (this.thane.appellId != playerMsg.appellId) {
                thaneChange = true;
            }
            this.thane.appellId = playerMsg.appellId;
        }
        if (playerMsg.hasOwnProperty("repute")) {
            playerInfo.repute = playerMsg.repute;
        }
        if (playerMsg.hasOwnProperty("consortiaOffer")) {
            playerInfo.consortiaOffer = playerMsg.consortiaOffer;
        }
        if (playerMsg.hasOwnProperty("consortiaTotaloffer")) {
            playerInfo.consortiaTotalOffer = playerMsg.consortiaTotaloffer;
        }
        if (playerMsg.hasOwnProperty("consortiaBuild")) {
            playerInfo.consortiaJianse = playerMsg.consortiaBuild;
        }
        if (playerMsg.hasOwnProperty("consortiaTotalBuild")) {
            playerInfo.consortiaTotalJianse = playerMsg.consortiaTotalBuild;
        }
        if (playerMsg.hasOwnProperty("strategy")) {
            // playerInfo.strategy = new Num(Number(playerMsg.strategy));
        }
        if (playerMsg.hasOwnProperty("weary")) {
            playerInfo.weary = playerMsg.weary;
        }
        if (playerMsg.hasOwnProperty("refuseFriend")) {
            playerInfo.refuseFriend = playerMsg.refuseFriend;
        }
        if (playerMsg.hasOwnProperty("refuseInvite")) {
            playerInfo.refuseInvite = playerMsg.refuseInvite;
        }
        if (playerMsg.hasOwnProperty("refuseTeamInvite")) {
            playerInfo.refuseTeamInvite = playerMsg.refuseTeamInvite;
        }

        playerInfo.refuseConsortiaInvite = playerMsg.refuseConsortiaInvite;
        playerInfo.refuseFamInvite = playerMsg.refuseFamInvite;
        playerInfo.refuseLookInfo = playerMsg.refuseLookInfo;
        playerInfo.isOpenPushMsg = playerMsg.receivePushMsg;
        playerInfo.pushFarm = playerMsg.pushFarm;
        playerInfo.pushTempleReward = playerMsg.pushTempleReward;
        playerInfo.isShowOpenAll = playerMsg.isShowOpenAll;
        playerInfo.pushBuildingOrder = playerMsg.pushBuildingOrder;
        playerInfo.pushGuildTree = playerMsg.pushGuildTree;
        playerInfo.pushGuildWar = playerMsg.pushGuildWar;
        playerInfo.pushWorldBoss = playerMsg.pushWorldBoss;
        playerInfo.pushMultiCamp = playerMsg.pushMultiCamp;
        playerInfo.isOpenSettingType5 = playerMsg.mbSetingTK;
        playerInfo.isOpenSettingType6 = playerMsg.mbSetingYW;
        playerInfo.isOpenSettingType7 = playerMsg.mbSetingFB;
        playerInfo.isOpenSettingType8 = playerMsg.mbSetingHD;
        playerInfo.isOpenSettingType9 = playerMsg.mbSetingZD;
        playerInfo.isOpenSettingType10 = playerMsg.mbSetingDW;
        playerInfo.teamQChat = playerMsg.teamQChat;
        playerInfo.battleQChat = playerMsg.battleQChat;
        playerInfo.chatTranslateKey = playerMsg.translateLan;
        // playerInfo.isSkillEditOpen = playerMsg.isSkillEditOpen;
        // if (playerMsg.hasOwnProperty("attackLeftCount")) {
        playerInfo.attackCount = playerMsg.attackLeftCount;
        // }

        Logger.info("旧版新手", playerMsg.noviceProcess);
        Logger.info("新版新手", playerMsg.newNoviceProcess);
        if (playerMsg.hasOwnProperty("newNoviceProcess")) {
            playerInfo.newNoviceProcess = playerMsg.newNoviceProcess;
        }
        if (playerMsg.hasOwnProperty("consortiaAttack")) {
            playerInfo.consortiaPower = playerMsg.consortiaAttack;
        }
        if (playerMsg.hasOwnProperty("consortiaDefence")) {
            playerInfo.consortiaDefence = playerMsg.consortiaDefence;
        }
        if (playerMsg.hasOwnProperty("consortiaAgility")) {
            playerInfo.consortiaAgility = playerMsg.consortiaAgility;
        }
        if (playerMsg.hasOwnProperty("consortiaAbility")) {
            playerInfo.consortiaIntellect = playerMsg.consortiaAbility;
        }
        if (playerMsg.hasOwnProperty("consortiaCaptain")) {
            playerInfo.consortiaCaptain = playerMsg.consortiaCaptain;
        }
        if (playerMsg.hasOwnProperty("gpOrder")) {
            playerInfo.playerOrdeInfo.gpOrder = playerMsg.gpOrder;
            playerInfo.playerOrdeInfo.fightCapacityOrder = playerMsg.order.fightCapacityOrder;
            playerInfo.playerOrdeInfo.honourOrder = playerMsg.order.geste_Order;
            playerInfo.playerOrdeInfo.charmsOrder = playerMsg.order.charm_Order;
            playerInfo.playerOrdeInfo.soulScoreOrder = playerMsg.order.soulScore_Order;
        }
        if (playerMsg.hasOwnProperty("crossScore")) {
            playerInfo.crossScore = playerMsg.crossScore;
        }
        if (playerMsg.hasOwnProperty("fightingCapacity")) {
            this.thane.fightingCapacity = playerMsg.fightingCapacity;
            playerInfo.fightingCapacity = playerMsg.fightingCapacity;
        }
        if (playerMsg.hasOwnProperty("gradeProcess")) {
            playerInfo.gradeProcess = parseInt(playerMsg.gradeProcess);
        }
        if (playerMsg.hasOwnProperty("timeProcess")) {
            playerInfo.timeProgress = playerMsg.timeProcess;
        }
        if (playerMsg.hasOwnProperty("timeGet")) {
            playerInfo.timeGet = playerMsg.timeGet;
        }
        if (playerMsg.hasOwnProperty("timeRun")) {
            playerInfo.timeRun = playerMsg.timeRun;
        }
        if (playerMsg.hasOwnProperty("blessingBuff")) {
            playerInfo.seminaryCount = playerMsg.blessingCount;
        }
        if (playerMsg.hasOwnProperty("blessingBuff")) {
            playerInfo.seminaryMax = playerMsg.blessingMaxCount;
        }
        if (playerMsg.hasOwnProperty("reloginProcess")) {
            playerInfo.reloginProcess = playerMsg.reloginProcess;
        }
        if (playerMsg.hasOwnProperty("reloginProcess")) {
            playerInfo.reloginCount = playerMsg.reloginCount;
        }
        if (playerMsg.hasOwnProperty("campaignSite")) {
            playerInfo.campaignSite = playerMsg.campaignSite;
        }
        if (playerMsg.hasOwnProperty("bagCount")) {
            playerInfo.bagCount = playerMsg.bagCount;
        }
        playerInfo.starFreeCount = playerMsg.startFree;
        if (playerMsg.hasOwnProperty("starCount")) {
            playerInfo.starBagCount = playerMsg.starCount;
        }
        if (playerMsg.hasOwnProperty("starpoint")) {
            playerInfo.starPoint = playerMsg.starpoint;
        }
        if (playerMsg.hasOwnProperty("runeCount")) {
            playerInfo.runeGemBagCount = playerMsg.runeCount;
        }
        if (playerMsg.hasOwnProperty("petBagCount")) {
            playerInfo.petBagCount = playerMsg.petBagCount;
        }
        if (playerMsg.hasOwnProperty("runePowerPoint")) {
            playerInfo.runePowerPoint = playerMsg.runePowerPoint;
        }
        if (playerMsg.hasOwnProperty("petEquipStrengNum")) {
            playerInfo.petEquipStrengNum = playerMsg.petEquipStrengNum;
        }
        if (playerMsg.hasOwnProperty("altarConsortiaId")) {
            playerInfo.demonConsortiaId = playerMsg.altarConsortiaId;
        }
        playerInfo.consortiaGold = playerMsg.consortiaGold;
        if (playerMsg.hasOwnProperty("consortiaPhysique")) {
            playerInfo.consortiaPhysique = playerMsg.consortiaPhysique;
        }
        if (playerMsg.hasOwnProperty("job")) {
            playerInfo.job = playerMsg.job;
        }
        playerInfo.multiCopyCount = playerMsg.campaignCount;
        playerInfo.multiCopyMaxCount = playerMsg.campaignMaxcount;
        playerInfo.JJCcount = playerMsg.matchRoomCount;
        playerInfo.matchWin = playerMsg.matchWin;
        playerInfo.matchFailed = playerMsg.matchFailed;
        if (playerMsg.hasOwnProperty("qteGuide")) {
            playerInfo.qteGuide = playerMsg.qteGuide;
        }
        if (playerMsg.hasOwnProperty("kingBuff")) {
            playerInfo.isGetKingBuffer = playerMsg.kingBuff;
        }
        if (playerMsg.hasOwnProperty("wearyLimit")) {
            playerInfo.wearyLimit = playerMsg.wearyLimit;
        }
        if (playerMsg.hasOwnProperty("hasVicePassword")) {
            playerInfo.hasVicePassword = playerMsg.hasVicePassword;
        }
        if (playerMsg.hasOwnProperty("isDuringToResetTime")) {
            playerInfo.isDuringResetTime = playerMsg.isDuringToResetTime;
        }
        if (playerMsg.hasOwnProperty("isDuringToResetTime")) {
            playerInfo.isDuringResetTime = playerMsg.isDuringToResetTime;
        }
        if (playerMsg.hasOwnProperty("signRewardState")) {
            playerInfo.rewardState = playerMsg.signRewardState;
        }

        if (playerMsg.hasOwnProperty("addGuildCount")) {
            playerInfo.addGuildCount = playerMsg.addGuildCount;
        }
        if (playerMsg.hasOwnProperty("mulSportScore")) {
            playerInfo.mulSportScore = playerMsg.mulSportScore;
        }

        if (playerMsg.hasOwnProperty("segmentId")) {
            playerInfo.segmentId = playerMsg.segmentId;
        }

        if (playerMsg.hasOwnProperty("runeNum")) {
            playerInfo.runeNum = playerMsg.runeNum;
        } else {
            playerInfo.runeNum = 0;
        }

        if (playerMsg.hasOwnProperty("autoRecruit")) {
            playerInfo.autoRecruit = playerMsg.autoRecruit;
        }
        playerInfo.isBindVertifyPrompted = playerMsg.isBindVertifyPrompted;

        if (this.thane.preGrade > 0 && this.thane.preGrade < 55 && this.thane.grades >= 55) {
            this.currentPlayerModel.showBattleGuardBtnShine = true;
        }
        playerInfo.isTargetOpen = playerMsg.isTargetOpen;
        playerInfo.isSignOpen = playerMsg.isSignOpen;
        playerInfo.isPassOpen = playerMsg.isPassOpen;
        playerInfo.selfConsortiaSkillTypeDic = this.getConsortiaSkillTypeDic(playerMsg);
        if (playerInfo.consortiaCoin != playerMsg.bossScore) {
            playerInfo.consortiaCoin = playerMsg.bossScore;
            thaneChange = true;
        }

        if (frist) {
            this.dispatchEvent(PlayerEvent.LOGIN_SUCCESS);
            // let obj:Object = ExternalInterfaceManager.Instance.obj;
            // if(obj)
            // {
            //     this.sendWdMessage(obj["plat_user"], obj["plat_password"], obj["plat_uid"], obj["plat_token"]);
            // }
            return;
        } else {
            playerInfo.commit();
        }

        if (thaneChange) {
            this.thane.commit();
        }
        playerMsg = null;
    }

    private getConsortiaSkillTypeDic(info:PlayerMsg):Dictionary{
        let dic:Dictionary = new Dictionary();
        let item:HiSkillInfoMsg;
        for(let i:number = 0;i<info.hiSkillList.length;i++){
            item = info.hiSkillList[i] as HiSkillInfoMsg;
            dic.set(item.type,item.level);
        }
        return dic;
    }

    private sendWdMessage(plat_user: string, plat_password: string, plat_uid: string, plat_token: string) {
        let msg: PropertyMsg = new PropertyMsg();
        msg.param4 = plat_user;
        msg.param5 = plat_password;
        msg.param6 = plat_uid;
        msg.param12 = plat_token;
        SocketManager.Instance.send(C2SProtocol.C_MICRO_CLIENT_INFO, msg);
    }

    private __loginSyncMapIdHandler(pkg: PackageIn) {
        let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
        this.currentPlayerModel.spaceMapId = msg.param1;
    }


    private __transferResultHandler(pkg: PackageIn) {
        let msg: CastleReqMsg = pkg.readBody(CastleReqMsg) as CastleReqMsg;
        let buildInfoi: BuildInfo = BuildingManager.Instance.model.buildingListByID[-11];
        buildInfoi.property1 = msg.leftEnergy;//传送阵能量
        buildInfoi.property2 = msg.leftTime;//传送阵时间
        buildInfoi.loadTime = Laya.Browser.now() / 1000;//getTimer() / 1000;
        this.dispatchEvent(ServiceReceiveEvent.TRANSEFER_ARMY_SUCCESS, [true, null]);//[result:Boolean, data:Object]
    }

    /**
     * 大厅玩家列表
     * @param e
     *
     */
    private __playerListHandler(pkg: PackageIn) {
        let msg: RoomPlayerListMsg = pkg.readBody(RoomPlayerListMsg) as RoomPlayerListMsg;
        let state: number = msg.state;
        for (let i: number = 0; i < msg.roomPlayer.length; i++) {
            let player: ThaneInfo = new ThaneInfo();
            let roomMsg: RoomPlayerMsg = msg.roomPlayer[i] as RoomPlayerMsg;
            player.userId = roomMsg.playerId;
            player.templateId = roomMsg.templateId;
            player.grades = roomMsg.grades;
            player.nickName = roomMsg.nickName;
            player.sexs = roomMsg.sex;
            player.consortiaID = roomMsg.consortiaId;
            player.changeShapeId = roomMsg.changeShapeId;
            player.IsVipAndNoExpirt = roomMsg.isVip;
            player.vipType = 1;// roomMsg.vipType; vip紫钻
            player.snsInfo.headId = roomMsg.headId;
            player.headId = roomMsg.headId;
            player.frameId = roomMsg.frameId;
            if (roomMsg.hasOwnProperty("hasConsortiaName")) {
                player.consortiaName = roomMsg.consortiaName;
            }
            player.fightingCapacity = roomMsg.fightingCapacity;
            player.state = state;

            if (state == 1)//在线
            {
                this._watingList.add(player.userId, player);
            }
            else {
                this._watingList.del(player.userId);
            }
        }
    }

    private __getSimpleInfoHandler(pkg: PackageIn) {
        let msg: InfoRspMsg = pkg.readBody(InfoRspMsg) as InfoRspMsg;
        let orientation: number = msg.from;
        let thane: ThaneInfo = new ThaneInfo();
        thane.userId = msg.info.userId;
        thane.nickName = msg.info.nickName;
        thane.gp = msg.info.gp;
        thane.grades = msg.info.grades;
        thane.playerOrdeInfo.gpOrder = msg.info.gpOrder;
        thane.sexs = msg.info.sexs;
        thane.pics = msg.info.pics;
        thane.state = msg.info.state;
        thane.consortiaID = msg.info.consortiaID;
        thane.consortiaName = msg.info.consortiaName;
        thane.camp = msg.info.camp;
        thane.claimId = msg.info.claimId;
        thane.claimName = msg.info.claimName;
        thane.consortiaOffer = msg.info.consortiaOffer;
        thane.consortiaTotalOffer = msg.info.consortiaTotalOffer;
        thane.consortiaJianse = msg.info.consortiaBuild;
        thane.consortiaTotalJianse = msg.info.consortiaTotalBuild;
        thane.dutyId = msg.info.dutyId;
        thane.fightingCapacity = msg.info.fightingCapacity;
        thane.matchFailed = msg.info.matchFailed;
        thane.matchWin = msg.info.matchWin;
        thane.templateId = msg.info.job;
        thane.job = msg.info.job;
        thane.appellId = msg.info.appellId;
        thane.serviceName = msg.info.serverName;
        thane.headId = msg.info.headId;
        thane.vipGrade = msg.info.vipGrade;
        thane.talentGrade = msg.info.talentGrade;
        thane.meritorGrade = msg.info.meritorGrade;
        thane.honorGrade = msg.info.honorGrade;
        thane.devourGrade = msg.info.devourGrade;
        thane.frameId = msg.info.frameId;
        this.dispatchEvent(RequestInfoEvent.REQUEST_SIMPLEINFO, orientation, thane);
    }

    private __crossPlayerInfoHandler(pkg: PackageIn) {
        let msg: SimpleHeroInfoMsg = pkg.readBody(SimpleHeroInfoMsg) as SimpleHeroInfoMsg;
        let thane: ThaneInfo = new ThaneInfo();
        thane.templateId = msg.tempateId;
        thane.nickName = msg.nickName;
        thane.armsEquipAvata = msg.arm;
        thane.bodyEquipAvata = msg.cloth;
        thane.wingAvata = msg.wing;
        thane.hideFashion = msg.hide;
        thane.bodyFashionAvata = msg.fashionCloth;
        thane.armsFashionAvata = msg.fashionArm;
        thane.hairFashionAvata = msg.hat;
        thane.fightingCapacity = msg.fightingCapacity;
        thane.grades = msg.grade;
        thane.serviceName = msg.serverName;
        thane.attackProrerty.totalPhyAttack = msg.totalPhyAttack;
        thane.attackProrerty.totalPhyDefence = msg.totalPhyDefence;
        thane.attackProrerty.totalMagicAttack = msg.totalMagicAttack;
        thane.attackProrerty.totalMagicDefence = msg.totalMagicDefence;
        thane.attackProrerty.totalForceHit = msg.totalForceHit;
        thane.attackProrerty.totalParry = msg.totalParry;
        thane.attackProrerty.totalConatArmy = msg.totalConatArmy;
        thane.attackProrerty.totalLive = msg.totalLive;
        this.dispatchEvent(RequestInfoEvent.REQUEST_SIMPLEINFO, 10000, thane);
    }


    private __daygesteUpdateHandler(pkg: PackageIn) {
        let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
        let thaneChange: boolean = false;
        if (this.thane.honer != msg.param1) {
            thaneChange = true;
        }
        this.thane.honerDay = msg.param1;
        if (this.thane.honer != msg.param2) {
            thaneChange = true;
        }
        this.thane.honerDayMax = msg.param2;
        if (thaneChange) {
            this.thane.commit();
        }
    }

    /**
     * 龙魂喂养
     * @param type 
     * @param count 
     */
    public sendDragonSoulFeed(type: number, count: number = 1) {
        let msg: FateEditMsg = new FateEditMsg();
        msg.skillSonType = type;
        msg.useItemCount = count;
        SocketManager.Instance.send(C2SProtocol.C_DRAGON_FEED, msg);
    }
    //
    public sendDragonSoulRequest() {
        SocketManager.Instance.send(C2SProtocol.C_DRAGON_FEED);
    }
    //
    //     public sendDragonSoulTransfer()
    //     {
    //         let playerInfo:PlayerInfo = this.currentPlayerModel.playerInfo;
    //         if(!(playerInfo.dragonSoulType == 32 && playerInfo.dragonSoulGrade == 5))
    //         {
    //             let msg:string = LanguageMgr.GetTranslation("yishi.manager.PlayerManager.TransferTip02");
    //             MessageTipManager.Instance.show(msg);
    //             return;
    //         }
    //         let pkg:PackageOut = new PackageOut(ProtocolType.C_DRAGON_TRANSFER);
    //         SocketSendManager.Instance.send(pkg);
    //     }
    //
    //     private __vehicleProfileChangeHandler(pkg:PackageIn)
    //     {
    //         let pkg:PackageIn = e. < PackageIn > data;
    //         let msg:PlayerVehicleProfileMsg = new PlayerVehicleProfileMsg();
    //         msg = pkg.readBody(msg) as PlayerVehicleProfileMsg;
    //         this._playerModel.playerInfo.beginChanges();
    //         if(msg.hasExp)
    //         {
    //             this._playerModel.playerInfo.vehicleGp = msg.exp;
    //         }
    //         if(msg.hasScore)
    //         {
    //             this._playerModel.playerInfo.vehicleScore = msg.score;
    //         }
    //
    //         if(msg.hasDefaultVehicle)
    //         {
    //             this._playerModel.playerInfo.vehicleTempId = msg.defaultVehicle;
    //         }
    //
    //         this._playerModel.playerInfo.commit();
    //     }
    //
    //     private __receiveVehicleListHandler(evt:SLGSocketEvent)
    //     {
    //         let pkg:PackageIn = evt. < PackageIn > data;
    //         let msg:PlayerVehicleListMsg = new PlayerVehicleListMsg();
    //         msg = pkg.readBody(msg) as PlayerVehicleListMsg;
    //
    //         let arr:any[] = this._playerModel.playerInfo.vehicleList;
    //         this._playerModel.playerInfo.beginChanges();
    //         for(let pmsg:PlayerVehicleMsg of msg.vehicles)
    //         {
    //             this._playerModel.playerInfo.addVehicle(pmsg.templateId);
    //         }
    //
    //         if(this._playerModel.playerInfo.vehicleList.length == 1)
    //         {
    //             this._playerModel.playerInfo.vehicleTempId = arr[0];
    //         }
    //         this._playerModel.playerInfo.commit();
    //     }
    //
    //     private __vehicleTechHandler(evt:SLGSocketEvent)
    //     {
    //         let pkg:PackageIn = evt. < PackageIn > data;
    //         let msg:PropertyMsg = new PropertyMsg();
    //         msg = pkg.readBody(msg) as PropertyMsg;
    //
    //         if(!msg.hasParam1)
    //         {
    //             return;
    //         }
    //         this._playerModel.vehicleTech = msg.param1;
    //     }

    /**
     * 查看玩家精灵返回
     * @param evt 
     */
    private __receivePetDataHandler(pkg: PackageIn) {
        let msg: PetDetailMsg = pkg.readBody(PetDetailMsg) as PetDetailMsg;
        let petdata: PetData;
        if (msg.petmsg && msg.petmsg.petInfo && msg.petmsg.petInfo.length == 1) {
            petdata = new PetData();
            petdata.userId = msg.petmsg.userId;
            petdata = PetData.createWithMsg(msg.petmsg.petInfo[0] as PetInfoMsg, petdata);
            for (let i: number = 0; i < msg.item.length; i++) {
                let simpleItemInfoMsg: SimpleItemInfoMsg = msg.item[i] as SimpleItemInfoMsg;
                let goodsInfo: GoodsInfo = this.copyGoodsInfo(simpleItemInfoMsg);
                petdata.equipGoodsArr.push(goodsInfo);
            }
        }
        this.dispatchEvent(RequestInfoEvent.QUERY_PETDATA_RESULT, petdata);
    }

    private __receivePetArtifactDataHandler(pkg: PackageIn) {
        let msg: PetDetailMsgList = pkg.readBody(PetDetailMsgList) as PetDetailMsgList;
        if (msg) {
            let petList = [];
            for (let i: number = 0; i < msg.petList.length; i++) {
                let detailMsg: PetDetailMsg = msg.petList[i] as PetDetailMsg;
                let petdata: PetData;
                if (detailMsg.petmsg && detailMsg.petmsg.petInfo && detailMsg.petmsg.petInfo.length == 1) {
                    petdata = new PetData();
                    petdata.userId = detailMsg.petmsg.userId;
                    petdata = PetData.createWithMsg(detailMsg.petmsg.petInfo[0] as PetInfoMsg, petdata);
                    for (let i: number = 0; i < detailMsg.item.length; i++) {
                        let simpleItemInfoMsg: SimpleItemInfoMsg = detailMsg.item[i] as SimpleItemInfoMsg;
                        let goodsInfo: GoodsInfo = this.copyGoodsInfo(simpleItemInfoMsg);
                        petdata.equipGoodsArr.push(goodsInfo);
                    }
                    petList.push(petdata);
                }
            }
            NotificationManager.Instance.dispatchEvent(NotificationEvent.UPDATE_LOOKINFO_PETDATA, petList);
        }
    }

    private copyGoodsInfo(msg: SimpleItemInfoMsg): GoodsInfo {
        let goods: GoodsInfo = new GoodsInfo();
        goods.pos = msg.pos;
        goods.templateId = msg.templateId;
        goods.star = msg.star;
        goods.masterAttr = msg.masterAttr;
        goods.sonAttr = msg.sonAttr;
        goods.suitId = msg.suitId;
        goods.objectId = msg.objectId;
        goods.strengthenGrade = msg.strengthenGrade;
        goods.randomSkill1 = msg.randomSkill_1;
        goods.randomSkill2 = msg.randomSkill_2;
        goods.randomSkill3 = msg.randomSkill_3;
        goods.randomSkill4 = msg.randomSkill_4;
        goods.randomSkill5 = msg.randomSkill_5;
        return goods;

    }
    /**
     * 返回玩家坐骑信息
     * @param pkg 
     */
    private __recvPlayerMountInfo(pkg: PackageIn) {
        let msg: MountInfoMsg = pkg.readBody(MountInfoMsg) as MountInfoMsg;
        let info: SimpleMountInfo = SimpleMountInfo.createFromMountInfoMsg(msg);
        this.dispatchEvent(RequestInfoEvent.QUERY_MOUNT_RESULT, info);
    }
    /**
     * 返回玩家装备信息
     * @param pkg 
     */
    private __receiveEquipHandler(pkg: PackageIn) {
        let msg: DetailRspMsg = pkg.readBody(DetailRspMsg) as DetailRspMsg;
        this.dispatchEvent(RequestInfoEvent.BAG_EQUIPLOOK, msg);
    }

    //
    /** 宠物信息更新 */
    private __petInfoHandler(pkg: PackageIn) {
        let msg: PlayerPetMsg = pkg.readBody(PlayerPetMsg) as PlayerPetMsg;
        Logger.info("[PlayerManager]__petInfoHandler", msg.op, msg)
        let thaneInfo: ThaneInfo = this.thane;
        let playerInfo: PlayerInfo = this._playerModel.playerInfo;
        playerInfo.beginChanges();
        thaneInfo.beginChanges();

        let petInfoArr: Array<PetInfoMsg> = msg.petInfo as Array<PetInfoMsg>;
        petInfoArr = ArrayUtils.sortOn(petInfoArr, "isDel", ArrayConstant.DESCENDING);

        switch (msg.op) {
            case 2:// 英灵背包格子数量更新
                playerInfo.petMaxCount = msg.petCount;
                break;
            case 1:// 英灵竞技更新
                playerInfo.petChallengeIndexFormation = msg.fightIndex;
                playerInfo.petChallengeFormation = msg.chaPos;
                for (let petMsg of petInfoArr) {
                    if (!petMsg.petId) {
                        continue;
                    }
                    let pet: PetData = playerInfo.getPet(petMsg.petId);
                    if (!pet) {
                        continue
                    }
                    pet.beginChanges();

                    pet.petId = petMsg.petId;
                    pet.templateId = petMsg.templateId;
                    pet.name = petMsg.petName;
                    pet.quality = Math.floor((petMsg.quality - 1) / 5) + 1;
                    pet.grade = petMsg.curGrade;
                    pet.petChallengeSkillsOfString = petMsg.chaSkillIndexs;

                    pet.thaneInfo = ArmyManager.Instance.thane;
                    playerInfo.addPet(pet);
                    thaneInfo.addPet(pet);
                    pet.commit();
                }
                break;
            case 0://全量更新
                playerInfo.petMaxCount = msg.petCount;
                playerInfo.petChallengeIndexFormation = msg.fightIndex;
                playerInfo.petChallengeFormation = msg.chaPos;

                for (let petMsg of petInfoArr) {
                    if (!petMsg.petId) {
                        continue;
                    }
                    if (petMsg.isDel) {
                        playerInfo.removePet(petMsg.petId);
                        thaneInfo.removePet(petMsg.petId);
                        continue;
                    }
                    let isUpdate: boolean = true;
                    let oldGrade: number = 0;
                    let pet: PetData = playerInfo.getPet(petMsg.petId);
                    if (!pet) {
                        pet = new PetData();
                        pet.userId = playerInfo.userId;
                        isUpdate = false;
                    }
                    oldGrade = pet.grade;
                    pet.beginChanges();
                    PetData.createWithMsg(petMsg as PetInfoMsg, pet);
                    pet.thaneInfo = ArmyManager.Instance.thane;
                    playerInfo.addPet(pet);
                    thaneInfo.addPet(pet);
                    pet.commit();
                    if (pet.isEnterWar && isUpdate && oldGrade != pet.grade) {
                        //升级提示
                        this.dispatchEvent(PetEvent.PET_LEVEL_UP, pet);
                    }
                    //在第一次登录, 或者出战宠物升级时提示,切换英灵
                    if (pet.isEnterWar && pet.remainPoint > 0 && (playerInfo.enterWarPet != pet || !isUpdate || oldGrade != pet.grade)) {
                        this.showAddPointTip();
                    }
                }
                break;
        }
        playerInfo.commit();

        if (playerInfo.enterWarPet) {
            thaneInfo.petTemplateId = playerInfo.enterWarPet.templateId;
            thaneInfo.petName = playerInfo.enterWarPet.name;
            thaneInfo.petQuaity = playerInfo.enterWarPet.quality;
            thaneInfo.temQuality = playerInfo.enterWarPet.temQuality;
        } else {
            thaneInfo.petTemplateId = 0;
            thaneInfo.petName = "";
            thaneInfo.petQuaity = 1;
            thaneInfo.temQuality = 1;
        }
        thaneInfo.commit();
    }


    private showAddPointTip() {
        let tip: TipMessageData = new TipMessageData();
        tip.title = LangManager.Instance.GetTranslation("public.prompt");
        tip.type = TipMessageData.PET_ADD_POINT;
        TaskTraceTipManager.Instance.showView(tip);
    }

    private __getSimpleAndSnsInfoHandler(pkg: PackageIn) {
        let msg: RelationPlayerMsg = pkg.readBody(RelationPlayerMsg) as RelationPlayerMsg;
        let orientation: number = msg.from;
        let pInfo: FriendItemCellInfo = new FriendItemCellInfo();
        SocketGameReader.readSimpleAndSnsInfo(pInfo, msg);
        if (orientation == RequestInfoRientation.MENU_INFO || orientation == RequestInfoRientation.IM_INFO)  //在好友面板点出好友菜单或打开聊天窗时需要更新好友信息
        {
            let fInfo: FriendItemCellInfo = IMManager.Instance.getFriendInfo(pInfo.userId);
            if (fInfo)  //如果存在好友信息则更新好友信息, 注意不要把pInfo直接赋值给fInfo了, 对属性单独赋值
            {
                fInfo.grades = pInfo.grades;
                fInfo.fightingCapacity = pInfo.fightingCapacity;
                fInfo.consortiaName = pInfo.consortiaName;
                fInfo.snsInfo = pInfo.snsInfo;
                FriendManager.getInstance().updatePrivatePerson(fInfo);  //同时更新最近联系人信息
                FriendManager.getInstance().dispatchEvent(FriendUpdateEvent.FRIEND_CHANGE, pInfo.snsInfo);
            }
        }
        this.dispatchEvent(RequestInfoEvent.REQUEST_SIMPLEANDSNS_INFO, orientation, pInfo);
    }


    public moveBagToBag(beginBagType: number, beginObjectId: number, beginPos: number, endBagType: number, endObjectId: number, endPos: number, count: number, isUninstal: boolean = false) {
        SocketSendManager.Instance.sendMoveBagToBag(beginBagType, beginObjectId, beginPos, endBagType, endObjectId, endPos, count, isUninstal);
    }

    public deleteBagGoods(bagType: number, objectId: number, pos: number, count: number) {
        this.moveBagToBag(bagType, objectId, -1, bagType, objectId, pos, count);
    }

    /**
     * 是否处于新手
     */
    public get isNewbie(): boolean {
        return false;
    }

    //
    //     /**
    //      * 是否存在新手遮罩
    //      */
    //     public isExistNewbieMask:boolean;

    //*********************************************************

    /**
     *查看用户简要信息
     * @param id（用户ID）
     * @param direct(用户所在服务器)
     *
     */
    public sendRequestSimpleInfo(id: number, direct: number) {
        let msg: InfoReqMsg = new InfoReqMsg();
        msg.otherId = id;
        msg.from = direct;
        SocketManager.Instance.send(C2SProtocol.C_SIMPLEUSER_INFO, msg);
    }

    /**
     *请求好友基本信息和社交信息
     * @param userId(用户ID）
     * @param direct（用户服务器）
     *
     */
    public sendRequestSimpleAndSnsInfo(userId: number, direct: number) {
        let msg: InfoReqMsg = new InfoReqMsg();
        msg.otherId = userId;
        msg.from = direct;
        SocketManager.Instance.send(C2SProtocol.CH_SIMPLEUSER_INFO, msg);
    }

    /**
     * 查看用户装备
     * @param id（用户ID）
     * @param direct（用户所在服务器）
     * @param needItem
     * @param needHero
     * @param needArmy
     * @param needPawn
     *
     */
    public sendRequestEquip(id: number, direct: number, needItem: boolean = false, needHero: boolean = false, needArmy: boolean = false, needPawn: boolean = false) {
        let msg: DetailReqMsg = new DetailReqMsg();
        msg.otherId = id;
        msg.itemInfo = needItem;
        msg.heroInfo = needHero;
        msg.armyInfo = needArmy;
        msg.pawnInfo = needPawn;
        SocketManager.Instance.send(C2SProtocol.C_BAG_EQUIPLOOK, msg);
    }

    /**
     * 同步系统时间
     */
    public synchronizedSystime() {
        SocketManager.Instance.send(C2SProtocol.C_SYNCHRONIZED_TIME);
        Logger.base("请求同步============================= :  " + Laya.Browser.now());
    }

    /**
     * 加速检测
     *
     */
    public checkAccelerator() {
        SocketManager.Instance.send(C2SProtocol.C_CHECK_ACCELERATOR);
    }

    /**
     *通知服务器当前客户端使用加速器
     *
     */
    public useAccelerate() {
        let msg: PropertyMsg = new PropertyMsg();
        msg.param1 = 0;
        SocketManager.Instance.send(C2SProtocol.G_ACCELERATOR, msg);

    }

    /**
     * 通知服务器当前客户端使用外挂
     *
     */
    public useTools() {
        let msg: PropertyMsg = new PropertyMsg();
        msg.param1 = 1;
        SocketManager.Instance.send(C2SProtocol.G_ACCELERATOR, msg);
    }

    /**
     * 传送城堡
     *
     */
    public sendMoveCastle(mapId: number, posX: number, posY: number, payType: number) {
        SocketSendManager.Instance.sendMoveCastle(mapId, posX, posY, payType);
    }

    /**
     * 征收
     * @param op 0免费征收  1 付费征收
     * @param payType   1绑钻 2钻
     */
    public sendLevy(op: number = 0, payType: number = 1) {
        let msg: GoldImposeReqMsg = new GoldImposeReqMsg();
        msg.op = op;
        msg.payType = payType;
        SocketManager.Instance.send(C2SProtocol.C_GOLD_IMPOSE, msg);
    }

    //*******************************************
    public get currentPlayerModel(): PlayerModel {
        return this._playerModel;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public get watingList(): SimpleDictionary {
        return this._watingList;
    }

    // private _openCustomerHandler(pkg:PackageIn)
    // {
    //     let pkg:PackageIn = e. < PackageIn > data;
    //     let msg:FastOpenCustomerMsg = new FastOpenCustomerMsg();
    //     msg = pkg.readBody(msg) as FastOpenCustomerMsg;
    //     this.openCustomerServiceFrame = msg.canOpen;
    // }
    //
    // public changeVehicle(templateId:number)
    // {
    //     let pkg:PackageOut = new PackageOut(ProtocolType.C_VEHICLE_CHOOSE_VEHICLE);
    //     let msg:CampaignReqMsg = new CampaignReqMsg();
    //     msg.paraInt1 = templateId;
    //     SocketSendManager.Instance.sendProtoBuffer(pkg, msg);
    // }
    //
    // public sendRequestPetData(userId:number)
    // {
    //     let pkg:PackageOut = new PackageOut(ProtocolType.C_GET_PLAYER_PET_INFO);
    //     let msg:PlayerPetOpMsg = new PlayerPetOpMsg();
    //     msg.petId = userId;
    //     SocketSendManager.Instance.sendProtoBuffer(pkg, msg);
    // }
    //

    //
    private __transferCastleHandler(pkg: PackageIn) {//0x0069
        let msg: CastleReqMsg = pkg.readBody(CastleReqMsg) as CastleReqMsg;
        this.currentPlayerModel.mapNodeInfo.info.posX = msg.posX;
        this.currentPlayerModel.mapNodeInfo.info.posY = msg.posY;
        this.currentPlayerModel.mapNodeInfo.info.mapId = msg.magId;
        this.currentPlayerModel.mapNodeInfo.info = this.currentPlayerModel.mapNodeInfo.info;

        if (msg.isTransfer) {
            let buildInfoi: BuildInfo = BuildingManager.Instance.model.buildingListByID[-11];
            buildInfoi.property1 = msg.leftEnergy;//传送阵能量
            buildInfoi.property2 = msg.leftTime;//传送阵时间
            buildInfoi.loadTime = Laya.Browser.now() / 1000;//getTimer() / 1000;
            GameBaseQueueManager.Instance.addAction(new TransferOuterCityAction());
            this.dispatchEvent(ServiceReceiveEvent.TRANSEFER_CASTLE_SUCCESS, true, null);
        }
    }

    /**
     * 战斗守护
     * @param pkg
     * @private
     */
    private __battleguardInfoHandler(pkg: PackageIn) {
        let msg: HeroWatchMsg = pkg.readBody(HeroWatchMsg) as HeroWatchMsg;
        let thaneInfo: ThaneInfo = this.thane;
        thaneInfo.beginChanges();
        if (!thaneInfo.battleGuardInfo) {
            thaneInfo.battleGuardInfo = new BattleGuardInfo();
        }
        for (let info of msg.watchInfo) {
            let item: BattleGuardSocketInfo = thaneInfo.battleGuardInfo.getSocketInfo(info.gridType, info.gridPos - 1);
            item.addItem(info.jion1, 0);
            item.addItem(info.jion2, 1);
            item.addItem(info.jion3, 2);
            item.commit();
            if (item.state == BattleGuardSocketInfo.CLOSE) {
                item.state = BattleGuardSocketInfo.OPEN;
                thaneInfo.battleGuardInfo.dispatchEvent(NotificationEvent.OPEN_BATTLEGUARD_ITEM, item);
            }
        }
        thaneInfo.commit();

        this.currentPlayerModel.playerInfo.battleGuardInfo = thaneInfo.battleGuardInfo;
    }

    public sendAddBattleGem(type: number, pos: number, socketPos: number, goodsInfo: GoodsInfo) {
        //判断是否有相同类型宝石
        let item: BattleGuardSocketInfo = this.thane.battleGuardInfo.getSocketInfo(type, pos);
        if (!item) {
            return;
        }
        let tipstr: string;
        let goodsType: number = goodsInfo.templateInfo.Property1;
        if (type == 1) {
            //减抗
            if (goodsType != 100) {
                tipstr = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellDropMediator.command02");
            }
        }
        else {
            let typeArr: any[] = [101, 102, 103, 104, 105, 106];
            if (typeArr.indexOf(goodsType) < 0) {
                tipstr = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellDropMediator.command02");
            }
            else if (item.existSameGoods(goodsInfo.templateId, socketPos)) {
                tipstr = LangManager.Instance.GetTranslation("PlayerManager.sendAddBattleGemTip01");
            }
        }


        if (tipstr) {
            MessageTipManager.Instance.show(tipstr);
            return;
        }

        let msg: HeroWatchOpMsg = new HeroWatchOpMsg();
        msg.opType = 2; //1 解锁 , 2 镶嵌 ,  3 拆除
        msg.gridType = type;
        msg.gridPos = pos + 1;
        msg.itemPos = goodsInfo.pos;
        msg.jionPos = socketPos + 1;
        SocketManager.Instance.send(C2SProtocol.C_BATTLEGUARD_OP, msg);
    }

    public sendRemoveBattleGem(type: number, pos: number, socketPos: number) {
        let msg: HeroWatchOpMsg = new HeroWatchOpMsg();
        msg.opType = 3; //1 解锁 , 2 镶嵌 ,  3 拆除
        msg.gridType = type;
        msg.gridPos = pos + 1;
        msg.jionPos = socketPos + 1;
        SocketManager.Instance.send(C2SProtocol.C_BATTLEGUARD_OP, msg);
    }

    public sendOpenBattleItem(type: number, pos: number) {
        let msg: HeroWatchOpMsg = new HeroWatchOpMsg();
        msg.opType = 1; //1 解锁 , 2 镶嵌 ,  3 拆除
        msg.gridType = type;
        msg.gridPos = pos + 1;
        SocketManager.Instance.send(C2SProtocol.C_BATTLEGUARD_OP, msg);
    }

    // //战斗守护 end
    //
    /**
     * 获取职业名称
     * @param step    1-10 阶
     * @param job    1-3 职业
     * @param level    1-8 段
     * @return
     *
     */
    public getVocationName(job: number, step: number = 1, level: number = 1): string {
        let vocationName: string = "";
        if (step < 10) {
            vocationName += LangManager.Instance.GetTranslation("yishi.manager.PlayerManager.VocationStep0" + step);
        }
        else if (step == 10) {
            vocationName += LangManager.Instance.GetTranslation("yishi.manager.PlayerManager.VocationStep" + step);
        }
        vocationName += LangManager.Instance.GetTranslation("yishi.manager.PlayerManager.VocationJob" + job + "Level" + level);
        return vocationName;
    }
    //
    // private __dragonSoulReqHandler(pkg: PackageIn) {

    //     let msg = pkg.readBody(FateListMsg) as FateListMsg;
    //     let playerInfo: PlayerInfo = this.currentPlayerModel.playerInfo;
    //     playerInfo.beginChanges();
    //     let dragonType: number = 0;
    //     for (const infoMsg of msg.fateInfo) {
    //         if (infoMsg.fateTypes > dragonType) {
    //             dragonType = infoMsg.fateTypes;
    //             playerInfo.dragonSoulType = infoMsg.fateTypes; //龙魂类型（转职前32, 转职后33）
    //             playerInfo.dragonSoulGrade = infoMsg.grades; //龙魂等级
    //             playerInfo.dragonSoulGp = infoMsg.totalGp; //当前等级对应经验
    //         }
    //     }
    //     playerInfo.commit();
    // }
    //
    // private __dragonSoulTransferHandler(evt:SLGSocketEvent)
    // {
    //     let pkg:PackageIn = evt. < PackageIn > data;
    //     let msg:PropertyMsg = new PropertyMsg();
    //     msg = pkg.readBody(msg) as PropertyMsg;
    //     msg.param1; //玩家ID
    //     msg.param2; //玩家职业（战士, 射手, 法师）
    //     msg.param3; //玩家转职之后的等级
    //     msg.param4; //玩家昵称
    //     msg.param5; //公会ID
    //     let tempInfo:SimplePlayerInfo = new SimplePlayerInfo();
    //     let userId:number = msg.param1;
    //     let userob:number = msg.param2;
    //     tempInfo.vocationGrades = msg.param3;
    //     let userName:string = msg.param4;
    //     let consortiaId:string = msg.param5;
    //     if(userId == this.currentPlayerModel.playerInfo.userId)
    //     {
    //         this.currentPlayerModel.playerInfo.transfer();
    //         CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.WARLORDS, this.showFireworkCall, [0, 5, 5, 3, 20]);
    //     }
    //     let vocationName:string = this.getVocationName(userob, tempInfo.vocationStep, tempInfo.vocationLevel);
    //     let chatData:ChatData;
    //     let userNameXml:string = "<a t='1' id='" + userId + "' name='" + userName + "' consortiaId='" + consortiaId + "' />";
    //     let content:string = LanguageMgr.GetTranslation("yishi.manager.PlayerManager.TransferTip01", userNameXml, vocationName);
    //     chatData = ObjectPool.getObject(ChatData) as ChatData;
    //     if(chatData)
    //     {
    //         chatData.channel = ChatChannel.INFO;
    //         chatData.msg = content;
    //         chatData.commit();
    //         NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
    //     }
    //     if(SpaceManager.Instance.model)
    //     {
    //         let aInfo:SpaceArmy = SpaceManager.Instance.model.getBaseArmyByUserId(userId);
    //         let hInfo:ThaneInfo;
    //         let view:Object;
    //         if(aInfo)
    //         {
    //             view = SpaceManager.Instance.controller.getArmyView(aInfo);
    //             if(view)
    //             {
    //                 view["showDragonTransferEffect"]();
    //             }
    //             hInfo = aInfo.baseHero;
    //             hInfo.beginChanges();
    //             hInfo.vocationGrades = tempInfo.vocationGrades;
    //             hInfo.commit();
    //         }
    //     }
    // }
    //
    // private __dragonSoulTransferInfoHandler(evt:SLGSocketEvent)
    // {
    //     let pkg:PackageIn = evt. < PackageIn > data;
    //     let msg:FateInfoMsg = new FateInfoMsg();
    //     msg = pkg.readBody(msg) as FateInfoMsg;
    //     let playerInfo:PlayerInfo = this.currentPlayerModel.playerInfo;
    //     playerInfo.beginChanges();
    //     msg.templateId; //玩家ID
    //     playerInfo.vocationGrades = msg.grades; //当前等级
    //     playerInfo.vocationGp = msg.totalGp; //当前
    //     playerInfo.commit();
    // }
    //
    // private showFireworkCall(args:any[])
    // {
    //     let petalFlyView:PetalFlyView = new PetalFlyView(args[0], args[1], args[2], args[3], args[4]);
    //     petalFlyView.show();
    // }

    /**
     * 请求TOKEN
     * @param userId  7ROAD+游密账号
     */
    public reqToken(userId: string) {
        let msg: FetchTokenReq = new FetchTokenReq();
        msg.userId = userId;
        SocketManager.Instance.send(C2SProtocol.C_FETCH_TOKEN, msg);
    }

    /**
     * 返回TOKEN
     * @param pkg 
     */
    private onRecvToken(pkg: PackageIn) {
        let msg = pkg.readBody(FetchTokenRsp) as FetchTokenRsp;
        if (msg.token) {
            this.currentPlayerModel.playerInfo.youmeToken = msg.token;
            let userId: string = this.currentPlayerModel.userInfo.mainSite + '_' + this.currentPlayerModel.playerInfo.userId;
            let password: string = NativeChannel.IDENTIFY + "_" + userId;
            //进入游戏后登录sdk
            let channel: BaseChannel = SDKManager.Instance.getChannel();
            if (channel instanceof WanChannel) {
                channel.voiceLogin(userId, '', msg.token);
            } else if (channel instanceof NativeChannel) {
                channel.voiceLogin(userId, password, msg.token);
            } else {
                channel.voiceLogin(userId, password, msg.token);
            }
        }
    }

    /**
     * 查询2015新年礼箱采集节点信息返回
     * 5.7版本改为天空之城统一中控配置的特殊采集节点
     * @param e
     */
    private __receiveYearNodeDataHandler(pkg: PackageIn) {
        let msg: QueryCollectCampaignNodeRspMsg = pkg.readBody(QueryCollectCampaignNodeRspMsg) as QueryCollectCampaignNodeRspMsg;
        let nodeIdsDic: Map<any, any> = new Map<any, any>();
        for (let i: number = 0; i < msg.collectCampaignNode.length; i++) {
            let item: CollectCampaignNodeMsg = msg.collectCampaignNode[i] as CollectCampaignNodeMsg;
            nodeIdsDic.set(item.campaignDataId, item);
        }
        // Logger.xjy("[PlayerManager]__receiveYearNodeDataHandler", nodeIdsDic)
        let spaceModel = SpaceManager.Instance.model
        if (spaceModel && spaceModel.mapNodesData) {
            for (let j: number = 0; j < spaceModel.mapNodesData.length; j++) {
                let nodeInfo: SpaceNode = spaceModel.mapNodesData[j];
                if (nodeInfo && SpaceNodeType.isYearNode(nodeInfo.info.types)) {
                    if (!nodeIdsDic.get(nodeInfo.info.id)) {
                        if ((nodeInfo as SpaceNode).stateId != SpaceNode.STATE0) {
                            (nodeInfo as SpaceNode).stateId = SpaceNode.STATE0;
                            nodeInfo.dispatchEvent(OuterCityEvent.UPDATA_MAP_PHYSICS, null);
                        }
                    } else {
                        (nodeInfo as SpaceNode).sonType = nodeIdsDic.get(nodeInfo.info.id).sonType;
                        nodeInfo.info.names = nodeIdsDic.get(nodeInfo.info.id).name;
                        if ((nodeInfo as SpaceNode).stateId != SpaceNode.STATE1) {
                            (nodeInfo as SpaceNode).stateId = SpaceNode.STATE1;
                            nodeInfo.dispatchEvent(OuterCityEvent.UPDATA_MAP_PHYSICS, null);
                        }
                    }
                }
            }
        }
    }

    /**
     * 通知
     * @param pkg 
     */
    private __storeRatingNotify(pkg: PackageIn) {
        if (!ConfigManager.info.STORE_RATING) return;
        let msg: StoreRatingsNotifyInfo = pkg.readBody(StoreRatingsNotifyInfo) as StoreRatingsNotifyInfo;
        this.scoreRatingCondition = msg.conditionType;
        this.isExistScoreRating = true;
        Logger.xjy("__storeRatingNotify:", this.scoreRatingCondition, this.isExistScoreRating);
        if (PlayerManager.Instance.isScoreRatingApp && PlayerManager.Instance.isExistScoreRating && PlayerManager.Instance.scoreRatingCondition == StoreRatingsType.FIRST_MYSTERIOUS_6_GEMS) {
            GameBaseQueueManager.Instance.addAction(new StoreRatingAction(), true);
        }
    }

    public clearScoreRating() {
        this.scoreRatingCondition = 0;
        this.isExistScoreRating = false;
    }

    /**
     * 评级
     * @param rating 评级
     * @param comment 内容
     */
    public ratingStoreReport(rating: number, comment: string = "") {
        let msg: StoreRatingsReport = new StoreRatingsReport();
        msg.rating = rating;
        msg.comment = comment
        SocketManager.Instance.send(C2SProtocol.C_STORE_RATINGS_REPORT, msg);
    }

    /**
     * 评论返回结果
     * @param pkg 
     */
    private __storeRatingRsp(pkg: PackageIn) {
        let msg: StoreRatingsResp = pkg.readBody(StoreRatingsResp) as StoreRatingsResp;
        if (msg.result == 1) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("storeRating.result"));
        } else {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("storeRating.fail"));
        }
    }

    /**
     * 微端
     * @param pkg 
     */
    private __microAppInfoHandler(pkg: PackageIn) {
        let msg: MicroTerminalInfo = pkg.readBody(MicroTerminalInfo) as MicroTerminalInfo;
        this.hasRecMicroAppReward = msg.hasReward;
        NotificationManager.Instance.dispatchEvent(PlayerEvent.MICRO_APP_EVENT)
    }

    /**
     * 评级
     * @param rating 评级
     * @param comment 内容
     */
    public reqMicroApp() {
        SocketManager.Instance.send(C2SProtocol.C_MICRO_TERMINAL_REWARD, null);
    }

    private aCrossTheDayHandler() {
        ShopManager.Instance.getBuyDataInfos();
        ShopManager.Instance.model && ShopManager.Instance.model.resetHasBuyList();
        BottleManager.Instance.sendOpenInfo(4, 0);
    }

    /**
    * 升级/升阶荣誉装备
    * @param param1 1升级 2升阶
    */
    public reqHonorEquipLevelUp(param1: number) {
        let msg: HonorEquipReq = new HonorEquipReq();
        msg.param1 = param1;
        SocketManager.Instance.send(C2SProtocol.C_HONOR_EQUIP_LEVELUP, msg);
    }


    /**
     * 请求秘典信息
     * @param op 1:激活 2：升级
     * @param jobType // 类型
     */
    public reqExtraJobInfo(op: number,jobType:number) {
        let msg: ExtraJobReqMsg = new ExtraJobReqMsg();
        msg.op = op;
        msg.jobType = jobType;
        SocketManager.Instance.send(C2SProtocol.C_EXTRAJOB_REQ, msg);
    }

    /**
     * 魂器请求
     * @param op  // 1:激活 2：升阶(培养) 3:强化 4:魂器宝石镶嵌 5:魂器宝石拆除
     * @param equipType //  类型 （对应编号1~6，右上开始顺时针）
     * @param bag_type //  宝石背包类型
     * @param bag_pos // 背包位置
     * @param pos //  镶嵌位置
     */
    public reqExtraJobEquip(op: number,equipType:number,bag_type:number,bag_pos:number,pos:number) {
        let msg: ExtraJobEquipReqMsg = new ExtraJobEquipReqMsg();
        msg.op = op;
        msg.equipType = equipType;
        msg.bagType = bag_type;
        msg.bagPos = bag_pos;
        msg.pos = pos;
        SocketManager.Instance.send(C2SProtocol.C_EXTRAJOBEQUIP_REQ, msg);
    }
}