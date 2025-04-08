import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { MapPhysics } from "../../../map/space/data/MapPhysics";


import { BaseCastle } from "../../../datas/template/BaseCastle";

import { EmWindow } from "../../../constant/UIDefine";

import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import TreasureInfo from "../../../map/data/TreasureInfo";
import { WildLand } from "../../../map/data/WildLand";
import { PosType } from "../../../map/space/constant/PosType";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import OutercityVehicleArmyView from "../../../map/campaign/view/physics/OutercityVehicleArmyView";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import StringHelper from "../../../../core/utils/StringHelper";

/**
 * @description 外城城堡和金矿, 宝藏矿脉tip菜单
 * @author yuanzhan.yu
 * @date 2021/12/1 16:36
 * @ver 1.0
 */
export class OuterCityCastleTips extends BaseWindow {
    public infoBtn: fgui.GButton;
    public gotoBtn: fgui.GButton;
    private _info: MapPhysics;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.initEvent();
    }

    private initData() {
        [this._info] = this.params;
    }

    private initEvent() {
        this.infoBtn.onClick(this, this.infoBtnHandler);
        this.gotoBtn.onClick(this, this.gotoBtnHandler);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE, this.updateVehicleView, this);
    }

    private removeEvent() {
        this.infoBtn.offClick(this, this.infoBtnHandler);
        this.gotoBtn.offClick(this, this.gotoBtnHandler);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE, this.updateVehicleView, this);
    }

    private updateVehicleView() {
        if(this._info instanceof WildLand){
            if(this._info.info.types == PosType.OUTERCITY_VEHICLE){
                let wildLand: WildLand = OuterCityManager.Instance.model.allVehicleNode.get(this._info.templateId);
                this._info = wildLand;
            }
        }
    }

    /**
     * 城堡详情
     */
    private infoBtnHandler() {
        if (this._info instanceof TreasureInfo) {
            FrameCtrlManager.Instance.open(EmWindow.OuterCityMapTreasureTips, this._info);
        } else if (this._info instanceof BaseCastle) {
            FrameCtrlManager.Instance.open(EmWindow.OuterCityMapCastleTips, this._info);
        } else if (this._info instanceof WildLand) {
            if (this._info.info.types == PosType.OUTERCITY_TREASURE) {
                FrameCtrlManager.Instance.open(EmWindow.OuterCityMapTreasureTips, this._info);
            } else if (this._info.info.types == PosType.OUTERCITY_VEHICLE) {
                FrameCtrlManager.Instance.open(EmWindow.OuterCityVehicleTips, this._info);
            } else {
                FrameCtrlManager.Instance.open(EmWindow.OuterCityMapMineTips, this._info);
            }
        }
        this.hide();
    }

    /**
     * 前往城堡
     */
    private gotoBtnHandler() {
        let selfVehicleView: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
        if(this._info.info.types == PosType.OUTERCITY_VEHICLE){//点击的是物资车
            let wildInfo:WildLand = <WildLand>this._info;
            if(StringHelper.isNullOrEmpty(wildInfo.info.occupyLeagueName)){//点击的是静态物资车
                if(selfVehicleView){//玩家自己处于物资车状态
                    if(selfVehicleView.wildInfo.templateId == wildInfo.templateId){//点击的是自己的物资车
                        FrameCtrlManager.Instance.open(EmWindow.OuterCityVehicleInfoWnd, this._info);
                        this.hide();
                    }else{//点击的是别人的物资车，提示玩家当前处于物资车状态，要先退出才能操作
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
                        this.hide();
                    }
                }else{//玩家是处于空闲状态，
                    if(OuterCityManager.Instance.model.checkTeamInFight(wildInfo)
                        ||OuterCityManager.Instance.model.checkCanAttackVehicle(wildInfo) ){//可攻击
                        NotificationManager.Instance.dispatchEvent(OuterCityEvent.OUTERCITY_LOCK_VEHICLE_FIGHT,this._info);
                    }else if(OuterCityManager.Instance.model.checkAllInFighting(wildInfo)){
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outercityVehicle.checkCanAttackVehicle.tips"));
                    }
                    else{//移动到固定的物资车点
                        NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, this._info);
                    }
                    this.hide();
                }
            }else{//点击的是动态物资车
                if(selfVehicleView){//玩家自己处于物资车状态
                    if(selfVehicleView.wildInfo.templateId == wildInfo.templateId){//点击的是自己的物资车
                        FrameCtrlManager.Instance.open(EmWindow.OuterCityVehicleInfoWnd, this._info);
                        this.hide();
                    }else{//提示玩家当前处于物资车状态，要先退出才能操作
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
                        this.hide();
                    }
                }else{//玩家是处于空闲状态，追踪移动的物资车
                    if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0){//如果没有公会，提示无法发动攻击
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityVehicleMediator.attackTips"));
                        this.hide();
                        return;
                    }
                    if(OuterCityManager.Instance.model.checkTeamInFight(wildInfo)
                        ||OuterCityManager.Instance.model.checkCanAttackVehicle(wildInfo) ){//可攻击
                        NotificationManager.Instance.dispatchEvent(OuterCityEvent.OUTERCITY_LOCK_VEHICLE_FIGHT,this._info);
                    }else if(OuterCityManager.Instance.model.checkAllInFighting(wildInfo)){
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("outercityVehicle.checkCanAttackVehicle.tips"));
                    }else{//移动到固定的物资车点
                        NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, this._info);
                    }
                    this.hide();
                }
            }

        }else{//点击的是其他
            if(selfVehicleView){//玩家处于物资车中
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
                this.hide();
                return;
            }
            NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, this._info);
        }
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
        this._info = null;
        super.dispose(dispose);
    }
}