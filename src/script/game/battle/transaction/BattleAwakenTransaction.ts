/*
 * @Author: jeremy.xu
 * @Date: 2023-02-07 14:46:30
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 11:38:33
 * @Description:
 */
import { BattleBaseTransaction } from "./BattleBaseTransaction";
import { BattleModel } from "../BattleModel";
import { BattleManager } from "../BattleManager";
import { HeroRoleInfo } from "../data/objects/HeroRoleInfo";
import { NotificationManager } from "../../manager/NotificationManager";
import { BattleNotic } from "../../constant/event/NotificationEvent";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";

//@ts-expect-error: External dependencies
import AwakeMsg = com.road.yishi.proto.battle.AwakeMsg;
import Logger from "../../../core/logger/Logger";

/**
 * 更新战斗觉醒值
 * @author yuanzhan.yu
 */
export class BattleAwakenTransaction extends BattleBaseTransaction {
  constructor() {
    super();
  }

  public configure(param: object) {
    super.configure(param);
    if (!this._pkg) {
      return;
    }
    if (!this.battleModel) {
      return;
    }
    let msg: AwakeMsg = this._pkg.readBody(AwakeMsg) as AwakeMsg;

    let role: any; //BaseRoleInfo
    msg.awake.forEach((itemMsg, index, array) => {
      if (!itemMsg.livingId) {
        return;
      }
      role = this.battleModel.getRoleById(itemMsg.livingId);
      if (role && role instanceof HeroRoleInfo) {
        let hero: HeroRoleInfo = <HeroRoleInfo>role;
        hero.updateAwaken(itemMsg.awake);
        if (
          BattleManager.Instance.battleModel.selfHero == hero &&
          hero.awaken == 0 &&
          hero.isPetState
        ) {
          //自然降为0时 要灰掉
          NotificationManager.Instance.sendNotification(
            BattleNotic.SKILL_ENABLE,
            false,
          );
          Logger.battle(
            "更新觉醒值:" + hero.heroInfo.nickName + "add:+" + itemMsg.awake,
          );
        }
      }
    });
  }

  public getCode(): number {
    return S2CProtocol.U_C_UPDATE_AWAKE;
  }

  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }
}
