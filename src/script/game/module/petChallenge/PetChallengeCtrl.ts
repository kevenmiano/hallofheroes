// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-10-24 21:04:51
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { SocketManager } from "../../../core/net/SocketManager";
import Dictionary from "../../../core/utils/Dictionary";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import ConfigInfosTempInfo from "../../datas/ConfigInfosTempInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SharedManager } from "../../manager/SharedManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { TempleteManager } from "../../manager/TempleteManager";
import FrameCtrlBase from "../../mvc/FrameCtrlBase";
import { PetData } from "../pet/data/PetData";
import { PetChallengeObjectData } from "./data/PetChallengeObjectData";
import { PetChallengeObjectEventData } from "./data/PetChallengeObjectEventData";
import { C2SProtocol } from '../../constant/protocol/C2SProtocol';
import { ResourceManager } from "../../manager/ResourceManager";
import LangManager from '../../../core/lang/LangManager';
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { ArrayConstant, ArrayUtils } from '../../../core/utils/ArrayUtils';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';

import ChallengeRequestMsg = com.road.yishi.proto.pet.ChallengeRequestMsg;
import PetChallengeInfoMsg = com.road.yishi.proto.pet.PetChallengeInfoMsg;
import PetChallengeLogMsg = com.road.yishi.proto.pet.PetChallengeLogMsg;
import PetChallengePlayerMsg = com.road.yishi.proto.pet.PetChallengePlayerMsg;
import PetInfoMsg = com.road.yishi.proto.pet.PetInfoMsg;
import PlayerPetMsg = com.road.yishi.proto.pet.PlayerPetMsg;
import RankRewardMsg = com.road.yishi.proto.pet.RankRewardMsg;
import ChallengeCoolTimeMsg = com.road.yishi.proto.player.ChallengeCoolTimeMsg;
import ChallengeMsg = com.road.yishi.proto.player.ChallengeMsg;
import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
import PetChallengeLogList = com.road.yishi.proto.pet.PetChallengeLogList;
import { EmWindow } from "../../constant/UIDefine";
import Logger from '../../../core/logger/Logger';
import FrameCtrlInfo from "../../mvc/FrameCtrlInfo";
import OpenGrades from "../../constant/OpenGrades";

export default class PetChallengeCtrl extends FrameCtrlBase {
    public static bReadyOnFormation: boolean = false;
    public static curOptPetId: number = -1;
    public static bReadyChangeFormation: boolean = false;
    public static resetReadyOnFormation() {
        this.bReadyOnFormation = false;
        this.curOptPetId = -1;
    }
    public static resetChangeFormation() {
        this.bReadyChangeFormation = false;
        this.curOptPetId = -1;
    }

    public static PetReport: number = 1;
    public static PetChallengeFrame: number = 2;
    public static PetFormationFrame: number = 3;

    /**
     * 日奖励
     */
    public static RANK_DAY: number = 1;
    /**
     * 周奖励
     */
    public static RANK_WEEK: number = 2;
    /**
     * 有奖励, 未领取
     */
    public static STATUS_HAS: number = 0;
    /**
     * 有奖励, 已领取
     */
    public static STATUS_GET: number = 1;
    /**
     * 无奖励
     */
    public static STATUS_NONE: number = 2;

    public refreshFunction: Function;
    private playerInfo: PlayerInfo;
    public loaders: Dictionary;
    public shapePool: Dictionary;

    private challengeUserId: number = 0;

    public constructor() {
        super();
        this.playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        ServerDataManager.listen(S2CProtocol.U_C_CHALLENGE_TIME, this, this.__petchallengeTimeHandler);
    }

    protected addEventListener() {
        super.addEventListener();
        ServerDataManager.listen(S2CProtocol.U_C_PET_CHALLENGE_LIST, this, this.__loadPetChallengeListHandler);
        ServerDataManager.listen(S2CProtocol.U_C_TOP_CHALLENGE_INFO, this, this.__loadPetChallengeTopListHandler);
        ServerDataManager.listen(S2CProtocol.U_C_PET_RANK_REWARD, this, this.__petRankRewardHandler);
        ServerDataManager.listen(S2CProtocol.U_C_PET_CHALLENGE_LOG, this, this.__petEventLogHandler)// 英灵竞技战报列表)
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_PET_LIST_CHANGE, this.__petformationChangeHandler, this);
    }

    protected delEventListener() {
        super.delEventListener();
        ServerDataManager.cancel(S2CProtocol.U_C_PET_CHALLENGE_LIST, this, this.__loadPetChallengeListHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_TOP_CHALLENGE_INFO, this, this.__loadPetChallengeTopListHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_PET_RANK_REWARD, this, this.__petRankRewardHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_PET_CHALLENGE_LOG, this, this.__petEventLogHandler)// 英灵竞技战报列表)
        this.playerInfo.removeEventListener(PlayerEvent.PLAYER_PET_LIST_CHANGE, this.__petformationChangeHandler, this);
    }

    /**
     * 获得竞技英雄榜 
     */
    private __loadPetChallengeTopListHandler(pkg: PackageIn) {
        let msg = pkg.readBody(PetChallengeInfoMsg) as PetChallengeInfoMsg;

        this.data.challengeTopList = [];
        let temp: PetChallengeObjectData;
        let petData: PetData;
        //接受其他的信息
        for (let index = 0; index < msg.playerPets.length; index++) {
            const playerMsg = msg.playerPets[index] as PlayerPetMsg;
            temp = new PetChallengeObjectData();
            temp.isSelf = false;
            temp.userId = playerMsg.userId;
            temp.userName = playerMsg.nickName;
            temp.ranking = playerMsg.order;
            temp.score = playerMsg.score;
            for (let i = 0; i < playerMsg.petInfo.length; i++) {
                const petMsg = playerMsg.petInfo[i] as PetInfoMsg;
                petData = PetData.createWithMsg(petMsg);
                temp.petList.push(petData);
            }
            this.data.challengeTopList.push(temp);
        }

        this.sortChallengeTopList();
        this.data.commitInfoChange();
    }

    /** 竞技英雄榜列表排序 挑战列表按排名从小到大排序*/
    private sortChallengeTopList() {
        this.data.challengeTopList = ArrayUtils.sortOn(this.data.challengeTopList, ["ranking"], [ArrayConstant.NUMERIC])
        let temp: PetChallengeObjectData = this.data.challengeTopList[this.data.challengeTopList.length - 1] as PetChallengeObjectData;
        if (temp && temp.ranking <= 0) {
            temp = this.data.challengeTopList.pop();
            this.data.challengeTopList.unshift(temp);
        }
    }

    /**
     * 英灵竞技奖励领取结果
     * 
     */
    private __petRankRewardHandler(pkg: PackageIn) {
        let msg = pkg.readBody(RankRewardMsg) as RankRewardMsg;
        if (msg.type == PetChallengeCtrl.RANK_DAY) {
            if (msg.status == PetChallengeCtrl.STATUS_GET) {
                this.playerInfo.canAcceptPetChallDayReward = false;
                let data: Object = { rank: msg.rank, type: msg.type };
                // TODO 
                // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.PET_CHALLENGE, PetChallengeCtrl.PetReport, data);
            }
        }
    }

    private __petEventLogHandler(pkg: PackageIn) {
        let msg = pkg.readBody(PetChallengeLogList) as PetChallengeLogList;
        let petData: PetData;
        let eventTemp: PetChallengeObjectEventData;
        this.data.challengeEventList = [];
        msg.challengeLog.forEach((logMsg: PetChallengeLogMsg) => {
            eventTemp = new PetChallengeObjectEventData();
            eventTemp.userId = logMsg.userId;
            eventTemp.tarUserId = logMsg.tarUserId;
            eventTemp.tarNickName = logMsg.tarNickName;
            eventTemp.result = logMsg.result;
            eventTemp.isAttack = logMsg.isAttack;
            eventTemp.logDate = logMsg.logDate;
            eventTemp.score = logMsg.score;

            logMsg.tarPets.petInfo.forEach((petMsg: PetInfoMsg) => {
                petData = PetData.createWithMsg(petMsg);
                eventTemp.tarPets.push(petData);
            });
            this.data.challengeEventList.push(eventTemp);
        })
        this.data.commitEventChange();
    }

    /**
     * 获得挑战列表 
     * @param evt
     * 
     */
    private __loadPetChallengeListHandler(pkg: PackageIn) {
        // ServerDataManager.cancel(S2CProtocol.U_C_PET_CHALLENGE_LIST, this, this.__loadPetChallengeListHandler);

        let msg = pkg.readBody(PetChallengeInfoMsg) as PetChallengeInfoMsg;
        this.data.challengeList = [];
        let challengeMsg = msg.playerInfo as PetChallengePlayerMsg;
        this.data.ranking = challengeMsg.order;
        this.data.score = challengeMsg.score;

        let temp: PetChallengeObjectData;
        let petData: PetData;
        let eventTemp: PetChallengeObjectEventData;
        //接受其他的信息
        msg.playerPets.forEach(playerMsg => {
            temp = new PetChallengeObjectData();
            temp.isSelf = false;
            temp.userId = playerMsg.userId;
            temp.userName = playerMsg.nickName;
            temp.ranking = playerMsg.order;
            temp.score = playerMsg.score;

            playerMsg.petInfo.forEach((petMsg: PetInfoMsg) => {
                petData = PetData.createWithMsg(petMsg);
                temp.petList.push(petData);
            });
            this.data.challengeList.push(temp);
            // Logger.xjy("[PetChallengeCtrl]玩家名字: ", temp.userName, "排名: ", temp.ranking, "ID: ", temp.userId)
        });

        //把自己加入到列表中
        this.removeSelfData();

        temp = new PetChallengeObjectData();
        temp.isSelf = true;
        temp.userId = this.playerInfo.userId;
        temp.userName = this.playerInfo.nickName;
        temp.ranking = challengeMsg.order;
        temp.score = challengeMsg.score;
        let tempArr: any[];
        if (this.playerInfo.petChallengeFormation) {
            tempArr = this.playerInfo.petChallengeFormation.split(",");
        }
        for (let index = 0; index < tempArr.length; index++) {
            const petId = tempArr[index];
            petData = this.playerInfo.getPet(Number(petId));
            if (!petData) continue;
            temp.petList.push(petData);
        }
        this.data.challengeList.push(temp);

        this.data.totalFightPower = temp.totalFightPower;

        this.sortChallengeList();

        //接受英灵竞技战报信息
        this.data.challengeEventList = [];
        msg.challengeLog.forEach((logMsg: PetChallengeLogMsg) => {
            eventTemp = new PetChallengeObjectEventData();
            eventTemp.userId = logMsg.userId;
            eventTemp.tarUserId = logMsg.tarUserId;
            eventTemp.tarNickName = logMsg.tarNickName;
            eventTemp.result = logMsg.result;
            eventTemp.isAttack = logMsg.isAttack;
            eventTemp.logDate = logMsg.logDate;
            eventTemp.score = logMsg.score;

            logMsg.tarPets.petInfo.forEach((petMsg: PetInfoMsg) => {
                petData = PetData.createWithMsg(petMsg);
                eventTemp.tarPets.push(petData);
            });
            this.data.challengeEventList.push(eventTemp);
        })

        this.data.commitInfoChange();
    }

    private __petchallengeTimeHandler(pkg: PackageIn) {
        let msg = pkg.readBody(ChallengeCoolTimeMsg) as ChallengeCoolTimeMsg;
        Logger.xjy("[PetChallengeCtrl]__petchallengeTimeHandler", msg)
        if (msg.type != 1) return;

        this.data.buildingOrder.totalCount = msg.challengeCount;
        this.data.buildingOrder.currentCount = 0;
        this.data.buildingOrder.remainTime = msg.leftTime;

        this.data.commitTimeChange();
    }

    private __petformationChangeHandler() {
        this.removeSelfData();
        let temp: PetChallengeObjectData = new PetChallengeObjectData();
        temp.isSelf = true;
        temp.userId = this.playerInfo.userId;
        temp.userName = this.playerInfo.nickName;
        temp.ranking = this.data.ranking;
        temp.score = this.data.score;
        let tempArr: any[] = [];
        if (this.playerInfo.petChallengeFormation) {
            tempArr = this.playerInfo.petChallengeFormation.split(",");
        }
        for (let index = 0; index < tempArr.length; index++) {
            const petId = tempArr[index];
            let petData: PetData = this.playerInfo.getPet(Number(petId));
            if (!petData) continue;
            temp.petList.push(petData);
        }
        this.data.challengeList.push(temp);

        this.sortChallengeList();

        this.data.commitInfoChange();
    }

    /** 对挑战列表排序 挑战列表按积分从小到大排序 积分相同则战力从小到大*/
    private sortChallengeList() {
        let temp: PetChallengeObjectData = this.data.challengeList[this.data.challengeList.length - 1] as PetChallengeObjectData;
        if (temp && temp.ranking <= 0) {
            temp = this.data.challengeList.pop();
            this.data.challengeList.unshift(temp);
        }
    }

    private removeSelfData() {
        let find: PetChallengeObjectData;
        let index: number = 0;
        for (let i = 0; i < this.data.challengeList.length; i++) {
            const temp = this.data.challengeList[i] as PetChallengeObjectData;
            if (temp && temp.isSelf) {
                find = temp;
                break;
            }
            index++;
        }
        if (find) {
            this.data.challengeList.splice(index, 1);
        }
    }

    /** 请求挑战数据 */
    public requestChallengeData(type: number = 1) {
        let msg: ChallengeRequestMsg = new ChallengeRequestMsg();
        msg.type = type;
        SocketManager.Instance.send(C2SProtocol.C_CHALLENGEINFO_REQUEST, msg);
    }

    /**
     *  发起英灵挑战
     * @param userId 挑战的对象
     * 
     */
    public sendChallengeCommand(userId: number) {
        let tip: string;
        if (this.data.buildingOrder.remainTime > 0) {
            tip = LangManager.Instance.GetTranslation("colosseum.view.ColosseumListView.command02");
        } else if (this.playerInfo.petChallengeCount <= 0) {
            tip = LangManager.Instance.GetTranslation("PetChallengeController.nochallengepet");
        }

        if (tip) {
            MessageTipManager.Instance.show(tip);
            return;
        }

        this.challengeUserId = userId;
        if (this.data.buildingOrder.remainCount <= 0) {
            //购买
            if (SharedManager.Instance.checkIsExpired(SharedManager.Instance.buyPetChallengeCountDate2)) {
                this.showBuyChallengeCountFrame2();
                return;
            } else {
                this.buyChallengeCount(1);
                setTimeout(this.sendChallengeMsg.bind(this), 100);
                return;
            }
        }
        this.sendChallengeMsg();
    }

    public getCostGold(): number {
        let result: number = 50000;
        let temp: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("Jion_pet_challenge");
        if (temp) {
            result = parseInt(temp.ConfigValue);
        }
        return result;
    }

    public showBuyChallengeCountFrame1() {
        let checkStr: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
        let content: string = LangManager.Instance.GetTranslation("PetChallengeController.buyChallengeCount", this.getCostGold());
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkStr }, null, content, null, null, this.buyChallengeCountBack1.bind(this));
    }

    private buyChallengeCountBack1(b: boolean, check: boolean) {
        if (check) {
            SharedManager.Instance.buyPetChallengeCountDate = new Date();
            SharedManager.Instance.saveBuyPetChallengeCountDate();
        }

        if (!b) return;
        if (ResourceManager.Instance.gold.count < this.getCostGold()) {
            let tip: string = LangManager.Instance.GetTranslation("public.gold");
            MessageTipManager.Instance.show(tip);
            return;
        }
        this.buyChallengeCount(1);
    }

    public showBuyChallengeCountFrame2() {
        let checkStr: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
        let content: string = LangManager.Instance.GetTranslation("PetChallengeController.buyChallengeCount2", this.getCostGold());
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkStr }, null, content, null, null, this.buyChallengeCountBack2.bind(this));
    }

    private buyChallengeCountBack2(b: boolean, check: boolean) {
        if (check) {
            SharedManager.Instance.buyPetChallengeCountDate2 = new Date();
            SharedManager.Instance.saveBuyPetChallengeCountDate2();
        }
        if (!b) return;
        if (ResourceManager.Instance.gold.count < this.getCostGold()) {
            let tip: string = LangManager.Instance.GetTranslation("public.gold");
            MessageTipManager.Instance.show(tip);
            return;
        }
        this.buyChallengeCount(1);
        setTimeout(this.sendChallengeMsg.bind(this), 100);
    }

    /**
     * 购买竞技次数 
     * @param count
     * 
     */
    public buyChallengeCount(count: number = 1) {
        let msg: ChallengeMsg = new ChallengeMsg();
        msg.tarArmyId = count;
        msg.type = 1;
        SocketManager.Instance.send(C2SProtocol.U_C_PLAYER_ADD_ATTACKCOUNT, msg);
    }

    /**
     * 发送挑战命令 
     * 
     */
    private sendChallengeMsg() {
        let msg: ChallengeMsg = new ChallengeMsg();
        msg.tarUserId = this.challengeUserId;
        SocketManager.Instance.send(C2SProtocol.C_CHALLENGE_PET, msg);
    }

    /**
     * 发送英灵阵型 
     * @param arr 长度为6 分别对应 [1,4,7,3,6,9]
     * 
     */
    public sendPetFormation(s: string) {
        Logger.xjy("[PetChallengeCtrl]sendPetFormation", s);
        let msg: PlayerPetMsg = new PlayerPetMsg();
        msg.chaPos = s;
        SocketManager.Instance.send(C2SProtocol.C_PET_CHALLENGE_FORMATION, msg);
    }

    /**
     * 选择英灵技能
     * @param petId  英灵id
     * @param skills [0,1,2]长度为3
     * 
     */
    public sendPetSkills(petId: number, skills: string) {
        let msg: PetInfoMsg = new PetInfoMsg();
        msg.petId = petId;
        msg.chaSkillIndexs = skills;
        SocketManager.Instance.send(C2SProtocol.C_PET_CHALLENGE_SKILL, msg);
    }

    /**
     * 英灵竞技奖励操作
     * @param rankType 	1 日奖励；2 周奖励
     * @param opType	0 查询；1 领奖
     * 
     */
    public sendPetRankOperate(rankType: number, opType: number = 1) {
        let msg: RankRewardMsg = new RankRewardMsg();
        msg.type = rankType;
        msg.opType = opType;
        SocketManager.Instance.send(C2SProtocol.C_PET_RANK_REWARD, msg);
    }

    /**
     * vip立即冷却 或者 花钻石冷却  
     * 
     */
    public coolDownChallengeCD(useBind: boolean = true) {
        SocketSendManager.Instance.sendCoolColosseun(1, useBind);
    }

    open(frameInfo: FrameCtrlInfo) {
        let tip: string;
        if (ArmyManager.Instance.thane.grades < OpenGrades.PET_PVP) {
            tip = LangManager.Instance.GetTranslation("store.view.StoreFrame.command01", OpenGrades.PET_PVP);
        }
        else if (!this.playerInfo.petList || this.playerInfo.petList.length <= 0) {
            tip = LangManager.Instance.GetTranslation("PetChallengeController.nopet");
        }

        if (tip) {
            MessageTipManager.Instance.show(tip);
            return;
        }
        super.open(frameInfo);
    }

    show() {
        super.show()
    }

    hide() {
        super.hide()
    }

    dispose() {
        super.dispose()
        this.data.challengeList = [];
        this.data.challengeTopList = [];
        this.data.challengeEventList = [];
        PetChallengeCtrl.curOptPetId = -1;
        PetChallengeCtrl.bReadyOnFormation = false;
        PetChallengeCtrl.bReadyChangeFormation = false;
    }
}