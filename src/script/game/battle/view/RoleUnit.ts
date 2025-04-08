// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description 战斗场景形象部位加载  只能在战斗场景使用！！！
 **/

import ResMgr from "../../../core/res/ResMgr";
import { MovieClip } from "../../component/MovieClip";
import { NotificationManager } from "../../manager/NotificationManager";
import { ActionLabesType } from "../../constant/BattleDefine";
import { AnimationManager } from "../../manager/AnimationManager";
import { BattleManager } from "../BattleManager";
import Logger from "../../../core/logger/Logger";
import { ResourceModel } from "../data/ResourceModel";

export class RoleUnit extends Laya.Sprite {
    public static LOAD_BATTLERES_COMPLETE = "LOAD_ONE_BATTLERES"

    public completeFunc: Function;
    protected _data: any;
    protected _isPreLoad: boolean = false;
    protected _content: MovieClip = new MovieClip();
    public set content(value: MovieClip) {
        this._content = value;
    }
    public get content(): MovieClip {
        return this._content;
    }

    constructor() {
        super();

        // 测试
        // var img: Laya.Sprite = new Laya.Sprite();
        // img.loadImage("res/game/common/blank2.png");
        // img.pos(0, 0)
        // this.addChild(img)

        this.addChild(this._content);
        this.addEvent()
    }

    protected addEvent() {
        NotificationManager.Instance.addEventListener(RoleUnit.LOAD_BATTLERES_COMPLETE, this.__loadResComplete, this);
    }

    protected removeEvent() {
        NotificationManager.Instance.removeEventListener(RoleUnit.LOAD_BATTLERES_COMPLETE, this.__loadResComplete, this);
    }

    public set data(val: any) {
        if (!val || !val.urlPath) {
            this.content.visible = false;
            return
        }

        if (this._data && this._data.urlPath == val.urlPath) {
            return
        }
        this.content.visible = true;
        this.checkPreload(val);
        if (this._isPreLoad) {
            this._data = val;
            if (ResMgr.Instance.getRes(this._data.urlPath)) {
                this.loadResComplete();
            }
        } else {
            this._data = val;
            ResMgr.Instance.loadRes(val.urlPath, (res) => {
                this.loadResComplete();
            }, null, Laya.Loader.ATLAS);
        }
    }

    public get data(): any {
        return this._data;
    }

    public gotoAndPlay(start?: any, loop?: boolean, aniType?: string) {
        this.content.visible = true;
        this.content.gotoAndPlay(start, loop, aniType);
    }

    protected loadResComplete() {
        if (this.destroyed) {
            return;
        }
        if (!this._data) {
            return;
        }

        let res = ResMgr.Instance.getRes(this._data.urlPath);
        if (!res) {
            this.loadComplete();
            return;
        }

        this._data.preUrl = res.meta.prefix
        this.content.data = this._data

        //设置挂点
        if (res.offset) {
            //读取挂点方式
            this.content.pos_head = new Laya.Point(res.offset.headX, res.offset.headY);
            this.content.pos_body = new Laya.Point(res.offset.bodyX, res.offset.bodyY);
            this.content.pos_leg = new Laya.Point(res.offset.footX, res.offset.footY);
            this.content.shadow = res.offset.shadow;

            // 设置位置
            this.content.pivot(this.content.pos_leg.x, this.content.pos_leg.y)
        }

        this.loadAnimation()
        this.loadComplete();
    }

    protected loadComplete() {
        this.completeFunc && this.completeFunc(this)
    }

    protected loadAnimation() {
        for (const key in ActionLabesType) {
            let aniType = ActionLabesType[key]
            let cacheName = this._data.getCacheName(aniType);
            let success = AnimationManager.Instance.createAnimation(cacheName, "", undefined, undefined, AnimationManager.BattleFormatLen)
            if (success) {
                ResourceModel.roleActionAniNameCache.set(cacheName, true)
            }
        }
    }

    protected checkPreload(data: any) {
        if (this.resourceModel.checkFigureInSilenceLoadList(data && data.urlPath)) {
            // Logger.battle("形象资源不在静默加载资源列表中 需要立即加载", data.urlPath)
            this._isPreLoad = true
        }
    }

    protected __loadResComplete(data: any) {
        if (!this._data || !data) return;
        if (data.url == this._data.urlPath) {
            this.loadResComplete();
        }
    }

    private get resourceModel() {
        return BattleManager.Instance.resourceModel
    }

    public dispose() {
        this.removeEvent();
        this.content.stop();
        this.completeFunc = null;
    }
}