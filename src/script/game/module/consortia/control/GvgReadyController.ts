// @ts-nocheck
import { PackageIn } from "../../../../core/net/PackageIn";
import { SocketManager } from "../../../../core/net/SocketManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { Disposeable } from "../../../component/DisplayObject";
import { GvgEvent, SLGSocketEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { GuildChallengeInfo } from "../data/gvg/GuildChallengeInfo";
import { GuildGroupInfo } from "../data/gvg/GuildGroupInfo";
import { GuildOrderInfo } from "../data/gvg/GuildOrderInfo";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { GvgModel } from "../model/GvgModel";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import LangManager from "../../../../core/lang/LangManager";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import TeamEditMsg = com.road.yishi.proto.guildcampaign.TeamEditMsg;
import GuildChallengeOrderListMsg = com.road.yishi.proto.guildcampaign.GuildChallengeOrderListMsg;
import GuildGroupListMsg = com.road.yishi.proto.guildcampaign.GuildGroupListMsg;
import GuildMsg = com.road.yishi.proto.guildcampaign.GuildMsg;
import ChallengeGuildMsg = com.road.yishi.proto.guildcampaign.ChallengeGuildMsg;
import GuildGroupMsg = com.road.yishi.proto.guildcampaign.GuildGroupMsg;
import GuildChallengeInfoMsg = com.road.yishi.proto.guildcampaign.GuildChallengeInfoMsg;
import GuildOrderInfoMsg = com.road.yishi.proto.guildcampaign.GuildOrderInfoMsg;

/**
 * @description 公会战准备 相关操作
 * @author yuanzhan.yu
 * @date 2021/10/19 17:29
 * @ver 1.0
 */
export class GvgReadyController extends FrameCtrlBase implements Disposeable {
    private _model: GvgModel;
    private _consortiaModel: ConsortiaModel;

    constructor() {
        super();

        this._model = new GvgModel();
        this._consortiaModel = ConsortiaManager.Instance.model;
        this._model.guildName = this._consortiaModel.consortiaInfo.consortiaName;
        this._model.guildGrade = this._consortiaModel.consortiaInfo.levels;
        this._model.guildOffer = this._consortiaModel.consortiaInfo.offer;
        this._model.guildOrder = this._consortiaModel.consortiaInfo.orderInfo ? this._consortiaModel.consortiaInfo.orderInfo.gradeOrder : 0;
    }

    protected addEventListener() {
        super.addEventListener()
        this._model.addEventListener(GvgEvent.GUILD_CHALLENGE_LIST, this.__guildChallengeHandler, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existHandler, this);
        ServerDataManager.listen(S2CProtocol.U_C_REQUEST_GUILDLIST, this, this.__guildListHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SEND_NEEDOFFER, this, this.__needOfferHandler);
        ServerDataManager.listen(S2CProtocol.U_C_REQUEST_GUILDCHALLENGE, this, this.__guildChallengeHanlder);
        ServerDataManager.listen(S2CProtocol.U_C_GUILDWAR_TEAM, this, this.__guildWarTeamHandler);
        ServerDataManager.listen(S2CProtocol.U_C_GUILDLAST_WEEK_ORDER, this, this.__getGuildWarOrderHandler);
    }

    public get model(): GvgModel {
        return this._model;
    }

    /**
     * 公会战参与人员
     * @param userId  玩家Id
     * @param type  0退出, 1,加入, 2, 管理员设置
     * @param param1  1管理员, 0非管理员
     *
     */
    public sendGvgTeamEdit(userId: number, type: number, param1: number): void {
        let msg: TeamEditMsg = new TeamEditMsg();
        msg.op = type;
        msg.userId = userId;
        msg.param1 = param1;
        SocketManager.Instance.send(C2SProtocol.C_GUILDTEAM_PLAYER_EDIT, msg);
    }

    /**
     *请求公会列表
     *
     */
    public questGuildList(): void {
        SocketManager.Instance.send(C2SProtocol.C_REQUEST_GUILDLIST);
    }

    /**
     *请求工会战排名列表
     *
     */
    public requestGuildChallenge(): void {
        SocketManager.Instance.send(C2SProtocol.C_REQUEST_GUILDCHALLENGE);
    }

    private __existHandler(evt: Event): void {
        if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0) {
            this.exitConsortia();
        }
    }

    private __guildChallengeHandler(evt: GvgEvent): void {
    }

    /**
     *公会战分组
     *
     */
    public requestGuildGroup(): void {
        SocketManager.Instance.send(C2SProtocol.C_GUILD_GROUP);
    }

    /**
     * 购买公会战buffer
     * @param templateId  GvgWarBufferInfo.templateId
     *
     */
    public payGvgBuffer(templateId: number): void {
        let msg: GuildMsg = new GuildMsg();
        msg.param1 = templateId;
        SocketManager.Instance.send(C2SProtocol.C_GUILD_BUYBUFFER, msg);
    }

    private _intervalTime: number = 0;

    /**
     *进入公会战地图
     *
     */
    public enterGvgWarMap(): void {
        if (new Date().getTime() - this._intervalTime < 5000) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return;
        }
        this._intervalTime = new Date().getTime();
        if (SceneManager.Instance.currentType == SceneType.WARLORDS_ROOM) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command03"));
            return;
        }
        SocketManager.Instance.send(C2SProtocol.C_ENTER_GUILDCAMPAIGN);
    }

    private __needOfferHandler(evt: SLGSocketEvent): void {
        let msg: ChallengeGuildMsg = new ChallengeGuildMsg();


    }

    private __guildWarTeamHandler(pkg: PackageIn): void {
        let msg: GuildGroupListMsg = pkg.readBody(GuildGroupListMsg) as GuildGroupListMsg;
        let arr: any[] = [];
        for (let i = 0, len = msg.group.length; i < len; i++) {
            const g: GuildGroupMsg = msg.group[i] as GuildGroupMsg;
            let gInfo: GuildGroupInfo = new GuildGroupInfo();
            gInfo.consortiaId = g.consortiaId;
            gInfo.consortiaName = g.consortiaName;
            gInfo.group1 = g.group1;
            gInfo.group2 = g.group2;
            gInfo.group3 = g.group3;
            gInfo.result1 = g.result1;
            gInfo.result2 = g.result2;
            gInfo.result3 = g.result3;
            gInfo.fightPower = g.fightPower;
            gInfo.commit();
            arr.push(gInfo);
        }
        this._model.guildGroup = arr;
    }

    private __getGuildWarOrderHandler(pkg: PackageIn): void {
        let msg: GuildGroupListMsg = pkg.readBody(GuildGroupListMsg) as GuildGroupListMsg;
        let arr: any[] = [];
        for (let i = 0, len = msg.group.length; i < len; i++) {
            const g: GuildGroupMsg = msg.group[i] as GuildGroupMsg;
            let gInfo: GuildGroupInfo = new GuildGroupInfo();
            gInfo.consortiaId = g.consortiaId;
            gInfo.consortiaName = g.consortiaName;
            gInfo.order = g.order;
            gInfo.group1 = g.group1;
            gInfo.group2 = g.group2;
            gInfo.group3 = g.group3;
            gInfo.result1 = g.result1;
            gInfo.result2 = g.result2;
            gInfo.result3 = g.result3;
            gInfo.fightPower = g.fightPower;
            gInfo.commit();
            arr.push(gInfo);
        }
        arr = ArrayUtils.sortOn(arr, "order", ArrayConstant.NUMERIC);
        this._model.guildOrderDate = DateFormatter.parse(msg.orderTime, "YYYY-MM-DD hh:mm:ss");
        this._model.guildOrderGroup = arr;
    }

    private __guildChallengeHanlder(pkg: PackageIn): void {
        let msg: GuildChallengeOrderListMsg = pkg.readBody(GuildChallengeOrderListMsg) as GuildChallengeOrderListMsg;

        let challenges: any[] = [];
        for (let i = 0, len = msg.challenge.length; i < len; i++) {
            const chInfo: GuildChallengeInfoMsg = msg.challenge[i] as GuildChallengeInfoMsg;
            let gcInfo: GuildChallengeInfo = new GuildChallengeInfo();
            gcInfo.attackGuildId = chInfo.attackGuildId;
            gcInfo.attackName = chInfo.attackName;
            gcInfo.defencGuildId = chInfo.defencGuildId;
            gcInfo.defencName = chInfo.defencName;
            gcInfo.endTime = chInfo.endTime;
            gcInfo.isExist = chInfo.isExist;
            gcInfo.startTime = chInfo.startTime;
            challenges.push(gcInfo);
        }
        this._model.guildFightPower = msg.guildFighPower;
        this._model.guildGrade = msg.guildGrade;
        this._model.guildName = msg.guildName;
        this._model.guildOffer = msg.guildOffer;
        this._model.guildOrder = msg.guildOrder;
        this._model.currentGuildChallengeList = challenges;
    }

    private __guildListHandler(pkg: PackageIn): void {
        let msg: GuildChallengeOrderListMsg = pkg.readBody(GuildChallengeOrderListMsg) as GuildChallengeOrderListMsg;
        let arr: any[] = [];
        for (let i = 0, len = msg.info.length; i < len; i++) {
            const cInfo: GuildOrderInfoMsg = msg.info[i] as GuildOrderInfoMsg;
            let gInfo: GuildOrderInfo = new GuildOrderInfo();
            gInfo.chairmanName = cInfo.chairmanName;
            gInfo.count = cInfo.count;
            gInfo.id = cInfo.id;
            gInfo.name = cInfo.name;
            gInfo.order = cInfo.order;
            gInfo.power = cInfo.power;
            arr.push(gInfo);
        }
        this._model.currentGuildOrderList = arr;
    }

    private _gvgMemberManager: BaseWindow;

    private _gvgMemberManagerII: BaseWindow;
    private _rankListFrame: BaseWindow;

    public openGvgMemberManager(): void {
        UIManager.Instance.ShowWind(EmWindow.GvgEnterWarWnd);
    }

    public openGvgMemberManagerII(): void {
        UIManager.Instance.ShowWind(EmWindow.GvgAddMembersWnd);
    }

    private exitConsortia(): void {
        // this.dispose();
    }

    private _isDie: boolean = false;

    public get isDie(): boolean {
        return this._isDie;
    }

    protected delEventListener() {
        super.delEventListener();
        this._model.removeEventListener(GvgEvent.GUILD_CHALLENGE_LIST, this.__guildChallengeHandler, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existHandler, this);
        ServerDataManager.cancel(S2CProtocol.U_C_REQUEST_GUILDLIST, this, this.__guildListHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_SEND_NEEDOFFER, this, this.__needOfferHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_REQUEST_GUILDCHALLENGE, this, this.__guildChallengeHanlder);
        ServerDataManager.cancel(S2CProtocol.U_C_GUILDWAR_TEAM, this, this.__guildWarTeamHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_GUILDLAST_WEEK_ORDER, this, this.__getGuildWarOrderHandler);
    }

    public dispose(): void {
        // if(this._isDie)
        // {
        //     return;
        // }
        // this._isDie = true;
        // if(this._rankListFrame)
        // {
        //     this._rankListFrame['dispose']();
        // }
        // this._rankListFrame = null;
        // if(this._gvgMemberManager)
        // {
        //     this._gvgMemberManager['dispose']();
        // }
        // this._gvgMemberManager = null;
        // if(this._gvgMemberManagerII)
        // {
        //     this._gvgMemberManagerII['dispose']();
        // }
        // this._gvgMemberManagerII = null;
        // this._model = null;
        // if(PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID > 0)
        // {
        //     this._consortiaModel = null;
        // }
    }
}