// @ts-nocheck
import { Disposeable } from "../../../component/DisplayObject";
import { t_s_mapData } from "../../../config/t_s_map";
import { BgModel } from "./BgModel";
import { MapData } from "../data/MapData";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import { BgTileInfo } from "../BgTileInfo";
import { CampaignMapEvent } from "../../../constant/event/NotificationEvent";
import { PathManager } from "../../../manager/PathManager";
import ResMgr from "../../../../core/res/ResMgr";
import Utils from "../../../../core/utils/Utils";
import Logger from "../../../../core/logger/Logger";

/**
 * 分割成贴片的背景对象。<br>
 * 为了减少巨大地图渲染的内存占用, 这个对象主要做了分屏渲染的优化。当背景拖放或者是舞台缩放时渲染的贴片只是渲染用户能看见的区域。
 *
 * @date 2021-7-2 10:19:27
 * @ver 1.0
 * @description
 */
export class BgLayer extends Laya.Sprite implements Disposeable {
    /**
     *地图切片大小
     */
    public static TITLE_SIZE: number = 256;
    private renderMax = 4096;
    protected _bgModel: BgModel;
    private _mapTemplate: t_s_mapData;
    private _currentParent: Laya.Sprite;
    private offlineSprite: Laya.Sprite;
    // private _centerContainer: Laya.Sprite = new Laya.Sprite();
    private bufferTexture: Laya.Texture;

    constructor(parent: Laya.Sprite, mapTemplate: t_s_mapData, floorData: Object, isMapTile: boolean = false) {
        super();
        this.offlineSprite = new Laya.Sprite();
        this._currentParent = parent;
        this._currentParent.addChild(this);
        this._mapTemplate = mapTemplate;
        //remark by yuyuanzhan 紫晶矿场暂时没有256的切图
        if (this._mapTemplate.MapFileId == 30000) {//|| this._mapTemplate.MapFileId == 5201
            this._bgModel = new BgModel(this._mapTemplate.Width, this._mapTemplate.Height, this, this._mapTemplate.Id, this._mapTemplate.MapFileId, 300, false);
        }
        else {
            this._bgModel = new BgModel(this._mapTemplate.Width, this._mapTemplate.Height, this, this._mapTemplate.Id, this._mapTemplate.MapFileId, BgLayer.TITLE_SIZE, isMapTile);
        }
        this.size(this._mapTemplate.Width, this._mapTemplate.Height);
        // this.addChild(this._centerContainer);
        // this._centerContainer.name = "_centerContainer";

        this.init();
        this.initThumbnail();
    }

    private initThumbnail() {
        if (!this.parent) {
            return;
        }

        let thumbnail: Laya.Sprite = MapData.thumbnail;
        //thumbnail对象在UILayer中的removeView方法中destroye了
        if (thumbnail) {
            thumbnail.name = "thumbnail";
            this.parent.addChildAt(thumbnail, 0);
        }
    }

    public setParent(parent: Laya.Sprite) {
        // let ketStr = ""
        // for (let index = 0; index < this._bgModel.loadQueue.length; index++) {
        //     const element = this._bgModel.loadQueue[index];
        //     ketStr += "|" + element.key
        // }
        // Logger.xjy("[BgLayer]setParent", ketStr)

        this._currentParent = parent;
        if (this._currentParent) {
            this._currentParent.addChild(this);
            this.initEvent();
            this.initThumbnail();
        }
    }

    public removeParent() {
        if (this.parent && this._currentParent) {
            this.removeEvent();
            this._currentParent.removeChild(this);
            this._currentParent = null;

        }
    }

    public dragingCallBack(e: Event = null) {
        if ((this.width * this.scaleX) < StageReferance.stageWidth) {
            this.x = 0;
        } else if (this.x < StageReferance.stageWidth - this.width * this.scaleX) {
            this.x = StageReferance.stageWidth - this.width * this.scaleX;
        } else if (this.x > 0) {
            this.x = 0;
        }

        if ((this.height * this.scaleY) < StageReferance.stageHeight) {
            this.y = 0;
        } else if (this.y < StageReferance.stageHeight - this.height * this.scaleY) {
            this.y = StageReferance.stageHeight - this.height * this.scaleY;
        } else if (this.y > 0) {
            this.y = 0;
        }

        this.updateBgViewport();
    }

    public onStageScale() {
        this.scaleX = 1;
        this.scaleY = 1;
        this.dragingCallBack();
    }

    public removeUselessTiles() {
        if (this.destroyed) return;
        // let removeStr = ""
        for (let tx: number = 0; tx < this._bgModel.row; tx++) {
            for (let ty: number = 0; ty < this._bgModel.col; ty++) {
                let tileInfo: BgTileInfo = this._bgModel.getTileInfo(tx, ty);
                if (this._bgModel.loadQueue.indexOf(tileInfo) == -1) { //不在加载队列中
                    // removeStr += "|" + tileInfo.key
                    ResMgr.Instance.cancelLoadByUrl(tileInfo.url);
                    ResMgr.Instance.clearTextureRes(tileInfo.url);
                    tileInfo.url = "";
                    tileInfo.addToParent(false);
                }
            }
        }
        // Logger.xjy("[BgLayer]移除无用的贴片", removeStr)
    }

    protected init() {
        this.initEvent();
        // this.updateBgViewport();
    }


    protected initEvent() {
        if (this._currentParent) {
            this._currentParent.on(CampaignMapEvent.MOVE_SCENET_END, this, this.dragingCallBack);
            StageReferance.stage.on(Laya.Event.RESIZE, this, this.__resizeHandler);
        }
    }
    // 这个对象属性在资源加载回调有操作, 数据不可靠, 修改成局部 let 变量
    // private _count: number = 0;
    /**
     * 加载背景贴片。
     */
    protected loadViewportTiles() {
        let arr: BgTileInfo[] = this._bgModel.loadQueue;
        let _count = 0;
        // Logger.xjy("[BgLayer]loadViewportTiles 加载数量", arr.length, arr)
        for (let tileInfo of arr) {
            let ext = ".jpg";
            // 原生iOS上getRes获取的单张图片, 需要改后缀
            if (Utils.useAstc) {
                ext = ".ktx";
            }
            let url: string = PathManager.getMapBackPaths(tileInfo.mapFileId) + "tile_" + tileInfo.key + ext;

            // Logger.xjy("[BgLayer]加载贴片", tileInfo, url)
            ResMgr.Instance.loadRes(url, (res) => {
                _count++;
                tileInfo.url = url;
                //按每批加载数量渲染
                // if (_count % Laya.loader.maxLoader == 0 && _count != arr.length) {
                //     this.loadAllTitleComplete();
                // }
                // tileInfo.addToParent(true);
                if (_count == arr.length) {
                    // this.removeUselessTiles()
                    this.loadAllTitleComplete();
                }
                // this.renderTitle2(tileInfo, res)
            });
        }

    }

    private loadAllTitleComplete() {
        this.renderTitle();
    }

    //记录已经渲染过的地图块
    private drawedTitles = {};

    private bgSprite: Laya.Sprite[];
    private bgTexture: Laya.Texture[];
    //渲染地图块
    private renderTitle() {
        if (!this._bgModel || !this.offlineSprite) {
            return;
        }

        let allTitles = this._bgModel.tiles as BgTileInfo[][];
        let hasDraw = this.drawTitles(allTitles);

        if (!hasDraw) return;

        if (this._mapTemplate.Width > this.renderMax || this._mapTemplate.Height > this.renderMax) {
            this.handleLargeMap();
        } else {
            this.handleSmallMap();
        }
    }

    private drawTitles(allTitles: BgTileInfo[][]): boolean {
        let hasDraw = false;
        allTitles.some(titles => {
            titles.some(title => {
                if (title.isLoaded && (!this.drawedTitles[title.key])) {
                    let titleView = title.getTitleView();
                    let viewTexture = titleView.texture;
                    if (viewTexture) {
                        this.drawedTitles[title.key] = title;
                        this.offlineSprite.graphics.drawTexture(viewTexture, titleView.x, titleView.y, viewTexture.width, viewTexture.height);
                        hasDraw = true;
                    }
                }
            });
        });
        return hasDraw;
    }

    private handleLargeMap() {
        let cw = this._mapTemplate.Width >> 1;
        let ch = this._mapTemplate.Height >> 1;

        let bufferTextures = [
            this.offlineSprite.drawToTexture(cw, ch, 0, 0) as Laya.Texture,
            this.offlineSprite.drawToTexture(cw, ch, -cw, 0) as Laya.Texture,
            this.offlineSprite.drawToTexture(cw, ch, 0, -ch) as Laya.Texture,
            this.offlineSprite.drawToTexture(cw, ch, -cw, -ch) as Laya.Texture
        ];

        this.initBgSpriteAndTexture(cw, ch);
        this.updateBgSpriteTexture(bufferTextures);
    }

    private handleSmallMap() {
        let bufferTexture = this.offlineSprite.drawToTexture(this._mapTemplate.Width, this._mapTemplate.Height, 0, 0) as Laya.Texture;
        let switchTexture = this.texture;
        this.texture = bufferTexture;
        if (switchTexture) {
            switchTexture.disposeBitmap();
            switchTexture = null;
        }
    }

    private initBgSpriteAndTexture(cw: number, ch: number) {
        if (!this.bgSprite) {
            this.bgSprite = [];
            let positions = [
                { x: 0, y: 0 },
                { x: cw, y: 0 },
                { x: 0, y: ch },
                { x: cw, y: ch }
            ];
            for (let pos of positions) {
                let b = new Laya.Sprite();
                b.x = pos.x;
                b.y = pos.y;
                this.addChild(b);
                this.bgSprite.push(b);
            }
        }

        if (!this.bgTexture) {
            this.bgTexture = [];
        }
    }

    private updateBgSpriteTexture(bufferTextures: Laya.Texture[]) {
        for (let i = 0; i < this.bgSprite.length; i++) {
            let bs = this.bgSprite[i];
            if (bs.texture) bs.texture.disposeBitmap();
            bs.texture = bufferTextures[i];
        }
    }



    //渲染地图块2 网络好的时候性能消耗大, FPS明显降低；网络不好的时候能及时显示, 性能消耗可能会降低。
    private renderTitle2(title: BgTileInfo, texture: Laya.Texture) {
        //加载完后, 有可能已经切换场景,已经dispose了, 此时this._bgModel为null
        if (!this._bgModel)
            return;

        if (!title.isLoaded || this.drawedTitles[title.key]) {
            return
        }
        this.drawedTitles[title.key] = title;
        let titleView: Laya.Sprite = title.getTitleView();
        this.offlineSprite.graphics.drawTexture(texture, titleView.x, titleView.y, texture.width, texture.height);
        let bufferTexture = this.offlineSprite.drawToTexture(this._mapTemplate.Width, this._mapTemplate.Height, 0, 0) as Laya.Texture;
        let switchTexture = this.texture;
        this.texture = bufferTexture;
        if (switchTexture) {
            switchTexture.disposeBitmap();
            switchTexture = null;
        }

    }


    protected removeEvent() {
        if (this._currentParent) {
            this._currentParent.off(CampaignMapEvent.MOVE_SCENET_END, this, this.dragingCallBack);
            StageReferance.stage.off(Laya.Event.RESIZE, this, this.__resizeHandler);
        }
    }

    private __resizeHandler(evt: Event) {
        this.dragingCallBack();
    }

    /**
     * @private
     * 更新背景的中心点。 如果中心点有改变则更新覆盖的贴片数组, 重新加载需要显示的贴片。
     *
     */
    protected updateBgView() {
        if (this._bgModel.updateViewportCenterTile()) { //如果中心贴片有变化
            // Logger.info("[BgLayer]中心贴片有变化")
            this._bgModel.updateViewportCoverBounds();
            this._bgModel.updateLoadQueue();
            // this.removeUselessTiles();
            //stopIdleLoad();
            this.loadViewportTiles();

            // this._centerContainer.scrollRect = new Laya.Rectangle(0, 0, Resolution.gameWidth, Resolution.gameHeight)
            // this._centerContainer.filters = [new Laya.BlurFilter(2)];
            // let centerTiles = [];
            // let topLeftTile;
            // for (let keyI in this._bgModel.tiles) {
            //     let arr = this._bgModel.tiles[keyI];
            //     for (let keyJ in arr) {
            //         let tile = arr[keyJ]
            //         if (tile && tile.tileView) {
            //             let tileView = tile.tileView
            //             if (tileView.parent && tileView.visible) {
            //                 centerTiles.push(tile)
            //                 if (!topLeftTile) {
            //                     topLeftTile = tile
            //                 } else {
            //                     if (tile.x < topLeftTile.x) {
            //                         topLeftTile = tile
            //                     }
            //                     if (tile.y < topLeftTile.y) {
            //                         topLeftTile = tile
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }

            // if(topLeftTile){
            //     this._centerContainer.x = topLeftTile.x
            //     this._centerContainer.y = topLeftTile.y
            //     centerTiles.forEach(tile => {
            //         let tileView = tile.tileView
            //         if(tileView){
            //             this._centerContainer.addChild(tileView)
            //             tileView.x = tile.x - topLeftTile.x
            //             tileView.y = tile.y - topLeftTile.y
            //         }
            //     });
            // }
        }
    }

    /**
     * 在舞台缩放或者背景拖动时, 更新背景的视窗。
     *
     */
    protected updateBgViewport() {
        let stagePosition: Laya.Point = new Laya.Point(0, 0); //舞台的位置始终为（0,  0）
        let stageOnBgPosition: Laya.Point = this.globalToLocal(stagePosition);
        this._bgModel.viewport.x = stageOnBgPosition.x;
        this._bgModel.viewport.y = stageOnBgPosition.y;
        this._bgModel.viewport.width = StageReferance.stageWidth;
        this._bgModel.viewport.height = StageReferance.stageHeight;
        // Logger.info("[BgLayer]基于整个地图设置视窗大小", this._bgModel.viewport)
        this.updateBgView();
    }

    public forceUpdate(rect: Laya.Rectangle) {
        this._bgModel.viewport.x = rect.x;
        this._bgModel.viewport.y = rect.y;
        this._bgModel.viewport.width = rect.width;
        this._bgModel.viewport.height = rect.height;
        // Logger.info("[BgLayer]强刷 基于整个地图设置视窗大小", this._bgModel.viewport)
        this.updateBgView();
    }

    public dispose() {
        this.removeEvent();
        // ResMgr.Instance.cancelLoadByUrls(this.loadingUrls);
        this._bgModel.dispose();
        this._bgModel = null;

        if (this.texture) {
            this.texture.disposeBitmap();
            this.texture = null;
        }

        if (this.offlineSprite) {
            this.offlineSprite.graphics.clear();
            this.offlineSprite.graphics.destroy();
            this.offlineSprite.destroy();
            this.offlineSprite = null;
        }

        if (this.bgSprite) {
            this.bgSprite.forEach(bs => {
                if (bs.texture) {
                    bs.texture.disposeBitmap();
                    bs.texture = null;
                }
            });
            this.bgSprite = null;
        }

        this.bgTexture = null;
    }
}