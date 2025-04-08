/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description
 **/

import AudioManager from "../../../../core/audio/AudioManager";
import ResMgr from "../../../../core/res/ResMgr";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { MovieClip } from "../../../component/MovieClip";
import { PathManager } from "../../../manager/PathManager";
import { SharedManager } from "../../../manager/SharedManager";
import { BattleEffect } from "./BattleEffect";

export class EffectContainer extends Laya.Sprite {
    /**
     *
     * @param effect
     * @param repeat -1为无限次
     */
    public addEffect(effect: BattleEffect, repeat: number = 1) {
        let currentRepeat: number = repeat;

        effect.callBackComplete.addListener(() => //当特效完成一个周期时
        {
            if (currentRepeat > 0) {
                currentRepeat -= 1;
            }
            if (currentRepeat <= 0) {
                this.removeEffect(effect)
            }
            else {
                effect.resume();
            }
        })

        if (!effect.resume()) {
            return;
        }

        let mc = effect.getDisplayObject() as MovieClip;
        if (mc.pos_leg) {
            mc.pivot(mc.pos_leg.x, mc.pos_leg.y)
        }
        let soundMaps = {};
        let fullEffectURL = '';
        if (effect && effect.effectName) {
            fullEffectURL = PathManager.solveSkillResPath(effect.effectName, true, true);
            let resJson = ResMgr.Instance.getRes(fullEffectURL)
            if (resJson && resJson.sound) {
                soundMaps = resJson.sound;
            }
        }
        for (let key in soundMaps) {
            if (soundMaps[key]) {
                mc.addFrameScript(parseInt(key), () => {
                    let fullFoldURL = PathManager.solveSkillSoundResPath(effect.effectName, true, true);
                    let soundUrl = fullFoldURL + soundMaps[key].replace(".mp3", ".wav");
                    AudioManager.Instance.playSound(soundUrl);
                })
            }
        }

        mc.addFrameScript(() => { effect.commitStop() })
        if (SharedManager.Instance.allowAttactedEffect) {
            this.addChild(mc);
        }
    }

    public removeEffect(effect: BattleEffect) {
        if (effect.getDisplayObject()) {
            effect.getDisplayObject().stop()
        }
        ObjectUtils.disposeObject(effect)
    }
}