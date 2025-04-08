/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 17:48:03
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-17 14:47:30
 * @Description: 农场的地面相关视图元素 包括地图及动画、神树、土地、建筑物
 * 
 */

import Resolution from "../../../../core/comps/Resolution";
import { EmWindow } from "../../../constant/UIDefine";
import { ArmyManager } from "../../../manager/ArmyManager";
import { FarmManager } from "../../../manager/FarmManager";
import { TweenDrag } from "../../../map/castle/utils/TweenDrag";
import FUIHelper from "../../../utils/FUIHelper";
import NewbieUtils from "../../guide/utils/NewbieUtils";
import { FarmBuildLayer } from "./component/FarmBuildLayer";
import { FarmLandLayer } from "./component/FarmLandLayer";
import { FarmSkinLayer } from "./component/FarmSkinLayer";
import { FarmWalkLayer } from "./component/FarmWalkLayer";
import { WaterViewContainer } from "./component/WaterViewContainer";

export class FarmMapView extends Laya.Sprite {
    public static BG_WIDTH = 1800
    public static BG_HEIGHT = 900
    private MapBgWidthFix = 150; //相比原版地图左边增宽的像素
    public static IS_FARMLAND_INIT: boolean = false
    /**
     * 各种屏幕下把此点显示到中心, 如果黑边需要计算黑边像素进行偏移
     */
    public static MAP_SHOW_ANCHOR_POINT: Laya.Point = new Laya.Point(0.5, 0.6);
    /**
     * 地图
     */
    // private _bg: fgui.GLoader;
    /**
     * 动画
     */
    // private _skinLayer: FarmSkinLayer;
    /**
     *  神树
     */
    // private _waterLayer: WaterViewContainer;
    // public get waterLayer(): WaterViewContainer {
    //     return this._waterLayer;
    // };
    /**
     *  土地
     */
    private _landLayer: FarmLandLayer;
    /**
     *  建筑物
     */
    // private _buildLayer: FarmBuildLayer;
    // public get buildLayer(): FarmBuildLayer {
    //     return this._buildLayer;
    // };
    /**
     * 行走层 
     */
    // private _walkLayer: FarmWalkLayer;


    // private _tweenDrag: TweenDrag;

    constructor() {
        super();
        this.initView();
        this.initData();
    }
    /**
     * 初始化视图 
     * 添加各视图子元素
     */
    private initView() {
        // this._tweenDrag = new TweenDrag(this, this);

        // this._bg = new fgui.GLoader()
        // this._bg.icon = FUIHelper.getItemURL(EmWindow.Farm, "map")
        // this.addChild(this._bg.displayObject);

        // this._skinLayer = new FarmSkinLayer();
        // this._waterLayer = new WaterViewContainer();
        this._landLayer = new FarmLandLayer();
        // this._buildLayer = new FarmBuildLayer();
        // this._walkLayer = new FarmWalkLayer();

        // this._tweenDrag.onDraging = this.draggingCallBack.bind(this);
        // this._tweenDrag.onTweening = this.draggingCallBack.bind(this);

        // this.addChild(this._skinLayer);
        // this.addChild(this._waterLayer);
        this.addChild(this._landLayer);
        // this.addChild(this._buildLayer);
        // this.addChild(this._walkLayer);
        // this._skinLayer.x = this.MapBgWidthFix;
        // this._waterLayer.x = this.MapBgWidthFix;
        this._landLayer.x = this.MapBgWidthFix;
        // this._buildLayer.x = this.MapBgWidthFix;
        // this._walkLayer.x = this.MapBgWidthFix;
    }

    private initData() {
        
    }


    public get width(): number {
        return FarmMapView.BG_WIDTH;
    }

    public get height(): number {
        return FarmMapView.BG_HEIGHT;
    }

    public get landLayer(): FarmLandLayer {
        return this._landLayer;
    }

    public getRealWidth() {
        return FarmMapView.BG_WIDTH * this.scaleX
    }

    public getRealHeight() {
        return FarmMapView.BG_HEIGHT * this.scaleY
    }

    public dispose() {
        FarmMapView.IS_FARMLAND_INIT = false;
       
        // if (this._skinLayer) this._skinLayer.dispose(); this._skinLayer = null;
        // if (this._buildLayer) this._buildLayer.dispose(); this._buildLayer = null;
        // if (this._waterLayer) this._waterLayer.dispose(); this._waterLayer = null;
        if (this._landLayer) this._landLayer.dispose(); this._landLayer = null;
        // if (this._walkLayer) this._walkLayer.dispose(); this._walkLayer = null;
    }
}