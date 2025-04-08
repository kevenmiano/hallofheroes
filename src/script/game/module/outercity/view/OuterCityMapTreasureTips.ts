// @ts-nocheck
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { t_s_herotemplateData } from "../../../config/t_s_herotemplate";
import { t_s_mapphysicpositionData } from "../../../config/t_s_mapphysicposition";
import ColorConstant from "../../../constant/ColorConstant";
import { ConfigType } from "../../../constant/ConfigDefine";
import { NotificationEvent, OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import OutercityVehicleArmyView from "../../../map/campaign/view/physics/OutercityVehicleArmyView";
import TreasureInfo from "../../../map/data/TreasureInfo";
import { OuterCityMap } from "../../../map/outercity/OuterCityMap";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import Tiles from "../../../map/space/constant/Tiles";
import { OuterCityMapCameraMediator } from "../../../mvc/mediator/OuterCityMapCameraMediator";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";

export default class OuterCityMapTreasureTips extends BaseWindow {
    private _mapView: OuterCityMap;
    public btnLookInfo: fgui.GButton;
    public btnGoto: fgui.GButton;
    public txt_name: fgui.GTextField;
    public occupyNameTxt: fgui.GTextField;
    public resouceAddTxt: fgui.GTextField;
    public statusTxt: fgui.GTextField;
    public leftTimeTxt: fgui.GTextField;
    public addGroup: fgui.GGroup;
    public _type: number = 0;
    private _info: TreasureInfo;
    private _count: number = 0;
    private _playerModel: PlayerModel;
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
        this._playerModel = PlayerManager.Instance.currentPlayerModel;
    }

    private initView() {
        if (this._info) {
            let tempInfo: t_s_mapphysicpositionData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mapphysicposition, this._info.templateId);
            if (tempInfo) {
                this.txt_name.text = tempInfo.NameLang;
                let add = tempInfo.Property1;
                this.resouceAddTxt.text = LangManager.Instance.GetTranslation("OuterCityMapTreasureTips.resouceAddTxt", add);
            }
            if (this._info.info.occupyLeagueName == "") {//占领的公会信息无
                this.occupyNameTxt.text = LangManager.Instance.GetTranslation("maze.MazeFrame.Order");
                this.occupyNameTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
            } else {
                this.occupyNameTxt.text = "<" + this._info.info.occupyLeagueName +">";
                if (this.outerCityModel.checkIsSameConsortiaByName(this._info.info.occupyLeagueName)) {//同工会的
                    this.occupyNameTxt.color = ColorConstant.GREEN_COLOR;
                } else {
                    this.occupyNameTxt.color = ColorConstant.RED_COLOR;
                }
            }
            this.statusTxt.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.consortiaTreasure" + this.playerModel.treasureState);
            if (this.playerModel.treasureState == OuterCityModel.TREASURE_STATE1) {
                this.statusTxt.color = ColorConstant.BLUE_COLOR;
            } else if (this.playerModel.treasureState == OuterCityModel.TREASURE_STATE2) {
                this.statusTxt.color = ColorConstant.GREEN_COLOR;
            } else {
                this.statusTxt.color = ColorConstant.RED_COLOR;
            }
            let curTime: number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;//当前时间
            let endTime: number = PlayerManager.Instance.currentPlayerModel.stateEndTime;//截止时间
            this._count = endTime - curTime;//剩余的秒数
            if(this._count>0){
                this.leftTimeTxt.text = "(" +DateFormatter.getConsortiaCountDate(this._count) + ")";
                this.leftTimeTxt.color = this.statusTxt.color;
                Laya.timer.loop(1000, this, this.__updateTimeHandler);
            }
        }
    }

    private initEvent() {
        this.btnLookInfo.onClick(this, this.lookInfoHandler);
        this.btnGoto.onClick(this, this.btnGotoHandler);
        if (this._playerModel) this._playerModel.addEventListener(NotificationEvent.UPDATE_SYSTEM_TIME, this.updateTimeView, this);
    }

    private removeEvent() {
        this.btnLookInfo.offClick(this, this.lookInfoHandler);
        this.btnGoto.offClick(this, this.btnGotoHandler);
        if (this._playerModel) this._playerModel.removeEventListener(NotificationEvent.UPDATE_SYSTEM_TIME, this.updateTimeView, this);
    }

    private __updateTimeHandler() {
        this._count--;
        if (this._count > 0) {
            this.leftTimeTxt.text = "(" + DateFormatter.getConsortiaCountDate(this._count) + ")";
        }
        else {
            this.leftTimeTxt.text = "";
            Laya.timer.clear(this, this.__updateTimeHandler);
        }
    }

    private updateTimeView() {
        let curTime: number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;//当前时间
        let endTime: number = this.playerModel.stateEndTime;//截止时间
        this._count = endTime - curTime;//剩余的秒数
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
        if(this._type== 1){
            this.hide();
        }else{
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

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel
    }

    private get outerCityModel(): OuterCityModel {
        return OuterCityManager.Instance.model;
    }

    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

    dispose(dispose?: boolean) {
        Laya.timer.clear(this, this.__updateTimeHandler);
        this._info = null;
        super.dispose(dispose);
    }
}