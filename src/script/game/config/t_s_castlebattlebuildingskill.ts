/*
 * @Author: jeremy.xu
 * @Date: 2023-11-10 15:28:31
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-24 11:34:44
 * @Description:
 */
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import t_s_baseConfigData from "./t_s_baseConfigData";
import { t_s_skilltemplateData } from "./t_s_skilltemplate";

/*
 * t_s_castlebattlebuildingskill
 */
export default class t_s_castlebattlebuildingskill {
  public mDataList: t_s_castlebattlebuildingskillData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_castlebattlebuildingskillData(list[i]));
    }
  }
}

export class t_s_castlebattlebuildingskillData extends t_s_baseConfigData {
  //主键，索引用
  public Id: number = 0;
  //对应城战建筑的id
  public BattleBuilding: number = 0;
  //激活技能等级（显示用）
  public ActiveSkillLevel: number = 0;
  //激活所需达到的对应值
  public ActiveConditionNum: number = 0;
  //激活技能的ID
  public ActiveSkillTemplate: number = 0;
  public getActiveSkillTemplate(): t_s_skilltemplateData {
    return ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      this.ActiveSkillTemplate,
    ) as t_s_skilltemplateData;
  }

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
