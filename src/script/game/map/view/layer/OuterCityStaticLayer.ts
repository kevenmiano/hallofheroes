import Dictionary from "../../../../core/utils/Dictionary";
import { OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { CampaignManager } from "../../../manager/CampaignManager";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import ComponentSetting from "../../../utils/ComponentSetting";
import { SimpleMapLayer } from "../../campaign/view/layer/SimpleMapLayer";
import { MapElmsLibrary } from "../../libray/MapElmsLibrary";
import { FloorMapInfo } from "../../space/data/FloorMapInfo";
import { MapData } from "../../space/data/MapData";
import { MapInfo } from "../../space/data/MapInfo";
import SpaceManager from "../../space/SpaceManager";
import { MapBackgroundView } from "./MapBackgroundView";

/**
 * @description    渲染大地图用 每次只渲染当前部分
 * @author yuanzhan.yu
 * @date 2021/10/26 16:37
 * @ver 1.0
 */
export class OuterCityStaticLayer extends SimpleMapLayer {
    private _initBackground: boolean = true;
    private _background: MapBackgroundView;
    private _floorBitmap: Laya.Sprite;
    private _isFirst: boolean = true;
    public static drawOff: number = 100;
    private _isOldMap: boolean = false;
    private _firstTimeId: number = 0;

    constructor() {
        super();

        this._background = new MapBackgroundView();
        this.addChildAt(this._background, 0);
        this._floorBitmap = new Laya.Sprite();
        this.addChild(this._floorBitmap);
        this.__resizeHandler(null);
        this.scrollRect = null;
    }

    public get floorBitmap(): Laya.Sprite {
        return this._floorBitmap;
    }

    private __resizeHandler(evt) {
        this._isOldMap = false;
        if (StageReferance.stageWidth <= MapData.stageWidth && StageReferance.stageHeight <= MapData.stageHeight) {
            let oModel: MapInfo = CampaignManager.Instance.mapModel;
            if (!oModel) {
                oModel = SpaceManager.Instance.model;
            }
            if (oModel && MapData.mapId == oModel.mapId && MapData.mapBitmap && this.checkPointEquit(oModel.targetPoint, MapData.movePos)) {
                this._isOldMap = true;
                this._floorBitmap = MapData.mapBitmap;
            }
            else {
                // this._floorBitmap.graphics.drawTexture(null, 0, 0, StageReferance.stageWidth + OuterCityStaticLayer.drawOff * 2, StageReferance.stageHeight + OuterCityStaticLayer.drawOff * 2, null, 1, "#FF0000");
                this._floorBitmap.size(StageReferance.stageWidth + OuterCityStaticLayer.drawOff * 2, StageReferance.stageHeight + OuterCityStaticLayer.drawOff * 2);
            }
        }
        else {
            // this._floorBitmap.graphics.drawTexture(null, 0, 0, StageReferance.stageWidth + OuterCityStaticLayer.drawOff * 2, StageReferance.stageHeight + OuterCityStaticLayer.drawOff * 2, null, 1, "#FF0000");
            this._floorBitmap.size(StageReferance.stageWidth + OuterCityStaticLayer.drawOff * 2, StageReferance.stageHeight + OuterCityStaticLayer.drawOff * 2);
        }
        if (!this._isOldMap) {
            MapData.clearData();
        }

        this._floorBitmap.scrollRect = null;

    }

    private checkPointEquit(p1: Laya.Point, p2: Laya.Point): boolean {
        if (p1 && p2 && p1.x == p2.x && p1.y == p2.y) {
            return true;
        }
        return false;
    }

    public set mapData(data: MapInfo) {
        this._model = data as FloorMapInfo;
        this._model.addEventListener(OuterCityEvent.CURRENT_CONFIG_CHANGE, this.__currentConfigChange, this);
    }

    private __currentConfigChange(evt: OuterCityEvent) {
        this.upDateNextRend();
    }

    public upDateNextRend() {
        if (this._firstTimeId > 0) {
            clearInterval(this._firstTimeId);
        }
        this._firstTimeId = 0;
        if (this._isFirst) {
            this._firstTimeId = setInterval(this.upDateNextRend.bind(this), 500);
            this._isFirst = false;
            return;
        }
        if (this.stage) {
            Laya.timer.callLater(this, this.__onScreenRend);
        }
    }

    private __onScreenRend(evt: Laya.Event) {
        this.draw();
    }

    private draw() {
        this._count++;
        if (this._count == 1 && this._isOldMap) {
            this.drawBackground();
            return;
        }

        if (!this._model || !this._model.currentSceneFloorData) {
            return;
        }

        let dic: Dictionary = this._model.currentSceneFloorData;
        let rect: Laya.Rectangle = new Laya.Rectangle(0, 0, this._floorBitmap.width, this._floorBitmap.height);
        let point: Laya.Point = new Laya.Point();
        // this._floorBitmap.graphics.clear(true);
        // this._floorBitmap.graphics.drawRect(rect.x, rect.y, rect.width, rect.height, 0x00000000);
        let range: number[] = this.getLayerIndexRange();
        let buffer: Laya.Sprite = new Laya.Sprite();
        // this._floorBitmap.removeChildren();
        for (let i = 0, len = range.length; i < len; i++)//地图的层次 从102 至...
        {
            const index = range[i];
            for (const key in dic)//piece 为 1000X1000的区域
            {
                if (dic.hasOwnProperty(key)) {
                    let piece: any = dic[key];
                    let arr: any[] = piece.floor[index]; //这块区域中这一层的所有元素
                    let start: Laya.Point = piece.start;
                    if (arr) {
                        for (const key in arr) {
                            if (arr.hasOwnProperty(key)) {
                                let info: any = arr[key];
                                let bit: Laya.Texture = MapElmsLibrary.Instance.getElementByPath(ComponentSetting.RES_ANIMATION + info.url);
                                if (bit) {
                                    point.x = start.x + (info.x % 1000) + (this.parent as Laya.Sprite).x + OuterCityStaticLayer.drawOff;
                                    point.y = start.y + (info.y % 1000) + (this.parent as Laya.Sprite).y + OuterCityStaticLayer.drawOff;
                                    rect.width = bit.width;
                                    rect.height = bit.height;                                  
                                    buffer.graphics.drawTexture(bit, point.x, point.y, rect.width, rect.height);                                  
                                }
                            }
                        }
                    }
                }
            }

        }
        
        let bufferTexture = buffer.drawToTexture(StageReferance.stageWidth + OuterCityStaticLayer.drawOff * 2, StageReferance.stageHeight + OuterCityStaticLayer.drawOff * 2, 0, 0) as Laya.Texture;
        let switchTexture = this._floorBitmap.texture;
        this._floorBitmap.texture = bufferTexture;
        if (switchTexture) {
            switchTexture.disposeBitmap();
            switchTexture = null;
        }
        this.drawBackground();
        this._floorBitmap.x = -(this.parent as Laya.Sprite).x - OuterCityStaticLayer.drawOff;
        this._floorBitmap.y = -(this.parent as Laya.Sprite).y - OuterCityStaticLayer.drawOff;
    }

    private _count: number = 0;

    private getLayerIndexRange(): number[] {
        let dic: Dictionary = this._model.currentSceneFloorData;
        let arr: number[] = [];
        let temp: Dictionary = new Dictionary();
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let obj: any = dic[key];
                let floor: any = obj.floor;
                for (let index in floor) {
                    temp[index] = index;
                }
            }
        }
        for (const key in temp) {
            if (temp.hasOwnProperty(key)) {
                let index: string = temp[key];
                let idx: number = Number(index);
                if (idx >= 102) {
                    arr.push(idx);
                }
            }
        }
        arr.sort(function (v1, v2) {
            return v1 - v2;
        }
        );
        // arr = arr.reverse();
        return arr;
    }


    private drawBackground() {
        let dic: Dictionary = this._model.currentSceneFloorData;
        if (this._initBackground) {
            for (const key in dic) {
                if (dic.hasOwnProperty(key)) {
                    let bg: any = dic[key];
                    let bgArr: any[] = bg.floor[101];
                    if (bgArr) {
                        for (const key in bgArr) {
                            if (bgArr.hasOwnProperty(key)) {
                                let bgInfo: any = bgArr[key];
                                this.initBackground(bgInfo.url);
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    }

    private initBackground(url: string) {
        this._background.mapWidth = this._model.mapTempInfo.Width;
        this._background.mapHeight = this._model.mapTempInfo.Height;
        this._initBackground = false;
        if (this._model.mapTempInfo.Width < MapInfo.MAX_WIDTH) {
            this._background.path = "mapmaterial/floor/new_water/water04.jpg";
        }
        else {
            this._background.path = url;
        }

    }

    public backgroundXandY(vx: number, vy: number) {
        vx = vx - vx % 100;
        vy = vy - vy % 100;
        this._background.x = vx;
        this._background.y = vy;
    }

    public resize() {
        this._background.resize();
        this.__resizeHandler(null);
        this.upDateNextRend();
    }


    public dispose() {
        if (this._floorBitmap) {
            this._floorBitmap.texture.disposeBitmap();
            this._floorBitmap.texture = null;
            this._floorBitmap.removeSelf();
        }
        if (this._model) {
            this._model.removeEventListener(OuterCityEvent.CURRENT_CONFIG_CHANGE, this.__currentConfigChange, this);
        }
        this.off(Laya.Event.RENDER, this, this.__onScreenRend);
        if (this._background) {
            this._background.dispose();
        }
        this._background = null;
        Laya.timer.clearAll(this);
        super.dispose();
    }
}