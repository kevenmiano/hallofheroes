import { NotificationEvent, FreedomTeamEvent, ChatEvent } from "../../constant/event/NotificationEvent";
import { ChatChannel } from "../../datas/ChatChannel";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyView } from "../../map/campaign/view/physics/CampaignArmyView";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import Tiles from "../../map/space/constant/Tiles";
import { BaseArmy } from "../../map/space/data/BaseArmy";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import SpaceArmy from "../../map/space/data/SpaceArmy";
import { SpaceNode } from "../../map/space/data/SpaceNode";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceArmyView } from "../../map/space/view/physics/SpaceArmyView";
import ChatData from "../../module/chat/data/ChatData";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import LangManager from '../../../core/lang/LangManager';
import Logger from "../../../core/logger/Logger";

export class FreedomTeamFollowMediator implements IMediator {
    private _selfInfo: BaseArmy;
    private _targetInfo: BaseArmy;
    private _targetPoint: Laya.Point;
    private _count: number = 0;
    private _selfMapId: number = -1;
    /**就是在unregister时上锁, */
    private _lock: boolean = false;
    constructor() {
    }

    public register(target: any) {
        this._selfInfo = this.getSelfInfo();
        this._targetPoint = new Laya.Point();
        //先判断是否跟随别人
        if (FreedomTeamManager.Instance.model != null && FreedomTeamManager.Instance.model.followId != 0) {//证明现在正在跟随
            if (this._targetInfo == null) {//跨场景时, 重新拿值
                this._targetInfo = FreedomTeamManager.Instance.model.getMemberByUserId(FreedomTeamManager.Instance.model.followId);
            }
        }
        //数据准备好了再监听
        NotificationManager.Instance.addEventListener(NotificationEvent.LOCK_TEAM_FOLLOW_TARGET, this.__lockFollowtTargetHandler, this);
        NotificationManager.Instance.addEventListener(FreedomTeamEvent.TEAM_INFO_UPDATE, this.__teamInfoUpdateHandler, this);
        NotificationManager.Instance.addEventListener(FreedomTeamEvent.TEAM_INFO_SYNC, this.__teamInfoSyncHandler, this);
    }

    public unregister(target: any) {
        NotificationManager.Instance.removeEventListener(NotificationEvent.LOCK_TEAM_FOLLOW_TARGET, this.__lockFollowtTargetHandler, this);
        NotificationManager.Instance.removeEventListener(FreedomTeamEvent.TEAM_INFO_UPDATE, this.__teamInfoUpdateHandler, this);
        NotificationManager.Instance.removeEventListener(FreedomTeamEvent.TEAM_INFO_SYNC, this.__teamInfoSyncHandler, this);
        this._targetInfo = null;
    }

    private __teamInfoSyncHandler(evt: FreedomTeamEvent) {
        var content: string = "";
        var chatData: ChatData = new ChatData;
        if (FreedomTeamManager.Instance.model == null || FreedomTeamManager.Instance.model != null && !FreedomTeamManager.Instance.model.followFlag) {
            return;
        }
        if (!FreedomTeamManager.Instance.hasTeam) {
            content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips03");
            if (chatData) {
                chatData.channel = ChatChannel.INFO;
                chatData.msg = content;
                chatData.commit();
                NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
                MessageTipManager.Instance.show(content);
            }
            if (FreedomTeamManager.Instance.model != null)
                FreedomTeamManager.Instance.model.followFlag = false;
            return;
        }

        if (this._targetInfo == null && FreedomTeamManager.Instance.model.followId != 0) {//跨场景时, 重新拿值
            this._targetInfo = FreedomTeamManager.Instance.model.getMemberByUserId(FreedomTeamManager.Instance.model.followId);
        }
        if (!FreedomTeamManager.Instance.inMyTeam(this._targetInfo.userId)) {
            content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips03");
            if (chatData) {
                chatData.channel = ChatChannel.INFO;
                chatData.msg = content;
                chatData.commit();
                NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
                MessageTipManager.Instance.show(content);
            }
            FreedomTeamManager.Instance.model.followFlag = false;
            return;
        }

        if (this.inTheSameMap) {//和被跟随的人在同一个地图
            if (this._targetInfo == null)
                this._targetInfo = FreedomTeamManager.Instance.model.getMemberByUserId(this._targetInfo.userId);
            var startPoint: Laya.Point = new Laya.Point(this.selfPoint.x * Tiles.WIDTH, this.selfPoint.y * Tiles.HEIGHT);
            var endPoint: Laya.Point = new Laya.Point(this._targetInfo.curPosX * Tiles.WIDTH, this._targetInfo.curPosY * Tiles.HEIGHT);
            var distance: number = this.getSquareDistance(startPoint, endPoint);
            if (distance > 4000000) {//当距离大于2000时, 取消跟随
                return;//这个地方在被跟随者跨地图时, 会有问题
                //（被跟随者的坐标已经是另一张地图的坐标了, 但是我自己的坐标还是原先的, 就会出现>2000的情况）
                content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips05");
                if (chatData) {
                    chatData.channel = ChatChannel.INFO;
                    chatData.msg = content;
                    chatData.commit();
                    NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
                    MessageTipManager.Instance.show(content);
                }
                FreedomTeamManager.Instance.model.followFlag = false;
                return;
            }
            else if (distance < 10000) {//当距离小于100时, 不处理
                return;
            }
            if (this._targetPoint == null)
                return;
            this._targetPoint.x = this._targetInfo.curPosX;
            this._targetPoint.y = this._targetInfo.curPosY;
            if (this._count % 4 == 0 || this.walkOver) {
                //查看目标点是否为传送点
                if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {//天空之城就不用管, 战役地图场景就需要重新赋值
                    var node: CampaignNode = CampaignManager.Instance.mapModel.getMapNodesByPoint(this._targetPoint);
                    if (node != null)
                        CampaignManager.Instance.mapModel.selectNode = node;
                }
                this.searchPath(this.selfPoint.x, this.selfPoint.y, this._targetPoint.x, this._targetPoint.y);
            }
            this._count++;
        }
        else {//不在同一个地图
            this._targetPoint = this.getTransfer();//取一个传送点
            if (this._targetPoint) {//找到传送点, 则走到传送点去
                Logger.log("找到传送点, 则走到传送点去eric");
                //查看目标点是否为传送点
                if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {//天空之城就不用管, 战役地图场景就需要重新赋值
                    var node1: CampaignNode = CampaignManager.Instance.mapModel.getMapNodesByPoint(this._targetPoint);
                    if (node1 != null)
                        CampaignManager.Instance.mapModel.selectNode = node1;
                }
                this.searchPath(this.selfPoint.x, this.selfPoint.y, this._targetPoint.x, this._targetPoint.y);
            }
        }
    }

    private __teamInfoUpdateHandler(evt: FreedomTeamEvent) {
        var content: string = "";
        var chatData: ChatData = new ChatData();
        if (FreedomTeamManager.Instance.model == null || FreedomTeamManager.Instance.model != null && !FreedomTeamManager.Instance.model.followFlag) {
            return;
        }
        if (!FreedomTeamManager.Instance.hasTeam) {
            content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips03");
            if (chatData) {
                chatData.channel = ChatChannel.INFO;
                chatData.msg = content;
                chatData.commit();
                NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
                MessageTipManager.Instance.show(content);
            }
            if (FreedomTeamManager.Instance.model != null)
                FreedomTeamManager.Instance.model.followFlag = false;
            return;
        }
        if (!FreedomTeamManager.Instance.inMyTeam(this._targetInfo.userId)) {
            content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips03");
            if (chatData) {
                chatData.channel = ChatChannel.INFO;
                chatData.msg = content;
                chatData.commit();
                NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
                MessageTipManager.Instance.show(content);
            }
            if (FreedomTeamManager.Instance.model != null)
                FreedomTeamManager.Instance.model.followFlag = false;
            return;
        }
    }

    private __lockFollowtTargetHandler(data:any) {
        var userId: number = data;
        var content: string = "";

        if (userId == 0) {
            if (FreedomTeamManager.Instance.model != null && FreedomTeamManager.Instance.model.followFlag) {
                FreedomTeamManager.Instance.model.followId = 0;//取消跟随时重置0
                content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips02");
                MessageTipManager.Instance.show(content);
                FreedomTeamManager.Instance.model.followFlag = false;
                return;
            }
        }
        if (!FreedomTeamManager.Instance.hasTeam) {
            return;
        }
        if (!FreedomTeamManager.Instance.inMyTeam(userId)) {//这个id没在我的队伍里
            return;
        }
        if (!this.checkScene()) {//只有天空之城、英灵岛、紫晶矿场, 这3个场景可以跟随
            content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips04");
            MessageTipManager.Instance.show(content);
            if (FreedomTeamManager.Instance.model != null)
                FreedomTeamManager.Instance.model.followFlag = false;
            return;
        }
        if (FreedomTeamManager.Instance.model != null)
            this._targetInfo = FreedomTeamManager.Instance.model.getMemberByUserId(userId);
        if (this._targetInfo && FreedomTeamManager.Instance.memberIsOnline(userId)) {//跟随者存在, 并且在线
            var startPoint: Laya.Point = new Laya.Point(this.selfPoint.x * Tiles.WIDTH, this.selfPoint.y * Tiles.HEIGHT);
            var endPoint: Laya.Point = new Laya.Point(this._targetInfo.curPosX * Tiles.WIDTH, this._targetInfo.curPosY * Tiles.HEIGHT);
            var distance: number = this.getSquareDistance(startPoint, endPoint);
            if (!this.inTheSameMap) {//不在同一个地图
                content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips06");
                MessageTipManager.Instance.show(content);
                if (FreedomTeamManager.Instance.model != null)
                    FreedomTeamManager.Instance.model.followFlag = false;
                Logger.log("不在同一个地图, 不能跟随！！！！！！！！！！");
                return;
            }
            if (distance > 4000000) {
                content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips06");
                MessageTipManager.Instance.show(content);
                if (FreedomTeamManager.Instance.model != null)
                    FreedomTeamManager.Instance.model.followFlag = false;
                return;
            }
            this._targetPoint.x = this._targetInfo.curPosX;
            this._targetPoint.y = this._targetInfo.curPosY;
            content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips01");
            MessageTipManager.Instance.show(content);
            if (FreedomTeamManager.Instance.model != null)
                FreedomTeamManager.Instance.model.followFlag = true;
            this.searchPath(this.selfPoint.x, this.selfPoint.y, this._targetPoint.x, this._targetPoint.y);
        }
        else {
            content = LangManager.Instance.GetTranslation("map.internals.mediator.team.FreedomTeamFollowMediator.Tips04");
            MessageTipManager.Instance.show(content);
            if (FreedomTeamManager.Instance.model != null)
                FreedomTeamManager.Instance.model.followFlag = false;
        }
    }

    private checkScene(): boolean {
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {//天空之城
            return true;
        }
        else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            if (CampaignManager.Instance.mapModel) {
                var mapId: number = CampaignManager.Instance.mapModel.mapId;
                if (WorldBossHelper.checkPetLand(mapId) || WorldBossHelper.checkMineral(mapId)) {//英灵岛或紫晶矿场
                    return true;
                }
            }
        }
        return false;
    }

    private get selfPoint(): Laya.Point {
        var armyView: any;
        if (this._selfInfo instanceof SpaceArmy) {
            armyView = SpaceManager.Instance.controller.getArmyView(this._selfInfo);
        }
        else if (this._selfInfo instanceof CampaignArmy) {
            armyView = CampaignManager.Instance.controller.getArmyView(this._selfInfo);
        }

        if (armyView instanceof SpaceArmyView) {
            return new Laya.Point((<SpaceArmyView>armyView).x / Tiles.WIDTH, (<SpaceArmyView>armyView).y / Tiles.HEIGHT);
        }
        // else if (armyView instanceof SpaceAvatar) {
        //     return new Laya.Point((<SpaceAvatar>armyView).x / Tiles.WIDTH, (<SpaceAvatar>armyView).y / Tiles.HEIGHT);
        // }
        else if (armyView instanceof CampaignArmyView) {
            return new Laya.Point((<CampaignArmyView>armyView).x / Tiles.WIDTH, (<CampaignArmyView>armyView).y / Tiles.HEIGHT);
        }
        return new Laya.Point();
    }

    private get selfMapId(): number {
        var self: BaseArmy = FreedomTeamManager.Instance.model.getMemberByUserId(this._selfInfo.userId);
        return self.mapId;
    }

    private getSquareDistance(p1: Laya.Point, p2: Laya.Point): number {
        var vx: number = Math.abs(p2.x - p1.x);
        var vy: number = Math.abs(p2.y - p1.y);
        var squareDistance: number = vx * vx + vy * vy;
        return squareDistance;
    }

    private get walkOver(): boolean {
        var armyView: Object;
        if (this._selfInfo instanceof SpaceArmy) {
            armyView = SpaceManager.Instance.controller.getArmyView(this._selfInfo);
        }
        else if (this._selfInfo instanceof CampaignArmy) {
            armyView = CampaignManager.Instance.controller.getArmyView(this._selfInfo);
        }
        if (armyView instanceof SpaceArmyView) {
            if ((<SpaceArmyView>armyView).aiInfo && (<SpaceArmyView>armyView).aiInfo.pathInfo) {
                if ((<SpaceArmyView>armyView).aiInfo.walkIndex == (<SpaceArmyView>armyView).aiInfo.pathInfo.length) {
                    return true;
                }
            }
        }
        // else if (armyView instanceof SpaceAvatar) {
        //     if ((<SpaceAvatar>armyView).aiInfo && (<SpaceAvatar>armyView).aiInfo.pathInfo) {
        //         if ((<SpaceAvatar>armyView).aiInfo.walkIndex == (<SpaceAvatar>armyView).aiInfo.pathInfo.length) {
        //             return true;
        //         }
        //     }
        // }
        else if (armyView instanceof CampaignArmyView) {
            if ((<CampaignArmyView>armyView).aiInfo && (<CampaignArmyView>armyView).aiInfo.pathInfo) {
                if ((<CampaignArmyView>armyView).aiInfo.walkIndex == (<CampaignArmyView>armyView).aiInfo.pathInfo.length) {
                    return true;
                }
            }
        }
        return false;
    }

    private get inTheSameMap(): boolean {
        if (this._targetInfo && this.selfMapId == this._targetInfo.mapId) {
            return true;
        }
        return false;
    }

    /**取一个传送点*/
    private getTransfer(): Laya.Point {
        var transfer: Laya.Point;
        if (this._targetInfo) {
            var key: string = this.selfMapId + "-" + this._targetInfo.mapId;
            var nodeId: number = FreedomTeamManager.Instance.getTransferMapping(key);
            if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {//天空之城
                var snode: SpaceNode = SpaceManager.Instance.model.getMapNodeById(nodeId);
                if (snode) {
                    transfer = new Laya.Point(snode.curPosX, snode.curPosY);
                }
            }
            else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
                var cnode: CampaignNode = CampaignManager.Instance.mapModel.getMapNodeByNodeId(nodeId);
                if (cnode) {
                    transfer = new Laya.Point(cnode.curPosX, cnode.curPosY);
                }
            }
        }
        return transfer;
    }

    private searchPath(startX: number, startY: number, endX: number, endY: number) {
        var start: Laya.Point;
        var end: Laya.Point;
        var path: any[];
        start = this.getAroundWalkPoint(parseInt(startX.toString()) * Tiles.WIDTH, parseInt(startY.toString()) * Tiles.HEIGHT);
        if (!start) return;
        end = this.getAroundWalkPoint(parseInt(endX.toString()) * Tiles.WIDTH, parseInt(endY.toString()) * Tiles.HEIGHT);
        if (!end) return;
        path = this.getPath(start, end);
        if (!path) return;
        this.setPath(path);
    }

    private setPath(path: any[]) {
        var end: Laya.Point = path[path.length - 1] as Laya.Point;
        var armyView: Object;
        if (this._selfInfo instanceof SpaceArmy) {
            armyView = SpaceManager.Instance.controller.getArmyView(this._selfInfo);
        }
        else if (this._selfInfo instanceof CampaignArmy) {
            armyView = CampaignManager.Instance.controller.getArmyView(this._selfInfo);
        }
        if (armyView instanceof SpaceArmyView) {
            (<SpaceArmyView>armyView).aiInfo.pathInfo = path;
        }
        // else if (armyView instanceof SpaceAvatar) {
        //     (<SpaceAvatar>armyView).aiInfo.pathInfo = path;
        // }
        else if (armyView instanceof CampaignArmyView) {
            (<CampaignArmyView>armyView).aiInfo.pathInfo = path;
        }
        this.updateWalkTarget(end);
    }

    private getSelfInfo(): BaseArmy {
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
            return <BaseArmy>SpaceManager.Instance.model.selfArmy;
        }
        else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            return <BaseArmy>CampaignManager.Instance.mapModel.selfMemberData;
        }
        return null;
    }

    private getAroundWalkPoint(posX: number, posY: number): Laya.Point {
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
            return SpaceManager.Instance.model.getAroundWalkPoint(posX, posY);
        }
        else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            return CampaignManager.Instance.mapModel.getAroundWalkPoint(posX, posY);
        }
        return null;
    }

    private getPath(startPoint: Laya.Point, endPoint: Laya.Point): any[] {
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
            return SpaceManager.Instance.controller.searchPath(startPoint, endPoint);
        }
        else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            return CampaignManager.Instance.controller.searchPath(startPoint, endPoint);
        }
        return null;
    }

    private updateWalkTarget(end: Laya.Point) {
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
            SpaceManager.Instance.model.updateWalkTarget(end);
        }
        else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            CampaignManager.Instance.mapModel.updateWalkTarget(end);
        }
    }

}