// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description   
 **/

import Logger from "../../../../core/logger/Logger";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { MovieClip } from "../../../component/MovieClip";
import { AnimationManager } from "../../../manager/AnimationManager";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";
import { BattleManager } from "../../BattleManager";
import { IQuickenEffect } from "../../quicken/IQuickenEffect";
import { BattleEffect } from "./BattleEffect";

export class MovieClipEffect extends BattleEffect implements IQuickenEffect {
    protected _movie: MovieClip = new MovieClip();

    constructor(effectName: string) {
        super();
        this.init(effectName)
    }

    public init(effectName: string) {
        super.init(effectName);
        if (!effectName) {
            return
        }

        let obj = BattleManager.Instance.resourceModel.getEffectMC(effectName);

        if (!obj) {
            return
        }

        // Logger.battle("战斗中特效创建: ", effectName, obj["cacheName"], obj["pos_leg"])
        this._movie.curCacheName = obj["cacheName"]
        this._movie.pos_leg = obj["pos_leg"]
        this._movie.name = obj["cacheName"]

        this.effectName = effectName

        if (BattleManager.Instance.quickenControl) {
            BattleManager.Instance.quickenControl.register(this);
        }
        // this._movie.soundTransform = SharedManager.Instance.getSkillSoundTransform();
        this._movie.addFrameScript(this.commitStop.bind(this));
        this.setSpeed(1000 / EnterFrameManager.FPS)

        if (BattleManager.Instance.quickenModel.speed > 1) {
            this.setSpeed(BattleManager.Instance.quickenModel.speed);
        }
    }

    public resume(): boolean {
        if (AnimationManager.Instance.getCache(this._movie.curCacheName)) {
            this._movie.gotoAndPlay(0, false, this._movie.curCacheName);
            return true;
        } else {
            Logger.battle("[MovieClipEffect]resume 未找到缓存的特效动画 直接执行完成回调", this.effectName)
            this.commitStop()
            return false;
        }
    }

    public getDisplayObject(): MovieClip {
        return this._movie;
    }

    public setSpeed(value: number) {
        this._movie.step = value;
    }

    public dispose() {
        if (BattleManager.Instance.quickenControl) {
            BattleManager.Instance.quickenControl.unregister(this);
        }
        this._movie.removeSelf();
        super.dispose();
    }
}