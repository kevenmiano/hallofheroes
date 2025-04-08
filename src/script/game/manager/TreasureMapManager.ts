import LangManager from '../../core/lang/LangManager';
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { BaseArmy } from "../map/space/data/BaseArmy";
import SpaceManager from "../map/space/SpaceManager";
import { TreasureMapModel } from "../mvc/model/Treasuremap/TreasureMapModel";
import { CampaignManager } from "./CampaignManager";
import FreedomTeamManager from "./FreedomTeamManager";
import { MessageTipManager } from "./MessageTipManager";
import { SharedManager } from "./SharedManager";
import { TreasureMapSocketOutManager } from "./TreasureMapSocketOutManager";
import SpaceArmy from "../map/space/data/SpaceArmy";
import { CampaignArmy } from "../map/campaign/data/CampaignArmy";
import { PlayerManager } from "./PlayerManager";
import { ArmyState } from "../constant/ArmyState";
import Tiles from "../map/space/constant/Tiles";
import PlayerTreasureMsg = com.road.yishi.proto.treasuremap.PlayerTreasureMsg;
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import { EmWindow } from '../constant/UIDefine';

/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-12-16 21:24
 */
export default class TreasureMapManager {
    private static _instance: TreasureMapManager

    public static get Instance(): TreasureMapManager {
        if (!TreasureMapManager._instance) {
            TreasureMapManager._instance = new TreasureMapManager();
        }
        return TreasureMapManager._instance;
    }

    private _model: TreasureMapModel;
    public get model(): TreasureMapModel {
        return this._model;
    }

    constructor() {
        this._model = new TreasureMapModel();
    }

    public setup() {
        ServerDataManager.listen(S2CProtocol.U_C_TREASUREMAP_INFO, this, this.__treasureMapInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_TREASUREMAP_REWARD, this, this.__treasureMapRewardHandler);
    }

    private __treasureMapInfoHandler(pkg: PackageIn) {
        let msg: PlayerTreasureMsg = pkg.readBody(PlayerTreasureMsg) as PlayerTreasureMsg;
        this._model.joinCount = msg.joinCount;
        this._model.rewardCount = msg.rewardCount;
        this._model.index = msg.index;
        this._model.templateIds = msg.templateIds;
        this._model.isFirstQuest = msg.isFirstQuest;
        this._model.isFirstGet = msg.isFirstGet;
        this._model.isFirstUse = msg.isFirstUse;
        this._model.commit();
    }

    private __treasureMapRewardHandler(pkg: PackageIn) {
        let content: string = LangManager.Instance.GetTranslation("managers.TreasureMapManager.TipTxt1");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.__requestFrameCloseHandler.bind(this))
    }

    private __requestFrameCloseHandler(b: boolean, flag: boolean) {
        if (b) {
            TreasureMapSocketOutManager.sendReceiveTreasureMap(this._model.lastTreasureMap.pos, true);
        }
        else {
            TreasureMapSocketOutManager.sendReceiveTreasureMap(this._model.lastTreasureMap.pos, false);
        }
    }

    public get needShowTip(): boolean {
        let currentTime: number = new Date().getTime();
        if (this._model.lastGetTime != 0 && currentTime - this._model.lastGetTime <= 1000 * TreasureMapModel.GET_TIP_DELTA) {
            return false;
        }
        this._model.lastGetTime = currentTime;
        return true;
    }

    public isCurrentTreasureMap(info: GoodsInfo): boolean {
        if (info && info.id == SharedManager.Instance.currentTreasureMapId) {
            return true;
        }
        return false;
    }

    public useTreasureMap(info: GoodsInfo) {
        this._model.lastTreasureMap = info;
        SharedManager.Instance.currentTreasureMapId = info.id;
        SharedManager.Instance.saveCurrentTreasureMapId();
        let msg: string = "";
        if (this._model.rewardCount >= this._model.rewardMax) {
            msg = LangManager.Instance.GetTranslation("managers.TreasureMapManager.TipTxt6");
            MessageTipManager.Instance.show(msg);
            return;
        }
        if (this.checkTreasureMap(info)) {
            if (!FreedomTeamManager.Instance.teamIsFull) {
                let content: string = LangManager.Instance.GetTranslation("map.internals.view.treasuremap.TreasureMapUseFrame.digBtnAlertTxt1", 4);
                let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
                let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
                let prompt: string = LangManager.Instance.GetTranslation("map.internals.view.treasuremap.TreasureMapUseFrame.digBtnAlertTitle");
                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, info, prompt, content, confirm, cancel, this.digBtnAlertCallBack.bind(this))
            }
            else {
                TreasureMapSocketOutManager.sendUseTreasureMap(info.pos);
            }
        }
        else {
            //打开藏宝图界面
            FrameCtrlManager.Instance.open(EmWindow.TreasureMapWnd, info);
        }
    }

    private digBtnAlertCallBack(b: boolean, useBind: boolean, info: GoodsInfo) {
        if (b) {
            TreasureMapSocketOutManager.sendUseTreasureMap(info.pos);
        }
    }

    private checkTreasureMap(info: GoodsInfo): boolean {
        let armyView: any;
        let msg: string = "";
        if (!this.army || this.army.mapId != info.randomSkill1) {
            msg = LangManager.Instance.GetTranslation("managers.TreasureMapManager.TipTxt2");
            MessageTipManager.Instance.show(msg);
            return false;
        }
        if (this.army instanceof SpaceArmy) {
            armyView = SpaceManager.Instance.controller.getArmyView(this.army);
        }
        else if (this.army instanceof CampaignArmy) {
            armyView = CampaignManager.Instance.controller.getArmyView(this.army);
        }
        let origin: Laya.Point = new Laya.Point(armyView.x, armyView.y);
        let target: Laya.Point = new Laya.Point(info.randomSkill2, info.randomSkill3);
        let distance: number = this.getDistance(origin, target);
        let direction: string = this.getDirection(origin, target);
        if (distance > TreasureMapModel.DISTANCE3 * Tiles.WIDTH) {
            msg = LangManager.Instance.GetTranslation("managers.TreasureMapManager.TipTxt3", direction);
            MessageTipManager.Instance.show(msg);
            return false;
        }
        else if (this.eqOrLittleFloat(distance, TreasureMapModel.DISTANCE3 * Tiles.WIDTH) && distance > TreasureMapModel.DISTANCE2 * Tiles.WIDTH) {
            msg = LangManager.Instance.GetTranslation("managers.TreasureMapManager.TipTxt4", direction);
            MessageTipManager.Instance.show(msg);
            return false;
        }
        else if (this.eqOrLittleFloat(distance, TreasureMapModel.DISTANCE2 * Tiles.WIDTH) && distance > TreasureMapModel.DISTANCE1 * Tiles.WIDTH) {
            msg = LangManager.Instance.GetTranslation("managers.TreasureMapManager.TipTxt5", direction);
            MessageTipManager.Instance.show(msg);
            return false;
        }
        return true;
    }

    private getDistance(origin: Laya.Point, target: Laya.Point): number {
        let distance: number;
        let distanceX: number = Math.abs(target.x - origin.x);
        let distanceY: number = Math.abs(target.y - origin.y);
        if (distanceX > distanceY) {
            distance = distanceX;
        }
        else {
            distance = distanceY;
        }
        return distance;
    }

    private getDirection(origin: Laya.Point, target: Laya.Point): string {
        let direction: string = LangManager.Instance.GetTranslation("managers.TreasureMapManager.DirectionTxt1");
        let dy: number = target.y - origin.y;
        let dx: number = target.x - origin.x;
        let radian: number = Math.atan2(dy, dx);
        let degree: number = radian * 180 / Math.PI;
        if (this.eqOrBigFloat(degree, -25.0) && this.eqOrLittleFloat(degree, 25.0)) {
            direction = LangManager.Instance.GetTranslation("managers.TreasureMapManager.DirectionTxt1");
        }
        else if (-65.0 < degree && degree < -25.0) {
            direction = LangManager.Instance.GetTranslation("managers.TreasureMapManager.DirectionTxt2");
        }
        else if (this.eqOrBigFloat(degree, -115.0) && this.eqOrLittleFloat(degree, -65.0)) {
            direction = LangManager.Instance.GetTranslation("managers.TreasureMapManager.DirectionTxt3");
        }
        else if (-155.0 < degree && degree < -115.0) {
            direction = LangManager.Instance.GetTranslation("managers.TreasureMapManager.DirectionTxt4");
        }
        else if (this.eqOrBigFloat(degree, 155.0) || this.eqOrLittleFloat(degree, -155.0)) {
            direction = LangManager.Instance.GetTranslation("managers.TreasureMapManager.DirectionTxt5");
        }
        else if (115.0 < degree && degree < 155.0) {
            direction = LangManager.Instance.GetTranslation("managers.TreasureMapManager.DirectionTxt6");
        }
        else if (this.eqOrBigFloat(degree, 65.0) && this.eqOrLittleFloat(degree, 115.0)) {
            direction = LangManager.Instance.GetTranslation("managers.TreasureMapManager.DirectionTxt7");
        }
        else if (25.0 < degree && degree < 65.0) {
            direction = LangManager.Instance.GetTranslation("managers.TreasureMapManager.DirectionTxt8");
        }
        return direction;
    }

    public eqOrBigFloat(a: number, b: number, tol: number = 1e-12): boolean {
        return a > b || this.eqFloat(a, b, tol);
    }

    public eqOrLittleFloat(a: number, b: number, tol: number = 1e-12): boolean {
        return a < b || this.eqFloat(a, b, tol);
    }

    public eqFloat(a: number, b: number, tol: number = 1e-12): boolean {
        return Math.abs(a - b) < tol;
    }

    private updateTarget(target: Laya.Point) {
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
            SpaceManager.Instance.model.updateWalkTarget(target);
        }
        else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            CampaignManager.Instance.mapModel.updateWalkTarget(target);
        }
    }

    private get army(): BaseArmy {
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
            return SpaceManager.Instance.model.selfArmy as BaseArmy;
        }
        else if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            return CampaignManager.Instance.mapModel.selfMemberData as BaseArmy;
        }
        return null;
    }

    /**
     * 检查藏宝图增援
     *
     */
    public checkReinforce(): boolean {
        let userId: number;
        if (PlayerManager.Instance.currentPlayerModel.reinforce) {
            userId = PlayerManager.Instance.currentPlayerModel.reinforce.userId;
            if (!FreedomTeamManager.Instance.inMyTeam(userId)) {
                return false;
            }
            let state: number = PlayerManager.Instance.currentPlayerModel.reinforce.state;
            if (state != ArmyState.STATE_FIGHT) {
                return false;
            }
            TreasureMapSocketOutManager.sendReinforceTreasureMap(userId);
            PlayerManager.Instance.currentPlayerModel.reinforce = null;
            return true;
        }
        if (this.model.reinforceTarget) {
            userId = this.model.reinforceTarget.userId;
            if (!FreedomTeamManager.Instance.inMyTeam(userId)) {
                return false;
            }
            let mapId: number = this.model.reinforceTarget.mapId;
            if (this.army.mapId != mapId) {
                return false;
            }
            let posX: number = this.model.reinforceTarget.posX;
            let posY: number = this.model.reinforceTarget.posY;
            let armyView: any;
            if (this.army instanceof SpaceArmy) {
                armyView = SpaceManager.Instance.controller.getArmyView(this.army);
            }
            else if (this.army instanceof CampaignArmy) {
                armyView = CampaignManager.Instance.controller.getArmyView(this.army);
            }
            let origin: Laya.Point = new Laya.Point(armyView.x, armyView.y);
            let target: Laya.Point = new Laya.Point(posX, posY);
            let distance: number = this.getDistance(origin, target);
            if (distance >= 40) {
                return false;
            }
            TreasureMapSocketOutManager.sendReinforceTreasureMap(userId);
            this.model.reinforceTarget = null;
            return true;
        }
        return false;
    }

}