import Logger from "../../../core/logger/Logger";
import ByteArray from "../../../core/net/ByteArray";
import ResMgr from '../../../core/res/ResMgr';
import { PathManager } from "../../manager/PathManager";
import LoadingSceneWnd from '../../module/loading/LoadingSceneWnd';
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { MapData } from "../space/data/MapData";
import { MapInfo } from "../space/data/MapInfo";
import { PreLoadFloorData } from "./PreLoadFloorData";
import { PreLoadMapData } from "./PreLoadMapData";

/**
 * 进入副本预加载数据
 * 加在maps 和titles 地图名称动画文件
 */
export class PreCampaignData extends PreLoadMapData {
    private _loadTotal: number = 3;
    private _loadCount: number = 0;
    private _failCount: number = 0;

    /**
     * 是否是在后台加载.为true时,将不会弹出加载进度窗口.
     */
    private _behindBool: boolean = false;
    private timeId: any = 0;

    constructor(model: MapInfo, behindBool: boolean = false) {
        super(model);
        this._behindBool = behindBool;
    }

    /**
     * 加载maps 和title 文件 地图名称动画
     *
     */
    loadData() {
        if (!this._model) return;

        if (WorldBossHelper.checkSingleBgMap(this._model.mapId)) {
            this.backCall()
        } else {
            if (!this._model.mapTempInfo) return;

            let mapFiledId: number = this._model.mapTempInfo.MapFileId;
            let mapsPath: string = PathManager.getOuterCityMapsData(mapFiledId);
            ResMgr.Instance.onLoadBytes(mapsPath, this.__resultMapsInfo.bind(this));

            let tilesPath: string = PathManager.getOuterCityTilesData(mapFiledId);
            ResMgr.Instance.onLoadBytes(tilesPath, this.__resultTilesInfo.bind(this));

            // let mapNameurl: string = PathManager.mapNameMoviePath(mapFiledId > GlobalConfig.Novice.NewMapID ? GlobalConfig.Novice.OutCityMapID : mapFiledId);
            // ResMgr.Instance.loadRes(mapNameurl, this.__resultMapNameInfo.bind(this));
            this.loadThunmbnail();
            LoadingSceneWnd.Instance.update(1, this._loadCount + "/" + this._loadTotal, true)
        }

    }

    private __resultMapsInfo(content: any, url: string) {
        if (!this._model) {
            return;
        }
        try {
            let para1: Map<string, any>;
            let para2: Map<string, any>;
            let para3: Map<string, any>;
            if (content) {
                let byte: ByteArray = new ByteArray();
                byte.writeArrayBuffer(content);
                byte.uncompress();
                byte.bytesAvailable && (para1 = byte.readObject());
                byte.bytesAvailable && (para2 = byte.readObject());
                byte.bytesAvailable && (para3 = byte.readObject());
            }
            if (para1) {
                this._model.floorData = para1;
                this._model.moviesData = para2;
                this._model.topsData = para3;

                // 动画路径转换 eg: MapMaterial/build/4031.swf -> mapmaterial/build/4031/4031.json
                // floorData TODO
                // topsData TODO
                for (const key in this._model.moviesData) {
                    if (this._model.moviesData.hasOwnProperty(key)) {
                        const item = this._model.moviesData[key];
                        item.forEach(element => {
                            element.url = PathManager.fixCampaignMovieByUrl(element.url);
                        });
                    }
                }
                this.loadProgress();
                Logger.xjy("[PreCampaignData]__resultMapsInfo moviesData=", this._model.moviesData)
            } else {
                Logger.xjy("[PreCampaignData]__resultMapsInfo地图数据出错,重试加载", this._failCount);
                if (this._failCount < 2) {
                    this._failCount++;
                    this.timeId = setTimeout(this.loadImageData.bind(this), 300);
                    return;
                }
                else {
                    this._model.floorData = new Map();
                }
                this.loadProgress();
            }
        } catch (error) {
            Logger.log(error);
        }
    }


    private loadImageData() {
        clearTimeout(this.timeId);
        if (!this._model) {
            return;
        }

        let mapFiledId: number = this._model.mapTempInfo.MapFileId;
        let mapsPath: string = PathManager.getOuterCityMapsData(mapFiledId);
        ResMgr.Instance.onLoadBytes(mapsPath, this.__resultMapsInfo.bind(this));
    }

    private __resultTilesInfo(content: any) {
        if (!this._model) {
            return;
        }
        try {
            let byte: ByteArray = new ByteArray();
            byte.writeArrayBuffer(content);
            byte.uncompress();
            let dic: Map<string, any> = byte.readObject();
            this._model.mapTielsData = dic;
            this.loadProgress();
        }
        catch (error) {
            Logger.error('PreCampaignData   resultTilesInfo 错误!');
        }
    }

    private __resultMapNameInfo(content: any) {
        if (!this._model) {
            return;
        }
        try {
            this.loadProgress();
        }
        catch (error) {
            Logger.error('PreCampaignData   __resultMapNameInfo 错误!');
        }
    }

    private loadProgress() {
        this._loadCount++;
        if (!this._behindBool) {
            LoadingSceneWnd.Instance.update(this._loadCount / this._loadTotal * 100, this._loadCount + "/" + this._loadTotal, true);
        }
        if (this._loadTotal <= this._loadCount) {
            this.backCall()
            // this.loadMoviePro(true, 1, 1);
        }
    }

    /**
     * 废弃: 加载地图用到的png  副本地图除外城现在全部切片由BGLayer动态加载
     * @param isOver
     * @param cur
     * @param total
     *
     */
    private loadMoviePro(isOver: boolean, cur: number, total: number) {
        if (isOver) {
            let pre: PreLoadFloorData = new PreLoadFloorData(this.loadPro.bind(this));
            pre.load(pre.getMapFloorData(this._model.floorData, this._model.mapId));
        }
        if (!this._behindBool) {
            LoadingSceneWnd.Instance.update(cur / total * 22 + 28);
        }
    }

    private loadPro(isOver: boolean, cur: number, total: number) {
        if (!this._behindBool) {
            LoadingSceneWnd.Instance.update(cur / total * 50 + 50);
        }
    }

    /**
     *  背景马赛克效果实现
     * 加一张小图片, 放大到当前地图的宽高, 贴在地图的最下层
     */
    protected loadThunmbnail() {
        let url: string = PathManager.getMapBackPaths(this._model.mapTempInfo.MapFileId) + "small.jpg";
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
                Logger.yyz("👽没有缩略图:" + (this._model && this._model.mapTempInfo.MapFileId));
                MapData.thumbnail = null;
            }
            this.loadProgress();
        });
        // switch (this._model.mapId) {
        //     case 10000:
        //     case 10001:
        //     case 10002:
        //     case 20001:
        //     case 20002:
        //     case 20003:
        //     case 20004:
        //     case 20005:
        //     case 30000:
        //         var url: string = PathManager.getMapBackPaths(this._model.mapTempInfo.Id) + "small.jpg";
        //         ResMgr.Instance.loadRes(url, (content: Laya.Texture) => {
        //             let thumbnail: Laya.Sprite = new Laya.Sprite();//Image
        //             thumbnail.texture = content;
        //             // thumbnail.loadImage(url);
        //             thumbnail.width = this._model.mapTempInfo.Width;
        //             thumbnail.height = this._model.mapTempInfo.Height;
        //             MapData.thumbnail = thumbnail;
        //             this.backCall();
        //         });
        //         break;
        //     default:
        //         MapData.thumbnail = null;
        //         this.backCall();
        //         break;
        // }
    }
}
