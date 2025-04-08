// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-04-20 16:44:32
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-04-20 16:44:46
 * @Description: 副本动画队列管理器
 */

import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { IAction } from "../interfaces/IAction";
import { IEnterFrame } from "../interfaces/IEnterFrame";
import { SceneManager } from "../map/scene/SceneManager";
import { ActionQueueManager } from "./ActionQueueManager";
import { EnterFrameManager } from "./EnterFrameManager";
import { ActionsEvent, SceneEvent } from "../constant/event/NotificationEvent";

export class CampaignMovieQueueManager extends GameEventDispatcher implements IEnterFrame {
    private _actionsQueue: ActionQueueManager;

    constructor() {
        super();

        this._actionsQueue = new ActionQueueManager();
    }

    public setup() {
        SceneManager.Instance.addEventListener(SceneEvent.SWITCH_SCENE_LOCK, this.__switchSceneLockHandler, this);
        this._actionsQueue.addEventListener(ActionsEvent.ACTION_ALL_COMPLETE, this.__actionAllCompleteHandler, this);

        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    private _isSceneSwitch: boolean = false;

    private __switchSceneLockHandler(data: any) {
        this._isSceneSwitch = data;
    }

    public enterFrameCount: number = 0;

    public enterFrame() {
        this.enterFrameCount++;
        if (!this._isSceneSwitch) {
            this._actionsQueue.update();
        }
    }

    public getMessage(): string {
        let mssage: string = "CampaignMovieQueueManager : " + this._actionsQueue.getMessage();
        return mssage;
    }

    private __actionAllCompleteHandler(evt: ActionsEvent) {
        //	SceneManager.instance.lockScene = false;
    }

    public get actionsQueue(): ActionQueueManager {
        return this._actionsQueue;
    }

    public get actionsLength(): number {
        return this._actionsQueue.size;
    }

    public addAction(action: IAction, immediately: boolean = false) {
        this._actionsQueue.addAction(action, immediately);
    }

    private static _instance: CampaignMovieQueueManager;

    public static get Instance(): CampaignMovieQueueManager {
        if (!CampaignMovieQueueManager._instance) {
            CampaignMovieQueueManager._instance = new CampaignMovieQueueManager();
        }
        return CampaignMovieQueueManager._instance;
    }
}