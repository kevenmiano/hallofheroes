import { DateFormatter } from "../../../core/utils/DateFormatter";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { AttackData } from "../data/AttackData";
import { SkillData } from "../data/SkillData";
import { SkillHandlerII } from "../handler/SkillHandlerII";
import { SkillProcessStrategy } from "../handler/SkillProcessStrategy";
import { BloodHelper } from "../skillsys/helper/BloodHelper";
import { BattleBaseTransaction } from "../transaction/BattleBaseTransaction";

export class TestBattleAttackTransaction extends BattleBaseTransaction {
  private _isFirstAttack: boolean = true;

  constructor() {
    super();
    return this;
  }

  public configure(msg: any) {
    if (this._isFirstAttack) {
      this._isFirstAttack = false;
    }

    var battleModel: BattleModel = BattleManager.Instance.battleModel;
    // if(battleModel && msg.battleId != battleModel.battleId){
    //     //如果不是同一场战斗.
    //     return;
    // }

    var skillData: SkillData = this.readSkill(msg);

    // skillData.buffers = SocketGameReader.readBufferII(msg);
    // skillData.awakens = SocketGameReader.readAwakenData(msg);
    if (skillData.awakens && skillData.awakens.length > 0) {
      battleModel.cacheAwakenRoles(skillData.awakens);
    }
    BloodHelper.processBlood(skillData);

    var skillHandler: SkillHandlerII = new SkillHandlerII(skillData);
    var skillStrategy: number = SkillProcessStrategy.processSynchronization(
      msg.frame,
      skillHandler.getSkill(),
    );
    skillData.processStrategy = skillStrategy;
    skillHandler.handler(); //对最后一个技能执行处理函数.
  }

  private readSkill(skillMsg: any): SkillData {
    var skillData: SkillData = this.readSkillData(skillMsg);
    if (skillData.skillId == 0) {
      skillData.skillId = -1;
    }
    return skillData;
  }

  private readSkillData(skillMsg: any): SkillData {
    var skillData: SkillData = new SkillData();
    skillData.skillId = skillMsg.orderId;
    skillData.fId = skillMsg.livingId;
    skillData.sp = skillMsg.sp;
    skillData.spAdded = skillMsg.spAdded;
    skillData.attackMillis = DateFormatter.parse(
      skillMsg.attackMillis,
      "YYYY-MM-DD hh:mm:ss",
    ).getTime();
    skillData.battleId = skillMsg.battleId;
    skillData.passive = skillMsg.isPassive;
    skillData.liftTime = skillMsg.execFrame;
    var vSize: number = skillMsg.damages.length;
    var ids: any[] = [];
    var tId: number = 0;
    var list: AttackData[] = [];
    // var damageMsg : DamageMsg;
    var damageMsg: any;

    for (var i: number = 0; i < vSize; i++) {
      damageMsg = skillMsg.damages[i];
      tId = damageMsg.livingId; //攻击对象
      var data: AttackData = new AttackData();
      data.bloodType = damageMsg.damageType;
      data.roleId = tId;
      data.damageValue = damageMsg.damageValue;
      data.displayBlood = damageMsg.damageValue;
      data.extraData = damageMsg.extraData;
      data.parry = damageMsg.parry;
      data.leftHp = damageMsg.leftValue;
      data.resistValue = damageMsg.resistValue;
      data.resistType = damageMsg.resistType;
      // for each(var drop:DropInfoMsg in damageMsg.dropInfos)
      // {
      //     data.dropList.push(drop);
      // }
      if (ids.indexOf(tId) == -1) {
        ids.push(tId);
      }
      list.push(data);
    }
    skillData.data = this.dataFormatConversion(ids, list);
    return skillData;
  }
  /**
   * 数据格式转换 一次攻击面向几个角色
   * @param id
   * @param ids
   * @param list
   * @return
   */
  private dataFormatConversion(ids: any[], list: any[]): any[] {
    var items: any[] = [];
    var attackTimes: number = list.length / ids.length;
    for (var i: number = 0; i < attackTimes; i++) {
      var item: any[] = [];
      for (var j: number = 0; j < ids.length; j++) {
        var data: AttackData = list[i + j * attackTimes] as AttackData;
        item.push(data);
      }
      items.push(item);
    }
    return items;
  }
}
