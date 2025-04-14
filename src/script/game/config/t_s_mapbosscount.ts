import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_mapbosscount
 */
export default class t_s_mapbosscount {
  public mDataList: t_s_mapbosscountData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_mapbosscountData(list[i]));
    }
  }
}

export class t_s_mapbosscountData extends t_s_baseConfigData {
  //MapId(地图ID)
  public MapId: number;
  //G1(固定普通怪数量)
  public G1: number;
  //G2(固定精英怪数量)
  public G2: number;
  //G3(固定BOSS怪数量)
  public G3: number;
  //R1(随机普通怪数量)
  public R1: number;
  //R2(随机精英怪数量)
  public R2: number;
  //R3(随机BOSS怪数量)
  public R3: number;

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }
}
