// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description 战斗效果
 **/

import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { Disposeable } from "../../../component/DisplayObject";
import { MovieClip } from "../../../component/MovieClip";
import { CallBacker } from "../../../utils/CallBacker";
import LogicObject from "../../../utils/LogicObject";

export class BattleEffect extends LogicObject implements Disposeable {

    public effectName: string = '';
    private _callBackComplete: CallBacker = new CallBacker(this);
    public get callBackComplete(): CallBacker {
        return this._callBackComplete;
    }

    public init(effectName: string) {
        this.effectName = effectName;
    }

    /**
    * 效果的现实对象
    * 为避免做代理, 操作effect显示对象须调用此方法
    */
    public getDisplayObject(): MovieClip {
        return null;
    }

    /**
    * 重新开始效果 
    */
    public resume(): boolean { return false }

    public remove() { }

    /**
    * 动画完成 
    */
    public commitStop() {
        this._callBackComplete && this._callBackComplete.dispatch();
    }

    public dispose() {
        super.dispose();
        this._callBackComplete && this._callBackComplete.removeAllListeners();
    }

}