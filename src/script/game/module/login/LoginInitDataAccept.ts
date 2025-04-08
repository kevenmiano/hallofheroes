// @ts-nocheck
import Logger from "../../../core/logger/Logger";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import FriendGroupInfo from "../../datas/FriendGroupInfo";
import FriendItemCellInfo from "../../datas/FriendItemCellInfo";
import FriendModel from "../../datas/model/FriendModel";
import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import { BaseCastle } from "../../datas/template/BaseCastle";
import { ArmyManager } from "../../manager/ArmyManager";
import { FarmManager } from "../../manager/FarmManager";
import { FriendManager } from "../../manager/FriendManager";
import IMManager from "../../manager/IMManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { WaterManager } from "../../manager/WaterManager";
import BuildingManager from "../../map/castle/BuildingManager";
import BuildingModel from "../../map/castle/BuildingModel";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { PhysicInfo } from "../../map/space/data/PhysicInfo";
import { LoginManager } from './LoginManager';
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import DayGuideSocketOutManager from "../../manager/DayGuideSocketOutManager";
import { ConfigManager } from "../../manager/ConfigManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import BaseCastleMsg = com.road.yishi.proto.army.BaseCastleMsg;
import BuildOrderList = com.road.yishi.proto.building.BuildOrderList;
import BuildingInfoListMsg = com.road.yishi.proto.building.BuildingInfoListMsg;
import FarmLandInfoMsg = com.road.yishi.proto.farm.FarmLandInfoMsg;
import FarmPetInfoMsg = com.road.yishi.proto.farm.FarmPetInfoMsg;
import LoadFarmRsp = com.road.yishi.proto.farm.LoadFarmRsp;
import TreeInfoMsg = com.road.yishi.proto.farm.TreeInfoMsg;
import RankRewardMsg = com.road.yishi.proto.pet.RankRewardMsg;
import ChallengeCoolTimeMsg = com.road.yishi.proto.player.ChallengeCoolTimeMsg;
import ChallengeRankRewardMsg = com.road.yishi.proto.player.ChallengeRankRewardMsg;
import PlayerAASRefreshMsg = com.road.yishi.proto.player.PlayerAASRefreshMsg;
import SystemPropertyMsg = com.road.yishi.proto.player.SystemPropertyMsg;
import VersionMsg = com.road.yishi.proto.player.VersionMsg;
import FriendRelationList = com.road.yishi.proto.simple.FriendRelationList;
import SNSInfoMsg = com.road.yishi.proto.simple.SNSInfoMsg;
import RelationPlayerMsg = com.road.yishi.proto.simple.RelationPlayerMsg;
import FriendGroupMsg = com.road.yishi.proto.simple.FriendGroupMsg;
import FarmInfo from "../farm/data/FarmInfo";
import FarmLandInfo from "../farm/data/FarmLandInfo";
import { WaterLogInfo } from "../farm/data/WaterLogInfo";
import FriendFarmStateInfo from "../farm/data/FriendFarmStateInfo";
import { TreeInfo } from "../farm/data/TreeInfo";
import PetLandInfo from "../farm/data/PetLandInfo";
import BuildingInfoMsg = com.road.yishi.proto.building.BuildingInfoMsg;
import { ChargeLotteryManager } from "../../manager/ChargeLotteryManager";
import { LuckBlindBoxManager } from "../../manager/LuckBlindBoxManager";
import { SuperGiftOfGroupManager } from "../../manager/SuperGiftOfGroupManager";
import HeadIconCtr from "../bag/view/HeadIconCtr";


/**
 * 登陆后基础数据接收
 */
export default class LoginInitDataAccept {
    public static total: number = 10;
    private _current: number = 0;
    private _callBack: Function;//完成回调

    public constructor() {
        this.addEvent();
    }

    private addEvent() {
        FrameCtrlManager.Instance.setup();
        ServerDataManager.listen(S2CProtocol.U_C_LOAD_CASTLE, this, this.__loadCastleHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LOAD_BUILD, this, this.__loadBuildHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LOAD_BUILD_ORDER, this, this.__loadBuildOrderHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LOAD_FRIEND_LIST, this, this.__loadFriendListHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LOAD_WATER, this, this.__loadFarmHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SEND_SYSPROPERTY, this, this.__setSystemTime);
        ServerDataManager.listen(S2CProtocol.U_C_PLAYER_AASREFRESH, this, this.__refreshIndygleTime);
        ServerDataManager.listen(S2CProtocol.U_C_CHALLENGE_TIME, this, this.__colosseumTimeHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SEND_VERSION, this, this.__versionHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ISTAKE_CHALLENGEREWARD, this, this.__challengeTakeHandler);
        ServerDataManager.listen(S2CProtocol.U_CH_SNS_REQ, this, this.__snsReqHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ISTAKE_CROSS_SCORE_REWARD, this, this.__pvpTakeHandler);
        ServerDataManager.listen(S2CProtocol.U_C_PET_RANK_REWARD, this, this.__petRankRewardHandler);
    }

    private removeEvent() {
        ServerDataManager.cancel(S2CProtocol.U_C_LOAD_WATER, this, this.__loadFarmHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_LOAD_BUILD, this, this.__loadBuildHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_LOAD_CASTLE, this, this.__loadCastleHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_LOAD_BUILD_ORDER, this, this.__loadBuildOrderHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_LOAD_FRIEND_LIST, this, this.__loadFriendListHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_SEND_SYSPROPERTY, this, this.__setSystemTime);
        ServerDataManager.cancel(S2CProtocol.U_C_PLAYER_AASREFRESH, this, this.__refreshIndygleTime);
        ServerDataManager.cancel(S2CProtocol.U_C_CHALLENGE_TIME, this, this.__colosseumTimeHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_SEND_VERSION, this, this.__versionHandler);
        ServerDataManager.cancel(S2CProtocol.U_CH_SNS_REQ, this, this.__snsReqHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_PET_RANK_REWARD, this, this.__petRankRewardHandler);
    }

    private __petRankRewardHandler(pkg: PackageIn) {
        let msg: RankRewardMsg = pkg.readBody(RankRewardMsg);
        // status
        // 0 : 有奖励, 未领取
        // 1 : 有奖励, 已领取
        // 2 : 没有奖励
        // if (msg.status == PetChallengeController.STATUS_HAS) {
        //     if (msg.type == PetChallengeController.RANK_DAY) {
        //         // 日奖励
        //         PlayerManager.Instance.currentPlayerModel.playerInfo.canAcceptPetChallDayReward = true;
        //     }
        //     else if (msg.type == PetChallengeController.RANK_WEEK) {
        //         // 周奖励
        //         PlayerManager.Instance.currentPlayerModel.playerInfo.canAcceptPetChallWeekReward = true;
        //     }
        // }
    }

    private request() {
        LoginManager.Instance.hasLogin = true;
        LoginManager.Instance.loginInitDataReq();
        DayGuideSocketOutManager.sendLeedClientUpdate(1);  //每日引导每日登陆任务检测
        ChargeLotteryManager.instance.OperateChargeReq(1);
        // LuckBlindBoxManager.Instance.requestProtocol(1);
        // SuperGiftOfGroupManager.Instance.request();
    }

    private _time: number = 0;

    public losyBackCall(fun: Function) {
        this._time = new Date().getTime();
        Logger.info("request login data-----------------------:");
        this._callBack = fun;
        this.request();
    }

    private nextStep(str: string) {
        Logger.info(str + " cost time-----------------------:" + new Date().getTime());
        this._current++;
        Logger.info(str + "==================================== cur : " + this._current);
        if (this._current >= LoginInitDataAccept.total - 1) {
            if (this._callBack != null) {
                this._callBack(LoginInitDataAccept.total);
            }
            this._callBack = null;
        } else {
            if (this._callBack != null) {
                this._callBack(this._current);
            }
        }
    }

    private renameUiCallback() {
        // new RenameView(RenameView.TYPE_COMPOSE, this._callBack).show();
        // let MaxLoading: * = DisplayLoader.Context.applicationDomain.getDefinition("loading.MaxLoading") as Class;
        // if (MaxLoading) MaxLoading.Instance.resetCursor();
    }

    public static loginOverRequest() {//登陆后再请求的数据
        LoginManager.Instance.loginDataOverReq();
        HeadIconCtr.requestAllFrame();
    }

    private __challengeTakeHandler(pkg: PackageIn) {
        let msg: ChallengeRankRewardMsg = pkg.readBody(ChallengeRankRewardMsg)
        PlayerManager.Instance.currentPlayerModel.playerInfo.isChallReward = msg.isTake;
        PlayerManager.Instance.currentPlayerModel.playerInfo.challRewardLastRank = msg.param1;
    }

    private __snsReqHandler(pkg: PackageIn) {
        let msg: SNSInfoMsg = pkg.readBody(SNSInfoMsg) as SNSInfoMsg;
        if (msg) {
            if (msg.hasOwnProperty("userId")) {
                this.thane.snsInfo.userId = msg.userId;
            }
            if (msg.hasOwnProperty("nickname")) {
                this.thane.snsInfo.nickName = msg.nickname;
            }
            if (msg.hasOwnProperty("headId")) {
                this.thane.snsInfo.headId = msg.headId;
            }
            if (msg.hasOwnProperty("signDesc")) {
                this.thane.snsInfo.sign = msg.signDesc;
            }
            if (msg.hasOwnProperty("sex")) {
                this.thane.snsInfo.sex = msg.sex;
            }
            if (msg.hasOwnProperty("birthdayType")) {
                this.thane.snsInfo.birthdayType = msg.birthdayType;
            }
            if (msg.hasOwnProperty("birthYear")) {
                this.thane.snsInfo.birthYear = msg.birthYear;
            }
            if (msg.hasOwnProperty("birthMonth")) {
                this.thane.snsInfo.birthMonth = msg.birthMonth;
            }
            if (msg.hasOwnProperty("birthDay")) {
                this.thane.snsInfo.birthDay = msg.birthDay;
            }
            if (msg.hasOwnProperty("starId")) {
                this.thane.snsInfo.horoscope = msg.starId;
            }
            if (msg.hasOwnProperty("bloodType")) {
                this.thane.snsInfo.bloodType = msg.bloodType;
            }
            if (msg.hasOwnProperty("country")) {
                this.thane.snsInfo.country = msg.country;
            }
            if (msg.hasOwnProperty("province")) {
                this.thane.snsInfo.province = msg.province;
            }
            if (msg.hasOwnProperty("city")) {
                this.thane.snsInfo.city = msg.city;
            }
        }
        this.nextStep("__snsReqHandler " + " msg :" + JSON.stringify(msg)+ "---" + PlayerManager.Instance.currentPlayerModel.playerInfo.showVersion.toString());
    }

    private __pvpTakeHandler(pkg: PackageIn) {
        let msg: ChallengeRankRewardMsg = pkg.readBody(ChallengeRankRewardMsg)
        PlayerManager.Instance.currentPlayerModel.playerInfo.beginChanges();
        PlayerManager.Instance.currentPlayerModel.playerInfo.canAcceptCrossScoreAward = msg.isTake;
        PlayerManager.Instance.currentPlayerModel.playerInfo.commit();
    }

    private __versionHandler(pkg: PackageIn) {
        let msg: VersionMsg = pkg.readBody(VersionMsg)
        PlayerManager.Instance.currentPlayerModel.playerInfo.showVersion = msg.openVersion;
        PlayerManager.Instance.currentPlayerModel.playerInfo.showStory = msg.openStory;
        PlayerManager.Instance.currentPlayerModel.playerInfo.showStoryModule = msg.module;
        this.nextStep("__versionHandler: " + " msg :" + JSON.stringify(msg) + " --- " + PlayerManager.Instance.currentPlayerModel.playerInfo.showVersion.toString());
    }

    private __setSystemTime(pkg: PackageIn) {
        let msg: SystemPropertyMsg = pkg.readBody(SystemPropertyMsg)
        PlayerManager.Instance.currentPlayerModel.sysCurtime = DateFormatter.parse(msg.sysCurtime, "YYYY-MM-DD hh:mm:ss");
        PlayerManager.Instance.currentPlayerModel.sysStartTime = DateFormatter.parse(msg.sysStarTime, "YYYY-MM-DD hh:mm:ss");
        this.nextStep("__setSystemTime: " + " msg :" + JSON.stringify(msg) + " --- " + PlayerManager.Instance.currentPlayerModel.sysCurtime.toString());
        NotificationManager.Instance.sendNotification(NotificationEvent.REFRESH_TOPTOOLS);
    }

    private __refreshIndygleTime(pkg: PackageIn) {
        let msg: PlayerAASRefreshMsg = pkg.readBody(PlayerAASRefreshMsg);
        PlayerManager.Instance.currentPlayerModel.isInAAS = !msg.isCloseAAS;
        PlayerManager.Instance.currentPlayerModel.indulgeTime = msg.aasOnlineTime;
        this.nextStep("__refreshIndygleTime: " + " msg :" + JSON.stringify(msg) + " --- " + PlayerManager.Instance.currentPlayerModel.indulgeTime.toString());
    }

    private __colosseumTimeHandler(pkg: PackageIn) {
        let msg: ChallengeCoolTimeMsg = pkg.readBody(ChallengeCoolTimeMsg);
        if (msg.type == 1) {
            return;
        }
        BuildingManager.Instance.model.colosseumOrderList = [];
        let info: BuildingOrderInfo = new BuildingOrderInfo();
        info.remainTime = msg.leftTime;
        info.totalCount = msg.totalCount;
        info.currentCount = msg.challengeCount;
        info.totalBuyCount = msg.totalBuyCount;
        info.orderId = 10000;
        info.orderType = 4;
        BuildingManager.Instance.model.colosseumOrderList.push(info);
        this.nextStep("__colosseumTimeHandler: " + " msg :" + msg + info.remainTime.toString());
        // 确保冷却队列已经实例化
        // QueueBar.Instance;
    }

    private __loadFriendListHandler(pkg: PackageIn) {
        let msg: FriendRelationList = pkg.readBody(FriendRelationList) as FriendRelationList;

        let relationList = [];
        let GroupList = [];
        for (const key in msg.relationList) {
            if (msg.relationList.hasOwnProperty(key)) {
                let fInfo: RelationPlayerMsg = msg.relationList[key] as RelationPlayerMsg;
                let pInfo: FriendItemCellInfo = new FriendItemCellInfo();
                pInfo.userId = fInfo.player.userId;
                pInfo.nickName = fInfo.player.nickName;
                pInfo.templateId = fInfo.player.job;
                pInfo.sexs = fInfo.player.sexs;
                pInfo.pics = fInfo.player.pics;
                pInfo.camp = fInfo.player.camp;
                pInfo.state = fInfo.player.state;
                pInfo.consortiaID = fInfo.player.consortiaID;
                // pInfo.strategy = new Num(Number(fInfo.player.strategy));
                pInfo.consortiaName = fInfo.player.consortiaName;
                pInfo.consortiaOffer = fInfo.player.consortiaOffer;
                pInfo.consortiaTotalOffer = fInfo.player.consortiaTotalOffer;
                pInfo.claimId = fInfo.player.claimId;
                pInfo.claimName = fInfo.player.claimName;
                pInfo.grades = fInfo.player.grades;
                pInfo.gp = fInfo.player.gp;
                pInfo.repute = fInfo.player.repute;
                pInfo.logOutTime = DateFormatter.parse(fInfo.player.logOutTime, "YYYY-MM-DD hh:mm:ss");
                pInfo.dutyId = fInfo.player.dutyId;
                pInfo.parameter1 = fInfo.player.parameter1;
                pInfo.playerOrdeInfo.gpOrder = fInfo.player.gpOrder;
                pInfo.fightingCapacity = fInfo.player.fightingCapacity;
                pInfo.matchWin = fInfo.player.matchWin;
                pInfo.matchFailed = fInfo.player.matchFailed;
                pInfo.right = fInfo.player.right;
                pInfo.relation = fInfo.relation;
                pInfo.tarRelation = fInfo.tarRelation;
                pInfo.groupId = fInfo.groupId;
                pInfo.type = FriendModel.ITEMTYPE_FRIEND;
                pInfo.friendGp = fInfo.friendRp;
                pInfo.friendGrade = fInfo.friendGrade;
                pInfo.friendGrade = fInfo.friendGrade;
                pInfo.frameId = fInfo.player.frameId;
                pInfo.IsVipAndNoExpirt = fInfo.isVip == 1;
                if (fInfo.snsInfo) {
                    if (fInfo.snsInfo.hasOwnProperty("userId")) {
                        pInfo.snsInfo.userId = fInfo.snsInfo.userId;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("nickname")) {
                        pInfo.snsInfo.nickName = fInfo.snsInfo.nickname;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("headId")) {
                        pInfo.snsInfo.headId = fInfo.snsInfo.headId;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("signDesc")) {
                        pInfo.snsInfo.sign = fInfo.snsInfo.signDesc;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("sex")) {
                        pInfo.snsInfo.sex = fInfo.snsInfo.sex;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("birthdayType")) {
                        pInfo.snsInfo.birthdayType = fInfo.snsInfo.birthdayType;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("birthYear")) {
                        pInfo.snsInfo.birthYear = fInfo.snsInfo.birthYear;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("birthMonth")) {
                        pInfo.snsInfo.birthMonth = fInfo.snsInfo.birthMonth;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("birthDay")) {
                        pInfo.snsInfo.birthDay = fInfo.snsInfo.birthDay;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("starId")) {
                        pInfo.snsInfo.horoscope = fInfo.snsInfo.starId;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("bloodType")) {
                        pInfo.snsInfo.bloodType = fInfo.snsInfo.bloodType;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("country")) {
                        pInfo.snsInfo.country = fInfo.snsInfo.country;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("province")) {
                        pInfo.snsInfo.province = fInfo.snsInfo.province;
                    }
                    if (fInfo.snsInfo.hasOwnProperty("city")) {
                        pInfo.snsInfo.city = fInfo.snsInfo.city;
                    }
                }
                relationList.push(pInfo);
            }
        }

        for (const key in msg.group) {
            if (msg.group.hasOwnProperty(key)) {
                let gMsg: FriendGroupMsg = msg.group[key] as FriendGroupMsg;
                let gInfo: FriendGroupInfo = new FriendGroupInfo();
                gInfo.groupId = gMsg.groupId;
                gInfo.groupName = gMsg.groupName;
                GroupList.push(gInfo);
            }
        }

        if (!this._setupIm) {
            this._setupIm = true;
            if (msg.maxPage > 0) {
                LoginInitDataAccept.total = LoginInitDataAccept.total + msg.maxPage - 1;
            }
            FriendManager.getInstance().setup(relationList, GroupList);
            IMManager.Instance.setup();
        }
        else {
            FriendManager.getInstance().addFriends(relationList, GroupList);
        }

        this.nextStep("::" + msg.maxPage + "__loadFriendListHandler : " + " msg :" + msg + LoginInitDataAccept.total + " ");
    }

    private _setupIm: boolean = false;

    private __loadFarmHandler(pkg: PackageIn) {
        let msg: LoadFarmRsp = pkg.readBody(LoadFarmRsp);
        if (msg.farm && msg.farm.treeInfo) {
            let fInfo: FarmInfo = FarmManager.Instance.model.getFarmInfo(msg.farm.userId);
            if (fInfo) {
                this.readFarmInfoMsg(fInfo, msg.farm);
            }
            else {
                fInfo = new FarmInfo();
                this.readFarmInfoMsg(fInfo, msg.farm);
                FarmManager.Instance.model.addFarmInfo(fInfo);
            }
        }
        msg.friendFarmState.forEach(fsMsg => {
            let fsInfo: FriendFarmStateInfo = FarmManager.Instance.model.getFarmStateInfo(fsMsg.userId);
            fsInfo.canSteal = fsMsg.isReap;
            if (this.thane.userId == fsMsg.userId) {
                Logger.xjy("更新自己神树状态")
            }
            Logger.xjy("[LoginInitDataAccept]__getFriendFarmStateHandler", this.thane.userId, fsMsg.userId, fsMsg.isChargeEnergy)
            fsInfo.canGivePower = fsMsg.isChargeEnergy;
            fsInfo.canRevive = fsMsg.isRevive;
            fsInfo.canWorm = fsMsg.isWorm;
            fsInfo.canWeed = fsMsg.isGrass;
            fsInfo.canFeed = fsMsg.isFeed;
        });
        WaterManager.Instance.setupList(this.readTreeLog(msg.farmLog));
        this.nextStep("__loadWaterHandler" + " msg :" + msg);
    }

    private readFarmInfoMsg(info: FarmInfo, msg: any): FarmInfo {
        if (!info || !msg) {
            return info;
        }
        info.userId = msg.userId;
        info.nickName = msg.nickName;
        info.grade = msg.grades;
        info.landGrade = msg.landGrades;
        info.gp = msg.gp;
        info.dayGpFromFriend = msg.todayFromFriendGp;
        info.dayStealCount = msg.todayStolenCount;
        msg.farmLandInfo.forEach(landMsg => {
            let landInfo: FarmLandInfo = info.getLandInfo(landMsg.pos);
            if (landInfo) {
                this.readLandInfoMsg(landInfo, landMsg);
            }
            else {
                landInfo = new FarmLandInfo();
                this.readLandInfoMsg(landInfo, landMsg);
                info.addLandInfo(landInfo);
            }
        });

        msg.petInfo.forEach(petMsg => {
            let petLand: PetLandInfo = info.getPetLandInfo(petMsg.pos);
            if (!petLand) {
                petLand = new PetLandInfo();
            }
            petLand = this.readPetInfoMsg(petLand, petMsg);
            info.addPetLandInfo(petLand);
        });

        let defender: PetLandInfo = new PetLandInfo();
        defender = this.readPetInfoMsg(defender, msg.guardPetInfo);
        if (defender.petId != 0) {
            info.defender = defender;
        }
        else {
            info.defender = null;
        }

        info.treeInfo = WaterManager.Instance.treeList[msg.treeInfo.userId];
        if (info.treeInfo)
            this.readTreeInfoMsg(info.treeInfo, msg.treeInfo);
        else {
            info.treeInfo = new TreeInfo();
            this.readTreeInfoMsg(info.treeInfo, msg.treeInfo);
            WaterManager.Instance.treeList[msg.treeInfo.userId] = info.treeInfo;
        }
        return info;
    }

    private readLandInfoMsg(info: FarmLandInfo, msg: FarmLandInfoMsg): FarmLandInfo {
        if (!info || !msg) {
            return info;
        }
        info.beginChanges();
        info.userId = msg.userId;
        info.pos = msg.pos;
        info.cropTempId = msg.itemTemplateId;
        info.plantTime = DateFormatter.parse(msg.plantingTime, "YYYY-MM-DD hh:mm:ss");
        info.matureTime = DateFormatter.parse(msg.matureTime, "YYYY-MM-DD hh:mm:ss");
        info.originMatureTime = DateFormatter.parse(msg.originMatureTime, "YYYY-MM-DD hh:mm:ss");
        Logger.xjy("[LoginInitDataAccept]readLandOperMsg", "pos=" + info.pos, "plantTime=" + info.plantTime, "matureTime=" + info.matureTime, "originMatureTime=" + info.originMatureTime, "sysCurTimeBySecond=" + PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond)

        info.accelerateCount = msg.accelerateCount;
        info.stolenCount = msg.stolenCount;
        info.stolenList = msg.stolenUsers;
        info.outputCount = msg.rewardCount;
        info.isGrassP1 = msg.isGrassParam1;
        info.isGrassP2 = msg.isGrassParam2;
        info.isWormP1 = msg.isWormParam1;
        info.isWormP2 = msg.isWormParam2;
        info.commitChanges();
        return info;
    }

    private readPetInfoMsg(info: PetLandInfo, msg: FarmPetInfoMsg): PetLandInfo {
        if (!info || !msg) {
            return info;
        }
        info.userId = msg.userId;
        info.petId = msg.petId;
        info.name = msg.petName;
        info.quality = (msg.quality - 1) / 5 + 1;
        info.pos = msg.pos;
        info.petTemplateId = msg.petTemplateId;
        info.beginTime = msg.beginTime;
        info.endTime = msg.endTime;
        info.lastFeedRegion = msg.state;
        return info;
    }

    private readTreeInfoMsg(info, msg: TreeInfoMsg): any {
        if (!info || !msg) {
            return info;
        }
        info.userId = msg.userId;
        info.nickName = msg.nickName;
        info.waterCount = msg.waterCount;
        info.fruitCount = msg.fruitCount;
        info.isFirstFruit = msg.isFirstFruit;
        info.nextPickTime = DateFormatter.parse(msg.nextPickTime, "YYYY-MM-DD hh:mm:ss");
        info.lastWaterTime = DateFormatter.parse(msg.lastWaterTime, "YYYY-MM-DD hh:mm:ss");
        info.property1 = msg.property1;
        info.property2 = msg.property2;
        info.notHasTree = false;
        if (info.userId == this.thane.userId) {
            info.todayCanWater = msg.canWater;
            info.timeLeft = msg.leftTime;
            info.leftpickTime = msg.leftPickTime;
        }
        // Logger.xjy("[LoginInitDataAccept]readTreeInfoMsg", info.userId == this.thane.userId, info)
        return info;
    }

    private readTreeLog(arr: any): Array<WaterLogInfo> {
        let temp = [];
        arr.forEach(lInfo => {
            let logInfo: WaterLogInfo = new WaterLogInfo();
            logInfo.type = lInfo.type;
            logInfo.userId = lInfo.playerId;
            logInfo.actionDes = lInfo.desc;
            logInfo.nickName = lInfo.operNickName;
            logInfo.time = DateFormatter.parse(lInfo.operDate, "YYYY-MM-DD hh:mm:ss");
            logInfo.waterUserId = lInfo.operUserId;
            temp.push(logInfo);
        });
        return temp;
    }

    private __loadCastleHandler(pkg: PackageIn) {
        let msg: BaseCastleMsg = pkg.readBody(BaseCastleMsg);
        let castleInfo: BaseCastle = PlayerManager.Instance.currentPlayerModel.mapNodeInfo;
        let pInfo: PhysicInfo = new PhysicInfo();
        castleInfo.defenceLeftTime = msg.defenceLefttime;
        pInfo.id = msg.id;
        pInfo.mapId = msg.mapId;
        pInfo.occupyLeagueName = msg.occupyLeagueName;
        pInfo.occupyPlayerId = msg.occupyPlayerId;
        pInfo.occupyPlayerName = msg.occupyPlayerName;
        pInfo.posX = msg.posX;
        pInfo.posY = msg.posY;
        pInfo.state = msg.state;
        pInfo.types = msg.type;
        pInfo.names = msg.castleName;
        pInfo.grade = msg.grade
        pInfo.vipCastleView = msg.vipCastleView;
        pInfo.vipType = 1;//msg.vipType; vip紫钻还原
        pInfo.vipGrade = msg.vipGrade;
        castleInfo.info = pInfo;

        this.nextStep("__loadCastleHandler" + " msg :" + msg);

        let build: BuildInfo = new BuildInfo();
        build.buildingId = -11;
        build.templateId = 151101;
        build.property1 = msg.leftEnergy;
        BuildingManager.Instance.model.addBuildInfo(build);
        msg = null;
        pkg = null;
    }

    private __loadBuildHandler(pkg: PackageIn) {
        let msg: BuildingInfoListMsg = pkg.readBody(BuildingInfoListMsg);

        let modle: BuildingModel = BuildingManager.Instance.model;
        let result: boolean = msg.result;
        for (let i: number = 0; i < msg.building.length; i++) {
            let item: BuildingInfoMsg = msg.building[i] as BuildingInfoMsg;
            let info: BuildInfo = new BuildInfo();
            info.buildingId = item.buildingId;
            info.templateId = item.templateId;
            info.property1 = item.propterty1;
            info.property2 = item.propterty2;
            info.payImpose = item.levyNum;
            info.loadTime = new Date().getTime() / 1000;
            info.sonType = item.sonType;
            modle.addBuildInfo(info);
        }
        msg = null;
        pkg = null;
        this.nextStep("__loadBuildHandler" + " msg :" + msg);
    }

    private __loadBuildOrderHandler(pkg: PackageIn) {
        let msg: BuildOrderList = pkg.readBody(BuildOrderList) as BuildOrderList;
        let arr: Array<BuildingOrderInfo> = [];
        msg.buildOrder.forEach(bInfo => {
            let oInfo: BuildingOrderInfo = new BuildingOrderInfo();
            oInfo.beginTime = DateFormatter.parse(bInfo.beginTime, "YYYY-MM-DD hh:mm:ss");
            oInfo.needTime = bInfo.needTime;
            oInfo.orderId = bInfo.orderId;
            oInfo.orderType = bInfo.orderType;
            oInfo.remainTime = bInfo.remainTime;
            oInfo.userId = bInfo.userId;
            arr.push(oInfo);
            // Logger.log("orderType ==" + bInfo.orderType);
        });
        BuildingManager.Instance.model.setOrderList(arr);
        pkg = null;
        msg = null;
        this.nextStep("__loadBuildOrderHandler" + " msg :" + msg);
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

}