import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { EmWindow } from "../../constant/UIDefine";
import { OuterCityEvent } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { ArmyManager } from "../../manager/ArmyManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import AIBaseInfo from "../../map/ai/AIBaseInfo";
import OutercityVehicleArmyView from "../../map/campaign/view/physics/OutercityVehicleArmyView";
import { WildLand } from "../../map/data/WildLand";
import { OuterCityArmyView } from "../../map/outercity/OuterCityArmyView";
import { BaseArmy } from "../../map/space/data/BaseArmy";
import { FrameCtrlManager } from "../FrameCtrlManager";

export default class OuterCityVehicleMediator implements IMediator, IEnterFrame {
    protected _selfInfo: BaseArmy;//自己信息
    protected _targetInfo: OutercityVehicleArmyView;//被锁定者信息
    protected _count: number = 0;
    private _wildInfo:WildLand;
    private _targetPoint: Laya.Point = new Laya.Point();
    private _hasWalk:boolean = false;

    public register(target: any) {
        this._selfInfo = OuterCityManager.Instance.model.getWorldArmyById(ArmyManager.Instance.army.id);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTERCITY_LOCK_VEHICLE_FIGHT, this.__lockWarFightHandler, this);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTERCITY_UNLOCK_VEHICLE_FIGHT, this.__unlockWarFightHandler, this);
    }

    public unregister(target: any) {
        this.unLockWarFight();
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTERCITY_LOCK_VEHICLE_FIGHT, this.__lockWarFightHandler, this);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTERCITY_UNLOCK_VEHICLE_FIGHT, this.__unlockWarFightHandler, this);
    }

    private __lockWarFightHandler(data: WildLand) {
        this._wildInfo = data;
        this._targetInfo = OuterCityManager.Instance.model.allVehicleViewDic.get(data.templateId);
       OuterCityManager.Instance.model.isWalkIng = true;
        if (this._targetInfo) {
            this.lockWarFight();
            this._targetPoint.x = data.movePosX * 20;
            this._targetPoint.y = data.movePosY * 20;
        }
    }

    private __unlockWarFightHandler() {
        this.unLockWarFight();
        
        this._hasWalk = false;
    }

    private lockWarFight() {
        EnterFrameManager.Instance.registeEnterFrame(this);
        if(this._targetInfo)this._targetInfo.setAttackVisible(true);
        this._hasWalk = false;
    }

    private unLockWarFight() {
        if(this._targetInfo)this._targetInfo.setAttackVisible(false);
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        this._hasWalk = false;
    }

    public enterFrame() {
        if (!this._selfInfo) {
            this.unLockWarFight();
            return;
        }
        let armyView: OutercityVehicleArmyView = this._targetInfo
        let selfView: OuterCityArmyView = this._selfInfo.armyView as OuterCityArmyView;
        if (this._targetInfo && armyView) {
            let vx: number = (selfView.x - this._targetInfo.x);
            let vy: number = (selfView.y - this._targetInfo.y);
            let leng: number = vx * vx + vy * vy;
            let str = this._targetInfo.wildInfo.info.occupyLeagueName;
            if (str != "") {//追求目标有公会占领
                if (OuterCityManager.Instance.model.checkIsSameConsortiaByName(str)) {//同工会的
                    if (leng < 10000) {
                        this.unLockWarFight();
                        FrameCtrlManager.Instance.open(EmWindow.OuterCityVehicleInfoWnd, this._targetInfo.wildInfo);
                    } else if (this._targetInfo.wildInfo.status == 2) {
                        this.unLockWarFight();
                    }
                    else if (this._count % 70 == 0 || !this._hasWalk) { //跟随目标
                        this.searchPath(selfView, armyView);
                    }
                } else {//不同公会的
                    if (leng < 10000) {//正常
                        this.unLockWarFight();
                        if(OuterCityManager.Instance.model.checkTeamInFight(this._wildInfo)
                            ||OuterCityManager.Instance.model.checkCanAttackVehicle(this._wildInfo)){
                                this.sendAttack();//攻击
                        }else{
                            FrameCtrlManager.Instance.open(EmWindow.OuterCityVehicleInfoWnd, this._wildInfo);
                        }
                        
                    } else if (this._targetInfo.wildInfo.status == 2) {
                        this.unLockWarFight();
                    }
                    else if (this._count % 70 == 0 || !this._hasWalk) { //跟随目标
                        this.searchPath(selfView, armyView);
                    }
                }
            } else {//没有公会占领
                if (leng < 10000) {
                    this.unLockWarFight();
                    if(OuterCityManager.Instance.model.checkTeamInFight(this._wildInfo)
                        ||OuterCityManager.Instance.model.checkCanAttackVehicle(this._wildInfo)){
                        this.unLockWarFight();
                        this.sendAttack();//攻击
                    }else{
                        FrameCtrlManager.Instance.open(EmWindow.OuterCityVehicleInfoWnd, this._targetInfo.wildInfo);
                    }
                } else if (this._targetInfo.wildInfo.status == 2) {
                    this.unLockWarFight();
                }
                else if (this._count % 70 == 0 || !this._hasWalk) { //跟随目标
                    this.searchPath(selfView, armyView);
                }
            }
            this._count++;
        } else {
            this.unLockWarFight();
        }
    }

    /**
     * 发起攻击
     *
     */
    private sendAttack() {
        OuterCityManager.Instance.vehicleAttck(this._targetInfo.wildInfo.templateId);
        OuterCityManager.Instance.model.isWalkIng = false;
    }

    /**
     * 寻路
     * @param startX
     * @param startY
     * @param endX
     * @param endY
     *
     */
    private searchPath(selfArmy: OuterCityArmyView, targertArmy: OutercityVehicleArmyView) {
        let endPoint = new Laya.Point(targertArmy.x, targertArmy.y);
        let curr: Laya.Point = new Laya.Point(selfArmy.x, selfArmy.y);
        let paths;
        if (OuterCityManager.Instance.model.isFlying(ArmyManager.Instance.army.mountTemplateId)) {
            paths = [curr, endPoint];
        } else {
            paths = OuterCityManager.Instance.mapView.worldWalkLayer.pathScene.searchPath(curr, endPoint);
        }
        this._hasWalk = true;
        (this._selfInfo.armyView as OuterCityArmyView).info.pathInfo = paths;
    }
}