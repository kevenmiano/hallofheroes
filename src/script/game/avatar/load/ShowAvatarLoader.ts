import { GameLoadNeedData } from "../../battle/data/GameLoadNeedData";
import { Disposeable } from "../../component/DisplayObject";
import { MovieClip } from "../../component/MovieClip";
import { AnimationManager } from "../../manager/AnimationManager";
import Logger from "../../../core/logger/Logger";
import StringHelper from "../../../core/utils/StringHelper";
import { ResRefCountManager } from "../../managerRes/ResRefCountManager";

export class ShowAvatarLoader extends Laya.Sprite implements Disposeable {
    public first: boolean = false;
    protected _loadComplete: Function;
    protected _fullUrl: string = "";
    public get fullUrl(): string {
        return this._fullUrl;
    }

    protected _content: MovieClip;
    public get content(): MovieClip {
        return this._content;
    }

    private _data: any;
    public set data(data: any) {
        this._data = data;
        if (data instanceof GameLoadNeedData) {
            if (this._fullUrl) {
                ResRefCountManager.clearRes(this._fullUrl)
            }
            this._fullUrl = data.urlPath;
            if (StringHelper.isNullOrEmpty(this._fullUrl)) {
                this._content.visible = false;
                this._content.active = false;
                return;
            }
            Logger.yyz("开始加载角色模型展示资源: ", data.urlPath);
            ResRefCountManager.loadRes(data.urlPath, this.__onResComplete.bind(this), null, Laya.Loader.ATLAS);
        }
    }

    public get data(): any {
        return this._data;
    }


    constructor(callBack: Function) {
        super()
        this._loadComplete = callBack;
        this._content = new MovieClip();
        this.addChild(this._content);
    }

    protected __onResComplete(res: any) {
        if (this.destroyed) return;
        if (!res || !res.meta) {
            Logger.base("角色模型资源不存在！", this._fullUrl);
            this._content.visible = false;
            this._content.active = false;
            return;
        }

        this._content.visible = true;
        this._content.active = true;

        let pre_url = res.meta.prefix;
        this.data.preUrl = pre_url;

        // Logger.log("[ShowAvatarLoader]缓存动画:", cacheName)

        ResRefCountManager.getRes(this._fullUrl)
        if (!AnimationManager.Instance.getCache(pre_url)) {
            AnimationManager.Instance.createAnimation(pre_url, "", undefined, "", AnimationManager.BattleEffectFormatLen)
            ResRefCountManager.setAniCacheName(this._fullUrl, pre_url)
        }

        if (this._content) {
            this._content.data = this._data
            if (res && res.offset) {
                this.pivot(-Math.round(res.offset.footX), -Math.round(res.offset.footY));
            }
            else {
                this.pivot(Math.round(this._content.getBounds().width / 2), Math.round(this._content.getBounds().height / 2));
            }
        }
        this._loadComplete && this._loadComplete(this._data);
    }

    public gotoAndPlay(start: number = 1, loop: boolean = true, aniType: string = "") {
        if (this._content) {
            this._content.gotoAndPlay(start, loop, aniType);
        }
    }

    public dispose() {
        ResRefCountManager.clearRes(this._fullUrl);
        
        this._loadComplete = null;
        this.destroy(true);
    }
}