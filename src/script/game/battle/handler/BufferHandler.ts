/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description  buffer相关处理类.
 **/
import { BloodType, BufferProcessType } from "../../constant/BattleDefine";
import { BattleManager } from "../BattleManager";
import { AttackData } from "../data/AttackData";
import { BufferDamageData } from "../data/BufferDamageData";
import { DamageData } from "../data/DamageData";
import { HeroRoleInfo } from "../data/objects/HeroRoleInfo";
import { BattleUtils } from "../utils/BattleUtils";
import { BaseRoleView } from "../view/roles/BaseRoleView";
import Logger from "../../../core/logger/Logger";

//@ts-expect-error: External dependencies
import DropInfoMsg = com.road.yishi.proto.battle.DropInfoMsg;
export class BufferHandler {
  /**
   * 根据buffer的类别执行buffer的带来的效果相应的动作, 如DannyAction.
   *
   */
  public static bufferAffectAction(buffer: BufferDamageData) {
    let damageData: DamageData = buffer.damages[0] as DamageData;
    switch (buffer.AttackType) {
      case 2: //攻击a
      case 3: //防御.
      case 4: //敏捷.
      case 5: //精神.
      case 8: //DELAY.
      case 11: //物攻.
      case 12: //魔攻.
        break;
      case 6: //HP.
        BattleUtils.addSingleDanny([
          BufferHandler.convertDamageDataToAttackData(
            damageData,
            buffer.target,
          ),
        ]);
        break;
      case 7: //SP.
      case 9: //受到物伤(降低/提高)
      case 10: //受到魔伤(降低/提高)
      default:
        break;
    }
  }
  /**
   * 执行buffer伤害, 对应的角色执行伤害特效
   * @param bufferDataII
   * @param executerId
   * @param index
   *
   */
  private static bufferAffectActionII(
    bufferDataII: BufferDamageData,
    executerId: number,
    index: number = 0,
  ) {
    BufferHandler.addDanny(bufferDataII, executerId, index);

    let battleMap = BattleManager.Instance.battleMap;
    if (!battleMap) return;

    if (battleMap.rolesDict) {
      let roleView = battleMap.rolesDict[bufferDataII.target] as BaseRoleView;
      if (roleView) {
        roleView.addBufferActionEffect(bufferDataII.templateId);
      }
    }
  }
  /**
   * 添加buffer伤害到对应的伤害次数播放
   * @param bufferDataII
   * @param executerId
   * @param index
   *
   */
  private static addDanny(
    bufferDataII: BufferDamageData,
    executerId: number,
    index: number = 0,
  ) {
    let damage: DamageData;
    let attackData: AttackData;
    let roleInfo: HeroRoleInfo;
    if (bufferDataII.damages && bufferDataII.damages.length > index) {
      damage = bufferDataII.getDamageByDannyCount(index);
      if (!damage) return;
      attackData = BufferHandler.convertDamageDataToAttackData(
        damage,
        bufferDataII.target,
      );

      let battleModel = BattleManager.Instance.battleModel;
      let role = battleModel.getRoleById(attackData.roleId);
      if (role) {
        Logger.battle(
          `[BufferHandler]对${role.roleName}(${attackData.roleId})产生buff数值${attackData.damageValue}<${bufferDataII.buffName}>`,
        );
      }

      if (attackData.bloodType == BloodType.BLOOD_TYPE_SP) {
        if (executerId != attackData.roleId) {
          roleInfo = battleModel.getRoleById(attackData.roleId) as HeroRoleInfo;
          if (roleInfo && roleInfo.updateSp) {
            roleInfo.updateSp(
              roleInfo.sp + attackData.damageValue,
              false,
              false,
              true,
            );
          }
        }
      } else {
        BattleUtils.addSingleDanny(
          [attackData],
          12,
          true,
          0,
          0,
          6,
          false,
          0x666666,
          false,
        );
      }
    }
  }
  /**
   * 移除角色身上的buffer
   * @param bufferDataII
   *
   */
  private static removeBufferII(bufferDataII: BufferDamageData) {
    if (
      BattleManager.Instance.battleMap.rolesDict &&
      BattleManager.Instance.battleMap.rolesDict[bufferDataII.target]
    ) {
      let roleView: BaseRoleView = BattleManager.Instance.battleMap.rolesDict[
        bufferDataII.target
      ] as BaseRoleView;
      if (roleView) {
        roleView.removeBuffer(bufferDataII.templateId, bufferDataII.id);
      }
    }
  }

  /**
   * 将 DamageData转换为AttackData
   * @param damageData
   * @param roleId
   * @return
   *
   */
  private static convertDamageDataToAttackData(
    damageData: DamageData,
    roleId: number,
  ): AttackData {
    let attackData: AttackData = new AttackData();
    attackData.bloodType = damageData.bloodType;
    attackData.damageValue = damageData.damageValue;
    attackData.displayBlood = damageData.displayBlood;
    attackData.roleId = damageData.target; //roleId
    attackData.leftHp = damageData.leftValue;
    attackData.hpMaxAdd = damageData.hpMaxAdd;
    for (let i: number = 0; i < damageData.dropList.length; i++) {
      let drop: DropInfoMsg = damageData.dropList[i];
      attackData.dropList.push(drop);
    }
    return attackData;
  }
  /**
   *
   * @param buffer
   * @param executerId 执行Id(即受着id)
   * @param index
   *
   */
  public static excuteCount: number = 0;
  public static processBuffer(
    buffer: BufferDamageData,
    executerId: number,
    index: number = 0,
  ) {
    if (Logger.openBattleBuffCon(buffer)) {
      Logger.battle(
        "XXX[BaseRoleInfo]processBuffer 处理buff:",
        buffer.fRoleName,
        buffer.buffName,
        buffer.processType,
        index,
        executerId,
        buffer.id,
      );
    }
    BufferHandler.excuteCount++;

    let battleModel = BattleManager.Instance.battleModel;
    if (!battleModel) return;
    let roleInfo = battleModel.getRoleById(buffer.target);
    if (
      buffer.processType == BufferProcessType.REMOVE ||
      buffer.currentTurn == 0
    ) {
      BufferHandler.removeBufferII(buffer);
      BufferHandler.addDanny(buffer, executerId, index);

      if (roleInfo && Logger.openBattleBuffCon(buffer)) {
        Logger.battle(
          `XXX[BufferHandler]移除${roleInfo.roleName}(${roleInfo.livingId})的buff<${buffer.buffName}>`,
          buffer,
        );
      }
      return;
    }

    if (!roleInfo) return;
    if (buffer.processType == BufferProcessType.ADD) {
      roleInfo.addBuffer(buffer);
      if (buffer.damages && buffer.damages.length > 0) {
        roleInfo.refreshBufferTurnForDanny(buffer);
      }
    } else {
      roleInfo.refreshBufferTurnForDanny(buffer);
    }
    roleInfo.refreshBuffer(buffer);
    BufferHandler.bufferAffectActionII(buffer, executerId, index);
  }
}
