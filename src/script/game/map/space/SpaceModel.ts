// @ts-nocheck
import { CampaignMapEvent, OuterCityEvent } from "../../constant/event/NotificationEvent";
import { ArmyManager } from '../../manager/ArmyManager';
import { PlayerManager } from '../../manager/PlayerManager';
import { SwitchPageHelp } from '../../utils/SwitchPageHelp';
import SpaceNodeType from "./constant/SpaceNodeType";
import Tiles from "./constant/Tiles";
import { FloorMapInfo } from "./data/FloorMapInfo";
import SpaceArmy from "./data/SpaceArmy";
import { SpaceNode } from "./data/SpaceNode";
import SpaceManager from "./SpaceManager";
import { MapUtils } from "./utils/MapUtils";
import SpacePlayerMoveMsg = com.road.yishi.proto.campaign.SpacePlayerMoveMsg;
import MathHelper from "../../../core/utils/MathHelper";
import { TempleteManager } from "../../manager/TempleteManager";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";

/**
 * 天空之城Model
 *
 */
export class SpaceModel extends FloorMapInfo {
    /** BgLayer*/
    public bgLayer: Object;

    private _allArmysDict: Map<number, SpaceArmy>;
    private _mapNodesData: SpaceNode[];
    private _checkTempPoint: Laya.Point;
    private _checkNodePoint: Laya.Point;
    private _glowTarget: Laya.Sprite;

    public staticMovies: SpaceNode[];
    private _selectNode: SpaceNode;
    public beingVisitNode: SpaceNode;
    public checkNodeId: number = 0;
    public nextPoint: Laya.Point;

    public onCollectionId: number = 0;

    //飞行坐骑列表
    private _flyMountList = ["7001"];

    constructor() {
        super();
        this._allArmysDict = new Map();
        this._mapNodesData = [];
        this._checkTempPoint = new Laya.Point();
        this._checkNodePoint = new Laya.Point();
        this.staticMovies = [];
        let flyMountCfg = TempleteManager.Instance.getConfigInfoByConfigName("Fly_Mount");
        if (flyMountCfg) {
            this._flyMountList = flyMountCfg.ConfigValue.split(",");
        }
    }

    public get selectNode(): SpaceNode {
        return this._selectNode;
    }

    public set selectNode(value: SpaceNode) {
        this._selectNode = value;
    }

    public currentSceneMovies: Object[];
    public currentSceneTops: Object[];

    public set currentFloorData(arr: any[]) {
        this.currentSceneMovies = [];
        this.currentSceneTops = [];
        for (const key in this.moviesData) {
            if (this.moviesData.hasOwnProperty(key)) {
                const element = this.moviesData[key];
                this.currentSceneMovies = this.currentSceneMovies.concat(element);
            }
        }

        for (const key in this.topsData) {
            if (this.topsData.hasOwnProperty(key)) {
                const element = this.topsData[key];
                this.currentSceneTops = this.currentSceneTops.concat(element);
            }
        }
        this.dispatchEvent(OuterCityEvent.CURRENT_CONFIG_CHANGE, { movies: this.currentSceneMovies, tops: this.currentSceneTops })
    }

    protected sloveRectData(id: string): Object {
        let start: Laya.Point = MapUtils.getStartPoint(id);
        let key: string = start.x + "," + start.y;
        let data: Object = {};
        data["floor"] = this.floorData[id];
        if (this.topsData) {
            data["tops"] = this.topsData[key];
        }
        if (this.moviesData) {
            data["movies"] = this.moviesData[key];
        }
        return data;
    }

    public get glowTarget(): Laya.Sprite {
        return this._glowTarget;
    }

    public set glowTarget(value: Laya.Sprite) {
        if (this._glowTarget == value) {
            return;
        }
        if (this._glowTarget && this._glowTarget.hasOwnProperty("setNormalFilter")) {
            this._glowTarget["setNormalFilter"]();
            this._glowTarget = null;
        }
        this._glowTarget = value;
        if (this._glowTarget && this._glowTarget.hasOwnProperty("setGlowFilter")) {
            this._glowTarget["setGlowFilter"]();
        }
    }

    public moveToVisible(army: SpaceArmy) {
        this.dispatchEvent(CampaignMapEvent.MOVE_TO_VISIBLE, army);
    }

    public moveToUnVisible(army: SpaceArmy) {
        this.dispatchEvent(CampaignMapEvent.MOVE_TO_UNVISIBLE, army);
    }

    public addBaseArmy(army: SpaceArmy) {
        if (!this._allArmysDict.has(army.userId)) {
            this.dispatchEvent(OuterCityEvent.ADD_GARRISON, army);
        }
        this._allArmysDict.set(army.userId, army);
    }

    public removeBaseArmyByArmyId(userId: number): SpaceArmy {
        let army: SpaceArmy = this._allArmysDict.get(userId);
        if (army) {
            this._allArmysDict.delete(userId);
            this.dispatchEvent(OuterCityEvent.REMOVE_ARMY, army);
        }
        return army;
    }

    public getBaseArmyByUserId(userId: number): SpaceArmy {
        return this._allArmysDict.get(userId);
    }

    public get allArmyDict(): Map<number, SpaceArmy> {
        return this._allArmysDict;
    }

    public getWalkable($x: number, $y: number): boolean {
        $x = Number($x);
        $y = Number($y);
        if (!this.mapTielsData) {//避免战场结束返回天空之城时偶现报错
            return false;
        }
        return this.mapTielsData[$x + "_" + $y] ? true : false;
    }

    public getNeighborII($x: number, $y: number): Laya.Point {
        $x = Number($x);
        $y = Number($y);
        for (let i: number = 1; i < 10; i++) {
            let p: Laya.Point = this.find(i, $x, $y);
            if (p) {
                return p;
            }
        }
        return null;
    }

    private find(i: number, $x: number, $y: number): Laya.Point {
        for (let a: number = -i; a < i; a++) {
            if (this.getPointValue($x + a, $y + i)) {
                return new Laya.Point($x + a, $y + i);
            }
            if (this.getPointValue($x + a, $y - i)) {
                return new Laya.Point($x + a, $y - i);
            }
            if (this.getPointValue($x + i, $y + a)) {
                return new Laya.Point($x + i, $y + a);
            }
            if (this.getPointValue($x - i, $y + a)) {
                return new Laya.Point($x - i, $y + a);
            }
        }
        return null;
    }

    public get isOnObstacle(): boolean {
        var armyView: any = SpaceManager.Instance.controller.getArmyView(this.selfArmy);
        if (!this.mapTielsData) {
            return false;
        }
        if (!this.selfArmy || !armyView) {
            return false;
        }
        if (this.getPointValue(armyView.x / Tiles.WIDTH, armyView.y / Tiles.HEIGHT)) {
            return false;
        }
        var point: Laya.Point = this.find(2, parseInt((armyView.x / Tiles.WIDTH).toString()), parseInt((armyView.y / Tiles.HEIGHT).toString()));
        if (point) {
            return false;
        }
        return true;
    }

    public get selfArmy(): SpaceArmy {
        return this.getBaseArmyByUserId(ArmyManager.Instance.army.userId);
    }

    public checkOutScene(): boolean {
        let flag: boolean = false;
        let data: SpaceArmy = SpaceManager.Instance.model.selfArmy;
        let armyView: any = SpaceManager.Instance.controller.getArmyView(data);
        let xMin = StageReferance.stageWidth / 2;
        let yMin = StageReferance.stageHeight / 2;
        let mapView = SpaceManager.Instance.mapView;
        let xMax = this.mapTempInfo.Width - StageReferance.stageWidth / 2;
        let yMax = this.mapTempInfo.Height - StageReferance.stageHeight / 2;
        let centerX: number = Math.abs(StageReferance.stageWidth / 2 - mapView.x);
        let centerY: number = Math.abs(StageReferance.stageHeight / 2 - mapView.y);
        if (centerX < xMin) {
            centerX = xMin
        }
        else if (centerX > xMax) {
            centerX = xMax
        }
        if (centerY < yMin) {
            centerY = yMin
        }
        else if (centerY > yMax) {
            centerY = yMax
        }
        if ((Math.abs(armyView.x - centerX) > StageReferance.stageWidth / 2) || (Math.abs(armyView.y - centerY) > StageReferance.stageHeight / 2))
        {
            flag = true;
        }
        return flag;
    }
    
    public getPointValue($x: number, $y: number): boolean {
        $x = parseInt($x.toString());
        $y = parseInt($y.toString());
        if (!this.mapTielsData) {//避免战场结束返回天空之城时偶现报错
            return false;
        }
        return this.mapTielsData[$x + "_" + $y] ? true : false;
    }

    /**
     * 构建节点的handlerRangePoints
     *
     */
    public buildMapNodesData() {
        if (!this.mapNodesData) {
            return;
        }
        for (let i = 0; i < this.mapNodesData.length; i++) {
            if (this.mapNodesData[i].info.types == SpaceNodeType.MOVEMENT) {
                continue;
            }
            this.mapNodesData[i].initHandlerRangePoints(this);
        }
    }

    /**
     * 当前场景所有节点
     *
     */
    public get mapNodesData(): Array<SpaceNode> {
        return this._mapNodesData;
    }

    /**
     * 更新当前场景的所有节点
     *
     */
    public set mapNodesData(value: Array<SpaceNode>) {
        this._mapNodesData = value;
        this.dispatchEvent(OuterCityEvent.CURRENT_NPC_POS, value);
    }

    /**
     * 不需要直接选中也能触发的节点
     * 比如传送点, 只要行走到传送点的范围即可触发
     *
     */
    public getHandlerNode($x: number, $y: number): SpaceNode {
        this._checkTempPoint.x = $x;
        this._checkTempPoint.y = $y;
        let dis: number = 0;
        if (!this._mapNodesData) {
            return;
        }
        let len: number = this._mapNodesData.length;
        for (let i: number = 0; i < len; i++) {
            let spaceNode: SpaceNode = this._mapNodesData[i];
            switch (spaceNode.info.types) {
                case SpaceNodeType.MOVEMENT:
                case SpaceNodeType.BORN_POINT:
                    break;
                default:
                    this._checkNodePoint.x = spaceNode.posX;
                    this._checkNodePoint.y = spaceNode.posY;
                    dis = MathHelper.distance(this._checkTempPoint.x, this._checkTempPoint.y, this._checkNodePoint.x, this._checkNodePoint.y)
                    if (dis <= spaceNode.handlerRange) {
                        return spaceNode;
                    }
                    break;
            }
        }
        return null;
    }

    public getMapNodeById(id: number): SpaceNode {
        if (!this._mapNodesData) {
            return null;
        }
        for (let node of this._mapNodesData) {
            if (node.info.id == id) {
                return node;
            }
        }
        return null;
    }

    public getAroundWalkPoint($x: number, $y: number): Laya.Point {
        if (!this.selfArmy) {
            return null;
        }
        var flying: boolean = this.isFlying(this.selfArmy.mountTemplateId);
        if (flying) {
            return new Laya.Point($x / Tiles.WIDTH, $y / Tiles.HEIGHT);
        }
        else {
            return super.getAroundWalkPoint($x, $y);
        }
    }

    public isFlying(mountTemplateId: number): boolean {
        if (!this.mapTielsData) {
            return false;
        }
        if (this._flyMountList.indexOf(String(mountTemplateId)) != -1) {
            return true;
        }
        return false;
    }

    public updateWalkTarget(target: Laya.Point) {
        this.dispatchEvent(CampaignMapEvent.UPDATE_WALK_TARGET, target);
    }

    public moveArmyTo(msg: SpacePlayerMoveMsg) {
        this.dispatchEvent(CampaignMapEvent.MOVE_PATHS_ARMY, msg);
    }

    public canLand(mountTemplateId: number = 0): boolean {
        if (!this.mapTielsData) {
            return true;
        }
        if (SwitchPageHelp.isInCampaign) {
            return true;
        }
        if (SwitchPageHelp.isInSpace) {
            if (!this.isOnObstacle) {
                return true;
            }
        }
        else {
            if (!PlayerManager.Instance.currentPlayerModel.isOnObstacle) {
                return true;
            }
        }
        if (this.isFlying(mountTemplateId)) {
            return true;
        }
        return false;
    }

    public getUserArmyByUserId(userId: number): SpaceArmy {
        return this._allArmysDict.get(userId);
    }
}
