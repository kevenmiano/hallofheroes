import t_s_baseConfigData from "./t_s_baseConfigData";

export default class t_s_mapmine {
  public mDataList: t_s_mapmineData[];
  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_mapmineData(list[i]));
    }
  }
}

export class t_s_mapmineData extends t_s_baseConfigData {
  public ID: number;
  public Positionid: number; //对应t_s_mapphysicposition的ID
  public Grade: number; //Grade等级——矿的等级
  public TotalNum: number; //总数量——矿的总数量
  public ResourcesId: number; //资源ID——产出资源模板ID
  public ResourcesNumPerhour: number; //每小时数量——每小时产出资源数量
  public Heroes: string; //Heroes——触发PVE战斗的怪物配置（可为空）
  public Soldiers: string; //触发PVE战斗的怪物配置（可为空）
  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
