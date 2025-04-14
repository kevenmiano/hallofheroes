//@ts-expect-error: External dependencies
import { BgTileInfo } from "../BgTileInfo";
import Logger from "../../../../core/logger/Logger";
import { SceneManager } from "../../scene/SceneManager";
import { CampaignManager } from "../../../manager/CampaignManager";
import SceneType from "../../scene/SceneType";
import Tiles from "../constant/Tiles";
import { MapCameraMediator } from "../../../mvc/mediator/MapCameraMediator";

export class BgModel {
  private _row: number;
  private _col: number;
  private _tileSize: number;
  private _tiles: Array<any>;
  public get tiles(): Array<any> {
    return this._tiles;
  }

  private _loadQueue: Array<BgTileInfo>;
  private _viewport: Laya.Rectangle = new Laya.Rectangle();
  private _viewportCenterTile: BgTileInfo;
  private _viewportCoverBounds: Laya.Rectangle;
  private _mapId: number;
  private _mapFileId: number;
  private _mapContainer: Laya.Sprite;

  constructor(
    mapWidth: number,
    mapHeight: number,
    map: Laya.Sprite,
    mapId: number,
    mapFileId: number,
    tileSize: number = 100,
    isMapTile: boolean = false,
  ) {
    this._tileSize = tileSize;
    this._mapContainer = map;
    this._mapId = mapId;
    this._mapFileId = mapFileId;
    this._row = Math.ceil(mapWidth / this._tileSize);
    this._col = Math.ceil(mapHeight / this._tileSize);
    this.initTiles(isMapTile);
  }

  /**
   * 每一个贴片的大小。
   */
  public get tileSize(): number {
    return this._tileSize;
  }

  private initTiles(isMapTile: boolean = false) {
    this._tiles = [];
    for (let tx: number = 0; tx < this._row; tx++) {
      this._tiles.push([]);
      for (let ty: number = 0; ty < this._col; ty++) {
        this._tiles[tx][ty] = new BgTileInfo(
          tx,
          ty,
          this._tileSize,
          this._mapId,
          this._mapFileId,
          this._mapContainer,
          isMapTile,
        );
      }
    }
  }

  /**
   * 视窗大小。
   * <b>其中x和y指的是在背景坐标系的值, 所以有可能需要做坐标转换。<b>
   *
   */
  public get viewport(): Laya.Rectangle {
    return this._viewport;
  }

  /**
   * 加载贴片的队列。
   */
  public get loadQueue(): BgTileInfo[] {
    return this._loadQueue;
  }

  public getTileInfo(tx: number, ty: number): BgTileInfo {
    return this._tiles[tx][ty];
  }

  public get col(): number {
    return this._col;
  }

  public get row(): number {
    return this._row;
  }

  /**
   * 根据中心贴片位置生成贴片的下载队列。队列的规律是从起始位置开始向四周扩散。
   *
   */
  public updateLoadQueue() {
    this._loadQueue = [];

    // this.bfsRound(this._viewportCenterTile, this._viewportCoverBounds, this._loadQueue);
    let beginTile = this.playerTileInfo;
    if (!beginTile) {
      beginTile = this._viewportCenterTile;
    }
    this.bfsRound(beginTile, this._viewportCoverBounds, this._loadQueue);
  }

  /**
   * 更新中心点离视窗中心点最近的背景贴片。
   * @return 返回是否获得了新的中心贴片。
   *
   */
  public updateViewportCenterTile(): boolean {
    let viewportCenterX: number = this._viewport.x + this._viewport.width / 2;
    let viewportCenterY: number = this._viewport.y + this._viewport.height / 2;
    for (let i: number = 0; i < this._tiles.length; i++) {
      let item: BgTileInfo[] = this._tiles[i];
      for (let j: number = 0; j < item.length; j++) {
        if (
          item[j].x <= viewportCenterX &&
          item[j].y <= viewportCenterY &&
          item[j].x + item[j].size >= viewportCenterX &&
          item[j].y + item[j].size >= viewportCenterY
        ) {
          if (item[j] == this._viewportCenterTile) {
            return false;
          }
          this._viewportCenterTile = item[j];
          return true;
        }
      }
    }
    this._viewportCenterTile = null;
    return false;
  }

  /**
   * 更新覆盖当前视窗的贴片范围。
   *
   */
  public updateViewportCoverBounds() {
    //视窗可覆盖的tile最大数
    let coverRow: number = Math.ceil(this._viewport.width / this._tileSize);
    let coverCol: number = Math.ceil(this._viewport.height / this._tileSize);

    // *********************************************************************
    // 覆盖屏幕的tile的tx始终点
    // *********************************************************************
    let leftOffset: number;
    let rightOffset: number;

    if ((coverRow & 1) == 1) {
      //如果是奇数
      leftOffset = rightOffset = (coverRow - 1) / 2;
    } else {
      if (
        this._viewport.x + this._viewport.width / 2 >=
        this._viewportCenterTile.x + this._tileSize / 2
      ) {
        //如果“视窗中心点”在“中心的tile”中位置靠右
        leftOffset = coverRow / 2 - 1;
        rightOffset = coverRow / 2;
      } else {
        leftOffset = coverRow / 2;
        rightOffset = coverRow / 2 - 1;
      }
    }

    let leftTx: number = Math.max(
      this._viewportCenterTile.tx - leftOffset - 1,
      0,
    );
    let rightTx: number = Math.min(
      this._viewportCenterTile.tx + rightOffset + 1,
      this._row - 1,
    );

    // *********************************************************************
    // 覆盖屏幕的tile的ty始终点
    // *********************************************************************
    let topOffset: number;
    let bottomOffset: number;

    if ((coverCol & 1) == 1) {
      //如果是奇数
      topOffset = bottomOffset = (coverCol - 1) / 2;
    } else {
      if (
        this._viewport.y + this._viewport.height / 2 >=
        this._viewportCenterTile.y + this._tileSize / 2
      ) {
        //如果“视窗中心点”在“中心的tile”中位置靠下
        topOffset = coverCol / 2 - 1;
        bottomOffset = coverCol / 2;
      } else {
        topOffset = coverCol / 2;
        bottomOffset = coverCol / 2 - 1;
      }
    }
    let topTy: number = Math.max(
      this._viewportCenterTile.ty - topOffset - 1,
      0,
    );
    let bottomTy: number = Math.min(
      this._viewportCenterTile.ty + bottomOffset + 1,
      this._col - 1,
    );
    let boundWidth: number = rightTx - leftTx + 1;
    let boundHeight: number = bottomTy - topTy + 1;
    this._viewportCoverBounds = new Laya.Rectangle(
      leftTx,
      topTy,
      boundWidth,
      boundHeight,
    );

    // Logger.info("[BgModel]leftTx=" + leftTx + ", topTy=" + topTy + ", boundWidth=" + boundWidth + ", boundHeight=" + boundHeight, this._viewportCoverBounds);
  }

  /**
   * 广度优先搜索邻居贴片。
   * @param bgTileModel 开始的节点
   * @param bgModel
   * @param ret 生成的搜索顺序列表
   *
   */
  public bfsRound(bgTileModel: BgTileInfo, bounds: Laya.Rectangle, ret: any[]) {
    let unvisited: any[] = [];
    unvisited.push(bgTileModel);

    while (unvisited.length > 0) {
      bgTileModel = unvisited.shift();
      ret.push(bgTileModel);

      let nTiles: any[] = this.getRoundTiles(bgTileModel, bounds);
      for (let i: number = 0; i < nTiles.length; i++) {
        let nTile: BgTileInfo = nTiles[i];

        if (-1 == ret.indexOf(nTile) && -1 == unvisited.indexOf(nTile)) {
          unvisited.push(nTile);
        }
      }
    }

    // Logger.xjy("[BgModel]bfsRound", bgTileModel.tx, bgTileModel.ty, ret)
  }

  /**
   * 获得指定贴片的周边的贴片数组, 数组长度小于或者等于8。遍历顺序如下:
   * <table>
   * <tr><td>5</td><td>3</td><td>6</td>
   * <tr><td>1</td><td>x</td><td>2</td>
   * <tr><td>8</td><td>4</td><td>7</td>
   * </table>
   */
  public getRoundTiles(bgTileModel: BgTileInfo, bounds: Laya.Rectangle): any[] {
    let ret: any[] = [];
    let nearOffset: any[] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ];
    for (let i: number = 0; i < nearOffset.length; i++) {
      let ox: number = bgTileModel.tx + nearOffset[i][0];
      let oy: number = bgTileModel.ty + nearOffset[i][1];

      if (
        ox >= bounds.x &&
        ox < bounds.right &&
        oy >= bounds.y &&
        oy < bounds.bottom
      ) {
        //边界检查
        ret.push(this._tiles[ox][oy]);
      }
    }
    return ret;
  }

  public get playerTileInfo(): BgTileInfo {
    let bgTileInfo: BgTileInfo;
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      if (MapCameraMediator.isLockCamera) {
        // Logger.info("[BgModel]拖动地图中, 更新视图采用屏幕中间点")
        return null;
      }

      let mapModel = CampaignManager.Instance.mapModel;
      if (mapModel && mapModel.selfMemberData) {
        let posX = mapModel.selfMemberData.curPosX * Tiles.WIDTH;
        let posY = mapModel.selfMemberData.curPosY * Tiles.HEIGHT;

        let tx = Math.floor(posX / this._tileSize);
        let ty = Math.floor(posY / this._tileSize);
        let arr = this._tiles[tx];
        if (arr) {
          bgTileInfo = this._tiles[tx][ty];
        }
      }
    } else if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      // let mapModel = SpaceManager.Instance.model
      // if (mapModel) {
      //     let tx = mapModel.selfArmy.curPosX
      //     let ty = mapModel.selfArmy.curPosY
      //     bgTileInfo = this.getTileInfo(tx, ty)
      // }
    }

    return bgTileInfo;
  }

  public dispose() {
    for (let keyI in this._tiles) {
      let arr = this._tiles[keyI];
      for (let keyJ in arr) {
        let tile = arr[keyJ] as BgTileInfo;
        if (tile) {
          tile.dispose();
        }
      }
    }
    this._tiles = null;
    this._loadQueue = null;
    this._viewport = null;
    this._viewportCenterTile = null;
    this._viewportCoverBounds = null;
  }
}
