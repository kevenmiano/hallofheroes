import FrameDataBase from "../../mvc/FrameDataBase";

/**
 * 技能编辑数据
 */
export class SkillEditData {
  job: number = 1; //职业id

  percent: number = 50; //血量比例

  defaultSkill: number = 107; //默认技能

  petId: number = 0; //英灵id

  normalSkill: string = ""; //常规技能

  specialSkill: string = ""; //特殊技能
}
