import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_heroai
 */
export default class t_s_heroai {
  public mDataList: t_s_heroaiData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_heroaiData(list[i]));
    }
  }
}

export class t_s_heroaiData extends t_s_baseConfigData {
  //Id(编号)
  public Id: number;
  //Skills(技能库)
  public Skills: number[];
  //SkillMode(技能模式, 1为随机释放, 2为顺序释放)
  public SkillMode: number;
  //CrazyTurn(狂暴回合, 行动回合到了会进入狂暴模式, 会施放某个技能, 只能释放一次)
  public CrazyTurn: number;
  //CrazySkill(狂暴技能, 只能配置主动技能)
  public CrazySkill: number;
  //BottomHp(底力血量, 血量到了某个百分比后, 施放某个技能, 只能释放一次, 并改变攻击模式与技能库)
  public BottomHp: number;
  //BottomSkill(底力技能, 血量达到底力血量时施放的技能ID, 只能配置主动技能)
  public BottomSkill: number;
  //BottomSkills(施放底力技能之后的技能库)
  public BottomSkills: number[];
  //BottomSkillMode(施放底力技能之后的技能模式)
  public BottomSkillMode: number;
  //AwakenSkill(召唤技能)
  public AwakenSkill: number;
  //AwakenNum(召唤数量)
  public AwakenNum: number;
  //Soldiers(召唤怪物的ID与站位)
  public Soldiers: string;
  //LessHp(危血血量)
  public LessHp: number;
  //LessHpSkill(危血技能)
  public LessHpSkill: number;
  //DeadSkill(死亡技能)
  public DeadSkill: number;
  //AngrySkill(愤怒技能)
  public AngrySkill: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private _skills: number[];
  public getSkills(): number[] {
    if (!this._skills) {
      this._skills = [];
      this.addSkillIds(this.Skills);
      this.addSkillId(this.CrazySkill);
      this.addSkillId(this.BottomSkill);
      this.addSkillIds(this.BottomSkills);
      this.addSkillId(this.DeadSkill);
      this.addSkillId(this.LessHpSkill);
      this.addSkillId(this.AngrySkill);
      this.addSkillId(this.AwakenSkill);
    }
    return this._skills;
  }
  private addSkillIds(ids: number[]) {
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      this.addSkillId(id);
    }
  }

  private addSkillId(id: number) {
    if (id != 0 && this._skills.indexOf(id) == -1) {
      this._skills.push(id);
    }
  }
}
