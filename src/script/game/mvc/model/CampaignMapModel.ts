import Resolution from "../../../core/comps/Resolution";
import Logger from "../../../core/logger/Logger";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { DisplayObject } from "../../component/DisplayObject";
import { t_s_campaignData } from "../../config/t_s_campaign";
import BuildSonType from "../../constant/BuildSonType";
import {
  CampaignEvent,
  CampaignMapEvent,
  NotificationEvent,
  OuterCityEvent,
} from "../../constant/event/NotificationEvent";
import { GlobalConfig } from "../../constant/GlobalConfig";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { KingTowerManager } from "../../manager/KingTowerManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyState } from "../../map/campaign/data/CampaignArmyState";
import { FogView } from "../../map/campaign/view/fog/FogView";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { NodeState } from "../../map/space/constant/NodeState";
import { PosType } from "../../map/space/constant/PosType";
import Tiles from "../../map/space/constant/Tiles";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { ChestInfo } from "../../map/space/data/ChestInfo";
import { FloorMapInfo } from "../../map/space/data/FloorMapInfo";
import { MapInfo } from "../../map/space/data/MapInfo";
import { MapPhysics } from "../../map/space/data/MapPhysics";
import { MapUtils } from "../../map/space/utils/MapUtils";
import { AStarPathFinder } from "../../mapEngine/AStarPathFinder";
import MapDataUtils from "../../mapEngine/utils/MapDataUtils";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import CampaignNodeType from "./CampaignNodeType";

/**
 *
 * 副本model
 *
 */
export class CampaignMapModel extends FloorMapInfo {
  /** BgLayer*/
  // public bgLayer: Object;

  public static isHangUp: boolean;
  public static inMazeFlag: boolean;
  public createType: number = 0;
  public fogMaskData: Laya.Texture;
  /** 是否为跨服  */
  public isCross: boolean = false;
  public static MINERA_GET_CAR_NODEID: number = 3000003;
  public static MINERA_HAND_CAR_NODEID: number = 3000004;
  public static CONSORTIA_BOSS_GOODS_NODEID: number = 530126;

  //remark by yuyuanzhan 切片图作为副本背景
  public static sliceBgMapId: Array<number> = [
    10000, 10001, 10002, 20001, 20002, 20003, 20004, 30000, 1011, 1021, 1031,
    1032, 1051, 1061, 1071, 1072, 1073, 1081, 1082, 1083, 1091, 1111, 1131,
    1132, 1141, 1142, 1151, 1161, 1171, 1172, 1181, 1182, 1191, 1192, 1201,
    1202, 1211, 1212, 1231, 1232, 1251, 1252, 1261, 1262, 1271, 1272, 1291,
    1292, 1301, 1302, 1311, 1312, 1313, 1331, 1332, 1341, 1342, 1351, 1352,
    1371, 1391, 1392, 1401, 1402, 1411, 1412, 1431, 1432, 1441, 1442, 1451,
    1452, 1471, 1472, 1491, 1492, 1501, 1502, 1511, 1512, 1521, 1522, 1531,
    1532, 1551, 1552, 1553, 1554, 1555, 1561, 1562, 1563, 1564, 1565, 1571,
    1572, 1581, 1582, 1591, 1592, 1601, 1602, 1611, 1612, 1631, 1632, 1651,
    1652, 1661, 1662, 1671, 1672, 1691, 1692, 1711, 1712, 1731, 1732, 1741,
    1742, 1751, 1752, 1771, 1772, 1791, 1792, 1811, 1812, 1821, 1822, 1831,
    1832, 1851, 1852, 1861, 1862, 1871, 1872, 1873, 1891, 1892, 1893,
    //
    2011, 2012, 2031, 2032, 2033, 2051, 2052, 2053, 2054, 2071, 2072, 2073,
    2074, 2075, 2081, 2082, 2083, 2084, 2085, 2091, 2092, 2111, 2112, 2114,
    2121, 2122, 2124, 2131, 2132, 2133, 2141, 2142, 2143, 2151, 2152, 2153,
    2161, 2162, 2163, 2171, 2172, 2173, 2181, 2182, 2183, 2191, 2192, 2193,
    2201, 2202, 2203, 2211, 2212, 2213, 2214, 2215, 2221, 2222, 2223, 2224,
    2225, 2231, 2232, 2233, 2241, 2242, 2243, 2251, 2252, 2253, 2261, 2262,
    2263, 3001, 4000, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009,
    4010, 4011, 5001, 5002, 5003, 5201, 5301, 6001, 7001, 7002, 7003, 7004,
    7005, 7006, 7007, 7008, 7009, 7501, 7601, 8001, 8002, 8003, 8004, 8005,
    8006, 8007, 8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 8016, 8017,
    8018, 8019, 8020, 8021, 8022, 8023, 8024, 8025, 8026, 8027, 8028, 8029,
    8030, 8031, 8032, 8033, 8034, 8035, 8036, 8037, 8038, 8039, 8040, 8041,
    8042, 8043, 8044, 8045, 8046, 8047, 8048, 8049, 8050, 8051, 8052, 8053,
    8054, 8055, 8056, 8057, 8058, 8059, 8060, 8061, 8062, 8063, 8064, 8065,
    8066, 8067, 8068, 8069, 8070, 8071, 8072, 8073, 8074, 8075, 8076, 8077,
    8078, 8079, 8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089,
    8090, 8091, 8092, 8093, 8094, 8095, 8096, 8097, 8098, 8099, 8100, 8101,
    8102, 8103, 8104, 8105, 8106, 8107, 8108, 8109, 8110, 8111, 8112, 8113,
    8114, 8115, 8116, 8117, 8118, 8119, 8120, 8121, 8122, 8123, 8124, 8125,
    8126, 8127, 8128, 8129, 8130, 8200, 8201, 8202, 8203, 8204, 2271, 2351,
    2281, 2341, 2352, 2353,
  ];

  /** 单张图作为副本背景 角色站位固定 */
  public static getSingleBgMapPosList(dir: number = 1) {
    let baseW = Resolution.gameWidth;
    let baseH = Resolution.gameHeight;
    let baseX = baseW / 2;
    let baseY = (baseH * 3) / 5;

    let gap = baseX / 4;

    let arr;
    if (dir == 1) {
      arr = [
        new Laya.Point(baseX - gap, baseY),
        new Laya.Point(baseX - gap * 2, baseY),
        new Laya.Point(baseX - gap * 3, baseY),
      ];
    } else {
      arr = [
        new Laya.Point(baseX + gap, baseY),
        new Laya.Point(baseX + gap * 2, baseY),
        new Laya.Point(baseX + gap * 3, baseY),
      ];
    }
    return arr;
  }

  /**
   * 设置地表的数据
   * 如果小于规定的尺寸则一次性全部渲染 否则只渲染当前的
   * @param arr
   *
   */
  public set currentFloorData(arr: any[]) {
    switch (this.mapId) {
      case 10001: //新地图渲染方式没有floorData
      case 10002:
      case 20001:
      case 20002:
      case 20003:
        if (
          this.mapTempInfo.Width > MapInfo.MAX_WIDTH ||
          this.mapTempInfo.Height > MapInfo.MAX_HEIGHT
        ) {
          this.dispatchEvent(OuterCityEvent.COMMIT_LOADING, null); //通知删去多的元素
        }
        let movies: any[] = [];
        let tops: any[] = [];
        let tempArr: any[];
        for (const key in this.moviesData) {
          if (this.moviesData.hasOwnProperty(key)) {
            const element = this.moviesData[key];
            movies = movies.concat(element);
          }
        }

        // this.moviesData.forEach((element) => {
        // 	movies = movies.concat(element);
        // });

        for (const key in this.topsData) {
          if (this.topsData.hasOwnProperty(key)) {
            const element = this.topsData[key];
            tops = tops.concat(element);
          }
        }

        // this.topsData.forEach((element) => {
        // 	tops = tops.concat(element);
        // });
        this.dispatchEvent(OuterCityEvent.CURRENT_CONFIG_CHANGE, {
          movies: movies,
          tops: tops,
        });
        break;
      default:
        if (
          this.mapTempInfo.Width > MapInfo.MAX_WIDTH ||
          this.mapTempInfo.Height > MapInfo.MAX_HEIGHT
        ) {
          super.currentFloorData = arr;
        } else {
          for (const key in this.floorData) {
            let floor: any[] = this.floorData[key];
            let movie: any[] = this.moviesData ? this.moviesData[key] : [];
            let top: any[] = this.topsData ? this.topsData[key] : [];
            let start: Laya.Point = MapDataUtils.getStartPoint(key);
            this.dispatchEvent(OuterCityEvent.CURRENT_CONFIG_CHANGE, {
              floor: floor,
              movies: movie,
              tops: top,
              id: key,
              start: start,
            });
          }
        }
        break;
    }
  }

  protected sloveRectData(id: string): Object {
    let start: Laya.Point = MapUtils.getStartPoint(id);
    let key: string = start.x + "," + start.y;
    let data: Object = new Object();
    data["floor"] = this.floorData[id];
    if (this.topsData) data["tops"] = this.topsData[key];
    if (this.moviesData) data["movies"] = this.moviesData[key];
    return data;
  }

  public isFirstLoginCampaign: boolean = true;
  private _currentDieNodeId: number = 0; //最近攻下的节点
  private _mapNodesData: any[];
  private _curSysArmy: any;
  private _sysArmyList: Map<string, any>;
  private _userArmyList: Map<string, CampaignArmy>;
  private _pathFinder: AStarPathFinder;

  public effectLock: boolean = false; //播放效果锁

  public allSystemHeros: any[]; //当前战役所有的系统英雄
  public allSystemPawns: any[]; //当前战役所有的系统兵种

  private _leftFightTime: number = 0;
  private _attackBoss: ThaneInfo;
  private _attackBossTeamList: Map<number, ThaneInfo>; //攻击Boss的玩家列表
  /** 当天挂机房可获得剩余体力 */
  public hookleftWeay: number = 0;
  private _selectNode: CampaignNode;

  public get selectNode(): CampaignNode {
    return this._selectNode;
  }

  public set selectNode(value: CampaignNode) {
    this._selectNode = value;
  }

  public staticMovies: any[];
  private _syncErrorTime: number = 0;
  public onCollectionId: number = 0;
  public get syncErrorTime(): number {
    return this._syncErrorTime;
  }

  public set syncErrorTime(value: number) {
    this._syncErrorTime = value;
    this.dispatchEvent(CampaignMapEvent.SYNC_ERROR_TIME, value);
  }

  public showOpenTimeMv() {
    this.dispatchEvent(CampaignMapEvent.OPENTIME_MV, null);
  }

  public attackBossTeam(
    dic: Map<number, ThaneInfo>,
    time: number,
    boss: ThaneInfo
  ) {
    this._attackBossTeamList = dic;
    this._leftFightTime = time;
    this._attackBoss = boss;
    this.dispatchEvent(CampaignMapEvent.ATTACK_BOSS_TEMA, {
      team: dic,
      time: time,
      boss: boss,
    });
  }
  public inviteAttackBoos(
    inviteName: string,
    boss: ThaneInfo,
    time: number,
    pos: Laya.Point
  ) {
    this.dispatchEvent(CampaignMapEvent.ATTACK_BOSS_INVITE, {
      inviteName: inviteName,
      time: time,
      boss: boss,
      pos: pos,
    });
  }

  public addTempChestNode(node: CampaignNode) {
    this._mapNodesData.unshift(node);
  }
  public get campaignTemplate(): t_s_campaignData {
    if (!this.mapTempInfo) return;
    return TempleteManager.Instance.getCampaignTemplateByID(
      this.mapTempInfo.CampaignId
    );
  }

  private _fogData: any[];
  public set mapId(value: number) {
    super.mapId = value;
  }
  public get mapId(): number {
    return super.mapId;
  }

  public get fogData(): any[] {
    return this._fogData;
  }

  public aStarPathFinder(
    $start: Laya.Point,
    $end: Laya.Point,
    off: number = 25
  ): any[] {
    let startPoint: Laya.Point = new Laya.Point(
      parseInt(($start.x / 20).toString()),
      parseInt(($start.y / 20).toString())
    );
    let endPoint: Laya.Point = new Laya.Point(
      parseInt(($end.x / 20).toString()),
      parseInt(($end.y / 20).toString())
    );
    if (!this._pathFinder) {
      this._pathFinder = new AStarPathFinder(this.mapTielsData);
    }
    return this._pathFinder.find(startPoint, endPoint);
  }

  public checkWalkable($pt: Laya.Point): boolean {
    let startPoint: Laya.Point = new Laya.Point(
      parseInt(($pt.x / 20).toString()),
      parseInt(($pt.y / 20).toString())
    );
    if (!this._pathFinder) {
      this._pathFinder = new AStarPathFinder(this.mapTielsData);
    }
    return this._pathFinder.isWalkable(startPoint.x, startPoint.y);
  }

  public set fogData(value: any[]) {
    if (this._fogData) {
      this.sysFogNote(value);
      this.sysFogData(value);
    } else {
      this._fogData = value;
    }

    this.dispatchEvent(CampaignMapEvent.SYS_FOG_DATA, this._fogData);
  }

  /**
   *根据服务器数据同步本地数据
   * @param value
   *
   */
  private sysFogData(value: any[]) {
    for (let i: number = 0; i < value.length; i++) {
      let temp: any[] = value[i];
      for (let j: number = 0; j < temp.length; j++) {
        if (temp[j] > 0) {
          this._fogData[i][j] = temp[j];
        }
      }
    }
  }
  /**
   * 根据服务器数据同步更新记录
   * @param value
   *
   */
  private sysFogNote(value: any[]) {
    for (let i: number = this._noteFogArr.length - 1; i >= 0; i--) {
      let obj: any = this._noteFogArr[i];
      if (obj.x && obj.y) {
        if (value[obj.x][obj.y] == 1) this._noteFogArr.splice(i, 1);
      }
    }
  }

  public updateFog(posX: number, posY: number, type: number) {
    if (WorldBossHelper.checkFogMap(this.mapId)) return;
    let p: Laya.Point;
    p = new Laya.Point(
      parseInt((posX + CampaignMapModel.fogUnitWidth / 2).toString()),
      parseInt((posY + CampaignMapModel.fogUnitHeight / 2).toString())
    );
    let tempY: number = p.y % CampaignMapModel.fogUnitHeight;
    let vy: number = ((p.y - tempY) / CampaignMapModel.fogUnitHeight) % 2;
    if (vy != 0) p.x -= CampaignMapModel.fogUnitWidth / 2;
    p.y = p.y - tempY;
    let tempX: number = p.x % CampaignMapModel.fogUnitWidth;
    p.x = p.x - tempX;
    if (this.updateFogData(p.x, p.y, type))
      this.dispatchEvent(CampaignMapEvent.LOCAL_UPDATE_FOG, {
        x: p.x,
        y: p.y,
        vy: vy,
        type: type,
      });
  }

  private static fogUnitWidth: number = 110;
  private static fogUnitHeight: number = 86;
  private updateFogData(vx: number, vy: number, byte: number): boolean {
    let isUpdate: boolean = false;
    let col: number = vx / CampaignMapModel.fogUnitWidth;
    let row: number = vy / CampaignMapModel.fogUnitHeight;
    if (!this._fogData) return isUpdate;
    if (row < this._fogData.length && row >= 0) {
      if (col < this._fogData[row].length && col >= 0) {
        if (this._fogData[row][col] < byte) {
          isUpdate = true;
          this._fogData[row][col] = byte;
          this.noteFog(row, col, byte);
        }
      }
    }
    return isUpdate;
  }
  public checkFog(vx: number, vy: number): boolean {
    let p: Laya.Point = FogView.sloveFogPoint(vx, vy);
    vx = p.x;
    vy = p.y;
    let col: number = vx / CampaignMapModel.fogUnitWidth;
    let row: number = vy / CampaignMapModel.fogUnitHeight;
    if (!this._fogData) return false;
    if (row < this._fogData.length && row >= 0) {
      if (col < this._fogData[row].length && col >= 0) {
        return Boolean(this._fogData[row][col] > 0);
      }
    }
    return false;
  }
  private _noteFogArr: any[] = [];
  private noteFog(vx: number, vy: number, byte: number) {
    let col: number = Math.ceil(
      this.mapTempInfo.Width / CampaignMapModel.fogUnitWidth
    );
    let index: number = vx * col + vy;
    this._noteFogArr.push({ index: index, value: byte });
    if (this._noteFogArr.length >= 3) {
      CampaignSocketOutManager.Instance.sendUpdateFogData(
        this._noteFogArr,
        this.mapId
      );
      this._noteFogArr.splice(0, this._noteFogArr.length);
    }
  }
  public syscFogNode(index: number, byte: number, col: number) {
    let vx: number = Math.floor(index / col);
    let vy: number = index % col;
    if (
      !this._fogData ||
      this._fogData[vx] == null ||
      this._fogData[vx][vy] == null
    )
      return;
    let old: number = this._fogData[vx][vy];
    this._fogData[vx][vy] = byte > old ? byte : old;
    this.filterFogNote(index, byte);
    let vvy: number = (vy / CampaignMapModel.fogUnitHeight) % 2;
    this.dispatchEvent(CampaignMapEvent.SYN_FOG_DATA, {
      x: vx,
      y: vy,
      vy: vvy,
      type: byte,
    });
  }

  private filterFogNote(index: number, byte: number) {
    if (!this._noteFogArr) return;
    for (let i: number = 0; i < this._noteFogArr.length; i++) {
      let obj: any = this._noteFogArr[i];
      if (index == obj.index) {
        if (byte >= obj.byte) this._noteFogArr.splice(i, 1);
      }
    }
  }

  public get currentDieNodeId(): number {
    return this._currentDieNodeId;
  }

  public set currentDieNodeId(value: number) {
    this._currentDieNodeId = value;
    this.dispatchEvent(CampaignMapEvent.NEXT_NODE_GUIDE_TIME, value);
  }

  constructor(target: any = null) {
    super();
    this._userArmyList = new Map();
    this._sysArmyList = new Map();
    this.staticMovies = [];
  }

  public moveToVisible(army: CampaignArmy) {
    this.dispatchEvent(CampaignMapEvent.MOVE_TO_VISIBLE, army);
  }

  public moveToUnVisible(army: CampaignArmy) {
    this.dispatchEvent(CampaignMapEvent.MOVE_TO_UNVISIBLE, army);
  }

  public addSysArmy(value: any) {
    let key: string;
    if (this.isCross && value.baseHero) {
      key = value.baseHero.serviceName + "_" + value.id;
    } else {
      key = "_" + value.id;
    }
    this._sysArmyList[key] = value;
    this.dispatchEvent(CampaignEvent.GET_SYS_ARMY_INFO, value);
  }
  public getSysArmyByArmyId(id: number, serverName: string = ""): CampaignArmy {
    if (!this.isCross || serverName == null) serverName = "";
    return this._sysArmyList[serverName + "_" + id] as CampaignArmy;
  }

  public addBaseArmy(army: CampaignArmy, isSwitchMap: boolean = false) {
    let key: string;
    if (this.isCross && army.baseHero) {
      key = army.baseHero.serviceName + "_" + army.id;
    } else {
      key = "_" + army.id;
    }

    if (this.isSelfArmy(army)) {
      this._selfMemberData = army;
      this.dispatchEvent(OuterCityEvent.UPDATE_SELF);
    }

    if (isSwitchMap) {
      army.angle = -1;
    }

    if (!this._userArmyList.has(key)) {
      this._userArmyList.set(key, army);
      this.dispatchEvent(OuterCityEvent.ADD_GARRISON, army);
      if (this.isCross)
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.CROSS_ADD_GOONBTN
        );
      return;
    }
    this._userArmyList.set(key, army);
    if (isSwitchMap) {
      this.dispatchEvent(OuterCityEvent.ADD_GARRISON, army, true);
    }
  }
  public reset() {
    this._userArmyList.clear();
    this._selfMemberData = null;
    if (this._mapNodesData)
      this._mapNodesData.splice(0, this._mapNodesData.length);
    if (this._fogData) this._fogData.splice(0, this._fogData.length);
  }

  /**
   * 判断是否是自己的军队
   * @param army
   * @return
   *
   */
  public isSelfArmy(army: CampaignArmy): boolean {
    let userId: number = this.playerInfo.userId;
    let selfServerName: string = this.playerInfo.serviceName;
    if (this.isCross) {
      return Boolean(
        army.userId == userId && army.baseHero.serviceName == selfServerName
      );
    } else {
      return Boolean(army.userId == userId);
    }
  }

  private _selfMemberData: CampaignArmy;

  public get selfMemberData(): CampaignArmy {
    return this._selfMemberData;
  }

  public removeBaseArmyByArmyId(
    armyId: number,
    serverName: string = ""
  ): CampaignArmy {
    if (!this.isCross || serverName == null) serverName = "";
    let army = this._userArmyList.get(
      serverName + "_" + armyId
    ) as CampaignArmy;
    if (army) {
      if (this.isSelfArmy(army)) {
        this._selfMemberData = null;
      }
      this._userArmyList.delete(serverName + "_" + armyId);
      if (PlayerManager.Instance.currentPlayerModel.selectTarget == army) {
        PlayerManager.Instance.currentPlayerModel.selectTarget = null;
      }
      this.dispatchEvent(OuterCityEvent.REMOVE_ARMY, army);
      if (this.isCross)
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.CROSS_ADD_GOONBTN
        );
    }
    return army;
  }

  public get allBaseArmy(): Map<string, CampaignArmy> {
    return this._userArmyList;
  }

  public getBaseArmyByArmyId(
    armyId: number,
    serverName: string = ""
  ): CampaignArmy {
    if (!this.isCross || serverName == null) serverName = "";
    return this._userArmyList.get(serverName + "_" + armyId);
  }

  public getBaseArmyByUserId(
    userId: number,
    serverName: string = ""
  ): CampaignArmy {
    if (!this.isCross || serverName == null) serverName = "";

    let temp: CampaignArmy;
    let values = this._userArmyList.values();
    for (let element of values) {
      if (element.userId == userId) {
        if (serverName) {
          if (element.baseHero.serviceName == serverName) temp = element;
        } else {
          temp = element;
        }
      }
    }
    return temp;
  }

  public getUserArmyByUserId(
    userId: number,
    serverName: string = ""
  ): CampaignArmy {
    if (!this.isCross || serverName == null) serverName = "";
    let values = this._userArmyList.values();
    for (let army of values) {
      if (army.userId == userId) {
        if (serverName) {
          if (army.baseHero.serviceName == serverName) return army;
        } else {
          return army;
        }
      }
    }
    return null;
  }

  /**
   * 当前副本所有节点
   * @return
   *
   */
  public get mapNodesData(): CampaignNode[] {
    return this._mapNodesData;
  }

  public addNode(cInfo: CampaignNode) {
    if (this._mapNodesData.indexOf(cInfo) < 0) {
      this._mapNodesData.push(cInfo);
    }
    this.dispatchEvent(OuterCityEvent.CURRENT_NPC_POS, this._mapNodesData);
  }
  public removeNode(cInfo: CampaignNode) {
    for (let i: number = 0; i < this._mapNodesData.length; i++) {
      let temp: CampaignNode = this._mapNodesData[i];
      if (temp.info.id == cInfo.info.id) this._mapNodesData.splice(i, 1);
    }
    this.dispatchEvent(OuterCityEvent.REMOVE_NODE, cInfo);
  }
  /**
   * 更新当前副本的所有节点
   * @param value
   *
   */
  public set mapNodesData(value: CampaignNode[]) {
    this._mapNodesData = value;
    this.dispatchEvent(OuterCityEvent.CURRENT_NPC_POS, value);
  }
  public set addNodes(value: any[]) {
    this.mapNodesData = this._mapNodesData.concat(value);
  }
  /**
   * 当前地图的起始节点
   * @return
   *
   */
  public get mapNodeStartPoint(): CampaignNode {
    let selfArmy: CampaignArmy = this.selfMemberData;
    for (const key in this._mapNodesData) {
      let element = this._mapNodesData[key];
      if (element.info.types == PosType.COPY_START) {
        if (
          WorldBossHelper.checkPvp(this.mapId) ||
          WorldBossHelper.checkGvg(this.mapId)
        ) {
          if (selfArmy && element.param1 == selfArmy.teamId) {
            return element;
          }
        } else {
          return element;
        }
      }
    }
    let minId: number = 9999999;
    let start: CampaignNode;
    for (const key in this._mapNodesData) {
      let element = this._mapNodesData[key];
      if (element.info.id < minId && element.followTarget == 0) {
        minId = element.info.id;
        start = element;
      }
    }
    return start;
  }

  /**
   * 当前地图的结束节点
   * @return
   *
   */
  public get mapNodeEndPoint(): CampaignNode {
    for (const key in this._mapNodesData) {
      let element = this._mapNodesData[key];
      if (this.campaignTemplate.Types == 1) {
        if (this.checkNode(element)) return element;
        if (element.nodeId == 500302) return element;
      } else {
        if (element.info.types == PosType.COPY_END) return element;
      }
    }
    return null;
  }

  private checkNode(node: CampaignNode): boolean {
    if (WorldBossHelper.checkWorldBoss(this.mapId)) {
      if (
        node &&
        node.info &&
        node.info.types == CampaignNodeType.WORLD_BOSS_NOT_PASS
      ) {
        if (node.info.state != NodeState.DESTROYED) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 取得当前可以攻击的, 最近的一个节点
   *
   */
  public getToAttackNode(): CampaignNode {
    let node: CampaignNode = this.dieNodeSearch();
    if (!node) node = this.startNodeSearch();
    return node;
  }

  /**
   *
   * @returns 找地图内传送点
   */
  public getNearTransportNode(): Array<CampaignNode> {
    let transPortArr: Array<CampaignNode> = [];
    for (const key in this._mapNodesData) {
      let element = this._mapNodesData[key];
      if (element.info.types == CampaignNodeType.TRANSFER) {
        transPortArr.push(element);
      }
    }
    return transPortArr;
  }

  /**
   *
   * @returns 跨地图传送点
   */
  public getCrossMapTransportNode(): Array<CampaignNode> {
    let transPortArr: Array<CampaignNode> = [];
    for (const key in this._mapNodesData) {
      let element = this._mapNodesData[key];
      if (element.info.types == PosType.COPY_MAP_SEND) {
        transPortArr.push(element);
      }
    }
    return transPortArr;
  }

  /**
   * 从被消灭的点开始寻下一个节点。
   *
   */
  private dieNodeSearch(): CampaignNode {
    let dieNode: CampaignNode = this.getMapNodesById(this._currentDieNodeId);
    if (dieNode) {
      if (dieNode.info.state == NodeState.EXIST) return dieNode;
      return this.getMapNodesByNodeIds(dieNode.nextNodeIds);
    }
    return null;
  }
  /**
   *从起点开始寻下一个节点
   */
  private startNodeSearch(): CampaignNode {
    let start: CampaignNode = this.mapNodeStartPoint;
    if (!start) return null;
    let node: CampaignNode = this.searchNodeByNodeId(start.nextNodeIds);
    return node;
  }
  /**
   * 随机得到一个节点
   * @param nodeIds 所有节点id
   * @return CampaignNode
   *
   */
  public getMapNodesByNodeIds(nodeIds: string): CampaignNode {
    let arr: any[] = nodeIds.split(",");
    let randomIndex: number = parseInt((Math.random() * arr.length).toString());
    let nodeId: number = parseInt(arr[randomIndex].toString());
    return this.getMapNodeByNodeId(nodeId);
  }
  /**
   *  掉落宝箱
   * @param signId
   * @return
   *
   */
  public getNodeBySindId(signId: string): CampaignNode {
    for (const key in this._mapNodesData) {
      let element = this._mapNodesData[key];
      if (element.info instanceof ChestInfo) {
        if ((<ChestInfo>element.info).signId == signId) return element;
      }
    }
    return null;
  }

  /**
   * 根据nodeId查询
   * @param nodeId
   * @return CampaignNode
   *
   */
  public getMapNodeByNodeId(nodeId: number): CampaignNode {
    for (const key in this._mapNodesData) {
      let element = this._mapNodesData[key];
      if (element.nodeId == nodeId) return element;
    }
    return null;
  }
  /**
   * 查询节点 如果查询的节点不是 NodeState.EXIST状态则会继续遍历下一个节点
   * @param ids 节点id 多个节点以“,”分隔
   * @return CampaignNode
   *
   */
  private searchNodeByNodeId(ids: string): CampaignNode {
    let arr: any[] = ids.split(",");
    for (let i: number = 0; i < arr.length; i++) {
      let node: CampaignNode = this.getMapNodeByNodeId(arr[i]);
      if (node && node.info.state != NodeState.EXIST) {
        if (node.nextNodeIds != "" && node.nextNodeIds != null)
          node = this.searchNodeByNodeId(node.nextNodeIds);
      }
      if (node && node.info.state == NodeState.EXIST) return node;
    }
    return null;
  }
  /**
   * 根据id查找node
   * @param id CampaignNode.info.id
   * @return CampaignNode
   *
   */
  public getMapNodesById(id: number): CampaignNode {
    for (const key in this._mapNodesData) {
      let node: CampaignNode = this._mapNodesData[key];
      if (node.info.id == id) {
        return node;
      }
    }
    return null;
  }
  /**
   * 移除节点
   * @param node
   *
   */
  public removeMapNodeByInfo(node: MapPhysics) {
    let index: number = this._mapNodesData.indexOf(node);
    if (index >= 0) this._mapNodesData.splice(index, 1);
  }
  /**
   * 检查节点通行
   * @param arr
   *
   */
  public checkNodesPass(arr: any[]): any[] {
    if (!arr) return null;
    let pass: any[] = [];
    let pos: string;
    let myPattern: RegExp = /_/;
    do {
      pos = arr.shift();
      pos = pos.replace(myPattern, ",");
      pass.push(pos);
    } while (this.checkNodePass(pos) && arr.length > 0);
    if (arr.length > 0) pass.push(arr.shift());
    return pass;
  }

  private checkNodePass(pos: string): boolean {
    for (const key in this._mapNodesData) {
      const element = this._mapNodesData[key];
      if (pos == element.posX + "," + element.posY) {
        if (
          element.info.state == NodeState.FRIENDLY ||
          element.info.state == NodeState.DESTROYED
        )
          return true;
        break;
      }
    }
    return false;
  }

  private _checkTempPoint: Laya.Point = new Laya.Point();
  private _checkNodePoint: Laya.Point = new Laya.Point();
  public getNotHandlerNodeByXY($x: number, $y: number): CampaignNode {
    //取得指定点周围的非事件点
    $x = parseInt($x.toString());
    $y = parseInt($y.toString());
    this._checkTempPoint.x = $x;
    this._checkTempPoint.y = $y;
    let selfArmy: CampaignArmy = this.selfMemberData;
    if (!selfArmy) return null;
    let selfTeamId: number = selfArmy.teamId;
    for (const key in this._mapNodesData) {
      if (Object.prototype.hasOwnProperty.call(this._mapNodesData, key)) {
        let element = this._mapNodesData[key];
        let attackDis: number = 2;
        if (attackDis < element.handlerRange) {
          attackDis = element.handlerRange;
        }
        this._checkNodePoint.x = element.posX;
        this._checkNodePoint.y = element.posY;
        switch (element.info.types) {
          case PosType.COPY_HANDLER:
          case PosType.FALL_CHEST:
          case PosType.COLLECTION:
          case PosType.COPY_MAP_SEND:
          case PosType.COPY_NODE_SEND:
          case PosType.COPY_START:
          case PosType.TRANSPORT_CAR:
          case PosType.TOWER_DEFENCE:
          case PosType.COPY_NODE_SEND2:
          case PosType.HOOK_NODE:
          case PosType.MINERAL_CAR:
          case PosType.PET_BOSS_MONSTER:
            continue;
            break;
          case PosType.COPY_NPC:
            if (element.attackTypes == 1) {
              if (WorldBossHelper.checkPvp(this.mapId)) continue;
              this._checkNodePoint.x = Math.floor(
                element.nodeView.x / Tiles.WIDTH
              );
              this._checkNodePoint.y = Math.floor(
                element.nodeView.y / Tiles.HEIGHT
              );
              if (element.info.state == NodeState.FIGHTING) break;
            } else {
              if (
                WorldBossHelper.checkConsortiaDemon(this.mapId) ||
                WorldBossHelper.checkConsortiaBoss(this.mapId)
              ) {
                if (element.info.state == NodeState.FIGHTING) continue;
                this._checkNodePoint.x = Math.floor(
                  element.nodeView.x / Tiles.WIDTH
                );
                this._checkNodePoint.y = Math.floor(
                  element.nodeView.y / Tiles.HEIGHT
                );
              }
            }
            if (element.param1 > 0 && element.param1 == selfTeamId) continue;
            if (CampaignArmyState.checkDied(this.selfMemberData.isDie))
              continue;
            break;
          case PosType.ATTACK_HANDLER: //TODO
            if (
              WorldBossHelper.checkPvp(this.mapId) &&
              this.selfMemberData.teamId != element.param1
            )
              continue;
            break;
          case PosType.DIE_CROSSING:
            if (
              selfTeamId == element.param1 &&
              CampaignArmyState.checkDied(this.selfMemberData.isDie)
            )
              break;
            continue;
            break;
          case PosType.ENEMY_CROSSING:
            if (selfTeamId == element.param1) continue;
            break;
          case PosType.BOMBER_MAN:
            if (
              selfTeamId == element.param1 ||
              element.info.state == NodeState.FIGHTING
            )
              continue;
            this._checkNodePoint.x = Math.floor(
              element.nodeView.x / Tiles.WIDTH
            );
            this._checkNodePoint.y = Math.floor(
              element.nodeView.y / Tiles.HEIGHT
            );
            break;
          case PosType.TREASURE_HUNTER:
            if (element.info.state == NodeState.FIGHTING) continue;
            break;
        }

        let leng: number = this._checkTempPoint.distance(
          this._checkNodePoint.x,
          this._checkNodePoint.y
        );
        if (leng <= attackDis) {
          let tempElement = this.checkPassNode(element);
          if (tempElement) {
            // Logger.info("[CampaignMapModel]取得指定点周围的非事件点")
            return tempElement;
          }
          continue;
        }
      }
    }
    return null;
  }

  public getHandlerNode($x: number, $y: number): CampaignNode {
    //取得指定点附近的事件节点及掉落点
    $x = parseInt($x.toString());
    $y = parseInt($y.toString());
    this._checkTempPoint.x = $x;
    this._checkTempPoint.y = $y;
    let dis: number = 0;
    let nodes = [];
    for (const key in this._mapNodesData) {
      if (Object.prototype.hasOwnProperty.call(this._mapNodesData, key)) {
        let tempElement = this._mapNodesData[key];
        switch (tempElement.info.types) {
          case PosType.COLLECTION:
            if (
              !WorldBossHelper.checkPvp(this.mapId) ||
              WorldBossHelper.checkConsortiaBoss(this.mapId)
            )
              continue;
            if (this.onCollectionId == tempElement.nodeId) continue;
          case PosType.COPY_HANDLER:
          case PosType.COPY_NODE_SEND:
          case PosType.COPY_NODE_SEND2:
          case PosType.COPY_MAP_SEND:
          case PosType.FALL_CHEST:
          case PosType.HOOK_NODE:
            if (
              WorldBossHelper.checkPetLand(this.mapId) &&
              tempElement.info.types == PosType.COPY_HANDLER
            ) {
              continue; //单独处理
            }
            this._checkNodePoint.x = tempElement.posX;
            this._checkNodePoint.y = tempElement.posY;
            dis = this._checkTempPoint.distance(
              this._checkNodePoint.x,
              this._checkNodePoint.y
            );
            // 战场拉矿防拉扯
            if (
              WorldBossHelper.checkPvp(this.mapId) &&
              tempElement.sonType == BuildSonType.SONTYPE_2380
            ) {
              if (dis <= tempElement.handlerRange) {
                let checkNode = this.checkPassNode(tempElement);
                if (checkNode) {
                  nodes.push(checkNode);
                }
              }
            } else {
              if (dis <= tempElement.handlerRange + 2) {
                let checkNode = this.checkPassNode(tempElement);
                if (checkNode) {
                  return checkNode;
                }
              }
            }
            break;
        }
      }
    }

    // Logger.xjy("[CampaignMapModel]getHandlerNode", nodes)
    // 离指定点最近的点
    if (nodes.length > 0) {
      let minLenNode;
      nodes.forEach((node) => {
        if (!minLenNode) {
          minLenNode = node;
        } else {
          let disNew = this._checkTempPoint.distance(node.posX, node.posY);
          let disMin = this._checkTempPoint.distance(
            minLenNode.posX,
            minLenNode.posY
          );
          if (disNew < disMin) {
            minLenNode = node;
          }
        }
      });
      Logger.xjy("[CampaignMapModel]getHandlerNode minLenNode", minLenNode);
      return minLenNode;
    }
    return null;
  }
  private checkPassNode(node: CampaignNode): CampaignNode {
    switch (node.info.state) {
      case NodeState.DESTROYED:
      case NodeState.FRIENDLY:
      case NodeState.NONE:
        return null;
    }

    if (this.checkCanNotPassNodeSpecial(node)) return null;

    return node;
  }

  // 特殊情况不检测的点
  private checkCanNotPassNodeSpecial(node: CampaignNode): boolean {
    let mapModel = CampaignManager.Instance.mapModel;
    // 打死残暴血蹄, 重新进游戏 经过该事件点不应该触发
    if (mapModel && WorldBossHelper.checkIsNoviceMapLayer2(mapModel.mapId)) {
      let nodeTemp = mapModel.getMapNodeByNodeId(
        GlobalConfig.CampaignNodeID.Node_1000205
      );
      if (!nodeTemp) return false;
      if (
        node.nodeId == GlobalConfig.CampaignNodeID.Node_1000208 &&
        nodeTemp.info.state == NodeState.DESTROYED
      ) {
        return true;
      }
    }
    return false;
  }

  public chckeNpcFriendState(node: CampaignNode): boolean {
    if (node && node.info && node.info.types == PosType.COPY_NPC) {
      if (node.param1 > 0 && node.param1 == this.selfMemberData.teamId)
        return true;
    }
    return false;
  }
  public getNeighborIII($x: number, $y: number): Laya.Point {
    $x = parseInt($x.toString());
    $y = parseInt($y.toString());
    let i: number = 1;
    while (true) {
      let p: Laya.Point = this.find(i, $x, $y);
      if (p && !this.getMapNodesByPoint(p)) {
        return p;
      }
      i++;
      if (i > 400) {
        break;
      }
    }
    return null;
  }

  public getMapNodesByPoint(p: Laya.Point): CampaignNode {
    let temp: Laya.Point = new Laya.Point(
      p.x * Tiles.WIDTH,
      p.y * Tiles.HEIGHT
    );
    this._mapNodesData.forEach((element) => {
      if (element.x == temp.x && element.y == temp.y) return element;
    });
    return null;
  }

  public getNeighborII($x: number, $y: number): Laya.Point {
    $x = parseInt($x.toString());
    $y = parseInt($y.toString());
    for (let i: number = 1; i < 10; i++) {
      let p: Laya.Point = this.find(i, $x, $y);
      if (p) return p;
    }
    return null;
  }
  private find(i: number, $x: number, $y: number): Laya.Point {
    $x = parseInt($x.toString());
    $y = parseInt($y.toString());
    for (let a: number = -i; a < i; a++) {
      if (this.getPointValue($x + a, $y + i))
        return new Laya.Point($x + a, $y + i);
      if (this.getPointValue($x + a, $y - i))
        return new Laya.Point($x + a, $y - i);
      if (this.getPointValue($x + i, $y + a))
        return new Laya.Point($x + i, $y + a);
      if (this.getPointValue($x - i, $y + a))
        return new Laya.Point($x - i, $y + a);
    }
    return null;
  }

  public getNeighbor($x: number, $y: number): Array<Laya.Point> {
    $x = parseInt($x.toString());
    $y = parseInt($y.toString());
    let arr: Array<Laya.Point> = [];
    if (this.getPointValue($x - Tiles.WIDTH, $y))
      arr.push(new Laya.Point($x - Tiles.WIDTH, $y));
    if (this.getPointValue($x + Tiles.WIDTH, $y))
      arr.push(new Laya.Point($x + Tiles.WIDTH, $y));
    if (this.getPointValue($x, $y - Tiles.HEIGHT))
      arr.push(new Laya.Point($x, $y - Tiles.HEIGHT));
    if (this.getPointValue($x, $y + Tiles.HEIGHT))
      arr.push(new Laya.Point($x, $y + Tiles.HEIGHT));
    return arr;
  }

  public getPointValue($x: number, $y: number): boolean {
    $x = parseInt($x.toString());
    $y = parseInt($y.toString());
    return (
      this.mapTielsData && (this.mapTielsData[$x + "_" + $y] ? true : false)
    );
  }
  public moveArmyToRange(armyId: number, arr: any[]) {
    this.dispatchEvent(CampaignEvent.MOVE_ARMY_TO_RANGE, {
      id: armyId,
      range: arr,
    });
  }

  private _smallMapIcon: string;

  public get smallMapState(): string {
    return this._smallMapIcon;
  }

  public standPos(info: any) {
    this.dispatchEvent(CampaignEvent.STANDPOS, info);
  }

  public moveNpc(msg: any) {
    this.dispatchEvent(CampaignEvent.MOVE_NPC, msg);
  }
  public npcChase(msg: any) {
    this.dispatchEvent(CampaignEvent.NPC_CHASE, msg);
  }
  public set takeCardsMsg(value: any) {
    this.dispatchEvent(CampaignMapEvent.UPDATE_CHEST_INFO, value);
  }

  public movePathsArmy(msg: any) {
    this.dispatchEvent(CampaignMapEvent.MOVE_PATHS_ARMY, msg);
    if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
      let uArmy: CampaignArmy = this.getBaseArmyByArmyId(
        msg.armyId,
        msg.serverName
      );
      if (uArmy) {
        uArmy.curPosX = msg.routes[0].x / 20;
        uArmy.curPosY = msg.routes[0].y / 20;
        uArmy.needInit = true;
      }
    }
  }

  public getNodeById(id: number): DisplayObject {
    for (let index = 0; index < this.mapNodesData.length; index++) {
      const element = this.mapNodesData[index];
      if (element.info.id == id) return element.nodeView;
    }
    return null;
  }

  public getNodeByNodeId(nodeId: number): DisplayObject {
    for (let index = 0; index < this.mapNodesData.length; index++) {
      const element = this.mapNodesData[index];
      if (element.nodeId == nodeId) return element.nodeView;
    }
    return null;
  }

  /**
   * 把军队移动到某个位置 <br/>
   * 派发CampaignMapEvent.GO_TO_POS事件
   * @param msg
   *
   */
  public gotoPosArmy(msg: any) {
    let aInfo: CampaignArmy = this.getBaseArmyByArmyId(
      msg.armyId,
      msg.serverName
    );
    if (
      aInfo &&
      SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE
    ) {
      aInfo.curPosX = msg.curPosX;
      aInfo.curPosY = msg.curPosY;
    }
    this.dispatchEvent(CampaignMapEvent.GO_TO_POS, msg);
  }
  public updateWalkTarget(p: Laya.Point) {
    this.dispatchEvent(CampaignMapEvent.UPDATE_WALK_TARGET, p);
  }

  /** 得到地图的传送点 */
  public getSendNode(): CampaignNode {
    this.mapNodesData.forEach((element) => {
      if (
        element.info.types == PosType.COPY_NODE_SEND ||
        element.info.types == PosType.COPY_END ||
        element.info.types == PosType.COPY_MAP_SEND ||
        element.info.types == PosType.COPY_NODE_SEND2
      )
        return element;
    });
    return null;
  }
  /**
   * 取得己方的组队成员
   * @return
   *
   */
  public getPlayerIds(): any[] {
    let arr: any[] = [];
    this.allBaseArmy.forEach((element) => {
      if (this.selfMemberData.teamId == element.teamId)
        arr.push(element.userId);
    });
    return arr;
  }

  /**
   * 取得紫晶矿场里面的矿车点
   */
  public getMineraCardNode(): CampaignNode {
    for (const key in this._mapNodesData) {
      let element = this._mapNodesData[key];
      if (element && element.nodeId == CampaignMapModel.MINERA_GET_CAR_NODEID) {
        return element;
      }
    }
    return null;
  }

  /**
   * 取得紫金矿场里面的交矿点
   */
  public getMineraHandCardNode(): CampaignNode {
    for (const key in this._mapNodesData) {
      let element = this._mapNodesData[key];
      if (
        element &&
        element.nodeId == CampaignMapModel.MINERA_HAND_CAR_NODEID
      ) {
        return element;
      }
    }
    return null;
  }

  /**
   *
   * @returns 公会BOSS提交物品节点
   */
  public getConsortiaBossGoodsNode(): CampaignNode {
    for (const key in this._mapNodesData) {
      let element = this._mapNodesData[key];
      if (
        element &&
        element.nodeId == CampaignMapModel.CONSORTIA_BOSS_GOODS_NODEID
      ) {
        return element;
      }
    }
    return null;
  }

  public isSingleCampaign() {
    if (this.campaignTemplate && this.campaignTemplate.Capacity == 1) {
      return true;
    }
    return false;
  }

  public static getCampaignCountArr(temp: t_s_campaignData) {
    let leftCnt = 0;
    let maxCnt = 0;
    let curCnt = 0;
    if (!temp) return [leftCnt, maxCnt];

    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    if (temp.SonTypes != 0) {
      if (temp.isKingTower) {
        maxCnt = KingTowerManager.Instance.kingTowerInfo.maxKingCount;
        curCnt = KingTowerManager.Instance.kingTowerInfo.kingCount;
      } else if (temp.isTaila) {
        maxCnt = playerInfo.tailaMaxCount;
        curCnt = maxCnt - playerInfo.tailaCount;
      } else if (temp.isTrailTower) {
        maxCnt = playerInfo.maxTrialCount;
        curCnt = playerInfo.trialCount;
      }
      leftCnt = maxCnt - curCnt;
      if (leftCnt < 0) leftCnt = 0;
    } else {
      maxCnt = playerInfo.multiCopyMaxCount;
      leftCnt = playerInfo.multiCopyCount;
    }

    return [leftCnt, maxCnt];
  }

  public get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public checkOutScene(): boolean {
    let flag: boolean = false;
    let userId = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    let serverName =
      PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
    let campaignArmy: CampaignArmy =
      CampaignManager.Instance.mapModel.getBaseArmyByUserId(userId, serverName);
    let armyView: any =
      CampaignManager.Instance.controller.getArmyView(campaignArmy);
    let xMin = StageReferance.stageWidth / 2;
    let yMin = StageReferance.stageHeight / 2;
    let mapView = CampaignManager.Instance.mapView;
    let xMax = this.mapTempInfo.Width - StageReferance.stageWidth / 2;
    let yMax = this.mapTempInfo.Height - StageReferance.stageHeight / 2;
    let centerX: number = Math.abs(StageReferance.stageWidth / 2 - mapView.x);
    let centerY: number = Math.abs(StageReferance.stageHeight / 2 - mapView.y);
    if (centerX < xMin) {
      centerX = xMin;
    } else if (centerX > xMax) {
      centerX = xMax;
    }
    if (centerY < yMin) {
      centerY = yMin;
    } else if (centerY > yMax) {
      centerY = yMax;
    }
    if (
      Math.abs(armyView.x - centerX) > StageReferance.stageWidth / 2 ||
      Math.abs(armyView.y - centerY) > StageReferance.stageHeight / 2
    ) {
      flag = true;
    }
    return flag;
  }

  public dispose() {
    while (this.staticMovies.length > 0) {
      this.staticMovies.pop();
    }
    super.dispose();
  }
}
