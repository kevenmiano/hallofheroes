import { CampaignMapEvent } from "../../../../constant/event/NotificationEvent";
import { FogGridType } from "../../../../constant/FogGridType";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { CampaignMapModel } from "../../../../mvc/model/CampaignMapModel";
import { StageReferance } from "../../../../roadComponent/pickgliss/toplevel/StageReferance";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { MapData } from "../../../space/data/MapData";

/**
 * 迷雾层
 */

export class FogView extends Laya.Sprite {
    public static unitWidth: number = 110; //150;
    public static unitHeight: number = 86; //113;
    public static offe: number = 110;
    private _bitWidth: number = 0;
    private _bitHeight: number = 0;
    private _mapWidth: number = 0;
    private _mapHeight: number = 0;

    private _maskContainer: Laya.Sprite;
    private _maskDict: Map<string, Laya.Point> = new Map();
    private _maskBitmapData: Laya.Texture;
    private _bitmapContainer: Laya.Sprite;
    private _isUpdatePos: boolean = false;
    private _isUpdateFog: boolean = false;
    private _model: CampaignMapModel;
    private _pool: any[] = [];

    constructor(mapW: number, mapH: number, maskdata: Laya.Texture) {
        super();
        this.name = "Fog";
        this._mapWidth = mapW;
        this._mapHeight = mapH;
        this._model = CampaignManager.Instance.mapModel;
        this._maskBitmapData = maskdata;
        if(maskdata){
            this.initBitmapContainer();
            this.initMask(this._mapWidth, this._mapHeight);
            this.on(Laya.Event.DISPLAY, this, this.__addToStageHandler);
            StageReferance.stage.on(Laya.Event.RESIZE, this, this.__resizeHandler);
            this._model.addEventListener(CampaignMapEvent.SYS_FOG_DATA, this.__sysFogDataHandler, this);
            this._model.addEventListener(CampaignMapEvent.LOCAL_UPDATE_FOG, this.__updateFogDataHandler, this);
            this._model.addEventListener(CampaignMapEvent.SYN_FOG_DATA, this.__synFogHandler, this);
            this.mouseEnabled = false;
        }
    }

    private __resizeHandler(evt: Event) {
        this._isUpdatePos = this._isUpdateFog = true;
        this.upDateNextRend();
    }

    private __sysFogDataHandler(evt: CampaignMapEvent) {
        if (WorldBossHelper.checkFogMap(CampaignManager.Instance.mapModel.mapId)) {
            return;
        }
        var arr: any[] = CampaignManager.Instance.mapModel.fogData;
        if (arr) {
            this.initView(arr);
        }
    }

    private __addToStageHandler(evt: Event) {
        this.__sysFogDataHandler(null);
    }

    private initBitmapContainer() {
        var w: number = CampaignManager.Instance.mapModel.mapTempInfo.Width;
        var h: number = CampaignManager.Instance.mapModel.mapTempInfo.Height;
        if (w <= 0 || h <= 0) {
            return;
        }
        var bpd: Laya.Texture = MapData.fogBitmapDataCache;
        if (!bpd || bpd.width != w || bpd.height != h) {
            if (bpd) {
                bpd = null;
            }
            MapData.fogBitmapDataCache = null;
            var bpdTexture = new Laya.Texture(Laya.Texture2D.blackTexture, null);
            MapData.fogBitmapDataCache = bpdTexture;
            bpd = bpdTexture;
        }
        this._bitmapContainer = new Laya.Sprite();
        this._bitmapContainer.graphics.drawTexture(bpd, 0, 0, w, h);
        this.addChild(this._bitmapContainer);
        this._bitmapContainer.scrollRect = null;
        this._bitmapContainer.filters = null;
        this._isUpdatePos = this._isUpdateFog = true;
        this.upDateNextRend();
    }

    public updateContainerPosX() {
        if (!CampaignManager.Instance.mapView) return

        this._curPoint.x = -CampaignManager.Instance.mapView.x - FogView.offe;
        var tempOff: number = FogView.offe - 14;
        if (this._curPoint.distance(this._prePoint.x, this._prePoint.y) > tempOff) {
            this._isUpdatePos = this._isUpdateFog = true;
            this._prePoint.x = this._curPoint.x;
            this._prePoint.y = this._curPoint.y;
            this.upDateNextRend();
        }
    }

    public updateContainerPosY() {
        if (!CampaignManager.Instance.mapView) return
        
        this._curPoint.y = -CampaignManager.Instance.mapView.y - FogView.offe;
        var tempOff: number = FogView.offe - 14;
        if (this._curPoint.distance(this._prePoint.x, this._prePoint.y) > tempOff) {
            this._isUpdatePos = this._isUpdateFog = true;
            this._prePoint.x = this._curPoint.x;
            this._prePoint.y = this._curPoint.y;
            this.upDateNextRend();
        }
    }

    private upDateNextRend() {
        if (this.stage) {
            if (this._isUpdateFog && this._maskBitmapData) {
                this.draw();
                this._isUpdateFog = false;
            }
        }
    }

    private _displayRect: Laya.Rectangle = new Laya.Rectangle();
    private bpdTexture = new Laya.Texture(Laya.Texture2D.blackTexture, null);
    private _prePoint: Laya.Point = new Laya.Point();
    private _curPoint: Laya.Point = new Laya.Point();

    private draw() {
        if (!CampaignManager.Instance.mapView) return
        
        this._bitmapContainer.graphics.clear()

        var mx: number = -CampaignManager.Instance.mapView.x;
        var my: number = -CampaignManager.Instance.mapView.y;
        // var w: number = CampaignManager.Instance.mapModel.mapTempInfo.Width; //2000
        // var h: number = CampaignManager.Instance.mapModel.mapTempInfo.Height;//2000
        // this._displayRect.x = mx - FogView.offe;
        // this._displayRect.y = my - FogView.offe;
        // this._displayRect.width = w + FogView.offe;
        // this._displayRect.height = h + FogView.offe;
        // this._bitmapContainer.graphics.drawTexture(this.bpdTexture, this._displayRect.x, this._displayRect.y, this._displayRect.width, this._displayRect.height);
        var startX: number = parseInt((mx - this._maskBitmapData.width).toString());
        var startY: number = parseInt((my - this._maskBitmapData.height).toString());
        var endX: number = parseInt((mx + StageReferance.stageWidth + FogView.offe).toString());
        var endY: number = parseInt((my + StageReferance.stageHeight + FogView.offe).toString());
        let count: number = 0;
        var maskItemCount: number = 0;

        // Logger.log("mx=", mx, "my=", my, "w=", w, "h=", h)
        // Logger.log("startX=", startX, "startY=", startY, "endX=", endX, "endY=", endY)
        let values = this._maskDict.values();
        for (let element of values) {
            maskItemCount++;
            if (element.x < startX || element.y < startY || element.x > endX || element.y > endY) {
                continue;
            }
            this._bitmapContainer.graphics.drawTexture(this._maskBitmapData, element.x, element.y);
            count++;
        }
        // Logger.error("迷雾区域itemCount=" + maskItemCount);
        // Logger.error("显示区域itemcount=" + count);
    }

    private initMask(w: number, h: number) {
        var count: number = 0;
        for (var i: number = -FogView.unitWidth; i < w + FogView.unitWidth; i += FogView.unitWidth) {
            count = 0;
            for (var j: number = -FogView.unitHeight; j < h + FogView.unitHeight; j += FogView.unitHeight) {
                count++;
                var p: Laya.Point = new Laya.Point();
                this._maskDict.set(i + "_" + j, p);
                if (count % 2 == 0) {
                    p.x = i;
                }
                else {
                    p.x = i + FogView.unitWidth / 2;
                }
                p.y = j;
                p.x = (p.x - this._maskBitmapData.width / 2);
                p.y = (p.y - this._maskBitmapData.height / 2);
            }
        }
        // Logger.error("initMask w=" + w + "h=" + h, "this._maskDict=", this._maskDict);
        this._isUpdatePos = this._isUpdateFog = true;
        this.upDateNextRend();
    }

    public static sloveFogPoint(posX: number, posY: number): Laya.Point {
        var p: Laya.Point;
        p = new Laya.Point(parseInt((posX + FogView.unitWidth / 2).toString()), parseInt((posY + FogView.unitHeight / 2).toString()));
        var tempY: number = p.y % FogView.unitHeight;
        var vy: number = ((p.y - tempY) / FogView.unitHeight) % 2;
        if (vy != 0) {
            p.x -= FogView.unitWidth / 2;
        }
        p.y = p.y - tempY;
        var tempX: number = p.x % FogView.unitWidth;
        p.x = p.x - tempX;
        return p;
    }

    public checkFogEmpty(vx: number, vy: number): boolean {
        var p: Laya.Point = FogView.sloveFogPoint(vx, vy);
        var bit: Laya.Point = this._maskDict.get(p.x + "_" + p.y) as Laya.Point;
        return Boolean(bit);
    }

    private __updateFogDataHandler(data: any) {
        if (WorldBossHelper.checkMapId(CampaignManager.Instance.mapModel.mapId)) {
            return;
        }
        var obj: any = data;
        this.updatePosImp(new Laya.Point(obj.x, obj.y), obj.vy, obj.type);
    }

    private __synFogHandler(data: any) {
        if (WorldBossHelper.checkFogMap(CampaignManager.Instance.mapModel.mapId)) {
            return;
        }
        var obj: any = data;
        this.updatePos(obj.y * FogView.unitWidth, obj.x * FogView.unitHeight, obj.type);

    }

    private updatePos(posX: number, posY: number, type: number) {
        var p: Laya.Point;
        p = new Laya.Point(parseInt((posX + FogView.unitWidth / 2).toString()), parseInt((posY + FogView.unitHeight / 2).toString()));
        var tempY: number = p.y % FogView.unitHeight;
        var vy: number = ((p.y - tempY) / FogView.unitHeight) % 2;
        if (vy != 0) {
            p.x -= FogView.unitWidth / 2;
        }
        p.y = p.y - tempY;
        var tempX: number = p.x % FogView.unitWidth;
        p.x = p.x - tempX;
        this.updatePosImp(p, vy, type);
    }

    private updatePosImp(p: Laya.Point, vy: number, type: number) {
        this.removeByKey(new Laya.Point(p.x, p.y));
        if (type >= FogGridType.OPEN_TWO) {
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y));
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y));
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth * 2, p.y));
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth * 2, p.y));
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y - FogView.unitHeight * 2));
            this.removeByKey(new Laya.Point(p.x, p.y - FogView.unitHeight * 2));
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y - FogView.unitHeight * 2));
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y + FogView.unitHeight * 2));
            this.removeByKey(new Laya.Point(p.x, p.y + FogView.unitHeight * 2));
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y + FogView.unitHeight * 2));
        }
        if (type >= FogGridType.OPEN_THREE) {
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth * 3, p.y)); //3
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth * 3, p.y));  //3
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y - FogView.unitHeight * 3)); //3
            this.removeByKey(new Laya.Point(p.x, p.y - FogView.unitHeight * 3)); //3
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y - FogView.unitHeight * 3)); //3
            this.removeByKey(new Laya.Point(p.x + 2 * FogView.unitWidth, p.y - FogView.unitHeight * 2)); //3
            this.removeByKey(new Laya.Point(p.x - 2 * FogView.unitWidth, p.y - FogView.unitHeight * 2)); //3
            this.removeByKey(new Laya.Point(p.x + 2 * FogView.unitWidth, p.y + FogView.unitHeight * 2)); //3
            this.removeByKey(new Laya.Point(p.x - 2 * FogView.unitWidth, p.y + FogView.unitHeight * 2)); //3
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y + FogView.unitHeight * 3)); //3
            this.removeByKey(new Laya.Point(p.x, p.y + FogView.unitHeight * 3)); //3
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y + FogView.unitHeight * 3)); //3
        }
        if (type >= FogGridType.OPEN_FOUR) {
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth * 4, p.y)); //4
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth * 4, p.y));  //4
            this.removeByKey(new Laya.Point(p.x, p.y - FogView.unitHeight * 4)); //4
            this.removeByKey(new Laya.Point(p.x, p.y + FogView.unitHeight * 4));  //4
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y - FogView.unitHeight * 4)); //4
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y + FogView.unitHeight * 4));  //4
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y - FogView.unitHeight * 4)); //4
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y + FogView.unitHeight * 4));  //4
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth * 2, p.y - FogView.unitHeight * 4)); //4
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth * 2, p.y + FogView.unitHeight * 4));  //4
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth * 2, p.y - FogView.unitHeight * 4)); //4
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth * 2, p.y + FogView.unitHeight * 4));  //4
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth * 3, p.y - FogView.unitHeight * 2)); //4
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth * 3, p.y + FogView.unitHeight * 2));  //4
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth * 3, p.y - FogView.unitHeight * 2)); //4
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth * 3, p.y + FogView.unitHeight * 2));  //4
        }

        if (vy == 0) {
            this.removeByKey(new Laya.Point(p.x, p.y - FogView.unitHeight));
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y - FogView.unitHeight));
            this.removeByKey(new Laya.Point(p.x, p.y + FogView.unitHeight));
            this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y + FogView.unitHeight));
            if (type >= FogGridType.OPEN_TWO) {
                this.removeByKey(new Laya.Point(p.x - FogView.unitWidth * 2, p.y - FogView.unitHeight));
                this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y - FogView.unitHeight));
                this.removeByKey(new Laya.Point(p.x - FogView.unitWidth * 2, p.y + FogView.unitHeight));
                this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y + FogView.unitHeight));
            }
            if (type >= FogGridType.OPEN_THREE) {
                this.removeByKey(new Laya.Point(p.x - 2 * FogView.unitWidth, p.y - FogView.unitHeight * 3)); //3
                this.removeByKey(new Laya.Point(p.x + 2 * FogView.unitWidth, p.y - FogView.unitHeight)); //3
                this.removeByKey(new Laya.Point(p.x - 3 * FogView.unitWidth, p.y - FogView.unitHeight)); //3
                this.removeByKey(new Laya.Point(p.x + 2 * FogView.unitWidth, p.y + FogView.unitHeight)); //3
                this.removeByKey(new Laya.Point(p.x - 3 * FogView.unitWidth, p.y + FogView.unitHeight)); //3
                this.removeByKey(new Laya.Point(p.x - 2 * FogView.unitWidth, p.y + FogView.unitHeight * 3)); //3
            }
            if (type >= FogGridType.OPEN_FOUR) {
                this.removeByKey(new Laya.Point(p.x - 4 * FogView.unitWidth, p.y - FogView.unitHeight)); //4
                this.removeByKey(new Laya.Point(p.x - 4 * FogView.unitWidth, p.y + FogView.unitHeight)); //4
                this.removeByKey(new Laya.Point(p.x + 3 * FogView.unitWidth, p.y - FogView.unitHeight)); //4
                this.removeByKey(new Laya.Point(p.x + 3 * FogView.unitWidth, p.y + FogView.unitHeight)); //4

                this.removeByKey(new Laya.Point(p.x - 3 * FogView.unitWidth, p.y - FogView.unitHeight * 3)); //4
                this.removeByKey(new Laya.Point(p.x - 3 * FogView.unitWidth, p.y + FogView.unitHeight * 3)); //4
                this.removeByKey(new Laya.Point(p.x + 2 * FogView.unitWidth, p.y - FogView.unitHeight * 3)); //4
                this.removeByKey(new Laya.Point(p.x + 2 * FogView.unitWidth, p.y + FogView.unitHeight * 3)); //4
            }
        } else {
            this.removeByKey(new Laya.Point(p.x, p.y - FogView.unitHeight));
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y - FogView.unitHeight));
            this.removeByKey(new Laya.Point(p.x, p.y + FogView.unitHeight));
            this.removeByKey(new Laya.Point(p.x + FogView.unitWidth, p.y + FogView.unitHeight));
            if (type >= FogGridType.OPEN_TWO) {
                this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y - FogView.unitHeight));
                this.removeByKey(new Laya.Point(p.x + FogView.unitWidth * 2, p.y - FogView.unitHeight));
                this.removeByKey(new Laya.Point(p.x - FogView.unitWidth, p.y + FogView.unitHeight));
                this.removeByKey(new Laya.Point(p.x + FogView.unitWidth * 2, p.y + FogView.unitHeight));
            }
            if (type >= FogGridType.OPEN_THREE) {
                this.removeByKey(new Laya.Point(p.x + 2 * FogView.unitWidth, p.y - FogView.unitHeight * 3)); //3
                this.removeByKey(new Laya.Point(p.x - 2 * FogView.unitWidth, p.y - FogView.unitHeight)); //3
                this.removeByKey(new Laya.Point(p.x + 3 * FogView.unitWidth, p.y - FogView.unitHeight)); //3
                this.removeByKey(new Laya.Point(p.x - 2 * FogView.unitWidth, p.y + FogView.unitHeight)); //3
                this.removeByKey(new Laya.Point(p.x + 3 * FogView.unitWidth, p.y + FogView.unitHeight)); //3
                this.removeByKey(new Laya.Point(p.x + 2 * FogView.unitWidth, p.y + FogView.unitHeight * 3)); //3
            }
            if (type >= FogGridType.OPEN_FOUR) {
                this.removeByKey(new Laya.Point(p.x - 3 * FogView.unitWidth, p.y - FogView.unitHeight)); //4
                this.removeByKey(new Laya.Point(p.x - 3 * FogView.unitWidth, p.y + FogView.unitHeight)); //4
                this.removeByKey(new Laya.Point(p.x + 4 * FogView.unitWidth, p.y - FogView.unitHeight)); //4
                this.removeByKey(new Laya.Point(p.x + 4 * FogView.unitWidth, p.y + FogView.unitHeight)); //4
                this.removeByKey(new Laya.Point(p.x - 2 * FogView.unitWidth, p.y - FogView.unitHeight * 3)); //4
                this.removeByKey(new Laya.Point(p.x - 2 * FogView.unitWidth, p.y + FogView.unitHeight * 3)); //4
                this.removeByKey(new Laya.Point(p.x + 3 * FogView.unitWidth, p.y - FogView.unitHeight * 3)); //4
                this.removeByKey(new Laya.Point(p.x + 3 * FogView.unitWidth, p.y + FogView.unitHeight * 3)); //4
            }
        }
        this.upDateNextRend();
    }

    private removeCount: number = 0;

    private removeByKey(p: Laya.Point) {
        var key: string = (p.x) + "_" + (p.y);
        var point: Laya.Point = this._maskDict.get(key);
        this._maskDict.delete(key);
        if (point) {
            // Logger.error("移除的点key==" + key);
            this.removeCount++;
            // Logger.error("removeCount==" + this.removeCount);
            this._isUpdateFog = true;
            this.clearPoint(point);
        }
    }

    private initView(arr: any[]) {
        for (var i: number = 0; i < arr.length; i++) {
            var temp: any[] = arr[i];
            for (var j: number = 0; j < temp.length; j++) {
                if (temp[j] > 0) {
                    this.updatePos(j * FogView.unitWidth, i * FogView.unitHeight, temp[j]);
                }
            }
        }
    }

    private createBitmap(p: Laya.Point) {
        if (p) {
            var bitmap: Laya.Sprite = this.effectBitmap;
            bitmap.x = p.x;
            bitmap.y = p.y;
            bitmap.alpha = 1;
            this.addChild(bitmap);
            this.createBitmapEffect(bitmap);
        }
        p = null;
    }

    private get effectBitmap(): Laya.Sprite {
        var bit: Laya.Sprite = this._pool.pop();
        if (!bit) {
            bit = new Laya.Sprite();
            bit.graphics.drawTexture(this._maskBitmapData, 0, 0, this._maskBitmapData.width, this._maskBitmapData.height);
        }
        return bit;
    }

    private createBitmapEffect(bit: Laya.Sprite) {
        // if (bit) TweenMax.to(bit, .2, { alpha: 0, onComplete: this.addBitmapPool, onCompleteParams: [bit] });
        if (bit) {
            bit.alpha = 0;
            bit.x = bit.y = 0;
            if (bit.parent) {
                bit.parent.removeChild(bit);
            }
            this._pool.push(bit);
        }
    }

    private addBitmapPool(bit: Laya.Sprite) {

        this._pool.push(bit);
    }

    private clearPoint(p: Laya.Point) {
        this.createBitmap(p);
        p = null;
    }

    public getPointEnable(p: Laya.Point): boolean {
        return true;
    }

    private removeEvent() {
        StageReferance.stage.off(Laya.Event.RESIZE, this, this.__resizeHandler);
        this.off(Laya.Event.DISPLAY, this, this.__addToStageHandler);
        this._model.removeEventListener(CampaignMapEvent.SYS_FOG_DATA, this.__sysFogDataHandler, this);
        this._model.removeEventListener(CampaignMapEvent.LOCAL_UPDATE_FOG, this.__updateFogDataHandler, this);
        this._model.removeEventListener(CampaignMapEvent.SYN_FOG_DATA, this.__synFogHandler, this);
    }

    public dispose() {
        this.removeEvent();
        if (this._maskBitmapData) {
            this._maskBitmapData.destroy();
        }
        this._maskBitmapData = null;
        for (const key in this._pool) {
            let element = this._pool[key];
            if (element.parent) {
                element.parent.removeChild(element);
            }
            element = null;
        }
        this._maskDict = null;
        if (this._bitmapContainer) {
            if (this._bitmapContainer.parent) {
                this._bitmapContainer.parent.removeChild(this._bitmapContainer);
            }
            this._bitmapContainer = null;
        }
        this._bitmapContainer = null;
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}