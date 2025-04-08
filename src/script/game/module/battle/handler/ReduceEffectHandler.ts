/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2024-01-03 11:14:26
 * @LastEditTime: 2024-01-03 17:59:03
 * @LastEditors: jeremy.xu
 * @Description: 提示：随时间增加，治疗及护盾实际效果降低，每45秒降低25%，最多100%
 */

import LangManager from "../../../../core/lang/LangManager";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { EmPackName } from "../../../constant/UIDefine";
import { BattleEvent } from "../../../constant/event/NotificationEvent";
import FUIHelper from "../../../utils/FUIHelper";
import BattleWnd from "../BattleWnd";


export class ReduceEffectHandler {
    private wnd: BattleWnd;
    private view: fgui.GComponent;
    constructor(wnd: BattleWnd) {
        this.wnd = wnd;

        if (!this.battleModel.isReduceEffect()) return;

        this.initView()
        this.addEvent()
    }

    private addEvent() {
        this.battleModel.addEventListener(BattleEvent.BATTLE_NOTICE, this.refresh, this);
    }

    private removeEvent() {
        this.battleModel.removeEventListener(BattleEvent.BATTLE_NOTICE, this.refresh, this);
    }

    private initView() {
        if (!this.view) {
            this.view = FUIHelper.createFUIInstance(EmPackName.Battle, "ReduceEffectView");
            this.wnd.getContentPane().addChild(this.view);
            this.view.setXY(this.wnd["topTipPos"].x, this.wnd["topTipPos"].y)
        }
        this.refresh()
    }

    private refresh() {
        let val = this.battleModel.battleDamageImprove
        if (val > 0) {
            this.view.visible = true;
            this.view.getChild("title").text = LangManager.Instance.GetTranslation("battle.reduceEffect.text", val);
        } else {
            this.view.visible = false;
        }
    }
    
    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public dispose() {
        this.removeEvent()
    }
}