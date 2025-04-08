import { BaseSceneView } from "../map/scene/BaseSceneView";
import { OuterCityModel } from "../map/outercity/OuterCityModel";
import { OuterCityMap } from "../map/outercity/OuterCityMap";
import { PackageIn } from "../../core/net/PackageIn";
import Dictionary from "../../core/utils/Dictionary";
import { ChatEvent, NotificationEvent, OuterCityEvent, SceneViewEvent, SLGSocketEvent } from "../constant/event/NotificationEvent";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { BaseCastle } from "../datas/template/BaseCastle";
import { ArmyManager } from "../manager/ArmyManager";
import { BuildingSocketOutManager } from "../manager/BuildingSocketOutManager";
import FreedomTeamManager from "../manager/FreedomTeamManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { NotificationManager } from "../manager/NotificationManager";
import { OuterCityManager } from "../manager/OuterCityManager";
import BuildingManager from "../map/castle/BuildingManager";
import { BuildInfo } from "../map/castle/data/BuildInfo";
import { BuildingEvent } from "../map/castle/event/BuildingEvent";
import { MapInitData } from "../map/data/MapInitData";
import { WildLand } from "../map/data/WildLand";
import { MapElmsLibrary } from "../map/libray/MapElmsLibrary";
import SceneType from "../map/scene/SceneType";
import { PosType } from "../map/space/constant/PosType";
import Tiles from "../map/space/constant/Tiles";
import { BaseArmy } from "../map/space/data/BaseArmy";
import { MapPhysics } from "../map/space/data/MapPhysics";
import { PhysicInfo } from "../map/space/data/PhysicInfo";
import MapDataUtils from "../mapEngine/utils/MapDataUtils";
import ChatData from "../module/chat/data/ChatData";
import MainToolBar from "../module/home/MainToolBar";
import SmallMapBar from "../module/home/SmallMapBar";
import { StageReferance } from "../roadComponent/pickgliss/toplevel/StageReferance";
import { ThaneInfoHelper } from "../utils/ThaneInfoHelper";
import { PreLoadOuterCityData } from "../map/outercity/PreLoadOuterCityData";
import { PlayerManager } from "../manager/PlayerManager";
import LoadingSceneWnd from "../module/loading/LoadingSceneWnd";
import LangManager from "../../core/lang/LangManager";
import HomeWnd from "../module/home/HomeWnd";
import AudioManager from "../../core/audio/AudioManager";
import { SoundIds } from "../constant/SoundIds";
import UIManager from "../../core/ui/UIManager";
import { EmWindow } from "../constant/UIDefine";
import { OuterCitySocketOutManager } from "../manager/OuterCitySocketOutManager";
import { OuterCityArmyView } from "../map/outercity/OuterCityArmyView";
import { CopyNodeDataHelper } from "../map/outercity/CopyNodeDataHelper";
import { GetWalkStartPointHelper } from "../map/outercity/utils/GetWalkStartPointHelper";
import { MapUtils } from "../map/space/utils/MapUtils";
import { UserArmy } from "../map/space/data/UserArmy";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { MapViewHelper } from "../map/outercity/utils/MapViewHelper";
import { UIConstant } from "../constant/UIConstant";
import Logger from "../../core/logger/Logger";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { PlayerModel } from "../datas/playerinfo/PlayerModel";
import FaceSlapManager from "../manager/FaceSlapManager";
import { SharedManager } from "../manager/SharedManager";
import OutCityNodeTypeConstant from "../map/outercity/OutCityNodeTypeConstant";
import OutCityMineNode from "../map/outercity/OutCityMineNode";
import ArmyPositionMsg = com.road.yishi.proto.army.ArmyPositionMsg;
import ArmyRemoveMsg = com.road.yishi.proto.army.ArmyRemoveMsg;
import PosMoveMsg = com.road.yishi.proto.worldmap.PosMoveMsg;
import RouteMsg = com.road.yishi.proto.worldmap.RouteMsg;
import PhysicListUpdateMsg = com.road.yishi.proto.army.PhysicListUpdateMsg;
import WildLandMsg = com.road.yishi.proto.army.WildLandMsg;
import BaseCastleMsg = com.road.yishi.proto.army.BaseCastleMsg;
import ArmyUpdatedGridMsg = com.road.yishi.proto.army.ArmyUpdatedGridMsg;
import ArmyMsg = com.road.yishi.proto.army.ArmyMsg;
import CastleDefenseRspMsg = com.road.yishi.proto.outercity.CastleDefenseRspMsg;
import OutercityRspMsg = com.road.yishi.proto.outercity.OutercityRspMsg;
import OutCityAllInfoMsg = com.road.yishi.proto.army.OutCityAllInfoMsg;
import OneMineInfoMsg = com.road.yishi.proto.army.OneMineInfoMsg;
import OutCityNodeInfoMsg = com.road.yishi.proto.army.OutCityNodeInfoMsg;
import OutCityGoldNodeInfoMsg = com.road.yishi.proto.army.OutCityGoldNodeInfoMsg;
import OutCityOneMineInfo from "../map/outercity/OutCityOneMineInfo";
import { OuterCityMapCameraMediator } from "../mvc/mediator/OuterCityMapCameraMediator";
import { VIPManager } from "../manager/VIPManager";
import { VipPrivilegeType } from "../constant/VipPrivilegeType";
import TreasureInfo from "../map/data/TreasureInfo";
import { StateType } from "../constant/StateType";
import { MapPhysicsCastle } from "../map/outercity/mapphysics/MapPhysicsCastle";
import { OuterCityWarManager } from "../module/outercityWar/control/OuterCityWarManager";
import UIHelper from "../utils/UIHelper";
import OutercityVehicleArmyView from "../map/campaign/view/physics/OutercityVehicleArmyView";
/**
 * @description    外城场景
 * @author yuanzhan.yu
 * @date 2021/11/16 21:05
 * @ver 1.0
 */
export class OuterCityScene extends BaseSceneView {
    private _model: OuterCityModel;
    private _view: OuterCityMap;
    private _parms: Object;
    private _preLoadingOver: boolean = false;
    private _showLoadingTimeId: number = 0;
    private _updateNodeVisibleUint: number = 0;
    private _preSceneData: any;
    /**
     * 距离自己的城堡、英雄可见的像素
     */
    public CAN_SEE_LONG: number = 850;

    public preLoadingStart(data: Object = null): Promise<void> {
        return new Promise(resolve => {
            this._parms = data;
            if (PlayerManager.Instance.currentPlayerModel.mInfo) {
                this._parms = PlayerManager.Instance.currentPlayerModel.mInfo;
            }

            this._model = new OuterCityModel();
            OuterCityManager.Instance.steup(this, this._model);
            OuterCityWarManager.Instance.setup();
            this.initData(data);
            PlayerManager.Instance.currentPlayerModel.inCastle = false;
            if (OuterCityManager.Instance.loadBeforeEnterScene) {
                this._model.floorData = OuterCityManager.Instance.floorData
                this._model.moviesData = OuterCityManager.Instance.moviesData
                this._model.topsData = OuterCityManager.Instance.topsData
                this._model.mapTielsData = OuterCityManager.Instance.mapTielsData
                this.preLoadingOver();
                OuterCityManager.Instance.loadBeforeEnterScene = false;
                resolve();
                return;
            }

            MapElmsLibrary.Instance.lock();
            if (data && data["isDealyShowSmallLoading"]) {
                this._preLoadingOver = false;
                this._showLoadingTimeId = setInterval(this.showLoading.bind(this), 1500);
            }

            new PreLoadOuterCityData(this._model).syncBackCall(() => {
                this.preLoadingOver();
                resolve();
            });
        });
    }

    private initData(data: Object): void {
        if (data instanceof MapInitData) {
            let mI: MapInitData = <MapInitData>data;
            this._model.targetPoint = mI.targetPoint;
            let map: number = (mI.mapTempInfo.Id == 100 ? this.mapNodeInfo.info.mapId : mI.mapTempInfo.Id);
            this._model.mapId = map;
        }
        else {
            let posX = this.mapNodeInfo.x
            let posY = this.mapNodeInfo.y
            let army: BaseArmy = ArmyManager.Instance.army;
            if (army) {
                posX = army.curPosX * 20
                posY = army.curPosY * 20
            } else {
                Logger.warn("[OuterCityScene]没找到自己部队信息")
            }

            this._model.targetPoint = new Laya.Point(posX, posY);
            this._model.mapId = this.mapNodeInfo.info.mapId;//castleInfo.mapId;
        }
    }

    private showLoading(): void {
        if (this._showLoadingTimeId > 0) {
            clearInterval(this._showLoadingTimeId);
        }
        this._showLoadingTimeId = 0;
        if (!this._preLoadingOver) {
            LoadingSceneWnd.Instance.Show();
        }
    }

    preLoadingOver(): void {
        this._preLoadingOver = true;
        super.preLoadingOver();
        this._updateNodeVisibleUint = setInterval(this.updateNodeVisible.bind(this), 200);
    }

    /**
     *因为外城添加了迷雾, 所有计算地图上所有节点和自己的城堡、人物的位置以更新节点是否显示
     *
     */
    private updateNodeVisible(): void {
        if (this._model) {
            this.updateCastlesVisible();
            this.updateWildLandVisible();
            this.updateArmyVisible();
        }
    }

    /**
     *更新建筑的visible
     *
     */
    private updateCastlesVisible(): void {
        let allCastles: Dictionary = this._model.allCastles;
        if (allCastles == null) {
            return;
        }
        for (const allCastlesKey in allCastles) {
            if (allCastles.hasOwnProperty(allCastlesKey)) {
                let temp: Dictionary = allCastles[allCastlesKey];
                for (const tempKey in temp) {
                    if (temp.hasOwnProperty(tempKey)) {
                        let c: BaseCastle = temp[tempKey];
                        if (c.nodeView == null) {
                            continue;
                        }
                        c.nodeView.visible = true;
                    }
                }
            }
        }
    }

    /**
     *更新野怪visible
     *
     */
    private updateWildLandVisible(): void {
        let allWildLand: Dictionary = this._model.allWildLand;
        if (allWildLand == null) {
            return;
        }
        for (const allWildLandKey in allWildLand) {
            if (allWildLand.hasOwnProperty(allWildLandKey)) {
                let temp: Dictionary = allWildLand[allWildLandKey];
                for (const tempKey in temp) {
                    if (temp.hasOwnProperty(tempKey)) {
                        let c: MapPhysics = temp[tempKey];
                        if (c.nodeView == null) {
                            continue;
                        }
                        //神圣之光在生效时间内
                        if (this._model.bossInfo.leftFogTime > 0) {
                            c.nodeViewVisible = true;
                            continue;
                        }
                        //检查自己
                        c.nodeViewVisible = false;
                        if (this.checkInTeamDistance(c.x, c.y)) {
                            c.nodeViewVisible = true;
                            continue;
                        }
                        if (this.checkInCastleDistance(c)) {
                            c.nodeViewVisible = true;
                            continue;
                        }
                        let selfVehicle: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle()
                        if (selfVehicle) {
                            if (c && (Math.abs(c.x - selfVehicle.x) < this.CAN_SEE_LONG
                                && Math.abs(c.y - selfVehicle.y) < this.CAN_SEE_LONG)) {
                                c.nodeViewVisible = true;
                            }
                        }
                        //距离850以外的金矿节点可见,BOSS可见.
                        if (this.selfArmy.armyView != null) {
                            if (Math.abs(c.x - this.selfArmy.armyView.x) > this.CAN_SEE_LONG || Math.abs(c.y - this.selfArmy.armyView.y) > this.CAN_SEE_LONG) {
                                if (c && c.info && c.info.types == PosType.OUTERCITY_MINE) {//金矿全显示
                                    c.nodeViewVisible = true;
                                    continue;
                                } else if (c && c.info && c.info.types == PosType.OUTERCITY_BOSS_NPC) {//BOSS
                                    if (VIPManager.Instance.model.isOpenPrivilege(VipPrivilegeType.OUTCITY_BOSS_COORDINATE))//vip等级满足
                                    {
                                        c.nodeViewVisible = true;
                                        continue;
                                    }
                                }
                            }
                            else {
                                c.nodeViewVisible = true;
                                continue;
                            }
                        }
                    }
                }
            }
        }
    }

    //如果我有队伍,这个节点距离队友的距离在850以内可见
    private checkInTeamDistance(x: number, y: number): boolean {
        let flag: boolean = false;
        if (FreedomTeamManager.Instance.model) {//有队伍
            var members: Array<BaseArmy> = FreedomTeamManager.Instance.model.allMembers;
            for (let i: number = 0; i < members.length; i++) {
                let baseArmy: BaseArmy = members[i];
                if (baseArmy && (Math.abs(baseArmy.curPosX * Tiles.WIDTH - x) < this.CAN_SEE_LONG
                    && Math.abs(y - baseArmy.curPosY * Tiles.HEIGHT) < this.CAN_SEE_LONG)) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    //这个人距离我的城堡距离在850以内
    private checkInMyCastleDistance(x: number, y: number): boolean {
        let flag: boolean = false;
        let allCastles: Dictionary = this._model.allCastles;
        if (allCastles == null) {
            return flag;
        }
        for (const allCastlesKey in allCastles) {
            if (allCastles.hasOwnProperty(allCastlesKey)) {
                let temp: Dictionary = allCastles[allCastlesKey];
                for (const tempKey in temp) {
                    if (temp.hasOwnProperty(tempKey)) {
                        let baseCastle: BaseCastle = temp[tempKey];
                        if ((baseCastle && baseCastle.tempInfo.ID == OuterCityModel.SELT_CALSTE_TEMPLATEID)
                            || baseCastle.defencerGuildName == this.playerInfo.consortiaName) {
                            if (Math.abs(baseCastle.x - x) < this.CAN_SEE_LONG
                                && Math.abs(y - baseCastle.y) < this.CAN_SEE_LONG) {
                                flag = true;
                            }
                        }
                    }
                }
            }
        }
        return flag;

    }

    //如果这个节点距离物资车距离在850以内可见
    private checkInVehicleDistance(x: number, y: number): boolean {
        let flag: boolean = false;
        let allVehicleDic: Dictionary = this._model.allVehicleNode;
        if (allVehicleDic == null) {
            return flag;
        }
        let selfVehicle: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
        for (const allVehicleDicKey in allVehicleDic) {
            if (allVehicleDic.hasOwnProperty(allVehicleDicKey)) {
                let outercityVehicleArmyView: OutercityVehicleArmyView = allVehicleDic.get(allVehicleDicKey);
                if (Math.abs(outercityVehicleArmyView.x - x) < this.CAN_SEE_LONG
                    && Math.abs(y - outercityVehicleArmyView.y) < this.CAN_SEE_LONG
                    && selfVehicle && selfVehicle.wildInfo.templateId == parseInt(allVehicleDicKey)) {
                    flag = true;
                }
            }
        }
        return flag;
    }

    //如果这个节点距离城堡距离在850以内可见
    private checkInCastleDistance(c: MapPhysics): boolean {
        let flag: boolean = false;
        let allCastles: Dictionary = this._model.allCastles;
        if (allCastles == null) {
            return flag;
        }
        for (const allCastlesKey in allCastles) {
            if (allCastles.hasOwnProperty(allCastlesKey)) {
                let temp: Dictionary = allCastles[allCastlesKey];
                for (const tempKey in temp) {
                    if (temp.hasOwnProperty(tempKey)) {
                        let baseCastle: BaseCastle = temp[tempKey];
                        if (Math.abs(baseCastle.x - c.x) < this.CAN_SEE_LONG
                            && Math.abs(c.y - baseCastle.y) < this.CAN_SEE_LONG) {
                            flag = true;
                        }
                    }
                }
            }
        }
        return flag;
    }
    /**
     *更新军队visible
     *
     */
    private updateArmyVisible(): void {
        let allArmyDict: Dictionary = this._model.allArmyDict;
        if (allArmyDict == null) {
            return;
        }
        for (const allArmyDictKey in allArmyDict) {
            if (allArmyDict.hasOwnProperty(allArmyDictKey)) {
                let c: BaseArmy = allArmyDict[allArmyDictKey];
                let outerCityArmyView = c.armyView as OuterCityArmyView;
                if (outerCityArmyView == null) {
                    continue;
                }
                if (outerCityArmyView.isSelf) {
                    continue;
                }

                // if (FreedomTeamManager.Instance.model != null) {
                //     let baseArmy: BaseArmy = FreedomTeamManager.Instance.model.getMemberByUserId(c.userId);
                //     if (baseArmy != null) {
                //         outerCityArmyView.visible = true;
                //         outerCityArmyView.showInfo(true);
                //         this._view.denseFogLayer.addArmyHole(baseArmy.userId, baseArmy.curPosX * 20, baseArmy.curPosY * 20);
                //         continue;
                //     }
                // }

                let notHideOther = !SharedManager.Instance.hideOtherPlayer;
                outerCityArmyView.visible = false;
                outerCityArmyView.showInfo(false, false);
                outerCityArmyView.noShadow = true;

                //队友
                if (outerCityArmyView.isTeammate) {
                    outerCityArmyView.visible = true;
                    outerCityArmyView.showInfo(true);
                    this._view.denseFogLayer.addArmyHole(c.userId, c.curPosX * 20, c.curPosY * 20);
                    continue;
                }
                //在队友的可见范围内
                if (this.checkInTeamDistance(outerCityArmyView.x, outerCityArmyView.y)) {
                    outerCityArmyView.visible = true;
                    continue;
                }
                //神圣之光在生效时间内
                if (this._model.bossInfo.leftFogTime > 0) {
                    outerCityArmyView.visible = notHideOther;
                    outerCityArmyView.showInfo(notHideOther, notHideOther);
                    continue;
                }

                //在物资车的可见范围内
                if (this, this.checkInVehicleDistance(outerCityArmyView.x, outerCityArmyView.y)) {
                    outerCityArmyView.visible = true;
                    continue
                }
                if (this.selfArmy.armyView) {
                    let inDistance = (Math.abs(outerCityArmyView.x - this.selfArmy.armyView.x) <= this.CAN_SEE_LONG && Math.abs(outerCityArmyView.y - this.selfArmy.armyView.y) <= this.CAN_SEE_LONG)
                    if (inDistance) {
                        outerCityArmyView.visible = notHideOther;
                        outerCityArmyView.showInfo(true, outerCityArmyView.visible);
                    }
                }
            }
        }
    }

    /**
     * 检查节点附近是否有自己的对友
     * @param nodeX
     * @param nodeY
     * @return
     *
     */
    private checkTeamMember(nodeX: number, nodeY: number): boolean {
        let b: boolean = false;
        if (FreedomTeamManager.Instance.model == null) {
            return b;
        }

        let arr: any[] = FreedomTeamManager.Instance.model.allMembers;
        let i: number;
        for (i = 0; i < arr.length; i++) {
            let baseAemy: BaseArmy = this._model.getWorldArmyById(arr[i].id);
            if (FreedomTeamManager.Instance.memberIsOnline(arr[i].id)) {
                continue;
            }
            if (baseAemy == null) {
                continue;
            }
            if (baseAemy.armyView == null) {
                continue;
            }
            if (Math.abs(nodeX - baseAemy.armyView.x) > this.CAN_SEE_LONG || Math.abs(nodeY - baseAemy.armyView.y) > this.CAN_SEE_LONG) {
                b = false;
            }
            else {
                b = true;
                return b;
            }
        }
        return b;
    }

    public enter(preScene: BaseSceneView, data: Object = null): Promise<void> {
        return new Promise(resolve => {
            this._model.addEventListener(OuterCityEvent.NINE_SLICE_SCALING, this.__nineSliceScalingHandler, this);
            this.addSocketEvent();
            this._view = new OuterCityMap(this, this._model);
            AudioManager.Instance.playMusic(SoundIds.OUTER_CITY, 0);
            this.addChild(this._view);
            this.attackBuild();
            NotificationManager.Instance.addEventListener(OuterCityEvent.START_MOVE, this.__startMoveHandler, this);
            NotificationManager.Instance.addEventListener(OuterCityEvent.MOVE_OVER, this.__moveOverHandler, this);
            NotificationManager.Instance.addEventListener(NotificationEvent.ARMY_SYSC_CALL, this.__syscArmyHandler, this);
            NotificationManager.Instance.addEventListener(NotificationEvent.OPEN_CAMPAIGN_FRAME, this.__armyStopHanlder, this);

            OuterCityManager.Instance.getBossInfo(this._model.mapId);
            OuterCityManager.Instance.getVehicleInfo();
            OuterCityManager.Instance.getMineAndCityInfo();
            this._preSceneData = data;
            resolve();
        });
    }

    /**
     * 攻击锁定的动画
     */
    private _attacking: fgui.GMovieClip;

    private attackBuild(): void {
        if (!this._attacking) {
            this._attacking = fgui.UIPackage.createObject(EmWindow.OuterCity, "ComAttackingAsset2").asMovieClip;
        }
        this._attacking.x = -55;
        this._attacking.y = -155;
    }

    public enterOver(): Promise<void> {
        return new Promise(async resolve => {
            this.releaseScene();
            if (!HomeWnd.Instance.isShowing) {
                await HomeWnd.Instance.instShow();
                HomeWnd.Instance.getSmallMapBar().switchSmallMapState(SmallMapBar.OUTERCITY_SMALL_MAP_STATE);
                let center: Laya.Point = MapViewHelper.targetSolveCenter(this._model.targetPoint);
                HomeWnd.Instance.getSmallMapBar().iconContainerX = center.x / UIConstant.SMALL_MAP_SCALE;
                HomeWnd.Instance.getSmallMapBar().iconContainerY = center.y / UIConstant.SMALL_MAP_SCALE;
            }
            await UIManager.Instance.ShowWind(EmWindow.SpaceTaskInfoWnd);
            if (OuterCityManager.Instance.model
                && PlayerManager.Instance.currentPlayerModel
                && (this.playerModel.sumCD > PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond
                    && this.playerModel.treasureState == OuterCityModel.TREASURE_STATE3)) {
                FrameCtrlManager.Instance.open(EmWindow.OuterCityTreasureCDWnd);
            }

            if (this._preSceneData) {
                if (this._preSceneData.isOpenColosseum) {
                    FrameCtrlManager.Instance.open(EmWindow.Colosseum);
                }
                else if (this._preSceneData.isOpenOutCityWar) {
                    let fightModel = OuterCityWarManager.Instance.model
                    if (fightModel) {
                        if (fightModel.castleNodeId) {
                            FrameCtrlManager.Instance.open(EmWindow.OuterCityWarWnd, { needRefreshAll: true });
                        } else {
                            Logger.info("战斗返回城战失败：找不到选择的城堡节点")
                        }
                    }
                }
            }
            if (this._parms && this._parms instanceof MapInitData && !this._parms["showMapName"]) {
                resolve();
                return;
            }
            if (this._parms && this._parms.hasOwnProperty("showMapName") && !this._parms["showMapName"]) {
                resolve();
                return;
            }
            UIManager.Instance.ShowWind(EmWindow.MapNameMovie, { backCall: this.sendComplete.bind(this), mapId: this._model.mapId, mapName: this._model.mapTempInfo.MapNameLang });
            FaceSlapManager.Instance.showNext();
            super.enterOver();
            resolve();
        });
    }

    private sendComplete(): void {
        NotificationManager.Instance.dispatchEvent(SceneViewEvent.ADD_TO_STAGE, SceneType.OUTER_CITY_SCENE);
    }

    public leaving(): Promise<void> {
        return new Promise(async resolve => {
            OuterCityMapCameraMediator.unlockMapCamera();
            this.removeEvent();
            clearInterval(this.timeid);
            await HomeWnd.Instance.instHide();
            if (UIManager.Instance.isShowing(EmWindow.SpaceTaskInfoWnd)) {
                UIManager.Instance.HideWind(EmWindow.SpaceTaskInfoWnd);
            }
            if (FrameCtrlManager.Instance.isOpen(EmWindow.OuterCityTreasureCDWnd)) {
                FrameCtrlManager.Instance.exit(EmWindow.OuterCityTreasureCDWnd);
            }
            if (this._view) {
                this._view.removeSelf();
                this._view.dispose();
            }
            this._view = null;
            OuterCityManager.Instance.dispose();
            if (this._attacking) {
                this._attacking.displayObject.removeSelf();
                this._attacking.playing = false;
                this._attacking = null;
            }
            NotificationManager.Instance.removeEventListener(OuterCityEvent.START_MOVE, this.__startMoveHandler, this);
            NotificationManager.Instance.removeEventListener(OuterCityEvent.MOVE_OVER, this.__moveOverHandler, this);
            NotificationManager.Instance.removeEventListener(NotificationEvent.ARMY_SYSC_CALL, this.__syscArmyHandler, this);
            NotificationManager.Instance.removeEventListener(NotificationEvent.OPEN_CAMPAIGN_FRAME, this.__armyStopHanlder, this);
            clearInterval(this._updateNodeVisibleUint);
            if (this._model) {
                MapElmsLibrary.Instance.unLock();
                this._model.removeEventListener(OuterCityEvent.NINE_SLICE_SCALING, this.__nineSliceScalingHandler, this);
                this._model.dispose();
            }
            this._model = null;
            resolve();
        });
    }

    private __syscArmyHandler(): void {
        OuterCitySocketOutManager.sendArmyPosRequest();
    }

    public get SceneName(): string {
        return SceneType.OUTER_CITY_SCENE;
    }


    public get mapView(): OuterCityMap {
        return this._view;
    }

    /**
     * 自己行走停下后的处理方法 弹出窗口
     *
     */
    private __moveOverHandler(curr: Laya.Point): void {
        this._view.worldWalkLayer.walkTarget.visible = false;
        this._model.isWalkIng = false;
        if (OuterCityManager.Instance.model.checkOutScene()) {
            OuterCityMapCameraMediator.lockMapCamera()
        } else {
            OuterCityMapCameraMediator.unlockMapCamera();
        }
        if (this._attacking) {
            this._attacking.displayObject.removeSelf();
            this._attacking.playing = false;
        }
        if (this._model.walkTargerData) {
            let targer: Laya.Point = new Laya.Point(this._model.walkTargerData.x, this._model.walkTargerData.y);
            Logger.xjy("[OuterCityScene]__moveOverHandler", curr.x, curr.y, targer.x, targer.y)
            if (curr.distance(targer.x, targer.y) <= 132) {
                let data = this._model.walkTargerData
                if (data instanceof BaseCastle) {
                    if (data.uncontestable) {
                        Logger.info("外城进入不可争夺城堡 不显示城战界面")
                    } else {
                        Logger.info("外城进入可争夺城堡 清理之前的数据", data.info.nodeName)
                        OuterCityWarManager.Instance.model.clear();
                        OuterCityWarManager.Instance.model.castleInfo = data;
                        FrameCtrlManager.Instance.open(EmWindow.OuterCityWarWnd, { needReqCastle: true });
                        // 防止偶现在城战界面出现此提示
                        UIManager.Instance.HideWind(EmWindow.OuterCityCastleTips);
                        UIManager.Instance.HideWind(EmWindow.LookPlayerList);
                        UIManager.Instance.HideWind(EmWindow.OuterCityArmyTips);
                    }
                }
                else if (this._model.walkTargerData instanceof WildLand) {
                    switch (this._model.walkTargerData.info.types) {
                        case PosType.RESOURCE:
                            UIManager.Instance.ShowWind(EmWindow.OuterCityFieldInfoWnd, this._model.walkTargerData);
                            break;
                        case PosType.TREASURE:
                            FrameCtrlManager.Instance.open(EmWindow.OutercityGoldMineWnd, this._model.walkTargerData);
                            break;
                        case PosType.TREASURE_MINERAL:
                            FrameCtrlManager.Instance.open(EmWindow.OuterCityTreasureWnd, this._model.walkTargerData);
                            break;
                        case PosType.OUTERCITY_VEHICLE:
                            if(OuterCityManager.Instance.model.checkAllInFighting(this._model.walkTargerData)){
                                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outercityVehicle.checkCanAttackVehicle.tips"));
                            }
                            else if (OuterCityManager.Instance.model.checkTeamInFight(this._model.walkTargerData)
                                ||OuterCityManager.Instance.model.checkCanAttackVehicle(this._model.walkTargerData)) {
                                OuterCityManager.Instance.vehicleAttck(this._model.walkTargerData.templateId);
                            } else {
                                FrameCtrlManager.Instance.open(EmWindow.OuterCityVehicleInfoWnd, this._model.walkTargerData);
                            }
                            break;
                        case PosType.OUTERCITY_BOSS_NPC:
                        case PosType.OUTERCITY_COMMON_JINGYING:
                        case PosType.OUTERCITY_COMMON_NPC:
                            if (this._model.walkTargerData.hasOwnProperty("_tempInfo")) // data.info.type != 20 新手占领金矿依然使用之前的攻击方式
                            {
                                let msg: string = LangManager.Instance.GetTranslation("map.outercity.view.bossinfo.attackMsg", this._model.walkTargerData.tempInfo.NameLang);
                                let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
                                let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
                                let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
                                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, this._model.walkTargerData, prompt, msg, confirm, cancel, this.onOuterCityAttack.bind(this));
                            }
                            break;
                    }
                } else if (this._model.walkTargerData instanceof TreasureInfo) {
                    FrameCtrlManager.Instance.open(EmWindow.OuterCityTreasureWnd, this._model.walkTargerData);
                }
                else {
                    this._model.walkTargerData = null;
                }
            }
            else {
                this._model.walkTargerData = null;
            }
        }
    }

    public sendAttack(posX: number, posY: number): void {
        let aView: OuterCityArmyView = this.selfAvatarView;
        if (!aView) {
            return;
        }
        OuterCitySocketOutManager.sendAttack(this._model.mapId, posX, posY);
    }

    private onOuterCityAttack(b: boolean, flag: boolean, data: MapPhysics): void {
        if (b) {
            AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
            OuterCityManager.Instance.controler.sendAttack(data.posX, data.posY);
        }
    }

    /**
     * 打开副本相关的面板 人物停止行走
     *
     */
    private __armyStopHanlder(): void {
        if (this.selfAvatarView) {
            this.selfAvatarView.info.pathInfo = [];
        }
    }

    private __startMoveHandler(data: any): void {
        if (!this._model) {
            return;
        }
        if (!this._model.mapTielsData) {
            return;
        }
        let selfVehicle: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
        if(selfVehicle){
            return;
        }
        if (this.selfAvatarView) {
            Logger.xjy("外城移动, 人物坐标 x==", this.selfAvatarView.x + " y==", this.selfAvatarView.y);
        }
        this._model.isWalkIng = true;
        if (!this.selfArmy && this.selfArmy.mapId != this._model.mapId) {
            let str: string = LangManager.Instance.GetTranslation("map.outercity.mediator.mapview.OuterCitySmallMapMediator.command01");
            MessageTipManager.Instance.show(str);
            NotificationManager.Instance.dispatchEvent(NotificationEvent.ARMY_SYSC_CALL, null);
            return;
        }
        let next: Laya.Point;
        let walkEff: fgui.GMovieClip = this._view.worldWalkLayer.walkTarget;
        if (data instanceof Laya.Point) {
            Logger.xjy("[OuterCityScene]走到某点", data)
            this._model.walkTargerData = null;
            next = data as Laya.Point;
            if (this._attacking) {
                this._attacking.displayObject.removeSelf();
                this._attacking.playing = false;
            }
            walkEff.visible = true;
        }
        else if (data instanceof MapPhysics) {//怪物
            let temp: MapPhysics = data as MapPhysics;
            Logger.xjy("[OuterCityScene]走到某物体", data)
            this._model.walkTargerData = CopyNodeDataHelper.cloneMapPhysics(temp);
            next = new Laya.Point(this._model.walkTargerData.x, this._model.walkTargerData.y + 40);
            if (temp.nodeView) {
                let mapPhysicsCastle: MapPhysicsCastle = temp.nodeView as MapPhysicsCastle;
                let object = mapPhysicsCastle.sizeInfo
                let w = object.width;
                let h = object.height;
                let x = object.x;
                let y = object.y;
                this._attacking.x = this._model.walkTargerData.x - (x - parseInt(((w - 125) / 2).toString()));
                this._attacking.y = this._model.walkTargerData.y + (h - y - 200);

                if (temp.info.types == PosType.OUTERCITY_TREASURE) {
                    this._attacking.x = this._model.walkTargerData.x;
                    this._attacking.y = this._model.walkTargerData.y - 90;
                } else if (temp.info.types == PosType.OUTERCITY_CITY) {
                    let mapPhysicsCastle: MapPhysicsCastle = temp.nodeView as MapPhysicsCastle;
                    let object = mapPhysicsCastle.sizeInfo
                    let w = object.width;
                    let h = object.height;
                    let x = object.x;
                    let y = object.y;
                    this._attacking.x = this._model.walkTargerData.x - (x - parseInt(((w - 125) / 2).toString()));
                    this._attacking.y = this._model.walkTargerData.y + (h - y - 200);
                } else {
                    this._attacking.x = this._model.walkTargerData.x - 55;
                    this._attacking.y = this._model.walkTargerData.y - 120;
                }
                this._attacking.playing = true;
                this._view.worldWalkLayer.addChildAt(this._attacking.displayObject, 0);
            } else if (temp.info.types == PosType.OUTERCITY_BOSS_NPC
                || temp.info.types == PosType.OUTERCITY_COMMON_JINGYING
                || temp.info.types == PosType.OUTERCITY_COMMON_NPC) {
                this._attacking.x = this._model.walkTargerData.x - 55;
                this._attacking.y = this._model.walkTargerData.y - 120;
                this._attacking.playing = true;
                this._view.worldWalkLayer.addChildAt(this._attacking.displayObject, 0);
            } else if (temp.info.types == PosType.OUTERCITY_VEHICLE) {
                this._attacking.x = this._model.walkTargerData.x - 60;
                this._attacking.y = this._model.walkTargerData.y - 170;
                this._attacking.playing = true;
                this._view.worldWalkLayer.addChild(this._attacking.displayObject);
            }
            walkEff.visible = false;
        }
        if (!this.selfAvatarView) {
            walkEff.visible = false;
            if (this._model) {
                // this._model.layMapArmy([this.selfArmy]);
            }
            return;
        }
        let curr: Laya.Point = new Laya.Point(Math.floor(this.selfAvatarView.x), Math.floor(this.selfAvatarView.y));
        let paths = [];
        if (this._model.isFlying(ArmyManager.Instance.army.mountTemplateId)) {
            paths = [curr, next];
        } else {
            paths = this._view.worldWalkLayer.pathScene.searchPath(curr, next);
        }
        if (paths && paths.length > 0) {
            walkEff.x = paths[paths.length - 1].x;
            walkEff.y = paths[paths.length - 1].y;
            this.selfAvatarView.info.pathInfo = paths;
            this._model.isWalkIng = true;
        } else {
            //isWalkIng 虽然没有使用, 还是保持了一下。
            this._model.isWalkIng = false;
            walkEff.visible = false;
            if (this._attacking) {
                this._attacking.displayObject.removeSelf();
                this._attacking.playing = false;
            }
            if (!(data instanceof Laya.Point)) {
                this.__moveOverHandler(curr);
            }
        }
        Logger.xjy("[OuterCityScene]paths", paths)

    }

    public get selfAvatarView(): OuterCityArmyView {
        let aInfo: BaseArmy = this._model.getWorldArmyByUserId(this.playerInfo.userId);
        if (aInfo) {
            return aInfo.armyView as OuterCityArmyView;
        }
        return null;

    }

    /*********************************
     *      屏幕移动, 拖动等逻辑
     ********************************/
    private __nineSliceScalingHandler(evt: OuterCityEvent): void {
        let arr: any[] = this._model.checkConfigNoExites();
        if (arr.length > 0 && this._model.floorData) {
            this._model.currentFloorData = arr;
        }
    }

    /**
     * 移动地图后的回调函数 刷新当前屏幕
     * @param rect
     *
     */
    public moveMapCallBack(rect: Laya.Rectangle): void {
        this._model.targetPoint = new Laya.Point(rect.x, rect.y);
        this._model.nineSliceScaling = MapUtils.getNineSliceScaling(rect);
        let arr: any[] = this._model.checkUpdateConfig();
        if (arr.length == 0) {
            return;
        }
        if(ArmyManager.Instance.army && ArmyManager.Instance.army.armyView){
            this._model.oldPoint =  new Laya.Point(ArmyManager.Instance.army.armyView.x,ArmyManager.Instance.army.armyView.y);
        }
        this.sendRefreshScreen(MapUtils.getFilesIds(arr));
    }


    /*********************************
     *      AMF数据请求
     *      屏幕同步
     ********************************/
    public sendRefreshScreen(files: string): void {
        if (files == "") {
            return;
        }
        OuterCitySocketOutManager.sendCurrentScreen(this.getCurrent9Screens(), this._model.mapId);
        OuterCitySocketOutManager.sendGetArmyByGrid(this._model.mapId, files);
        OuterCitySocketOutManager.sendGetWildLandByGrid(this._model.mapId, files);
    }

    private getCurrent9Screens(): string {
        return MapUtils.getFilesIds(this._model.nineSliceScaling);
    }


    /*********************************
     * GET数据对象
     ********************************/
    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private get mapNodeInfo(): BaseCastle {
        return PlayerManager.Instance.currentPlayerModel.mapNodeInfo;
    }

    public get selfArmy(): UserArmy {
        return ArmyManager.Instance.army;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }


    /*********************************
     *    Socket数据接收
     ********************************/
    private addSocketEvent(): void {
        ServerDataManager.listen(S2CProtocol.U_C_BROAD_POS, this, this.__broadPosHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ARMY_UPDATE_GRID, this, this.__updateScreenArmysHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ARMY_RETURNHOME, this, this.__returnHomeHandler);
        ServerDataManager.listen(S2CProtocol.U_C_CASTLE_DEFENSE, this, this.__updateStatusHandler);
        ServerDataManager.listen(S2CProtocol.U_C_PHYSIC_LIST_UPDATE, this, this.__physicListByBridHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ARMY_REMOVE, this, this.__armyExitOuterCityHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ARMYPOS_SEND, this, this.__syncArmyPosHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ARMY_POSATION, this, this.__transferPosationHandler);
        ServerDataManager.listen(S2CProtocol.U_C_OUTCITY_NODE_INFO, this, this.onAllNodeInfo);
        ServerDataManager.listen(S2CProtocol.U_C_OUTCITY_SON_NODE_INFO, this, this._threeNodeInfoUpdate);
        ServerDataManager.listen(S2CProtocol.U_C_OUTCITY_ONE_NODE_UPDATE_INFO, this, this._secondNodeInfoUpdate);
        ServerDataManager.listen(S2CProtocol.U_C_OUTCITY_ONE_NODE_INFO, this, this._secondAllNodeInfo);
        ServerDataManager.Instance.addEventListener(SLGSocketEvent.UPDATE_CASTLE, this.__updateCastleHandler, this);
        ServerDataManager.Instance.addEventListener(SLGSocketEvent.UPDATE_WILDLAND, this.__updateWildLandHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.UPDTAE_ARMY, this.__updateArmyHandler, this);
        NotificationManager.Instance.addEventListener(ChatEvent.UPDATE_CHAT_VIEW, this.__playerChatHandler, this);
        BuildingManager.Instance.addEventListener(BuildingEvent.U_UNOCCPWILDLAND, this.__unoccupyHandler, this);
    }

    private removeEvent(): void {
        ServerDataManager.cancel(S2CProtocol.U_C_BROAD_POS, this, this.__broadPosHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_ARMY_UPDATE_GRID, this, this.__updateScreenArmysHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_ARMY_RETURNHOME, this, this.__returnHomeHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_CASTLE_DEFENSE, this, this.__updateStatusHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_PHYSIC_LIST_UPDATE, this, this.__physicListByBridHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_ARMY_REMOVE, this, this.__armyExitOuterCityHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_ARMYPOS_SEND, this, this.__syncArmyPosHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_ARMY_POSATION, this, this.__transferPosationHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_OUTCITY_NODE_INFO, this, this.onAllNodeInfo);
        ServerDataManager.cancel(S2CProtocol.U_C_OUTCITY_SON_NODE_INFO, this, this._threeNodeInfoUpdate);
        ServerDataManager.cancel(S2CProtocol.U_C_OUTCITY_ONE_NODE_UPDATE_INFO, this, this._secondNodeInfoUpdate);
        ServerDataManager.cancel(S2CProtocol.U_C_OUTCITY_ONE_NODE_INFO, this, this._secondAllNodeInfo);
        ServerDataManager.Instance.removeEventListener(SLGSocketEvent.UPDATE_CASTLE, this.__updateCastleHandler, this);
        ServerDataManager.Instance.removeEventListener(SLGSocketEvent.UPDATE_WILDLAND, this.__updateWildLandHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.UPDTAE_ARMY, this.__updateArmyHandler, this);
        NotificationManager.Instance.removeEventListener(ChatEvent.UPDATE_CHAT_VIEW, this.__playerChatHandler, this);
        BuildingManager.Instance.removeEventListener(BuildingEvent.U_UNOCCPWILDLAND, this.__unoccupyHandler, this);
    }

    private __syncArmyPosHandler(pkg: PackageIn): void {
        let msg: ArmyPositionMsg = pkg.readBody(ArmyPositionMsg) as ArmyPositionMsg;
        this.selfArmy.mapId = msg.mapId;
        this.selfArmy.curPosX = msg.posX;
        this.selfArmy.curPosY = msg.posY;
        this.selfArmy.commit();
    }

    private __armyExitOuterCityHandler(pkg: PackageIn): void {
        let msg: ArmyRemoveMsg = pkg.readBody(ArmyRemoveMsg) as ArmyRemoveMsg;
        this._model.removeWorldArmyById(msg.armyId);
    }

    private __broadPosHandler(pkg: PackageIn): void {
        let msg: PosMoveMsg = pkg.readBody(PosMoveMsg) as PosMoveMsg;
        if (msg) {
            let teamModel = FreedomTeamManager.Instance.model
            if (teamModel && teamModel.getMemberByUserId(msg.armyUserId)) {//是我的好友
                NotificationManager.Instance.dispatchEvent(OuterCityEvent.UPDATE_MEMBER_POSITION, msg);
            }
        }
        let aInfo: BaseArmy = this._model.getWorldArmyById(msg.armyId);
        if (!aInfo) {
            return;
        }
        let avatarView: OuterCityArmyView = aInfo.armyView as OuterCityArmyView;
        if (!avatarView) {
            return;
        }
        let curr: Laya.Point = new Laya.Point(avatarView.x, avatarView.y);
        let paths: any[] = [];
        paths.push(curr);
        while (msg.routes.length > 0) {
            let node: RouteMsg = msg.routes.shift() as RouteMsg;
            paths.push(new Laya.Point(node.x, node.y));
        }
        avatarView.info.pathInfo = paths;
    }

    /**
     * msg.wildLand 当前屏幕的金矿节点、普通怪, 精英怪,BOSS怪物
     * msg.baseCastle  当前屏幕的城堡节点
     * */
    private __physicListByBridHandler(pkg: PackageIn): void {
        let msg: PhysicListUpdateMsg = pkg.readBody(PhysicListUpdateMsg) as PhysicListUpdateMsg;
        let list: any[] = [];
        for (let i = 0, len = msg.wildLand.length; i < len; i++) {
            const winfo: WildLandMsg = msg.wildLand[i] as WildLandMsg;
            list.push(this._model.readWildLand(winfo));
        }
        let cList: any[] = [];
        for (let i = 0, len = msg.baseCastle.length; i < len; i++) {
            const cInfo: BaseCastleMsg = msg.baseCastle[i] as BaseCastleMsg;
            cList.push(this.readBaseCastle(cInfo));
        }
        this._model.currentWildLand = list;
        this._model.currentCastles = cList;

        Logger.info("外城同屏幕更新", msg)
        OuterCityWarManager.Instance.sendReqAllCastleInfo();
    }

    private readBaseCastle(cInfo: BaseCastleMsg): BaseCastle {
        let castleInfo: BaseCastle;
        let pInfo: PhysicInfo
        castleInfo = this._model.getCastleByIdXY(cInfo.id, cInfo.posX * Tiles.WIDTH, cInfo.posY * Tiles.HEIGHT);
        if (!castleInfo) {
            castleInfo = this._model.popCastleInfo();
        }
        if (!castleInfo) {
            castleInfo = new BaseCastle();
            pInfo = new PhysicInfo();
        } else {
            pInfo = castleInfo.info;
        }
        castleInfo.templateId = cInfo.templateId;
        castleInfo.defenceLeftTime = cInfo.defenceLefttime;
        pInfo.id = cInfo.id;
        pInfo.mapId = cInfo.mapId;
        pInfo.occupyLeagueName = cInfo.occupyLeagueName;
        pInfo.occupyPlayerId = cInfo.occupyPlayerId;
        if (pInfo.occupyPlayerId == this.playerInfo.userId) {
            this.mapNodeInfo.defenceLeftTime = castleInfo.defenceLeftTime;
        }
        pInfo.occupyPlayerName = cInfo.occupyPlayerName;
        pInfo.posX = cInfo.posX;
        pInfo.posY = cInfo.posY;
        pInfo.state = cInfo.state;
        pInfo.names = cInfo.castleName;
        pInfo.types = cInfo.type;
        pInfo.grade = cInfo.grade;
        pInfo.vipCastleView = cInfo.vipCastleView;
        pInfo.vipType = cInfo.vipType
        pInfo.vipGrade = cInfo.vipGrade
        castleInfo.info = pInfo;
        return castleInfo;
    }

    private __updateScreenArmysHandler(pkg: PackageIn): void {
        let msg: ArmyUpdatedGridMsg = pkg.readBody(ArmyUpdatedGridMsg) as ArmyUpdatedGridMsg;
        let armyList: any[] = [];
        let army: BaseArmy;
        let armyThane: ThaneInfo;
        let point: Laya.Point;
        let flag: boolean = false;
        for (let i: number = 0; i < msg.updatedArmy.length; i++) {
            let info: ArmyMsg = msg.updatedArmy[i] as ArmyMsg;
            let armyId: number = info.armyId;
            let userId: number = info.playerId;
            if (userId == this.thane.userId) {
                army = this.selfArmy;
                armyThane = army.baseHero;
            } else {
                army = this._model.getWorldArmyById(armyId);
                if (!army) {
                    army = new UserArmy();
                    armyThane = new ThaneInfo();
                } else {
                    armyThane = army.baseHero;
                }
                army.baseHero = armyThane;
                army.id = info.armyId;
                army.userId = userId;
                armyThane.userId = userId;
                armyThane.headId = info.headId;
                armyThane.state = StateType.ONLINE;
            }

            if (info.hasOwnProperty("isVip")) {
                army.baseHero.IsVipAndNoExpirt = info.isVip;
            }
            if (army.baseHero) {
                army.baseHero.beginChanges();
            }
            army = ThaneInfoHelper.readOuterCityArmyInfo(army, info);
            if (userId == this.thane.userId) {
                flag = true;
                point = GetWalkStartPointHelper.getStartPoint(army.curPosX * 20, army.curPosY * 20, this._model);
            }
            if (army.baseHero) {
                army.baseHero.commit();
            }
            army.commit();
            army.petInfo.commit();
            if (!army.onVehicle) {
                this._model.addArmyToWorldDict(army);
                armyList.push(army);
            }
            else {
                this._model.removeWorldArmyById(armyId);
            }
        }
        if (flag && !point && !this._model.isFlying(ArmyManager.Instance.army.mountTemplateId)) {//当前点不可行走，并且玩家不是飞行坐骑，对玩家坐标进行修正。
            let point: Laya.Point = GetWalkStartPointHelper.getFirstPoint(army.curPosX * 20, army.curPosY * 20, this._model);
            if (point) {
                OuterCityManager.Instance.changePlayerPosition(parseInt((point.x / 20).toString()), parseInt((point.y / 20).toString()));
            }
        }
        else {
            if (this._model && armyList.length > 0) {
                this._model.layMapArmy(armyList);
            }
        }
    }

    private __updateStatusHandler(pkg: PackageIn): void {
        let msg: CastleDefenseRspMsg = pkg.readBody(CastleDefenseRspMsg) as CastleDefenseRspMsg;
        this.mapNodeInfo.defenceLeftTime = msg.leftTime;

        let vx: number = msg.posX * Tiles.WIDTH;
        let vy: number = msg.posY * Tiles.HEIGHT;
        let bInfo: BaseCastle = this._model.getCastleByXY(vx, vy);
        if (bInfo) {
            bInfo.defenceLeftTime = msg.leftTime;
            bInfo.commit();
        }
    }

    /**
     * 更新城堡信息
     *
     */
    private __updateCastleHandler(msg: BaseCastleMsg): void {
        let castleInfo: BaseCastle = this.readBaseCastle(msg);
        castleInfo.commit();
        msg = null;
    }

    /**
     * 同步地图上的金矿相关信息
     * 删除及增加操作
     */
    private __updateWildLandHandler(wildMsg: WildLandMsg): void {
        let wInfo: WildLand = this._model.readWildLand(wildMsg);
        this._model.updateWildLand(wInfo);
    }

    private __updateArmyHandler(army: BaseArmy): void {
        let temp: BaseArmy = this._model.getWorldArmyByUserId(army.userId);
        if (temp) {
            ThaneInfoHelper.cloneArmyInfo(temp, army);
            if (army.onVehicle) {
                this._model.removeWorldArmyById(temp.id);
            }
            else {
                this._model.addArmyToWorldDict(temp);
                this._model.layMapArmy([temp]);
            }
        } else {
            if (!army.onVehicle) {
                this._model.addArmyToWorldDict(army);
                this._model.layMapArmy([army]);
            }
        }
    }

    private __returnHomeHandler(pkg: PackageIn): void {
        let msg: OutercityRspMsg = pkg.readBody(OutercityRspMsg) as OutercityRspMsg
        let armyId: number = msg.result;
        let army: UserArmy = this.selfArmy;
        if (army && army.id == armyId) {
            army.curPosX = msg.curPosX;
            army.curPosY = msg.curPosY;
            this._model.returnHome(armyId);
            let aInfo: BaseArmy = this._model.getWorldArmyById(army.id);
            if (!aInfo) {
                return;
            }
            let av: OuterCityArmyView = aInfo.armyView as OuterCityArmyView;
            if (av) {
                av.info.pathInfo = [];
                av.x = army.curPosX * 20;
                av.y = army.curPosY * 20;
            }

            let p: Laya.Point = new Laya.Point(army.curPosX * 20 - StageReferance.stageWidth / 2, army.curPosY * 20 - StageReferance.stageHeight / 2);
            this._view.motionTo(p);
            this._view.worldWalkLayer.outSceneMovies();
        }
    }

    private timeid: number = 0;

    private __transferPosationHandler(pkg: PackageIn): void {
        let msg: ArmyPositionMsg = pkg.readBody(ArmyPositionMsg) as ArmyPositionMsg;
        let army: UserArmy = this.selfArmy;
        army.curPosX = msg.posX;
        army.curPosY = msg.posY;
        let buildInfoi: BuildInfo = BuildingManager.Instance.model.buildingListByID[-11];
        buildInfoi.property1 = msg.leftEnergy;//传送阵能量
        this._model.posationHandler(army.id);
        let aInfo: BaseArmy = this._model.getWorldArmyById(army.id);
        if (!aInfo) {
            return;
        }
        let av: OuterCityArmyView = aInfo.armyView as OuterCityArmyView;
        if (av) {
            av.isPlaying = false;
            av.info.pathInfo = [];
            av.x = army.curPosX * 20;
            av.y = army.curPosY * 20;
            // let move: fgui.GMovieClip = fgui.UIPackage.createObject(EmWindow.OuterCity, "asset.outercity.transmit").asMovieClip;
            // move.setPivot(0.5, 0.725, true);
            // let point: Laya.Point = this._view.worldWalkLayer.localToGlobal(new Laya.Point(av.x, av.y));
            // move.x = av.x;
            // move.y = av.y;
            // this._view.addChild(move.displayObject);
            // move.setPlaySettings(0, -1, 1, -1, Laya.Handler.create(this, () => {
            //     move && move.displayObject.removeSelf();
            // }));
            this.timeid = setTimeout(() => {
                clearInterval(this.timeid);
                av.isPlaying = true;
            }, 1000);
        } else {
            if (this._model) {
                this._model.layMapArmy([this.selfArmy]);
            }
        }
    }

    /**
    * 
    * @param pkg 解析外城所有节点
    */
    private onAllNodeInfo(pkg: PackageIn): void {
        let msg: OutCityAllInfoMsg = pkg.readBody(OutCityAllInfoMsg) as OutCityAllInfoMsg;
        if (msg.allInfo) {
            Logger.xjy("外城节点数据 0x01B4 ==", msg);
            let len: number = msg.allInfo.length;
            this._model.allMinNode = [];
            for (let i: number = 0; i < len; i++) {
                let type: number = (msg.allInfo[i] as WildLandMsg).type;
                if (type == OutCityNodeTypeConstant.TYPE_CASTLE) {
                    let baseCastle: BaseCastle = this._model.readCastle(msg.allInfo[i] as WildLandMsg);
                    this._model.addCastle(baseCastle);
                }
                else {
                    let wildLand: WildLand = this._model.readWildLand(msg.allInfo[i] as WildLandMsg);
                    if (wildLand.types == OutCityNodeTypeConstant.TYPE_MINE) {//金矿
                        this._model.addWildLand(wildLand);
                        this._model.allMinNode.push(wildLand);
                    }
                }
            }
        }
    }

    /**
     * 
     * @param pkg 三级节点更新 最下面的子节点
     */
    private _threeNodeInfoUpdate(pkg: PackageIn): void {
        let msg: OneMineInfoMsg = pkg.readBody(OneMineInfoMsg) as OneMineInfoMsg;
        if (msg) {
            let wild: WildLand = this._model.findNeedUpdateNode(msg);
            this._model.addWildLand(wild);
            for (let i: number = 0; i < this._model.allMinNode.length; i++) {
                let itemData = this._model.allMinNode[i];
                if (itemData.templateId == msg.posId) {
                    this._model.allMinNode.splice(i, 1);
                }
            }
            this._model.allMinNode.push(wild);
            NotificationManager.Instance.dispatchEvent(OuterCityEvent.UPDATE_THREE_NODE_DATA, msg.posId);
        }
    }

    /**
     * 二级节点更新
     */
    private _secondNodeInfoUpdate(pkg: PackageIn) {
        let msg: OutCityNodeInfoMsg = pkg.readBody(OutCityNodeInfoMsg) as OutCityNodeInfoMsg;
        if (msg) {
            let wlInfo: WildLand = this._model.getWildLandByXY(msg.posX * Tiles.WIDTH + "," + msg.posY * Tiles.HEIGHT);
            let arr: Array<OutCityMineNode> = wlInfo.allNodeInfo;
            let outCityMineNode: OutCityMineNode;
            let len: number = arr.length;
            let needRefresh: boolean = false;
            for (let i: number = 0; i < len; i++) {
                outCityMineNode = arr[i];
                if (outCityMineNode.nodeId == msg.nodeId) {
                    if (outCityMineNode.occupyNum != msg.occupyNum) {
                        outCityMineNode.occupyNum = msg.occupyNum;
                        needRefresh = true;
                    }
                    outCityMineNode.allOccupyNum = msg.allOccupyNum;
                    break;
                }
            }
            this._model.addWildLand(wlInfo);
            if (needRefresh) {
                NotificationManager.Instance.dispatchEvent(OuterCityEvent.UPDATE_SECOND_NODE_SELE_DATA, wlInfo);
            }
            NotificationManager.Instance.dispatchEvent(OuterCityEvent.UPDATE_SECOND_NODE_DATA, [msg.posId, wlInfo]);
        }
    }

    //外城金矿某二级节点下的所有被占领的节点信息(进行分批发送)
    private recvNodeCnt: number = 0
    private _secondAllNodeInfo(pkg: PackageIn) {
        let msg: OutCityGoldNodeInfoMsg = pkg.readBody(OutCityGoldNodeInfoMsg) as OutCityGoldNodeInfoMsg;
        if (msg) {
            let wlInfo: WildLand = this._model.getWildLandByXY(msg.posX * Tiles.WIDTH + "," + msg.posY * Tiles.HEIGHT);
            let allNodeInfoArr: Array<OutCityMineNode> = wlInfo.allNodeInfo;
            let outCityMineNode: OutCityMineNode;
            let len: number = allNodeInfoArr.length;
            let outCityOneMineInfo: OutCityOneMineInfo;
            let targetInfo: OutCityMineNode;
            for (let i: number = 0; i < len; i++) {
                outCityMineNode = allNodeInfoArr[i];
                if (outCityMineNode.nodeId == msg.nodeId) {
                    targetInfo = outCityMineNode;
                    if (!outCityMineNode.nodeAllMineInfoDic) {
                        outCityMineNode.nodeAllMineInfoDic = new Dictionary()
                    }
                    let nodeMineArr = msg.nodeMineInfo;
                    let nodeLen: number = nodeMineArr.length;
                    this.recvNodeCnt += nodeLen;
                    let oneMineInfoMsg: OneMineInfoMsg;
                    for (let j: number = 0; j < nodeLen; j++) {
                        oneMineInfoMsg = nodeMineArr[j] as OneMineInfoMsg;
                        outCityOneMineInfo = new OutCityOneMineInfo();
                        outCityOneMineInfo.posId = oneMineInfoMsg.posId;
                        outCityOneMineInfo.nodeId = oneMineInfoMsg.nodeId;
                        outCityOneMineInfo.sonNodeId = oneMineInfoMsg.sonNodeId;
                        outCityOneMineInfo.occupyPlayerId = oneMineInfoMsg.occupyPlayerId;
                        if (oneMineInfoMsg.occupyPlayerId == this.playerInfo.userId) {//自己的
                            outCityOneMineInfo.sort = 1;
                        } else if (oneMineInfoMsg.guildId == this.playerInfo.consortiaID) {//同工会
                            outCityOneMineInfo.sort = 2;
                        } else {
                            outCityOneMineInfo.sort = 3;
                        }
                        outCityOneMineInfo.playerName = oneMineInfoMsg.playerName;
                        outCityOneMineInfo.guildId = oneMineInfoMsg.guildId;
                        outCityMineNode.nodeAllMineInfoDic.set(oneMineInfoMsg.sonNodeId, outCityOneMineInfo)
                    }
                    break;
                }
            }
            if (this.recvNodeCnt >= msg.count) {
                this.recvNodeCnt = 0;
                NotificationManager.Instance.dispatchEvent(OuterCityEvent.INIT_SECOND_NODE_DATA, targetInfo);
            }
        }
    }

    private __playerChatHandler(chatData: ChatData): void {
        let aInfo: BaseArmy = this._model.getWorldArmyByUserId(chatData.uid);
        if (aInfo) {
            aInfo.chatData = chatData;
        }
    }


    /*********************************
     *   Socket请求数据
     ********************************/
    public sendReturnHomeArmy(): boolean {//传回城堡
        let str: string = "";
        if (this.selfArmy.mapId != this._model.mapId) {
            str = LangManager.Instance.GetTranslation("map.outercity.mediator.mapview.OuterCitySmallMapMediator.command01");
            MessageTipManager.Instance.show(str);
            NotificationManager.Instance.dispatchEvent(NotificationEvent.ARMY_SYSC_CALL, null);
            return false;
        }
        let aInfo: BaseArmy = this._model.getWorldArmyById(this.selfArmy.id);
        if (!aInfo) {
            return false;
        }
        let armyView: OuterCityArmyView = aInfo.armyView as OuterCityArmyView;
        if (armyView) {
            let armyPoint: Laya.Point = new Laya.Point(Number(armyView.x / 20), Number(armyView.y / 20));
            let castlePoint: Laya.Point = new Laya.Point(this.mapNodeInfo.info.posX, this.mapNodeInfo.info.posY);
            if (castlePoint.distance(armyPoint.x, armyPoint.y) < 12) {
                str = LangManager.Instance.GetTranslation("map.outercity.mediator.mapview.OuterCitySmallMapMediator.command03");
                MessageTipManager.Instance.show(str);
                return false;
            }
        }
        OuterCitySocketOutManager.sendArmyBack(1);
        return true;
    }

    public sendGiveUp(info: MapPhysics): boolean {
        if (info.info.occupyPlayerId == this.thane.userId) {
            BuildingSocketOutManager.unoccupy(info.posX + "," + info.posY);

            return true;
        }
        return false;
    }

    private __unoccupyHandler(pos: string): void {
        let info: WildLand = this._model.getWildLandByXY(pos);
        if (info) {
            info.info.occupyPlayerId = 0;
            info.commit();
        }
    }

    public sendWalkPathII(paths: Laya.Point[]): void {
        if (!paths || paths.length < 1) {
            return;
        }
        let msg: PosMoveMsg = new PosMoveMsg();
        let curr: Laya.Point = Laya.Point.create();
        curr.x = this.selfAvatarView.x;
        curr.y = this.selfAvatarView.y;

        let rutes: RouteMsg[] = [];
        paths.unshift(curr);
        for (let i: number = 0; i < paths.length; i++) {
            let node: RouteMsg = new RouteMsg();
            node.x = paths[i].x;
            node.y = paths[i].y;
            rutes[i] = node;
        }
        curr.recover();
        msg.routes = rutes;
        msg.armyId = ArmyManager.Instance.army.id;
        msg.gridStr = MapDataUtils.getTitleFileName(this.selfAvatarView.x, this.selfAvatarView.y);
        msg.mapId = this._model.mapId;
        OuterCitySocketOutManager.sendMovePaths(msg);
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel
    }

    public getUIID(): string {
        return SceneType.OUTER_CITY_SCENE;
    }


}