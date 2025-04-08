import { PackageIn } from "../../core/net/PackageIn";
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import SceneType from "../map/scene/SceneType";
import DisplayLoader from "../utils/DisplayLoader";
import { SocketDataProxyInfo } from "./data/SocketDataProxyInfo";
import { SocketDataProxyModel } from "./data/SocketDataProxyModel";
import { BaseSceneSocketDataProxy } from "./scene/BaseSceneSocketDataProxy";
import { CampaignSocketDataProxy } from "./scene/CampaignSocketDataProxy";
import { SpaceSocketDataProxy } from "./scene/SpaceSocketDataProxy";
import { VehicleSocketDataProxy } from "./scene/VehicleSocketDataProxy";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import SpaceManager from '../map/space/SpaceManager';
import CampaignSocketManger from '../manager/CampaignSocketManger';
import SceneCreate from "../map/scene/SceneCreate";


/**
 *
 * 针对分模块出现的一种对sokcet数据代管理
 * 当需要进入指定模块时, 未加载完该模块, 但是接收到该模块的数据的处理机制
 * 先将socket数据保存在一个临时代理类中, 进入到指定模块一次性读出来
 */
export class SocketDataProxyManager extends GameEventDispatcher {
    private _model: SocketDataProxyModel;
    private _sceneList: Map<string, any>;
    private _hasSpaceManager: boolean = false;
    private _hasCampaignManager: boolean = false;
    private _hasVehicleManager: boolean = false;
    private static _instance: SocketDataProxyManager;

    public static get Instance(): SocketDataProxyManager {
        if (!SocketDataProxyManager._instance) {
            SocketDataProxyManager._instance = new SocketDataProxyManager();
        }
        return SocketDataProxyManager._instance;
    }

    constructor() {
        super();
        this._model = new SocketDataProxyModel();
        this._sceneList = new Map();
    }

    /**
     *
     *外部加入队列的包, 往往是创建场景的数据
     *
     */
    public addCreateSceneQueue(pkg: PackageIn, sceneType: string, event: string, isSave: boolean = true) {
        this.chekckVehicle(pkg, sceneType, event, isSave);
    }

    /**
     * 读出指定场景proxy保存的数据
     * @param sceneType 指定场景名
     *
     */
    public readSocketDataByType(sceneType: string) {
        let scene: BaseSceneSocketDataProxy = this._sceneList[sceneType] as BaseSceneSocketDataProxy;
        if (scene) {
            this._model.readSceneSocketData(sceneType);
            scene.dispose();
        }
        delete this._sceneList[sceneType];
        scene = null;

    }

    /**
     * 找到指定场景的入口
     * @param pkg
     * @param sceneType
     *
     */
    private chekckVehicle(pkg: PackageIn, sceneType: string, event: string, isSave: boolean) {
        if (pkg.code == S2CProtocol.U_C_CAMPAIGN_CREATE || pkg.code == S2CProtocol.U_C_PLAYER_SPACE_CREATE) {
            let base: BaseSceneSocketDataProxy = this._sceneList[sceneType] as BaseSceneSocketDataProxy;
            if (base) {
                base.dispose();
            }
            this._model.clearSceneSocketData(sceneType);
            delete this._sceneList[sceneType];
            if (isSave) {
                this._model.addSocketData(new SocketDataProxyInfo(pkg, event), sceneType);
            }
            if (sceneType == SceneType.CAMPAIGN_MAP_SCENE) {
                if (this._hasCampaignManager) {
                    CampaignSocketManger.Instance.setup();
                } else {
                    this._sceneList[sceneType] = new CampaignSocketDataProxy(this._model);
                    this._hasCampaignManager = true;
                }
            } else if (sceneType == SceneType.SPACE_SCENE) {
                if (this._hasSpaceManager) {
                    SpaceManager.Instance.setup();
                } else {
                    this._sceneList[sceneType] = new SpaceSocketDataProxy(this._model);
                    this._hasSpaceManager = true;
                }
            } else if (sceneType == SceneType.VEHICLE) {
                if (this._hasVehicleManager) {

                } else {
                    this._sceneList[sceneType] = new VehicleSocketDataProxy(this._model);
                }
            }
        }
    }

    public get model(): SocketDataProxyModel {
        return this._model;
    }

}