/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-03 21:01:49
 * @LastEditTime: 2024-03-29 17:31:08
 * @LastEditors: jeremy.xu
 * @Description: 副本、天空之城形象基类
 */
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { Disposeable } from "../../component/DisplayObject";
import { AvatarResourceType, AvatarTotalFrameX } from "../../constant/AvatarDefine";
import { NotificationManager } from "../../manager/NotificationManager";
import { TempleteManager } from "../../manager/TempleteManager";
import ConfigInfosTempInfo from "../../datas/ConfigInfosTempInfo";
import FUIHelper from "../../utils/FUIHelper";
import { EmPackName } from "../../constant/UIDefine";

export class Avatar extends Laya.Sprite implements Disposeable {
    public static SIZETYPE_CHANGE: string = "sizeTypeChange";

    public static JUMP: number = 1;
    public static ATTACK: number = 2;
    public static STAND: number = 3;
    public static WALK: number = 4;

    protected _state: number = 0;
    private _frameX: number = 0;
    private _frameY: number = -10000;
    private _totalFrameX: number = AvatarTotalFrameX.DEFAULT;
    private _totalFrameY: number = 0;
    public curTotalFrameX: number = AvatarTotalFrameX.DEFAULT;
    protected _body: string;
    protected _mount: string;
    protected _unitWidth: number = 0;
    protected _unitHeight: number = 0;
    protected _face: boolean;//朝向
    protected _drawRect: Laya.Rectangle = new Laya.Rectangle();
    protected _destPoint: Laya.Point = new Laya.Point();
    protected _angle: number = 0;
    protected _npcBodySizeType: number = 1
    protected _translucenceBodySizeType: number = 1

    public parentX: number = 0;
    public parentY: number = 0;

    protected _bitmap: Laya.Sprite;
    protected _footPrintLayer: Laya.Sprite;

    protected _type: number = 0;
    protected _isStop: boolean;
    protected _isRending: boolean = true;
    protected _sizeType: number = 0;
    protected _isInit: boolean;
    protected _cleanBitmapData: boolean = true;
    protected _noShadow: boolean = false;
    protected _showMountShadow: boolean = false;
    protected _isMounting: boolean = false;
    public set isMounting(v: boolean) {
        if (!v) {
            // 下坐骑防止闪现
            this._bitmap && this._bitmap.graphics.clear();
        }
        this._isMounting = v;
    }
    public get isMounting(): boolean {
        return this._isMounting
    }

    protected _translucenceView: fgui.GMovieClip;
    protected _showTranslucenceView: boolean = false;
    public set showTranslucenceView(v: boolean) {
        if (v != this._showTranslucenceView) {
            // 防止闪现
            this._bitmap && this._bitmap.graphics.clear();
        }
        this._showTranslucenceView = v;


        // 方式2
        if (!this._translucenceView) {
            this._translucenceView = FUIHelper.createFUIInstance(EmPackName.BaseCommon, "AvatarTranslucenceMC") as fgui.GMovieClip;
            this.addChild(this._translucenceView.displayObject);
            this._translucenceView.setXY(-50, -124);
        }
        this._translucenceView.playing = v;
        this._translucenceView.visible = v;
        this._translucenceView.displayObject.active = v;

    }
    public get showTranslucenceView(): boolean {
        return this._showTranslucenceView
    }

    /** 飞行高度 */
    protected _flight: number = 0;
    public set flight(v: number) {
        this._flight = v;
    }
    public get flight(): number {
        if (this._showTranslucenceView || this.isMorph) {
            return 0;
        }
        return this._flight;
    }
    /** 名字高度 */
    public showNamePosY: number = 0;
    /** */
    public changeShapeId: number = 0;

    public objName: string = "";

    /** 唯一标志 */
    public _uuid: string = "";
    public set uuid(value: string) {
        this._uuid = value
    }
    public get uuid(): string {
        return this._uuid
    }

    private _currentMountId: number = 0;
    public set currentMountId(value: number) {
        this._currentMountId = value;
    }
    public get currentMountId(): number {
        return this._currentMountId;
    }

    /** 保存每次Avatar大小改变后的高宽 */
    protected aSize: Laya.Point = new Laya.Point();

    // 形象容器的类型、大小、内容偏移
    public static sizeMaxNew: Object = {
        "1": { x: -89, y: -145, width: 178, height: 200, size: 1, sizeType: 1 },
        "2": { x: -185, y: -264, width: 370, height: 339, size: 3, sizeType: 2 },
        "3": { x: -130, y: -205, width: 260, height: 250, size: 2, sizeType: 3 },
        "4": { x: -200, y: -200, width: 400, height: 400, size: 4, sizeType: 4 },
        "5": { x: -250, y: -292, width: 500, height: 417, size: 6, sizeType: 5 },
        "6": { x: -240, y: -270, width: 450, height: 400, size: 5, sizeType: 6 },
        "7": { x: -45, y: -92, width: 90, height: 112, size: -7, sizeType: 7 },//英灵
        "8": { x: -65, y: -117, width: 130, height: 162, size: -6, sizeType: 8 },
        "9": { x: -420, y: -450, width: 740, height: 678, size: 7, sizeType: 9 },
        "10": { x: -377, y: -650, width: 800, height: 1000, size: 8, sizeType: 10 }
    };

    public static sizeMaxOld: Object = {
        "1": { x: -89, y: -145, width: 178, height: 200, size: 1, sizeType: 1 },
        "2": { x: -185, y: -264, width: 370, height: 339, size: 3, sizeType: 2 },
        "3": { x: -130, y: -205, width: 260, height: 250, size: 2, sizeType: 3 },
        "4": { x: -200, y: -200, width: 400, height: 400, size: 4, sizeType: 4 },
        "5": { x: -250, y: -292, width: 500, height: 417, size: 6, sizeType: 5 },
        "6": { x: -240, y: -270, width: 450, height: 400, size: 5, sizeType: 6 },
        "7": { x: -45, y: -92, width: 90, height: 112, size: -7, sizeType: 7 },
        "8": { x: -65, y: -117, width: 130, height: 162, size: -6, sizeType: 8 },
        "9": { x: -332, y: -379, width: 740, height: 678, size: 7, sizeType: 9 },
        "10": { x: -377, y: -650, width: 800, height: 1000, size: 8, sizeType: 10 },
        "11": { x: -110, y: -191, width: 220, height: 247, size: 1.5, sizeType: 11 },
        "12": { x: -120, y: -191, width: 240, height: 247, size: 1.6, sizeType: 12 },
        "13": { x: -165, y: -351, width: 330, height: 371, size: 2.5, sizeType: 13 }
    };

    public get sizeMax(): Object {
        var index: number = Avatar.oldMountId.indexOf(this.currentMountId);
        if (index != -1) {
            return Avatar.sizeMaxOld;
        } else {
            return Avatar.sizeMaxNew;
        }
    }

    public static get oldMountId(): any[] {
        var ret: any[] = [8138, 8098, 8175, 8144, 8132, 8169, 8187, 8168, 8183, 8167, 8188, 8114, 8270, 8329, 8503, 8399, 8516, 8371];
        var con: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("config_9mount_ids");
        if (con && con.ConfigValue) {
            ret = con.ConfigValue.split(",");
            for (var i: number = 0; i < ret.length; i++) {
                ret[i] = Number(ret[i]);
            }
        }
        return ret;
    }
    //老坐骑ID
    //public static oldMountId:any[] = [8138,8098,8175,8144,8132,8169,8187,8168,8183,8167,8299,8300,8263,8329];
    protected static get SizeType_NEW10(): any[] {
        var ret: any[] = [8316];
        var con: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("config_10mount_ids");
        if (con && con.ConfigValue) {
            ret = con.ConfigValue.split(",");
            for (var i: number = 0; i < ret.length; i++) {
                ret[i] = Number(ret[i]);
            }
        }
        return ret;
    }

    constructor($body: string, $isDefault: boolean, unuse: string = "auto", unuse2: boolean = true) {
        super()

        this._body = $body;
        this._isStop = false;
        this._bitmap = new Laya.Sprite();
        this.addChild(this._bitmap);

        if ($isDefault) {
            this.sizeType = 1;
        }

        this.initBitmapData();
    }

    public get footPrintLayer(): Laya.Sprite {
        return this._footPrintLayer;
    }

    public set footPrintLayer(value: Laya.Sprite) {
        this._footPrintLayer = value;
    }

    public setShadowScaleXY($x: number = 1, $y: number = 1) {
        // TODO  应该在初始化时候根据类型做
    }

    public moveShadow($x: number, $y: number) {
        // TODO  应该在初始化时候根据类型做
    }

    public get totalFrameY(): number {
        return this._totalFrameY;
    }

    public set totalFrameY(value: number) {
        this._totalFrameY = value;
    }

    public get totalFrameX(): number {
        return this._totalFrameX;
    }

    public set totalFrameX(value: number) {
        this._totalFrameX = value;
    }

    public resetSizeType() {

    }

    // 重新绘制
    public set sizeType(value: number) {
        if (this._sizeType == value) {
            return;
        }
        this._isInit = true;
        this.setBitmapSize(value)
    }

    protected setBitmapSize(sizeType: number) {
        this._sizeType = sizeType;
        let rect = this.sizeMax[sizeType];
        rect || (rect = this.sizeMax[1]);
        this.aSize.setTo(rect.width, rect.height);
        this._bitmap.x = rect.x;
        this._bitmap.y = rect.y;
        this._bitmap.width = rect.width
        this._bitmap.height = rect.height

        // Logger.info("[HeroAvatar]sizeType ", this.objName, this.sizeType)
        NotificationManager.Instance.dispatchEvent(Avatar.SIZETYPE_CHANGE);
    }

    public get sizeType(): number {
        return this._sizeType;
    }

    public get npcBodySizeType(): number {
        return this._npcBodySizeType;
    }


    public get translucenceBodySizeType(): number {
        return this._translucenceBodySizeType;
    }

    public get sizeInfo() {
        let obj = this.sizeMax[this.sizeType]
        let tmp
        if (obj) {
            tmp = { x: Math.abs(obj.x), y: Math.abs(obj.y), width: obj.width, height: obj.height }
        } else {//例: 外城野怪
            tmp = { x: this._drawRect.width / 2, y: this._drawRect.height, width: this._drawRect.width, height: this._drawRect.height }
        }
        return tmp
    }

    public get isMorph(): boolean {
        return this.type == AvatarResourceType.NPC && this.changeShapeId > 0;
    }

    public get contentBitmap(): Laya.Sprite {
        return this._bitmap;
    }

    public get frameX(): number {
        return this._frameX;
    }

    public set frameX(value: number) {
        this._frameX = value;
    }

    public get frameY(): number {
        return this._frameY;
    }

    public set frameY(value: number) {
        this._frameY = value;
    }

    public get type(): number {
        return this._type;
    }

    public set type(value: number) {
        this._type = value;

    }

    public get isRending(): boolean {
        return this._isRending;
    }

    public set isRending(value: boolean) {
        this._isRending = value;
        if (this._bitmap) {
            this._bitmap.visible = value
            this._bitmap.active = value
        }
    }

    protected initBitmapData() {

    }

    /**
     * 显示隐藏身上所有的装备
     *
     */
    public showAllAvatar(show: boolean = true, exceptPosList: string[] = []) {
    }

    /**
     * 显示隐藏指定位置的装备
     *
     */
    public showAvatar(show: boolean, position: string = "") {
    }

    /**
     *      更新指定部位的装备
     * @param key       装备的资源位置
     * @param sornStand 装备站立时显示的层次
     * @param sornWalk  装备在行走时显示的层次
     * @param position  装备的类型
     *
     */
    public updateAvatar(key: string, sornStand: any[], sornWalk: any[], position: string, call: Function = null, type: number = 1, job: number = -1, sex: number = -1) {
    }

    public run() {
        if (this._isStop) {
            return;
        }
        this.draw();
        this.nextFrameX();
    }

    public stop() {
        this._isStop = true;
    }

    public play() {
        this._isStop = false;
    }

    public get state(): number {
        return this._state;
    }

    public set state(value: number) {
        this._state = value;
    }

    public set angle(value: number) {
        this._angle = value;
    }

    public get angle(): number {
        return this._angle;
    }

    public get body(): string {
        return this._body;
    }

    public set body(value: string) {
        this._body = value;
    }

    public get mount(): string {
        return this._mount;
    }

    public set mount(value: string) {
        this._mount = value;
    }

    public isReverse(): boolean {
        return this._face;
    }

    protected draw() {
        if (!this._isInit) {
            return;
        }
        switch (this._state) {
            case Avatar.WALK:
                this.drawWalk();
                break;
            case Avatar.JUMP:
                this.drawJump();
                break;
            case Avatar.ATTACK:
                this.drawAttack();
                break;
            case Avatar.STAND:
                this.drawStand();
                break;
        }
    }

    /**
     * 准备好下一次要渲染的bitmapdata
     *
     */
    public nextFramePrepare() {
        if (!this._isInit) {
            return;
        }
        switch (this._state) {
            case Avatar.WALK:
                this.drawWalkPrepare();
                break;
            case Avatar.JUMP:
                this.drawJumpPrepare();
                break;
            case Avatar.ATTACK:
                this.drawAttackPrepare();
                break;
            case Avatar.STAND:
                this.drawStandPrepare();
                break;
        }
    }

    protected drawWalkPrepare() {

    }

    protected drawStandPrepare() {

    }

    protected drawJumpPrepare() {

    }

    protected drawAttackPrepare() {

    }

    protected drawStand() {

    }

    protected nextFrameX() {
        this._frameX++;
    }

    protected drawWalk() {

    }

    protected drawJump() {

    }

    protected drawAttack() {

    }

    public getCurrentPixels(point?: Laya.Point): number {
        return 255
    }

    public dispose() {
        ObjectUtils.disposeObject(this._bitmap);
        this._bitmap = null
        this.destroy(true);
    }
}