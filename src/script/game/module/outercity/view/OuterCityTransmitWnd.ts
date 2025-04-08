// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { OuterCityMap } from "../../../map/outercity/OuterCityMap";
import { UIConstant } from "../../../constant/UIConstant";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import Point = Laya.Point;

/**
 * @description 外城传送坐标
 * @author yuanzhan.yu
 * @date 2021/11/30 14:36
 * @ver 1.0
 */
export class OuterCityTransmitWnd extends BaseWindow {
    public btn_cancel: UIButton;
    public btn_sure: UIButton;
    public txt_xPos: fgui.GTextInput;
    public txt_yPos: fgui.GTextInput;

    private _mapView: OuterCityMap;

    private maxNumberCount: number = 6;
    private _minPosX:number = 0;
    private _minPosY:number = 0;
    private _maxPosX:number = 0;
    private _maxPosY:number = 0;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();

        this.initData();
        this.initView();
        this.initEvent();
        this.setCenter();
    }

    private initData() {
        this._mapView = OuterCityManager.Instance.mapView;
        let stageWidth:number = StageReferance.stageWidth ;
        let stageHeight:number = StageReferance.stageHeight;
        this._minPosX = Math.floor(Math.abs((stageWidth / 2 - 0) / 50));
        this._minPosY = Math.floor(Math.abs((stageHeight / 2 - 0) / 50));
        this._maxPosX = Math.floor(Math.abs((stageWidth / 2 - this._mapView.width) / 50));
        this._maxPosY = Math.floor(Math.abs((stageHeight / 2 - this._mapView.height) / 50));
    }

    private initView() {
        let BigMap_X: number = this._mapView.x / UIConstant.SMALL_MAP_SCALE;
        let BigMap_Y: number = this._mapView.y / UIConstant.SMALL_MAP_SCALE;
        let posX: number = Math.floor((StageReferance.stageWidth / 2 - this._mapView.x) / 50);
        let posY: number = Math.floor((StageReferance.stageHeight / 2 - this._mapView.y) / 50);
        posX = (posX < 0 ? 0 : posX);
        posY = (posY < 0 ? 0 : posY);
        this.txt_xPos.text = posX.toString();
        this.txt_yPos.text = posY.toString();

    }

    private initEvent() {
        this.btn_sure.onClick(this, this.onBtnSureClick);
        this.btn_cancel.onClick(this, this.onBtnCancelClick);
        this.txt_xPos.on(Laya.Event.BLUR, this, this.onXTextChange);
        this.txt_yPos.on(Laya.Event.BLUR, this, this.onYTextChange);
    }

    private onXTextChange() {
        let xPos:number = Number(this.txt_xPos.text);
        this.txt_xPos.text = Math.min(Math.max(this._minPosX, xPos), this._maxPosX).toString();
    }

    private onYTextChange() {
        let yPos:number = Number(this.txt_yPos.text);
        this.txt_yPos.text = Math.min(Math.max(this._minPosY, yPos), this._maxPosY).toString();
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    private onBtnCancelClick() {
        this.hide();
    }

    private onBtnSureClick() {
        let posX: number = parseInt(this.txt_xPos.text);
        let posY: number = parseInt(this.txt_yPos.text);
        if (posX > 0 && posY > 0) {
            this._mapView.motionTo(new Point(posX * 50 - StageReferance.stageWidth / 2, posY * 50 - StageReferance.stageHeight / 2));
            this.hide();
        }
    }

    private removeEvent() {
        this.btn_sure.offClick(this, this.onBtnSureClick);
        this.btn_cancel.offClick(this, this.onBtnCancelClick);
        this.txt_xPos.off(Laya.Event.BLUR, this, this.onXTextChange);
        this.txt_yPos.off(Laya.Event.BLUR, this, this.onYTextChange);
    }



    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._mapView = null;
        super.dispose(dispose);
    }
}