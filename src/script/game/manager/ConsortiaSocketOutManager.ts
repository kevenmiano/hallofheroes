import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { PlayerManager } from "./PlayerManager";
import LangManager from "../../core/lang/LangManager";
import SceneType from "../map/scene/SceneType";
import { SceneManager } from "../map/scene/SceneManager";
import { MessageTipManager } from "./MessageTipManager";
import { ConsortiaManager } from "./ConsortiaManager";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "./ArmyManager";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";
import { ConsortiaControler } from "../module/consortia/control/ConsortiaControler";
import ConsortiaLinkReqMsg = com.road.yishi.proto.consortia.ConsortiaLinkReqMsg;
import ConsortiaMsg = com.road.yishi.proto.consortia.ConsortiaMsg;
import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import ConsortiaOfferReqMsg = com.road.yishi.proto.consortia.ConsortiaOfferReqMsg;
import SearchConditionMsg = com.road.yishi.proto.consortia.SearchConditionMsg;
import ConsortiaAltarOpenReqMsg = com.road.yishi.proto.consortia.ConsortiaAltarOpenReqMsg;
import ConsortiaTreasureBoxMsg = com.road.yishi.proto.consortia.ConsortiaTreasureBoxMsg;
import ConsortiaMembersInfoMsg = com.road.yishi.proto.consortia.ConsortiaMembersInfoMsg;
import TaskRewardReqMsg = com.road.yishi.proto.consortia.TaskRewardReqMsg;
import TaskUpdateReqMsg = com.road.yishi.proto.consortia.TaskUpdateReqMsg;
import { PayType } from "../constant/Const";

/**
 *公会的相关操作与服务器socket的交互
 * @author yuanzhan.yu
 */
export class ConsortiaSocketOutManager {
    constructor() {
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }


    /**
     * 获取公会信息
     * @param $id
     * @param $consortiaId
     *
     */
    public static consortiaLink($id: number) {
        let msg: ConsortiaLinkReqMsg = new ConsortiaLinkReqMsg();
        msg.consortiaId = $id;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_LINK, msg);
    }


    /**
     * 操作公会申请
     * @param $id
     * @param $flag true为通过, false为拒绝
     *
     */
    public static operateConsortiaApply($id: number, $flag: boolean) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.applyId = $id;
        msg.result = $flag;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_USERPASS, msg);
    }

    /**
     * 创建公会
     * @param $name  输入的公会名
     * @param isPay  未满24小时的支付
     */
    public static creatConsortia($name: string, isPay: boolean) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.consortiaName = $name;
        msg.isPay = isPay;
        PlayerManager.Instance.currentPlayerModel.createConsortiaFlag = true;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_CREATE, msg);
    }

    /**
     * 修改公会简介
     * @param $str 输入的公会简介
     *
     */
    public static modifyConsortiaDiscription($str: string) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.description = $str;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_MODIFYDESC, msg);
    }

    /**
     * 修改公会公告
     * @param $str
     *
     */
    public static modifyConsortiaPlacard($str: string) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.placard = $str;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_MODIFYBBS, msg);
    }

    /**
     * 修改公会群公告
     * @param $str  修改的群公告内容
     *
     */
    public static sendModifyGroupPlacard($str: string) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.groupPlacard = $str;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_GROUP_PLACARD, msg);
    }

    /**
     * 公会升级
     * @param $type
     * @param $level
     *
     */
    public static consortiaUpgrade($type: number) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.upgradeType = $type;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_LEVEL, msg);
    }

    /**
     * 公会转让
     * @param $type
     *
     */
    public static consortiaTransfer($otherId: number) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.otherId = $otherId;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_CHANGE, msg);
    }

    /**
     * 公会加速冷却
     */
    public static sendQuickTime(useBind: boolean) {
        let msg: PayTypeMsg = new PayTypeMsg();
        msg.payType = 0;
        if (!useBind) {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_QUICK, msg);
    }

    /**
     * 公会通过用户申请
     * @param $id 申请编号
     * @param $flag false是拒绝, true是通过
     *
     */
    public static consortiaAcceptOrRejectApply($id: number, $flag: boolean) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.applyId = $id;
        msg.result = $flag;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_PASS, msg);
    }

    /**
     * 公会祭坛祈福
     *
     */
    public static consortiaAltarBless(type:number,count:number = 1) {
        let msg: PropertyMsg = new PropertyMsg();
        msg.param1 = count;
        msg.param2 = type;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_FRESHALTAR, msg);
    }

    /**
     * 公会技能学习
     * @param $type 公会模板类型
     *
     */
    public static consortiaStudy($type: number) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.studySkill = $type;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_LEARN, msg);
    }

    /**
     * 公会职位调整
     * @param dutyId
     * @param otherUserId
     *
     */
    public static changeDuty(dutyId: number, otherUserId: number) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.positionId = dutyId;
        msg.otherId = otherUserId;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_DUTYUPDATE, msg);
    }

    /**
     * 删除公会成员
     * @param otherUserId
     *
     */
    public static fireMember(otherUserId: number) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.otherId = otherUserId;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_DELUSER, msg);
    }

    /**
     * 公会邀请用户
     * @param $id 被邀请用户ID
     *
     */
    public static consortiaInvitePlayer($id: number) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.otherId = $id;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_INVITE, msg);
    }

    /**
     * 公会开放申请
     * @param isOpen
     *
     */
    public static ifOpenApply(isOpen: boolean) {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.result = isOpen;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_OPENAPP, msg);
    }

    /**
     * 公会自动申请  （机器人邀请）
     */
    public static autoInvite() {
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_ROBOTJOIN, null);
    }

    /**
     * 获取公会成员列表
     */
    public static getConsortiaUserInfos() {
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIAUSER_LIST, null);
    }

    /**
     * 公会捐献
     * @param pageIndex 捐献页面
     * @param  isHistory  是否是历史捐献
     */
    public static getConsortiaOffer(pageIndex: number, isHistory: boolean) {
        let msg: ConsortiaOfferReqMsg = new ConsortiaOfferReqMsg();
        msg.pageIndex = pageIndex;
        msg.isHistory = isHistory;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_OFFER_LIST, msg);
    }

    public static getConsortiaInviteInfos() {
        SocketManager.Instance.send(C2SProtocol.U_C_INVITEINFO_LIST, null);
    }

    public static getConsortiaEventInfos() {
        SocketManager.Instance.send(C2SProtocol.U_C_EVENT_LIST, null);
    }

    public static getConsortiaDutyInfos() {
        SocketManager.Instance.send(C2SProtocol.U_C_DUTY_LIST, null);
    }

    public static getConsortiaInfos() {
        let msg: ConsortiaMsg = new ConsortiaMsg();
        msg.consortiaId = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_INFO, msg);
    }

    public static getConsortiaApplyInfos(index: number) {
        let msg: SearchConditionMsg = new SearchConditionMsg();
        msg.pageIndex = index;
        msg.isNewOpen = true;
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_INVITE_LIST, msg);
    }

    /**
     * 获取公会祈福信息
     */
    public static getConsortiaPrayInfo() {
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_ALTERINFO, null);
    }

    public static getConsortiaSite() {
        SocketManager.Instance.send(C2SProtocol.U_C_CONSORTIA_SITE, null);
    }

    public static refreshPrayCount(type:number) {
        let msg: PropertyMsg = new PropertyMsg();
        msg.param1 = type;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_ADDFRESH, msg);
    }

    /**
     *获取候选人列表
     *
     */
    public static getVotingUserInfos() {
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_VOTING_LIST, null);
    }


    private static _intervalTime: number = 0;

    /**
     * 进入公会秘境
     */
    public static sendEnterSecretLand() {
        if (Laya.Browser.now() - this._intervalTime < 5000) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return;
        }
        this._intervalTime = Laya.Browser.now();
        if (SceneManager.Instance.currentType == SceneType.WARLORDS_ROOM) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command03"));
            return;
        }
        SocketManager.Instance.send(C2SProtocol.C_ENTER_CONSORTIA_FAM, null);
    }

    /**
     * 召唤秘境神树
     */
    public static sendCallSecretTree() {
        SocketManager.Instance.send(C2SProtocol.C_CALL_TREE, null);
    }

    /**
     * 获取秘境Buff
     */
    public static sendGetSecretBuff() {
        SocketManager.Instance.send(C2SProtocol.C_FAM_BUFFER, null);
    }

    /**
     * 召唤公会秘境盗宝者
     */
    public static sendCallSecretMonster() {
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIAFARM_OPEN_LORDSNODE, null);
    }

    /////////////////////////////////////////////////////////////  魔神祭坛
    /**
     * 进入公会魔神祭坛
     */
    public static sendEnterDemon() {
        if (Laya.Browser.now() - this._intervalTime < 5000) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return;
        }
        this._intervalTime = Laya.Browser.now();
        if (SceneManager.Instance.currentType == SceneType.WARLORDS_ROOM) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command03"));
            return;
        }
        if ((FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler).model.demonInfo.state == 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("consortia.data.ConsortiaDemonInfo.unopenTip"));
            return;
        }
        SocketManager.Instance.send(C2SProtocol.C_ENTER_CONSORTIA_ALTAR, null);
    }

    /**
     * 发送购买祭坛buff
     */
    public static sendGetDemonBuff() {
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_ALTAR_GETBUFF, null);
    }

    /**
     * 发送魔神祭坛技能使用
     */
    public static sendUseDemonSkill(skillId: number) {
        let msg: ConsortiaAltarOpenReqMsg = new ConsortiaAltarOpenReqMsg();
        msg.altarType = skillId;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_ALTAR_BUY_SCENE, msg);
    }


    /////////////////////////////////////////////////////////////  公会宝箱
    /**
     * 查看公会宝箱信息
     */
    public static consortiaPrizeCheck() {
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_BOX_CHECK, null);
    }

    /**
     * 打开公会宝箱分配框
     */
    public static consortiaPrizeAllot($templateId: number) {
        let msg: ConsortiaTreasureBoxMsg = new ConsortiaTreasureBoxMsg();
        msg.templateId = $templateId;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_BOX_SEND_INFO, msg);
    }

    /**
     * 宝箱分配确认框
     */
    public static consortiaPrizeAllotConfirm($templateId: number, $infos: any[]) {
        let msg: ConsortiaTreasureBoxMsg = new ConsortiaTreasureBoxMsg();
        for (let i: number = 0; i < $infos.length; i++) {
            let info: ConsortiaMembersInfoMsg = new ConsortiaMembersInfoMsg();
            info.userId = $infos[i].userId;
            info.count = $infos[i].count;
            msg.playerInfo.push(info);
        }
        msg.consortiaId = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID;
        msg.chairmanId = ConsortiaManager.Instance.model.consortiaInfo.chairmanID;
        msg.templateId = $templateId;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_BOX_SEND_CONFIRM, msg);
    }

    /**
     * 进入公会boss副本 
     */
    public static enterConsortiaBoss() {
        var msg: ConsortiaMsg = new ConsortiaMsg();
        msg.upgradeType = 2;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_BOSS_CALL, msg);
    }

    /**
     * 召唤公会boss
     */
    public static callConsortiaBoss(level: number) {
        var msg: ConsortiaMsg = new ConsortiaMsg();
        msg.upgradeType = 1;
        msg.otherId = level;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_BOSS_CALL, msg);
    }

    /**
     * 升级公会boss
     */
    public static upgradeConsortiaBoss() {
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_BOSS_UPGRADE);
    }

    /**
     * 请求公会任务
     */
    static sendReqTaskInfo() {
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_TASK_INFO);
    }
    /**
     * 刷新任务
     */
    static sendRefreshTask() {
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_TASK_REFRESH);
    }

    /**
     * 完成任务 领取奖励
     */
    static sendFinishTask() {
        var msg: TaskRewardReqMsg = new TaskRewardReqMsg();
        msg.op = 1;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_TASK_REWARD, msg);
    }

    /**
     * 领取周积分奖励
     */
    static sendGetWeekScoreReward(index: number) {
        var msg: TaskRewardReqMsg = new TaskRewardReqMsg();
        msg.op = 2;
        msg.index = index;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_TASK_REWARD, msg);
    }

    /**
     * 任务升星
     */
    static sendUpgradeTaskStar(payType: PayType) {
        var msg: TaskUpdateReqMsg = new TaskUpdateReqMsg();
        msg.payType = payType;
        SocketManager.Instance.send(C2SProtocol.C_CONSORTIA_TASK_UPGRADESTAR);
    }
}