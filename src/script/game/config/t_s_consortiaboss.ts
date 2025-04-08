import LangManager from "../../core/lang/LangManager";
import AppellModel from "../module/appell/AppellModel";
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_consortiaboss
*/
export default class t_s_consortiaboss {
   public mDataList: t_s_consortiabossData[];

   public constructor(list: Object[]) {
      this.mDataList = [];
      for (let i in list) {
         this.mDataList.push(new t_s_consortiabossData(list[i]));
      }
   }
}

export class t_s_consortiabossData extends t_s_baseConfigData {
   public Level: number = 0;
   public HpPercent: number = 0;
   public AttackPercent: number = 0;
   public WinReward: string = "";
   public LostReward: string = "";
   public ATotal: number = 0;
   public ASection: number = 0;
   public BTotal: number = 0;
   public BSection: number = 0;
   public CTotal: number = 0;
   public CSection: number = 0;

   constructor(data?: Object) {
      super();
      if (data) {
         for (let i in data) {
            this[i] = data[i];
         }
      }
   }

}
