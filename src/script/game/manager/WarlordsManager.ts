import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import { ServerDataManager } from '../../core/net/ServerDataManager';
import { PackageIn } from '../../core/net/PackageIn';


import LordsBaseInfoMsg = com.road.yishi.proto.lucky.LordsBaseInfoMsg;
import LordsOrderListMsg = com.road.yishi.proto.lucky.LordsOrderListMsg;
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import WarlordsModel from '../module/warlords/WarlordsModel';
import WarlordsPlayerInfo from '../module/warlords/WarlordsPlayerInfo';
import { ThaneInfoHelper } from '../utils/ThaneInfoHelper';
import { ThaneInfo } from '../datas/playerinfo/ThaneInfo';
import { JobType } from '../constant/JobType';
import { ChatEvent, WarlordsEvent } from '../constant/event/NotificationEvent';
import ChatData from '../module/chat/data/ChatData';
import { ChatChannel } from '../datas/ChatChannel';
import { ChatManager } from './ChatManager';
import { MessageTipManager } from './MessageTipManager';
import { NotificationManager } from './NotificationManager';
import SceneType from '../map/scene/SceneType';
import { TipMessageData } from '../datas/TipMessageData';
import { TaskTraceTipManager } from './TaskTraceTipManager';
import { CampaignManager } from './CampaignManager';
import { WorldBossHelper } from '../utils/WorldBossHelper';
import LangManager from '../../core/lang/LangManager';
import { AlertTipAction } from '../battle/actions/AlertTipAction';
import { DelayActionsUtils } from '../utils/DelayActionsUtils';
import { SceneManager } from '../map/scene/SceneManager';
import XmlMgr from '../../core/xlsx/XmlMgr';
import { DateFormatter } from '../../core/utils/DateFormatter';
import { PlayerInfo } from '../datas/playerinfo/PlayerInfo';
import { ArmyManager } from './ArmyManager';
import { PathManager } from './PathManager';
import { SocketManager } from '../../core/net/SocketManager';
import { SwitchPageHelp } from '../utils/SwitchPageHelp';
import { PlayerManager } from './PlayerManager';
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import ResMgr from '../../core/res/ResMgr';
import ByteArray from '../../core/net/ByteArray';
import Logger from '../../core/logger/Logger';
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import { EmWindow } from '../constant/UIDefine';
import StringHelper from '../../core/utils/StringHelper';
import FUIHelper from '../utils/FUIHelper';
import { ArrayConstant, ArrayUtils } from '../../core/utils/ArrayUtils';
import FreedomTeamManager from './FreedomTeamManager';
/**
* @author:pzlricky
* @data: 2021-06-07 12:29
* @description 主要负责武斗会模块的协议处理, 提供协议发送、数据操作的API
*/
export default class WarlordsManager {

    private static _instance: WarlordsManager;
    public static get Instance(): WarlordsManager {
        if (!this._instance) this._instance = new WarlordsManager();
        return this._instance;
    }

    private _model: WarlordsModel;
    public get model(): WarlordsModel {
        return this._model;
    }

    private _tempList: Array<WarlordsPlayerInfo>;
    private _tempInfo: WarlordsPlayerInfo;


    public setup() {
        this._model = new WarlordsModel();
        this.addEvent();
    }

    private addEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_LORDS_LOAD_MAINBORAD, this, this.__getMainInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LORDS_ENTER_RESULT, this, this.__getMatchInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LORDS_FINAL_ORDERLIST, this, this.__getCanBetListHandler);
        ServerDataManager.listen(S2CProtocol.U_C_REQUEST_BET_LIST, this, this.__getAwardListHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SEND_FINALRWARD_STATE, this, this.__getRewardStateHandler);
        ServerDataManager.listen(S2CProtocol.U_C_TAKEFINALREWARD_RESULT, this, this.__getRewardResultHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LORDS_CLOSE, this, this.__getWarlordsCloseHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LORDS_LOCAL_FIANL_ORDER, this, this.__getAccessFinalListHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LORDS_FINAL_TIPS, this, this.__getFinalNoticeHandler);
    }

    private __getMainInfoHandler(pkg: PackageIn) {//收到武斗会主面板信息处理
        var msg: LordsOrderListMsg = pkg.readBody(LordsOrderListMsg) as LordsOrderListMsg;

        var topAvatarChange: boolean = false;
        this._model.beginChanges();
        this._model.period = msg.param2;
        this._model.process = msg.param1;
        this._model.isEnterFinal = Boolean(parseInt(msg.param3));
        this._model.curRound = msg.currTurn;
        this._model.totalRound = msg.maxTurn;
        this._model.selfInfo.prelimScore = msg.score;
        this._model.selfInfo.sort = parseInt(msg.myOrder.toString());
        if (msg.lordsInfo) {
            var len: number = msg.lordsInfo.length;
            var tempMsg;
            for (var i: number = 0; i < len; i++) {
                tempMsg = msg.lordsInfo[i];
                var jobType: number = ThaneInfoHelper.getJob(tempMsg.job);
                this._tempInfo = this._model.getListData(WarlordsModel.TOP, jobType) as WarlordsPlayerInfo;
                if (!this._tempInfo) {
                    this._tempInfo = new WarlordsPlayerInfo();
                    this._model.addListData(WarlordsModel.TOP, jobType, this._tempInfo);
                }
                this._tempInfo.userKey = tempMsg.userKeys;
                this._tempInfo.nickname = tempMsg.nickName;
                this._tempInfo.serverName = tempMsg.serverName;
                this._tempInfo.job = tempMsg.job;
                this._tempInfo.headId = tempMsg.headId;
                this._tempInfo.thaneInfo = new ThaneInfo();
                this._tempInfo.thaneInfo.nickName = tempMsg.nickName;
                this._tempInfo.thaneInfo.serviceName = tempMsg.serverName;
                this._tempInfo.thaneInfo.job = tempMsg.job;
                this._tempInfo.thaneInfo.templateId = tempMsg.job;
                this._tempInfo.thaneInfo.IsVipAndNoExpirt = tempMsg.isVip;
                this._tempInfo.thaneInfo.appellId = this.getAppellIdByJobType(jobType);
                if (this._tempInfo.thaneInfo.hairFashionAvata != tempMsg.fashionHair) {
                    this._tempInfo.thaneInfo.hairFashionAvata = tempMsg.fashionHair;
                    topAvatarChange = true;
                }
                if (this._tempInfo.thaneInfo.cloakAvata != tempMsg.fashionHat) {
                    this._tempInfo.thaneInfo.cloakAvata = tempMsg.fashionHat;
                    topAvatarChange = true;
                }
                if (this._tempInfo.thaneInfo.wingAvata != tempMsg.fashionWing) {
                    this._tempInfo.thaneInfo.wingAvata = tempMsg.fashionWing;
                    topAvatarChange = true;
                }
                if (tempMsg.fashionArm) {//判断传过来的是否时装
                    if (tempMsg.fashionArm.indexOf("fashion") > -1) {
                        if (this._tempInfo.thaneInfo.armsFashionAvata != tempMsg.fashionArm) {
                            this._tempInfo.thaneInfo.armsFashionAvata = tempMsg.fashionArm;
                            topAvatarChange = true;
                        }
                    }
                    else {
                        if (this._tempInfo.thaneInfo.armsEquipAvata != tempMsg.fashionArm) {
                            this._tempInfo.thaneInfo.armsEquipAvata = tempMsg.fashionArm;
                            topAvatarChange = true;
                        }
                    }
                }
                if (tempMsg.fashionCloth) {//判断传过来的是否时装
                    if (tempMsg.fashionCloth.indexOf("fashion") > -1) {
                        if (this._tempInfo.thaneInfo.bodyFashionAvata != tempMsg.fashionCloth) {
                            this._tempInfo.thaneInfo.bodyFashionAvata = tempMsg.fashionCloth;
                            topAvatarChange = true;
                        }
                    }
                    else {
                        if (this._tempInfo.thaneInfo.bodyEquipAvata != tempMsg.fashionCloth) {
                            this._tempInfo.thaneInfo.bodyEquipAvata = tempMsg.fashionCloth;
                            topAvatarChange = true;
                        }
                    }
                }
            }
        }
        if (topAvatarChange) this._model.topAvatarChange();
        this._model.commitChanges();
        this._tempInfo = null;
    }

    private getAppellIdByJobType(jobType: number): number {
        switch (jobType) {
            case JobType.WIZARD:
                return 42;
                break;
            case JobType.WARRIOR:
                return 40;
                break;
            case JobType.HUNTER:
                return 41;
                break;
        }
        return 0;
    }

    private __getMatchInfoHandler(pkg: PackageIn) {//武斗会单场竞技结束信息返回
        var msg: LordsOrderListMsg = pkg.readBody(LordsOrderListMsg) as LordsOrderListMsg;

        clearInterval(this._model.reqAgainTimer);
        this._model.beginChanges();
        this._model.process = msg.param1;
        switch (this._model.process) {
            case WarlordsModel.PROCESS_PRELIM:
                this._model.waitTime = msg.leftTime / 1000;
                this._model.curRound = msg.currTurn;
                this._model.totalRound = msg.maxTurn;
                this._model.selfInfo.prelimScore = msg.score;
                break;
            case WarlordsModel.PROCESS_FINAL:
                this._model.waitTime = msg.leftTime / 1000;
                this._model.curRound = msg.currTurn;
                this._model.totalRound = msg.maxTurn;
                this._model.selfInfo.sort = msg.myOrder;
                this._model.selfInfo.winCount = msg.winCount;
                this._model.selfInfo.fightingCapacityRank = msg.param2;
                if (msg.lordsInfo) {
                    var len: number = msg.lordsInfo.length;
                    var tempMsg;
                    this._tempList = this._model.finalRankList;
                    if (!this._tempList) {
                        this._tempList = [];
                        this._model.finalRankList = this._tempList;
                    }
                    for (var i: number = 0; i < len; i++) {
                        tempMsg = msg.lordsInfo[i];
                        this._tempInfo = this._tempList.hasOwnProperty(i) ? this._tempList[i] : null;
                        if (!this._tempInfo) {
                            this._tempInfo = new WarlordsPlayerInfo();
                            this._tempList[i] = this._tempInfo;
                        }
                        this._tempInfo.sort = tempMsg.finalOrder;
                        this._tempInfo.userKey = tempMsg.userKeys;
                        this._tempInfo.nickname = tempMsg.nickName;
                        this._tempInfo.winCount = tempMsg.finalWinCount;
                        this._tempInfo.fightingCapacityRank = tempMsg.fightPowerOrder;
                        this._tempInfo.job = tempMsg.job;
                        this._tempInfo.headId = tempMsg.headId;
                    }
                    this._tempList.sort(this.sortByRank);
                }
                break;
        }
        this._model.commitChanges();
        this._tempList = null; this._tempInfo = null;
    }

    private __getCanBetListHandler(pkg: PackageIn) {//收到武斗会可下注列表
        var msg: LordsOrderListMsg = pkg.readBody(LordsOrderListMsg) as LordsOrderListMsg;

        this._model.beginChanges();
        this._model.betNum = msg.param1;
        this._model.curAwardTotal = msg.param2;
        if (!StringHelper.isNullOrEmpty(msg.param3)) {
            this._model.selfAwardNum = parseInt(msg.param3);
        }
        if (!StringHelper.isNullOrEmpty(msg.param4)) {
            this._model.lastAwardNum = parseInt(msg.param4);
        }
        if (msg.lordsInfo) {
            var len: number = msg.lordsInfo.length;
            var tempMsg;
            this._tempList = this._model.canBetList;
            if (!this._tempList) {
                this._tempList = [];
                this._model.canBetList = this._tempList;
            }
            for (var i: number = 0; i < len; i++) {
                tempMsg = msg.lordsInfo[i];
                this._tempInfo = this._tempList.hasOwnProperty(i) ? this._tempList[i] : null;
                if (!this._tempInfo) {
                    this._tempInfo = new WarlordsPlayerInfo();
                    this._tempList[i] = this._tempInfo;
                }
                this._tempInfo.userKey = tempMsg.userKeys;
                this._tempInfo.nickname = tempMsg.nickName;
                this._tempInfo.serverName = tempMsg.serverName;
                this._tempInfo.isVip = tempMsg.isVip;
                this._tempInfo.grade = tempMsg.grades;
                this._tempInfo.fightingCapacity = tempMsg.fightPower;
                this._tempInfo.betRank = tempMsg.bet_Index;
                this._tempInfo.job = tempMsg.job;
                this._tempInfo.headId = tempMsg.headId;
                if (tempMsg.bet_Index > 0) {
                    this._model.addListData(WarlordsModel.BETTING, tempMsg.bet_Index, this._tempInfo);
                }
                if (tempMsg.finalOrder > 0 && tempMsg.finalOrder <= 3) {
                    this._model.addListData(WarlordsModel.JOB_TOP3, tempMsg.finalOrder, this._tempInfo);
                }
            }
            this._tempList.sort(this.sortByFightingCapacity);
        }
        this._model.commitChanges();
        this._tempList = null; this._tempInfo = null;
    }

    private __getAwardListHandler(pkg: PackageIn) {//收到武斗会获奖列表
        var msg: LordsOrderListMsg = pkg.readBody(LordsOrderListMsg) as LordsOrderListMsg;

        if (msg.lordsInfo) {
            var len: number = msg.lordsInfo.length;
            var tempMsg;
            this._tempList = [];
            for (var i: number = 0; i < len; i++) {
                tempMsg = msg.lordsInfo[i];
                this._tempInfo = new WarlordsPlayerInfo();
                this._tempInfo.userKey = tempMsg.userKeys;
                this._tempInfo.nickname = tempMsg.nickName;
                this._tempInfo.serverName = tempMsg.serverName;
                this._tempInfo.isVip = tempMsg.isVip;
                this._tempInfo.job = tempMsg.job;
                this._tempInfo.awardGolds = parseInt(tempMsg.property1);
                this._tempInfo.headId = tempMsg.headId;
                this._tempList[i] = this._tempInfo;
            }
            this._tempList.sort(this.sortByAward);
            this._model.lastAwardList = this._tempList;
        }
        this._tempList = null; this._tempInfo = null;
    }

    private __getAccessFinalListHandler(pkg: PackageIn) {//收到进入决赛玩家列表
        var msg: LordsOrderListMsg = pkg.readBody(LordsOrderListMsg) as LordsOrderListMsg;

        this._model.selfInfo.sort = msg.myOrder;
        this._model.selfInfo.fightingCapacityRank = msg.param2;
        if (msg.lordsInfo) {
            var len: number = msg.lordsInfo.length;
            var tempMsg: LordsBaseInfoMsg;
            for (var i: number = 0; i < len; i++) {
                tempMsg = msg.lordsInfo[i] as LordsBaseInfoMsg;
                this._tempInfo = this.model.getWarlordsPlayerInfoByUserIdAndServerName(tempMsg.userId, tempMsg.serverName);
                if (!this._tempInfo) {
                    this._tempInfo = new WarlordsPlayerInfo();
                    this._model.accessFinalList.push(this._tempInfo);
                }
                this._tempInfo.userKey = tempMsg.userKeys;
                this._tempInfo.userId = tempMsg.userId;
                this._tempInfo.nickname = tempMsg.nickName;
                this._tempInfo.serverName = tempMsg.serverName;
                this._tempInfo.isVip = tempMsg.isVip;
                this._tempInfo.fightingCapacity = tempMsg.fightPower;
                this._tempInfo.job = tempMsg.sexJob;
                this._tempInfo.sort = tempMsg.readyOrder;
                this._tempInfo.headId = tempMsg.headId;
            }
            this._model.accessFinalList = ArrayUtils.sortOn(this._model.accessFinalList, ["sort", "job"], ArrayConstant.CASEINSENSITIVE | ArrayConstant.NUMERIC);
            this._model.accessFinalList.sort(this.sortBySort);
        }
        this._model.dispatchEvent(WarlordsEvent.ACCESS_FINALLIST_UPDATE);
        this._tempInfo = null;
    }

    private __getFinalNoticeHandler(pkg: PackageIn) {//收到武斗会全服公告
        var msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;

        var chatData: ChatData = new ChatData();
        chatData.channel = ChatChannel.NOTICE;
        chatData.userType = 1;
        chatData.type = 1;
        chatData.is_centerTip = false;
        chatData.is_bigTip = true;
        chatData.bigBugleType = 3;
        chatData.msg = msg.param4;
        chatData.commit();
        ChatManager.Instance.model.addChat(chatData);
        if (chatData.is_bigTip) {
            MessageTipManager.Instance.show(chatData.msg);
            NotificationManager.Instance.sendNotification(ChatEvent.UPDATE_BIGBUGLE_VIEW, chatData);
        }
    }

    private __getRewardStateHandler(pkg: PackageIn) {
        this._model.rewardState = WarlordsModel.PROCESS_FINAL;
    }

    private __getRewardResultHandler(pkg: PackageIn) {
        var msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
        var data = { rank: msg.param4, gloryNum: msg.param1, mount: msg.param6, mountTime: msg.param3, appell: msg.param5, hasPrivilege: msg.param7 };
        FrameCtrlManager.Instance.open(EmWindow.WarlordsFinalReportWnd, data);
        if (data.hasPrivilege) {
            var mapId: number = CampaignManager.Instance.mapModel ? CampaignManager.Instance.mapModel.mapId : 0;
            if (WorldBossHelper.checkConsortiaSecretLand(mapId)) return;
            var tipData: TipMessageData = new TipMessageData();
            tipData.type = TipMessageData.CALL_SECRET_TREE;
            tipData.title = LangManager.Instance.GetTranslation("public.prompt");
            tipData.name = LangManager.Instance.GetTranslation("tasktracetip.view.SecretTreeTipView.privilege");
            tipData.content = LangManager.Instance.GetTranslation("tasktracetip.view.SecretTreeTipView.callMonsterContent");
            tipData.icon = FUIHelper.getItemURL("Base", "asset.taskTraceTips.WarlordsIcon");
            tipData.btnTxt = LangManager.Instance.GetTranslation("tasktracetip.view.SecretTreeTipView.callNow");
            DelayActionsUtils.Instance.addAction(new AlertTipAction(tipData, this.showSecretTip.bind(this)));
        }
    }

    private showSecretTip(tipData: Object) {
        TaskTraceTipManager.Instance.showView(tipData as TipMessageData);
    }

    private __getWarlordsCloseHandler(pkg: PackageIn) {
        if (SceneManager.Instance.currentType == SceneType.WARLORDS_ROOM) {
            this.exitWarlordsRoom();
        }
    }

    private __loadRankListCompleteHandler(content: string) {
        var lastPeriod: number = 0;
        var list: Array<WarlordsPlayerInfo> = [];
        // var value = XmlMgr.Instance.decode(content);
        let value = JSON.parse(content);
        if (!value || !value.LordsInfos) return;
        let rankXML = value.LordsInfos;
        var jobType: number = Number(rankXML.info.job);
        this._model.beginChanges();
        this._model.rankListCreateDate = DateFormatter.parse(rankXML.info.createDate, "YYYY-MM-DD hh:mm:ss");
        var rankList = rankXML.LordsInfo;
        if (rankList instanceof Array) {
            for (let key in rankList) {
                if (Object.prototype.hasOwnProperty.call(rankList, key)) {
                    let item = rankList[key];
                    this._tempInfo = new WarlordsPlayerInfo();
                    this._tempInfo.thaneInfo = new ThaneInfo();
                    this._tempInfo.sort = Number(item.orderId);
                    this._tempInfo.userKey = item.userKeys;
                    this._tempInfo.userId = parseInt(item.userId);
                    this._tempInfo.nickname = item.nickName;
                    this._tempInfo.serverName = item.serverName;
                    this._tempInfo.isVip = item.isVip == "true" ? true : false;
                    this._tempInfo.grade = Number(item.grades);
                    this._tempInfo.fightingCapacity = Number(item.fightPower);
                    this._tempInfo.winCount = Number(item.finalWinCount);
                    this._tempInfo.betRank = Number(item.betIndex);
                    this._tempInfo.job = Number(item.job);
                    this._tempInfo.headId = Number(item.headId);

                    this._tempInfo.thaneInfo.userId = parseInt(item.userId);
                    this._tempInfo.thaneInfo.nickName = item.nickName;
                    this._tempInfo.thaneInfo.serviceName = item.serverName;
                    this._tempInfo.thaneInfo.job = Number(item.job);
                    this._tempInfo.thaneInfo.grades = Number(item.grades);
                    this._tempInfo.thaneInfo.fightingCapacity = Number(item.fightPower);
                    this._tempInfo.thaneInfo.IsVipAndNoExpirt = Boolean(item.isVip);
                    this._tempInfo.thaneInfo.attackProrerty.totalPhyAttack = Number(item.attack);
                    this._tempInfo.thaneInfo.attackProrerty.totalPhyDefence = Number(item.defenc);
                    this._tempInfo.thaneInfo.attackProrerty.totalMagicAttack = Number(item.magicAttack);
                    this._tempInfo.thaneInfo.attackProrerty.totalMagicDefence = Number(item.magicDefenc);
                    this._tempInfo.thaneInfo.attackProrerty.totalForceHit = Number(item.hit);
                    this._tempInfo.thaneInfo.attackProrerty.totalParry = Number(item.pary);
                    this._tempInfo.thaneInfo.attackProrerty.totalLive = Number(item.live);
                    this._tempInfo.thaneInfo.attackProrerty.totalConatArmy = Number(item.coant);
                    list.push(this._tempInfo);
                    if (lastPeriod == 0) {
                        lastPeriod = parseInt(item.lordsIndex);
                    }
                    if (this.playerInfo.serviceName == this._tempInfo.serverName && this.playerInfo.userId == this._tempInfo.userId) {
                        this._model.lastSelfRank = this._tempInfo.sort;
                    }
                }
            }
        } else {
            let item = rankList;
            this._tempInfo = new WarlordsPlayerInfo();
            this._tempInfo.thaneInfo = new ThaneInfo();
            this._tempInfo.sort = Number(item.orderId);
            this._tempInfo.userKey = item.userKeys;
            this._tempInfo.userId = parseInt(item.userId);
            this._tempInfo.nickname = item.nickName;
            this._tempInfo.serverName = item.serverName;
            this._tempInfo.isVip = item.isVip == "true" ? true : false;
            this._tempInfo.grade = Number(item.grades);
            this._tempInfo.fightingCapacity = Number(item.fightPower);
            this._tempInfo.winCount = Number(item.finalWinCount);
            this._tempInfo.betRank = Number(item.betIndex);
            this._tempInfo.job = Number(item.job);
            this._tempInfo.headId = Number(item.headId);

            this._tempInfo.thaneInfo.userId = parseInt(item.userId);
            this._tempInfo.thaneInfo.nickName = item.nickName;
            this._tempInfo.thaneInfo.serviceName = item.serverName;
            this._tempInfo.thaneInfo.job = Number(item.job);
            this._tempInfo.thaneInfo.grades = Number(item.grades);
            this._tempInfo.thaneInfo.fightingCapacity = Number(item.fightPower);
            this._tempInfo.thaneInfo.IsVipAndNoExpirt = Boolean(item.isVip);
            this._tempInfo.thaneInfo.attackProrerty.totalPhyAttack = Number(item.attack);
            this._tempInfo.thaneInfo.attackProrerty.totalPhyDefence = Number(item.defenc);
            this._tempInfo.thaneInfo.attackProrerty.totalMagicAttack = Number(item.magicAttack);
            this._tempInfo.thaneInfo.attackProrerty.totalMagicDefence = Number(item.magicDefenc);
            this._tempInfo.thaneInfo.attackProrerty.totalForceHit = Number(item.hit);
            this._tempInfo.thaneInfo.attackProrerty.totalParry = Number(item.pary);
            this._tempInfo.thaneInfo.attackProrerty.totalLive = Number(item.live);
            this._tempInfo.thaneInfo.attackProrerty.totalConatArmy = Number(item.coant);
            list.push(this._tempInfo);
            if (lastPeriod == 0) {
                lastPeriod = parseInt(item.lordsIndex);
            }
            if (this.playerInfo.serviceName == this._tempInfo.serverName && this.playerInfo.userId == this._tempInfo.userId) {
                this._model.lastSelfRank = this._tempInfo.sort;
            }
        }

        list.sort(this.sortByRank);
        this._model.lastPeriod = lastPeriod;
        this._model.addListData(WarlordsModel.LAST_RANK, jobType, list);
        this._model.commitChanges();
        this._tempInfo = null;
    }

    private sortByRank(a: WarlordsPlayerInfo, b: WarlordsPlayerInfo): number {
        if (!a || !b) return 0;
        if (a.sort < b.sort) return -1;
        return 1;
    }

    private sortByFightingCapacity(a: WarlordsPlayerInfo, b: WarlordsPlayerInfo): number {
        if (!a || !b) return 0;
        if (a.fightingCapacity >= b.fightingCapacity) return -1;
        return 1;
    }

    private sortBySort(a: WarlordsPlayerInfo, b: WarlordsPlayerInfo): number {
        if (!a || !b) return 0;
        if (a.sort >= b.sort) return 1;
        return -1;
    }



    private sortByAward(a: WarlordsPlayerInfo, b: WarlordsPlayerInfo): number {
        if (!a || !b) return 0;
        if (a.awardGolds >= b.awardGolds) return -1;
        return 1;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }


    ////////////////////////////////////////////////////////////////////  视图API
    /**
     * 进入武斗会房间场景
     */
    public enterWarlordsRoom() {
        if (ArmyManager.Instance.thane.grades < WarlordsModel.OPEN_GRADE) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.BuildingManager.command08", WarlordsModel.OPEN_GRADE));
            return;
        }

        if (this._model.process == WarlordsModel.PROCESS_FINAL && !this._model.isEnterFinal) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.WarlordsManager.str01"));
            return;
        }
        if (this._model.process != WarlordsModel.PROCESS_PRELIM && this._model.process != WarlordsModel.PROCESS_FINAL) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.WarlordsManager.str02"));
            return;
        }
        if (this._model.curRound >= this._model.totalRound && this._model.process != WarlordsModel.PROCESS_FINAL) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.WarlordsManager.str03"));
            return;
        }
        let thane = ArmyManager.Instance.thane
        let model = FreedomTeamManager.Instance.model
        let inTeam = model && Boolean(model.getMemberByUserId(thane.userId))
        if (inTeam) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.WarlordsManager.str04"));
            return;
        }
        var tips: string = WorldBossHelper.getCampaignTips();
        if (tips != "") {
            MessageTipManager.Instance.show(tips);
            return;
        }
        SceneManager.Instance.setScene(SceneType.WARLORDS_ROOM);
    }

    /**
     * 退出武斗会房间场景
     */
    public exitWarlordsRoom() {
        this.reqExitWarlordsRoom();
        SwitchPageHelp.returnToSpace();
    }

    ////////////////////////////////////////////////////////////////////  请求API
    /**
     * 请求武斗会主面板信息
     */
    public reqWarlordsMainInfo() {
        this.sendProtoBuffer(C2SProtocol.C_LOAD_LORDS_MAINBORAD, null);
    }

    /**
     * 请求进入武斗会房间
     */
    public reqEnterWarlordsRoom() {
        this.sendProtoBuffer(C2SProtocol.C_REQUEST_START, null);
        clearInterval(this._model.reqAgainTimer);
        this._model.reqAgainCount = 0;
        this._model.reqAgainTimer = setInterval(this.reqEnterAgain.bind(this), 5000);
    }

    private reqEnterAgain() {//请求进入武斗会, 但服务器可能出现未返回信息给客户端的情况, 导致房间内信息不更新和玩家未拉入战斗, 此处作几秒没收到返回再次请求的容错
        this._model.reqAgainCount++;
        if (SceneManager.Instance.currentType == SceneType.WARLORDS_ROOM && this._model.reqAgainCount <= 5) {
            if (this._model.reqAgainCount <= 2) {
                //					LoggerSys.info("众神之战: 5秒未收到服务器返回协议(0x11B2)_____reqAgainCount:" + _model.reqAgainCount + "_____userId:" + playerInfo.userId + "_____turn:" + _model.curRound + "/" + _model.totalRound);
            }
            this.sendProtoBuffer(C2SProtocol.C_REQUEST_START, null);
        }
        else {
            clearInterval(this._model.reqAgainTimer);
        }
    }

    /**
     * 武斗会请求撮合
     */
    public reqWarlordsMatch() {
        this.sendProtoBuffer(C2SProtocol.C_ENTER_REQUEST, null);
    }

    /**
     * 武斗会取消撮合
     */
    public reqExitWarlordsRoom() {
        clearInterval(this._model.reqAgainTimer);
        this.sendProtoBuffer(C2SProtocol.C_LEAVE_LORDS, null);
    }

    /**
     * 请求可下注列表
     */
    public reqCanBetList() {
        this.sendProtoBuffer(C2SProtocol.C_REQUEST_FINAL_ORDERLIST, null);
    }

    /**
     * 武斗会下注
     */
    public reqBet(first: string, second: string, third: string, betNum: number) {
        var msg: PropertyMsg = new PropertyMsg();
        msg.param1 = betNum;
        msg.param4 = first;
        msg.param5 = second;
        msg.param6 = third;
        this.sendProtoBuffer(C2SProtocol.C_BET_ADDLORDS, msg);
    }

    /**
     * 请求获奖列表
     */
    public reqAwardList() {
        this.sendProtoBuffer(C2SProtocol.C_REQUEST_BET_LIST, null);
    }

    /**
     * 领取奖励
     */
    public reqGetReward() {
        this.sendProtoBuffer(C2SProtocol.C_TAKE_FINAL_REWARD, null);
    }

    /**
     * 请求进入决赛玩家列表
     */
    public reqAccessFinalList() {
        this.sendProtoBuffer(C2SProtocol.C_REQUEST_LOCAL_FINAL_ORDER, null);
    }

    /**
     * 加载排行榜列表
     * @param job  职业类型
     */
    public loadLastRankList(jobType: number) {
        var path: string = PathManager.info.TEMPLATE_PATH + "lords" + jobType + ".json" + "?v=" + new Date().getTime();
        ResMgr.Instance.loadRes(path, (info) => {
            let contentStr: string = "";
            if (info) {
                try {
                    let content: ByteArray = new ByteArray();
                    content.writeArrayBuffer(info);
                    if (content && content.length) {
                        content.position = 0;
                        content.uncompress();
                        contentStr = content.readUTFBytes(content.bytesAvailable);
                        content.clear();
                        this.__loadRankListCompleteHandler(contentStr);
                    }
                } catch (error) {
                    Logger.error('SortController __loadLastRankList Error');
                    this.__loadRankListCompleteHandler(contentStr);
                    return;
                }
            }
        }, null, Laya.Loader.BUFFER);
    }

    public sendProtoBuffer(code: number, message) {
        SocketManager.Instance.send(code, message);
    }
}