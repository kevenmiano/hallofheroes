/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description :  特殊的技能105类.
 * 针对新手第一场站斗中释放大法时需在英雄脚下加蓄力效果的需求.
 **/

import { InheritIActionType } from "../../../constant/BattleDefine";
import { BattleManager } from "../../BattleManager";
import { BaseRoleView } from "../../view/roles/BaseRoleView";
import { CommonActionSkill } from "./CommonActionSkill";

export class SpecialActionSkill105 extends CommonActionSkill {
  public inheritType: InheritIActionType =
    InheritIActionType.SpecialActionSkill105;

  protected startRun() {
    this.addPrepareGas();
    super.startRun();
  }
  private addPrepareGas() {
    let heroView: BaseRoleView =
      BattleManager.Instance.battleMap.rolesDict[
        BattleManager.Instance.battleModel.selfHero.livingId
      ];
    heroView.addCollectionEffect();

    setTimeout(() => {
      heroView.removeCollectionEffect();
    }, 2000);
  }
}
