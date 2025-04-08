// @ts-nocheck
import Logger from "../../../core/logger/Logger";
import ResMgr from "../../../core/res/ResMgr";
import Utils from "../../../core/utils/Utils";
import { Disposeable } from "../../component/DisplayObject";
import { MovieClip } from "../../component/MovieClip";
import { AnimationManager } from "../../manager/AnimationManager";
import { PathManager } from "../../manager/PathManager";

/**
 *  
 * 只有一行的简单avatar <br/>
 * 主要用来显示人物身上的状态 比如战斗 修行 命运守护光环 称号
 * 
 */
export class SimpleAvatarView extends Laya.Sprite implements Disposeable {
    private _url: string;
    public get url(): string {
        return this._url
    }
    private _frameX: number = 0;
    private _frameY: number = 0;
    private _unitWidth: number = 0;
    private _unitHeight: number = 0;
    public get unitWidth(): number {
        return this._unitWidth;
    }
    public get unitHeight(): number {
        return this._unitHeight;
    }
    private _drawFrame: number = 3;
    public set drawFrame(value: number) {
        this._drawFrame = value;
    }

    private _anchorY: number = 0;
    private _viewX: number = 0;
    private _viewY: number = 0;

    private _content: MovieClip = new MovieClip();
    public get content(): MovieClip {
        return this._content;
    }

    /**
     * 
     * @param w 动画宽度 
     * @param h 动画高度 
     * @param url 动画地址
     * @param fx 列数量
     * @param fy 行数量
     */
    constructor(w: number, h: number, url: string, fx: number = 12, fy: number = 1) {
        super()
        this._frameX = fx;
        this._frameY = fy;
        this._url = url;
        this._unitWidth = w;
        this._unitHeight = h;
        this.addChild(this._content);
        this.load()
    }

    private load() {
        ResMgr.Instance.loadRes(this._url, (res) => {
            if (!res) {
                if (this._url == PathManager.fightStatePath) {
                    Logger.warn("战斗状态资源加载失败")
                }
                return
            }
            this.__onResComplete(res)
        }, null, Laya.Loader.IMAGE)
    }

    private __onResComplete(res: any) {
        let cacheName = this._url
        if (Utils.useAstc) {
            if (this._url.includes(".png")) {
                cacheName = this._url.replace(".png", ".ktx");
            }
            else if (this._url.includes(".jpg")) {
                cacheName = this._url.replace(".jpg", ".ktx");
            }
        }

        if (!AnimationManager.Instance.getCache(cacheName)) {
            AnimationManager.Instance.createAnimationWithTexture(cacheName, cacheName, this._frameX, this._frameY, this._unitWidth, this._unitHeight)
        }
        this._content.play(0, true, cacheName);
    }

    public draw(loop: boolean = true) {
        // let startIdx = this.drawFrame;
        // this._content.play(0, loop, this._url)
    }

    public set x(value: number) {
        if (this._viewX == value) {
            return;
        }
        this._viewX = value;
        super.x = this._viewX;
    }

    public get x(): number {
        return super.x;
    }

    public set y(value: number) {
        if (this._viewY == value) {
            return;
        }
        this._viewY = value;
        super.y = this._viewY;
    }

    public get y(): number {
        return super.y;
    }

    private _data: any
    public set data(value: any) {
        this._data = value;
    }

    public get data(): any {
        return this._data;
    }

    public dispose() {
        ResMgr.Instance.cancelLoadByUrl(this._url);
        this.removeSelf()
    }
}