import Logger from "../../../core/logger/Logger";
import ByteArray from "../../../core/net/ByteArray";
import ResMgr from "../../../core/res/ResMgr";
import { PathManager } from "../../manager/PathManager";
import LoadingSceneWnd from "../../module/loading/LoadingSceneWnd";
import { PreLoadFloorData } from "../campaign/PreLoadFloorData";
import { PreLoadMapData } from "../campaign/PreLoadMapData";
import { MapInfo } from "../space/data/MapInfo";
import { MapData } from "../space/data/MapData";
import { OuterCityManager } from "../../manager/OuterCityManager";

/**
 * @description    预加载大地图数据
 * @author yuanzhan.yu
 * @date 2021/11/16 21:05
 * @ver 1.0
 */
export class PreLoadOuterCityData extends PreLoadMapData {
  private _stepTimeId1: number = 0;
  private _stepTimeId2: number = 0;
  private _stepTimeId3: number = 0;
  // 枚举出每个地图的图片数
  private _mapImgCountDic: object = {
    "1": 27,
    "2": 37,
    "3": 39,
    "4": 84,
    "5": 141,
    "100": 99,
  };
  // 2地图文件+1缩略图
  private _loadPreTotal: number = 3;
  private _loadPreCount: number = 0;
  //
  private _loadTotal: number = 0;

  private _upProView: boolean = false; //更新进度视图
  private _needSaveData: boolean = false;

  constructor(
    model: MapInfo,
    upProView: boolean = true,
    needSaveData: boolean = false,
  ) {
    super(model);

    this._upProView = upProView;
    this._needSaveData = needSaveData;
    let count = this._mapImgCountDic[model.mapTempInfo.MapFileId];
    this._loadTotal = this._loadPreTotal;
    if (count) {
      this._loadTotal += count;
    } else {
      Logger.error("地图图片数未配置");
    }
  }

  protected loadData(): void {
    LoadingSceneWnd.Instance.update(1, "", true);
    this._stepTimeId1 = setTimeout(
      this.loadSteps.bind(this),
      10,
      1,
    ) as unknown as number;
    this._stepTimeId2 = setTimeout(
      this.loadSteps.bind(this),
      100,
      2,
    ) as unknown as number;
    this._stepTimeId3 = setTimeout(
      this.loadSteps.bind(this),
      180,
      3,
    ) as unknown as number;
  }

  private loadSteps(step: number): void {
    let path: string;
    let id: number = this._model.mapTempInfo.MapFileId;
    switch (step) {
      case 1:
        path = PathManager.getOuterCityMapsData(id);
        ResMgr.Instance.onLoadBytes(path, this.__resultMapsInfo.bind(this));
        break;
      case 2:
        path = PathManager.getOuterCityTilesData(id);
        ResMgr.Instance.onLoadBytes(path, this.__resultTilesInfo.bind(this));
      case 3:
        this.loadThunmbnail();
        break;
    }
  }

  private __resultMapsInfo(content: any): void {
    if (!this._model || !content) {
      return;
    }
    try {
      let byte: ByteArray = new ByteArray();
      byte.writeArrayBuffer(content);
      byte.uncompress();
      let para1: Map<string, any>;
      let para2: Map<string, any>;
      let para3: Map<string, any>;
      byte.bytesAvailable && (para1 = byte.readObject());
      byte.bytesAvailable && (para2 = byte.readObject());
      byte.bytesAvailable && (para3 = byte.readObject());
      if (para1) {
        // 动画路径转换 eg: MapMaterial/build/4031.swf -> mapmaterial/build/4031/4031.json
        // floorData TODO
        // topsData TODO
        for (const key in para2) {
          if (para2.hasOwnProperty(key)) {
            const item = para2[key];
            item.forEach((element) => {
              element.url = PathManager.fixCampaignMovieByUrl(element.url);
            });
          }
        }

        this._model.floorData = para1;
        this._model.moviesData = para2;
        this._model.topsData = para3;

        if (OuterCityManager.Instance.loadBeforeEnterScene) {
          OuterCityManager.Instance.floorData = para1;
          OuterCityManager.Instance.moviesData = para2;
          OuterCityManager.Instance.topsData = para3;
        }
      } else {
        this._model.floorData = new Map();
        if (OuterCityManager.Instance.loadBeforeEnterScene) {
          OuterCityManager.Instance.floorData = new Map();
        }
      }
      this.loadPreProgress();
    } catch (error) {
      Logger.log(error);
    }
  }

  private __resultTilesInfo(content: any): void {
    if (!this._model || !content) {
      return;
    }
    try {
      let byte: ByteArray = new ByteArray();
      byte.writeArrayBuffer(content);
      byte.uncompress();
      let dic = byte.readObject();
      this._model.mapTielsData = dic;
      if (OuterCityManager.Instance.loadBeforeEnterScene) {
        OuterCityManager.Instance.mapTielsData = dic;
      }
      this.loadPreProgress();
    } catch (e) {}
  }

  private loadPreProgress(): void {
    if (!this._model) {
      return;
    }

    this._loadPreCount++;
    if (this._upProView) {
      LoadingSceneWnd.Instance.update(
        (this._loadPreCount / this._loadTotal) * 100,
        this._loadPreCount + "/" + this._loadTotal,
        true,
      );
    }
    if (this._loadPreTotal <= this._loadPreCount) {
      clearInterval(this._stepTimeId1);
      clearInterval(this._stepTimeId2);
      clearInterval(this._stepTimeId3);

      let pre: PreLoadFloorData = new PreLoadFloorData(this.loadPro.bind(this));
      pre.load(pre.getMapFloorData(this._model.floorData, this._model.mapId));
    }
  }

  private loadPro(isOver: boolean, cur: number, total: number): void {
    cur = cur + this._loadPreTotal;
    // Logger.info("加载进度", isOver, cur, total, this._loadTotal)
    if (this._upProView) {
      LoadingSceneWnd.Instance.update(
        (cur / this._loadTotal) * 100,
        cur + "/" + this._loadTotal,
        true,
      );
    }
    if (isOver) {
      this.backCall();
    }
  }

  /**
   *  背景马赛克效果实现
   * 加一张小图片, 放大到当前地图的宽高, 贴在地图的最下层
   */
  protected loadThunmbnail() {
    let url: string =
      PathManager.getMapBackPaths(this._model.mapTempInfo.MapFileId) +
      "small.jpg";
    ResMgr.Instance.loadRes(url, (content: Laya.Texture) => {
      if (content) {
        if (this._model && this._model.mapTempInfo) {
          let thumbnail: Laya.Sprite = new Laya.Sprite();
          thumbnail.texture = content;
          thumbnail.width = this._model.mapTempInfo.Width;
          thumbnail.height = this._model.mapTempInfo.Height;
          MapData.thumbnail = thumbnail;
        } else {
          Logger.yyz("👽[reCampaignData] _model不存在:");
          MapData.thumbnail = null;
        }
      } else {
        Logger.yyz(
          "👽没有缩略图:" + (this._model && this._model.mapTempInfo.MapFileId),
        );
        MapData.thumbnail = null;
      }
      this.loadPreProgress();
    });
  }
}
