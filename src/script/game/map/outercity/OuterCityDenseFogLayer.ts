import {
  FreedomTeamEvent,
  OuterCityEvent,
  SpaceEvent,
} from "../../constant/event/NotificationEvent";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { BaseCastle } from "../../datas/template/BaseCastle";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { BaseArmy } from "../space/data/BaseArmy";
import { OuterCityModel } from "./OuterCityModel";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { OuterCityMap } from "./OuterCityMap";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { FilterFrameText } from "../../component/FilterFrameText";

import Sprite = Laya.Sprite;
import { WildLand } from "../data/WildLand";
import TreasureInfo from "../data/TreasureInfo";
import Tiles from "../space/constant/Tiles";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import Dictionary from "../../../core/utils/Dictionary";
import OutercityVehicleArmyView from "../campaign/view/physics/OutercityVehicleArmyView";

/**
 * @description  外城迷雾层
 * @author yuanzhan.yu
 * @date 2021/11/17 19:05
 * @ver 1.0
 */

export class OuterCityDenseFogLayerGrid {
  public get coordinateX(): number {
    return Math.floor(this.x / this.w);
  }
  public get coordinateY(): number {
    return Math.floor(this.y / this.h);
  }
  public x: number = 0;
  public y: number = 0;
  public w: number = 300;
  public h: number = 300;
  /**
   * 格子索引从左到右 从上到下 从0开始
   */
  private _gridIndex: number = 0;
  public set gridIndex(value: number) {
    this._gridIndex = value;
    if (this.txtGridIdx) {
      this.txtGridIdx.text = value.toString();
    }
  }
  public get gridIndex(): number {
    return this._gridIndex;
  }
  // 保持一份引用
  public fogList: Sprite[] = [];
  public parent: OuterCityDenseFogLayer;
  // 雾的粒子大小
  public FOG_SIZE: number = 320;
  public FOG_GAP: number = 100;
  public txtGridIdx: FilterFrameText;

  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    parent: OuterCityDenseFogLayer,
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.parent = parent;

    // let txtGridIdx = new FilterFrameText(100, 20, undefined, 12, "#ff0000");
    // txtGridIdx.pos(x + this.FOG_SIZE / 2, y + this.FOG_SIZE / 2 - 16)
    // txtGridIdx.name = "txtGridIdx"
    // this.parent.addChild(txtGridIdx);
    // txtGridIdx.zOrder = 999
  }

  public initFogList() {
    this.fogList = [];
    let rowCnt = this.h / this.FOG_GAP;
    let cowCnt = this.w / this.FOG_GAP;
    for (let row = 0; row < rowCnt; row++) {
      for (let cow = 0; cow < cowCnt; cow++) {
        // TODO 优化 可以用一个Sprite绘制出来
        let node = Laya.Pool.getItemByClass("Sprite", Sprite);
        node.name = (row * rowCnt + cow).toString();
        this.parent.addChild(node);
        node.alpha = 0.5;
        this.showNode(node, true);
        node.loadImage("res/game/outercity/asset.outercity.FogMaskAsset.png");
        this.fogList.push(node);
        node.x = this.x + cow * this.FOG_GAP;
        node.y = this.y + row * this.FOG_GAP;

        // let txt = new FilterFrameText(100, 20, undefined, 12);
        // txt.pos(this.FOG_SIZE / 2, this.FOG_SIZE / 2 - 16)
        // txt.name = "txt"
        // node.addChild(txt);
        // txt.text = node.name

        // let txtPos = new FilterFrameText(100, 20, undefined, 10);
        // txtPos.pos(this.FOG_SIZE / 2, this.FOG_SIZE / 2 + 0)
        // txtPos.name = "txtPos"
        // node.addChild(txtPos);
        // txtPos.text = "(" + node.x + "\n," + node.y + ")"
      }
    }
  }

  public removeFogList() {
    this.fogList.forEach((node: Sprite) => {
      Laya.Pool.recover("Sprite", node);
      node.removeSelf();
    });
    this.fogList = [];
  }

  public showNode(node: Sprite, visible: boolean) {
    node.visible = visible;
    // node.alpha = visible ? 1 : 0.4
  }

  public get key(): string {
    return this.coordinateX.toString() + "_" + this.coordinateX.toString();
  }
}

export class OuterCityDenseFogLayer extends Sprite implements IEnterFrame {
  private GRID_WIDTH: number = 300;
  private GRID_HEIGHT: number = 300;
  /**
   * 人物、自己城堡的可视范围
   */
  public static FOV: number = 850;
  /**
   * 需要绘制格子数目
   */
  private RENDER_GRID_COW_CNT = 10;
  private RENDER_GRID_ROW_CNT = 6;
  /**
   *
   */
  private mapWidth: number = 0;
  private mapHeight: number = 0;
  // 被拆分的总行
  private gridRow: number = 0;
  // 被拆分的总列
  private gridCow: number = 0;
  // 待绘制的所有格子
  private gridMap: Map<string, OuterCityDenseFogLayerGrid> = new Map<
    string,
    OuterCityDenseFogLayerGrid
  >();
  private centerGrid: OuterCityDenseFogLayerGrid;
  // 拥有视野的对象点集合
  private fovObjList: Laya.Point[] = [];
  private selfCastlePos: Laya.Point;
  private _hasOccupyCastle: Array<BaseCastle>;
  private allCastlePosArr: Array<Laya.Point>;
  private allMinePosArr: Array<Laya.Point>;
  private allTreasurePosArr: Array<Laya.Point>;
  private target: OuterCityMap;
  private _model: OuterCityModel;

  /**
   * 刷新的速度限制
   */
  private tickCount: number = 0;
  private _refreshCount = 8;
  public set refreshCount(type: number) {
    if (type == 1) {
      this._refreshCount = 8;
    } else {
      this._refreshCount = 1;
    }
  }

  constructor(_mapW: number, _mapH: number, _target: OuterCityMap) {
    super();
    this.mapWidth = _mapW;
    this.mapHeight = _mapH;
    this.target = _target;
    this.gridRow = Math.ceil(this.mapHeight / this.GRID_HEIGHT);
    this.gridCow = Math.ceil(this.mapWidth / this.GRID_WIDTH);
    this.alpha = 0.7;
    this.init();
    this.addTreasureHole(this.playerModel.currentMinerals);
  }

  private init(): void {
    this._model = OuterCityManager.Instance.model;
    this.mouseEnabled = false;
    this.addEvent();
    this.updateCastleOccpuy();
  }

  private addEvent(): void {
    EnterFrameManager.Instance.registeEnterFrame(this);
    this._model.addEventListener(
      OuterCityEvent.LAY_MAP_ARMY,
      this.__layMapArmyHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.ADD_DENSEFOG_BY_BUILD,
      this.addBuildHole,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.ADD_DENSEFOG_BY_MINE,
      this.addMineHole,
      this,
    );
    NotificationManager.Instance.addEventListener(
      SpaceEvent.HIDE_OTHERS,
      this.onTeamDismiss,
      this,
    );
    NotificationManager.Instance.addEventListener(
      FreedomTeamEvent.TEAM_INFO_SYNC,
      this.__syncTeamInfoHandler,
      this,
    );
    OuterCityManager.Instance.model.addEventListener(
      OuterCityEvent.REMOVE_ARMY,
      this.onRemoveArmy,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.SELF_CASTLE,
      this.addSelfBuildHole,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.CASTLE_INFO,
      this.updateCastleOccpuy,
      this,
    );
  }

  private removeEvent(): void {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    this._model.removeEventListener(
      OuterCityEvent.LAY_MAP_ARMY,
      this.__layMapArmyHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.ADD_DENSEFOG_BY_BUILD,
      this.addBuildHole,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.ADD_DENSEFOG_BY_MINE,
      this.addMineHole,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      SpaceEvent.HIDE_OTHERS,
      this.onTeamDismiss,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      FreedomTeamEvent.TEAM_INFO_SYNC,
      this.__syncTeamInfoHandler,
      this,
    );
    OuterCityManager.Instance.model.removeEventListener(
      OuterCityEvent.REMOVE_ARMY,
      this.onRemoveArmy,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.SELF_CASTLE,
      this.addSelfBuildHole,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.CASTLE_INFO,
      this.updateCastleOccpuy,
      this,
    );
  }

  enterFrame(): void {
    // 检测队友 城堡的视野
    this.tickCount++;
    if (this.tickCount >= this._refreshCount) {
      this.tickCount = 0;
      // Logger.xjy("刷新速度: ", this._refreshCount)

      this.fovObjList = [];
      // 自己城堡
      if (this.selfCastlePos) {
        this.fovObjList.push(
          new Laya.Point(this.selfCastlePos.x, this.selfCastlePos.y),
        );
      }
      if (this._hasOccupyCastle && this._hasOccupyCastle.length > 0) {
        for (let i: number = 0; i < this._hasOccupyCastle.length; i++) {
          let item: BaseCastle = this._hasOccupyCastle[i];
          this.fovObjList.push(new Laya.Point(item.x, item.y));
        }
      }
      for (const key in this._model.allVehicleViewDic) {
        let army: OutercityVehicleArmyView = this._model.allVehicleViewDic[key];
        let point: Laya.Point = new Laya.Point(
          army.wildInfo.movePosX * 20,
          army.wildInfo.movePosY * 20,
        );
        let selfVehicle: OutercityVehicleArmyView =
          OuterCityManager.Instance.model.getSelfVehicle();
        if (selfVehicle && selfVehicle.wildInfo.templateId == parseInt(key)) {
          this.fovObjList.push(point);
        }
      }
      for (const key in this._model.allArmyDict) {
        if (this._model.allArmyDict.hasOwnProperty(key)) {
          // 计算 fovObjList 玩家自己、玩家队友

          let army: BaseArmy = this._model.allArmyDict[key];
          if (army.userId == this.playerInfo.userId && army.armyView) {
            // Logger.xjy("玩家坐标点: ", army.armyView.x, army.armyView.y)
            this.fovObjList.push(
              new Laya.Point(army.armyView.x, army.armyView.y),
            );
          } else {
            let teamModel = FreedomTeamManager.Instance.model;
            if (
              teamModel &&
              army.armyView &&
              teamModel.getMemberByUserId(army.userId) &&
              FreedomTeamManager.Instance.memberIsOnline(Number(army.userId))
            ) {
              this.fovObjList.push(
                new Laya.Point(army.armyView.x, army.armyView.y),
              );
            }
          }
        }
      }
      this.refreshGrid();
    }
  }

  refreshGrid() {
    let xMin = StageReferance.stageWidth / 2;
    let yMin = StageReferance.stageHeight / 2;
    let xMax = this.mapWidth - StageReferance.stageWidth / 2;
    let yMax = this.mapHeight - StageReferance.stageHeight / 2;
    let centerX: number = Math.abs(
      StageReferance.stageWidth / 2 - this.target.x,
    );
    let centerY: number = Math.abs(
      StageReferance.stageHeight / 2 - this.target.y,
    );

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
    // 中心格子坐标
    if (this.centerGrid) {
      // Logger.xjy("前一时刻中心格子坐标点: ", this.centerGrid.coordinateX, this.centerGrid.coordinateY)
    }
    let centerCoordinateX = Math.floor(centerX / this.GRID_WIDTH);
    let centerCoordinateY = Math.floor(centerY / this.GRID_HEIGHT);
    // Logger.xjy("实时中心格子坐标点: ", centerCoordinateX, centerCoordinateY)

    // 左上角像素坐标
    let topLeftX =
      centerCoordinateX * this.GRID_WIDTH -
      Math.floor(this.RENDER_GRID_COW_CNT / 2) * this.GRID_WIDTH;
    let topLeftY =
      centerCoordinateY * this.GRID_HEIGHT -
      Math.floor(this.RENDER_GRID_ROW_CNT / 2) * this.GRID_HEIGHT;
    // Logger.xjy("左上角坐标点: ", topLeftX, topLeftY)
    // 以屏幕中心为原点取RENDER_GRID_COW_CNT*RENDER_GRID_ROW_CNT个格子
    let keyArr = [];
    if (
      !this.centerGrid ||
      this.centerGrid.coordinateX != centerCoordinateX ||
      this.centerGrid.coordinateY != centerCoordinateY
    ) {
      for (let row = 0; row < this.RENDER_GRID_ROW_CNT; row++) {
        for (let cow = 0; cow < this.RENDER_GRID_COW_CNT; cow++) {
          let key = this.getKey(
            topLeftX + cow * this.GRID_WIDTH,
            topLeftY + row * this.GRID_HEIGHT,
          );
          let grid = this.gridMap.get(key);
          if (!grid) {
            grid = new OuterCityDenseFogLayerGrid(
              topLeftX + cow * this.GRID_WIDTH,
              topLeftY + row * this.GRID_HEIGHT,
              this.GRID_WIDTH,
              this.GRID_HEIGHT,
              this,
            );
            grid.initFogList();
            this.gridMap.set(key, grid);
          }
          if (
            row == Math.floor(this.RENDER_GRID_ROW_CNT / 2) &&
            cow == Math.floor(this.RENDER_GRID_COW_CNT / 2)
          ) {
            this.centerGrid = grid;
          }
          keyArr.push(key);
        }
      }
    }
    // for (let row = 0; row < this.RENDER_GRID_ROW_CNT; row++) {
    //     for (let cow = 0; cow < this.RENDER_GRID_COW_CNT; cow++) {
    //         let key = this.getKey(topLeftX + cow * this.GRID_WIDTH, topLeftY + row * this.GRID_HEIGHT)
    //         let grid = this.gridMap.get(key)
    //         if(grid){
    //             grid.gridIndex = row * this.RENDER_GRID_COW_CNT + cow
    //         }
    //     }
    // }
    if (keyArr.length > 0) {
      this.gridMap.forEach((grid: OuterCityDenseFogLayerGrid, key: string) => {
        if (keyArr.indexOf(key) == -1) {
          grid.removeFogList();
          this.gridMap.delete(key);
        }
      });
    }
    // Logger.xjy("keyArr: ", keyArr, this.gridMap)

    // 开始绘制
    this.gridMap.forEach((grid: OuterCityDenseFogLayerGrid) => {
      for (let index = 0; index < grid.fogList.length; index++) {
        const node: Sprite = grid.fogList[index];
        grid.showNode(node, true);
        // if (OuterCityDenseFogLayer.selfArmy) {
        //     const pt = new Laya.Point(OuterCityDenseFogLayer.selfArmy.armyView.x, OuterCityDenseFogLayer.selfArmy.armyView.y)
        //     let dis = Math.floor(pt.distance(node.x + grid.FOG_SIZE / 2, node.y + grid.FOG_SIZE / 2));

        //     if (node.name != "0") {
        //         (node.getChildByName("txt") as Laya.Label).text = node.name + "-" + dis;
        //     }

        //     if (dis < OuterCityDenseFogLayer.FOV) {
        //         grid.showNode(node,false)
        //     }
        // }

        for (let i = 0; i < this.fovObjList.length; i++) {
          const pt = this.fovObjList[i];
          if (
            pt.distance(
              node.x + grid.FOG_SIZE / 2,
              node.y + grid.FOG_SIZE / 2,
            ) < OuterCityDenseFogLayer.FOV
          ) {
            grid.showNode(node, false);
            break;
          }
        }
      }
    });
  }

  public static get selfArmy() {
    let model = OuterCityManager.Instance.model;
    for (const key in model.allArmyDict) {
      if (model.allArmyDict.hasOwnProperty(key)) {
        let army: BaseArmy = model.allArmyDict[key];
        if (
          army.userId ==
            PlayerManager.Instance.currentPlayerModel.playerInfo.userId &&
          army.armyView
        ) {
          return army;
        }
      }
    }
  }

  private __layMapArmyHandler(arr: any[]): void {
    // for (let i = 0, len = arr.length; i < len; i++) {
    //     const aInfo: UserArmy = arr[i];
    //     if (FreedomTeamManager.Instance.model != null) {
    //         if (FreedomTeamManager.Instance.model.getMemberByUserId(aInfo.userId) != null) {
    //             this.addArmyHole(aInfo.userId, aInfo.armyView.x, aInfo.armyView.y);
    //         }
    //     }
    //     if (aInfo.userId == this.playerInfo.userId) {
    //         this.addArmyHole(aInfo.userId, aInfo.armyView.x, aInfo.armyView.y);
    //     }
    // }
  }

  /**
   * 为人物添加散开的迷雾
   *
   */
  public addArmyHole(userId: number, armyX: number, armyY: number): void {
    // let hole: Sprite = this.holeArmyObj[userId];
    // if (hole == null) {
    //     hole = this.createHole();
    //     // this.holeCon.addChild(hole);
    //     hole.x = armyX - hole.width / 2;
    //     hole.y = armyY - hole.height / 2;
    //     this.holeArmyObj[userId] = hole;
    // }
  }

  private addSelfBuildHole() {
    if (!this.selfCastlePos) {
      this.selfCastlePos = new Laya.Point();
    }
    if (this._model.selfCastles) {
      this.selfCastlePos.x = this._model.selfCastles.x;
      this.selfCastlePos.y = this._model.selfCastles.y;
    }
  }

  private updateCastleOccpuy() {
    this._hasOccupyCastle = [];
    let allCastles: Dictionary = this._model.allCastles;
    if (allCastles == null) {
      return;
    }
    for (const allCastlesKey in allCastles) {
      if (allCastles.hasOwnProperty(allCastlesKey)) {
        let temp: Dictionary = allCastles[allCastlesKey];
        for (const tempKey in temp) {
          if (temp.hasOwnProperty(tempKey)) {
            let castle: BaseCastle = temp[tempKey];
            if (
              castle &&
              castle.defencerGuildName == this.playerInfo.consortiaName
            ) {
              this._hasOccupyCastle.push(castle);
            }
          }
        }
      }
    }
  }
  /**
   * 为所有的城堡添加散开的迷雾
   * @param arr
   */
  private addBuildHole(arr: Array<BaseCastle>): void {
    this.allCastlePosArr = [];
    if (arr) {
      let len: number = arr.length;
      for (let i: number = 0; i < len; i++) {
        let point: Laya.Point = new Laya.Point();
        point.x = arr[i].x;
        point.y = arr[i].y;
        this.allCastlePosArr.push(point);
      }
    }
  }

  /**
   * 为所有的金矿添加散开的迷雾
   */
  private addMineHole(arr: Array<WildLand>) {
    this.allMinePosArr = [];
    if (arr) {
      let len: number = arr.length;
      for (let i: number = 0; i < len; i++) {
        let point: Laya.Point = new Laya.Point();
        point.x = arr[i].x;
        point.y = arr[i].y;
        this.allMinePosArr.push(point);
      }
    }
  }

  private addTreasureHole(arr: Array<TreasureInfo>) {
    this.allTreasurePosArr = [];
    if (arr) {
      let len: number = arr.length;
      for (let i: number = 0; i < len; i++) {
        let point: Laya.Point = new Laya.Point();
        point.x = arr[i].posX * Tiles.WIDTH;
        point.y = arr[i].posY * Tiles.HEIGHT;
        this.allTreasurePosArr.push(point);
      }
    }
  }
  /**
   *
   * 移除屏幕上的部队
   */
  private onRemoveArmy(army: BaseArmy): void {
    // if (army == null) {
    //     return;
    // }
    // let id: number = army.userId;
    // if (this.holeArmyObj[id] == null) {
    //     return;
    // }
    // this.holeArmyObj[id].removeSelf();
    // this.holeArmyObj[id] = null;
  }

  private __syncTeamInfoHandler(): void {
    // for (const id in this.holeArmyObj) {
    //     if (this.holeArmyObj.hasOwnProperty(id)) {
    //         if (!FreedomTeamManager.Instance.memberIsOnline(Number(id))) //如果队友不在线
    //         {
    //             if (this.holeArmyObj[id] == null) {
    //                 return;
    //             }
    //             this.holeArmyObj[id].removeSelf()
    //             this.holeArmyObj[id] = null;
    //         }
    //     }
    // }
  }

  private onTeamDismiss(): void {
    // let hole: Sprite;
    // let baseArmy: BaseArmy;
    // for (const userId in this.holeArmyObj) {
    //     if (this.holeArmyObj.hasOwnProperty(userId)) {
    //         if (userId != this.playerInfo.userId.toString()) {
    //             if (FreedomTeamManager.Instance.model != null) {
    //                 baseArmy = FreedomTeamManager.Instance.model.getMemberByUserId(Number(userId));
    //                 if (baseArmy != null) {
    //                     continue;
    //                 }
    //                 hole = this.holeArmyObj[userId];
    //                 if (hole != null) {
    //                     hole.removeSelf();
    //                     this.holeArmyObj[userId] = null;
    //                 }
    //             }
    //             else {
    //                 hole = this.holeArmyObj[userId];
    //                 if (hole != null) {
    //                     hole.removeSelf();
    //                     this.holeArmyObj[userId] = null;
    //                 }
    //             }
    //         }
    //     }
    // }
    // if (FreedomTeamManager.Instance.model == null) {
    //     return;
    // }
    // let i: number;
    // let allMembers: any[] = FreedomTeamManager.Instance.model.allMembers;
    // for (i = 0; i < allMembers.length; i++) {
    //     baseArmy = allMembers[i];
    //     hole = this.holeArmyObj[baseArmy.userId];
    //     if (hole == null && baseArmy.armyView != null) {
    //         this.addArmyHole(baseArmy.userId, baseArmy.armyView.x, baseArmy.armyView.y);
    //     }
    // }
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public getKey(x: number, y: number): string {
    return (
      Math.floor(x / this.GRID_WIDTH).toString() +
      "_" +
      Math.floor(y / this.GRID_HEIGHT).toString()
    );
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  public dispose(): void {
    if (!this.destroyed) {
      this.removeSelf();
      this.removeEvent();
    }
    Laya.Pool.clearBySign("Sprite");
  }
}
