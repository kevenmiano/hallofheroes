// @ts-nocheck
import FUI_OutyardShowView from "../../../../../fui/Battle/FUI_OutyardShowView";
import LangManager from "../../../../core/lang/LangManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { BattleNotic, NotificationEvent } from "../../../constant/event/NotificationEvent";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import OutyardManager from "../../../manager/OutyardManager";

import StackHeadBattleDefenceMsg = com.road.yishi.proto.stackhead.StackHeadBattleDefenceMsg;
import StackHeadSeniorGeneralMsg = com.road.yishi.proto.stackhead.StackHeadSeniorGeneralMsg;
export default class OutyardShowView extends FUI_OutyardShowView {

    onConstruct() {
        super.onConstruct();
        this.addEvent();
    }

    private addEvent() {
        Laya.timer.loop(1000 / EnterFrameManager.FPS, this, this.__enterFrame);
        NotificationManager.Instance.addEventListener(NotificationEvent.OUTYARD_BATTLE_DEFENCE, this.__battleDefenceHandler, this);
        this.__battleDefenceHandler();
    }

    private removeEvent() {
        Laya.timer.clearAll(this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.OUTYARD_BATTLE_DEFENCE, this.__battleDefenceHandler, this);
    }

    private __battleDefenceHandler() {
        let _msg: StackHeadBattleDefenceMsg = OutyardManager.Instance.battleDefenceMsg;
        if (!_msg) return;
        let frame: number = Number((_msg.defenceArmyTotal - _msg.defenceArmyAlive) / _msg.defenceArmyTotal * 100);
        this.progress.value = frame;
        this.leftArmyTxt.text = LangManager.Instance.GetTranslation("outyard.OutyardShowView.leftArmyTxt.text", _msg.defenceArmyAlive);
        this.guildArmyTxt.text = LangManager.Instance.GetTranslation("outyard.OutyardShowView.guildArmyTxt.text", (100 - _msg.defenceProperty));
        let senior: StackHeadSeniorGeneralMsg;
        for (let i: number = 0; i < _msg.defenceSeniorGeneral.length; i++) {
            senior = _msg.defenceSeniorGeneral[i] as StackHeadSeniorGeneralMsg;
            if (senior.alive) {
                if (senior.inBattle) {
                    UIFilter.light(this["generalBmp" + senior.index]);
                } else {
                    UIFilter.normal(this["generalBmp" + senior.index]);
                }
            }
            else {
                UIFilter.gray(this["generalBmp" + senior.index]);
            }
        }
    }

    private __enterFrame() {
        if(!this.battleModel)return;
        let leftBlood: number = this.battleModel.getMyHeroLeftHp();
        let maxBoold: number = this.battleModel.selfHero.totalBloodA;
        let rightBlood: number = this.battleModel.armyInfoRight.getLeftHp();
        let precent: number = leftBlood / maxBoold;
        BattleManager.Instance.battleUIView.bottomBar.selfBloodView.updateHeroHp(precent, leftBlood, maxBoold)
        if (leftBlood <= 0 || rightBlood <= 0) {//自己死亡或者对方全部死亡, 让自己的技能不可用
            this.battleModel.isOver = true;
            NotificationManager.Instance.sendNotification(BattleNotic.FORCE_SKILL_ENABLE, false)
        }
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public dispose() {
        this.removeEvent();
        super.dispose();
    }
}