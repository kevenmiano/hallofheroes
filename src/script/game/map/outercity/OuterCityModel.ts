// @ts-nocheck
import Dictionary from "../../../core/utils/Dictionary";
import { ArmyState } from "../../constant/ArmyState";
import { NotificationEvent, OuterCityEvent } from "../../constant/event/NotificationEvent";
import { BaseCastle } from "../../datas/template/BaseCastle";
import { ArmyManager } from "../../manager/ArmyManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { NodeState } from "../space/constant/NodeState";
import { BaseArmy } from "../space/data/BaseArmy";
import { FloorMapInfo } from "../space/data/FloorMapInfo";
import { MapPhysics } from "../space/data/MapPhysics";
import { MapBossMsgInfo } from "./MapBossMsgInfo";
import LangManager from "../../../core/lang/LangManager";
import { WildLand } from "../data/WildLand";
import { MapUtils } from "../space/utils/MapUtils";
import { GlobalConfig } from "../../constant/GlobalConfig";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import OutCityMineNode from "./OutCityMineNode";
import OutCityOneMineInfo from "./OutCityOneMineInfo";
import OutCityNodeInfoMsg = com.road.yishi.proto.army.OutCityNodeInfoMsg;
import OneMineInfoMsg = com.road.yishi.proto.army.OneMineInfoMsg;
import WildLandMsg = com.road.yishi.proto.army.WildLandMsg;
import SimpleHeroInfoMsg = com.road.yishi.proto.army.SimpleHeroInfoMsg;
import ArmyPawnInfoMsg = com.road.yishi.proto.army.ArmyPawnInfoMsg;
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import { ThaneInfoHelper } from "../../utils/ThaneInfoHelper";
import Tiles from "../space/constant/Tiles";
import { PhysicInfo } from "../space/data/PhysicInfo";
import { SystemArmy } from "../space/data/SystemArmy";
import OutCityNodeTypeConstant from "./OutCityNodeTypeConstant";
import { t_s_mapmineData } from "../../config/t_s_mapmine";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { ArmyPawn } from "../../datas/ArmyPawn";
import Logger from "../../../core/logger/Logger";
import { OuterCityArmyView } from "./OuterCityArmyView";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { OuterCityManager } from "../../manager/OuterCityManager";
import OutercityVehicleArmyView from "../campaign/view/physics/OutercityVehicleArmyView";
import VehiclePlayerInfo from "../data/VehiclePlayerInfo";
import { TempleteManager } from "../../manager/TempleteManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
/**
 * @description	外城Model
 * @author yuanzhan.yu
 * @date 2021/11/16 21:05
 * @ver 1.0
 */
export class OuterCityModel extends FloorMapInfo {
    constructor() {
        super();

        let uArmy: BaseArmy = ArmyManager.Instance.army;
        this._allArmysDict[uArmy.id] = uArmy;
        this.bossInfo = new MapBossMsgInfo();
    }
    public static SELT_CALSTE_TEMPLATEID = 101;
    private _currentCastles: BaseCastle[];//当前屏幕的城堡
    private _currentWildLand: WildLand[];//当前屏幕的金矿

    private _allWildLand: Dictionary = new Dictionary();//地图上的所有 金矿 怪物节点信息
    private _allCastles: Dictionary = new Dictionary();//所有城堡 按坐标存
    public allCastlesMap: Map<number, BaseCastle> = new Map();//所有城堡 按节点Id存
    public walkTargerData: MapPhysics;
    private _selectPkArmy: BaseArmy;

    private _staticMovies: Dictionary = new Dictionary();
    public isWalkIng: boolean = false;
    public oldPoint:Laya.Point = new Laya.Point(0,0);
    /**
     *BOSS信息数据对象
     */
    public bossInfo: MapBossMsgInfo;

    private _selfCastles: BaseCastle; //自己的城堡
    public static TREASURE_MINE_TYPE1: number = 1;//大宝藏矿脉
    public static TREASURE_MINE_TYPE2: number = 2;//小宝藏矿脉
    public static TREASURE_STATE1: number = 1;//重置期
    public static TREASURE_STATE2: number = 2;//和平期 
    public static TREASURE_STATE3: number = 3;//争夺期
    public mineUpperLimitArr: Array<string> = [];
    public currentSelectMine: WildLand;


    public static VEHICLE_OPERATION_TYPE1: number = 1;//护送上阵
    public static VEHICLE_OPERATION_TYPE2: number = 2;//推进上阵
    public static VEHICLE_OPERATION_TYPE3: number = 3;//护送退出
    public static VEHICLE_OPERATION_TYPE4: number = 4;//推进退出

    public allMinNode: Array<WildLand> = [];
    public allVehicleNode: Dictionary = new Dictionary();//所有物资车
    public get selfCastles(): BaseCastle {

        return this._selfCastles;
    }

    public set selfCastles(value: BaseCastle) {
        this._selfCastles = value;
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.SELF_CASTLE);
    }

    public get staticMovies(): Dictionary {
        return this._staticMovies;
    }

    public addStaticMovie(wlInfo: WildLand, key: string): void {
        this._staticMovies[key] = wlInfo;
    }

    /**
     * 锁定的玩家
     * @return
     *
     */
    public get selectPkArmy(): BaseArmy {
        return this._selectPkArmy;
    }

    public set selectPkArmy(value: BaseArmy) {
        this._selectPkArmy = value;
        if (this.selectPkArmy == null) {
            return;
        }
        let str: string;
        let selfConsortiaId: number = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID;
        if (selfConsortiaId > 0 && this.selectPkArmy.baseHero.consortiaID == selfConsortiaId) {
            str = LangManager.Instance.GetTranslation("map.outercity.mediator.mapview.OuterCityPkMediator.command01");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (this.selectPkArmy.state == ArmyState.STATE_FIGHT) {
            str = LangManager.Instance.GetTranslation("map.outercity.view.mapphysics.MapPhysicsCastle.command05");
            MessageTipManager.Instance.show(str);
            return;
        }

        this.dispatchEvent(OuterCityEvent.SELECT_PK_ARMY, value);
    }


    //////////////////////////////////////////////////////
    //*******************Castles*******************/////
    /////////////////////////////////////////////////////
    /**
     * 当前的城堡
     * @param arr
     *
     */
    public set currentCastles(arr: BaseCastle[]) {
        this._currentCastles = arr;
        for (let i = 0, len = arr.length; i < len; i++) {
            const castle = arr[i];
            this.addCastle(castle);
        }
        this.dispatchEvent(OuterCityEvent.CURRENT_CASTLES, arr);
    }

    /**
     * 添加城堡
     * @param cInfo
     *
     */
    public addCastle(cInfo: BaseCastle): void {
        let key: string = this.getFileName(cInfo.x, cInfo.y);
        let dic: Dictionary = this._allCastles[key];
        if (!dic) {
            dic = new Dictionary();
        }
        dic[cInfo.info.id] = cInfo;
        this._allCastles[key] = dic;
        this.allCastlesMap.set(cInfo.nodeId, cInfo);
        if (cInfo.tempInfo && cInfo.tempInfo.ID == OuterCityModel.SELT_CALSTE_TEMPLATEID) {
            this.selfCastles = cInfo;
        }
    }

    /**
     * 删除城堡
     * @param cInfo
     * @param key
     *
     */
    private removeCastle(cInfo: BaseCastle, key: string): void {
        this.allCastlesMap.delete(cInfo.nodeId)
        let dic: Dictionary = this._allCastles[key];
        if (dic) {
            this.dispatchEvent(OuterCityEvent.REMOVE_CASTLE, cInfo);
            delete dic[cInfo.nodeId]
        }
    }

    /**
     * 所有城堡
     * @return
     *
     */
    public get allCastles(): Dictionary {
        return this._allCastles;
    }

    /**
     * 获取自己的城堡
     * @return
     *
     */
    public get mySelfCastles(): BaseCastle {
        let _selfCastles: BaseCastle;
        for (const allCastlesKey in this.allCastles) {
            if (this.allCastles.hasOwnProperty(allCastlesKey)) {
                let dic: Dictionary = this.allCastles[allCastlesKey];
                for (const dicKey in dic) {
                    if (dic.hasOwnProperty(dicKey)) {
                        let temp: BaseCastle = dic[dicKey];
                        if (temp.info.occupyPlayerId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {
                            _selfCastles = temp;
                        }
                    }
                }
            }
        }
        return _selfCastles;
    }

    public getCastleByIdXY(id: number, $x: number, $y: number): BaseCastle {
        let key: string = this.getFileName($x, $y);
        let dic: Dictionary = this._allCastles[key];
        if (dic) {
            return dic[id];
        }
        return null;
    }

    public getCastleById(id: number): BaseCastle {
        return this.allCastlesMap.get(id);
    }

    public getCastleByXY($x: number, $y: number): BaseCastle {
        let key: string = this.getFileName($x, $y);
        let dic: Dictionary = this._allCastles[key];
        for (const dicKey in dic) {
            if (dic.hasOwnProperty(dicKey)) {
                let temp: BaseCastle = dic[dicKey];
                if (temp.x == $x && temp.y == $y) {
                    return temp;
                }
            }
        }
        return null;
    }

    private removesNSSCastles(): void {
        for (let key in this._allCastles) {
            if (this.nineSliceScaling.indexOf(key) == -1) {
                let dic: Dictionary = this._allCastles[key];
                for (let k in dic) {
                    this.removeCastle(dic[k], key);
                    delete dic[k];
                }
                delete this._allCastles[key];
            }
        }
    }


    //////////////////////////////////////////////////////
    //*******************WildLand*******************/////
    /////////////////////////////////////////////////////
    /**
     * 当前屏幕城堡
     * @return
     *
     */
    public get currentCastles(): BaseCastle[] {
        return this._currentCastles;
    }

    /**
     * 当前屏幕的金矿, 怪物
     * @return
     *
     */
    public get currentWildLand(): WildLand[] {
        return this._currentWildLand;
    }

    public set currentWildLand(value: WildLand[]) {
        this._currentWildLand = value;
        for (let i = 0, len = value.length; i < len; i++) {
            const w: MapPhysics = value[i];
            let wlInfo: WildLand = this.getWildLandByXY(w.x + "," + w.y);
            if (wlInfo && wlInfo.info.types != w.info.types) {
                this.removeWildLand(wlInfo);
            }
            if (w.info.state == NodeState.NONE) {
                if (wlInfo) {
                    this.removeWildLand(wlInfo);
                }
                continue;
            }
            this.addWildLand(w);
        }
        this.dispatchEvent(OuterCityEvent.CURRENT_WILD_LAND, value);
    }

    /**
     * 
     * @param 
     * @returns 
     */
    public updateWildLand(w: MapPhysics): void {
        let wlInfo: WildLand = this.getWildLandByXY(w.x + "," + w.y);
        if (wlInfo && wlInfo.info.types != w.info.types) {
            this.removeWildLand(wlInfo);
        }
        if (w.info.state == NodeState.NONE) {
            wlInfo && this.removeWildLand(wlInfo);
            return;
        }
        this.addWildLand(w);
        this.dispatchEvent(OuterCityEvent.CURRENT_WILD_LAND, [w]);
    }

    private removeWildLand(wlInfo: MapPhysics): void {
        if (wlInfo.info) {
            if (WorldBossHelper.isOutecityNPCNode(wlInfo.info.types)) {
                this.dispatchEvent(OuterCityEvent.REMOVE_NODE_NPC, wlInfo);
            }
            else {
                this.dispatchEvent(OuterCityEvent.REMOVE_NODE_MOVIE, wlInfo);
            }
        }
        else {
            if (wlInfo.nodeView) {
                wlInfo.nodeView['dispose']();
            }
            wlInfo.nodeView = null;
        }
        let key: string = this.getFileName(wlInfo.x, wlInfo.y);
        let dic: Dictionary = this._allWildLand[key];
        if (dic) {
            delete dic[this.getPosByInfo(wlInfo)];
        }
    }

    public addWildLand(wlInfo: MapPhysics) {
        let key: string = this.getFileName(wlInfo.x, wlInfo.y);
        let dic: Dictionary = this._allWildLand[key];
        if (!dic) {
            dic = new Dictionary();
        }
        if (wlInfo.info.types == 3) {
            Logger.xjy("Outercity ==", wlInfo);
        }
        dic[this.getPosByInfo(wlInfo)] = wlInfo;
        this._allWildLand[key] = dic;
    }

    public get allWildLand(): Dictionary {
        return this._allWildLand;
    }

    private removesNSSWildLand() {
        for (let key in this._allWildLand) {
            if (this.nineSliceScaling.indexOf(key) == -1) {
                let dic: Dictionary = this._allWildLand[key];
                for (let k in dic) {
                    this.removeWildLand(dic[k]);
                    delete dic[k];
                }
                delete this._allWildLand[key];
            }
        }
    }

    public set nineSliceScaling(arr: string[]) {
        super.nineSliceScaling = arr;
        // this.removesNSSWildLand();
        // this.removesNSSCastles();
    }

    public get nineSliceScaling(): string[] {
        return super.nineSliceScaling;
    }

    private getPosByInfo(wInfo: MapPhysics): string {
        return wInfo.x + "," + wInfo.y;
    }

    public getFileName(startX: number, startY: number, unitWidth: number = 1000, unitHeight: number = 1000): string {
        let nx: number = Math.floor(startX / unitWidth);
        let ny: number = Math.floor(startY / unitHeight);
        return nx + "," + ny;
    }

    private _castlePool: BaseCastle[] = [];

    public addCasetInfoToPool(info: BaseCastle): void {
        if (!info || !info.info) {
            return;
        }
        delete this._allCastles[info.info.id];
        this._castlePool.push(info);
    }

    public popCastleInfo(): BaseCastle {
        return this._castlePool.pop();
    }

    public getWildLandByXY(pos: string): WildLand {
        let point: Laya.Point = MapUtils.strToPoint(pos, ",");
        let key: string = this.getFileName(point.x, point.y);
        let dic: Dictionary = this._allWildLand[key];
        if (dic) {
            return dic[point.x + "," + point.y];
        }
        return null;
    }

    public getPhysicsByXY($x: number, $y: number): Laya.Sprite {
        let mp: MapPhysics;
        let key: string = this.getFileName($x, $y);
        let dic: Dictionary = this._allWildLand[key];
        if (dic) {
            mp = dic[$x + "," + $y];
        }
        if (mp) {
            return mp.nodeView;
        }
        let castleInfo: BaseCastle = this.getCastleByXY($x, $y);
        if (castleInfo) {
            return castleInfo.nodeView;
        }
        return null;
    }

    //地图上面的所有物资车
    private _allVehicleViewDic: Dictionary = new Dictionary();
    public get allVehicleViewDic(): Dictionary {
        return this._allVehicleViewDic;
    }

    public addVehicleView(army: OutercityVehicleArmyView, tempateId: number) {
        this._allVehicleViewDic[tempateId] = army;
    }

    public removeVehicleView(tempateId: number) {
        this._allVehicleViewDic.delete(tempateId);
    }

    private _allArmysDict: Dictionary = new Dictionary();


    /**
     * 地图上的所有玩家
     * @return
     *
     */
    public get allArmyDict(): Dictionary {
        return this._allArmysDict;
    }

    public addArmyToWorldDict(army: BaseArmy): void {
        this._allArmysDict[army.id] = army;
    }

    public removeWorldArmyById(id: number): BaseArmy {
        let army: BaseArmy = this._allArmysDict[id];
        delete this._allArmysDict[id];
        this.dispatchEvent(OuterCityEvent.REMOVE_ARMY, army);
        return army;
    }

    public getWorldArmyById(id: number): BaseArmy {
        return this._allArmysDict[id];
    }

    public getWorldArmyByUserId(id: number): BaseArmy {
        for (const key in this._allArmysDict) {
            if (this._allArmysDict.hasOwnProperty(key)) {
                let army: BaseArmy = this._allArmysDict[key];
                if (army.userId == id) {
                    return army;
                }
            }
        }
        return null;
    }


    public layMapArmy(arr: any[]): void {
        this.dispatchEvent(OuterCityEvent.LAY_MAP_ARMY, arr);
    }

    /**
     * 得到自己的物资车
     */
    public getSelfVehicle(): OutercityVehicleArmyView {
        let selfView: OutercityVehicleArmyView;
        for (const key in this.allVehicleViewDic) {
            let outercityVehicleArmyView: OutercityVehicleArmyView = this.allVehicleViewDic[key];
            let wild: WildLand = outercityVehicleArmyView.wildInfo;
            if (wild) {
                let item: VehiclePlayerInfo;
                for (let i: number = 0; i < wild.pushPlayer.length; i++) {
                    item = wild.pushPlayer[i];
                    if (item.userId == this.playerInfo.userId) {
                        selfView = outercityVehicleArmyView;
                        break;
                    }
                }
                if (!selfView) {
                    for (let i: number = 0; i < wild.protectPlayer.length; i++) {
                        item = wild.protectPlayer[i];
                        if (item.userId == this.playerInfo.userId) {
                            selfView = outercityVehicleArmyView;
                            break;
                        }
                    }
                }
            }
        }
        return selfView;
    }

    /**
     * 回城
     * @param armyId
     *
     */
    public returnHome(armyId: number): void {
        this.dispatchEvent(OuterCityEvent.RETURN_HOME, armyId);
    }

    public posationHandler(armyId: number): void {
        this.dispatchEvent(OuterCityEvent.POSATION_POINT, armyId);
    }

    public dispose(): void {
        this._currentCastles = null;
        this._currentWildLand = null;
        for (const key in this._allWildLand) {
            if (this._allWildLand.hasOwnProperty(key)) {
                let s: string = this._allWildLand[key];
                delete this._allWildLand[s];
            }
        }
        this._allWildLand = null;

        for (const key in this._allCastles) {
            if (this._allCastles.hasOwnProperty(key)) {
                let s: string = this._allCastles[key];
                delete this._allCastles[s];
            }
        }
        this._allCastles = null;
        this._castlePool = null;
        this.allCastlesMap.clear();

        for (const key in this._staticMovies) {
            if (this._staticMovies.hasOwnProperty(key)) {
                let s: string = this._staticMovies[key];
                delete this._staticMovies[s];
            }
        }
        this._staticMovies = null;
        super.dispose();
    }

    public isFlying(mountTemplateId: number): boolean {
        if (!this.mapTielsData) {
            return false;
        }
        let flyMountCfg = TempleteManager.Instance.getConfigInfoByConfigName("Fly_Mount");
        if (flyMountCfg) {
            let flyMountList = flyMountCfg.ConfigValue.split(",");
            if (flyMountList.indexOf(mountTemplateId.toString()) != -1) {
                return true;
            }
        }
        return false;
    }

    public getWalkable($x: number, $y: number): boolean {
        let vx: number = $x % 10000;
        let vy: number = $y % 10000;
        if (vx > 4999) {
            vx -= 5000;
            vy > 4999 ? (vy -= 5000) : (vy += 5000);
        }
        vx = ~~(vx / 20);
        vy = ~~(vy / 20);
        return (this.mapTielsData[vx + "_" + vy] == 1);
    }

    public checkArmy(info: MapPhysics, isAttack: number): BaseArmy {
        let army: BaseArmy = this.canAttackArmy(info, isAttack);
        if (!army) {
            return null;
        }
        return army;
    }

    private canAttackArmy(info: MapPhysics, isAttack: number): BaseArmy {
        let str: string = "";
        let army: BaseArmy = ArmyManager.Instance.army;
        if (army == null) {
            str = LangManager.Instance.GetTranslation("map.outercity.OuterCityModel.command01");
            MessageTipManager.Instance.show(str);
        }
        else if (army.state != ArmyState.STATE_WAITING && !ArmyState.moveState(army.state)) {
            str = LangManager.Instance.GetTranslation("map.outercity.OuterCityModel.command02");
            MessageTipManager.Instance.show(str);
        }
        else if (army.curPosX == info.posX && army.curPosY == info.posY && isAttack == 0) {
            str = LangManager.Instance.GetTranslation("map.outercity.OuterCityModel.command03");
            MessageTipManager.Instance.show(str);
        }
        else if (army.mapId > GlobalConfig.Novice.NewMapID && info.info.mapId == GlobalConfig.Novice.OutCityMapID) {
            return army;
        }
        else if (army.mapId != info.info.mapId) {
            str = LangManager.Instance.GetTranslation("map.outercity.mediator.mapview.OuterCitySmallMapMediator.command01");
            MessageTipManager.Instance.show(str);
            NotificationManager.Instance.dispatchEvent(NotificationEvent.ARMY_SYSC_CALL, null);
        }
        else {
            return army;
        }
        return null;
    }

    public getNodeByNodeId(nodeId: number): t_s_mapmineData {
        let mapmineData: t_s_mapmineData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mapmine, nodeId);
        if (mapmineData) {
            return mapmineData;
        } else {
            return null;
        }
    }

    /**
     * 检测玩家自否在物资车的某个队列里面
     * @param wildInfo 
     * @param type 
     */
    public checkSelfInTeam(wildInfo: WildLand, type: number): boolean {
        let flag: boolean = false;
        let selfUserId: number = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
        let arr;
        if (wildInfo) {
            if (type == 0) {//推进队列
                arr = wildInfo.pushPlayer;
            } else if (type == 1) {//护卫队列
                arr = wildInfo.protectPlayer;
            }
            for (let i: number = 0; i < arr.length; i++) {
                if (arr[i].userId == selfUserId) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    /**
     * 本人在金矿大节点占领的金矿总数目
     */
    public occupyCount(node: WildLand): number {
        let totalCount: number = 0;
        if (node) {
            let arr = node.selfOccpuyArr;
            totalCount = arr.length;
        }
        return totalCount;
    }

    /**
    * 金矿大节点某种金矿还剩有未占有的矿
    */
    public hasCanOccpuySonNode(node: OutCityMineNode): boolean {
        let flag: boolean = false;
        if (node) {
            if (node.sonNodeTotalNum > node.allOccupyNum) {
                flag = true;
            }
        }
        return flag;
    }

    /**
     * 金矿大节点某种金矿占用的数组
     */
    public hasOccpuySonNode(node: OutCityMineNode): Array<OutCityOneMineInfo> {
        let hasOccpuyArr: Array<OutCityOneMineInfo> = [];
        if (node) {
            let arr = node.nodeAllMineInfoDic.values;
            let len: number = arr.length;
            let itemData: OutCityOneMineInfo;
            for (let i: number = 0; i < len; i++) {
                itemData = arr[i];
                if (itemData.occupyPlayerId > 0) {
                    hasOccpuyArr.push(itemData);
                }
            }
        }
        hasOccpuyArr = ArrayUtils.sortOn(hasOccpuyArr, ["sort", "sonNodeId"], [ArrayConstant.CASEINSENSITIVE | ArrayConstant.NUMERIC]);
        return hasOccpuyArr;
    }

    /**
     * 金矿大节点某种金矿未占用的数组
     */
    public noOccpuySonNodeArr(node: OutCityMineNode): Array<OutCityOneMineInfo> {
        let notOccArr: Array<OutCityOneMineInfo> = [];
        if (node) {
            let arr = node.nodeAllMineInfoDic.values;
            let len: number = arr.length;
            let itemData: OutCityOneMineInfo;
            for (let i: number = 0; i < len; i++) {
                itemData = arr[i];
                if (itemData.occupyPlayerId == 0) {
                    notOccArr.push(itemData);
                }
            }
        }
        return notOccArr;
    }

    /**检测某该大节点的子节点是否还有未占领的金矿占领 */
    public checkHasCanOccpuy(wild: WildLand, node: OutCityMineNode): boolean {
        let flag: boolean = false;
        if (this.hasCanOccpuySonNode(node)) {//还存在未占领的金矿
            if (this.occupyCount(wild) < wild.tempInfo.Property1) {//自己没有达到上限
                flag = true;
            }
        }
        return flag;
    }

    /**
     * 解析金矿节点数据 (只包括第一层, 第二层节点数据)
     * @param wildLandMsg 
     * @returns 
     */
    private parseNodeMineInfo(wildLandMsg: WildLandMsg): Array<OutCityMineNode> {
        let nodeArr: Array<OutCityMineNode> = [];
        if (wildLandMsg.allNodeInfo.length > 0) {
            let len: number = wildLandMsg.allNodeInfo.length;
            for (let i: number = 0; i < len; i++) {
                let mineNode: OutCityMineNode = this.readNodeMineInfo(wildLandMsg.allNodeInfo[i] as OutCityNodeInfoMsg);//读取节点的金矿信息
                nodeArr.push(mineNode);
            }
            nodeArr = ArrayUtils.sortOn(nodeArr, "nodeId", ArrayConstant.NUMERIC);
        }
        return nodeArr;
    }

    /**
     * 个人在金矿大节点下面所有占领的第三级节点
     * @param wildLandMsg 
     * @returns 
     */
    private getAllOccpuyArr(wildLandMsg: WildLandMsg): Array<OutCityOneMineInfo> {
        let nodeArr: Array<OutCityOneMineInfo> = [];
        if (wildLandMsg.occupyNodeInfo.length > 0) {
            nodeArr = [];
            let len: number = wildLandMsg.occupyNodeInfo.length;
            let oneMineInfo: OutCityOneMineInfo
            let nodeData: OneMineInfoMsg;
            for (let i: number = 0; i < len; i++) {
                nodeData = wildLandMsg.occupyNodeInfo[i] as OneMineInfoMsg;
                oneMineInfo = new OutCityOneMineInfo();
                oneMineInfo.posId = nodeData.posId;
                oneMineInfo.nodeId = nodeData.nodeId;
                oneMineInfo.sonNodeId = nodeData.sonNodeId;
                oneMineInfo.occupyPlayerId = nodeData.occupyPlayerId;
                oneMineInfo.playerName = nodeData.playerName;
                oneMineInfo.guildId = nodeData.guildId;
                oneMineInfo.isOccupy = nodeData.isOccupy;
                nodeArr.push(oneMineInfo);
            }
            nodeArr = ArrayUtils.sortOn(nodeArr, "nodeId", ArrayConstant.NUMERIC);
        }
        return nodeArr;
    }

    public readCastle(cInfo: WildLandMsg): BaseCastle {
        let castleInfo: BaseCastle;
        let pInfo: PhysicInfo
        castleInfo = this.getCastleByIdXY(cInfo.id, cInfo.posX * Tiles.WIDTH, cInfo.posY * Tiles.HEIGHT);
        if (!castleInfo) {
            castleInfo = this.popCastleInfo();
        }
        if (!castleInfo) {
            castleInfo = new BaseCastle();
            pInfo = new PhysicInfo();
        } else {
            pInfo = castleInfo.info;
        }
        castleInfo.templateId = cInfo.templateId;
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
        pInfo.types = cInfo.type;
        pInfo.vipCastleView = 1;
        castleInfo.info = pInfo;
        return castleInfo;
    }

    private get mapNodeInfo(): BaseCastle {
        return PlayerManager.Instance.currentPlayerModel.mapNodeInfo;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public readWildLand(wildMsg: WildLandMsg): WildLand {
        let wInfo: WildLand;
        let info: PhysicInfo;
        let sysArmy: SystemArmy;
        let nodeId: number = wildMsg.id;
        wInfo = this.getWildLandByXY((wildMsg.posX * Tiles.WIDTH) + "," + (wildMsg.posY * Tiles.HEIGHT));

        if (!wInfo) {
            wInfo = new WildLand();
            info = new PhysicInfo();
            sysArmy = new SystemArmy;
        } else {
            info = wInfo.info;
            sysArmy = wInfo.ownSysArmy;
        }
        info.id = nodeId;
        info.posX = wildMsg.posX;
        info.posY = wildMsg.posY;
        info.types = wildMsg.type;
        info.mapId = wildMsg.mapId;
        info.grade = wildMsg.level;
        info.state = wildMsg.state;
        if (info.types == OutCityNodeTypeConstant.TYPE_MINE) {//金矿节点
            wInfo.allNodeInfo = this.parseNodeMineInfo(wildMsg);
            wInfo.selfOccpuyArr = this.getAllOccpuyArr(wildMsg);
        }
        info.occupyPlayerId = wildMsg.occupyPlayerId;
        info.occupyPlayerName = wildMsg.occupyPlayerName;
        info.occupyLeagueName = wildMsg.occupyLeagueName;
        info.occupyLeagueConsortiaId = wildMsg.occupyGuildId;
        wInfo.types = wildMsg.type;
        wInfo.templateId = wildMsg.templateId;
        wInfo.refreshTime = wildMsg.refreshTime;
        wInfo.curArmyId = wildMsg.curArmyId;
        wInfo.info = info;
        if (wildMsg.hasOwnProperty("simpleHeroInfo")) {
            ThaneInfoHelper.readHeroInfo(sysArmy.baseHero, wildMsg.simpleHeroInfo as SimpleHeroInfoMsg);
        }
        for (let i: number = 0; i < 2; i++) {
            let sysPawn: ArmyPawn = sysArmy.getPawnByIndex(i);
            if (i < wildMsg.armyPawn.length) {
                let wMsg: ArmyPawnInfoMsg = wildMsg.armyPawn[i] as ArmyPawnInfoMsg;
                sysPawn.id = wMsg.id;
                sysPawn.armyId = wMsg.armyId;
                sysPawn.templateId = wMsg.tempateId;
                sysPawn.ownPawns = wMsg.ownPawns;
            } else if (sysPawn) {
                sysArmy.removeArmyPawnCountByIndex(i, sysPawn.ownPawns);
            }
        }
        wInfo.ownSysArmy = sysArmy;
        wInfo.commit();
        return wInfo;
    }

    /**
     * 
     * @param info 金矿信息
     * @returns 
     */
    private readNodeMineInfo(info: OutCityNodeInfoMsg): OutCityMineNode {
        let outCityMineNode: OutCityMineNode = new OutCityMineNode();
        outCityMineNode.posId = info.posId;
        outCityMineNode.nodeId = info.nodeId;
        outCityMineNode.occupyNum = info.occupyNum;
        outCityMineNode.allOccupyNum = info.allOccupyNum;
        outCityMineNode.posX = info.posX;
        outCityMineNode.posY = info.posY;
        let mapmineData: t_s_mapmineData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mapmine, info.nodeId.toString()) as t_s_mapmineData;
        if (mapmineData) {
            outCityMineNode.sonNodeTotalNum = mapmineData.TotalNum;
        }
        if (!outCityMineNode.nodeAllMineInfoDic) {
            outCityMineNode.nodeAllMineInfoDic = new Dictionary();
            for (let i: number = 0; i < mapmineData.TotalNum; i++) {
                let outCityOneMineInfo: OutCityOneMineInfo = new OutCityOneMineInfo();
                outCityOneMineInfo.sonNodeId = i + 1;
                outCityOneMineInfo.nodeId = info.nodeId;
                outCityOneMineInfo.posId = info.posId;
                outCityMineNode.nodeAllMineInfoDic.set(outCityOneMineInfo.sonNodeId, outCityOneMineInfo);
            }
        }
        return outCityMineNode;
    }

    public getSonNodeNameTxt(grade: number): string {
        return this.currentSelectMine.tempInfo.NameLang + " " + LangManager.Instance.GetTranslation("public.level3", grade);
    }

    public checkIsSameConsortiaById(consortiaId: number): boolean {
        let flag: boolean = false;
        let pModel: PlayerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        if ((pModel.consortiaID > 0 && pModel.consortiaID == consortiaId) || consortiaId == 0) {
            flag = true
        }
        return flag;
    }

    public checkIsSameConsortiaByName(consortiaName: string): boolean {
        let flag: boolean = false;
        let pModel: PlayerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        if (pModel.consortiaID > 0 && pModel.consortiaName == consortiaName) {
            flag = true;
        }
        return flag;
    }

    /**
     * 不同等级的玩家在各个矿点能占的矿数量总和最大值
     * @param grade 
     */
    public getPlayerCanOccupyMineMaxCount(grade: number): number {
        let len: number = this.mineUpperLimitArr.length;
        let maxCount = 0;
        for (let i: number = len - 1; i >= 0; i--) {
            let str: string = this.mineUpperLimitArr[i];
            let minGrade: number = parseInt(str.split(",")[0]);
            let count: number = parseInt(str.split(",")[1]);
            if (grade >= minGrade) {
                maxCount = count;
                break;
            }
        }
        return maxCount;
    }

    /**
     * 玩家在各个矿点占领总数量是否达到上限
     */
    public checkPlayerOccpuyNumberIsMax(): boolean {
        let flag: boolean = false;
        let maxNumber = this.getPlayerCanOccupyMineMaxCount(ArmyManager.Instance.thane.grades);
        let len = this.allMinNode.length;
        let wild: WildLand;
        let totalCount: number = 0;
        let itemCount: number = 0;
        for (let i: number = 0; i < len; i++) {
            wild = this.allMinNode[i];
            itemCount = this.occupyCount(wild);
            totalCount += itemCount;
        }
        if (totalCount >= maxNumber) {
            flag = true;
        }
        return flag;
    }

    public findNeedUpdateNode(msg: OneMineInfoMsg): WildLand {
        let len: number = this.allMinNode.length;
        let wild: WildLand;
        let targetWild: WildLand;
        for (let i: number = 0; i < len; i++) {
            wild = this.allMinNode[i];
            if (wild.templateId == msg.posId) {//找到大节点
                targetWild = wild;
                break;
            }
        }
        if (targetWild) {
            let secondNodeLen: number = targetWild.allNodeInfo.length;
            let secondeNodeInfo: OutCityMineNode;
            for (let j: number = 0; j < secondNodeLen; j++) {
                secondeNodeInfo = targetWild.allNodeInfo[j];
                if (secondeNodeInfo && secondeNodeInfo.nodeId == msg.nodeId) {
                    break;
                }
            }
            if (secondeNodeInfo) {//找到了二级节点
                for (const key in secondeNodeInfo.nodeAllMineInfoDic) {
                    let info = secondeNodeInfo.nodeAllMineInfoDic.get(key);
                    if (info && info.sonNodeId == msg.sonNodeId) {//找到了孙子节点, 修改节点数据
                        info.playerName = msg.playerName;
                        info.occupyPlayerId = msg.occupyPlayerId;
                        info.guildId = msg.guildId;
                        if (info.occupyPlayerId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {//自己的
                            info.sort = 1;
                        } else if (info.guildId == PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID) {//同工会
                            info.sort = 2;
                        } else {
                            info.sort = 3;
                        }
                        break;
                    }
                }
            }
        }
        if (targetWild) {
            for (let m: number = 0; m < wild.selfOccpuyArr.length; m++) {
                let item: OutCityOneMineInfo = wild.selfOccpuyArr[m];
                if (item && item.sonNodeId == msg.sonNodeId) {//放弃该节点
                    targetWild.selfOccpuyArr.splice(m, 1);
                    break;
                }
            }
        }
        return targetWild;
    }

    public findSecondNodeById(wild: WildLand, nodeId: number): OutCityMineNode {
        let arr: Array<OutCityMineNode> = wild.allNodeInfo;
        let len: number = arr.length;
        let targetNode: OutCityMineNode;
        let itemNode: OutCityMineNode;
        for (let i: number = 0; i < len; i++) {
            itemNode = arr[i];
            if (itemNode.nodeId == nodeId) {
                targetNode = itemNode;
                break;
            }
        }
        return targetNode;
    }

    public getSelfArmy(): OuterCityArmyView {
        let self: OuterCityArmyView;
        for (const allArmyDictKey in this.allArmyDict) {
            if (this.allArmyDict.hasOwnProperty(allArmyDictKey)) {
                let c: BaseArmy = this.allArmyDict[allArmyDictKey];
                let outerCityArmyView = c.armyView as OuterCityArmyView;
                if (outerCityArmyView && outerCityArmyView.isSelf) {
                    self = outerCityArmyView;
                }
            }
        }
        return self;
    }

    public checkOutScene(): boolean {
        let flag: boolean = false;
        let outerCityArmyView: any;
        outerCityArmyView = this.getSelfArmy();
        if (!outerCityArmyView) {
            outerCityArmyView = OuterCityManager.Instance.model.getSelfVehicle();
        }
        let xMin = StageReferance.stageWidth / 2;
        let yMin = StageReferance.stageHeight / 2;
        let mapView = OuterCityManager.Instance.mapView;
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
        if (outerCityArmyView && ((Math.abs(outerCityArmyView.x - centerX) > StageReferance.stageWidth / 2) || (Math.abs(outerCityArmyView.y - centerY) > StageReferance.stageHeight / 2))) {
            flag = true;
        }
        return flag;
    }

    /**
     * 检测物资车的护送和推进队列是否都在战斗中
     * @param wildInfo 
     */
    public checkAllInFighting(wildInfo: WildLand):boolean{
        return wildInfo.protectStatus == 1 && wildInfo.pushStatus == 1;
    }

    /**
     * 检测是否可以攻击当前物资车
     * @param outercityVehicleArmy 
     */
    public checkCanAttackVehicle(wildInfo: WildLand): boolean {
        let flag: boolean = false;
        let selfGuildId: number = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID;
        let protectPlayer = wildInfo.protectPlayer;
        let pushPlayer = wildInfo.pushPlayer;
        let playerInfo: VehiclePlayerInfo;
        let selfVehicle: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
        let protectSameConsortiaFlag: boolean = false;//护送是否有不同公会的人，默认都是同公会的
        let pushSameConsortiaFlag: boolean = false;//推进是否有不同公会的人，默认都是同公会的
        if (!selfVehicle) {//自己不在车上
            for (let i: number = 0; i < protectPlayer.length; i++) {
                playerInfo = protectPlayer[i];
                if (playerInfo && playerInfo.guildId != selfGuildId) {
                    protectSameConsortiaFlag = true;
                    break;
                }
            }
            if (protectSameConsortiaFlag) {//护送有不同公会的人
                if (wildInfo.protectStatus == 1) {//护送队列在战斗中
                    for (let j: number = 0; j < pushPlayer.length; j++) {
                        playerInfo = pushPlayer[j];
                        if (playerInfo && playerInfo.guildId != selfGuildId) {
                            pushSameConsortiaFlag = true;
                            break;
                        }
                    }
                    if (pushSameConsortiaFlag) {//推进有不同公会的人
                        if (wildInfo.pushStatus != 1) {//推进队列在战斗中
                            flag = true;//进战斗
                        } 
                    }
                } else {
                    flag = true;//进战斗
                }
            } else {//护送都是同公会的
                for (let j: number = 0; j < pushPlayer.length; j++) {
                    playerInfo = pushPlayer[j];
                    if (playerInfo && playerInfo.guildId != selfGuildId) {
                        pushSameConsortiaFlag = true;
                        break;
                    }
                }
                if (pushSameConsortiaFlag) {//推进有不同公会的人
                    if (wildInfo.pushStatus != 1) {//推进队列在战斗中
                        flag = true;//进战斗
                    } 
                }
            }
        }
        return flag;
    }

    public checkTeamInFight(wildInfo: WildLand): boolean {
        let flag: boolean = false;
        if (FreedomTeamManager.Instance.model) {
            for (const key in FreedomTeamManager.Instance.model.allMembers) {
                if (Object.prototype.hasOwnProperty.call(FreedomTeamManager.Instance.model.allMembers, key)) {
                    var member: BaseArmy = FreedomTeamManager.Instance.model.allMembers[key];
                    if (member && wildInfo.fightUserIdArray.indexOf(member.userId.toString()) != -1) {
                        flag = true;
                    }
                }
            }
        }
        return flag;
    }

    public checkMouseStatus(wildInfo: WildLand): boolean {
        let flag: boolean = false;
        let selfGuildId: number = PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID;
        let protectPlayer = wildInfo.protectPlayer;
        let pushPlayer = wildInfo.pushPlayer;
        let playerInfo: VehiclePlayerInfo;
        let selfVehicle: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle()
        if (protectPlayer.length > 0) {
            for (let i: number = 0; i < protectPlayer.length; i++) {
                playerInfo = protectPlayer[i];
                if (playerInfo && playerInfo.guildId != selfGuildId && !selfVehicle) {
                    flag = true;
                    break;
                }
            }
        }
        if (pushPlayer.length > 0 && !flag) {
            for (let j: number = 0; j < pushPlayer.length; j++) {
                playerInfo = pushPlayer[j];
                if (playerInfo && playerInfo.guildId != selfGuildId && !selfVehicle) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }
}