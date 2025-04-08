// @ts-nocheck
import LangManager from "../../core/lang/LangManager";
import AppellModel from "../module/appell/AppellModel";
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_petequipattr 英灵装备部位属性表
*/
export default class t_s_attribute {
   public mDataList: t_s_attributeData[];

   public constructor(list: Object[]) {
      this.mDataList = [];
      for (let i in list) {
         this.mDataList.push(new t_s_attributeData(list[i]));
      }
   }
}

export class t_s_attributeData extends t_s_baseConfigData {
   //(属性Id)
   public AttributeId: number = 0;
   //(属性Key)
   public AttributeKey: string = '';
   //(属性名称)
   protected AttributeName: string = '';
   protected AttributeName_en: string = "";
   protected AttributeName_es: string = "";
   protected AttributeName_fr: string = "";
   protected AttributeName_pt: string = "";
   protected AttributeName_tr: string = "";
   protected AttributeName_zhcn: string = "";
   protected AttributeName_zhtw: string = "";

   constructor(data?: Object) {
      super();
      if (data) {
         for (let i in data) {
            this[i] = data[i];
         }
      }
   }


   private AttributeNameKey: string = "AttributeName";
   public get AttributeNameLang(): string {
      let value = this.getKeyValue(this.getLangKey(this.AttributeNameKey));
      if (value) {
         return value;
      }
      return "";//return this.getKeyValue(this.AttributeNameKey);
   }

}
