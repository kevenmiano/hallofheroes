import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_obtain 获得途径
*/
export default class t_s_obtain {
   public mDataList: t_s_obtainData[];

   public constructor(list: Object[]) {
      this.mDataList = [];
      for (let i in list) {
         this.mDataList.push(new t_s_obtainData(list[i]));
      }
   }
}

export class t_s_obtainData extends t_s_baseConfigData {
   //(属性Id)
   public ObtainId: number = 0;
   //(属性Key)
   public Type: number = 0;
   //(属性名称)
   protected Name: string = '';
   protected Name_en: string = "";
   protected Name_es: string = "";
   protected Name_fr: string = "";
   protected Name_pt: string = "";
   protected Name_tr: string = "";
   protected Name_zhcn: string = "";
   protected Name_zhtw: string = "";
   //(属性名称)
   public Param1: string = '';
   //(属性名称)
   public Param2: number = 0;

   constructor(data?: Object) {
      super();
      if (data) {
         for (let i in data) {
            this[i] = data[i];
         }
      }
   }

   private NameKey: string = "Name";
   public get NameLang(): string {
      let value = this.getKeyValue(this.getLangKey(this.NameKey));
      if (value) {
         return value;
      }
      return "";//return this.getKeyValue(this.NameKey);
   }


}
