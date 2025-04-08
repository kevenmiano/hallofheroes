import ObjectUtils from "../../../core/utils/ObjectUtils";
import {Disposeable} from "../../component/DisplayObject";
import {CampaignMapEvent, OuterCityEvent} from "../../constant/event/NotificationEvent";
import MediatorMananger from "../../manager/MediatorMananger";
import {NotificationManager} from "../../manager/NotificationManager";
import {OuterCityManager} from "../../manager/OuterCityManager";
import {LockTargetMediator} from "../../mvc/mediator/LockTargetMediator";
import {StageReferance} from "../../roadComponent/pickgliss/toplevel/StageReferance";
import {MapRenderLayer} from "../campaign/view/layer/MapRenderLayer";
import {MapElmsLibrary} from "../libray/MapElmsLibrary";
import {MapViewHelper} from "./utils/MapViewHelper";
import {OuterCityStaticLayer} from "../view/layer/OuterCityStaticLayer";
import {BoxMsgInfo} from "./BoxMsgInfo";
import {OuterCityModel} from "./OuterCityModel";
import {OuterCityScene} from "../../scene/OuterCityScene";
import {OuterCityMainBuidingLayer} from "./OuterCityMainBuidingLayer";
import {OuterCityNpcLayer} from "./OuterCityNpcLayer";
import {WorldWalkLayer} from "./WorldWalkLayer";
import {OuterCityCloudView} from "./OuterCityCloudView";
import {OuterCityBorderLayer} from "./OuterCityBorderLayer";
import {OuterCityDenseFogLayer} from "./OuterCityDenseFogLayer";
import {OuterCityBossBoxView} from "./OuterCityBossBoxView";
import {OuterCityDragMediator} from "../../mvc/mediator/OuterCityDragMediator";
import {OuterCityMapDirectionKeyMediator} from "../../mvc/mediator/OuterCityMapDirectionKeyMediator";
import {OuterCityMouseEventMediator} from "../../mvc/mediator/OuterCityMouseEventMediator";
import {OuterCityMapCursorMediator} from "../../mvc/mediator/OuterCityMapCursorMediator";
import {DeleteWorldPlayerMediator} from "../../mvc/mediator/DeleteWorldPlayerMediator";
import {TranseferMediator} from "../../mvc/mediator/TranseferMediator";
import HomeWnd from "../../module/home/HomeWnd";
import {UIConstant} from "../../constant/UIConstant";
import {ShadowUILayer, ShadowUILayerHandler} from "../view/layer/ShadowUILayer";
import {AvatarInfoUILayer, AvatarInfoUILayerHandler, AvatarInfoUIName} from "../view/layer/AvatarInfoUILayer";
import {BgLayer} from "../space/bg/BgLayer";
import {EnterFrameManager} from "../../manager/EnterFrameManager";
import {OuterCityMapCameraMediator} from "../../mvc/mediator/OuterCityMapCameraMediator";
import OuterCityWarFightMediator from "../../mvc/mediator/OuterCityWarFightMediator";
import Point = Laya.Point;
import Rectangle = Laya.Rectangle;
import OuterCityVehicleMediator from "../../mvc/mediator/OuterCityVehicleMediator";

/**
 * @description    外城地图
 * @author yuanzhan.yu
 * @date 2021/11/16 21:05
 * @ver 1.0
 */
export class OuterCityMap extends Laya.Sprite implements Disposeable {
    private _model: OuterCityModel;
    public isMove: boolean = false;
    private _contro: OuterCityScene;
    private _staticLayer: OuterCityStaticLayer;
    private _mainBuidingLayer: OuterCityMainBuidingLayer;
    private _npcLayer: OuterCityNpcLayer;
    private _shadowUILayer: ShadowUILayer;
    private _worldWalkLayer: WorldWalkLayer;
    private _avatarInfoUILayer: AvatarInfoUILayer;
    private _staticRender: MapRenderLayer;
    private _cloudView: OuterCityCloudView;
    private _borderLayer: OuterCityBorderLayer;
    private _denseFogLayer: OuterCityDenseFogLayer;
    public static NAME: string = "map.outercity.view.OuterCityMap";
    private _bgLayer: BgLayer;

    constructor($contro: OuterCityScene, $model: OuterCityModel) {
        super();
        this._contro = $contro;
        this._model = $model;
        this.size(this._model.mapTempInfo.Width, this._model.mapTempInfo.Height);
        this.init();
        this.addEvent();
    }

    /**
     *迷雾层
     */
    public get denseFogLayer(): OuterCityDenseFogLayer {
        return this._denseFogLayer;
    }

    public get staticRender(): MapRenderLayer {
        return this._staticRender;
    }

    private init(): void {
        OuterCityManager.Instance.mapView = this;
        if (this._model.mapTempInfo.Width < 5000) {
            this._staticRender = new MapRenderLayer(this, this._model.mapTempInfo.Width, this._model.mapTempInfo.Height);
            this._staticRender.elmsDatas = MapElmsLibrary.Instance;
            this._staticRender.data = this._model.floorData;
        } else {
            //暂时还原地图
            // if (this._model.mapTempInfo.MapFileId == 5) {
            //     this._bgLayer = new BgLayer(this, this._model.mapTempInfo, this._model.floorData, false);
            //     this.size(this._model.mapTempInfo.Width, this._model.mapTempInfo.Height);
            // } else {
            this._staticLayer = new OuterCityStaticLayer();
            this._staticLayer.mapData = this._model;
            this._staticLayer.upDateNextRend();
            this.addChild(this._staticLayer);
            // }
        }
        
        this._shadowUILayer = new ShadowUILayer();
        this.addChild(this._shadowUILayer);
        ShadowUILayerHandler.setHandlerView(this._shadowUILayer, AvatarInfoUIName.SpaceSceneMapView);

        this._mainBuidingLayer = new OuterCityMainBuidingLayer();
        this._mainBuidingLayer.mapData = this._model;
        this.addChild(this._mainBuidingLayer);

        this._npcLayer = new OuterCityNpcLayer();
        this._npcLayer.mapData = this._model;
        this.addChild(this._npcLayer);


        this._worldWalkLayer = new WorldWalkLayer();
        this.addChild(this._worldWalkLayer);

        this._avatarInfoUILayer = new AvatarInfoUILayer();
        this.addChild(this._avatarInfoUILayer);
        AvatarInfoUILayerHandler.setHandlerView(this._avatarInfoUILayer, AvatarInfoUIName.OuterCityMap);

        this._borderLayer = new OuterCityBorderLayer();
        this.addChild(this._borderLayer);

        this._denseFogLayer = new OuterCityDenseFogLayer(this._model.mapTempInfo.Width, this._model.mapTempInfo.Height, this);
        this.addChild(this._denseFogLayer);

        if (OuterCityManager.Instance.model.bossInfo.leftFogTime > 0) {
            this.onRemoveFog();
        }


        if (this._model.mapTempInfo.Id != 100) {
            this._cloudView = new OuterCityCloudView();
            this.addChild(this._cloudView);
        }
        this._boxObj = {};
    }

    /**
     *移除迷雾
     * @param evt
     *
     */
    private onRemoveFog(evt: OuterCityEvent = null): void {
        if (this.contains(this._denseFogLayer)) {            
            this.removeChild(this._denseFogLayer);
            //移除后, 去掉帧循环；手机端说使用神圣之光后会卡；还是卡的话, 就和神圣之光没关系了。
            EnterFrameManager.Instance.unRegisteEnterFrame(this._denseFogLayer);
        }
    }

    /**
     *恢复迷雾
     * @param evt
     *
     */
    private onAddFog(evt: OuterCityEvent): void {
        //恢复后, 加入帧循环
        EnterFrameManager.Instance.registeEnterFrame(this._denseFogLayer);
        this.addChild(this._denseFogLayer);
    }

    private _mediatorKey: string;

    private initRegisterList(): void {
        let arr: any[] = [
            OuterCityDragMediator,
            OuterCityMapCursorMediator,
            OuterCityMapDirectionKeyMediator,
            OuterCityMouseEventMediator,
            DeleteWorldPlayerMediator,
            TranseferMediator,
            LockTargetMediator,
            OuterCityWarFightMediator,
            OuterCityVehicleMediator,
            OuterCityMapCameraMediator];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, OuterCityMap.NAME);
    }

    private addEvent(): void {
        StageReferance.stage.on(Laya.Event.RESIZE, this, this.__resizeHandler);
        this.on(Laya.Event.DISPLAY, this, this.__addedToStageHandler);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTER_CITY_REMOVE_FOG, this.onRemoveFog, this);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTER_CITY_ADD_FOG, this.onAddFog, this);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTER_CITY_UPDATE_BOX, this.onUpdateBox, this);
    }

    private removeEvent(): void {
        StageReferance.stage.off(Laya.Event.RESIZE, this, this.__resizeHandler);
        this.off(Laya.Event.DISPLAY, this, this.__addedToStageHandler);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTER_CITY_REMOVE_FOG, this.onRemoveFog, this);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTER_CITY_ADD_FOG, this.onAddFog, this);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTER_CITY_UPDATE_BOX, this.onUpdateBox, this);
    }

    /**
     * 怪物掉落宝箱
     * @param evt
     *
     */
    private _boxObj: Object;

    private onUpdateBox(evt: OuterCityEvent): void {
        let i: number;
        let arr: any[] = this._model.bossInfo.bossBoxList;
        for (i = 0; i < arr.length; i++) {
            let boxMsgInfo: BoxMsgInfo = arr[i];
            let box: OuterCityBossBoxView = this._boxObj[boxMsgInfo.boxId];
            if (box == null) {
                box = new OuterCityBossBoxView();
                box.setData(boxMsgInfo);
                this.addChild(box);
                this._boxObj[boxMsgInfo.boxId] = box;
            }
        }
    }

    private __resizeHandler(e: Event): void {
        this.moveEnd();
        if (this._staticLayer) {
            this._staticLayer.resize();
        }
    }

    private __addedToStageHandler(evt: Event): void {
        this.initRegisterList();
        let center: Point = MapViewHelper.targetSolveCenter(this._model.targetPoint);
        this.x = center.x;
        this.y = center.y;
        this.moveEnd();
    }

    public moveEnd(): void {
        let rect: Rectangle = MapViewHelper.getCurrentMapRect(this);
        if(this._contro)this._contro.moveMapCallBack(rect);
        if(this._mainBuidingLayer)this._mainBuidingLayer.outSceneMovies();
        if(this._borderLayer)this._borderLayer.update();
        this.event(CampaignMapEvent.MOVE_SCENET_END, this);
        if(this.denseFogLayer)this.denseFogLayer.refreshCount = 1;
    }

    public onDraging(): void {
        this.denseFogLayer.refreshCount = 2;
        let rect: Rectangle = MapViewHelper.getCurrentMapRect(this);
        this._contro.moveMapCallBack(rect);
    }

    public motionTo(p:Point):void
    {
        p = MapViewHelper.checkTargetPoint(p);
        this._model.targetPoint = p;
        let center:Point = p;
        if(this.x == center.x && this.y == center.y)
        {
            return;
        }
        if(this.isMove)
        {
            return;
        }
        this.isMove = true;
        let dis:number = MapViewHelper.checkDistance(this.x, this.y, center.x, center.y);
        if(this._moveTimeId > 0)
        {
            clearInterval(this._moveTimeId);
        }
        this._moveTimeId = 0;
        this.alpha = 1;
        if(dis > 1000)
        {
            this.x = center.x;
            this.y = center.y;
            this.moveTweencompleted();
            //this.alpha = 0;
            this._moveTimeId = setInterval(this.unLockScene.bind(this), 1300);
        }
        else
        {
            Laya.Tween.to(this, {x:center.x, y:center.y}, 300, null, Laya.Handler.create(this, this.moveTweencompleted), 0, true);
        }
    }


    private _moveTimeId: number;

    private unLockScene(): void {
        if (this._moveTimeId > 0) {
            clearInterval(this._moveTimeId);
        }
        this._moveTimeId = 0;
        this.alpha = 1;
    }

    public novimotionTo(p: Point): void {
        p = MapViewHelper.checkTargetPoint(p);
        this._model.targetPoint = p;
        let center: Point = p;
        if (this.x == center.x && this.y == center.y) {
            return;
        }
        if (this.isMove) {
            return;
        }
        this.isMove = true;
        this.x = center.x;
        this.y = center.y;
        this.moveTweencompleted();
    }

    private moveTweencompleted(): void {
        this.moveEnd();
        this.isMove = false;
        if (this._staticLayer) {
            this._staticLayer.upDateNextRend();
        }
    }


    public dispose(): void {
        MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
        this.removeEvent();
        if (this._borderLayer) {
            this._borderLayer.dispose();
        }
        this._borderLayer = null;
        if (this._staticRender) {
            this._staticRender.dispose();
        }
        this._staticRender = null;
        if (this._staticLayer) {
            this._staticLayer.dispose();
        }
        if (this._bgLayer) {
            this._bgLayer.dispose();
        }
        this._bgLayer = null;
        if (this._worldWalkLayer) {
            this._worldWalkLayer.dispose();
        }
        this._worldWalkLayer = null;
        if (this._npcLayer) {
            this._npcLayer.dispose();
        }
        if (this._shadowUILayer) ObjectUtils.disposeObject(this._shadowUILayer); this._shadowUILayer = null;
        ObjectUtils.disposeAllChildren(this);
        this._npcLayer = null;
        this._staticLayer = null;
        this._mainBuidingLayer = null;
        this._contro = null;
        this._model = null;

        if (this._denseFogLayer) {
            this._denseFogLayer.dispose();
        }
        this._denseFogLayer = null;
        this.removeSelf();
    }

    private _reshrePoint: Point = new Point();

    public set x(value: number) {
        super.x = value;
        if (HomeWnd.Instance.isShowing) {
            HomeWnd.Instance.getSmallMapBar().iconContainerX = value / UIConstant.SMALL_MAP_SCALE;
        }
        if (Math.abs(value - this._reshrePoint.x) > OuterCityStaticLayer.drawOff) {
            this._reshrePoint.x = value;
            this._reshrePoint.y = this.y;
            if (this._staticLayer) {
                this._staticLayer.upDateNextRend();
                this._staticLayer.backgroundXandY(-this.x, -this.y);
            }
            if(this._worldWalkLayer)this._worldWalkLayer.outSceneMovies();
        }

    }

    public set y(value: number) {
        super.y = value;
        if (HomeWnd.Instance.isShowing) {
            HomeWnd.Instance.getSmallMapBar().iconContainerY = value / UIConstant.SMALL_MAP_SCALE;
        }
        if (Math.abs(value - this._reshrePoint.y) > OuterCityStaticLayer.drawOff) {
            this._reshrePoint.y = value;
            this._reshrePoint.x = this.x;
            if (this._staticLayer) {
                this._staticLayer.upDateNextRend();
                this._staticLayer.backgroundXandY(-this.x, -this.y);
            }
            if(this._worldWalkLayer)this._worldWalkLayer.outSceneMovies();
        }
    }

    public get x(): number {
        return super.x;
    }

    public get y(): number {
        return super.y;
    }

    public get staticLayer(): OuterCityStaticLayer {
        return this._staticLayer;
    }

    public get worldWalkLayer(): WorldWalkLayer {
        return this._worldWalkLayer;
    }

    public get avatarInfoUILayer(): AvatarInfoUILayer {
        return this._avatarInfoUILayer;
    }

    public get mainBuidingLayer(): OuterCityMainBuidingLayer {
        return this._mainBuidingLayer;
    }

    public get npcLayer(): OuterCityNpcLayer {
        return this._npcLayer;
    }

    public moveMapHandler(pos: string): void {
        let arr: any[] = pos.split(",");
        if (arr.length == 2) {
            this.motionTo(new Point(Number(arr[0]) * 50, Number(arr[1]) * 50));
        }
    }

    private _prePoint: Laya.Point = new Laya.Point();
    public setPosition($x: number, $y: number) {
        this.x = $x;
        this.y = $y;
        if (Math.abs((this._prePoint.x - this.x) >> 0) > OuterCityStaticLayer.drawOff || Math.abs((this._prePoint.y - this.y) >> 0) > OuterCityStaticLayer.drawOff) {
            this._prePoint.x = $x;
            this._prePoint.y = $y;
            this.moveEnd();
        }
    }
}