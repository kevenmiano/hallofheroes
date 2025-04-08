// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { NotificationEvent, OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import OutercityVehicleArmyView from "../../../map/campaign/view/physics/OutercityVehicleArmyView";
import { WildLand } from "../../../map/data/WildLand";
import { OuterCityMap } from "../../../map/outercity/OuterCityMap";
import { OuterCityMapCameraMediator } from "../../../mvc/mediator/OuterCityMapCameraMediator";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";

export default class OuterCityMapBossTips extends BaseWindow {
    public showType: fgui.Controller;
    public bossNameTxt: fgui.GTextField;
    public soldierCountTxt: fgui.GTextField;
    public btnLookInfo: fgui.GButton;
    public btnGoto: fgui.GButton;
    public levelTxt: fgui.GTextField;
    public descTxt: fgui.GTextField;
    private _mapView: OuterCityMap;
    private _info: WildLand;
    private _type: number = 0;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.initView();
        this.initEvent();
    }

    private initData() {
        this._mapView = OuterCityManager.Instance.mapView;
        if (this.frameData) {
            this._info = this.frameData;
            this._type = 1;
            this.setCenter();
        } else {
            [this._info] = this.params;
            this._type = 0;
        }
    }

    private initView() {
        if (this._info) {
            this.bossNameTxt.text = this._info.bossName;
            this.levelTxt.text = LangManager.Instance.GetTranslation("buildings.casern.view.RecruitPawnCell.command06", this._info.grade);
        }
    }

    private initEvent() {
        this.btnLookInfo.onClick(this, this.lookInfoHandler);
        this.btnGoto.onClick(this, this.btnGotoHandler);
    }

    private removeEvent() {
        this.btnLookInfo.offClick(this, this.lookInfoHandler);
        this.btnGoto.offClick(this, this.btnGotoHandler);
    }

    protected createModel() {
        super.createModel();
        this.modelMask.alpha = 0;
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    /**
     * 查看
     */
    private lookInfoHandler() {
        if (this._type == 1) {
            this.hide();
        } else {
            this._mapView.motionTo(new Laya.Point(this._info.posX * 20 - StageReferance.stageWidth / 2, this._info.posY * 20 - StageReferance.stageHeight / 2));
            NotificationManager.Instance.dispatchEvent(NotificationEvent.CLOSE_OUTERCITY_MAP_WND);
            OuterCityMapCameraMediator.lockMapCamera();
            this.hide();
        }
    }

    /**
     * 前往
     */
    private btnGotoHandler() {
        let self: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
        if(self){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
            this.hide();
        }
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, this._info);
        NotificationManager.Instance.dispatchEvent(NotificationEvent.CLOSE_OUTERCITY_MAP_WND);
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.OUTERCITY_UNLOCK_WAR_FIGHT);
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.OUTERCITY_UNLOCK_VEHICLE_FIGHT);
        this.hide();
    }

    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

    dispose(dispose?: boolean) {
        this._info = null;
        super.dispose(dispose);
    }
}