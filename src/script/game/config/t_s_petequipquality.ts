// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_petequipsuit 英灵装备部位品质表
*/
export default class t_s_petequipquality {
   public mDataList: t_s_petequipqualityData[];

   public constructor(list: Object[]) {
      this.mDataList = [];
      for (let i in list) {
         this.mDataList.push(new t_s_petequipqualityData(list[i]));
      }
   }
}

export class t_s_petequipqualityData extends t_s_baseConfigData {
   //(主键Id)
   public TemplateId: number = 0;
   //(品质池)
   public Profile: number = 0;
   //(初始主属性数量)
   public MasterAttrNum: number = 0;
   //(初始副属性数量)
   public SonAttrNum: number = 0;
   //(副属性强化开放)
   public SonAttrOpen: string = '';
   //(强化上限)
   public StrengMax: number = 0;
   //(强化到*级时随机提升1条副属性)
   public SonAttrStreng: string = '';

   constructor(data?: Object) {
      super();
      if (data) {
         for (let i in data) {
            this[i] = data[i];
         }
      }
   }

}
