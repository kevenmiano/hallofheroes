// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { NotificationEvent, OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import OutercityVehicleArmyView from "../../../map/campaign/view/physics/OutercityVehicleArmyView";
import { OuterCityMap } from "../../../map/outercity/OuterCityMap";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import { OuterCityMapCameraMediator } from "../../../mvc/mediator/OuterCityMapCameraMediator";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";

export default class OuterCityMapPlayerTips extends BaseWindow {
    public btnLookInfo: fgui.GButton;
    public btnGoto: fgui.GButton;
    public userNameTxt: fgui.GTextField;
    public descTxt1: fgui.GTextField;
    public consortiaNameTxt: fgui.GTextField;
    public descTxt2: fgui.GTextField;
    public levelTxt: fgui.GTextField;
    public descTxt3: fgui.GTextField;
    public fightValueTxt: fgui.GTextField;
    private _baseArmy: BaseArmy;
    private _mapView: OuterCityMap;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.initEvent();
    }

    private initData() {
        this._mapView = OuterCityManager.Instance.mapView;
        [this._baseArmy] = this.params;
        this.descTxt1.text = LangManager.Instance.GetTranslation("public.consortia");
        this.descTxt2.text = LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.level");
        this.descTxt3.text = LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ap");
        this.userNameTxt.text = this._baseArmy.nickName;
        this.consortiaNameTxt.text = this._baseArmy.baseHero.consortiaName;
        this.levelTxt.text = this._baseArmy.baseHero.grades.toString();
        this.fightValueTxt.text = this._baseArmy.baseHero.fightingCapacity.toString();
    }

    private initEvent() {
        this.btnLookInfo.onClick(this, this.infoBtnHandler);
        this.btnGoto.onClick(this, this.gotoBtnHandler);
    }

    private removeEvent() {
        this.btnLookInfo.offClick(this, this.infoBtnHandler);
        this.btnGoto.offClick(this, this.gotoBtnHandler);
    }
    /**
     * 查看
     */
    private infoBtnHandler() {
        this._mapView.motionTo(new Laya.Point(this._baseArmy.armyView.x - StageReferance.stageWidth / 2, this._baseArmy.armyView.y - StageReferance.stageHeight / 2));
        NotificationManager.Instance.dispatchEvent(NotificationEvent.CLOSE_OUTERCITY_MAP_WND);
        OuterCityMapCameraMediator.lockMapCamera();
        this.hide();
    }
    /**
     * 前往
     */
    private gotoBtnHandler() {
        let self: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
        if(self){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
            this.hide();
        }
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, new Laya.Point(this._baseArmy.armyView.x, this._baseArmy.armyView.y));
        NotificationManager.Instance.dispatchEvent(NotificationEvent.CLOSE_OUTERCITY_MAP_WND);
        this.hide();
    }

    protected createModel() {
        super.createModel();
        this.modelMask.alpha = 0;
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._baseArmy = null;
        super.dispose(dispose);
    }
}