/*
* t_s_singlearenarewards
*/
export default class t_s_singlearenarewards {
    public mDataList: t_s_singlearenarewardsData[];

    public constructor(list: Object[]) {
           this.mDataList = [];
           for (let i in list) {
               this.mDataList.push(new t_s_singlearenarewardsData(list[i]));
          }
    }
}

export class t_s_singlearenarewardsData {
    //Id(Id)
    public Id: number;
    /**Type(1.积分；2累计胜场)*/
    public Type: number;
    //Property1
    public Property1: number;
    //RewardItemID1(奖励)
    public RewardItemID1: number;
    //RewardItemCount1(数量)
    public RewardItemCount1: number;
    //RewardItemID1(奖励)
    public RewardItemID2: number;
    //RewardItemCount1(数量)
    public RewardItemCount2: number;


    public constructor(data: Object) {
           for (let i in data) {
               this[i] = data[i];
          }
    }
}
