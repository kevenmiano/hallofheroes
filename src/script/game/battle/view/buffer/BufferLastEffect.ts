// @ts-nocheck
import { TempleteManager } from "../../../manager/TempleteManager";
import { BattleManager } from "../../BattleManager";
import { BufferDamageData } from "../../data/BufferDamageData";
import { BaseRoleInfo } from "../../data/objects/BaseRoleInfo";
import { EffectContainer } from "../../skillsys/effect/EffectContainer";
import { t_s_skillbuffertemplateData } from '../../../config/t_s_skillbuffertemplate';
import { MovieClip } from "../../../component/MovieClip";
import { PathManager } from "../../../manager/PathManager";
import ResMgr from "../../../../core/res/ResMgr";
import Logger from "../../../../core/logger/Logger";
import { AnimationManager } from "../../../manager/AnimationManager";
import { BaseRoleView } from '../roles/BaseRoleView';

/**
* @author:pzlricky
* @data: 2021-05-17 19:52
* @description : 加在角色身上的持续的BUFFER效果.
*/
export default class BufferLastEffect {

    private _roleInfo: BaseRoleInfo;
    private _bufferDamageData: BufferDamageData;
    private _effectContainer: EffectContainer;
    private _effectName: string;
    private _effect: MovieClip = new MovieClip();

    private _interval: number
    private _destroyed: boolean;

    constructor(roleInfo: BaseRoleInfo,
        bufferData: BufferDamageData,
        effectContainer: EffectContainer, effectName: string) {
        this._roleInfo = roleInfo;
        this._bufferDamageData = bufferData;
        this._effectContainer = effectContainer;
        this._effectName = effectName;
    }
    public show() {
        this._destroyed = false;
        var bufferTempInfo: t_s_skillbuffertemplateData = TempleteManager.Instance.getSkillBuffTemplateByID(this._bufferDamageData.templateId);
        this._interval = bufferTempInfo.getLastEffectArr()[2];
        let posFlag = bufferTempInfo.getLastEffectArr()[1];
        let fullUrl = PathManager.solveSkillResPath(this._effectName, true, true);

        ResMgr.Instance.loadRes(fullUrl, (res) => {
            let cacheObj = BattleManager.Instance.resourceModel.getEffectMC(this._effectName);
            if (cacheObj) {
                let posLeg = cacheObj["pos_leg"]
                let cacheName = cacheObj["cacheName"]
                this._effect.curCacheName = cacheName;
                let mountPt: Laya.Point = this._roleInfo.getSpecialPos(posFlag);
                let basePt: Laya.Point = this._roleInfo.getSpecialPos(BaseRoleInfo.POS_LEG);
                let dstPtX = mountPt.x - basePt.x;
                let dstPtY = mountPt.y - basePt.y;
                if (posFlag == BaseRoleInfo.POS_HEAD) {
                    dstPtY += BaseRoleView.BUFFER_OFFSET_Y;
                }
                this._effect.pos(dstPtX, dstPtY);
                this._effect.mountPt = posFlag;
                if (posLeg) {
                    this._effect.pivot(posLeg.x, posLeg.y)
                }

                let cacheJson = AnimationManager.Instance.getCache(cacheName)
                let success
                if (!cacheJson) {
                    success = AnimationManager.Instance.createAnimation(res.meta.prefix, "", undefined, "", AnimationManager.BattleEffectFormatLen)
                }
                this._effectContainer.addChild(this._effect)
                this._effect.addFrameScript(this.movieEndFrameFun.bind(this));
                this.showOne();
            } else {
                Logger.battle("[BufferLastEffect]特效资源不存在", this._effectName)
            }
        });
    }

    private showOne() {
        this._effect.gotoAndPlay(0, true, this._effect.curCacheName);
        this._effect.visible = true;
    }

    private movieEndFrameFun() {
        if (!this._destroyed) {
            if (this._interval > 0) {
                this._effect.stop();
                this._effect.visible = false;
                this.startTimer();
            }
        }
    }

    private startTimer() {
        this.removeTimer();
        Laya.timer.once(this._interval * 40, this, this.onTimerComplete, null);
    }

    private onTimerComplete(event) {
        this.removeTimer();
        this.showOne();
    }

    private removeTimer() {
        Laya.timer.clear(this, this.onTimerComplete);
    }

    public get bufferData(): BufferDamageData {
        return this._bufferDamageData;
    }

    public dispose() {
        AnimationManager.Instance.clearAnimationByName(this._effect.curCacheName)
        ResMgr.Instance.releaseRes(PathManager.solveSkillResPath(this._effectName, true, true))

        this.removeTimer();
        this._effect.stop();
        this._effect.visible = false;
        this._destroyed = true;
    }
}