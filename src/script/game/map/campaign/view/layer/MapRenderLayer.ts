// @ts-nocheck
import { ArrayConstant, ArrayUtils } from "../../../../../core/utils/ArrayUtils";
import { PathManager } from "../../../../manager/PathManager";
import { MapElmsLibrary } from "../../../libray/MapElmsLibrary";
import { MapData } from "../../../space/data/MapData";
import Logger from '../../../../../core/logger/Logger';

export class MapRenderLayer {
    private _bitmap: Laya.Sprite;//Image
    private _displayBitmap: Laya.Sprite;
    private _currentParent: Laya.Sprite;

    constructor(currentParent: Laya.Sprite, width: number, height: number) {
        this._currentParent = currentParent;
        this._bitmap = new Laya.Sprite();
        this._bitmap.name = "MapRenderLayer_bitmap";
        this._bitmap.width = width;
        this._bitmap.height = height;
        this._currentParent.addChild(this._bitmap);
    }

    public addChild(child: Laya.Sprite): Laya.Sprite {
        this._currentParent.addChild(child);
        return child;
    }

    public get bitmap(): Laya.Sprite {
        return this._bitmap;
    }

    public get displayBitmap(): Laya.Sprite {
        return this._displayBitmap;
    }

    private _data: Map<string, any>;
    private _indexArray: any[];
    private _backUrl: string = "";
    public set backUrl(value: string) {
        this._backUrl = value;
    }

    public set data(value: Map<string, any>) {
        this._data = value;
        if (this._backUrl == "") {
            this.getBackId(value);
        }
        this.initRender(value);
    }

    private initRender(value: Map<string, any>) {
        //fixme why not
        // if (CampaignManager.Instance.mapModel) {
        // 	if (CampaignManager.Instance.mapModel.mapTempInfo.Id == MapData.mapId && MapData.mapBitmap) {
        // 		this.resetBitmap();
        // 		return;
        // 	}
        // }
        MapData.clearData();
        this._indexArray = [];
        for (const key1 in value) {
            const element1 = value[key1];
            for (const key2 in element1) {
                const element2 = element1[key2];
                this._indexArray = this._indexArray.concat(element2);
            }
        }
        this._indexArray = ArrayUtils.sortOn(this._indexArray, ["baseNum"], [ArrayConstant.NUMERIC]);
        this.render();
    }

    private resetBitmap() {
        if (this._bitmap) {
            if (this._bitmap.parent) {
                this._bitmap.parent.removeChild(this._bitmap);
            }
            if (this._bitmap.texture) {
                this._bitmap.graphics.clear(true);
            }
        }
        this._bitmap = MapData.mapBitmap;
        this.addChild(this._bitmap);
    }

    private getBackId(data: Map<string, any>) {
        let bitData: Laya.Texture;
        for (const key1 in data) {
            const element1 = data[key1];
            for (const key2 in element1) {
                const element2 = element1[key2];
                for (const key3 in element2) {
                    const element3 = element2[key3];
                    if (!this._backUrl && element3["baseNum"] == 101) {
                        this._backUrl = element3["url"];
                        bitData = this.getBitmapDataById(this._backUrl);
                        if (bitData) {
                            break;
                        }
                    }
                }
            }
            if (bitData) {
                break;
            }
        }
    }

    private _elmsData: MapElmsLibrary;

    public set elmsDatas(value: MapElmsLibrary) {
        this._elmsData = value;
    }

    protected _renderMatrix: Laya.Matrix = new Laya.Matrix();
    private rotateCount: number = 0;

    private render() {
        let obj: any;
        let tempBitamapData: Laya.Texture;
        let renderRect: Laya.Rectangle = new Laya.Rectangle();
        let renderPoint: Laya.Point = new Laya.Point();
        this._bitmap.graphics.clear(true);
        this.drawBack();
        for (let i: number = 0; i < this._indexArray.length; i++) {
            obj = this._indexArray[i];
            if (obj["baseNum"] <= 101) {
                continue;
            }
            tempBitamapData = this.getBitmapDataById(obj.url);
            if (!tempBitamapData) {
                continue;
            }
            if (obj.rotation == 0) {
                renderPoint.x = obj.x;
                renderPoint.y = obj.y;
                renderRect.width = tempBitamapData.width;
                renderRect.height = tempBitamapData.height;
                try {
                    this._bitmap.graphics.drawTexture(tempBitamapData, renderPoint.x, renderPoint.y, renderRect.width, renderRect.height);
                } catch (error) {
                    Logger.error(error);
                }
            }
            else {
                this._renderMatrix.identity();
                this.rotateCount++;
                this._renderMatrix.translate(0, 0);
                if (obj.rotation != 0) {
                    this._renderMatrix.rotate(obj.rotation / 180 * 3.14159);
                }
                this._renderMatrix.translate(obj.x, obj.y);
                try {
                    this._bitmap.graphics.drawTexture(tempBitamapData, renderPoint.x, renderPoint.y, renderRect.width, renderRect.height, this._renderMatrix);
                } catch (error) {
                    Logger.error(error);
                }
            }
        }
    }

    private drawBack() {
        let renderRect: Laya.Rectangle = new Laya.Rectangle();
        let renderPoint: Laya.Point = new Laya.Point();
        let bg: Laya.Texture = this.getBitmapDataById(this._backUrl);
        if (!bg) {
            return;
        }
        renderRect.width = bg.width;
        renderRect.height = bg.height;
        for (let w: number = 0; w < this._bitmap.width; w) {
            for (let h: number = 0; h < this._bitmap.height; h) {
                renderPoint.x = w;
                renderPoint.y = h;
                this._bitmap.graphics.drawTexture(bg, renderPoint.x, renderPoint.y, renderRect.width, renderRect.height);
                h += bg.height;
            }
            w += bg.width;
        }
        renderRect = null;
        renderPoint = null;
        bg = null;
    }

    private getBitmapDataById(id: string): Laya.Texture {
        return this._elmsData.getElementByPath(PathManager.resourcePath + id);
    }

    public dispose() {
        if (this._bitmap) {
            if (this._bitmap.parent) {
                this._bitmap.parent.removeChild(this._bitmap);
            }
        }
        this._bitmap = null;
        this._indexArray = null;
    }
}