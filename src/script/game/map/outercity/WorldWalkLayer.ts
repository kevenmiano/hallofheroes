// @ts-nocheck
import Dictionary from "../../../core/utils/Dictionary";
import { MovieClip } from "../../component/MovieClip";
import { FreedomTeamEvent, OuterCityEvent, SpaceEvent } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import { ArmyManager } from "../../manager/ArmyManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import MediatorMananger from "../../manager/MediatorMananger";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { ArmySpeedUtils } from "../../utils/ArmySpeedUtils";
import { BaseArmyAiInfo } from "../ai/BaseArmyAiInfo";
import SimpleBuildingFilter from "../castle/filter/SimpleBuildingFilter";
import { BaseArmy } from "../space/data/BaseArmy";
import { UserArmy } from "../space/data/UserArmy";
import { OuterCityArmyView } from "./OuterCityArmyView";
import { OuterCityModel } from "./OuterCityModel";
import Sprite = Laya.Sprite;
import Point = Laya.Point;
import { SceneScene } from "./path/SceneScene";
import { PathMapHitTester } from "./path/PathMapHitTester";
import { OutercityNpcActivationMediator } from "../../mvc/mediator/OutercityNpcActivationMediator";
import { WalkMouseEventMediator } from "../../mvc/mediator/WalkMouseEventMediator";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { OuterCityNpcView } from "./mapphysics/OuterCityNpcView";
import UIManager from "../../../core/ui/UIManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { eAvatarBaseViewType } from "../view/hero/AvatarBaseView";
import { HeroAvatarView } from "../view/hero/HeroAvatarView";
import { OuterCityScene } from "../../scene/OuterCityScene";
import { SceneManager } from "../scene/SceneManager";
import { MapPhysicsBase } from "../space/view/physics/MapPhysicsBase";
import { MapPhysicsField } from "./mapphysics/MapPhysicsField";
import { SharedManager } from "../../manager/SharedManager";
import { MapPhysicsCastle } from "./mapphysics/MapPhysicsCastle";
import { WildLand } from "../data/WildLand";
import OutercityVehicleArmyView from "../campaign/view/physics/OutercityVehicleArmyView";
import Logger from "../../../core/logger/Logger";

/**
 * @description    外城的行走层
 * @author yuanzhan.yu
 * @date 2021/11/17 17:32
 * @ver 1.0
 */
export class WorldWalkLayer extends Sprite implements IEnterFrame {
    private _model: OuterCityModel;
    private _pathScene: SceneScene;
    private _walkTarget: fgui.GMovieClip;
    private _mediatorKey: string;
    private static _filter: SimpleBuildingFilter = new SimpleBuildingFilter();
    public static NAME: string = "map.outercity.view.layer.WorldWalkLayer";
    /**
     * 距离自己的城堡、英雄可见的像素
     */
    public CAN_SEE_LONG: number = 850;

    constructor() {
        super();
        this._model = OuterCityManager.Instance.model;
        this._pathScene = new SceneScene();
        this._pathScene.setHitTester(new PathMapHitTester(null));

        this._walkTarget = fgui.UIPackage.createObject(EmPackName.Base, "asset.map.WalkTargetEffectAsset").asMovieClip;
        this._walkTarget.setPivot(0.5, 0.75, true);
        this._walkTarget.touchable = false;
        this.addChild(this._walkTarget.displayObject);
        this.addEvent();
        this.mouseEnabled = true;
        this.scrollRect = null;

    }

    private addEvent() {
        EnterFrameManager.Instance.registeEnterFrame(this);
        this.on(Laya.Event.DISPLAY, this, this.__addToStageHandler);
        this._model.addEventListener(OuterCityEvent.LAY_MAP_ARMY, this.__layMapArmyHandler, this);  //地图上显示马
        this._model.addEventListener(OuterCityEvent.REMOVE_ARMY, this.__removeArmyHandler, this);
        NotificationManager.Instance.addEventListener(SpaceEvent.HIDE_OTHERS, this.__hideOthers, this);
        NotificationManager.Instance.addEventListener(FreedomTeamEvent.TEAM_INFO_UPDATE, this.__teamInfoUpdateHandler, this);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE, this.updateVehicleView, this);
    }

    private removeEvent() {
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        this.off(Laya.Event.DISPLAY, this, this.__addToStageHandler);
        this._model.removeEventListener(OuterCityEvent.LAY_MAP_ARMY, this.__layMapArmyHandler, this);  //地图上显示马
        this._model.removeEventListener(OuterCityEvent.REMOVE_ARMY, this.__removeArmyHandler, this);
        NotificationManager.Instance.removeEventListener(SpaceEvent.HIDE_OTHERS, this.__hideOthers, this);
        NotificationManager.Instance.removeEventListener(FreedomTeamEvent.TEAM_INFO_UPDATE, this.__teamInfoUpdateHandler, this);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE, this.updateVehicleView, this);
    }

    public get walkTarget(): fgui.GMovieClip {
        return this._walkTarget;
    }


    public get pathScene(): SceneScene {
        return this._pathScene;
    }

    private __addToStageHandler(evt: Event): void {
        let arr: any[] = [
            WalkMouseEventMediator,
            OutercityNpcActivationMediator
        ];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, WorldWalkLayer.NAME);
    }


    /**
     * 人物退出外城
     *
     */
    private __removeArmyHandler(army: UserArmy): void {
        if (army) {
            let vArmy: OuterCityArmyView = army.armyView as OuterCityArmyView;
            this.removeChild(vArmy);
            vArmy && vArmy.dispose();
        }
        army = null;
    }

    private getArmyById(id: number): OuterCityArmyView {
        let bArmy: BaseArmy = OuterCityManager.Instance.model.getWorldArmyById(id);
        if (bArmy) {
            return bArmy.armyView as OuterCityArmyView;
        }
        return null;
    }

    private updateVehicleView() {
        for (let key in this._model.allVehicleNode) {
            let wildLand: WildLand = this._model.allVehicleNode.get(key);
            let vehicleArmyView: OutercityVehicleArmyView;
            if (wildLand) {
                vehicleArmyView = this._model.allVehicleViewDic.get(wildLand.templateId);
                if (wildLand.status == 2 && vehicleArmyView) {
                    this._model.removeVehicleView(wildLand.templateId);
                    this.removeChild(vehicleArmyView);
                } else {
                    if (!vehicleArmyView && wildLand.status != 2) {
                        vehicleArmyView = new OutercityVehicleArmyView();
                        let info = new BaseArmyAiInfo();
                        info.speed = wildLand.speed;
                        vehicleArmyView.info = info;
                        this._model.addVehicleView(vehicleArmyView, wildLand.templateId);
                        this.addChild(vehicleArmyView);
                    }
                    if (vehicleArmyView) {
                        vehicleArmyView.wildInfo = wildLand;
                        vehicleArmyView.info.speed = wildLand.speed;
                        vehicleArmyView.newX = parseInt((wildLand.movePosX * 20).toString());
                        vehicleArmyView.newY = parseInt((wildLand.movePosY * 20).toString());
                    }
                }
            }
        }
    }

    private __layMapArmyHandler(arr: any[]): void {
        this.layMapArmy(arr);
    }

    /**
     * 渲染地图上的军队
     * @param arr
     *
     */
    private layMapArmy(arr: any[]): void {
        for (let i = 0, len = arr.length; i < len; i++) {
            const aInfo: UserArmy = arr[i];
            if (!aInfo.baseHero.templateInfo) {
                continue;
            }
            let vArmy: OuterCityArmyView = this.createMapArmy(aInfo);
            vArmy.isPlaying = true;
            this.addChild(vArmy);
            let p1: Point = new Point(vArmy.x, vArmy.y);
            let p2: Point = new Point(aInfo.curPosX * 20, aInfo.curPosY * 20);
            if (vArmy.x + vArmy.y == 0 || (p1.distance(p2.x, p2.y) > 150 && aInfo.id != ArmyManager.Instance.army.id)) {
                vArmy.x = aInfo.curPosX * 20;
                vArmy.y = aInfo.curPosY * 20;
            }
        }
    }

    public enterFrame(): void {
        let dic: Dictionary = this._model.allArmyDict;
        for (const dicKey in dic) {
            if (dic.hasOwnProperty(dicKey)) {
                let bArmy: BaseArmy = dic[dicKey];
                if (bArmy.armyView instanceof OuterCityArmyView) {
                    (bArmy.armyView as OuterCityArmyView).execute();
                }
            }
        }
        for (const dicKey in this._model.allVehicleViewDic) {
            if (this._model.allVehicleViewDic.hasOwnProperty(dicKey)) {
                let bArmy: OutercityVehicleArmyView = this._model.allVehicleViewDic[dicKey];
                if (bArmy instanceof OutercityVehicleArmyView) {
                    (bArmy as OutercityVehicleArmyView).execute();
                }
            }
        }
    }

    private __hideOthers() {
        let dic: Dictionary = this._model.allArmyDict
        for (const dicKey in dic) {
            if (dic.hasOwnProperty(dicKey)) {
                let bArmy: UserArmy = dic[dicKey];
                this.checkPlayerVisible(bArmy.armyView as OuterCityArmyView)
            }
        }
    }

    private __teamInfoUpdateHandler() {
        this.__hideOthers()
    }

    private checkPlayerVisible(armyView: OuterCityArmyView) {
        if (armyView) {
            if (armyView.isSelf || armyView.isTeammate) {//自己或者队伍可见
                armyView.visible = true;
            } else {//判断距离
                let inDistance = (this.selfArmy && this.selfArmy.armyView && Math.abs(armyView.x - this.selfArmy.armyView.x) <= this.CAN_SEE_LONG && Math.abs(armyView.y - this.selfArmy.armyView.y) <= this.CAN_SEE_LONG)
                if (inDistance) {//距离符合
                    armyView.visible = !SharedManager.Instance.hideOtherPlayer;
                } else {
                    armyView.visible = false;
                }
            }
            armyView.showInfo(armyView.visible, armyView.visible);
            armyView.noShadow = !armyView.visible;
        }
    }

    public get selfArmy(): UserArmy {
        return ArmyManager.Instance.army;
    }

    public mouseClickHandler(evt: Laya.Event): void {
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, new Point(this.mouseX, this.mouseY));
    }

    protected createMapArmy(bArmy: UserArmy): OuterCityArmyView {
        let mapArmy: OuterCityArmyView = this.getArmyById(bArmy.id);
        if (!mapArmy) {
            mapArmy = new OuterCityArmyView();
            mapArmy.info = new BaseArmyAiInfo();
        }
        mapArmy.info.speed = ArmySpeedUtils.getMoveSpeed(bArmy);
        bArmy.armyView = mapArmy;
        mapArmy.filter = WorldWalkLayer._filter;
        mapArmy.armyInfo = bArmy;
        this.checkPlayerVisible(mapArmy)
        return mapArmy;
    }

    private disposeAllArmyView(): void {
        let dic: Dictionary = OuterCityManager.Instance.model.allArmyDict;
        for (const dicKey in dic) {
            if (dic.hasOwnProperty(dicKey)) {
                let bArmy: BaseArmy = dic[dicKey];
                if (bArmy) {
                    let vArmy: OuterCityArmyView = bArmy.armyView as OuterCityArmyView;
                    vArmy && vArmy.dispose();
                }
            }
        }
        dic = null;
        let allVehicleViewDic: Dictionary = OuterCityManager.Instance.model.allVehicleViewDic;
        for (const dicKey in allVehicleViewDic) {
            let outercityVehicleArmyView: OutercityVehicleArmyView = allVehicleViewDic[dicKey];
            if (outercityVehicleArmyView) {
                outercityVehicleArmyView.dispose();
            }
        }
        allVehicleViewDic = null;
    }

    public outSceneMovies(): void {
        let dic: Dictionary = OuterCityManager.Instance.model.allArmyDict;
        let temp: Dictionary = new Dictionary();
        for (const dicKey in dic) {
            if (dic.hasOwnProperty(dicKey)) {
                let bArmy: BaseArmy = dic[dicKey];
                if (bArmy.armyView) {
                    temp[bArmy.id] = bArmy.armyView;
                }
            }
        }
        this.event(OuterCityEvent.DRAG_SCENE_END, { temp });
    }


    private clickPlayerArr: Array<HeroAvatarView | MapPhysicsBase> = [];
    private clickPlayerFlag: boolean = false;
    /**
     * 获得重叠玩家的数量
     * @param posx 被点击玩家的坐标
     * @param posy 
     */
    public checkClickPlayerNum(posx: number, posy: number): boolean {
        if (this.clickPlayerFlag) {
            return false;
        }
        this.clickPlayerFlag = true;//避免快速执行两次
        setTimeout(() => { this.clickPlayerFlag = false; }, 1000);

        let armyArr = []
        this.clickPlayerArr = []

        let mapView = (SceneManager.Instance.currentScene as OuterCityScene).mapView
        if (mapView && mapView.mainBuidingLayer) {
            let wildLandList = mapView.mainBuidingLayer.wildLandList
            wildLandList.forEach(wildLand => {
                if (wildLand) {
                    let ishit = wildLand.hitTestPoint(posx, posy);
                    if (ishit) {
                        this.clickPlayerArr.push(wildLand);
                    }
                }
            });
        }

        if (mapView && mapView.npcLayer) {
            let npcList = mapView.npcLayer.npcList
            npcList.forEach(npcView => {
                if (npcView.avatarView && npcView.avatarBaseViewType == eAvatarBaseViewType.OuterCityNpc) {
                    let ishit = npcView.avatarView.hitTestPoint(posx, posy);
                    if (ishit) {
                        this.clickPlayerArr.push(npcView);
                    }
                }
            });
        }

        this['_children'].forEach(roleView => {
            if (roleView.avatarBaseViewType == eAvatarBaseViewType.OuterCityArmy) {
                // Logger.xjy('-------------roleView.data.baseHero.userId',roleView.data.baseHero.userId,'========',PlayerManager.Instance.currentPlayerModel.playerInfo.nickName,'=======PlayerManager.Instance.currentPlayerModel.playerInfo.userId'+PlayerManager.Instance.currentPlayerModel.playerInfo.userId);
                if (roleView.avatarView && roleView.data.baseHero.userId != PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {
                    let ishit = roleView.avatarView.hitTestPoint(posx, posy);//avatar本身的区域比较大, 要用avatar模型做点击检测
                    if (ishit) {
                        armyArr.push(roleView);
                    }
                }
            } else if (roleView instanceof OutercityVehicleArmyView) {
                let ishit = roleView.hitTestPoint(posx, posy);
                if (ishit) {
                    armyArr.push(roleView);
                }
            }
        });
        this.clickPlayerArr.push(...armyArr)
        Logger.xjy("WorldWalkLayer len=",this.clickPlayerArr.length,this.clickPlayerArr);
        if (this.clickPlayerArr.length > 1) {
            UIManager.Instance.ShowWind(EmWindow.LookPlayerList, this.clickPlayerArr);
            return true;
        } else if (this.clickPlayerArr.length == 1) {
            let nodeView = this.clickPlayerArr[0]
            if (nodeView instanceof HeroAvatarView) {
                if (nodeView.avatarBaseViewType == eAvatarBaseViewType.OuterCityArmy) {
                    (nodeView as OuterCityArmyView).showTip();
                } else if (nodeView.avatarBaseViewType == eAvatarBaseViewType.OuterCityNpc) {
                    (nodeView as OuterCityNpcView).attackFun();
                }else if(nodeView instanceof OutercityVehicleArmyView){
                    (nodeView as OutercityVehicleArmyView).attackFun();
                }
            }
            else if (nodeView instanceof MapPhysicsField) {
                (nodeView as MapPhysicsField).attackFun();
            }
            else if (nodeView instanceof MapPhysicsCastle) {
                (nodeView as MapPhysicsCastle).attackFun();
            }
            return true;
        }
        return false;
    }

    public dispose(): void {
        this.removeEvent();
        if (this._walkTarget) {
            this._walkTarget.playing = false;
            this._walkTarget.displayObject.removeSelf();
            this._walkTarget.dispose();
        }
        this._walkTarget = null;
        this.disposeAllArmyView();
        this.removeSelf();
    }
}