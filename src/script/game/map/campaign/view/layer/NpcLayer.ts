import Logger from "../../../../../core/logger/Logger";
import { DisplayObject } from "../../../../component/DisplayObject";
import { CampaignEvent, OuterCityEvent, SecretEvent } from "../../../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../../../interfaces/IEnterFrame";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { EnterFrameManager } from "../../../../manager/EnterFrameManager";
import MediatorMananger from "../../../../manager/MediatorMananger";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { CampaignMapModel } from "../../../../mvc/model/CampaignMapModel";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import NpcAiInfo from "../../../ai/NpcAiInfo";
import SimpleBuildingFilter from "../../../castle/filter/SimpleBuildingFilter";
import { AiStateType } from "../../../space/constant/AiStateType";
import NodeResourceType from "../../../space/constant/NodeResourceType";
import { NodeState } from "../../../space/constant/NodeState";
import { PosType } from "../../../space/constant/PosType";
import Tiles from "../../../space/constant/Tiles";
import { CampaignNode } from "../../../space/data/CampaignNode";
import MineralCarView from "../physics/MineralCarView";
import { NpcAvatarView } from "../physics/NpcAvatarView";

export class NpcLayer implements IEnterFrame {
    public static NAME: string = "map.campaign.view.layer.NpcLayer";
    private _model: CampaignMapModel;
    private _container: Laya.Sprite;
    private _avatarList: NpcAvatarView[] = [];
    private _filter: SimpleBuildingFilter = new SimpleBuildingFilter();
    constructor($parent: Laya.Sprite) {
        this._container = $parent;
    }

    public addToStage(evt: Event) {
        this._model = CampaignManager.Instance.mapModel;
        if (this.mapView && !this.mapView.stepRender) {
            this.addNpcs(this._model.mapNodesData);
        }
        this.initRegister();
        EnterFrameManager.Instance.registeEnterFrame(this);
        this._model.addEventListener(CampaignEvent.MOVE_NPC, this.__npcMoveHandler, this);
        this._model.addEventListener(CampaignEvent.NPC_CHASE, this.__npcChaseArmyHandler, this);
        this._model.addEventListener(OuterCityEvent.CURRENT_NPC_POS, this.__addNpcHandler, this);
        this._model.addEventListener(OuterCityEvent.REMOVE_NODE, this.__removeNpcHandler, this);
    }

    public addNpc(node: CampaignNode) {
        if (!node) {
            return
        }
        if (node.resource != NodeResourceType.Image) {
            return
        }

        let npc: NpcAvatarView = this.findNodeView(node) as NpcAvatarView;
        if (npc) {
            // npc.x = node.curPosX * Tiles.WIDTH;
            // npc.y = node.curPosY * Tiles.HEIGHT;
            return;
        }
        let mapId: number = CampaignManager.Instance.mapModel ? CampaignManager.Instance.mapModel.mapId : 0;
        if (node.info.occupyPlayerId > 0 && WorldBossHelper.checkMineral(mapId)) {
            npc = new MineralCarView("", "", 0, 0, node);
        } else {
            npc = new NpcAvatarView("", "", 0, 0);
        }
        npc.filter = this._filter;

        let aiInfo: NpcAiInfo = new NpcAiInfo();
        aiInfo.isLiving = true;
        aiInfo.moveState = AiStateType.STAND;
        aiInfo.centerPoint = new Laya.Point(node.x, node.y);
        npc.info = aiInfo;

        node.nodeView = npc;
        node.preParent = this._container;
        this._avatarList.push(npc);
        npc.nodeInfo = node;
        this._container.addChild(npc);
        npc.x = node.curPosX * Tiles.WIDTH;
        npc.y = node.curPosY * Tiles.HEIGHT;
    }

    public addNpcs(arr: CampaignNode[]) {
        if (!arr) return;
        for (let i: number = 0; i < arr.length; i++) {
            this.addNpc(arr[i]);
        }
    }

    private findNodeView(node: CampaignNode): DisplayObject {
        if (!node) return null;
        let obj: DisplayObject = this._model.getNodeById(node.info.id);
        return obj;
    }
    private _mediatorKey: string;
    private initRegister() {
        let arr: any[] = [];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this._container, NpcLayer.NAME);
    }
    private __addNpcHandler(Evt: Event) {
        if (this.mapView && !this.mapView.stepRender) {
            this.addNpcs(this._model.mapNodesData);
        }
    }
    private __removeNpcHandler(data: CampaignNode) {
        let cInfo: CampaignNode = data;
        for (let i: number = 0; i < this._avatarList.length; i++) {
            let cView: NpcAvatarView = this._avatarList[i] as NpcAvatarView;
            if (cView == cInfo.nodeView) {
                this._avatarList.splice(i, 1);
                if (cView) cView.dispose();
            }
            cView = null;
        }
    }

    // NPC 移动并追击
    private __npcChaseArmyHandler(data: com.road.yishi.proto.campaign.NPCChaseMsg) {
        let msg: com.road.yishi.proto.campaign.NPCChaseMsg = data;
        let npc: NpcAvatarView = this._model.getNodeById(msg.nodeId) as NpcAvatarView;
        // Logger.log("[NpcLayer]__npcChaseArmyHandler", data, npc)
        if (npc && npc.npcAiInfo) {
            npc.npcAiInfo.attackArmyId = msg.armyId;
            npc.npcAiInfo.attackArmyServerName = msg.serverName;
            npc.npcAiInfo.moveState = AiStateType.NPC_CHASE_STATE;
        }
    }

    // NPC 移动
    private __npcMoveHandler(data: com.road.yishi.proto.campaign.NPCMoveMsg) {
        let mapId: number = CampaignManager.Instance.mapModel ? CampaignManager.Instance.mapModel.mapId : 0;
        if (WorldBossHelper.checkConsortiaDemon(mapId)) return;
        let msg: com.road.yishi.proto.campaign.NPCMoveMsg = data;
        let npc: NpcAvatarView = this._model.getNodeById(msg.id) as NpcAvatarView;
        // Logger.info("[NpcLayer]__npcMoveHandler", data, npc)
        if (npc && npc.npcAiInfo) {
            if (this.checkCanMove(<CampaignNode>npc.nodeInfo)) {
                npc.npcAiInfo.moveState = AiStateType.NPC_RANDOM_MOVE_STATE;
            } else {
                npc.npcAiInfo.moveState = AiStateType.STAND;
            }
            npc.npcAiInfo.nextPoint = new Laya.Point(msg.curPosX * 20, msg.curPosY * 20);
            // Logger.log("[NpcLayer]__npcMoveHandler npc", npc, npc.npcAiInfo.nextPoint)
        }
    }

    private checkCanMove(node: CampaignNode): boolean {
        if (node) {
            switch (node.info.types) {
                case PosType.COPY_NPC_HANDLER:
                    return false;
                default:
                    return true;
            }
        }
        return true;
    }

    public enterFrame() {
        if (this._avatarList.length == 0) return;
        if (!this._model || this._model.exit) return;

        for (const key in this._avatarList) {
            let element = this._avatarList[key];
            element.execute();
        }
    }

    public dispose() {
        MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this._container);

        this._model.removeEventListener(CampaignEvent.MOVE_NPC, this.__npcMoveHandler, this);
        this._model.removeEventListener(CampaignEvent.NPC_CHASE, this.__npcChaseArmyHandler, this);
        this._model.removeEventListener(OuterCityEvent.CURRENT_NPC_POS, this.__addNpcHandler, this);
        this._model.removeEventListener(OuterCityEvent.REMOVE_NODE, this.__removeNpcHandler, this);

        let npc: NpcAvatarView;
        while (this._avatarList.length > 0) {
            npc = this._avatarList.pop();
            npc.dispose();
        }
        this._avatarList = null;
        this._filter = null;
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        this._model = null;
    }
    public onClickHandler(evt: Laya.Event): boolean {
        let mc: any = evt.target;
        if (mc && mc["mouseClickHandler"]) {
            mc.mouseClickHandler(evt);
            return true;
        }
        return false;
    }
    public mouseOverHandler(evt: Laya.Event) {
        let mc: any = evt.target;
        if (mc && mc["mouseMoveHandler"]) {
            mc.mouseMoveHandler(evt);
        }
    }
    public mouseOutHandler(evt: Laya.Event) {
        let mc: any = evt.target;
        if (mc && mc["mouseOutHandler"]) {
            mc.mouseOutHandler(evt);
        }
    }

    public mouseMoveHandler(evt: Laya.Event): boolean {
        let data: any = evt.target;
        if (evt.target instanceof NpcAvatarView) {
            let mc: NpcAvatarView = evt.target as NpcAvatarView;
            if ((mc.nodeInfo as CampaignNode)) {
                if ((mc.nodeInfo as CampaignNode)['followTarget'] > 0) return false;
            }

            if (mc.nodeInfo && mc.nodeInfo.info && !PosType.checkNeutralState(mc.nodeInfo.info.types)) {
                if (NodeState.isOppositionState(mc.nodeInfo.info.state))
                    return mc.mouseMoveHandler(evt);
            }
        } else if (data && data["mouseMoveHandler"]) {
            return data.mouseMoveHandler(evt);
        }
        return false;
    }

    public get avatarList(): NpcAvatarView[] {
        return this._avatarList;
    }

    public get mapView() {
        return CampaignManager.Instance.mapView
    }
}