// @ts-nocheck
import { ArmyState } from "../../constant/ArmyState";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { MapSocketOuterManager } from "../../manager/MapSocketOuterManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { BaseArmyAiInfo } from "../../map/ai/BaseArmyAiInfo";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import Tiles from "../../map/space/constant/Tiles";
import { SearchPathHelper } from "../../utils/SearchPathHelper";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import LangManager from '../../../core/lang/LangManager';

/**
 *
 * 战场中追击玩家
 *
 */
export default class PvpWarFightMediator implements IMediator, IEnterFrame {
    protected _selfInfo: CampaignArmy;
    protected _targetInfo: CampaignArmy;
    // protected  _selectFlag : MovieClip;
    protected _container: Laya.Sprite;
    protected _count: number = 0;
    private _targetPoint: Laya.Point = new Laya.Point();
    private _mapId: number = 0;

    public register(target: any) {
        this._container = target as Laya.Sprite;
        this._mapId = CampaignManager.Instance.mapId;
        // this._selectFlag = ComponentFactory.Instance.creatCustomObject("asset.map.SelectTargetAsset");
        this._selfInfo = CampaignManager.Instance.mapModel.selfMemberData;
        NotificationManager.Instance.addEventListener(NotificationEvent.LOCK_PVP_WARFIGHT, this.__lockPvpWarFightHandler, this);
    }

    public unregister(target: any) {
        this.unLockWarFight();
        NotificationManager.Instance.removeEventListener(NotificationEvent.LOCK_PVP_WARFIGHT, this.__lockPvpWarFightHandler, this);
        this._container = null;
    }

    private __lockPvpWarFightHandler(data: CampaignArmy) {
        this._targetInfo = data;
        let armyView: any = CampaignManager.Instance.controller.getArmyView(this._targetInfo);
        if (this._targetInfo) {
            this.lockWarFight();
            this._targetPoint.x = armyView.x;
            this._targetPoint.y = armyView.y;
        } else {
            this.unLockWarFight();
        }
    }

    private lockWarFight() {
        if (!WorldBossHelper.checkPetLand(this._mapId)) {
            let armyView: any = CampaignManager.Instance.controller.getArmyView(this._targetInfo);
            // armyView.avatarView.addChildAt(this._selectFlag,0);
        }
        EnterFrameManager.Instance.registeEnterFrame(this);
        this._container.on(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);
    }

    private unLockWarFight() {
        // if (this._selectFlag && this._selectFlag.parent) this._selectFlag.parent.removeChild(this._selectFlag);
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        if (this._container) {
            this._container.off(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);
        }
    }

    private __onClickHandler(evt: MouseEvent) {
        let armyView: Object = CampaignManager.Instance.controller.getArmyView(this._targetInfo);
        if (this._targetInfo && evt.target == armyView) {
            return;
        }
        this._targetInfo = null;
        this.unLockWarFight();
    }

    public enterFrame() {
        if (!this._selfInfo) {
            this.unLockWarFight();
            return;
        }
        let armyView: any = CampaignManager.Instance.controller.getArmyView(this._targetInfo);
        let selfView: any = CampaignManager.Instance.controller.getArmyView(this._selfInfo);
        if (this._targetInfo && armyView) {
            if (this._targetInfo.online &&
                armyView.x != this._targetInfo.curPosX * Tiles.WIDTH &&
                armyView.y != this._targetInfo.curPosY * Tiles.HEIGHT) {
                this._targetPoint.x = armyView.x;
                this._targetPoint.y = armyView.y;
            }
            let vx: number = (selfView.x - this._targetPoint.x);
            let vy: number = (selfView.y - this._targetPoint.y);
            let leng: number = vx * vx + vy * vy;
            let cInfo: BaseArmyAiInfo = selfView.aiInfo;
            let walkOver: boolean;
            if (cInfo && cInfo.pathInfo) {
                walkOver = (cInfo.walkIndex == cInfo.pathInfo.length ? true : false);
            }
            if (leng < 10000 && this._targetInfo.online) {//正常
                this.sendAttack();
                this.unLockWarFight();
            } else if (walkOver && !this._targetInfo.online) {
                //玩家跑到后 目标下线
                this.unLockWarFight();
            } else if (this._count % 70 == 0 || walkOver) { //跟随目标
                this.searchPath(selfView.x, selfView.y, this._targetPoint.x, this._targetPoint.y);
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
    protected sendAttack() {
        let mapId: number = CampaignManager.Instance.mapModel.mapId;
        let msg: string;
        if (WorldBossHelper.checkPvp(mapId)) {
            MapSocketOuterManager.sendAttackInPvpMap(this._targetInfo.userId, this._targetInfo.baseHero.serviceName);
        }
        if (WorldBossHelper.checkPetLand(mapId) || WorldBossHelper.checkMineral(mapId)) {
            if (this._targetInfo.state == ArmyState.STATE_FIGHT) {
                msg = LangManager.Instance.GetTranslation("playermenu.command01");
                MessageTipManager.Instance.show(msg);
                return;
            }
            MapSocketOuterManager.sendAttackInPetLand(this._targetInfo.userId);
        }
    }

    /**
     * 寻路
     * @param startX
     * @param startY
     * @param endX
     * @param endY
     *
     */
    private searchPath(startX: number, startY: number, endX: number, endY: number) {
        let start: Laya.Point = CampaignManager.Instance.mapModel.getAroundWalkPoint(startX, startY);
        if (!start) {
            return;
        }
        let end: Laya.Point = CampaignManager.Instance.mapModel.getAroundWalkPoint(endX, endY);
        if (!end) {
            return;
        }
        let arr: Array<any> = SearchPathHelper.searchPath(new Laya.Point(start.x * 20, start.y * 20), new Laya.Point(end.x * 20, end.y * 20));
        if (!arr) {
            return;
        }
        let armyView: any = CampaignManager.Instance.controller.getArmyView(this._selfInfo);
        armyView.aiInfo.pathInfo = arr;
    }
}