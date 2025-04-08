import Logger from "../../../../../core/logger/Logger";
import { OuterCityEvent } from "../../../../constant/event/NotificationEvent";
import MediatorMananger from "../../../../manager/MediatorMananger";
import SimpleBuildingFilter from "../../../castle/filter/SimpleBuildingFilter";
import NodeResourceType from "../../constant/NodeResourceType";
import { NodeState } from "../../constant/NodeState";
import { PosType } from "../../constant/PosType";
import Tiles from "../../constant/Tiles";
import { PhysicInfo } from "../../data/PhysicInfo";
import { SpaceNode } from "../../data/SpaceNode";
import SpaceManager from "../../SpaceManager";
import { SpaceModel } from "../../SpaceModel";
import { MapPhysicsBase } from "../physics/MapPhysicsBase";
import { PhysicsStaticView } from "../physics/PhysicsStaticView";
import { SpacePhysicsView } from "../physics/SpacePhysicsView";
import ResMgr from '../../../../../core/res/ResMgr';

/**
 * 天空之城建筑显示层
 *
 */
export class SpaceBuildingLayer extends Laya.Sprite {
    public static NAME: string = "map.space.view.layer.SpaceBuildingLayer";
    private _mediatorKey: string;

    private _filter: SimpleBuildingFilter = new SimpleBuildingFilter();
    private _items: { [key: string]: MapPhysicsBase };

    private _buttomLayer: Laya.Sprite;
    private _centerLayer: Laya.Sprite;
    private _topLayer: Laya.Sprite;
    private _model: SpaceModel;
    private _buildList: Array<MapPhysicsBase> = new Array<MapPhysicsBase>();

    constructor() {
        super();
        this.init();
        this.addEvent();
    }

    private init() {
        this._model = SpaceManager.Instance.model;
        this._buttomLayer = new Laya.Sprite();
        this._centerLayer = new Laya.Sprite();
        this._topLayer = new Laya.Sprite();
        this.addChild(this._buttomLayer);
        this.addChild(this._centerLayer);
        this.addChild(this._topLayer);
        this._centerLayer.mouseEnabled = false;
        this._items = {};
        this.initNpcView(this._model.mapNodesData);
    }

    private async initNpcView(arr: Array<SpaceNode>) {
        // Logger.xjy("[SpaceBuildingLayer]initNpcView", arr)
        let ima: MapPhysicsBase;
        if (!arr) {
            return;
        }
        let len: number = arr.length;
        let node: SpaceNode;
        for (let i = 0; i < len; i++) {
            node = arr[i];
            if (node.resource == NodeResourceType.Image) {
                continue;
            }
            if (node.info && this._items) {
                ima = this._items[node.info.id] as MapPhysicsBase;
            }
            if (!ima) {
                ima = this.createNodeView(node);
            }
            ima.info = node;
            ima.filter = this._filter;
            if (node.fixX != 0 && node.fixY != 0) {
                ima.x = node.fixX
                ima.y = node.fixY
            }
            else {
                ima.x = node.info.posX * Tiles.WIDTH
                ima.y = node.info.posY * Tiles.HEIGHT
            }
            if (this._items) {
                this._items[node.info.id] = ima;
            }
            node.nodeView = ima;
            if (node.info.names) {
                // ima.tipData = this.createItemTips(node.info,node);
            }
            this._centerLayer.addChild(ima);
            if (this._buildList) {
                this._buildList.push(ima);
            }
            SpaceManager.Instance.controller.addBuild(ima);
        }
    }

    private createNodeView(info: SpaceNode): MapPhysicsBase {
        return new SpacePhysicsView();
    }

    private async addMoviesByLayer(arr: any[], layer: number) {
        if (!arr || arr.length <= 0) {
            return;
        }
        let len: number = arr.length;
        let info: any;
        for (let i: number = 0; i < len; i++) {
            info = arr[i];
            let node: PhysicsStaticView = new PhysicsStaticView();
            let nodeInfo: SpaceNode = new SpaceNode();
            let pInfo: PhysicInfo = new PhysicInfo();
            pInfo.types = PosType.MOVIE;
            pInfo.state = NodeState.EXIST;
            pInfo.names = info.url;
            pInfo.posX = parseInt((info.x / Tiles.WIDTH).toString());
            pInfo.posY = parseInt((info.y / Tiles.HEIGHT).toString());
            nodeInfo.info = pInfo;
            node.rotation = info.rotation;
            node.info = nodeInfo;

            await ResMgr.Instance.loadResAsync(node.resourcesPath).then((resConfig) => {
                if (node) {
                    node.x = info.x
                    node.y = info.y
                }
                if (info.hasOwnProperty("scaleX")) {
                    node.scaleX = info.scaleX;
                }
                if (info.hasOwnProperty("scaleY")) {
                    node.scaleY = info.scaleY;
                }
                if (this._items) {
                    this._items[node.x + "," + node.y] = node;
                }
                nodeInfo.nodeView = node;
                nodeInfo.layer = layer;
                this._model.staticMovies.push(nodeInfo);
                if (layer == 0) {
                    this._buttomLayer.addChild(node);
                }
                else if (layer == 2) {
                    this._topLayer.addChild(node);
                }
            });
        }
    }

    private initRegister() {
        var arr: any[] = [];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, SpaceBuildingLayer.NAME);
    }

    private addEvent() {
        this._model.addEventListener(OuterCityEvent.CURRENT_NPC_POS, this.__curNpcHandler, this);
        this._model.addEventListener(OuterCityEvent.CURRENT_CONFIG_CHANGE, this.__moviesHandler, this);
        // addEventListener(Laya.Event.ADDED, this.__addToStageHandler);
        // this.__addToStageHandler(null);
    }

    private removeEvent() {
        this._model.removeEventListener(OuterCityEvent.CURRENT_NPC_POS, this.__curNpcHandler, this);
        this._model.removeEventListener(OuterCityEvent.CURRENT_CONFIG_CHANGE, this.__moviesHandler, this);
        // removeEventListener(Laya.Event.ADDED, this.__addToStageHandler);
    }

    private __curNpcHandler(arr: any[]) {
        this.initNpcView(arr);
    }

    private __moviesHandler(data: any) {
        Logger.xjy("[SpaceBuildingLayer]__moviesHandler", data)
        var obj: any = data;
        if (obj) {
            this.addMoviesByLayer(obj.movies, 0);
            this.addMoviesByLayer(obj.tops, 2);
        }
    }

    private __addToStageHandler(evt: Event) {
        this.initRegister();
    }

    public onClickHandler(evt: Laya.Event): boolean {
        let target: any = evt.target;
        // if(target["mouseClickHandler"])
        // {
        //     return target.mouseClickHandler(evt);
        // }
        if (evt.target instanceof SpacePhysicsView) {
            let buildTarget: SpacePhysicsView = evt.target;
            if (buildTarget) {
                if (buildTarget.mouseClickHandler(evt)) {
                    return true;
                }
            }
        }
        for (let i: number = 0; i < this._buildList.length; i++) {
            let buildTarget: MapPhysicsBase = this._buildList[i];
            if (buildTarget.mouseClickHandler(evt)) {
                return true;
            }
        }
        return false;
    }

    public mouseOverHandler(evt: Laya.Event): boolean {
        let buildTarget: any = evt.target;
        if (buildTarget.hasOwnProperty("mouseOverHandler")) {
            return buildTarget.mouseOverHandler(evt);
        }
        return false;
    }

    public mouseOutHandler(evt: Laya.Event): boolean {
        let buildTarget: any = evt.target;
        if (buildTarget.hasOwnProperty("mouseOutHandler")) {
            return buildTarget.mouseOutHandler(evt);
        }
        return false;
    }

    public mouseMoveHandler(evt: Laya.Event): boolean {
        let buildTarget: any = evt.target;
        if (buildTarget.hasOwnProperty("mouseMoveHandler")) {
            if (buildTarget.mouseMoveHandler(evt)) {
                return true;
            }
        }
        for (let i: number = 0; i < this._buildList.length; i++) {
            let buildTarget: MapPhysicsBase = this._buildList[i];
            if (buildTarget.mouseMoveHandler(evt)) {
                return true;
            }
        }
        return false;
    }

    public get buildList(): Array<MapPhysicsBase> {
        return this._buildList;
    }

    public dispose() {
        MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
        this.removeEvent();
        SpaceManager.Instance.controller.buildList.length = 0;
        for (const key in this._items) {
            let item: MapPhysicsBase = this._items[key];
            if (item) {
                item.dispose();
            }
        }
        // for (let item of this._buildList) {
        //     if (item) item.dispose();
        // }
        this._buildList = null;
        this._items = null;
        this._filter = null;
        this.removeSelf();
    }

    public get center(): Laya.Sprite {
        return this._centerLayer;
    }

    public get buttom(): Laya.Sprite {
        return this._buttomLayer;
    }

    public get top(): Laya.Sprite {
        return this._topLayer;
    }
}