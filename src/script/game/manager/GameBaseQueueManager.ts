import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";

import { SceneManager } from "../map/scene/SceneManager";
import { ActionQueueManager } from "./ActionQueueManager";
import { EnterFrameManager } from "./EnterFrameManager";
import { ActionsEvent, SceneEvent } from "../constant/event/NotificationEvent";
import { IAction } from "@/script/game/interfaces/Actiont";

/**
 * 多模块共用的队列管理器
 * @author yuanzhan.yu
 */
export class GameBaseQueueManager
  extends GameEventDispatcher
  implements IEnterFrame
{
  private _actionsQueue: ActionQueueManager;

  constructor() {
    super();

    this._actionsQueue = new ActionQueueManager();
  }

  public setup() {
    SceneManager.Instance.addEventListener(
      SceneEvent.SWITCH_SCENE_LOCK,
      this.__switchSceneLockHandler,
      this,
    );
    this._actionsQueue.addEventListener(
      ActionsEvent.ACTION_ALL_COMPLETE,
      this.__actionAllCompleteHandler,
      this,
    );

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
    let mssage: string =
      "GameBaseQueueManager : " + this._actionsQueue.getMessage();

    return mssage;
  }

  private __actionAllCompleteHandler(evt: ActionsEvent) {
    //			SceneManager.instance.lockScene = false;
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

  private static _instance: GameBaseQueueManager;

  public static get Instance(): GameBaseQueueManager {
    if (!GameBaseQueueManager._instance) {
      GameBaseQueueManager._instance = new GameBaseQueueManager();
    }
    return GameBaseQueueManager._instance;
  }
}
