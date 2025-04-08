// @ts-nocheck
import AudioManager from "../../../core/audio/AudioManager";
import Logger from "../../../core/logger/Logger";
import { CampaignArmyViewHelper } from "../../map/campaign/CampaignArmyViewHelper";
import { AiEvents, JoyStickEvent, NotificationEvent, ObjectsEvent } from "../../constant/event/NotificationEvent";
import { FogGridType } from "../../constant/FogGridType";
import { SoundIds } from "../../constant/SoundIds";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { MapSocketOuterManager } from "../../manager/MapSocketOuterManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import TreasureMapManager from "../../manager/TreasureMapManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyView } from "../../map/campaign/view/physics/CampaignArmyView";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { CampaignMapModel } from "../model/CampaignMapModel";
import { PlayerVisualFollow } from "../../constant/PlayerVisualFollow";
import LangManager from "../../../core/lang/LangManager";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { MapCameraMediator } from "./MapCameraMediator";


/**
 * 自已部队行走过程中的逻辑, 
 * 行走到下一点, 
 * 行走指定路线完成
 * 
 */
export class PlayerWalkMediator implements IMediator {
    private _target: CampaignArmyView;
    private _data: CampaignArmy;
    private _walkPath: any[];

    private _doneWalkOverDetection = false
    private _lastWalkOverPos = new Laya.Point(0, 0)


    public get walkPath(): any[] {
        return this._walkPath
    }
    public set walkPath(value: any[]) {
        this._walkPath = value
    }


    /** 同步位置的频率*/
    private _sendPosRate: number = 0;
    public get sendPosRate(): number {
        return this._sendPosRate
    }
    /**
     * 遥感移动检测频率
     */
    private _rockerFrameCnt: number = 0;


    constructor() {

    }

    public register(target: Object) {
        this._target = <CampaignArmyView>target;
        this._data = this._target.data;
        this._target.on(ObjectsEvent.WALK_OVER, this, this.__walkOverHandler.bind(this));
        this._target.on(ObjectsEvent.WALK_NEXT, this, this.__walkNextHandler.bind(this));
        this._target.info.addEventListener(AiEvents.UPDATE_PATHS, this.__updatePathHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.SEND_CAMPAIGN_ARRIVE, this.__playerArriveHandler, this);
        NotificationManager.Instance.addEventListener(JoyStickEvent.JoystickMoving, this.__joystickMoving, this);
        this._sendPosRate = 7;
        this._walkPath = [];
        var mapId: number = CampaignManager.Instance.mapId;
        if (WorldBossHelper.checkWorldBoss(mapId) ||
            WorldBossHelper.checkPvp(mapId)) {
            this._sendPosRate = 14;
        }
        if(WorldBossHelper.checkMaze(mapId) || WorldBossHelper.checkMaze2(mapId)){
            Laya.timer.loop(1000, this, this.checkAutoWalkStatus);
        }

        Laya.timer.loop(1000 / EnterFrameManager.FPS, this, this.resetDetection)
    }

    public unregister(target: Object) {
        NotificationManager.Instance.removeEventListener(NotificationEvent.SEND_CAMPAIGN_ARRIVE, this.__playerArriveHandler, this);
        NotificationManager.Instance.removeEventListener(JoyStickEvent.JoystickMoving, this.__joystickMoving, this);
        if (this._target) {
            this._target.info.removeEventListener(AiEvents.UPDATE_PATHS, this.__updatePathHandler, this);
            this._target.off(ObjectsEvent.WALK_OVER, this, this.__walkOverHandler.bind(this));
            this._target.off(ObjectsEvent.WALK_NEXT, this, this.__walkNextHandler.bind(this));
        }
        this._target = null; this._data = null;
        Laya.timer.clear(this, this.resetDetection)
        Laya.timer.clear(this, this.checkAutoWalkStatus);
    }

    private __updatePathHandler(e: Event) {
        if (this._target.info.pathInfo && this._target.info.pathInfo.length > 0) {
            this._nextPoint = this._target.info.pathInfo[0];
        } else {
            this._nextPoint = null;
        }
    }

    private checkAutoWalkStatus(){
        if (PlayerManager.Instance.currentPlayerModel.getAutoWalkFlag() == PlayerModel.AUTO_WALK) {
            if(this.mapModel.campaignTemplate){
                let campaignId:number = this.mapModel.campaignTemplate.CampaignId;
                SwitchPageHelp.gotoCampaignById(campaignId);
            }
        }
    }

    private __playerArriveHandler(e: Event) {
        this.sendPath();
    }

    private sendPath() {
        var str: string = "";
        for (let p of this._walkPath) {
            str += (p.x + "_" + p.y + ", ");
        }
        if (this._walkPath.length > 0) {
            let vType = PlayerVisualFollow.Type0
            if (MapCameraMediator.isLockCamera) {
                vType = PlayerVisualFollow.Type1
            }
            // Logger.info("副本人物移动", this._target.objName, str, vType)
            MapSocketOuterManager.sendCampaignArmyMove(this._target.data.id, this._walkPath, this._target.data.mapId, vType);
            this._walkPath.length = 0;
        }
    }

    private _nextPoint: Laya.Point;

    /**
     * 行走到下一个格子 <br/>
     * 行走的过程中如果附近有节点触发节点并停止,<br/>
     * 向服务器发送路径
     * @param evt
     * 
     */
    private __walkNextHandler(data: any) {
        var point: Laya.Point = data.point;
        this._nextPoint = new Laya.Point();
        this._nextPoint.x = point.x;
        this._nextPoint.y = point.y;
        this.pushPathStep();
        if (this._walkPath.length >= this._sendPosRate) {
            this.sendPath();
        }

        if(WorldBossHelper.checkMonopoly(this.mapModel.mapId))
        {
            return;
        }
        if (!(WorldBossHelper.checkCrystal(this.mapModel.mapId) &&
            WorldBossHelper.checkPetLand(this.mapModel.mapId))) {//世界BOSS,宠物岛以外
            if (CampaignArmyViewHelper.selfArmyEvent(this._data.userId, this._target.aiInfo, this._target, point, false, this._data.isDie)) {
                this._target.aiInfo.pathInfo = [];
                return;
            }
            this.mapModel.updateFog(this._target.x, this._target.y, FogGridType.OPEN_FOUR);
        }
    }

    private pushPathStep() {
        if (this._nextPoint) {
            if (this._walkPath.length > 0) {
                var top: Laya.Point = this._walkPath[this._walkPath.length - 1];
                if (top.distance(this._nextPoint.x, this._nextPoint.y) >= 2) {
                    // throw new Error("break point!!!!!");
                    Logger.log("break point!!!!!")
                }
            }
            if (this._walkPath.length >= 2) {
                var p1: Laya.Point = this._walkPath[this._walkPath.length - 1];
                var p2: Laya.Point = this._walkPath[this._walkPath.length - 2];
                if (this.isNeighborPoint(this._nextPoint, p1) &&
                    this.isNeighborPoint(this._nextPoint, p2)) {
                    this._walkPath.pop();
                }
            }
            this._walkPath.push(this._nextPoint);
            this._nextPoint = null;
        }
    }

    private isNeighborPoint(p1: Laya.Point, p2: Laya.Point): boolean {
        var dx: number = Math.abs(p1.x - p2.x);
        var dy: number = Math.abs(p1.y - p2.y);
        return Boolean(dx <= 1 && dy <= 1);
    }

    private copyArray(arr: any[], startIndex: number, length: number): any[] {
        if (startIndex > 0) startIndex = startIndex - 1;
        var endIndex: number = startIndex + length;
        if (endIndex >= arr.length) endIndex = arr.length;
        var temp: any[] = [];
        for (var i: number = startIndex; i < endIndex; i++) {
            temp.push(arr[i]);
        }
        return temp;
    }
    /**
     * 已经走完停下的逻辑 
     * @param evt
     * 
     */
    private __walkOverHandler(evt: ObjectsEvent) {
        this.pushPathStep();
        this.sendPath();
        // Logger.xjy("[PlayerWalkMediator]__walkOverHandler")
        CampaignManager.Instance.mapModel.updateWalkTarget(null);
        if (this._target.aiInfo.pathInfo && this._target.aiInfo.pathInfo.length > 0) {
            AudioManager.Instance.playSound(SoundIds.CAMPAIGN_WALK_SOUND);
            // 鼠标点击在移动结束时候检测
            if (!this._doneWalkOverDetection && this._lastWalkOverPos.distance(this._target.x, this._target.y) > 40) {
                this._doneWalkOverDetection = true
                this.detection()
            }
            if (WorldBossHelper.checkPetLand(this.mapModel.mapId) && TreasureMapManager.Instance.checkReinforce()) {
                return;
            }
            if (CampaignArmyViewHelper.selfArmyToEnd(this._target.aiInfo, this._target)) {
                return;
            }
            if (WorldBossHelper.checkGvg(this.mapModel.mapId)) {
                CampaignArmyViewHelper.checkGvgArmy();
            }
        }
        this.mapModel.updateFog(this._target.x, this._target.y, FogGridType.OPEN_FOUR);

        this._lastWalkOverPos.x = this._target.x
        this._lastWalkOverPos.y = this._target.y
    }

    /**
     * 遥感在移动过程中检测
     * @param rad 
     * @param angle 
     */
    private __joystickMoving(rad: number, angle: number) {
        this._rockerFrameCnt += 1
        if (this._rockerFrameCnt > EnterFrameManager.FPS) {
            this.detection()
            this._rockerFrameCnt = 0
        }
    }

    private detection() {
        if (WorldBossHelper.checkPetLand(this.mapModel.mapId) && TreasureMapManager.Instance.checkReinforce()) {
            return;
        }
        if (CampaignArmyViewHelper.selfArmyToEnd(this._target.aiInfo, this._target)) {
            return;
        }
        if (WorldBossHelper.checkGvg(this.mapModel.mapId)) {
            CampaignArmyViewHelper.checkGvgArmy();
        }
    }

    private resetDetection() {
        this._doneWalkOverDetection = false
    }

    protected get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
    protected get mapModel(): CampaignMapModel {
        return CampaignManager.Instance.mapModel;
    }
}