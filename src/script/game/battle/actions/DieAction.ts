// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 死亡 动作.
 **/

import Logger from "../../../core/logger/Logger";
import { ActionLabesType, BattleType, InheritRoleType } from "../../constant/BattleDefine";
import { BattleNotic } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { BattleManager } from "../BattleManager";
import { GameBaseAction } from "./GameBaseAction";
import { AnimationManager } from '../../manager/AnimationManager';
import { RoleActionSimplifyData } from "../data/RoleActionSimplifyData";
import ShaderMgr from "../../../core/shader/ShaderMgr";

export class DieAction extends GameBaseAction {
    private _timer: number = 0;
    private _isPawn: boolean = false;
    private timelineLite: TimelineLite;

    constructor($role) {
        super()
        this._currentRole = $role;
        this._isPawn = this._currentRole.inheritType == InheritRoleType.Pawn;
        this._currentRole.addAction(this, true);
    }

    public prepare() {
        if (!this._currentRole || this._currentRole.dying) {
            this.finished = true;
            return;
        }
        this._currentRole.dying = true;
        if (this._currentRole == BattleManager.Instance.battleModel.selfHero && BattleManager.Instance.battleModel.battleType != BattleType.REMOTE_PET_BATLE) {
            NotificationManager.Instance.sendNotification(BattleNotic.SKILL_ENABLE, false)
        }
        super.prepare()
    }

    public update() {
        if (this.finished) {
            return;
        }
        if (this._timer == 0) {
            let actionMovie = this._currentRole.actionMovie
            let mc = actionMovie.movie
            // Logger.battle("[DieAction]角色死亡" + this._currentRole.roleName + ", livingId:" + this._currentRole.livingId);
            if (this._isPawn || RoleActionSimplifyData.isSimplify(mc && mc.data && mc.data.urlPath)) {//士兵或简化动作的怪, 播放死亡特效
                if (this._currentRole && this._currentRole.view) {
                    // this._currentRole.action(ActionLabesType.STAND, null, null, 5, true);
                    this._currentRole.view.setRoleInfoViewVisible(false);
                }

                if (!this.checkCurMovieClip()) {
                    // this.actionOver();
                    ShaderMgr.Instance.MosaicDissolveTarget(mc).then(target => {
                        if (target) {
                            target.alpha = 1;
                            target.visible = false;
                        }
                        this.actionOver();
                    })
                    return;
                }
                this.actionOver();

                // TODO 先渐隐
                // Laya.Tween.to(mc, { alpha: 0 }, 1000, null, Laya.Handler.create(this, () => {
                //     mc.alpha = 1
                //     mc.visible = false
                //     this.actionOver();
                // }))
            } else {
                this._currentRole.action(ActionLabesType.DIE);
                if (!this.checkCurMovieClip()) {
                    this.actionOver();
                    return;
                }
                this._currentRole.actionMovieClip.addFrameScript(this.actionOver.bind(this))
            }
        }

        this._timer++;
    }

    private checkCurMovieClip(name?: string) {
        let actionMovie = this._currentRole.actionMovie
        let mc = actionMovie.movie
        if (!actionMovie || !mc) {
            return false;
        }

        if (!AnimationManager.Instance.getCache(mc.curCacheName)) {
            // Logger.battle("[DieAction]找不到动画 直接完成死亡动作回调", mc.curCacheName)
            return false;
        }
        return true
    }

    private actionComplete() {
        if (this.timelineLite) {
            this.timelineLite.clear();
            this.timelineLite = null;
        }
        this.actionOver();
    }

    public synchronization() {
        this._timer = 0;
        this.actionOver();
    }

    protected actionOver() {
        this._currentRole.cleanActions();
        this._currentRole.isLiving = false;
        this.finished = true;
    }
}
