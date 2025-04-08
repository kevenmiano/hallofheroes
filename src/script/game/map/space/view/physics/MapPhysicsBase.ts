// @ts-nocheck
import ConfigMgr from '../../../../../core/config/ConfigMgr';
import ResMgr from '../../../../../core/res/ResMgr';
import { MovieClip } from "../../../../component/MovieClip";
import { ConfigType } from '../../../../constant/ConfigDefine';
import { OuterCityEvent } from "../../../../constant/event/NotificationEvent";
import { AnimationManager } from "../../../../manager/AnimationManager";
import { NodeState } from "../../constant/NodeState";
import { MapPhysics } from "../../data/MapPhysics";
import IBaseMouseEvent from "../../interfaces/IBaseMouseEvent";
import IBuildingFilter from "../../interfaces/IBuildingFilter";
import IManualTipTargetSize from "../../interfaces/IManualTipTargetSize";
import ISelectMovie from "../../interfaces/ISelectMovie";
import Logger from "../../../../../core/logger/Logger";
import Utils from "../../../../../core/utils/Utils";
import { CampaignNode } from '../../data/CampaignNode';
import HitTestUtils from '../../../../utils/HitTestUtils';
import { CampaignManager } from '../../../../manager/CampaignManager';
import { getMultiLangList, getMultiLangValue } from '../../../../../core/lang/LanguageDefine';

/**
 *
 * 地图上物件的基类 <br/>
 * 宝箱 （PhysicsChestView）和建筑（PhysicsStaticView）继承此类
 */
export class MapPhysicsBase extends Laya.Sprite implements IBaseMouseEvent, IManualTipTargetSize, ISelectMovie {
    protected _isSetHitArea: boolean = false;
    private _info: MapPhysics;
    private _filter: IBuildingFilter;
    private _url: string;
    private _movieContainer: Laya.Sprite;
    private _movie: MovieClip;
    protected _isDispose: boolean;
    private static randomFrame: string = "randomFrame";
    private _frame: Object;
    protected _isPlaying: boolean = true;
    discriminator: string = "I-AM-A";
    IBaseMouseEvent: string = 'IBaseMouseEvent';
    // private _testTip: FilterFrameText = new FilterFrameText(140, 20, undefined, 14);

    private _cacheName: string = "";  //动画缓存名称
    public get cacheName(): string {
        return this._cacheName;
    }
    private _cacheNameMap: Map<string, boolean> = new Map<string, boolean>(); //动画缓存名称
    private _preUrl: string = "";     //动画json中该动画的前缀路径
    private _moviePos: Laya.Point = new Laya.Point();
    private _totalFrames: number = 0;
    img: Laya.Image;
    walkFlag: Laya.Sprite
    footX: number = 0;
    footY: number = 0;

    constructor() {
        super();

        this.autoSize = true;
        this.mouseEnabled = true;
        this.hitTestPrior = true;
        this._movieContainer = new Laya.Sprite();
        this.addChild(this._movieContainer);

        this._movie = new MovieClip();
        this._movieContainer.addChild(this._movie);
        this.scrollRect = null;
        this._isDispose = false;

        // 测试
        // this.img = new Laya.Sprite();
        // this.img.loadImage("res/game/common/blank2.png");
        // this._movieContainer.addChild(this.img)
        // this.img.alpha = 0.4

        // this.walkFlag = new Laya.Sprite();
        // this.walkFlag.loadImage("res/game/common/blank3.png");
        // this._movieContainer.addChild(this.walkFlag)

        // this._testTip.y = 10;
        // this.addChild(this._testTip);
        // this._testTip.zOrder = 999;
    }

    protected initView() {
        this.addEvent();
    }

    protected addEvent() {
        // NotificationManager.Instance.addEventListener(SceneEvent.BLUR_MASK, this.mBlurMask, this);
    }

    protected removeEvent() {
        // NotificationManager.Instance.removeEventListener(SceneEvent.BLUR_MASK, this.mBlurMask, this);
    }

    protected mBlurMask(data: any) {
        // if(data && data.isBlur){
        //     this.filters = [UIFilter.blurFilter];
        // }else{
        //     this.filters = [];
        // }
    }

    private __updateMapPhysicsHandler(evt: OuterCityEvent) {
        this.titleLang = this.info.info.names;
        this.updateView();
    }

    protected updateView() {
        let state: number = this._info.info.state;
        if (state == NodeState.EXIST || state == NodeState.STATE2 || state == NodeState.STATE3) {
            this.initView();
            this.setNomalView();
        }
        else if (state == NodeState.FIGHTING) {
            this.initView();
            this.setFireView();
        }
        else if (state == NodeState.NONE) {
            this.setClearView();
        }
    }

    /**
     * 显示被攻打状态
     */
    protected setFireView() {
        this.setSwf();
    }

    /**
     * 显示普通状态
     */
    protected setNomalView() {
        this.setSwf();
    }

    protected setClearView() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    protected setSwf() {
        let url: string = this.resourcesPath;
        if (url == this._url) {
            this.layouCallBack();
            return;
        }
        this._url = url;
        if (this._url) {
            Logger.yyz("🙈加载场景中的实体对象的资源: ", url);
            ResMgr.Instance.loadRes(this._url, (res) => {
                this.__onResComplete(res);
            }, null, Laya.Loader.ATLAS);
        }
    }

    private __onResComplete(res: any) {
        //_style 的默认值为  SpriteStyle.EMPTY, 只有destory()的时候, 才可能是null。
        if (this._isDispose || !res || !res.meta) {
            return;
        }

        this._totalFrames = Utils.getObjectLength(res.frames);
        this._preUrl = res.meta.prefix
        this._cacheName = this._preUrl
        this._cacheNameMap.set(this._cacheName, true);
        let aniName = ""
        for (const key in res.frames) {
            if (key.match("state")) {
                aniName = "state"
                this._cacheName = this._preUrl + aniName + "1"
                this._cacheNameMap.set(this._cacheName, true);
            }
            break
        }
        //缓存名称带 state1, state2, state3 的动画
        if (aniName != "") {
            for (let index = 1; index <= 3; index++) {
                let success = AnimationManager.Instance.createAnimation(this._preUrl, aniName + index.toString(), 0, undefined, AnimationManager.MapPhysicsFormatLen)
                this._cacheNameMap.set(this._preUrl + aniName + index.toString(), true);
            }
        } else {
            let success = AnimationManager.Instance.createAnimation(this._preUrl, aniName, 0, "", AnimationManager.MapPhysicsFormatLen)
            this._cacheNameMap.set(this._preUrl + aniName, true);
        }

        if (this._frame) {
            this.gotoAndPlayCall(this._frame);
        } else {
            this.gotoAndPlayCall(MapPhysicsBase.randomFrame);
        }


        if (res && res.offset) {
            this.pivot(-Math.round(res.offset.footX), -Math.round(res.offset.footY));
            this.footX = -Math.round(res.offset.footX)
            this.footY = -Math.round(res.offset.footY)

            // this.img.x = this.footX
            // this.img.y = this.footY
        } else {
            this.pivot(Math.round(this._movie.getBounds().width / 2), Math.round(this._movie.getBounds().height / 2));
        }

        //缓存图集中的POS点坐标, 这个点一般作为名称位置, 由于这个点在资源中没有转换, 所以在此转换一下
        if (res && res.offset && res.offset.hasOwnProperty("posX") && res.offset.hasOwnProperty("posY")) {
            this._moviePos.x = Math.floor(res.offset.posX - res.offset.footX);
            this._moviePos.y = Math.floor(res.offset.posY - res.offset.footY);
        }
        // 针对部分没写在资源对应json里面的物体进行偏移
        let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mapnodeoffset, this._preUrl)
        if (temp) {
            let _x = this._movie.x
            let _y = this._movie.y
            this.pivot(-Math.round(_x + temp.offsetX), -Math.round(_y + temp.offsetY));
            // Logger.xjy("[MapPhysicsBase]__onResComplete mapnodeoffset", this._movie.x, this._movie.y)
        }

        // Logger.xjy("[MapPhysicsBase]this._cacheName", this._cacheName)


        if (!this._isPlaying) {
            this.isPlaying = false;
        }
        this.layouCallBack();
    }

    public get sizeInfo() {
        if (this._movie) {
            let tmp = { x: Math.abs(this.pivotX), y: Math.abs(this.pivotY), width: this._movie.getBounds().width, height: this._movie.getBounds().height }
            let aniCahce = AnimationManager.Instance.getCache(this._cacheName)
            if (aniCahce) {
                let graphic = aniCahce[0]
                let tex = graphic["_one"].texture as Laya.Texture
                if (tex) {
                    tmp.width = tex.sourceWidth;
                    tmp.height = tex.sourceHeight;
                }
            }
            return tmp
        }
        return { x: 0, y: 0, width: 100, height: 100 }
    }

    public gotoAndPlayCall(frame: any) {

        this._frame = frame;
        if (this._frame) {
            // Logger.xjy("[MapPhysicsBase]gotoAndPlayCall frame", frame)
        }
        if (this._movie) {
            if (typeof frame == "number") {
                this._movie.gotoAndPlay(frame, true, this._cacheName);
                return;
            } else if (frame == MapPhysicsBase.randomFrame) {
                this._movie.gotoAndStopEX(0, this._cacheName);

                let index = Math.floor(Math.random() * this._totalFrames);
                this._movie.gotoAndPlay(index, true, this._cacheName);
                return;
            } else if (typeof frame == "string" && frame.indexOf("state") != -1) {
                if (this._preUrl.indexOf('2383') != -1) {//公会战】玩家占领神秘塔后并进行防守, 敌方玩家与防守玩家发生战斗后并退出战斗场景后, 神秘塔资源消失了
                    this._movie.gotoAndPlay(0, true, this._preUrl);
                    return;
                }
                this._movie.gotoAndPlay(0, true, this._preUrl + frame);
                return
            } else {
                this._movie.gotoAndPlay(0, true, this._cacheName);
            }
        }
    }

    public getCurrentPixels(point?: Laya.Point): number {
        if (!point) {
            point = new Laya.Point();
        }
        point.x = this.mouseX;
        point.y = this.mouseY;
        return HitTestUtils.hitTestAlpha(this._movie, point);
    }

    public set filter($f: IBuildingFilter) {
        this._filter = $f;
    }

    public get filter(): IBuildingFilter {
        return this._filter;
    }

    //建筑名称多语言
    private _multiLanTitles: Map<string, string> = new Map();

    public set titleLang(value: string) {
        this._multiLanTitles = getMultiLangList(value, this._multiLanTitles);
    }

    public get titleLang(): string {
        let value = getMultiLangValue(this._multiLanTitles);
        return value;
    }

    public set info(value: MapPhysics) {
        if (this._info) {
            this._info.off(OuterCityEvent.UPDATA_MAP_PHYSICS, this.__updateMapPhysicsHandler, this);
        }
        this._info = value;
        this.titleLang = this.info.info.names;
        this.updateView();
        if (this._info) {
            this._info.on(OuterCityEvent.UPDATA_MAP_PHYSICS, this.__updateMapPhysicsHandler, this);
        }

        // this._testTip.text = (value as CampaignNode).nodeId + "," +(value as CampaignNode).nextNodeIds
    }

    public get info(): MapPhysics {
        return this._info;
    }

    public get resourcesPath(): string {
        return "";
    }

    public get movie(): Laya.Sprite {
        return this._movieContainer;
    }

    public get isPlaying(): boolean {
        return this._isPlaying;
    }

    public set isPlaying(value: boolean) {
        this._isPlaying = value;
        if (this._cacheName) {
            if (value) {
                this._movie.play(0, true, this._cacheName);
            } else {
                this._movie.stop();
            }
        }
    }

    protected layouCallBack() {
        if (this.isRemoveStage) {
            return;
        }
    }

    public get moviePos(): any {
        if (!this._movie) {
            return null;
        }
        return this._moviePos;
    }

    public mouseOverHandler(evt: Laya.Event): boolean {
        if (this._filter != null) {
            this._filter.setLightFilter(this._movie);
        }
        return true;
    }

    public mouseOutHandler(evt: Laya.Event): boolean {
        if (this._filter != null) {
            this._filter.setNormalFilter(this._movie);
        }
        return true;
    }

    public mouseClickHandler(evt: Laya.Event): boolean {
        return false;
    }

    public mouseMoveHandler(evt: Laya.Event): boolean {
        return false;
    }

    public isMouseInHandleRangle(evt: any): boolean {
        if (!CampaignManager.Instance.mapModel) {
            return false;
        }
        let mousePt = new Laya.Point(this.mouseX, this.mouseY)
        this.localToGlobal(mousePt, false, (this.parent as Laya.Sprite))
        let handlerRange: number = (<CampaignNode>this.info).handlerRange;

        let selfGridX = parseInt((this.x / 20).toString())
        let selfGridY = parseInt((this.y / 20).toString())
        let mouseGridX = parseInt((mousePt.x / 20).toString())
        let mouseGridY = parseInt((mousePt.y / 20).toString())
        let offX = selfGridX - mouseGridX
        let offY = selfGridY - mouseGridY
        let bNotOutRange = Math.ceil(Math.sqrt(offX * offX + offY * offY)) <= handlerRange
        Logger.xjy("[CampaignNpcPhysics]鼠标是否在触发范围", bNotOutRange,
            "鼠标坐标: " + this.mouseX + "," + this.mouseY,
            "鼠标格子坐标: " + mouseGridX + "," + mouseGridY,
            "物体坐标: " + this.x + "," + this.y,
            "物体格子坐标: " + selfGridX + "," + selfGridY,
            "鼠标离物体距离: " + Math.ceil(Math.sqrt(offX * offX + offY * offY)),
            "配置距离: " + handlerRange);
        return bNotOutRange
    }

    //是否已从舞台删除
    protected get isRemoveStage(): boolean {
        if (!this.moviePos || this._isDispose) {
            return true;
        }
        return false;
    }

    public manualHeight(): number {
        return 90;
    }

    public manualWidth(): number {
        return 60;
    }

    public selectMovie(): Laya.Sprite {
        return this._movieContainer;
    }

    public beginSelectMovie() {

    }

    public resetSelectMovie() {

    }

    public get getMovie(): MovieClip {
        return this._movie;
    }

    public showName(b: boolean) {

    }

    dispose() {
        this.removeEvent()
        this.resetSelectMovie();
        //还在加载列表, 取消加载
        ResMgr.Instance.cancelLoadByUrl(this._url);
        if (this._movieContainer) {
            this._movieContainer.filters = null;
        }
        if (this._info) {
            this._info.removeEventListener(OuterCityEvent.UPDATA_MAP_PHYSICS, this.__updateMapPhysicsHandler, this);
            this._info.nodeView = null;
        }

        this._cacheNameMap.forEach((ele, cacheName) => {
            // Logger.xjy("[MapPhysicsBase]清理动画缓存", cacheName)
            AnimationManager.Instance.clearAnimationByName(cacheName);
        });
        this._cacheNameMap.clear();

        this._isDispose = true;
        this._filter = null;
        this._info = null;
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}
