import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import ColorConstant from "../../../constant/ColorConstant";
import { EmOuterCityWarCastlePeriodType } from "../../../constant/OuterCityWarDefine";
import { NotificationEvent, OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { BaseCastle } from "../../../datas/template/BaseCastle";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import OutercityVehicleArmyView from "../../../map/campaign/view/physics/OutercityVehicleArmyView";
import { WildLand } from "../../../map/data/WildLand";
import { OuterCityMap } from "../../../map/outercity/OuterCityMap";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import { OuterCityMapCameraMediator } from "../../../mvc/mediator/OuterCityMapCameraMediator";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import { OuterCityWarModel } from "../../outercityWar/model/OuterCityWarModel";

/**
 * 城堡详情
 */
export default class OuterCityMapCastleTips extends BaseWindow {
    private _info: BaseCastle;
    public btnLookInfo: fgui.GButton;
    public btnGoto: fgui.GButton;
    public cityNameTxt: fgui.GTextField;
    public consortiaNameTxt: fgui.GTextField;
    public personCountTxt: fgui.GTextField;
    public statusTxt: fgui.GTextField;
    private _mapView: OuterCityMap;
    public _type: number = 0;
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
            if (this._info.tempInfo) {
                this.cityNameTxt.text = this._info.tempInfo.NameLang+ " " + LangManager.Instance.GetTranslation("public.level3",this._info.tempInfo.Grade);
            }

            if (this._info.uncontestable) {
                this.consortiaNameTxt.text = LangManager.Instance.GetTranslation("maze.MazeFrame.Order");
                this.personCountTxt.text = LangManager.Instance.GetTranslation("maze.MazeFrame.Order");
                this.statusTxt.text = BaseCastle.getCastleStateName(EmOuterCityWarCastlePeriodType.Peace);
                this.statusTxt.color = BaseCastle.getCastleStateColor(EmOuterCityWarCastlePeriodType.Peace);
            } else {
                if (this._info.defencerGuildName == "") {
                    this.consortiaNameTxt.text = LangManager.Instance.GetTranslation("maze.MazeFrame.Order");
                    this.consortiaNameTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
                    this.personCountTxt.text = LangManager.Instance.GetTranslation("public.diagonalSign", OuterCityWarModel.MaxDefenceCnt, OuterCityWarModel.MaxDefenceCnt);
                } else {
                    this.consortiaNameTxt.text = "<"+ this._info.defencerGuildName + ">";
                    if (this.outerCityModel.checkIsSameConsortiaByName(this._info.defencerGuildName)) {
                        this.consortiaNameTxt.color = ColorConstant.GREEN_COLOR;
                    } else {
                        this.consortiaNameTxt.color = ColorConstant.RED_COLOR;
                    }
                    this.personCountTxt.text = LangManager.Instance.GetTranslation("public.diagonalSign", this._info.defencerGuildCnt, OuterCityWarModel.MaxDefenceCnt);
                }
          
                this.statusTxt.text = BaseCastle.getCastleStateName(this._info.state);
                this.statusTxt.color = BaseCastle.getCastleStateColor(this._info.state);
            }
        }
    }

    private initEvent() {
        this.btnLookInfo.onClick(this, this.lookInfoHandler);
        this.btnGoto.onClick(this, this.btnGotoHandler);
        NotificationManager.Instance.addEventListener(OuterCityEvent.CASTLE_INFO, this.__castleInfo, this)
    }

    private removeEvent() {
        this.btnLookInfo.offClick(this, this.lookInfoHandler);
        this.btnGoto.offClick(this, this.btnGotoHandler);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.CASTLE_INFO, this.__castleInfo, this)
    }

    private __castleInfo() {
        this.initView();
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
        if(this._type == 1){
            this.hide()
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
        NotificationManager.Instance.dispatchEvent(NotificationEvent.CLOSE_OUTERCITY_MAP_WND);
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, this._info);
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.OUTERCITY_UNLOCK_WAR_FIGHT);
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.OUTERCITY_UNLOCK_VEHICLE_FIGHT);
        this.hide();
    }

    private get outerCityModel(): OuterCityModel {
        return OuterCityManager.Instance.model;
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