import { PointUtils } from '../../../../core/utils/PointUtils';
import { DisplayObject } from '../../../component/DisplayObject';
import { t_s_mapData } from '../../../config/t_s_map';
import { CampaignEvent, CampaignMapEvent, OuterCityEvent, SceneViewEvent } from '../../../constant/event/NotificationEvent';
import { CampaignManager } from '../../../manager/CampaignManager';
import MediatorMananger from '../../../manager/MediatorMananger';
import { NotificationManager } from '../../../manager/NotificationManager';
import { PlayerManager } from '../../../manager/PlayerManager';
import { TempleteManager } from '../../../manager/TempleteManager';
import { CampaignMapMouseEventMediator } from '../../../mvc/mediator/CampaignMapMouseEventMediator';
import { CampaignSmallMapMediator } from '../../../mvc/mediator/CampaignSmallMapMediator';
import { MapCameraMediator } from '../../../mvc/mediator/MapCameraMediator';
import MazeMapMediator from '../../../mvc/mediator/MazeMapMediator';
import MazeRiverMediator from '../../../mvc/mediator/MazeRiverMediator';
import { NodeGuideMediator } from '../../../mvc/mediator/NodeGuideMediator';
import { TeamListMediator } from '../../../mvc/mediator/TeamListMediator';
import { TrailMapMediator } from '../../../mvc/mediator/TrailMapMediator';
import { CampaignMapModel } from '../../../mvc/model/CampaignMapModel';
import { StageReferance } from '../../../roadComponent/pickgliss/toplevel/StageReferance';
import { WorldBossHelper } from '../../../utils/WorldBossHelper';
import { MapElmsLibrary } from "../../libray/MapElmsLibrary";
import SceneType from "../../scene/SceneType";
import { CampaignNode } from "../../space/data/CampaignNode";
import { MapInfo } from "../../space/data/MapInfo";
import { MouseData } from "../../space/data/MouseData";
import { CampaignMapCenterCheckHelper } from "../../space/utils/CampaignMapCenterCheckHelper";
import { MapViewHelper } from "../../outercity/utils/MapViewHelper";
import { CampaignArmy } from "../data/CampaignArmy";
import { FogView } from "./fog/FogView";
import { CampaignMainBuidingLayer } from "./layer/CampaignMainBuidingLayer";
import { CampaignWalkLayer } from "./layer/CampaignWalkLayer";
import { MapRenderLayer } from "./layer/MapRenderLayer";
import { NpcLayer } from "./layer/NpcLayer";
import AudioManager from '../../../../core/audio/AudioManager';
import { SoundIds } from '../../../constant/SoundIds';
import { PathManager } from '../../../manager/PathManager';
import { BgLayer } from "../../space/bg/BgLayer";
import ObjectUtils from '../../../../core/utils/ObjectUtils';
import WorldBossRiverMediator from '../../../mvc/mediator/WorldBossRiverMediator';
import WorldBossBuffMediator from '../../../mvc/mediator/WorldBossBuffMediator';
import WorldBossWoundMediator from '../../../mvc/mediator/WorldBossWoundMediator';
import { BattleModel } from '../../../battle/BattleModel';
import PvpUIMediator from '../../../mvc/mediator/PvpUIMediator';
import PvpWarFightMediator from '../../../mvc/mediator/PvpWarFightMediator';
import ActivationMovieMediator from '../../../mvc/mediator/ActivationMovieMediator';
import ConsortiaSecretMapMediator from '../../../mvc/mediator/ConsortiaSecretMapMediator';
import { OuterCityStaticLayer } from "../../view/layer/OuterCityStaticLayer";
import { GvgUIMediator } from "../../../mvc/mediator/GvgUIMediator";
import { GvgRiverMediator } from "../../../mvc/mediator/GvgRiverMediator";
import { GvgChaseNpcMediator } from "../../../mvc/mediator/GvgChaseNpcMediator";
import { ChaseNPCMediator } from "../../../mvc/mediator/ChaseNPCMediator";
import { LockTargetMediator } from "../../../mvc/mediator/LockTargetMediator";
import { FreedomTeamFollowMediator } from '../../../mvc/mediator/FreedomTeamFollowMediator';
import MineralUIMediator from '../../../mvc/mediator/MineralUIMediator';
import { PetLandUIMediator } from "../../../mvc/mediator/PetLandUIMediator";
import { CampaignMapCursorMediator } from '../../../mvc/mediator/CampaignMapCursorMediator';
import { BuildingSelectMediator } from '../../../mvc/mediator/BuildingSelectMediator';
import { ShadowUILayer, ShadowUILayerHandler } from '../../view/layer/ShadowUILayer';
import { AvatarInfoUILayer, AvatarInfoUILayerHandler, AvatarInfoUIName } from '../../view/layer/AvatarInfoUILayer';
import ConsortiaBossUIMediator from '../../../mvc/mediator/ConsortiaBossUIMediator';
import ConsortiaBossHeadMediator from '../../../mvc/mediator/ConsortiaBossHeadMediator';
import { MsgMan } from '../../../manager/MsgMan';
import { BaseManager } from '../../../manager/BaseManager';
import PetBossUIMediator from '../../../mvc/mediator/PetBossUIMediator';
import ActivationMovieStepRenderMediator from '../../../mvc/mediator/ActivationMovieStepRenderMediator';
import ActivationAvatarTranslucenceMediator from '../../../mvc/mediator/ActivationAvatarTranslucenceMediator';
import MonopolyUIMediator from '../../../mvc/mediator/MonopolyUIMediator';
import Resolution from '../../../../core/comps/Resolution';
import { CampaignMapDragMediator } from '../../../mvc/mediator/CampaignMapDragMediator';
import { SingleBgLayer } from '../../space/bg/SingleBgLayer';
import { CampaignSingleBgWalkLayer } from './layer/CampaignSingleBgWalkLayer';
import SecretModel from '../../../datas/secret/SecretModel';
import { SecretManager } from '../../../manager/SecretManager';
import { t_s_secretData } from '../../../config/t_s_secret';
import ConfigMgr from '../../../../core/config/ConfigMgr';
import { ConfigType } from '../../../constant/ConfigDefine';

export enum CampaignSceneMapZOrder {
    BlurMask = 0,
    BuildingLayer,
    ShadowUILayer,
    WalkLayer,
    FogLayer,
}

/**
 * 副本地图的显示类
 */
export class CampaignMapView extends Laya.Sprite {
    /**
     * 是否分帧渲染场景中的动画
     * 使用之前一定要跑一下对应的副本, 很多地方都是遍历所有节点数据, 并未判断nodeView是否为空, 此时未加载nodeView会报错
     */
    public stepRender: boolean = false;
    public static STEP_RENDER_SPEED: number = 25;

    protected _bgLayer: BgLayer;
    protected _singleBgLayer: SingleBgLayer;
    protected _staticRenderLayer: MapRenderLayer;
    protected _staticLayer: OuterCityStaticLayer;
    protected _walkLayer: CampaignWalkLayer;
    protected _avatarInfoUILayer: AvatarInfoUILayer;
    protected _mainBuidingLayer: CampaignMainBuidingLayer;
    protected _shadowUILayer: ShadowUILayer;
    protected _fogLayer: FogView;
    protected _mapModel: CampaignMapModel;
    protected _npcLayer: NpcLayer;

    public static NAME: string = "map.campaign.view.CampaignMapView";

    protected _mediatorKey: string;

    constructor() {
        super();
        this.initView();
        this.addEvent();
        this.playMusic();
        this.setStartPoint();
    }

    protected registerList() {
        if (WorldBossHelper.checkSingleBgMap(this._mapModel.mapId)) {
            return
        }

        let arr: any[] = [
            CampaignMapCursorMediator,
            MapCameraMediator,
            BuildingSelectMediator,
            CampaignSmallMapMediator,
        ];
        //云端历险点击地图不能移动
        if (!WorldBossHelper.checkMonopoly(this._mapModel.mapId)) {
            if (!WorldBossHelper.checkGvg(this._mapModel.mapId)) {
                arr.push(CampaignMapDragMediator);
            }
            arr.push(CampaignMapMouseEventMediator);
        }
        if (this.stepRender) {
            arr.push(ActivationMovieStepRenderMediator);
        }
        if (!WorldBossHelper.checkFogMap(this._mapModel.mapId) && !WorldBossHelper.checkMaze(this._mapModel.mapId) && !WorldBossHelper.checkIsNoviceMap(this._mapModel.mapId) && !WorldBossHelper.checkMonopoly(this._mapModel.mapId)) {//多人本
            arr.push(TeamListMediator);
            arr.push(NodeGuideMediator);
        } else if (this._mapModel.campaignTemplate.Types == 0 && this._mapModel.campaignTemplate.isKingTower) {//王者之塔
            arr.push(CampaignSmallMapMediator);
            arr.push(TeamListMediator);
        } else if (this._mapModel.campaignTemplate.Types == 0 && this._mapModel.campaignTemplate.SonTypes != 0) {
            arr.push(TeamListMediator);
            arr.push(TrailMapMediator);
        } else if (this._mapModel.campaignTemplate.Types == 1) {//世界BOSS
            arr.push(ActivationAvatarTranslucenceMediator);
            arr.push(NodeGuideMediator);
            arr.push(WorldBossWoundMediator);
            arr.push(WorldBossRiverMediator);
            arr.push(WorldBossBuffMediator);
        } else if (this._mapModel.campaignTemplate.Types == 2) {//采矿
        } else if (this._mapModel.campaignTemplate.Types == 3) {//修行
            //TODO 目前修行神殿改版不需要
            // arr.push(HookMapMediator);
            // arr.push(HookMapPKMediator);
        } else if (this._mapModel.campaignTemplate.Types == 4) {
            arr.push(MazeMapMediator);
            arr.push(MazeRiverMediator);
        } else if (this._mapModel.campaignTemplate.Types == 7) {
            arr.push(ConsortiaSecretMapMediator);
            arr.push(GvgChaseNpcMediator);
        } else if (this._mapModel.campaignTemplate.Types == 8) {
            // arr.push(ConsortiaDemonMapMediator);
            // arr.push(GvgChaseNpcMediator);
            // arr.push(ConsortiaDemonReviveMediator);
        }
        if (WorldBossHelper.checkPvp(this._mapModel.mapId)) {
            arr.push(ActivationAvatarTranslucenceMediator);
            arr.push(PvpUIMediator);
            arr.push(PvpWarFightMediator);
            arr.push(ActivationMovieMediator);
            // BattleModel.allowAutoFight = false;
        }
        if (WorldBossHelper.checkMineral(this._mapModel.mapId)) {
            // arr.push(FreedomTeamListMediator);
            arr.push(ActivationAvatarTranslucenceMediator);
            arr.push(FreedomTeamFollowMediator);
            arr.push(MineralUIMediator);
            arr.push(PvpWarFightMediator);
            arr.push(ActivationMovieMediator);
            arr.push(LockTargetMediator);
            // BattleModel.allowAutoFight = false;
        }
        if (WorldBossHelper.checkGvg(this._mapModel.mapId)) {
            arr.push(ActivationAvatarTranslucenceMediator);
            arr.push(PvpWarFightMediator);
            arr.push(GvgUIMediator);
            arr.push(GvgRiverMediator);
            arr.push(ActivationMovieMediator);
            arr.push(GvgChaseNpcMediator);
        }
        if (WorldBossHelper.checkPetLand(this._mapModel.mapId)) {
            // arr.push(FreedomTeamListMediator);
            arr.push(FreedomTeamFollowMediator);
            arr.push(LockTargetMediator);
            arr.push(PvpWarFightMediator);
            arr.push(ActivationMovieMediator);
            arr.push(ChaseNPCMediator);
            arr.push(PetLandUIMediator);
        }
        if (WorldBossHelper.checkConsortiaBoss(this._mapModel.mapId)) {//公会BOSS
            arr.push(ConsortiaBossHeadMediator);
            arr.push(ConsortiaBossUIMediator);
        }

        if (WorldBossHelper.checkInPetBossFloor(this._mapModel.mapId)) {
            arr.push(WorldBossRiverMediator);
            arr.push(PetBossUIMediator);
            // BattleModel.allowAutoFight = false;
        }

        if (WorldBossHelper.checkIsNoviceMap(this._mapModel.mapId)) {
            arr.push(NodeGuideMediator);
        }

        if (WorldBossHelper.checkMonopoly(this._mapModel.mapId)) {
            arr.push(MonopolyUIMediator);
        }
        if (WorldBossHelper.checkMaze(this._mapModel.mapId) || WorldBossHelper.checkMaze2(this._mapModel.mapId)) {
            arr.push(NodeGuideMediator);
        }
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, CampaignMapView.NAME);
    }

    protected initView() {
        CampaignManager.Instance.mapView = this
        this._mapModel = CampaignManager.Instance.mapModel;
        let mapId = this._mapModel.mapId
        if (WorldBossHelper.checkSingleBgMap(mapId)) {
            // 没有t_s_map配置，使用初始化时服务器传过来的
        } else {
            this._mapModel.mapId = this.campaignTempInfo.Id;
            mapId = this._mapModel.mapId;
            this.setStepRender();
        }

        if (WorldBossHelper.checkSingleBgMap(mapId)) {
            this._singleBgLayer = new SingleBgLayer(this, mapId);
            this.addChild(this._singleBgLayer);
        } else if (WorldBossHelper.checkSliceBgMap(mapId)) {
            this._bgLayer = new BgLayer(this, this._mapModel.mapTempInfo, this._mapModel.floorData, true);
            this.size(this._mapModel.mapTempInfo.Width, this._mapModel.mapTempInfo.Height);
        } else {
            let vw: number = this._mapModel.mapTempInfo.Width;
            let vh: number = this._mapModel.mapTempInfo.Height;
            vw = (vw <= 0 ? 2000 : vw);
            vh = (vh <= 0 ? 2000 : vh);
            this.size(vw, vh);
            let totalPixel: number = vw * vh;
            let maxPixel: number = 16777215;
            if (vw > MapInfo.MAX_WIDTH || vh > MapInfo.MAX_HEIGHT || totalPixel >= maxPixel) {
                this._staticLayer = new OuterCityStaticLayer();
                this._staticLayer.mapData = this._mapModel;
                this._staticLayer.upDateNextRend();
                this.addChild(this._staticLayer);
            } else {
                this._staticRenderLayer = new MapRenderLayer(this, vw, vh);
                this._staticRenderLayer.elmsDatas = MapElmsLibrary.Instance;
                this._staticRenderLayer.data = this._mapModel.floorData;
            }
        }

        this._mainBuidingLayer = new CampaignMainBuidingLayer();
        this.addChild(this._mainBuidingLayer);

        this._shadowUILayer = new ShadowUILayer();
        this.addChild(this._shadowUILayer);
        ShadowUILayerHandler.setHandlerView(this._shadowUILayer, AvatarInfoUIName.SpaceSceneMapView);

        if (WorldBossHelper.checkSingleBgMap(mapId)) {
            this._walkLayer = new CampaignSingleBgWalkLayer();
        } else {
            this._walkLayer = new CampaignWalkLayer();
        }

        this.addChild(this._walkLayer);
        this._walkLayer.mouseThrough = true;

        this._avatarInfoUILayer = new AvatarInfoUILayer();
        this.addChild(this._avatarInfoUILayer);
        AvatarInfoUILayerHandler.setHandlerView(this._avatarInfoUILayer, AvatarInfoUIName.CampaignMapView);

        this._npcLayer = new NpcLayer(this._walkLayer);

        if (!WorldBossHelper.checkFogMap(mapId) && this.campaignTempInfo) {
            this._fogLayer = new FogView(this.campaignTempInfo.Width, this.campaignTempInfo.Height, this._mapModel.fogMaskData);
            // this._fogLayer.zOrder = CampaignSceneMapZOrder.FogLayer;
            // this.addChild(this._fogLayer);
        }
        this.fixScreen();
    }

    protected playMusic() {
        let mapId = this._mapModel.mapId
        if (WorldBossHelper.checkPetLand(mapId)) {
            AudioManager.Instance.playMusic(SoundIds.PETLAND, 0);
        } if (WorldBossHelper.checkSecretFb(mapId)) {
            let secretCfg = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_secret,  mapId) as t_s_secretData
            AudioManager.Instance.playMusic(PathManager.solveSoundPath(secretCfg.MusicPath), 0);
        } else {
            let path = this._mapModel.mapTempInfo.MusicPath
            if (path) {
                AudioManager.Instance.playMusic(PathManager.solveSoundPath(path), 0);
            }
        }
    }

    protected setStartPoint() {
        let self: CampaignArmy = this._mapModel.selfMemberData;
        let center: Laya.Point = new Laya.Point(0, 0);// new Point(-200,-200);
        if (self) {
            center = PointUtils.scaleTransformII(new Laya.Point(self.curPosX, self.curPosY), 20, 20);
        }
        let rect: Laya.Rectangle = new Laya.Rectangle(0, 0, this._mapModel.mapTempInfo.Width, this._mapModel.mapTempInfo.Height);
        if (!rect.contains(center.x, center.y)) {
            //如果部队不在地图内
            let node: CampaignNode = this._mapModel.mapNodeStartPoint;
            if (node) {
                self.curPosX = node.curPosX;
                self.curPosY = node.curPosY;
                center = PointUtils.scaleTransformII(new Laya.Point(self.curPosX, self.curPosY), 20, 20);
                let armyView: any = CampaignManager.Instance.controller.getArmyView(self);
                if (armyView) {
                    armyView.x = self.curPosX * 20;
                    armyView.y = self.curPosY * 20;
                }
            }
        }
        this._mapModel.targetPoint = CampaignMapCenterCheckHelper.checkOutScene(center);
    }

    public moveCenterPoint(p: Laya.Point, dealy: number = 0.6, isTween: boolean = true) {
        MouseData.Instance.curState = MouseData.ON_DRAG;
        p.x = -p.x;
        p.y = -p.y;
        p.x = p.x + this.stage.width / 2;
        p.y = p.y + this.stage.height / 2;
        p = CampaignMapCenterCheckHelper.checkOutScene(p);
        this._mapModel.targetPoint = p;
        TweenLite.killTweensOf(this, false);
        let cur: Laya.Point = new Laya.Point(this.x, this.y);
        if (p.distance(cur.x, cur.y) < 20) {
            return;
        }
        if (isTween) {
            TweenLite.to(this, dealy, { x: p.x, y: p.y, onComplete: this.moveEndCheck.bind(this) });
        }
        else {
            this.setPosition(p.x, p.y);
        }
    }

    protected addEvent() {
        this.on(Laya.Event.DISPLAY, this, this.__addToStageHandler);
        StageReferance.stage.on(Laya.Event.RESIZE, this, this.__stageResizeHandler);
        this._mapModel.addEventListener(OuterCityEvent.ADD_GARRISON, this.__addBaseArmyHandler, this);
        MsgMan.addObserver(CampaignEvent.PET_BOSS_SWITCH, this, this.__petBossSwitchHandler);
    }

    protected removeEvent() {
        this.off(Laya.Event.DISPLAY, this, this.__addToStageHandler);
        StageReferance.stage.off(Laya.Event.RESIZE, this, this.__stageResizeHandler);
        if (this._mapModel) {
            this._mapModel.removeEventListener(OuterCityEvent.ADD_GARRISON, this.__addBaseArmyHandler, this);
        }
        MsgMan.removeObserver(CampaignEvent.PET_BOSS_SWITCH, this, this.__petBossSwitchHandler);

    }

    private __petBossSwitchHandler(msg: string, obj: Object): void {
        if (this._mapModel == null || BaseManager.petBossMapId == CampaignManager.Instance.petBossModel.mapId) return;
        if (WorldBossHelper.checkInPetBossFloor(this._mapModel.mapId)) {
            MediatorMananger.Instance.addRegisterMediator(WorldBossRiverMediator, this, this._mediatorKey);
            MediatorMananger.Instance.addRegisterMediator(PetBossUIMediator, this, this._mediatorKey);
        }
        else if (WorldBossHelper.checkPetLand(this._mapModel.mapId)) {
            MediatorMananger.Instance.removeRegisterMediator(WorldBossRiverMediator, this, this._mediatorKey);
            MediatorMananger.Instance.removeRegisterMediator(PetBossUIMediator, this, this._mediatorKey);
        }
    }

    private __addBaseArmyHandler(data: CampaignArmy) {
        let armyInfo: CampaignArmy = data;
        let selfId: number = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
        if (armyInfo.userId == selfId) {
            this.setStartPoint();
            this.lookAtTarget(true);
        }
    }

    private __stageResizeHandler(evt: Event) {
        if (this._staticLayer) {
            this._staticLayer.resize();
        }
        this.fixScreen();
        this.layou();
    }

    private __addToStageHandler(evt: Event) {
        this._walkLayer.addToStage(evt);
        this._npcLayer.addToStage(evt);
        this.registerList();
        this.lookAtTarget();
        //新手
        NotificationManager.Instance.dispatchEvent(SceneViewEvent.ADD_TO_STAGE, SceneType.CAMPAIGN_MAP_SCENE);

    }

    private _lookAtTimeId: any = 0;

    protected lookAtTarget(isAdd: boolean = false) {
        if (this._lookAtTimeId > 0) {
            clearInterval(this._lookAtTimeId);
        }
        this._lookAtTimeId = 0;
        if (this._mapModel && !this._mapModel.selfMemberData) {
            this._lookAtTimeId = setInterval(this.lookAtTarget.bind(this), 1000);
            return;
        }
        let armyView: any = CampaignManager.Instance.controller.getArmyView(this._mapModel.selfMemberData);
        if (!armyView) {
            return;
        }
        if (isAdd) {
            this.moveCenterPoint(new Laya.Point(armyView.x, armyView.y), .1, false);
        }
        this.event(CampaignMapEvent.LOOK_AT_ROLE, armyView);

    }

    private layou() {
        this.lookAtTarget();
    }

    private moveEndCheck() {
        let p: Laya.Point = new Laya.Point(this.x, this.y);
        p = CampaignMapCenterCheckHelper.checkOutScene(p);
        this.setPosition(p.x, p.y);
    }

    set x(value: number) {
        if (super.x == value) {
            return;
        }
        super.x = value;
        // SmallMapBar.Instance.iconContainerX = value / GameUIConfig.SMALL_MAP_SCALE;
        if (this._fogLayer) {
            this._fogLayer.updateContainerPosX();
        }
    }

    get x(): number {
        return super.x;
    }

    get y(): number {
        return super.y;
    }

    set y(value: number) {
        if (super.y == value) {
            return;
        }
        super.y = value;
        // SmallMapBar.Instance.iconContainerY = value / GameUIConfig.SMALL_MAP_SCALE;
        if (this._fogLayer) {
            this._fogLayer.updateContainerPosY();
        }
    }

    public setPosition($x: number, $y: number) {
        let ismonopoly: boolean = WorldBossHelper.checkMonopoly(this._mapModel.mapId);
        if (ismonopoly) $y = 0;
        this.x = $x;
        this.y = $y;
        if (Math.abs((this._prePoint.x - this.x) >> 0) > 100 || Math.abs((this._prePoint.y - this.y) >> 0) > 100) {
            this.moveOver(this.x, this.y);
        }
    }
    //初始化位置, 调用setPosition, 如果角色初始化位置x,y在+-100内将不会刷新地图格子。
    //因此BgLayer 初始化的时候, 不再刷新地图格子, 避免坐标未更新, 优先加载100以内的格子。
    public initPosition(x: number, y: number) {
        let ismonopoly: boolean = WorldBossHelper.checkMonopoly(this._mapModel.mapId);
        if (ismonopoly) y = 0;
        this.x = x;
        this.y = y;
        this.moveOver(this.x, this.y);
    }

    private _prePoint: Laya.Point = new Laya.Point();

    public updateOff($old: number, $new: number) {
        if (Math.abs(($new - $old) >> 0) > 100) {
            this.moveOver(this.x, this.y);
        }
    }

    private moveOver($x: number, $y: number) {

        this._prePoint.x = $x;
        this._prePoint.y = $y;
        if (this._staticLayer && this.stage) {
            let rect: Laya.Rectangle = MapViewHelper.getCurrentMapRect(this);
            CampaignManager.Instance.controller.moveMapCallBack(rect);
            this._staticLayer.backgroundXandY(-this.x, -this.y);
            this._staticLayer.upDateNextRend();
        }
        this.event(CampaignMapEvent.MOVE_SCENET_END, this);
    }

    private setStepRender() {
        if (WorldBossHelper.checkPetLand(this._mapModel.mapId) || WorldBossHelper.checkMineral(this._mapModel.mapId)) {
            this.stepRender = true
        }
    }

    public get walkLayer(): CampaignWalkLayer {
        return this._walkLayer;
    }

    public get mainBuidingLayer(): CampaignMainBuidingLayer {
        return this._mainBuidingLayer;
    }

    public get fogLayer(): FogView {
        return this._fogLayer;
    }

    public get campaignTempInfo(): t_s_mapData {
        if (this._mapModel) {
            return this._mapModel.mapTempInfo;
        }
        return null;
    }

    public get npcLayer(): NpcLayer {
        return this._npcLayer;
    }

    public getNpcNodeById(id: number): DisplayObject {
        return this._mapModel.getNodeById(id);
    }

    // public get sceneScene() : SceneScene
    // {
    // 	return _sceneScene;
    // }

    public get staticRenderLayer(): MapRenderLayer {
        return this._staticRenderLayer;
    }

    public dispose() {
        this.removeEvent();
        TweenLite.killTweensOf(this);
        MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
        if (this._bgLayer) {
            ObjectUtils.disposeObject(this._bgLayer);
        }
        this._bgLayer = null;
        if (this._singleBgLayer) {
            ObjectUtils.disposeObject(this._singleBgLayer);
        }
        this._singleBgLayer = null;
        if (this._fogLayer) {
            this._fogLayer.dispose();
        }
        this._fogLayer = null;
        if (this._npcLayer) {
            this._npcLayer.dispose();
        }
        this._npcLayer = null;
        if (this._mainBuidingLayer) {
            this._mainBuidingLayer.dispose();
        }
        this._mainBuidingLayer = null;
        if (this._walkLayer) {
            this._walkLayer.dispose();
        }
        this._walkLayer = null;
        this._mapModel = null;
        if (this._staticRenderLayer) {
            this._staticRenderLayer.dispose();
        }
        this._staticRenderLayer = null;
        // this._sceneScene = null;
        if (this._staticLayer) {
            this._staticLayer.dispose();
        }
        if (this._shadowUILayer) ObjectUtils.disposeObject(this._shadowUILayer); this._shadowUILayer = null;
        this._staticLayer = null;
    }

    private fixScreen() {
        // 设计分辨率变大了, 云端背景图未重新设计；采用宽适配模式缩放地图
        let ismonopoly: boolean = WorldBossHelper.checkMonopoly(this._mapModel.mapId);
        if (!ismonopoly) return;
        if (Resolution.scaleFixWidth) {
            Resolution.scaleFixWidth_fixBgHeight(this._mapModel.mapTempInfo.Width, this._mapModel.mapTempInfo.Height, this)
        }
        this.y = 0;
    }
}