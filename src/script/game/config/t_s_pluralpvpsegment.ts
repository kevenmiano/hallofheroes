/*
 * t_s_pluralpvpsegment
 */
export default class t_s_pluralpvpsegment {
  public mDataList: t_s_pluralpvpsegmentData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_pluralpvpsegmentData(list[i]));
    }
  }
}

export class t_s_pluralpvpsegmentData {
  //ID(ID)
  public Id: number;
  //Giftbag(段位)
  public Segment: string;
  //Scoreinterval(分值区间)
  public Scoreinterval: string;
  //RewardShow(奖励)
  public RewardShow: string;

  public constructor(data: object) {
    for (let i in data) {
      this[i] = data[i];
    }
  }
}
