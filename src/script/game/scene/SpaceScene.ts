import LangManager from '../../core/lang/LangManager';
import Logger from '../../core/logger/Logger';
import { WalkRectScanUtils } from '../../core/utils/WalkRectScanUtils';
import { FreedomTeamEvent, NotificationEvent, SceneEvent, SpaceEvent } from '../constant/event/NotificationEvent';
import { IBaseSceneView } from '../interfaces/IBaseSceneView';
import { ArmyManager } from '../manager/ArmyManager';
import { MopupManager } from '../manager/MopupManager';
import { NotificationManager } from '../manager/NotificationManager';
import { PlayerManager } from '../manager/PlayerManager';
import { SpaceSocketManager } from '../manager/SpaceSocketManager';
import { SpaceTemplateManager } from '../manager/SpaceTemplateManager';
import { PreCampaignData } from '../map/campaign/PreCampaignData';
import { SpacePreCampaignData } from '../map/campaign/SpacePreCampaignData';
import { AcorrsLineGrid } from '../map/findPath/AcorrsLineGrid';
import { FindPath8 } from '../map/findPath/FindPath8';
import { MapElmsLibrary } from '../map/libray/MapElmsLibrary';
import { BaseSceneView } from '../map/scene/BaseSceneView';
import { SceneManager } from '../map/scene/SceneManager';
import SceneType from '../map/scene/SceneType';
import SpaceNodeType from '../map/space/constant/SpaceNodeType';
import Tiles from '../map/space/constant/Tiles';
import { MapData } from '../map/space/data/MapData';
import { MouseData } from '../map/space/data/MouseData';
import SpaceArmy from '../map/space/data/SpaceArmy';
import { SpaceNode } from '../map/space/data/SpaceNode';
import SpaceManager from '../map/space/SpaceManager';
import { SpaceModel } from '../map/space/SpaceModel';
import { MapUtils } from '../map/space/utils/MapUtils';
import { SpaceArmyViewHelper } from '../map/space/utils/SpaceArmyViewHelper';
import { SpaceMapViewHelper } from '../map/space/utils/SpaceMapViewHelper';
import { SpaceSceneMapView } from '../map/space/view/SpaceSceneMapView';
import SmallMapBar from '../module/home/SmallMapBar';
import HomeWnd from '../module/home/HomeWnd';
import ObjectUtils from '../../core/utils/ObjectUtils';
import LoadingSceneWnd from '../module/loading/LoadingSceneWnd';
import MainToolBar from '../module/home/MainToolBar';
import AudioManager from '../../core/audio/AudioManager';
import { SoundIds } from '../constant/SoundIds';
import { MessageTipManager } from '../manager/MessageTipManager';
import UIManager from '../../core/ui/UIManager';
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import { EmWindow } from '../constant/UIDefine';
import { RoomSceneType } from '../constant/RoomDefine';
import { SpaceNpcView } from "../map/space/view/physics/SpaceNpcView";
import { SpaceArmyView } from "../map/space/view/physics/SpaceArmyView";
import { MapPhysicsBase } from "../map/space/view/physics/MapPhysicsBase";
import { SpaceWalkLayer } from "../map/space/view/layer/SpaceWalkLayer";
import { SpaceBuildingLayer } from "../map/space/view/layer/SpaceBuildingLayer";
import { SharedManager } from '../manager/SharedManager';
import BattleReportMsg = com.road.yishi.proto.battle.BattleReportMsg;
import { SpaceSocketOutManager } from '../map/space/SpaceSocketOutManager';
import { PetCampaignManager } from '../manager/PetCampaignManager';
import { ResRefCountManager } from '../managerRes/ResRefCountManager';
import FaceSlapManager from '../manager/FaceSlapManager';
import { SpaceMapCameraMediator } from '../mvc/mediator/SpaceMapCameraMediator';
import WorldBossManager from '../manager/WorldBossManager';
import { RemotePetController } from '../module/remotepet/RemotePetController';

/**
 * @author:pzlricky
 * @data: 2020-11-10 14:59
 * @description 主城
 */
export default class SpaceScene extends BaseSceneView implements IBaseSceneView {

    private _preLoad: PreCampaignData;
    private _preLoadingOver: boolean = false;
    private _model: SpaceModel;
    private _armyList: SpaceArmyView[];
    private _npcList: SpaceNpcView[];
    private _buildList: MapPhysicsBase[];
    private _view: SpaceSceneMapView;
    private _preSceneData: any;
    private _showLoadingTimeId: any = 0;

    private _findPath: FindPath8;
    private _flyFindPath: FindPath8;
    private _currentFindPath: FindPath8;
    private _algUtils: AcorrsLineGrid;
    private _rectScanUtils: WalkRectScanUtils;
    private static _isFirst: boolean = true;
    public walkTarget: fgui.GMovieClip;
    public buildLayer: SpaceBuildingLayer;
    public walkLayer: SpaceWalkLayer;

    constructor() {
        super();

        this.autoSize = true;
    }

    public preLoadingStart(data: Object = null): Promise<void> {
        Logger.log('preload start');
        NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, true);
        // SceneManager.Instance.lockScene = true;
        return new Promise(async resolve => {
            let preLoadingOver = () => {
                this._preLoadingOver = true;
                NotificationManager.Instance.dispatchEvent(NotificationEvent.UI_ENTER_SCENE);
                Logger.log('preload finish');
                LoadingSceneWnd.Instance.Hide();
                this.preLoadingOver();
                resolve();
            };
            PlayerManager.Instance.currentPlayerModel.inCastle = false;
            PlayerManager.Instance.currentPlayerModel.inOutCity = false;
            SpaceSocketManager.Instance.setup(true);
            if (!SpaceManager.Instance.model) return;//避免销毁后继续访问导致的报错卡死
            SpaceManager.Instance.model.mapNodesData = SpaceTemplateManager.Instance.nodeDic.get(SpaceManager.SpaceMapId);
            SpaceManager.Instance.controller = this;
            this._model = SpaceManager.Instance.model;
            if (!this._model || !this._model.mapTempInfo) {
                SceneManager.Instance.lock = false;
                LoadingSceneWnd.Instance.Show();
                return;
            }
            MapElmsLibrary.Instance.lock();
            if (this._model && MapData.mapId == this._model.mapTempInfo.Id && MapData.mapBitmap && this._model.mapTielsData) {
                preLoadingOver();
            }
            else {
                this._preLoadingOver = false;
                if (SpaceScene._isFirst) {
                    SpaceScene._isFirst = false;
                    this.showLoading();
                }
                else {
                    this._showLoadingTimeId = setInterval(this.showLoading.bind(this), 1500);
                }
                // this._time = new Date().getTime();
                this._preLoad = new SpacePreCampaignData(this._model);
                this._preLoad.syncBackCall(preLoadingOver);
            }
        });
    }

    public enter(preScene: BaseSceneView, data: Object = null): Promise<void> {
        return new Promise(async resolve => {
            ResRefCountManager.resCache.forEach((element, url) => {
                if (element.refCount > 0) {
                    Logger.warn("[SpaceScene]enter", element.refCount, url)
                }
            });
            ResRefCountManager.clearCache();


            this._armyList = [];
            this._buildList = [];
            this._npcList = [];
            let w: number = this._model.mapTempInfo.Width / 20;
            let h: number = this._model.mapTempInfo.Height / 20;
            this._findPath = new FindPath8(w, h, this._model.mapTielsData);
            this._flyFindPath = new FindPath8(w, h, this._model.mapTielsData, false, true);
            this._currentFindPath = this._findPath;
            this._algUtils = new AcorrsLineGrid(this._currentFindPath, this._model);
            this._view = new SpaceSceneMapView(this, this._model);
            this._preSceneData = data;
            this.addChild(this._view);
            SpaceManager.Instance.mapView = this._view;
            this._rectScanUtils = new WalkRectScanUtils();
            this._model.buildMapNodesData();

            AudioManager.Instance.playMusic(SoundIds.SPACE, 0);
            // WorldBossManager.Instance.reqWorldBossStates();
            this.addEvent();
            Logger.log('SceneManager.spacescene.enter:');

            resolve();
        });
    }

    public enterOver(): Promise<void> {
        return new Promise(async resolve => {
            this.releaseScene();
            // TopToolsBar.Instance.show();
            // MainToolBar.Instance.show();
            // TipsBar.Instance.show();
            // FullBar.Instance.show();
            // QueueBar.Instance.show();
            // ChatBar.Instance.show();
            // TaskTraceBar.Instance.show();
            // SmallMapBar.Instance.show();
            // ResourcesBar.Instance.show();
            // ChatTopBugleView.Instance.setPos();
            if (this._preSceneData) {
                if (this._preSceneData.isOpenColosseum) {
                    FrameCtrlManager.Instance.open(EmWindow.Colosseum);
                }
                else if (this._preSceneData.isOpenPveRoomList) {
                    // FrameCtrlManager.Instance.open(EmWindow.PveRoomList);
                    FrameCtrlManager.Instance.open(EmWindow.PveMultiCampaignWnd);
                }
                else if (this._preSceneData.isOpenPvpRoomList) {
                    FrameCtrlManager.Instance.open(EmWindow.RoomList, { "roomSceneType": RoomSceneType.PVP });
                    // FrameCtrlManager.Instance.open(EmWindow.PveSelectCampaign, { "roomSceneType": RoomSceneType.PVP });
                }
                // else if(this._preSceneData.isOpenVehicle)
                // {
                //     FrameCtrlManager.Instance.open(UIModuleTypes.VEHICLE_DAIMON);
                // }
                else if (this._preSceneData.isOpenPetChallenge) {
                    FrameCtrlManager.Instance.open(EmWindow.PetChallenge);
                } else if (this._preSceneData.isOpenRemotePet) {
                    RemotePetController.Instance.startFrameByType(2);
                }
                else if (this._preSceneData.isOpenSinglePass) {
                    FrameCtrlManager.Instance.open(EmWindow.SinglePassWnd);
                }
                else if (this._preSceneData.hasOwnProperty("isOpenSinglePassResultView") && this._preSceneData.isOpenSinglePassResultView) {
                    let battleReportMsg: BattleReportMsg = this._preSceneData.data as BattleReportMsg;
                    FrameCtrlManager.Instance.open(EmWindow.SinglepassResultWnd, battleReportMsg);
                }
                else if (this._preSceneData.isOpenPetCampaignBattleResult) {
                    let battleReportMsg: BattleReportMsg = this._preSceneData.data as BattleReportMsg;
                    FrameCtrlManager.Instance.open(EmWindow.PetCampaignResultWnd, battleReportMsg);
                }
                else if (this._preSceneData.isOpenPetCampaign) {
                    FrameCtrlManager.Instance.open(EmWindow.PetCampaignWnd, { playId: PetCampaignManager.Instance.model.userUiPlayInfoMsg.playId });
                }
                else if (this._preSceneData.isOutyardBattle) {
                    FrameCtrlManager.Instance.open(EmWindow.OutyardFigureWnd);
                }
            }
            if (!HomeWnd.Instance.isShowing) {
                await HomeWnd.Instance.instShow();
                HomeWnd.Instance.getSmallMapBar().switchSmallMapState(SmallMapBar.SPACE_SMALL_MAP_STATE);
            }
            await UIManager.Instance.ShowWind(EmWindow.SpaceTaskInfoWnd);
            if (this._view) {
                let rect: Laya.Rectangle = SpaceMapViewHelper.getCurrentMapRect(this._view);
                this.moveMapCallBack(rect);
            }
            this.__findNodeHandler(null);

            Logger.log('SceneManager.spacescene.enterOver:');
            // if(MailCheckManager.Instance.model.isShow)
            // {
            // 	FrameCtrlManager.Instance.open(UIModuleTypes.MAIL_CHECK,MailCheckControler.TELEPHONECHECK);
            // }
            FaceSlapManager.Instance.showNext();
            SpaceMapCameraMediator.unlockMapCamera();

            if (SpaceManager.Instance.model.isOnObstacle && !this._model.isFlying(this._model.selfArmy.mountTemplateId)) {
                SpaceSocketOutManager.Instance.resetSpacePosition();
            }
            super.enterOver();
            resolve();
        });
    }


    public leaving(): Promise<void> {
        return new Promise(async resolve => {
            SpaceMapCameraMediator.unlockMapCamera();
            NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
            // SceneManager.Instance.lockScene = false;
            this.removeEvent();
            PlayerManager.Instance.currentPlayerModel.selectTarget = null;
            PlayerManager.Instance.currentPlayerModel.isOnObstacle = this._model.isOnObstacle;
            UIManager.Instance.HideWind(EmWindow.SpaceTaskInfoWnd);
            await HomeWnd.Instance.instHide();
            // TopToolsBar.instance.hide();
            // MainToolBar.instance.hide();
            // TipsBar.instance.hide();
            // FullBar.instance.hide();
            // QueueBar.instance.hide();
            // ChatBar.instance.hide();
            // TaskTraceBar.instance.hide();
            // SmallMapBar.instance.hide();
            // ResourcesBar.instance.hide();
            // BagHelper.instance.stopSelling();
            // ShowTipManager.Instance.removeCurrentTip();
            // TaskTraceTipManager.instance.cleanByType(TipMessageData.FARM_CAN_PICK);
            // TaskTraceTipManager.instance.cleanByType(TipMessageData.TREE_CAN_PICK);
            if (this._view) {
                ObjectUtils.disposeObject(this._view);
            }
            this._view = null;
            if (this._model) {
                this._model.selectNode = null;
                MapElmsLibrary.Instance.unLock();
                this._model.nineSliceScaling = [];
            }
            if (this._rectScanUtils) {
                this._rectScanUtils.getWalkable = null;
                this._rectScanUtils.dispose();
                this._rectScanUtils = null;
            }
            SpaceManager.Instance.mapView = null;
            // FootprintItems.dispose();
            this._findPath && this._findPath.dispose();
            this._currentFindPath && this._currentFindPath.dispose();
            this._flyFindPath && this._flyFindPath.dispose();
            this._findPath = null;
            this._currentFindPath = null;
            this._flyFindPath = null;
            this._preLoad = null;

            if (SpaceManager.Instance.exit) {
                SpaceSocketManager.Instance.dispose();
                SpaceManager.Instance.dispose();
                this._model = null;
            }
            this._algUtils = null;
            this._preSceneData = null;
            this._armyList = null;
            this._npcList = null;
            this._buildList = null;
            resolve();
        });
    }

    public get SceneName(): string {
        return SceneType.SPACE_SCENE;
    }

    public getUIID() {
        return SceneType.SPACE_SCENE;
    }

    private addEvent() {
        NotificationManager.Instance.on(SpaceEvent.FIND_NODE, this.__findNodeHandler, this);
        NotificationManager.Instance.on(SpaceEvent.SELECT_NODE, this.__selectNodeHandler, this);
        NotificationManager.Instance.on(SpaceEvent.HIDE_OTHERS, this.__onHideOthers, this);
        NotificationManager.Instance.addEventListener(FreedomTeamEvent.TEAM_INFO_UPDATE, this.__teamInfoUpdateHandler, this);
        // NotificationManager.Instance.on(SpaceEvent.HIDE_OTHER_NAME, this.__onHideOtherName, this);
    }

    __onHideOthers() {
        this._armyList.forEach(armyView => {
            this.checkPlayerVisible(armyView)
        })
    }

    __teamInfoUpdateHandler() {
        this._armyList.forEach(armyView => {
            this.checkPlayerVisible(armyView)
        })
    }

    private checkPlayerVisible(armyView: SpaceArmyView) {
        let boo = SharedManager.Instance.hideOtherPlayer
        if (armyView) {
            armyView.visible = armyView.isSelf || !boo
            armyView.showInfo(true, armyView.isSelf || armyView.visible);
        }
    }

    private removeEvent() {
        NotificationManager.Instance.off(SpaceEvent.FIND_NODE, this.__findNodeHandler, this);
        NotificationManager.Instance.off(SpaceEvent.SELECT_NODE, this.__selectNodeHandler, this);
        NotificationManager.Instance.off(SpaceEvent.HIDE_OTHERS, this.__onHideOthers, this);
        NotificationManager.Instance.off(FreedomTeamEvent.TEAM_INFO_UPDATE, this.__teamInfoUpdateHandler, this);
        // NotificationManager.Instance.off(SpaceEvent.HIDE_OTHER_NAME, this.__onHideOtherName, this);
    }

    private __findNodeHandler(evt: SpaceEvent) {
        let spaceNodeId = PlayerManager.Instance.currentPlayerModel.spaceNodeId
        let nodeInfo: SpaceNode = this._model.getMapNodeById(spaceNodeId);
        PlayerManager.Instance.currentPlayerModel.spaceNodeId = -1;
        if (nodeInfo) {
            this._model.selectNode = nodeInfo;
            this._model.beingVisitNode = nodeInfo;
            SpaceManager.Instance.setNpcBeingVisit(true);
            SpaceArmyViewHelper.visitNode(nodeInfo);
        }
    }

    private __selectNodeHandler(data: number) {
        let nodeId: number = data;
        let nodeInfo: SpaceNode = this._model.getMapNodeById(nodeId);
        if (nodeInfo) {
            this._model.checkNodeId = nodeId;
            this._model.selectNode = nodeInfo;
            if (SpaceManager.Instance.callback != null) {
                SpaceManager.Instance.callback();
            }
            if (!SpaceManager.Instance.isPopFrame) {
                return;
            }
            if (SpaceNodeType.isYearNode(nodeInfo.info.types)) {
                SpaceSocketOutManager.Instance.sendYearBoxCollect(nodeId);
            }
            else if (nodeInfo.dialogue) {
                SpaceArmyViewHelper.openNodeDialog();
            } else {
                let option: any[] = nodeInfo.param3.split(",");
                let type: number = parseInt(option[0]);
                let level: number = 0;
                if (option[2]) {
                    level = option[2];
                }
                if (level > ArmyManager.Instance.thane.grades) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("store.view.StoreFrame.command01", level));
                    return;
                }
                SpaceArmyViewHelper.openNodeFrame(type);
            }
        }
    }

    takeLongTime(n) {
        return new Promise(resolve => {
            setTimeout(() => resolve(n + 200), n);
        });
    }

    step1(n) {
        Logger.log(`step1 with ${n}`);
        return this.takeLongTime(n);
    }

    step2(n) {
        Logger.log(`step2 with ${n}`);
        return this.takeLongTime(n);
    }

    step3(n) {
        Logger.log(`step3 with ${n}`);
        return this.takeLongTime(n);
    }

    // private _time: number = 0;

    private showLoading() {
        if (this._showLoadingTimeId > 0) {
            clearInterval(this._showLoadingTimeId);
            this._showLoadingTimeId = 0;
        }
        if (!this._preLoadingOver) {
            // LoadingSceneView.Instance.show();
        }
    }

    // protected preLoadingOver()
    //  {
    // this._preLoadingOver = true;
    // NotificationManager.Instance.dispatchEvent(NotificationEvent.UI_ENTER_SCENE);
    // this.onEnter();
    // LoadingSceneView.Instance.hide();
    // LoadingSceneView.Instance.switchSceneFlag = false;
    // }

    public moveArmyByPos(endX: number, endY: number, isCheckRect: boolean = false): boolean {
        NotificationManager.Instance.sendNotification(NotificationEvent.LOCK_TEAM_FOLLOW_TARGET, 0);
        let str: string = "";
        if (MopupManager.Instance.model.isMopup) {
            str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
            // MessageTipManager.Instance.show(str);
            return false;
        }
        let nodeInfo: SpaceNode = SpaceManager.Instance.model.getHandlerNode(parseInt((endX / 20).toString()), parseInt((endY / 20).toString()));
        if (nodeInfo && nodeInfo.info.types != SpaceNodeType.TREASURE_MAP && nodeInfo.info.types != SpaceNodeType.MOVEMENT && nodeInfo.param1 != SpaceNodeType.PARAM_TRANSFER) {
            if (nodeInfo.handlerRangePoints.length != 0) {
                let index: number = parseInt((Math.random() * nodeInfo.handlerRangePoints.length).toString());
                if (index == nodeInfo.handlerRangePoints.length) {
                    index = 0;
                }
                if (nodeInfo.handlerRangePoints[index]) {
                    endX = nodeInfo.handlerRangePoints[index].x * 20;
                    endY = nodeInfo.handlerRangePoints[index].y * 20;
                }
            }
        }
        let end: Laya.Point = new Laya.Point(endX, endY);
        let army: SpaceArmy = this._model.selfArmy;
        if (!army) {
            return false;
        }
        let armyView: any = this.getArmyView(army);
        let flying: boolean = this._model.isFlying(army.mountTemplateId);
        let current: Laya.Point = new Laya.Point(armyView.x, armyView.y);
        let start: Laya.Point = new Laya.Point(armyView.x, armyView.y);
        if (flying) {
            start = this.getFlyStartPoint(armyView.x, armyView.y, end);
        }
        else {
            start = this.getStartPoint(armyView.x, armyView.y, end);
        }
        if (start.x < 0 || start.x > this._model.mapTempInfo.Width || start.y < 0 || this._model.mapTempInfo.Height < start.y) {
            return false;
        }
        if (isCheckRect && !flying) {
            this.initRectScan();
            end = this._rectScanUtils.walkRectScan(end, new Laya.Point(start.x / 20, start.y / 20), current);
        }
        if (end) {
            let paths: Laya.Point[];
            if (flying) {
                this._currentFindPath = this._flyFindPath;
                this._algUtils.findPath8 = this._currentFindPath;
                paths = [new Laya.Point(parseInt((start.x / 20).toString()), parseInt((start.y / 20).toString())), new Laya.Point(parseInt((end.x / 20).toString()), parseInt((end.y / 20).toString()))];
            }
            else {
                this._currentFindPath = this._findPath;
                this._algUtils.findPath8 = this._currentFindPath;
                paths = this._currentFindPath.find(new Laya.Point(parseInt((start.x / 20).toString()), parseInt((start.y / 20).toString())), new Laya.Point(parseInt((end.x / 20).toString()), parseInt((end.y / 20).toString())));
                // paths = [new Laya.Point(parseInt((start.x/20).toString()),parseInt((start.y/20).toString())), new Laya.Point(parseInt((end.x/20).toString()),parseInt((end.y/20).toString()))];
            }
            if (paths) {
                if (!flying) {
                    paths = this._algUtils.getPsnode(paths);
                }
                armyView.aiInfo.pathInfo = paths;
                // paths.forEach(element => {
                //     // Logger.log("路径打印x==" + element.x + "路径打印y==" + element.y);
                // })
                if (paths.length > 1) {
                    this._model.updateWalkTarget(end);
                }
            }
            if (MouseData.Instance.curState != MouseData.LOCK) {
                MouseData.Instance.curState = MouseData.NORMAL;
            }
            return true;
        }
        return false;
    }

    private initRectScan() {
        this._rectScanUtils.outWidth = this._model.mapTempInfo.Width / Tiles.WIDTH;
        this._rectScanUtils.outHeight = this._model.mapTempInfo.Height / Tiles.HEIGHT;
        this._rectScanUtils.getWalkable = this.getWalkable.bind(this);
    }

    private getFlyStartPoint(curX: number, curY: number, nextPoint: Laya.Point): Laya.Point {
        if (curX < 0) {
            curX = 0;
        }
        else if (curX > this._model.mapTempInfo.Width) {
            curX = this._model.mapTempInfo.Width;
        }
        if (curY < 0) {
            curY = 0;
        }
        else if (curY > this._model.mapTempInfo.Height) {
            curY = this._model.mapTempInfo.Height;
        }
        return new Laya.Point(curX, curY);
    }

    /**
     * 找到一个可行走的起始点
     * @param curX 像素点
     * @param curY 像素点
     * @param nextPoint
     * @return
     *
     */
    private getStartPoint(curX: number, curY: number, nextPoint: Laya.Point): Laya.Point {
        if (this.getWalkable(curX / 20, curY / 20)) {
            return new Laya.Point(curX, curY);
        }
        let p: Laya.Point = this._model.getNeighborII(curX / 20, curY / 20);
        p.x = p.x * 20;
        p.y = p.y * 20;
        return p
    }

    /**
     *  检查一个点（20 X 20）是否可行走
     * @param $x
     * @param $y
     * @return
     *
     */
    public getWalkable($x: number, $y: number): boolean {
        return this._model.getPointValue($x, $y);
    }

    public get findPath(): FindPath8 {
        return this._findPath;
    }

    public searchPath(beginPoint: Laya.Point, endPoint: Laya.Point): Laya.Point[] {
        if (this._currentFindPath && this._algUtils) {
            let army: SpaceArmy = this._model.selfArmy;
            if (!army) {
                return null;
            }
            let path: Laya.Point[];
            let flying: boolean = this._model.isFlying(army.mountTemplateId);
            if (flying) {
                this._currentFindPath = this._flyFindPath;
                this._algUtils.findPath8 = this._currentFindPath;
                path = [beginPoint, endPoint];
            }
            else {
                this._currentFindPath = this._findPath;
                this._algUtils.findPath8 = this._currentFindPath;
                path = this._algUtils.getPsnode(this._currentFindPath.find(beginPoint, endPoint));
            }
            return path;
        }
        return null;
    }

    public moveMapCallBack(rect: Laya.Rectangle) {
        this._model.targetPoint = new Laya.Point(rect.x, rect.y);
        this._model.nineSliceScaling = MapUtils.getNineSliceScaling(rect);
        let arr: any[] = this._model.checkConfigNoExites();
        if (arr.length > 0) {
            this._model.currentFloorData = arr;
        }
    }

    // private getCurrent9Screens(): string {
    //     return MapUtils.getFilesIds(this._model.nineSliceScaling);
    // }

    // private get userKey(): string {
    //     // return PlayerManager.Instance.currentPlayerModel.userInfo.key;
    //     return "";
    // }

    // private get thane(): ThaneInfo {
    //     return ArmyManager.Instance.thane;
    // }

    public getArmyView(aInfo: any): Object {
        if (!aInfo) {
            return null;
        }

        for (const key in this._armyList) {
            if (Object.prototype.hasOwnProperty.call(this._armyList, key)) {
                let army = this._armyList[key];
                if (!army) {
                    continue;
                }
                if (!army.data) {
                    continue;
                }
                if (army.data == aInfo || army.data.userId == aInfo.userId) {
                    return army;
                }
            }
        }
        return null;
    }

    public addArmyView(armyView: SpaceArmyView) {
        if (this._armyList) {
            this._armyList.push(armyView);
            if (!armyView.isSelf) {
                this.checkPlayerVisible(armyView);
            }
        }
    }

    public removeArmyView(armyView: SpaceArmyView) {
        if (!this._armyList) {
            return;
        }
        let index: number = this._armyList.indexOf(armyView);
        if (index >= 0) {
            this._armyList.splice(index, 1);
        }
    }

    public addNpcView(value: SpaceNpcView) {
        if (this._npcList) {
            this._npcList.push(value);
        }
    }

    public getNpcView(node: SpaceNode): Object {
        if (!this._npcList) return null;
        for (let npc of this._npcList) {
            if (npc.nodeInfo == node) {
                return npc;
            }
        }
        return null;
    }

    public addBuild(value: MapPhysicsBase) {
        if (this._buildList) {
            this._buildList.push(value);
        }
    }

    public getBuildView(node: SpaceNode): MapPhysicsBase {
        for (let build of this._buildList) {
            if (build.info == node) {
                return build;
            }
        }
        return null;
    }

    public get npcList(): SpaceNpcView[] {
        return this._npcList;
    }

    public get armyList(): SpaceArmyView[] {
        return this._armyList;
    }

    public get buildList(): MapPhysicsBase[] {
        return this._buildList;
    }

}