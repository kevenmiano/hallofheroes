// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-06-08 18:08:59
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-01-12 14:40:00
 * @Description: 天空之城npc移动控制
 */

import Logger from "../../../core/logger/Logger";
import { AiEvents } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { AiStateType } from "../../map/space/constant/AiStateType";
import { NodeState } from "../../map/space/constant/NodeState";
import SpaceNodeType from "../../map/space/constant/SpaceNodeType";
import { SpaceNode } from "../../map/space/data/SpaceNode";

export class NPCPatrolMediator implements IMediator, IEnterFrame {
    private _npc: any;
    private _count: number = 0;
    private _diff: number = 100;
    constructor() {
    }

    public enterFrame() {
        if (this._npc.aiInfo.moveState == AiStateType.NPC_BEING_VISIT) { 
            // Logger.info("[NPCPatrolMediator]enterFrame NPC_BEING_VISIT")
            return;
        }

        this._count++;
        if (this._count % 100 == 0) {
            if (this._npc.aiInfo.moveState == AiStateType.STAND) {
                this._npc.aiInfo.moveState = AiStateType.NPC_RANDOM_MOVE_STATE;
            }
        }
        if (this._count % this._diff == 0) {
            if (this._npc.aiInfo.moveState == AiStateType.NPC_RANDOM_MOVE_STATE) {
                this._npc.aiInfo.moveState = AiStateType.STAND;
                this._diff = parseInt((Math.random() * 20).toString()) * 25 + 100;
            }
        }
    }

    public register(target: Object) {
        this._npc = target;
        if (this._npc && (<SpaceNode>this._npc.nodeInfo).info.types == SpaceNodeType.MOVEMENT) {
            this._npc.aiInfo.moveState = AiStateType.NPC_RANDOM_MOVE_STATE;
            this.__moveStateHandler(null);
            this._npc.aiInfo.addEventListener(AiEvents.MOVE_STATE, this.__moveStateHandler.bind(this));
            EnterFrameManager.Instance.registeEnterFrame(this);
        }
    }

    public unregister(target: Object) {
        this._npc.aiInfo.removeEventListener(AiEvents.MOVE_STATE, this.__moveStateHandler.bind(this));
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }

    private __moveStateHandler(evt: AiEvents) {
        if (this._npc.nodeInfo.info.state != NodeState.EXIST) return;
        switch (this._npc.aiInfo.moveState) {
            case AiStateType.STAND:
            case AiStateType.NPC_BEING_VISIT:
                this._npc.aiInfo.pathInfo = [];
                break;
            case AiStateType.NPC_RANDOM_MOVE_STATE:
                this._npc.aiInfo.pathInfo = this._npc.pathCache;
                break;
        }
    }
}