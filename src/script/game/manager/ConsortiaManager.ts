// @ts-nocheck
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LangManager from "../../core/lang/LangManager";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import { AlertTipAction } from "../battle/actions/AlertTipAction";
import { BagType } from "../constant/BagDefine";
import { ChatEvent, ConsortiaEvent, NotificationEvent } from "../constant/event/NotificationEvent";
import { PlayerEvent } from "../constant/event/PlayerEvent";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { StateType } from "../constant/StateType";
import { ChatChannel } from "../datas/ChatChannel";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { TipMessageData } from "../datas/TipMessageData";
import ChatData from "../module/chat/data/ChatData";
import { ConsortiaModel } from "../module/consortia/model/ConsortiaModel";
import { DelayActionsUtils } from "../utils/DelayActionsUtils";
import { SwitchPageHelp } from "../utils/SwitchPageHelp";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import { ArmyManager } from "./ArmyManager";
import { CampaignManager } from "./CampaignManager";
import { MessageTipManager } from "./MessageTipManager";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
import { SocketSceneBufferManager } from "./SocketSceneBufferManager";
import { TaskManage } from "./TaskManage";
import { TaskTraceTipManager } from "./TaskTraceTipManager";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { ConsortiaSocketOutManager } from "./ConsortiaSocketOutManager";
import { ConsortiaInviteInfo } from "../module/consortia/data/ConsortiaInviteInfo";
import { ConsortiaInfo } from "../module/consortia/data/ConsortiaInfo";
import { ConsortiaControler } from "../module/consortia/control/ConsortiaControler";
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import { EmWindow } from "../constant/UIDefine";
import { ConsortiaSecretInfo } from "../module/consortia/data/ConsortiaSecretInfo";
import { WoundInfo } from "../mvc/model/worldboss/WoundInfo";
import { ConsortiaDemonInfo } from "../module/consortia/data/ConsortiaDemonInfo";
import { ConsortiaDutyLevel } from "../module/consortia/data/ConsortiaDutyLevel";
import { ConsortiaOrderInfo } from "../module/consortia/data/ConsortiaOrderInfo";
import PopFrameCheck from "../utils/PopFrameCheck";
import { ConsortiaApplyAction } from "../battle/actions/ConsortiaApplyAction";
import { CaseGoodsSendBackByMailAction } from "../battle/actions/CaseGoodsSendBackByMailAction";
import { ConsortiaDutyInfo } from "../module/consortia/data/ConsortiaDutyInfo";
import BitArray from "../../core/utils/BitArray";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import FUIHelper from "../utils/FUIHelper";
import ConsortiaStorageInfoMsg = com.road.yishi.proto.consortia.ConsortiaStorageInfoMsg;
import ConsortiaBoxInfoMsg = com.road.yishi.proto.consortia.ConsortiaBoxInfoMsg;
import ConsortiaTreasureBoxMsg = com.road.yishi.proto.consortia.ConsortiaTreasureBoxMsg;
import ConsortiaMembersInfoMsg = com.road.yishi.proto.consortia.ConsortiaMembersInfoMsg;
import SimplePlayerListRspMsg = com.road.yishi.proto.simple.SimplePlayerListRspMsg;
import SimplePlayerInfoMsg = com.road.yishi.proto.simple.SimplePlayerInfoMsg;
import ConsortiaMsg = com.road.yishi.proto.consortia.ConsortiaMsg;
import FamInfoMsg = com.road.yishi.proto.consortia.FamInfoMsg;
import FamLordsInfoMsg = com.road.yishi.proto.consortia.FamLordsInfoMsg;
import ConsortiaAltarOpenRspMsg = com.road.yishi.proto.consortia.ConsortiaAltarOpenRspMsg;
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import AltarCampaignSkillMsg = com.road.yishi.proto.campaign.AltarCampaignSkillMsg;
import ConsortiaLinkRspMsg = com.road.yishi.proto.consortia.ConsortiaLinkRspMsg;
import AltarCampaignReportMsg = com.road.yishi.proto.campaign.AltarCampaignReportMsg;
import HurtOrderMsg = com.road.yishi.proto.campaign.HurtOrderMsg;
import ConsortiaInfoMsg = com.road.yishi.proto.consortia.ConsortiaInfoMsg;
import ConsortiaOrderInfoMsg = com.road.yishi.proto.consortia.ConsortiaOrderInfoMsg;
import ConsortiaUserInviteInfoListRspMsg = com.road.yishi.proto.consortia.ConsortiaUserInviteInfoListRspMsg;
import ConsortiaUserInviteInfoMsg = com.road.yishi.proto.consortia.ConsortiaUserInviteInfoMsg;
import ConsortiaDutyListRspMsg = com.road.yishi.proto.consortia.ConsortiaDutyListRspMsg;
import ConsortiaDutyInfoMsg = com.road.yishi.proto.consortia.ConsortiaDutyInfoMsg;
import ConsortiaRenameRspMsg = com.road.yishi.proto.consortia.ConsortiaRenameRspMsg;
import AllTaskInfoMsg = com.road.yishi.proto.consortia.AllTaskInfoMsg;
import TaskRecordMsg = com.road.yishi.proto.consortia.TaskRecordMsg;
import ConsortiaTaskMsg = com.road.yishi.proto.consortia.ConsortiaTaskMsg;
import HiSkillInfoMsg = com.road.yishi.proto.consortia.HiSkillInfoMsg;
import GoodsProfile from "../datas/goods/GoodsProfile";
import Logger from "../../core/logger/Logger";
import Dictionary from "../../core/utils/Dictionary";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import { t_s_consortiataskrewardData } from "../config/t_s_consortiataskreward";
import ConsortiaAltarInfoMsg = com.road.yishi.proto.consortia.ConsortiaAltarInfoMsg;
import ConsortiaAltarItemMsg = com.road.yishi.proto.consortia.ConsortiaAltarItemMsg;
import ConsortiaPrayInfo from "../module/consortia/data/ConsortiaPrayInfo";
import { t_s_consortiataskData } from "../config/t_s_consortiatask";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
/**
 * 公会管理
 * @author yuanzhan.yu
 */
export class ConsortiaManager extends GameEventDispatcher {
    private _model: ConsortiaModel;
    private static _instance: ConsortiaManager;
    public ConsortiaStorageIsOpen: boolean = false;
    private static AUTO_INVITE_LEVEL: number = 15;

    constructor() {
        super();
        this._model = new ConsortiaModel();
        this.addEvent();
    }

    private get controller(): ConsortiaControler {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
    }

    public static get Instance(): ConsortiaManager {
        if (!ConsortiaManager._instance) {
            ConsortiaManager._instance = new ConsortiaManager();
        }
        return ConsortiaManager._instance;
    }

    public setup() {
        this._model.initTaskInfo();
        if (this.playerInfo.consortiaID) {
            this.getConsortiaDutyInfos();
            this.getConsortiaUserInfos();
            this.getConsirtiaInfo();

        }
        else {
            this.thane.addEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.__levelUpgradeHandler, this);
            ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_INVITE, this, this.__consortiaInviteHandler);
        }
    }

    protected __levelUpgradeHandler() {
        if (this.thane.grades >= ConsortiaManager.AUTO_INVITE_LEVEL) {
            this.thane.removeEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.__levelUpgradeHandler, this);
            if (this.playerInfo.consortiaID == 0) {
                ConsortiaSocketOutManager.autoInvite();
            }
        }
    }

    private addEvent() {
        ServerDataManager.listen(S2CProtocol.U_CH_CONSORTIA_FRESHINFO, this, this.__refreshConsortiaInfo);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_INFO, this, this.__refreshConsortiaInfo);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_RENAME, this, this.__renameHandler);
        ServerDataManager.listen(S2CProtocol.U_C_INVITEINFO_LIST, this, this.__refreshRecordList);
        ServerDataManager.listen(S2CProtocol.U_CH_CONSORTIA_USERLOGIN, this, this.__userLogin);
        ServerDataManager.listen(S2CProtocol.U_CH_CONSORTIA_USERLOGOUT, this, this.__userLogout);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_STATIC, this, this.__consortiaStageChange);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIAUSER_LIST, this, this.__updateConsortiaMember);
        ServerDataManager.listen(S2CProtocol.U_C_DUTY_LIST, this, this.__refreshDutyInfos);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_DUTYUPDATE, this, this.__updataDutyInfo);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_INVITE_LIST, this, this.__refreshApplyList);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_OFFER_CHANGE, this.__onContributeUpdata, this);
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__consortiaChangeHandler, this);

        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_USERINVITE, this, this.__joinConsortiaHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_USERPASS, this, this.__operateConsortiaApplyResult);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_PASS_USER, this, this.__operateConsortiaPassUser);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_LINK, this, this.__linkConsortia);
        ServerDataManager.listen(S2CProtocol.U_C_FAM_INFO, this, this.__consortiaSecretUpdateHandler);
        ServerDataManager.listen(S2CProtocol.U_C_FAM_TREE, this, this.__consortiaTreeUpdateHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SENDFAMLORDS_INFO, this, this.__consortiaSecretCallMonsterHandler);
        ServerDataManager.listen(S2CProtocol.U_C_OPEN_CONSORTIA__ALTAR, this, this.__demonSwitchHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_ALTAR_REPORT, this, this.__demonReportHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ALTAROVER_MSG, this, this.__demonEndHandler);
        ServerDataManager.listen(S2CProtocol.U_CONSORTIA_ALTAR_USE_SKILL, this, this.__demonSkillUsedHandler);

        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_BOX_INFO, this, this.__prizeCheckHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_TREASURE_BOX, this, this.__prizeAllotHandler);

        this._model.addEventListener(ConsortiaEvent.IS_CONSORTIA_EXIST, this.__existHandler, this);
        this._model.demonInfo.addEventListener(ConsortiaEvent.DEMON_DURA_CHANGE, this.__duraChangeHandler, this);
        this._model.demonInfo.addEventListener(ConsortiaEvent.DEMON_WAVE_CHANGE, this.__waveChangeHandler, this);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_BOSS_SKILL, this, this.__reFreshBuffer);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_BOSS_START, this, this.__bossStateHandler);

        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_TASK, this, this.__task);
        ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_ALTERITEM, this, this.__refreshAltarGoods);
    }

    private __refreshAltarGoods(pkg: PackageIn) {
        let msg: ConsortiaAltarInfoMsg = pkg.readBody(ConsortiaAltarInfoMsg) as ConsortiaAltarInfoMsg;
        if (msg) {
            if (msg.type == 1) {//普通
                this.readConsortiaPrayInfo(msg);
                ConsortiaManager.Instance.model.commAltarCount = msg.altarCount;
                ConsortiaManager.Instance.model.commFreshCount = msg.freshCount;

            } else if (msg.type == 2) {//高级
                this.readConsortiaPrayInfo(msg);
                ConsortiaManager.Instance.model.highAltarCount = msg.altarCount;
                ConsortiaManager.Instance.model.highFreshCount = msg.freshCount;
            }
            NotificationManager.Instance.dispatchEvent(ConsortiaEvent.GET_ALTAR_GOODS);
        }
    }

    private readConsortiaPrayInfo(msg: ConsortiaAltarInfoMsg) {
        let item: ConsortiaAltarItemMsg;
        let consortiaPrayInfo: ConsortiaPrayInfo;
        let goodsInfo: GoodsInfo;
        let len: number = 0;
        if (msg.type == 1) {//普通
            ConsortiaManager.Instance.model.commPrayGoodsList = new Dictionary();
            len = msg.altarItemList.length;
            for (let i: number = 0; i < len; i++) {
                item = msg.altarItemList[i] as ConsortiaAltarItemMsg;
                consortiaPrayInfo = new ConsortiaPrayInfo();
                goodsInfo = new GoodsInfo();
                consortiaPrayInfo.pos = item.pos;
                consortiaPrayInfo.status = item.status;
                goodsInfo.templateId = item.templateId;
                goodsInfo.count = item.count;
                consortiaPrayInfo.goodsInfo = goodsInfo;
                ConsortiaManager.Instance.model.commPrayGoodsList.set(consortiaPrayInfo.pos, consortiaPrayInfo);
            }
        } else if (msg.type == 2) {//高级
            ConsortiaManager.Instance.model.highPrayGoodsList = new Dictionary();
            len = msg.altarItemList.length;
            for (let i: number = 0; i < len; i++) {
                item = msg.altarItemList[i] as ConsortiaAltarItemMsg;
                consortiaPrayInfo = new ConsortiaPrayInfo();
                goodsInfo = new GoodsInfo();
                consortiaPrayInfo.pos = item.pos;
                consortiaPrayInfo.status = item.status;
                goodsInfo.templateId = item.templateId;
                goodsInfo.count = item.count;
                consortiaPrayInfo.goodsInfo = goodsInfo;
                ConsortiaManager.Instance.model.highPrayGoodsList.set(consortiaPrayInfo.pos, consortiaPrayInfo);
            }
        }
    }


    /**
         * 公会boss的buff同步 0:反伤 1: 英灵觉醒 2: 伤害提升
         * @param evt
         */
    private __reFreshBuffer(pkg: PackageIn) {
        let msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
        this._model.bossInfo.BufferIds = msg.param4;
        NotificationManager.Instance.dispatchEvent(NotificationEvent.CONSORTIA_BOSS_BUFFERIDS);
    }
    /**
     * 公会BOSS开始与结束 
     */
    private __bossStateHandler(pkg: PackageIn) {
        var msg: ConsortiaInfoMsg = pkg.readBody(ConsortiaInfoMsg) as ConsortiaInfoMsg;
        if (msg.bossInfo) {
            this._model.bossInfo.grade = msg.bossInfo.grade;
            this._model.bossInfo.callGrade = msg.bossInfo.callGrade;
            this._model.bossInfo.spirit = Number(msg.bossInfo.spirit);
            this._model.bossInfo.state = msg.bossInfo.state;
            this._model.bossInfo.endTime = msg.bossInfo.endTime;
            this._model.bossInfo.totalHp = Number(msg.bossInfo.totalHp);
            if (WorldBossHelper.checkConsortiaBoss(CampaignManager.Instance.mapId)) {
                CampaignManager.Instance.worldBossModel.totalHp = this._model.bossInfo.totalHp;
            }
        }
        if (this._model.bossInfo.state == 1 || this._model.bossInfo.state == 2) {
            // DelayActionsUtils.instance.addAction(new AlertTipAction("",__consortiaBossTipHandler));
        } else {
            this._model.bossInfo.BufferIds = "";
        }
        this._model.consortiaInfo.offer = msg.offer;
        this._model.consortiaInfo.consortiaMaterials = msg.materials;
        NotificationManager.Instance.dispatchEvent(NotificationEvent.CONSORTIA_BOSS_SWITCH);
    }

    private __prizeCheckHandler(pkg: PackageIn) {
        let msg: ConsortiaStorageInfoMsg = pkg.readBody(ConsortiaStorageInfoMsg) as ConsortiaStorageInfoMsg;
        let infos: Array<any> = msg.storageInfo;
        let dic: SimpleDictionary = new SimpleDictionary();
        let lastGoodsInfo: GoodsInfo;
        let pos: number = 0;
        for (let i: number = 0; i < infos.length; i++) {
            let info: ConsortiaBoxInfoMsg = infos[i] as ConsortiaBoxInfoMsg;
            for (let j: number = 0; j < info.count; j++) {
                if (lastGoodsInfo && lastGoodsInfo.templateInfo && lastGoodsInfo.templateId == info.templateId && lastGoodsInfo.templateInfo.MaxCount > lastGoodsInfo.count) {
                    lastGoodsInfo.count++;
                    continue;
                }
                let goodsInfo: GoodsInfo = new GoodsInfo();
                goodsInfo.templateId = info.templateId;
                goodsInfo.count = 1;
                goodsInfo.bagType = BagType.PrizeBox;
                goodsInfo.pos = pos;
                dic.add(goodsInfo.pos, goodsInfo);
                lastGoodsInfo = goodsInfo;

                pos++;
            }
        }
        this.model.prizeList = dic;
    }

    private __prizeAllotHandler(pkg: PackageIn) {
        let msg: ConsortiaTreasureBoxMsg = pkg.readBody(ConsortiaTreasureBoxMsg) as ConsortiaTreasureBoxMsg;
        let infos: Array<any> = msg.playerInfo;
        let dic: SimpleDictionary = new SimpleDictionary();
        let pos: number = 0;
        for (let i: number = 0; i < infos.length; i++) {
            let info: ConsortiaMembersInfoMsg = infos[i] as ConsortiaMembersInfoMsg;
            let thaneInfo: ThaneInfo = new ThaneInfo();
            thaneInfo.job = info.job;
            thaneInfo.nickName = info.nickName;
            thaneInfo.grades = info.level;
            thaneInfo.fightingCapacity = info.fightCapacity;
            thaneInfo.userId = info.userId;
            thaneInfo.received = info.isReceived;
            thaneInfo.receivedCount = info.count;
            dic.add(thaneInfo.userId, thaneInfo);

            pos++;
        }
        this.model.currentPrizeTemplateId = msg.templateId;
        this.model.currentPrizeListCount = msg.count;
        this.model.prizeMemberList = dic;
    }

    private __operateConsortiaPassUser(evt) {
        // if (!this.controller.mainFrame)
        //     MainToolBar.Instance.consortiaButtonShine = true;
    }

    private __consortiaChangeHandler() {
        if (this.playerInfo.consortiaID > 0) {
            TaskManage.Instance.requestCanAcceptTask();
        }
        else {
            let str: string = LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.exitConsortia");
            MessageTipManager.Instance.show(str);
            TaskTraceTipManager.Instance.cleanByType(TipMessageData.DEMON_OPEN);
            ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_INVITE, this, this.__consortiaInviteHandler);
        }
    }

    private __operateConsortiaApplyResult(pkg: PackageIn) {
        let msg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        let flag: boolean = msg.result;
        let id: number = msg.applyId;
        if (flag) {
            for (const key in this._model.inviteList) {
                if (this._model.inviteList.hasOwnProperty(key)) {
                    let item: ConsortiaInviteInfo = this._model.inviteList[key];
                    if (item.id == id) {
                        let str: string = LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.command01", item.consortiaName);
                        MessageTipManager.Instance.show(str);
                        // if (!this.controller.mainFrame)
                        // {
                        //     MainToolBar.Instance.consortiaButtonShine = true;
                        // }
                        break;
                    }
                }
            }
        }
    }

    private __linkConsortia(pkg: PackageIn) {
        let msg = pkg.readBody(ConsortiaLinkRspMsg) as ConsortiaLinkRspMsg;
        let consortiaInfo: ConsortiaInfo = new ConsortiaInfo();
        consortiaInfo.consortiaName = msg.consortiaName;
        consortiaInfo.chairmanName = msg.creatorName;
        consortiaInfo.levels = msg.levels;
        consortiaInfo.offer = msg.Offer;
        consortiaInfo.consortiaMaterials = msg.materials;
        consortiaInfo.currentCount = msg.currentCount;
        consortiaInfo.honor = msg.honor;
        consortiaInfo.description = msg.description;
        consortiaInfo.consortiaId = msg.consortiaId;
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaInfoWnd, { info: consortiaInfo });
    }

    private __joinConsortiaHandler(pkg: PackageIn) {
        let msg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        let id: number = msg.applyId;
        if (id) {
            this.controller.getConsortiaInviteInfos();
            let str: string = LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.command02");
            MessageTipManager.Instance.show(str);
        }
    }

    private __refreshApplyList(pkg: PackageIn) {
        let msg = pkg.readBody(SimplePlayerListRspMsg) as SimplePlayerListRspMsg;

        let applyConsortiaList: Array<ThaneInfo> = [];
        let totalPage: number = Math.ceil(msg.totalRows / ConsortiaModel.APPLY_CONSORTIA_PAGE_NUM);
        if (totalPage < this._model.recruitCurrentPage) {
            this._model.recruitListTotalPage = this._model.recruitCurrentPage
        }
        else {
            this._model.recruitListTotalPage = totalPage
        }
        for (let i: number = 0; i < msg.playerInfo.length; i++) {
            applyConsortiaList.push(this.readApplyInfo(msg.playerInfo[i] as SimplePlayerInfoMsg));
        }

        this._model.recruitNum = msg.totalRows;
        this._model.applyConsortiaMap.set(this.model.recruitCurrentPage, applyConsortiaList);
        if (this._model.recruitCurrentPage < totalPage) {
            this._model.recruitCurrentPage++;
        }
        this._model.dispatchEvent(ConsortiaEvent.UPDA_APPLY_CONSORTIA_INFO);
        if (applyConsortiaList.length > 0 && PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID > 0) {
            if (this.controller.getRightsByIndex(ConsortiaDutyInfo.PASSINVITE)) {
                this.dispatchEvent(ConsortiaEvent.APPLY_CONSORTIA_RECEIVE);
            }
        }
    }

    public isRecruitFrameOpen: boolean = false;

    private readApplyInfo(info: SimplePlayerInfoMsg): ThaneInfo {
        let thaneInfo: ThaneInfo = new ThaneInfo();
        thaneInfo.consortiaID = info.consortiaID;
        thaneInfo.nickName = info.nickName;
        thaneInfo.grades = info.grades;
        thaneInfo.templateId = info.job;
        thaneInfo.jewelGrades = info.storeGrade;
        thaneInfo.fightingCapacity = info.fightingCapacity;
        thaneInfo.parameter1 = info.parameter1;
        thaneInfo.job = info.job;
        thaneInfo.frameId = info.frameId;
        if (info.headId) {
            thaneInfo.snsInfo.headId = info.headId;
        }
        return thaneInfo;
    }

    __renameHandler(pkg: PackageIn) {
        var msg: ConsortiaRenameRspMsg = pkg.readBody(ConsortiaRenameRspMsg) as ConsortiaRenameRspMsg;
        if (msg.result) {
        }
        else {
        }
    }

    private __refreshConsortiaInfo(pkg: PackageIn) {
        let info: ConsortiaInfoMsg = pkg.readBody(ConsortiaInfoMsg) as ConsortiaInfoMsg;
        this._model.consortiaInfo.consortiaId = info.consortiaId;
        this._model.consortiaInfo.consortiaName = info.consortiaName;
        this._model.consortiaInfo.creatorID = info.creatorId;
        this._model.consortiaInfo.creatorName = info.creatorName;
        this._model.consortiaInfo.createDate = DateFormatter.parse(info.createDate, "YYYY-MM-DD hh:mm:ss");
        this._model.consortiaInfo.speakTimes = info.speakTimes;
        this._model.demonInfo.state = info.altarState;
        this._model.demonInfo.openDate = DateFormatter.parse(info.altarDate, "YYYY-MM-DD hh:mm:ss");
        this._model.maxMave = info.maxMave;
        if (info.bossInfo) {
            this._model.bossInfo.grade = info.bossInfo.grade;
            this._model.bossInfo.callGrade = info.bossInfo.callGrade;
            this._model.bossInfo.spirit = Number(info.bossInfo.spirit);
            this._model.bossInfo.state = info.bossInfo.state;
            this._model.bossInfo.endTime = info.bossInfo.endTime;
            this._model.bossInfo.totalHp = Number(info.bossInfo.totalHp);
        }
        let id: number = info.chairmanId;
        if (id != this._model.consortiaInfo.chairmanID) {
            let preId: number = this._model.consortiaInfo.chairmanID;
            this._model.consortiaInfo.chairmanID = id;
            if (preId) {
                this.refreshChairman(preId, id);
                this._model.dispatchEvent(ConsortiaEvent.UPDA_CONSORTIA_CHAIRMAN, preId);
            }
        }
        this._model.consortiaInfo.chairmanName = info.chairmanName;
        this._model.consortiaInfo.description = info.description;
        this._model.consortiaInfo.placard = info.placard;
        let levels: number = info.levels;
        if (levels != this._model.consortiaInfo.levels) {
            this._model.consortiaInfo.levels = levels;
            this._model.dispatchEvent(ConsortiaEvent.CONSORTIA_UPGRADE);
        }
        this._model.consortiaInfo.addCount = info.addCount;
        let currentCount: number = info.currentCount;
        if (currentCount != this._model.consortiaInfo.currentCount) {
            let preCount: number = this._model.consortiaInfo.currentCount;
            this._model.consortiaInfo.currentCount = currentCount;
            if (preCount) {
                ConsortiaManager.Instance.getConsortiaUserInfos();
            }
        }
        this._model.consortiaInfo.offer = info.offer;
        this._model.consortiaInfo.consortiaMaterials = info.materials;
        this._model.consortiaInfo.honor = info.honor;
        this._model.consortiaInfo.openApp = info.openApp;
        this._model.consortiaInfo.kickDate = DateFormatter.parse(info.kickDate, "YYYY-MM-DD hh:mm:ss");
        this._model.consortiaInfo.kickCount = info.kickCount;
        this._model.consortiaInfo.fightPower = info.fightPower;
        this._model.consortiaInfo.shopLevel = info.shopLevel;
        this._model.consortiaInfo.storeLevel = info.storeLevel;
        if (this._model.consortiaInfo.altarLevel != info.altarLevel) {
            NotificationManager.Instance.dispatchEvent(ConsortiaEvent.GET_ALTAR_GOODS);
        }
        this._model.consortiaInfo.altarLevel = info.altarLevel;
        this._model.consortiaInfo.schoolLevel = info.schoolLevel;
        this._model.consortiaInfo.attackLevel = info.attackLevel;
        this._model.consortiaInfo.defenceLevel = info.defenceLevel;
        this._model.consortiaInfo.agilityLevel = info.agilityLevel;
        this._model.consortiaInfo.abilityLevel = info.abilityLevel;
        this._model.consortiaInfo.captainLevel = info.captainLevel;
        this._model.consortiaInfo.physiqueLevel = info.physiqueLevel;
        this._model.consortiaInfo.goldLevel = info.goldLevel;
        this._model.consortiaInfo.ownWildlands = info.ownWildlands;
        this._model.consortiaInfo.deductDate = DateFormatter.parse(info.deductDate, "YYYY-MM-DD hh:mm:ss");
        this._model.consortiaInfo.warnDate = DateFormatter.parse(info.warnDate, "YYYY-MM-DD hh:mm:ss");
        this._model.consortiaInfo.codeType = info.codeType;
        this._model.consortiaInfo.codeBeginDate = DateFormatter.parse(info.codeBeginDate, "YYYY-MM-DD hh:mm:ss");
        this._model.consortiaInfo.codeNeedDate = info.codeNeedDate;
        this._model.consortiaInfo.currentDate = DateFormatter.parse(info.currentDate, "YYYY-MM-DD hh:mm:ss");
        this._model.consortiaInfo.isRobot = info.isRobot;
        this._model.consortiaInfo.groupPlacard = info.groupPlacard;
        this._model.consortiaInfo.consortiaSkillTypeDic = this.getConsortiaSkillTypeDic(info);

        //选举信息
        this._model.consortiaInfo.votingDate = DateFormatter.parse(info.votingDate, "YYYY-MM-DD hh:mm:ss");
        this._model.consortiaInfo.votingState = info.votingStatic;
        this._model.consortiaInfo.votingId = info.votingId;

        if (info.isRobot) {
            ConsortiaManager.Instance.addRobot();
        }
        if (info.orderInfo) {
            this._model.consortiaInfo.orderInfo = this.readOrderInfo(info.orderInfo as ConsortiaOrderInfoMsg);
        }
        this._model.updataResearchSkill();
        this._model.dispatchEvent(ConsortiaEvent.UPDA_CONSORTIA_INFO);
    }

    private getConsortiaSkillTypeDic(info: ConsortiaInfoMsg): Dictionary {
        let dic: Dictionary = new Dictionary();
        let item: HiSkillInfoMsg;
        for (let i: number = 0; i < info.hiSkillList.length; i++) {
            item = info.hiSkillList[i] as HiSkillInfoMsg;
            dic.set(item.type, item.level);
        }
        return dic;
    }

    private refreshChairman(preId: number, currentId: number) {
        let preChairman: ThaneInfo = this.getSimplePlayerInfoById(preId);
        if (preChairman) {
            preChairman.beginChanges();
            preChairman.dutyId = ConsortiaDutyLevel.NORMAL;
            preChairman.commit();
        }

        let curChairman: ThaneInfo = this.getSimplePlayerInfoById(currentId);
        if (curChairman) {
            curChairman.beginChanges();
            curChairman.dutyId = ConsortiaDutyLevel.CHAIRMAN;
            curChairman.commit();
        }
        if (preId == this.playerInfo.userId || currentId == this.playerInfo.userId) {
            ConsortiaManager.Instance.setRightsList();
        }
    }


    private readOrderInfo(info: ConsortiaOrderInfoMsg): ConsortiaOrderInfo {
        let cInfo: ConsortiaOrderInfo = new ConsortiaOrderInfo();
        cInfo.consortiaID = info.consortiaId;
        cInfo.gradeOrder = info.gradeOrder;
        cInfo.fightPowerOrder = info.fightPowerOrder;
        cInfo.lastDayOffer = info.lastDayOffer;
        cInfo.lastDayOrder = info.lastDayOrder;
        cInfo.lastWeekOffer = info.lastWeekOffer;
        cInfo.lastWeekOrder = info.lastWeekOrder;
        cInfo.lastDayDate = DateFormatter.parse(info.lastDayDate, "YYYY-MM-DD hh:mm:ss");
        cInfo.lastWeekDate = DateFormatter.parse(info.lastWeekDate, "YYYY-MM-DD hh:mm:ss");
        return cInfo;
    }

    public isFirstRecord: boolean = false;

    private __refreshRecordList(pkg: PackageIn) {
        let msg: ConsortiaUserInviteInfoListRspMsg = pkg.readBody(ConsortiaUserInviteInfoListRspMsg) as ConsortiaUserInviteInfoListRspMsg;
        let inviteList: Array<ConsortiaInviteInfo> = [];
        let applyList: Array<ConsortiaInviteInfo> = [];
        for (let i: number = 0; i < msg.inviteInfo.length; i++) {
            let invite: ConsortiaInviteInfo = new ConsortiaInviteInfo();
            this.readInviteInfo(invite, msg.inviteInfo[i] as ConsortiaUserInviteInfoMsg);
            if (invite.fromType) {
                if (inviteList.length >= 10) {
                    continue;
                }
                inviteList.push(invite);
            }
            else {
                if (applyList.length >= 10) {
                    continue;
                }
                applyList.push(invite);
            }
        }
        this._model.inviteList = inviteList;
        this._model.applyList = applyList;
        if (this._model.inviteList.length >= 1 && this.isFirstRecord) {
            // MainToolBar.Instance.consortiaButtonShine = true;
        }
        if (this._inviteId != 0) {
            // MainToolBar.Instance.consortiaButtonShine = true;
            this.showInvite();
        }
    }

    private showInvite() {
        for (let i = 0, len = this._model.inviteList.length; i < len; i++) {
            const item: ConsortiaInviteInfo = this._model.inviteList[i];
            if (item.id == this._inviteId) {
                let msg: string = LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.msg", item.inviteNickName, item.consortiaName);
                PopFrameCheck.Instance.addAction(new ConsortiaApplyAction(this._inviteId, msg));
            }
        }
        this._inviteId = 0;
    }

    private readInviteInfo(invite: ConsortiaInviteInfo, info: ConsortiaUserInviteInfoMsg) {
        invite.id = info.id;
        invite.consortiaId = info.consortiaId;
        invite.consortiaName = info.consortiaName;
        invite.chairmanName = info.chairmanNickname;
        invite.createDate = DateFormatter.parse(info.createDate, "YYYY-MM-DD hh:mm:ss");
        invite.userId = info.userId;
        invite.userNickName = info.userNickname;
        invite.inviteId = info.inviteId;
        invite.inviteNickName = info.inviteNickname;
        invite.inviteDate = DateFormatter.parse(info.inviteDate, "YYYY-MM-DD hh:mm:ss");
        invite.fromType = info.fromType;
        invite.isExist = info.isexist;
        invite.levels = info.consortiaLevels;
        invite.addCount = info.consortiaCount;
    }

    private _inviteId: number;

    private __consortiaInviteHandler(pkg: PackageIn) {
        let msg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        this._inviteId = msg.applyId;
        this.controller.getConsortiaInviteInfos();
    }

    private __onContributeUpdata() {
        if (this._model.consortiaMemberList.hasOwnProperty(this.playerInfo.userId)) {
            let player: ThaneInfo = this._model.consortiaMemberList[this.playerInfo.userId] as ThaneInfo;
            player.beginChanges();
            player.consortiaOffer = this.playerInfo.consortiaOffer;
            player.consortiaTotalOffer = this.playerInfo.consortiaTotalOffer;
            player.consortiaJianse = this.playerInfo.consortiaJianse;
            player.consortiaTotalJianse = this.playerInfo.consortiaTotalJianse;
            player.commit();
        }
    }

    private __consortiaStageChange(pkg: PackageIn) {
        let msg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        this.playerInfo.consortiaID = msg.consortiaId;
        if (this.playerInfo.consortiaID) {
            this.setup();
            ServerDataManager.cancel(S2CProtocol.U_C_CONSORTIA_INVITE, this, this.__consortiaInviteHandler);
            this._model.dispatchEvent(ConsortiaEvent.IS_CONSORTIA_EXIST, true);
        }
        else {
            if (msg.returnItem) {
                PopFrameCheck.Instance.addAction(new CaseGoodsSendBackByMailAction());
            }
            ServerDataManager.listen(S2CProtocol.U_C_CONSORTIA_INVITE, this, this.__consortiaInviteHandler);
            this._model.consortiaMemberList.clear();
            this._model.baseSkillList.clear();
            this._model.consortiaInfo.placard = "";
            this._model.consortiaInfo.orderInfo = null;
            this._model.secretInfo.clear();
            this._model.demonInfo.clear();
            if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE
                && WorldBossHelper.checkConsortiaSecretLand(CampaignManager.Instance.mapModel.mapId)) {
                SwitchPageHelp.returnToSpace();
            }
            this._model.dispatchEvent(ConsortiaEvent.IS_CONSORTIA_EXIST);
        }
        NotificationManager.Instance.sendNotification(ConsortiaEvent.IS_CONSORTIA_EXIST);
    }

    private __existHandler() {
        if (this._model && this._model.applyList) {
            while (this._model.applyList.length > 0) this._model.applyList.pop();
        }
    }

    public get model(): ConsortiaModel {
        return this._model;
    }

    public set model(value: ConsortiaModel) {
        this._model = value;
    }

    /**
     *  公会职位
     * @return
     *
     */
    public getConsortiaDutyInfos() {
        ConsortiaSocketOutManager.getConsortiaDutyInfos();
    }

    public getConsirtiaInfo() {
        ConsortiaSocketOutManager.getConsortiaInfos();
    }

    private __refreshDutyInfos(pkg: PackageIn) {
        let msg = pkg.readBody(ConsortiaDutyListRspMsg) as ConsortiaDutyListRspMsg;
        for (let i: number = 0; i < msg.dutyInfo.length; i++) {
            let duteInfo: ConsortiaDutyInfo = this.readDutyInfo(msg.dutyInfo[i] as ConsortiaDutyInfoMsg);
            this._model.consortiaDutyList[duteInfo.levels] = duteInfo;
        }
        this.setRightsList();
    }

    /**
     * 更新职位
     * @param pkg
     */
    private __updataDutyInfo(pkg: PackageIn) {
        let msg = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        let uId: number = msg.otherId;
        let dutyId: number = msg.positionId;
        let temp: ThaneInfo = this._model.consortiaMemberList[uId];
        if (temp) {
            if (temp.dutyId != dutyId) {
                temp.beginChanges();
                temp.dutyId = dutyId;
                if (temp.userId == this.playerInfo.userId) {
                    this.setRightsList();
                }
                temp.commit()
            }
        }
    }

    private readDutyInfo(info: ConsortiaDutyInfoMsg): ConsortiaDutyInfo {
        let duteInfo: ConsortiaDutyInfo = new ConsortiaDutyInfo();
        duteInfo.levels = info.levels;
        duteInfo.dutyName = info.dutyName;
        duteInfo.rights.writeArrayBuffer(info.rights);
        return duteInfo;
    }


    /**
     * 设置用户的公会权限
     *
     */
    public setRightsList() {
        let item: ThaneInfo = this.getSimplePlayerInfoById(this.playerInfo.userId);
        if (!item) {
            return;
        }
        if (item.dutyId) {
            let dInfo: ConsortiaDutyInfo = this._model.consortiaDutyList[item.dutyId] as ConsortiaDutyInfo;
            if (!dInfo) {
                return;
            }
            let usrRights: BitArray = new BitArray();
            dInfo.rights.position = 0;
            for (let i: number = 0; i < dInfo.rights.length; i++) {
                usrRights.writeByte(dInfo.rights.readByte());
            }
            this._model.usrRights = usrRights;
        }
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    /**
     * 获取公会成员列表
     *
     */
    public getConsortiaUserInfos() {
        ConsortiaSocketOutManager.getConsortiaUserInfos();
    }

    private membersCache: Array<SimplePlayerListRspMsg> = [];//公会成员分批下行, 临时缓存公会成员信息

    private __updateConsortiaMember(pkg: PackageIn) {
        let msg: SimplePlayerListRspMsg = pkg.readBody(SimplePlayerListRspMsg) as SimplePlayerListRspMsg;

        // if(!msg.hasUuid)
        // {
        //     return;
        // }

        let uuid: string = msg.uuid;
        if (uuid in this.membersCache) {
            let cacheMsg: SimplePlayerListRspMsg = this.membersCache[uuid] as SimplePlayerListRspMsg;
            cacheMsg.playerInfo = msg.playerInfo.concat(cacheMsg.playerInfo);
        }
        else {
            this.membersCache[uuid] = msg;
            this.membersCache.push(msg);
        }

        while (this.membersCache.length > 0) {
            let itemMsg: SimplePlayerListRspMsg = this.membersCache[0] as SimplePlayerListRspMsg;
            if (itemMsg.playerInfo.length != itemMsg.totalRows) {
                break;
            }
            else {
                this.updateConsortiaMember(itemMsg);
                this.membersCache.shift();
                delete this.membersCache[itemMsg.uuid];
            }
        }
    }

    private updateConsortiaMember(msg: SimplePlayerListRspMsg) {
        let tempArr: ThaneInfo[] = [];
        for (let i: number = 0; i < msg.playerInfo.length; i++) {
            let itemMsg: SimplePlayerInfoMsg = msg.playerInfo[i] as SimplePlayerInfoMsg;
            if (!itemMsg) {
                continue;
            }
            let key: string = String(itemMsg.userId);
            let item: ThaneInfo = null;
            if (key in this._model.consortiaMemberList) {
                item = this._model.consortiaMemberList[key];
            }
            if (!item) {
                item = new ThaneInfo();
            }
            this.updataMember(item, itemMsg);

            if (item.nickName != "") {
                tempArr.push(item);
            }
        }
        this.refreshConsortiaMember(tempArr);
        this.setRightsList();
        if (this._model.consortiaInfo && this._model.consortiaInfo.isRobot) {
            this.copyRobotPro();
        }
        this._model.dispatchEvent(ConsortiaEvent.UPDATA_CONSORTIA_MEMBER);
    }

    public addRobot() {
        if (this._model.consortiaMemberList.hasOwnProperty(this._model.consortiaInfo.chairmanID)) {
            return;
        }
        this.copyRobotPro();
        this._model.dispatchEvent(ConsortiaEvent.UPDATA_CONSORTIA_MEMBER);
    }

    private copyRobotPro() {
        let robot: ThaneInfo = new ThaneInfo();
        robot.nickName = this._model.consortiaInfo.chairmanName;
        robot.userId = this._model.consortiaInfo.chairmanID;
        robot.job = 1;
        robot.templateId = 1;
        robot.grades = 12;
        robot.consortiaOffer = 10;
        robot.consortiaTotalOffer = 10;
        robot.consortiaJianse = 10;
        robot.consortiaTotalJianse = 10;
        robot.state = StateType.OFFLINE;
        robot.right = 3;
        robot.logOutTime = new Date(2000);
        robot.dutyId = ConsortiaDutyLevel.CHAIRMAN;
        this._model.consortiaMemberList.add(robot.userId, robot);
    }

    private refreshConsortiaMember(tempArr: ThaneInfo[]) {
        this._model.consortiaMemberList.clear();
        for (let i = 0, len = tempArr.length; i < len; i++) {
            const item = tempArr[i];
            this._model.consortiaMemberList.add(item.userId, item);
        }
    }

    private updataMember(item1: ThaneInfo, item2: SimplePlayerInfoMsg) {
        item1.userId = item2.userId;
        item1.nickName = item2.nickName;
        item1.grades = item2.grades;
        item1.consortiaOffer = item2.consortiaOffer;
        item1.consortiaTotalOffer = item2.consortiaTotalOffer;
        item1.consortiaJianse = item2.consortiaBuild;
        item1.consortiaTotalJianse = item2.consortiaTotalBuild;
        item1.consortiaName = item2.consortiaName;
        item1.fightingCapacity = item2.fightingCapacity;
        item1.sexs = item2.sexs;
        item1.state = item2.state;
        item1.templateId = item2.job;
        item1.job = item2.job;
        item1.role = item2.role;
        item1.isTeamPlayer = item2.isTeamPlayer;
        item1.isInwar = item2.isInwar;
        item1.frameId = item2.frameId;
        if (item2 instanceof ThaneInfo) {
            item1.logOutTime = item2.logOutTime;
        } else {
            item1.logOutTime = DateFormatter.parse(item2.logOutTime, "YYYY-MM-DD hh:mm:ss");
            item1.IsVipAndNoExpirt = item2.isVip;
            item1.vipType = item2.vipType;
            item1.headId = item2.headId;
        }
        item1.dutyId = item2.dutyId;
    }

    public getSimplePlayerInfoById(id: number): ThaneInfo {
        if (this._model.consortiaMemberList.hasOwnProperty(id)) {
            return this._model.consortiaMemberList[id];
        }
        return null;
    }

    public getSimplePlayerInfoByNickname(name: string): ThaneInfo {
        for (const key in this._model.consortiaMemberList) {
            if (Object.prototype.hasOwnProperty.call(this._model.consortiaMemberList, key)) {
                let info = this._model.consortiaMemberList[key];
                if (info.nickName == name) {
                    return info;
                }
            }
        }
        return null;
    }

    private __userLogin(pkg: PackageIn) {
        let info = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        let id: number = info.otherId;
        let sInfo: ThaneInfo = this.getSimplePlayerInfoById(id);
        if (sInfo) {
            sInfo.state = StateType.ONLINE;
            sInfo.dispatchEvent(ConsortiaEvent.UPDE_MEMEBER_STATE);
            NotificationManager.Instance.dispatchEvent(ConsortiaEvent.UPDE_MEMEBER_STATE, id);
        }
    }

    private __userLogout(pkg: PackageIn) {
        let info = pkg.readBody(ConsortiaMsg) as ConsortiaMsg;
        let id: number = info.otherId;
        let sInfo: ThaneInfo = this.getSimplePlayerInfoById(id);
        if (sInfo) {
            sInfo.state = StateType.OFFLINE;
            sInfo.logOutTime = new Date();
            sInfo.dispatchEvent(ConsortiaEvent.UPDE_MEMEBER_STATE);
            NotificationManager.Instance.dispatchEvent(ConsortiaEvent.UPDE_MEMEBER_STATE, id);
        }
    }

    /////////////////////////////////////////////////  公会秘境
    private __consortiaSecretUpdateHandler(pkg: PackageIn) {
        let msg = pkg.readBody(FamInfoMsg) as FamInfoMsg;

        this._model.secretInfo.beginChanges();
        this._model.secretInfo.membersNum = msg.personNum;
        this._model.secretInfo.rate = msg.rate;
        this._model.secretInfo.isReturnedPlayer = msg.isReturnedPlayer;
        this._model.secretInfo.commitChanges();
    }

    private __consortiaTreeUpdateHandler(pkg: PackageIn) {
        let msg = pkg.readBody(FamInfoMsg) as FamInfoMsg;

        this._model.secretInfo.beginChanges();
        this._model.secretInfo.consortiaId = msg.consortiaId;
        this._model.secretInfo.membersNum = msg.personNum;
        this._model.secretInfo.rate = msg.rate;
        this._model.secretInfo.treeGrade = msg.treeGrades;
        this._model.secretInfo.treeGp = msg.treeGp;
        this._model.secretInfo.givePowerCount = msg.treeWaterCount;
        this._model.secretInfo.treeState = msg.treeState;
        this._model.secretInfo.oper = msg.opreate;
        this._model.secretInfo.pickTime = DateFormatter.parse(msg.pickTime, "YYYY-MM-DD hh:mm:ss");
        this._model.secretInfo.commitChanges();

        if (this._model.secretInfo.oper == ConsortiaSecretInfo.Call_STATE)  //召唤神树成功
        {
            let mapId: number = CampaignManager.Instance.mapModel ? CampaignManager.Instance.mapModel.mapId : 0;
            if (WorldBossHelper.checkConsortiaSecretLand(mapId)) {
                return;
            }
            let tipData: TipMessageData = new TipMessageData();
            tipData.type = TipMessageData.CALL_SECRET_TREE;
            tipData.title = LangManager.Instance.GetTranslation("public.prompt");
            tipData.name = LangManager.Instance.GetTranslation("tasktracetip.view.SecretTreeTipView.secret");
            tipData.content = LangManager.Instance.GetTranslation("tasktracetip.view.SecretTreeTipView.content");
            tipData.icon = FUIHelper.getItemURL("Base", "asset.taskTraceTips.TreeIcon");
            tipData.btnTxt = LangManager.Instance.GetTranslation("tasktracetip.view.SecretTreeTipView.text");
            DelayActionsUtils.Instance.addAction(new AlertTipAction(tipData, this.showSecretTip));
        }
    }

    private showSecretTip(tipData: Object) {
        TaskTraceTipManager.Instance.showView(tipData as TipMessageData);
    }

    private __consortiaSecretCallMonsterHandler(pkg: PackageIn) {
        let msg = pkg.readBody(FamLordsInfoMsg) as FamLordsInfoMsg;

        let isOpen: boolean = (!this._model.secretInfo.hasMonsterNow && msg.isOpenLordsNode);
        this._model.secretInfo.beginChanges();
        this._model.secretInfo.canCallMonster = msg.isCanCall;
        this._model.secretInfo.callEndDate = DateFormatter.parse(msg.expairtDate, "YYYY-MM-DD hh:mm:ss");
        this._model.secretInfo.warlordsFinalRank = msg.order;
        this._model.secretInfo.hasMonsterNow = msg.isOpenLordsNode;
        this._model.secretInfo.curBatch = msg.currentTurns;
        this._model.secretInfo.remainMonsterTime = msg.leftTime / 1000;
        this._model.secretInfo.commitChanges();
        if (isOpen) {
            let mapId: number = CampaignManager.Instance.mapModel ? CampaignManager.Instance.mapModel.mapId : 0;
            if (WorldBossHelper.checkConsortiaSecretLand(mapId)) {
                return;
            }
            let tipData: TipMessageData = new TipMessageData();
            tipData.type = TipMessageData.CALL_SECRET_TREE;
            tipData.title = LangManager.Instance.GetTranslation("public.prompt");
            tipData.name = LangManager.Instance.GetTranslation("tasktracetip.view.SecretTreeTipView.warlordsMonster");
            tipData.content = LangManager.Instance.GetTranslation("tasktracetip.view.SecretTreeTipView.monsterAppearContent");
            tipData.icon = FUIHelper.getItemURL("Base", "asset.taskTraceTips.WarlordsIcon");
            tipData.btnTxt = LangManager.Instance.GetTranslation("tasktracetip.view.SecretTreeTipView.killNow");
            DelayActionsUtils.Instance.addAction(new AlertTipAction(tipData, this.showSecretTip.bind(this)));
        }
    }

    //////////////////////////////////////////////  公会魔神祭坛
    private __demonSwitchHandler(pkg: PackageIn) {
        let msg = pkg.readBody(ConsortiaAltarOpenRspMsg) as ConsortiaAltarOpenRspMsg;

        this.model.demonInfo.state = msg.result;
        switch (this.model.demonInfo.state) {
            case 1:  //开启
                this.model.demonInfo.openDate = DateFormatter.parse(msg.altarDate, "YYYY-MM-DD hh:mm:ss");
                let name: string = "<a t='1' id='" + msg.chairmanId + "'" + " name='" + msg.chairmanName + "'" + " consortiaId='" + msg.consortiaId + "'/>";
                let chatData: ChatData = new ChatData();
                chatData.channel = ChatChannel.CONSORTIA;
                chatData.msg = LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.demonOpenTip", name);
                chatData.commit();
                NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
                NotificationManager.Instance.sendNotification(ChatEvent.CHAT_FROM_CONSORTIA, chatData);
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.demonOpenTip", msg.chairmanName));
                break;
        }
        if (msg.pop)  //祭坛开启右下角弹窗提示
        {
            DelayActionsUtils.Instance.addAction(new AlertTipAction(null, this.showDemonOpenTip.bind(this)));
        }
        this.dispatchEvent(ConsortiaEvent.DEMON_SWITCH);
    }

    private showDemonOpenTip(result: Object) {
        let mapId: number = CampaignManager.Instance.mapModel ? CampaignManager.Instance.mapModel.mapId : 0;
        if (WorldBossHelper.checkConsortiaDemon(mapId)) {
            return;
        }
        let tip: TipMessageData = new TipMessageData();
        tip.title = LangManager.Instance.GetTranslation("public.prompt");
        tip.type = TipMessageData.DEMON_OPEN;
        TaskTraceTipManager.Instance.showView(tip);
    }

    private __demonReportHandler(pkg: PackageIn) {
        let msg = pkg.readBody(AltarCampaignReportMsg) as AltarCampaignReportMsg;

        let woundList: SimpleDictionary = new SimpleDictionary();
        let participantList: SimpleDictionary = this.model.demonInfo.participantList;
        let wInfo: WoundInfo;
        this.model.demonInfo.beginChanges();
        this.model.demonInfo.readyDownTime = Number(msg.leftStartTime / 1000);
        this.model.demonInfo.durability = msg.altarDurability;
        this.model.demonInfo.waveNum = msg.waveNum;
        this.model.demonInfo.monsterNum = msg.monsterCount;
        this.model.demonInfo.curBuffType = msg.buffType;
        this.model.demonInfo.gotBuffType = msg.userBuffType;
        participantList.clear();
        for (let i = 0, len = msg.hurtOrder.length; i < len; i++) {
            const hurtMsg: HurtOrderMsg = msg.hurtOrder[i] as HurtOrderMsg;
            if (hurtMsg.userId == this.thane.userId) {
                this.model.demonInfo.selfWound = hurtMsg.hurt;
            }
            wInfo = this.model.demonInfo.getWoundInfo(hurtMsg.userId);
            if (!wInfo) {
                wInfo = new WoundInfo();
            }
            wInfo.userId = hurtMsg.userId;
            wInfo.wound = hurtMsg.hurt;
            wInfo.isJoining = hurtMsg.isInAltar;
            woundList.add(wInfo.userId, wInfo);
            if (wInfo.isJoining) {
                participantList.add(wInfo.userId, wInfo);
            }
        }
        for (let i = 0, len = msg.skill.length; i < len; i++) {
            const skillMsg: AltarCampaignSkillMsg = msg.skill[i] as AltarCampaignSkillMsg;
            this.model.demonInfo.updateSkillInfo(skillMsg, false);
        }
        this.model.demonInfo.playerNum = participantList.getList().length;
        this.model.demonInfo.woundList = woundList;  //此处采取直接覆盖dic的做法是为了减少WoundInfo对象的创建
        this.model.demonInfo.commitChanges();
    }

    private __demonEndHandler(pkg: PackageIn) {
        let rtnScene: string = SwitchPageHelp.returnScene;
        SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, rtnScene, this.demonEndCall.bind(this));
    }

    private demonEndCall(pkg: PackageIn) {
        let msg = pkg.readBody(PropertyMsg) as PropertyMsg;

        ConsortiaManager.Instance.model.demonInfo.state = msg.param3;
        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.BaseManager.consortiaDemonEndTip1", msg.param2));
        let tip: string;
        if (msg.param1 <= 0) {
            tip = LangManager.Instance.GetTranslation("yishi.manager.BaseManager.consortiaDemonEndTip4");
        }
        else {
            tip = (msg.param1 > 3 ? LangManager.Instance.GetTranslation("yishi.manager.BaseManager.consortiaDemonEndTip3", msg.param1) : LangManager.Instance.GetTranslation("yishi.manager.BaseManager.consortiaDemonEndTip2", msg.param1));
        }
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, LangManager.Instance.GetTranslation("public.prompt"),
            tip, LangManager.Instance.GetTranslation("public.confirm"), "")
    }

    private __demonSkillUsedHandler(pkg: PackageIn) {
        let msg = pkg.readBody(AltarCampaignSkillMsg) as AltarCampaignSkillMsg;

        this.model.demonInfo.updateSkillInfo(msg, true);
        let name: string = "<a t='1' id='" + msg.userId + "'" + " name='" + msg.nickName + "'" + " consortiaId='" + msg.consortiaId + "'/>";
        switch (msg.templateId) {
            case 1:
                this.addChatData(LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.demonSkillContent01", name));
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.demonSkillContent01", msg.nickName));
                break;
            case 2:
                this.addChatData(LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.demonSkillContent02", name));
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("yishi.manager.ConsortiaManager.demonSkillContent02", msg.nickName));
                break;
        }
    }

    /**
     * 
     * @param pkg 
     */
    private __task(pkg: PackageIn) {
        let msg = pkg.readBody(AllTaskInfoMsg) as AllTaskInfoMsg;
        Logger.info("[ConsortiaManager]公会任务更新", msg)

        let updateAll = msg.update == 1
        let updateTask = msg.update == 2
        let updateRecord = msg.update == 3
        let updateNone = msg.update == 4

        // msg.score = 40000
        this._model.taskWeekScore = msg.score
        this._model.refreshScoreRewardReachStatus(msg.score)
        if (msg.update != 3) {
            Logger.info("[ConsortiaManager]更新rewardStatus")
            this._model.refreshScoreRewardRecevieStatus(msg.rewardStatus)
        }
        this._model.dispatchEvent(ConsortiaEvent.TASK_WEEK_REWARD)

        if (updateAll || updateTask) {
            let taskMsg = msg.oneTask
            let taskInfo = this._model.taskInfo
            taskInfo.taskId = taskMsg.taskId

            if (!taskInfo.taskTemplete) return Logger.info("[ConsortiaManager]公会任务配置还未加载");

            taskInfo.status = taskMsg.status
            taskInfo.progNum = taskMsg.process
            taskInfo.starNum = taskMsg.starNum
            this._model.taskRefreshNum = taskMsg.refreshNum
            this._model.taskRefreshTime = taskMsg.refreshTime

            let type = taskInfo.taskTemplete.Type
            taskInfo.taskTitle = this._model.getTaskTitleByType(type)
            taskInfo.taskContent = this._model.getTaskContent(taskMsg.taskId, taskMsg.starNum)

            taskInfo.guildRewardInfoList = []
            let guildRewardArr = taskMsg.fixId.split(",")
            for (let i: number = 0; i < guildRewardArr.length; i++) {
                let rewardId = guildRewardArr[i]
                let rewardCfg = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_consortiataskreward, rewardId) as t_s_consortiataskrewardData
                let itemId = rewardCfg.RewardItemId
                let itemNum = rewardCfg["RewardNumStar" + taskInfo.starNum]
                let info = new GoodsInfo()
                info.templateId = itemId
                info.count = itemNum
                taskInfo.guildRewardInfoList.push(info)
            }

            taskInfo.selfRewardInfoList = []
            let selfRewardArr = taskMsg.rewardId.split(",")
            for (let i: number = 0; i < selfRewardArr.length; i++) {
                let rewardId = selfRewardArr[i]
                let rewardCfg = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_consortiataskreward, rewardId) as t_s_consortiataskrewardData
                let itemId = rewardCfg.RewardItemId
                let itemNum = rewardCfg["RewardNumStar" + taskInfo.starNum]
                let info = new GoodsInfo()
                info.templateId = itemId
                info.count = itemNum
                taskInfo.selfRewardInfoList.push(info)
            }

            this._model.dispatchEvent(ConsortiaEvent.TASK_INFO)
        }

        if (updateAll || updateRecord) {
            this._model.taskFinishNum = msg.finishNum
            this._model.taskRecordList = []

            msg.recoredInfo = ArrayUtils.sortOn(msg.recoredInfo, ["time"], [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING])

            for (let index = 0; index < msg.recoredInfo.length; index++) {
                const element = msg.recoredInfo[index]
                let starColor = GoodsProfile.getGoodsProfileColor(element.starNum)
                let content = LangManager.Instance.GetTranslation("ConsortiaTaskWnd.record", element.nickName, element.starNum, starColor, element.score)
                this._model.taskRecordList.push(content)
            }
            this._model.dispatchEvent(ConsortiaEvent.TASK_RECORD)
        }


        NotificationManager.Instance.dispatchEvent(ConsortiaEvent.TASK_INFO);
    }

    private __duraChangeHandler() {
        if (this._model.demonInfo.durability < 100) {
            this.addChatData(LangManager.Instance.GetTranslation("map.campaign.view.ui.demon.ConsortiaDemonWoundView.altarDuraTip", this._model.demonInfo.durability + "/" + ConsortiaDemonInfo.MAX_ALTAR_DURA));
        }
    }

    private __waveChangeHandler() {
        if (this._model.demonInfo.waveNum > 0 && this._model.demonInfo.readyDownTime <= 0) {
            this.addChatData(LangManager.Instance.GetTranslation("map.campaign.view.ui.demon.ConsortiaDemonWoundView.altarWaveTip", this._model.demonInfo.waveNum));
        }
    }


    private addChatData(content: string) {
        let chatData: ChatData = new ChatData();
        chatData.channel = ChatChannel.CONSORTIA;
        chatData.msg = content;
        chatData.commit();
        NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
        NotificationManager.Instance.sendNotification(ChatEvent.CHAT_FROM_CONSORTIA, chatData);
    }
}