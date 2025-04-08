// @ts-nocheck
import { OuterCityEvent } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { ArmyManager } from "../../manager/ArmyManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { OuterCitySocketOutManager } from "../../manager/OuterCitySocketOutManager";
import AIBaseInfo from "../../map/ai/AIBaseInfo";
import { OuterCityArmyView } from "../../map/outercity/OuterCityArmyView";
import { GetWalkStartPointHelper } from "../../map/outercity/utils/GetWalkStartPointHelper";
import Tiles from "../../map/space/constant/Tiles";
import { BaseArmy } from "../../map/space/data/BaseArmy";
/**
 * 外城pk, 追击玩家
 */
export default class OuterCityWarFightMediator implements IMediator, IEnterFrame {
    protected _selfInfo: BaseArmy;//自己信息
    protected _targetInfo: BaseArmy;//被锁定者信息
    protected _count: number = 0;
    private _targetPoint: Laya.Point = new Laya.Point();

    public register(target: any) {
        this._selfInfo = OuterCityManager.Instance.model.getWorldArmyById(ArmyManager.Instance.army.id);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTERCITY_LOCK_WAR_FIGHT, this.__lockWarFightHandler, this);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTERCITY_UNLOCK_WAR_FIGHT, this.__unlockWarFightHandler, this);
    }

    public unregister(target: any) {
        this.unLockWarFight();
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTERCITY_LOCK_WAR_FIGHT, this.__lockWarFightHandler, this);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTERCITY_UNLOCK_WAR_FIGHT, this.__unlockWarFightHandler, this);
    }

    private __lockWarFightHandler(data: BaseArmy) {
        this._targetInfo = data;
        if (this._targetInfo) {
            this.lockWarFight();
            this._targetPoint.x = data.armyView.x;
            this._targetPoint.y = data.armyView.y;
        } 
    }

    private __unlockWarFightHandler(){
        this.unLockWarFight();
    }

    private lockWarFight() {
        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    private unLockWarFight() {
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }

    public enterFrame() {
        if (!this._selfInfo) {
            this.unLockWarFight();
            return;
        }
        let armyView: OuterCityArmyView = this._targetInfo.armyView as OuterCityArmyView;
        let selfView: OuterCityArmyView = this._selfInfo.armyView as OuterCityArmyView;
        if (this._targetInfo && armyView) {
            if (this._targetInfo.baseHero.isOnline &&
                armyView.x != this._targetInfo.curPosX * Tiles.WIDTH &&
                armyView.y != this._targetInfo.curPosY * Tiles.HEIGHT) {
                this._targetPoint.x = armyView.x;
                this._targetPoint.y = armyView.y;
            }
            let vx: number = (selfView.x - this._targetPoint.x);
            let vy: number = (selfView.y - this._targetPoint.y);
            let leng: number = vx * vx + vy * vy;
            let cInfo: AIBaseInfo = selfView.info;
            let walkOver: boolean;
            if (cInfo && cInfo.pathInfo) {
                walkOver = (cInfo.walkIndex == cInfo.pathInfo.length ? true : false);
            }
            if (leng < 10000 && this._targetInfo.baseHero.isOnline) {//正常
                this.unLockWarFight();
                this.sendAttack();
            } else if (walkOver && !this._targetInfo.baseHero.isOnline) {
                //玩家跑到后 目标下线
                this.unLockWarFight();
            } else if (this._count % 70 == 0 || walkOver) { //跟随目标
                this.searchPath(selfView, armyView);
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
        OuterCitySocketOutManager.sendAttackPerson(this._targetInfo.baseHero.userId);
    }

    /**
     * 寻路
     * @param startX
     * @param startY
     * @param endX
     * @param endY
     *
     */
    private searchPath(selfArmy: OuterCityArmyView, targertArmy: OuterCityArmyView) {
        let endPoint = new Laya.Point(targertArmy.x, targertArmy.y + 40);
        let curr: Laya.Point = new Laya.Point(selfArmy.x, selfArmy.y);
        let paths = OuterCityManager.Instance.mapView.worldWalkLayer.pathScene.searchPath(curr, endPoint);
        (this._selfInfo.armyView as OuterCityArmyView).info.pathInfo = paths;
    }
}