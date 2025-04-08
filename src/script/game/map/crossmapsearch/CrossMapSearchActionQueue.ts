import { GlobalConfig } from "../../constant/GlobalConfig";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { SceneManager } from "../scene/SceneManager";
import SceneType from "../scene/SceneType";
import SpaceManager from "../space/SpaceManager";
import { CrossMapSearchAction } from "./CrossMapSearchAction";

/**
 * 该队列只用于夸地图寻路 
 * @author alan
 * 
 */
export class CrossMapSearchActionQueue implements IEnterFrame {
    private static _instance: CrossMapSearchActionQueue;
    private _actionList: CrossMapSearchAction[] = [];
    public map1: any[];
    public map2: any[];
    private _needSwitch: boolean = false;
    private _isStart: boolean = false;
    public static get Instance(): CrossMapSearchActionQueue {
        if (!CrossMapSearchActionQueue._instance) CrossMapSearchActionQueue._instance = new CrossMapSearchActionQueue();
        return CrossMapSearchActionQueue._instance;
    }

    constructor() {
        this.map1 = [{ from: 10000, to: 20001, by: 5 },
        { from: 20001, to: 20002, by: 2000102 },
        { from: 20002, to: 20003, by: 2000202 },
        { from: 20003, to: 20004, by: 2000341 },
        { from: 10001, to: 10002, by: GlobalConfig.CampaignNodeID.Node_1000108 }];

        this.map2 = [{ from: 20004, to: 20003, by: 2000401 },
        { from: 20003, to: 20002, by: 2000301 },
        { from: 20002, to: 20001, by: 2000201 },
        { from: 20001, to: 10000, by: 2000150 }];
    }

    enterFrame() {
        if (this._actionList.length > 0) {
            var toExcuteAction: CrossMapSearchAction = this._actionList[0];
            var currentScene: string = SceneManager.Instance.currentType;
            if (currentScene == SceneType.SPACE_SCENE) {
                if (toExcuteAction.mapId == SpaceManager.Instance.mapId) {//天空之城, 可自动寻路
                    this.excute();
                }
                return;
            }
            var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
            if (mapModel) {
                if (toExcuteAction.mapId == mapModel.mapId) {//在指定的地图, 可自动寻路
                    this.excute();
                }
                return;
            }
        }
        else {
            this.needStop();
        }
    }

    public searchPath(from: number, to: number): any[] {
        var path: any[] = null;
        var startIndex: number = -1;
        var endIndex: number = -1;
        var i: number = 0;
        var mapPath: any[];
        for (const key in this.map1) {
            if (Object.prototype.hasOwnProperty.call(this.map1, key)) {
                var obj: any = this.map1[key];
                if (obj.from == from) {
                    startIndex = i;
                }
                if (obj.to == to) {
                    endIndex = i;
                }
                i++;
            }
        }
        if (startIndex == -1 || endIndex < startIndex) {
            mapPath = this.map2;
        } else {
            mapPath = this.map1;
        }
        i = 0;
        for (const key in mapPath) {
            if (Object.prototype.hasOwnProperty.call(mapPath, key)) {
                let obj = mapPath[key];
                if (obj.from == from) {
                    startIndex = i;
                }
                if (obj.to == to) {
                    endIndex = i;
                }
                i++;
            }
        }
        if (startIndex >= 0 && endIndex >= 0) {
            path = mapPath.slice(startIndex, endIndex + 1);
        }
        return path;
    }

    public addAction(action: CrossMapSearchAction,needSwitch:boolean) {
        this._needSwitch = needSwitch;
        if (!this._isStart) {
            this.start();
        }
        this._actionList.push(action);
    }

    private excute() {
        if (this._actionList.length > 0) {
            {
                if(this._actionList.length >= 2 && this._needSwitch){//跨多个地图时容易出现黑屏问题(从英灵岛切换到天空城后, 玩家模型在传送阵上不移动, 此时切换到内城跳转任务到英灵岛黑屏)
                    this._needSwitch = false;
                    this.needStop();
                    Laya.timer.once(1000,this,function(){
                        var toExcuteAction: CrossMapSearchAction = this._actionList.shift();
                        if (toExcuteAction) {
                            toExcuteAction.update();
                        }
                    })
                }else{
                    var toExcuteAction: CrossMapSearchAction = this._actionList.shift();
                    if (toExcuteAction) {
                        toExcuteAction.update();
                    }
                }
            }
        }
        if (this._actionList.length <= 0) {
            this.needStop();
        }
    }

    public clean() {
        this._actionList.length = 0;
        this.needStop();
    }

    private start() {
        this._isStart = true;
        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    private needStop() {
        this._isStart = false;
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }
}