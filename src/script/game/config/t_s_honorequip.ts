// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_petequipattr 英灵装备部位属性表
*/
export default class t_s_honorequip {
   public mDataList: t_s_honorequipData[];

   public constructor(list: Object[]) {
      this.mDataList = [];
      for (let i in list) {
         this.mDataList.push(new t_s_honorequipData(list[i]));
      }
   }
}

export class t_s_honorequipData extends t_s_baseConfigData {
   //(属性Id)
   public TemplateId: number = 0;
   //(属性Key)
   public UpgradeType: number = 0;
   //(属性名称)
   protected Honorequipname: string = '';
   protected Honorequipname_en: string = "";
   protected Honorequipname_es: string = "";
   protected Honorequipname_fr: string = "";
   protected Honorequipname_pt: string = "";
   protected Honorequipname_tr: string = "";
   protected Honorequipname_zhcn: string = "";
   protected Honorequipname_zhtw: string = "";
   //(属性名称)
   public Icon: string = '';
   //(属性名称)
   public Level: number = 0;
   //(属性名称)
   public ConsumeMedal: number = 0;
   //(属性名称)
   public ConsumeGold: number = 0;
   //(属性名称)
   public Honor: number = 0;
   //(属性名称)
   public Agility: number = 0;
   //(属性名称)
   public Attack: number = 0;
   //(属性名称)
   public Captain: number = 0;
   //(属性名称)
   public Conat: number = 0;
   //(属性名称)
   public Defence: number = 0;
   //(属性名称)
   public ForceHit: number = 0;
   //(属性名称)
   public Intellect: number = 0;
   //(属性名称)
   public Live: number = 0;
   //(属性名称)
   public MagicAttack: number = 0;
   //(属性名称)
   public MagicDefence: number = 0;
   //(属性名称)
   public Parry: number = 0;
   //(属性名称)
   public Physique: number = 0;
   //(属性名称)
   public Power: number = 0;
   //(属性名称)
   public Strength: number = 0;
   //(属性名称)
   public Tenacity: number = 0;

   constructor(data?: Object) {
      super();
      if (data) {
         for (let i in data) {
            this[i] = data[i];
         }
      }
   }

   private HonorequipnameKey: string = "Honorequipname";
   public get HonorequipnameLang(): string {
      let value = this.getKeyValue(this.getLangKey(this.HonorequipnameKey));
      if (value) {
         return value;
      }
      return "";//return this.getKeyValue(this.HonorequipnameKey);
   }


}
