// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import Dictionary from "../../../../core/utils/Dictionary";
import { EmPackName } from "../../../constant/UIDefine";
import { VipPrivilegeType } from "../../../constant/VipPrivilegeType";
import { AiEvents, NotificationEvent, OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { BaseCastle } from "../../../datas/template/BaseCastle";
import { ArmyManager } from "../../../manager/ArmyManager";
import FreedomTeamManager from "../../../manager/FreedomTeamManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { VIPManager } from "../../../manager/VIPManager";
import TreasureInfo from "../../../map/data/TreasureInfo";
import { WildLand } from "../../../map/data/WildLand";
import { OuterCityArmyView } from "../../../map/outercity/OuterCityArmyView";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import { PosType } from "../../../map/space/constant/PosType";
import Tiles from "../../../map/space/constant/Tiles";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import FUIHelper from "../../../utils/FUIHelper";
import SmallMapBossItem from "../com/SmallMapBossItem";
import SmallMapCityItem from "../com/SmallMapCityItem";
import SmallMapMineItem from "../com/SmallMapMineItem";
import SmallMapPlayerItem from "../com/SmallMapPlayerItem";
import SmallMapTreasureItem from "../com/SmallMapTreasureItem";
import PosMoveMsg = com.road.yishi.proto.worldmap.PosMoveMsg;
import RouteMsg = com.road.yishi.proto.worldmap.RouteMsg;
import SmallMapVehicleItem from "../com/SmallMapVehicleItem";
import OutercityVehicleArmyView from "../../../map/campaign/view/physics/OutercityVehicleArmyView";
/**
 * 外城地图
 */
export default class OuterCityMapWnd extends BaseWindow {
    public title: fgui.GTextField;
    public closeBtn: UIButton;
    protected _selfArmyView: OuterCityArmyView;
    protected _rect: Laya.Rectangle;
    protected FRAME_WIDTH: number = 1180;
    protected FRAME_HEIGHT: number = 1180;
    private _treasureList: Array<TreasureInfo> = [];
    private _cityDic: Dictionary;
    private _treasureDic: Dictionary;
    private _bossDic: Dictionary;
    private _playerDic: Dictionary;
    private _mineDic: Dictionary;
    private _vehicleDic: Dictionary;
    public comMapImg: fgui.GComponent;
    protected mapChildImg: fgui.GLoader;
    protected _bossContainer: Laya.Sprite;
    protected _castleContainer: Laya.Sprite;
    protected _treasureContainer: Laya.Sprite;
    protected _mineContainer: Laya.Sprite;
    protected _playerContainer: Laya.Sprite;
    protected _vehicleContainer:Laya.Sprite;
    protected preMousePostion: Laya.Point;
    protected mouseDownPoint: Laya.Point = new Laya.Point();
    protected forceVector: Laya.Point = new Laya.Point();
    private _selfPoint: Laya.Point;
    public bg: fgui.GImage;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        let aInfo: BaseArmy = this.outerCityModel.getWorldArmyByUserId(this.playerModel.playerInfo.userId);
        if (aInfo) {
            this._selfArmyView = aInfo.armyView as OuterCityArmyView;
        }
        this.mapChildImg = this.comMapImg.getChild('mapImg').asLoader;
        this.mapChildImg.icon = FUIHelper.getItemURL("OuterCity", "Img_WC_Map");
        this.mapChildImg.width = this.FRAME_WIDTH;
        this.mapChildImg.height = this.FRAME_HEIGHT;
        this.initEvent();
        this.setCenter();
        this._bossContainer = new Laya.Sprite();
        this._castleContainer = new Laya.Sprite();
        this._treasureContainer = new Laya.Sprite();
        this._mineContainer = new Laya.Sprite();
        this._playerContainer = new Laya.Sprite();
        this._vehicleContainer = new Laya.Sprite();
        this.comMapImg.displayObject.addChild(this._castleContainer);
        this.comMapImg.displayObject.addChild(this._treasureContainer);
        this.comMapImg.displayObject.addChild(this._vehicleContainer);
        this.comMapImg.displayObject.addChild(this._mineContainer);
        this.comMapImg.displayObject.addChild(this._bossContainer);
        this.comMapImg.displayObject.addChild(this._playerContainer);
        this._bossContainer.x = this.mapChildImg.x;
        this._bossContainer.y = this.mapChildImg.y;
        this._castleContainer.x = this.mapChildImg.x;
        this._castleContainer.y = this.mapChildImg.y;
        this._treasureContainer.x = this.mapChildImg.x;
        this._treasureContainer.y = this.mapChildImg.y;
        this._mineContainer.x = this.mapChildImg.x;
        this._mineContainer.y = this.mapChildImg.y;
        this._playerContainer.x = this.mapChildImg.x;
        this._playerContainer.y = this.mapChildImg.y;
        this._vehicleContainer.x = this.mapChildImg.x;
        this._vehicleContainer.y = this.mapChildImg.y;
    }

    public OnShowWind() {
        super.OnShowWind();
        this._rect = new Laya.Rectangle(0, 0, this.FRAME_WIDTH, this.FRAME_HEIGHT);
        this.initCastlePosition();//初始化城堡的位置
        this.initTreasurePosition();//初始化宝藏矿脉的位置
        this.initMinePosition();//初始化金矿的位置
        if (VIPManager.Instance.model.isOpenPrivilege(VipPrivilegeType.OUTCITY_BOSS_COORDINATE)) {
            this.initBossPosition();//显示精英BOSS位置, 需要特别的VIp才显示
        }
        this.initPlayerPosition();//显示玩家以及队友的位置
        this.initVehiclePosition();//初始化物资车的位置
        this.initLocation();
    }

    private initCastlePosition() {
        let baseCastle: BaseCastle;
        this._cityDic = new Dictionary();
        for (let key in this.outerCityModel.allCastles) {
            let dic: Dictionary = this.outerCityModel.allCastles[key];
            for (let k in dic) {
                baseCastle = dic[k];
                let smallMapCityItem: SmallMapCityItem = FUIHelper.createFUIInstance(EmPackName.OuterCity, "SmallMapCityItem") as SmallMapCityItem
                smallMapCityItem.info = baseCastle;
                smallMapCityItem.x = parseInt((baseCastle.posX * Tiles.WIDTH * this.getScaleX()).toString()) - parseInt((smallMapCityItem.width / 2).toString());
                smallMapCityItem.y = parseInt((baseCastle.posY * Tiles.HEIGHT * this.getScaleY()).toString()) - parseInt((smallMapCityItem.height / 2).toString());;
                this._castleContainer.addChild(smallMapCityItem.displayObject);
                this._cityDic.set(baseCastle.templateId, smallMapCityItem);
            }
        }
    }

    private initTreasurePosition() {
        this._treasureList = this.playerModel.currentMinerals;
        this._treasureDic = new Dictionary();
        let len: number = this._treasureList.length;
        for (let i: number = 0; i < len; i++) {
            let treasureInfo: TreasureInfo = this._treasureList[i];
            let smallMapTreasureItem: SmallMapTreasureItem = FUIHelper.createFUIInstance(EmPackName.OuterCity, "SmallMapTreasureItem") as SmallMapTreasureItem
            smallMapTreasureItem.info = treasureInfo;
            smallMapTreasureItem.x = parseInt((treasureInfo.posX * Tiles.WIDTH * this.getScaleX()).toString()) - parseInt((smallMapTreasureItem.width / 2).toString());
            smallMapTreasureItem.y = parseInt((treasureInfo.posY * Tiles.HEIGHT * this.getScaleY()).toString()) - parseInt((smallMapTreasureItem.height / 2).toString());
            this._treasureContainer.addChild(smallMapTreasureItem.displayObject);
            this._treasureDic.set(treasureInfo.id, smallMapTreasureItem);
        }
    }

    private initMinePosition() {
        this._mineDic = new Dictionary();
        for (let key in this.outerCityModel.allWildLand) {
            let dic: Dictionary = this.outerCityModel.allWildLand[key];
            for (let k in dic) {
                let wildLand: WildLand = dic[k];
                if (wildLand && wildLand.info.types == PosType.OUTERCITY_MINE) {
                    let smallMapMineItem: SmallMapMineItem = FUIHelper.createFUIInstance(EmPackName.OuterCity, "SmallMapMineItem") as SmallMapMineItem;
                    smallMapMineItem.info = wildLand;
                    smallMapMineItem.x = parseInt((wildLand.posX * Tiles.WIDTH * this.getScaleX()).toString()) - parseInt((smallMapMineItem.width / 2).toString());
                    smallMapMineItem.y = parseInt((wildLand.posY * Tiles.HEIGHT * this.getScaleY()).toString()) - parseInt((smallMapMineItem.height / 2).toString());
                    this._mineContainer.addChild(smallMapMineItem.displayObject);
                    this._mineDic.set(wildLand.tempInfo.ID, smallMapMineItem);
                }
            }
        }
    }

    private initBossPosition() {
        this._bossDic = new Dictionary();
        let bossArr: Array<WildLand> = this.outerCityModel.bossInfo.bosslist;
        for (let i: number = 0; i < bossArr.length; i++) {
            let wildLand: WildLand = bossArr[i];
            if (wildLand.info.types == PosType.OUTERCITY_BOSS_NPC && wildLand.bossStatus != 0) {
                let smallMapBossItem: SmallMapBossItem = FUIHelper.createFUIInstance(EmPackName.OuterCity, "SmallMapBossItem") as SmallMapBossItem
                smallMapBossItem.info = wildLand;
                smallMapBossItem.x = parseInt((wildLand.posX * Tiles.WIDTH * this.getScaleX()).toString()) - parseInt((smallMapBossItem.width / 2).toString());
                smallMapBossItem.y = parseInt((wildLand.posY * Tiles.HEIGHT * this.getScaleY()).toString()) - parseInt((smallMapBossItem.height / 2).toString());
                this._bossContainer.addChild(smallMapBossItem.displayObject);
                this._bossDic.set(wildLand.posX + "_" + wildLand.posY, smallMapBossItem);
            }
        }
    }

    private initVehiclePosition() {
        this._vehicleDic = new Dictionary();
        let selfVehicle:OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
        for (let key in this.outerCityModel.allVehicleNode) {
            let wildLand: WildLand = this.outerCityModel.allVehicleNode.get(key);
            if (wildLand && wildLand.info.types == PosType.OUTERCITY_VEHICLE && wildLand.status!=2) {
                let smallMapVehicleItem: SmallMapVehicleItem = FUIHelper.createFUIInstance(EmPackName.OuterCity, "SmallMapVehicleItem") as SmallMapVehicleItem;
                smallMapVehicleItem.info = wildLand;
                if(selfVehicle && selfVehicle.wildInfo.templateId == parseInt(key)){
                    if(!this._selfPoint){
                        this._selfPoint = new Laya.Point()
                    }
                    this._selfPoint.x = parseInt((wildLand.movePosX * Tiles.WIDTH * this.getScaleX()).toString()) - parseInt((smallMapVehicleItem.width / 2).toString());
                    this._selfPoint.y = parseInt((wildLand.movePosY * Tiles.HEIGHT * this.getScaleY()).toString()) - parseInt((smallMapVehicleItem.height / 2).toString());
                }
                smallMapVehicleItem.x = parseInt((wildLand.movePosX * Tiles.WIDTH * this.getScaleX()).toString()) - parseInt((smallMapVehicleItem.width / 2).toString());
                smallMapVehicleItem.y = parseInt((wildLand.movePosY * Tiles.HEIGHT * this.getScaleY()).toString()) - parseInt((smallMapVehicleItem.height / 2).toString());
                this._vehicleContainer.addChild(smallMapVehicleItem.displayObject);
                this._vehicleDic.set(wildLand.templateId, smallMapVehicleItem);
            }
        }
    }

    /**
     * 更新物资车的位置
     */
    private updateVehiclePosition(){
        for (let key in this._vehicleDic) {
            let smallMapVehicleItem: SmallMapVehicleItem = this._vehicleDic.get(key);
            let wildLand: WildLand = this.outerCityModel.allVehicleNode.get(key);
            if (wildLand.status !=2) {
                smallMapVehicleItem.info = wildLand;
                smallMapVehicleItem.x = parseInt((wildLand.info.posX * Tiles.WIDTH * this.getScaleX()).toString()) - parseInt((smallMapVehicleItem.width / 2).toString());
                smallMapVehicleItem.y = parseInt((wildLand.info.posY * Tiles.HEIGHT * this.getScaleY()).toString()) - parseInt((smallMapVehicleItem.height / 2).toString());
            }else{//移除
                this._vehicleContainer.removeChild(smallMapVehicleItem.displayObject);
            }
        }
    }

    private initPlayerPosition() {
        if (this._playerContainer.numChildren > 0) {
            this._playerContainer.removeChildren();
        }
        this._playerDic = new Dictionary();
        for (const key in this.outerCityModel.allArmyDict) {
            if (this.outerCityModel.allArmyDict.hasOwnProperty(key)) {
                let army: BaseArmy = this.outerCityModel.allArmyDict[key];
                let smallMapPlayerItem: SmallMapPlayerItem;
                if (army.userId == this.playerModel.playerInfo.userId && army.armyView) {
                    smallMapPlayerItem = FUIHelper.createFUIInstance(EmPackName.OuterCity, "SmallMapPlayerItem") as SmallMapPlayerItem
                    smallMapPlayerItem.headId = army.baseHero.headId;
                    smallMapPlayerItem.info = army;
                    this._selfPoint = new Laya.Point();
                    smallMapPlayerItem.x = parseInt((army.armyView.x * this.getScaleX()).toString()) - parseInt((smallMapPlayerItem.width / 2).toString());
                    smallMapPlayerItem.y = parseInt((army.armyView.y * this.getScaleY()).toString()) - parseInt((smallMapPlayerItem.height / 2).toString());
                    this._playerContainer.addChild(smallMapPlayerItem.displayObject);
                    this._selfPoint.x = smallMapPlayerItem.x;
                    this._selfPoint.y = smallMapPlayerItem.y;
                    this._playerDic.set(army.userId, smallMapPlayerItem);
                } else {
                    let teamModel = FreedomTeamManager.Instance.model
                    if (teamModel && army.armyView && teamModel.getMemberByUserId(army.userId)
                        && FreedomTeamManager.Instance.memberIsOnline(Number(army.userId))) {
                        smallMapPlayerItem = FUIHelper.createFUIInstance(EmPackName.OuterCity, "SmallMapPlayerItem") as SmallMapPlayerItem
                        smallMapPlayerItem.headId = army.baseHero.headId;
                        smallMapPlayerItem.info = army;
                        smallMapPlayerItem.x = parseInt((army.armyView.x * this.getScaleX()).toString()) - parseInt((smallMapPlayerItem.width / 2).toString());;
                        smallMapPlayerItem.y = parseInt((army.armyView.y * this.getScaleY()).toString()) - parseInt((smallMapPlayerItem.height / 2).toString());;
                        this._playerContainer.addChild(smallMapPlayerItem.displayObject);
                        this._playerDic.set(army.userId, smallMapPlayerItem);
                    }
                }
            }
        }
    }

    private initEvent() {
        NotificationManager.Instance.addEventListener(NotificationEvent.CLOSE_OUTERCITY_MAP_WND, this.closeWndHandler, this);
        NotificationManager.Instance.addEventListener(OuterCityEvent.UPDATE_SECOND_NODE_DATA, this.updateNodeInfoHandler, this);
        if (this._selfArmyView && this._selfArmyView.info) this._selfArmyView.info.addEventListener(AiEvents.NEXT_POINT, this.__walkNextHandler, this);
        this.outerCityModel.addEventListener(OuterCityEvent.LAY_MAP_ARMY, this.initPlayerPosition, this);  //地图上显示马
        this.outerCityModel.addEventListener(OuterCityEvent.REMOVE_ARMY, this.initPlayerPosition, this);
        NotificationManager.Instance.addEventListener(OuterCityEvent.UPDATE_MEMBER_POSITION, this.updateMemberPosition, this);
        this.comMapImg.on(Laya.Event.MOUSE_DOWN, this, this.__mapMouseDownHandler);
        this.comMapImg.on(Laya.Event.MOUSE_UP, this, this.__mapMouseUpHandler);
        this.comMapImg.on(Laya.Event.MOUSE_OUT, this, this.__mapMouseOutHandler);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE,this.updateVehiclePosition,this);
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(NotificationEvent.CLOSE_OUTERCITY_MAP_WND, this.closeWndHandler, this);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.UPDATE_SECOND_NODE_DATA, this.updateNodeInfoHandler, this);
        if (this._selfArmyView && this._selfArmyView.info) this._selfArmyView.info.removeEventListener(AiEvents.NEXT_POINT, this.__walkNextHandler, this);
        this.outerCityModel.removeEventListener(OuterCityEvent.LAY_MAP_ARMY, this.initPlayerPosition, this);  //地图上显示马
        this.outerCityModel.removeEventListener(OuterCityEvent.REMOVE_ARMY, this.initPlayerPosition, this);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.UPDATE_MEMBER_POSITION, this.updateMemberPosition, this);
        this.comMapImg.off(Laya.Event.MOUSE_DOWN, this, this.__mapMouseDownHandler);
        this.comMapImg.off(Laya.Event.MOUSE_UP, this, this.__mapMouseUpHandler);
        this.comMapImg.off(Laya.Event.MOUSE_OUT, this, this.__mapMouseOutHandler);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE,this.updateVehiclePosition,this);
    }

    protected __mapMouseDownHandler(event: Laya.Event) {
        this.preMousePostion = new Laya.Point(event.stageX, event.stageY);
        this.comMapImg.on(Laya.Event.MOUSE_MOVE, this, this.__mapMouseMoveHandler);
    }

    protected __mapMouseUpHandler(event: Laya.Event) {
        this.comMapImg.off(Laya.Event.MOUSE_MOVE, this, this.__mapMouseMoveHandler);
        this.preMousePostion = null;
        return;
    }

    protected __mapMouseOutHandler(event: Laya.Event) {
        this.comMapImg.off(Laya.Event.MOUSE_MOVE, this, this.__mapMouseMoveHandler);
        this.preMousePostion = null;
        return;
    }

    protected __mapMouseMoveHandler(evt: Laya.Event) {
        let globalPos = new Laya.Point(evt.stageX, evt.stageY);
        this.forceVector.x = globalPos.x - this.preMousePostion.x;
        this.forceVector.y = globalPos.y - this.preMousePostion.y;
        this.preMousePostion.x = globalPos.x;
        this.preMousePostion.y = globalPos.y;
        let currPos = this.comMapImg.globalToLocal(globalPos.x, globalPos.y);
        // let xMin = (StageReferance.stageWidth - this.bg.width)/2 -this.bg.x;
        // let xMax = (StageReferance.stageWidth - this.bg.width)/2 -this.bg.x + this.comMapImg.width;
        // let yMin = (StageReferance.stageHeight - this.bg.height)/2 -this.bg.y;
        // let yMax = (StageReferance.stageHeight - this.bg.height)/2 -this.bg.y + this.comMapImg.height;
        // if (globalPos.x <= xMin || globalPos.x>= xMax) {
        //     this.mapChildImg.off(Laya.Event.MOUSE_MOVE, this, this.__mapMouseMoveHandler);
        //     this.preMousePostion = null;
        //     Logger.xjy("放开鼠标1");
        //     return;
        // } else if (globalPos.y <= yMin || globalPos.y >= yMax) {
        //     this.mapChildImg.off(Laya.Event.MOUSE_MOVE, this, this.__mapMouseMoveHandler);
        //     this.preMousePostion = null;
        //     Logger.xjy("放开鼠标2");
        //     return;
        // }
        if (currPos.x <= this.comMapImg.x || currPos.x >= this.comMapImg.x + this.comMapImg.width) {
            return
        } else if (currPos.y <= this.comMapImg.y || currPos.y >= this.comMapImg.y + this.comMapImg.height) {
            return;
        }
        //移动
        this.mapChildImg.x += this.forceVector.x;
        this.mapChildImg.y += this.forceVector.y;
        if (this.mapChildImg.x >= 0) {
            this.mapChildImg.x = 0;
        }
        if (this.mapChildImg.x <= this.comMapImg.width - this.mapChildImg.width) {
            this.mapChildImg.x = this.comMapImg.width - this.mapChildImg.width;
        }
        if (this.mapChildImg.y >= 0) {
            this.mapChildImg.y = 0
        }
        if (this.mapChildImg.y <= this.comMapImg.height - this.mapChildImg.height) {
            this.mapChildImg.y = this.comMapImg.height - this.mapChildImg.height;
        }
        this._bossContainer.x = this.mapChildImg.x;
        this._bossContainer.y = this.mapChildImg.y;
        this._castleContainer.x = this.mapChildImg.x;
        this._castleContainer.y = this.mapChildImg.y;
        this._treasureContainer.x = this.mapChildImg.x;
        this._treasureContainer.y = this.mapChildImg.y;
        this._mineContainer.x = this.mapChildImg.x;
        this._mineContainer.y = this.mapChildImg.y;
        this._playerContainer.x = this.mapChildImg.x;
        this._playerContainer.y = this.mapChildImg.y;
        this._vehicleContainer.x = this.mapChildImg.x;
        this._vehicleContainer.y = this.mapChildImg.y;
    }

    private initLocation() {
        if(!this._selfPoint){
            let selfVehicleView:OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
            if(selfVehicleView){
                this._selfPoint = new Laya.Point(selfVehicleView.x,selfVehicleView.y);
            }
        }
        if(!this._selfPoint)return;
        let xAdd: number = this._selfPoint.x - this.comMapImg.width / 2 + 38;
        let yAdd: number = this._selfPoint.y - this.comMapImg.height / 2 + 43;
        let xMax: number = this.mapChildImg.width - this.comMapImg.width;
        let yMax: number = this.mapChildImg.height - this.comMapImg.height;
        if (xAdd > 0) {//人物在中心点右边, 要往左边拖动
            if (xAdd > xMax) {
                this.mapChildImg.x = -xMax;
            } else {
                this.mapChildImg.x = -xAdd;
            }
        } else if (xAdd < 0) {
            this.mapChildImg.x = 0;
        }
        if (yAdd > 0) {//人物在中心点下边, 要往上边拖动
            if (yAdd > yMax) {
                this.mapChildImg.y = -yMax;
            } else {
                this.mapChildImg.y = -yAdd;
            }
        } else {
            this.mapChildImg.y = 0;
        }
        this._bossContainer.x = this.mapChildImg.x;
        this._bossContainer.y = this.mapChildImg.y;
        this._castleContainer.x = this.mapChildImg.x;
        this._castleContainer.y = this.mapChildImg.y;
        this._treasureContainer.x = this.mapChildImg.x;
        this._treasureContainer.y = this.mapChildImg.y;
        this._mineContainer.x = this.mapChildImg.x;
        this._mineContainer.y = this.mapChildImg.y;
        this._playerContainer.x = this.mapChildImg.x;
        this._playerContainer.y = this.mapChildImg.y;
        this._vehicleContainer.x = this.mapChildImg.x;
        this._vehicleContainer.y = this.mapChildImg.y;
    }

    private updateMemberPosition(msg: PosMoveMsg) {
        let smallMapPlayerItem: SmallMapPlayerItem = this._playerDic.get(msg.armyUserId);//好友位置更新
        if (smallMapPlayerItem) {
            while (msg.routes.length > 0) {
                let node: RouteMsg = msg.routes.shift() as RouteMsg;
                smallMapPlayerItem.x = parseInt((node.x * this.getScaleX()).toString()) - parseInt((smallMapPlayerItem.width / 2).toString());;
                smallMapPlayerItem.y = parseInt((node.y * this.getScaleY()).toString()) - parseInt((smallMapPlayerItem.height / 2).toString());;
            }
        } else {
            let teamModel = FreedomTeamManager.Instance.model
            if (teamModel && teamModel.getMemberByUserId(msg.armyUserId)
                && FreedomTeamManager.Instance.memberIsOnline(Number(msg.armyUserId))) {
                smallMapPlayerItem = FUIHelper.createFUIInstance(EmPackName.OuterCity, "SmallMapPlayerItem") as SmallMapPlayerItem
                smallMapPlayerItem.headId = msg.headId;
                this._playerContainer.addChild(smallMapPlayerItem.displayObject);
                this._playerDic.set(msg.armyUserId, smallMapPlayerItem);
                while (msg.routes.length > 0) {
                    let node: RouteMsg = msg.routes.shift() as RouteMsg;
                    smallMapPlayerItem.x = parseInt((node.x * this.getScaleX()).toString()) - parseInt((smallMapPlayerItem.width / 2).toString());
                    smallMapPlayerItem.y = parseInt((node.y * this.getScaleY()).toString()) - parseInt((smallMapPlayerItem.height / 2).toString());
                }
            }
        }
    }

    closeWndHandler() {
        this.hide();
    }

    private __walkNextHandler() {
        let smallMapPlayerItem: SmallMapPlayerItem = this._playerDic.get(ArmyManager.Instance.army.userId);
        let army: BaseArmy = this.outerCityModel.getWorldArmyByUserId(ArmyManager.Instance.army.userId);
        smallMapPlayerItem.x = parseInt((army.armyView.x * this.getScaleX()).toString()) - parseInt((smallMapPlayerItem.width / 2).toString());
        smallMapPlayerItem.y = parseInt((army.armyView.y * this.getScaleY()).toString()) - parseInt((smallMapPlayerItem.height / 2).toString());
    }

    private updateNodeInfoHandler(arr: Array<any>) {
        if (arr && arr.length == 2) {
            let id = arr[0];
            let wild: WildLand = arr[1];
            let item: SmallMapMineItem = this._mineDic.get(id);
            if (item) {
                item.info = wild;
            }
        }
    }

    private get outerCityModel(): OuterCityModel {
        return OuterCityManager.Instance.model;
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel
    }

    private getScaleX(): number {
        return this.FRAME_WIDTH / this.outerCityModel.mapTempInfo.Width;
    }

    private getScaleY(): number {
        return this.FRAME_HEIGHT / this.outerCityModel.mapTempInfo.Height;
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}