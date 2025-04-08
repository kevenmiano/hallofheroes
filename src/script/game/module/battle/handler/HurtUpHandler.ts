/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2024-01-03 11:14:26
 * @LastEditTime: 2024-03-21 11:15:03
 * @LastEditors: jeremy.xu
 * @Description: 提示：pvp伤害加深（废弃）、pvp战斗计时
 */

import LangManager from "../../../../core/lang/LangManager";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { HurtUpMode } from "../../../battle/mode/HurtUpMode";
import { BattleType } from "../../../constant/BattleDefine";
import { EmPackName } from "../../../constant/UIDefine";
import FUIHelper from "../../../utils/FUIHelper";
import BattleWnd from "../BattleWnd";


export class HurtUpHandler {
    private wnd: BattleWnd;
    private view: fgui.GComponent;
    private mode: HurtUpMode;
    private gHurtUp: fgui.GGroup;
    private gCownDown: fgui.GGroup;
    private txtHurtUpTime: fgui.GTextField;
    private txtHurtUp: fgui.GTextField;
    
    constructor(wnd: BattleWnd, mode: HurtUpMode) {
        this.wnd = wnd;
        this.mode = mode;

        if (this.battleModel.battleType != BattleType.BATTLE_MATCHING) return;

        this.initView()
        this.addEvent()
    }

    private addEvent() {
        this.mode.addEventListener(Laya.Event.CHANGE, this.refresh, this);
    }

    private removeEvent() {
        this.mode.removeEventListener(Laya.Event.CHANGE, this.refresh, this);
    }

    private initView() {
        if (!this.view) {
            this.view = FUIHelper.createFUIInstance(EmPackName.Battle, "HurtUpView");
            this.wnd.getContentPane().addChild(this.view);
            this.view.setXY(this.wnd["topTipPos"].x, this.wnd["topTipPos"].y);
            this.gHurtUp = this.view.getChild('gHurtUp').asGroup;
            this.gCownDown = this.view.getChild('gCownDown').asGroup;
            this.txtHurtUp = this.view.getChild('txtHurtUp').asTextField;
            this.txtHurtUpTime = this.view.getChild('txtHurtUpTime').asTextField;
        }
        this.refresh()
    }

    private refresh() {
        this.gHurtUp.visible = false
        this.gCownDown.visible = true
        if (this.mode.getDamageImprove() > 0) {
            this.gHurtUp.visible = true
            if (this.mode.battleType == BattleType.PET_PK) {
                this.txtHurtUp.text = LangManager.Instance.GetTranslation("battle.hurtUpTip.text2") + this.mode.getDamageImprove() + "%";
            } else {
                this.txtHurtUp.text = LangManager.Instance.GetTranslation("battle.hurtUpTip.text") + this.mode.getDamageImprove() + "%";
            }
        }

        this.txtHurtUpTime.text = this.mode.getTimeLeft() + ""
    }
    
    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public dispose() {
        this.removeEvent()
    }
}