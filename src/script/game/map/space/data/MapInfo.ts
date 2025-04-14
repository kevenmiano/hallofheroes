import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import Dictionary from "../../../../core/utils/Dictionary";
import { t_s_mapData } from "../../../config/t_s_map";
import { OuterCityEvent } from "../../../constant/event/NotificationEvent";
import Tiles from "../constant/Tiles";
import { TempleteManager } from "../../../manager/TempleteManager";
import Utils from "../../../../core/utils/Utils";

/**
 *  地图数据的基类
 */
export class MapInfo extends GameEventDispatcher {
  public exit: boolean = false;
  public static MAX_WIDTH: number = 5000;
  public static MAX_HEIGHT: number = 5000;

  private _mapId: number = 0; //地图名
  private _aroundPoints: any[] = [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
  ];
  protected _currentSceneFloorData: Dictionary = new Dictionary();

  /*************************public************************/
  public floorData: Map<string, any>; // = new Map();
  public moviesData: Map<string, any>; // = new Map();
  public topsData: Map<string, any>; // = new Map();
  public mapTielsData: Map<string, any>; // = new Map();
  public _targetPoint: Laya.Point; //目标点
  public paths: object;
  private _nodes: object; //城点
  public preLoaderNextMap: boolean;

  constructor() {
    super();
  }

  public get currentSceneFloorData(): Dictionary {
    return this._currentSceneFloorData;
  }

  public set nodes(value: object) {
    this._nodes = value;
  }

  public get nodes(): object {
    return this._nodes;
  }

  public get emptyNodes(): boolean {
    return Boolean(this._nodes);
  }

  /**********************get / set ************************/
  public get targetPoint(): Laya.Point {
    return this._targetPoint;
  }

  public set targetPoint(value: Laya.Point) {
    this._targetPoint = value;
    this.dispatchEvent(OuterCityEvent.CENTER_POINT, value);
  }

  public set mapId(value: number) {
    this._mapId = value;
    this.template = TempleteManager.Instance.getMapTemplatesByID(this._mapId);
  }

  public get mapId(): number {
    return this._mapId;
  }

  public template: t_s_mapData = null;

  public get mapTempInfo(): t_s_mapData {
    return this.template;
  }

  private _reg: RegExp = /,/;

  public getTilesById(id: string): any[] {
    id = id.replace(this._reg, "_");
    if (id.indexOf("data") == -1) {
      id += "data";
    }
    let ext = ".bin";
    return this.mapTielsData[id + ext];
  }

  public aStarPathFinder(
    $start: Laya.Point,
    $end: Laya.Point,
    off: number = 25,
  ): any[] {
    return null;
  }

  public getAroundWalkPoint($x: number, $y: number): Laya.Point {
    $x = Math.floor($x / Tiles.WIDTH);
    $y = Math.floor($y / Tiles.HEIGHT);
    let isWalk: boolean;
    let p: Laya.Point = new Laya.Point(-1, -1);
    let len: number = this._aroundPoints.length;
    for (let i: number = 0; i < len; i++) {
      isWalk = this.getWalkable(
        $x + this._aroundPoints[i].x,
        $y + this._aroundPoints[i].y,
      );
      if (isWalk) {
        p.x = $x + this._aroundPoints[i].x;
        p.y = $y + this._aroundPoints[i].y;
        break;
      }
    }
    if (isWalk) {
      return p;
    }
    return null;
  }

  public walkableValueIsPara(para: number, $x: number, $y: number): boolean {
    $x = Math.floor($x);
    $y = Math.floor($y);
    return this.mapTielsData[$x + "_" + $y] == para ? true : false;
  }

  public getWalkable($x: number, $y: number): boolean {
    $x = Math.floor($x);
    $y = Math.floor($y);
    return this.mapTielsData[$x + "_" + $y] ? true : false;
  }

  /**
   * 是否为阻挡
   * @param $x
   * @param $y
   * @return
   *
   */
  public isBarrier($x: number, $y: number): boolean {
    $x = Math.floor($x);
    $y = Math.floor($y);
    return this.mapTielsData[$x + "_" + $y] == 2;
  }

  public dispose() {
    this.floorData = null;
    this.moviesData = null;
    this.topsData = null;
    this._nodes = null;
    this.paths = null;
    this._mapId = 0;
    this.template = null;
    this._currentSceneFloorData = null;
  }
}
