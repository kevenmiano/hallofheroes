import SpaceNodeType from "../../constant/SpaceNodeType";
import { MapPhysics } from "../../data/MapPhysics";
import { SpaceNode } from "../../data/SpaceNode";
import { MapPhysicsAttackingBase } from "./MapPhysicsAttackingBase";
import SpaceManager from "../../SpaceManager";
import { PathManager } from "../../../../manager/PathManager";
import MediatorMananger from "../../../../manager/MediatorMananger";
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import { t_s_mapData } from "../../../../config/t_s_map";
import { ConfigType } from "../../../../constant/ConfigDefine";
import ColorConstant from "../../../../constant/ColorConstant";
import { SpaceSceneMapView } from "../SpaceSceneMapView";

/**
     * 天空之城建筑等显示对象
     * 
     */
export class SpacePhysicsView extends MapPhysicsAttackingBase {
    public static NAME: string = "map.space.view.physics.SpacePhysicsView";
    private _mediatorKey: string;
    private _buildName: Laya.Text = new Laya.Text();;
    private _hitBitmap: Laya.Bitmap;

    constructor() {
        super();
        this.addChild(this._buildName);
    }

    protected initView() {
        super.initView();

        if (this.info.info.names != "") {
            this._buildName.text = this.titleLang;
        }
        if ((this.info as SpaceNode).moveToMapId != 0) {
            let mapInfo: t_s_mapData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_map, String((<SpaceNode>this.info).moveToMapId));
            this._buildName.text = mapInfo.MapNameLang;
        }

        this._buildName.x = - this._buildName.width / 2;
        this._buildName.mouseEnabled = false;

        if ((<SpaceNode>this.info).nodeId == 18) {
            this._buildName.x = -76;
            this._buildName.y = -92;
        }
        if (SpaceNodeType.isYearNode(this.info.info.types)) {
            this._buildName.x = (this.getMovie.getBounds().width - this._buildName.textWidth) / 2;
        }

        if (!this.parent) {
            let mapView = SpaceManager.Instance.mapView as SpaceSceneMapView
            if (mapView && mapView.buildingLayer) {
                mapView.buildingLayer.center.addChild(this);
            }
        }
    }

    protected addEvent() {
        super.addEvent();
        // RingTaskManager.Instance.addEventListener(RingTaskEvent.REFRESHRING,this.setMouseEnable);
    }

    protected removeEvent() {
        super.removeEvent()
        // RingTaskManager.Instance.removeEventListener(RingTaskEvent.REFRESHRING,this.setMouseEnable);
    }

    private initMediator() {
        if (!this.info || !this.info.info) return;
        var arr: any[] = [];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, SpacePhysicsView.NAME);
    }

    public set info(value: MapPhysics) {
        super.info = value;
        this.initMediator();
    }

    public get info(): MapPhysics {
        return super.info;
    }

    protected layouCallBack() {
        if (this.isCollection) {
            if (SpaceNodeType.isYearNode(this.info.info.types)) {
                if ((this.info as SpaceNode).stateId == SpaceNode.STATE1) {
                    this._buildName.color = ColorConstant.YELLOW_COLOR;
                    this._buildName.text = this.titleLang;
                    this.getMovie.visible = true;
                    this._buildName.visible = true;
                    this._buildName.x = (this.getMovie.getBounds().width - this._buildName.textWidth) / 2;
                    this._buildName.y = - this._buildName.textHeight;
                }
                else {
                    this._buildName.text = "";
                    this._buildName.visible = false;
                    this.getMovie.visible = false;
                }
                this.getMovie.active = this.getMovie.visible;
                this.mouseEnabled = this.mouseThrough = ((this.info as SpaceNode).stateId == SpaceNode.STATE1);
            }
        }
    }

    public get resourcesPath(): string {
        if (SpaceNodeType.isYearNode(this.info.info.types) && (this.info as SpaceNode).stateId == SpaceNode.STATE0) {
            return "";
        }
        return PathManager.solveMapPhysicsBySonType((<SpaceNode>this.info).sonType);
    }

    public mouseOverHandler(evt: Laya.Event): boolean {
        if (this.hasEffectArea) {
            SpaceManager.Instance.model.glowTarget = this;
        }
        if (this.isTransfer) {
            this.filter.setLightFilter(this.getMovie);
        }
        if (this.isOfferReward) {
            SpaceManager.Instance.model.glowTarget = this;
        }
        return true;
    }

    public mouseOutHandler(evt: Laya.Event): boolean {
        if (this.isTransfer) {
            this.filter.setNormalFilter(this.getMovie);
        }
        return true;
    }

    public mouseClickHandler(evt: Laya.Event): boolean {
        evt.stopPropagation();
        if (this.hasEffectArea) {
            // if(this.cacheName.indexOf("mapmaterial/build/2999/")>-1){
            //     Logger.xjy("[SpacePhysicsView]mouseClickHandler", evt, this)
            // }
            let pix = this.getCurrentPixels();
            // Logger.xjy("[SpacePhysicsView]mouseClickHandler pix", pix, this.cacheName)
            return pix > 0 && this.attackFun();
        } else if (this.isTransfer) {
            if (evt.target == this) {
                return this.attackFun();
            }
        } else if (this.isOfferReward) {
            if (evt.target == this) {
                return this.attackFun();
            }
        }
        return false;
    }

    public mouseMoveHandler(evt: Laya.Event): boolean {
        // if(this.hasEffectArea)
        // {
        // 	if(this._hitBitmap && this._hitBitmap.bitmapData.getPixel(this._hitBitmap.mouseX, this._hitBitmap.mouseY))
        // 	{
        // 		SpaceManager.Instance.model.glowTarget = this;
        // 		return true;
        // 	}
        // }
        // else if(this.isCollection)
        // {
        // 	if(this._hitBitmap && this._hitBitmap.bitmapData.getPixel(this._hitBitmap.mouseX, this._hitBitmap.mouseY))
        // 	{
        // 		return true;
        // 	}
        // }
        // else if(this.isOfferReward)
        // {
        // 	if(this._hitBitmap && this._hitBitmap.bitmapData.getPixel(this._hitBitmap.mouseX, this._hitBitmap.mouseY))
        // 	{
        // 		return true;
        // 	}
        // }
        return false;
    }

    public setGlowFilter() {
        if (this.hasEffectArea) {
            this.filter.setGlowFilter(this.effectArea);
        }
    }

    public setNormalFilter() {
        if (this.hasEffectArea) {
            this.filter.setNormalFilter(this.effectArea);
        }
    }

    private get effectArea(): Laya.Sprite {
        if (this.hasEffectArea) {
            return this.getMovie["content"]["effect_area"];
        }
        return this.getMovie;
    }

    private get hasEffectArea(): boolean {
        if ((SpaceNodeType.isYearNode(this.info.info.types) && (this.info as SpaceNode).stateId == SpaceNode.STATE0)) {
            return false;
        }
        else if (this.getMovie) {
            return true;
        }
        return false;
    }

    private get isOfferReward(): boolean {
        if ((<SpaceNode>this.info).nodeId == SpaceNodeType.ID_OFFER_REWARD) {
            return true;
        }
        return false;
    }

    private get isTransfer(): boolean {
        if ((<SpaceNode>this.info).param1 == SpaceNodeType.PARAM_TRANSFER
            || (<SpaceNode>this.info).nodeId == 18
            || (<SpaceNode>this.info).info.types == SpaceNodeType.BORN_POINT
            || (SpaceNodeType.isYearNode(this.info.info.types) && (this.info as SpaceNode).stateId == SpaceNode.STATE1)) {
            return true;
        }
        return false;
    }

    private get isCollection(): boolean {
        if ((<SpaceNode>this.info).nodeId == 18) {
            return true;
        }
        if (SpaceNodeType.isYearNode((<SpaceNode>this.info).info.types)) {
            return true;
        }
        return false;
    }

    public attackFun(): boolean {
        if (!SpaceManager.Instance.model.mapTielsData) {
            return false;
        }
        SpaceManager.Instance.visitSpaceNPC((<SpaceNode>this.info).nodeId, true);
        return true;
    }

    public set isPlaying(value: boolean) {
        super.isPlaying = value;
        if (this._buildName) {
            if ((this.info as SpaceNode).nodeId != 18) {
                this._buildName.text = "";
                this._buildName.visible = false;
                this._buildName.active = false;
            }
            if (SpaceNodeType.isYearNode(this.info.info.types)) {
                if ((this.info as SpaceNode).stateId == SpaceNode.STATE0) {
                    this._buildName.text = "";
                    this._buildName.visible = false;
                    this._buildName.active = false;
                    this.getMovie.visible = false;
                    this.getMovie.active = false;
                    let movieWidth: number = this.getMovie.getBounds().width;
                    // this._buildName.x = (movieWidth - this._buildName.textWidth) / 2;
                } else {
                    this._buildName.text = this.titleLang;;
                    this._buildName.visible = true;
                    this._buildName.active = true;
                    this.getMovie.visible = true;
                    this.getMovie.active = true;
                    let movieWidth: number = this.getMovie.getBounds().width;
                    // this._buildName.x = (movieWidth - this._buildName.textWidth) / 2;
                    this._buildName.y = - this._buildName.textHeight;
                }
            }
        }
    }
    // private setMouseEnable(e:RingTaskEvent)
    // {
    // 	if((<SpaceNode> this.info).nodeId == 18)
    // 	{
    // 		var ringtask:RingTask = RingTaskManager.Instance.getRingTask();
    // 		if(!ringtask)
    // 		{
    // 			this._buildName.visible = false;
    // 			this.mouseEnabled = false;
    // 			return;
    // 		}
    // 		var condition:OfferRewardConditionTemplate = ringtask.conditionList[0] as OfferRewardConditionTemplate;
    // 		if(condition.CondictionType != 4) //不是采集
    // 		{
    // 			this._buildName.visible = false;
    // 			this.mouseEnabled = false;
    // 			return
    // 		}
    // 		if(condition.Para1+"" != (<SpaceNode> this.info).param4)
    // 		{
    // 			this._buildName.visible = false;
    // 			this.mouseEnabled = false;
    // 			return;
    // 		}
    // 		if(ringtask.isCompleted)
    // 		{
    // 			this._buildName.visible = false;
    // 			this.mouseEnabled = false;
    // 			return;
    // 		}
    // 	}

    // 	this._buildName.visible = true;
    // 	this.mouseEnabled = true;
    // }
}
