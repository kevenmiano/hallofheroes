// @ts-nocheck
import { PackageOut } from "../../core/net/PackageOut";
import { SocketManager } from "../../core/net/SocketManager";
import { BattleManager } from "../battle/BattleManager";
import { BattleModel } from "../battle/BattleModel";
import { BattleType, RoleType } from "../constant/BattleDefine";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { RoomType } from "../constant/RoomDefine";
import { ChatChannel } from "../datas/ChatChannel";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { CampaignArmy } from "../map/campaign/data/CampaignArmy";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { BaseArmy } from "../map/space/data/BaseArmy";
import ChatData from "../module/chat/data/ChatData";
import { CampaignMapModel } from "../mvc/model/CampaignMapModel";
import { RoomInfo } from "../mvc/model/room/RoomInfo";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import { ArmyManager } from "./ArmyManager";
import { CampaignManager } from "./CampaignManager";
import { ChatManager } from "./ChatManager";
import FreedomTeamManager from "./FreedomTeamManager";
import { PlayerManager } from "./PlayerManager";
import { RoomManager } from "./RoomManager";


import CampaignReqMsg = com.road.yishi.proto.campaign.CampaignReqMsg;
import ChatChannelMsg = com.road.yishi.proto.chat.ChatChannelMsg;
import CrossBigBugleMsg = com.road.yishi.proto.cross.CrossBigBugleMsg;
/**
 * 
 * 聊天相关的协议发送
 * 
 */
export default class ChatSocketOutManager {


    public static sendProtoBuffer(code: number, message) {
        SocketManager.Instance.send(code, message);
    }

    public static sceneChat: any;
    /**
     * 发送聊天信息 
     * @param chat
     */
    public static sendChat(chatData: ChatData) {
        var pkg: PackageOut;
        var msg: ChatChannelMsg = new ChatChannelMsg();
        msg.channel = chatData.channel;
        msg.encodeMsg = chatData.msg;
        msg.headid = chatData.headId;
        msg.items = chatData.itemList;
        msg.stars = chatData.starList;
        msg.powcards = chatData.cardList;
        msg.fight = chatData.fight;
        var sceneType: string = SceneManager.Instance.currentType;
        var protocolId: number = 0;
        let code:number;
        if (ChatSocketOutManager.initChatData(chatData, msg)) {//跨服战斗当前聊天
            protocolId = ChatManager.Instance.model.protocalId;
            code = C2SProtocol.CR_CHANNEL_CHAT;
            ChatManager.Instance.model.addSendProtocol(protocolId, ChatSocketOutManager.getTimer());
        } else {//普通聊天
            
            switch (sceneType) {
                case SceneType.VEHICLE:
                case SceneType.CAMPAIGN_MAP_SCENE:
                case SceneType.BATTLE_SCENE:
                    if (CampaignManager.Instance.mapModel && !CampaignManager.Instance.exit) {
                        if (CampaignManager.Instance.mapModel.isCross &&
                            (ChatChannel.TEAM == chatData.channel || ChatChannel.CURRENT == chatData.channel)) {
                            protocolId = ChatManager.Instance.model.protocalId;
                            pkg = new PackageOut(C2SProtocol.CR_WARFIELD_CHAT, 0, protocolId);
                            code = C2SProtocol.CR_WARFIELD_CHAT;
                            ChatManager.Instance.model.addSendProtocol(protocolId, ChatSocketOutManager.getTimer());
                            msg.serverName = PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
                        }
                        else {
                            code = C2SProtocol.U_CH_CHANNEL_CHA;
                        }
                    }
                    else {
                        code = C2SProtocol.U_CH_CHANNEL_CHA;
                    }
                    break;
                default:
                    code = C2SProtocol.U_CH_CHANNEL_CHA;
                    break;
            }
        }
        this.sendProtoBuffer(code, msg);
    }

    private static initChatData(chatData: ChatData, msg: ChatChannelMsg): boolean {
        var sceneType: string = SceneManager.Instance.currentType;
        switch (sceneType) {
            case SceneType.BATTLE_SCENE:
                if (chatData.channel == ChatChannel.CURRENT) {
                    return ChatSocketOutManager.initBattleCurrentPlayer(msg);
                }
                else if (chatData.channel == ChatChannel.TEAM) {
                    ChatSocketOutManager.initBattleTeamPlayer(msg);
                }
                break;
            case SceneType.PVE_ROOM_SCENE:
            case SceneType.PVP_ROOM_SCENE:
                if (chatData.channel == ChatChannel.CURRENT || chatData.channel == ChatChannel.TEAM)
                    ChatSocketOutManager.initRoomPlayer(msg);
                break;
            case SceneType.VEHICLE:
                if (ChatSocketOutManager.sceneChat) {
                    if (chatData.channel == ChatChannel.CURRENT) {
                        msg.team = msg.team.concat(ChatSocketOutManager.sceneChat.currentChanelPlayerList);
                    }
                    else if (chatData.channel == ChatChannel.TEAM) {
                        msg.team = msg.team.concat(ChatSocketOutManager.sceneChat.teamChanelPlayerList);
                    }
                }
                break;
            case SceneType.CAMPAIGN_MAP_SCENE:
                if (chatData.channel == ChatChannel.CURRENT) {
                    ChatSocketOutManager.initMapCurrentPlayer(msg);
                }
                else if (chatData.channel == ChatChannel.TEAM) {
                    ChatSocketOutManager.initMapTeamPlayer(msg);
                }
                break;
            default:
                var roomInfo: RoomInfo = RoomManager.Instance.roomInfo;
                if (roomInfo && roomInfo.roomType == RoomType.VEHICLE) {
                    ChatSocketOutManager.initRoomPlayer(msg);
                }
                break;
        }
        if (chatData.channel == ChatChannel.TEAM) {
            ChatSocketOutManager.initFreedomTeamPlayer(msg);
        }
        return false;
    }
    /**
     *  跨服战斗需要发送另外的聊天协议, 在这里判断是否是跨服战斗, 所有竞技场战斗都是跨服战斗
     * @param msg
     * @return 
     * 
     */
    private static initBattleCurrentPlayer(msg: ChatChannelMsg): boolean {
        var battleModel: BattleModel = BattleManager.Instance.battleModel;
        var thane: ThaneInfo = ArmyManager.Instance.thane;
        var flag: boolean = false;
        switch (battleModel.battleType) {
            case BattleType.BATTLE_MATCHING:
            case BattleType.WARLORDS:
            case BattleType.WARLORDS_OVER:
                flag = true;
                break;
            default:
                flag = false;
                break;
        }

        if (!flag) {
            for (const key in battleModel.roleList) {
                if (Object.prototype.hasOwnProperty.call(battleModel.roleList, key)) {
                    let role = battleModel.roleList[key];//BaseRoleInfo
                    if (role.type != RoleType.T_NPC_BOSS) {
                        if (msg.team.indexOf(role.userId) < 0) {
                            msg.team.push(role.userId);
                        }
                    }
                }
            }
        }
        msg.battleId = battleModel.battleId;
        msg.serverName = PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
        return flag;
    }
    /**
     * 返回战斗中的组队成员 
     * @param msg
     * 
     */
    private static initBattleTeamPlayer(msg: ChatChannelMsg) {
        //initRoomPlayer(msg);
        ChatSocketOutManager.initMapTeamPlayer(msg);
        var battleModel: BattleModel = BattleManager.Instance.battleModel;
        if (battleModel && battleModel.armyInfoLeft && battleModel.armyInfoLeft.getHeros) {
            for (const key in battleModel.armyInfoLeft.getHeros) {
                if (Object.prototype.hasOwnProperty.call(battleModel.armyInfoLeft.getHeros, key)) {
                    let hero = battleModel.armyInfoLeft.getHeros[key];
                    if (msg.team.indexOf(hero.userId) < 0)
                        msg.team.push(hero.userId);
                }
            }
        }
    }
    /**
     * 返回房间中的成员 
     * 
     */
    private static initRoomPlayer(msg: ChatChannelMsg) {
        if (FreedomTeamManager.Instance.hasTeam) {
            return;
        }
        var roomInfo: RoomInfo = RoomManager.Instance.roomInfo;
        if (roomInfo) {
            for (const key in roomInfo.playerList) {
                if (Object.prototype.hasOwnProperty.call(roomInfo.playerList, key)) {
                    var army: CampaignArmy = roomInfo.playerList[key];
                    if (msg.team.indexOf(army.userId) < 0)
                        msg.team.push(army.userId);
                }
            }
        }
    }
    /**
     * 返回副本中可接收当前聊天的所有成员 
     * @param msg
     * 
     */
    private static initMapCurrentPlayer(msg: ChatChannelMsg) {
        var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
        if (mapModel) {
            let allBaseArmy = mapModel.allBaseArmy;
            allBaseArmy.forEach(element => {
                if (msg.team.indexOf(element.userId) < 0)
                    msg.team.push(element.userId);
            });
        }
    }
    /**
     * 返回副本中可接收组队聊天的所有成员 
     * @param msg
     * 
     */
    private static initMapTeamPlayer(msg: ChatChannelMsg) {
        if (FreedomTeamManager.Instance.hasTeam) {
            return;
        }
        var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
        if (!mapModel) return;

        var self: CampaignArmy = mapModel.selfMemberData;
        let allBaseArmy = mapModel.allBaseArmy;
        allBaseArmy.forEach(element => {
            if (self.teamId == element.teamId && msg.team.indexOf(element.userId) < 0)
                msg.team.push(element.userId);
        });
    }

    private static initFreedomTeamPlayer(msg: ChatChannelMsg) {
        if (!FreedomTeamManager.Instance.hasTeam) {
            return;
        }
        var selfMapId: number = FreedomTeamManager.Instance.model.getMemberByUserId(ArmyManager.Instance.thane.userId).mapId;
        if (WorldBossHelper.checkPvp(selfMapId) || WorldBossHelper.checkGvg(selfMapId)) {
            return;
        }
        for (const key in FreedomTeamManager.Instance.model.allMembers) {
            if (Object.prototype.hasOwnProperty.call(FreedomTeamManager.Instance.model.allMembers, key)) {
                var member: BaseArmy = FreedomTeamManager.Instance.model.allMembers[key];
                if (msg.team.indexOf(member.userId) < 0 && !WorldBossHelper.checkPvp(member.mapId) && !WorldBossHelper.checkGvg(member.mapId)) {
                    msg.team.push(member.userId);
                }
            }
        }
    }

    /**
     * 跨区大喇叭聊天 
     * @param mess
     * 
     */
    public static sendCrossChat(chatdata: ChatData) {
        var msg: CrossBigBugleMsg = new CrossBigBugleMsg();
        msg.content = chatdata.msg;
        this.sendProtoBuffer(C2SProtocol.C_SEND_CROSS_BIGBUGLE, msg);
    }

    /**
     * 本区大喇叭聊天 
     * @param mess
     */
    public static sendBugleChat(chatdata: ChatData) {
        var msg: ChatChannelMsg = new ChatChannelMsg();
        msg.encodeMsg = chatdata.msg;
        msg.items = chatdata.itemList;
        msg.stars = chatdata.starList;
        msg.powcards = chatdata.cardList;
        this.sendProtoBuffer(C2SProtocol.C_BAG_USEBIGBUGLE, msg);
    }
    /**
     * 小喇叭聊天 
     * @param mess
     * 
     */
    public static sendSmallBugleChat(chatdata: ChatData) {
        var protocolId: number = ChatManager.Instance.model.protocalId;
        ChatManager.Instance.model.addSendProtocol(protocolId, ChatSocketOutManager.getTimer());
        var msg: ChatChannelMsg = new ChatChannelMsg();
        msg.encodeMsg = chatdata.msg;
        msg.items = chatdata.itemList;
        msg.stars = chatdata.starList;
        msg.powcards = chatdata.cardList;
        ChatSocketOutManager.sendProtoBuffer(C2SProtocol.C_BAG_USESMALLBUGLE, msg);
    }

    /**
     * 请求小喇叭免费次数
     * 
     */
    public static sendSmallBugleFreeCount() {
        SocketManager.Instance.send(C2SProtocol.C_SMALL_BUGLE_FREE_COUNT)
    }

    private static getTimer(): number {
        return new Date().getTime();
    }
}