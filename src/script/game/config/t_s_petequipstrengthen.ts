import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_petequipstrengthen 英灵装备部位强化等级表
*/
export default class t_s_petequipstrengthen {
   public mDataList: t_s_petequipstrengthenData[];

   public constructor(list: Object[]) {
      this.mDataList = [];
      for (let i in list) {
         this.mDataList.push(new t_s_petequipstrengthenData(list[i]));
      }
   }
}

export class t_s_petequipstrengthenData extends t_s_baseConfigData {
   //唯一Id
   public TemplateId: number = 0;
   //(强化等级)
   public StrengthenGrow: number = 0;
   //(强化消耗)
   public StrengthenConsume: number = 0;
   //(消耗黄金)
   public StrengthenGold: number = 0;
   //(强化独立概率(万分比))
   public Probability: number = 0;
   //分解返还比率
   public Resolveadd: number = 0;


   constructor(data?: Object) {
      super();
      if (data) {
         for (let i in data) {
            this[i] = data[i];
         }
      }
   }
}
